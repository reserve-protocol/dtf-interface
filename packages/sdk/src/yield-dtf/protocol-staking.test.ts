import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getYieldDtfProtocolStakingTotals } from "@/yield-dtf/protocol-staking";

describe("Yield DTF protocol staking totals", () => {
  it("maps the Protocol entity per chain", async () => {
    const queryYield = vi.fn(async ({ chainId }: { chainId: number }) => ({
      protocols: [
        {
          rsrStaked: chainId === 1 ? "4000000000000000000" : "1000000000000000000",
          rsrStakedUSD: "6031036.2263",
          totalRsrStaked: "11000000000000000000",
          totalRsrUnstaked: "8000000000000000000",
          rTokenCount: 41,
        },
      ],
    }));
    const client = { subgraph: { queryYield } } as unknown as DtfClient;

    const totals = await getYieldDtfProtocolStakingTotals(client);

    expect(totals.map((row) => [row.chainId, row.rsrStaked.formatted])).toEqual([
      [1, "4"],
      [8453, "1"],
    ]);
    expect(totals[0]).toMatchObject({
      rsrStakedUsd: 6031036.2263,
      lifetimeRsrStaked: { formatted: "11" },
      lifetimeRsrUnstaked: { formatted: "8" },
      rTokenCount: 41,
    });
  });

  it("fails loudly when a chain has no Protocol entity", async () => {
    const client = { subgraph: { queryYield: vi.fn(async () => ({ protocols: [] })) } } as unknown as DtfClient;

    await expect(getYieldDtfProtocolStakingTotals(client, { chainIds: [8453] })).rejects.toMatchObject({
      code: "RECORD_NOT_FOUND",
    });
  });
});
