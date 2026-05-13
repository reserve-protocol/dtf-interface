import { getAddress, type Address } from "viem";

import type { SupportedChainId } from "@/defaults";
import type { GetTokenPricesParams, TokenPrice } from "@/types/common";

import { get, post, type GetOptions, type PostOptions } from "@/transports/api";

export type ReserveApiDtfBasketToken = {
  readonly address: string;
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
  readonly interval: "1h" | "1d";
};

export type GetIndexDtfPriceParams = {
  readonly chainId: SupportedChainId;
  readonly address: Address;
};

export type GetIndexDtfPriceHistoryParams = GetIndexDtfPriceParams & {
  readonly from: number;
  readonly to: number;
  readonly interval: "1h" | "1d";
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

type TokenPriceResponse = {
  readonly address: string;
  readonly price?: number;
  readonly priceSources?: readonly string[];
  readonly source?: string;
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

export function createDtfClientApi({ baseUrl }: { readonly baseUrl: string }): DtfClientApi {
  const apiGet = <TResult>(options: Omit<GetOptions, "baseUrl">) =>
    get<TResult>({
      ...options,
      baseUrl,
    });

  return {
    baseUrl,
    get(options) {
      return apiGet(options);
    },
    post(options) {
      return post({
        ...options,
        baseUrl,
      });
    },
    getTokenPrices(params) {
      return getTokenPrices(apiGet, params);
    },
    getDtfPrices(params) {
      const addresses = normalizeAddresses(params.addresses);

      if (addresses.length === 0) {
        return Promise.resolve([]);
      }

      return apiGet<readonly ReserveApiDtfPrice[]>({
        path: "/current/dtfs",
        query: {
          chainId: params.chainId,
          addresses: addresses.join(","),
        },
      });
    },
    getHistoricalTokenPrices(params) {
      return apiGet<ReserveApiHistoricalTokenPrices>({
        path: "/historical/prices",
        query: {
          chainId: params.chainId,
          from: params.from,
          to: params.to,
          interval: params.interval,
          address: getAddress(params.address).toLowerCase(),
        },
      });
    },
    getBasketTokenPricesWithSnapshot(params) {
      return getBasketTokenPricesWithSnapshot(apiGet, params);
    },
    getIndexDtfPrice(params) {
      return apiGet<ReserveApiIndexDtfPrice>({
        path: "/current/dtf",
        query: {
          address: getAddress(params.address).toLowerCase(),
          chainId: params.chainId,
        },
      });
    },
    getIndexDtfPriceHistory(params) {
      return apiGet<ReserveApiIndexDtfPriceHistory>({
        path: "/historical/dtf",
        query: {
          chainId: params.chainId,
          address: getAddress(params.address).toLowerCase(),
          from: params.from,
          to: params.to,
          interval: params.interval,
        },
      });
    },
    getIndexDtfBasketSnapshot(params) {
      const blockNumber = params.blockNumber === undefined ? undefined : Number(params.blockNumber);

      return apiGet<ReserveApiIndexDtfBasketSnapshot>({
        path: blockNumber === undefined ? "/current/dtf" : "/snapshot/dtf",
        query: {
          address: getAddress(params.address).toLowerCase(),
          chainId: params.chainId,
          blockNumber,
          cache: false,
        },
      });
    },
    getIndexDtfRebalanceHistory(params) {
      return apiGet<readonly ReserveApiIndexDtfRebalanceHistoryItem[]>({
        path: "/dtf/rebalance",
        query: {
          address: getAddress(params.address).toLowerCase(),
          chainId: params.chainId,
          skip: params.skip ?? 0,
          limit: params.limit ?? 50,
        },
      });
    },
    getIndexDtfRebalanceDetail(params) {
      return apiGet<ReserveApiIndexDtfRebalanceDetail>({
        path: "/dtf/rebalance",
        query: {
          address: getAddress(params.address).toLowerCase(),
          chainId: params.chainId,
          nonce: String(params.nonce),
        },
      });
    },
  };
}

async function getTokenPrices(
  apiGet: <TResult>(options: Omit<GetOptions, "baseUrl">) => Promise<TResult>,
  params: GetTokenPricesParams,
): Promise<readonly TokenPrice[]> {
  const addresses = normalizeAddresses(params.addresses);

  if (addresses.length === 0) {
    return [];
  }

  const response = await apiGet<readonly TokenPriceResponse[]>({
    path: "/current/prices",
    query: {
      chainId: params.chainId,
      tokens: addresses.join(","),
    },
  });

  return normalizeTokenPrices(
    addresses,
    response.map((token) => ({
      address: getAddress(token.address),
      price: token.price ?? 0,
      timestamp: Date.now(),
      ...(token.priceSources ? { priceSources: token.priceSources } : {}),
      ...(token.source ? { source: token.source } : {}),
    })),
  );
}

async function getBasketTokenPricesWithSnapshot(
  apiGet: <TResult>(options: Omit<GetOptions, "baseUrl">) => Promise<TResult>,
  params: GetBasketTokenPricesWithSnapshotParams,
): Promise<TokenPriceWithSnapshot> {
  const assets = normalizeAddresses(params.assets);
  const result: TokenPriceWithSnapshot = {};

  if (assets.length === 0) {
    return result;
  }

  const currentPrices = await getTokenPrices(apiGet, {
    chainId: params.chainId,
    addresses: assets,
  });

  for (const token of currentPrices) {
    result[token.address.toLowerCase()] = {
      currentPrice: token.price,
      snapshotPrice: token.price,
    };
  }

  if (params.timestamp === undefined) {
    return result;
  }

  const from = params.timestamp - 60 * 60;
  const to = params.timestamp + 60 * 60;
  const historicalPrices = await Promise.all(
    assets.map((asset) =>
      apiGet<ReserveApiHistoricalTokenPrices>({
        path: "/historical/prices",
        query: {
          chainId: params.chainId,
          from,
          to,
          interval: "1h",
          address: asset.toLowerCase(),
        },
      }),
    ),
  );

  for (let i = 0; i < historicalPrices.length; i++) {
    const asset = assets[i]!;
    const priceResult = historicalPrices[i]!;
    const key = getAddress(priceResult.address || asset).toLowerCase();
    const midpoint = priceResult.timeseries[Math.floor(priceResult.timeseries.length / 2)];

    result[key] = {
      currentPrice: result[key]?.currentPrice ?? 0,
      snapshotPrice: midpoint?.price ?? 0,
    };
  }

  return result;
}

function normalizeAddresses(addresses: readonly Address[]): Address[] {
  const seen = new Set<string>();
  const result: Address[] = [];

  for (const address of addresses) {
    const normalized = getAddress(address);
    const key = normalized.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      result.push(normalized);
    }
  }

  return result;
}

function normalizeTokenPrices(addresses: readonly Address[], prices: readonly TokenPrice[]): readonly TokenPrice[] {
  const priceByAddress = new Map(prices.map((token) => [token.address.toLowerCase(), token]));

  return addresses.map((address) => {
    const price = priceByAddress.get(address.toLowerCase());

    return {
      address,
      price: price?.price ?? 0,
      timestamp: price?.timestamp ?? Date.now(),
      ...(price?.priceSources ? { priceSources: price.priceSources } : {}),
      ...(price?.source ? { source: price.source } : {}),
    };
  });
}
