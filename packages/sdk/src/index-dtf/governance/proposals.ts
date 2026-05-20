import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { DtfParams } from "@/types/common";
import type {
  GetAllIndexDtfProposalsParams,
  GetIndexDtfProposalParams,
  IndexDtfProposalList,
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
  type ParsedIndexDtfProposalSummary,
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
  GetAllIndexDtfProposalsDocument,
  GetIndexDtfProposalDocument,
  GetIndexDtfProposalGovernanceAddressesDocument,
  GetIndexDtfProposalsDocument,
  type Proposal_Filter,
} from "@/index-dtf/subgraph/dtf.generated";
import { SdkError } from "@/lib/errors";
import { getCurrentTime } from "@/lib/utils";

const CHALLENGE_DESCRIPTION_PREFIX = "Confirmation For:";

export async function getProposals(
  client: DtfClient,
  params: GetIndexDtfProposalsParams,
): Promise<readonly IndexDtfProposalSummary[]> {
  const proposalList = await getProposalList(client, params);

  return proposalList.proposals;
}

export async function getProposalList(
  client: DtfClient,
  params: GetIndexDtfProposalsParams,
): Promise<IndexDtfProposalList> {
  const limit = params.limit ?? DEFAULT_PROPOSAL_LIMIT;

  if (params.governanceAddresses) {
    const governanceIds = normalizeGovernanceIds(params.governanceAddresses);
    const dtf = params.address ? { address: getAddress(params.address), chainId: params.chainId } : undefined;

    return getProposalListByGovernanceIds(
      client,
      params.chainId,
      governanceIds,
      limit,
      dtf,
    );
  }

  if (params.dtf) {
    const dtf = {
      address: getAddress(params.dtf.id),
      chainId: params.dtf.chainId,
    };
    const governanceIds = normalizeGovernanceIds(getProposalGovernanceAddresses(params.dtf));

    return getProposalListByGovernanceIds(
      client,
      dtf.chainId,
      governanceIds,
      limit,
      dtf,
    );
  }

  const dtf = { address: getAddress(params.address), chainId: params.chainId };
  const governanceIds = await fetchDtfProposalGovernanceIds(client, dtf);

  return getProposalListByGovernanceIds(
    client,
    dtf.chainId,
    governanceIds,
    limit,
    dtf,
  );
}

export async function getAllProposals(
  client: DtfClient,
  params: GetAllIndexDtfProposalsParams,
): Promise<readonly IndexDtfProposalSummary[]> {
  const limit = params.limit ?? DEFAULT_PROPOSAL_LIMIT;
  const where = getProposalFilter(params.states);
  const { proposals } = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetAllIndexDtfProposalsDocument,
    variables: {
      limit,
      offset: params.offset ?? 0,
      ...(where ? { where } : {}),
    },
  });

  return withProposalSummaryState(
    proposals.map((proposal) => mapIndexDtfProposalSummary(proposal, params.chainId)),
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

  const parsedProposal = mapIndexDtfProposal(proposal, governedDtf, chainId);
  const proposalWithVoteState = withVoteState(parsedProposal, getCurrentTime());
  const proposalWithChallengeState = withChallengeState([proposalWithVoteState])[0]!;
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
    ...proposalWithChallengeState,
    decoded: decodedData,
  };
}

async function getProposalListByGovernanceIds(
  client: DtfClient,
  chainId: DtfParams["chainId"],
  governanceIds: readonly string[],
  limit: number,
  dtf?: DtfParams,
): Promise<IndexDtfProposalList> {
  if (governanceIds.length === 0) {
    return { proposals: [], proposalCount: 0 };
  }

  const { governances } = await client.subgraph.queryIndex({
    chainId,
    query: GetIndexDtfProposalsDocument,
    variables: {
      governanceIds: [...governanceIds],
      limit,
    },
  });
  const proposalCount = getProposalCount(governances);

  const proposals = governances
    .flatMap((governance) => governance.proposals)
    .map((proposal) => mapIndexDtfProposalSummary(proposal, chainId, dtf))
    .sort((a, b) => b.creationTime - a.creationTime);
  const limitedProposals = proposals.slice(0, limit);

  return {
    proposals: withProposalSummaryState(limitedProposals),
    proposalCount,
  };
}

function getProposalCount(governances: readonly { readonly proposalCount: string }[]): number {
  return governances.reduce((count, governance) => count + Number(governance.proposalCount), 0);
}

function withProposalSummaryState(
  proposals: readonly ParsedIndexDtfProposalSummary[],
  timestamp = getCurrentTime(),
): readonly IndexDtfProposalSummary[] {
  const proposalsWithVoteState = proposals.map((proposal) => withVoteState(proposal, timestamp));
  const proposalsWithChallengeState = withChallengeState(proposalsWithVoteState);

  return proposalsWithChallengeState;
}

function withChallengeState<T extends ParsedIndexDtfProposalSummary>(proposals: readonly T[]): readonly T[] {
  const optimisticProposals: T[] = [];
  const challengeMatches = new Map<string, string | undefined>();
  const chronological = [...proposals].sort((a, b) => a.creationTime - b.creationTime);

  for (const proposal of chronological) {
    if (proposal.isOptimistic === true) {
      optimisticProposals.push(proposal);
      continue;
    }

    if (!proposal.description.startsWith(CHALLENGE_DESCRIPTION_PREFIX)) {
      continue;
    }

    const confirmationDescription = proposal.description.slice(CHALLENGE_DESCRIPTION_PREFIX.length).trim();
    let challengedProposalId: string | undefined;
    for (let index = optimisticProposals.length - 1; index >= 0; index--) {
      const optimisticProposal = optimisticProposals[index]!;

      if (optimisticProposal.governance.toLowerCase() !== proposal.governance.toLowerCase()) {
        continue;
      }

      if (confirmationDescription === optimisticProposal.description) {
        challengedProposalId = optimisticProposal.id;
        break;
      }
    }

    challengeMatches.set(proposal.id, challengedProposalId);
  }

  return proposals.map((proposal) => {
    if (!challengeMatches.has(proposal.id)) {
      return proposal;
    }

    const challengedProposalId = challengeMatches.get(proposal.id);

    return {
      ...proposal,
      wasChallenged: true,
      ...(challengedProposalId ? { challengedProposalId } : {}),
    };
  });
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
