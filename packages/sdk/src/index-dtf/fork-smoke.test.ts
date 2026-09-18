import {
  createPublicClient,
  decodeFunctionData,
  erc20Abi,
  http,
  keccak256,
  parseEventLogs,
  parseEther,
  toBytes,
  type Abi,
  type Address,
  type Hash,
  type Hex,
  type PublicClient,
} from "viem";
import { beforeAll, describe, expect, it } from "vitest";

import type {
  ForkExecutedGovernanceEvidence,
  ForkExecutionEvidence,
  ForkScenario,
  ForkSmokeConfig,
} from "@/index-dtf/fork-smoke-fixture";
import type { OpenAuctionArgs } from "@/index-dtf/rebalance/types";

import { SUPPORTED_CHAINS } from "@/config";
import { createDtfSdk, type DtfSdk } from "@/create-dtf-sdk";
import { indexDtfDeployerAbi } from "@/index-dtf/abis/deployer";
import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { dtfIndexGovernanceAbi } from "@/index-dtf/abis/dtf-index-governance";
import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";
import { folioArtifactAbi } from "@/index-dtf/abis/folio-artifact";
import { DEFAULT_INDEX_DTF_DEPLOY_FLAGS } from "@/index-dtf/deploy";
import { readForkSmokeConfig } from "@/index-dtf/fork-smoke-fixture";
import {
  getIndexDtfWriteAbi,
  indexDtfV5WriteAbi,
  indexDtfV6WriteAbi,
  prepareIndexDtfSetMandate,
  prepareIndexDtfSetName,
} from "@/index-dtf/governance/propose/calls";
import { governorWriteAbi } from "@/lib/governor-calls";

const runtimeEnv =
  (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
const runForkSmoke = runtimeEnv.RUN_INDEX_DTF_FORK_SMOKE === "1";
const forkDescribe = runForkSmoke ? describe : describe.skip;
// Archive-backed Anvil reads can need several seconds on a cold cache. Keep
// this suite deterministic and low-pressure instead of flooding the fork with
// concurrent historical calls under Vitest's five-second unit-test default.
const forkSmokeTestTimeout = 60_000;
const OPTIMISTIC_PROPOSER_ROLE = keccak256(toBytes("OPTIMISTIC_PROPOSER_ROLE"));
const AUCTION_LAUNCHER_ROLE = keccak256(toBytes("AUCTION_LAUNCHER"));
const LIVE_REBALANCE_SECOND_TOKEN = {
  1: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  56: "0x55d398326f99059fF775485246999027B3197955",
} as const satisfies Record<ForkSmokeConfig["chainId"], Address>;

type FixtureState = {
  readonly totalSupply: bigint;
  readonly tokens: readonly Address[];
  readonly balances: readonly bigint[];
  readonly mandate: string;
  readonly decimals: readonly number[];
  readonly auctionLength: bigint;
};

forkDescribe("Index DTF deterministic fork smoke", () => {
  let config: ForkSmokeConfig;
  let publicClient: PublicClient;
  let sdk: DtfSdk;
  const stateByFolio = new Map<Address, Promise<FixtureState>>();
  const decimalsByToken = new Map<Address, Promise<number>>();

  beforeAll(() => {
    config = readForkSmokeConfig(runtimeEnv);
    publicClient = createPublicClient({
      chain: SUPPORTED_CHAINS[config.chainId],
      transport: http(config.rpcUrl),
    });
    sdk = createDtfSdk({ chains: { [config.chainId]: { publicClient } } });
  });

  it(
    "uses only the configured local fork and reaches the pinned state block",
    async () => {
      const [rpcChainId, latestBlock, stateBlock] = await Promise.all([
        publicClient.getChainId(),
        publicClient.getBlockNumber(),
        publicClient.getBlock({ blockNumber: config.stateBlock }),
      ]);

      expect(rpcChainId).toBeGreaterThan(0);
      expect(latestBlock).toBeGreaterThanOrEqual(config.stateBlock);
      expect(stateBlock.timestamp).toBe(config.stateTimestamp);
    },
    forkSmokeTestTimeout,
  );

  it(
    "proves all four scenario creations at their declared blocks",
    async () => {
      for (const scenario of config.scenarios) {
        await expectCreationAtBlock(publicClient, scenario.folio, scenario.creationBlock);
      }
    },
    forkSmokeTestTimeout,
  );

  it(
    "detects v5 before and v6 after both declared upgrade paths",
    async () => {
      const upgraded = config.scenarios.filter(
        (scenario): scenario is ForkScenario & { readonly upgradeBlock: bigint } => scenario.upgradeBlock !== undefined,
      );

      for (const scenario of upgraded) {
        await expect(
          sdk.index.getVersion({
            address: scenario.folio,
            chainId: config.chainId,
            blockNumber: scenario.creationBlock,
          }),
          scenario.label,
        ).resolves.toBe("5.0.0");
        await expect(
          sdk.index.getVersion({
            address: scenario.folio,
            chainId: config.chainId,
            blockNumber: scenario.upgradeBlock,
          }),
          scenario.label,
        ).resolves.toBe("6.0.0");
        await expectUpgradeProposalEvidence(publicClient, scenario, config.stateBlock);
      }
    },
    forkSmokeTestTimeout,
  );

  it(
    "detects every current version and caches pinned Folio data reads",
    async () => {
      const states: FixtureState[] = [];
      for (const scenario of config.scenarios) states.push(await getFixtureState(scenario));

      for (let index = 0; index < config.scenarios.length; index++) {
        const scenario = config.scenarios[index]!;
        const state = states[index]!;
        const version = await sdk.index.getVersion({
          address: scenario.folio,
          chainId: config.chainId,
          blockNumber: config.stateBlock,
        });

        expect(version, scenario.label).toBe(scenario.expectedVersion);
        expect(state.totalSupply, scenario.label).toBeGreaterThan(0n);
        expect(state.tokens.length, scenario.label).toBeGreaterThanOrEqual(1);
        expect(state.balances, scenario.label).toHaveLength(state.tokens.length);
        expect(state.decimals, scenario.label).toHaveLength(state.tokens.length);
        expect(typeof state.mandate, scenario.label).toBe("string");
      }
    },
    forkSmokeTestTimeout,
  );

  it(
    "reads back linked active v5 direct and v6 optimistic executions",
    async () => {
      const v5 = getScenarioWithExecution("v5Control");
      const v6 = getScenarioWithExecution("v6Native");

      expect(v5.governance).toBeUndefined();
      expect(v5.execution.roleAuthority).toBe("direct-admin");
      expect(v6.governanceKind).toBe("optimistic");
      expect(v6.execution.roleAuthority).toBe("optimistic-governance");
      if (v6.execution.roleAuthority !== "optimistic-governance" || !v6.governance || !v6.governanceAddresses) {
        throw new Error("v6Native must contain optimistic execution evidence");
      }
      expect(v6.execution.authority).toMatchObject({ kind: "standard", optimistic: false });
      expect(v6.execution.rebalanceProposal).toMatchObject({ kind: "optimistic", optimistic: true });

      for (const scenario of [v5, v6]) {
        const params = {
          address: scenario.folio,
          chainId: config.chainId,
          blockNumber: config.stateBlock,
        } as const;
        const [current, latestAuction, activeAuction] = await Promise.all([
          sdk.index.getCurrentRebalance(params),
          sdk.index.getLatestAuction(params),
          sdk.index.getActiveAuction(params),
        ]);
        const expectedTokens = normalizeAddresses(scenario.execution.tokens);

        expect(current.rebalance.nonce, `${scenario.label} rebalance nonce`).toBe(1n);
        expect(
          normalizeAddresses(current.rebalance.tokens.map(({ token }) => token)),
          `${scenario.label} tokens`,
        ).toEqual(expectedTokens);
        expect(current.rebalance.timestamps.startedAt, `${scenario.label} rebalance started`).toBeLessThanOrEqual(
          config.stateTimestamp,
        );
        expect(current.rebalance.timestamps.availableUntil, `${scenario.label} rebalance active`).toBeGreaterThan(
          config.stateTimestamp,
        );
        expect(latestAuction, `${scenario.label} latest auction`).toMatchObject({ auctionId: 0n, rebalanceNonce: 1n });
        if (!latestAuction) throw new Error(`${scenario.label} latest auction is missing`);
        expect(latestAuction.endTime - latestAuction.startTime, `${scenario.label} auction length`).toBe(300n);
        if (scenario.label === "v5Control") {
          expect(latestAuction.isActive, `${scenario.label} auction active`).toBe(true);
          expect(activeAuction, `${scenario.label} active auction`).toMatchObject({
            auctionId: 0n,
            rebalanceNonce: 1n,
            isActive: true,
          });
        } else {
          // The two fixture windows intentionally do not overlap: at the pinned
          // state the v5 auction is active while v6 is opened but starts later.
          expect(latestAuction.startTime, `${scenario.label} scheduled auction start`).toBeGreaterThan(
            config.stateTimestamp,
          );
          expect(latestAuction.isActive, `${scenario.label} scheduled auction`).toBe(false);
          expect(activeAuction, `${scenario.label} active auction before start`).toBeNull();
        }

        const folioAbi = scenario.expectedVersion === "6.0.0" ? folioArtifactAbi : dtfIndexAbi;
        await expectFolioExecutionReceipt({
          publicClient,
          folio: scenario.folio,
          actor: scenario.execution.actor,
          transactionHash: scenario.execution.rebalanceTxHash,
          blockNumber: scenario.execution.rebalanceBlock,
          transactionTarget:
            scenario.execution.roleAuthority === "optimistic-governance" ? scenario.governance : scenario.folio,
          abi: folioAbi,
          eventName: "RebalanceStarted",
          nonce: scenario.execution.rebalanceNonce,
          tokens: scenario.execution.tokens,
        });
        const auctionEvent = await expectFolioExecutionReceipt({
          publicClient,
          folio: scenario.folio,
          actor: scenario.execution.actor,
          transactionHash: scenario.execution.auctionTxHash,
          blockNumber: scenario.execution.auctionBlock,
          transactionTarget: scenario.folio,
          abi: folioAbi,
          eventName: "AuctionOpened",
          nonce: scenario.execution.rebalanceNonce,
          auctionId: scenario.execution.auctionId,
          tokens: scenario.execution.tokens,
        });
        expect(latestAuction.startTime, `${scenario.label} auction start event/readback`).toBe(auctionEvent.startTime);
        expect(latestAuction.endTime, `${scenario.label} auction end event/readback`).toBe(auctionEvent.endTime);
      }

      await expectGovernanceExecutionEvidence({
        publicClient,
        governance: v6.governance,
        actor: v6.execution.actor,
        evidence: v6.execution.authority,
        optimistic: false,
        stateBlock: config.stateBlock,
        action: "authority",
        folio: v6.folio,
        timelock: v6.governanceAddresses.timelock,
      });
      await expectGovernanceExecutionEvidence({
        publicClient,
        governance: v6.governance,
        actor: v6.execution.actor,
        evidence: v6.execution.rebalanceProposal,
        optimistic: true,
        stateBlock: config.stateBlock,
        action: "rebalance",
        folio: v6.folio,
        tokens: v6.execution.tokens,
        nonce: v6.execution.rebalanceNonce,
        deadline: v6.execution.deadline,
      });
      expect(v6.execution.rebalanceProposal.executeTxHash).toBe(v6.execution.rebalanceTxHash);
      expect(v6.execution.rebalanceProposal.executeBlock).toBe(v6.execution.rebalanceBlock);
      expect(v6.execution.deadline).toBe(config.writePaths.deadline);
    },
    forkSmokeTestTimeout,
  );

  it(
    "preserves Governor call order and encodes the live v6 nonce and deadline",
    async () => {
      const standardScenarios = config.scenarios.filter(
        (scenario): scenario is ForkScenario & { readonly governance: Address } => scenario.governance !== undefined,
      );

      for (const scenario of standardScenarios) {
        const callCount = scenario.proposalCallCount ?? 2;
        const calls = Array.from({ length: callCount }, (_, index) =>
          index % 2 === 0
            ? prepareIndexDtfSetMandate({
                address: scenario.folio,
                chainId: config.chainId,
                version: scenario.expectedVersion,
                mandate: `Fork smoke ${scenario.label} call ${index}`,
              })
            : prepareIndexDtfSetName({
                address: scenario.folio,
                chainId: config.chainId,
                version: scenario.expectedVersion,
                name: `Fork smoke ${scenario.label} call ${index}`,
              }),
        );
        const targets = calls.map(() => scenario.folio);
        const calldatas = calls.map((call) => call.data);
        const proposal = sdk.index.prepareSubmitProposal({
          chainId: config.chainId,
          proposal: {
            governance: scenario.governance,
            targets,
            calldatas,
            description: `Fork smoke proposal: ${scenario.label}`,
          },
        });
        const decodedProposal = decodeFunctionData({ abi: governorWriteAbi, data: proposal.data });
        const writeAbi = getIndexDtfWriteAbi(scenario.expectedVersion);
        const decodedCalls = calls.map((call) => decodeFunctionData({ abi: writeAbi, data: call.data }));

        expect(proposal.to, scenario.label).toBe(scenario.governance);
        expect(decodedProposal.functionName, scenario.label).toBe("propose");
        expect(decodedProposal.args, scenario.label).toEqual([
          targets,
          calls.map(() => 0n),
          calldatas,
          `Fork smoke proposal: ${scenario.label}`,
        ]);
        expect(
          decodedCalls.map((call) => call.functionName),
          scenario.label,
        ).toEqual(Array.from({ length: callCount }, (_, index) => (index % 2 === 0 ? "setMandate" : "setName")));
      }

      const scenario = getScenario("v6Native");
      if (!scenario.governance) throw new Error("v6Native governance is missing");
      const state = await getFixtureState(scenario);
      const secondToken = LIVE_REBALANCE_SECOND_TOKEN[config.chainId];
      const tokens = [...state.tokens, ...(state.tokens.includes(secondToken) ? [] : [secondToken])];
      if (tokens.length < 2) throw new Error("fork v6 rebalance smoke requires two distinct tokens");
      const currentBalances = Object.fromEntries(
        state.tokens.map((token, index) => [token, state.balances[index]!]),
      ) as Record<Address, bigint>;
      currentBalances[secondToken] ??= 0n;
      const prices = Object.fromEntries(tokens.map((token) => [token, 1])) as Record<Address, number>;
      const priceErrors = Object.fromEntries(tokens.map((token) => [token, 0.5])) as Record<Address, number>;
      const currentNonce = await publicClient.readContract({
        address: scenario.folio,
        abi: folioArtifactAbi,
        functionName: "getRebalanceNonce",
        blockNumber: config.stateBlock,
      });
      const basketProposal = await sdk.index.buildBasketProposal({
        address: scenario.folio,
        chainId: config.chainId,
        blockNumber: config.stateBlock,
        version: "6.0.0",
        governance: scenario.governance,
        supply: state.totalSupply,
        currentBalances,
        prices,
        priceErrors,
        weightControl: true,
        basket: { type: "units", tokens: tokens.map((address) => ({ address, units: "1" })) },
        auctionLauncherWindow: 3600,
        ttl: 10_800,
        deadline: config.writePaths.deadline,
      });
      const decodedRebalance = decodeFunctionData({ abi: folioArtifactAbi, data: basketProposal.calldatas[0]! });

      expect(decodedRebalance.functionName).toBe("startRebalance");
      expect(basketProposal.targets).toEqual([scenario.folio]);
      expect(basketProposal.calldatas).toHaveLength(1);
      expect(decodedRebalance.args).toEqual([
        currentNonce + 1n,
        basketProposal.context.startRebalanceArgs.tokens,
        basketProposal.context.startRebalanceArgs.limits,
        3600n,
        10_800n,
        config.writePaths.deadline,
      ]);
    },
    forkSmokeTestTimeout,
  );

  it(
    "encodes v5 and v6 openAuction with version-specific auctionLength ordering",
    async () => {
      const v5 = getScenario("v5Control");
      const v6 = getScenario("v6Native");
      const v5State = await getFixtureState(v5);
      const v6State = await getFixtureState(v6);
      const v5Call = sdk.index.prepareOpenAuction({
        address: v5.folio,
        chainId: config.chainId,
        version: "5.0.0",
        args: getOpenAuctionArgs(v5State),
      });
      const v6Call = sdk.index.prepareOpenAuction({
        address: v6.folio,
        chainId: config.chainId,
        version: "6.0.0",
        args: getOpenAuctionArgs(v6State),
        auctionLength: config.writePaths.auctionLength,
      });
      const v5Decoded = decodeFunctionData({ abi: dtfIndexAbi, data: v5Call.data });
      const v6Decoded = decodeFunctionData({ abi: folioArtifactAbi, data: v6Call.data });

      expect(v5Decoded.functionName).toBe("openAuction");
      expect(v5Decoded.args).toHaveLength(5);
      expect(v6Decoded.functionName).toBe("openAuction");
      expect(v6Decoded.args).toHaveLength(6);
      expect(config.writePaths.auctionLength).toBe(v6State.auctionLength);
      expect(v6Decoded.args[5]).toBe(config.writePaths.auctionLength);
    },
    forkSmokeTestTimeout,
  );

  it(
    "encodes the existing v5 deploy builder against fixture assets",
    async () => {
      const scenario = getScenario("v5Control");
      const governedScenario = getScenario("v5LegacyUpgrade");
      if (!governedScenario.governance) throw new Error("v5LegacyUpgrade governance is missing");
      const state = await getFixtureState(scenario);
      const call = sdk.index.prepareDeploy({
        chainId: config.chainId,
        basicDetails: {
          name: "Fork smoke deploy",
          symbol: "fsDTF",
          assets: state.tokens,
          amounts: state.tokens.map(() => 1n),
          initialShares: parseEther("1"),
        },
        additionalDetails: {
          auctionLength: state.auctionLength,
          feeRecipients: [{ recipient: governedScenario.governance, portion: parseEther("1") }],
          tvlFee: 0n,
          mintFee: 0n,
          mandate: "Fork smoke deploy",
        },
        flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
        owner: governedScenario.governance,
        deploymentNonce: "0x0000000000000000000000000000000000000000000000000000000000000042",
      });
      const decoded = decodeFunctionData({ abi: indexDtfDeployerAbi, data: call.data });
      const basicDetails = decoded.args[0] as {
        readonly assets: readonly Address[];
        readonly amounts: readonly bigint[];
      };
      const additionalDetails = decoded.args[1] as { readonly auctionLength: bigint };

      expect(decoded.functionName).toBe("deployFolio");
      expect(basicDetails.assets).toEqual(state.tokens);
      expect(basicDetails.amounts).toEqual(state.tokens.map(() => 1n));
      expect(additionalDetails.auctionLength).toBe(state.auctionLength);
    },
    forkSmokeTestTimeout,
  );

  function getScenario(label: ForkScenario["label"]): ForkScenario {
    const scenario = config.scenarios.find((candidate) => candidate.label === label);
    if (!scenario) throw new Error(`fixture scenario ${label} is missing`);

    return scenario;
  }

  function getScenarioWithExecution(
    label: "v5Control" | "v6Native",
  ): ForkScenario & { readonly execution: ForkExecutionEvidence } {
    const scenario = getScenario(label);
    if (!scenario.execution) throw new Error(`fixture scenario ${label} is missing execution evidence`);

    return { ...scenario, execution: scenario.execution };
  }

  function getFixtureState(scenario: ForkScenario): Promise<FixtureState> {
    const cached = stateByFolio.get(scenario.folio);
    if (cached) return cached;

    const state = loadFixtureState(scenario);
    stateByFolio.set(scenario.folio, state);
    return state;
  }

  async function loadFixtureState(scenario: ForkScenario): Promise<FixtureState> {
    const params = {
      address: scenario.folio,
      chainId: config.chainId,
      blockNumber: config.stateBlock,
    } as const;
    const totalSupply = await sdk.index.getTotalSupply(params);
    const totalAssets = await sdk.index.getTotalAssets(params);
    const mandate = await sdk.index.getMandate(params);
    const auctionLength = await getAuctionLength(scenario);
    const decimals: number[] = [];
    for (const token of totalAssets.tokens) decimals.push(await getTokenDecimals(token));

    return {
      totalSupply,
      tokens: totalAssets.tokens,
      balances: totalAssets.balances,
      mandate,
      decimals,
      auctionLength,
    };
  }

  function getTokenDecimals(address: Address): Promise<number> {
    const cached = decimalsByToken.get(address);
    if (cached) return cached;

    const decimals = publicClient.readContract({
      address,
      abi: erc20Abi,
      functionName: "decimals",
      blockNumber: config.stateBlock,
    });
    decimalsByToken.set(address, decimals);
    return decimals;
  }

  async function getAuctionLength(scenario: ForkScenario): Promise<bigint> {
    if (scenario.expectedVersion === "6.0.0") {
      return publicClient.readContract({
        address: scenario.folio,
        abi: folioArtifactAbi,
        functionName: "maxAuctionLength",
        blockNumber: config.stateBlock,
      });
    }

    return publicClient.readContract({
      address: scenario.folio,
      abi: dtfIndexAbi,
      functionName: "auctionLength",
      blockNumber: config.stateBlock,
    });
  }
});

async function expectCreationAtBlock(publicClient: PublicClient, address: Address, creationBlock: bigint) {
  const before = await publicClient.getCode({ address, blockNumber: previousBlock(creationBlock) });
  const after = await publicClient.getCode({ address, blockNumber: creationBlock });

  expect(before).toBeUndefined();
  expect(after).toBeDefined();
  expect(after).not.toBe("0x");
}

async function expectUpgradeProposalEvidence(publicClient: PublicClient, scenario: ForkScenario, stateBlock: bigint) {
  if (!scenario.governance || !scenario.proposal) {
    throw new Error(`${scenario.label} is missing governance proposal evidence`);
  }

  const { proposal } = scenario;
  const [proposalState, creationLogs, executionLogs] = await Promise.all([
    publicClient.readContract({
      address: scenario.governance,
      abi: dtfIndexGovernanceAbi,
      functionName: "state",
      args: [proposal.proposalId],
      blockNumber: stateBlock,
    }),
    publicClient.getLogs({
      address: scenario.governance,
      fromBlock: proposal.proposalBlock,
      toBlock: proposal.proposalBlock,
    }),
    publicClient.getLogs({
      address: scenario.governance,
      fromBlock: proposal.executeBlock,
      toBlock: proposal.executeBlock,
    }),
  ]);
  const created = parseEventLogs({ abi: dtfIndexGovernanceAbi, logs: creationLogs, strict: false }).find(
    (log) => log.eventName === "ProposalCreated" && log.args.proposalId === proposal.proposalId,
  );
  const executed = parseEventLogs({ abi: dtfIndexGovernanceAbi, logs: executionLogs, strict: false }).find(
    (log) => log.eventName === "ProposalExecuted" && log.args.proposalId === proposal.proposalId,
  );

  expect(proposalState, `${scenario.label} proposal state`).toBe(7);
  expect(created, `${scenario.label} ProposalCreated`).toBeDefined();
  if (!created || created.eventName !== "ProposalCreated") return;
  const { targets, values, calldatas } = created.args;
  if (!targets || !values || !calldatas) {
    throw new Error(`${scenario.label} ProposalCreated log is missing call data`);
  }
  expect(
    targets.map((target) => target.toLowerCase()),
    `${scenario.label} proposal targets`,
  ).toEqual(proposal.targets.map((target) => target.toLowerCase()));
  expect(values, `${scenario.label} proposal values`).toEqual(proposal.values);
  expect(calldatas, `${scenario.label} proposal calldatas`).toEqual(proposal.calldatas);
  expect(executed, `${scenario.label} ProposalExecuted`).toBeDefined();
}

function getOpenAuctionArgs(state: FixtureState): OpenAuctionArgs {
  const tokens = [...state.tokens];
  if (tokens.length === 0) throw new Error("fork write smoke requires a basket asset");

  return {
    rebalanceNonce: 1n,
    tokens,
    newWeights: tokens.map(() => ({ low: 0n, spot: parseEther("0.5"), high: parseEther("1") })),
    newPrices: tokens.map(() => ({ low: parseEther("0.9"), high: parseEther("1.1") })),
    newLimits: { low: parseEther("0.9"), spot: parseEther("1"), high: parseEther("1.1") },
  };
}

function previousBlock(blockNumber: bigint): bigint {
  if (blockNumber === 0n) throw new Error("fixture transition block must be greater than zero");

  return blockNumber - 1n;
}

async function expectFolioExecutionReceipt(params: {
  readonly publicClient: PublicClient;
  readonly folio: Address;
  readonly actor: Address;
  readonly transactionHash: Hash;
  readonly blockNumber: bigint;
  readonly transactionTarget: Address | undefined;
  readonly abi: Abi;
  readonly eventName: "RebalanceStarted" | "AuctionOpened";
  readonly nonce: bigint;
  readonly auctionId?: bigint;
  readonly tokens: readonly Address[];
}) {
  if (!params.transactionTarget) throw new Error(`${params.eventName} transaction target is missing`);
  const receipt = await params.publicClient.getTransactionReceipt({ hash: params.transactionHash });

  expect(receipt.status, `${params.eventName} receipt status`).toBe("success");
  expect(receipt.transactionHash, `${params.eventName} transaction hash`).toBe(params.transactionHash);
  expect(receipt.blockNumber, `${params.eventName} receipt block`).toBe(params.blockNumber);
  expect(receipt.from.toLowerCase(), `${params.eventName} actor`).toBe(params.actor.toLowerCase());
  expect(receipt.to?.toLowerCase(), `${params.eventName} transaction target`).toBe(
    params.transactionTarget.toLowerCase(),
  );

  const event = parseEventLogs({
    abi: params.abi,
    logs: receipt.logs.filter(({ address }) => address.toLowerCase() === params.folio.toLowerCase()),
    strict: false,
  }).find((log) => log.eventName === params.eventName) as
    | {
        readonly args: {
          readonly nonce?: bigint;
          readonly rebalanceNonce?: bigint;
          readonly auctionId?: bigint;
          readonly tokens?: readonly (Address | { readonly token: Address })[];
          readonly startTime?: bigint;
          readonly endTime?: bigint;
        };
      }
    | undefined;
  expect(event, `${params.eventName} Folio event`).toBeDefined();
  if (!event?.args.tokens) throw new Error(`${params.eventName} event tokens are missing`);
  const eventTokens = event.args.tokens.map((token) => (typeof token === "string" ? token : token.token));

  expect(event.args.nonce ?? event.args.rebalanceNonce, `${params.eventName} nonce`).toBe(params.nonce);
  if (params.eventName === "AuctionOpened") {
    expect(event.args.auctionId, `${params.eventName} auction id`).toBe(params.auctionId);
  }
  expect(normalizeAddresses(eventTokens), `${params.eventName} tokens`).toEqual(normalizeAddresses(params.tokens));

  return { startTime: event.args.startTime, endTime: event.args.endTime };
}

type GovernanceExecutionExpectation = {
  readonly publicClient: PublicClient;
  readonly governance: Address;
  readonly actor: Address;
  readonly evidence: ForkExecutedGovernanceEvidence;
  readonly optimistic: boolean;
  readonly stateBlock: bigint;
  readonly folio: Address;
} & (
  | { readonly action: "authority"; readonly timelock: Address }
  | {
      readonly action: "rebalance";
      readonly tokens: readonly Address[];
      readonly nonce: bigint;
      readonly deadline: bigint;
    }
);

async function expectGovernanceExecutionEvidence(params: GovernanceExecutionExpectation) {
  const { publicClient, governance, actor, evidence, optimistic, stateBlock } = params;
  const [proposalReceipt, executeReceipt, state, isOptimistic] = await Promise.all([
    publicClient.getTransactionReceipt({ hash: evidence.proposalTxHash }),
    publicClient.getTransactionReceipt({ hash: evidence.executeTxHash }),
    publicClient.readContract({
      address: governance,
      abi: dtfIndexGovernanceAbi,
      functionName: "state",
      args: [evidence.proposalId],
      blockNumber: stateBlock,
    }),
    publicClient.readContract({
      address: governance,
      abi: dtfIndexGovernanceOptimisticAbi,
      functionName: "isOptimistic",
      args: [evidence.proposalId],
      blockNumber: stateBlock,
    }),
  ]);

  for (const [receipt, hash, block, eventName] of [
    [proposalReceipt, evidence.proposalTxHash, evidence.proposalBlock, "ProposalCreated"],
    [executeReceipt, evidence.executeTxHash, evidence.executeBlock, "ProposalExecuted"],
  ] as const) {
    expect(receipt.status, `${eventName} receipt status`).toBe("success");
    expect(receipt.transactionHash, `${eventName} transaction hash`).toBe(hash);
    expect(receipt.blockNumber, `${eventName} receipt block`).toBe(block);
    expect(receipt.from.toLowerCase(), `${eventName} actor`).toBe(actor.toLowerCase());
    expect(receipt.to?.toLowerCase(), `${eventName} governance target`).toBe(governance.toLowerCase());
    const matchingEvent = parseEventLogs({ abi: dtfIndexGovernanceAbi, logs: receipt.logs, strict: false }).find(
      (log) => log.eventName === eventName && log.args.proposalId === evidence.proposalId,
    );
    expect(matchingEvent, `${eventName} proposal linkage`).toBeDefined();
  }

  const created = parseEventLogs({ abi: dtfIndexGovernanceAbi, logs: proposalReceipt.logs, strict: false }).find(
    (log) => log.eventName === "ProposalCreated" && log.args.proposalId === evidence.proposalId,
  );
  if (!created || created.eventName !== "ProposalCreated") {
    throw new Error(`ProposalCreated ${evidence.proposalId} is missing`);
  }
  const createdArgs = created.args as {
    readonly proposer?: Address;
    readonly targets?: readonly Address[];
    readonly values?: readonly bigint[];
    readonly signatures?: readonly string[];
    readonly calldatas?: readonly Hex[];
    readonly description?: string;
  };
  if (
    !createdArgs.proposer ||
    !createdArgs.targets ||
    !createdArgs.values ||
    !createdArgs.signatures ||
    !createdArgs.calldatas ||
    createdArgs.description === undefined
  ) {
    throw new Error(`ProposalCreated ${evidence.proposalId} payload is incomplete`);
  }
  expect(createdArgs.proposer.toLowerCase(), "proposal proposer").toBe(actor.toLowerCase());
  expect(createdArgs.description, "proposal description").toBe(evidence.description);
  expect(createdArgs.values, "proposal values").toEqual(createdArgs.targets.map(() => 0n));
  expect(createdArgs.signatures, "proposal signatures").toEqual(createdArgs.targets.map(() => ""));
  expect(createdArgs.calldatas, "proposal calldata count").toHaveLength(createdArgs.targets.length);

  if (params.action === "authority") {
    expect(normalizeAddresses(createdArgs.targets), "authority proposal targets").toEqual(
      normalizeAddresses([params.timelock, params.folio]),
    );
    const roleGrants = createdArgs.calldatas.map((calldata) =>
      decodeFunctionData({ abi: folioArtifactAbi, data: calldata }),
    );
    expect(
      roleGrants.map(({ functionName }) => functionName),
      "authority actions",
    ).toEqual(["grantRole", "grantRole"]);
    expect(roleGrants[0]?.args, "optimistic proposer authority").toEqual([OPTIMISTIC_PROPOSER_ROLE, actor]);
    expect(roleGrants[1]?.args, "auction launcher authority").toEqual([AUCTION_LAUNCHER_ROLE, actor]);
  } else {
    expect(normalizeAddresses(createdArgs.targets), "rebalance proposal target").toEqual([params.folio.toLowerCase()]);
    expect(createdArgs.calldatas, "rebalance proposal call count").toHaveLength(1);
    const rebalance = decodeFunctionData({ abi: folioArtifactAbi, data: createdArgs.calldatas[0]! });
    expect(rebalance.functionName, "rebalance proposal action").toBe("startRebalance");
    if (rebalance.functionName !== "startRebalance") throw new Error("rebalance proposal must call startRebalance");
    expect(rebalance.args[0], "rebalance proposal nonce").toBe(params.nonce);
    expect(normalizeAddresses(rebalance.args[1].map(({ token }) => token)), "rebalance proposal tokens").toEqual(
      normalizeAddresses(params.tokens),
    );
    expect(rebalance.args[5], "rebalance proposal deadline").toBe(params.deadline);
  }

  expect(state, `proposal ${evidence.proposalId} state`).toBe(7);
  expect(isOptimistic, `proposal ${evidence.proposalId} mechanism`).toBe(optimistic);
}

function normalizeAddresses(addresses: readonly string[]): readonly string[] {
  return addresses.map((address) => address.toLowerCase());
}
