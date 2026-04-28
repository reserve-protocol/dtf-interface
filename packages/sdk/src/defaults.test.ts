import { describe, expect, it } from "vitest";
import { createDtfClient } from "./client.js";
import {
  INDEX_DTF_SUBGRAPH_URL,
  supportedChainIds,
} from "./defaults.js";

describe("chain defaults", () => {
  it("keeps supported chains explicit", () => {
    expect(supportedChainIds).toEqual([1, 8453, 56]);
  });

  it("does not configure a Yield DTF subgraph for BSC", () => {
    const client = createDtfClient();

    expect(client.getIndexSubgraphUrl(56)).toBe(INDEX_DTF_SUBGRAPH_URL[56]);
    expect(() => client.getYieldSubgraphUrl(56)).toThrow(
      "No Yield DTF subgraph configured for chain id: 56",
    );
  });
});
