import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import {
  getOptimisticGovernance,
  getOptimisticProposalContext,
  getOptimisticVotes,
  getPastOptimisticVotes,
} from "@/index-dtf/governance/optimistic";
import { getVoteState } from "@/index-dtf/governance/utils";

const MAX_UINT256 = (1n << 256n) - 1n;

describe("Index DTF optimistic governance", () => {
  it("reads optimistic proposal veto context", async () => {
    const multicall = vi.fn(async () => [
      100n,
      "0x0000000000000000000000000000000000000002",
    ]);
    const readContract = vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(100000000000000000000n);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ multicall })),
        readContract,
      },
    } as unknown as DtfClient;

    const context = await getOptimisticProposalContext(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposalId: "42",
      vetoThreshold: 200000000000000000n,
    });

    expect(context).toEqual({
      proposalId: "42",
      voteToken: "0x0000000000000000000000000000000000000002",
      snapshot: 100n,
      snapshotSupply: {
        raw: 100000000000000000000n,
        formatted: "100",
      },
      vetoThreshold: 200000000000000000n,
      vetoThresholdVotes: {
        raw: 20000000000000000000n,
        formatted: "20",
      },
    });
    expect(readContract).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        functionName: "isOptimistic",
        args: [42n],
      }),
    );
    expect(multicall).toHaveBeenCalledWith(
      expect.objectContaining({
        allowFailure: false,
        contracts: [
          expect.objectContaining({ functionName: "proposalSnapshot" }),
          expect.objectContaining({ functionName: "token" }),
        ],
      }),
    );
  });

  it("does not infer proposal-specific veto threshold from current governor params", async () => {
    const getPublicClient = vi.fn();
    const readContract = vi.fn().mockResolvedValueOnce(true);
    const client = {
      viem: {
        getPublicClient,
        readContract,
      },
    } as unknown as DtfClient;

    const context = await getOptimisticProposalContext(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposalId: "42",
    });

    expect(context).toBeNull();
    expect(getPublicClient).not.toHaveBeenCalled();
  });

  it("uses provided optimistic proposal metadata without extra governor calls", async () => {
    const readContract = vi.fn().mockResolvedValueOnce(100000000000000000000n);
    const getPublicClient = vi.fn();
    const client = {
      viem: {
        getPublicClient,
        readContract,
      },
    } as unknown as DtfClient;

    const context = await getOptimisticProposalContext(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposalId: "42",
      isOptimistic: true,
      voteToken: "0x0000000000000000000000000000000000000002",
      snapshot: 100n,
      vetoThreshold: 200000000000000000n,
    });

    expect(getPublicClient).not.toHaveBeenCalled();
    expect(readContract).toHaveBeenCalledTimes(1);
    expect(readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: "0x0000000000000000000000000000000000000002",
        functionName: "getPastTotalSupply",
        args: [100n],
      }),
    );
    expect(context?.vetoThresholdVotes).toEqual({
      raw: 20000000000000000000n,
      formatted: "20",
    });
  });

  it("does not build optimistic proposal context for zero veto thresholds", async () => {
    const readContract = vi.fn().mockResolvedValueOnce(100n);
    const client = {
      viem: {
        getPublicClient: vi.fn(),
        readContract,
      },
    } as unknown as DtfClient;

    const context = await getOptimisticProposalContext(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposalId: "42",
      isOptimistic: true,
      voteToken: "0x0000000000000000000000000000000000000002",
      snapshot: 100n,
      vetoThreshold: 0n,
    });

    expect(context).toBeNull();
    expect(readContract).not.toHaveBeenCalled();
  });

  it("rounds positive optimistic proposal context thresholds up to one vote", async () => {
    const readContract = vi.fn().mockResolvedValueOnce(1n);
    const client = {
      viem: {
        getPublicClient: vi.fn(),
        readContract,
      },
    } as unknown as DtfClient;

    const context = await getOptimisticProposalContext(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposalId: "42",
      isOptimistic: true,
      voteToken: "0x0000000000000000000000000000000000000002",
      snapshot: 100n,
      vetoThreshold: 1n,
    });

    expect(context?.vetoThresholdVotes).toEqual({
      raw: 1n,
      formatted: "0.000000000000000001",
    });
  });

  it("returns null when a governor does not expose optimistic reads", async () => {
    const readContract = vi.fn(async () => {
      throw new Error("The contract function returned no data");
    });
    const client = { viem: { readContract } } as unknown as DtfClient;

    await expect(
      getOptimisticProposalContext(client, {
        chainId: 1,
        governance: "0x0000000000000000000000000000000000000001",
        proposalId: "42",
      }),
    ).resolves.toBeNull();
  });

  it("does not hide RPC failures while checking optimistic status", async () => {
    const readContract = vi.fn(async () => {
      throw new Error("network is down");
    });
    const client = { viem: { readContract } } as unknown as DtfClient;

    await expect(
      getOptimisticProposalContext(client, {
        chainId: 1,
        governance: "0x0000000000000000000000000000000000000001",
        proposalId: "42",
      }),
    ).rejects.toThrow("network is down");
  });

  it("does not treat execution reverts as unsupported optimistic reads", async () => {
    const readContract = vi.fn(async () => {
      throw new Error("execution reverted");
    });
    const client = { viem: { readContract } } as unknown as DtfClient;

    await expect(
      getOptimisticProposalContext(client, {
        chainId: 1,
        governance: "0x0000000000000000000000000000000000000001",
        proposalId: "42",
      }),
    ).rejects.toThrow("execution reverted");
  });

  it("computes optimistic proposals as succeeded unless veto threshold is reached", () => {
    const proposal = {
      state: "ACTIVE",
      isOptimistic: true,
      voteStart: 100,
      voteEnd: 200,
      forWeightedVotes: { raw: 0n, formatted: "0" },
      againstWeightedVotes: { raw: 19n, formatted: "19" },
      abstainWeightedVotes: { raw: 0n, formatted: "0" },
      quorumVotes: { raw: 100n, formatted: "100" },
      optimistic: {
        vetoThresholdVotes: { raw: 20n, formatted: "20" },
      },
    } as const;

    expect(getVoteState(proposal, 201)).toMatchObject({
      state: "SUCCEEDED",
      vetoReached: false,
      against: 95,
    });
    expect(
      getVoteState(
        {
          ...proposal,
          againstWeightedVotes: { raw: 20n, formatted: "20" },
        },
        201,
      ),
    ).toMatchObject({
      state: "DEFEATED",
      vetoReached: true,
      quorum: true,
      against: 100,
    });
  });

  it("does not use quorum votes as optimistic veto threshold without an indexed veto threshold", () => {
    expect(
      getVoteState(
        {
          state: "ACTIVE",
          isOptimistic: true,
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 100n, formatted: "100" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 1n, formatted: "1" },
        },
        201,
      ),
    ).toMatchObject({
      state: "ACTIVE",
      quorum: false,
      vetoReached: false,
    });
  });

  it("defeats optimistic proposals immediately when the veto threshold is reached", () => {
    const proposal = {
      state: "ACTIVE",
      isOptimistic: true,
      voteStart: 100,
      voteEnd: 200,
      forWeightedVotes: { raw: 0n, formatted: "0" },
      againstWeightedVotes: { raw: 500000000000000000n, formatted: "0.5" },
      abstainWeightedVotes: { raw: 0n, formatted: "0" },
      quorumVotes: { raw: 100000000000000000n, formatted: "0.1" },
      optimistic: {
        vetoThresholdVotes: { raw: 100000000000000000n, formatted: "0.1" },
      },
    } as const;

    expect(getVoteState(proposal, 150)).toMatchObject({
      state: "DEFEATED",
      quorum: true,
      vetoReached: true,
      against: 500,
    });
    expect(getVoteState(proposal, 201)).toMatchObject({
      state: "DEFEATED",
      quorum: true,
      vetoReached: true,
      against: 500,
    });
  });

  it("keeps optimistic proposals pending at the vote start boundary", () => {
    expect(
      getVoteState(
        {
          state: "PENDING",
          isOptimistic: true,
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 1n, formatted: "1" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 100n, formatted: "100" },
          optimistic: {
            vetoThresholdVotes: { raw: 1n, formatted: "1" },
          },
        },
        100,
      ),
    ).toMatchObject({
      state: "PENDING",
      vetoReached: true,
    });
  });

  it("keeps optimistic proposals active at the vote end boundary", () => {
    expect(
      getVoteState(
        {
          state: "ACTIVE",
          isOptimistic: true,
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 0n, formatted: "0" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 100n, formatted: "100" },
          optimistic: {
            vetoThresholdVotes: { raw: 1n, formatted: "1" },
          },
        },
        200,
      ),
    ).toMatchObject({
      state: "ACTIVE",
      vetoReached: false,
    });
  });

  it("defeats transitioned optimistic proposals after the pending boundary", () => {
    expect(
      getVoteState(
        {
          state: "ACTIVE",
          isOptimistic: true,
          vetoThreshold: MAX_UINT256,
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 0n, formatted: "0" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 100n, formatted: "100" },
        },
        150,
      ),
    ).toMatchObject({
      state: "DEFEATED",
      vetoReached: false,
    });
  });

  it("defeats stale pending optimistic proposals when the veto threshold is reached", () => {
    expect(
      getVoteState(
        {
          state: "PENDING",
          isOptimistic: true,
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 1n, formatted: "1" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 100n, formatted: "100" },
          optimistic: {
            vetoThresholdVotes: { raw: 1n, formatted: "1" },
          },
        },
        150,
      ),
    ).toMatchObject({
      state: "DEFEATED",
      vetoReached: true,
    });
  });

  it("keeps standard proposals active before the voting period ends", () => {
    const proposal = {
      state: "ACTIVE",
      isOptimistic: false,
      voteStart: 100,
      voteEnd: 200,
      forWeightedVotes: { raw: 0n, formatted: "0" },
      againstWeightedVotes: { raw: 100n, formatted: "100" },
      abstainWeightedVotes: { raw: 0n, formatted: "0" },
      quorumVotes: { raw: 1n, formatted: "1" },
    } as const;

    expect(
      getVoteState(proposal, 150),
    ).toMatchObject({
      state: "ACTIVE",
    });
    expect(getVoteState(proposal, 200)).toMatchObject({
      state: "ACTIVE",
    });
  });

  it("auto-cancels optimistic proposals with zero snapshot supply", () => {
    expect(
      getVoteState(
        {
          state: "ACTIVE",
          isOptimistic: true,
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 0n, formatted: "0" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 100n, formatted: "100" },
          optimistic: {
            snapshotSupply: { raw: 0n, formatted: "0" },
            vetoThreshold: 100000000000000000n,
            vetoThresholdVotes: { raw: 0n, formatted: "0" },
          },
        },
        150,
      ),
    ).toMatchObject({
      state: "CANCELED",
      vetoReached: false,
    });
  });

  it("does not treat zero veto thresholds as canceled", () => {
    expect(
      getVoteState(
        {
          state: "ACTIVE",
          isOptimistic: true,
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 0n, formatted: "0" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 100n, formatted: "100" },
          optimistic: {
            snapshotSupply: { raw: 100n, formatted: "100" },
            vetoThreshold: 0n,
          },
        },
        150,
      ),
    ).toMatchObject({
      state: "ACTIVE",
      vetoReached: false,
    });
  });

  it("shows optimistic challenge progress toward the veto threshold", () => {
    expect(
      getVoteState(
        {
          state: "ACTIVE",
          isOptimistic: true,
          vetoThreshold: 100000000000000000n,
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 5n, formatted: "5" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 10n, formatted: "10" },
          optimistic: {
            vetoThresholdVotes: { raw: 10n, formatted: "10" },
          },
        },
        150,
      ),
    ).toMatchObject({
      against: 50,
      vetoReached: false,
    });
  });

  it("treats ended optimistic proposals with no veto votes as succeeded without exact context", () => {
    expect(
      getVoteState(
        {
          state: "ACTIVE",
          isOptimistic: true,
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 0n, formatted: "0" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 100n, formatted: "100" },
        },
        201,
      ),
    ).toMatchObject({
      state: "SUCCEEDED",
      quorum: false,
      vetoReached: false,
    });
  });

  it("uses indexed one-vote optimistic thresholds", () => {
    expect(
      getVoteState(
        {
          state: "ACTIVE",
          isOptimistic: true,
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 0n, formatted: "0" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 100n, formatted: "100" },
          optimistic: {
            vetoThresholdVotes: { raw: 1n, formatted: "0.000000000000000001" },
          },
        },
        201,
      ),
    ).toMatchObject({
      state: "SUCCEEDED",
      vetoReached: false,
    });
    expect(
      getVoteState(
        {
          state: "ACTIVE",
          isOptimistic: true,
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 1n, formatted: "0.000000000000000001" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 100n, formatted: "100" },
          optimistic: {
            vetoThresholdVotes: { raw: 1n, formatted: "0.000000000000000001" },
          },
        },
        201,
      ),
    ).toMatchObject({
      state: "DEFEATED",
      vetoReached: true,
    });
  });

  it("reads optimistic governance settings", async () => {
    const multicall = vi
      .fn()
      .mockResolvedValueOnce([
        3600n,
        2n,
        [10n, 20n, 300000000000000000n],
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000004",
      ])
      .mockResolvedValueOnce([1n, 1n])
      .mockResolvedValueOnce([
        "0x0000000000000000000000000000000000000005",
        "0x0000000000000000000000000000000000000006",
      ]);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ multicall })),
      },
    } as unknown as DtfClient;

    const governance = await getOptimisticGovernance(client, {
      chainId: 8453,
      governance: "0x0000000000000000000000000000000000000001",
    });

    expect(governance).toMatchObject({
      governance: "0x0000000000000000000000000000000000000001",
      token: "0x0000000000000000000000000000000000000002",
      timelock: "0x0000000000000000000000000000000000000004",
      selectorRegistry: "0x0000000000000000000000000000000000000003",
      lateQuorumVoteExtension: 3600n,
      proposalThrottleCapacity: 2n,
      optimisticParams: {
        vetoDelay: 10n,
        vetoPeriod: 20n,
        vetoThreshold: 300000000000000000n,
      },
      optimisticProposers: ["0x0000000000000000000000000000000000000005"],
      guardians: ["0x0000000000000000000000000000000000000006"],
    });
    expect(multicall).toHaveBeenCalledTimes(3);
    expect(multicall).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        allowFailure: false,
        contracts: expect.arrayContaining([
          expect.objectContaining({ functionName: "lateQuorumVoteExtension" }),
          expect.objectContaining({ functionName: "proposalThrottleCapacity" }),
          expect.objectContaining({ functionName: "optimisticParams" }),
          expect.objectContaining({ functionName: "selectorRegistry" }),
          expect.objectContaining({ functionName: "token" }),
          expect.objectContaining({ functionName: "timelock" }),
        ]),
      }),
    );
  });

  it("reads current and past optimistic voting power from the vote token", async () => {
    const getBlock = vi.fn(async () => ({ timestamp: 1_000n }));
    const readContract = vi
      .fn()
      .mockResolvedValueOnce(3000000000000000000n)
      .mockResolvedValueOnce(2000000000000000000n);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ getBlock })),
        readContract,
      },
    } as unknown as DtfClient;
    const params = {
      chainId: 1,
      voteToken: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
    } as const;

    await expect(getOptimisticVotes(client, params)).resolves.toEqual({
      raw: 3000000000000000000n,
      formatted: "3",
    });
    await expect(getPastOptimisticVotes(client, params)).resolves.toEqual({
      raw: 2000000000000000000n,
      formatted: "2",
    });
    expect(readContract).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        functionName: "getPastOptimisticVotes",
        args: ["0x0000000000000000000000000000000000000002", 999n],
      }),
    );
  });
});
