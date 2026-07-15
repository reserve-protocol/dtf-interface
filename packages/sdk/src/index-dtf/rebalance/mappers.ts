import { getAddress, type Address } from "viem";

import type { ReserveApiIndexDtfRebalanceDetail } from "@/client/api";
import type {
  IndexDtfAuction,
  IndexDtfBid,
  IndexDtfCompletedRebalance,
  IndexDtfCompletedRebalanceDetail,
  IndexDtfRebalance,
} from "@/index-dtf/rebalance/types";
import type {
  GetIndexDtfRebalanceQuery,
  GetIndexDtfRebalanceAuctionsQuery,
  GetIndexDtfRebalancesQuery,
} from "@/index-dtf/subgraph/dtf.generated";
import type { Token } from "@/types/common";

import { SdkError } from "@/lib/errors";

type ApiCompletedRebalance = {
  readonly nonce: number;
  readonly timestamp: number;
  readonly availableUntil?: number | null;
  readonly totalRebalancedUsd?: number | null;
  readonly rebalanceGainLossUsd?: number | null;
  readonly rebalanceAccuracy?: number | null;
  readonly isNative?: boolean | null;
};

type SubgraphRebalance =
  | GetIndexDtfRebalancesQuery["rebalances"][number]
  | NonNullable<GetIndexDtfRebalanceQuery["rebalance"]>;
type SubgraphAuction = GetIndexDtfRebalanceAuctionsQuery["auctions"][number];
type SubgraphBid = SubgraphAuction["bids"][number];

export function mapSubgraphRebalance(rebalance: SubgraphRebalance): IndexDtfRebalance {
  return {
    id: rebalance.id,
    nonce: rebalance.nonce,
    tokens: rebalance.tokens.map(mapToken),
    priceControl: rebalance.priceControl,
    weightLowLimit: rebalance.weightLowLimit.map(BigInt),
    weightSpotLimit: rebalance.weightSpotLimit.map(BigInt),
    weightHighLimit: rebalance.weightHighLimit.map(BigInt),
    rebalanceLimits: {
      low: BigInt(rebalance.rebalanceLowLimit),
      spot: BigInt(rebalance.rebalanceSpotLimit),
      high: BigInt(rebalance.rebalanceHighLimit),
    },
    priceLowLimit: rebalance.priceLowLimit.map(BigInt),
    priceHighLimit: rebalance.priceHighLimit.map(BigInt),
    restrictedUntil: Number(rebalance.restrictedUntil),
    availableUntil: Number(rebalance.availableUntil),
    transactionHash: rebalance.transactionHash,
    blockNumber: BigInt(rebalance.blockNumber),
    timestamp: Number(rebalance.timestamp),
  };
}

export function mapSubgraphAuction(auction: SubgraphAuction): IndexDtfAuction {
  return {
    id: auction.id,
    tokens: auction.tokens.map(mapToken),
    weightLowLimit: auction.weightLowLimit.map(BigInt),
    weightSpotLimit: auction.weightSpotLimit.map(BigInt),
    weightHighLimit: auction.weightHighLimit.map(BigInt),
    rebalanceLimits: {
      low: BigInt(auction.rebalanceLowLimit),
      spot: BigInt(auction.rebalanceSpotLimit),
      high: BigInt(auction.rebalanceHighLimit),
    },
    priceLowLimit: auction.priceLowLimit.map(BigInt),
    priceHighLimit: auction.priceHighLimit.map(BigInt),
    startTime: Number(auction.startTime),
    endTime: Number(auction.endTime),
    transactionHash: auction.transactionHash,
    blockNumber: BigInt(auction.blockNumber),
    timestamp: Number(auction.timestamp),
    bids: auction.bids.map(mapSubgraphBid),
  };
}

export function mapApiCompletedRebalance(rebalance: ApiCompletedRebalance): IndexDtfCompletedRebalance {
  return {
    nonce: rebalance.nonce,
    timestamp: rebalance.timestamp,
    ...numberField("availableUntil", rebalance.availableUntil),
    ...numberField("totalRebalancedUsd", rebalance.totalRebalancedUsd),
    ...numberField("rebalanceGainLossUsd", rebalance.rebalanceGainLossUsd),
    ...numberField("rebalanceAccuracy", rebalance.rebalanceAccuracy),
    ...(rebalance.isNative === null || rebalance.isNative === undefined ? {} : { isNative: rebalance.isNative }),
  };
}

export function mapApiCompletedRebalanceDetail(
  rebalance: ReserveApiIndexDtfRebalanceDetail,
): IndexDtfCompletedRebalanceDetail {
  // WHY: `auctions` is always present in a well-formed response ([] when none
  // ran — verified against api.reserve.org base/lcap nonces 1-5). A truly-absent
  // field is malformed, so fail loud rather than mask it as "0 auctions".
  if (!rebalance.auctions) {
    throw new SdkError({
      code: "INVALID_RESPONSE",
      message: "Reserve API completed rebalance detail is missing auctions",
      meta: { nonce: rebalance.nonce },
    });
  }

  return {
    ...mapApiCompletedRebalance(rebalance),
    auctions: rebalance.auctions.map((auction) => ({
      startTime: auction.startTime,
      endTime: auction.endTime,
      bids: auction.bids.map((bid) => ({
        bidder: getAddress(bid.bidder),
        sellToken: mapToken(bid.sellToken),
        buyToken: mapToken(bid.buyToken),
        sellAmount: BigInt(bid.sellAmount),
        buyAmount: BigInt(bid.buyAmount),
        ...numberField("sellAmountUsd", bid.sellAmountUsd),
        ...numberField("buyAmountUsd", bid.buyAmountUsd),
        ...numberField("priceImpactUsd", bid.priceImpactUsd),
      })),
      ...numberField("totalSellAmountUsd", auction.totalSellAmountUsd),
      ...numberField("totalBuyAmountUsd", auction.totalBuyAmountUsd),
    })),
    ...numberField("rebalanceGainLossPercent", rebalance.rebalanceGainLossPercent),
    ...numberField("marketCapAtStart", rebalance.marketCapAtStart),
    ...numberField("avgPriceImpactPercent", rebalance.avgPriceImpactPercent),
    ...numberField("totalPriceImpactUsd", rebalance.totalPriceImpactUsd),
    ...numberField("marketCapRebalanceImpact", rebalance.marketCapRebalanceImpact),
    ...numberField("trackingBasketDeviation", rebalance.trackingBasketDeviation),
    ...numberField("nativeBasketDeviation", rebalance.nativeBasketDeviation),
  };
}

function numberField<TKey extends string>(
  key: TKey,
  value: number | null | undefined,
): Record<TKey, number> | Record<string, never> {
  return value === null || value === undefined ? {} : ({ [key]: value } as Record<TKey, number>);
}

function mapSubgraphBid(bid: SubgraphBid): IndexDtfBid {
  return {
    id: bid.id,
    bidder: getAddress(bid.bidder),
    sellToken: mapToken(bid.sellToken),
    buyToken: mapToken(bid.buyToken),
    sellAmount: BigInt(bid.sellAmount),
    buyAmount: BigInt(bid.buyAmount),
    blockNumber: BigInt(bid.blockNumber),
    timestamp: Number(bid.timestamp),
    transactionHash: bid.transactionHash,
  };
}

function mapToken(token: {
  readonly address: string;
  readonly name?: string;
  readonly symbol: string;
  readonly decimals: number;
}): Token {
  return {
    address: getAddress(token.address) as Address,
    name: token.name ?? token.symbol,
    symbol: token.symbol,
    decimals: token.decimals,
  };
}
