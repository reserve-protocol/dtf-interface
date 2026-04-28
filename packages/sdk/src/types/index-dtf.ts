import type { Address } from "viem";
import type { SupportedChainId } from "../defaults.js";
import type { DtfBrand } from "./common.js";

export type Token = {
  readonly address: Address;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
};

export type Amount = {
  readonly raw: bigint;
  readonly formatted: string;
};

export type TokenSnapshot = {
  readonly currentHolderCount: number;
  readonly cumulativeHolderCount: number;
  readonly transferCount: number;
  readonly mintCount: number;
  readonly burnCount: number;
  readonly totalSupply: Amount;
  readonly totalBurned: Amount;
  readonly totalMinted: Amount;
};

export type TokenWithSnapshot = Token & {
  readonly snapshot: TokenSnapshot;
};

export type FeeRecipients = readonly {
  readonly address: Address;
  readonly percentage: string;
}[];

export type Fees = {
  readonly mintingFee: Amount;
  readonly tvlFee: Amount;
  readonly annualizedTvlFee: number;
  readonly recipients: FeeRecipients;
};

export type Timelock = {
  readonly address: Address;
  readonly guardians: readonly Address[];
  readonly executionDelay: number;
};

export type Governance = {
  readonly address: Address;
  readonly votingDelay: number;
  readonly votingPeriod: number;
  readonly proposalThreshold: number;
  readonly quorumNumerator: number;
  readonly quorumDenominator: number;
  readonly quorum: number;
  readonly timelock?: Timelock;
};

export type GovernanceAuthority = {
  readonly address: Address;
  readonly type: "governance";
  readonly governance: Governance;
};

export type AddressAuthority = {
  readonly address: Address;
  readonly type: "address";
};

export type Authority = GovernanceAuthority | AddressAuthority;

export type AuthorityGroup = {
  readonly primary?: Authority;
  readonly all: readonly Authority[];
};

export type IndexDTFGovernance = {
  readonly admin: AuthorityGroup;
  readonly rebalance: AuthorityGroup;
  readonly voteLock?: Authority;
  // Dedupe by controlling address/governance. If admin and rebalance are the
  // same authority, they should appear once here.
  readonly all: readonly Authority[];
};

export type VoteLockVault = {
  readonly token: TokenWithSnapshot;
  readonly underlying: Token;
  readonly governance?: Governance;
  readonly legacyGovernance: readonly Address[];
  readonly rewardTokens: readonly Token[];
};

export type IndexDTFAdminRoles = {
  // The protocol can expose multiple admin role members. In production this is
  // normally one timelock/admin. `primary` is what product workflows usually
  // care about; `all` preserves the raw role state.
  readonly primary: Address;
  readonly all: readonly Address[];
  // Previous admin authorities are needed to resolve/display historical
  // proposals after governance has changed.
  readonly legacy: readonly Address[];
};

export type IndexDTFRoles = {
  readonly admin: IndexDTFAdminRoles;
  readonly rebalance: {
    // Raw role state. These can be governance contracts or plain addresses.
    // The interpreted controller lives in `governance`.
    readonly auctionApprovers: readonly Address[];
    // Previous auction approvers are needed to resolve/display historical
    // rebalance proposals after governance has changed.
    readonly legacyAuctionApprovers: readonly Address[];
    readonly auctionLaunchers: readonly Address[];
  };
  readonly metadata: {
    readonly brandManagers: readonly Address[];
  };
  readonly deployment: {
    readonly proxyAdmin: Address;
    readonly deployer: Address;
  };
};

export type PriceControl = 0 | 1 | 2;

export type IndexDTFRebalanceConfig = {
  readonly auctionDelay: number;
  readonly auctionLength: number;
  readonly bidsEnabled?: boolean;
  readonly trustedFillerRegistry?: Address;
  readonly trustedFillerEnabled?: boolean;
  // Tracking DTFs preserve units; native DTFs can manage target weights.
  readonly weightControl: boolean;
  readonly priceControl: PriceControl;
};

export type Financials = {
  readonly totalRevenue: number;
  readonly protocolRevenue: number;
  readonly governanceRevenue: number;
  readonly externalRevenue: number;
};

export type IndexDTFPriceBasketAsset = {
  readonly token: Token;
  readonly amount: Amount;
  readonly weight: string;
  readonly price: number;
  readonly priceSource?: string;
};

export type IndexDTFPrice = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly price: number;
  readonly marketCap: number;
  readonly totalSupply: Amount;
  readonly basket: readonly IndexDTFPriceBasketAsset[];
  readonly timestamp: number;
};

export type IndexDTFPricePoint = {
  readonly timestamp: number;
  readonly price: number;
};

export type IndexDTFWithPrice = IndexDTF & {
  readonly price: IndexDTFPrice;
};

export type IndexDTFFull = IndexDTFWithPrice & {
  readonly brand?: DtfBrand;
};

export type IndexDTF = {
  readonly id: Address;
  readonly chainId: SupportedChainId;
  readonly token: TokenWithSnapshot;
  readonly mandate: string;
  readonly createdAt: number;
  readonly roles: IndexDTFRoles;
  readonly governance: IndexDTFGovernance;
  readonly voteLockVault?: VoteLockVault;
  readonly rebalance: IndexDTFRebalanceConfig;
  readonly fees: Fees;
  readonly financials: Financials;
};

export type GetIndexDTFParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
};

export type IndexDTFInput = IndexDTF | GetIndexDTFParams;

export type GetFullIndexDTFParams = GetIndexDTFParams;

export type GetIndexDTFPriceParams = GetIndexDTFParams;

export type GetIndexDTFPriceHistoryParams = GetIndexDTFParams & {
  readonly from?: number;
  readonly to?: number;
  readonly interval?: "hour" | "day" | "week" | "month";
};

export type ListIndexDTFsParams = {
  readonly chainId?: SupportedChainId;
};

export type GetIndexDTFProposalsParams = IndexDTFInput & {
  readonly limit?: number;
  readonly offset?: number;
};

export type GetAllIndexDTFProposalsParams = {
  readonly chainId: SupportedChainId;
  readonly limit?: number;
  readonly offset?: number;
  readonly states?: readonly ProposalState[];
};

export type GetIndexDTFProposalParams = {
  readonly id: string;
  readonly chainId: SupportedChainId;
};

export type GetIndexDTFRebalancesParams = IndexDTFInput & {
  readonly limit?: number;
  readonly offset?: number;
};

export type GetIndexDTFRebalanceParams = {
  readonly id: string;
  readonly chainId: SupportedChainId;
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
  | "QUORUM_NOT_REACHED"
  | string;

export type ProposalVotingState = {
  readonly state: ProposalState;
  readonly deadline: number | null;
  readonly quorum: boolean;
  readonly for: number;
  readonly against: number;
  readonly abstain: number;
};

export type IndexDTFProposalSummary = {
  readonly id: string;
  readonly chainId: SupportedChainId;
  readonly governance: Address;
  readonly dtf?: GetIndexDTFParams;
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
};

export type IndexDTFProposalVote = {
  readonly voter: Address;
  readonly choice: string;
  readonly weight: Amount;
};

export type IndexDTFProposalDetail = IndexDTFProposalSummary & {
  readonly timelockId?: string;
  readonly queueBlock?: number;
  readonly queueTime?: number;
  readonly cancellationTime?: number;
  readonly targets: readonly Address[];
  readonly calldatas: readonly `0x${string}`[];
  readonly votes: readonly IndexDTFProposalVote[];
  readonly forDelegateVotes: Amount;
  readonly againstDelegateVotes: Amount;
  readonly abstainDelegateVotes: Amount;
  readonly executionTxnHash?: `0x${string}`;
  readonly votingState: ProposalVotingState;
};

export type IndexDTFDelegate = {
  readonly address: Address;
  readonly delegatedVotes: Amount;
  readonly numberVotes: number;
};

export type IndexDTFGovernanceOverview = {
  readonly proposals: readonly IndexDTFProposalSummary[];
  readonly proposalCount: number;
  readonly delegates: readonly IndexDTFDelegate[];
  readonly delegatesCount: number;
  readonly voteSupply: Amount;
};

export type IndexPricingProvider = {
  readonly getCurrent: (
    params: GetIndexDTFPriceParams,
  ) => Promise<IndexDTFPrice>;
  readonly getHistory?: (
    params: GetIndexDTFPriceHistoryParams,
  ) => Promise<readonly IndexDTFPricePoint[]>;
};

export type IndexBrandProvider = {
  readonly get: (params: GetIndexDTFParams) => Promise<DtfBrand | undefined>;
};
