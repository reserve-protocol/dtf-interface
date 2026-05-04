import type { Address } from "viem";
import type { SupportedChainId } from "../defaults.js";
import type {
  BlockNumber,
  BlockNumberParams,
  DtfParams,
  DtfStatus,
  Token as BaseToken,
} from "./common.js";

export type Token = BaseToken;

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

export type IndexDtfGovernance = {
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

export type IndexDtfAdminRoles = {
  // The protocol can expose multiple admin role members. In production this is
  // normally one timelock/admin. `primary` is what product workflows usually
  // care about; `all` preserves the raw role state.
  readonly primary: Address;
  readonly all: readonly Address[];
  // Previous admin authorities are needed to resolve/display historical
  // proposals after governance has changed.
  readonly legacy: readonly Address[];
};

export type IndexDtfRoles = {
  readonly admin: IndexDtfAdminRoles;
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

export type IndexDtfRebalanceConfig = {
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

export type IndexDtfPriceBasketToken = {
  readonly address: Address;
  readonly decimals: number;
  readonly name?: string;
  readonly symbol?: string;
};

export type IndexDtfPriceBasketAsset = {
  readonly token: IndexDtfPriceBasketToken;
  readonly amount: Amount;
  readonly weight: string;
  readonly price: number;
  readonly priceSource?: string;
};

export type IndexDtfPrice = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly price: number;
  readonly marketCap: number;
  readonly totalSupply: number;
  readonly basket: readonly IndexDtfPriceBasketAsset[];
  readonly timestamp: number;
};

export type IndexDtfBasketAsset = {
  readonly token: Token;
  readonly balance: Amount;
};

export type IndexDtfBasketAssetWithPrice = IndexDtfBasketAsset &
  Omit<IndexDtfPriceBasketAsset, "token">;

export type IndexDtfBasket = Record<Address, IndexDtfBasketAsset>;

export type IndexDtfBasketWithPrice = Omit<IndexDtfPrice, "basket"> & {
  basket: Record<Address, IndexDtfBasketAssetWithPrice>;
};

export type IndexDtfPricePoint = {
  readonly timestamp: number;
  readonly price: number;
};

export type IndexDtfBrandProfile = {
  readonly name?: string;
  readonly icon?: string;
  readonly link?: string;
};

export type IndexDtfBrandSocials = {
  readonly twitter?: string;
  readonly telegram?: string;
  readonly discord?: string;
  readonly website?: string;
};

export type IndexDtfBrand = {
  readonly hidden: boolean;
  readonly icon?: string;
  readonly cover?: string;
  readonly mobileCover?: string;
  readonly description?: string;
  readonly notesFromCreator?: string;
  readonly prospectus?: string;
  readonly tags: readonly string[];
  readonly basketType?: string;
  readonly creator?: IndexDtfBrandProfile;
  readonly curator?: IndexDtfBrandProfile;
  readonly socials: IndexDtfBrandSocials;
};

export type IndexDtfMarket = {
  readonly price: number;
  readonly marketCap: number;
  readonly totalSupply: number;
  readonly fetchedAt: number;
};

export type IndexDtfFull = IndexDtf & {
  readonly market: IndexDtfMarket;
  readonly basket: Record<Address, IndexDtfBasketAssetWithPrice>;
  readonly brand?: IndexDtfBrand;
};

export type IndexDtf = {
  readonly id: Address;
  readonly chainId: SupportedChainId;
  readonly token: TokenWithSnapshot;
  readonly mandate: string;
  readonly createdAt: number;
  readonly roles: IndexDtfRoles;
  readonly governance: IndexDtfGovernance;
  readonly voteLockVault?: VoteLockVault;
  readonly rebalance: IndexDtfRebalanceConfig;
  readonly fees: Fees;
  readonly financials: Financials;
};

export type IndexDtfInput = IndexDtf | DtfParams;

export type GetFullIndexDtfOptions = {
  readonly brand?: boolean;
};

export type GetFullIndexDtfParams = DtfParams & GetFullIndexDtfOptions;

export type GetIndexDtfParams = DtfParams & BlockNumberParams;

export type GetIndexDtfOptions = BlockNumberParams;

export type GetIndexDtfBasketParams = DtfParams & BlockNumberParams;

export type GetIndexDtfBasketOptions = BlockNumber | BlockNumberParams;

export type GetIndexDtfPriceParams = DtfParams;

export type GetIndexDtfPriceHistoryParams = DtfParams & {
  readonly from?: number;
  readonly to?: number;
  readonly interval?: "hour" | "day" | "week" | "month";
};

export type GetIndexDtfPriceHistoryOptions = Pick<
  GetIndexDtfPriceHistoryParams,
  "from" | "interval" | "to"
>;

export type ListIndexDtfsParams = {
  readonly chainId?: SupportedChainId;
  readonly status?: DtfStatus | readonly DtfStatus[];
};

export type IndexDtfGovernanceInput = Address | readonly Address[];

export type GetIndexDtfProposalsOptions = {
  readonly limit?: number;
};

export type GetIndexDtfProposalsParams = GetIndexDtfProposalsOptions &
  (
    | DtfParams
    | { readonly dtf: IndexDtf }
    | {
        readonly address?: Address;
        readonly chainId: SupportedChainId;
        readonly governanceAddresses: IndexDtfGovernanceInput;
      }
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

export type GetIndexDtfRebalancesParams = IndexDtfInput & {
  readonly limit?: number;
  readonly offset?: number;
};

export type GetIndexDtfRebalancesOptions = Pick<
  GetIndexDtfRebalancesParams,
  "limit" | "offset"
>;

export type GetIndexDtfRebalanceParams = {
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
  readonly timelockId?: string;
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

export type IndexDtfGovernanceOverview = {
  readonly proposals: readonly IndexDtfProposalSummary[];
  readonly proposalCount: number;
  readonly delegates: readonly IndexDtfDelegate[];
  readonly delegatesCount: number;
  readonly voteSupply: Amount;
};

export type IndexPricingProvider = {
  readonly getCurrent: (
    params: GetIndexDtfPriceParams,
  ) => Promise<IndexDtfPrice>;
  readonly getHistory?: (
    params: GetIndexDtfPriceHistoryParams,
  ) => Promise<readonly IndexDtfPricePoint[]>;
};

export type IndexBrandProvider = {
  readonly get: (params: DtfParams) => Promise<IndexDtfBrand | undefined>;
};
