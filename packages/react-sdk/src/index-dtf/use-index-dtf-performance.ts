import { useCallback } from "react";

import type { GetIndexDtfPriceHistoryParams, IndexDtfPricePoint } from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import type { DtfQueryOptions } from "@/query";

import { useDtfSdk } from "@/provider";
import { indexDtfPriceHistoryQueryOptions } from "@/query-options";

export type IndexDtfPerformancePoint = {
  readonly timestamp: number;
  readonly price: number;
  readonly marketCap: number;
  readonly totalSupply: number;
  readonly basket: IndexDtfPricePoint["basket"];
};

export type UseIndexDtfPerformanceParams = GetIndexDtfPriceHistoryParams & {
  readonly currentPrice?: number;
  readonly currentTotalSupply?: number;
};

/**
 * Keeps the last API row for each timestamp. API input is expected in
 * ascending order; already-unique input preserves that order without sorting.
 */
export function dedupeIndexDtfPricePoints<T extends { readonly timestamp: number }>(points: readonly T[]): T[] {
  const byTimestamp = new Map<number, T>();
  for (const point of points) {
    byTimestamp.set(point.timestamp, point);
  }
  if (byTimestamp.size === points.length) {
    return [...points];
  }
  return [...byTimestamp.values()].sort((a, b) => a.timestamp - b.timestamp);
}

/** Composes deduped history with a live point when both live inputs are defined. */
export function composeIndexDtfPerformance(
  points: readonly IndexDtfPricePoint[],
  currentPrice?: number,
  currentTotalSupply?: number,
): readonly IndexDtfPerformancePoint[] {
  const series: IndexDtfPerformancePoint[] = dedupeIndexDtfPricePoints(points);
  const now = Math.floor(Date.now() / 1_000);
  const last = series[series.length - 1];

  // Live point needs both inputs — its marketCap is derived, and a point
  // without one would understate the freshest value instead of extending it.
  if (currentPrice !== undefined && currentTotalSupply !== undefined && (!last || now > last.timestamp)) {
    series.push({
      timestamp: now,
      price: currentPrice,
      marketCap: currentPrice * currentTotalSupply,
      totalSupply: currentTotalSupply,
      basket: [],
    });
  }

  return series;
}

/**
 * Price history composed for display: deduped by timestamp, with a live point
 * appended when both live inputs are defined and extend the series. Zero is a
 * valid resolved value. The cache entry stays the raw point array under the
 * canonical price-history key — composition happens in `select`, after cache.
 */
export function useIndexDtfPerformance(
  params: UseIndexDtfPerformanceParams | undefined,
  options?: Omit<DtfQueryOptions<readonly IndexDtfPricePoint[], readonly IndexDtfPerformancePoint[]>, "select">,
) {
  const sdk = useDtfSdk();
  const currentPrice = params?.currentPrice;
  const currentTotalSupply = params?.currentTotalSupply;
  const historyParams = params
    ? {
        address: params.address,
        chainId: params.chainId,
        from: params.from,
        to: params.to,
        interval: params.interval,
      }
    : undefined;

  const select = useCallback(
    (points: readonly IndexDtfPricePoint[]) => composeIndexDtfPerformance(points, currentPrice, currentTotalSupply),
    [currentPrice, currentTotalSupply],
  );

  return useQuery({
    ...indexDtfPriceHistoryQueryOptions(sdk, historyParams, options),
    select,
  });
}
