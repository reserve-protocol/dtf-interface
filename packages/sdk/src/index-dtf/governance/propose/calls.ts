import { parseEther, zeroHash, type Address, type Hex } from "viem";

import type { SupportedChainId } from "@/config";
import type { IndexDtfCall } from "@/types/governance";
import type { PriceControl } from "@/types/index-dtf";

import { prepareContractCall } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";
import { dtfIndexGovernanceAbi } from "@/index-dtf/abis/dtf-index-governance";
import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";
import { folioArtifactAbi as indexDtfV6Abi } from "@/index-dtf/abis/folio-artifact";
import { dtfIndexAbi as indexDtfV5Abi } from "@/index-dtf/abis/dtf-index-abi";
import { timelockAbi } from "@/index-dtf/abis/timelock";
import { OPTIMISTIC_PROPOSER_ROLE } from "@/index-dtf/governance/optimistic";
import { Decimal } from "@/lib/decimal";
import { toUint, toUintNumber } from "@/lib/utils";

export const indexDtfV5WriteAbi = indexDtfV5Abi;
export const indexDtfV6WriteAbi = indexDtfV6Abi;

export type IndexDtfWriteVersion = "5.0.0" | "6.0.0";

export type IndexDtfFeeRecipient = {
  readonly recipient: Address;
  readonly portion: bigint;
};

export type PrepareIndexDtfCallParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly version: IndexDtfWriteVersion;
};

export type PrepareIndexDtfTokenCallParams = PrepareIndexDtfCallParams & {
  readonly token: Address;
};

export type PrepareIndexDtfPercentageCallParams = PrepareIndexDtfCallParams & {
  readonly percentage: number;
};

export type PrepareIndexDtfAuctionLengthCallParams = PrepareIndexDtfCallParams & {
  readonly auctionLength: number | bigint;
};

export type PrepareIndexDtfSetRebalanceControlParams = PrepareIndexDtfCallParams & {
  readonly weightControl: boolean;
  readonly priceControl: PriceControl;
};

export type PrepareIndexDtfOptimisticGovernanceCallParams = {
  readonly governance: Address;
  readonly chainId: SupportedChainId;
};

export type PrepareIndexDtfSetOptimisticParamsParams =
  PrepareIndexDtfOptimisticGovernanceCallParams & {
    readonly vetoDelay: number | bigint;
    readonly vetoPeriod: number | bigint;
    readonly vetoThreshold: bigint;
  };

export type PrepareIndexDtfGovernorCallParams = {
  readonly governance: Address;
  readonly chainId: SupportedChainId;
};

export type PrepareIndexDtfTimelockCallParams = {
  readonly timelock: Address;
  readonly chainId: SupportedChainId;
};

export function prepareIndexDtfAddToBasket(params: PrepareIndexDtfTokenCallParams): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "addToBasket",
    args: [params.token] as never,
  });
}

export function prepareIndexDtfRemoveFromBasket(params: PrepareIndexDtfTokenCallParams): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "removeFromBasket",
    args: [params.token] as never,
  });
}

export function prepareIndexDtfSetTvlFee(params: PrepareIndexDtfPercentageCallParams): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "setTVLFee",
    args: [encodePercent(params.percentage)] as never,
  });
}

export function prepareIndexDtfSetMintFee(params: PrepareIndexDtfPercentageCallParams): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "setMintFee",
    args: [encodePercent(params.percentage)] as never,
  });
}

export function prepareIndexDtfSetSelfFee(params: PrepareIndexDtfPercentageCallParams): IndexDtfCall {
  if (params.version !== "6.0.0") {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `setSelfFee is not supported by Index DTF ${params.version}`,
      meta: { version: params.version },
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: indexDtfV6WriteAbi,
    functionName: "setFolioSelfFee",
    args: [encodePercent(params.percentage)] as const,
  });
}

export function prepareIndexDtfSetFeeRecipients(
  params: PrepareIndexDtfCallParams & {
    readonly recipients: readonly IndexDtfFeeRecipient[];
  },
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "setFeeRecipients",
    args: [
      params.recipients.map((recipient) => ({
        recipient: recipient.recipient,
        portion: recipient.portion,
      })),
    ] as never,
  });
}

export function prepareIndexDtfSetAuctionLength(params: PrepareIndexDtfAuctionLengthCallParams): IndexDtfCall {
  if (params.version === "6.0.0") {
    return prepareContractCall({
      chainId: params.chainId,
      address: params.address,
      abi: indexDtfV6WriteAbi,
      functionName: "setMaxAuctionLength",
      args: [toSeconds(params.auctionLength)] as const,
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: indexDtfV5WriteAbi,
    functionName: "setAuctionLength",
    args: [toSeconds(params.auctionLength)] as const,
  });
}

export function prepareIndexDtfSetMandate(
  params: PrepareIndexDtfCallParams & { readonly mandate: string },
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "setMandate",
    args: [params.mandate] as never,
  });
}

export function prepareIndexDtfSetName(params: PrepareIndexDtfCallParams & { readonly name: string }): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "setName",
    args: [params.name] as never,
  });
}

export function prepareIndexDtfSetTrustedFillerRegistry(
  params: PrepareIndexDtfCallParams & {
    readonly registry: Address;
    readonly enabled: boolean;
  },
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "setTrustedFillerRegistry",
    args: [params.registry, params.enabled] as never,
  });
}

export function prepareIndexDtfSetRebalanceControl(params: PrepareIndexDtfSetRebalanceControlParams): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "setRebalanceControl",
    args: [
      {
        weightControl: params.weightControl,
        priceControl: params.priceControl,
      },
    ] as never,
  });
}

export function prepareIndexDtfSetBidsEnabled(
  params: PrepareIndexDtfCallParams & { readonly enabled: boolean },
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "setBidsEnabled",
    args: [params.enabled] as never,
  });
}

export function prepareIndexDtfSetTradeAllowlistEnabled(
  params: PrepareIndexDtfCallParams & { readonly enabled: boolean },
): IndexDtfCall {
  if (params.version !== "6.0.0") {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `setTradeAllowlistEnabled is not supported by Index DTF ${params.version}`,
      meta: { version: params.version },
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: indexDtfV6WriteAbi,
    functionName: "setTradeAllowlistEnabled",
    args: [params.enabled] as const,
  });
}

export function prepareIndexDtfAddToAllowlist(
  params: PrepareIndexDtfCallParams & { readonly tokens: readonly Address[] },
): IndexDtfCall {
  if (params.version !== "6.0.0") {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `addToAllowlist is not supported by Index DTF ${params.version}`,
      meta: { version: params.version },
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: indexDtfV6WriteAbi,
    functionName: "addToAllowlist",
    args: [params.tokens] as const,
  });
}

export function prepareIndexDtfRemoveFromAllowlist(
  params: PrepareIndexDtfCallParams & { readonly tokens: readonly Address[] },
): IndexDtfCall {
  if (params.version !== "6.0.0") {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `removeFromAllowlist is not supported by Index DTF ${params.version}`,
      meta: { version: params.version },
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: indexDtfV6WriteAbi,
    functionName: "removeFromAllowlist",
    args: [params.tokens] as const,
  });
}

export function prepareIndexDtfDeprecate(params: PrepareIndexDtfCallParams): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "deprecateFolio",
    args: [] as never,
  });
}

export function prepareIndexDtfSetOptimisticParams(
  params: PrepareIndexDtfSetOptimisticParamsParams,
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.governance,
    abi: dtfIndexGovernanceOptimisticAbi,
    functionName: "setOptimisticParams",
    args: [
      {
        vetoDelay: toUintNumber(params.vetoDelay, "vetoDelay"),
        vetoPeriod: toUintNumber(params.vetoPeriod, "vetoPeriod"),
        vetoThreshold: toUint(params.vetoThreshold, "vetoThreshold"),
      },
    ] as const,
  });
}

export function prepareIndexDtfSetProposalThrottle(
  params: PrepareIndexDtfOptimisticGovernanceCallParams & {
    readonly capacity: bigint;
  },
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.governance,
    abi: dtfIndexGovernanceOptimisticAbi,
    functionName: "setProposalThrottle",
    args: [toUint(params.capacity, "capacity")] as const,
  });
}

export function prepareIndexDtfSetLateQuorumVoteExtension(
  params: PrepareIndexDtfOptimisticGovernanceCallParams & {
    readonly extension: number | bigint;
  },
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.governance,
    abi: dtfIndexGovernanceOptimisticAbi,
    functionName: "setLateQuorumVoteExtension",
    args: [toUintNumber(params.extension, "extension")] as const,
  });
}

export function prepareIndexDtfRevokeOptimisticProposer(params: {
  readonly timelock: Address;
  readonly chainId: SupportedChainId;
  readonly proposer: Address;
}): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.timelock,
    abi: timelockAbi,
    functionName: "revokeRole",
    args: [OPTIMISTIC_PROPOSER_ROLE, params.proposer] as const,
  });
}

export function prepareIndexDtfUpdateTimelock(
  params: PrepareIndexDtfGovernorCallParams & { readonly timelock: Address },
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.governance,
    abi: dtfIndexGovernanceAbi,
    functionName: "updateTimelock",
    args: [params.timelock] as const,
  });
}

export function prepareIndexDtfRelay(
  params: PrepareIndexDtfGovernorCallParams & {
    readonly target: Address;
    readonly value?: bigint;
    readonly data?: Hex;
  },
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.governance,
    abi: dtfIndexGovernanceAbi,
    functionName: "relay",
    args: [params.target, params.value ?? 0n, params.data ?? "0x"] as const,
  });
}

export function prepareIndexDtfTimelockDelay(
  params: PrepareIndexDtfTimelockCallParams & { readonly delay: number | bigint },
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.timelock,
    abi: timelockAbi,
    functionName: "updateDelay",
    args: [toUint(params.delay, "delay")] as const,
  });
}

export function prepareIndexDtfTimelockGrantRole(
  params: PrepareIndexDtfTimelockCallParams & { readonly role: Hex; readonly account: Address },
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.timelock,
    abi: timelockAbi,
    functionName: "grantRole",
    args: [params.role, params.account] as const,
  });
}

export function prepareIndexDtfTimelockRevokeRole(
  params: PrepareIndexDtfTimelockCallParams & { readonly role: Hex; readonly account: Address },
): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.timelock,
    abi: timelockAbi,
    functionName: "revokeRole",
    args: [params.role, params.account] as const,
  });
}

export function prepareIndexDtfTimelockExecuteBatch(
  params: PrepareIndexDtfTimelockCallParams & {
    readonly targets: readonly Address[];
    readonly calldatas: readonly Hex[];
    readonly values?: readonly bigint[];
    readonly predecessor?: Hex;
    readonly salt?: Hex;
    readonly value?: bigint;
  },
): IndexDtfCall {
  const targets = params.targets;
  const values = params.values ?? targets.map(() => 0n);

  if (targets.length !== params.calldatas.length || targets.length !== values.length) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "targets, values, and calldatas must have the same length",
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address: params.timelock,
    abi: timelockAbi,
    functionName: "executeBatch",
    args: [targets, [...values], [...params.calldatas], params.predecessor ?? zeroHash, params.salt ?? zeroHash] as const,
    ...(params.value === undefined ? {} : { value: params.value }),
  });
}

function encodePercent(percentage: number): bigint {
  if (!Number.isFinite(percentage) || percentage < 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "percentage must be a positive number",
      meta: { percentage },
    });
  }

  return parseEther(new Decimal(percentage).div(100).toFixed());
}

function toSeconds(value: number | bigint): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  if (!Number.isFinite(value) || value < 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "seconds must be a positive number",
      meta: { seconds: value },
    });
  }

  return BigInt(Math.round(value));
}

function getIndexDtfWriteAbi(version: IndexDtfWriteVersion) {
  return version === "6.0.0" ? indexDtfV6WriteAbi : indexDtfV5WriteAbi;
}
