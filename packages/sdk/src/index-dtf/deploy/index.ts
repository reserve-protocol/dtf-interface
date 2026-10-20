import {
  getAddress,
  isAddressEqual,
  keccak256,
  parseEventLogs,
  zeroAddress,
  type Address,
  type Hex,
  type Log,
} from "viem";

import type { SupportedChainId } from "@/config";
import type { IndexDtfFeeRecipient } from "@/index-dtf/fee-recipients";
import type { IndexDtfRevenueRecipientInput } from "@/index-dtf/governance/propose/revenue";
import type { ContractCallPlan } from "@/lib/contract-call";
import type { IndexDtfCall } from "@/types/governance";
import type { PriceControl } from "@/types/index-dtf";

import { indexDtfDeployerAbi } from "@/index-dtf/abis/deployer";
import { folioDeployerV6Abi } from "@/index-dtf/abis/folio-deployer-v6.generated";
import { indexDtfGovernanceDeployerAbi } from "@/index-dtf/abis/governance-deployer";
import { optimisticGovernorDeployerAbi } from "@/index-dtf/abis/optimistic-governor-deployer";
import { assertIndexDtfFeeRecipientTables, sortIndexDtfFeeRecipients } from "@/index-dtf/fee-recipients";
import { buildIndexDtfFeeRecipients } from "@/index-dtf/governance/propose/revenue";
import { prepareContractCall, prepareErc20Approval } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";
import { toUint, toUintNumber } from "@/lib/utils";

// Folio 6.0 bounds: MAX_FOLIO_FEE = 1e18, MIN/MAX_AUCTION_LENGTH = 120s / 1 week (contracts/utils/Constants.sol).
const MAX_SELF_FEE = 1_000_000_000_000_000_000n;
const MIN_AUCTION_LENGTH = 120n;
const MAX_AUCTION_LENGTH = 604_800n;
const MAX_TVL_FEE = 100_000_000_000_000_000n;
const MAX_MINT_FEE = 50_000_000_000_000_000n;
const D18 = 1_000_000_000_000_000_000n;
// Governor 1.1.0 bounds (reserve-governor contracts/utils/Constants.sol, ReserveOptimisticGovernor setters).
const MIN_VETO_DELAY = 1n;
const MIN_VETO_PERIOD = 300n;
const MAX_PROPOSAL_THROTTLE_CAPACITY = 12n;
const MIN_REWARD_HALF_LIFE = 86_400n;
const MAX_REWARD_HALF_LIFE = 1_209_600n;
const MAX_UNSTAKING_DELAY = 2_419_200n;
const MAX_REWARD_TOKENS = 20;

export const INDEX_DTF_DEPLOYER_ADDRESS = {
  1: "0x4D201a6e5BF975E2CEE9e5cbDfc803C0Ff122073",
  8453: "0x3451fD177E9a8bB4Eb8271E627A804BD22A816F9",
  56: "0x72f87239981159ed23673012EE3806Ca6114AB2A",
} as const satisfies Record<SupportedChainId, Address>;

/**
 * Folio 6.0 `FolioDeployer` per chain (`version()` 6.0.0). v6 deploys target it whether or not the chain's
 * `FolioVersionRegistry` has registered it yet; `getIndexDtfLatestVersion` reports the registry's view.
 */
export const INDEX_DTF_V6_DEPLOYER_ADDRESS = {
  1: "0x2B1Cd9aEF0CD3B9fF5DCa1C66348eCfC46F37392",
  8453: "0x4c891fCa6319d492866672E3D2AfdAAA5bDcfF67",
  56: "0x9837Ce9825D52672Ca02533B5A160212bf901963",
} as const satisfies Record<SupportedChainId, Address>;

export const INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS = {
  1: "0x72f87239981159ed23673012EE3806Ca6114AB2A",
  8453: "0xECA52a5BDBAd98a5B4B6B944C4C9cc636D4D7461",
  56: "0xA7BC1265C37A8D285cd2B10c842Efb8415A7bF9f",
} as const satisfies Record<SupportedChainId, Address>;

/**
 * Governance deployer 1.1.0 (`ReserveOptimisticGovernorDeployer`) per chain: the Folio 6.0 deployer's
 * `optimisticGovernorDeployer()`, and the factory for new optimistic staking vaults.
 */
export const INDEX_DTF_OPTIMISTIC_GOVERNOR_DEPLOYER_ADDRESS = {
  1: "0x4292433c772958ae93bebf32602ffDe0f9C5Fcd6",
  8453: "0xaC429cc5EA7f34a407f65B769c9AEA0242b075c6",
  56: "0xb4eB87250Ecd8f32BeA775dA6D164D92A398d05b",
} as const satisfies Record<SupportedChainId, Address>;

export const DEFAULT_INDEX_DTF_DEPLOY_FLAGS = {
  trustedFillerEnabled: true,
  rebalanceControl: {
    weightControl: true,
    priceControl: 1 as PriceControl,
  },
  bidsEnabled: true,
} as const satisfies IndexDtfDeployFlags;

export type IndexDtfDeployBasicDetails = {
  readonly name: string;
  readonly symbol: string;
  readonly assets: readonly Address[];
  readonly amounts: readonly bigint[];
  readonly initialShares: bigint;
};

export type IndexDtfDeployAdditionalDetails = {
  readonly auctionLength: bigint;
  readonly feeRecipients: readonly IndexDtfFeeRecipient[];
  readonly tvlFee: bigint;
  readonly mintFee: bigint;
  readonly mandate: string;
};

/** Folio 6.0 deploy details; fees are raw D18 values like the v5 shape (settings proposals take percents). */
export type IndexDtfDeployAdditionalDetailsV6 = {
  /** Seconds, 120 to 604800. */
  readonly maxAuctionLength: bigint;
  readonly feeRecipients: readonly IndexDtfFeeRecipient[];
  readonly immutableFeeRecipients: readonly IndexDtfFeeRecipient[];
  readonly tvlFee: bigint;
  readonly mintFee: bigint;
  /** D18 fraction of non-DAO fees kept for holders (`folioFeeForSelf`), at most 1e18. */
  readonly selfFee: bigint;
  readonly mandate: string;
};

export type IndexDtfDeployFlags = {
  readonly trustedFillerEnabled: boolean;
  readonly rebalanceControl: {
    readonly weightControl: boolean;
    readonly priceControl: PriceControl;
  };
  readonly bidsEnabled: boolean;
};

export type IndexDtfDeployGovernanceParams = {
  readonly votingDelay: number | bigint;
  readonly votingPeriod: number | bigint;
  readonly proposalThreshold: bigint;
  readonly quorumThreshold: bigint;
  readonly timelockDelay: number | bigint;
  readonly guardians: readonly Address[];
};

/** `IFolioDeployer.GovParams` for Folio 6.0: one optimistic governor for owner and trading. */
export type IndexDtfDeployOptimisticGovernanceParams = {
  readonly optimistic: {
    readonly vetoDelay: number | bigint;
    readonly vetoPeriod: number | bigint;
    readonly vetoThreshold: bigint;
  };
  readonly standard: {
    readonly votingDelay: number | bigint;
    readonly votingPeriod: number | bigint;
    readonly voteExtension: number | bigint;
    readonly proposalThreshold: bigint;
    readonly quorumNumerator: bigint;
  };
  readonly optimisticSelectors: readonly Hex[];
  readonly optimisticProposers: readonly Address[];
  readonly additionalGuardians: readonly Address[];
  readonly timelockDelay: number | bigint;
  readonly proposalThrottleCapacity: bigint;
};

export type IndexDtfDeployGovernanceRoles = {
  readonly existingBasketManagers?: readonly Address[];
  readonly auctionLaunchers?: readonly Address[];
  readonly brandManagers?: readonly Address[];
};

export type IndexDtfDeployRevenueDistributionParams = {
  readonly platformFee: number;
  readonly governanceShare: number;
  readonly deployerShare: number;
  readonly additionalRecipients: readonly IndexDtfRevenueRecipientInput[];
  readonly deployer: Address;
  readonly voteLock?: Address;
};

/**
 * v5 deploys through `INDEX_DTF_DEPLOYER_ADDRESS`; v6 through `INDEX_DTF_V6_DEPLOYER_ADDRESS` unless `deployer`
 * overrides it (forks, sandboxes).
 */
export type IndexDtfDeployTargetV5 = {
  readonly chainId: SupportedChainId;
  readonly version: "5.0.0";
};

export type IndexDtfDeployTargetV6 = {
  readonly chainId: SupportedChainId;
  readonly version: "6.0.0";
  /** Override for forks and sandboxes; defaults to the chain's `INDEX_DTF_V6_DEPLOYER_ADDRESS`. */
  readonly deployer?: Address;
};

type IndexDtfDeployVersion = (IndexDtfDeployTargetV5 | IndexDtfDeployTargetV6)["version"];

type IndexDtfDeployCommon = {
  readonly basicDetails: IndexDtfDeployBasicDetails;
  readonly flags: IndexDtfDeployFlags;
  readonly owner: Address;
  readonly basketManagers?: readonly Address[];
  readonly auctionLaunchers?: readonly Address[];
  readonly brandManagers?: readonly Address[];
  readonly deploymentNonce?: Hex;
};

export type PrepareIndexDtfDeployParamsV5 = IndexDtfDeployTargetV5 &
  IndexDtfDeployCommon & { readonly additionalDetails: IndexDtfDeployAdditionalDetails };

export type PrepareIndexDtfDeployParamsV6 = IndexDtfDeployTargetV6 &
  IndexDtfDeployCommon & { readonly additionalDetails: IndexDtfDeployAdditionalDetailsV6 };

export type PrepareIndexDtfDeployParams = PrepareIndexDtfDeployParamsV5 | PrepareIndexDtfDeployParamsV6;

type IndexDtfDeployGovernedCommon = {
  readonly stToken: Address;
  readonly basicDetails: IndexDtfDeployBasicDetails;
  readonly flags: IndexDtfDeployFlags;
  readonly roles?: IndexDtfDeployGovernanceRoles;
  readonly deploymentNonce?: Hex;
};

export type PrepareIndexDtfDeployGovernedParamsV5 = IndexDtfDeployTargetV5 &
  IndexDtfDeployGovernedCommon & {
    readonly additionalDetails: IndexDtfDeployAdditionalDetails;
    readonly ownerGovernance: IndexDtfDeployGovernanceParams;
    readonly tradingGovernance: IndexDtfDeployGovernanceParams;
  };

export type PrepareIndexDtfDeployGovernedParamsV6 = IndexDtfDeployTargetV6 &
  IndexDtfDeployGovernedCommon & {
    readonly additionalDetails: IndexDtfDeployAdditionalDetailsV6;
    readonly governance: IndexDtfDeployOptimisticGovernanceParams;
  };

export type PrepareIndexDtfDeployGovernedParams =
  | PrepareIndexDtfDeployGovernedParamsV5
  | PrepareIndexDtfDeployGovernedParamsV6;

export type PrepareIndexDtfDeployStakingTokenParams = {
  readonly chainId: SupportedChainId;
  readonly name: string;
  readonly symbol: string;
  readonly underlying: Address;
  readonly governance: IndexDtfDeployGovernanceParams;
  readonly deploymentNonce?: Hex;
};

export type PrepareIndexDtfDeployApprovalParams = {
  readonly chainId: SupportedChainId;
  /** The Folio version being deployed; the spender defaults to that version's per-chain deployer. */
  readonly version: IndexDtfDeployVersion;
  readonly token: Address;
  readonly amount: bigint;
  /** Spender override for forks and sandboxes. */
  readonly deployer?: Address;
};

export type PrepareIndexDtfDeployPlanApprovalParams = {
  readonly token: Address;
  readonly amount: bigint;
};

export type PrepareIndexDtfDeployApprovalsParams = {
  readonly chainId: SupportedChainId;
  readonly version: IndexDtfDeployVersion;
  readonly assets: readonly Address[];
  readonly amounts: readonly bigint[];
  readonly approvalBufferBps?: number;
  readonly deployer?: Address;
};

export type PrepareIndexDtfDeployPlanParams = PrepareIndexDtfDeployParams & {
  readonly approvals?: readonly PrepareIndexDtfDeployPlanApprovalParams[];
};

export type PrepareIndexDtfDeployGovernedPlanParams = PrepareIndexDtfDeployGovernedParams & {
  readonly approvals?: readonly PrepareIndexDtfDeployPlanApprovalParams[];
};

export function buildIndexDtfDeployFeeRecipients(
  params: IndexDtfDeployRevenueDistributionParams,
): readonly IndexDtfFeeRecipient[] {
  return buildIndexDtfFeeRecipients({
    platformFee: params.platformFee,
    governanceShare: params.governanceShare,
    deployerShare: params.deployerShare,
    additionalRecipients: params.additionalRecipients,
    deployer: params.deployer,
    ...(params.voteLock ? { voteLock: params.voteLock } : {}),
  });
}

export function generateIndexDtfDeploymentNonce(): Hex {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);

  return keccak256(bytes);
}

export function getIndexDtfDeployerAddress(target: IndexDtfDeployTargetV5 | IndexDtfDeployTargetV6): Address {
  if (target.version === "6.0.0") {
    return target.deployer ? getAddress(target.deployer) : INDEX_DTF_V6_DEPLOYER_ADDRESS[target.chainId];
  }
  if (target.version !== "5.0.0") {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `Unsupported Index DTF deploy version: ${String((target as { version: unknown }).version)}`,
      meta: { version: (target as { version: unknown }).version },
    });
  }

  return INDEX_DTF_DEPLOYER_ADDRESS[target.chainId];
}

export function prepareIndexDtfDeploy(params: PrepareIndexDtfDeployParams): IndexDtfCall {
  const address = getIndexDtfDeployerAddress(params);

  if (params.version === "6.0.0") {
    return prepareContractCall({
      chainId: params.chainId,
      address,
      abi: folioDeployerV6Abi,
      functionName: "deployFolio",
      args: [
        normalizeBasicDetails(params.basicDetails),
        normalizeAdditionalDetailsV6(params.additionalDetails),
        normalizeFlags(params.flags),
        getAddress(params.owner),
        normalizeAddresses(params.basketManagers ?? []),
        normalizeAddresses(params.auctionLaunchers ?? []),
        normalizeAddresses(params.brandManagers ?? []),
        params.deploymentNonce ?? generateIndexDtfDeploymentNonce(),
      ] as const,
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address,
    abi: indexDtfDeployerAbi,
    functionName: "deployFolio",
    args: [
      normalizeBasicDetails(params.basicDetails),
      normalizeAdditionalDetails(params.additionalDetails),
      normalizeFlags(params.flags),
      getAddress(params.owner),
      normalizeAddresses(params.basketManagers ?? []),
      normalizeAddresses(params.auctionLaunchers ?? []),
      normalizeAddresses(params.brandManagers ?? []),
      params.deploymentNonce ?? generateIndexDtfDeploymentNonce(),
    ] as const,
  });
}

export function prepareIndexDtfDeployGoverned(params: PrepareIndexDtfDeployGovernedParams): IndexDtfCall {
  const address = getIndexDtfDeployerAddress(params);

  if (params.version === "6.0.0") {
    // Folio 6.0 has no self-governed mode: a zero vault reverts `FolioDeployer__InvalidStToken`.
    if (isAddressEqual(getAddress(params.stToken), zeroAddress)) {
      throw invalidInput("stToken must be an optimistic staking vault, not the zero address", {});
    }
    return prepareContractCall({
      chainId: params.chainId,
      address,
      abi: folioDeployerV6Abi,
      functionName: "deployGovernedFolio",
      args: [
        getAddress(params.stToken),
        normalizeBasicDetails(params.basicDetails),
        normalizeAdditionalDetailsV6(params.additionalDetails),
        normalizeFlags(params.flags),
        normalizeOptimisticGovernanceParams(params.governance),
        normalizeGovernanceRoles(params.roles),
        params.deploymentNonce ?? generateIndexDtfDeploymentNonce(),
      ] as const,
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address,
    abi: indexDtfDeployerAbi,
    functionName: "deployGovernedFolio",
    args: [
      getAddress(params.stToken),
      normalizeBasicDetails(params.basicDetails),
      normalizeAdditionalDetails(params.additionalDetails),
      normalizeFlags(params.flags),
      normalizeGovernanceParams(params.ownerGovernance),
      normalizeGovernanceParams(params.tradingGovernance),
      normalizeGovernanceRoles(params.roles),
      params.deploymentNonce ?? generateIndexDtfDeploymentNonce(),
    ] as const,
  });
}

export type PrepareIndexDtfDeployStakingVaultParams = {
  readonly chainId: SupportedChainId;
  readonly underlying: Address;
  readonly rewardTokens?: readonly Address[];
  readonly rewardHalfLife: number | bigint;
  readonly unstakingDelay: number | bigint;
  /** The vault's own DAO; its optimistic selectors are empty at deploy because the vault address is not known yet. */
  readonly governance: Omit<IndexDtfDeployOptimisticGovernanceParams, "optimisticSelectors">;
  readonly deploymentNonce?: Hex;
};

/**
 * Deploys a new optimistic staking vault (vlX) with its own governor and timelock through the governance deployer
 * 1.1.0 — the vault a governed Folio 6.0 deploy then takes as `stToken`.
 */
export function prepareIndexDtfDeployStakingVault(params: PrepareIndexDtfDeployStakingVaultParams): IndexDtfCall {
  const rewardHalfLife = toUint(params.rewardHalfLife, "rewardHalfLife");
  const unstakingDelay = toUint(params.unstakingDelay, "unstakingDelay");
  const rewardTokens = normalizeAddresses(params.rewardTokens ?? []);
  if (rewardHalfLife < MIN_REWARD_HALF_LIFE || rewardHalfLife > MAX_REWARD_HALF_LIFE) {
    throw invalidInput("rewardHalfLife must be between 1 day and 2 weeks", { rewardHalfLife });
  }
  if (unstakingDelay > MAX_UNSTAKING_DELAY) {
    throw invalidInput("unstakingDelay must be at most 4 weeks", { unstakingDelay });
  }
  if (rewardTokens.length > MAX_REWARD_TOKENS) {
    throw invalidInput("rewardTokens must have at most 20 tokens", { count: rewardTokens.length });
  }
  const { optimisticSelectors: _, ...base } = normalizeOptimisticGovernanceParams({
    ...params.governance,
    optimisticSelectors: [],
  });

  return prepareContractCall({
    chainId: params.chainId,
    address: INDEX_DTF_OPTIMISTIC_GOVERNOR_DEPLOYER_ADDRESS[params.chainId],
    abi: optimisticGovernorDeployerAbi,
    functionName: "deployWithNewStakingVault",
    args: [
      { ...base, selectorData: [] },
      { underlying: getAddress(params.underlying), rewardTokens, rewardHalfLife, unstakingDelay },
      params.deploymentNonce ?? generateIndexDtfDeploymentNonce(),
    ] as const,
  });
}

export type IndexDtfDeployedStakingVault = {
  readonly stakingVault: Address;
  readonly governor: Address;
  readonly timelock: Address;
  readonly selectorRegistry: Address;
};

/**
 * Reads the new vault and its DAO from a `prepareIndexDtfDeployStakingVault` receipt. Only the chain's governance
 * deployer 1.1.0 counts, and an existing-vault deploy (zero `stakingVault`) is not a new vault.
 */
export function extractIndexDtfDeployedStakingVault(
  logs: readonly Log[],
  target: { readonly chainId: SupportedChainId },
): IndexDtfDeployedStakingVault {
  const deployer = INDEX_DTF_OPTIMISTIC_GOVERNOR_DEPLOYER_ADDRESS[target.chainId];
  const events = parseEventLogs({
    abi: optimisticGovernorDeployerAbi,
    logs: logs.filter((log) => isAddressEqual(log.address, deployer)),
    eventName: "ReserveOptimisticGovernorSystemDeployed",
  }).filter((event) => !isAddressEqual(event.args.stakingVault, zeroAddress));
  const stakingVault = getSingleDeployedAddress(
    events.map((event) => event.args.stakingVault),
    { deployer, events: "ReserveOptimisticGovernorSystemDeployed with a new staking vault" },
  );
  const event = events.find((e) => isAddressEqual(e.args.stakingVault, stakingVault))!;

  return {
    stakingVault,
    governor: getAddress(event.args.governor),
    timelock: getAddress(event.args.timelock),
    selectorRegistry: getAddress(event.args.optimisticSelectorRegistry),
  };
}

export function prepareIndexDtfDeployStakingToken(params: PrepareIndexDtfDeployStakingTokenParams) {
  return prepareContractCall({
    chainId: params.chainId,
    address: INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS[params.chainId],
    abi: indexDtfGovernanceDeployerAbi,
    functionName: "deployGovernedStakingToken",
    args: [
      params.name,
      params.symbol,
      getAddress(params.underlying),
      normalizeGovernanceParams(params.governance),
      params.deploymentNonce ?? generateIndexDtfDeploymentNonce(),
    ] as const,
  });
}

export function prepareIndexDtfDeployPlan(
  params: PrepareIndexDtfDeployPlanParams,
): ContractCallPlan<ReturnType<typeof prepareIndexDtfDeploy>, ReturnType<typeof prepareIndexDtfDeployAssetApproval>> {
  const call = prepareIndexDtfDeploy(params);
  const approvals = (params.approvals ?? []).map((approval) =>
    prepareIndexDtfDeployAssetApproval({
      chainId: params.chainId,
      version: params.version,
      token: approval.token,
      amount: approval.amount,
      deployer: call.to,
    }),
  );

  return approvals.length ? { type: "approval-required", approvals, call } : { type: "call", call };
}

export function prepareIndexDtfDeployGovernedPlan(
  params: PrepareIndexDtfDeployGovernedPlanParams,
): ContractCallPlan<
  ReturnType<typeof prepareIndexDtfDeployGoverned>,
  ReturnType<typeof prepareIndexDtfDeployAssetApproval>
> {
  const call = prepareIndexDtfDeployGoverned(params);
  const approvals = (params.approvals ?? []).map((approval) =>
    prepareIndexDtfDeployAssetApproval({
      chainId: params.chainId,
      version: params.version,
      token: approval.token,
      amount: approval.amount,
      deployer: call.to,
    }),
  );

  return approvals.length ? { type: "approval-required", approvals, call } : { type: "call", call };
}

export function prepareIndexDtfDeployAssetApproval(params: PrepareIndexDtfDeployApprovalParams) {
  const spender = params.deployer
    ? getAddress(params.deployer)
    : getIndexDtfDeployerAddress({ chainId: params.chainId, version: params.version });

  return prepareErc20Approval({
    chainId: params.chainId,
    token: params.token,
    spender,
    amount: params.amount,
  });
}

export function prepareIndexDtfDeployAssetApprovals(
  params: PrepareIndexDtfDeployApprovalsParams,
): readonly ReturnType<typeof prepareIndexDtfDeployAssetApproval>[] {
  if (params.assets.length !== params.amounts.length) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "assets and amounts must have the same length",
      meta: { assets: params.assets.length, amounts: params.amounts.length },
    });
  }

  return params.assets.map((token, index) =>
    prepareIndexDtfDeployAssetApproval({
      chainId: params.chainId,
      version: params.version,
      token,
      ...(params.deployer ? { deployer: params.deployer } : {}),
      amount: getIndexDtfDeployApprovalAmount({
        amount: params.amounts[index] ?? 0n,
        approvalBufferBps: params.approvalBufferBps,
      }),
    }),
  );
}

export function getIndexDtfDeployApprovalAmount(params: {
  readonly amount: bigint;
  readonly approvalBufferBps?: number | undefined;
}): bigint {
  const approvalBufferBps = params.approvalBufferBps ?? 20_000;

  if (params.amount < 0n) {
    throw new SdkError({ code: "INVALID_INPUT", message: "approval amount must be non-negative" });
  }
  if (!Number.isInteger(approvalBufferBps) || approvalBufferBps < 10_000) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "approvalBufferBps must be an integer greater than or equal to 10000",
      meta: { approvalBufferBps },
    });
  }

  return (params.amount * BigInt(approvalBufferBps)) / 10_000n;
}

/**
 * Reads the deployed Folio from a deploy receipt's logs. Only `FolioDeployed` / `GovernedFolioDeployed` emitted by the
 * deployer the call was sent to count: every contract the deploy touches (a basket token during `transferFrom`, for
 * one) can emit a lookalike event. Pass the same `{ chainId, version, deployer? }` the deploy builder took. Throws
 * `RECORD_NOT_FOUND` without a deployer event and `INVALID_RESPONSE` when the deployer's events name more than one Folio.
 */
export function extractIndexDtfDeployedAddress(
  logs: readonly Log[],
  target: IndexDtfDeployTargetV5 | IndexDtfDeployTargetV6,
): Address {
  const deployer = getIndexDtfDeployerAddress(target);
  const events = parseEventLogs({
    abi: target.version === "6.0.0" ? folioDeployerV6Abi : indexDtfDeployerAbi,
    logs: logs.filter((log) => isAddressEqual(log.address, deployer)),
    eventName: ["FolioDeployed", "GovernedFolioDeployed"],
  });

  return getSingleDeployedAddress(
    events.map((event) => event.args.folio),
    { deployer, events: "FolioDeployed or GovernedFolioDeployed" },
  );
}

/**
 * Reads the staking token from a `prepareIndexDtfDeployStakingToken` receipt: only `DeployedGovernedStakingToken`
 * emitted by the chain's `INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS` counts, with the same errors as
 * `extractIndexDtfDeployedAddress`.
 */
export function extractIndexDtfDeployedStakingTokenAddress(
  logs: readonly Log[],
  target: { readonly chainId: SupportedChainId },
): Address {
  const deployer = INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS[target.chainId];
  const events = parseEventLogs({
    abi: indexDtfGovernanceDeployerAbi,
    logs: logs.filter((log) => isAddressEqual(log.address, deployer)),
    eventName: "DeployedGovernedStakingToken",
  });

  return getSingleDeployedAddress(
    events.map((event) => event.args.stToken),
    { deployer, events: "DeployedGovernedStakingToken" },
  );
}

function getSingleDeployedAddress(
  addresses: readonly Address[],
  source: { readonly deployer: Address; readonly events: string },
): Address {
  const deployed = [...new Set(addresses.map((address) => getAddress(address)))];

  if (deployed.length === 0) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Could not find ${source.events} emitted by ${source.deployer} in transaction logs`,
      meta: { deployer: source.deployer },
    });
  }
  if (deployed.length > 1) {
    throw new SdkError({
      code: "INVALID_RESPONSE",
      message: `${source.deployer} emitted ${source.events} for more than one address`,
      meta: { deployer: source.deployer, deployed },
    });
  }

  return deployed[0]!;
}

function normalizeBasicDetails(details: IndexDtfDeployBasicDetails): IndexDtfDeployBasicDetails {
  if (!details.name.trim()) {
    throw new SdkError({ code: "INVALID_INPUT", message: "name is required" });
  }
  if (!details.symbol.trim()) {
    throw new SdkError({ code: "INVALID_INPUT", message: "symbol is required" });
  }
  if (details.assets.length === 0) {
    throw new SdkError({ code: "INVALID_INPUT", message: "assets must not be empty" });
  }
  if (details.assets.length !== details.amounts.length) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "assets and amounts must have the same length",
      meta: { assets: details.assets.length, amounts: details.amounts.length },
    });
  }
  if (details.initialShares <= 0n) {
    throw new SdkError({ code: "INVALID_INPUT", message: "initialShares must be positive" });
  }
  for (const amount of details.amounts) {
    // Folio initialization requires a non-zero balance of every basket asset.
    if (amount <= 0n) {
      throw new SdkError({ code: "INVALID_INPUT", message: "asset amounts must be positive" });
    }
  }

  return {
    name: details.name,
    symbol: details.symbol,
    assets: normalizeAddresses(details.assets),
    amounts: [...details.amounts],
    initialShares: details.initialShares,
  };
}

function normalizeAdditionalDetails(details: IndexDtfDeployAdditionalDetails): IndexDtfDeployAdditionalDetails {
  if (details.auctionLength < 0n) {
    throw new SdkError({ code: "INVALID_INPUT", message: "auctionLength must be non-negative" });
  }
  if (details.tvlFee < 0n || details.mintFee < 0n) {
    throw new SdkError({ code: "INVALID_INPUT", message: "fees must be non-negative" });
  }

  return {
    auctionLength: details.auctionLength,
    feeRecipients: details.feeRecipients.map((recipient) => ({
      recipient: getAddress(recipient.recipient),
      portion: recipient.portion,
    })),
    tvlFee: details.tvlFee,
    mintFee: details.mintFee,
    mandate: details.mandate,
  };
}

function normalizeAdditionalDetailsV6(details: IndexDtfDeployAdditionalDetailsV6) {
  if (details.maxAuctionLength < MIN_AUCTION_LENGTH || details.maxAuctionLength > MAX_AUCTION_LENGTH) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "maxAuctionLength must be between 120 and 604800 seconds",
      meta: { maxAuctionLength: details.maxAuctionLength },
    });
  }
  if (details.tvlFee < 0n || details.mintFee < 0n) {
    throw new SdkError({ code: "INVALID_INPUT", message: "fees must be non-negative" });
  }
  if (details.tvlFee > MAX_TVL_FEE) {
    throw invalidInput("tvlFee must be at most 10% annually (1e17)", { tvlFee: details.tvlFee });
  }
  if (details.mintFee > MAX_MINT_FEE) {
    throw invalidInput("mintFee must be at most 5% (5e16)", { mintFee: details.mintFee });
  }
  if (details.selfFee < 0n || details.selfFee > MAX_SELF_FEE) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "selfFee must be a D18 fraction between 0 and 1e18",
      meta: { selfFee: details.selfFee },
    });
  }

  const tables = {
    recipients: sortIndexDtfFeeRecipients(details.feeRecipients),
    immutableRecipients: sortIndexDtfFeeRecipients(details.immutableFeeRecipients),
  };
  assertIndexDtfFeeRecipientTables(tables);

  return {
    maxAuctionLength: details.maxAuctionLength,
    feeRecipients: tables.recipients,
    immutableFeeRecipients: tables.immutableRecipients,
    tvlFee: details.tvlFee,
    mintFee: details.mintFee,
    folioFeeForSelf: details.selfFee,
    mandate: details.mandate,
  };
}

const assertFraction = (value: bigint, field: string) => {
  if (value <= 0n || value > D18) {
    throw invalidInput(`${field} must be a D18 fraction above 0 and at most 1e18`, { [field]: value });
  }
};

function invalidInput(message: string, meta: Record<string, unknown>) {
  return new SdkError({ code: "INVALID_INPUT", message, meta });
}

function normalizeOptimisticGovernanceParams(params: IndexDtfDeployOptimisticGovernanceParams) {
  const vetoDelay = toUint(params.optimistic.vetoDelay, "vetoDelay");
  const vetoPeriod = toUint(params.optimistic.vetoPeriod, "vetoPeriod");
  if (vetoDelay < MIN_VETO_DELAY) throw invalidInput("vetoDelay must be at least 1 second", { vetoDelay });
  if (vetoPeriod < MIN_VETO_PERIOD) throw invalidInput("vetoPeriod must be at least 5 minutes", { vetoPeriod });
  assertFraction(toUint(params.optimistic.vetoThreshold, "vetoThreshold"), "vetoThreshold");
  assertFraction(toUint(params.standard.proposalThreshold, "proposalThreshold"), "proposalThreshold");
  assertFraction(toUint(params.standard.quorumNumerator, "quorumNumerator"), "quorumNumerator");
  const throttle = toUint(params.proposalThrottleCapacity, "proposalThrottleCapacity");
  if (throttle < 1n || throttle > MAX_PROPOSAL_THROTTLE_CAPACITY) {
    throw invalidInput("proposalThrottleCapacity must be between 1 and 12", { proposalThrottleCapacity: throttle });
  }

  return {
    optimisticParams: {
      vetoDelay: toUintNumber(params.optimistic.vetoDelay, "vetoDelay"),
      vetoPeriod: toUintNumber(params.optimistic.vetoPeriod, "vetoPeriod"),
      vetoThreshold: toUint(params.optimistic.vetoThreshold, "vetoThreshold"),
    },
    standardParams: {
      votingDelay: toUintNumber(params.standard.votingDelay, "votingDelay"),
      votingPeriod: toUintNumber(params.standard.votingPeriod, "votingPeriod"),
      voteExtension: toUintNumber(params.standard.voteExtension, "voteExtension"),
      proposalThreshold: toUint(params.standard.proposalThreshold, "proposalThreshold"),
      quorumNumerator: toUint(params.standard.quorumNumerator, "quorumNumerator"),
    },
    optimisticSelectors: params.optimisticSelectors.map((selector) => {
      if (!/^0x[0-9a-fA-F]{8}$/.test(selector) || /^0x0{8}$/.test(selector)) {
        throw new SdkError({
          code: "INVALID_INPUT",
          message: "optimisticSelectors must be non-zero 4-byte function selectors",
          meta: { selector },
        });
      }
      return selector;
    }),
    optimisticProposers: normalizeAddresses(params.optimisticProposers),
    additionalGuardians: normalizeAddresses(params.additionalGuardians),
    timelockDelay: toUint(params.timelockDelay, "timelockDelay"),
    proposalThrottleCapacity: toUint(params.proposalThrottleCapacity, "proposalThrottleCapacity"),
  };
}

function normalizeFlags(flags: IndexDtfDeployFlags): IndexDtfDeployFlags {
  return {
    trustedFillerEnabled: flags.trustedFillerEnabled,
    rebalanceControl: {
      weightControl: flags.rebalanceControl.weightControl,
      priceControl: flags.rebalanceControl.priceControl,
    },
    bidsEnabled: flags.bidsEnabled,
  };
}

function normalizeGovernanceParams(params: IndexDtfDeployGovernanceParams) {
  return {
    votingDelay: toUintNumber(params.votingDelay, "votingDelay"),
    votingPeriod: toUintNumber(params.votingPeriod, "votingPeriod"),
    proposalThreshold: toUint(params.proposalThreshold, "proposalThreshold"),
    quorumThreshold: toUint(params.quorumThreshold, "quorumThreshold"),
    timelockDelay: toUint(params.timelockDelay, "timelockDelay"),
    guardians: normalizeAddresses(params.guardians),
  };
}

function normalizeGovernanceRoles(roles: IndexDtfDeployGovernanceRoles = {}) {
  return {
    existingBasketManagers: normalizeAddresses(roles.existingBasketManagers ?? []),
    auctionLaunchers: normalizeAddresses(roles.auctionLaunchers ?? []),
    brandManagers: normalizeAddresses(roles.brandManagers ?? []),
  };
}

function normalizeAddresses(addresses: readonly Address[]): Address[] {
  return addresses.map((address) => getAddress(address));
}
