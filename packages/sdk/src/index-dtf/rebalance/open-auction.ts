import { FolioVersion, getOpenAuction, getTargetBasket } from "@reserve-protocol/dtf-rebalance-lib";
import { encodeFunctionData, getAddress, type Address, type Hex } from "viem";
import { SdkError } from "../../errors.js";
import { dtfIndexAbi } from "../abis/dtf-index-abi.js";
import type { BuiltIndexDtfCall } from "../calls.js";
import type { BuiltIndexDtfOpenAuction, IndexDtfOpenAuctionInput, OpenAuctionArgs } from "./types.js";

/**
 * Builds the v5 launcher `openAuction` args with `dtf-rebalance-lib`.
 * Historical and current inputs stay explicit so bots cannot mix time sources by accident.
 */
export function buildIndexDtfOpenAuctionArgs(
  params: IndexDtfOpenAuctionInput,
): BuiltIndexDtfOpenAuction {
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

  const targetPrices = params.isTrackingDtf || params.isHybridDtf
    ? currentPrices
    : snapshotPrices;
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

/** Builds calldata for the v5 launcher `openAuction(...)` call. */
export function buildIndexDtfOpenAuctionCall(params: {
  readonly address: Address;
  readonly args: OpenAuctionArgs;
}): BuiltIndexDtfCall<readonly [bigint, readonly Address[], OpenAuctionArgs["newWeights"], OpenAuctionArgs["newPrices"], OpenAuctionArgs["newLimits"]]> {
  const args = [
    params.args.rebalanceNonce,
    params.args.tokens.map((token) => getAddress(token as Address)),
    params.args.newWeights,
    params.args.newPrices,
    params.args.newLimits,
  ] as const;

  return {
    target: getAddress(params.address),
    functionName: "openAuction",
    args,
    calldata: encodeFunctionData({ abi: dtfIndexAbi, functionName: "openAuction", args }) as Hex,
  };
}

/** Builds calldata for community `openAuctionUnrestricted(rebalanceNonce)`. */
export function buildIndexDtfOpenAuctionUnrestrictedCall(params: {
  readonly address: Address;
  readonly rebalanceNonce: bigint;
}): BuiltIndexDtfCall<readonly [bigint]> {
  const args = [params.rebalanceNonce] as const;

  return {
    target: getAddress(params.address),
    functionName: "openAuctionUnrestricted",
    args,
    calldata: encodeFunctionData({
      abi: dtfIndexAbi,
      functionName: "openAuctionUnrestricted",
      args,
    }) as Hex,
  };
}
