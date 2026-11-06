import { afterEach, describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import {
  getOptimisticProposalVoterState,
  getProposalVoterState,
  getProposalVotes,
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
        18,
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
          expect.objectContaining({ functionName: "decimals" }),
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
      votingWeight: 30,
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
      .mockResolvedValueOnce([1_000n, 3000000000000000000n, "0x0000000000000000000000000000000000000003"])
      .mockResolvedValueOnce([5000000000000000000n, 18]);
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
    // The governor counts a delegation checkpoint written at voteStart itself.
    const multicall = vi.fn(
      async ({ contracts }: { contracts: readonly { functionName: string; args?: readonly unknown[] }[] }) =>
        contracts.map(({ functionName, args }) => {
          if (functionName === "clock") return 1_000_000n;
          if (functionName === "decimals") return 18;
          if (functionName === "getVotes") return args?.[1] === 999_900n ? 4000000000000000000n : 0n;
          throw new Error(`Unexpected read: ${functionName}`);
        }),
    );
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
            args: ["0x0000000000000000000000000000000000000002", 999900n],
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

  it.each([1_000_000, 1_000_100])(
    "clamps the standard snapshot %i at or after the current clock",
    async (voteStart) => {
      const multicall = vi.fn().mockResolvedValueOnce([1_000_000n, 18]).mockResolvedValueOnce([4000000000000000000n]);
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
          voteStart,
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
    },
  );

  it("reads optimistic proposal voter state from the vote token snapshot", async () => {
    const multicall = vi
      .fn()
      .mockResolvedValueOnce([1_000_000n, 18])
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
      .mockResolvedValueOnce([1_000_000n, 18])
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
      .mockResolvedValueOnce([1_000_000n, 18])
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

  describe("with a 6-decimal vote token", () => {
    it("formats voter state in the vote token decimals", async () => {
      const multicall = vi
        .fn()
        .mockResolvedValueOnce(["0x0000000000000000000000000000000000000002", 300000n, 300000n, 1000000n, 6])
        .mockResolvedValueOnce([
          { status: "success", result: "0x0000000000000000000000000000000000000002" },
          { status: "success", result: 200000n },
        ]);
      const client = {
        viem: {
          getPublicClient: vi.fn(() => ({ multicall })),
        },
      } as unknown as DtfClient;

      const state = await getVoterState(client, {
        chainId: 8453,
        stToken: "0x0000000000000000000000000000000000000001",
        account: "0x0000000000000000000000000000000000000002",
      });

      expect(state).toMatchObject({
        balance: { raw: 300000n, formatted: "0.3" },
        votingPower: { raw: 300000n, formatted: "0.3" },
        optimisticVotingPower: { raw: 200000n, formatted: "0.2" },
        voteSupply: { raw: 1000000n, formatted: "1" },
        votingWeight: 30,
      });
    });

    it("formats proposer state in the vote token decimals", async () => {
      const multicall = vi
        .fn()
        .mockResolvedValueOnce([1_000n, 10000n, "0x0000000000000000000000000000000000000003"])
        .mockResolvedValueOnce([300000n, 6]);
      const client = {
        viem: {
          getPublicClient: vi.fn(() => ({ multicall })),
        },
      } as unknown as DtfClient;

      const state = await getProposerState(client, {
        chainId: 8453,
        governance: "0x0000000000000000000000000000000000000001",
        account: "0x0000000000000000000000000000000000000002",
      });

      expect(multicall).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          contracts: expect.arrayContaining([
            expect.objectContaining({
              address: "0x0000000000000000000000000000000000000003",
              functionName: "decimals",
            }),
          ]),
        }),
      );
      expect(state).toMatchObject({
        votingPower: { raw: 300000n, formatted: "0.3" },
        proposalThreshold: { raw: 10000n, formatted: "0.01" },
        canPropose: true,
      });
    });

    it("uses known vote token decimals for proposer state at a timepoint without a decimals read", async () => {
      const multicall = vi.fn().mockResolvedValueOnce([300000n, 10000n, "0x0000000000000000000000000000000000000003"]);
      const readContract = vi.fn();
      const client = {
        viem: {
          getPublicClient: vi.fn(() => ({ multicall })),
          readContract,
        },
      } as unknown as DtfClient;

      const state = await getProposerState(client, {
        chainId: 8453,
        governance: "0x0000000000000000000000000000000000000001",
        account: "0x0000000000000000000000000000000000000002",
        timepoint: 999n,
        voteTokenDecimals: 6,
      });

      expect(readContract).not.toHaveBeenCalled();
      expect(state.votingPower).toEqual({ raw: 300000n, formatted: "0.3" });
    });

    it("reads vote token decimals for proposal votes", async () => {
      const multicall = vi
        .fn()
        .mockResolvedValueOnce([[10000n, 30000n, 0n], "0x0000000000000000000000000000000000000003"]);
      const readContract = vi.fn().mockResolvedValueOnce(6);
      const client = {
        viem: {
          getPublicClient: vi.fn(() => ({ multicall })),
          readContract,
        },
      } as unknown as DtfClient;

      const votes = await getProposalVotes(client, {
        chainId: 8453,
        governance: "0x0000000000000000000000000000000000000001",
        proposalId: "1",
      });

      expect(readContract).toHaveBeenCalledWith(
        expect.objectContaining({
          address: "0x0000000000000000000000000000000000000003",
          functionName: "decimals",
        }),
      );
      expect(votes).toEqual({
        againstVotes: { raw: 10000n, formatted: "0.01" },
        forVotes: { raw: 30000n, formatted: "0.03" },
        abstainVotes: { raw: 0n, formatted: "0" },
      });
    });

    it("formats proposal voter state in the vote token decimals", async () => {
      const multicall = vi.fn().mockResolvedValueOnce([1_000_000n, 6]).mockResolvedValueOnce([300000n]);
      const client = {
        viem: {
          getPublicClient: vi.fn(() => ({ multicall })),
        },
      } as unknown as DtfClient;

      const state = await getProposalVoterState(client, {
        chainId: 8453,
        governance: "0x0000000000000000000000000000000000000001",
        account: "0x0000000000000000000000000000000000000002",
        proposal: {
          id: "1",
          voteStart: 999_900,
          voteToken: "0x0000000000000000000000000000000000000003",
          votes: [],
        },
      });

      expect(multicall).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          contracts: expect.arrayContaining([
            expect.objectContaining({
              address: "0x0000000000000000000000000000000000000003",
              functionName: "decimals",
            }),
          ]),
        }),
      );
      expect(state.votingPower).toEqual({ raw: 300000n, formatted: "0.3" });
    });

    it("formats optimistic proposal voter state in the vote token decimals", async () => {
      const multicall = vi
        .fn()
        .mockResolvedValueOnce([1_000_000n, 6])
        .mockResolvedValueOnce([{ status: "success", result: 200000n }]);
      const client = {
        viem: {
          getPublicClient: vi.fn(() => ({ multicall })),
        },
      } as unknown as DtfClient;

      const state = await getOptimisticProposalVoterState(client, {
        chainId: 8453,
        governance: "0x0000000000000000000000000000000000000001",
        account: "0x0000000000000000000000000000000000000002",
        proposal: {
          id: "1",
          voteStart: 999_900,
          voteToken: "0x0000000000000000000000000000000000000003",
          votes: [],
        },
      });

      expect(state.optimisticVotingPower).toEqual({ raw: 200000n, formatted: "0.2" });
    });
  });
});
