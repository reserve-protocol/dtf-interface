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

/** Latest real price at or before the requested unix-second mark. */
export function selectPriceAtMark(
  points: readonly { readonly price: number; readonly timestamp: number }[],
  mark = Number.POSITIVE_INFINITY,
): number | null {
  let selected: { readonly price: number; readonly timestamp: number } | undefined;

  for (const point of points) {
    if (point.timestamp <= mark && point.price > 0 && (!selected || point.timestamp > selected.timestamp)) {
      selected = point;
    }
  }

  return selected?.price ?? null;
}
