import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { Token } from "@/types/common";
import type {
  GetIndexDtfVoteLockTotalsParams,
  IndexDtfVoteLockLifetimeTotals,
  IndexDtfVoteLockTotals,
} from "@/types/governance";

import { supportedChainIds } from "@/config";
import { mapGovernedDtfs, mapVaultShareToken, mapVaultUnderlying } from "@/index-dtf/governance/vault-context";
import {
  GetIndexDtfOpenUnstakeLocksDocument,
  GetIndexDtfStakingPositionsDocument,
  GetIndexDtfVoteLockVaultsDocument,
} from "@/index-dtf/subgraph/dtf.generated";
import { walkSubgraphById } from "@/lib/subgraph-pages";
import { mapAmount } from "@/lib/utils";

/** Reads current staked and pending-unstake balances for every Index DTF vote-lock vault. */
export async function getVoteLockTotals(
  client: DtfClient,
  params: GetIndexDtfVoteLockTotalsParams = {},
): Promise<readonly IndexDtfVoteLockTotals[]> {
  const chains = await Promise.all(
    (params.chainIds ?? supportedChainIds).map((chainId) => getChainVoteLockTotals(client, chainId)),
  );

  return chains.flat();
}

async function getChainVoteLockTotals(
  client: DtfClient,
  chainId: SupportedChainId,
): Promise<readonly IndexDtfVoteLockTotals[]> {
  const [vaults, locks] = await Promise.all([
    walkSubgraphById(async (cursor, pageSize) => {
      const data = await client.subgraph.queryIndex({
        chainId,
        query: GetIndexDtfVoteLockVaultsDocument,
        variables: { limit: pageSize, cursor },
      });

      return data.stakingTokens;
    }, "stakingTokens"),
    walkSubgraphById(async (cursor, pageSize) => {
      const data = await client.subgraph.queryIndex({
        chainId,
        query: GetIndexDtfOpenUnstakeLocksDocument,
        variables: { limit: pageSize, cursor },
      });

      return data.locks;
    }, "locks"),
  ]);

  const pendingByVault = new Map<string, { amount: bigint; count: number }>();
  for (const lock of locks) {
    const key = lock.token.id.toLowerCase();
    const pending = pendingByVault.get(key) ?? { amount: 0n, count: 0 };
    pendingByVault.set(key, { amount: pending.amount + BigInt(lock.amount), count: pending.count + 1 });
  }

  return vaults.flatMap((vault) => {
    const underlying = mapVaultUnderlying(vault.underlying);

    if (!underlying) {
      return [];
    }

    const pending = pendingByVault.get(vault.id.toLowerCase()) ?? { amount: 0n, count: 0 };

    return [
      {
        chainId,
        stToken: mapVaultShareToken(vault),
        underlying,
        staked: mapAmount(vault.totalAssets, underlying.decimals),
        shareSupply: mapAmount(vault.token.totalSupply, vault.token.decimals),
        pendingUnstake: mapAmount(pending.amount, underlying.decimals),
        pendingUnstakeCount: pending.count,
        dtfs: mapGovernedDtfs(vault, chainId),
      },
    ];
  });
}

/**
 * Sums lifetime deposits and withdrawals per vault from every indexed staking
 * position. Walks positions page by page, so cache it longer than live totals;
 * throws `LIMIT_EXCEEDED` past the walk ceiling rather than under-summing.
 */
export async function getVoteLockLifetimeTotals(
  client: DtfClient,
  params: GetIndexDtfVoteLockTotalsParams = {},
): Promise<readonly IndexDtfVoteLockLifetimeTotals[]> {
  const chains = await Promise.all(
    (params.chainIds ?? supportedChainIds).map((chainId) => getChainLifetimeTotals(client, chainId)),
  );

  return chains.flat();
}

type LifetimeAccumulator = {
  stToken: Token;
  underlying: Token;
  deposited: bigint;
  withdrawn: bigint;
  positionCount: number;
};

async function getChainLifetimeTotals(
  client: DtfClient,
  chainId: SupportedChainId,
): Promise<readonly IndexDtfVoteLockLifetimeTotals[]> {
  const positions = await walkSubgraphById(async (cursor, pageSize) => {
    const data = await client.subgraph.queryIndex({
      chainId,
      query: GetIndexDtfStakingPositionsDocument,
      variables: { limit: pageSize, cursor },
    });

    return data.stakingPositions;
  }, "stakingPositions");

  const byVault = new Map<string, LifetimeAccumulator>();
  for (const position of positions) {
    const underlying = mapVaultUnderlying(position.token.underlying);

    if (!underlying) {
      continue;
    }

    const key = position.token.id.toLowerCase();
    const totals = byVault.get(key) ?? {
      stToken: mapVaultShareToken(position.token),
      underlying,
      deposited: 0n,
      withdrawn: 0n,
      positionCount: 0,
    };
    byVault.set(key, {
      stToken: totals.stToken,
      underlying,
      deposited: totals.deposited + BigInt(position.totalDeposited),
      withdrawn: totals.withdrawn + BigInt(position.totalWithdrawn),
      positionCount: totals.positionCount + 1,
    });
  }

  return Array.from(byVault.values(), (totals) => ({
    chainId,
    stToken: totals.stToken,
    underlying: totals.underlying,
    lifetimeDeposited: mapAmount(totals.deposited, totals.underlying.decimals),
    lifetimeWithdrawn: mapAmount(totals.withdrawn, totals.underlying.decimals),
    positionCount: totals.positionCount,
  }));
}
