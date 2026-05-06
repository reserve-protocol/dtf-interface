import { getAddress, type Address } from "viem";
import { mapAmount } from "../../lib/utils.js";
import type { DtfParams } from "../../types/common.js";
import type {
  GetIndexDtfProposalParams,
  IndexDtfProposalDetail,
  IndexDtfProposalSummary,
  ProposalState,
} from "../../types/governance.js";
import type { GetIndexDtfProposalQuery } from "../subgraph/dtf.generated.js";
import type { IndexDtfProposalDtfContractContext } from "./contract-map.js";

type SubgraphIndexDtfProposal = NonNullable<
  GetIndexDtfProposalQuery["proposal"]
>;
type SubgraphIndexDtfProposalSummary = {
  readonly id: string;
  readonly description: string;
  readonly creationTime: string;
  readonly state: ProposalState;
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
    readonly timelock: { readonly id: string };
  };
};
type SubgraphIndexDtfProposalDtf = NonNullable<GetIndexDtfProposalQuery["dtf"]>;
export type SubgraphGovernedIndexDtfProposalDtf =
  SubgraphIndexDtfProposalDtf & {
    readonly stToken: NonNullable<SubgraphIndexDtfProposalDtf["stToken"]>;
  };
type SubgraphIndexDtfProposalGovernance =
  SubgraphIndexDtfProposal["governance"];

export type ParsedIndexDtfProposalSummary = Omit<
  IndexDtfProposalSummary,
  "votingState"
>;
export type ParsedIndexDtfProposal = Omit<
  IndexDtfProposalDetail,
  "decoded" | "votingState"
>;

export function mapIndexDtfProposalSummary(
  proposal: SubgraphIndexDtfProposalSummary,
  chainId: GetIndexDtfProposalParams["chainId"],
  dtf?: DtfParams,
): ParsedIndexDtfProposalSummary {
  const executionETA = toOptionalNumber(proposal.executionETA);
  const executionTime = toOptionalNumber(proposal.executionTime);
  const executionBlock = toOptionalNumber(proposal.executionBlock);

  return {
    id: proposal.id,
    chainId,
    governance: getAddress(proposal.governance.id),
    timelock: getAddress(proposal.governance.timelock.id),
    proposer: getAddress(proposal.proposer.address),
    description: proposal.description,
    state: proposal.state,
    creationTime: Number(proposal.creationTime),
    creationBlock: Number(proposal.creationBlock),
    voteStart: Number(proposal.voteStart),
    voteEnd: Number(proposal.voteEnd),
    quorumVotes: mapAmount(proposal.quorumVotes),
    forWeightedVotes: mapAmount(proposal.forWeightedVotes),
    againstWeightedVotes: mapAmount(proposal.againstWeightedVotes),
    abstainWeightedVotes: mapAmount(proposal.abstainWeightedVotes),
    ...(dtf
      ? { dtf: { address: getAddress(dtf.address), chainId: dtf.chainId } }
      : {}),
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
  const queueBlock = toOptionalNumber(proposal.queueBlock);
  const queueTime = toOptionalNumber(proposal.queueTime);
  const cancellationTime = toOptionalNumber(proposal.cancellationTime);
  const executionTxnHash = proposal.executionTxnHash
    ? toHex(proposal.executionTxnHash)
    : undefined;
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
    ...(proposal.timelockId ? { timelockId: toHex(proposal.timelockId) } : {}),
    ...(queueBlock === undefined ? {} : { queueBlock }),
    ...(queueTime === undefined ? {} : { queueTime }),
    ...(cancellationTime === undefined ? {} : { cancellationTime }),
    ...(executionTxnHash === undefined ? {} : { executionTxnHash }),
  };
}

export function mapDtfProposalContractContext(
  dtf: SubgraphGovernedIndexDtfProposalDtf,
): IndexDtfProposalDtfContractContext {
  const ownerGovernance = dtf.ownerGovernance
    ? mapGovernanceWithTimelock(dtf.ownerGovernance)
    : undefined;
  const tradingGovernance = dtf.tradingGovernance
    ? mapGovernanceWithTimelock(dtf.tradingGovernance)
    : undefined;
  const stakingToken = mapStakingTokenContractContext(dtf.stToken);

  return {
    address: getAddress(dtf.id),
    proxyAdmin: getAddress(dtf.proxyAdmin),
    legacyAdminGovernance: dtf.legacyAdmins.map((address) =>
      getAddress(address),
    ),
    legacyTradingGovernance: dtf.legacyAuctionApprovers.map((address) =>
      getAddress(address),
    ),
    ...(ownerGovernance ? { ownerGovernance } : {}),
    ...(tradingGovernance ? { tradingGovernance } : {}),
    stakingToken,
  };
}

export function mapProposalGovernanceContractContext(
  governance: SubgraphIndexDtfProposalGovernance,
) {
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

function mapGovernanceWithTimelock(
  governance: SubgraphGovernanceWithTimelock,
): { readonly address: Address; readonly timelock: Address } {
  return {
    address: getAddress(governance.id),
    timelock: getAddress(governance.timelock!.id),
  };
}

function mapStakingTokenContractContext(
  stakingToken: SubgraphStakingToken,
): IndexDtfProposalDtfContractContext["stakingToken"] {
  const governance = stakingToken.governance
    ? mapGovernanceWithTimelock(stakingToken.governance)
    : undefined;

  return {
    address: getAddress(stakingToken.id),
    legacyGovernance: stakingToken.legacyGovernance.map((address) =>
      getAddress(address),
    ),
    ...(governance ? { governance } : {}),
  };
}

function toOptionalNumber(
  value: string | null | undefined,
): number | undefined {
  return value === null || value === undefined ? undefined : Number(value);
}

function toHex(value: string): `0x${string}` {
  return value as `0x${string}`;
}
