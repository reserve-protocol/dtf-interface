import { getAddress } from "viem";

import type { SupportedChainId } from "@/config";
import type { GovernedIndexDtfsFragment } from "@/index-dtf/subgraph/dtf.generated";
import type { Token } from "@/types/common";
import type { GovernedIndexDtf } from "@/types/governance";

import { sameAddress } from "@/lib/utils";

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

/**
 * A DTF's owner/trading governances, current or legacy, each control that one
 * DTF; the vault's own DAO governance (no such match) controls every DTF staked
 * through the vault.
 */
export function mapGovernedDtfs(
  vault: GovernedIndexDtfsFragment,
  chainId: SupportedChainId,
  governanceId?: string,
): readonly GovernedIndexDtf[] {
  const direct = governanceId
    ? vault.dtfs.filter((dtf) =>
        [dtf.ownerGovernance?.id, dtf.tradingGovernance?.id, ...dtf.legacyAdmins, ...dtf.legacyAuctionApprovers].some(
          (candidate) => candidate !== undefined && sameAddress(candidate, governanceId),
        ),
      )
    : [];
  const dtfs = direct.length > 0 ? direct : vault.dtfs;

  return dtfs.map((dtf) => ({
    address: getAddress(dtf.id),
    chainId,
    symbol: dtf.token.symbol,
    name: dtf.token.name,
  }));
}

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
