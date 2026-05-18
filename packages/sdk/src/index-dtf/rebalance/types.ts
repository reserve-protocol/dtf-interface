import type {
  AuctionMetrics,
  OpenAuctionArgs,
  PriceRange,
  Rebalance,
  RebalanceLimits,
  WeightRange,
} from "@reserve-protocol/dtf-rebalance-lib";
import type { Address } from "viem";

import type { DtfParams, Token } from "@/types/common";
import type { IndexDtfInput } from "@/types/index-dtf";

export type GetIndexDtfRebalancesParams = IndexDtfInput & {
  readonly limit?: number;
  readonly offset?: number;
};

export type GetIndexDtfRebalancesOptions = Pick<GetIndexDtfRebalancesParams, "limit" | "offset">;

export type GetIndexDtfCompletedRebalancesParams = IndexDtfInput & {
  readonly skip?: number;
  readonly limit?: number;
};

export type GetIndexDtfCompletedRebalancesOptions = Pick<GetIndexDtfCompletedRebalancesParams, "skip" | "limit">;

export type GetIndexDtfRebalanceParams = {
  readonly id?: string;
  readonly address?: Address;
  readonly nonce?: string | bigint;
  readonly chainId: DtfParams["chainId"];
};

export type GetIndexDtfCompletedRebalanceParams = DtfParams & {
  readonly nonce: number | bigint | string;
};

export type IndexDtfRebalance = {
  readonly id: string;
  readonly nonce: string;
  readonly tokens: readonly Token[];
  readonly priceControl: string;
  readonly weightLowLimit: readonly bigint[];
  readonly weightSpotLimit: readonly bigint[];
  readonly weightHighLimit: readonly bigint[];
  readonly rebalanceLimits: RebalanceLimits;
  readonly priceLowLimit: readonly bigint[];
  readonly priceHighLimit: readonly bigint[];
  readonly restrictedUntil: number;
  readonly availableUntil: number;
  readonly transactionHash: string;
  readonly blockNumber: bigint;
  readonly timestamp: number;
};

export type IndexDtfBid = {
  readonly id: string;
  readonly bidder: Address;
  readonly sellToken: Token;
  readonly buyToken: Token;
  readonly sellAmount: bigint;
  readonly buyAmount: bigint;
  readonly blockNumber: bigint;
  readonly timestamp: number;
  readonly transactionHash: string;
};

export type IndexDtfAuction = {
  readonly id: string;
  readonly tokens: readonly Token[];
  readonly weightLowLimit: readonly bigint[];
  readonly weightSpotLimit: readonly bigint[];
  readonly weightHighLimit: readonly bigint[];
  readonly rebalanceLimits: RebalanceLimits;
  readonly priceLowLimit: readonly bigint[];
  readonly priceHighLimit: readonly bigint[];
  readonly startTime: number;
  readonly endTime: number;
  readonly blockNumber: bigint;
  readonly timestamp: number;
  readonly transactionHash: string;
  readonly bids: readonly IndexDtfBid[];
};

export type IndexDtfCompletedRebalance = {
  readonly nonce: number;
  readonly timestamp: number;
  readonly availableUntil?: number;
  readonly totalRebalancedUsd?: number;
  readonly rebalanceGainLossUsd?: number;
  readonly rebalanceAccuracy?: number;
  readonly isNative?: boolean;
};

export type IndexDtfCompletedRebalanceBid = {
  readonly bidder: Address;
  readonly sellToken: Token;
  readonly buyToken: Token;
  readonly sellAmount: bigint;
  readonly buyAmount: bigint;
  readonly sellAmountUsd?: number;
  readonly buyAmountUsd?: number;
  readonly priceImpactUsd?: number;
};

export type IndexDtfCompletedRebalanceAuction = {
  readonly startTime: number;
  readonly endTime: number;
  readonly bids: readonly IndexDtfCompletedRebalanceBid[];
  readonly totalSellAmountUsd?: number;
  readonly totalBuyAmountUsd?: number;
};

export type IndexDtfCompletedRebalanceDetail = IndexDtfCompletedRebalance & {
  readonly auctions: readonly IndexDtfCompletedRebalanceAuction[];
  readonly rebalanceGainLossPercent?: number;
  readonly marketCapAtStart?: number;
};

export type IndexDtfCurrentRebalance = Rebalance & {
  readonly bidsEnabled: boolean;
};

export type IndexDtfTargetBasketPriceMode = "current" | "snapshot";

export type IndexDtfOpenAuctionInput = {
  readonly rebalance: IndexDtfCurrentRebalance;
  readonly tokens: readonly Token[];
  readonly supply: bigint;
  readonly initialSupply: bigint;
  readonly currentAssets: Readonly<Record<string, bigint>>;
  readonly initialAssets: Readonly<Record<string, bigint>>;
  readonly initialPrices: Readonly<Record<string, number>>;
  readonly initialWeights: Readonly<Record<string, WeightRange>>;
  readonly prices: Readonly<Record<string, { readonly currentPrice: number; readonly snapshotPrice?: number }>>;
  readonly tokenPriceVolatility: Readonly<Record<string, number>>;
  readonly rebalancePercent: number;
  readonly isTrackingDtf: boolean;
  readonly isHybridDtf?: boolean;
  /**
   * Price source used to derive the target basket.
   *
   * Defaults to the legacy mode: current prices for tracking or hybrid DTFs,
   * snapshot prices for native DTFs.
   */
  readonly targetBasketPriceMode?: IndexDtfTargetBasketPriceMode;
};

export type BuiltIndexDtfOpenAuction = {
  readonly args: OpenAuctionArgs;
  readonly metrics: AuctionMetrics;
  readonly targetBasket: readonly bigint[];
};

export type { OpenAuctionArgs, PriceRange, Rebalance, RebalanceLimits, WeightRange };
