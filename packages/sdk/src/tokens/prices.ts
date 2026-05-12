import { getAddress, isAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { GetTokenPricesParams, TokenPrice, TokenVolatility } from "@/types/common";

type RawZapperToken = {
  readonly address?: string;
  readonly token?: { readonly address?: string };
  readonly volatility?: TokenVolatility;
};

const TOKEN_VOLATILITIES = new Set<TokenVolatility>(["low", "medium", "high", "degen"]);

export function getTokenPrices(client: DtfClient, params: GetTokenPricesParams): Promise<readonly TokenPrice[]> {
  return client.api.getTokenPrices(params);
}

export async function getTokenVolatilities(
  client: DtfClient,
  params: GetTokenPricesParams,
): Promise<Readonly<Partial<Record<Address, TokenVolatility>>>> {
  const requested = new Set(params.addresses.map((address) => getAddress(address).toLowerCase()));
  const rows = await client.api.get<readonly RawZapperToken[]>({
    path: "/zapper/tokens",
    query: { chainId: params.chainId },
  });
  const volatilities: Record<Address, TokenVolatility> = {};

  for (const row of rows) {
    const rawAddress = row.address ?? row.token?.address;
    const volatility = row.volatility;

    if (!rawAddress || !isAddress(rawAddress) || !isTokenVolatility(volatility)) continue;

    const address = getAddress(rawAddress);

    if (requested.has(address.toLowerCase())) {
      volatilities[address] = volatility;
    }
  }

  return volatilities;
}

function isTokenVolatility(value: unknown): value is TokenVolatility {
  return typeof value === "string" && TOKEN_VOLATILITIES.has(value as TokenVolatility);
}
