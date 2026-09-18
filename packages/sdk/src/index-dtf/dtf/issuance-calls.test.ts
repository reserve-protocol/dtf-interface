import { decodeFunctionData, erc20Abi } from "viem";
import { describe, expect, it } from "vitest";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import {
  getIndexDtfRedeemMinAmounts,
  prepareIndexDtfMint,
  prepareIndexDtfMintPlan,
  prepareIndexDtfRedeem,
} from "@/index-dtf/dtf/issuance-calls";
import { SdkError } from "@/lib/errors";

const DTF = "0x0000000000000000000000000000000000000001";
const RECEIVER = "0x0000000000000000000000000000000000000002";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

describe("Index DTF issuance call helpers", () => {
  it("encodes mint shares, receiver and a distinct nonzero minimum output", () => {
    const call = prepareIndexDtfMint({
      address: DTF,
      chainId: 8453,
      version: "5.0.0",
      shares: 1000n,
      receiver: RECEIVER,
      minSharesOut: 987n,
    });

    expect(call).toMatchObject({ to: DTF, chainId: 8453, value: 0n });
    expect(decodeFunctionData({ abi: dtfIndexAbi, data: call.data })).toEqual({
      functionName: "mint",
      args: [1000n, RECEIVER, 987n],
    });
  });

  it("preserves redeem token order and per-token minimum outputs", () => {
    const call = prepareIndexDtfRedeem({
      address: DTF,
      chainId: 1,
      version: "5.0.0",
      shares: 10n ** 18n,
      receiver: RECEIVER,
      assets: [USDC, DAI],
      minAmountsOut: [990_000n, 2n * 10n ** 18n],
    });

    expect(call).toMatchObject({ to: DTF, chainId: 1, value: 0n });
    expect(decodeFunctionData({ abi: dtfIndexAbi, data: call.data })).toEqual({
      functionName: "redeem",
      args: [10n ** 18n, RECEIVER, [USDC, DAI], [990_000n, 2n * 10n ** 18n]],
    });
  });

  it("pairs each mint approval with its collateral and preserves the final mint", () => {
    const plan = prepareIndexDtfMintPlan({
      address: DTF,
      chainId: 8453,
      version: "5.0.0",
      shares: 1000n,
      receiver: RECEIVER,
      minSharesOut: 987n,
      approvals: [
        { token: USDC, amount: 3_000_000n },
        { token: DAI, amount: 2n * 10n ** 18n },
      ],
    });

    expect(plan.type).toBe("approval-required");
    if (plan.type !== "approval-required") throw new Error("expected collateral approvals");
    expect(
      plan.approvals.map(({ to, chainId, value, data }) => ({
        to,
        chainId,
        value,
        decoded: decodeFunctionData({ abi: erc20Abi, data }),
      })),
    ).toEqual([
      { to: USDC, chainId: 8453, value: 0n, decoded: { functionName: "approve", args: [DTF, 3_000_000n] } },
      { to: DAI, chainId: 8453, value: 0n, decoded: { functionName: "approve", args: [DTF, 2n * 10n ** 18n] } },
    ]);
    expect(plan.call).toMatchObject({ to: DTF, chainId: 8453, value: 0n });
    expect(decodeFunctionData({ abi: dtfIndexAbi, data: plan.call.data })).toEqual({
      functionName: "mint",
      args: [1000n, RECEIVER, 987n],
    });
  });

  it("returns the mint directly when no approvals are required", () => {
    const plan = prepareIndexDtfMintPlan({
      address: DTF,
      chainId: 1,
      version: "5.0.0",
      shares: 1000n,
      receiver: RECEIVER,
      minSharesOut: 987n,
    });
    expect(plan.type).toBe("call");
    expect(decodeFunctionData({ abi: dtfIndexAbi, data: plan.call.data })).toEqual({
      functionName: "mint",
      args: [1000n, RECEIVER, 987n],
    });
  });

  it.each([
    { slippageBps: 0, expected: [101n, 999n] },
    { slippageBps: 100, expected: [99n, 989n] },
    { slippageBps: 10_000, expected: [0n, 0n] },
  ])("floors redeem minimums with $slippageBps bps slippage", ({ slippageBps, expected }) => {
    expect(getIndexDtfRedeemMinAmounts({ amounts: [101n, 999n], slippageBps })).toEqual(expected);
  });

  it("keeps redeem amounts precise above the safe integer range", () => {
    expect(getIndexDtfRedeemMinAmounts({ amounts: [10n ** 24n + 123n], slippageBps: 1 })).toEqual([
      999_900_000_000_000_000_000_122n,
    ]);
  });

  it.each([-1, 10_001, 0.5, NaN])("rejects invalid slippage %s", (slippageBps) => {
    expect(() => getIndexDtfRedeemMinAmounts({ amounts: [100n], slippageBps })).toThrow(
      "slippageBps must be an integer between 0 and 10000",
    );
  });

  it("encodes identical mint bytes on 5.0.0 and 6.0.0 and rejects other versions", () => {
    const input = {
      address: DTF,
      chainId: 8453,
      shares: 10n,
      receiver: "0x0000000000000000000000000000000000000002",
      minSharesOut: 9n,
    } as const;
    expect(prepareIndexDtfMint({ ...input, version: "6.0.0" }).data).toBe(
      prepareIndexDtfMint({ ...input, version: "5.0.0" }).data,
    );
    const build = () => prepareIndexDtfMint({ ...input, version: "4.0.0" as unknown as "5.0.0" });
    expect(build).toThrow(SdkError);
    expect(build).toThrow(expect.objectContaining({ code: "INVALID_INPUT", meta: { version: "4.0.0" } }));
  });
});
