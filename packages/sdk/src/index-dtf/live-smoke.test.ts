import { decodeFunctionData, formatUnits, parseEther, zeroAddress, type Address } from "viem";
import { describe, expect, it } from "vitest";

import type { GovernanceAuthority } from "@/types/common";
import type { IndexDtf, IndexDtfBasketWithPrice } from "@/types/index-dtf";

import { createDtfSdk } from "@/create-dtf-sdk";
import { indexDtfDeployerAbi } from "@/index-dtf/abis/deployer";
import { dtfIndexGovernanceAbi } from "@/index-dtf/abis/dtf-index-governance";
import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";
import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { timelockAbi } from "@/index-dtf/abis/timelock";
import { DEFAULT_INDEX_DTF_DEPLOY_FLAGS } from "@/index-dtf/deploy/index";

const BASE_CHAIN_ID = 8453;
const SMOKE_ACCOUNT = "0x000000000000000000000000000000000000dEaD";
const SMOKE_ROLE_ACCOUNT = "0x0000000000000000000000000000000000000001";
const SMOKE_NONCE = "0x0000000000000000000000000000000000000000000000000000000000000042";
const SUPPORTED_WRITE_VERSIONS = ["5.0.0", "6.0.0"] as const;

const CASES = [
  {
    label: "optimistic governance DTF",
    address: "0xd45e4170834a803d084b2bb145c9ad08f3bdd651",
    expectsOptimisticGovernance: true,
    minimumBasketAssets: 1,
    expectsVoteLockDao: false,
  },
  {
    label: "LCAP normal governance",
    address: "0x4da9a0f397db1397902070f93a4d6ddbc0e0e6e8",
    expectsOptimisticGovernance: false,
    minimumBasketAssets: 2,
    expectsVoteLockDao: true,
  },
] as const;

const runLiveSmoke = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env
  ?.RUN_INDEX_DTF_SMOKE === "1";
const smokeDescribe = runLiveSmoke ? describe : describe.skip;

type SmokeCase = (typeof CASES)[number];

type SmokeContext = {
  readonly dtf: IndexDtf;
  readonly full: Awaited<ReturnType<ReturnType<typeof createDtfSdk>["index"]["get"]>>;
  readonly basket: IndexDtfBasketWithPrice;
  readonly version: (typeof SUPPORTED_WRITE_VERSIONS)[number];
};

smokeDescribe("Index DTF live smoke", () => {
  const sdk = createDtfSdk();
  const contexts = new Map<string, Promise<SmokeContext>>();

  for (const smokeCase of CASES) {
    it(
      `${smokeCase.label}: reads core DTF, market, basket, status, and history surfaces`,
      async () => {
        const context = await getContext(smokeCase);
        const { dtf, full, basket } = context;
        const [totalAssets, totalSupply, price, batchPrices, snapshot, status, holders, transactions, history] =
          await Promise.all([
            sdk.index.getTotalAssets({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
            sdk.index.getTotalSupply({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
            sdk.index.getPrice({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
            sdk.index.getPrices({ chainId: BASE_CHAIN_ID, addresses: [smokeCase.address] }),
            sdk.index.getBasketSnapshot({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
            sdk.index.getStatus({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
            sdk.index.getHolders({ address: smokeCase.address, chainId: BASE_CHAIN_ID, limit: 10 }),
            sdk.index.getTransactions({ address: smokeCase.address, chainId: BASE_CHAIN_ID, limit: 5, dtfPriceUsd: full.market.price }),
            sdk.index.getPriceHistory({
              address: smokeCase.address,
              chainId: BASE_CHAIN_ID,
              from: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60,
              to: Math.floor(Date.now() / 1000),
              interval: "1d",
            }),
          ]);

        expect(dtf.id.toLowerCase()).toBe(smokeCase.address.toLowerCase());
        expect(full.market.price).toBeGreaterThan(0);
        expect(Object.keys(full.basket).length).toBeGreaterThanOrEqual(smokeCase.minimumBasketAssets);
        expect(Object.keys(basket.basket).length).toBe(Object.keys(full.basket).length);
        expect(totalAssets.tokens.length).toBe(Object.keys(full.basket).length);
        expect(totalSupply).toBeGreaterThan(0n);
        expect(price.price).toBeGreaterThan(0);
        expect(batchPrices[0]?.price).toBeGreaterThan(0);
        expect(snapshot.price).toBeGreaterThan(0);
        expect(["active", "deprecated", "unsupported"]).toContain(status);
        expect(holders.totalSupply.raw).toBeGreaterThan(0n);
        expect(holders.holders.length).toBeGreaterThan(0);
        expect(Array.isArray(transactions)).toBe(true);
        expect(history.length).toBeGreaterThan(0);
      },
      180_000,
    );

    it(
      `${smokeCase.label}: reads governance, proposals, decoded calldatas, voters, and delegates`,
      async () => {
        const { dtf } = await getContext(smokeCase);
        const stToken = expectVoteLock(dtf);
        const governance = getCaseGovernance(dtf, smokeCase.expectsOptimisticGovernance);
        const [proposals, allProposals, delegates, guardians, legacyVoteLocks, voterState, proposerState] = await Promise.all([
          sdk.index.getProposals({ address: smokeCase.address, chainId: BASE_CHAIN_ID, limit: 5, includeOptimisticState: true }),
          sdk.index.getAllProposals({ chainId: BASE_CHAIN_ID, limit: 5, includeOptimisticState: true }),
          sdk.index.getDelegates({ chainId: BASE_CHAIN_ID, stToken, limit: 5 }),
          sdk.index.getGuardians({ dtf }),
          sdk.index.getLegacyVoteLocks({ dtf }),
          sdk.index.getVoterState({ chainId: BASE_CHAIN_ID, stToken, account: SMOKE_ACCOUNT }),
          sdk.index.getProposerState({ chainId: BASE_CHAIN_ID, governance: governance.address, account: SMOKE_ACCOUNT }),
        ]);

        expect(proposals.length).toBeGreaterThan(0);
        expect(allProposals.length).toBeGreaterThan(0);
        expect(delegates.length).toBeGreaterThan(0);
        expect(Array.isArray(guardians.all)).toBe(true);
        expect(Array.isArray(legacyVoteLocks)).toBe(true);
        expect(voterState.account).toBe(SMOKE_ACCOUNT);
        expect(proposerState.governance).toBe(governance.address);

        const detail = await sdk.index.getProposal({
          address: smokeCase.address,
          chainId: BASE_CHAIN_ID,
          proposalId: proposals[0]!.id,
        });
        const [proposalVotes, proposalVoterState] = await Promise.all([
          sdk.index.getProposalVotes({ chainId: BASE_CHAIN_ID, governance: detail.governance, proposalId: detail.id }),
          sdk.index.getProposalVoterState({
            chainId: BASE_CHAIN_ID,
            governance: detail.governance,
            account: SMOKE_ACCOUNT,
            proposal: detail,
          }),
        ]);

        expect(detail.targets.length).toBe(detail.calldatas.length);
        expect(detail.decoded.calls.length + detail.decoded.unknownCalls.length).toBe(detail.calldatas.length);
        expect(proposalVotes.forVotes.raw + proposalVotes.againstVotes.raw + proposalVotes.abstainVotes.raw).toBeGreaterThanOrEqual(0n);
        expect(proposalVoterState.account).toBe(SMOKE_ACCOUNT);

        const vote = sdk.index.prepareVote({ chainId: BASE_CHAIN_ID, governance: detail.governance, proposalId: detail.id, support: 1 });
        const voteWithReason = sdk.index.prepareVoteWithReason({
          chainId: BASE_CHAIN_ID,
          governance: detail.governance,
          proposalId: detail.id,
          support: 1,
          reason: "smoke",
        });
        const voteWithParams = sdk.index.prepareVoteWithReasonAndParams({
          chainId: BASE_CHAIN_ID,
          governance: detail.governance,
          proposalId: detail.id,
          support: 1,
          reason: "smoke",
          voteParams: "0x",
        });
        const queue = sdk.index.prepareQueueProposal({ chainId: BASE_CHAIN_ID, proposal: detail });
        const execute = sdk.index.prepareExecuteProposal({ chainId: BASE_CHAIN_ID, proposal: detail });
        const cancel = sdk.index.prepareGovernorCancelProposal({ chainId: BASE_CHAIN_ID, proposal: detail });

        expect(decodeFunctionData({ abi: dtfIndexGovernanceAbi, data: vote.data }).functionName).toBe("castVote");
        expect(decodeFunctionData({ abi: dtfIndexGovernanceAbi, data: voteWithReason.data }).functionName).toBe("castVoteWithReason");
        expect(decodeFunctionData({ abi: dtfIndexGovernanceAbi, data: voteWithParams.data }).functionName).toBe("castVoteWithReasonAndParams");
        expect(decodeFunctionData({ abi: dtfIndexGovernanceAbi, data: queue.data }).functionName).toBe("queue");
        expect(decodeFunctionData({ abi: dtfIndexGovernanceAbi, data: execute.data }).functionName).toBe("execute");
        expect(decodeFunctionData({ abi: dtfIndexGovernanceAbi, data: cancel.data }).functionName).toBe("cancel");
      },
      180_000,
    );

    it(
      `${smokeCase.label}: validates optimistic governance expectations`,
      async () => {
        const { dtf } = await getContext(smokeCase);
        const optimisticGovernances = getGovernanceAuthorities(dtf).filter((authority) => authority.governance.isOptimistic);

        if (!smokeCase.expectsOptimisticGovernance) {
          expect(optimisticGovernances).toHaveLength(0);
          return;
        }

        expect(optimisticGovernances.length).toBeGreaterThan(0);
        const governance = optimisticGovernances[0]!;
        const optimistic = await sdk.index.getOptimisticGovernance({ chainId: BASE_CHAIN_ID, governance: governance.address });

        expect(optimistic.governance).toBe(governance.address);
        expect(optimistic.selectorRegistry.toLowerCase()).not.toBe(zeroAddress);
        expect(optimistic.optimisticParams.vetoThreshold).toBeGreaterThan(0n);

        const [roles, throttleCharges, targets] = await Promise.all([
          sdk.index.getOptimisticTimelockRoles({ chainId: BASE_CHAIN_ID, timelock: optimistic.timelock }),
          sdk.index.getProposalThrottleCharges({ chainId: BASE_CHAIN_ID, governance: governance.address, account: SMOKE_ACCOUNT }),
          sdk.index.getSelectorRegistryTargets({ chainId: BASE_CHAIN_ID, registry: optimistic.selectorRegistry }),
        ]);

        expect(Array.isArray(roles.guardians)).toBe(true);
        expect(throttleCharges).toBeGreaterThanOrEqual(0n);
        expect(Array.isArray(targets)).toBe(true);

        if (targets[0]) {
          const selectors = await sdk.index.getSelectorRegistryAllowedSelectors({
            chainId: BASE_CHAIN_ID,
            registry: optimistic.selectorRegistry,
            target: targets[0],
          });
          expect(selectors.length).toBeGreaterThan(0);
          await expect(
            sdk.index.getSelectorRegistryIsAllowed({
              chainId: BASE_CHAIN_ID,
              registry: optimistic.selectorRegistry,
              target: targets[0],
              selector: selectors[0]!,
            }),
          ).resolves.toBe(true);
        }

        const submitOptimistic = sdk.index.prepareSubmitOptimisticProposal({
          chainId: BASE_CHAIN_ID,
          proposal: {
            governance: optimistic.governance,
            targets: [dtf.id],
            calldatas: [sdk.index.prepareDistributeFees({ address: dtf.id, chainId: BASE_CHAIN_ID }).data],
            description: "Smoke optimistic proposal",
          },
        });
        expect(decodeFunctionData({ abi: dtfIndexGovernanceOptimisticAbi, data: submitOptimistic.data }).functionName).toBe(
          "proposeOptimistic",
        );
      },
      180_000,
    );

    it(
      `${smokeCase.label}: validates revenue, issuance, vote-lock, and rebalance surfaces`,
      async () => {
        const { dtf } = await getContext(smokeCase);
        const stToken = expectVoteLock(dtf);
        const voteLockDaoPromise = smokeCase.expectsVoteLockDao
          ? sdk.index.getVoteLockDao({ address: smokeCase.address, chainId: BASE_CHAIN_ID })
          : Promise.resolve(null);
        const [bidsEnabled, rebalanceControl, pendingFees, platformFee, revenue, approvedTokens, issuance, voteLockDao, voteLockState] =
          await Promise.all([
            sdk.index.getBidsEnabled({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
            sdk.index.getRebalanceControl({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
            sdk.index.getPendingFeeShares({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
            sdk.index.getPlatformFee({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
            sdk.index.getRevenue({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
            sdk.index.getApprovedRevenueTokens({ address: smokeCase.address, chainId: BASE_CHAIN_ID, stToken }),
            sdk.index.getIssuanceState({ address: smokeCase.address, chainId: BASE_CHAIN_ID, account: SMOKE_ACCOUNT, shares: parseEther("1") }),
            voteLockDaoPromise,
            sdk.index.getVoteLockState({ address: smokeCase.address, chainId: BASE_CHAIN_ID, account: SMOKE_ACCOUNT }),
          ]);

        expect(typeof bidsEnabled).toBe("boolean");
        expect(typeof rebalanceControl.weightControl).toBe("boolean");
        expect(pendingFees.raw).toBeGreaterThanOrEqual(0n);
        expect(platformFee.denominator).toBeGreaterThan(0n);
        expect(revenue.platformFee.recipient).toBe(platformFee.recipient);
        expect(Array.isArray(approvedTokens)).toBe(true);
        expect(issuance.assets.length).toBeGreaterThanOrEqual(smokeCase.minimumBasketAssets);
        if (smokeCase.expectsVoteLockDao) {
          expect(voteLockDao?.token.address).toBe(stToken);
        } else {
          expect(voteLockDao).toBeNull();
        }
        expect(voteLockState.stToken).toBe(stToken);

        const [currentRebalance, rebalances, completedRebalances] = await Promise.all([
          sdk.index.getCurrentRebalance({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
          sdk.index.getRebalances({ address: smokeCase.address, chainId: BASE_CHAIN_ID, limit: 5 }),
          sdk.index.getCompletedRebalances({ address: smokeCase.address, chainId: BASE_CHAIN_ID, limit: 5 }),
        ]);

        expect(currentRebalance.totalSupply).toBeGreaterThan(0n);
        expect(currentRebalance.totalAssets.tokens.length).toBeGreaterThanOrEqual(smokeCase.minimumBasketAssets);
        expect(Array.isArray(rebalances)).toBe(true);
        expect(Array.isArray(completedRebalances)).toBe(true);

        if (rebalances[0]) {
          const [rebalance, auctions] = await Promise.all([
            sdk.index.getRebalance({ chainId: BASE_CHAIN_ID, id: rebalances[0].id }),
            sdk.index.getRebalanceAuctions({ chainId: BASE_CHAIN_ID, rebalanceId: rebalances[0].id }),
          ]);
          expect(rebalance.id).toBe(rebalances[0].id);
          expect(Array.isArray(auctions)).toBe(true);
        }

        const distributeFees = sdk.index.prepareDistributeFees({ address: smokeCase.address, chainId: BASE_CHAIN_ID });
        const approval = sdk.index.prepareBasketApproval({
          chainId: BASE_CHAIN_ID,
          address: smokeCase.address,
          token: issuance.assets[0]!.token.address,
          amount: 1n,
        });
        const mint = sdk.index.prepareMint({
          chainId: BASE_CHAIN_ID,
          address: smokeCase.address,
          shares: 1n,
          receiver: SMOKE_ACCOUNT,
          minSharesOut: 0n,
        });
        const redeem = sdk.index.prepareRedeem({
          chainId: BASE_CHAIN_ID,
          address: smokeCase.address,
          shares: 1n,
          receiver: SMOKE_ACCOUNT,
          assets: issuance.assets.map((asset) => asset.token.address),
          minAmountsOut: issuance.assets.map(() => 0n),
        });
        const lockApproval = sdk.index.prepareVoteLockApproval({
          chainId: BASE_CHAIN_ID,
          underlying: voteLockState.underlying.address,
          stToken,
          amount: 1n,
        });
        const lockDeposit = sdk.index.prepareVoteLockDeposit({ chainId: BASE_CHAIN_ID, stToken, amount: 1n, delegateToSelf: true });
        const unlock = sdk.index.prepareVoteLockUnlock({ chainId: BASE_CHAIN_ID, stToken, amount: 1n, account: SMOKE_ACCOUNT });
        const delegate = sdk.index.prepareVoteLockDelegate({ chainId: BASE_CHAIN_ID, stToken, delegatee: SMOKE_ACCOUNT });

        expect(decodeFunctionData({ abi: dtfIndexAbi, data: distributeFees.data }).functionName).toBe("distributeFees");
        expect(approval.contract.functionName).toBe("approve");
        expect(decodeFunctionData({ abi: dtfIndexAbi, data: mint.data }).functionName).toBe("mint");
        expect(decodeFunctionData({ abi: dtfIndexAbi, data: redeem.data }).functionName).toBe("redeem");
        expect(lockApproval.contract.functionName).toBe("approve");
        expect(decodeFunctionData({ abi: dtfIndexStakingVaultAbi, data: lockDeposit.data }).functionName).toBe("depositAndDelegate");
        expect(decodeFunctionData({ abi: dtfIndexStakingVaultAbi, data: unlock.data }).functionName).toBe("withdraw");
        expect(decodeFunctionData({ abi: dtfIndexStakingVaultAbi, data: delegate.data }).functionName).toBe("delegate");
      },
      180_000,
    );

    it(
      `${smokeCase.label}: builds settings, basket, DAO, timelock, and deploy proposal payloads`,
      async () => {
        const { dtf, full, basket, version } = await getContext(smokeCase);
        const adminGovernance = getGovernanceAuthority(dtf.governance.admin.primary);
        const basketGovernance = getGovernanceAuthority(dtf.governance.rebalance.primary) ?? adminGovernance;
        const stToken = expectVoteLock(dtf);
        const daoGovernance = dtf.voteLockVault?.governance
          ? ({
              address: dtf.voteLockVault.governance.address,
              type: "governance",
              governance: dtf.voteLockVault.governance,
            } as const satisfies GovernanceAuthority)
          : undefined;

        if (!basketGovernance) {
          throw new Error(`No proposal governance for ${dtf.id}`);
        }

        const basketInput = getSmokeBasketInput(basket);

        const [settings, basketSettings, daoSettings, basketProposal] = await Promise.all([
          adminGovernance
            ? sdk.index.buildSettingsProposal({
                address: smokeCase.address,
                chainId: BASE_CHAIN_ID,
                dtf,
                governance: adminGovernance.address,
                timelock: adminGovernance.governance.timelock.address,
                mandate: dtf.mandate,
                version,
              })
            : Promise.resolve(null),
          sdk.index.buildBasketSettingsProposal({
            address: smokeCase.address,
            chainId: BASE_CHAIN_ID,
            governance: basketGovernance.address,
            timelock: basketGovernance.governance.timelock.address,
            governanceChanges: { votingDelay: basketGovernance.governance.votingDelay },
          }),
          daoGovernance
            ? sdk.index.buildDaoSettingsProposal({
                address: smokeCase.address,
                chainId: BASE_CHAIN_ID,
                governance: daoGovernance.address,
                timelock: daoGovernance.governance.timelock.address,
                stToken,
                governanceChanges: { votingDelay: daoGovernance.governance.votingDelay },
              })
            : Promise.resolve(null),
          sdk.index.buildBasketProposal({
            address: smokeCase.address,
            chainId: BASE_CHAIN_ID,
            dtf,
            governance: basketGovernance.address,
            basket: basketInput,
            supply: full.token.snapshot.totalSupply.raw,
            currentBalances: Object.fromEntries(
              Object.values(full.basket).map((asset) => [asset.token.address.toLowerCase(), asset.balance.raw]),
            ),
            prices: Object.fromEntries(Object.values(full.basket).map((asset) => [asset.token.address.toLowerCase(), asset.price])),
            tokenDecimals: Object.fromEntries(
              Object.values(full.basket).map((asset) => [asset.token.address.toLowerCase(), asset.token.decimals]),
            ),
            priceErrors: Object.fromEntries(Object.values(full.basket).map((asset) => [asset.token.address.toLowerCase(), 0.5])),
            maxAuctionSizeUsd: 1_000_000,
            auctionLauncherWindow: 3600,
            permissionlessWindow: 3600,
          }),
        ]);

        if (adminGovernance) {
          expect(settings?.targets.length).toBeGreaterThan(0);
        } else {
          expect(settings).toBeNull();
        }

        expect(basketSettings.targets.length).toBeGreaterThan(0);

        if (daoGovernance) {
          expect(daoSettings?.targets.length).toBeGreaterThan(0);
        } else {
          expect(daoSettings).toBeNull();
        }

        expect(basketProposal.targets).toEqual([dtf.id]);
        expect(decodeFunctionData({ abi: dtfIndexAbi, data: basketProposal.calldatas[0]! }).functionName).toBe("startRebalance");

        const proposalGovernance = adminGovernance ?? basketGovernance;
        const proposalForSubmit = settings ?? basketSettings;
        const submit = sdk.index.prepareSubmitProposal({ chainId: BASE_CHAIN_ID, proposal: proposalForSubmit });
        const updateTimelock = sdk.index.prepareUpdateTimelock({
          chainId: BASE_CHAIN_ID,
          governance: proposalGovernance.address,
          timelock: proposalGovernance.governance.timelock.address,
        });
        const relay = sdk.index.prepareRelay({
          chainId: BASE_CHAIN_ID,
          governance: proposalGovernance.address,
          target: dtf.id,
          value: 0n,
          data: proposalForSubmit.calldatas[0]!,
        });
        const timelockDelay = sdk.index.prepareTimelockDelay({
          chainId: BASE_CHAIN_ID,
          timelock: proposalGovernance.governance.timelock.address,
          delay: BigInt(proposalGovernance.governance.timelock.executionDelay),
        });
        const grantRole = sdk.index.prepareTimelockGrantRole({
          chainId: BASE_CHAIN_ID,
          timelock: proposalGovernance.governance.timelock.address,
          role: "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783",
          account: SMOKE_ROLE_ACCOUNT,
        });
        const revokeRole = sdk.index.prepareTimelockRevokeRole({
          chainId: BASE_CHAIN_ID,
          timelock: proposalGovernance.governance.timelock.address,
          role: "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783",
          account: SMOKE_ROLE_ACCOUNT,
        });
        const executeBatch = sdk.index.prepareTimelockExecuteBatch({
          chainId: BASE_CHAIN_ID,
          timelock: proposalGovernance.governance.timelock.address,
          targets: proposalForSubmit.targets,
          values: proposalForSubmit.targets.map(() => 0n),
          calldatas: proposalForSubmit.calldatas,
          predecessor: "0x0000000000000000000000000000000000000000000000000000000000000000",
          salt: "0x0000000000000000000000000000000000000000000000000000000000000000",
        });

        expect(decodeFunctionData({ abi: dtfIndexGovernanceAbi, data: submit.data }).functionName).toBe("propose");
        expect(decodeFunctionData({ abi: dtfIndexGovernanceAbi, data: updateTimelock.data }).functionName).toBe("updateTimelock");
        expect(decodeFunctionData({ abi: dtfIndexGovernanceAbi, data: relay.data }).functionName).toBe("relay");
        expect(decodeFunctionData({ abi: timelockAbi, data: timelockDelay.data }).functionName).toBe("updateDelay");
        expect(decodeFunctionData({ abi: timelockAbi, data: grantRole.data }).functionName).toBe("grantRole");
        expect(decodeFunctionData({ abi: timelockAbi, data: revokeRole.data }).functionName).toBe("revokeRole");
        expect(decodeFunctionData({ abi: timelockAbi, data: executeBatch.data }).functionName).toBe("executeBatch");

        const firstAsset = Object.values(full.basket)[0]!;
        const deployBasicDetails = {
          name: `Smoke ${full.token.symbol}`,
          symbol: `s${full.token.symbol}`.slice(0, 12),
          assets: Object.values(full.basket).slice(0, 2).map((asset) => asset.token.address),
          amounts: Object.values(full.basket).slice(0, 2).map(() => 1n),
          initialShares: parseEther("1"),
        } as const;
        const deployAdditionalDetails = {
          auctionLength: 1800n,
          feeRecipients: sdk.index.buildDeployFeeRecipients({
            platformFee: 20,
            governanceShare: 80,
            deployerShare: 0,
            additionalRecipients: [],
            deployer: SMOKE_ACCOUNT,
            voteLock: stToken,
          }),
          tvlFee: parseEther("0.0015"),
          mintFee: parseEther("0.0015"),
          mandate: "Smoke deploy",
        } as const;
        const deploy = sdk.index.prepareDeploy({
          chainId: BASE_CHAIN_ID,
          basicDetails: deployBasicDetails,
          additionalDetails: deployAdditionalDetails,
          flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
          owner: SMOKE_ACCOUNT,
          deploymentNonce: SMOKE_NONCE,
        });
        const governedDeploy = sdk.index.prepareDeployGoverned({
          chainId: BASE_CHAIN_ID,
          stToken,
          basicDetails: deployBasicDetails,
          additionalDetails: deployAdditionalDetails,
          flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
          ownerGovernance: getSmokeGovernanceParams(),
          tradingGovernance: getSmokeGovernanceParams(),
          deploymentNonce: SMOKE_NONCE,
        });
        const deployPlan = sdk.index.prepareDeployPlan({
          chainId: BASE_CHAIN_ID,
          basicDetails: deployBasicDetails,
          additionalDetails: deployAdditionalDetails,
          flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
          owner: SMOKE_ACCOUNT,
          deploymentNonce: SMOKE_NONCE,
          approvals: [{ token: firstAsset.token.address, amount: 1n }],
        });
        const stakingDeploy = sdk.index.prepareDeployStakingToken({
          chainId: BASE_CHAIN_ID,
          name: "Smoke Vote Lock",
          symbol: "sVL",
          underlying: firstAsset.token.address,
          governance: getSmokeGovernanceParams(),
          deploymentNonce: SMOKE_NONCE,
        });

        expect(decodeFunctionData({ abi: indexDtfDeployerAbi, data: deploy.data }).functionName).toBe("deployFolio");
        expect(decodeFunctionData({ abi: indexDtfDeployerAbi, data: governedDeploy.data }).functionName).toBe("deployGovernedFolio");
        expect(deployPlan.type).toBe("approval-required");
        expect(stakingDeploy.contract.functionName).toBe("deployGovernedStakingToken");
      },
      180_000,
    );
  }

  function getContext(smokeCase: SmokeCase): Promise<SmokeContext> {
    const cached = contexts.get(smokeCase.address);
    if (cached) return cached;

    const context = loadContext(smokeCase);
    contexts.set(smokeCase.address, context);

    return context;
  }

  async function loadContext(smokeCase: SmokeCase): Promise<SmokeContext> {
    const [dtf, full, version] = await Promise.all([
      sdk.index.getDtf({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
      sdk.index.get({ address: smokeCase.address, chainId: BASE_CHAIN_ID, brand: true }),
      sdk.index.getVersion({ address: smokeCase.address, chainId: BASE_CHAIN_ID }),
    ]);

    if (!isSupportedWriteVersion(version)) {
      throw new Error(`Unsupported smoke write version: ${version}`);
    }

    return {
      dtf,
      full,
      basket: {
        address: full.id,
        chainId: full.chainId,
        price: full.market.price,
        marketCap: full.market.marketCap,
        totalSupply: full.market.totalSupply,
        timestamp: full.market.fetchedAt,
        basket: full.basket,
      },
      version,
    };
  }
});

function isSupportedWriteVersion(version: string): version is (typeof SUPPORTED_WRITE_VERSIONS)[number] {
  return SUPPORTED_WRITE_VERSIONS.some((supported) => supported === version);
}

function expectVoteLock(dtf: IndexDtf): Address {
  const stToken = dtf.voteLockVault?.token.address;
  expect(stToken).toBeDefined();

  return stToken!;
}

function getGovernanceAuthorities(dtf: IndexDtf): readonly GovernanceAuthority[] {
  return dtf.governance.all.filter((authority): authority is GovernanceAuthority => authority.type === "governance");
}

function getGovernanceAuthority(authority: IndexDtf["governance"]["admin"]["primary"]): GovernanceAuthority | undefined {
  return authority?.type === "governance" ? authority : undefined;
}

function getCaseGovernance(dtf: IndexDtf, expectsOptimisticGovernance: boolean): GovernanceAuthority {
  const governance = getGovernanceAuthority(dtf.governance.rebalance.primary) ?? expectGovernanceAuthority(dtf.governance.admin.primary);

  expect(governance.governance.isOptimistic).toBe(expectsOptimisticGovernance);

  return governance;
}

function expectGovernanceAuthority(authority: IndexDtf["governance"]["admin"]["primary"]): GovernanceAuthority {
  const governance = getGovernanceAuthority(authority);

  if (!governance) {
    throw new Error("Expected governance authority");
  }

  return governance;
}

function getSmokeBasketInput(basket: IndexDtfBasketWithPrice) {
  const assets = Object.values(basket.basket);
  const shares = getEvenSharePercentages(assets.length);

  return {
    type: "shares" as const,
    tokens: assets.map((asset, index) => ({
      address: asset.token.address,
      decimals: asset.token.decimals,
      price: asset.price,
      priceError: 0.5,
      maxAuctionSizeUsd: 1_000_000,
      share: shares[index]!,
    })),
  };
}

function getEvenSharePercentages(count: number): readonly string[] {
  const total = 100n * 10n ** 16n;
  const base = total / BigInt(count);
  const shares: bigint[] = [];

  for (let i = 0; i < count; i++) {
    const remaining = total - base * BigInt(count - 1);
    shares.push(i === count - 1 ? remaining : base);
  }

  return shares.map((share) => formatUnits(share, 16));
}

function getSmokeGovernanceParams() {
  return {
    votingDelay: 0,
    votingPeriod: 86_400,
    proposalThreshold: parseEther("0.01"),
    quorumThreshold: parseEther("0.03"),
    timelockDelay: 86_400n,
    guardians: [SMOKE_ACCOUNT],
  } as const;
}
