import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { DtfParams } from "@/types/common";
import type {
  GetAllIndexDtfProposalsParams,
  GetIndexDtfProposalParams,
  GetIndexDtfProposalsParams,
  IndexDtfProposalDetail,
  IndexDtfProposalSummary,
} from "@/types/governance";

import { SdkError } from "@/errors";
import { DEFAULT_PROPOSAL_LIMIT } from "@/index-dtf/governance/constants";
import { buildProposalContractMap } from "@/index-dtf/governance/contract-map";
import { decodeIndexDtfProposalCalldatas } from "@/index-dtf/governance/decoder";
import {
  mapDtfProposalContractContext,
  mapIndexDtfProposal,
  mapIndexDtfProposalSummary,
  mapProposalGovernanceContractContext,
  type SubgraphGovernedIndexDtfProposalDtf,
} from "@/index-dtf/governance/mapper";
import {
  getDtfProposalGovernanceIds,
  getProposalGovernanceAddresses,
  normalizeGovernanceIds,
  withVoteState,
  type DtfGovernanceAddressContext,
} from "@/index-dtf/governance/utils";
import {
  GetIndexDtfProposalDocument,
  GetIndexDtfProposalGovernanceAddressesDocument,
  GetIndexDtfProposalsDocument,
} from "@/index-dtf/subgraph/dtf.generated";
import { getCurrentTime } from "@/lib/utils";

export async function getProposals(
  client: DtfClient,
  params: GetIndexDtfProposalsParams,
): Promise<readonly IndexDtfProposalSummary[]> {
  const limit = params.limit ?? DEFAULT_PROPOSAL_LIMIT;

  if (params.governanceAddresses) {
    const governanceIds = normalizeGovernanceIds(params.governanceAddresses);
    const dtf = params.address ? { address: getAddress(params.address), chainId: params.chainId } : undefined;

    return getProposalsByGovernanceIds(client, params.chainId, governanceIds, limit, dtf);
  }

  if (params.dtf) {
    const dtf = {
      address: getAddress(params.dtf.id),
      chainId: params.dtf.chainId,
    };
    const governanceIds = normalizeGovernanceIds(getProposalGovernanceAddresses(params.dtf));

    return getProposalsByGovernanceIds(client, dtf.chainId, governanceIds, limit, dtf);
  }

  const dtf = { address: getAddress(params.address), chainId: params.chainId };
  const governanceIds = await fetchDtfProposalGovernanceIds(client, dtf);

  return getProposalsByGovernanceIds(client, dtf.chainId, governanceIds, limit, dtf);
}

export async function getAllProposals(
  _client: DtfClient,
  _params: GetAllIndexDtfProposalsParams,
): Promise<readonly IndexDtfProposalSummary[]> {
  throw new SdkError({
    code: "NOT_IMPLEMENTED",
    message: "getAllIndexDtfProposals is not implemented yet.",
    meta: { method: "getAllIndexDtfProposals" },
  });
}

export async function getProposal(
  client: DtfClient,
  params: GetIndexDtfProposalParams,
): Promise<IndexDtfProposalDetail> {
  const { proposalId, address, chainId } = params;
  const { dtf, proposal } = await client.subgraph.queryIndex({
    chainId,
    query: GetIndexDtfProposalDocument,
    variables: {
      dtfId: address.toLowerCase(),
      proposalId,
    },
  });

  if (!proposal || !dtf) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: !proposal
        ? `Index DTF proposal not found: ${proposalId} on chain ${chainId}`
        : `Index DTF not found: ${address} on chain ${chainId}`,
      meta: {
        chainId,
        entity: !proposal ? "indexDtfProposal" : "indexDtf",
        ...(!proposal ? { id: proposalId } : { address }),
      },
    });
  }

  const governedDtf = dtf as SubgraphGovernedIndexDtfProposalDtf;

  const parsedProposal = mapIndexDtfProposal(proposal, governedDtf, chainId);
  const proposalWithVoteState = withVoteState(parsedProposal, getCurrentTime());
  const contractMap = buildProposalContractMap({
    chainId,
    dtf: mapDtfProposalContractContext(governedDtf),
    proposalGovernance: mapProposalGovernanceContractContext(proposal.governance),
  });
  const decodedData = decodeIndexDtfProposalCalldatas({
    targets: parsedProposal.targets,
    calldatas: parsedProposal.calldatas,
    contractMap,
  });

  return {
    ...proposalWithVoteState,
    decoded: decodedData,
  };
}

async function getProposalsByGovernanceIds(
  client: DtfClient,
  chainId: DtfParams["chainId"],
  governanceIds: readonly string[],
  limit: number,
  dtf?: DtfParams,
): Promise<readonly IndexDtfProposalSummary[]> {
  if (governanceIds.length === 0) {
    return [];
  }

  const { governances } = await client.subgraph.queryIndex({
    chainId,
    query: GetIndexDtfProposalsDocument,
    variables: {
      governanceIds: [...governanceIds],
      limit,
    },
  });

  const timestamp = getCurrentTime();
  const proposals = governances
    .flatMap((governance) => governance.proposals)
    .map((proposal) => withVoteState(mapIndexDtfProposalSummary(proposal, chainId, dtf), timestamp))
    .sort((a, b) => b.creationTime - a.creationTime);

  return proposals.slice(0, limit);
}

async function fetchDtfProposalGovernanceIds(client: DtfClient, params: DtfParams): Promise<readonly string[]> {
  const address = getAddress(params.address);
  const { dtf } = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfProposalGovernanceAddressesDocument,
    variables: { dtfId: address.toLowerCase() },
  });

  if (!dtf) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Index DTF not found: ${address} on chain ${params.chainId}`,
      meta: {
        chainId: params.chainId,
        entity: "indexDtf",
        address,
      },
    });
  }

  return getDtfProposalGovernanceIds(dtf as DtfGovernanceAddressContext);
}
