import { Decimal } from "decimal.js-light";
import { encodeFunctionData, getAddress, parseEther, type Address, type Hex } from "viem";
import { SdkError } from "../../../errors.js";
import type { IndexDtfCall } from "../../../types/governance.js";
import type { PriceControl } from "../../../types/index-dtf.js";
import { dtfIndexAbi as indexDtfV5Abi } from "../../abis/dtf-index-abi.js";
import { folioArtifactAbi as indexDtfV6Abi } from "../../abis/folio-artifact.js";
import {
  getIndexDtfOperation,
  type IndexDtfVersion,
  type IndexDtfOperation,
} from "../../versions.js";

export const indexDtfV5WriteAbi = indexDtfV5Abi;
export const indexDtfV6WriteAbi = indexDtfV6Abi;

export type IndexDtfFeeRecipient = {
  readonly recipient: Address;
  readonly portion: bigint;
};

export type BuildIndexDtfCallParams = {
  readonly address: Address;
  readonly version: IndexDtfVersion;
};

export type BuildIndexDtfTokenCallParams = BuildIndexDtfCallParams & {
  readonly token: Address;
};

export type BuildIndexDtfPercentageCallParams = BuildIndexDtfCallParams & {
  readonly percentage: number;
};

export type BuildIndexDtfAuctionLengthCallParams = BuildIndexDtfCallParams & {
  readonly auctionLength: number | bigint;
};

export type BuildIndexDtfSetRebalanceControlCallParams = BuildIndexDtfCallParams & {
  readonly weightControl: boolean;
  readonly priceControl: PriceControl;
};

export function buildIndexDtfAddToBasketCall(
  params: BuildIndexDtfTokenCallParams,
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "addToBasket",
    [getAddress(params.token)],
    params.version,
  );
}

export function buildIndexDtfRemoveFromBasketCall(
  params: BuildIndexDtfTokenCallParams,
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "removeFromBasket",
    [getAddress(params.token)],
    params.version,
  );
}

export function buildIndexDtfSetTvlFeeCall(
  params: BuildIndexDtfPercentageCallParams,
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "setTVLFee",
    [encodePercent(params.percentage)],
    params.version,
  );
}

export function buildIndexDtfSetMintFeeCall(
  params: BuildIndexDtfPercentageCallParams,
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "setMintFee",
    [encodePercent(params.percentage)],
    params.version,
  );
}

export function buildIndexDtfSetSelfFeeCall(
  params: BuildIndexDtfPercentageCallParams,
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "setSelfFee",
    [encodePercent(params.percentage)],
    params.version,
  );
}

export function buildIndexDtfSetFeeRecipientsCall(
  params: BuildIndexDtfCallParams & {
    readonly recipients: readonly IndexDtfFeeRecipient[];
  },
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
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

export function buildIndexDtfSetAuctionLengthCall(
  params: BuildIndexDtfAuctionLengthCallParams,
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "setAuctionLength",
    [toSeconds(params.auctionLength)],
    params.version,
  );
}

export function buildIndexDtfSetMandateCall(
  params: BuildIndexDtfCallParams & { readonly mandate: string },
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "setMandate",
    [params.mandate],
    params.version,
  );
}

export function buildIndexDtfSetNameCall(
  params: BuildIndexDtfCallParams & { readonly name: string },
): IndexDtfCall {
  return encodeIndexDtfCall(params.address, "setName", [params.name], params.version);
}

export function buildIndexDtfSetTrustedFillerRegistryCall(
  params: BuildIndexDtfCallParams & {
    readonly registry: Address;
    readonly enabled: boolean;
  },
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "setTrustedFillerRegistry",
    [getAddress(params.registry), params.enabled],
    params.version,
  );
}

export function buildIndexDtfSetRebalanceControlCall(
  params: BuildIndexDtfSetRebalanceControlCallParams,
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
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

export function buildIndexDtfSetBidsEnabledCall(
  params: BuildIndexDtfCallParams & { readonly enabled: boolean },
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "setBidsEnabled",
    [params.enabled],
    params.version,
  );
}

export function buildIndexDtfSetTradeAllowlistEnabledCall(
  params: BuildIndexDtfCallParams & { readonly enabled: boolean },
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "setTradeAllowlistEnabled",
    [params.enabled],
    params.version,
  );
}

export function buildIndexDtfAddToAllowlistCall(
  params: BuildIndexDtfCallParams & { readonly tokens: readonly Address[] },
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "addToAllowlist",
    [params.tokens.map(getAddress)],
    params.version,
  );
}

export function buildIndexDtfRemoveFromAllowlistCall(
  params: BuildIndexDtfCallParams & { readonly tokens: readonly Address[] },
): IndexDtfCall {
  return encodeIndexDtfCall(
    params.address,
    "removeFromAllowlist",
    [params.tokens.map(getAddress)],
    params.version,
  );
}

export function buildIndexDtfDeprecateCall(
  params: BuildIndexDtfCallParams,
): IndexDtfCall {
  return encodeIndexDtfCall(params.address, "deprecate", [], params.version);
}

function encodeIndexDtfCall(
  address: Address,
  operation: IndexDtfOperation,
  args: readonly unknown[],
  version: IndexDtfVersion,
): IndexDtfCall {
  const { abi, functionName } = getIndexDtfOperation(operation, version);

  return {
    target: getAddress(address),
    calldata: encodeFunctionData({
      abi,
      functionName,
      args,
    } as never) as Hex,
  };
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
