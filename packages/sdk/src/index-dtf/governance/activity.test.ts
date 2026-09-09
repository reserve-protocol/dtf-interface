import { getAddress } from "viem";
import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getGovernanceActivity } from "@/index-dtf/governance/activity";

const GOVERNANCE = "0x0000000000000000000000000000000000000010";
const TIMELOCK = "0x00000000000000000000000000000000000000ab";
const PROPOSER = "0x0000000000000000000000000000000000000002";
const vault = {
  id: "0x0000000000000000000000000000000000000007",
  token: { symbol: "vlRSR", name: "Vote-locked RSR", decimals: 18 },
  underlying: { id: "0x00000000000000000000000000000000000000c3", symbol: "USDC", name: "USD Coin", decimals: 6 },
  dtfs: [
    {
      id: "0x00000000000000000000000000000000000000a1",
      token: { symbol: "AAA", name: "Triple A" },
      ownerGovernance: { id: GOVERNANCE },
      tradingGovernance: null,
      legacyAdmins: [],
      legacyAuctionApprovers: [],
    },
  ],
};
const governance = { id: GOVERNANCE, token: vault, timelock: { id: TIMELOCK } };

describe("Index DTF governance activity", () => {
  it("merges votes, proposal lifecycle, and stake records newest first", async () => {
    const queryIndexAll = vi.fn(async (_options: { chainIds?: readonly number[] }) => ({
      8453: {
        votes: [
          {
            choice: "AGAINST",
            weight: "2000000000000000000",
            blockTime: "300",
            txnHash: "0xv1",
            voter: { address: "0x0000000000000000000000000000000000000003" },
            proposal: { id: "p1", governance },
          },
        ],
        proposals: [
          { id: "p1", txnHash: "0xc1", creationTime: "100", proposer: { address: PROPOSER }, governance },
          { id: "p2", txnHash: "0xc2", creationTime: "150", proposer: { address: PROPOSER }, governance },
        ],
        queued: [
          {
            id: "p1",
            queueTime: "200",
            queueTxnHash: "0xq1",
            queueAccount: { id: "0x0000000000000000000000000000000000000005" },
            governance,
          },
        ],
        // An old proposal executed recently still surfaces because executions are ordered by their own time.
        executed: [
          {
            id: "p0",
            executionTime: "400",
            executionTxnHash: "0xe1",
            executionAccount: { id: "0x0000000000000000000000000000000000000006" },
            governance,
          },
        ],
        canceled: [
          { id: "p2", cancellationTime: "250", cancellationTxnHash: "0xx2", cancellationAccount: null, governance },
        ],
        stakingPositionRecords: [
          {
            type: "DEPOSIT",
            assets: "1500000",
            timestamp: "350",
            hash: "0xd1",
            account: { id: "0x0000000000000000000000000000000000000008" },
            token: vault,
          },
          {
            type: "WITHDRAW",
            assets: "500000",
            timestamp: "50",
            hash: "0xw1",
            account: { id: "0x0000000000000000000000000000000000000008" },
            token: vault,
          },
        ],
      },
    }));
    const client = { subgraph: { queryIndexAll } } as unknown as DtfClient;

    const activity = await getGovernanceActivity(client, { chainIds: [8453], limit: 7 });

    expect(activity.map((event) => [event.chainId, event.type, event.timestamp])).toEqual([
      [8453, "proposal-executed", 400],
      [8453, "stake", 350],
      [8453, "vote", 300],
      [8453, "proposal-canceled", 250],
      [8453, "proposal-queued", 200],
      [8453, "proposal-created", 150],
      [8453, "proposal-created", 100],
    ]);
    expect(activity[0]).toMatchObject({ account: "0x0000000000000000000000000000000000000006", proposalId: "p0" });
    expect(activity[1]).toMatchObject({
      stToken: { address: "0x0000000000000000000000000000000000000007", symbol: "vlRSR" },
      underlying: { symbol: "USDC" },
      amount: { formatted: "1.5" },
    });
    expect(activity[2]).toMatchObject({ choice: "AGAINST", weight: { formatted: "2" }, governance: GOVERNANCE });
    // Guardian cancels leave no canceller in the subgraph; the row is attributed to the timelock, not the proposer.
    expect(activity[3]).toMatchObject({ account: getAddress(TIMELOCK) });
    expect(activity.every((event) => event.dtfs[0]?.symbol === "AAA")).toBe(true);
    expect(queryIndexAll.mock.calls[0]![0]).toMatchObject({ chainIds: [8453], variables: { limit: 7 } });
  });
});
