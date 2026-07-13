import type { AuctionMetrics } from "@reserve-protocol/dtf-rebalance-lib";

import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";
import type { GetIndexDtfRebalanceLiquidityParams } from "@/index-dtf/rebalance/liquidity";
import type { Token } from "@/types/common";

import {
  buildIndexDtfRebalanceLiquidityTrades,
  getIndexDtfExceededOndoLegs,
  getIndexDtfMaxSafeRebalancePercent,
  getIndexDtfRebalanceLegSizes,
  getIndexDtfRebalanceLiquidity,
  INDEX_DTF_ONDO_LIMIT_BUFFER,
} from "@/index-dtf/rebalance/liquidity";

const A = "0x0000000000000000000000000000000000000001";
const B = "0x0000000000000000000000000000000000000002";
const C = "0x0000000000000000000000000000000000000003";

describe("Index DTF rebalance liquidity", () => {
  it("posts proposed trades to the Reserve API", async () => {
    const post = vi.fn(async () => ({ market: null, totals: { sellUsd: 10, buyUsd: 10 }, assets: [] }));
    const client = { api: { post } } as unknown as DtfClient;
    const params: GetIndexDtfRebalanceLiquidityParams = {
      chainId: 1 as const,
      nativePrice: 3000,
      trades: [{ address: A, side: "sell" as const, amountUsd: 10, price: 1, decimals: 18 }],
    };

    await expect(getIndexDtfRebalanceLiquidity(client, params)).resolves.toMatchObject({ totals: { sellUsd: 10 } });
    expect(post).toHaveBeenCalledWith({ path: "/rebalance/liquidity", body: params });
  });

  it("scales both sides to the matched auction total", () => {
    const trades = buildIndexDtfRebalanceLiquidityTrades({
      metrics: metrics({ [A]: 300, [B]: 100 }, { [C]: 200 }),
      tokens: [token(A, 6), token(B, 8), token(C, 18)],
      prices: {
        [A]: { currentPrice: 1 },
        [B]: { currentPrice: 2 },
        [C]: { currentPrice: 3 },
      },
    });

    expect(trades).toEqual([
      { address: A, side: "sell", amountUsd: 150, price: 1, decimals: 6 },
      { address: B, side: "sell", amountUsd: 50, price: 2, decimals: 8 },
      { address: C, side: "buy", amountUsd: 200, price: 3, decimals: 18 },
    ]);
  });

  it("rejects incomplete token context instead of silently under-checking liquidity", () => {
    expect(() =>
      buildIndexDtfRebalanceLiquidityTrades({
        metrics: metrics({ [A]: 100 }, { [B]: 100 }),
        tokens: [token(A, 18)],
        prices: { [A]: { currentPrice: 1 }, [B]: { currentPrice: 1 } },
      }),
    ).toThrow(`missing rebalance liquidity context for token ${B}`);
  });

  it("sizes each leg against the full opposite side", () => {
    expect(getIndexDtfRebalanceLegSizes(metrics({ [A]: 300, [B]: 100 }, { [C]: 200 }))).toEqual({
      [A]: 200,
      [B]: 100,
      [C]: 200,
    });
  });

  it("finds the tightest buffered Ondo limit", () => {
    const sizes = (percent: number) => ({ [A]: percent * 10_000, [B]: percent * 10_000 });
    const limits = {
      [A]: { capacityUsd: 200_000, tradingOpen: true },
      [B]: { capacityUsd: 800_000, tradingOpen: true },
    };

    const percent = getIndexDtfMaxSafeRebalancePercent(sizes, limits);

    expect(percent).toBe(19);
    expect(sizes(percent)[A]).toBeLessThanOrEqual(200_000 * INDEX_DTF_ONDO_LIMIT_BUFFER);
    expect(sizes(percent + 1)[A]).toBeGreaterThan(200_000 * INDEX_DTF_ONDO_LIMIT_BUFFER);
  });

  it("honors the minimum percent when no Ondo-safe percent exists", () => {
    expect(
      getIndexDtfMaxSafeRebalancePercent(
        (percent) => ({ [A]: percent * 10_000 }),
        { [A]: { capacityUsd: 100, tradingOpen: true } },
        32,
      ),
    ).toBe(32);
  });

  it("reports only open Ondo legs over the buffered cap", () => {
    expect(
      getIndexDtfExceededOndoLegs(
        { [A]: 195_000, [B]: 500_000 },
        {
          [A]: { capacityUsd: 200_000, tradingOpen: true, symbol: "Aon" },
          [B]: { capacityUsd: 1_000, tradingOpen: false, symbol: "Bon" },
        },
      ),
    ).toEqual([{ address: A, symbol: "Aon", sizeUsd: 195_000, capacityUsd: 200_000 }]);
  });
});

function metrics(surplus: Record<string, number>, deficit: Record<string, number>): AuctionMetrics {
  return {
    surplusTokens: Object.keys(surplus),
    surplusTokenSizes: Object.values(surplus),
    deficitTokens: Object.keys(deficit),
    deficitTokenSizes: Object.values(deficit),
  } as AuctionMetrics;
}

function token(address: string, decimals: number): Token {
  return { address, decimals, name: address, symbol: address } as Token;
}
