import { afterEach, describe, expect, it, vi } from "vitest";

import { createDtfClient } from "@/client";
import { getIndexDtfHolders } from "@/index-dtf/dtf/holders";

const DTF = "0x0000000000000000000000000000000000000001";
const HOLDER_A = "0x0000000000000000000000000000000000000002";
const HOLDER_B = "0x0000000000000000000000000000000000000003";
const DELEGATE = "0x0000000000000000000000000000000000000004";

describe("Index DTF holders", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads holders from the index subgraph and computes concentration", async () => {
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url === "https://example.com/index") {
        return Response.json({
          data: {
            token: {
              currentHolderCount: "2",
              decimals: "18",
              totalSupply: "100000000000000000000",
            },
            accountBalances: [
              {
                account: { id: HOLDER_A },
                amount: "60000000000000000000",
                delegate: { address: DELEGATE },
              },
              {
                account: { id: HOLDER_B },
                amount: "40000000000000000000",
                delegate: null,
              },
            ],
          },
        });
      }

      return Response.json([{ address: DTF, price: 2 }]);
    });
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({
      apiBaseUrl: "https://api.example",
      chains: { 8453: { indexSubgraphUrl: "https://example.com/index" } },
    });

    const holders = await getIndexDtfHolders(client, { address: DTF, chainId: 8453 });

    expect(holders.totalHolders).toBe(2);
    expect(holders.totalSupply.raw).toBe(100000000000000000000n);
    expect(holders.holders[0]).toMatchObject({
      account: HOLDER_A,
      delegate: DELEGATE,
      balanceUsd: 120,
      supplyPercent: 60,
      rank: 1,
    });
    expect(holders.concentration).toEqual({ top5Percent: 100, top10Percent: 100 });
  });
});
