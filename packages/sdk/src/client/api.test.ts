import { afterEach, describe, expect, it, vi } from "vitest";
import { createDtfClient } from "../client.js";

describe("Reserve API helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("fetches and normalizes token prices", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_715_000_000_000);
    const fetch = vi.fn(async () =>
      Response.json([
        {
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          price: 1,
          priceSources: ["cmc"],
        },
      ]),
    );
    vi.stubGlobal("fetch", fetch);

    const client = createDtfClient({ apiBaseUrl: "https://api.example" });
    const prices = await client.api.getTokenPrices({
      chainId: 8453,
      addresses: [
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "0x4200000000000000000000000000000000000006",
      ],
    });

    expect(prices).toEqual([
      {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        price: 1,
        timestamp: 1_715_000_000_000,
        priceSources: ["cmc"],
      },
      {
        address: "0x4200000000000000000000000000000000000006",
        price: 0,
        timestamp: 1_715_000_000_000,
      },
    ]);
    expect(fetch).toHaveBeenCalledOnce();

    const [url] = fetch.mock.calls[0] as unknown as [URL];
    expect(String(url)).toBe(
      "https://api.example/current/prices?chainId=8453&tokens=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48%2C0x4200000000000000000000000000000000000006",
    );
  });

  it("fetches basket token prices with timestamp snapshots", async () => {
    const fetch = vi.fn(async (url: URL) => {
      const value = String(url);

      if (value.includes("current/prices")) {
        return Response.json([
          {
            address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            price: 1,
          },
          {
            address: "0x4200000000000000000000000000000000000006",
            price: 2500,
          },
        ]);
      }

      if (value.includes("a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")) {
        return Response.json({
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          timeseries: [
            { timestamp: 1_714_996_400, price: 0.99 },
            { timestamp: 1_715_000_000, price: 1.01 },
            { timestamp: 1_715_003_600, price: 1 },
          ],
        });
      }

      return Response.json({
        address: "0x4200000000000000000000000000000000000006",
        timeseries: [],
      });
    });
    vi.stubGlobal("fetch", fetch);

    const client = createDtfClient({ apiBaseUrl: "https://api.example" });
    const prices = await client.api.getBasketTokenPricesWithSnapshot({
      chainId: 8453,
      assets: [
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "0x4200000000000000000000000000000000000006",
      ],
      timestamp: 1_715_000_000,
    });

    expect(prices).toEqual({
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
        currentPrice: 1,
        snapshotPrice: 1.01,
      },
      "0x4200000000000000000000000000000000000006": {
        currentPrice: 2500,
        snapshotPrice: 0,
      },
    });
    expect(fetch).toHaveBeenCalledTimes(3);

    const [historicalUrl] = fetch.mock.calls[1] as unknown as [URL];
    expect(String(historicalUrl)).toContain(
      "historical/prices?chainId=8453&from=1714996400&to=1715003600&interval=1h",
    );
  });
});
