import { describe, expect, it } from "vitest";
import { createDtfSdk } from "./create-dtf-sdk.js";

describe("createDtfSdk", () => {
  it("exposes the intended index namespace names", () => {
    const sdk = createDtfSdk();

    expect(typeof sdk.index.ref).toBe("function");
    expect(typeof sdk.index.get).toBe("function");
    expect(typeof sdk.index.getBrand).toBe("function");
    expect(typeof sdk.index.getPrice).toBe("function");
    expect(typeof sdk.index.version).toBe("function");
    expect(typeof sdk.index.totalSupply).toBe("function");
    expect(typeof sdk.index.totalAssets).toBe("function");
    expect(typeof sdk.index.proposals).toBe("function");
    expect(typeof sdk.index.proposal).toBe("function");
    expect(typeof sdk.index.getAllProposals).toBe("function");
    expect(typeof sdk.index.buildBasketProposal).toBe("function");
    expect(typeof sdk.index.buildBasketSettingsProposal).toBe("function");
    expect(typeof sdk.index.buildDaoSettingsProposal).toBe("function");
    expect(typeof sdk.index.buildSettingsProposal).toBe("function");
    expect("buildSettingsCalls" in sdk.index).toBe(false);
    expect("write" in sdk.index).toBe(false);
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
    expect(typeof dtf.version).toBe("function");
    expect(typeof dtf.totalSupply).toBe("function");
    expect(typeof dtf.totalAssets).toBe("function");
    expect(typeof dtf.proposals).toBe("function");
    expect(typeof dtf.buildBasketProposal).toBe("function");
    expect(typeof dtf.buildBasketSettingsProposal).toBe("function");
    expect(typeof dtf.buildDaoSettingsProposal).toBe("function");
    expect(typeof dtf.buildSettingsProposal).toBe("function");
    expect("buildSettingsCalls" in dtf).toBe(false);
    expect(typeof dtf.write).toBe("function");
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
