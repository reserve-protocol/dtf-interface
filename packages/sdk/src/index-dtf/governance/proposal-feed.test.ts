import { afterEach, describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getProposalFeed } from "@/index-dtf/governance/proposal-feed";
import { GetAllIndexDtfProposalsDocument } from "@/index-dtf/subgraph/dtf.generated";
import { SUBGRAPH_MAX_ROWS } from "@/lib/subgraph-pages";

const MAX_UINT256 = (1n << 256n) - 1n;

const NOW = 2_000_000;
const OWNER_GOVERNANCE = "0x0000000000000000000000000000000000000010";
const DAO_GOVERNANCE = "0x0000000000000000000000000000000000000020";

const vault = {
  id: "0x0000000000000000000000000000000000000007",
  token: { decimals: 6 },
  dtfs: [
    {
      id: "0x00000000000000000000000000000000000000a1",
      token: { symbol: "AAA", name: "Triple A" },
      ownerGovernance: { id: OWNER_GOVERNANCE },
      tradingGovernance: null,
      legacyAdmins: [],
      legacyAuctionApprovers: [],
    },
    {
      id: "0x00000000000000000000000000000000000000b2",
      token: { symbol: "BBB", name: "Triple B" },
      ownerGovernance: null,
      tradingGovernance: null,
      legacyAdmins: [],
      legacyAuctionApprovers: [],
    },
  ],
};

const createProposal = (overrides: Record<string, unknown>) => ({
  id: "1",
  description: "Rebalance",
  creationTime: "1000",
  state: "ACTIVE",
  isOptimistic: false,
  vetoThreshold: null,
  vetoThresholdVotes: null,
  optimisticSnapshot: null,
  optimisticSnapshotSupply: null,
  forWeightedVotes: "3000",
  abstainWeightedVotes: "0",
  againstWeightedVotes: "1000",
  forDelegateVotes: "3",
  againstDelegateVotes: "1",
  abstainDelegateVotes: "0",
  executionETA: null,
  executionTime: null,
  quorumVotes: "2000",
  voteStart: "900",
  voteEnd: String(NOW - 10),
  executionBlock: null,
  creationBlock: "10",
  proposer: { address: "0x0000000000000000000000000000000000000002" },
  governance: { id: OWNER_GOVERNANCE, token: vault, timelock: { id: "0x0000000000000000000000000000000000000006" } },
  ...overrides,
});

describe("Index DTF proposal feed", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("merges chains newest first with derived state, delegate counts, and governed DTFs", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW * 1000));

    const queryIndex = vi.fn(async ({ chainId }: { chainId: number }) => {
      if (chainId === 1) {
        return { proposals: [createProposal({ id: "mainnet-succeeded" })] };
      }

      return {
        proposals: [
          createProposal({
            id: "base-active",
            creationTime: "1500",
            voteEnd: String(NOW + 100),
            governance: {
              id: DAO_GOVERNANCE,
              token: vault,
              timelock: { id: "0x0000000000000000000000000000000000000006" },
            },
          }),
        ],
      };
    });
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const feed = await getProposalFeed(client, { chainIds: [1, 8453] });

    expect(feed.map((item) => [item.id, item.chainId, item.state])).toEqual([
      ["base-active", 8453, "ACTIVE"],
      ["mainnet-succeeded", 1, "SUCCEEDED"],
    ]);
    expect(feed[0]!.dtfs.map((dtf) => dtf.symbol)).toEqual(["AAA", "BBB"]);
    expect(feed[1]!.dtfs.map((dtf) => dtf.symbol)).toEqual(["AAA"]);
    expect(feed[1]).toMatchObject({ forDelegateVotes: 3, againstDelegateVotes: 1, abstainDelegateVotes: 0 });
    // Vote amounts are denominated in the vault share token (6 decimals here), not a fixed 18.
    expect(feed[1]!.forWeightedVotes.formatted).toBe("0.003");
    expect(feed[1]!.quorumVotes.formatted).toBe("0.002");
    expect(feed[1]!.votingState.quorum).toBe(true);
    expect(queryIndex).toHaveBeenCalledTimes(2);
    expect(queryIndex.mock.calls[0]![0]).toMatchObject({
      chainId: 1,
      query: GetAllIndexDtfProposalsDocument,
      variables: { limit: 1000, offset: 0 },
    });
  });

  it("pages past 1000 proposals by default", async () => {
    const queryIndex = vi.fn(async ({ variables }: { variables: { limit: number; offset: number } }) => ({
      proposals:
        variables.offset === 0
          ? Array.from({ length: variables.limit }, (_, index) => createProposal({ id: `p-${index}` }))
          : [createProposal({ id: "p-tail" })],
    }));
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const feed = await getProposalFeed(client, { chainIds: [56] });

    expect(feed).toHaveLength(1001);
    expect(queryIndex).toHaveBeenCalledTimes(2);
    expect(queryIndex.mock.calls[0]![0]).toMatchObject({ variables: { limit: 1000, offset: 0 } });
    expect(queryIndex.mock.calls[1]![0]).toMatchObject({ variables: { limit: 1000, offset: 1000 } });
  });

  it("rejects a window past the ceiling before querying", async () => {
    const queryIndex = vi.fn();
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    await expect(getProposalFeed(client, { chainIds: [1], limit: SUBGRAPH_MAX_ROWS + 1 })).rejects.toMatchObject({
      code: "INVALID_INPUT",
    });
    expect(queryIndex).not.toHaveBeenCalled();
  });

  it("derives optimistic veto state and links a challenge to its optimistic proposal", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW * 1000));

    const optimistic = createProposal({
      id: "optimistic",
      description: "Rebalance quietly",
      creationBlock: "10",
      creationTime: "1000",
      voteEnd: String(NOW + 100),
      isOptimistic: true,
      vetoThreshold: "100000000000000000",
      vetoThresholdVotes: "1000",
      optimisticSnapshot: "9",
      optimisticSnapshotSupply: "10000",
      forWeightedVotes: "0",
      againstWeightedVotes: "1500",
    });
    const challenge = createProposal({
      id: "challenge",
      description: "Confirmation For: Rebalance quietly",
      creationBlock: "11",
      creationTime: "1100",
      voteEnd: String(NOW + 100),
    });
    const queryIndex = vi.fn(async () => ({ proposals: [challenge, optimistic] }));
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const feed = await getProposalFeed(client, { chainIds: [8453] });
    const optimisticRow = feed.find((row) => row.id === "optimistic")!;
    const challengeRow = feed.find((row) => row.id === "challenge")!;

    expect(optimisticRow.state).toBe("DEFEATED");
    expect(optimisticRow.votingState.vetoReached).toBe(true);
    expect(optimisticRow.optimistic?.vetoThresholdVotes.formatted).toBe("0.001");
    expect(optimisticRow.vetoThreshold).not.toBe(MAX_UINT256);
    expect(challengeRow).toMatchObject({ wasChallenged: true, challengedProposalId: "optimistic", state: "ACTIVE" });
  });

  it("caps each chain at an explicit limit", async () => {
    const queryIndex = vi.fn(async ({ variables }: { variables: { limit: number } }) => ({
      proposals: Array.from({ length: variables.limit }, (_, index) => createProposal({ id: `p-${index}` })),
    }));
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const feed = await getProposalFeed(client, { chainIds: [56], limit: 3 });

    expect(feed).toHaveLength(3);
    expect(queryIndex).toHaveBeenCalledTimes(1);
    expect(queryIndex.mock.calls[0]![0]).toMatchObject({ variables: { limit: 3, offset: 0 } });
  });
});
