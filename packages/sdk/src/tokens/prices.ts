import { getAddress, type Address } from "viem";
import type { DtfClient } from "../client.js";
import type {
  GetTokenPricesParams,
  GetTokenVolatilitiesParams,
  TokenPrice,
  TokenVolatility,
} from "../types/common.js";

type TokenPriceResponse = {
  readonly address: string;
  readonly price?: number;
  readonly priceSources?: readonly string[];
  readonly source?: string;
};

type TokenListResponse = {
  readonly address: string;
  readonly volatility?: TokenVolatility;
};

export async function getTokenPrices(
  client: DtfClient,
  params: GetTokenPricesParams,
): Promise<readonly TokenPrice[]> {
  const addresses = normalizeAddresses(params.addresses);

  if (addresses.length === 0) {
    return [];
  }

  const response = await client.api.get<readonly TokenPriceResponse[]>({
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

export async function getTokenVolatilities(
  client: DtfClient,
  params: GetTokenVolatilitiesParams,
): Promise<Readonly<Record<Address, TokenVolatility>>> {
  const addresses = normalizeAddresses(params.addresses);
  const result: Record<Address, TokenVolatility> = {};

  if (addresses.length === 0) {
    return result;
  }

  const response = await client.api.get<readonly TokenListResponse[]>({
    path: "/zapper/tokens",
    query: {
      chainId: params.chainId,
      unfiltered: true,
    },
  });
  const volatilityByAddress = new Map(
    response.map((token) => [
      token.address.toLowerCase(),
      token.volatility ?? "medium",
    ]),
  );

  for (const address of addresses) {
    result[address] = volatilityByAddress.get(address.toLowerCase()) ?? "medium";
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

function normalizeTokenPrices(
  addresses: readonly Address[],
  prices: readonly TokenPrice[],
): readonly TokenPrice[] {
  const priceByAddress = new Map(
    prices.map((token) => [token.address.toLowerCase(), token]),
  );

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
