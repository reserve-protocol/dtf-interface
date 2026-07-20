import { createElement, type PropsWithChildren } from "react";

// @vitest-environment jsdom
import type { DtfSdk, IndexDtfPricePoint } from "@reserve-protocol/sdk";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  composeIndexDtfPerformance,
  dedupeIndexDtfPricePoints,
  useIndexDtfPerformance,
} from "@/index-dtf/use-index-dtf-performance";
import { DtfSdkProvider } from "@/provider";
import { dtfQueryKeys } from "@/query-keys";

const ADDRESS = "0x00000000000000000000000000000000000000D1";

const point = (timestamp: number, price: number): IndexDtfPricePoint =>
  ({ timestamp, price, marketCap: price * 100, totalSupply: 100, basket: [] }) as unknown as IndexDtfPricePoint;

describe("dedupeIndexDtfPricePoints", () => {
  it("keeps the last occurrence per timestamp, ordered", () => {
    const deduped = dedupeIndexDtfPricePoints([point(1, 1), point(2, 2), point(2, 2.5), point(3, 3)]);

    expect(deduped.map((p) => [p.timestamp, p.price])).toEqual([
      [1, 1],
      [2, 2.5],
      [3, 3],
    ]);
  });
});

describe("composeIndexDtfPerformance", () => {
  it("appends a live point only when price AND supply are provided", () => {
    const points = [point(1, 1)];

    expect(composeIndexDtfPerformance(points, 2)).toHaveLength(1);
    expect(composeIndexDtfPerformance(points, undefined, 100)).toHaveLength(1);

    const composed = composeIndexDtfPerformance(points, 2, 100);
    expect(composed).toHaveLength(2);
    expect(composed[1]).toMatchObject({ price: 2, marketCap: 200, totalSupply: 100 });
  });
});

describe("useIndexDtfPerformance", () => {
  it("caches the raw point array; composition never enters the shared cache entry", async () => {
    const raw = [point(1, 1), point(1, 1.5), point(2, 2)];
    const sdk = { index: { getPriceHistory: vi.fn(async () => raw) } } as unknown as DtfSdk;
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    function wrapper({ children }: PropsWithChildren) {
      return createElement(
        DtfSdkProvider,
        { sdk },
        createElement(QueryClientProvider, { client: queryClient }, children),
      );
    }

    const params = { address: ADDRESS, chainId: 8453, from: 0, to: 10, interval: "1h" } as const;
    const { result } = renderHook(
      () => useIndexDtfPerformance({ ...params, currentPrice: 3, currentTotalSupply: 100 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Composed for the consumer: deduped + live point.
    expect(result.current.data?.map((p) => p.price)).toEqual([1.5, 2, 3]);
    // The shared cache entry stays the raw array — currentPrice is not in the
    // key and never pollutes it.
    expect(queryClient.getQueryData(dtfQueryKeys.index.priceHistory(params))).toEqual(raw);
  });
});
