import type { SupportedChainId } from "@reserve-protocol/sdk";
import type { Address } from "viem";

import { getAddress, isAddress } from "viem";

const DEXSCREENER_CHAIN: Record<SupportedChainId, string> = {
  1: "ethereum",
  8453: "base",
  56: "bsc",
};

export type PoolQuote = {
  readonly price: number;
  readonly liquidityUsd: number;
  readonly topPool: { readonly dex: string; readonly pair: string; readonly liquidityUsd: number };
};

type DexScreenerPair = {
  readonly chainId?: string;
  readonly dexId?: string;
  readonly baseToken?: { readonly address?: string; readonly symbol?: string };
  readonly quoteToken?: { readonly symbol?: string };
  readonly priceUsd?: string;
  readonly liquidity?: { readonly usd?: number };
};

/**
 * Deepest-pool USD price and pooled liquidity per token, from DEXScreener.
 *
 * Deliberately a different provider than the Reserve API the proposal was built
 * from: an independent mark is the only thing that catches our own price feed
 * being wrong. One token per request — the endpoint caps the response at 30
 * *pairs*, so a batched query silently returns nothing for most of the batch.
 */
export async function fetchPoolQuotes(
  chainId: SupportedChainId,
  tokens: readonly Address[],
): Promise<Map<Address, PoolQuote>> {
  const quotes = new Map<Address, PoolQuote>();

  for (const token of tokens) {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token}`, {
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) continue;
    const { pairs } = (await response.json()) as { pairs?: readonly DexScreenerPair[] | null };
    const quote = selectDeepestPool(pairs ?? [], chainId, token);
    if (quote) quotes.set(token, quote);
  }

  return quotes;
}

export function selectDeepestPool(
  pairs: readonly DexScreenerPair[],
  chainId: SupportedChainId,
  token: Address,
): PoolQuote | undefined {
  const onChain = pairs
    .filter((pair) => pair.chainId === DEXSCREENER_CHAIN[chainId] && pair.priceUsd)
    .filter((pair) => {
      const base = pair.baseToken?.address;

      return typeof base === "string" && isAddress(base) && getAddress(base) === token;
    })
    .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
  const deepest = onChain[0];
  if (!deepest) return undefined;

  return {
    price: Number(deepest.priceUsd),
    liquidityUsd: onChain.reduce((total, pair) => total + (pair.liquidity?.usd ?? 0), 0),
    topPool: {
      dex: deepest.dexId ?? "unknown",
      pair: `${deepest.baseToken?.symbol ?? "?"}/${deepest.quoteToken?.symbol ?? "?"}`,
      liquidityUsd: deepest.liquidity?.usd ?? 0,
    },
  };
}
