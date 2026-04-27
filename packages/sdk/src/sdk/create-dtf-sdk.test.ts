import { describe, expect, it, vi } from "vitest";
import { createDtfSdk } from "./create-dtf-sdk.js";

const address = "0x0000000000000000000000000000000000000001";

describe("createDtfSdk", () => {
  it("creates refs without fetching", () => {
    const sdk = createDtfSdk();

    expect(sdk.index.ref({ address, chainId: 1 })).toEqual({
      address,
      chainId: 1,
    });
  });

  it("stores explicit index providers", () => {
    const indexPricingProvider = {
      getCurrent: vi.fn(),
    };

    const sdk = createDtfSdk({
      indexPricingProvider,
    });

    expect(sdk.client.indexPricingProvider).toBe(indexPricingProvider);
  });

  it("keeps index and yield subgraph configuration separate", () => {
    const sdk = createDtfSdk({
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
