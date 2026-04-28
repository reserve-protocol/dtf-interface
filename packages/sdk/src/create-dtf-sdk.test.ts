import { describe, expect, it, vi } from "vitest";
import { createDtfSdk } from "./create-dtf-sdk.js";

describe("createDtfSdk", () => {
  it("stores explicit index providers", () => {
    const indexPricingProvider = {
      getCurrent: vi.fn(),
    };

    const sdk = createDtfSdk({
      indexPricingProvider,
    });

    expect(sdk.client.indexPricingProvider).toBe(indexPricingProvider);
  });

  it("exposes the intended index namespace names", () => {
    const sdk = createDtfSdk();

    expect(typeof sdk.index.get).toBe("function");
    expect(typeof sdk.index.getPrice).toBe("function");
    expect(typeof sdk.index.proposals).toBe("function");
    expect(typeof sdk.index.proposal).toBe("function");
    expect(typeof sdk.index.getAllProposals).toBe("function");
    expect(typeof sdk.index.rebalances).toBe("function");
    expect(typeof sdk.index.rebalance).toBe("function");
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
