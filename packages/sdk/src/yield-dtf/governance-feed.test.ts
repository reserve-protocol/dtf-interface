import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import {
  getYieldDtfGovernanceActivity,
  getYieldDtfProposalFeed,
  getYieldDtfTopVoters,
} from "@/yield-dtf/governance-feed";

const EUSD = "0x00000000000000000000000000000000000000e1";
const ETHPLUS = "0x00000000000000000000000000000000000000e2";
const PROPOSER = "0x0000000000000000000000000000000000000002";
const rToken = (id: string, symbol: string) => ({ id, token: { symbol, name: `${symbol} token` } });

const createProposal = (overrides: Record<string, unknown>) => ({
  id: "1",
  description: "Change basket",
  creationTime: "1000",
  state: "ACTIVE",
  forWeightedVotes: "3000",
  againstWeightedVotes: "1000",
  abstainWeightedVotes: "0",
  quorumVotes: "2000",
  forDelegateVotes: "2",
  againstDelegateVotes: "1",
  abstainDelegateVotes: "0",
  startBlock: "900",
  endBlock: "1100",
  executionETA: null,
  proposer: { address: PROPOSER },
  governanceFramework: { name: "Governor Anastasius", contractAddress: "0x0000000000000000000000000000000000000010" },
  governance: { rToken: rToken(EUSD, "eUSD") },
  ...overrides,
});

describe("Yield DTF proposal feed", () => {
  it("merges chains newest first, derives list state per chain, and attaches the rToken", async () => {
    const queryYield = vi.fn(async ({ chainId }: { chainId: number }) => ({
      proposals:
        chainId === 1
          ? [createProposal({ id: "mainnet-open", endBlock: "5000" })]
          : [
              createProposal({
                id: "base-closed",
                creationTime: "1500",
                governance: { rToken: rToken(ETHPLUS, "ETH+") },
              }),
            ],
    }));
    const getBlock = vi.fn(async () => ({ timestamp: 2000n, number: 2000n }));
    const client = {
      subgraph: { queryYield },
      viem: { getPublicClient: () => ({ getBlock }) },
    } as unknown as DtfClient;

    const feed = await getYieldDtfProposalFeed(client, { chainIds: [1, 8453] });

    expect(feed.map((item) => [item.id, item.chainId, item.state, item.rToken.symbol])).toEqual([
      ["base-closed", 8453, "SUCCEEDED", "ETH+"],
      ["mainnet-open", 1, "ACTIVE", "eUSD"],
    ]);
    expect(feed[1]).toMatchObject({ forDelegateVotes: 2, againstDelegateVotes: 1, abstainDelegateVotes: 0 });
    expect(getBlock).toHaveBeenCalledTimes(2);
  });

  it("pages past 1000 proposals by default without touching the chain for settled ones", async () => {
    const queryYield = vi.fn(async ({ variables }: { variables: { limit: number; offset: number } }) => ({
      proposals:
        variables.offset === 0
          ? Array.from({ length: variables.limit }, (_, index) =>
              createProposal({ id: `p-${index}`, state: "EXECUTED" }),
            )
          : [createProposal({ id: "p-tail", state: "EXECUTED" })],
    }));
    const getBlock = vi.fn();
    const client = {
      subgraph: { queryYield },
      viem: { getPublicClient: () => ({ getBlock }) },
    } as unknown as DtfClient;

    const feed = await getYieldDtfProposalFeed(client, { chainIds: [8453] });

    expect(feed).toHaveLength(1001);
    expect(queryYield.mock.calls.map((call) => call[0].variables)).toEqual([
      { limit: 1000, offset: 0 },
      { limit: 1000, offset: 1000 },
    ]);
    expect(getBlock).not.toHaveBeenCalled();
  });
});

describe("Yield DTF top voters", () => {
  it("merges chains by votes cast and caps at the limit", async () => {
    const queryYield = vi.fn(async ({ chainId }: { chainId: number }) => ({
      delegates:
        chainId === 1
          ? [
              {
                address: "0x0000000000000000000000000000000000000001",
                numberVotes: 7,
                delegatedVotesRaw: "1000000000000000000",
                tokenHoldersRepresentedAmount: 4,
                governance: { rToken: rToken(EUSD, "eUSD") },
              },
              {
                address: "0x0000000000000000000000000000000000000003",
                numberVotes: 1,
                delegatedVotesRaw: "0",
                tokenHoldersRepresentedAmount: 0,
                governance: { rToken: rToken(EUSD, "eUSD") },
              },
            ]
          : [
              {
                address: "0x0000000000000000000000000000000000000004",
                numberVotes: 3,
                delegatedVotesRaw: "0",
                tokenHoldersRepresentedAmount: 1,
                governance: { rToken: rToken(ETHPLUS, "ETH+") },
              },
            ],
    }));
    const client = { subgraph: { queryYield } } as unknown as DtfClient;

    const voters = await getYieldDtfTopVoters(client, { limit: 2 });

    expect(voters.map((voter) => [voter.chainId, voter.numberVotes, voter.rToken.symbol])).toEqual([
      [1, 7, "eUSD"],
      [8453, 3, "ETH+"],
    ]);
    expect(voters[0]).toMatchObject({ delegatedVotes: { formatted: "1" }, tokenHoldersRepresented: 4 });
  });
});

describe("Yield DTF governance activity", () => {
  it("merges votes, lifecycle, and stake records newest first", async () => {
    const queryYield = vi.fn(async () => ({
      votes: [
        {
          choice: "FOR",
          weight: "5000000000000000000",
          blockTime: "300",
          txnHash: "0xv1",
          voter: { address: "0x0000000000000000000000000000000000000003" },
          proposal: { id: "p1", governance: { rToken: rToken(EUSD, "eUSD") } },
        },
      ],
      proposals: [
        {
          id: "p1",
          txnHash: "0xc1",
          creationTime: "100",
          proposer: { address: PROPOSER },
          governance: { rToken: rToken(EUSD, "eUSD") },
        },
      ],
      queued: [
        {
          id: "p1",
          queueTime: "200",
          queueTxnHash: "0xq1",
          proposer: { address: PROPOSER },
          governance: { rToken: rToken(EUSD, "eUSD") },
        },
      ],
      executed: [],
      canceled: [
        {
          id: "p0",
          cancellationTime: "40",
          cancellationTxnHash: "0xx0",
          proposer: { address: PROPOSER },
          governance: { rToken: rToken(EUSD, "eUSD") },
        },
      ],
      entries: [
        {
          type: "STAKE",
          hash: "0xs1",
          timestamp: "350",
          amount: "2000000000000000000",
          stAmount: "1500000000000000000",
          from: { id: "0x0000000000000000000000000000000000000008" },
          rToken: rToken(ETHPLUS, "ETH+"),
        },
        {
          type: "UNSTAKE",
          hash: "0xu1",
          timestamp: "50",
          amount: "1",
          stAmount: "1",
          from: { id: "0x0000000000000000000000000000000000000008" },
          rToken: rToken(ETHPLUS, "ETH+"),
        },
      ],
    }));
    const client = { subgraph: { queryYield } } as unknown as DtfClient;

    const activity = await getYieldDtfGovernanceActivity(client, { chainIds: [1], limit: 4 });

    expect(activity.map((event) => [event.type, event.timestamp, event.rToken.symbol])).toEqual([
      ["stake", 350, "ETH+"],
      ["vote", 300, "eUSD"],
      ["proposal-queued", 200, "eUSD"],
      ["proposal-created", 100, "eUSD"],
    ]);
    expect(activity[0]).toMatchObject({ rsrAmount: { formatted: "2" }, stRsrAmount: { formatted: "1.5" } });
    expect(activity[2]).toMatchObject({ proposer: PROPOSER, proposalId: "p1" });
  });
});
