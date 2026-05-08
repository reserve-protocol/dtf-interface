import type { Address, Hex } from "viem";
import type { SupportedChainId } from "../defaults.js";
import type { DtfParams } from "./common.js";
import type { Amount } from "./common.js";
import type { IndexDtf } from "./index-dtf.js";

export type IndexDtfGovernanceInput = Address | readonly Address[];

export type GetIndexDtfProposalsOptions = {
  readonly limit?: number;
};

type GetIndexDtfProposalsByAddressParams = DtfParams & {
  readonly dtf?: never;
  readonly governanceAddresses?: never;
};

type GetIndexDtfProposalsByDtfParams = {
  readonly address?: never;
  readonly chainId?: never;
  readonly dtf: IndexDtf;
  readonly governanceAddresses?: never;
};

type GetIndexDtfProposalsByGovernanceParams = {
  readonly address?: Address;
  readonly chainId: SupportedChainId;
  readonly dtf?: never;
  readonly governanceAddresses: IndexDtfGovernanceInput;
};

export type GetIndexDtfProposalsParams = GetIndexDtfProposalsOptions &
  (
    | GetIndexDtfProposalsByAddressParams
    | GetIndexDtfProposalsByDtfParams
    | GetIndexDtfProposalsByGovernanceParams
  );

export type GetAllIndexDtfProposalsParams = {
  readonly chainId: SupportedChainId;
  readonly limit?: number;
  readonly offset?: number;
  readonly states?: readonly ProposalState[];
};

export type GetIndexDtfProposalParams = {
  readonly proposalId: string;
} & DtfParams;

export type GetIndexDtfDelegatesParams = {
  readonly chainId: SupportedChainId;
  readonly stToken: Address;
  readonly limit?: number;
};

export type GetIndexDtfGuardiansParams = DtfParams | { readonly dtf: IndexDtf };

export type GetIndexDtfVoterStateParams = {
  readonly chainId: SupportedChainId;
  readonly stToken: Address;
  readonly account: Address;
};

export type GetIndexDtfProposerStateParams = {
  readonly chainId: SupportedChainId;
  readonly governance: Address;
  readonly account: Address;
  readonly timepoint?: bigint;
};

export type GetIndexDtfProposalVotesParams = {
  readonly chainId: SupportedChainId;
  readonly governance: Address;
  readonly proposalId: string | bigint;
};

export type GetIndexDtfProposalVoterStateParams = {
  readonly chainId: SupportedChainId;
  readonly governance: Address;
  readonly account: Address;
  readonly proposal: Pick<
    IndexDtfProposalDetail,
    "id" | "voteStart" | "votes"
  >;
};

export type ProposalState =
  | "PENDING"
  | "ACTIVE"
  | "CANCELED"
  | "DEFEATED"
  | "SUCCEEDED"
  | "QUEUED"
  | "EXPIRED"
  | "EXECUTED"
  | "VETOED"
  | "QUORUM_NOT_REACHED"
  | string;

export type ProposalVotingState = {
  readonly state: ProposalState;
  readonly deadline: number | null;
  readonly quorum: boolean;
  readonly forVotesReachedQuorum: boolean;
  readonly participationQuorumReached: boolean;
  readonly for: number;
  readonly against: number;
  readonly abstain: number;
};

export type IndexDtfProposalSummary = {
  readonly id: string;
  readonly chainId: SupportedChainId;
  readonly governance: Address;
  readonly timelock: Address;
  readonly dtf?: DtfParams;
  readonly proposer?: Address;
  readonly description: string;
  readonly state: ProposalState;
  readonly creationTime: number;
  readonly creationBlock: number;
  readonly voteStart: number;
  readonly voteEnd: number;
  readonly executionETA?: number;
  readonly executionTime?: number;
  readonly executionBlock?: number;
  readonly quorumVotes: Amount;
  readonly forWeightedVotes: Amount;
  readonly againstWeightedVotes: Amount;
  readonly abstainWeightedVotes: Amount;
  readonly votingState: ProposalVotingState;
};

export type IndexDtfProposalVote = {
  readonly voter: Address;
  readonly choice: string;
  readonly weight: Amount;
};

export type IndexDtfDecodedCalldata = {
  readonly index: number;
  readonly target: Address;
  readonly contract: string;
  readonly functionName: string;
  readonly signature: string;
  readonly parameters: readonly string[];
  readonly params: readonly unknown[];
  readonly callData: `0x${string}`;
};

export type IndexDtfUnknownCalldata = {
  readonly index: number;
  readonly target: Address;
  readonly contract: string;
  readonly callData: `0x${string}`;
};

export type IndexDtfDecodedContractGroup = {
  readonly target: Address;
  readonly contract: string;
  readonly calls: readonly IndexDtfDecodedCalldata[];
};

export type IndexDtfUnknownContractGroup = {
  readonly target: Address;
  readonly contract: string;
  readonly calls: readonly IndexDtfUnknownCalldata[];
};

export type IndexDtfProposalDecoded = {
  readonly contracts: Readonly<Record<Address, string>>;
  readonly dataByContract: readonly IndexDtfDecodedContractGroup[];
  readonly unknownContracts: readonly IndexDtfUnknownContractGroup[];
  readonly calls: readonly IndexDtfDecodedCalldata[];
  readonly unknownCalls: readonly IndexDtfUnknownCalldata[];
};

export type IndexDtfProposalDetail = IndexDtfProposalSummary & {
  readonly timelockId?: Hex;
  readonly queueBlock?: number;
  readonly queueTime?: number;
  readonly cancellationTime?: number;
  readonly targets: readonly Address[];
  readonly calldatas: readonly `0x${string}`[];
  readonly votes: readonly IndexDtfProposalVote[];
  readonly forDelegateVotes: number;
  readonly againstDelegateVotes: number;
  readonly abstainDelegateVotes: number;
  readonly executionTxnHash?: `0x${string}`;
  readonly decoded: IndexDtfProposalDecoded;
};

export type IndexDtfDelegate = {
  readonly address: Address;
  readonly delegatedVotes: Amount;
  readonly numberVotes: number;
};

export type IndexDtfGuardianGroup =
  | {
      readonly governance: Address;
      readonly timelock: Address;
      readonly guardians: readonly Address[];
    }
  | {
      readonly governance: undefined;
      readonly timelock: undefined;
      readonly guardians: readonly Address[];
    };

export type IndexDtfGuardians = {
  readonly owner: IndexDtfGuardianGroup;
  readonly basket: IndexDtfGuardianGroup;
  readonly dao: IndexDtfGuardianGroup;
  readonly all: readonly Address[];
};

export type IndexDtfVoterState = {
  readonly account: Address;
  readonly delegate: Address;
  readonly balance: Amount;
  readonly votingPower: Amount;
  readonly voteSupply: Amount;
  readonly isSelfDelegated: boolean;
  readonly hasVotingPower: boolean;
};

export type IndexDtfProposerState = {
  readonly account: Address;
  readonly governance: Address;
  readonly votingPower: Amount;
  readonly proposalThreshold: Amount;
  readonly canPropose: boolean;
};

export type IndexDtfProposalVotes = {
  readonly againstVotes: Amount;
  readonly forVotes: Amount;
  readonly abstainVotes: Amount;
};

export type IndexDtfProposalVoterState = {
  readonly account: Address;
  readonly votingPower: Amount;
  readonly vote: string | null;
  readonly hasVoted: boolean;
  readonly hasVotingPower: boolean;
};

export type IndexDtfVoteSupport = 0 | 1 | 2;

export type IndexDtfProposalPayload = {
  readonly governance: Address;
  readonly timelock?: Address;
  readonly timelockId?: Hex;
  readonly targets: readonly Address[];
  readonly calldatas: readonly Hex[];
  readonly description: string;
};

export type IndexDtfCall = {
  readonly target: Address;
  readonly calldata: Hex;
};

export type IndexDtfTransactionOptions = {
  readonly account: Address;
};

type IndexDtfChainTransactionOptions = IndexDtfTransactionOptions & {
  readonly chainId: SupportedChainId;
};

export type IndexDtfDelegateVotesParams = IndexDtfTransactionOptions & {
  readonly stToken: Address;
  readonly delegatee: Address;
};

export type DelegateIndexDtfVotesParams = IndexDtfDelegateVotesParams &
  IndexDtfChainTransactionOptions;

export type IndexDtfVoteParams = IndexDtfTransactionOptions & {
  readonly governance: Address;
  readonly proposalId: string | bigint;
  readonly support: IndexDtfVoteSupport;
};

export type VoteIndexDtfProposalParams = IndexDtfVoteParams &
  IndexDtfChainTransactionOptions;

export type IndexDtfProposalTransactionParams = IndexDtfTransactionOptions & {
  readonly proposal: IndexDtfProposalPayload;
};

export type QueueIndexDtfProposalParams = IndexDtfProposalTransactionParams &
  IndexDtfChainTransactionOptions;

export type ExecuteIndexDtfProposalParams = IndexDtfProposalTransactionParams &
  IndexDtfChainTransactionOptions;

export type CancelIndexDtfProposalParams = IndexDtfProposalTransactionParams &
  IndexDtfChainTransactionOptions;

export type ProposeIndexDtfProposalParams = IndexDtfProposalTransactionParams &
  IndexDtfChainTransactionOptions;

export type IndexDtfGovernanceWriter = {
  readonly delegate: (params: IndexDtfDelegateVotesParams) => Promise<Hex>;
  readonly vote: (params: IndexDtfVoteParams) => Promise<Hex>;
  readonly queue: (params: IndexDtfProposalTransactionParams) => Promise<Hex>;
  readonly execute: (params: IndexDtfProposalTransactionParams) => Promise<Hex>;
  readonly cancel: (params: IndexDtfProposalTransactionParams) => Promise<Hex>;
  readonly propose: (params: IndexDtfProposalTransactionParams) => Promise<Hex>;
};
