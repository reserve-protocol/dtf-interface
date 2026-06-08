import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { DtfParams } from "@/types/common";
import type {
  GetAllIndexDtfProposalsParams,
  GetIndexDtfProposalParams,
  GetIndexDtfProposalVotingSnapshotParams,
  IndexDtfProposalList,
  GetIndexDtfProposalsParams,
  IndexDtfProposalDetail,
  IndexDtfProposalSummary,
  IndexDtfProposalVotingSnapshot,
  ProposalState,
} from "@/types/governance";

import { DEFAULT_PROPOSAL_LIMIT } from "@/index-dtf/governance/constants";
import { buildProposalContractMap } from "@/index-dtf/governance/contract-map";
import { decodeIndexDtfProposalCalldatas } from "@/index-dtf/governance/decoder";
import {
  mapDtfProposalContractContext,
  mapIndexDtfProposal,
  mapIndexDtfProposalVotingSnapshot,
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
  GetIndexDtfProposalChallengeDocument,
  GetIndexDtfProposalDocument,
  GetIndexDtfProposalGovernanceAddressesDocument,
  GetIndexDtfProposalVotingSnapshotDocument,
  GetIndexDtfProposalsDocument,
  type Proposal_Filter,
} from "@/index-dtf/subgraph/dtf.generated";
import { SdkError } from "@/lib/errors";
import { getCurrentTime } from "@/lib/utils";

const CHALLENGE_DESCRIPTION_PREFIX = "Confirmation For:";

type ChallengeProposal = Pick<
  ParsedIndexDtfProposalSummary,
  "id" | "description" | "creationBlock" | "creationTime" | "governance" | "isOptimistic"
>;

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

    return getProposalListByGovernanceIds(client, params.chainId, governanceIds, limit, dtf);
  }

  if (params.dtf) {
    const dtf = {
      address: getAddress(params.dtf.id),
      chainId: params.dtf.chainId,
    };
    const governanceIds = normalizeGovernanceIds(getProposalGovernanceAddresses(params.dtf));

    return getProposalListByGovernanceIds(client, dtf.chainId, governanceIds, limit, dtf);
  }

  const dtf = { address: getAddress(params.address), chainId: params.chainId };
  const governanceIds = await fetchDtfProposalGovernanceIds(client, dtf);

  return getProposalListByGovernanceIds(client, dtf.chainId, governanceIds, limit, dtf);
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

  return withProposalSummaryState(proposals.map((proposal) => mapIndexDtfProposalSummary(proposal, params.chainId)));
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

  const timestamp = getCurrentTime();
  const parsedProposal = mapIndexDtfProposal(proposal, governedDtf, chainId);
  const proposalWithOptimisticContext = await withOptimisticContext(client, parsedProposal, timestamp);
  const challengedProposalId = await getChallengedProposalId(client, proposalWithOptimisticContext);
  const proposalWithChallengeState = challengedProposalId
    ? {
        ...proposalWithOptimisticContext,
        wasChallenged: true,
        challengedProposalId,
      }
    : proposalWithOptimisticContext;
  const proposalWithVoteState = withVoteState(proposalWithChallengeState, timestamp);
  const decodedData = decodeIndexDtfProposalCalldatas({
    targets: parsedProposal.targets,
    calldatas: parsedProposal.calldatas,
    contractMap: buildProposalContractMap({
      chainId,
      dtf: mapDtfProposalContractContext(governedDtf),
      proposalGovernance: mapProposalGovernanceContractContext(proposal.governance),
    }),
  });

  return {
    ...proposalWithVoteState,
    decoded: decodedData,
  };
}

async function getChallengedProposalId(
  client: DtfClient,
  proposal: Pick<ParsedIndexDtfProposal, "chainId" | "creationBlock" | "description" | "governance" | "isOptimistic">,
): Promise<string | undefined> {
  if (proposal.isOptimistic) {
    return undefined;
  }

  const challengeDescription = getChallengeDescription(proposal.description);
  if (!challengeDescription) {
    return undefined;
  }

  try {
    const { proposals } = await client.subgraph.queryIndex({
      chainId: proposal.chainId,
      query: GetIndexDtfProposalChallengeDocument,
      variables: {
        governanceId: proposal.governance.toLowerCase(),
        description: challengeDescription,
        creationBlock: proposal.creationBlock.toString(),
      },
    });

    return proposals[0]?.id;
  } catch {
    return undefined;
  }
}

async function withOptimisticContext<T extends ParsedIndexDtfProposal>(
  client: DtfClient,
  proposal: T,
  timestamp: number,
): Promise<T> {
  const hasVotes = proposal.votes.length > 0;

  if (
    !proposal.isOptimistic ||
    proposal.vetoThreshold === undefined ||
    timestamp <= proposal.voteStart ||
    timestamp >= proposal.voteEnd ||
    hasVotes
  ) {
    return proposal;
  }

  try {
    const optimistic = await getOptimisticProposalContext(client, {
      chainId: proposal.chainId,
      governance: proposal.governance,
      proposalId: proposal.id,
      isOptimistic: true,
      voteToken: proposal.voteToken,
      snapshot: BigInt(proposal.voteStart),
      vetoThreshold: proposal.vetoThreshold,
    });

    if (!optimistic) {
      return proposal;
    }

    return {
      ...proposal,
      vetoThreshold: optimistic.vetoThreshold,
      optimistic,
    };
  } catch {
    return proposal;
  }
}

export async function getProposalVotingSnapshot(
  client: DtfClient,
  params: GetIndexDtfProposalVotingSnapshotParams,
): Promise<IndexDtfProposalVotingSnapshot> {
  const { proposal } = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfProposalVotingSnapshotDocument,
    variables: {
      proposalId: params.proposalId,
    },
  });

  if (!proposal) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Index DTF proposal not found: ${params.proposalId} on chain ${params.chainId}`,
      meta: {
        chainId: params.chainId,
        entity: "indexDtfProposal",
        id: params.proposalId,
      },
    });
  }

  const timestamp = getCurrentTime();
  const parsedProposal = mapIndexDtfProposalVotingSnapshot(proposal);

  return withVoteState(parsedProposal, timestamp);
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
  const optimisticProposals = proposals.filter((proposal) => proposal.isOptimistic === true);
  const challengeMatches = new Map<string, string>();

  for (const proposal of proposals) {
    if (proposal.isOptimistic === true) {
      continue;
    }

    const confirmationDescription = getChallengeDescription(proposal.description);
    if (!confirmationDescription) {
      continue;
    }

    let challengedProposalId: string | undefined;
    let challengedProposal: ChallengeProposal | undefined;
    for (const optimisticProposal of optimisticProposals) {
      if (optimisticProposal.creationBlock > proposal.creationBlock) {
        continue;
      }

      if (optimisticProposal.governance.toLowerCase() !== proposal.governance.toLowerCase()) {
        continue;
      }

      if (confirmationDescription === optimisticProposal.description) {
        if (!challengedProposal || optimisticProposal.creationBlock > challengedProposal.creationBlock) {
          challengedProposal = optimisticProposal;
          challengedProposalId = optimisticProposal.id;
        }
      }
    }

    if (challengedProposalId) {
      challengeMatches.set(proposal.id, challengedProposalId);
    }
  }

  return proposals.map((proposal) => {
    if (!challengeMatches.has(proposal.id)) {
      return proposal;
    }

    return {
      ...proposal,
      wasChallenged: true,
      challengedProposalId: challengeMatches.get(proposal.id)!,
    };
  });
}

function getChallengeDescription(description: string): string | undefined {
  if (!description.startsWith(CHALLENGE_DESCRIPTION_PREFIX)) {
    return undefined;
  }

  // WHY: strip the prefix and its single separator space, but keep the remainder
  // verbatim. The subgraph stores descriptions untrimmed and the challenge lookup
  // matches `description` exactly, so trimming here breaks matching whenever the
  // original optimistic proposal description has trailing whitespace/newlines.
  const challengeDescription = description.slice(CHALLENGE_DESCRIPTION_PREFIX.length).replace(/^ /, "");

  return challengeDescription.trim().length > 0 ? challengeDescription : undefined;
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
