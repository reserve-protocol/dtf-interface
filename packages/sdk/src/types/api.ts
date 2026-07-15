import type { Address } from "viem";

import type { SupportedChainId } from "@/config";
import type { GetOptions, PostOptions } from "@/transports/api";
import type { DtfStatus, GetTokenPricesParams, TokenPrice, TokenVolatility } from "@/types/common";

export type ReserveApiDtfBasketToken = {
  readonly address: string;
  readonly name?: string;
  readonly symbol?: string;
  readonly amount: number;
  readonly amountRaw: string;
  readonly decimals: number;
  readonly price: number;
  readonly weight: string;
  readonly priceSource?: string;
};

export type ReserveApiIndexDtfPrice = {
  readonly price: number;
  readonly marketCap: number;
  readonly totalSupply: number;
  readonly basket: readonly ReserveApiDtfBasketToken[];
};

export type ReserveApiDtfPrice = {
  readonly address: string;
  readonly price: number;
  readonly marketCap?: number;
  readonly totalSupply?: number;
  readonly basket: readonly ReserveApiDtfBasketToken[];
};

export type ReserveApiIndexDtfPriceHistory = {
  readonly address: string;
  readonly timeseries: readonly {
    readonly timestamp: number;
    readonly price: number;
    readonly marketCap: number;
    readonly totalSupply: number;
    readonly basket: readonly {
      readonly address: string;
      readonly price: number;
      readonly amount: number;
    }[];
  }[];
};

export type ReserveApiIndexDtfBasketSnapshot = {
  readonly price: number;
  readonly basket: readonly {
    readonly address: string;
    readonly symbol: string;
    readonly decimals: number;
    readonly price: number;
    readonly weight: string;
  }[];
};

export type ReserveApiIndexDtfRebalanceHistoryItem = {
  readonly nonce: number;
  readonly timestamp: number;
  readonly availableUntil?: number | null;
  readonly totalRebalancedUsd?: number | null;
  readonly rebalanceGainLossUsd?: number | null;
  readonly rebalanceAccuracy?: number | null;
  readonly isNative?: boolean | null;
};

export type ReserveApiIndexDtfRebalanceDetail = {
  readonly nonce: number;
  readonly timestamp: number;
  readonly auctions?: readonly {
    readonly startTime: number;
    readonly endTime: number;
    readonly bids: readonly {
      readonly bidder: string;
      readonly sellToken: {
        readonly address: string;
        readonly symbol: string;
        readonly name?: string;
        readonly decimals: number;
      };
      readonly buyToken: {
        readonly address: string;
        readonly symbol: string;
        readonly name?: string;
        readonly decimals: number;
      };
      readonly sellAmount: string;
      readonly buyAmount: string;
      readonly sellAmountUsd?: number | null;
      readonly buyAmountUsd?: number | null;
      readonly priceImpactUsd?: number | null;
    }[];
    readonly totalSellAmountUsd?: number | null;
    readonly totalBuyAmountUsd?: number | null;
  }[];
  readonly availableUntil?: number | null;
  readonly totalRebalancedUsd?: number | null;
  readonly rebalanceGainLossUsd?: number | null;
  readonly rebalanceGainLossPercent?: number | null;
  readonly marketCapAtStart?: number | null;
  readonly rebalanceAccuracy?: number | null;
  readonly isNative?: boolean | null;
};

export type ReserveApiHistoricalTokenPrices = {
  readonly address: string;
  readonly timeseries: readonly {
    readonly price: number;
    readonly timestamp: number;
  }[];
};

export type TokenPriceWithSnapshot = Record<string, { readonly currentPrice: number; readonly snapshotPrice: number }>;

export type GetDtfPricesParams = {
  readonly chainId: SupportedChainId;
  readonly addresses: readonly Address[];
};

export type GetHistoricalTokenPricesParams = {
  readonly chainId: SupportedChainId;
  readonly address: Address;
  readonly from: number;
  readonly to: number;
  readonly interval: "5m" | "1h" | "1d";
};

export type GetIndexDtfPriceParams = {
  readonly chainId: SupportedChainId;
  readonly address: Address;
};

export type GetIndexDtfPriceHistoryParams = GetIndexDtfPriceParams & {
  readonly from: number;
  readonly to: number;
  readonly interval: "5m" | "1h" | "1d";
};

export type GetIndexDtfBasketSnapshotParams = GetIndexDtfPriceParams & {
  readonly blockNumber?: bigint;
};

export type GetIndexDtfRebalanceHistoryParams = GetIndexDtfPriceParams & {
  readonly skip?: number;
  readonly limit?: number;
};

export type GetIndexDtfRebalanceDetailParams = GetIndexDtfPriceParams & {
  readonly nonce: number | bigint | string;
};

export type GetBasketTokenPricesWithSnapshotParams = {
  readonly chainId: SupportedChainId;
  readonly assets: readonly Address[];
  readonly timestamp?: number;
};

export type DiscoverDtf = {
  readonly address: string;
  readonly chainId: number;
  readonly status: DtfStatus;
};

export type GetDiscoverDtfsOptions = {
  readonly chainId?: SupportedChainId;
  readonly limit?: number;
  readonly offset?: number;
  readonly sort?: string;
};

export type GetAssetListParams = {
  readonly chainId: SupportedChainId;
  readonly unfiltered: boolean;
};

export type Asset = {
  readonly chainId: SupportedChainId;
  readonly decimals: number;
  readonly volatility: TokenVolatility;
  readonly address: Address;
  readonly name: string;
  readonly symbol: string;
};

export type PortfolioPeriod = "24h" | "7d" | "1m" | "3m" | "1y" | "all";

export type PortfolioReward = {
  readonly address: Address;
  readonly chainId: number;
  readonly symbol: string;
  readonly name: string;
  readonly decimals: number;
  readonly amount: string;
  readonly value: number;
};

export type PortfolioVoteLock = {
  readonly stTokenAddress: Address;
  readonly chainId: number;
  readonly name: string;
  readonly symbol: string;
  readonly underlying: { readonly address: Address; readonly symbol: string; readonly name: string };
  readonly dtfs: readonly { readonly address: Address; readonly name: string; readonly symbol: string }[];
  readonly apy: number;
  readonly amount: string;
  readonly value: number;
  readonly votingPower: string;
  readonly delegation?: Address;
  readonly rewards: readonly PortfolioReward[];
  readonly locks: readonly {
    readonly lockId: string;
    readonly amount: string;
    readonly unlockTime: number;
    readonly delay: number;
    readonly value: number;
  }[];
  readonly votingWeight: number;
  readonly activeProposals: readonly unknown[];
};

export type PortfolioIndexDtf = {
  readonly address: Address;
  readonly chainId: number;
  readonly name: string;
  readonly symbol: string;
  readonly amount: string;
  readonly value: number;
};

export type AccountPortfolio = {
  readonly totalHoldingsUSD: number;
  readonly indexDTFs: readonly PortfolioIndexDtf[];
  readonly voteLocks: readonly PortfolioVoteLock[];
};

export type PortfolioTransaction = {
  readonly chainId: number;
  readonly timestamp: number;
  readonly block: number;
  readonly txHash: string;
  readonly protocol: string;
  readonly type: string;
  readonly title: string;
  readonly description: string;
  readonly token: {
    readonly address: Address;
    readonly symbol: string;
    readonly underlying?: { readonly address: Address; readonly symbol: string };
  } | null;
  readonly proposalId?: string;
};

export type DtfClientApi = {
  readonly baseUrl: string;
  readonly get: <TResult>(options: Omit<GetOptions, "baseUrl">) => Promise<TResult>;
  readonly post: <TResult, TBody = unknown>(options: Omit<PostOptions<TBody>, "baseUrl">) => Promise<TResult>;
  readonly getTokenPrices: (params: GetTokenPricesParams) => Promise<readonly TokenPrice[]>;
  readonly getDtfPrices: (params: GetDtfPricesParams) => Promise<readonly ReserveApiDtfPrice[]>;
  readonly getHistoricalTokenPrices: (
    params: GetHistoricalTokenPricesParams,
  ) => Promise<ReserveApiHistoricalTokenPrices>;
  readonly getBasketTokenPricesWithSnapshot: (
    params: GetBasketTokenPricesWithSnapshotParams,
  ) => Promise<TokenPriceWithSnapshot>;
  readonly getIndexDtfPrice: (params: GetIndexDtfPriceParams) => Promise<ReserveApiIndexDtfPrice>;
  readonly getIndexDtfPriceHistory: (params: GetIndexDtfPriceHistoryParams) => Promise<ReserveApiIndexDtfPriceHistory>;
  readonly getIndexDtfBasketSnapshot: (
    params: GetIndexDtfBasketSnapshotParams,
  ) => Promise<ReserveApiIndexDtfBasketSnapshot>;
  readonly getIndexDtfRebalanceHistory: (
    params: GetIndexDtfRebalanceHistoryParams,
  ) => Promise<readonly ReserveApiIndexDtfRebalanceHistoryItem[]>;
  readonly getIndexDtfRebalanceDetail: (
    params: GetIndexDtfRebalanceDetailParams,
  ) => Promise<ReserveApiIndexDtfRebalanceDetail>;
};
