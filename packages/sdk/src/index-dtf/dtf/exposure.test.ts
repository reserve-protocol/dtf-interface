import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getIndexDtfExposure } from "@/index-dtf/dtf/exposure";

const DTF = "0x0000000000000000000000000000000000000001";
const TOKEN = "0x00000000000000000000000000000000000000aa";

describe("getIndexDtfExposure", () => {
  it("checksums token addresses and preserves the exposure/collateral market caps", async () => {
    const get = vi.fn(async () => [
      {
        native: {
          symbol: "AAPL",
          name: "Apple",
          logo: "a.svg",
          caip2: "eip155:1",
          coingeckoId: "apple",
          marketCap: 3_000_000,
        },
        totalWeight: 0.4,
        marketCap: 500,
        tokens: [
          {
            address: TOKEN,
            symbol: "uAAPL",
            weight: 0.4,
            marketCap: 500,
            underlyingMarketCap: 3_000_000,
            bridge: { id: "b", name: "Bridge", url: "u", description: "d", logo: "l", risks: [], wrappedVersion: true },
          },
        ],
      },
    ]);
    const client = { api: { get } } as unknown as DtfClient;

    const [group] = await getIndexDtfExposure(client, { address: DTF, chainId: 1, period: "ytd" });

    expect(get).toHaveBeenCalledWith(expect.objectContaining({ query: expect.objectContaining({ period: "ytd" }) }));
    expect(group!.native.marketCap).toBe(3_000_000);
    const [token] = group!.tokens;
    expect(token!.address).toBe("0x00000000000000000000000000000000000000AA");
    expect(token!.marketCap).toBe(500);
    expect(token!.underlyingMarketCap).toBe(3_000_000);
    expect(token!.bridge?.name).toBe("Bridge");
  });

  it("defaults the period to 24h when unset", async () => {
    const get = vi.fn(async () => []);
    const client = { api: { get } } as unknown as DtfClient;

    await getIndexDtfExposure(client, { address: DTF, chainId: 1 });

    expect(get).toHaveBeenCalledWith(expect.objectContaining({ query: expect.objectContaining({ period: "24h" }) }));
  });
});
