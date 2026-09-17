import { FolioVersion, getOpenAuction, getTargetBasket } from "@reserve-protocol/dtf-rebalance-lib";
import { getAddress, type Address } from "viem";

import type { SupportedChainId } from "@/config";
import type {
  BuiltIndexDtfOpenAuction,
  IndexDtfOpenAuctionInput,
  IndexDtfTargetBasketPriceMode,
  OpenAuctionArgs,
} from "@/index-dtf/rebalance/types";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { folioArtifactAbi } from "@/index-dtf/abis/folio-artifact";
import { assertIndexDtfWriteVersion, type IndexDtfWriteVersion } from "@/index-dtf/governance/propose/calls";
import { prepareContractCall } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";

/**
 * Builds the launcher `openAuction` args with `dtf-rebalance-lib` for v5 or v6.
 * Historical and current inputs stay explicit so bots cannot mix time sources by accident.
 */
export function prepareIndexDtfOpenAuctionArgs(params: IndexDtfOpenAuctionInput): BuiltIndexDtfOpenAuction {
  assertIndexDtfWriteVersion(params.version);
  validateOpenAuctionInput(params);
  const auctionLength = params.version === "6.0.0" ? getRequiredAuctionLength(params.auctionLength) : undefined;

  const targetMode = getTargetBasketPriceMode(params);
  const tokenMap = new Map(params.tokens.map((token) => [token.address.toLowerCase(), token]));
  const decimals: bigint[] = [];
  const currentPrices: number[] = [];
  const snapshotPrices: number[] = [];
  const priceError: number[] = [];
  const initialAssets: bigint[] = [];
  const currentAssets: bigint[] = [];
  const weights = [];

  for (const token of params.rebalance.tokens) {
    const address = getAddress(token.token as Address);
    const key = address.toLowerCase();
    const metadata = tokenMap.get(key);
    const prices = params.prices[key];
    const initialWeight = params.initialWeights[key];
    const initialPrice = params.initialPrices[key];
    const tokenPriceError = params.tokenPriceVolatility[key];

    if (!metadata || !prices || !initialWeight || initialPrice === undefined || tokenPriceError === undefined) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `missing openAuction context for token ${address}`,
        meta: { token: address },
      });
    }
    if (!isUsablePrice(prices.currentPrice) || (targetMode === "snapshot" && !isUsablePrice(initialPrice))) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `missing price for token ${address}`,
        meta: { token: address, currentPrice: prices.currentPrice, initialPrice },
      });
    }

    decimals.push(BigInt(metadata.decimals));
    currentPrices.push(prices.currentPrice);
    snapshotPrices.push(initialPrice);
    priceError.push(tokenPriceError);
    initialAssets.push(params.initialAssets[key] ?? 0n);
    currentAssets.push(params.currentAssets[key] ?? 0n);
    weights.push(initialWeight);
  }

  const targetPrices = targetMode === "current" ? currentPrices : snapshotPrices;
  const targetBasket = getTargetBasket(weights, targetPrices, decimals, false);
  const [args, metrics] = getOpenAuction(
    params.version === "6.0.0" ? FolioVersion.V6 : FolioVersion.V5,
    params.rebalance,
    params.supply,
    params.initialSupply,
    initialAssets,
    targetBasket,
    currentAssets,
    decimals,
    currentPrices,
    priceError,
    params.rebalancePercent / 100,
    false,
    ...(auctionLength === undefined ? [] : [auctionLength]),
  );

  return { args, metrics, targetBasket };
}

// A zero, negative or non-finite price would skew weights silently; the lib only checks some of these.
function isUsablePrice(price: number | undefined): price is number {
  return typeof price === "number" && Number.isFinite(price) && price > 0;
}

function getRequiredAuctionLength(auctionLength: bigint | undefined): bigint {
  if (auctionLength === undefined || auctionLength <= 0n) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "auctionLength must be positive for Index DTF 6.0.0",
      meta: { auctionLength },
    });
  }

  return auctionLength;
}

function validateOpenAuctionInput(params: IndexDtfOpenAuctionInput) {
  if (!Number.isFinite(params.rebalancePercent) || params.rebalancePercent < 0 || params.rebalancePercent > 100) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "rebalancePercent must be between 0 and 100",
      meta: { rebalancePercent: params.rebalancePercent },
    });
  }
}

function getTargetBasketPriceMode(params: IndexDtfOpenAuctionInput): IndexDtfTargetBasketPriceMode {
  const mode = params.targetBasketPriceMode ?? (params.isTrackingDtf || params.isHybridDtf ? "current" : "snapshot");

  if (mode !== "current" && mode !== "snapshot") {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "targetBasketPriceMode must be current or snapshot",
      meta: { targetBasketPriceMode: mode },
    });
  }

  return mode;
}

type PrepareIndexDtfOpenAuctionBaseParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly args: OpenAuctionArgs;
};

export type PrepareIndexDtfOpenAuctionParams = PrepareIndexDtfOpenAuctionBaseParams & {
  readonly version: IndexDtfWriteVersion;
  /** v6 only; defaults to the length carried by args built with `prepareIndexDtfOpenAuctionArgs`. */
  readonly auctionLength?: bigint;
};

/** Prepares a version-aware launcher `openAuction(...)` contract call. */
export function prepareIndexDtfOpenAuction(params: PrepareIndexDtfOpenAuctionParams) {
  assertIndexDtfWriteVersion(params.version);
  const commonArgs = [
    params.args.rebalanceNonce,
    params.args.tokens.map((token) => getAddress(token as Address)),
    params.args.newWeights,
    params.args.newPrices,
    params.args.newLimits,
  ] as const;

  if (params.version === "6.0.0") {
    if (
      params.auctionLength !== undefined &&
      params.args.auctionLength !== undefined &&
      params.auctionLength !== params.args.auctionLength
    ) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "auctionLength differs from the length the auction args were built with",
        meta: { auctionLength: params.auctionLength, argsAuctionLength: params.args.auctionLength },
      });
    }
    const auctionLength = getRequiredAuctionLength(params.auctionLength ?? params.args.auctionLength);

    return prepareContractCall({
      chainId: params.chainId,
      address: params.address,
      abi: folioArtifactAbi,
      functionName: "openAuction",
      args: [...commonArgs, auctionLength] as const,
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: dtfIndexAbi,
    functionName: "openAuction",
    args: commonArgs,
  });
}

/** Prepares a community `openAuctionUnrestricted(rebalanceNonce)` contract call. */
export function prepareIndexDtfOpenAuctionUnrestricted(params: {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly rebalanceNonce: bigint;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: dtfIndexAbi,
    functionName: "openAuctionUnrestricted",
    args: [params.rebalanceNonce] as const,
  });
}
