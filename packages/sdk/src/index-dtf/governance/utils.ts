import { getAddress, type Address } from "viem";

import type { Authority } from "@/types/common";
import type {
  IndexDtfGuardianGroup,
  IndexDtfOptimisticProposalContext,
  IndexDtfProposalSummary,
  ProposalState,
  ProposalVotingState,
} from "@/types/governance";
import type { IndexDtf } from "@/types/index-dtf";

import { dedupeAddresses, getCurrentTime } from "@/lib/utils";

const D18 = 10n ** 18n;

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
  | "isOptimistic"
  | "vetoThreshold"
  | "voteEnd"
  | "voteStart"
> & {
  readonly optimistic?: Pick<IndexDtfOptimisticProposalContext, "snapshotSupply" | "vetoThreshold"> &
    Partial<Pick<IndexDtfOptimisticProposalContext, "vetoThresholdVotes">>;
};

type MutableProposalVotingState = {
  state: ProposalState;
  deadline: number | null;
  quorum: boolean;
  forVotesReachedQuorum: boolean;
  participationQuorumReached: boolean;
  vetoReached: boolean;
  for: number;
  against: number;
  abstain: number;
};

export function getProposalGovernanceAddresses(dtf: IndexDtf): readonly Address[] {
  return dedupeAddresses([
    ...dtf.governance.all.flatMap((authority) => (authority.type === "governance" ? [authority.address] : [])),
    ...(dtf.governance.voteLock?.type === "governance" ? [dtf.governance.voteLock.address] : []),
    ...dtf.roles.admin.legacy,
    ...dtf.roles.rebalance.legacyAuctionApprovers,
    ...(dtf.voteLockVault?.legacyGovernance ?? []),
  ]);
}

export function getDtfProposalGovernanceIds(dtf: DtfGovernanceAddressContext): readonly string[] {
  return normalizeGovernanceIds([
    ...(dtf.ownerGovernance ? [dtf.ownerGovernance.id] : []),
    ...(dtf.tradingGovernance ? [dtf.tradingGovernance.id] : []),
    ...(dtf.stToken.governance ? [dtf.stToken.governance.id] : []),
    ...dtf.legacyAdmins,
    ...dtf.legacyAuctionApprovers,
    ...dtf.stToken.legacyGovernance,
  ]);
}

export function normalizeGovernanceIds(governanceAddresses: string | readonly string[]): readonly string[] {
  const addresses = Array.isArray(governanceAddresses) ? governanceAddresses : [governanceAddresses];

  return [...new Set(addresses.map((address) => getAddress(address).toLowerCase()))];
}

export function mapGuardianGroup(authority: Authority | undefined): IndexDtfGuardianGroup {
  if (!authority || authority.type !== "governance") {
    return { governance: undefined, timelock: undefined, guardians: [] };
  }

  return {
    governance: authority.address,
    timelock: authority.governance.timelock.address,
    guardians: authority.governance.timelock.guardians,
  };
}

export function getZeroValues(length: number): bigint[] {
  return Array.from({ length }, () => 0n);
}

export function getProposalState(proposal: ProposalVoteStateInput, timestamp = getCurrentTime()): ProposalVotingState {
  const state = createInitialVotingState(proposal.state);

  const isOptimistic = proposal.isOptimistic === true;
  const optimisticVetoThresholdVotes = isOptimistic ? getOptimisticVetoVotes(proposal) : undefined;
  const quorumVotes = proposal.quorumVotes.raw;

  if (proposal.state === "QUEUED" && proposal.executionETA) {
    state.deadline = proposal.executionETA - timestamp;
  } else if (proposal.state === "PENDING") {
    if (timestamp >= proposal.voteEnd && isOptimistic) {
      state.state = getOptimisticFinalState(proposal, optimisticVetoThresholdVotes);
    } else if (timestamp >= proposal.voteStart && timestamp < proposal.voteEnd) {
      state.state = "ACTIVE";
      state.deadline = proposal.voteEnd - timestamp;
    } else if (timestamp < proposal.voteStart) {
      state.deadline = proposal.voteStart - timestamp;
    } else {
      state.state = "EXPIRED";
    }
  } else if (proposal.state === "ACTIVE") {
    if (timestamp >= proposal.voteEnd) {
      if (isOptimistic) {
        state.state = getOptimisticFinalState(proposal, optimisticVetoThresholdVotes);
      } else if (
        proposal.againstWeightedVotes.raw > proposal.forWeightedVotes.raw ||
        proposal.forWeightedVotes.raw === 0n
      ) {
        state.state = "DEFEATED";
      } else if (proposal.forWeightedVotes.raw + proposal.abstainWeightedVotes.raw < quorumVotes) {
        state.state = "QUORUM_NOT_REACHED";
      } else {
        state.state = "SUCCEEDED";
      }
    } else {
      state.deadline = proposal.voteEnd - timestamp;
    }
  }

  const totalVotes =
    proposal.forWeightedVotes.raw + proposal.againstWeightedVotes.raw + proposal.abstainWeightedVotes.raw;

  state.quorum = isOptimistic
    ? optimisticVetoThresholdVotes !== undefined && proposal.againstWeightedVotes.raw >= optimisticVetoThresholdVotes
    : proposal.forWeightedVotes.raw > 0n && proposal.forWeightedVotes.raw >= quorumVotes;
  state.forVotesReachedQuorum = isOptimistic ? false : state.quorum;
  state.participationQuorumReached = isOptimistic
    ? state.quorum
    : proposal.forWeightedVotes.raw + proposal.abstainWeightedVotes.raw >= quorumVotes;
  state.vetoReached = isOptimistic ? state.quorum : false;

  if (totalVotes > 0n) {
    state.for = getVotePercentage(proposal.forWeightedVotes.raw, totalVotes);
    state.abstain = getVotePercentage(proposal.abstainWeightedVotes.raw, totalVotes);
    state.against =
      isOptimistic && optimisticVetoThresholdVotes !== undefined && optimisticVetoThresholdVotes > 0n
        ? getVotePercentage(proposal.againstWeightedVotes.raw, optimisticVetoThresholdVotes)
        : getVotePercentage(proposal.againstWeightedVotes.raw, totalVotes);
  }

  return state;
}

export const getVoteState = getProposalState;

export function withVoteState<T extends ProposalVoteStateInput>(
  proposal: T,
  timestamp = getCurrentTime(),
): T & {
  readonly state: ProposalState;
  readonly votingState: ProposalVotingState;
} {
  const votingState = getProposalState(proposal, timestamp);

  return {
    ...proposal,
    state: votingState.state,
    votingState,
  };
}

function createInitialVotingState(state: ProposalState): MutableProposalVotingState {
  return {
    state,
    deadline: null,
    quorum: false,
    forVotesReachedQuorum: false,
    participationQuorumReached: false,
    vetoReached: false,
    for: 0,
    against: 0,
    abstain: 0,
  };
}

export function getOptimisticVetoThresholdVotes(
  optimistic: Pick<IndexDtfOptimisticProposalContext, "snapshotSupply" | "vetoThreshold">,
): bigint {
  return (optimistic.vetoThreshold * optimistic.snapshotSupply.raw) / D18;
}

function getOptimisticFinalState(
  proposal: ProposalVoteStateInput,
  vetoThresholdVotes: bigint | undefined,
): ProposalState {
  if (vetoThresholdVotes === undefined) {
    return proposal.againstWeightedVotes.raw === 0n ? "SUCCEEDED" : proposal.state;
  }

  if (vetoThresholdVotes === 0n) {
    return "CANCELED";
  }

  return proposal.againstWeightedVotes.raw >= vetoThresholdVotes ? "DEFEATED" : "SUCCEEDED";
}

function getOptimisticVetoVotes(proposal: ProposalVoteStateInput): bigint | undefined {
  if (!proposal.optimistic) {
    return proposal.vetoThreshold === undefined ? undefined : proposal.quorumVotes.raw;
  }

  return proposal.optimistic.vetoThresholdVotes?.raw ?? getOptimisticVetoThresholdVotes(proposal.optimistic);
}

function getVotePercentage(votes: bigint, totalVotes: bigint): number {
  return Number((votes * 10_000n) / totalVotes) / 100;
}
