import { getAddress } from "viem";

import type { DtfClient } from "../../client.js";
import type {
  GetIndexDtfRebalanceParams,
  GetIndexDtfRebalancesParams,
  IndexDtfAuction,
  IndexDtfRebalance,
} from "./types.js";

import { SdkError } from "../../errors.js";
import {
  GetIndexDtfRebalanceDocument,
  GetIndexDtfRebalanceByNonceDocument,
  GetIndexDtfRebalanceAuctionsDocument,
  GetIndexDtfRebalancesDocument,
} from "../subgraph/dtf.generated.js";
import { getIndexDtfIdentity } from "../utils.js";
import { getIndexDtfCurrentRebalance } from "./current.js";
import { mapSubgraphAuction, mapSubgraphRebalance } from "./mappers.js";

export * from "./current.js";
export * from "./open-auction.js";
export * from "./types.js";

/** Reads Index DTF rebalances from the subgraph in newest-first order. */
export async function getRebalances(
  client: DtfClient,
  params: GetIndexDtfRebalancesParams,
): Promise<readonly IndexDtfRebalance[]> {
  const { address, chainId } = getIndexDtfIdentity(params);
  const response = await client.subgraph.queryIndex({
    chainId,
    query: GetIndexDtfRebalancesDocument,
    variables: {
      dtf: address.toLowerCase(),
      limit: params.limit ?? 100,
      offset: params.offset ?? 0,
    },
  });

  return response.rebalances.map(mapSubgraphRebalance);
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
