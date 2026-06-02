import { getAddress, type Address } from "viem";

import type { IndexDtfProposalDtfContractContext } from "@/index-dtf/governance/contract-map";
import type {
  GetIndexDtfProposalQuery,
  GetIndexDtfProposalVotingSnapshotQuery,
} from "@/index-dtf/subgraph/dtf.generated";
import type { DtfParams } from "@/types/common";
import type {
  GetIndexDtfProposalParams,
  IndexDtfOptimisticProposalContext,
  IndexDtfProposalDetail,
  IndexDtfProposalSummary,
  IndexDtfProposalVotingSnapshot,
  ProposalState,
} from "@/types/governance";

import { mapAmount } from "@/lib/utils";

const MAX_UINT256 = (1n << 256n) - 1n;

type SubgraphIndexDtfProposal = NonNullable<GetIndexDtfProposalQuery["proposal"]>;
type SubgraphIndexDtfProposalVotingSnapshot = NonNullable<GetIndexDtfProposalVotingSnapshotQuery["proposal"]>;
type SubgraphIndexDtfProposalSummary = {
  readonly id: string;
  readonly description: string;
  readonly creationTime: string;
  readonly state: ProposalState;
  readonly isOptimistic?: boolean | null;
  readonly vetoThreshold?: string | null;
  readonly vetoThresholdVotes?: string | null;
  readonly optimisticSnapshot?: string | null;
  readonly optimisticSnapshotSupply?: string | null;
  readonly forWeightedVotes: string;
  readonly abstainWeightedVotes: string;
  readonly againstWeightedVotes: string;
  readonly executionETA?: string | null;
  readonly executionTime?: string | null;
  readonly quorumVotes: string;
  readonly voteStart: string;
  readonly voteEnd: string;
  readonly executionBlock?: string | null;
  readonly creationBlock: string;
  readonly proposer: {
    readonly address: string;
  };
  readonly governance: {
    readonly id: string;
    readonly token: { readonly id: string };
    readonly timelock: { readonly id: string };
  };
};
type SubgraphIndexDtfOptimisticProposal = {
  readonly id: string;
  readonly isOptimistic?: boolean | null;
  readonly vetoThreshold?: string | null;
  readonly vetoThresholdVotes?: string | null;
  readonly optimisticSnapshot?: string | null;
  readonly optimisticSnapshotSupply?: string | null;
  readonly governance: {
    readonly token: { readonly id: string };
  };
};
type SubgraphIndexDtfProposalDtf = NonNullable<GetIndexDtfProposalQuery["dtf"]>;
export type SubgraphGovernedIndexDtfProposalDtf = SubgraphIndexDtfProposalDtf & {
  readonly stToken: NonNullable<SubgraphIndexDtfProposalDtf["stToken"]>;
};
type SubgraphIndexDtfProposalGovernance = SubgraphIndexDtfProposal["governance"];

export type ParsedIndexDtfProposalSummary = Omit<IndexDtfProposalSummary, "votingState">;
export type ParsedIndexDtfProposal = Omit<IndexDtfProposalDetail, "decoded" | "votingState">;
export type ParsedIndexDtfProposalVotingSnapshot = Omit<IndexDtfProposalVotingSnapshot, "votingState">;

export function mapIndexDtfProposalSummary(
  proposal: SubgraphIndexDtfProposalSummary,
  chainId: GetIndexDtfProposalParams["chainId"],
  dtf?: DtfParams,
): ParsedIndexDtfProposalSummary {
  const executionETA = toOptionalNumber(proposal.executionETA);
  const executionTime = toOptionalNumber(proposal.executionTime);
  const executionBlock = toOptionalNumber(proposal.executionBlock);
  const isOptimistic = !!proposal.isOptimistic;
  const optimistic = mapOptimisticProposalContext(proposal);
  const vetoThreshold = optimistic?.vetoThreshold ?? mapVetoThreshold(proposal.vetoThreshold);
  return {
    id: proposal.id,
    chainId,
    governance: getAddress(proposal.governance.id),
    timelock: getAddress(proposal.governance.timelock.id),
    voteToken: getAddress(proposal.governance.token.id),
    proposer: getAddress(proposal.proposer.address),
    description: proposal.description,
    state: proposal.state,
    isOptimistic,
    ...(vetoThreshold === undefined ? {} : { vetoThreshold }),
    ...(optimistic === undefined ? {} : { optimistic }),
    creationTime: Number(proposal.creationTime),
    creationBlock: Number(proposal.creationBlock),
    voteStart: Number(proposal.voteStart),
    voteEnd: Number(proposal.voteEnd),
    quorumVotes: mapAmount(proposal.quorumVotes),
    forWeightedVotes: mapAmount(proposal.forWeightedVotes),
    againstWeightedVotes: mapAmount(proposal.againstWeightedVotes),
    abstainWeightedVotes: mapAmount(proposal.abstainWeightedVotes),
    ...(dtf ? { dtf: { address: getAddress(dtf.address), chainId: dtf.chainId } } : {}),
    ...(executionETA === undefined ? {} : { executionETA }),
    ...(executionTime === undefined ? {} : { executionTime }),
    ...(executionBlock === undefined ? {} : { executionBlock }),
  };
}

export function mapIndexDtfProposal(
  proposal: SubgraphIndexDtfProposal,
  dtf: SubgraphGovernedIndexDtfProposalDtf,
  chainId: GetIndexDtfProposalParams["chainId"],
): ParsedIndexDtfProposal {
  const txnHash = toHex(proposal.txnHash);
  const queueBlock = toOptionalNumber(proposal.queueBlock);
  const queueTxnHash = proposal.queueTxnHash ? toHex(proposal.queueTxnHash) : undefined;
  const queueTime = toOptionalNumber(proposal.queueTime);
  const cancellationTime = toOptionalNumber(proposal.cancellationTime);
  const executionTxnHash = proposal.executionTxnHash ? toHex(proposal.executionTxnHash) : undefined;
  const targets = proposal.targets!.map((target) => getAddress(target));
  const calldatas = proposal.calldatas!.map(toHex);

  return {
    ...mapIndexDtfProposalSummary(proposal, chainId, {
      address: getAddress(dtf.id),
      chainId,
    }),
    targets,
    calldatas,
    votes: proposal.votes.map((vote) => ({
      voter: getAddress(vote.voter.address),
      choice: vote.choice,
      weight: mapAmount(vote.weight),
    })),
    forDelegateVotes: Number(proposal.forDelegateVotes),
    againstDelegateVotes: Number(proposal.againstDelegateVotes),
    abstainDelegateVotes: Number(proposal.abstainDelegateVotes),
    txnHash,
    ...(proposal.timelockId ? { timelockId: toHex(proposal.timelockId) } : {}),
    ...(queueBlock === undefined ? {} : { queueBlock }),
    ...(queueTxnHash === undefined ? {} : { queueTxnHash }),
    ...(queueTime === undefined ? {} : { queueTime }),
    ...(cancellationTime === undefined ? {} : { cancellationTime }),
    ...(executionTxnHash === undefined ? {} : { executionTxnHash }),
  };
}

export function mapIndexDtfProposalVotingSnapshot(
  proposal: SubgraphIndexDtfProposalVotingSnapshot,
): ParsedIndexDtfProposalVotingSnapshot {
  const isOptimistic = !!proposal.isOptimistic;
  const optimistic = mapOptimisticProposalContext(proposal);
  const vetoThreshold = optimistic?.vetoThreshold ?? mapVetoThreshold(proposal.vetoThreshold);

  return {
    id: proposal.id,
    governance: getAddress(proposal.governance.id),
    voteToken: getAddress(proposal.governance.token.id),
    state: proposal.state,
    isOptimistic,
    ...(vetoThreshold === undefined ? {} : { vetoThreshold }),
    ...(optimistic === undefined ? {} : { optimistic }),
    voteStart: Number(proposal.voteStart),
    voteEnd: Number(proposal.voteEnd),
    quorumVotes: mapAmount(proposal.quorumVotes),
    forWeightedVotes: mapAmount(proposal.forWeightedVotes),
    againstWeightedVotes: mapAmount(proposal.againstWeightedVotes),
    abstainWeightedVotes: mapAmount(proposal.abstainWeightedVotes),
    votes: proposal.votes.map((vote) => ({
      voter: getAddress(vote.voter.address),
      choice: vote.choice,
      weight: mapAmount(vote.weight),
    })),
  };
}

function mapOptimisticProposalContext(
  proposal: SubgraphIndexDtfOptimisticProposal,
): IndexDtfOptimisticProposalContext | undefined {
  if (!proposal.isOptimistic) {
    return undefined;
  }

  const vetoThreshold = mapVetoThreshold(proposal.vetoThreshold);
  const vetoThresholdVotes = mapVetoThreshold(proposal.vetoThresholdVotes);

  if (
    proposal.optimisticSnapshot === null ||
    proposal.optimisticSnapshot === undefined ||
    proposal.optimisticSnapshotSupply === null ||
    proposal.optimisticSnapshotSupply === undefined ||
    vetoThreshold === undefined ||
    vetoThresholdVotes === undefined
  ) {
    return undefined;
  }

  return {
    proposalId: proposal.id,
    voteToken: getAddress(proposal.governance.token.id),
    snapshot: BigInt(proposal.optimisticSnapshot),
    snapshotSupply: mapAmount(proposal.optimisticSnapshotSupply),
    vetoThreshold,
    vetoThresholdVotes: mapAmount(vetoThresholdVotes),
  };
}

function mapVetoThreshold(value: string | null | undefined): bigint | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const vetoThreshold = BigInt(value);

  return vetoThreshold === MAX_UINT256 ? undefined : vetoThreshold;
}

export function mapDtfProposalContractContext(
  dtf: SubgraphGovernedIndexDtfProposalDtf,
): IndexDtfProposalDtfContractContext {
  const ownerGovernance = dtf.ownerGovernance ? mapGovernanceWithTimelock(dtf.ownerGovernance) : undefined;
  const tradingGovernance = dtf.tradingGovernance ? mapGovernanceWithTimelock(dtf.tradingGovernance) : undefined;
  const stakingToken = mapStakingTokenContractContext(dtf.stToken);

  return {
    address: getAddress(dtf.id),
    proxyAdmin: getAddress(dtf.proxyAdmin),
    legacyAdminGovernance: dtf.legacyAdmins.map((address) => getAddress(address)),
    legacyTradingGovernance: dtf.legacyAuctionApprovers.map((address) => getAddress(address)),
    ...(ownerGovernance ? { ownerGovernance } : {}),
    ...(tradingGovernance ? { tradingGovernance } : {}),
    stakingToken,
  };
}

export function mapProposalGovernanceContractContext(governance: SubgraphIndexDtfProposalGovernance) {
  return {
    address: getAddress(governance.id),
    timelock: {
      address: getAddress(governance.timelock!.id),
      ...(governance.timelock!.type ? { type: governance.timelock!.type } : {}),
    },
  };
}

type SubgraphGovernanceWithTimelock = {
  readonly id: string;
  readonly timelock?: { readonly id: string } | null;
};

type SubgraphStakingToken = NonNullable<SubgraphIndexDtfProposalDtf["stToken"]>;

function mapGovernanceWithTimelock(governance: SubgraphGovernanceWithTimelock): {
  readonly address: Address;
  readonly timelock: Address;
} {
  return {
    address: getAddress(governance.id),
    timelock: getAddress(governance.timelock!.id),
  };
}

function mapStakingTokenContractContext(
  stakingToken: SubgraphStakingToken,
): IndexDtfProposalDtfContractContext["stakingToken"] {
  const governance = stakingToken.governance ? mapGovernanceWithTimelock(stakingToken.governance) : undefined;

  return {
    address: getAddress(stakingToken.id),
    legacyGovernance: stakingToken.legacyGovernance.map((address) => getAddress(address)),
    ...(governance ? { governance } : {}),
  };
}

function toOptionalNumber(value: string | null | undefined): number | undefined {
  return value === null || value === undefined ? undefined : Number(value);
}

function toHex(value: string): `0x${string}` {
  return value as `0x${string}`;
}
