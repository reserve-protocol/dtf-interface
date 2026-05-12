import { getAddress, parseEther, type Address } from "viem";

import type { SupportedChainId } from "@/defaults";
import type { IndexDtfCall } from "@/types/governance";
import type { PriceControl } from "@/types/index-dtf";

import { prepareContractCall } from "@/contract-call";
import { SdkError } from "@/errors";
import { dtfIndexAbi as indexDtfV5Abi } from "@/index-dtf/abis/dtf-index-abi";
import { INDEX_DTF_VERSION_5_0_0, getIndexDtfOperation, type IndexDtfOperation } from "@/index-dtf/versions";
import { Decimal } from "@/lib/decimal";

export const indexDtfV5WriteAbi = indexDtfV5Abi;

export type IndexDtfWriteVersion = typeof INDEX_DTF_VERSION_5_0_0;

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
    [params.tokens.map(getAddress)],
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
    [params.tokens.map(getAddress)],
    params.version,
  );
}

export function prepareIndexDtfDeprecate(params: PrepareIndexDtfCallParams): IndexDtfCall {
  return prepareIndexDtfOperation(params.address, params.chainId, "deprecate", [], params.version);
}

function prepareIndexDtfOperation(
  address: Address,
  chainId: SupportedChainId,
  operation: IndexDtfOperation,
  args: readonly unknown[],
  version: IndexDtfWriteVersion,
): IndexDtfCall {
  if (version !== INDEX_DTF_VERSION_5_0_0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Index DTF call builders currently support v5 only",
      meta: { version },
    });
  }

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
