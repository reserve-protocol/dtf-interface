/// <reference types="node" />

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { decodeFunctionData, getAddress, isHex, zeroAddress, type Address, type Hash, type Hex } from "viem";

import type { SupportedChainId } from "@/config";

import { dtfAdminProposalAbi } from "@/index-dtf/abis/dtf-admin-proposal";
import { selectorRegistryAbi } from "@/index-dtf/abis/selector-registry";

const upgradeSpellEvidenceAbi = [
  {
    type: "function",
    name: "cast",
    inputs: [
      { name: "folio", type: "address" },
      { name: "proxyAdmin", type: "address" },
      { name: "selectorRegistry", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export type ForkUpgradeProposalEvidence = {
  readonly proposalId: bigint;
  readonly proposalBlock: bigint;
  readonly executeBlock: bigint;
  readonly targets: readonly Address[];
  readonly values: readonly bigint[];
  readonly calldatas: readonly Hex[];
  readonly selectors: readonly Hex[];
};

export type ForkExecutedGovernanceEvidence = {
  readonly kind: "standard" | "optimistic";
  readonly optimistic: boolean;
  readonly description: string;
  readonly proposalId: bigint;
  readonly proposalTxHash: Hash;
  readonly proposalBlock: bigint;
  readonly executeTxHash: Hash;
  readonly executeBlock: bigint;
};

type ForkExecutionState = {
  readonly actor: Address;
  readonly tokens: readonly Address[];
  readonly rebalanceNonce: bigint;
  readonly rebalanceTxHash: Hash;
  readonly rebalanceBlock: bigint;
  readonly auctionId: bigint;
  readonly auctionTxHash: Hash;
  readonly auctionBlock: bigint;
  readonly auctionLength: bigint;
};

export type ForkV5ExecutionEvidence = ForkExecutionState & {
  readonly roleAuthority: "direct-admin";
};

export type ForkV6ExecutionEvidence = ForkExecutionState & {
  readonly roleAuthority: "optimistic-governance";
  readonly governanceMechanism: "optimistic";
  readonly authority: ForkExecutedGovernanceEvidence & { readonly kind: "standard"; readonly optimistic: false };
  readonly rebalanceProposal: ForkExecutedGovernanceEvidence & {
    readonly kind: "optimistic";
    readonly optimistic: true;
  };
  readonly deadline: bigint;
};

export type ForkExecutionEvidence = ForkV5ExecutionEvidence | ForkV6ExecutionEvidence;

export type ForkScenario = {
  readonly label: "v5Control" | "v5OptimisticUpgrade" | "v5LegacyUpgrade" | "v6Native";
  readonly folio: Address;
  readonly proxyAdmin: Address;
  readonly governance?: Address;
  readonly governanceKind: "standard" | "optimistic";
  readonly governanceAddresses?: {
    readonly governor: Address;
    readonly timelock: Address;
    readonly stakingVault: Address;
    readonly selectorRegistry: Address;
  };
  readonly creationBlock: bigint;
  readonly upgradeBlock?: bigint;
  readonly proposalCallCount?: number;
  readonly proposal?: ForkUpgradeProposalEvidence;
  readonly execution?: ForkExecutionEvidence;
  readonly expectedVersion: "5.0.0" | "6.0.0";
};

export type ForkSmokeConfig = {
  readonly chainId: SupportedChainId;
  readonly rpcUrl: string;
  readonly forkBlock: bigint;
  readonly stateBlock: bigint;
  readonly stateTimestamp: bigint;
  readonly writePaths: {
    readonly deadline: bigint;
    readonly auctionLength: bigint;
  };
  readonly protocol: {
    readonly v5Deployer: Address;
    readonly v6Deployer: Address;
    readonly v6Implementation: Address;
    readonly versionRegistry: Address;
    readonly upgradeSpell: Address;
    readonly upgradeSpellSourceCommit: string;
  };
  readonly scenarios: readonly [ForkScenario, ForkScenario, ForkScenario, ForkScenario];
};

type RuntimeEnv = Readonly<Record<string, string | undefined>>;

type FixtureRecord = Readonly<Record<string, unknown>>;

export function readForkSmokeConfig(env: RuntimeEnv): ForkSmokeConfig {
  const manifestPath = resolveManifestPath(env);
  let manifest: unknown;

  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read INDEX_DTF_FORK_MANIFEST at ${manifestPath}`, { cause: error });
  }

  return parseForkSmokeManifest(manifest, env.INDEX_DTF_FORK_RPC_URL);
}

export function parseForkSmokeManifest(input: unknown, rpcUrlOverride?: string): ForkSmokeConfig {
  const manifest = readRecord(input, "manifest");
  if (manifest.schemaVersion !== 1) throw new Error("fixture manifest schemaVersion must be 1");

  const chainId = readChainId(manifest.chainId);
  const forkBlock = readBlock(manifest.forkBlock, "forkBlock");
  const stateBlock = readBlock(manifest.stateBlock, "stateBlock");
  if (forkBlock >= stateBlock) throw new Error("forkBlock must be before stateBlock");
  const stateTimestamp = readPositiveInteger(manifest.stateTimestamp, "stateTimestamp");
  const writePaths = readRecord(manifest.writePaths, "writePaths");
  const deadline = readPositiveInteger(writePaths.deadline, "writePaths.deadline");
  const auctionLength = readPositiveInteger(writePaths.auctionLength, "writePaths.auctionLength");
  if (deadline <= stateTimestamp) throw new Error("writePaths.deadline must be after stateTimestamp");
  const protocol = readRecord(manifest.protocol, "protocol");
  const v5Deployer = readAddress(protocol.v5Deployer, "protocol.v5Deployer");
  const v6Deployer = readAddress(protocol.v6Deployer, "protocol.v6Deployer");
  const v6Implementation = readAddress(protocol.v6Implementation, "protocol.v6Implementation");
  const versionRegistry = readAddress(protocol.versionRegistry, "protocol.versionRegistry");
  const upgradeSpell = readAddress(protocol.upgradeSpell, "protocol.upgradeSpell");
  const upgradeSpellSourceCommit = readGitCommit(
    protocol.upgradeSpellSourceCommit,
    "protocol.upgradeSpellSourceCommit",
  );
  const startRebalanceSelectors = readRecord(protocol.startRebalanceSelectors, "protocol.startRebalanceSelectors");
  const v5StartRebalanceSelector = readSelector(startRebalanceSelectors.v5, "protocol.startRebalanceSelectors.v5");
  const v6StartRebalanceSelector = readSelector(startRebalanceSelectors.v6, "protocol.startRebalanceSelectors.v6");
  const scenarios = readRecord(manifest.scenarios, "scenarios");
  const evidence = {
    upgradeSpell,
    v5StartRebalanceSelector,
    v6StartRebalanceSelector,
    stateBlock,
    writePathDeadline: deadline,
    writePathAuctionLength: auctionLength,
  };
  const parsedScenarios = [
    readScenario(scenarios, "v5Control", "5.0.0", "standard", false, false, "v5-direct", evidence),
    readScenario(scenarios, "v5OptimisticUpgrade", "6.0.0", "optimistic", true, true, undefined, evidence),
    readScenario(scenarios, "v5LegacyUpgrade", "6.0.0", "standard", true, true, undefined, evidence),
    readScenario(scenarios, "v6Native", "6.0.0", "optimistic", true, false, "v6-optimistic", evidence),
  ] as const;
  if (new Set(parsedScenarios.map((scenario) => scenario.folio.toLowerCase())).size !== parsedScenarios.length) {
    throw new Error("fixture scenarios must use four distinct Folio addresses");
  }
  if (parsedScenarios.some((scenario) => scenario.creationBlock <= forkBlock)) {
    throw new Error("every scenario creationBlock must be after forkBlock");
  }
  const latestTransitionBlock = parsedScenarios.reduce(
    (latest, scenario) => maxBigInt(latest, scenario.creationBlock, scenario.upgradeBlock ?? 0n),
    0n,
  );

  if (stateBlock < latestTransitionBlock) {
    throw new Error("stateBlock must be at or after every scenario transition block");
  }

  const rpcUrl = rpcUrlOverride?.trim() || readString(manifest.rpcUrl, "rpcUrl");
  assertLocalRpcUrl(rpcUrl);

  return {
    chainId,
    rpcUrl,
    forkBlock,
    stateBlock,
    stateTimestamp,
    writePaths: { deadline, auctionLength },
    protocol: {
      v5Deployer,
      v6Deployer,
      v6Implementation,
      versionRegistry,
      upgradeSpell,
      upgradeSpellSourceCommit,
    },
    scenarios: parsedScenarios,
  };
}

function resolveManifestPath(env: RuntimeEnv): string {
  const explicitPath = env.INDEX_DTF_FORK_MANIFEST?.trim();
  if (explicitPath) return resolve(explicitPath);

  const stateDirectory = env.SANDBOX_STATE_DIR?.trim();
  if (stateDirectory) return resolve(stateDirectory, "fixture.json");

  throw new Error("INDEX_DTF_FORK_MANIFEST or SANDBOX_STATE_DIR is required when RUN_INDEX_DTF_FORK_SMOKE=1");
}

function readScenario(
  scenarios: FixtureRecord,
  label: ForkScenario["label"],
  expectedVersion: ForkScenario["expectedVersion"],
  expectedGovernanceKind: ForkScenario["governanceKind"],
  requiresGovernance: boolean,
  requiresUpgrade: boolean,
  executionKind: "v5-direct" | "v6-optimistic" | undefined,
  evidence: {
    readonly upgradeSpell: Address;
    readonly v5StartRebalanceSelector: Hex;
    readonly v6StartRebalanceSelector: Hex;
    readonly stateBlock: bigint;
    readonly writePathDeadline: bigint;
    readonly writePathAuctionLength: bigint;
  },
): ForkScenario {
  const scenario = readRecord(scenarios[label], `scenarios.${label}`);
  const folio = readAddress(scenario.folio ?? scenario.address, `scenarios.${label}.folio`);
  const proxyAdmin = readAddress(scenario.proxyAdmin, `scenarios.${label}.proxyAdmin`);
  const governanceKind = readString(scenario.governanceKind, `scenarios.${label}.governanceKind`);
  if (governanceKind !== expectedGovernanceKind) {
    throw new Error(`scenarios.${label}.governanceKind must be ${expectedGovernanceKind}`);
  }
  const creationBlock = readBlock(scenario.creationBlock, `scenarios.${label}.creationBlock`);
  const upgradeBlock = requiresUpgrade
    ? readBlock(scenario.upgradeBlock, `scenarios.${label}.upgradeBlock`)
    : undefined;
  const proposalCallCount = readOptionalPositiveSafeInteger(
    scenario.proposalCallCount,
    `scenarios.${label}.proposalCallCount`,
  );

  if (upgradeBlock !== undefined && creationBlock >= upgradeBlock) {
    throw new Error(`scenarios.${label}.creationBlock must be before its upgradeBlock`);
  }

  const governance = readScenarioGovernance(scenario, label, governanceKind, requiresGovernance);
  const proposal =
    upgradeBlock === undefined
      ? undefined
      : readUpgradeProposalEvidence(scenario, {
          label,
          folio,
          proxyAdmin,
          governanceKind,
          creationBlock,
          upgradeBlock,
          proposalCallCount,
          ...governance,
          ...evidence,
        });
  const execution =
    executionKind === undefined
      ? undefined
      : readExecutionEvidence(scenario, {
          label,
          creationBlock,
          governanceKind,
          executionKind,
          ...evidence,
        });

  return {
    label,
    folio,
    proxyAdmin,
    governanceKind,
    ...(governance.governance ? { governance: governance.governance } : {}),
    ...(governance.governanceAddresses ? { governanceAddresses: governance.governanceAddresses } : {}),
    creationBlock,
    ...(upgradeBlock === undefined ? {} : { upgradeBlock }),
    ...(proposalCallCount === undefined ? {} : { proposalCallCount }),
    ...(proposal === undefined ? {} : { proposal }),
    ...(execution === undefined ? {} : { execution }),
    expectedVersion,
  };
}

function readExecutionEvidence(
  scenario: FixtureRecord,
  context: {
    readonly label: ForkScenario["label"];
    readonly creationBlock: bigint;
    readonly governanceKind: ForkScenario["governanceKind"];
    readonly executionKind: "v5-direct" | "v6-optimistic";
    readonly stateBlock: bigint;
    readonly writePathDeadline: bigint;
    readonly writePathAuctionLength: bigint;
  },
): ForkExecutionEvidence {
  const field = `scenarios.${context.label}.execution`;
  const execution = readRecord(scenario.execution, field);
  const actor = readAddress(execution.actor, `${field}.actor`);
  const tokens = readArray(execution.tokens, `${field}.tokens`).map((value, index) =>
    readAddress(value, `${field}.tokens[${index}]`),
  );
  if (tokens.length < 2 || new Set(tokens.map((token) => token.toLowerCase())).size !== tokens.length) {
    throw new Error(`${field}.tokens must contain at least two distinct addresses`);
  }
  const rebalanceNonce = readPositiveInteger(execution.rebalanceNonce, `${field}.rebalanceNonce`);
  if (rebalanceNonce !== 1n) throw new Error(`${field}.rebalanceNonce must be 1`);
  const rebalanceTxHash = readHash(execution.rebalanceTxHash, `${field}.rebalanceTxHash`);
  const rebalanceBlock = readBlock(execution.rebalanceBlock, `${field}.rebalanceBlock`);
  const auctionId = readNonNegativeInteger(execution.auctionId, `${field}.auctionId`);
  if (auctionId !== 0n) throw new Error(`${field}.auctionId must be 0`);
  const auctionTxHash = readHash(execution.auctionTxHash, `${field}.auctionTxHash`);
  const auctionBlock = readBlock(execution.auctionBlock, `${field}.auctionBlock`);
  const auctionLength = readPositiveInteger(execution.auctionLength, `${field}.auctionLength`);
  if (auctionLength !== context.writePathAuctionLength || auctionLength !== 300n) {
    throw new Error(`${field}.auctionLength must match writePaths.auctionLength and equal 300`);
  }
  if (context.creationBlock >= rebalanceBlock || rebalanceBlock >= auctionBlock || auctionBlock > context.stateBlock) {
    throw new Error(`${field} blocks must satisfy creationBlock < rebalanceBlock < auctionBlock <= stateBlock`);
  }
  if (rebalanceTxHash.toLowerCase() === auctionTxHash.toLowerCase()) {
    throw new Error(`${field} rebalance and auction transactions must differ`);
  }

  const common = {
    actor,
    tokens,
    rebalanceNonce,
    rebalanceTxHash,
    rebalanceBlock,
    auctionId,
    auctionTxHash,
    auctionBlock,
    auctionLength,
  } as const;

  if (context.executionKind === "v5-direct") {
    if (execution.roleAuthority !== "direct-admin" || context.governanceKind !== "standard") {
      throw new Error(`${field} must describe the standard-topology direct-admin path`);
    }
    if (
      execution.governanceMechanism !== undefined ||
      execution.authority !== undefined ||
      execution.rebalanceProposal !== undefined
    ) {
      throw new Error(`${field} direct-admin path must not contain governance proposal evidence`);
    }

    return { ...common, roleAuthority: "direct-admin" };
  }

  if (
    execution.roleAuthority !== "optimistic-governance" ||
    execution.governanceMechanism !== "optimistic" ||
    context.governanceKind !== "optimistic"
  ) {
    throw new Error(`${field} must describe the optimistic-governance path`);
  }
  const authority = readExecutedGovernanceEvidence(execution.authority, `${field}.authority`, "standard", false);
  const rebalanceProposal = readExecutedGovernanceEvidence(
    execution.rebalanceProposal,
    `${field}.rebalanceProposal`,
    "optimistic",
    true,
  );
  const deadline = readPositiveInteger(execution.deadline, `${field}.deadline`);
  const proposalRecord = readRecord(execution.rebalanceProposal, `${field}.rebalanceProposal`);
  const proposalDeadline = readPositiveInteger(proposalRecord.deadline, `${field}.rebalanceProposal.deadline`);
  if (deadline !== proposalDeadline || deadline !== context.writePathDeadline) {
    throw new Error(`${field} deadlines must match writePaths.deadline`);
  }
  if (
    context.creationBlock >= authority.proposalBlock ||
    authority.proposalBlock >= authority.executeBlock ||
    authority.executeBlock >= rebalanceProposal.proposalBlock ||
    rebalanceProposal.proposalBlock >= rebalanceProposal.executeBlock ||
    rebalanceProposal.executeBlock !== rebalanceBlock ||
    rebalanceProposal.executeTxHash.toLowerCase() !== rebalanceTxHash.toLowerCase()
  ) {
    throw new Error(`${field} governance, rebalance, and transaction linkage is inconsistent`);
  }
  if (
    authority.proposalId === rebalanceProposal.proposalId ||
    authority.proposalTxHash.toLowerCase() === rebalanceProposal.proposalTxHash.toLowerCase()
  ) {
    throw new Error(`${field} authority and rebalance proposals must be distinct`);
  }

  return {
    ...common,
    roleAuthority: "optimistic-governance",
    governanceMechanism: "optimistic",
    authority: { ...authority, kind: "standard", optimistic: false },
    rebalanceProposal: { ...rebalanceProposal, kind: "optimistic", optimistic: true },
    deadline,
  };
}

function readExecutedGovernanceEvidence(
  value: unknown,
  field: string,
  kind: ForkExecutedGovernanceEvidence["kind"],
  optimistic: boolean,
): ForkExecutedGovernanceEvidence {
  const proposal = readRecord(value, field);
  if (proposal.kind !== kind || proposal.optimistic !== optimistic || proposal.state !== "executed") {
    throw new Error(`${field} must describe an executed ${kind} proposal`);
  }
  const description = readString(proposal.description, `${field}.description`);

  return {
    kind,
    optimistic,
    description,
    proposalId: readPositiveInteger(proposal.proposalId, `${field}.proposalId`),
    proposalTxHash: readHash(proposal.proposalTxHash, `${field}.proposalTxHash`),
    proposalBlock: readBlock(proposal.proposalBlock, `${field}.proposalBlock`),
    executeTxHash: readHash(proposal.executeTxHash, `${field}.executeTxHash`),
    executeBlock: readBlock(proposal.executeBlock, `${field}.executeBlock`),
  };
}

function readScenarioGovernance(
  scenario: FixtureRecord,
  label: ForkScenario["label"],
  governanceKind: ForkScenario["governanceKind"],
  required: boolean,
): {
  readonly governance?: Address;
  readonly selectorRegistry?: Address;
  readonly governanceAddresses?: NonNullable<ForkScenario["governanceAddresses"]>;
} {
  if (!required && (scenario.governance === undefined || scenario.governance === zeroAddress)) return {};

  const governance = readAddress(scenario.governance, `scenarios.${label}.governance`);
  const addresses = readRecord(scenario.governanceAddresses, `scenarios.${label}.governanceAddresses`);
  const governor = readAddress(addresses.governor, `scenarios.${label}.governanceAddresses.governor`);
  const selectorRegistry = readEthereumAddress(
    addresses.selectorRegistry,
    `scenarios.${label}.governanceAddresses.selectorRegistry`,
  );
  const timelock = readAddress(addresses.timelock, `scenarios.${label}.governanceAddresses.timelock`);
  const stakingVault = readAddress(addresses.stakingVault, `scenarios.${label}.governanceAddresses.stakingVault`);

  if (governor !== governance) throw new Error(`scenarios.${label} governance must equal governanceAddresses.governor`);
  if (governanceKind === "optimistic" && selectorRegistry === zeroAddress) {
    throw new Error(`scenarios.${label} optimistic governance requires a non-zero selectorRegistry`);
  }
  if (governanceKind === "standard" && selectorRegistry !== zeroAddress) {
    throw new Error(`scenarios.${label} standard governance requires a zero selectorRegistry`);
  }

  return {
    governance,
    selectorRegistry,
    governanceAddresses: { governor, timelock, stakingVault, selectorRegistry },
  };
}

function readUpgradeProposalEvidence(
  scenario: FixtureRecord,
  context: {
    readonly label: ForkScenario["label"];
    readonly folio: Address;
    readonly proxyAdmin: Address;
    readonly governanceKind: ForkScenario["governanceKind"];
    readonly governance?: Address;
    readonly selectorRegistry?: Address;
    readonly creationBlock: bigint;
    readonly upgradeBlock: bigint;
    readonly proposalCallCount: number | undefined;
    readonly upgradeSpell: Address;
    readonly v5StartRebalanceSelector: Hex;
    readonly v6StartRebalanceSelector: Hex;
  },
): ForkUpgradeProposalEvidence {
  const field = `scenarios.${context.label}.proposal`;
  const proposal = readRecord(scenario.proposal, field);
  if (proposal.kind !== "standard" || proposal.optimistic !== false || proposal.state !== "executed") {
    throw new Error(`${field} must describe an executed standard proposal`);
  }
  const proposalId = readPositiveInteger(proposal.proposalId, `${field}.proposalId`);
  readString(proposal.entityId, `${field}.entityId`);
  const proposalBlock = readBlock(proposal.proposalBlock, `${field}.proposalBlock`);
  const executeBlock = readBlock(proposal.executeBlock, `${field}.executeBlock`);
  if (
    proposalBlock <= context.creationBlock ||
    proposalBlock >= executeBlock ||
    executeBlock !== context.upgradeBlock
  ) {
    throw new Error(`${field} blocks must satisfy creationBlock < proposalBlock < executeBlock == upgradeBlock`);
  }

  const callCount = context.proposalCallCount;
  if (callCount === undefined) throw new Error(`scenarios.${context.label}.proposalCallCount is required`);
  const targets = readArray(proposal.targets, `${field}.targets`).map((value, index) =>
    readAddress(value, `${field}.targets[${index}]`),
  );
  const values = readArray(proposal.values, `${field}.values`).map((value, index) =>
    readNonNegativeInteger(value, `${field}.values[${index}]`),
  );
  const calldatas = readArray(proposal.calldatas, `${field}.calldatas`).map((value, index) =>
    readHex(value, `${field}.calldatas[${index}]`),
  );
  const selectors = readArray(proposal.selectors, `${field}.selectors`).map((value, index) =>
    readSelector(value, `${field}.selectors[${index}]`),
  );

  if ([targets.length, values.length, calldatas.length, selectors.length].some((length) => length !== callCount)) {
    throw new Error(`${field} call arrays must match proposalCallCount`);
  }
  if (values.some((value) => value !== 0n)) throw new Error(`${field}.values must all be zero`);
  for (let index = 0; index < selectors.length; index += 1) {
    if (calldatas[index]!.slice(0, 10).toLowerCase() !== selectors[index]!.toLowerCase()) {
      throw new Error(`${field}.selectors[${index}] must match its calldata selector`);
    }
  }

  assertUpgradeCallPath({ ...context, targets, calldatas });

  return { proposalId, proposalBlock, executeBlock, targets, values, calldatas, selectors };
}

function assertUpgradeCallPath(context: {
  readonly label: ForkScenario["label"];
  readonly folio: Address;
  readonly proxyAdmin: Address;
  readonly governanceKind: ForkScenario["governanceKind"];
  readonly selectorRegistry?: Address;
  readonly upgradeSpell: Address;
  readonly v5StartRebalanceSelector: Hex;
  readonly v6StartRebalanceSelector: Hex;
  readonly targets: readonly Address[];
  readonly calldatas: readonly Hex[];
}) {
  const { label, targets, calldatas } = context;
  const expectedTargets =
    context.governanceKind === "optimistic"
      ? [context.selectorRegistry, context.selectorRegistry, context.proxyAdmin, context.upgradeSpell]
      : [context.proxyAdmin, context.upgradeSpell];
  if (
    targets.length !== expectedTargets.length ||
    targets.some((target, index) => target.toLowerCase() !== expectedTargets[index]?.toLowerCase())
  ) {
    throw new Error(`scenarios.${label}.proposal targets do not match the ${context.governanceKind} upgrade path`);
  }

  let callIndex = 0;
  if (context.governanceKind === "optimistic") {
    const registered = decodeFunctionData({ abi: selectorRegistryAbi, data: calldatas[callIndex++]! });
    const unregistered = decodeFunctionData({ abi: selectorRegistryAbi, data: calldatas[callIndex++]! });
    expectSelectorChange(registered, "registerSelectors", context.folio, context.v6StartRebalanceSelector, label);
    expectSelectorChange(unregistered, "unregisterSelectors", context.folio, context.v5StartRebalanceSelector, label);
  }

  const transfer = decodeFunctionData({ abi: dtfAdminProposalAbi, data: calldatas[callIndex++]! });
  if (transfer.functionName !== "transferOwnership" || transfer.args[0] !== context.upgradeSpell) {
    throw new Error(`scenarios.${label}.proposal must transfer ProxyAdmin ownership to the upgrade spell`);
  }
  const cast = decodeFunctionData({ abi: upgradeSpellEvidenceAbi, data: calldatas[callIndex]! });
  const expectedSelectorRegistry = context.governanceKind === "optimistic" ? context.selectorRegistry : zeroAddress;
  if (
    cast.functionName !== "cast" ||
    cast.args[0] !== context.folio ||
    cast.args[1] !== context.proxyAdmin ||
    cast.args[2] !== expectedSelectorRegistry
  ) {
    throw new Error(`scenarios.${label}.proposal cast calldata does not match the declared upgrade path`);
  }
}

function expectSelectorChange(
  decoded: ReturnType<typeof decodeFunctionData>,
  functionName: "registerSelectors" | "unregisterSelectors",
  folio: Address,
  selector: Hex,
  label: ForkScenario["label"],
) {
  if (decoded.functionName !== functionName) {
    throw new Error(`scenarios.${label}.proposal must call ${functionName}`);
  }
  const selectorData = decoded.args[0] as readonly { readonly target: Address; readonly selectors: readonly Hex[] }[];
  if (
    selectorData.length !== 1 ||
    selectorData[0]?.target !== folio ||
    selectorData[0]?.selectors.length !== 1 ||
    selectorData[0]?.selectors[0]?.toLowerCase() !== selector.toLowerCase()
  ) {
    throw new Error(`scenarios.${label}.proposal ${functionName} calldata does not match the Folio selector`);
  }
}

function readRecord(value: unknown, field: string): FixtureRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${field} must be an object`);
  }

  return value as FixtureRecord;
}

function readArray(value: unknown, field: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);

  return value;
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${field} must be a non-empty string`);

  return value.trim();
}

function readAddress(value: unknown, field: string): Address {
  const address = readEthereumAddress(value, field);
  if (address === zeroAddress) throw new Error(`${field} must be a non-zero Ethereum address`);

  return address;
}

function readEthereumAddress(value: unknown, field: string): Address {
  try {
    return getAddress(readString(value, field));
  } catch (error) {
    throw new Error(`${field} must be an Ethereum address`, { cause: error });
  }
}

function readHex(value: unknown, field: string): Hex {
  if (typeof value !== "string" || !isHex(value) || value.length < 10) throw new Error(`${field} must be calldata hex`);

  return value;
}

function readSelector(value: unknown, field: string): Hex {
  const selector = readHex(value, field);
  if (selector.length !== 10) throw new Error(`${field} must be a bytes4 selector`);

  return selector;
}

function readHash(value: unknown, field: string): Hash {
  const hash = readHex(value, field);
  if (hash.length !== 66) throw new Error(`${field} must be a bytes32 transaction hash`);

  return hash;
}

function readGitCommit(value: unknown, field: string): string {
  const commit = readString(value, field);
  if (!/^[0-9a-f]{40}$/i.test(commit)) throw new Error(`${field} must be a full Git commit hash`);

  return commit.toLowerCase();
}

function readBlock(value: unknown, field: string): bigint {
  return readPositiveInteger(value, field);
}

function readPositiveInteger(value: unknown, field: string): bigint {
  if (typeof value !== "string" && typeof value !== "number") {
    throw new Error(`${field} must be a positive integer string or safe integer`);
  }
  if (typeof value === "number" && (!Number.isSafeInteger(value) || value <= 0)) {
    throw new Error(`${field} must be a positive safe integer`);
  }

  try {
    const block = BigInt(value);
    if (block <= 0n) throw new Error();
    return block;
  } catch {
    throw new Error(`${field} must be a positive integer`);
  }
}

function readNonNegativeInteger(value: unknown, field: string): bigint {
  if (typeof value !== "string" && typeof value !== "number") {
    throw new Error(`${field} must be a non-negative integer string or safe integer`);
  }
  if (typeof value === "number" && (!Number.isSafeInteger(value) || value < 0)) {
    throw new Error(`${field} must be a non-negative safe integer`);
  }

  try {
    const number = BigInt(value);
    if (number < 0n) throw new Error();
    return number;
  } catch {
    throw new Error(`${field} must be a non-negative integer`);
  }
}

function readOptionalPositiveSafeInteger(value: unknown, field: string): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${field} must be a positive safe integer`);
  }

  return value;
}

function readChainId(value: unknown): SupportedChainId {
  if (value === 1 || value === 8453 || value === 56) return value;

  throw new Error("chainId must be 1, 8453, or 56");
}

function assertLocalRpcUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("rpcUrl must be a valid URL");
  }

  if (url.protocol !== "http:" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
    throw new Error("rpcUrl must use HTTP on localhost, 127.0.0.1, or ::1");
  }
}

function maxBigInt(...values: readonly bigint[]): bigint {
  return values.reduce((max, value) => (value > max ? value : max), 0n);
}
