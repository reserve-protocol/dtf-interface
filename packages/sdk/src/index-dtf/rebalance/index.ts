import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type {
  GetIndexDtfCompletedRebalanceParams,
  GetIndexDtfCompletedRebalancesParams,
  GetIndexDtfRebalanceParams,
  GetIndexDtfRebalancesParams,
  IndexDtfAuction,
  IndexDtfCompletedRebalance,
  IndexDtfCompletedRebalanceDetail,
  IndexDtfRebalance,
} from "@/index-dtf/rebalance/types";

import { getIndexDtfCurrentRebalance } from "@/index-dtf/rebalance/current";
import {
  mapApiCompletedRebalance,
  mapApiCompletedRebalanceDetail,
  mapSubgraphAuction,
  mapSubgraphRebalance,
} from "@/index-dtf/rebalance/mappers";
import {
  GetIndexDtfRebalanceDocument,
  GetIndexDtfRebalanceByNonceDocument,
  GetIndexDtfRebalanceAuctionsDocument,
  GetIndexDtfRebalancesDocument,
} from "@/index-dtf/subgraph/dtf.generated";
import { SdkError } from "@/lib/errors";

export * from "@/index-dtf/rebalance/current";
export * from "@/index-dtf/rebalance/execution";
export * from "@/index-dtf/rebalance/liquidity";
export * from "@/index-dtf/rebalance/open-auction";
export * from "@/index-dtf/rebalance/types";

/** Reads Index DTF rebalances from the subgraph in newest-first order. */
export async function getRebalances(
  client: DtfClient,
  params: GetIndexDtfRebalancesParams,
): Promise<readonly IndexDtfRebalance[]> {
  const address = getAddress("id" in params ? params.id : params.address);
  const response = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfRebalancesDocument,
    variables: {
      dtf: address.toLowerCase(),
      limit: params.limit ?? 100,
      offset: params.offset ?? 0,
    },
  });

  return response.rebalances.map(mapSubgraphRebalance);
}

/** Reads completed Index DTF rebalance metrics from Reserve API. */
export async function getCompletedRebalances(
  client: DtfClient,
  params: GetIndexDtfCompletedRebalancesParams,
): Promise<readonly IndexDtfCompletedRebalance[]> {
  const address = getAddress("id" in params ? params.id : params.address);
  const rebalances = await client.api.getIndexDtfRebalanceHistory({
    address,
    chainId: params.chainId,
    ...(params.skip === undefined ? {} : { skip: params.skip }),
    ...(params.limit === undefined ? {} : { limit: params.limit }),
  });

  return rebalances.map(mapApiCompletedRebalance);
}

/** Reads completed Index DTF rebalance detail and auction metrics from Reserve API. */
export async function getCompletedRebalance(
  client: DtfClient,
  params: GetIndexDtfCompletedRebalanceParams,
): Promise<IndexDtfCompletedRebalanceDetail> {
  const rebalance = await client.api.getIndexDtfRebalanceDetail({
    address: getAddress(params.address),
    chainId: params.chainId,
    nonce: params.nonce,
  });

  return mapApiCompletedRebalanceDetail(rebalance);
}

/** Reads one Index DTF rebalance by id or by DTF address + nonce. */
export async function getRebalance(client: DtfClient, params: GetIndexDtfRebalanceParams): Promise<IndexDtfRebalance> {
  const rebalance = params.id
    ? await getRebalanceById(client, params.chainId, params.id)
    : await getRebalanceByNonce(client, params);

  if (!rebalance) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Index DTF rebalance not found on chain ${params.chainId}`,
      meta: { id: params.id, nonce: params.nonce, address: params.address },
    });
  }

  return rebalance;
}

async function getRebalanceById(client: DtfClient, chainId: GetIndexDtfRebalanceParams["chainId"], id: string) {
  const response = await client.subgraph.queryIndex({
    chainId,
    query: GetIndexDtfRebalanceDocument,
    variables: { id },
  });

  return response.rebalance ? mapSubgraphRebalance(response.rebalance) : undefined;
}

async function getRebalanceByNonce(client: DtfClient, params: GetIndexDtfRebalanceParams) {
  if (!params.address || params.nonce === undefined) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "address and nonce are required when id is not provided",
    });
  }

  const response = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfRebalanceByNonceDocument,
    variables: {
      dtf: getAddress(params.address).toLowerCase(),
      nonce: String(params.nonce),
    },
  });

  return response.rebalances[0] ? mapSubgraphRebalance(response.rebalances[0]) : undefined;
}

/** Reads all auctions and bids indexed for one rebalance id. */
export async function getRebalanceAuctions(
  client: DtfClient,
  params: { readonly chainId: GetIndexDtfRebalanceParams["chainId"]; readonly rebalanceId: string },
): Promise<readonly IndexDtfAuction[]> {
  const response = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfRebalanceAuctionsDocument,
    variables: { rebalanceId: params.rebalanceId },
  });

  return response.auctions.map(mapSubgraphAuction);
}

export { getIndexDtfCurrentRebalance };
