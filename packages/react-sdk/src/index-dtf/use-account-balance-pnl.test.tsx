import { createElement, type PropsWithChildren } from "react";

// @vitest-environment jsdom
import type { DtfSdk } from "@reserve-protocol/sdk";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAccountBalancePnl } from "@/index-dtf/use-account-balance-pnl";
import { DtfSdkProvider } from "@/provider";

const ACCOUNT = "0x00000000000000000000000000000000000000A1";
const DTF = "0x00000000000000000000000000000000000000D1";

function setup(sdkOverrides: {
  snapshot: { balance: { raw: bigint; formatted: string }; timestamp: number } | null;
  prices?: readonly { timestamp: number; price: number }[];
}) {
  const getAccountBalanceSnapshot = vi.fn(async () => sdkOverrides.snapshot);
  const getPriceHistory = vi.fn(async () => sdkOverrides.prices ?? []);
  const sdk = { index: { getAccountBalanceSnapshot, getPriceHistory } } as unknown as DtfSdk;
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  function wrapper({ children }: PropsWithChildren) {
    return createElement(
      DtfSdkProvider,
      { sdk },
      createElement(QueryClientProvider, { client: queryClient }, children),
    );
  }

  return { wrapper, getPriceHistory };
}

const PARAMS = { account: ACCOUNT, dtf: DTF, chainId: 8453, period: "7d", currentValue: 25 } as const;

describe("useAccountBalancePnl", () => {
  it("derives pnl from the snapshot balance and the price at the mark", async () => {
    const { wrapper } = setup({
      snapshot: { balance: { raw: 2_000_000_000_000_000_000n, formatted: "2" }, timestamp: 1 },
      prices: [
        { timestamp: 1, price: 0 },
        { timestamp: 2, price: 10 },
      ],
    });

    const { result } = renderHook(() => useAccountBalancePnl(PARAMS), { wrapper });

    await waitFor(() => expect(result.current.isResolved).toBe(true));
    expect(result.current.pnl).toBe(5); // 25 − 2 × 10
  });

  it("resolves to a hidden pnl without holding at the mark — no price fetch fired", async () => {
    const { wrapper, getPriceHistory } = setup({ snapshot: null });

    const { result } = renderHook(() => useAccountBalancePnl(PARAMS), { wrapper });

    await waitFor(() => expect(result.current.isResolved).toBe(true));
    expect(result.current.pnl).toBeNull();
    expect(getPriceHistory).not.toHaveBeenCalled();
  });

  it("hides pnl when the price window has no real price", async () => {
    const { wrapper } = setup({
      snapshot: { balance: { raw: 1n, formatted: "1" }, timestamp: 1 },
      prices: [{ timestamp: 1, price: 0 }],
    });

    const { result } = renderHook(() => useAccountBalancePnl(PARAMS), { wrapper });

    await waitFor(() => expect(result.current.isResolved).toBe(true));
    expect(result.current.pnl).toBeNull();
  });
});
