import type { Address, Hex } from "viem";

import type { ContractCall } from "@/contract-call";
import type { SupportedChainId } from "@/defaults";
import type { DtfParams } from "@/types/common";
import type { Amount } from "@/types/common";
import type { IndexDtf } from "@/types/index-dtf";

export type IndexDtfGovernanceInput = Address | readonly Address[];

export type GetIndexDtfProposalsOptions = {
  readonly limit?: number;
  readonly includeOptimisticState?: boolean;
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
  (GetIndexDtfProposalsByAddressParams | GetIndexDtfProposalsByDtfParams | GetIndexDtfProposalsByGovernanceParams);

export type GetAllIndexDtfProposalsParams = {
  readonly chainId: SupportedChainId;
  readonly limit?: number;
  readonly offset?: number;
  readonly states?: readonly ProposalState[];
  readonly includeOptimisticState?: boolean;
};

export type GetIndexDtfProposalParams = {
  readonly proposalId: string;
} & DtfParams;

export type GetIndexDtfProposalStateParams = {
  readonly chainId: SupportedChainId;
  readonly governance: Address;
  readonly proposalId: string | bigint;
};

export type GetIndexDtfProposalStatesParams = {
  readonly chainId: SupportedChainId;
  readonly governance: Address;
  readonly proposalIds: readonly (string | bigint)[];
};

export type IndexDtfProposalRpcDetails = {
  readonly proposalId: string;
  readonly state: ProposalState;
  readonly eta: bigint;
  readonly deadline: bigint;
  readonly snapshot: bigint;
};

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

export type GetIndexDtfOptimisticVotesParams = {
  readonly chainId: SupportedChainId;
  readonly voteToken: Address;
  readonly account: Address;
};

export type GetIndexDtfPastOptimisticVotesParams =
  GetIndexDtfOptimisticVotesParams & {
    readonly timepoint?: bigint;
  };

export type GetIndexDtfOptimisticProposalContextParams = {
  readonly chainId: SupportedChainId;
  readonly governance: Address;
  readonly proposalId: string | bigint;
  readonly isOptimistic?: boolean;
};

export type GetIndexDtfLegacyVoteLocksParams =
  | DtfParams
  | { readonly dtf: IndexDtf }
  | {
      readonly chainId: SupportedChainId;
      readonly currentVoteLock: Address;
      readonly legacyGovernance: readonly Address[];
    };

export type GetIndexDtfOptimisticGovernanceParams = {
  readonly chainId: SupportedChainId;
  readonly governance: Address;
};

export type GetIndexDtfProposalThrottleChargesParams =
  GetIndexDtfOptimisticGovernanceParams & {
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
    "id" | "isOptimistic" | "optimistic" | "voteStart" | "voteToken" | "votes"
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
  readonly vetoReached: boolean;
  readonly for: number;
  readonly against: number;
  readonly abstain: number;
};

export type IndexDtfOptimisticGovernanceParams = {
  readonly vetoDelay: bigint;
  readonly vetoPeriod: bigint;
  readonly vetoThreshold: bigint;
};

export type IndexDtfOptimisticProposalContext = {
  readonly proposalId: string;
  readonly voteToken: Address;
  readonly snapshot: bigint;
  readonly snapshotSupply: Amount;
  readonly vetoThreshold: bigint;
  readonly vetoThresholdVotes: Amount;
};

export type IndexDtfOptimisticGovernance = {
  readonly governance: Address;
  readonly token: Address;
  readonly timelock: Address;
  readonly selectorRegistry: Address;
  readonly lateQuorumVoteExtension: bigint;
  readonly proposalThrottleCapacity: bigint;
  readonly optimisticParams: IndexDtfOptimisticGovernanceParams;
  readonly optimisticProposers: readonly Address[];
  readonly guardians: readonly Address[];
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
  readonly isOptimistic?: boolean;
  readonly vetoThreshold?: bigint;
  readonly voteToken?: Address;
  readonly optimistic?: IndexDtfOptimisticProposalContext;
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
  readonly optimisticDelegatedVotes: Amount;
  readonly numberVotes: number;
  readonly numberOptimisticVotes: number;
  readonly hasBeenStandardDelegate: boolean;
  readonly hasBeenOptimisticDelegate: boolean;
  readonly tokenHoldersRepresentedAmount: number;
  readonly optimisticTokenHoldersRepresentedAmount: number;
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
  readonly optimisticDelegate: Address | null;
  readonly balance: Amount;
  readonly votingPower: Amount;
  readonly optimisticVotingPower: Amount | null;
  readonly voteSupply: Amount;
  readonly isSelfDelegated: boolean;
  readonly isOptimisticSelfDelegated: boolean;
  readonly hasVotingPower: boolean;
  readonly hasOptimisticVotingPower: boolean;
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
  readonly optimisticVotingPower: Amount | null;
  readonly vote: string | null;
  readonly hasVoted: boolean;
  readonly hasVotingPower: boolean;
  readonly hasOptimisticVotingPower: boolean;
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

export type IndexDtfCall = ContractCall;

export type IndexDtfVoteParams = {
  readonly chainId: SupportedChainId;
  readonly governance: Address;
  readonly proposalId: string | bigint;
  readonly support: IndexDtfVoteSupport;
};

export type VoteIndexDtfProposalParams = IndexDtfVoteParams;

export type IndexDtfProposalActionParams = {
  readonly chainId: SupportedChainId;
  readonly proposal: IndexDtfProposalPayload;
};

export type QueueIndexDtfProposalParams = IndexDtfProposalActionParams;

export type ExecuteIndexDtfProposalParams = IndexDtfProposalActionParams;

export type CancelIndexDtfProposalParams = IndexDtfProposalActionParams;

export type ProposeIndexDtfProposalParams = IndexDtfProposalActionParams;

export type SubmitOptimisticIndexDtfProposalParams =
  IndexDtfProposalActionParams;
