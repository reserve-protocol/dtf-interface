import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getIndexDtfAccountBalanceSnapshot, selectPriceAtMark } from "@/index-dtf/dtf/account-pnl";

const ACCOUNT = "0x00000000000000000000000000000000000000A1";
const DTF = "0x00000000000000000000000000000000000000D1";

function createClient(rows: readonly { amount: string; timestamp: string }[]) {
  const queryIndex = vi.fn(async () => ({ accountBalanceDailySnapshots: rows }));
  return { client: { subgraph: { queryIndex } } as unknown as DtfClient, queryIndex };
}

describe("getIndexDtfAccountBalanceSnapshot", () => {
  it("maps the carry-forward snapshot row", async () => {
    const { client, queryIndex } = createClient([{ amount: "2000000000000000000", timestamp: "1700000000" }]);

    const snapshot = await getIndexDtfAccountBalanceSnapshot(client, {
      account: ACCOUNT,
      dtf: DTF,
      chainId: 8453,
      before: 1_700_000_100,
    });

    expect(snapshot).toEqual({
      balance: { raw: 2_000_000_000_000_000_000n, formatted: "2" },
      timestamp: 1_700_000_000,
    });
    expect(queryIndex).toHaveBeenCalledWith(
      expect.objectContaining({
        chainId: 8453,
        variables: { account: ACCOUNT.toLowerCase(), token: DTF.toLowerCase(), before: "1700000100" },
      }),
    );
  });

  it("returns null when the wallet has no history at the mark", async () => {
    const { client } = createClient([]);

    await expect(
      getIndexDtfAccountBalanceSnapshot(client, { account: ACCOUNT, dtf: DTF, chainId: 8453, before: 1 }),
    ).resolves.toBeNull();
  });
});

describe("selectPriceAtMark", () => {
  it("takes the latest real price at or before the mark regardless of input order", () => {
    expect(
      selectPriceAtMark(
        [
          { timestamp: 300, price: 1.3 },
          { timestamp: 100, price: 1.1 },
          { timestamp: 200, price: 1.2 },
          { timestamp: 250, price: 0 },
        ],
        250,
      ),
    ).toBe(1.2);
  });

  it("is null when every point is zero or the window is empty", () => {
    expect(
      selectPriceAtMark(
        [
          { timestamp: 100, price: 0 },
          { timestamp: 200, price: 0 },
        ],
        200,
      ),
    ).toBeNull();
    expect(selectPriceAtMark([], 200)).toBeNull();
  });

  it("keeps the one-argument call compatible by selecting the latest real price", () => {
    expect(
      selectPriceAtMark([
        { timestamp: 100, price: 1.1 },
        { timestamp: 300, price: 1.3 },
        { timestamp: 200, price: 1.2 },
      ]),
    ).toBe(1.3);
  });
});
