import { describe, expect, it } from "vitest";

import {
  prepareYieldDtfIssue,
  prepareYieldDtfIssuePlan,
  prepareYieldDtfRedeem,
  prepareYieldDtfRedeemCustom,
} from "@/yield-dtf/issuance";
import {
  prepareYieldDtfCancelUnstake,
  prepareYieldDtfStake,
  prepareYieldDtfStakePlan,
  prepareYieldDtfUnstake,
  prepareYieldDtfWithdraw,
} from "@/yield-dtf/staking";

const DTF = "0x1111111111111111111111111111111111111111";
const ST_TOKEN = "0x2222222222222222222222222222222222222222";
const ACCOUNT = "0x3333333333333333333333333333333333333333";

const PAD = (hex: string) => hex.replace("0x", "").padStart(64, "0");

describe("yield DTF issuance calls", () => {
  it("encodes exact issue calldata", () => {
    const call = prepareYieldDtfIssue({ chainId: 1, address: DTF, amount: 42n });

    // issue(uint256) selector + padded amount.
    expect(call.data).toBe("0xcc872b66" + PAD("0x2a"));
    expect(call.to).toBe(DTF);
    expect(call.value).toBe(0n);
  });

  it("encodes exact redeem calldata", () => {
    const call = prepareYieldDtfRedeem({ chainId: 1, address: DTF, amount: 42n });

    expect(call.data).toBe("0xdb006a75" + PAD("0x2a"));
  });

  it("encodes redeemCustom with the documented signature", () => {
    const call = prepareYieldDtfRedeemCustom({
      chainId: 1,
      address: DTF,
      recipient: ACCOUNT,
      amount: 42n,
      basketNonces: [1],
      portions: [10n ** 18n],
      expectedTokensOut: [ST_TOKEN],
      minAmountsOut: [0n],
    });

    // redeemCustom(address,uint256,uint48[],uint192[],address[],uint256[]) selector.
    expect(call.data.startsWith("0x6b2ba67d")).toBe(true);
    expect(call.contract.functionName).toBe("redeemCustom");
    expect(call.contract.args).toEqual([ACCOUNT, 42n, [1], [10n ** 18n], [ST_TOKEN], [0n]]);
  });

  it("plans issuance approvals against the Yield DTF token", () => {
    const plan = prepareYieldDtfIssuePlan({
      chainId: 1,
      address: DTF,
      amount: 42n,
      deposits: [
        { token: ST_TOKEN, amount: 5n },
        { token: ACCOUNT, amount: 7n },
      ],
    });

    expect(plan.type).toBe("approval-required");
    if (plan.type !== "approval-required") return;
    expect(plan.approvals).toHaveLength(2);
    expect(plan.approvals[0]!.contract.args).toEqual([DTF, 5n]);
    expect(plan.approvals[1]!.contract.args).toEqual([DTF, 7n]);
    expect(plan.call.data).toBe("0xcc872b66" + PAD("0x2a"));
  });

  it("returns a bare call when no deposits are needed", () => {
    const plan = prepareYieldDtfIssuePlan({ chainId: 1, address: DTF, amount: 42n, deposits: [] });

    expect(plan.type).toBe("call");
  });
});

describe("yield DTF staking calls", () => {
  it("encodes exact stake calldata", () => {
    const call = prepareYieldDtfStake({ chainId: 1, stToken: ST_TOKEN, amount: 42n });

    // stake(uint256) selector + padded RSR amount.
    expect(call.data).toBe("0xa694fc3a" + PAD("0x2a"));
    expect(call.to).toBe(ST_TOKEN);
  });

  it("plans the RSR approval before staking", () => {
    const plan = prepareYieldDtfStakePlan({ chainId: 1, stToken: ST_TOKEN, amount: 42n });

    expect(plan.type).toBe("approval-required");
    if (plan.type !== "approval-required") return;
    expect(plan.approvals).toHaveLength(1);
    // Approval is on mainnet RSR, spender is the staking vault.
    expect(plan.approvals[0]!.to).toBe("0x320623b8E4fF03373931769A31Fc52A4E78B5d70");
    expect(plan.approvals[0]!.contract.args).toEqual([ST_TOKEN, 42n]);
  });

  it("encodes exact unstake calldata", () => {
    const call = prepareYieldDtfUnstake({ chainId: 1, stToken: ST_TOKEN, amount: 42n });

    expect(call.data).toBe("0x2e17de78" + PAD("0x2a"));
  });

  it("encodes exact withdraw calldata", () => {
    const call = prepareYieldDtfWithdraw({ chainId: 1, stToken: ST_TOKEN, account: ACCOUNT, endId: 3n });

    // withdraw(address,uint256) selector + padded account + padded endId.
    expect(call.data).toBe("0xf3fef3a3" + PAD(ACCOUNT) + PAD("0x3"));
  });

  it("encodes exact cancelUnstake calldata", () => {
    const call = prepareYieldDtfCancelUnstake({ chainId: 1, stToken: ST_TOKEN, endId: 3n });

    expect(call.data).toBe("0x2b187b2b" + PAD("0x3"));
  });
});
