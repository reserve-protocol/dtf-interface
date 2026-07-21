import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { Amount } from "@/types/common";

import { mapAmount } from "@/lib/utils";

export type GetIndexDtfAccountBalanceSnapshotParams = {
  readonly account: Address;
  readonly dtf: Address;
  readonly chainId: SupportedChainId;
  /** Unix seconds — the snapshot at or before this mark. */
  readonly before: number;
};

export type IndexDtfAccountBalanceSnapshot = {
  readonly balance: Amount;
  readonly timestamp: number;
};

// Daily snapshots only exist for days with balance activity, so the latest row
// at/before the mark is the carry-forward balance the wallet held then. No row
// = the wallet's history is younger than the mark (or it never held).
const SNAPSHOT_QUERY = `
  query IndexDtfAccountBalanceSnapshot($account: String!, $token: String!, $before: BigInt!) {
    accountBalanceDailySnapshots(
      where: { account: $account, token: $token, timestamp_lte: $before }
      orderBy: timestamp
      orderDirection: desc
      first: 1
    ) {
      amount
      timestamp
    }
  }
`;

type SnapshotResponse = {
  readonly accountBalanceDailySnapshots: readonly { readonly amount: string; readonly timestamp: string }[];
};

export async function getIndexDtfAccountBalanceSnapshot(
  client: DtfClient,
  params: GetIndexDtfAccountBalanceSnapshotParams,
): Promise<IndexDtfAccountBalanceSnapshot | null> {
  const data = await client.subgraph.queryIndex<SnapshotResponse, { account: string; token: string; before: string }>({
    chainId: params.chainId,
    query: SNAPSHOT_QUERY,
    variables: {
      account: getAddress(params.account).toLowerCase(),
      token: getAddress(params.dtf).toLowerCase(),
      before: String(params.before),
    },
  });
  const snapshot = data.accountBalanceDailySnapshots[0];
  if (!snapshot) {
    return null;
  }

  return {
    balance: mapAmount(snapshot.amount, 18),
    timestamp: Number(snapshot.timestamp),
  };
}

/** Last point at/before the mark with a real price — windows can carry leading zero-price rows. */
export function selectPriceAtMark(points: readonly { readonly price: number }[]): number | null {
  for (let i = points.length - 1; i >= 0; i--) {
    const price = points[i]!.price;
    if (price > 0) {
      return price;
    }
  }

  return null;
}
