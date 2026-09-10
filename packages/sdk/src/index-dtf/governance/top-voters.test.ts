import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { isDirectoryQuery, TEST_DIRECTORY, TEST_VAULT } from "@/index-dtf/governance/test-directory";
import { getTopVoters } from "@/index-dtf/governance/top-voters";

const underlying = {
  id: "0x00000000000000000000000000000000000000c3",
  symbol: "RSR",
  name: "Reserve Rights",
  decimals: 18,
};
const createDelegate = (
  address: string,
  numberVotes: number,
  vaultUnderlying: typeof underlying | null = underlying,
) => ({
  address,
  numberVotes,
  numberOptimisticVotes: 0,
  delegatedVotesRaw: "5000000",
  tokenHoldersRepresentedAmount: 2,
  token: {
    id: TEST_VAULT,
    token: { symbol: "vlUSDC", name: "Vote-locked USDC", decimals: 6 },
    underlying: vaultUnderlying,
  },
});

describe("Index DTF top voters", () => {
  it("merges chains by votes cast, formats votes in share decimals, and skips vaults without an underlying", async () => {
    const queryIndex = vi.fn(async ({ chainId, query }: { chainId: number; query: unknown; variables: unknown }) => {
      if (isDirectoryQuery(query)) return TEST_DIRECTORY;
      return {
        delegates:
          chainId === 1
            ? [
                createDelegate("0x0000000000000000000000000000000000000001", 5),
                createDelegate("0x0000000000000000000000000000000000000002", 1),
                createDelegate("0x0000000000000000000000000000000000000004", 9, null),
              ]
            : [createDelegate("0x0000000000000000000000000000000000000003", 3)],
      };
    });
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const voters = await getTopVoters(client, { chainIds: [1, 8453], limit: 2 });

    expect(voters.map((voter) => [voter.chainId, voter.numberVotes])).toEqual([
      [1, 5],
      [8453, 3],
    ]);
    expect(voters[0]).toMatchObject({
      address: "0x0000000000000000000000000000000000000001",
      stToken: { symbol: "vlUSDC", decimals: 6 },
      underlying: { symbol: "RSR" },
      delegatedVotes: { formatted: "5" },
      tokenHoldersRepresented: 2,
    });
    expect(voters[0]!.dtfs.map((dtf) => dtf.symbol)).toEqual(["AAA", "BBB"]);
    const voterCalls = queryIndex.mock.calls.filter((call) => !isDirectoryQuery(call[0].query));
    expect(voterCalls.map((call) => [call[0].chainId, call[0].variables])).toEqual([
      [1, { limit: 2 }],
      [8453, { limit: 2 }],
    ]);
  });
});
