import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getProposalVoterState, getProposerState, getVoterState } from "@/index-dtf/governance/index";

describe("Index DTF governance voting", () => {
  it("reads current vote-lock voter state", async () => {
    const readContract = vi
      .fn()
      .mockResolvedValueOnce("0x0000000000000000000000000000000000000002")
      .mockResolvedValueOnce(5000000000000000000n)
      .mockResolvedValueOnce(3000000000000000000n)
      .mockResolvedValueOnce(10000000000000000000n)
      .mockResolvedValueOnce("0x0000000000000000000000000000000000000003")
      .mockResolvedValueOnce(2000000000000000000n);
    const client = {
      viem: {
        readContract,
      },
    } as unknown as DtfClient;

    const state = await getVoterState(client, {
      chainId: 1,
      stToken: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
    });

    expect(readContract).toHaveBeenCalledTimes(6);
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

  it("reads proposer state at the latest block timepoint", async () => {
    const getBlock = vi.fn(async () => ({ timestamp: 1_000n }));
    const readContract = vi
      .fn()
      .mockResolvedValueOnce(5000000000000000000n)
      .mockResolvedValueOnce(3000000000000000000n);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ getBlock })),
        readContract,
      },
    } as unknown as DtfClient;

    const state = await getProposerState(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
    });

    expect(getBlock).toHaveBeenCalledOnce();
    expect(readContract).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        functionName: "getVotes",
        args: ["0x0000000000000000000000000000000000000002", 999n],
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
    const getBlock = vi.fn(async () => ({ timestamp: 1_000_000_000n }));
    const readContract = vi.fn(async () => 4000000000000000000n);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ getBlock })),
        readContract,
      },
    } as unknown as DtfClient;

    const state = await getProposalVoterState(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
      proposal: {
        id: "1",
        voteStart: 999_900,
        votes: [
          {
            voter: "0x0000000000000000000000000000000000000002",
            choice: "FOR",
            weight: { raw: 1n, formatted: "1" },
          },
        ],
      },
    });

    expect(readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: "getVotes",
        args: ["0x0000000000000000000000000000000000000002", 999899n],
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

  it("reads optimistic proposal voter state from the vote token snapshot", async () => {
    const getBlock = vi.fn(async () => ({ timestamp: 1_000_000_000n }));
    const readContract = vi
      .fn()
      .mockResolvedValueOnce(4000000000000000000n)
      .mockResolvedValueOnce(2000000000000000000n);
    const client = {
      viem: {
        getPublicClient: vi.fn(() => ({ getBlock })),
        readContract,
      },
    } as unknown as DtfClient;

    const state = await getProposalVoterState(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      account: "0x0000000000000000000000000000000000000002",
      proposal: {
        id: "1",
        isOptimistic: true,
        optimistic: {
          proposalId: "1",
          voteToken: "0x0000000000000000000000000000000000000003",
          snapshot: 999_800n,
          snapshotSupply: { raw: 10n, formatted: "10" },
          vetoThreshold: 1n,
          vetoThresholdVotes: { raw: 1n, formatted: "1" },
        },
        voteToken: "0x0000000000000000000000000000000000000003",
        voteStart: 999_900,
        votes: [],
      },
    });

    expect(readContract).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        functionName: "getPastOptimisticVotes",
        args: ["0x0000000000000000000000000000000000000002", 999800n],
      }),
    );
    expect(state).toMatchObject({
      votingPower: { raw: 4000000000000000000n, formatted: "4" },
      optimisticVotingPower: { raw: 2000000000000000000n, formatted: "2" },
      hasOptimisticVotingPower: true,
    });
  });
});
