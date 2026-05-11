import { FolioVersion, getOpenAuction, getTargetBasket } from "@reserve-protocol/dtf-rebalance-lib";
import { getAddress, type Address } from "viem";

import type { SupportedChainId } from "@/defaults";
import type {
  BuiltIndexDtfOpenAuction,
  IndexDtfOpenAuctionInput,
  IndexDtfTargetBasketPriceMode,
  OpenAuctionArgs,
} from "@/index-dtf/rebalance/types";

import { prepareContractCall } from "@/contract-call";
import { SdkError } from "@/errors";
import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";

/**
 * Builds the v5 launcher `openAuction` args with `dtf-rebalance-lib`.
 * Historical and current inputs stay explicit so bots cannot mix time sources by accident.
 */
export function prepareIndexDtfOpenAuctionArgs(params: IndexDtfOpenAuctionInput): BuiltIndexDtfOpenAuction {
  validateOpenAuctionInput(params);

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

    decimals.push(BigInt(metadata.decimals));
    currentPrices.push(prices.currentPrice);
    snapshotPrices.push(initialPrice);
    priceError.push(tokenPriceError);
    initialAssets.push(params.initialAssets[key] ?? 0n);
    currentAssets.push(params.currentAssets[key] ?? 0n);
    weights.push(initialWeight);
  }

  const targetPrices = getTargetBasketPriceMode(params) === "current" ? currentPrices : snapshotPrices;
  const targetBasket = getTargetBasket(weights, targetPrices, decimals, false);
  const [args, metrics] = getOpenAuction(
    FolioVersion.V5,
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
  );

  return { args, metrics, targetBasket };
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

/** Prepares a v5 launcher `openAuction(...)` contract call. */
export function prepareIndexDtfOpenAuction(params: {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly args: OpenAuctionArgs;
}) {
  const args = [
    params.args.rebalanceNonce,
    params.args.tokens.map((token) => getAddress(token as Address)),
    params.args.newWeights,
    params.args.newPrices,
    params.args.newLimits,
  ] as const;

  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: dtfIndexAbi,
    functionName: "openAuction",
    args,
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
