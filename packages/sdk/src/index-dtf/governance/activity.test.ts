import { getAddress } from "viem";
import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getGovernanceActivity } from "@/index-dtf/governance/activity";
import {
  isDirectoryQuery,
  TEST_DIRECTORY,
  TEST_OWNER_GOVERNANCE,
  TEST_VAULT,
} from "@/index-dtf/governance/test-directory";

const GOVERNANCE = TEST_OWNER_GOVERNANCE;
const TIMELOCK = "0x00000000000000000000000000000000000000ab";
const PROPOSER = "0x0000000000000000000000000000000000000002";
const OWNER = "0x0000000000000000000000000000000000000008";
const RECEIVER = "0x0000000000000000000000000000000000000009";
const vault = {
  id: TEST_VAULT,
  token: { symbol: "vlRSR", name: "Vote-locked RSR", decimals: 18 },
  underlying: { id: "0x00000000000000000000000000000000000000c3", symbol: "USDC", name: "USD Coin", decimals: 6 },
};
const governance = { id: GOVERNANCE, token: vault, timelock: { id: TIMELOCK } };

describe("Index DTF governance activity", () => {
  it("merges votes, per-transition lifecycle rows, and stake records newest first", async () => {
    const queryIndex = vi.fn(async ({ query }: { query: unknown }) => {
      if (isDirectoryQuery(query)) return TEST_DIRECTORY;
      return {
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
            shares: "1500000000000000000",
            timestamp: "350",
            hash: "0xd1",
            account: { id: OWNER },
            token: vault,
          },
          // Withdrawal to another receiver: the owner burned shares, the receiver only got a bookkeeping row.
          {
            type: "WITHDRAW",
            assets: "500000",
            shares: "500000000000000000",
            timestamp: "50",
            hash: "0xw1",
            account: { id: OWNER },
            token: vault,
          },
          {
            type: "WITHDRAW",
            assets: "500000",
            shares: "0",
            timestamp: "50",
            hash: "0xw1",
            account: { id: RECEIVER },
            token: vault,
          },
        ],
      };
    });
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const activity = await getGovernanceActivity(client, { chainIds: [8453], limit: 10 });

    expect(activity.map((event) => [event.type, event.timestamp])).toEqual([
      ["proposal-executed", 400],
      ["stake", 350],
      ["vote", 300],
      ["proposal-canceled", 250],
      ["proposal-queued", 200],
      ["proposal-created", 150],
      ["proposal-created", 100],
      ["unstake", 50],
    ]);
    expect(activity[0]).toMatchObject({ account: "0x0000000000000000000000000000000000000006", proposalId: "p0" });
    expect(activity[1]).toMatchObject({
      stToken: { address: TEST_VAULT, symbol: "vlRSR" },
      underlying: { symbol: "USDC" },
      amount: { formatted: "1.5" },
    });
    expect(activity[2]).toMatchObject({ choice: "AGAINST", weight: { formatted: "2" }, governance: GOVERNANCE });
    // Guardian cancels leave no canceller in the subgraph; the row is attributed to the timelock, not the proposer.
    expect(activity[3]).toMatchObject({ account: getAddress(TIMELOCK) });
    expect(activity[7]).toMatchObject({ type: "unstake", account: OWNER, amount: { formatted: "0.5" } });
    // Proposal rows resolve through the owner governance; vault rows list every DTF on the vault.
    expect(activity[0]!.dtfs.map((dtf) => dtf.symbol)).toEqual(["AAA"]);
    expect(activity[1]!.dtfs.map((dtf) => dtf.symbol)).toEqual(["AAA", "BBB"]);
  });
});
