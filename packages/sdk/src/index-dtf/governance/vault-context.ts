import { getAddress } from "viem";

import type { Token } from "@/types/common";

type SubgraphVaultShare = {
  readonly id: string;
  readonly token: { readonly symbol: string; readonly name: string; readonly decimals: number };
};

type SubgraphVaultUnderlying = {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly decimals: number;
};

/** The vault's share token (vlRSR-LCAP and friends); votes are denominated in it. */
export function mapVaultShareToken(vault: SubgraphVaultShare): Token {
  return {
    address: getAddress(vault.id),
    symbol: vault.token.symbol,
    name: vault.token.name,
    decimals: vault.token.decimals,
  };
}

/**
 * The subgraph leaves `underlying` empty for legacy vote tokens it does not track.
 * None are indexed today; a vault without one has no underlying amounts to report,
 * so callers skip it instead of inventing a token.
 */
export function mapVaultUnderlying(underlying: SubgraphVaultUnderlying | null | undefined): Token | undefined {
  if (!underlying) {
    return undefined;
  }

  return {
    address: getAddress(underlying.id),
    symbol: underlying.symbol,
    name: underlying.name,
    decimals: underlying.decimals,
  };
}
