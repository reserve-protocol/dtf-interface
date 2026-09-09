import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

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
    id: "0x0000000000000000000000000000000000000007",
    token: { symbol: "vlUSDC", name: "Vote-locked USDC", decimals: 6 },
    underlying: vaultUnderlying,
    dtfs: [
      {
        id: "0x00000000000000000000000000000000000000a1",
        token: { symbol: "AAA", name: "Triple A" },
        ownerGovernance: null,
        tradingGovernance: null,
        legacyAdmins: [],
        legacyAuctionApprovers: [],
      },
    ],
  },
});

describe("Index DTF top voters", () => {
  it("merges chains by votes cast, formats votes in share decimals, and skips vaults without an underlying", async () => {
    const queryIndexAll = vi.fn(async ({ chainIds }: { chainIds: readonly number[] }) =>
      Object.fromEntries(
        chainIds.map((chainId) => [
          chainId,
          {
            delegates:
              chainId === 1
                ? [
                    createDelegate("0x0000000000000000000000000000000000000001", 5),
                    createDelegate("0x0000000000000000000000000000000000000002", 1),
                    createDelegate("0x0000000000000000000000000000000000000004", 9, null),
                  ]
                : [createDelegate("0x0000000000000000000000000000000000000003", 3)],
          },
        ]),
      ),
    );
    const client = { subgraph: { queryIndexAll } } as unknown as DtfClient;

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
    expect(voters[0]!.dtfs.map((dtf) => dtf.symbol)).toEqual(["AAA"]);
    expect(queryIndexAll.mock.calls[0]![0]).toMatchObject({ chainIds: [1, 8453], variables: { limit: 2 } });
  });
});
