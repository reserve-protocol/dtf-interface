import { afterEach, describe, expect, it, vi } from "vitest";

import { createDtfClient } from "@/client";

import { getPriceHistory } from "@/index-dtf/dtf";

const DTF = "0x0000000000000000000000000000000000000001";

describe("getPriceHistory", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests /historical/dtf with a 5m interval (the 24h chart granularity) and maps the response", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        timeseries: [{ timestamp: 100, price: 1.5, marketCap: 10, totalSupply: 5, basket: [] }],
      }),
    );
    vi.stubGlobal("fetch", fetch);

    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    const points = await getPriceHistory(client, {
      address: DTF,
      chainId: 8453,
      from: 0,
      to: 100,
      interval: "5m",
    });

    const [url] = fetch.mock.calls[0] as unknown as [URL];
    expect(String(url)).toBe(
      "https://api.example/historical/dtf?chainId=8453&address=0x0000000000000000000000000000000000000001&from=0&to=100&interval=5m",
    );
    expect(points).toEqual([{ timestamp: 100, price: 1.5, marketCap: 10, totalSupply: 5, basket: [] }]);
  });
});
