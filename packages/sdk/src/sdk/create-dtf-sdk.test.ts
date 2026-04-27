import { describe, expect, it, vi } from "vitest";
import { createDtfSdk } from "./create-dtf-sdk.js";

const address = "0x0000000000000000000000000000000000000001";

describe("createDtfSdk", () => {
  it("creates refs without fetching", () => {
    const fetch = vi.fn();
    const sdk = createDtfSdk({ fetch });

    expect(sdk.index.ref({ address, chainId: 1 })).toEqual({
      address,
      chainId: 1,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("stores explicit index providers without fetching", () => {
    const fetch = vi.fn();
    const indexPricingProvider = {
      getCurrent: vi.fn(),
    };

    const sdk = createDtfSdk({
      fetch,
      indexPricingProvider,
    });

    expect(sdk.client.indexPricingProvider).toBe(indexPricingProvider);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("keeps index and yield subgraph configuration separate", () => {
    const sdk = createDtfSdk({
      fetch: vi.fn(),
      chains: {
        1: {
          indexSubgraphUrl: "https://example.com/index",
          yieldSubgraphUrl: "https://example.com/yield",
        },
      },
    });

    expect(sdk.client.getIndexSubgraphUrl(1)).toBe("https://example.com/index");
    expect(sdk.client.getYieldSubgraphUrl(1)).toBe("https://example.com/yield");
  });
});
