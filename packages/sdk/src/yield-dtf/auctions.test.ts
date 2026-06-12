import { describe, expect, it } from "vitest";

import {
  prepareYieldDtfBidPlan,
  prepareYieldDtfClaimRewards,
  prepareYieldDtfRebalance,
  prepareYieldDtfRunRevenueAuctions,
} from "@/yield-dtf/auctions";
import { FACADE_ACT_ADDRESS } from "@/yield-dtf/config";

const DTF = "0x1111111111111111111111111111111111111111";
const TRADER = "0x2222222222222222222222222222222222222222";
const ERC20_A = "0x3333333333333333333333333333333333333333";
const ERC20_B = "0x4444444444444444444444444444444444444444";
const TRADE = "0x5555555555555555555555555555555555555555";

describe("yield DTF auction calls", () => {
  it("encodes runRevenueAuctions with one kind per started auction", () => {
    const call = prepareYieldDtfRunRevenueAuctions({
      chainId: 1,
      trader: TRADER,
      toSettle: [ERC20_A],
      toStart: [ERC20_A, ERC20_B],
      kind: 0,
    });

    expect(call.data.startsWith("0xf2c11da5")).toBe(true);
    expect(call.to).toBe(FACADE_ACT_ADDRESS[1]);
    expect(call.contract.args).toEqual([TRADER, [ERC20_A], [ERC20_A, ERC20_B], [0, 0]]);
  });

  it("encodes exact rebalance calldata", () => {
    const call = prepareYieldDtfRebalance({ chainId: 1, backingManager: TRADER, kind: 1 });

    expect(call.data).toBe("0xf4ae1474" + "1".padStart(64, "0"));
    expect(call.to).toBe(TRADER);
  });

  it("encodes exact claimRewards calldata", () => {
    const call = prepareYieldDtfClaimRewards({ address: DTF, chainId: 1 });

    expect(call.data).toBe("0xef5cfb8c" + DTF.replace("0x", "").padStart(64, "0"));
    expect(call.to).toBe(FACADE_ACT_ADDRESS[1]);
  });

  it("plans a dutch bid with the buy-token approval to the trade", () => {
    const plan = prepareYieldDtfBidPlan({
      chainId: 1,
      trade: TRADE,
      buyToken: ERC20_B,
      approveAmount: 42n,
    });

    expect(plan.type).toBe("approval-required");
    if (plan.type !== "approval-required") return;
    expect(plan.approvals[0]!.to).toBe(ERC20_B);
    expect(plan.approvals[0]!.contract.args).toEqual([TRADE, 42n]);
    // bid() takes no args — bare selector.
    expect(plan.call.data).toBe("0x1998aeef");
    expect(plan.call.to).toBe(TRADE);
  });
});
