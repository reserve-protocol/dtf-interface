import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import {
  getOptimisticGovernance,
  getOptimisticProposalContext,
  getOptimisticVotes,
  getPastOptimisticVotes,
} from "@/index-dtf/governance/optimistic";
import { getVoteState } from "@/index-dtf/governance/utils";

describe("Index DTF optimistic governance", () => {
  it("reads optimistic proposal veto context", async () => {
    const readContract = vi
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(200000000000000000n)
      .mockResolvedValueOnce(100n)
      .mockResolvedValueOnce("0x0000000000000000000000000000000000000002")
      .mockResolvedValueOnce(100000000000000000000n);
    const client = { viem: { readContract } } as unknown as DtfClient;

    const context = await getOptimisticProposalContext(client, {
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposalId: "42",
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
      voteStart: 100,
      voteEnd: 200,
      forWeightedVotes: { raw: 0n, formatted: "0" },
      againstWeightedVotes: { raw: 19n, formatted: "19" },
      abstainWeightedVotes: { raw: 0n, formatted: "0" },
      quorumVotes: { raw: 100n, formatted: "100" },
      optimistic: {
        snapshotSupply: { raw: 100n, formatted: "100" },
        vetoThreshold: 200000000000000000n,
      },
    } as const;

    expect(getVoteState(proposal, 201)).toMatchObject({
      state: "SUCCEEDED",
      vetoReached: false,
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
      quorum: false,
    });
  });

  it("treats zero snapshot supply optimistic proposals as canceled", () => {
    expect(
      getVoteState(
        {
          state: "ACTIVE",
          voteStart: 100,
          voteEnd: 200,
          forWeightedVotes: { raw: 0n, formatted: "0" },
          againstWeightedVotes: { raw: 0n, formatted: "0" },
          abstainWeightedVotes: { raw: 0n, formatted: "0" },
          quorumVotes: { raw: 100n, formatted: "100" },
          optimistic: {
            snapshotSupply: { raw: 0n, formatted: "0" },
            vetoThreshold: 200000000000000000n,
          },
        },
        201,
      ),
    ).toMatchObject({ state: "CANCELED" });
  });

  it("reads optimistic governance settings", async () => {
    const readContract = vi
      .fn()
      .mockResolvedValueOnce(3600n)
      .mockResolvedValueOnce(2n)
      .mockResolvedValueOnce([10n, 20n, 300000000000000000n])
      .mockResolvedValueOnce("0x0000000000000000000000000000000000000003")
      .mockResolvedValueOnce("0x0000000000000000000000000000000000000002")
      .mockResolvedValueOnce("0x0000000000000000000000000000000000000004")
      .mockResolvedValueOnce(1n)
      .mockResolvedValueOnce(1n)
      .mockResolvedValueOnce("0x0000000000000000000000000000000000000005")
      .mockResolvedValueOnce("0x0000000000000000000000000000000000000006");
    const client = { viem: { readContract } } as unknown as DtfClient;

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
