import { createElement, type PropsWithChildren } from "react";

// @vitest-environment jsdom
import type { DtfSdk, IndexDtfAccountBalanceSnapshot } from "@reserve-protocol/sdk";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useIndexDtfAccountBalanceSnapshot } from "@/index-dtf-extra-hooks";
import { DtfSdkProvider } from "@/provider";
import { dtfQueryKeys } from "@/query-keys";

const PARAMS = {
  account: "0x00000000000000000000000000000000000000A1",
  dtf: "0x00000000000000000000000000000000000000D1",
  chainId: 8453,
  before: 1_700_000_000,
} as const;

const SNAPSHOT: IndexDtfAccountBalanceSnapshot = {
  balance: { raw: 2_000_000_000_000_000_000n, formatted: "2" },
  timestamp: 1_699_999_900,
};

describe("useIndexDtfAccountBalanceSnapshot", () => {
  it("keeps the raw snapshot under the canonical key while applying caller select", async () => {
    const getAccountBalanceSnapshot = vi.fn(async () => SNAPSHOT);
    const sdk = { index: { getAccountBalanceSnapshot } } as unknown as DtfSdk;
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    const { result } = renderHook(
      () => useIndexDtfAccountBalanceSnapshot(PARAMS, { select: (snapshot) => snapshot?.timestamp }),
      { wrapper: createWrapper(sdk, queryClient) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(SNAPSHOT.timestamp);
    expect(getAccountBalanceSnapshot).toHaveBeenCalledWith(PARAMS);
    expect(queryClient.getQueryData(dtfQueryKeys.index.accountBalanceSnapshot(PARAMS))).toEqual(SNAPSHOT);
  });

  it("stays disabled until all params exist", () => {
    const getAccountBalanceSnapshot = vi.fn();
    const sdk = { index: { getAccountBalanceSnapshot } } as unknown as DtfSdk;
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    const { result } = renderHook(() => useIndexDtfAccountBalanceSnapshot(undefined), {
      wrapper: createWrapper(sdk, queryClient),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(getAccountBalanceSnapshot).not.toHaveBeenCalled();
  });
});

function createWrapper(sdk: DtfSdk, queryClient: QueryClient) {
  return function wrapper({ children }: PropsWithChildren) {
    return createElement(
      DtfSdkProvider,
      { sdk },
      createElement(QueryClientProvider, { client: queryClient }, children),
    );
  };
}
