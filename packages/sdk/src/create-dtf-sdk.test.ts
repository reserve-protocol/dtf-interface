import { describe, expect, it } from "vitest";
import { createDtfSdk } from "./create-dtf-sdk.js";

describe("createDtfSdk", () => {
  it("exposes the intended index namespace names", () => {
    const sdk = createDtfSdk();

    expect(typeof sdk.index.ref).toBe("function");
    expect(typeof sdk.index.get).toBe("function");
    expect(typeof sdk.index.getDtf).toBe("function");
    expect(typeof sdk.index.getFull).toBe("function");
    expect(typeof sdk.index.getBasketSnapshot).toBe("function");
    expect(typeof sdk.index.getBrand).toBe("function");
    expect(typeof sdk.index.getMandate).toBe("function");
    expect(typeof sdk.index.getPrice).toBe("function");
    expect(typeof sdk.index.getPriceHistory).toBe("function");
    expect(typeof sdk.index.getVersion).toBe("function");
    expect(typeof sdk.index.getTotalSupply).toBe("function");
    expect(typeof sdk.index.getTotalAssets).toBe("function");
    expect(typeof sdk.index.discover).toBe("function");
    expect(typeof sdk.index.getStatus).toBe("function");
    expect(typeof sdk.index.getExposure).toBe("function");
    expect(typeof sdk.index.getTransactions).toBe("function");
    expect(typeof sdk.index.getIssuanceState).toBe("function");
    expect(typeof sdk.index.getRevenue).toBe("function");
    expect(typeof sdk.index.getProposals).toBe("function");
    expect(typeof sdk.index.getProposal).toBe("function");
    expect(typeof sdk.index.getAllProposals).toBe("function");
    expect(typeof sdk.index.prepareVote).toBe("function");
    expect(typeof sdk.index.prepareQueueProposal).toBe("function");
    expect(typeof sdk.index.prepareExecuteProposal).toBe("function");
    expect(typeof sdk.index.prepareCancelProposal).toBe("function");
    expect(typeof sdk.index.prepareSubmitProposal).toBe("function");
    expect(typeof sdk.index.buildBasketProposal).toBe("function");
    expect(typeof sdk.index.buildBasketSettingsProposal).toBe("function");
    expect(typeof sdk.index.buildDaoSettingsProposal).toBe("function");
    expect(typeof sdk.index.buildSettingsProposal).toBe("function");
    expect("buildSettingsCalls" in sdk.index).toBe(false);
    expect("write" in sdk.index).toBe(false);
    expect(typeof sdk.index.getRebalances).toBe("function");
    expect(typeof sdk.index.getRebalance).toBe("function");
    expect(typeof sdk.index.getCurrentRebalance).toBe("function");
    expect(typeof sdk.index.getVoteLockState).toBe("function");
    expect(typeof sdk.portfolio.get).toBe("function");
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
    expect(typeof dtf.getDtf).toBe("function");
    expect(typeof dtf.getFull).toBe("function");
    expect(typeof dtf.getBasketSnapshot).toBe("function");
    expect(typeof dtf.getBrand).toBe("function");
    expect(typeof dtf.getMandate).toBe("function");
    expect(typeof dtf.getPrice).toBe("function");
    expect(typeof dtf.getPriceHistory).toBe("function");
    expect(typeof dtf.getVersion).toBe("function");
    expect(typeof dtf.getTotalSupply).toBe("function");
    expect(typeof dtf.getTotalAssets).toBe("function");
    expect(typeof dtf.getStatus).toBe("function");
    expect(typeof dtf.getExposure).toBe("function");
    expect(typeof dtf.getTransactions).toBe("function");
    expect(typeof dtf.getIssuanceState).toBe("function");
    expect(typeof dtf.getRevenue).toBe("function");
    expect(typeof dtf.getProposals).toBe("function");
    expect(typeof dtf.prepareVote).toBe("function");
    expect(typeof dtf.prepareQueueProposal).toBe("function");
    expect(typeof dtf.prepareExecuteProposal).toBe("function");
    expect(typeof dtf.prepareCancelProposal).toBe("function");
    expect(typeof dtf.prepareSubmitProposal).toBe("function");
    expect(typeof dtf.buildBasketProposal).toBe("function");
    expect(typeof dtf.buildBasketSettingsProposal).toBe("function");
    expect(typeof dtf.buildDaoSettingsProposal).toBe("function");
    expect(typeof dtf.buildSettingsProposal).toBe("function");
    expect("buildSettingsCalls" in dtf).toBe(false);
    expect("governance" in dtf).toBe(false);
    expect(typeof dtf.getRebalances).toBe("function");
    expect(typeof dtf.getCurrentRebalance).toBe("function");
    expect(typeof dtf.getVoteLockState).toBe("function");
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
