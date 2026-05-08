import { getAddress, type Address } from "viem";
import type { DtfClient } from "../client.js";
import type {
  GetTokenPricesParams,
  GetTokenVolatilitiesParams,
  TokenPrice,
  TokenVolatility,
} from "../types/common.js";

type TokenListResponse = {
  readonly address: string;
  readonly volatility?: TokenVolatility;
};

export async function getTokenPrices(
  client: DtfClient,
  params: GetTokenPricesParams,
): Promise<readonly TokenPrice[]> {
  return client.api.getTokenPrices(params);
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
