import { getAddress, type Address } from "viem";

import type {
  GetBasketTokenPricesWithSnapshotParams,
  ReserveApiHistoricalTokenPrices,
  TokenPriceWithSnapshot,
} from "@/types/api";
import type { GetOptions } from "@/transports/api";
import type { GetTokenPricesParams, TokenPrice } from "@/types/common";

import { uniqueAddresses } from "@/lib/utils";

type ApiGet = <TResult>(options: Omit<GetOptions, "baseUrl">) => Promise<TResult>;

type TokenPriceResponse = {
  readonly address: string;
  readonly price?: number;
  readonly priceSources?: readonly string[];
  readonly source?: string;
};

export async function getApiTokenPrices(
  apiGet: ApiGet,
  params: GetTokenPricesParams,
): Promise<readonly TokenPrice[]> {
  const addresses = uniqueAddresses(params.addresses);

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
  const timestamp = Date.now();

  return normalizeTokenPrices(
    addresses,
    response.map((token) => ({
      address: getAddress(token.address),
      price: token.price ?? 0,
      timestamp,
      ...(token.priceSources ? { priceSources: token.priceSources } : {}),
      ...(token.source ? { source: token.source } : {}),
    })),
    timestamp,
  );
}

export async function getBasketTokenPricesWithSnapshot(
  apiGet: ApiGet,
  params: GetBasketTokenPricesWithSnapshotParams,
): Promise<TokenPriceWithSnapshot> {
  const assets = uniqueAddresses(params.assets);
  const result: TokenPriceWithSnapshot = {};

  if (assets.length === 0) {
    return result;
  }

  const currentPrices = await getApiTokenPrices(apiGet, {
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

function normalizeTokenPrices(
  addresses: readonly Address[],
  prices: readonly TokenPrice[],
  timestamp: number,
): readonly TokenPrice[] {
  const priceByAddress = new Map(prices.map((token) => [token.address.toLowerCase(), token]));

  return addresses.map((address) => {
    const price = priceByAddress.get(address.toLowerCase());

    return {
      address,
      price: price?.price ?? 0,
      timestamp: price?.timestamp ?? timestamp,
      ...(price?.priceSources ? { priceSources: price.priceSources } : {}),
      ...(price?.source ? { source: price.source } : {}),
    };
  });
}
