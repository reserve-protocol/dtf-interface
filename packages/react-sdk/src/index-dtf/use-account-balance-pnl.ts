import { useMemo } from "react";

import type { SupportedChainId } from "@reserve-protocol/sdk";
import type { Address } from "viem";

import { calculateAccountBalancePnl, selectPriceAtMark } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import { dtfQueryKeys } from "@/query-keys";
import { indexDtfPriceHistoryQueryOptions } from "@/query-options";

const PERIOD_SECONDS = {
  "7d": 7 * 24 * 3_600,
} as const;

export type AccountBalancePnlPeriod = keyof typeof PERIOD_SECONDS;

export type UseAccountBalancePnlParams = {
  readonly account: Address;
  readonly dtf: Address;
  readonly chainId: SupportedChainId;
  readonly period: AccountBalancePnlPeriod;
  /** The position's current USD value; pnl stays null until it's known. */
  readonly currentValue?: number;
};

export type AccountBalancePnl = {
  /** null = hide: not holding at the mark, or an input is unavailable. */
  readonly pnl: number | null;
  /** Every dependent read settled — a null pnl now means "hide", not "loading". */
  readonly isResolved: boolean;
};

export function useAccountBalancePnl(params: UseAccountBalancePnlParams | undefined): AccountBalancePnl {
  const sdk = useDtfSdk();

  // Hour-floored so query keys stay stable within the hour.
  const mark = useMemo(() => {
    const hourFlooredNow = Math.floor(Date.now() / 1_000 / 3_600) * 3_600;
    return params ? hourFlooredNow - PERIOD_SECONDS[params.period] : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.period]);

  const snapshotParams =
    params && mark ? { account: params.account, dtf: params.dtf, chainId: params.chainId, before: mark } : undefined;

  const snapshot = useQuery({
    queryKey: dtfQueryKeys.index.accountBalanceSnapshot(snapshotParams),
    queryFn: () => sdk.index.getAccountBalanceSnapshot(snapshotParams!),
    enabled: Boolean(snapshotParams),
  });

  const snapshotBalance = snapshot.data ? Number(snapshot.data.balance.formatted) : null;
  const holding = snapshotBalance !== null && snapshotBalance > 0;

  // Shares the canonical raw price-history key; the last-positive selection
  // happens here, never inside the shared cache entry.
  const priceParams =
    params && mark && holding
      ? { address: params.dtf, chainId: params.chainId, from: mark - 3_600, to: mark, interval: "1h" as const }
      : undefined;

  const price = useQuery({
    ...indexDtfPriceHistoryQueryOptions(sdk, priceParams),
    enabled: Boolean(priceParams),
    staleTime: Infinity,
  });

  const priceAtMark = price.data ? selectPriceAtMark(price.data) : null;
  const snapshotSettled = snapshot.isSuccess || snapshot.isError;
  const priceSettled = price.isSuccess || price.isError;

  return {
    pnl: calculateAccountBalancePnl({
      snapshotBalance,
      priceAtMark,
      currentValue: params?.currentValue,
    }),
    isResolved: snapshotSettled && (!holding || priceSettled),
  };
}
