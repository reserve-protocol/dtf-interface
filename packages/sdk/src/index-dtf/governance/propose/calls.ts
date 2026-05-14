import { getAddress, parseEther, zeroHash, type Address, type Hex } from "viem";

import type { SupportedChainId } from "@/defaults";
import type { IndexDtfCall } from "@/types/governance";
import type { PriceControl } from "@/types/index-dtf";

import { prepareContractCall } from "@/contract-call";
import { SdkError } from "@/errors";
import { dtfIndexGovernanceAbi } from "@/index-dtf/abis/dtf-index-governance";
import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";
import { folioArtifactAbi as indexDtfV6Abi } from "@/index-dtf/abis/folio-artifact";
import { dtfIndexAbi as indexDtfV5Abi } from "@/index-dtf/abis/dtf-index-abi";
import { timelockAbi } from "@/index-dtf/abis/timelock";
import { OPTIMISTIC_PROPOSER_ROLE } from "@/index-dtf/governance/optimistic";
import { getIndexDtfOperation, type IndexDtfOperation, type IndexDtfVersion } from "@/index-dtf/versions";
import { Decimal } from "@/lib/decimal";

export const indexDtfV5WriteAbi = indexDtfV5Abi;
export const indexDtfV6WriteAbi = indexDtfV6Abi;

export type IndexDtfWriteVersion = IndexDtfVersion;

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
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "addToBasket",
    [getAddress(params.token)],
    params.version,
  );
}

export function prepareIndexDtfRemoveFromBasket(params: PrepareIndexDtfTokenCallParams): IndexDtfCall {
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "removeFromBasket",
    [getAddress(params.token)],
    params.version,
  );
}

export function prepareIndexDtfSetTvlFee(params: PrepareIndexDtfPercentageCallParams): IndexDtfCall {
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "setTVLFee",
    [encodePercent(params.percentage)],
    params.version,
  );
}

export function prepareIndexDtfSetMintFee(params: PrepareIndexDtfPercentageCallParams): IndexDtfCall {
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "setMintFee",
    [encodePercent(params.percentage)],
    params.version,
  );
}

export function prepareIndexDtfSetSelfFee(params: PrepareIndexDtfPercentageCallParams): IndexDtfCall {
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "setSelfFee",
    [encodePercent(params.percentage)],
    params.version,
  );
}

export function prepareIndexDtfSetFeeRecipients(
  params: PrepareIndexDtfCallParams & {
    readonly recipients: readonly IndexDtfFeeRecipient[];
  },
): IndexDtfCall {
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "setFeeRecipients",
    [
      params.recipients.map((recipient) => ({
        recipient: getAddress(recipient.recipient),
        portion: recipient.portion,
      })),
    ],
    params.version,
  );
}

export function prepareIndexDtfSetAuctionLength(params: PrepareIndexDtfAuctionLengthCallParams): IndexDtfCall {
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "setAuctionLength",
    [toSeconds(params.auctionLength)],
    params.version,
  );
}

export function prepareIndexDtfSetMandate(
  params: PrepareIndexDtfCallParams & { readonly mandate: string },
): IndexDtfCall {
  return prepareIndexDtfOperation(params.address, params.chainId, "setMandate", [params.mandate], params.version);
}

export function prepareIndexDtfSetName(params: PrepareIndexDtfCallParams & { readonly name: string }): IndexDtfCall {
  return prepareIndexDtfOperation(params.address, params.chainId, "setName", [params.name], params.version);
}

export function prepareIndexDtfSetTrustedFillerRegistry(
  params: PrepareIndexDtfCallParams & {
    readonly registry: Address;
    readonly enabled: boolean;
  },
): IndexDtfCall {
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "setTrustedFillerRegistry",
    [getAddress(params.registry), params.enabled],
    params.version,
  );
}

export function prepareIndexDtfSetRebalanceControl(params: PrepareIndexDtfSetRebalanceControlParams): IndexDtfCall {
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "setRebalanceControl",
    [
      {
        weightControl: params.weightControl,
        priceControl: params.priceControl,
      },
    ],
    params.version,
  );
}

export function prepareIndexDtfSetBidsEnabled(
  params: PrepareIndexDtfCallParams & { readonly enabled: boolean },
): IndexDtfCall {
  return prepareIndexDtfOperation(params.address, params.chainId, "setBidsEnabled", [params.enabled], params.version);
}

export function prepareIndexDtfSetTradeAllowlistEnabled(
  params: PrepareIndexDtfCallParams & { readonly enabled: boolean },
): IndexDtfCall {
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "setTradeAllowlistEnabled",
    [params.enabled],
    params.version,
  );
}

export function prepareIndexDtfAddToAllowlist(
  params: PrepareIndexDtfCallParams & { readonly tokens: readonly Address[] },
): IndexDtfCall {
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "addToAllowlist",
    [params.tokens.map((token) => getAddress(token))],
    params.version,
  );
}

export function prepareIndexDtfRemoveFromAllowlist(
  params: PrepareIndexDtfCallParams & { readonly tokens: readonly Address[] },
): IndexDtfCall {
  return prepareIndexDtfOperation(
    params.address,
    params.chainId,
    "removeFromAllowlist",
    [params.tokens.map((token) => getAddress(token))],
    params.version,
  );
}

export function prepareIndexDtfDeprecate(params: PrepareIndexDtfCallParams): IndexDtfCall {
  return prepareIndexDtfOperation(params.address, params.chainId, "deprecate", [], params.version);
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
    args: [OPTIMISTIC_PROPOSER_ROLE, getAddress(params.proposer)] as const,
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
    args: [getAddress(params.timelock)] as const,
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
    args: [getAddress(params.target), params.value ?? 0n, params.data ?? "0x"] as const,
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
    args: [params.role, getAddress(params.account)] as const,
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
    args: [params.role, getAddress(params.account)] as const,
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
  const targets = params.targets.map((target) => getAddress(target));
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

function prepareIndexDtfOperation(
  address: Address,
  chainId: SupportedChainId,
  operation: IndexDtfOperation,
  args: readonly unknown[],
  version: IndexDtfWriteVersion,
): IndexDtfCall {
  const { abi, functionName } = getIndexDtfOperation(operation, version);

  return prepareContractCall({
    chainId,
    address,
    abi,
    functionName,
    args: args as never,
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

function toUint(value: number | bigint, field: string): bigint {
  if (typeof value === "bigint") {
    if (value < 0n) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `${field} must be non-negative`,
        meta: { [field]: value },
      });
    }

    return value;
  }

  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} must be a non-negative integer`,
      meta: { [field]: value },
    });
  }

  return BigInt(value);
}

function toUintNumber(value: number | bigint, field: string): number {
  const integer = toUint(value, field);
  if (integer > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} is too large to encode safely`,
      meta: { [field]: value },
    });
  }

  return Number(integer);
}
