import {
  getAddress,
  keccak256,
  parseEventLogs,
  type Address,
  type Hex,
  type Log,
} from "viem";

import type { SupportedChainId } from "@/config";
import type { ContractCallPlan } from "@/lib/contract-call";
import type { IndexDtfFeeRecipient, IndexDtfRevenueRecipientInput } from "@/index-dtf/governance/propose/revenue";
import type { PriceControl } from "@/types/index-dtf";

import { prepareContractCall, prepareErc20Approval } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";
import { indexDtfDeployerAbi } from "@/index-dtf/abis/deployer";
import { indexDtfGovernanceDeployerAbi } from "@/index-dtf/abis/governance-deployer";
import { buildIndexDtfFeeRecipients } from "@/index-dtf/governance/propose/revenue";
import { toUint, toUintNumber } from "@/lib/utils";

export const INDEX_DTF_DEPLOYER_ADDRESS = {
  1: "0x4D201a6e5BF975E2CEE9e5cbDfc803C0Ff122073",
  8453: "0x3451fD177E9a8bB4Eb8271E627A804BD22A816F9",
  56: "0x72f87239981159ed23673012EE3806Ca6114AB2A",
} as const satisfies Record<SupportedChainId, Address>;

export const INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS = {
  1: "0x72f87239981159ed23673012EE3806Ca6114AB2A",
  8453: "0xECA52a5BDBAd98a5B4B6B944C4C9cc636D4D7461",
  56: "0xA7BC1265C37A8D285cd2B10c842Efb8415A7bF9f",
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

export type PrepareIndexDtfDeployParams = {
  readonly chainId: SupportedChainId;
  readonly basicDetails: IndexDtfDeployBasicDetails;
  readonly additionalDetails: IndexDtfDeployAdditionalDetails;
  readonly flags: IndexDtfDeployFlags;
  readonly owner: Address;
  readonly basketManagers?: readonly Address[];
  readonly auctionLaunchers?: readonly Address[];
  readonly brandManagers?: readonly Address[];
  readonly deploymentNonce?: Hex;
};

export type PrepareIndexDtfDeployGovernedParams = {
  readonly chainId: SupportedChainId;
  readonly stToken: Address;
  readonly basicDetails: IndexDtfDeployBasicDetails;
  readonly additionalDetails: IndexDtfDeployAdditionalDetails;
  readonly flags: IndexDtfDeployFlags;
  readonly ownerGovernance: IndexDtfDeployGovernanceParams;
  readonly tradingGovernance: IndexDtfDeployGovernanceParams;
  readonly roles?: IndexDtfDeployGovernanceRoles;
  readonly deploymentNonce?: Hex;
};

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
  readonly token: Address;
  readonly amount: bigint;
};

export type PrepareIndexDtfDeployPlanApprovalParams = {
  readonly token: Address;
  readonly amount: bigint;
};

export type PrepareIndexDtfDeployApprovalsParams = {
  readonly chainId: SupportedChainId;
  readonly assets: readonly Address[];
  readonly amounts: readonly bigint[];
  readonly approvalBufferBps?: number;
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

export function prepareIndexDtfDeploy(params: PrepareIndexDtfDeployParams) {
  return prepareContractCall({
    chainId: params.chainId,
    address: INDEX_DTF_DEPLOYER_ADDRESS[params.chainId],
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

export function prepareIndexDtfDeployGoverned(params: PrepareIndexDtfDeployGovernedParams) {
  return prepareContractCall({
    chainId: params.chainId,
    address: INDEX_DTF_DEPLOYER_ADDRESS[params.chainId],
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
      token: approval.token,
      amount: approval.amount,
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
      token: approval.token,
      amount: approval.amount,
    }),
  );

  return approvals.length ? { type: "approval-required", approvals, call } : { type: "call", call };
}

export function prepareIndexDtfDeployAssetApproval(params: PrepareIndexDtfDeployApprovalParams) {
  return prepareErc20Approval({
    chainId: params.chainId,
    token: params.token,
    spender: INDEX_DTF_DEPLOYER_ADDRESS[params.chainId],
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
      token,
      amount: getIndexDtfDeployApprovalAmount(params.amounts[index] ?? 0n, params.approvalBufferBps),
    }),
  );
}

export function getIndexDtfDeployApprovalAmount(amount: bigint, approvalBufferBps = 20_000): bigint {
  if (amount < 0n) {
    throw new SdkError({ code: "INVALID_INPUT", message: "approval amount must be non-negative" });
  }
  if (!Number.isInteger(approvalBufferBps) || approvalBufferBps < 10_000) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "approvalBufferBps must be an integer greater than or equal to 10000",
      meta: { approvalBufferBps },
    });
  }

  return (amount * BigInt(approvalBufferBps)) / 10_000n;
}

export function extractIndexDtfDeployedAddress(logs: readonly Log[]): Address {
  const governed = parseEventLogs({
    abi: indexDtfDeployerAbi,
    logs: [...logs],
    eventName: "GovernedFolioDeployed",
  });

  if (governed[0]?.args.folio) {
    return governed[0].args.folio;
  }

  const ungoverned = parseEventLogs({
    abi: indexDtfDeployerAbi,
    logs: [...logs],
    eventName: "FolioDeployed",
  });

  if (ungoverned[0]?.args.folio) {
    return ungoverned[0].args.folio;
  }

  throw new SdkError({
    code: "RECORD_NOT_FOUND",
    message: "Could not find FolioDeployed or GovernedFolioDeployed event in transaction logs",
  });
}

export function extractIndexDtfDeployedStakingTokenAddress(logs: readonly Log[]): Address {
  const events = parseEventLogs({
    abi: indexDtfGovernanceDeployerAbi,
    logs: [...logs],
    eventName: "DeployedGovernedStakingToken",
  });

  if (events[0]?.args.stToken) {
    return events[0].args.stToken;
  }

  throw new SdkError({
    code: "RECORD_NOT_FOUND",
    message: "Could not find DeployedGovernedStakingToken event in transaction logs",
  });
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
    if (amount < 0n) {
      throw new SdkError({ code: "INVALID_INPUT", message: "asset amounts must be non-negative" });
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
