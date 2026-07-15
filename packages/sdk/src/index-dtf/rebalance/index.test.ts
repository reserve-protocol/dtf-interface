import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getCompletedRebalance } from "@/index-dtf/rebalance/index";

const DTF = "0x0000000000000000000000000000000000000001";

describe("getCompletedRebalance", () => {
  it("maps the singular detail the client returns", async () => {
    const getIndexDtfRebalanceDetail = vi.fn(async () => ({
      nonce: 4,
      timestamp: 100,
      totalRebalancedUsd: 50,
      avgPriceImpactPercent: 0.3,
      auctions: [],
    }));
    const client = { api: { getIndexDtfRebalanceDetail } } as unknown as DtfClient;

    const detail = await getCompletedRebalance(client, { address: DTF, chainId: 1, nonce: 4 });

    expect(detail.nonce).toBe(4);
    expect(detail.totalRebalancedUsd).toBe(50);
    expect(detail.avgPriceImpactPercent).toBe(0.3);
    expect(detail.auctions).toEqual([]);
    expect(getIndexDtfRebalanceDetail).toHaveBeenCalledWith(
      expect.objectContaining({ chainId: 1, nonce: 4 }),
    );
  });
});
