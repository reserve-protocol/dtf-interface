import type { Address } from "viem";
import { getAddress } from "viem";
import type { DtfClient } from "../client.js";
import { GetIndexDtfDocument } from "../graphql/index-dtf/dtf.generated.js";
import { dedupeAddresses } from "../lib/utils.js";
import { queryIndexSubgraph } from "../transports/subgraph.js";
import type {
  GetAllIndexDTFProposalsParams,
  GetFullIndexDTFParams,
  GetIndexDTFParams,
  GetIndexDTFPriceHistoryParams,
  GetIndexDTFPriceParams,
  GetIndexDTFProposalParams,
  GetIndexDTFProposalsParams,
  GetIndexDTFRebalanceParams,
  GetIndexDTFRebalancesParams,
  IndexDTF,
  IndexDTFFull,
  IndexDTFPrice,
  IndexDTFPricePoint,
  IndexDTFProposalDetail,
  IndexDTFProposalSummary,
  ListIndexDTFsParams,
} from "../types/index-dtf.js";
import { mapIndexDTF } from "./mappers.js";

export type * from "../types/index-dtf.js";

export function getIndexDTFProposalGovernanceAddresses(
  dtf: IndexDTF,
): readonly Address[] {
  return dedupeAddresses([
    ...dtf.governance.all.flatMap((authority) =>
      authority.type === "governance" ? [authority.address] : [],
    ),
    ...(dtf.governance.voteLock?.type === "governance"
      ? [dtf.governance.voteLock.address]
      : []),
    ...dtf.roles.admin.legacy,
    ...dtf.roles.rebalance.legacyAuctionApprovers,
    ...(dtf.voteLockVault?.legacyGovernance ?? []),
  ]);
}

export async function getIndexDTF(
  params: GetIndexDTFParams,
  client?: DtfClient,
): Promise<IndexDTF> {
  const { dtf } = await queryIndexSubgraph({
    chainId: params.chainId,
    query: GetIndexDtfDocument,
    variables: {
      id: getAddress(params.address).toLowerCase(),
    },
    client,
  });

  if (!dtf) {
    throw new Error(
      `Index DTF not found: ${getAddress(params.address)} on chain ${params.chainId}`,
    );
  }

  return mapIndexDTF(dtf, params.chainId);
}

export async function listIndexDTFs(
  _params: ListIndexDTFsParams = {},
): Promise<readonly IndexDTF[]> {
  throw new Error("listIndexDTFs is not implemented yet.");
}

export async function getFullIndexDTF(
  _params: GetFullIndexDTFParams,
): Promise<IndexDTFFull> {
  throw new Error("getFullIndexDTF is not implemented yet.");
}

export async function getIndexDTFPrice(
  _params: GetIndexDTFPriceParams,
): Promise<IndexDTFPrice> {
  throw new Error("getIndexDTFPrice is not implemented yet.");
}

export async function getIndexDTFPriceHistory(
  _params: GetIndexDTFPriceHistoryParams,
): Promise<readonly IndexDTFPricePoint[]> {
  throw new Error("getIndexDTFPriceHistory is not implemented yet.");
}

export async function getProposals(
  _params: GetIndexDTFProposalsParams,
): Promise<readonly IndexDTFProposalSummary[]> {
  throw new Error("getProposals is not implemented yet.");
}

export async function getAllProposals(
  _params: GetAllIndexDTFProposalsParams,
): Promise<readonly IndexDTFProposalSummary[]> {
  throw new Error("getAllProposals is not implemented yet.");
}

export async function getProposal(
  _params: GetIndexDTFProposalParams,
): Promise<IndexDTFProposalDetail> {
  throw new Error("getProposal is not implemented yet.");
}

export async function getRebalance(
  _params: GetIndexDTFRebalanceParams,
): Promise<unknown> {
  throw new Error("getRebalance is not implemented yet.");
}

export async function getRebalances(
  _params: GetIndexDTFRebalancesParams,
): Promise<readonly unknown[]> {
  throw new Error("getRebalances is not implemented yet.");
}

export function createIndexNamespace(client: DtfClient) {
  return {
    get: (params: GetIndexDTFParams) => getIndexDTF(params, client),
    list: listIndexDTFs,
    getFull: getFullIndexDTF,
    getPrice: getIndexDTFPrice,
    getPriceHistory: getIndexDTFPriceHistory,
    proposals: getProposals,
    proposal: getProposal,
    getAllProposals,
    rebalances: getRebalances,
    rebalance: getRebalance,
  };
}
