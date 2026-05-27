import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getDelegates } from "@/index-dtf/governance/index";

describe("Index DTF governance delegates", () => {
  it("lists delegates ordered by delegated votes from the subgraph", async () => {
    const queryIndex = vi.fn(async () => ({
      stakingToken: {
        id: "0x0000000000000000000000000000000000000001",
        totalDelegates: "2",
        currentDelegates: "2",
        totalOptimisticDelegates: "2",
        currentOptimisticDelegates: "2",
        token: {
          totalSupply: "10000000000000000000",
        },
        delegates: [
          {
            address: "0x0000000000000000000000000000000000000002",
            delegatedVotesRaw: "3000000000000000000",
            optimisticDelegatedVotesRaw: "2000000000000000000",
            numberVotes: 4,
            numberOptimisticVotes: 2,
            hasBeenStandardDelegate: true,
            hasBeenOptimisticDelegate: true,
            tokenHoldersRepresentedAmount: 3,
            optimisticTokenHoldersRepresentedAmount: 1,
          },
          {
            address: "0x0000000000000000000000000000000000000003",
            delegatedVotesRaw: "1000000000000000000",
            optimisticDelegatedVotesRaw: "0",
            numberVotes: 2,
            numberOptimisticVotes: 0,
            hasBeenStandardDelegate: true,
            hasBeenOptimisticDelegate: false,
            tokenHoldersRepresentedAmount: 2,
            optimisticTokenHoldersRepresentedAmount: 0,
          },
          {
            address: "0x0000000000000000000000000000000000000004",
            delegatedVotesRaw: "0",
            optimisticDelegatedVotesRaw: "4000000000000000000",
            numberVotes: 0,
            numberOptimisticVotes: 3,
            hasBeenStandardDelegate: false,
            hasBeenOptimisticDelegate: true,
            tokenHoldersRepresentedAmount: 0,
            optimisticTokenHoldersRepresentedAmount: 3,
          },
        ],
      },
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const delegates = await getDelegates(client, {
      chainId: 1,
      stToken: "0x0000000000000000000000000000000000000001",
      limit: 5,
    });

    expect(queryIndex).toHaveBeenCalledWith({
      chainId: 1,
      query: expect.anything(),
      variables: {
        stToken: "0x0000000000000000000000000000000000000001",
        limit: 5,
      },
    });
    expect(delegates).toEqual({
      delegates: [
        {
          address: "0x0000000000000000000000000000000000000002",
          delegatedVotes: {
            raw: 3000000000000000000n,
            formatted: "3",
          },
          optimisticDelegatedVotes: {
            raw: 2000000000000000000n,
            formatted: "2",
          },
          weightedVotes: 30,
          optimisticWeightedVotes: 20,
          numberVotes: 4,
          numberOptimisticVotes: 2,
          hasBeenStandardDelegate: true,
          hasBeenOptimisticDelegate: true,
          tokenHoldersRepresentedAmount: 3,
          optimisticTokenHoldersRepresentedAmount: 1,
        },
        {
          address: "0x0000000000000000000000000000000000000003",
          delegatedVotes: {
            raw: 1000000000000000000n,
            formatted: "1",
          },
          optimisticDelegatedVotes: {
            raw: 0n,
            formatted: "0",
          },
          weightedVotes: 10,
          optimisticWeightedVotes: 0,
          numberVotes: 2,
          numberOptimisticVotes: 0,
          hasBeenStandardDelegate: true,
          hasBeenOptimisticDelegate: false,
          tokenHoldersRepresentedAmount: 2,
          optimisticTokenHoldersRepresentedAmount: 0,
        },
        {
          address: "0x0000000000000000000000000000000000000004",
          delegatedVotes: {
            raw: 0n,
            formatted: "0",
          },
          optimisticDelegatedVotes: {
            raw: 4000000000000000000n,
            formatted: "4",
          },
          weightedVotes: 0,
          optimisticWeightedVotes: 40,
          numberVotes: 0,
          numberOptimisticVotes: 3,
          hasBeenStandardDelegate: false,
          hasBeenOptimisticDelegate: true,
          tokenHoldersRepresentedAmount: 0,
          optimisticTokenHoldersRepresentedAmount: 3,
        },
      ],
      normalDelegates: [
        expect.objectContaining({ address: "0x0000000000000000000000000000000000000002" }),
        expect.objectContaining({ address: "0x0000000000000000000000000000000000000003" }),
      ],
      optimisticDelegates: [
        expect.objectContaining({ address: "0x0000000000000000000000000000000000000002" }),
        expect.objectContaining({ address: "0x0000000000000000000000000000000000000004" }),
      ],
      totalDelegates: 2,
      currentDelegates: 2,
      totalNormalDelegates: 2,
      currentNormalDelegates: 2,
      totalOptimisticDelegates: 2,
      currentOptimisticDelegates: 2,
      voteSupply: {
        raw: 10000000000000000000n,
        formatted: "10",
      },
    });
  });
});
