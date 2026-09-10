import { getAddress } from "viem";
import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { isDirectoryQuery, TEST_DIRECTORY, TEST_VAULT } from "@/index-dtf/governance/test-directory";
import {
  GetIndexDtfOpenUnstakeLocksDocument,
  GetIndexDtfStakingPositionsDocument,
  GetIndexDtfVoteLockVaultsDocument,
} from "@/index-dtf/subgraph/dtf.generated";
import { getVoteLockLifetimeTotals, getVoteLockTotals } from "@/index-dtf/vote-lock/totals";

const USDC_VAULT = TEST_VAULT;
const LEGACY_VAULT = "0x0000000000000000000000000000000000000009";
const usdc = { id: "0x00000000000000000000000000000000000000c3", symbol: "USDC", name: "USD Coin", decimals: 6 };
const shareToken = { symbol: "vlUSDC", name: "Vote-locked USDC", decimals: 18 };

describe("Index DTF vote-lock totals", () => {
  it("reports staked and pending-unstake per vault in underlying decimals and skips untracked vaults", async () => {
    const queryIndex = vi.fn(async ({ query, variables }: { query: unknown; variables: { cursor: string } }) => {
      if (isDirectoryQuery(query)) return TEST_DIRECTORY;
      if (query === GetIndexDtfVoteLockVaultsDocument) {
        return {
          stakingTokens: [
            {
              id: USDC_VAULT,
              totalAssets: "10000000",
              token: { ...shareToken, totalSupply: "9000000000000000000" },
              underlying: usdc,
            },
            {
              id: LEGACY_VAULT,
              totalAssets: "0",
              token: { symbol: "OLD", name: "Legacy", decimals: 18, totalSupply: "1" },
              underlying: null,
            },
          ],
        };
      }

      if (query === GetIndexDtfOpenUnstakeLocksDocument) {
        expect(variables.cursor).toBe("");

        return {
          locks: [
            { id: "l1", amount: "1000000", token: { id: USDC_VAULT } },
            { id: "l2", amount: "2000000", token: { id: getAddress(USDC_VAULT) } },
            { id: "l3", amount: "7", token: { id: LEGACY_VAULT } },
          ],
        };
      }

      throw new Error("unexpected query");
    });
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const totals = await getVoteLockTotals(client, { chainIds: [1] });

    expect(totals).toHaveLength(1);
    expect(totals[0]).toMatchObject({
      chainId: 1,
      stToken: { address: getAddress(USDC_VAULT), symbol: "vlUSDC", decimals: 18 },
      underlying: { symbol: "USDC", decimals: 6 },
      staked: { formatted: "10" },
      shareSupply: { formatted: "9" },
      pendingUnstake: { formatted: "3" },
      pendingUnstakeCount: 2,
    });
    expect(totals[0]!.dtfs.map((dtf) => dtf.symbol)).toEqual(["AAA", "BBB"]);
  });

  it("sums lifetime deposits and withdrawals across positions per vault", async () => {
    const queryIndex = vi.fn(async ({ query }: { query: unknown }) => {
      if (query !== GetIndexDtfStakingPositionsDocument) {
        throw new Error("unexpected query");
      }

      return {
        stakingPositions: [
          {
            id: "s1",
            totalDeposited: "10000000",
            totalWithdrawn: "3000000",
            token: { id: USDC_VAULT, token: shareToken, underlying: usdc },
          },
          {
            id: "s2",
            totalDeposited: "5000000",
            totalWithdrawn: "0",
            token: { id: USDC_VAULT, token: shareToken, underlying: usdc },
          },
          {
            id: "s3",
            totalDeposited: "99",
            totalWithdrawn: "0",
            token: { id: LEGACY_VAULT, token: shareToken, underlying: null },
          },
        ],
      };
    });
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const totals = await getVoteLockLifetimeTotals(client, { chainIds: [56] });

    expect(totals).toEqual([
      {
        chainId: 56,
        stToken: { address: getAddress(USDC_VAULT), ...shareToken },
        underlying: { address: getAddress(usdc.id), symbol: "USDC", name: "USD Coin", decimals: 6 },
        lifetimeDeposited: { raw: 15000000n, formatted: "15" },
        lifetimeWithdrawn: { raw: 3000000n, formatted: "3" },
        positionCount: 2,
      },
    ]);
  });
});
