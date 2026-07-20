import { afterEach, describe, expect, it, vi } from "vitest";

import { createDtfClient } from "@/client";
import {
  discoverIndexDtfs,
  discoverIndexDtfsByChain,
  discoverIndexDtfsFromSubgraph,
} from "@/index-dtf/dtf/discovery";

const DTF = "0x0000000000000000000000000000000000000001";
const TOKEN = "0x0000000000000000000000000000000000000002";
const DTF_B = "0x0000000000000000000000000000000000000003";
const DTF_C = "0x0000000000000000000000000000000000000004";

describe("Index DTF discovery", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("discovers Index DTFs from the Register discovery endpoint", async () => {
    const fetch = vi.fn(async () =>
      Response.json([
        { type: "index", address: DTF, chainId: 8453, status: "deprecated", symbol: "DTF" },
        { type: "yield", address: TOKEN, chainId: 1, status: "active" },
      ]),
    );
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    const dtfs = await discoverIndexDtfs(client, { brand: true, performance: true });

    expect(dtfs).toHaveLength(1);
    expect(dtfs[0]?.address).toBe(DTF);
    expect(String((fetch.mock.calls[0] as unknown as [URL])[0])).toBe(
      "https://api.example/discover/dtfs?brand=true&performance=true",
    );
  });

  it("filters chain-scoped discovery to Index DTFs", async () => {
    const fetch = vi.fn(async () =>
      Response.json([
        { type: "index", address: DTF, chainId: 8453, status: "active" },
        { type: "yield", address: TOKEN, chainId: 8453, status: "active" },
      ]),
    );
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    const dtfs = await discoverIndexDtfsByChain(client, { chainId: 8453 });

    expect(dtfs.map((dtf) => dtf.address)).toEqual([DTF]);
  });

  it("discovers fresh Index DTFs from the subgraph and enriches current prices", async () => {
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url === "https://example.com/index") {
        return Response.json({
          data: {
            dtfs: [
              {
                id: DTF,
                annualizedTvlFee: "1500000000000000",
                timestamp: "1700000000",
                token: { name: "Test DTF", symbol: "DTF" },
              },
            ],
          },
        });
      }

      return Response.json([
        {
          address: DTF,
          price: 10,
          marketCap: 1000,
          basket: [{ address: TOKEN, symbol: "TOK", name: "Token", weight: "100" }],
        },
      ]);
    });
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({
      apiBaseUrl: "https://api.example",
      chains: { 8453: { indexSubgraphUrl: "https://example.com/index" } },
    });

    const dtfs = await discoverIndexDtfsFromSubgraph(client, { chainId: 8453 });

    expect(dtfs).toEqual([
      expect.objectContaining({
        address: DTF,
        name: "Test DTF",
        symbol: "DTF",
        price: 10,
        marketCap: 1000,
        fee: 0.15,
      }),
    ]);
    expect(dtfs[0]?.basket).toEqual([{ address: TOKEN, name: "Token", symbol: "TOK", weight: "100" }]);
  });

  it("excludes requested subgraph DTFs and skips rows missing current prices", async () => {
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url === "https://example.com/index") {
        return Response.json({
          data: {
            dtfs: [subgraphDtf(DTF, "DTF"), subgraphDtf(DTF_B, "DTFB"), subgraphDtf(DTF_C, "DTFC")],
          },
        });
      }

      return Response.json([
        {
          address: DTF,
          price: 10,
          basket: [{ address: TOKEN, symbol: "TOK", name: "Token", weight: "100" }],
        },
      ]);
    });
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({
      apiBaseUrl: "https://api.example",
      chains: { 8453: { indexSubgraphUrl: "https://example.com/index" } },
    });

    const dtfs = await discoverIndexDtfsFromSubgraph(client, { chainId: 8453, excludeAddresses: [DTF_B] });

    expect(dtfs.map((dtf) => dtf.address)).toEqual([DTF]);
    expect(String((fetch.mock.calls[1] as unknown as [URL])[0])).toBe(
      `https://api.example/current/dtfs?chainId=8453&addresses=${DTF}%2C${DTF_C}`,
    );
  });

  it("falls back to single-address current price requests when a batch fails", async () => {
    let currentRequests = 0;
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url === "https://example.com/index") {
        return Response.json({ data: { dtfs: [subgraphDtf(DTF, "DTF")] } });
      }

      currentRequests += 1;
      if (currentRequests === 1) {
        return new Response("failed", { status: 500, statusText: "Internal Server Error" });
      }

      return Response.json([
        {
          address: DTF,
          price: 10,
          basket: [{ address: TOKEN, symbol: "TOK", name: "Token", weight: "100" }],
        },
      ]);
    });
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({
      apiBaseUrl: "https://api.example",
      chains: { 8453: { indexSubgraphUrl: "https://example.com/index" } },
    });

    await expect(discoverIndexDtfsFromSubgraph(client, { chainId: 8453 })).resolves.toHaveLength(1);
    expect(currentRequests).toBe(2);
  });

});

function subgraphDtf(id: string, symbol: string) {
  return {
    id,
    annualizedTvlFee: "1500000000000000",
    timestamp: "1700000000",
    token: { name: `${symbol} Name`, symbol },
  };
}
