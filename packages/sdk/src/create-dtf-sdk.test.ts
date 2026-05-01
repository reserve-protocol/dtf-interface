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

    expect(typeof sdk.index.ref).toBe("function");
    expect(typeof sdk.index.get).toBe("function");
    expect(typeof sdk.index.getBrand).toBe("function");
    expect(typeof sdk.index.getPrice).toBe("function");
    expect(typeof sdk.index.proposals).toBe("function");
    expect(typeof sdk.index.proposal).toBe("function");
    expect(typeof sdk.index.getAllProposals).toBe("function");
    expect(typeof sdk.index.rebalances).toBe("function");
    expect(typeof sdk.index.rebalance).toBe("function");
  });

  it("creates a zero-network Index DTF ref", () => {
    const sdk = createDtfSdk();
    const dtf = sdk.index.ref({
      address: "0x0000000000000000000000000000000000000001",
      chainId: 8453,
    });

    expect(dtf.address).toBe("0x0000000000000000000000000000000000000001");
    expect(dtf.chainId).toBe(8453);
    expect(typeof dtf.get).toBe("function");
    expect(typeof dtf.getBrand).toBe("function");
    expect(typeof dtf.getPrice).toBe("function");
    expect(typeof dtf.proposals).toBe("function");
    expect(typeof dtf.rebalances).toBe("function");
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

    expect(sdk.client.subgraph.getIndexUrl(1)).toBe(
      "https://example.com/index",
    );
    expect(sdk.client.subgraph.getYieldUrl(1)).toBe(
      "https://example.com/yield",
    );
  });
});
