import { describe, expect, it } from "vitest";

import { createDtfClient } from "./client.js";
import { DEFAULT_RPC_URLS, INDEX_DTF_SUBGRAPH_URL, supportedChainIds } from "./defaults.js";

describe("chain defaults", () => {
  it("keeps supported chains explicit", () => {
    expect(supportedChainIds).toEqual([1, 8453, 56]);
  });

  it("does not configure a Yield DTF subgraph for BSC", () => {
    const client = createDtfClient();

    expect(client.subgraph.getIndexUrl(56)).toBe(INDEX_DTF_SUBGRAPH_URL[56]);
    expect(() => client.subgraph.getYieldUrl(56)).toThrow("No Yield DTF subgraph configured for chain id: 56");
  });

  it("configures default RPC fallbacks for every supported chain", () => {
    const client = createDtfClient();

    expect(client.viem.getRpcUrls(1)).toEqual(DEFAULT_RPC_URLS[1]);
    expect(client.viem.getRpcUrls(8453)).toEqual(DEFAULT_RPC_URLS[8453]);
    expect(client.viem.getRpcUrls(56)).toEqual(DEFAULT_RPC_URLS[56]);
  });

  it("puts custom RPC URLs before default RPC URLs", () => {
    const client = createDtfClient({
      chains: {
        1: {
          rpcUrls: ["https://mainnet.example"],
        },
      },
    });

    expect(client.viem.getRpcUrls(1)).toEqual(["https://mainnet.example", ...DEFAULT_RPC_URLS[1]]);
  });
});
