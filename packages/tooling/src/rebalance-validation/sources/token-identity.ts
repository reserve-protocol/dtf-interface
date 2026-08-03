import type { SupportedChainId } from "@reserve-protocol/sdk";

const COINGECKO_PLATFORM: Record<SupportedChainId, string> = {
  1: "ethereum",
  8453: "base",
  56: "binance-smart-chain",
};

export type ListedCoin = { readonly id: string; readonly symbol: string };

/**
 * Contract-address → coin map from CoinGecko, used to check that a basket
 * address is the contract the outside world associates with that symbol.
 *
 * A listing is evidence, not proof: it catches a look-alike or typo'd address,
 * and it does not cover every legitimate bridged wrapper, so an unlisted
 * address is a prompt to verify by hand rather than a verdict.
 */
export async function fetchListedCoinsByAddress(chainId: SupportedChainId): Promise<Map<string, ListedCoin>> {
  const platform = COINGECKO_PLATFORM[chainId];
  const response = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=true", {
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) {
    throw new Error(`coingecko coins/list ${response.status}`);
  }
  const coins = (await response.json()) as readonly {
    readonly id: string;
    readonly symbol: string;
    readonly platforms?: Record<string, string | null>;
  }[];
  const byAddress = new Map<string, ListedCoin>();

  for (const coin of coins) {
    const address = platform === undefined ? undefined : coin.platforms?.[platform];
    if (address) {
      byAddress.set(address.toLowerCase(), { id: coin.id, symbol: coin.symbol.toUpperCase() });
    }
  }

  return byAddress;
}

/** Bridged wrappers keep the underlying's ticker under a prefixed listing symbol. */
const SYMBOL_ALIASES: Record<string, string> = {
  BTCB: "BTC",
  WBNB: "BNB",
  WETH: "ETH",
};

export const symbolMatchesListing = (basketSymbol: string, listedSymbol: string): boolean => {
  const normalize = (symbol: string) => {
    const upper = symbol.toUpperCase();

    return SYMBOL_ALIASES[upper] ?? upper;
  };

  return normalize(basketSymbol) === normalize(listedSymbol);
};
