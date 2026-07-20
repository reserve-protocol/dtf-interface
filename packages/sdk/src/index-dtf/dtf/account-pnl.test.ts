import type { DtfClient } from "@/client";

import { describe, expect, it, vi } from "vitest";

import {
  calculateAccountBalancePnl,
  getIndexDtfAccountBalanceSnapshot,
  selectPriceAtMark,
} from "@/index-dtf/dtf/account-pnl";

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

    expect(snapshot).toEqual({ balance: { raw: 2_000_000_000_000_000_000n, formatted: "2" }, timestamp: 1_700_000_000 });
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
  it("takes the last point with a real price", () => {
    expect(selectPriceAtMark([{ price: 1.1 }, { price: 1.2 }, { price: 0 }])).toBe(1.2);
  });

  it("is null when every point is zero or the window is empty", () => {
    expect(selectPriceAtMark([{ price: 0 }, { price: 0 }])).toBeNull();
    expect(selectPriceAtMark([])).toBeNull();
  });
});

describe("calculateAccountBalancePnl", () => {
  it("is the value diff against the position's worth at the mark", () => {
    expect(calculateAccountBalancePnl({ snapshotBalance: 2, priceAtMark: 10, currentValue: 25 })).toBe(5);
  });

  it("hides when the wallet was not holding at the mark", () => {
    expect(calculateAccountBalancePnl({ snapshotBalance: null, priceAtMark: 10, currentValue: 25 })).toBeNull();
    expect(calculateAccountBalancePnl({ snapshotBalance: 0, priceAtMark: 10, currentValue: 25 })).toBeNull();
  });

  it("hides when an input is unavailable — never fabricates from a 0 price", () => {
    expect(calculateAccountBalancePnl({ snapshotBalance: 2, priceAtMark: 0, currentValue: 25 })).toBeNull();
    expect(calculateAccountBalancePnl({ snapshotBalance: 2, priceAtMark: null, currentValue: 25 })).toBeNull();
    expect(calculateAccountBalancePnl({ snapshotBalance: 2, priceAtMark: 10, currentValue: undefined })).toBeNull();
  });
});
