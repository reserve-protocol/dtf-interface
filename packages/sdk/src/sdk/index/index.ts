import type { Address } from "viem";
import type { SupportedChainId } from "../../defaults.js";
import type { DtfBrand } from "../../types/common.js";

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
  readonly bidsEnabled: boolean;
  readonly trustedFillerRegistry?: Address;
  readonly trustedFillerEnabled: boolean;
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

export type IndexDTFRef = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
};

export type IndexDTFInput = IndexDTF | IndexDTFRef;

export type GetIndexDTFParams = IndexDTFRef;

export type GetFullIndexDTFParams = IndexDTFRef;

export type GetIndexDTFPriceParams = IndexDTFRef;

export type GetIndexDTFPriceHistoryParams = IndexDTFRef & {
  readonly from?: number;
  readonly to?: number;
  readonly interval?: "hour" | "day" | "week" | "month";
};

export type ListIndexDTFsParams = {
  readonly chainId?: SupportedChainId;
};

export type GetIndexDTFProposalsParams = {
  readonly dtf: IndexDTFInput;
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

export type GetIndexDTFRebalancesParams = {
  readonly dtf: IndexDTFInput;
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
  readonly dtf?: IndexDTFRef;
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
  readonly getCurrent: (params: GetIndexDTFPriceParams) => Promise<IndexDTFPrice>;
  readonly getHistory?: (
    params: GetIndexDTFPriceHistoryParams,
  ) => Promise<readonly IndexDTFPricePoint[]>;
};

export type IndexBrandProvider = {
  readonly get: (params: IndexDTFRef) => Promise<DtfBrand | undefined>;
};

export function isIndexDTF(input: IndexDTFInput): input is IndexDTF {
  return "governance" in input && "roles" in input && "token" in input;
}

export function getIndexDTFRef(input: IndexDTFInput): IndexDTFRef {
  return {
    address: isIndexDTF(input) ? input.id : input.address,
    chainId: input.chainId,
  };
}

export function getIndexDTFProposalGovernanceAddresses(
  dtf: IndexDTF,
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

export async function getIndexDTF(
  _params: GetIndexDTFParams,
): Promise<IndexDTF> {
  throw new Error("getIndexDTF is not implemented yet.");
}

export async function listIndexDTFs(
  _params: ListIndexDTFsParams = {},
): Promise<readonly IndexDTF[]> {
  throw new Error("listIndexDTFs is not implemented yet.");
}

export async function getFullIndexDTF(
  _params: GetFullIndexDTFParams,
): Promise<IndexDTFFull> {
  throw new Error("getFullIndexDTF is not implemented yet.");
}

export async function getIndexDTFPrice(
  _params: GetIndexDTFPriceParams,
): Promise<IndexDTFPrice> {
  throw new Error("getIndexDTFPrice is not implemented yet.");
}

export async function getIndexDTFPriceHistory(
  _params: GetIndexDTFPriceHistoryParams,
): Promise<readonly IndexDTFPricePoint[]> {
  throw new Error("getIndexDTFPriceHistory is not implemented yet.");
}

export async function getProposals(
  _params: GetIndexDTFProposalsParams,
): Promise<readonly IndexDTFProposalSummary[]> {
  throw new Error("getProposals is not implemented yet.");
}

export async function getAllProposals(
  _params: GetAllIndexDTFProposalsParams,
): Promise<readonly IndexDTFProposalSummary[]> {
  throw new Error("getAllProposals is not implemented yet.");
}

export async function getProposal(
  _params: GetIndexDTFProposalParams,
): Promise<IndexDTFProposalDetail> {
  throw new Error("getProposal is not implemented yet.");
}

export async function getRebalance(
  _params: GetIndexDTFRebalanceParams,
): Promise<unknown> {
  throw new Error("getRebalance is not implemented yet.");
}

export async function getRebalances(
  _params: GetIndexDTFRebalancesParams,
): Promise<readonly unknown[]> {
  throw new Error("getRebalances is not implemented yet.");
}

function dedupeAddresses(addresses: readonly Address[]): readonly Address[] {
  return [...new Set(addresses)];
}
