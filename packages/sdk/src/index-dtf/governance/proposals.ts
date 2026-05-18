import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { DtfParams } from "@/types/common";
import type {
  GetAllIndexDtfProposalsParams,
  GetIndexDtfProposalParams,
  GetIndexDtfProposalsParams,
  IndexDtfProposalDetail,
  IndexDtfProposalSummary,
  ProposalState,
} from "@/types/governance";

import { DEFAULT_PROPOSAL_LIMIT } from "@/index-dtf/governance/constants";
import { buildProposalContractMap } from "@/index-dtf/governance/contract-map";
import { decodeIndexDtfProposalCalldatas } from "@/index-dtf/governance/decoder";
import {
  mapDtfProposalContractContext,
  mapIndexDtfProposal,
  mapIndexDtfProposalSummary,
  mapProposalGovernanceContractContext,
  type ParsedIndexDtfProposal,
  type ParsedIndexDtfProposalSummary,
  type SubgraphGovernedIndexDtfProposalDtf,
} from "@/index-dtf/governance/mapper";
import { getOptimisticProposalContext } from "@/index-dtf/governance/optimistic";
import {
  getDtfProposalGovernanceIds,
  getProposalGovernanceAddresses,
  normalizeGovernanceIds,
  withVoteState,
  type DtfGovernanceAddressContext,
} from "@/index-dtf/governance/utils";
import {
  GetAllIndexDtfProposalsDocument,
  GetIndexDtfProposalDocument,
  GetIndexDtfProposalGovernanceAddressesDocument,
  GetIndexDtfProposalsDocument,
  type Proposal_Filter,
} from "@/index-dtf/subgraph/dtf.generated";
import { SdkError } from "@/lib/errors";
import { getCurrentTime } from "@/lib/utils";

export async function getProposals(
  client: DtfClient,
  params: GetIndexDtfProposalsParams,
): Promise<readonly IndexDtfProposalSummary[]> {
  const limit = params.limit ?? DEFAULT_PROPOSAL_LIMIT;

  if (params.governanceAddresses) {
    const governanceIds = normalizeGovernanceIds(params.governanceAddresses);
    const dtf = params.address ? { address: getAddress(params.address), chainId: params.chainId } : undefined;

    return getProposalsByGovernanceIds(
      client,
      params.chainId,
      governanceIds,
      limit,
      params.includeOptimisticState ?? false,
      dtf,
    );
  }

  if (params.dtf) {
    const dtf = {
      address: getAddress(params.dtf.id),
      chainId: params.dtf.chainId,
    };
    const governanceIds = normalizeGovernanceIds(getProposalGovernanceAddresses(params.dtf));

    return getProposalsByGovernanceIds(
      client,
      dtf.chainId,
      governanceIds,
      limit,
      params.includeOptimisticState ?? false,
      dtf,
    );
  }

  const dtf = { address: getAddress(params.address), chainId: params.chainId };
  const governanceIds = await fetchDtfProposalGovernanceIds(client, dtf);

  return getProposalsByGovernanceIds(
    client,
    dtf.chainId,
    governanceIds,
    limit,
    params.includeOptimisticState ?? false,
    dtf,
  );
}

export async function getAllProposals(
  client: DtfClient,
  params: GetAllIndexDtfProposalsParams,
): Promise<readonly IndexDtfProposalSummary[]> {
  const where = getProposalFilter(params.states);
  const { proposals } = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetAllIndexDtfProposalsDocument,
    variables: {
      limit: params.limit ?? DEFAULT_PROPOSAL_LIMIT,
      offset: params.offset ?? 0,
      ...(where ? { where } : {}),
    },
  });

  return finalizeProposalSummaries(
    client,
    proposals.map((proposal) => mapIndexDtfProposalSummary(proposal, params.chainId)),
    params.includeOptimisticState ?? false,
  );
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

  const parsedProposal = await withOptionalOptimisticProposalContext(
    client,
    mapIndexDtfProposal(proposal, governedDtf, chainId),
  );
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
  includeOptimisticState: boolean,
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
    .map((proposal) => mapIndexDtfProposalSummary(proposal, chainId, dtf))
    .sort((a, b) => b.creationTime - a.creationTime);

  const limitedProposals = proposals.slice(0, limit);

  return finalizeProposalSummaries(client, limitedProposals, includeOptimisticState, timestamp);
}

async function finalizeProposalSummaries(
  client: DtfClient,
  proposals: readonly ParsedIndexDtfProposalSummary[],
  includeOptimisticState: boolean,
  timestamp = getCurrentTime(),
): Promise<readonly IndexDtfProposalSummary[]> {
  if (!includeOptimisticState) {
    return proposals.map((proposal) => withVoteState(proposal, timestamp));
  }

  const optimisticProposals = await Promise.all(
    proposals.map((proposal) => withOptionalOptimisticProposalContext(client, proposal)),
  );

  return optimisticProposals.map((proposal) => withVoteState(proposal, timestamp));
}

async function withOptionalOptimisticProposalContext<T extends ParsedIndexDtfProposal | ParsedIndexDtfProposalSummary>(
  client: DtfClient,
  proposal: T,
): Promise<T> {
  if (proposal.isOptimistic === false) {
    return proposal;
  }

  const contextParams = {
    chainId: proposal.chainId,
    governance: proposal.governance,
    proposalId: proposal.id,
    ...(proposal.isOptimistic === undefined ? {} : { isOptimistic: proposal.isOptimistic }),
  };

  const optimistic = await getOptimisticProposalContext(client, contextParams);

  if (!optimistic) {
    return proposal;
  }

  return {
    ...proposal,
    isOptimistic: true,
    voteToken: optimistic.voteToken,
    optimistic,
  };
}

function getProposalFilter(states: readonly ProposalState[] | undefined): Proposal_Filter | undefined {
  if (!states || states.length === 0) {
    return undefined;
  }

  const stateFilter = [...states] as NonNullable<Proposal_Filter["state_in"]>;

  return { state_in: stateFilter };
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
