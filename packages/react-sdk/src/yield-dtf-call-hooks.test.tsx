import { createElement, type PropsWithChildren } from "react";

// @vitest-environment jsdom
import type { DtfSdk } from "@reserve-protocol/sdk";

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DtfSdkProvider } from "@/provider";
import { useYieldDtfIssueCall, useYieldDtfStakeCall, useYieldDtfWithdrawCall } from "@/yield-dtf-hooks";

const DTF = "0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F";
const ST_TOKEN = "0x2222222222222222222222222222222222222222";
const ACCOUNT = "0x3333333333333333333333333333333333333333";

function createSdk() {
  return {
    yield: {
      prepareIssue: vi.fn((params: unknown) => ({ kind: "issue", params })),
      prepareStake: vi.fn((params: unknown) => ({ kind: "stake", params })),
      prepareWithdraw: vi.fn((params: unknown) => ({ kind: "withdraw", params })),
    },
  } as unknown as DtfSdk;
}

function createWrapper(sdk: DtfSdk) {
  return ({ children }: PropsWithChildren) => createElement(DtfSdkProvider, { sdk }, children);
}

describe("yield DTF call hooks", () => {
  it("returns undefined without params", () => {
    const wrapper = createWrapper(createSdk());

    expect(renderHook(() => useYieldDtfIssueCall(undefined), { wrapper }).result.current).toBeUndefined();
    expect(renderHook(() => useYieldDtfStakeCall(undefined), { wrapper }).result.current).toBeUndefined();
    expect(renderHook(() => useYieldDtfWithdrawCall(undefined), { wrapper }).result.current).toBeUndefined();
  });

  it("prepares calls with full params and treats 0n amounts as valid", () => {
    const wrapper = createWrapper(createSdk());

    const issue = renderHook(() => useYieldDtfIssueCall({ chainId: 1, address: DTF, amount: 0n }), { wrapper });
    expect(issue.result.current).toEqual({ kind: "issue", params: { chainId: 1, address: DTF, amount: 0n } });

    const withdraw = renderHook(
      () => useYieldDtfWithdrawCall({ chainId: 1, stToken: ST_TOKEN, account: ACCOUNT, endId: 1n }),
      { wrapper },
    );
    expect(withdraw.result.current).toEqual({
      kind: "withdraw",
      params: { chainId: 1, stToken: ST_TOKEN, account: ACCOUNT, endId: 1n },
    });
  });

  it("keeps the same reference across rerenders with equal params", () => {
    const wrapper = createWrapper(createSdk());
    const { result, rerender } = renderHook(
      (amount: bigint) => useYieldDtfStakeCall({ chainId: 1, stToken: ST_TOKEN, amount }),
      { wrapper, initialProps: 1n },
    );
    const first = result.current;

    rerender(1n);
    expect(result.current).toBe(first);

    rerender(2n);
    expect(result.current).not.toBe(first);
  });
});
