import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  http,
  parseEther,
  type Address,
  type Hex,
  type PublicClient,
  type WalletClient,
} from "viem";
import { beforeAll, describe, expect, it } from "vitest";

import type { ForkScenario, ForkSmokeConfig } from "@/index-dtf/fork-smoke-fixture";
import type { IndexDtfCall } from "@/types/governance";
import type { IndexDtf } from "@/types/index-dtf";

import { SUPPORTED_CHAINS } from "@/config";
import { createDtfSdk, type DtfSdk } from "@/create-dtf-sdk";
import { dtfAdminProposalAbi } from "@/index-dtf/abis/dtf-admin-proposal";
import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { DEFAULT_INDEX_DTF_DEPLOY_FLAGS, extractIndexDtfDeployedAddress } from "@/index-dtf/deploy";
import { assertDisposableForkRpcUrl, readForkSmokeConfig } from "@/index-dtf/fork-smoke-fixture";
import {
  prepareIndexDtfAddToAllowlist,
  prepareIndexDtfSetFeeRecipients,
  prepareIndexDtfSetSelfFee,
  prepareIndexDtfSetTradeAllowlistEnabled,
} from "@/index-dtf/governance/propose/calls";
import { INDEX_DTF_START_REBALANCE_SELECTOR } from "@/index-dtf/governance/propose/upgrade-v6";

const runtimeEnv =
  (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
const forkDescribe = runtimeEnv.RUN_INDEX_DTF_FORK_MUTATING === "1" ? describe : describe.skip;
const forkSmokeTestTimeout = 120_000;
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * The writing v6 cases: SDK-built settings, deploy and upgrade executed by impersonated senders, each inside
 * `evm_snapshot` / `evm_revert`, with a 400-day warp for the upgrade. They must never touch the sandbox's indexed Anvil
 * (8545): rewinding a chain under its Graph Node corrupts the index. Run them on a disposable Anvil forked from the
 * sandbox (`anvil --fork-url http://127.0.0.1:8545 --port <port>`), passed as INDEX_DTF_FORK_DISPOSABLE_RPC_URL; the
 * fixture manifest still names the scenarios.
 */
forkDescribe("Index DTF v6 completion fork smoke (mutating, disposable fork)", () => {
  let config: ForkSmokeConfig;
  let publicClient: PublicClient;
  let wallet: WalletClient;
  let sdk: DtfSdk;

  beforeAll(async () => {
    const indexed = readForkSmokeConfig(runtimeEnv);
    const disposableRpcUrl = runtimeEnv.INDEX_DTF_FORK_DISPOSABLE_RPC_URL;
    if (!disposableRpcUrl) {
      throw new Error("INDEX_DTF_FORK_DISPOSABLE_RPC_URL is required: an Anvil forked from the sandbox, never 8545");
    }
    assertDisposableForkRpcUrl(disposableRpcUrl, { indexedRpcUrl: indexed.rpcUrl });
    config = { ...indexed, rpcUrl: disposableRpcUrl };
    const chain = SUPPORTED_CHAINS[config.chainId];
    publicClient = createPublicClient({ chain, transport: http(config.rpcUrl) });
    wallet = createWalletClient({ chain, transport: http(config.rpcUrl) });
    sdk = createDtfSdk({ chains: { [config.chainId]: { publicClient } } });

    const clientVersion = await publicClient.request({ method: "web3_clientVersion" });
    if (!clientVersion.toLowerCase().startsWith("anvil")) {
      throw new Error(`${config.rpcUrl} is not an Anvil fork (${clientVersion})`);
    }
    // A fork of the sandbox carries the fixture: the v6 native Folio must already exist at its address.
    const v6Native = config.scenarios.find((scenario) => scenario.label === "v6Native");
    if (!v6Native || !(await publicClient.getCode({ address: v6Native.folio }))) {
      throw new Error(`${config.rpcUrl} does not carry the sandbox fixture; fork it from the sandbox RPC`);
    }
  }, forkSmokeTestTimeout);

  it(
    "executes SDK-built v6 settings from the admin timelock and reads them back",
    async () => {
      const scenario = getScenario("v6Native");
      const timelock = scenario.governanceAddresses?.timelock;
      const actor = scenario.execution?.actor;
      const governance = scenario.governance;
      if (!timelock || !actor || !governance) throw new Error("v6Native timelock, actor or governance is missing");
      const address = scenario.folio;
      const chainId = config.chainId;

      await withSnapshot(async () => {
        await impersonate(timelock);
        await send(timelock, prepareIndexDtfSetSelfFee({ address, chainId, version: "6.0.0", percentage: 5 }));
        await send(
          timelock,
          prepareIndexDtfSetFeeRecipients({
            address,
            chainId,
            version: "6.0.0",
            recipients: [{ recipient: actor, portion: parseEther("0.6") }],
            immutableRecipients: [{ recipient: timelock, portion: parseEther("0.4") }],
          }),
        );
        await send(timelock, prepareIndexDtfAddToAllowlist({ address, chainId, version: "6.0.0", tokens: [WETH] }));
        await send(
          timelock,
          prepareIndexDtfSetTradeAllowlistEnabled({ address, chainId, version: "6.0.0", enabled: true }),
        );

        expect(await sdk.index.getSelfFee({ address, chainId })).toEqual({
          raw: parseEther("0.05"),
          formatted: "0.05",
        });
        expect(await sdk.index.getImmutableFeeRecipients({ address, chainId })).toEqual([
          { recipient: timelock, portion: parseEther("0.4") },
        ]);
        expect(await sdk.index.getTradeAllowlist({ address, chainId })).toEqual({ enabled: true, tokens: [WETH] });
        expect(await sdk.index.getIsTokenAllowlisted({ address, chainId, token: WETH })).toBe(true);

        // A revenue proposal built on this state must preserve the immutable table and fit the rest.
        const proposal = await sdk.index.buildSettingsProposal({
          address,
          chainId,
          version: "6.0.0",
          governance,
          timelock,
          dtf: fakeDtfContext(actor, governance, timelock),
          revenueDistribution: { platformFee: 0, governanceShare: 0, deployerShare: 100, additionalRecipients: [] },
        });
        for (const [index, data] of proposal.calldatas.entries()) {
          await send(timelock, { chainId, to: proposal.targets[index]!, data, value: 0n });
        }
        expect(await sdk.index.getImmutableFeeRecipients({ address, chainId })).toEqual([
          { recipient: timelock, portion: parseEther("0.4") },
        ]);
      });
    },
    forkSmokeTestTimeout,
  );

  it(
    "deploys a Folio 6.0 through the SDK against the sandbox's v6 deployer",
    async () => {
      const actor = getScenario("v6Native").execution?.actor;
      if (!actor) throw new Error("actor is missing");
      const chainId = config.chainId;
      const amount = parseEther("1");

      await withSnapshot(async () => {
        await impersonate(actor);
        const plan = sdk.index.prepareDeployPlan({
          chainId,
          version: "6.0.0",
          deployer: config.protocol.v6Deployer,
          basicDetails: {
            name: "Fork smoke v6",
            symbol: "fsV6",
            assets: [WETH],
            amounts: [amount],
            initialShares: parseEther("1"),
          },
          additionalDetails: {
            maxAuctionLength: config.writePaths.auctionLength,
            feeRecipients: [{ recipient: actor, portion: parseEther("0.9") }],
            immutableFeeRecipients: [{ recipient: config.protocol.versionRegistry, portion: parseEther("0.1") }],
            tvlFee: 0n,
            mintFee: 0n,
            selfFee: parseEther("0.02"),
            mandate: "Fork smoke v6 deploy",
          },
          flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
          owner: actor,
          approvals: [{ token: WETH, amount }],
        });
        if (plan.type !== "approval-required") throw new Error("expected an approval plan");
        for (const approval of plan.approvals) await send(actor, approval);
        const receipt = await send(actor, plan.call);
        const folio = extractIndexDtfDeployedAddress(receipt.logs, {
          chainId,
          version: "6.0.0",
          deployer: config.protocol.v6Deployer,
        });

        expect(await sdk.index.getVersion({ address: folio, chainId })).toBe("6.0.0");
        expect(await sdk.index.getMaxAuctionLength({ address: folio, chainId })).toBe(config.writePaths.auctionLength);
        expect(await sdk.index.getSelfFee({ address: folio, chainId })).toEqual({
          raw: parseEther("0.02"),
          formatted: "0.02",
        });
        expect(await sdk.index.getImmutableFeeRecipients({ address: folio, chainId })).toEqual([
          { recipient: config.protocol.versionRegistry, portion: parseEther("0.1") },
        ]);
      });
    },
    forkSmokeTestTimeout,
  );

  it(
    "upgrades the v5 control folio to 6.0.0 with the SDK-built spell calls executed by a timelock admin",
    async () => {
      const scenario = getScenario("v5Control");
      const legacy = getScenario("v5LegacyUpgrade");
      const optimistic = getScenario("v5OptimisticUpgrade");
      const execution = scenario.execution;
      const actor = execution?.actor;
      const timelock = legacy.governanceAddresses?.timelock;
      if (!execution || !actor || !timelock) throw new Error("v5Control execution or a legacy timelock is missing");
      if (!legacy.proposal || !optimistic.proposal || !optimistic.governanceAddresses) {
        throw new Error("recorded upgrade proposals are missing");
      }
      const chainId = config.chainId;
      const folio = scenario.folio;

      // The SDK must rebuild both recorded upgrade proposals from the fixture's own addresses.
      expect(config.protocol.startRebalanceSelectors).toEqual(INDEX_DTF_START_REBALANCE_SELECTOR);
      expect(
        sdk.index
          .buildUpgradeToV6Calls({
            chainId,
            address: legacy.folio,
            proxyAdmin: legacy.proxyAdmin,
            spell: config.protocol.upgradeSpell,
          })
          .map((call) => call.data),
      ).toEqual(legacy.proposal.calldatas);
      expect(
        sdk.index
          .buildUpgradeToV6Calls({
            chainId,
            address: optimistic.folio,
            proxyAdmin: optimistic.proxyAdmin,
            spell: config.protocol.upgradeSpell,
            selectorRegistry: optimistic.governanceAddresses.selectorRegistry,
          })
          .map((call) => call.data),
      ).toEqual(optimistic.proposal.calldatas);

      await withSnapshot(async () => {
        // The spell only accepts a contract admin (it enumerates the sender's proposer role), so hand the
        // direct-admin control folio to the legacy scenario's timelock first, exactly as governance would hold it.
        await impersonate(actor);
        await impersonate(timelock);
        await send(actor, {
          chainId,
          to: folio,
          data: encodeFunctionData({
            abi: dtfIndexAbi,
            functionName: "grantRole",
            args: [DEFAULT_ADMIN_ROLE, timelock],
          }),
          value: 0n,
        });
        await send(actor, {
          chainId,
          to: folio,
          data: encodeFunctionData({
            abi: dtfIndexAbi,
            functionName: "renounceRole",
            args: [DEFAULT_ADMIN_ROLE, actor],
          }),
          value: 0n,
        });
        await send(actor, {
          chainId,
          to: scenario.proxyAdmin,
          data: encodeFunctionData({ abi: dtfAdminProposalAbi, functionName: "transferOwnership", args: [timelock] }),
          value: 0n,
        });

        const calls = sdk.index.buildUpgradeToV6Calls({
          chainId,
          address: folio,
          proxyAdmin: scenario.proxyAdmin,
          spell: config.protocol.upgradeSpell,
        });
        expect(await sdk.index.getVersion({ address: folio, chainId })).toBe("5.0.0");
        // The spell refuses an upgrade while the fixture's rebalance window or its last auction is still open.
        await publicClient.request({ method: "evm_increaseTime" as never, params: [400 * 86_400] as never });
        await publicClient.request({ method: "evm_mine" as never, params: [] as never });
        for (const call of calls) await send(timelock, call);

        expect(await sdk.index.getVersion({ address: folio, chainId })).toBe("6.0.0");
        expect(await sdk.index.getMaxAuctionLength({ address: folio, chainId })).toBe(BigInt(execution.auctionLength));
        expect(await sdk.index.getRebalanceNonce({ address: folio, chainId })).toBe(BigInt(execution.rebalanceNonce));
        expect(await sdk.index.getImmutableFeeRecipients({ address: folio, chainId })).toEqual([]);
      });
    },
    forkSmokeTestTimeout,
  );

  function getScenario(label: ForkScenario["label"]): ForkScenario {
    const scenario = config.scenarios.find((candidate) => candidate.label === label);
    if (!scenario) throw new Error(`Missing scenario ${label}`);
    return scenario;
  }

  const impersonated = new Set<Address>();

  async function withSnapshot(run: () => Promise<void>) {
    const snapshot = (await publicClient.request({ method: "evm_snapshot" as never, params: [] as never })) as Hex;
    try {
      await run();
    } finally {
      await publicClient.request({ method: "evm_revert" as never, params: [snapshot] as never });
      // Impersonation is node state, not chain state: a revert does not clear it.
      for (const account of impersonated) {
        await publicClient.request({ method: "anvil_stopImpersonatingAccount" as never, params: [account] as never });
      }
      impersonated.clear();
    }
  }

  async function impersonate(account: Address) {
    impersonated.add(account);
    await publicClient.request({ method: "anvil_impersonateAccount" as never, params: [account] as never });
    await publicClient.request({
      method: "anvil_setBalance" as never,
      params: [account, `0x${parseEther("10").toString(16)}`] as never,
    });
  }

  async function send(from: Address, call: Pick<IndexDtfCall, "chainId" | "to" | "data" | "value">) {
    const hash = await wallet.sendTransaction({
      account: from,
      chain: SUPPORTED_CHAINS[config.chainId],
      to: call.to,
      data: call.data,
      value: call.value,
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== "success") throw new Error(`transaction reverted: ${hash}`);
    return receipt;
  }

  function fakeDtfContext(deployer: Address, governance: Address, timelock: Address): IndexDtf {
    return {
      governance: {
        admin: {
          primary: {
            type: "governance",
            address: governance,
            governance: { address: governance, quorumDenominator: 100, timelock: { address: timelock, guardians: [] } },
          },
        },
      },
      roles: { metadata: { brandManagers: [] }, rebalance: { auctionLaunchers: [] }, deployment: { deployer } },
      rebalance: { weightControl: true, priceControl: 1 },
      fees: { recipients: [] },
    } as unknown as IndexDtf;
  }
});
