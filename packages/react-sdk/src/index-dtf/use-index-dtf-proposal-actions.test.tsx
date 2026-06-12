import { createElement, type PropsWithChildren } from "react";

// @vitest-environment jsdom
import type { DtfSdk } from "@reserve-protocol/sdk";

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  useIndexDtfCancelProposalCall,
  useIndexDtfExecuteProposalCall,
  useIndexDtfQueueProposalCall,
  useIndexDtfVoteCall,
} from "@/index-dtf/use-index-dtf-proposal-actions";
import { DtfSdkProvider, useDtfSdk } from "@/provider";

const GOVERNANCE = "0x0000000000000000000000000000000000000001";
const TIMELOCK = "0x0000000000000000000000000000000000000006";

function createSdk() {
  return {
    index: {
      prepareVote: vi.fn((params: unknown) => ({ kind: "vote", params })),
      prepareQueueProposal: vi.fn((params: unknown) => ({ kind: "queue", params })),
      prepareExecuteProposal: vi.fn((params: unknown) => ({ kind: "execute", params })),
      prepareCancelProposal: vi.fn((params: unknown) => ({ kind: "cancel", params })),
    },
  } as unknown as DtfSdk;
}

function createWrapper(sdk: DtfSdk) {
  return ({ children }: PropsWithChildren) => createElement(DtfSdkProvider, { sdk }, children);
}

describe("useDtfSdk", () => {
  it("throws outside DtfSdkProvider", () => {
    expect(() => renderHook(() => useDtfSdk())).toThrow("useDtfSdk must be used inside DtfSdkProvider.");
  });

  it("returns the injected sdk", () => {
    const sdk = createSdk();
    const { result } = renderHook(() => useDtfSdk(), { wrapper: createWrapper(sdk) });

    expect(result.current).toBe(sdk);
  });
});

describe("useIndexDtfVoteCall", () => {
  it("returns undefined without params", () => {
    const { result } = renderHook(() => useIndexDtfVoteCall(undefined), {
      wrapper: createWrapper(createSdk()),
    });

    expect(result.current).toBeUndefined();
  });

  it("prepares the vote call with full params", () => {
    const sdk = createSdk();
    const { result } = renderHook(
      () => useIndexDtfVoteCall({ chainId: 1, governance: GOVERNANCE, proposalId: 42n, support: 1 }),
      { wrapper: createWrapper(sdk) },
    );

    expect(result.current).toEqual({
      kind: "vote",
      params: { chainId: 1, governance: GOVERNANCE, proposalId: 42n, support: 1 },
    });
  });

  it("treats support 0 (against) as valid", () => {
    const sdk = createSdk();
    const { result } = renderHook(
      () => useIndexDtfVoteCall({ chainId: 1, governance: GOVERNANCE, proposalId: 42n, support: 0 }),
      { wrapper: createWrapper(sdk) },
    );

    expect(result.current).toBeDefined();
  });

  it("keeps the same reference across rerenders with equal params", () => {
    const sdk = createSdk();
    const { result, rerender } = renderHook(
      (support: number) => useIndexDtfVoteCall({ chainId: 1, governance: GOVERNANCE, proposalId: 42n, support }),
      { wrapper: createWrapper(sdk), initialProps: 1 },
    );
    const first = result.current;

    rerender(1);
    expect(result.current).toBe(first);

    rerender(0);
    expect(result.current).not.toBe(first);
  });
});

describe("proposal lifecycle call hooks", () => {
  const proposal = {
    governance: GOVERNANCE,
    timelock: TIMELOCK,
    timelockId: "0x42",
    targets: ["0x0000000000000000000000000000000000000003"],
    calldatas: ["0x1234"],
    description: "Proposal description",
  } as const;

  it("returns undefined without params", () => {
    const wrapper = createWrapper(createSdk());

    expect(renderHook(() => useIndexDtfQueueProposalCall(undefined), { wrapper }).result.current).toBeUndefined();
    expect(renderHook(() => useIndexDtfExecuteProposalCall(undefined), { wrapper }).result.current).toBeUndefined();
    expect(renderHook(() => useIndexDtfCancelProposalCall(undefined), { wrapper }).result.current).toBeUndefined();
  });

  it("prepares queue, execute, and cancel calls from a proposal", () => {
    const wrapper = createWrapper(createSdk());
    const params = { chainId: 1, proposal } as const;

    const queue = renderHook(() => useIndexDtfQueueProposalCall(params), { wrapper }).result.current;
    const execute = renderHook(() => useIndexDtfExecuteProposalCall(params), { wrapper }).result.current;
    const cancel = renderHook(() => useIndexDtfCancelProposalCall(params), { wrapper }).result.current;

    expect(queue).toMatchObject({ kind: "queue" });
    expect(execute).toMatchObject({ kind: "execute" });
    expect(cancel).toMatchObject({ kind: "cancel" });
  });

  it("requires a timelock for cancel but not for queue", () => {
    const wrapper = createWrapper(createSdk());
    const withoutTimelock = {
      chainId: 1,
      proposal: {
        governance: GOVERNANCE,
        targets: proposal.targets,
        calldatas: proposal.calldatas,
        description: proposal.description,
      },
    } as const;

    expect(
      renderHook(() => useIndexDtfCancelProposalCall(withoutTimelock), { wrapper }).result.current,
    ).toBeUndefined();
    expect(renderHook(() => useIndexDtfQueueProposalCall(withoutTimelock), { wrapper }).result.current).toBeDefined();
  });
});
