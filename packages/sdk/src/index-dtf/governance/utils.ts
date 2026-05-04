import { getAddress, type Address } from "viem";
import { dedupeAddresses, getCurrentTime } from "../../lib/utils.js";
import type {
  IndexDtf,
  IndexDtfProposalSummary,
  ProposalState,
  ProposalVotingState,
} from "../../types/index-dtf.js";

export type DtfGovernanceAddressContext = {
  readonly ownerGovernance?: { readonly id: string } | null;
  readonly tradingGovernance?: { readonly id: string } | null;
  readonly legacyAdmins: readonly string[];
  readonly legacyAuctionApprovers: readonly string[];
  readonly stToken: {
    readonly governance?: { readonly id: string } | null;
    readonly legacyGovernance: readonly string[];
  };
};

type ProposalVoteStateInput = Pick<
  IndexDtfProposalSummary,
  | "abstainWeightedVotes"
  | "againstWeightedVotes"
  | "executionETA"
  | "forWeightedVotes"
  | "quorumVotes"
  | "state"
  | "voteEnd"
  | "voteStart"
>;

type MutableProposalVotingState = {
  state: ProposalState;
  deadline: number | null;
  quorum: boolean;
  forVotesReachedQuorum: boolean;
  participationQuorumReached: boolean;
  for: number;
  against: number;
  abstain: number;
};

export function getIndexDtfProposalGovernanceAddresses(
  dtf: IndexDtf,
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

export function getDtfProposalGovernanceIds(
  dtf: DtfGovernanceAddressContext,
): readonly string[] {
  return normalizeGovernanceIds([
    ...(dtf.ownerGovernance ? [dtf.ownerGovernance.id] : []),
    ...(dtf.tradingGovernance ? [dtf.tradingGovernance.id] : []),
    ...(dtf.stToken.governance ? [dtf.stToken.governance.id] : []),
    ...dtf.legacyAdmins,
    ...dtf.legacyAuctionApprovers,
    ...dtf.stToken.legacyGovernance,
  ]);
}

export function isProposalForDtf(
  governanceId: string,
  dtf: DtfGovernanceAddressContext,
): boolean {
  const proposalGovernance = getAddress(governanceId).toLowerCase();

  return getDtfProposalGovernanceIds(dtf).includes(proposalGovernance);
}

export function normalizeGovernanceIds(
  governanceAddresses: string | readonly string[],
): readonly string[] {
  const addresses = Array.isArray(governanceAddresses)
    ? governanceAddresses
    : [governanceAddresses];

  return [
    ...new Set(addresses.map((address) => getAddress(address).toLowerCase())),
  ];
}

export function getVoteState(
  proposal: ProposalVoteStateInput,
  timestamp = getCurrentTime(),
): ProposalVotingState {
  const state = createInitialVotingState(proposal.state);

  if (proposal.state === "QUEUED" && proposal.executionETA) {
    state.deadline = proposal.executionETA - timestamp;
  } else if (proposal.state === "PENDING") {
    if (timestamp >= proposal.voteStart && timestamp < proposal.voteEnd) {
      state.state = "ACTIVE";
      state.deadline = proposal.voteEnd - timestamp;
    } else if (timestamp < proposal.voteStart) {
      state.deadline = proposal.voteStart - timestamp;
    } else {
      state.state = "EXPIRED";
    }
  } else if (proposal.state === "ACTIVE") {
    if (timestamp >= proposal.voteEnd) {
      if (
        proposal.againstWeightedVotes.raw > proposal.forWeightedVotes.raw ||
        proposal.forWeightedVotes.raw === 0n
      ) {
        state.state = "DEFEATED";
      } else if (
        proposal.forWeightedVotes.raw + proposal.abstainWeightedVotes.raw <
        proposal.quorumVotes.raw
      ) {
        state.state = "QUORUM_NOT_REACHED";
      } else {
        state.state = "SUCCEEDED";
      }
    } else {
      state.deadline = proposal.voteEnd - timestamp;
    }
  }

  const totalVotes =
    proposal.forWeightedVotes.raw +
    proposal.againstWeightedVotes.raw +
    proposal.abstainWeightedVotes.raw;
  state.quorum =
    proposal.forWeightedVotes.raw > 0n &&
    proposal.forWeightedVotes.raw >= proposal.quorumVotes.raw;
  state.forVotesReachedQuorum = state.quorum;
  state.participationQuorumReached =
    proposal.forWeightedVotes.raw + proposal.abstainWeightedVotes.raw >=
    proposal.quorumVotes.raw;

  if (totalVotes > 0n) {
    state.for = getVotePercentage(proposal.forWeightedVotes.raw, totalVotes);
    state.abstain = getVotePercentage(
      proposal.abstainWeightedVotes.raw,
      totalVotes,
    );
    state.against = getVotePercentage(
      proposal.againstWeightedVotes.raw,
      totalVotes,
    );
  }

  return state;
}

export function withVoteState<T extends ProposalVoteStateInput>(
  proposal: T,
  timestamp = getCurrentTime(),
): T & {
  readonly state: ProposalState;
  readonly votingState: ProposalVotingState;
} {
  const votingState = getVoteState(proposal, timestamp);

  return {
    ...proposal,
    state: votingState.state,
    votingState,
  };
}

function createInitialVotingState(
  state: ProposalState,
): MutableProposalVotingState {
  return {
    state,
    deadline: null,
    quorum: false,
    forVotesReachedQuorum: false,
    participationQuorumReached: false,
    for: 0,
    against: 0,
    abstain: 0,
  };
}

function getVotePercentage(votes: bigint, totalVotes: bigint): number {
  return Number((votes * 10_000n) / totalVotes) / 100;
}
