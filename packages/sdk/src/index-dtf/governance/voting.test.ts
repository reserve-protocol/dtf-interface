import { afterEach, describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import {
  getOptimisticProposalVoterState,
  getProposalVoterState,
  getProposerState,
  getVoterState,
} from "@/index-dtf/governance/index";

describe("Index DTF governance voting", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reads current vote-lock voter state", async () => {
    const multicall = vi
      .fn()
      .mockResolvedValueOnce([
        "0x0000000000000000000000000000000000000002",
        5000000000000000000n,
        3000000000000000000n,
        10000000000000000000n,
      ])
      .mockResolvedValueOnce([
        { status: "success", result: "0x0000000000000000000000000000000000000003" },
        { status: "success", result: 2000000000000000000n },
      ]);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ multicall })),
      },
    } as unknown as DtfClient;

    const state = await getVoterState(client, {
      chainId: 1,
      stToken: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
    });

    expect(multicall).toHaveBeenCalledTimes(2);
    expect(multicall).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        allowFailure: false,
        contracts: expect.arrayContaining([
          expect.objectContaining({ functionName: "delegates" }),
          expect.objectContaining({ functionName: "balanceOf" }),
          expect.objectContaining({ functionName: "getVotes" }),
          expect.objectContaining({ functionName: "totalSupply" }),
        ]),
      }),
    );
    expect(multicall).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        allowFailure: true,
        contracts: expect.arrayContaining([
          expect.objectContaining({ functionName: "optimisticDelegates" }),
          expect.objectContaining({ functionName: "getOptimisticVotes" }),
        ]),
      }),
    );
    expect(state).toMatchObject({
      account: "0x0000000000000000000000000000000000000002",
      delegate: "0x0000000000000000000000000000000000000002",
      optimisticDelegate: "0x0000000000000000000000000000000000000003",
      balance: { raw: 5000000000000000000n, formatted: "5" },
      votingPower: { raw: 3000000000000000000n, formatted: "3" },
      optimisticVotingPower: { raw: 2000000000000000000n, formatted: "2" },
      voteSupply: { raw: 10000000000000000000n, formatted: "10" },
      isSelfDelegated: true,
      isOptimisticSelfDelegated: false,
      hasVotingPower: true,
      hasOptimisticVotingPower: true,
    });
  });

  it("reads proposer state at the latest governor clock timepoint", async () => {
    const multicall = vi
      .fn()
      .mockResolvedValueOnce([1_000n, 3000000000000000000n])
      .mockResolvedValueOnce([5000000000000000000n]);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ multicall })),
      },
    } as unknown as DtfClient;

    const state = await getProposerState(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
    });

    expect(multicall).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({ functionName: "clock" }),
          expect.objectContaining({ functionName: "proposalThreshold" }),
        ]),
      }),
    );
    expect(multicall).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({
            functionName: "getVotes",
            args: ["0x0000000000000000000000000000000000000002", 999n],
          }),
        ]),
      }),
    );
    expect(state).toMatchObject({
      account: "0x0000000000000000000000000000000000000002",
      governance: "0x0000000000000000000000000000000000000001",
      votingPower: { raw: 5000000000000000000n, formatted: "5" },
      proposalThreshold: { raw: 3000000000000000000n, formatted: "3" },
      canPropose: true,
    });
  });

  it("reads proposal voter state at the proposal snapshot timepoint", async () => {
    const multicall = vi.fn().mockResolvedValueOnce([1_000_000n]).mockResolvedValueOnce([4000000000000000000n]);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ multicall })),
      },
    } as unknown as DtfClient;

    const state = await getProposalVoterState(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
      proposal: {
        id: "1",
        optimistic: {
          proposalId: "1",
          voteToken: "0x0000000000000000000000000000000000000003",
          snapshot: 999_800n,
          snapshotSupply: { raw: 10n, formatted: "10" },
          vetoThreshold: 1n,
          vetoThresholdVotes: { raw: 1n, formatted: "1" },
        },
        voteStart: 999_900,
        voteToken: "0x0000000000000000000000000000000000000003",
        votes: [
          {
            voter: "0x0000000000000000000000000000000000000002",
            choice: "FOR",
            weight: { raw: 1n, formatted: "1" },
          },
        ],
      },
    });

    expect(multicall).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        allowFailure: false,
        contracts: expect.arrayContaining([
          expect.objectContaining({
            functionName: "getVotes",
            args: ["0x0000000000000000000000000000000000000002", 999899n],
          }),
        ]),
      }),
    );
    expect(state).toMatchObject({
      account: "0x0000000000000000000000000000000000000002",
      votingPower: { raw: 4000000000000000000n, formatted: "4" },
      vote: "FOR",
      hasVoted: true,
      hasVotingPower: true,
    });
  });

  it("clamps standard proposal voter state reads before future snapshots", async () => {
    const multicall = vi.fn().mockResolvedValueOnce([1_000_000n]).mockResolvedValueOnce([4000000000000000000n]);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ multicall })),
      },
    } as unknown as DtfClient;

    await getProposalVoterState(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
      proposal: {
        id: "1",
        voteStart: 1_000_100,
        voteToken: "0x0000000000000000000000000000000000000003",
        votes: [],
      },
    });

    expect(multicall).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({
            functionName: "getVotes",
            args: ["0x0000000000000000000000000000000000000002", 999999n],
          }),
        ]),
      }),
    );
  });

  it("reads optimistic proposal voter state from the vote token snapshot", async () => {
    const multicall = vi
      .fn()
      .mockResolvedValueOnce([1_000_000n])
      .mockResolvedValueOnce([{ status: "success", result: 2000000000000000000n }]);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ multicall })),
      },
    } as unknown as DtfClient;

    const state = await getOptimisticProposalVoterState(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
      proposal: {
        id: "1",
        optimistic: {
          proposalId: "1",
          voteToken: "0x0000000000000000000000000000000000000003",
          snapshot: 999_800n,
          snapshotSupply: { raw: 10n, formatted: "10" },
          vetoThreshold: 1n,
          vetoThresholdVotes: { raw: 1n, formatted: "1" },
        },
        voteStart: 999_900,
        voteToken: "0x0000000000000000000000000000000000000003",
        votes: [],
      },
    });

    expect(multicall).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        allowFailure: true,
        contracts: expect.arrayContaining([
          expect.objectContaining({
            functionName: "getPastOptimisticVotes",
            args: ["0x0000000000000000000000000000000000000002", 999800n],
          }),
        ]),
      }),
    );
    expect(state).toMatchObject({
      optimisticVotingPower: { raw: 2000000000000000000n, formatted: "2" },
      hasOptimisticVotingPower: true,
    });
  });

  it("reads unified proposal voter state for optimistic proposals", async () => {
    const multicall = vi
      .fn()
      .mockResolvedValueOnce([1_000_000n])
      .mockResolvedValueOnce([{ status: "success", result: 2000000000000000000n }]);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ multicall })),
      },
    } as unknown as DtfClient;

    const state = await getProposalVoterState(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
      proposal: {
        id: "1",
        isOptimistic: true,
        voteStart: 999_900,
        voteToken: "0x0000000000000000000000000000000000000003",
        votes: [],
      },
    });

    expect(multicall).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        allowFailure: true,
        contracts: expect.arrayContaining([
          expect.objectContaining({
            functionName: "getPastOptimisticVotes",
            args: ["0x0000000000000000000000000000000000000002", 999900n],
          }),
        ]),
      }),
    );
    expect(state).toMatchObject({
      votingPower: { raw: 2000000000000000000n, formatted: "2" },
      hasVotingPower: true,
    });
  });

  it("clamps optimistic proposal voter state reads before future snapshots", async () => {
    const multicall = vi
      .fn()
      .mockResolvedValueOnce([1_000_000n])
      .mockResolvedValueOnce([{ status: "success", result: 2000000000000000000n }]);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ multicall })),
      },
    } as unknown as DtfClient;

    await getProposalVoterState(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
      proposal: {
        id: "1",
        isOptimistic: true,
        optimistic: {
          proposalId: "1",
          voteToken: "0x0000000000000000000000000000000000000003",
          snapshot: 1_000_100n,
          snapshotSupply: { raw: 10n, formatted: "10" },
          vetoThreshold: 1n,
          vetoThresholdVotes: { raw: 1n, formatted: "1" },
        },
        voteStart: 1_000_100,
        voteToken: "0x0000000000000000000000000000000000000003",
        votes: [],
      },
    });

    expect(multicall).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({
            functionName: "getPastOptimisticVotes",
            args: ["0x0000000000000000000000000000000000000002", 999999n],
          }),
        ]),
      }),
    );
  });
});
