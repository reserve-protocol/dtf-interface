import { describe, expect, it } from "vitest";

import { getIndexDtfRedeemMinAmounts } from "@/index-dtf/dtf/issuance-calls";

describe("Index DTF issuance call helpers", () => {
  it("applies redeem slippage with named params", () => {
    expect(
      getIndexDtfRedeemMinAmounts({
        amounts: [100n, 200n],
        slippageBps: 100,
      }),
    ).toEqual([99n, 198n]);
  });
});
