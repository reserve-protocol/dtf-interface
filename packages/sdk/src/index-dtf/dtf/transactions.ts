import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { Amount } from "@/types/common";
import type { IndexDtfInput } from "@/types/index-dtf";

import { GetIndexDtfTransactionsDocument } from "@/index-dtf/subgraph/dtf.generated";
import { mapAmount } from "@/lib/utils";

export type IndexDtfTransactionType = "mint" | "redeem" | "transfer";

export type GetIndexDtfTransactionsParams = IndexDtfInput & {
  readonly limit?: number;
  readonly offset?: number;
  readonly dtfPriceUsd?: number;
};

export type IndexDtfTransaction = {
  readonly id: string;
  readonly hash: string;
  readonly amount: Amount;
  readonly amountUsd?: number;
  readonly timestamp: number;
  readonly chainId: GetIndexDtfTransactionsParams["chainId"];
  readonly to?: Address;
  readonly from?: Address;
  readonly type: IndexDtfTransactionType;
};

/**
 * Reads Index DTF mint and redeem transfers from the Index DTF subgraph.
 * Pass `dtfPriceUsd` when you want the same current-price USD estimate Register shows.
 */
export async function getIndexDtfTransactions(
  client: DtfClient,
  params: GetIndexDtfTransactionsParams,
): Promise<readonly IndexDtfTransaction[]> {
  const address = getAddress("id" in params ? params.id : params.address);
  const response = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfTransactionsDocument,
    variables: {
      dtf: address.toLowerCase(),
      limit: params.limit ?? 50,
      offset: params.offset ?? 0,
    },
  });

  return response.transferEvents.map((event) => {
    const amount = mapAmount(event.amount, 18);

    return {
      id: event.id,
      hash: event.hash,
      amount,
      ...(params.dtfPriceUsd === undefined ? {} : { amountUsd: Number(amount.formatted) * params.dtfPriceUsd }),
      timestamp: Number(event.timestamp),
      chainId: params.chainId,
      ...(event.to?.id ? { to: getAddress(event.to.id) } : {}),
      ...(event.from?.id ? { from: getAddress(event.from.id) } : {}),
      type: mapTransactionType(event.type),
    };
  });
}

function mapTransactionType(type: string): IndexDtfTransactionType {
  if (type === "MINT") return "mint";
  if (type === "REDEEM") return "redeem";

  return "transfer";
}
