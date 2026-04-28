/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigDecimal: { input: any; output: any };
  BigInt: { input: any; output: any };
  Bytes: { input: any; output: any };
  /** 8 bytes signed integer */
  Int8: { input: any; output: any };
  /** A string representation of microseconds UNIX timestamp (16 digits) */
  Timestamp: { input: any; output: any };
};

export type Account = {
  __typename?: "Account";
  /**  Token balances that this account holds  */
  balances: Array<AccountBalance>;
  /**  Token balances snapshot that this account holds  */
  balancesSnapshot: Array<AccountBalanceDailySnapshot>;
  /**  Address of the account  */
  id: Scalars["ID"]["output"];
  /**  Locks  */
  locks: Array<Lock>;
  /**  Token mintings to this account  */
  mintings: Array<Minting>;
  /**  Reward claims  */
  rewardClaims: Array<RewardClaim>;
  /**  Token transfers from this account  */
  transferFrom: Array<TransferEvent>;
  /**  Token transfers to this account  */
  transferTo: Array<TransferEvent>;
};

export type AccountBalancesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AccountBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<AccountBalance_Filter>;
};

export type AccountBalancesSnapshotArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AccountBalanceDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<AccountBalanceDailySnapshot_Filter>;
};

export type AccountLocksArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Lock_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Lock_Filter>;
};

export type AccountMintingsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Minting_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Minting_Filter>;
};

export type AccountRewardClaimsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RewardClaim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<RewardClaim_Filter>;
};

export type AccountTransferFromArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TransferEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<TransferEvent_Filter>;
};

export type AccountTransferToArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TransferEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<TransferEvent_Filter>;
};

export type AccountBalance = {
  __typename?: "AccountBalance";
  /**  Account address  */
  account: Account;
  /**  Current account balance  */
  amount: Scalars["BigInt"]["output"];
  /**  Block number in which the balance was last modified  */
  blockNumber?: Maybe<Scalars["BigInt"]["output"]>;
  /**  Timestamp when current uninterrupted holding period started (resets when balance goes to 0)  */
  currentHoldStartTimestamp?: Maybe<Scalars["BigInt"]["output"]>;
  /**  Delegate, used for stTokens  */
  delegate?: Maybe<Delegate>;
  /**  First timestamp when the account held this token (amount > 0)  */
  firstHoldTimestamp?: Maybe<Scalars["BigInt"]["output"]>;
  /**  { Address Of the Account }-{ Address of the Token } */
  id: Scalars["ID"]["output"];
  /**  Timestamp in which the balance was last modified  */
  timestamp?: Maybe<Scalars["BigInt"]["output"]>;
  /**  Token address  */
  token: Token;
};

export type AccountBalanceDailySnapshot = {
  __typename?: "AccountBalanceDailySnapshot";
  /**  Account address  */
  account: Account;
  /**  Current account balance  */
  amount: Scalars["BigInt"]["output"];
  /**  Block number in which the balance was last modified  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  { Address Of the Account }-{ Address of the Token }-{ # of hours since Unix epoch time }  */
  id: Scalars["ID"]["output"];
  /**  Timestamp in which the balance was last modified  */
  timestamp: Scalars["BigInt"]["output"];
  /**  Token address  */
  token: Token;
};

export type AccountBalanceDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<AccountBalanceDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<AccountBalanceDailySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum AccountBalanceDailySnapshot_OrderBy {
  Account = "account",
  AccountId = "account__id",
  Amount = "amount",
  BlockNumber = "blockNumber",
  Id = "id",
  Timestamp = "timestamp",
  Token = "token",
  TokenAddress = "token__address",
  TokenBurnCount = "token__burnCount",
  TokenCumulativeHolderCount = "token__cumulativeHolderCount",
  TokenCurrentHolderCount = "token__currentHolderCount",
  TokenDecimals = "token__decimals",
  TokenId = "token__id",
  TokenMintCount = "token__mintCount",
  TokenName = "token__name",
  TokenSymbol = "token__symbol",
  TokenTotalBurned = "token__totalBurned",
  TokenTotalMinted = "token__totalMinted",
  TokenTotalSupply = "token__totalSupply",
  TokenTransferCount = "token__transferCount",
  TokenType = "token__type",
}

export type AccountBalance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<AccountBalance_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  currentHoldStartTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHoldStartTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHoldStartTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHoldStartTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  currentHoldStartTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHoldStartTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHoldStartTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHoldStartTimestamp_not_in?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  delegate?: InputMaybe<Scalars["String"]["input"]>;
  delegate_?: InputMaybe<Delegate_Filter>;
  delegate_contains?: InputMaybe<Scalars["String"]["input"]>;
  delegate_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_gt?: InputMaybe<Scalars["String"]["input"]>;
  delegate_gte?: InputMaybe<Scalars["String"]["input"]>;
  delegate_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  delegate_lt?: InputMaybe<Scalars["String"]["input"]>;
  delegate_lte?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  delegate_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  firstHoldTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstHoldTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstHoldTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstHoldTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  firstHoldTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstHoldTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstHoldTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstHoldTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<AccountBalance_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum AccountBalance_OrderBy {
  Account = "account",
  AccountId = "account__id",
  Amount = "amount",
  BlockNumber = "blockNumber",
  CurrentHoldStartTimestamp = "currentHoldStartTimestamp",
  Delegate = "delegate",
  DelegateAddress = "delegate__address",
  DelegateDelegatedVotes = "delegate__delegatedVotes",
  DelegateDelegatedVotesRaw = "delegate__delegatedVotesRaw",
  DelegateId = "delegate__id",
  DelegateNumberVotes = "delegate__numberVotes",
  DelegateTokenHoldersRepresentedAmount = "delegate__tokenHoldersRepresentedAmount",
  FirstHoldTimestamp = "firstHoldTimestamp",
  Id = "id",
  Timestamp = "timestamp",
  Token = "token",
  TokenAddress = "token__address",
  TokenBurnCount = "token__burnCount",
  TokenCumulativeHolderCount = "token__cumulativeHolderCount",
  TokenCurrentHolderCount = "token__currentHolderCount",
  TokenDecimals = "token__decimals",
  TokenId = "token__id",
  TokenMintCount = "token__mintCount",
  TokenName = "token__name",
  TokenSymbol = "token__symbol",
  TokenTotalBurned = "token__totalBurned",
  TokenTotalMinted = "token__totalMinted",
  TokenTotalSupply = "token__totalSupply",
  TokenTransferCount = "token__transferCount",
  TokenType = "token__type",
}

export type Account_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  balancesSnapshot_?: InputMaybe<AccountBalanceDailySnapshot_Filter>;
  balances_?: InputMaybe<AccountBalance_Filter>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  locks_?: InputMaybe<Lock_Filter>;
  mintings_?: InputMaybe<Minting_Filter>;
  or?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  rewardClaims_?: InputMaybe<RewardClaim_Filter>;
  transferFrom_?: InputMaybe<TransferEvent_Filter>;
  transferTo_?: InputMaybe<TransferEvent_Filter>;
};

export enum Account_OrderBy {
  Balances = "balances",
  BalancesSnapshot = "balancesSnapshot",
  Id = "id",
  Locks = "locks",
  Mintings = "mintings",
  RewardClaims = "rewardClaims",
  TransferFrom = "transferFrom",
  TransferTo = "transferTo",
}

export enum Aggregation_Interval {
  Day = "day",
  Hour = "hour",
}

export type Auction = {
  __typename?: "Auction";
  /**  bids  */
  bids: Array<RebalanceAuctionBid>;
  /**  block number  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  DTF  */
  dtf: Dtf;
  /**  end time  */
  endTime: Scalars["BigInt"]["output"];
  /**  { DTF Address }-{ Rebalance ID }-{ Auction ID }  */
  id: Scalars["ID"]["output"];
  /**  Price high limit  */
  priceHighLimit: Array<Scalars["BigInt"]["output"]>;
  /**  Price low limit  */
  priceLowLimit: Array<Scalars["BigInt"]["output"]>;
  /**  Rebalance  */
  rebalance: Rebalance;
  /**  Rebalance high limit  */
  rebalanceHighLimit: Scalars["BigInt"]["output"];
  /**  Rebalance low limit  */
  rebalanceLowLimit: Scalars["BigInt"]["output"];
  /**  Rebalance spot limit  */
  rebalanceSpotLimit: Scalars["BigInt"]["output"];
  /**  start time  */
  startTime: Scalars["BigInt"]["output"];
  /**  timestamp  */
  timestamp: Scalars["BigInt"]["output"];
  /**  auctioned tokens  */
  tokens: Array<Token>;
  /**  transaction hash  */
  transactionHash: Scalars["String"]["output"];
  /**  Weight high limit  */
  weightHighLimit: Array<Scalars["BigInt"]["output"]>;
  /**  Weight low limit  */
  weightLowLimit: Array<Scalars["BigInt"]["output"]>;
  /**  Weight spot limit  */
  weightSpotLimit: Array<Scalars["BigInt"]["output"]>;
};

export type AuctionBidsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RebalanceAuctionBid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<RebalanceAuctionBid_Filter>;
};

export type AuctionTokensArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Token_Filter>;
};

/**  @deprecated - v1.0 / v2.0 auctions  */
export type AuctionBid = {
  __typename?: "AuctionBid";
  /**  The auction/trade this bid belongs to  */
  auction: Trade;
  /**  Address of the account that placed the bid  */
  bidder: Scalars["Bytes"]["output"];
  /**  Block number when this bid was created  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  Amount of tokens being bought in this bid  */
  buyAmount: Scalars["BigInt"]["output"];
  /**  DTF contract reference  */
  dtf: Dtf;
  /**  { DTF Address }-{ Trade ID }-{ Bidder Address }-{ log Index }  */
  id: Scalars["ID"]["output"];
  /**  Amount of tokens being sold in this bid  */
  sellAmount: Scalars["BigInt"]["output"];
  /**  Timestamp when this bid was created  */
  timestamp: Scalars["BigInt"]["output"];
  /**  Transaction hash of the bid transaction  */
  transactionHash: Scalars["String"]["output"];
};

export type AuctionBid_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AuctionBid_Filter>>>;
  auction?: InputMaybe<Scalars["String"]["input"]>;
  auction_?: InputMaybe<Trade_Filter>;
  auction_contains?: InputMaybe<Scalars["String"]["input"]>;
  auction_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  auction_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  auction_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  auction_gt?: InputMaybe<Scalars["String"]["input"]>;
  auction_gte?: InputMaybe<Scalars["String"]["input"]>;
  auction_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auction_lt?: InputMaybe<Scalars["String"]["input"]>;
  auction_lte?: InputMaybe<Scalars["String"]["input"]>;
  auction_not?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auction_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  auction_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  auction_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bidder?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  bidder_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buyAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buyAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dtf?: InputMaybe<Scalars["String"]["input"]>;
  dtf_?: InputMaybe<Dtf_Filter>;
  dtf_contains?: InputMaybe<Scalars["String"]["input"]>;
  dtf_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_gt?: InputMaybe<Scalars["String"]["input"]>;
  dtf_gte?: InputMaybe<Scalars["String"]["input"]>;
  dtf_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  dtf_lt?: InputMaybe<Scalars["String"]["input"]>;
  dtf_lte?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  dtf_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<AuctionBid_Filter>>>;
  sellAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  sellAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  transactionHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum AuctionBid_OrderBy {
  Auction = "auction",
  AuctionApprovedBlockNumber = "auction__approvedBlockNumber",
  AuctionApprovedBuyLimitSpot = "auction__approvedBuyLimitSpot",
  AuctionApprovedEndPrice = "auction__approvedEndPrice",
  AuctionApprovedSellLimitSpot = "auction__approvedSellLimitSpot",
  AuctionApprovedStartPrice = "auction__approvedStartPrice",
  AuctionApprovedTimestamp = "auction__approvedTimestamp",
  AuctionApprovedTransactionHash = "auction__approvedTransactionHash",
  AuctionAvailableAt = "auction__availableAt",
  AuctionAvailableRuns = "auction__availableRuns",
  AuctionBoughtAmount = "auction__boughtAmount",
  AuctionBuyLimitHigh = "auction__buyLimitHigh",
  AuctionBuyLimitLow = "auction__buyLimitLow",
  AuctionBuyLimitSpot = "auction__buyLimitSpot",
  AuctionClosedBlockNumber = "auction__closedBlockNumber",
  AuctionClosedTimestamp = "auction__closedTimestamp",
  AuctionClosedTransactionHash = "auction__closedTransactionHash",
  AuctionEnd = "auction__end",
  AuctionEndPrice = "auction__endPrice",
  AuctionId = "auction__id",
  AuctionIsKilled = "auction__isKilled",
  AuctionLaunchTimeout = "auction__launchTimeout",
  AuctionLaunchedBlockNumber = "auction__launchedBlockNumber",
  AuctionLaunchedTimestamp = "auction__launchedTimestamp",
  AuctionLaunchedTransactionHash = "auction__launchedTransactionHash",
  AuctionSellLimitHigh = "auction__sellLimitHigh",
  AuctionSellLimitLow = "auction__sellLimitLow",
  AuctionSellLimitSpot = "auction__sellLimitSpot",
  AuctionSoldAmount = "auction__soldAmount",
  AuctionStart = "auction__start",
  AuctionStartPrice = "auction__startPrice",
  AuctionState = "auction__state",
  Bidder = "bidder",
  BlockNumber = "blockNumber",
  BuyAmount = "buyAmount",
  Dtf = "dtf",
  DtfAnnualizedTvlFee = "dtf__annualizedTvlFee",
  DtfAuctionDelay = "dtf__auctionDelay",
  DtfAuctionLength = "dtf__auctionLength",
  DtfBidsEnabled = "dtf__bidsEnabled",
  DtfBlockNumber = "dtf__blockNumber",
  DtfDeployer = "dtf__deployer",
  DtfExternalRevenue = "dtf__externalRevenue",
  DtfFeeRecipients = "dtf__feeRecipients",
  DtfGovernanceRevenue = "dtf__governanceRevenue",
  DtfId = "dtf__id",
  DtfMandate = "dtf__mandate",
  DtfMintingFee = "dtf__mintingFee",
  DtfOwnerAddress = "dtf__ownerAddress",
  DtfPriceControl = "dtf__priceControl",
  DtfProtocolRevenue = "dtf__protocolRevenue",
  DtfProxyAdmin = "dtf__proxyAdmin",
  DtfStTokenAddress = "dtf__stTokenAddress",
  DtfTimestamp = "dtf__timestamp",
  DtfTotalRevenue = "dtf__totalRevenue",
  DtfTrustedFillerEnabled = "dtf__trustedFillerEnabled",
  DtfTrustedFillerRegistry = "dtf__trustedFillerRegistry",
  DtfTvlFee = "dtf__tvlFee",
  DtfWeightControl = "dtf__weightControl",
  Id = "id",
  SellAmount = "sellAmount",
  Timestamp = "timestamp",
  TransactionHash = "transactionHash",
}

export type Auction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Auction_Filter>>>;
  bids_?: InputMaybe<RebalanceAuctionBid_Filter>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dtf?: InputMaybe<Scalars["String"]["input"]>;
  dtf_?: InputMaybe<Dtf_Filter>;
  dtf_contains?: InputMaybe<Scalars["String"]["input"]>;
  dtf_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_gt?: InputMaybe<Scalars["String"]["input"]>;
  dtf_gte?: InputMaybe<Scalars["String"]["input"]>;
  dtf_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  dtf_lt?: InputMaybe<Scalars["String"]["input"]>;
  dtf_lte?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  dtf_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  endTime?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTime_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTime_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTime_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  endTime_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTime_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTime_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTime_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Auction_Filter>>>;
  priceHighLimit?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceHighLimit_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceHighLimit_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  priceHighLimit_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceHighLimit_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceHighLimit_not_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  priceLowLimit?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceLowLimit_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceLowLimit_contains_nocase?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceLowLimit_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceLowLimit_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceLowLimit_not_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  rebalance?: InputMaybe<Scalars["String"]["input"]>;
  rebalanceHighLimit?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rebalanceHighLimit_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rebalanceLowLimit?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rebalanceLowLimit_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rebalanceSpotLimit?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rebalanceSpotLimit_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rebalance_?: InputMaybe<Rebalance_Filter>;
  rebalance_contains?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_gt?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_gte?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rebalance_lt?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_lte?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_not?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rebalance_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  rebalance_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  startTime?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTime_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTime_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTime_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  startTime_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTime_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTime_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTime_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tokens?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokens_?: InputMaybe<Token_Filter>;
  tokens_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokens_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokens_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokens_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokens_not_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  transactionHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  weightHighLimit?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightHighLimit_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightHighLimit_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  weightHighLimit_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightHighLimit_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightHighLimit_not_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  weightLowLimit?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightLowLimit_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightLowLimit_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  weightLowLimit_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightLowLimit_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightLowLimit_not_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  weightSpotLimit?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightSpotLimit_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightSpotLimit_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  weightSpotLimit_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightSpotLimit_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightSpotLimit_not_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
};

export enum Auction_OrderBy {
  Bids = "bids",
  BlockNumber = "blockNumber",
  Dtf = "dtf",
  DtfAnnualizedTvlFee = "dtf__annualizedTvlFee",
  DtfAuctionDelay = "dtf__auctionDelay",
  DtfAuctionLength = "dtf__auctionLength",
  DtfBidsEnabled = "dtf__bidsEnabled",
  DtfBlockNumber = "dtf__blockNumber",
  DtfDeployer = "dtf__deployer",
  DtfExternalRevenue = "dtf__externalRevenue",
  DtfFeeRecipients = "dtf__feeRecipients",
  DtfGovernanceRevenue = "dtf__governanceRevenue",
  DtfId = "dtf__id",
  DtfMandate = "dtf__mandate",
  DtfMintingFee = "dtf__mintingFee",
  DtfOwnerAddress = "dtf__ownerAddress",
  DtfPriceControl = "dtf__priceControl",
  DtfProtocolRevenue = "dtf__protocolRevenue",
  DtfProxyAdmin = "dtf__proxyAdmin",
  DtfStTokenAddress = "dtf__stTokenAddress",
  DtfTimestamp = "dtf__timestamp",
  DtfTotalRevenue = "dtf__totalRevenue",
  DtfTrustedFillerEnabled = "dtf__trustedFillerEnabled",
  DtfTrustedFillerRegistry = "dtf__trustedFillerRegistry",
  DtfTvlFee = "dtf__tvlFee",
  DtfWeightControl = "dtf__weightControl",
  EndTime = "endTime",
  Id = "id",
  PriceHighLimit = "priceHighLimit",
  PriceLowLimit = "priceLowLimit",
  Rebalance = "rebalance",
  RebalanceHighLimit = "rebalanceHighLimit",
  RebalanceLowLimit = "rebalanceLowLimit",
  RebalanceSpotLimit = "rebalanceSpotLimit",
  RebalanceAvailableUntil = "rebalance__availableUntil",
  RebalanceBidsEnabled = "rebalance__bidsEnabled",
  RebalanceBlockNumber = "rebalance__blockNumber",
  RebalanceId = "rebalance__id",
  RebalanceNonce = "rebalance__nonce",
  RebalancePriceControl = "rebalance__priceControl",
  RebalanceRebalanceHighLimit = "rebalance__rebalanceHighLimit",
  RebalanceRebalanceLowLimit = "rebalance__rebalanceLowLimit",
  RebalanceRebalanceSpotLimit = "rebalance__rebalanceSpotLimit",
  RebalanceRestrictedUntil = "rebalance__restrictedUntil",
  RebalanceStartedAt = "rebalance__startedAt",
  RebalanceTimestamp = "rebalance__timestamp",
  RebalanceTransactionHash = "rebalance__transactionHash",
  StartTime = "startTime",
  Timestamp = "timestamp",
  Tokens = "tokens",
  TransactionHash = "transactionHash",
  WeightHighLimit = "weightHighLimit",
  WeightLowLimit = "weightLowLimit",
  WeightSpotLimit = "weightSpotLimit",
}

export type BlockChangedFilter = {
  number_gte: Scalars["Int"]["input"];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars["Bytes"]["input"]>;
  number?: InputMaybe<Scalars["Int"]["input"]>;
  number_gte?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Dtf = {
  __typename?: "DTF";
  /**  Default admins  */
  admins: Array<Scalars["String"]["output"]>;
  /**  Annualized tvl fee  */
  annualizedTvlFee: Scalars["BigInt"]["output"];
  /**  Auction approvers  */
  auctionApprovers: Array<Scalars["String"]["output"]>;
  /**  Auction delay  */
  auctionDelay: Scalars["BigInt"]["output"];
  /**  Auction launchers  */
  auctionLaunchers: Array<Scalars["String"]["output"]>;
  /**  Auction length  */
  auctionLength: Scalars["BigInt"]["output"];
  /**  Bids enabled (v5.0+)  */
  bidsEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**  Deployed block number  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  Brand managers  */
  brandManagers: Array<Scalars["String"]["output"]>;
  /**  Folio deployer address  */
  deployer: Scalars["Bytes"]["output"];
  /**  External recipients revenue  */
  externalRevenue: Scalars["BigInt"]["output"];
  /**  Fee recipients  */
  feeRecipients: Scalars["String"]["output"];
  /**  Governance revenue  */
  governanceRevenue: Scalars["BigInt"]["output"];
  id: Scalars["ID"]["output"];
  /**  Legacy admins  */
  legacyAdmins: Array<Scalars["String"]["output"]>;
  /**  Legacy auction approvers  */
  legacyAuctionApprovers: Array<Scalars["String"]["output"]>;
  /**  mandate  */
  mandate: Scalars["String"]["output"];
  /**  Minting fee  */
  mintingFee: Scalars["BigInt"]["output"];
  /**  Onwer address - should be the timelock for governed tokens  */
  ownerAddress: Scalars["Bytes"]["output"];
  /**  Owner governance address  */
  ownerGovernance?: Maybe<Governance>;
  /**  Price control  */
  priceControl: Scalars["Int"]["output"];
  /**  Protocol revenue  */
  protocolRevenue: Scalars["BigInt"]["output"];
  /**  Proxy admin address  */
  proxyAdmin: Scalars["Bytes"]["output"];
  /**  Rebalances  */
  rebalances: Array<Rebalance>;
  /**  stDAO  */
  stToken?: Maybe<StakingToken>;
  /**  staking token, backup in case of external staking token not indexed */
  stTokenAddress?: Maybe<Scalars["Bytes"]["output"]>;
  /**  Deployed timestamp  */
  timestamp: Scalars["BigInt"]["output"];
  /**  Folio ERC20 token address  */
  token: Token;
  /**  Revenue  */
  totalRevenue: Scalars["BigInt"]["output"];
  /**  Trading governance address  */
  tradingGovernance?: Maybe<Governance>;
  /**  Trusted filler enabled (v5.0+)  */
  trustedFillerEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**  Trusted filler registry address (v5.0+)  */
  trustedFillerRegistry?: Maybe<Scalars["Bytes"]["output"]>;
  /**  tvl Fee  */
  tvlFee: Scalars["BigInt"]["output"];
  /**  Weight control  */
  weightControl: Scalars["Boolean"]["output"];
};

export type DtfRebalancesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Rebalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Rebalance_Filter>;
};

export type Dtf_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  admins?: InputMaybe<Array<Scalars["String"]["input"]>>;
  admins_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  admins_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  admins_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  admins_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  admins_not_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Dtf_Filter>>>;
  annualizedTvlFee?: InputMaybe<Scalars["BigInt"]["input"]>;
  annualizedTvlFee_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  annualizedTvlFee_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  annualizedTvlFee_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  annualizedTvlFee_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  annualizedTvlFee_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  annualizedTvlFee_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  annualizedTvlFee_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  auctionApprovers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auctionApprovers_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auctionApprovers_contains_nocase?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  auctionApprovers_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auctionApprovers_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auctionApprovers_not_contains_nocase?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  auctionDelay?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionDelay_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionDelay_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionDelay_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  auctionDelay_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionDelay_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionDelay_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionDelay_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  auctionLaunchers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auctionLaunchers_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auctionLaunchers_contains_nocase?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  auctionLaunchers_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auctionLaunchers_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auctionLaunchers_not_contains_nocase?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  auctionLength?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionLength_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionLength_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionLength_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  auctionLength_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionLength_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionLength_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  auctionLength_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  bidsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  bidsEnabled_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  bidsEnabled_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  bidsEnabled_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  brandManagers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  brandManagers_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  brandManagers_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  brandManagers_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  brandManagers_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  brandManagers_not_contains_nocase?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  deployer?: InputMaybe<Scalars["Bytes"]["input"]>;
  deployer_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  deployer_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  deployer_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  deployer_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  deployer_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  deployer_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  deployer_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  deployer_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  deployer_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  externalRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  externalRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  externalRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  externalRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  externalRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  externalRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  externalRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  externalRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  feeRecipients?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_contains?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_gt?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_gte?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  feeRecipients_lt?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_lte?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_not?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  feeRecipients_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  feeRecipients_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governanceRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governanceRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  legacyAdmins?: InputMaybe<Array<Scalars["String"]["input"]>>;
  legacyAdmins_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  legacyAdmins_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  legacyAdmins_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  legacyAdmins_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  legacyAdmins_not_contains_nocase?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  legacyAuctionApprovers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  legacyAuctionApprovers_contains?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  legacyAuctionApprovers_contains_nocase?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  legacyAuctionApprovers_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  legacyAuctionApprovers_not_contains?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  legacyAuctionApprovers_not_contains_nocase?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  mandate?: InputMaybe<Scalars["String"]["input"]>;
  mandate_contains?: InputMaybe<Scalars["String"]["input"]>;
  mandate_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  mandate_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  mandate_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  mandate_gt?: InputMaybe<Scalars["String"]["input"]>;
  mandate_gte?: InputMaybe<Scalars["String"]["input"]>;
  mandate_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  mandate_lt?: InputMaybe<Scalars["String"]["input"]>;
  mandate_lte?: InputMaybe<Scalars["String"]["input"]>;
  mandate_not?: InputMaybe<Scalars["String"]["input"]>;
  mandate_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  mandate_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  mandate_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  mandate_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  mandate_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  mandate_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  mandate_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  mandate_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  mandate_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  mintingFee?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintingFee_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintingFee_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintingFee_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  mintingFee_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintingFee_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintingFee_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintingFee_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Dtf_Filter>>>;
  ownerAddress?: InputMaybe<Scalars["Bytes"]["input"]>;
  ownerAddress_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  ownerAddress_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  ownerAddress_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  ownerAddress_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  ownerAddress_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  ownerAddress_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  ownerAddress_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  ownerAddress_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  ownerAddress_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  ownerGovernance?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_?: InputMaybe<Governance_Filter>;
  ownerGovernance_contains?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_gt?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_gte?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  ownerGovernance_lt?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_lte?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_not?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  ownerGovernance_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  ownerGovernance_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  ownerGovernance_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  priceControl?: InputMaybe<Scalars["Int"]["input"]>;
  priceControl_gt?: InputMaybe<Scalars["Int"]["input"]>;
  priceControl_gte?: InputMaybe<Scalars["Int"]["input"]>;
  priceControl_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  priceControl_lt?: InputMaybe<Scalars["Int"]["input"]>;
  priceControl_lte?: InputMaybe<Scalars["Int"]["input"]>;
  priceControl_not?: InputMaybe<Scalars["Int"]["input"]>;
  priceControl_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  protocolRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  protocolRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  protocolRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  proxyAdmin?: InputMaybe<Scalars["Bytes"]["input"]>;
  proxyAdmin_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  proxyAdmin_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  proxyAdmin_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  proxyAdmin_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  proxyAdmin_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  proxyAdmin_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  proxyAdmin_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  proxyAdmin_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  proxyAdmin_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  rebalances_?: InputMaybe<Rebalance_Filter>;
  stToken?: InputMaybe<Scalars["String"]["input"]>;
  stTokenAddress?: InputMaybe<Scalars["Bytes"]["input"]>;
  stTokenAddress_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  stTokenAddress_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  stTokenAddress_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  stTokenAddress_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  stTokenAddress_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  stTokenAddress_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  stTokenAddress_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  stTokenAddress_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  stTokenAddress_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  stToken_?: InputMaybe<StakingToken_Filter>;
  stToken_contains?: InputMaybe<Scalars["String"]["input"]>;
  stToken_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  stToken_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  stToken_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  stToken_gt?: InputMaybe<Scalars["String"]["input"]>;
  stToken_gte?: InputMaybe<Scalars["String"]["input"]>;
  stToken_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  stToken_lt?: InputMaybe<Scalars["String"]["input"]>;
  stToken_lte?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  stToken_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  stToken_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  stToken_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  totalRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tradingGovernance?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_?: InputMaybe<Governance_Filter>;
  tradingGovernance_contains?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_gt?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_gte?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tradingGovernance_lt?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_lte?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_not?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_not_contains_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  tradingGovernance_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  tradingGovernance_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tradingGovernance_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  tradingGovernance_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  tradingGovernance_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  trustedFillerEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  trustedFillerEnabled_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  trustedFillerEnabled_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  trustedFillerEnabled_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  trustedFillerRegistry?: InputMaybe<Scalars["Bytes"]["input"]>;
  trustedFillerRegistry_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  trustedFillerRegistry_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  trustedFillerRegistry_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  trustedFillerRegistry_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  trustedFillerRegistry_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  trustedFillerRegistry_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  trustedFillerRegistry_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  trustedFillerRegistry_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  trustedFillerRegistry_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  tvlFee?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlFee_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlFee_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlFee_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tvlFee_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlFee_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlFee_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  tvlFee_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightControl?: InputMaybe<Scalars["Boolean"]["input"]>;
  weightControl_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  weightControl_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  weightControl_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
};

export enum Dtf_OrderBy {
  Admins = "admins",
  AnnualizedTvlFee = "annualizedTvlFee",
  AuctionApprovers = "auctionApprovers",
  AuctionDelay = "auctionDelay",
  AuctionLaunchers = "auctionLaunchers",
  AuctionLength = "auctionLength",
  BidsEnabled = "bidsEnabled",
  BlockNumber = "blockNumber",
  BrandManagers = "brandManagers",
  Deployer = "deployer",
  ExternalRevenue = "externalRevenue",
  FeeRecipients = "feeRecipients",
  GovernanceRevenue = "governanceRevenue",
  Id = "id",
  LegacyAdmins = "legacyAdmins",
  LegacyAuctionApprovers = "legacyAuctionApprovers",
  Mandate = "mandate",
  MintingFee = "mintingFee",
  OwnerAddress = "ownerAddress",
  OwnerGovernance = "ownerGovernance",
  OwnerGovernanceId = "ownerGovernance__id",
  OwnerGovernanceName = "ownerGovernance__name",
  OwnerGovernanceProposalCount = "ownerGovernance__proposalCount",
  OwnerGovernanceProposalThreshold = "ownerGovernance__proposalThreshold",
  OwnerGovernanceProposalsCanceled = "ownerGovernance__proposalsCanceled",
  OwnerGovernanceProposalsExecuted = "ownerGovernance__proposalsExecuted",
  OwnerGovernanceProposalsQueued = "ownerGovernance__proposalsQueued",
  OwnerGovernanceQuorumDenominator = "ownerGovernance__quorumDenominator",
  OwnerGovernanceQuorumNumerator = "ownerGovernance__quorumNumerator",
  OwnerGovernanceQuorumVotes = "ownerGovernance__quorumVotes",
  OwnerGovernanceVersion = "ownerGovernance__version",
  OwnerGovernanceVotingDelay = "ownerGovernance__votingDelay",
  OwnerGovernanceVotingPeriod = "ownerGovernance__votingPeriod",
  PriceControl = "priceControl",
  ProtocolRevenue = "protocolRevenue",
  ProxyAdmin = "proxyAdmin",
  Rebalances = "rebalances",
  StToken = "stToken",
  StTokenAddress = "stTokenAddress",
  StTokenCurrentDelegates = "stToken__currentDelegates",
  StTokenDelegatedVotes = "stToken__delegatedVotes",
  StTokenDelegatedVotesRaw = "stToken__delegatedVotesRaw",
  StTokenId = "stToken__id",
  StTokenTotalDelegates = "stToken__totalDelegates",
  Timestamp = "timestamp",
  Token = "token",
  TokenAddress = "token__address",
  TokenBurnCount = "token__burnCount",
  TokenCumulativeHolderCount = "token__cumulativeHolderCount",
  TokenCurrentHolderCount = "token__currentHolderCount",
  TokenDecimals = "token__decimals",
  TokenId = "token__id",
  TokenMintCount = "token__mintCount",
  TokenName = "token__name",
  TokenSymbol = "token__symbol",
  TokenTotalBurned = "token__totalBurned",
  TokenTotalMinted = "token__totalMinted",
  TokenTotalSupply = "token__totalSupply",
  TokenTransferCount = "token__transferCount",
  TokenType = "token__type",
  TotalRevenue = "totalRevenue",
  TradingGovernance = "tradingGovernance",
  TradingGovernanceId = "tradingGovernance__id",
  TradingGovernanceName = "tradingGovernance__name",
  TradingGovernanceProposalCount = "tradingGovernance__proposalCount",
  TradingGovernanceProposalThreshold = "tradingGovernance__proposalThreshold",
  TradingGovernanceProposalsCanceled = "tradingGovernance__proposalsCanceled",
  TradingGovernanceProposalsExecuted = "tradingGovernance__proposalsExecuted",
  TradingGovernanceProposalsQueued = "tradingGovernance__proposalsQueued",
  TradingGovernanceQuorumDenominator = "tradingGovernance__quorumDenominator",
  TradingGovernanceQuorumNumerator = "tradingGovernance__quorumNumerator",
  TradingGovernanceQuorumVotes = "tradingGovernance__quorumVotes",
  TradingGovernanceVersion = "tradingGovernance__version",
  TradingGovernanceVotingDelay = "tradingGovernance__votingDelay",
  TradingGovernanceVotingPeriod = "tradingGovernance__votingPeriod",
  TrustedFillerEnabled = "trustedFillerEnabled",
  TrustedFillerRegistry = "trustedFillerRegistry",
  TvlFee = "tvlFee",
  WeightControl = "weightControl",
}

export type Delegate = {
  __typename?: "Delegate";
  /** Delegate address */
  address: Scalars["String"]["output"];
  /** Amount of votes delegated to this delegate to be used on proposal votings expressed as a BigDecimal normalized value */
  delegatedVotes: Scalars["BigDecimal"]["output"];
  /** Amount of votes delegated to this delegate to be used on proposal votings expressed in the smallest unit of the token */
  delegatedVotesRaw: Scalars["BigInt"]["output"];
  /** A Delegate is any address that has been delegated with voting tokens by a token holder, id is {stTokenAddress}-{delegateAddress} */
  id: Scalars["ID"]["output"];
  /** Number of proposals voted on */
  numberVotes: Scalars["Int"]["output"];
  /** Proposals that the delegate has created */
  proposals: Array<Proposal>;
  /** Governance this delegate is related to */
  token: StakingToken;
  /** Token holders that this delegate represents */
  tokenHoldersRepresented: Array<AccountBalance>;
  /** Total token holders that this delegate represents */
  tokenHoldersRepresentedAmount: Scalars["Int"]["output"];
  /** Votes that a delegate has made in different proposals */
  votes: Array<Vote>;
};

export type DelegateProposalsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Proposal_Filter>;
};

export type DelegateTokenHoldersRepresentedArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AccountBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<AccountBalance_Filter>;
};

export type DelegateVotesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Vote_Filter>;
};

export type DelegateChange = {
  __typename?: "DelegateChange";
  /** Block number of event */
  blockNumber: Scalars["BigInt"]["output"];
  /** Block time change happened */
  blockTimestamp: Scalars["BigInt"]["output"];
  /** Address for delegate */
  delegate: Scalars["String"]["output"];
  /** Address for delegator */
  delegator: Scalars["String"]["output"];
  /** Unique entity used to keep track of delegate changes */
  id: Scalars["ID"]["output"];
  /** Log index for delegate change */
  logIndex: Scalars["BigInt"]["output"];
  /** Address for previous delegate */
  previousDelegate: Scalars["String"]["output"];
  /** Token address */
  tokenAddress: Scalars["String"]["output"];
  /** Transaction hash of the delegate change event */
  txnHash: Scalars["String"]["output"];
};

export type DelegateChange_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DelegateChange_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  delegate?: InputMaybe<Scalars["String"]["input"]>;
  delegate_contains?: InputMaybe<Scalars["String"]["input"]>;
  delegate_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_gt?: InputMaybe<Scalars["String"]["input"]>;
  delegate_gte?: InputMaybe<Scalars["String"]["input"]>;
  delegate_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  delegate_lt?: InputMaybe<Scalars["String"]["input"]>;
  delegate_lte?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  delegate_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegator?: InputMaybe<Scalars["String"]["input"]>;
  delegator_contains?: InputMaybe<Scalars["String"]["input"]>;
  delegator_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegator_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  delegator_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegator_gt?: InputMaybe<Scalars["String"]["input"]>;
  delegator_gte?: InputMaybe<Scalars["String"]["input"]>;
  delegator_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  delegator_lt?: InputMaybe<Scalars["String"]["input"]>;
  delegator_lte?: InputMaybe<Scalars["String"]["input"]>;
  delegator_not?: InputMaybe<Scalars["String"]["input"]>;
  delegator_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  delegator_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegator_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegator_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  delegator_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegator_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  delegator_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  logIndex?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  logIndex_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<DelegateChange_Filter>>>;
  previousDelegate?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_contains?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_gt?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_gte?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  previousDelegate_lt?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_lte?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_not?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  previousDelegate_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  previousDelegate_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  previousDelegate_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  previousDelegate_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_contains?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_gt?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_gte?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokenAddress_lt?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_lte?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txnHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txnHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum DelegateChange_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Delegate = "delegate",
  Delegator = "delegator",
  Id = "id",
  LogIndex = "logIndex",
  PreviousDelegate = "previousDelegate",
  TokenAddress = "tokenAddress",
  TxnHash = "txnHash",
}

export type DelegateVotingPowerChange = {
  __typename?: "DelegateVotingPowerChange";
  /** Block number of event */
  blockNumber: Scalars["BigInt"]["output"];
  /** Block time change happened */
  blockTimestamp: Scalars["BigInt"]["output"];
  /** Address for delegate */
  delegate: Scalars["String"]["output"];
  /** Unique entity used to keep track of voting power delta */
  id: Scalars["ID"]["output"];
  /** Log index for delegate voting power change */
  logIndex: Scalars["BigInt"]["output"];
  /** New voting power of delegate */
  newBalance: Scalars["BigInt"]["output"];
  /** Previous voting power of delegate */
  previousBalance: Scalars["BigInt"]["output"];
  /** Token addresss */
  tokenAddress: Scalars["String"]["output"];
  /** Transaction hash of the voting power change */
  txnHash: Scalars["String"]["output"];
};

export type DelegateVotingPowerChange_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DelegateVotingPowerChange_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  delegate?: InputMaybe<Scalars["String"]["input"]>;
  delegate_contains?: InputMaybe<Scalars["String"]["input"]>;
  delegate_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_gt?: InputMaybe<Scalars["String"]["input"]>;
  delegate_gte?: InputMaybe<Scalars["String"]["input"]>;
  delegate_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  delegate_lt?: InputMaybe<Scalars["String"]["input"]>;
  delegate_lte?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  delegate_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  delegate_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  delegate_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  logIndex?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  logIndex_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  newBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  newBalance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  newBalance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  newBalance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  newBalance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  newBalance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  newBalance_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  newBalance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<DelegateVotingPowerChange_Filter>>>;
  previousBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  previousBalance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  previousBalance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  previousBalance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  previousBalance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  previousBalance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  previousBalance_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  previousBalance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tokenAddress?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_contains?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_gt?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_gte?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokenAddress_lt?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_lte?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  tokenAddress_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txnHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txnHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum DelegateVotingPowerChange_OrderBy {
  BlockNumber = "blockNumber",
  BlockTimestamp = "blockTimestamp",
  Delegate = "delegate",
  Id = "id",
  LogIndex = "logIndex",
  NewBalance = "newBalance",
  PreviousBalance = "previousBalance",
  TokenAddress = "tokenAddress",
  TxnHash = "txnHash",
}

export type Delegate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars["String"]["input"]>;
  address_contains?: InputMaybe<Scalars["String"]["input"]>;
  address_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  address_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  address_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  address_gt?: InputMaybe<Scalars["String"]["input"]>;
  address_gte?: InputMaybe<Scalars["String"]["input"]>;
  address_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  address_lt?: InputMaybe<Scalars["String"]["input"]>;
  address_lte?: InputMaybe<Scalars["String"]["input"]>;
  address_not?: InputMaybe<Scalars["String"]["input"]>;
  address_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  address_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  address_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  address_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  address_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  address_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  address_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  address_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  address_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<Delegate_Filter>>>;
  delegatedVotes?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotesRaw?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  delegatedVotesRaw_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  delegatedVotes_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotes_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotes_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  delegatedVotes_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotes_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotes_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotes_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  numberVotes?: InputMaybe<Scalars["Int"]["input"]>;
  numberVotes_gt?: InputMaybe<Scalars["Int"]["input"]>;
  numberVotes_gte?: InputMaybe<Scalars["Int"]["input"]>;
  numberVotes_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  numberVotes_lt?: InputMaybe<Scalars["Int"]["input"]>;
  numberVotes_lte?: InputMaybe<Scalars["Int"]["input"]>;
  numberVotes_not?: InputMaybe<Scalars["Int"]["input"]>;
  numberVotes_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Delegate_Filter>>>;
  proposals_?: InputMaybe<Proposal_Filter>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  tokenHoldersRepresentedAmount?: InputMaybe<Scalars["Int"]["input"]>;
  tokenHoldersRepresentedAmount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  tokenHoldersRepresentedAmount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  tokenHoldersRepresentedAmount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  tokenHoldersRepresentedAmount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  tokenHoldersRepresentedAmount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  tokenHoldersRepresentedAmount_not?: InputMaybe<Scalars["Int"]["input"]>;
  tokenHoldersRepresentedAmount_not_in?: InputMaybe<
    Array<Scalars["Int"]["input"]>
  >;
  tokenHoldersRepresented_?: InputMaybe<AccountBalance_Filter>;
  token_?: InputMaybe<StakingToken_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  votes_?: InputMaybe<Vote_Filter>;
};

export enum Delegate_OrderBy {
  Address = "address",
  DelegatedVotes = "delegatedVotes",
  DelegatedVotesRaw = "delegatedVotesRaw",
  Id = "id",
  NumberVotes = "numberVotes",
  Proposals = "proposals",
  Token = "token",
  TokenHoldersRepresented = "tokenHoldersRepresented",
  TokenHoldersRepresentedAmount = "tokenHoldersRepresentedAmount",
  TokenCurrentDelegates = "token__currentDelegates",
  TokenDelegatedVotes = "token__delegatedVotes",
  TokenDelegatedVotesRaw = "token__delegatedVotesRaw",
  TokenId = "token__id",
  TokenTotalDelegates = "token__totalDelegates",
  Votes = "votes",
}

export type Event = {
  /**  Block number of this event  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  Address that sent the tokens  */
  from?: Maybe<Account>;
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars["String"]["output"];
  /**  { Token ID }-{ Transaction hash }-{ Log index }  */
  id: Scalars["ID"]["output"];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars["Int"]["output"];
  /**  Nonce of the transaction that emitted this event  */
  nonce: Scalars["Int"]["output"];
  /**  Timestamp of this event  */
  timestamp: Scalars["BigInt"]["output"];
  /**  Address that received the tokens  */
  to?: Maybe<Account>;
  /**  The token this event belongs to  */
  token: Token;
};

export type Event_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Event_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  from?: InputMaybe<Scalars["String"]["input"]>;
  from_?: InputMaybe<Account_Filter>;
  from_contains?: InputMaybe<Scalars["String"]["input"]>;
  from_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  from_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_gt?: InputMaybe<Scalars["String"]["input"]>;
  from_gte?: InputMaybe<Scalars["String"]["input"]>;
  from_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  from_lt?: InputMaybe<Scalars["String"]["input"]>;
  from_lte?: InputMaybe<Scalars["String"]["input"]>;
  from_not?: InputMaybe<Scalars["String"]["input"]>;
  from_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  from_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  from_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  from_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  from_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  from_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash?: InputMaybe<Scalars["String"]["input"]>;
  hash_contains?: InputMaybe<Scalars["String"]["input"]>;
  hash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash_gt?: InputMaybe<Scalars["String"]["input"]>;
  hash_gte?: InputMaybe<Scalars["String"]["input"]>;
  hash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hash_lt?: InputMaybe<Scalars["String"]["input"]>;
  hash_lte?: InputMaybe<Scalars["String"]["input"]>;
  hash_not?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  logIndex?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  logIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  nonce?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_gt?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_gte?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  nonce_lt?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_lte?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_not?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Event_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  to?: InputMaybe<Scalars["String"]["input"]>;
  to_?: InputMaybe<Account_Filter>;
  to_contains?: InputMaybe<Scalars["String"]["input"]>;
  to_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  to_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_gt?: InputMaybe<Scalars["String"]["input"]>;
  to_gte?: InputMaybe<Scalars["String"]["input"]>;
  to_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  to_lt?: InputMaybe<Scalars["String"]["input"]>;
  to_lte?: InputMaybe<Scalars["String"]["input"]>;
  to_not?: InputMaybe<Scalars["String"]["input"]>;
  to_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  to_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  to_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  to_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  to_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  to_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum Event_OrderBy {
  BlockNumber = "blockNumber",
  From = "from",
  FromId = "from__id",
  Hash = "hash",
  Id = "id",
  LogIndex = "logIndex",
  Nonce = "nonce",
  Timestamp = "timestamp",
  To = "to",
  ToId = "to__id",
  Token = "token",
  TokenAddress = "token__address",
  TokenBurnCount = "token__burnCount",
  TokenCumulativeHolderCount = "token__cumulativeHolderCount",
  TokenCurrentHolderCount = "token__currentHolderCount",
  TokenDecimals = "token__decimals",
  TokenId = "token__id",
  TokenMintCount = "token__mintCount",
  TokenName = "token__name",
  TokenSymbol = "token__symbol",
  TokenTotalBurned = "token__totalBurned",
  TokenTotalMinted = "token__totalMinted",
  TokenTotalSupply = "token__totalSupply",
  TokenTransferCount = "token__transferCount",
  TokenType = "token__type",
}

export type Governance = {
  __typename?: "Governance";
  /** Governance framework contract address */
  id: Scalars["ID"]["output"];
  /** Name of the governance framework */
  name: Scalars["String"]["output"];
  /** Total number of proposals created */
  proposalCount: Scalars["BigInt"]["output"];
  /** The number of votes required in order for a voter to become a proposer */
  proposalThreshold: Scalars["BigInt"]["output"];
  /**  Proposal list  */
  proposals: Array<Proposal>;
  /** Number of proposals currently canceled */
  proposalsCanceled: Scalars["BigInt"]["output"];
  /** Number of proposals currently executed */
  proposalsExecuted: Scalars["BigInt"]["output"];
  /** Number of proposals currently queued for execution */
  proposalsQueued: Scalars["BigInt"]["output"];
  /** Quorum fraction denominator value. (OZ: quorum = totalSupply * numerator / denominator) */
  quorumDenominator?: Maybe<Scalars["BigInt"]["output"]>;
  /** Quorum fraction numerator value. (OZ: quorum = totalSupply * numerator / denominator) */
  quorumNumerator?: Maybe<Scalars["BigInt"]["output"]>;
  /** The number of votes for a proposal to succeed. */
  quorumVotes?: Maybe<Scalars["BigInt"]["output"]>;
  /**  timelock  */
  timelock: GovernanceTimelock;
  /**  Staking token entity, if this doesnt exist, DAO is not supported on UI?  */
  token: StakingToken;
  /** Version of the governance framework */
  version: Scalars["String"]["output"];
  /** The delay before voting on a proposal may take place in blocks */
  votingDelay: Scalars["BigInt"]["output"];
  /** The duration of voting on a proposal in blocks */
  votingPeriod: Scalars["BigInt"]["output"];
};

export type GovernanceProposalsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Proposal_Filter>;
};

export type GovernanceTimelock = {
  __typename?: "GovernanceTimelock";
  /**  governed entity stakingToken or DTF  */
  entity: Scalars["String"]["output"];
  /** Number of blocks that are required to pass from the time a proposal reaches quorum until its voting period ends */
  executionDelay: Scalars["BigInt"]["output"];
  /** Governance contract address */
  governance?: Maybe<Governance>;
  /** Guardians */
  guardians: Array<Scalars["String"]["output"]>;
  /** Timelock contract address */
  id: Scalars["ID"]["output"];
  /**  type could be staking token trading or owner or owner of staking token  */
  type: Scalars["String"]["output"];
};

export type GovernanceTimelock_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GovernanceTimelock_Filter>>>;
  entity?: InputMaybe<Scalars["String"]["input"]>;
  entity_contains?: InputMaybe<Scalars["String"]["input"]>;
  entity_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  entity_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  entity_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  entity_gt?: InputMaybe<Scalars["String"]["input"]>;
  entity_gte?: InputMaybe<Scalars["String"]["input"]>;
  entity_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  entity_lt?: InputMaybe<Scalars["String"]["input"]>;
  entity_lte?: InputMaybe<Scalars["String"]["input"]>;
  entity_not?: InputMaybe<Scalars["String"]["input"]>;
  entity_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  entity_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  entity_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  entity_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  entity_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  entity_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  entity_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  entity_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  entity_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  executionDelay?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionDelay_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionDelay_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionDelay_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  executionDelay_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionDelay_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionDelay_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionDelay_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governance?: InputMaybe<Scalars["String"]["input"]>;
  governance_?: InputMaybe<Governance_Filter>;
  governance_contains?: InputMaybe<Scalars["String"]["input"]>;
  governance_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_gt?: InputMaybe<Scalars["String"]["input"]>;
  governance_gte?: InputMaybe<Scalars["String"]["input"]>;
  governance_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  governance_lt?: InputMaybe<Scalars["String"]["input"]>;
  governance_lte?: InputMaybe<Scalars["String"]["input"]>;
  governance_not?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  governance_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  guardians?: InputMaybe<Array<Scalars["String"]["input"]>>;
  guardians_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  guardians_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  guardians_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  guardians_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  guardians_not_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<GovernanceTimelock_Filter>>>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  type_contains?: InputMaybe<Scalars["String"]["input"]>;
  type_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  type_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  type_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  type_gt?: InputMaybe<Scalars["String"]["input"]>;
  type_gte?: InputMaybe<Scalars["String"]["input"]>;
  type_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  type_lt?: InputMaybe<Scalars["String"]["input"]>;
  type_lte?: InputMaybe<Scalars["String"]["input"]>;
  type_not?: InputMaybe<Scalars["String"]["input"]>;
  type_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  type_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  type_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  type_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  type_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  type_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  type_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  type_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  type_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum GovernanceTimelock_OrderBy {
  Entity = "entity",
  ExecutionDelay = "executionDelay",
  Governance = "governance",
  GovernanceId = "governance__id",
  GovernanceName = "governance__name",
  GovernanceProposalCount = "governance__proposalCount",
  GovernanceProposalThreshold = "governance__proposalThreshold",
  GovernanceProposalsCanceled = "governance__proposalsCanceled",
  GovernanceProposalsExecuted = "governance__proposalsExecuted",
  GovernanceProposalsQueued = "governance__proposalsQueued",
  GovernanceQuorumDenominator = "governance__quorumDenominator",
  GovernanceQuorumNumerator = "governance__quorumNumerator",
  GovernanceQuorumVotes = "governance__quorumVotes",
  GovernanceVersion = "governance__version",
  GovernanceVotingDelay = "governance__votingDelay",
  GovernanceVotingPeriod = "governance__votingPeriod",
  Guardians = "guardians",
  Id = "id",
  Type = "type",
}

export type Governance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Governance_Filter>>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  name_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_gt?: InputMaybe<Scalars["String"]["input"]>;
  name_gte?: InputMaybe<Scalars["String"]["input"]>;
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_lt?: InputMaybe<Scalars["String"]["input"]>;
  name_lte?: InputMaybe<Scalars["String"]["input"]>;
  name_not?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Governance_Filter>>>;
  proposalCount?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  proposalCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalCount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  proposalThreshold?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalThreshold_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalThreshold_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalThreshold_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  proposalThreshold_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalThreshold_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalThreshold_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalThreshold_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  proposalsCanceled?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsCanceled_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsCanceled_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsCanceled_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  proposalsCanceled_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsCanceled_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsCanceled_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsCanceled_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  proposalsExecuted?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsExecuted_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsExecuted_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsExecuted_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  proposalsExecuted_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsExecuted_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsExecuted_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsExecuted_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  proposalsQueued?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsQueued_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsQueued_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsQueued_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  proposalsQueued_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsQueued_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsQueued_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  proposalsQueued_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  proposals_?: InputMaybe<Proposal_Filter>;
  quorumDenominator?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumDenominator_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumDenominator_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumDenominator_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  quorumDenominator_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumDenominator_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumDenominator_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumDenominator_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  quorumNumerator?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumNumerator_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumNumerator_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumNumerator_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  quorumNumerator_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumNumerator_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumNumerator_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumNumerator_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  quorumVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  quorumVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timelock?: InputMaybe<Scalars["String"]["input"]>;
  timelock_?: InputMaybe<GovernanceTimelock_Filter>;
  timelock_contains?: InputMaybe<Scalars["String"]["input"]>;
  timelock_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelock_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  timelock_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelock_gt?: InputMaybe<Scalars["String"]["input"]>;
  timelock_gte?: InputMaybe<Scalars["String"]["input"]>;
  timelock_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  timelock_lt?: InputMaybe<Scalars["String"]["input"]>;
  timelock_lte?: InputMaybe<Scalars["String"]["input"]>;
  timelock_not?: InputMaybe<Scalars["String"]["input"]>;
  timelock_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  timelock_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelock_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  timelock_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelock_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  timelock_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  timelock_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelock_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  timelock_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<StakingToken_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  version?: InputMaybe<Scalars["String"]["input"]>;
  version_contains?: InputMaybe<Scalars["String"]["input"]>;
  version_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  version_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  version_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  version_gt?: InputMaybe<Scalars["String"]["input"]>;
  version_gte?: InputMaybe<Scalars["String"]["input"]>;
  version_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  version_lt?: InputMaybe<Scalars["String"]["input"]>;
  version_lte?: InputMaybe<Scalars["String"]["input"]>;
  version_not?: InputMaybe<Scalars["String"]["input"]>;
  version_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  version_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  version_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  version_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  version_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  version_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  version_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  version_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  version_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  votingDelay?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingDelay_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingDelay_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingDelay_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  votingDelay_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingDelay_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingDelay_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingDelay_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  votingPeriod?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  votingPeriod_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum Governance_OrderBy {
  Id = "id",
  Name = "name",
  ProposalCount = "proposalCount",
  ProposalThreshold = "proposalThreshold",
  Proposals = "proposals",
  ProposalsCanceled = "proposalsCanceled",
  ProposalsExecuted = "proposalsExecuted",
  ProposalsQueued = "proposalsQueued",
  QuorumDenominator = "quorumDenominator",
  QuorumNumerator = "quorumNumerator",
  QuorumVotes = "quorumVotes",
  Timelock = "timelock",
  TimelockEntity = "timelock__entity",
  TimelockExecutionDelay = "timelock__executionDelay",
  TimelockId = "timelock__id",
  TimelockType = "timelock__type",
  Token = "token",
  TokenCurrentDelegates = "token__currentDelegates",
  TokenDelegatedVotes = "token__delegatedVotes",
  TokenDelegatedVotesRaw = "token__delegatedVotesRaw",
  TokenId = "token__id",
  TokenTotalDelegates = "token__totalDelegates",
  Version = "version",
  VotingDelay = "votingDelay",
  VotingPeriod = "votingPeriod",
}

export type Lock = {
  __typename?: "Lock";
  /** Account */
  account: Account;
  /** Amount of votes delegated to this delegate to be used on proposal votings expressed in the smallest unit of the token */
  amount: Scalars["BigInt"]["output"];
  /**  cancelled block  */
  cancelledBlock?: Maybe<Scalars["BigInt"]["output"]>;
  /**  cancelled timestamp  */
  cancelledTimestamp?: Maybe<Scalars["BigInt"]["output"]>;
  /**  cancelled txn hash  */
  cancelledTxnHash?: Maybe<Scalars["String"]["output"]>;
  /**  claimed block  */
  claimedBlock?: Maybe<Scalars["BigInt"]["output"]>;
  /**  claimed timestamp  */
  claimedTimestamp?: Maybe<Scalars["BigInt"]["output"]>;
  /**  claimed txn hash  */
  claimedTxnHash?: Maybe<Scalars["String"]["output"]>;
  /**  created block  */
  createdBlock: Scalars["BigInt"]["output"];
  /**  created timestamp  */
  createdTimestamp: Scalars["BigInt"]["output"];
  /**  created txn hash  */
  createdTxnHash: Scalars["String"]["output"];
  /**  { StakingToken Address }-{ Lock ID }  */
  id: Scalars["ID"]["output"];
  /**  Lock id  */
  lockId: Scalars["BigInt"]["output"];
  /** Token address */
  token: StakingToken;
  /** Unlock time */
  unlockTime: Scalars["BigInt"]["output"];
};

export type Lock_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Lock_Filter>>>;
  cancelledBlock?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledBlock_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledBlock_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledBlock_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cancelledBlock_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledBlock_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledBlock_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledBlock_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cancelledTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cancelledTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancelledTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cancelledTxnHash?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cancelledTxnHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_not?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  cancelledTxnHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cancelledTxnHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  cancelledTxnHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  cancelledTxnHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claimedBlock?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedBlock_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedBlock_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedBlock_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimedBlock_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedBlock_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedBlock_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedBlock_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimedTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimedTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  claimedTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  claimedTxnHash?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  claimedTxnHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_not?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  claimedTxnHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  claimedTxnHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  claimedTxnHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  createdBlock?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlock_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlock_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlock_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createdBlock_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlock_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlock_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdBlock_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createdTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createdTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createdTxnHash?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  createdTxnHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_not?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  createdTxnHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  createdTxnHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  createdTxnHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  lockId?: InputMaybe<Scalars["BigInt"]["input"]>;
  lockId_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lockId_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lockId_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lockId_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lockId_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lockId_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  lockId_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Lock_Filter>>>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<StakingToken_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  unlockTime?: InputMaybe<Scalars["BigInt"]["input"]>;
  unlockTime_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  unlockTime_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  unlockTime_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  unlockTime_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  unlockTime_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  unlockTime_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  unlockTime_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum Lock_OrderBy {
  Account = "account",
  AccountId = "account__id",
  Amount = "amount",
  CancelledBlock = "cancelledBlock",
  CancelledTimestamp = "cancelledTimestamp",
  CancelledTxnHash = "cancelledTxnHash",
  ClaimedBlock = "claimedBlock",
  ClaimedTimestamp = "claimedTimestamp",
  ClaimedTxnHash = "claimedTxnHash",
  CreatedBlock = "createdBlock",
  CreatedTimestamp = "createdTimestamp",
  CreatedTxnHash = "createdTxnHash",
  Id = "id",
  LockId = "lockId",
  Token = "token",
  TokenCurrentDelegates = "token__currentDelegates",
  TokenDelegatedVotes = "token__delegatedVotes",
  TokenDelegatedVotesRaw = "token__delegatedVotesRaw",
  TokenId = "token__id",
  TokenTotalDelegates = "token__totalDelegates",
  UnlockTime = "unlockTime",
}

export type Minting = {
  __typename?: "Minting";
  /**  Account that received the minted tokens  */
  account: Account;
  /**  Total amount minted to this account for this token  */
  amount: Scalars["BigInt"]["output"];
  /**  First timestamp when tokens were minted to this account  */
  firstMintTimestamp: Scalars["BigInt"]["output"];
  /**  { Address Of the Account }-{ Address of the Token } */
  id: Scalars["ID"]["output"];
  /**  Token that was minted  */
  token: Token;
};

export type Minting_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Minting_Filter>>>;
  firstMintTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstMintTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstMintTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstMintTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  firstMintTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstMintTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstMintTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  firstMintTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Minting_Filter>>>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum Minting_OrderBy {
  Account = "account",
  AccountId = "account__id",
  Amount = "amount",
  FirstMintTimestamp = "firstMintTimestamp",
  Id = "id",
  Token = "token",
  TokenAddress = "token__address",
  TokenBurnCount = "token__burnCount",
  TokenCumulativeHolderCount = "token__cumulativeHolderCount",
  TokenCurrentHolderCount = "token__currentHolderCount",
  TokenDecimals = "token__decimals",
  TokenId = "token__id",
  TokenMintCount = "token__mintCount",
  TokenName = "token__name",
  TokenSymbol = "token__symbol",
  TokenTotalBurned = "token__totalBurned",
  TokenTotalMinted = "token__totalMinted",
  TokenTotalSupply = "token__totalSupply",
  TokenTransferCount = "token__transferCount",
  TokenType = "token__type",
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = "asc",
  Desc = "desc",
}

export type Proposal = {
  __typename?: "Proposal";
  /** Number of delegates that voted abstain to the proposal */
  abstainDelegateVotes: Scalars["BigInt"]["output"];
  /** Weighted votes abstaining to the proposal */
  abstainWeightedVotes: Scalars["BigInt"]["output"];
  /** Number of delegates that voted against the proposal */
  againstDelegateVotes: Scalars["BigInt"]["output"];
  /** Weighted votes against the proposal */
  againstWeightedVotes: Scalars["BigInt"]["output"];
  /** Call data for the change */
  calldatas?: Maybe<Array<Scalars["Bytes"]["output"]>>;
  /** Account that cancelled the proposal */
  cancellationAccount?: Maybe<Account>;
  /** Block number proposal was canceled in */
  cancellationBlock?: Maybe<Scalars["BigInt"]["output"]>;
  /** Timestamp of block proposal was canceled in */
  cancellationTime?: Maybe<Scalars["BigInt"]["output"]>;
  /** Transaction hash of the proposal cancellation */
  cancellationTxnHash?: Maybe<Scalars["String"]["output"]>;
  /** Block number proposal was created in */
  creationBlock: Scalars["BigInt"]["output"];
  /** Timestamp of block proposal was created in */
  creationTime: Scalars["BigInt"]["output"];
  /** Number of delegates at start of voting */
  delegatesAtStart: Scalars["BigInt"]["output"];
  /** Proposal description in markdown format */
  description: Scalars["String"]["output"];
  /** Account that executed the proposal */
  executionAccount?: Maybe<Account>;
  /** Block number proposal was executed in */
  executionBlock?: Maybe<Scalars["BigInt"]["output"]>;
  /** Once the proposal is queued for execution it will have an ETA of the execution */
  executionETA?: Maybe<Scalars["BigInt"]["output"]>;
  /** Timestamp of block proposal was executed in */
  executionTime?: Maybe<Scalars["BigInt"]["output"]>;
  /** Transaction hash of the proposal execution */
  executionTxnHash?: Maybe<Scalars["String"]["output"]>;
  /** Number of delegates that voted for the proposal */
  forDelegateVotes: Scalars["BigInt"]["output"];
  /** Weighted votes for the proposal */
  forWeightedVotes: Scalars["BigInt"]["output"];
  /** Governance Framework that proposal is part of */
  governance: Governance;
  /** Internal proposal ID, in this implementation it seems to be a autoincremental id */
  id: Scalars["ID"]["output"];
  /** Delegate that proposed the proposal */
  proposer: Delegate;
  /** Account that queued the proposal */
  queueAccount?: Maybe<Account>;
  /** Block number proposal was queued in */
  queueBlock?: Maybe<Scalars["BigInt"]["output"]>;
  /** Timestamp of block proposal was queued in */
  queueTime?: Maybe<Scalars["BigInt"]["output"]>;
  /** Transaction hash of the proposal being queued */
  queueTxnHash?: Maybe<Scalars["String"]["output"]>;
  /** The number of votes for a proposal to succeed. */
  quorumVotes: Scalars["BigInt"]["output"];
  /** Signature data for the change */
  signatures?: Maybe<Array<Scalars["String"]["output"]>>;
  /** State of the proposal */
  state: ProposalState;
  /** Targets data for the change */
  targets?: Maybe<Array<Scalars["String"]["output"]>>;
  /** Timelock operation ID associated with this proposal (when queued) */
  timelockId?: Maybe<Scalars["String"]["output"]>;
  /** Number of tokenholders at start of voting */
  tokenHoldersAtStart: Scalars["BigInt"]["output"];
  /** Total number of delegates that voted on the proposal */
  totalDelegateVotes: Scalars["BigInt"]["output"];
  /** Total weighted for/against/abstaining votes */
  totalWeightedVotes: Scalars["BigInt"]["output"];
  /** Transaction hash of the proposal creation */
  txnHash: Scalars["String"]["output"];
  /** Values data for the change */
  values?: Maybe<Array<Scalars["BigInt"]["output"]>>;
  /** Block timestamp from where the voting ends */
  voteEnd: Scalars["BigInt"]["output"];
  /** Block timestamp from where the voting starts */
  voteStart: Scalars["BigInt"]["output"];
  /** Votes associated to this proposal */
  votes: Array<Vote>;
};

export type ProposalVotesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Vote_Filter>;
};

export enum ProposalState {
  Active = "ACTIVE",
  Canceled = "CANCELED",
  Defeated = "DEFEATED",
  Executed = "EXECUTED",
  Expired = "EXPIRED",
  Pending = "PENDING",
  Queued = "QUEUED",
  Succeeded = "SUCCEEDED",
  Vetoed = "VETOED",
}

export type Proposal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  abstainDelegateVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainDelegateVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainDelegateVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainDelegateVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  abstainDelegateVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainDelegateVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainDelegateVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainDelegateVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  abstainWeightedVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  abstainWeightedVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  againstDelegateVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstDelegateVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstDelegateVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstDelegateVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  againstDelegateVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstDelegateVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstDelegateVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstDelegateVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  againstWeightedVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  againstWeightedVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Proposal_Filter>>>;
  calldatas?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  calldatas_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  calldatas_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  calldatas_not?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  calldatas_not_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  calldatas_not_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  cancellationAccount?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_?: InputMaybe<Account_Filter>;
  cancellationAccount_contains?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_gt?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_gte?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cancellationAccount_lt?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_lte?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_not?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_not_contains_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  cancellationAccount_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  cancellationAccount_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cancellationAccount_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  cancellationAccount_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  cancellationAccount_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  cancellationBlock?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationBlock_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationBlock_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationBlock_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cancellationBlock_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationBlock_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationBlock_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationBlock_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cancellationTime?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationTime_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationTime_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationTime_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cancellationTime_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationTime_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationTime_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cancellationTime_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cancellationTxnHash?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cancellationTxnHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_not?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_not_contains_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  cancellationTxnHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  cancellationTxnHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cancellationTxnHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  cancellationTxnHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  cancellationTxnHash_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  creationBlock?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationBlock_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationBlock_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationBlock_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  creationBlock_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationBlock_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationBlock_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationBlock_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  creationTime?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationTime_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationTime_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationTime_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  creationTime_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationTime_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationTime_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  creationTime_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  delegatesAtStart?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatesAtStart_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatesAtStart_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatesAtStart_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  delegatesAtStart_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatesAtStart_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatesAtStart_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatesAtStart_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  description_contains?: InputMaybe<Scalars["String"]["input"]>;
  description_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  description_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  description_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  description_gt?: InputMaybe<Scalars["String"]["input"]>;
  description_gte?: InputMaybe<Scalars["String"]["input"]>;
  description_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  description_lt?: InputMaybe<Scalars["String"]["input"]>;
  description_lte?: InputMaybe<Scalars["String"]["input"]>;
  description_not?: InputMaybe<Scalars["String"]["input"]>;
  description_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  description_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  description_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  description_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  description_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  description_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  description_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  description_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  description_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_?: InputMaybe<Account_Filter>;
  executionAccount_contains?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_gt?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_gte?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  executionAccount_lt?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_lte?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_not?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  executionAccount_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  executionAccount_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  executionAccount_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  executionAccount_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  executionBlock?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionBlock_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionBlock_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionBlock_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  executionBlock_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionBlock_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionBlock_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionBlock_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  executionETA?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionETA_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionETA_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionETA_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  executionETA_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionETA_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionETA_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionETA_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  executionTime?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTime_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTime_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTime_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  executionTime_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTime_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTime_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTime_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  executionTxnHash?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  executionTxnHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_not?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  executionTxnHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  executionTxnHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  executionTxnHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  executionTxnHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  forDelegateVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  forDelegateVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  forDelegateVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  forDelegateVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  forDelegateVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  forDelegateVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  forDelegateVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  forDelegateVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  forWeightedVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  forWeightedVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governance?: InputMaybe<Scalars["String"]["input"]>;
  governance_?: InputMaybe<Governance_Filter>;
  governance_contains?: InputMaybe<Scalars["String"]["input"]>;
  governance_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_gt?: InputMaybe<Scalars["String"]["input"]>;
  governance_gte?: InputMaybe<Scalars["String"]["input"]>;
  governance_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  governance_lt?: InputMaybe<Scalars["String"]["input"]>;
  governance_lte?: InputMaybe<Scalars["String"]["input"]>;
  governance_not?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  governance_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Proposal_Filter>>>;
  proposer?: InputMaybe<Scalars["String"]["input"]>;
  proposer_?: InputMaybe<Delegate_Filter>;
  proposer_contains?: InputMaybe<Scalars["String"]["input"]>;
  proposer_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposer_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  proposer_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposer_gt?: InputMaybe<Scalars["String"]["input"]>;
  proposer_gte?: InputMaybe<Scalars["String"]["input"]>;
  proposer_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  proposer_lt?: InputMaybe<Scalars["String"]["input"]>;
  proposer_lte?: InputMaybe<Scalars["String"]["input"]>;
  proposer_not?: InputMaybe<Scalars["String"]["input"]>;
  proposer_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  proposer_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposer_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  proposer_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposer_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  proposer_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  proposer_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposer_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  proposer_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_?: InputMaybe<Account_Filter>;
  queueAccount_contains?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_gt?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_gte?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  queueAccount_lt?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_lte?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_not?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  queueAccount_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  queueAccount_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueBlock?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueBlock_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueBlock_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueBlock_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  queueBlock_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueBlock_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueBlock_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueBlock_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  queueTime?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueTime_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueTime_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueTime_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  queueTime_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueTime_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueTime_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  queueTime_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  queueTxnHash?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  queueTxnHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_not?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  queueTxnHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  queueTxnHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  quorumVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  quorumVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorumVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  signatures?: InputMaybe<Array<Scalars["String"]["input"]>>;
  signatures_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  signatures_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  signatures_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  signatures_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  signatures_not_contains_nocase?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  state?: InputMaybe<ProposalState>;
  state_in?: InputMaybe<Array<ProposalState>>;
  state_not?: InputMaybe<ProposalState>;
  state_not_in?: InputMaybe<Array<ProposalState>>;
  targets?: InputMaybe<Array<Scalars["String"]["input"]>>;
  targets_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  targets_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  targets_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  targets_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  targets_not_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  timelockId?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_contains?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_gt?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_gte?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  timelockId_lt?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_lte?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  timelockId_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  tokenHoldersAtStart?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenHoldersAtStart_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenHoldersAtStart_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenHoldersAtStart_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tokenHoldersAtStart_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenHoldersAtStart_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenHoldersAtStart_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenHoldersAtStart_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDelegateVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegateVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegateVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegateVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDelegateVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegateVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegateVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegateVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalWeightedVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalWeightedVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  txnHash?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txnHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txnHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  values?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  values_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  values_contains_nocase?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  values_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  values_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  values_not_contains_nocase?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  voteEnd?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteEnd_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteEnd_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteEnd_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  voteEnd_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteEnd_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteEnd_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteEnd_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  voteStart?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteStart_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteStart_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteStart_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  voteStart_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteStart_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteStart_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  voteStart_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  votes_?: InputMaybe<Vote_Filter>;
};

export enum Proposal_OrderBy {
  AbstainDelegateVotes = "abstainDelegateVotes",
  AbstainWeightedVotes = "abstainWeightedVotes",
  AgainstDelegateVotes = "againstDelegateVotes",
  AgainstWeightedVotes = "againstWeightedVotes",
  Calldatas = "calldatas",
  CancellationAccount = "cancellationAccount",
  CancellationAccountId = "cancellationAccount__id",
  CancellationBlock = "cancellationBlock",
  CancellationTime = "cancellationTime",
  CancellationTxnHash = "cancellationTxnHash",
  CreationBlock = "creationBlock",
  CreationTime = "creationTime",
  DelegatesAtStart = "delegatesAtStart",
  Description = "description",
  ExecutionAccount = "executionAccount",
  ExecutionAccountId = "executionAccount__id",
  ExecutionBlock = "executionBlock",
  ExecutionEta = "executionETA",
  ExecutionTime = "executionTime",
  ExecutionTxnHash = "executionTxnHash",
  ForDelegateVotes = "forDelegateVotes",
  ForWeightedVotes = "forWeightedVotes",
  Governance = "governance",
  GovernanceId = "governance__id",
  GovernanceName = "governance__name",
  GovernanceProposalCount = "governance__proposalCount",
  GovernanceProposalThreshold = "governance__proposalThreshold",
  GovernanceProposalsCanceled = "governance__proposalsCanceled",
  GovernanceProposalsExecuted = "governance__proposalsExecuted",
  GovernanceProposalsQueued = "governance__proposalsQueued",
  GovernanceQuorumDenominator = "governance__quorumDenominator",
  GovernanceQuorumNumerator = "governance__quorumNumerator",
  GovernanceQuorumVotes = "governance__quorumVotes",
  GovernanceVersion = "governance__version",
  GovernanceVotingDelay = "governance__votingDelay",
  GovernanceVotingPeriod = "governance__votingPeriod",
  Id = "id",
  Proposer = "proposer",
  ProposerAddress = "proposer__address",
  ProposerDelegatedVotes = "proposer__delegatedVotes",
  ProposerDelegatedVotesRaw = "proposer__delegatedVotesRaw",
  ProposerId = "proposer__id",
  ProposerNumberVotes = "proposer__numberVotes",
  ProposerTokenHoldersRepresentedAmount = "proposer__tokenHoldersRepresentedAmount",
  QueueAccount = "queueAccount",
  QueueAccountId = "queueAccount__id",
  QueueBlock = "queueBlock",
  QueueTime = "queueTime",
  QueueTxnHash = "queueTxnHash",
  QuorumVotes = "quorumVotes",
  Signatures = "signatures",
  State = "state",
  Targets = "targets",
  TimelockId = "timelockId",
  TokenHoldersAtStart = "tokenHoldersAtStart",
  TotalDelegateVotes = "totalDelegateVotes",
  TotalWeightedVotes = "totalWeightedVotes",
  TxnHash = "txnHash",
  Values = "values",
  VoteEnd = "voteEnd",
  VoteStart = "voteStart",
  Votes = "votes",
}

export type Query = {
  __typename?: "Query";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accountBalance?: Maybe<AccountBalance>;
  accountBalanceDailySnapshot?: Maybe<AccountBalanceDailySnapshot>;
  accountBalanceDailySnapshots: Array<AccountBalanceDailySnapshot>;
  accountBalances: Array<AccountBalance>;
  accounts: Array<Account>;
  auction?: Maybe<Auction>;
  auctionBid?: Maybe<AuctionBid>;
  auctionBids: Array<AuctionBid>;
  auctions: Array<Auction>;
  delegate?: Maybe<Delegate>;
  delegateChange?: Maybe<DelegateChange>;
  delegateChanges: Array<DelegateChange>;
  delegateVotingPowerChange?: Maybe<DelegateVotingPowerChange>;
  delegateVotingPowerChanges: Array<DelegateVotingPowerChange>;
  delegates: Array<Delegate>;
  dtf?: Maybe<Dtf>;
  dtfs: Array<Dtf>;
  event?: Maybe<Event>;
  events: Array<Event>;
  governance?: Maybe<Governance>;
  governanceTimelock?: Maybe<GovernanceTimelock>;
  governanceTimelocks: Array<GovernanceTimelock>;
  governances: Array<Governance>;
  lock?: Maybe<Lock>;
  locks: Array<Lock>;
  minting?: Maybe<Minting>;
  mintings: Array<Minting>;
  proposal?: Maybe<Proposal>;
  proposals: Array<Proposal>;
  rebalance?: Maybe<Rebalance>;
  rebalanceAuctionBid?: Maybe<RebalanceAuctionBid>;
  rebalanceAuctionBids: Array<RebalanceAuctionBid>;
  rebalances: Array<Rebalance>;
  rewardClaim?: Maybe<RewardClaim>;
  rewardClaims: Array<RewardClaim>;
  rsrburn?: Maybe<RsrBurn>;
  rsrburnDailySnapshot?: Maybe<RsrBurnDailySnapshot>;
  rsrburnDailySnapshots: Array<RsrBurnDailySnapshot>;
  rsrburnGlobal?: Maybe<RsrBurnGlobal>;
  rsrburnGlobals: Array<RsrBurnGlobal>;
  rsrburnMonthlySnapshot?: Maybe<RsrBurnMonthlySnapshot>;
  rsrburnMonthlySnapshots: Array<RsrBurnMonthlySnapshot>;
  rsrburns: Array<RsrBurn>;
  stakingToken?: Maybe<StakingToken>;
  stakingTokenRewards?: Maybe<StakingTokenRewards>;
  stakingTokenRewards_collection: Array<StakingTokenRewards>;
  stakingTokens: Array<StakingToken>;
  timelockOperation?: Maybe<TimelockOperation>;
  timelockOperationByTx?: Maybe<TimelockOperationByTx>;
  timelockOperationByTxes: Array<TimelockOperationByTx>;
  timelockOperations: Array<TimelockOperation>;
  token?: Maybe<Token>;
  tokenDailySnapshot?: Maybe<TokenDailySnapshot>;
  tokenDailySnapshots: Array<TokenDailySnapshot>;
  tokenHourlySnapshot?: Maybe<TokenHourlySnapshot>;
  tokenHourlySnapshots: Array<TokenHourlySnapshot>;
  tokenMonthlySnapshot?: Maybe<TokenMonthlySnapshot>;
  tokenMonthlySnapshots: Array<TokenMonthlySnapshot>;
  tokens: Array<Token>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  transferEvent?: Maybe<TransferEvent>;
  transferEvents: Array<TransferEvent>;
  unstakingManager?: Maybe<UnstakingManager>;
  unstakingManagers: Array<UnstakingManager>;
  version?: Maybe<Version>;
  versions: Array<Version>;
  vote?: Maybe<Vote>;
  voteDailySnapshot?: Maybe<VoteDailySnapshot>;
  voteDailySnapshots: Array<VoteDailySnapshot>;
  votes: Array<Vote>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAccountBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAccountBalanceDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAccountBalanceDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AccountBalanceDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountBalanceDailySnapshot_Filter>;
};

export type QueryAccountBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AccountBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountBalance_Filter>;
};

export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};

export type QueryAuctionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAuctionBidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAuctionBidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AuctionBid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuctionBid_Filter>;
};

export type QueryAuctionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Auction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Auction_Filter>;
};

export type QueryDelegateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDelegateChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDelegateChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<DelegateChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegateChange_Filter>;
};

export type QueryDelegateVotingPowerChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDelegateVotingPowerChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<DelegateVotingPowerChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegateVotingPowerChange_Filter>;
};

export type QueryDelegatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Delegate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegate_Filter>;
};

export type QueryDtfArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDtfsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Dtf_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Dtf_Filter>;
};

export type QueryEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Event_Filter>;
};

export type QueryGovernanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryGovernanceTimelockArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryGovernanceTimelocksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<GovernanceTimelock_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GovernanceTimelock_Filter>;
};

export type QueryGovernancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Governance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Governance_Filter>;
};

export type QueryLockArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLocksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Lock_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Lock_Filter>;
};

export type QueryMintingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMintingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Minting_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Minting_Filter>;
};

export type QueryProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Proposal_Filter>;
};

export type QueryRebalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRebalanceAuctionBidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRebalanceAuctionBidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RebalanceAuctionBid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RebalanceAuctionBid_Filter>;
};

export type QueryRebalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Rebalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Rebalance_Filter>;
};

export type QueryRewardClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRewardClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RewardClaim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardClaim_Filter>;
};

export type QueryRsrburnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRsrburnDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRsrburnDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RsrBurnDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RsrBurnDailySnapshot_Filter>;
};

export type QueryRsrburnGlobalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRsrburnGlobalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RsrBurnGlobal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RsrBurnGlobal_Filter>;
};

export type QueryRsrburnMonthlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRsrburnMonthlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RsrBurnMonthlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RsrBurnMonthlySnapshot_Filter>;
};

export type QueryRsrburnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RsrBurn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RsrBurn_Filter>;
};

export type QueryStakingTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStakingTokenRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStakingTokenRewards_CollectionArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<StakingTokenRewards_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakingTokenRewards_Filter>;
};

export type QueryStakingTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<StakingToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakingToken_Filter>;
};

export type QueryTimelockOperationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTimelockOperationByTxArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTimelockOperationByTxesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TimelockOperationByTx_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TimelockOperationByTx_Filter>;
};

export type QueryTimelockOperationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TimelockOperation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TimelockOperation_Filter>;
};

export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenDailySnapshot_Filter>;
};

export type QueryTokenHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHourlySnapshot_Filter>;
};

export type QueryTokenMonthlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenMonthlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TokenMonthlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenMonthlySnapshot_Filter>;
};

export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type QueryTradeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTradesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trade_Filter>;
};

export type QueryTransferEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTransferEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TransferEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TransferEvent_Filter>;
};

export type QueryUnstakingManagerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUnstakingManagersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<UnstakingManager_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UnstakingManager_Filter>;
};

export type QueryVersionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVersionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Version_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Version_Filter>;
};

export type QueryVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVoteDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVoteDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<VoteDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VoteDailySnapshot_Filter>;
};

export type QueryVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vote_Filter>;
};

export type RsrBurn = {
  __typename?: "RSRBurn";
  /**  Amount of RSR burned  */
  amount: Scalars["BigInt"]["output"];
  /**  Block number  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  Burner address  */
  burner: Scalars["Bytes"]["output"];
  /**  { Transaction hash }-{ Log index }  */
  id: Scalars["ID"]["output"];
  /**  Timestamp  */
  timestamp: Scalars["BigInt"]["output"];
  /**  Transaction hash  */
  transactionHash: Scalars["String"]["output"];
};

export type RsrBurnDailySnapshot = {
  __typename?: "RSRBurnDailySnapshot";
  /**  Block number  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  Cumulative burned up to this day  */
  cumulativeBurned: Scalars["BigInt"]["output"];
  /**  Daily RSR burned  */
  dailyBurnAmount: Scalars["BigInt"]["output"];
  /**  Number of burn events today  */
  dailyBurnCount: Scalars["Int"]["output"];
  /**  { # of days since Unix epoch }  */
  id: Scalars["ID"]["output"];
  /**  Timestamp  */
  timestamp: Scalars["BigInt"]["output"];
};

export type RsrBurnDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RsrBurnDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeBurned?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeBurned_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyBurnAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyBurnAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyBurnCount?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  dailyBurnCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<RsrBurnDailySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum RsrBurnDailySnapshot_OrderBy {
  BlockNumber = "blockNumber",
  CumulativeBurned = "cumulativeBurned",
  DailyBurnAmount = "dailyBurnAmount",
  DailyBurnCount = "dailyBurnCount",
  Id = "id",
  Timestamp = "timestamp",
}

export type RsrBurnGlobal = {
  __typename?: "RSRBurnGlobal";
  /**  Singleton: '1'  */
  id: Scalars["ID"]["output"];
  /**  Last update block  */
  lastUpdateBlock: Scalars["BigInt"]["output"];
  /**  Last update timestamp  */
  lastUpdateTimestamp: Scalars["BigInt"]["output"];
  /**  Total number of burn events  */
  totalBurnCount: Scalars["BigInt"]["output"];
  /**  Total RSR burned all-time  */
  totalBurned: Scalars["BigInt"]["output"];
};

export type RsrBurnGlobal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RsrBurnGlobal_Filter>>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  lastUpdateBlock?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateBlock_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateBlock_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateBlock_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lastUpdateBlock_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateBlock_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateBlock_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateBlock_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lastUpdateTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<RsrBurnGlobal_Filter>>>;
  totalBurnCount?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurnCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurnCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurnCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalBurnCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurnCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurnCount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurnCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalBurned?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalBurned_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum RsrBurnGlobal_OrderBy {
  Id = "id",
  LastUpdateBlock = "lastUpdateBlock",
  LastUpdateTimestamp = "lastUpdateTimestamp",
  TotalBurnCount = "totalBurnCount",
  TotalBurned = "totalBurned",
}

export type RsrBurnMonthlySnapshot = {
  __typename?: "RSRBurnMonthlySnapshot";
  /**  Block number  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  Cumulative burned up to this month  */
  cumulativeBurned: Scalars["BigInt"]["output"];
  /**  { # of months since Unix epoch }  */
  id: Scalars["ID"]["output"];
  /**  Monthly RSR burned  */
  monthlyBurnAmount: Scalars["BigInt"]["output"];
  /**  Number of burn events this month  */
  monthlyBurnCount: Scalars["Int"]["output"];
  /**  Timestamp  */
  timestamp: Scalars["BigInt"]["output"];
};

export type RsrBurnMonthlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RsrBurnMonthlySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeBurned?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeBurned_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeBurned_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  monthlyBurnAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyBurnAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyBurnCount?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  monthlyBurnCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<RsrBurnMonthlySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum RsrBurnMonthlySnapshot_OrderBy {
  BlockNumber = "blockNumber",
  CumulativeBurned = "cumulativeBurned",
  Id = "id",
  MonthlyBurnAmount = "monthlyBurnAmount",
  MonthlyBurnCount = "monthlyBurnCount",
  Timestamp = "timestamp",
}

export type RsrBurn_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<RsrBurn_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  burner?: InputMaybe<Scalars["Bytes"]["input"]>;
  burner_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  burner_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  burner_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  burner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  burner_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  burner_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  burner_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  burner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  burner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<RsrBurn_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  transactionHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum RsrBurn_OrderBy {
  Amount = "amount",
  BlockNumber = "blockNumber",
  Burner = "burner",
  Id = "id",
  Timestamp = "timestamp",
  TransactionHash = "transactionHash",
}

export type Rebalance = {
  __typename?: "Rebalance";
  /**  auction bids  */
  auctions: Array<Auction>;
  /**  Available until  */
  availableUntil: Scalars["BigInt"]["output"];
  /**  Bids enabled for this rebalance (v5.0+)  */
  bidsEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**  Block number  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  DTF  */
  dtf: Dtf;
  /**  { DTF Address }-{ Rebalance ID }  */
  id: Scalars["ID"]["output"];
  /**  In rebalance flag per token (v5.0+)  */
  inRebalance?: Maybe<Array<Scalars["Boolean"]["output"]>>;
  /**  Max auction size per token (v5.0+)  */
  maxAuctionSize?: Maybe<Array<Scalars["BigInt"]["output"]>>;
  /**  Rebalance nonce  */
  nonce: Scalars["BigInt"]["output"];
  /**  Price control  */
  priceControl: Scalars["String"]["output"];
  /**  Price high limit  */
  priceHighLimit: Array<Scalars["BigInt"]["output"]>;
  /**  Price ranges  */
  priceLowLimit: Array<Scalars["BigInt"]["output"]>;
  /**  Rebalance high limit  */
  rebalanceHighLimit: Scalars["BigInt"]["output"];
  /**  Rebalance low limit  */
  rebalanceLowLimit: Scalars["BigInt"]["output"];
  /**  Rebalance spot limit  */
  rebalanceSpotLimit: Scalars["BigInt"]["output"];
  /**  Auction launcher window  */
  restrictedUntil: Scalars["BigInt"]["output"];
  /**  Started at timestamp (v5.0+)  */
  startedAt?: Maybe<Scalars["BigInt"]["output"]>;
  /**  Timestamp  */
  timestamp: Scalars["BigInt"]["output"];
  /**  Tokens  */
  tokens: Array<Token>;
  /**  Transaction hash  */
  transactionHash: Scalars["String"]["output"];
  /**  Weight high limit  */
  weightHighLimit: Array<Scalars["BigInt"]["output"]>;
  /**  Weight low limit  */
  weightLowLimit: Array<Scalars["BigInt"]["output"]>;
  /**  Weight spot limit  */
  weightSpotLimit: Array<Scalars["BigInt"]["output"]>;
};

export type RebalanceAuctionsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Auction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Auction_Filter>;
};

export type RebalanceTokensArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Token_Filter>;
};

export type RebalanceAuctionBid = {
  __typename?: "RebalanceAuctionBid";
  /**  The auction/trade this bid belongs to  */
  auction: Auction;
  /**  Address of the account that placed the bid  */
  bidder: Scalars["Bytes"]["output"];
  /**  Block number when this bid was created  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  Amount of tokens being bought in this bid  */
  buyAmount: Scalars["BigInt"]["output"];
  /**  Buy token  */
  buyToken: Token;
  /**  DTF contract reference  */
  dtf: Dtf;
  /**  Trusted fill  */
  filler?: Maybe<Scalars["Bytes"]["output"]>;
  /**  { DTF Address }-{ Auction ID }-{ Bidder Address }-{ timestamp }  */
  id: Scalars["ID"]["output"];
  /**  Amount of tokens being sold in this bid  */
  sellAmount: Scalars["BigInt"]["output"];
  /**  Sell token  */
  sellToken: Token;
  /**  Timestamp when this bid was created  */
  timestamp: Scalars["BigInt"]["output"];
  /**  Transaction hash of the bid transaction  */
  transactionHash: Scalars["String"]["output"];
};

export type RebalanceAuctionBid_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RebalanceAuctionBid_Filter>>>;
  auction?: InputMaybe<Scalars["String"]["input"]>;
  auction_?: InputMaybe<Auction_Filter>;
  auction_contains?: InputMaybe<Scalars["String"]["input"]>;
  auction_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  auction_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  auction_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  auction_gt?: InputMaybe<Scalars["String"]["input"]>;
  auction_gte?: InputMaybe<Scalars["String"]["input"]>;
  auction_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auction_lt?: InputMaybe<Scalars["String"]["input"]>;
  auction_lte?: InputMaybe<Scalars["String"]["input"]>;
  auction_not?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  auction_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  auction_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  auction_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  auction_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  bidder?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  bidder_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  bidder_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buyAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buyAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buyToken?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_?: InputMaybe<Token_Filter>;
  buyToken_contains?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_gt?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_gte?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  buyToken_lt?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_lte?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_not?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  buyToken_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  buyToken_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf?: InputMaybe<Scalars["String"]["input"]>;
  dtf_?: InputMaybe<Dtf_Filter>;
  dtf_contains?: InputMaybe<Scalars["String"]["input"]>;
  dtf_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_gt?: InputMaybe<Scalars["String"]["input"]>;
  dtf_gte?: InputMaybe<Scalars["String"]["input"]>;
  dtf_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  dtf_lt?: InputMaybe<Scalars["String"]["input"]>;
  dtf_lte?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  dtf_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  filler?: InputMaybe<Scalars["Bytes"]["input"]>;
  filler_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  filler_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  filler_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  filler_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  filler_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  filler_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  filler_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  filler_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  filler_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<RebalanceAuctionBid_Filter>>>;
  sellAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  sellAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  sellToken?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_?: InputMaybe<Token_Filter>;
  sellToken_contains?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_gt?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_gte?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  sellToken_lt?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_lte?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_not?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  sellToken_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  sellToken_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  transactionHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum RebalanceAuctionBid_OrderBy {
  Auction = "auction",
  AuctionBlockNumber = "auction__blockNumber",
  AuctionEndTime = "auction__endTime",
  AuctionId = "auction__id",
  AuctionRebalanceHighLimit = "auction__rebalanceHighLimit",
  AuctionRebalanceLowLimit = "auction__rebalanceLowLimit",
  AuctionRebalanceSpotLimit = "auction__rebalanceSpotLimit",
  AuctionStartTime = "auction__startTime",
  AuctionTimestamp = "auction__timestamp",
  AuctionTransactionHash = "auction__transactionHash",
  Bidder = "bidder",
  BlockNumber = "blockNumber",
  BuyAmount = "buyAmount",
  BuyToken = "buyToken",
  BuyTokenAddress = "buyToken__address",
  BuyTokenBurnCount = "buyToken__burnCount",
  BuyTokenCumulativeHolderCount = "buyToken__cumulativeHolderCount",
  BuyTokenCurrentHolderCount = "buyToken__currentHolderCount",
  BuyTokenDecimals = "buyToken__decimals",
  BuyTokenId = "buyToken__id",
  BuyTokenMintCount = "buyToken__mintCount",
  BuyTokenName = "buyToken__name",
  BuyTokenSymbol = "buyToken__symbol",
  BuyTokenTotalBurned = "buyToken__totalBurned",
  BuyTokenTotalMinted = "buyToken__totalMinted",
  BuyTokenTotalSupply = "buyToken__totalSupply",
  BuyTokenTransferCount = "buyToken__transferCount",
  BuyTokenType = "buyToken__type",
  Dtf = "dtf",
  DtfAnnualizedTvlFee = "dtf__annualizedTvlFee",
  DtfAuctionDelay = "dtf__auctionDelay",
  DtfAuctionLength = "dtf__auctionLength",
  DtfBidsEnabled = "dtf__bidsEnabled",
  DtfBlockNumber = "dtf__blockNumber",
  DtfDeployer = "dtf__deployer",
  DtfExternalRevenue = "dtf__externalRevenue",
  DtfFeeRecipients = "dtf__feeRecipients",
  DtfGovernanceRevenue = "dtf__governanceRevenue",
  DtfId = "dtf__id",
  DtfMandate = "dtf__mandate",
  DtfMintingFee = "dtf__mintingFee",
  DtfOwnerAddress = "dtf__ownerAddress",
  DtfPriceControl = "dtf__priceControl",
  DtfProtocolRevenue = "dtf__protocolRevenue",
  DtfProxyAdmin = "dtf__proxyAdmin",
  DtfStTokenAddress = "dtf__stTokenAddress",
  DtfTimestamp = "dtf__timestamp",
  DtfTotalRevenue = "dtf__totalRevenue",
  DtfTrustedFillerEnabled = "dtf__trustedFillerEnabled",
  DtfTrustedFillerRegistry = "dtf__trustedFillerRegistry",
  DtfTvlFee = "dtf__tvlFee",
  DtfWeightControl = "dtf__weightControl",
  Filler = "filler",
  Id = "id",
  SellAmount = "sellAmount",
  SellToken = "sellToken",
  SellTokenAddress = "sellToken__address",
  SellTokenBurnCount = "sellToken__burnCount",
  SellTokenCumulativeHolderCount = "sellToken__cumulativeHolderCount",
  SellTokenCurrentHolderCount = "sellToken__currentHolderCount",
  SellTokenDecimals = "sellToken__decimals",
  SellTokenId = "sellToken__id",
  SellTokenMintCount = "sellToken__mintCount",
  SellTokenName = "sellToken__name",
  SellTokenSymbol = "sellToken__symbol",
  SellTokenTotalBurned = "sellToken__totalBurned",
  SellTokenTotalMinted = "sellToken__totalMinted",
  SellTokenTotalSupply = "sellToken__totalSupply",
  SellTokenTransferCount = "sellToken__transferCount",
  SellTokenType = "sellToken__type",
  Timestamp = "timestamp",
  TransactionHash = "transactionHash",
}

export type Rebalance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Rebalance_Filter>>>;
  auctions_?: InputMaybe<Auction_Filter>;
  availableUntil?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableUntil_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableUntil_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableUntil_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  availableUntil_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableUntil_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableUntil_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableUntil_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  bidsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  bidsEnabled_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  bidsEnabled_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  bidsEnabled_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dtf?: InputMaybe<Scalars["String"]["input"]>;
  dtf_?: InputMaybe<Dtf_Filter>;
  dtf_contains?: InputMaybe<Scalars["String"]["input"]>;
  dtf_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_gt?: InputMaybe<Scalars["String"]["input"]>;
  dtf_gte?: InputMaybe<Scalars["String"]["input"]>;
  dtf_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  dtf_lt?: InputMaybe<Scalars["String"]["input"]>;
  dtf_lte?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  dtf_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  inRebalance?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  inRebalance_contains?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  inRebalance_contains_nocase?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  inRebalance_not?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  inRebalance_not_contains?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  inRebalance_not_contains_nocase?: InputMaybe<
    Array<Scalars["Boolean"]["input"]>
  >;
  maxAuctionSize?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  maxAuctionSize_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  maxAuctionSize_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  maxAuctionSize_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  maxAuctionSize_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  maxAuctionSize_not_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  nonce?: InputMaybe<Scalars["BigInt"]["input"]>;
  nonce_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  nonce_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  nonce_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  nonce_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  nonce_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  nonce_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  nonce_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Rebalance_Filter>>>;
  priceControl?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_contains?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_gt?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_gte?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  priceControl_lt?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_lte?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_not?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  priceControl_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  priceControl_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  priceHighLimit?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceHighLimit_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceHighLimit_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  priceHighLimit_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceHighLimit_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceHighLimit_not_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  priceLowLimit?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceLowLimit_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceLowLimit_contains_nocase?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceLowLimit_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceLowLimit_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  priceLowLimit_not_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  rebalanceHighLimit?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rebalanceHighLimit_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceHighLimit_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rebalanceLowLimit?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rebalanceLowLimit_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceLowLimit_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rebalanceSpotLimit?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rebalanceSpotLimit_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  rebalanceSpotLimit_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  restrictedUntil?: InputMaybe<Scalars["BigInt"]["input"]>;
  restrictedUntil_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  restrictedUntil_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  restrictedUntil_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  restrictedUntil_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  restrictedUntil_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  restrictedUntil_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  restrictedUntil_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  startedAt?: InputMaybe<Scalars["BigInt"]["input"]>;
  startedAt_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  startedAt_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  startedAt_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  startedAt_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  startedAt_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  startedAt_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  startedAt_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tokens?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokens_?: InputMaybe<Token_Filter>;
  tokens_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokens_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokens_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokens_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tokens_not_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  transactionHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  weightHighLimit?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightHighLimit_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightHighLimit_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  weightHighLimit_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightHighLimit_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightHighLimit_not_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  weightLowLimit?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightLowLimit_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightLowLimit_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  weightLowLimit_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightLowLimit_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightLowLimit_not_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  weightSpotLimit?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightSpotLimit_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightSpotLimit_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  weightSpotLimit_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightSpotLimit_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weightSpotLimit_not_contains_nocase?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
};

export enum Rebalance_OrderBy {
  Auctions = "auctions",
  AvailableUntil = "availableUntil",
  BidsEnabled = "bidsEnabled",
  BlockNumber = "blockNumber",
  Dtf = "dtf",
  DtfAnnualizedTvlFee = "dtf__annualizedTvlFee",
  DtfAuctionDelay = "dtf__auctionDelay",
  DtfAuctionLength = "dtf__auctionLength",
  DtfBidsEnabled = "dtf__bidsEnabled",
  DtfBlockNumber = "dtf__blockNumber",
  DtfDeployer = "dtf__deployer",
  DtfExternalRevenue = "dtf__externalRevenue",
  DtfFeeRecipients = "dtf__feeRecipients",
  DtfGovernanceRevenue = "dtf__governanceRevenue",
  DtfId = "dtf__id",
  DtfMandate = "dtf__mandate",
  DtfMintingFee = "dtf__mintingFee",
  DtfOwnerAddress = "dtf__ownerAddress",
  DtfPriceControl = "dtf__priceControl",
  DtfProtocolRevenue = "dtf__protocolRevenue",
  DtfProxyAdmin = "dtf__proxyAdmin",
  DtfStTokenAddress = "dtf__stTokenAddress",
  DtfTimestamp = "dtf__timestamp",
  DtfTotalRevenue = "dtf__totalRevenue",
  DtfTrustedFillerEnabled = "dtf__trustedFillerEnabled",
  DtfTrustedFillerRegistry = "dtf__trustedFillerRegistry",
  DtfTvlFee = "dtf__tvlFee",
  DtfWeightControl = "dtf__weightControl",
  Id = "id",
  InRebalance = "inRebalance",
  MaxAuctionSize = "maxAuctionSize",
  Nonce = "nonce",
  PriceControl = "priceControl",
  PriceHighLimit = "priceHighLimit",
  PriceLowLimit = "priceLowLimit",
  RebalanceHighLimit = "rebalanceHighLimit",
  RebalanceLowLimit = "rebalanceLowLimit",
  RebalanceSpotLimit = "rebalanceSpotLimit",
  RestrictedUntil = "restrictedUntil",
  StartedAt = "startedAt",
  Timestamp = "timestamp",
  Tokens = "tokens",
  TransactionHash = "transactionHash",
  WeightHighLimit = "weightHighLimit",
  WeightLowLimit = "weightLowLimit",
  WeightSpotLimit = "weightSpotLimit",
}

export type RewardClaim = {
  __typename?: "RewardClaim";
  account: Account;
  amount: Scalars["BigInt"]["output"];
  blockNumber: Scalars["BigInt"]["output"];
  /**  { StakingToken Address }-{ Transaction Hash }-{ Log Index }  */
  id: Scalars["ID"]["output"];
  rewardToken: Token;
  timestamp: Scalars["BigInt"]["output"];
  token: StakingToken;
  txnHash: Scalars["String"]["output"];
};

export type RewardClaim_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_gt?: InputMaybe<Scalars["String"]["input"]>;
  account_gte?: InputMaybe<Scalars["String"]["input"]>;
  account_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_lt?: InputMaybe<Scalars["String"]["input"]>;
  account_lte?: InputMaybe<Scalars["String"]["input"]>;
  account_not?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<RewardClaim_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<RewardClaim_Filter>>>;
  rewardToken?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_?: InputMaybe<Token_Filter>;
  rewardToken_contains?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_gt?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_gte?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rewardToken_lt?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_lte?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rewardToken_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<StakingToken_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txnHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txnHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum RewardClaim_OrderBy {
  Account = "account",
  AccountId = "account__id",
  Amount = "amount",
  BlockNumber = "blockNumber",
  Id = "id",
  RewardToken = "rewardToken",
  RewardTokenAddress = "rewardToken__address",
  RewardTokenBurnCount = "rewardToken__burnCount",
  RewardTokenCumulativeHolderCount = "rewardToken__cumulativeHolderCount",
  RewardTokenCurrentHolderCount = "rewardToken__currentHolderCount",
  RewardTokenDecimals = "rewardToken__decimals",
  RewardTokenId = "rewardToken__id",
  RewardTokenMintCount = "rewardToken__mintCount",
  RewardTokenName = "rewardToken__name",
  RewardTokenSymbol = "rewardToken__symbol",
  RewardTokenTotalBurned = "rewardToken__totalBurned",
  RewardTokenTotalMinted = "rewardToken__totalMinted",
  RewardTokenTotalSupply = "rewardToken__totalSupply",
  RewardTokenTransferCount = "rewardToken__transferCount",
  RewardTokenType = "rewardToken__type",
  Timestamp = "timestamp",
  Token = "token",
  TokenCurrentDelegates = "token__currentDelegates",
  TokenDelegatedVotes = "token__delegatedVotes",
  TokenDelegatedVotesRaw = "token__delegatedVotesRaw",
  TokenId = "token__id",
  TokenTotalDelegates = "token__totalDelegates",
  TxnHash = "txnHash",
}

export type StakingToken = {
  __typename?: "StakingToken";
  /** Total number of delegates participating on the governance currently */
  currentDelegates: Scalars["BigInt"]["output"];
  /**  Governance frameworks  */
  daos: Array<Governance>;
  /** Total number of votes delegated expressed as a BigDecimal normalized value for the token */
  delegatedVotes: Scalars["BigDecimal"]["output"];
  /** Total number of votes delegated expressed in the smallest unit of the token */
  delegatedVotesRaw: Scalars["BigInt"]["output"];
  /**  Delegates  */
  delegates: Array<Delegate>;
  /**  DTFs  */
  dtfs: Array<Dtf>;
  /**  Governance  */
  governance?: Maybe<Governance>;
  /**  Stake token address  */
  id: Scalars["ID"]["output"];
  /**  Legacy governance  */
  legacyGovernance: Array<Scalars["String"]["output"]>;
  /**  Rewards  */
  rewards: Array<StakingTokenRewards>;
  /**  Stake token  */
  token: Token;
  /** Total number of delegates that held delegated votes */
  totalDelegates: Scalars["BigInt"]["output"];
  /**  Token entity for the sake of consistency but this token is not tracked  */
  underlying?: Maybe<Token>;
};

export type StakingTokenDaosArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Governance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Governance_Filter>;
};

export type StakingTokenDelegatesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Delegate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Delegate_Filter>;
};

export type StakingTokenDtfsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Dtf_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Dtf_Filter>;
};

export type StakingTokenRewardsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<StakingTokenRewards_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<StakingTokenRewards_Filter>;
};

export type StakingTokenRewards = {
  __typename?: "StakingTokenRewards";
  /**  Active  */
  active: Scalars["Boolean"]["output"];
  /**  { StakingToken Address }-{ Reward Token Address }  */
  id: Scalars["ID"]["output"];
  /**  Reward token  */
  rewardToken: Token;
  /**  Staking token  */
  stToken: StakingToken;
};

export type StakingTokenRewards_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  active_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  active_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  active_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<StakingTokenRewards_Filter>>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<StakingTokenRewards_Filter>>>;
  rewardToken?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_?: InputMaybe<Token_Filter>;
  rewardToken_contains?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_gt?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_gte?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rewardToken_lt?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_lte?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rewardToken_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  rewardToken_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  stToken?: InputMaybe<Scalars["String"]["input"]>;
  stToken_?: InputMaybe<StakingToken_Filter>;
  stToken_contains?: InputMaybe<Scalars["String"]["input"]>;
  stToken_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  stToken_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  stToken_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  stToken_gt?: InputMaybe<Scalars["String"]["input"]>;
  stToken_gte?: InputMaybe<Scalars["String"]["input"]>;
  stToken_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  stToken_lt?: InputMaybe<Scalars["String"]["input"]>;
  stToken_lte?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  stToken_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  stToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  stToken_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  stToken_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum StakingTokenRewards_OrderBy {
  Active = "active",
  Id = "id",
  RewardToken = "rewardToken",
  RewardTokenAddress = "rewardToken__address",
  RewardTokenBurnCount = "rewardToken__burnCount",
  RewardTokenCumulativeHolderCount = "rewardToken__cumulativeHolderCount",
  RewardTokenCurrentHolderCount = "rewardToken__currentHolderCount",
  RewardTokenDecimals = "rewardToken__decimals",
  RewardTokenId = "rewardToken__id",
  RewardTokenMintCount = "rewardToken__mintCount",
  RewardTokenName = "rewardToken__name",
  RewardTokenSymbol = "rewardToken__symbol",
  RewardTokenTotalBurned = "rewardToken__totalBurned",
  RewardTokenTotalMinted = "rewardToken__totalMinted",
  RewardTokenTotalSupply = "rewardToken__totalSupply",
  RewardTokenTransferCount = "rewardToken__transferCount",
  RewardTokenType = "rewardToken__type",
  StToken = "stToken",
  StTokenCurrentDelegates = "stToken__currentDelegates",
  StTokenDelegatedVotes = "stToken__delegatedVotes",
  StTokenDelegatedVotesRaw = "stToken__delegatedVotesRaw",
  StTokenId = "stToken__id",
  StTokenTotalDelegates = "stToken__totalDelegates",
}

export type StakingToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StakingToken_Filter>>>;
  currentDelegates?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentDelegates_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentDelegates_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentDelegates_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  currentDelegates_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentDelegates_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentDelegates_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentDelegates_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  daos_?: InputMaybe<Governance_Filter>;
  delegatedVotes?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotesRaw?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  delegatedVotesRaw_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  delegatedVotesRaw_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  delegatedVotes_gt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotes_gte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotes_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  delegatedVotes_lt?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotes_lte?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotes_not?: InputMaybe<Scalars["BigDecimal"]["input"]>;
  delegatedVotes_not_in?: InputMaybe<Array<Scalars["BigDecimal"]["input"]>>;
  delegates_?: InputMaybe<Delegate_Filter>;
  dtfs_?: InputMaybe<Dtf_Filter>;
  governance?: InputMaybe<Scalars["String"]["input"]>;
  governance_?: InputMaybe<Governance_Filter>;
  governance_contains?: InputMaybe<Scalars["String"]["input"]>;
  governance_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_gt?: InputMaybe<Scalars["String"]["input"]>;
  governance_gte?: InputMaybe<Scalars["String"]["input"]>;
  governance_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  governance_lt?: InputMaybe<Scalars["String"]["input"]>;
  governance_lte?: InputMaybe<Scalars["String"]["input"]>;
  governance_not?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  governance_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  governance_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  governance_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  legacyGovernance?: InputMaybe<Array<Scalars["String"]["input"]>>;
  legacyGovernance_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  legacyGovernance_contains_nocase?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  legacyGovernance_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  legacyGovernance_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  legacyGovernance_not_contains_nocase?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  or?: InputMaybe<Array<InputMaybe<StakingToken_Filter>>>;
  rewards_?: InputMaybe<StakingTokenRewards_Filter>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  totalDelegates?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegates_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegates_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegates_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalDelegates_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegates_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegates_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalDelegates_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  underlying?: InputMaybe<Scalars["String"]["input"]>;
  underlying_?: InputMaybe<Token_Filter>;
  underlying_contains?: InputMaybe<Scalars["String"]["input"]>;
  underlying_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  underlying_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  underlying_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  underlying_gt?: InputMaybe<Scalars["String"]["input"]>;
  underlying_gte?: InputMaybe<Scalars["String"]["input"]>;
  underlying_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  underlying_lt?: InputMaybe<Scalars["String"]["input"]>;
  underlying_lte?: InputMaybe<Scalars["String"]["input"]>;
  underlying_not?: InputMaybe<Scalars["String"]["input"]>;
  underlying_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  underlying_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  underlying_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  underlying_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  underlying_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  underlying_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  underlying_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  underlying_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  underlying_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum StakingToken_OrderBy {
  CurrentDelegates = "currentDelegates",
  Daos = "daos",
  DelegatedVotes = "delegatedVotes",
  DelegatedVotesRaw = "delegatedVotesRaw",
  Delegates = "delegates",
  Dtfs = "dtfs",
  Governance = "governance",
  GovernanceId = "governance__id",
  GovernanceName = "governance__name",
  GovernanceProposalCount = "governance__proposalCount",
  GovernanceProposalThreshold = "governance__proposalThreshold",
  GovernanceProposalsCanceled = "governance__proposalsCanceled",
  GovernanceProposalsExecuted = "governance__proposalsExecuted",
  GovernanceProposalsQueued = "governance__proposalsQueued",
  GovernanceQuorumDenominator = "governance__quorumDenominator",
  GovernanceQuorumNumerator = "governance__quorumNumerator",
  GovernanceQuorumVotes = "governance__quorumVotes",
  GovernanceVersion = "governance__version",
  GovernanceVotingDelay = "governance__votingDelay",
  GovernanceVotingPeriod = "governance__votingPeriod",
  Id = "id",
  LegacyGovernance = "legacyGovernance",
  Rewards = "rewards",
  Token = "token",
  TokenAddress = "token__address",
  TokenBurnCount = "token__burnCount",
  TokenCumulativeHolderCount = "token__cumulativeHolderCount",
  TokenCurrentHolderCount = "token__currentHolderCount",
  TokenDecimals = "token__decimals",
  TokenId = "token__id",
  TokenMintCount = "token__mintCount",
  TokenName = "token__name",
  TokenSymbol = "token__symbol",
  TokenTotalBurned = "token__totalBurned",
  TokenTotalMinted = "token__totalMinted",
  TokenTotalSupply = "token__totalSupply",
  TokenTransferCount = "token__transferCount",
  TokenType = "token__type",
  TotalDelegates = "totalDelegates",
  Underlying = "underlying",
  UnderlyingAddress = "underlying__address",
  UnderlyingBurnCount = "underlying__burnCount",
  UnderlyingCumulativeHolderCount = "underlying__cumulativeHolderCount",
  UnderlyingCurrentHolderCount = "underlying__currentHolderCount",
  UnderlyingDecimals = "underlying__decimals",
  UnderlyingId = "underlying__id",
  UnderlyingMintCount = "underlying__mintCount",
  UnderlyingName = "underlying__name",
  UnderlyingSymbol = "underlying__symbol",
  UnderlyingTotalBurned = "underlying__totalBurned",
  UnderlyingTotalMinted = "underlying__totalMinted",
  UnderlyingTotalSupply = "underlying__totalSupply",
  UnderlyingTransferCount = "underlying__transferCount",
  UnderlyingType = "underlying__type",
}

export type TimelockOperation = {
  __typename?: "TimelockOperation";
  /** Block number where the operation was scheduled */
  blockNumber: Scalars["BigInt"]["output"];
  /** Timelock operation ID (bytes32 from CallScheduled event) */
  id: Scalars["ID"]["output"];
  /** Proposal associated with this timelock operation */
  proposal?: Maybe<Proposal>;
  /** Timestamp when the operation was scheduled */
  timestamp: Scalars["BigInt"]["output"];
  /** Transaction hash where the operation was scheduled */
  transactionHash: Scalars["String"]["output"];
};

export type TimelockOperationByTx = {
  __typename?: "TimelockOperationByTx";
  /** Transaction hash as ID */
  id: Scalars["ID"]["output"];
  /** Timelock operation ID associated with this transaction */
  timelockId: Scalars["String"]["output"];
};

export type TimelockOperationByTx_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TimelockOperationByTx_Filter>>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<TimelockOperationByTx_Filter>>>;
  timelockId?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_contains?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_gt?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_gte?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  timelockId_lt?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_lte?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  timelockId_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  timelockId_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum TimelockOperationByTx_OrderBy {
  Id = "id",
  TimelockId = "timelockId",
}

export type TimelockOperation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TimelockOperation_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<TimelockOperation_Filter>>>;
  proposal?: InputMaybe<Scalars["String"]["input"]>;
  proposal_?: InputMaybe<Proposal_Filter>;
  proposal_contains?: InputMaybe<Scalars["String"]["input"]>;
  proposal_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_gt?: InputMaybe<Scalars["String"]["input"]>;
  proposal_gte?: InputMaybe<Scalars["String"]["input"]>;
  proposal_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  proposal_lt?: InputMaybe<Scalars["String"]["input"]>;
  proposal_lte?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  proposal_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transactionHash?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  transactionHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum TimelockOperation_OrderBy {
  BlockNumber = "blockNumber",
  Id = "id",
  Proposal = "proposal",
  ProposalAbstainDelegateVotes = "proposal__abstainDelegateVotes",
  ProposalAbstainWeightedVotes = "proposal__abstainWeightedVotes",
  ProposalAgainstDelegateVotes = "proposal__againstDelegateVotes",
  ProposalAgainstWeightedVotes = "proposal__againstWeightedVotes",
  ProposalCancellationBlock = "proposal__cancellationBlock",
  ProposalCancellationTime = "proposal__cancellationTime",
  ProposalCancellationTxnHash = "proposal__cancellationTxnHash",
  ProposalCreationBlock = "proposal__creationBlock",
  ProposalCreationTime = "proposal__creationTime",
  ProposalDelegatesAtStart = "proposal__delegatesAtStart",
  ProposalDescription = "proposal__description",
  ProposalExecutionBlock = "proposal__executionBlock",
  ProposalExecutionEta = "proposal__executionETA",
  ProposalExecutionTime = "proposal__executionTime",
  ProposalExecutionTxnHash = "proposal__executionTxnHash",
  ProposalForDelegateVotes = "proposal__forDelegateVotes",
  ProposalForWeightedVotes = "proposal__forWeightedVotes",
  ProposalId = "proposal__id",
  ProposalQueueBlock = "proposal__queueBlock",
  ProposalQueueTime = "proposal__queueTime",
  ProposalQueueTxnHash = "proposal__queueTxnHash",
  ProposalQuorumVotes = "proposal__quorumVotes",
  ProposalState = "proposal__state",
  ProposalTimelockId = "proposal__timelockId",
  ProposalTokenHoldersAtStart = "proposal__tokenHoldersAtStart",
  ProposalTotalDelegateVotes = "proposal__totalDelegateVotes",
  ProposalTotalWeightedVotes = "proposal__totalWeightedVotes",
  ProposalTxnHash = "proposal__txnHash",
  ProposalVoteEnd = "proposal__voteEnd",
  ProposalVoteStart = "proposal__voteStart",
  Timestamp = "timestamp",
  TransactionHash = "transactionHash",
}

export type Token = {
  __typename?: "Token";
  /**  Address of the token  */
  address: Scalars["Bytes"]["output"];
  /**  Total number of token burn events  */
  burnCount: Scalars["BigInt"]["output"];
  /**  Total number of cumulative unique token holders who held or are holding the token  */
  cumulativeHolderCount: Scalars["BigInt"]["output"];
  /**  Total number of unique token holders who are currently holding more the token  */
  currentHolderCount: Scalars["BigInt"]["output"];
  /**  Daily snapshot for this token  */
  dailyTokenSnapshot: Array<TokenDailySnapshot>;
  /**  The number of decimal places this token uses, default to 18  */
  decimals: Scalars["Int"]["output"];
  /**  Token holder's balance  */
  holdersBalance: Array<AccountBalance>;
  /**  Smart contract address of the token  */
  id: Scalars["ID"]["output"];
  /**  Total number of token mint events  */
  mintCount: Scalars["BigInt"]["output"];
  /**  Name of the token, mirrored from the smart contract  */
  name: Scalars["String"]["output"];
  /**  Symbol of the token, mirrored from the smart contract  */
  symbol: Scalars["String"]["output"];
  /**  Total token burned  */
  totalBurned: Scalars["BigInt"]["output"];
  /**  Total token minted  */
  totalMinted: Scalars["BigInt"]["output"];
  /**  Total token supply  */
  totalSupply: Scalars["BigInt"]["output"];
  /**  Total number of token transfer events  */
  transferCount: Scalars["BigInt"]["output"];
  /**  List of token transfers  */
  transfers: Array<TransferEvent>;
  /**  Token type  */
  type: TokenType;
};

export type TokenDailyTokenSnapshotArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<TokenDailySnapshot_Filter>;
};

export type TokenHoldersBalanceArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AccountBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<AccountBalance_Filter>;
};

export type TokenTransfersArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TransferEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<TransferEvent_Filter>;
};

export type TokenDailySnapshot = {
  __typename?: "TokenDailySnapshot";
  /**  Block number of this snapshot  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  number of cumulative unique holders  */
  cumulativeHolderCount: Scalars["BigInt"]["output"];
  /**  number of accounts holding the token  */
  currentHolderCount: Scalars["BigInt"]["output"];
  /**  Total number of token burnt in a day  */
  dailyBurnAmount: Scalars["BigInt"]["output"];
  /**  Total number of burns in a day  */
  dailyBurnCount: Scalars["Int"]["output"];
  /**  Total number of events occurred in a day  */
  dailyEventCount: Scalars["Int"]["output"];
  /**  Daily external recipients revenue for this DTF  */
  dailyExternalRevenue: Scalars["BigInt"]["output"];
  /**  Daily governance revenue for this DTF  */
  dailyGovernanceRevenue: Scalars["BigInt"]["output"];
  /**  Total number of token minted in a day  */
  dailyMintAmount: Scalars["BigInt"]["output"];
  /**  Total number of mints in a day  */
  dailyMintCount: Scalars["Int"]["output"];
  /**  Daily protocol revenue for this DTF  */
  dailyProtocolRevenue: Scalars["BigInt"]["output"];
  /**  Daily revenue for this DTF  */
  dailyRevenue: Scalars["BigInt"]["output"];
  /**  Daily total Supply of the token  */
  dailyTotalSupply: Scalars["BigInt"]["output"];
  /**  Total number of token transfered in a day  */
  dailyTransferAmount: Scalars["BigInt"]["output"];
  /**  Total number of transfers in a day  */
  dailyTransferCount: Scalars["Int"]["output"];
  /**  { Token Address }-{ # of days since Unix epoch time }  */
  id: Scalars["ID"]["output"];
  /**  Timestamp of this snapshot  */
  timestamp: Scalars["BigInt"]["output"];
  /**  Token this snapshot is associated with  */
  token: Token;
};

export type TokenDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeHolderCount?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeHolderCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  currentHolderCount?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  currentHolderCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyBurnAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyBurnAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyBurnAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyBurnCount?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  dailyBurnCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  dailyBurnCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  dailyEventCount?: InputMaybe<Scalars["Int"]["input"]>;
  dailyEventCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  dailyEventCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  dailyEventCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  dailyEventCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  dailyEventCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  dailyEventCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  dailyEventCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  dailyExternalRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyExternalRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyExternalRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyExternalRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyExternalRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyExternalRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyExternalRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyExternalRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyGovernanceRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyGovernanceRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyGovernanceRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyGovernanceRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyGovernanceRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyGovernanceRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyGovernanceRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyGovernanceRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyMintAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyMintAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyMintAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyMintAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyMintAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyMintAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyMintAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyMintAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyMintCount?: InputMaybe<Scalars["Int"]["input"]>;
  dailyMintCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  dailyMintCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  dailyMintCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  dailyMintCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  dailyMintCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  dailyMintCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  dailyMintCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  dailyProtocolRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyProtocolRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyProtocolRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyProtocolRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyProtocolRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyProtocolRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyProtocolRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyProtocolRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyTotalSupply?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTotalSupply_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTotalSupply_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTotalSupply_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyTotalSupply_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTotalSupply_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTotalSupply_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTotalSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyTransferAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTransferAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTransferAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTransferAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyTransferAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTransferAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTransferAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  dailyTransferAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyTransferCount?: InputMaybe<Scalars["Int"]["input"]>;
  dailyTransferCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  dailyTransferCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  dailyTransferCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  dailyTransferCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  dailyTransferCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  dailyTransferCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  dailyTransferCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<TokenDailySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum TokenDailySnapshot_OrderBy {
  BlockNumber = "blockNumber",
  CumulativeHolderCount = "cumulativeHolderCount",
  CurrentHolderCount = "currentHolderCount",
  DailyBurnAmount = "dailyBurnAmount",
  DailyBurnCount = "dailyBurnCount",
  DailyEventCount = "dailyEventCount",
  DailyExternalRevenue = "dailyExternalRevenue",
  DailyGovernanceRevenue = "dailyGovernanceRevenue",
  DailyMintAmount = "dailyMintAmount",
  DailyMintCount = "dailyMintCount",
  DailyProtocolRevenue = "dailyProtocolRevenue",
  DailyRevenue = "dailyRevenue",
  DailyTotalSupply = "dailyTotalSupply",
  DailyTransferAmount = "dailyTransferAmount",
  DailyTransferCount = "dailyTransferCount",
  Id = "id",
  Timestamp = "timestamp",
  Token = "token",
  TokenAddress = "token__address",
  TokenBurnCount = "token__burnCount",
  TokenCumulativeHolderCount = "token__cumulativeHolderCount",
  TokenCurrentHolderCount = "token__currentHolderCount",
  TokenDecimals = "token__decimals",
  TokenId = "token__id",
  TokenMintCount = "token__mintCount",
  TokenName = "token__name",
  TokenSymbol = "token__symbol",
  TokenTotalBurned = "token__totalBurned",
  TokenTotalMinted = "token__totalMinted",
  TokenTotalSupply = "token__totalSupply",
  TokenTransferCount = "token__transferCount",
  TokenType = "token__type",
}

export type TokenHourlySnapshot = {
  __typename?: "TokenHourlySnapshot";
  /**  Block number of this snapshot  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  number of cumulative unique holders  */
  cumulativeHolderCount: Scalars["BigInt"]["output"];
  /**  number of accounts holding this token  */
  currentHolderCount: Scalars["BigInt"]["output"];
  /**  Total number of token burnt in a hour  */
  hourlyBurnAmount: Scalars["BigInt"]["output"];
  /**  Total number of burns in a hour  */
  hourlyBurnCount: Scalars["Int"]["output"];
  /**  Total number of events occurred in an hour  */
  hourlyEventCount: Scalars["Int"]["output"];
  /**  Hourly external recipients revenue for this DTF  */
  hourlyExternalRevenue: Scalars["BigInt"]["output"];
  /**  Hourly governance revenue for this DTF  */
  hourlyGovernanceRevenue: Scalars["BigInt"]["output"];
  /**  Total amount of token minted in a hour  */
  hourlyMintAmount: Scalars["BigInt"]["output"];
  /**  Total number of mints in a hour  */
  hourlyMintCount: Scalars["Int"]["output"];
  /**  Hourly protocol revenue for this DTF  */
  hourlyProtocolRevenue: Scalars["BigInt"]["output"];
  /**  Hourly revenue for this DTF  */
  hourlyRevenue: Scalars["BigInt"]["output"];
  /**  Hourly total Supply of the token  */
  hourlyTotalSupply: Scalars["BigInt"]["output"];
  /**  Total amount of token transfered in a hour  */
  hourlyTransferAmount: Scalars["BigInt"]["output"];
  /**  Total number of transfers in a hour  */
  hourlyTransferCount: Scalars["Int"]["output"];
  /**  { Token Address }-{ # of hours since Unix epoch time }  */
  id: Scalars["ID"]["output"];
  /**  Timestamp of this snapshot  */
  timestamp: Scalars["BigInt"]["output"];
  /**  Token this snapshot is associated with  */
  token: Token;
};

export type TokenHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenHourlySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeHolderCount?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeHolderCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  currentHolderCount?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  currentHolderCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyBurnAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyBurnAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyBurnAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyBurnAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyBurnAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyBurnAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyBurnAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyBurnAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyBurnCount?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyBurnCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyBurnCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyBurnCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hourlyBurnCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyBurnCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyBurnCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyBurnCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hourlyEventCount?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyEventCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyEventCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyEventCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hourlyEventCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyEventCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyEventCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyEventCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hourlyExternalRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyExternalRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyExternalRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyExternalRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyExternalRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyExternalRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyExternalRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyExternalRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyGovernanceRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyGovernanceRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyGovernanceRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyGovernanceRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyGovernanceRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyGovernanceRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyGovernanceRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyGovernanceRevenue_not_in?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  hourlyMintAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyMintAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyMintAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyMintAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyMintAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyMintAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyMintAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyMintAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyMintCount?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyMintCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyMintCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyMintCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hourlyMintCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyMintCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyMintCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyMintCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hourlyProtocolRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyProtocolRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyProtocolRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyProtocolRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyProtocolRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyProtocolRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyProtocolRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyProtocolRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyTotalSupply?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTotalSupply_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTotalSupply_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTotalSupply_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyTotalSupply_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTotalSupply_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTotalSupply_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTotalSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyTransferAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTransferAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTransferAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTransferAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyTransferAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTransferAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTransferAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  hourlyTransferAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hourlyTransferCount?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyTransferCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyTransferCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyTransferCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  hourlyTransferCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyTransferCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyTransferCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  hourlyTransferCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<TokenHourlySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum TokenHourlySnapshot_OrderBy {
  BlockNumber = "blockNumber",
  CumulativeHolderCount = "cumulativeHolderCount",
  CurrentHolderCount = "currentHolderCount",
  HourlyBurnAmount = "hourlyBurnAmount",
  HourlyBurnCount = "hourlyBurnCount",
  HourlyEventCount = "hourlyEventCount",
  HourlyExternalRevenue = "hourlyExternalRevenue",
  HourlyGovernanceRevenue = "hourlyGovernanceRevenue",
  HourlyMintAmount = "hourlyMintAmount",
  HourlyMintCount = "hourlyMintCount",
  HourlyProtocolRevenue = "hourlyProtocolRevenue",
  HourlyRevenue = "hourlyRevenue",
  HourlyTotalSupply = "hourlyTotalSupply",
  HourlyTransferAmount = "hourlyTransferAmount",
  HourlyTransferCount = "hourlyTransferCount",
  Id = "id",
  Timestamp = "timestamp",
  Token = "token",
  TokenAddress = "token__address",
  TokenBurnCount = "token__burnCount",
  TokenCumulativeHolderCount = "token__cumulativeHolderCount",
  TokenCurrentHolderCount = "token__currentHolderCount",
  TokenDecimals = "token__decimals",
  TokenId = "token__id",
  TokenMintCount = "token__mintCount",
  TokenName = "token__name",
  TokenSymbol = "token__symbol",
  TokenTotalBurned = "token__totalBurned",
  TokenTotalMinted = "token__totalMinted",
  TokenTotalSupply = "token__totalSupply",
  TokenTransferCount = "token__transferCount",
  TokenType = "token__type",
}

export type TokenMonthlySnapshot = {
  __typename?: "TokenMonthlySnapshot";
  /**  Block number  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  Cumulative mints  */
  cumulativeMintAmount: Scalars["BigInt"]["output"];
  /**  Cumulative protocol revenue  */
  cumulativeProtocolRevenue: Scalars["BigInt"]["output"];
  /**  Cumulative revenue up to this month  */
  cumulativeRevenue: Scalars["BigInt"]["output"];
  /**  { Token Address }-{ # of months since Unix epoch }  */
  id: Scalars["ID"]["output"];
  /**  Monthly burn amount (DTF shares burned)  */
  monthlyBurnAmount: Scalars["BigInt"]["output"];
  /**  Monthly burn count  */
  monthlyBurnCount: Scalars["Int"]["output"];
  /**  Monthly external revenue for this DTF  */
  monthlyExternalRevenue: Scalars["BigInt"]["output"];
  /**  Monthly governance revenue for this DTF  */
  monthlyGovernanceRevenue: Scalars["BigInt"]["output"];
  /**  Monthly mint amount (DTF shares minted)  */
  monthlyMintAmount: Scalars["BigInt"]["output"];
  /**  Monthly mint count (number of mint transactions)  */
  monthlyMintCount: Scalars["Int"]["output"];
  /**  Monthly protocol revenue for this DTF  */
  monthlyProtocolRevenue: Scalars["BigInt"]["output"];
  /**  Monthly total revenue for this DTF  */
  monthlyRevenue: Scalars["BigInt"]["output"];
  /**  End of month supply  */
  monthlyTotalSupply: Scalars["BigInt"]["output"];
  /**  Timestamp  */
  timestamp: Scalars["BigInt"]["output"];
  /**  Token this snapshot is for  */
  token: Token;
};

export type TokenMonthlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenMonthlySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeMintAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeMintAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeMintAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeMintAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeMintAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeMintAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeMintAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeMintAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeProtocolRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeProtocolRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeProtocolRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeProtocolRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeProtocolRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeProtocolRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeProtocolRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeProtocolRevenue_not_in?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  cumulativeRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  monthlyBurnAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyBurnAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyBurnAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyBurnCount?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  monthlyBurnCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyBurnCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  monthlyExternalRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyExternalRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyExternalRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyExternalRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyExternalRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyExternalRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyExternalRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyExternalRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyGovernanceRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyGovernanceRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyGovernanceRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyGovernanceRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyGovernanceRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyGovernanceRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyGovernanceRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyGovernanceRevenue_not_in?: InputMaybe<
    Array<Scalars["BigInt"]["input"]>
  >;
  monthlyMintAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyMintAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyMintAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyMintAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyMintAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyMintAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyMintAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyMintAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyMintCount?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyMintCount_gt?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyMintCount_gte?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyMintCount_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  monthlyMintCount_lt?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyMintCount_lte?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyMintCount_not?: InputMaybe<Scalars["Int"]["input"]>;
  monthlyMintCount_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  monthlyProtocolRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyProtocolRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyProtocolRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyProtocolRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyProtocolRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyProtocolRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyProtocolRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyProtocolRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyRevenue?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyRevenue_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyRevenue_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyRevenue_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyRevenue_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyRevenue_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyRevenue_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyRevenue_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyTotalSupply?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyTotalSupply_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyTotalSupply_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyTotalSupply_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  monthlyTotalSupply_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyTotalSupply_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyTotalSupply_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  monthlyTotalSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<TokenMonthlySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum TokenMonthlySnapshot_OrderBy {
  BlockNumber = "blockNumber",
  CumulativeMintAmount = "cumulativeMintAmount",
  CumulativeProtocolRevenue = "cumulativeProtocolRevenue",
  CumulativeRevenue = "cumulativeRevenue",
  Id = "id",
  MonthlyBurnAmount = "monthlyBurnAmount",
  MonthlyBurnCount = "monthlyBurnCount",
  MonthlyExternalRevenue = "monthlyExternalRevenue",
  MonthlyGovernanceRevenue = "monthlyGovernanceRevenue",
  MonthlyMintAmount = "monthlyMintAmount",
  MonthlyMintCount = "monthlyMintCount",
  MonthlyProtocolRevenue = "monthlyProtocolRevenue",
  MonthlyRevenue = "monthlyRevenue",
  MonthlyTotalSupply = "monthlyTotalSupply",
  Timestamp = "timestamp",
  Token = "token",
  TokenAddress = "token__address",
  TokenBurnCount = "token__burnCount",
  TokenCumulativeHolderCount = "token__cumulativeHolderCount",
  TokenCurrentHolderCount = "token__currentHolderCount",
  TokenDecimals = "token__decimals",
  TokenId = "token__id",
  TokenMintCount = "token__mintCount",
  TokenName = "token__name",
  TokenSymbol = "token__symbol",
  TokenTotalBurned = "token__totalBurned",
  TokenTotalMinted = "token__totalMinted",
  TokenTotalSupply = "token__totalSupply",
  TokenTransferCount = "token__transferCount",
  TokenType = "token__type",
}

export enum TokenType {
  Asset = "ASSET",
  BridgedDtf = "BRIDGED_DTF",
  Dtf = "DTF",
  Vote = "VOTE",
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  address_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  burnCount?: InputMaybe<Scalars["BigInt"]["input"]>;
  burnCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  burnCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  burnCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  burnCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  burnCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  burnCount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  burnCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeHolderCount?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  cumulativeHolderCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  cumulativeHolderCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  currentHolderCount?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  currentHolderCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  currentHolderCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  dailyTokenSnapshot_?: InputMaybe<TokenDailySnapshot_Filter>;
  decimals?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_gt?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_gte?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  decimals_lt?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_lte?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_not?: InputMaybe<Scalars["Int"]["input"]>;
  decimals_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  holdersBalance_?: InputMaybe<AccountBalance_Filter>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  mintCount?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  mintCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintCount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  name_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_gt?: InputMaybe<Scalars["String"]["input"]>;
  name_gte?: InputMaybe<Scalars["String"]["input"]>;
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_lt?: InputMaybe<Scalars["String"]["input"]>;
  name_lte?: InputMaybe<Scalars["String"]["input"]>;
  name_not?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  symbol?: InputMaybe<Scalars["String"]["input"]>;
  symbol_contains?: InputMaybe<Scalars["String"]["input"]>;
  symbol_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_gt?: InputMaybe<Scalars["String"]["input"]>;
  symbol_gte?: InputMaybe<Scalars["String"]["input"]>;
  symbol_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  symbol_lt?: InputMaybe<Scalars["String"]["input"]>;
  symbol_lte?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  symbol_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  symbol_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  symbol_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  totalBurned?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalBurned_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalBurned_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalMinted?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalMinted_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalMinted_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalMinted_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalMinted_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalMinted_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalMinted_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalMinted_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalSupply?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalSupply_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalSupply_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalSupply_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalSupply_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalSupply_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalSupply_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalSupply_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transferCount?: InputMaybe<Scalars["BigInt"]["input"]>;
  transferCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  transferCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  transferCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transferCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  transferCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  transferCount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  transferCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  transfers_?: InputMaybe<TransferEvent_Filter>;
  type?: InputMaybe<TokenType>;
  type_in?: InputMaybe<Array<TokenType>>;
  type_not?: InputMaybe<TokenType>;
  type_not_in?: InputMaybe<Array<TokenType>>;
};

export enum Token_OrderBy {
  Address = "address",
  BurnCount = "burnCount",
  CumulativeHolderCount = "cumulativeHolderCount",
  CurrentHolderCount = "currentHolderCount",
  DailyTokenSnapshot = "dailyTokenSnapshot",
  Decimals = "decimals",
  HoldersBalance = "holdersBalance",
  Id = "id",
  MintCount = "mintCount",
  Name = "name",
  Symbol = "symbol",
  TotalBurned = "totalBurned",
  TotalMinted = "totalMinted",
  TotalSupply = "totalSupply",
  TransferCount = "transferCount",
  Transfers = "transfers",
  Type = "type",
}

/**  @deprecated - v1.0 / v2.0 auctions  */
export type Trade = {
  __typename?: "Trade";
  /**  Approved block number  */
  approvedBlockNumber: Scalars["BigInt"]["output"];
  /**  approvedBuyLimitSpot  */
  approvedBuyLimitSpot: Scalars["BigInt"]["output"];
  /**  Approved end price  */
  approvedEndPrice: Scalars["BigInt"]["output"];
  /**  approvedSellLimitSpot  */
  approvedSellLimitSpot: Scalars["BigInt"]["output"];
  /**  Approved start price  */
  approvedStartPrice: Scalars["BigInt"]["output"];
  /**  Approved timestamp  */
  approvedTimestamp: Scalars["BigInt"]["output"];
  /**  Approved transaction hash  */
  approvedTransactionHash: Scalars["String"]["output"];
  /**  Available at (permissionless start)  */
  availableAt: Scalars["BigInt"]["output"];
  /**  Runs remaining  */
  availableRuns: Scalars["BigInt"]["output"];
  /**  Bids  */
  bids: Array<AuctionBid>;
  /**  Trade bought amount  */
  boughtAmount: Scalars["BigInt"]["output"];
  /**  Token to  */
  buy: Token;
  /**  Buy limit high  */
  buyLimitHigh: Scalars["BigInt"]["output"];
  /**  Buy limit low  */
  buyLimitLow: Scalars["BigInt"]["output"];
  /**  Buy limit spot  */
  buyLimitSpot: Scalars["BigInt"]["output"];
  /**  Closed block number  */
  closedBlockNumber: Scalars["BigInt"]["output"];
  /**  Closed timestamp  */
  closedTimestamp: Scalars["BigInt"]["output"];
  /**  Closed transaction hash  */
  closedTransactionHash: Scalars["String"]["output"];
  /**  DTF  */
  dtf: Dtf;
  /**  Trade end timestamp  */
  end: Scalars["BigInt"]["output"];
  /**  Trade end price  */
  endPrice: Scalars["BigInt"]["output"];
  /**  Trade ID  */
  id: Scalars["ID"]["output"];
  /**  isKilled  */
  isKilled: Scalars["Boolean"]["output"];
  /**  Timestamp launch timeout trades become unavailable if not launched within this time  */
  launchTimeout: Scalars["BigInt"]["output"];
  /**  Launched block number  */
  launchedBlockNumber: Scalars["BigInt"]["output"];
  /**  Launched timestamp  */
  launchedTimestamp: Scalars["BigInt"]["output"];
  /**  Launched transaction hash  */
  launchedTransactionHash: Scalars["String"]["output"];
  /**  Token from  */
  sell: Token;
  /**  Sell limit high  */
  sellLimitHigh: Scalars["BigInt"]["output"];
  /**  Sell limit low  */
  sellLimitLow: Scalars["BigInt"]["output"];
  /**  Sell limit spot  */
  sellLimitSpot: Scalars["BigInt"]["output"];
  /**  Trade sold amount  */
  soldAmount: Scalars["BigInt"]["output"];
  /**  Trade start timestamp  */
  start: Scalars["BigInt"]["output"];
  /**  Trade start price  */
  startPrice: Scalars["BigInt"]["output"];
  /**  Trade state  */
  state: TradeState;
};

/**  @deprecated - v1.0 / v2.0 auctions  */
export type TradeBidsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<AuctionBid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<AuctionBid_Filter>;
};

export enum TradeState {
  Approved = "APPROVED",
  Closed = "CLOSED",
  Launched = "LAUNCHED",
}

export type Trade_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Trade_Filter>>>;
  approvedBlockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBlockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBlockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBlockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedBlockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBlockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBlockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBlockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedBuyLimitSpot?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBuyLimitSpot_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBuyLimitSpot_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBuyLimitSpot_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedBuyLimitSpot_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBuyLimitSpot_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBuyLimitSpot_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedBuyLimitSpot_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedEndPrice?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedEndPrice_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedEndPrice_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedEndPrice_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedEndPrice_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedEndPrice_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedEndPrice_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedEndPrice_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedSellLimitSpot?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedSellLimitSpot_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedSellLimitSpot_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedSellLimitSpot_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedSellLimitSpot_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedSellLimitSpot_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedSellLimitSpot_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedSellLimitSpot_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedStartPrice?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedStartPrice_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedStartPrice_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedStartPrice_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedStartPrice_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedStartPrice_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedStartPrice_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedStartPrice_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  approvedTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approvedTransactionHash?: InputMaybe<Scalars["String"]["input"]>;
  approvedTransactionHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  approvedTransactionHash_contains_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  approvedTransactionHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  approvedTransactionHash_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  approvedTransactionHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  approvedTransactionHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  approvedTransactionHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  approvedTransactionHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  approvedTransactionHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  approvedTransactionHash_not?: InputMaybe<Scalars["String"]["input"]>;
  approvedTransactionHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  approvedTransactionHash_not_contains_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  approvedTransactionHash_not_ends_with?: InputMaybe<
    Scalars["String"]["input"]
  >;
  approvedTransactionHash_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  approvedTransactionHash_not_in?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  approvedTransactionHash_not_starts_with?: InputMaybe<
    Scalars["String"]["input"]
  >;
  approvedTransactionHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  approvedTransactionHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  approvedTransactionHash_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  availableAt?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableAt_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableAt_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableAt_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  availableAt_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableAt_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableAt_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableAt_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  availableRuns?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableRuns_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableRuns_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableRuns_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  availableRuns_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableRuns_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableRuns_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  availableRuns_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  bids_?: InputMaybe<AuctionBid_Filter>;
  boughtAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  boughtAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  boughtAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  boughtAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  boughtAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  boughtAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  boughtAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  boughtAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buy?: InputMaybe<Scalars["String"]["input"]>;
  buyLimitHigh?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitHigh_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitHigh_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitHigh_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buyLimitHigh_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitHigh_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitHigh_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitHigh_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buyLimitLow?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitLow_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitLow_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitLow_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buyLimitLow_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitLow_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitLow_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitLow_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buyLimitSpot?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitSpot_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitSpot_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitSpot_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buyLimitSpot_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitSpot_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitSpot_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  buyLimitSpot_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  buy_?: InputMaybe<Token_Filter>;
  buy_contains?: InputMaybe<Scalars["String"]["input"]>;
  buy_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  buy_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  buy_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  buy_gt?: InputMaybe<Scalars["String"]["input"]>;
  buy_gte?: InputMaybe<Scalars["String"]["input"]>;
  buy_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  buy_lt?: InputMaybe<Scalars["String"]["input"]>;
  buy_lte?: InputMaybe<Scalars["String"]["input"]>;
  buy_not?: InputMaybe<Scalars["String"]["input"]>;
  buy_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  buy_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  buy_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  buy_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  buy_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  buy_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  buy_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  buy_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  buy_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  closedBlockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedBlockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedBlockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedBlockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  closedBlockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedBlockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedBlockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedBlockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  closedTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  closedTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  closedTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  closedTransactionHash?: InputMaybe<Scalars["String"]["input"]>;
  closedTransactionHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  closedTransactionHash_contains_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  closedTransactionHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  closedTransactionHash_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  closedTransactionHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  closedTransactionHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  closedTransactionHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  closedTransactionHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  closedTransactionHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  closedTransactionHash_not?: InputMaybe<Scalars["String"]["input"]>;
  closedTransactionHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  closedTransactionHash_not_contains_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  closedTransactionHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  closedTransactionHash_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  closedTransactionHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  closedTransactionHash_not_starts_with?: InputMaybe<
    Scalars["String"]["input"]
  >;
  closedTransactionHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  closedTransactionHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  closedTransactionHash_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  dtf?: InputMaybe<Scalars["String"]["input"]>;
  dtf_?: InputMaybe<Dtf_Filter>;
  dtf_contains?: InputMaybe<Scalars["String"]["input"]>;
  dtf_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_gt?: InputMaybe<Scalars["String"]["input"]>;
  dtf_gte?: InputMaybe<Scalars["String"]["input"]>;
  dtf_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  dtf_lt?: InputMaybe<Scalars["String"]["input"]>;
  dtf_lte?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  dtf_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  dtf_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  dtf_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  end?: InputMaybe<Scalars["BigInt"]["input"]>;
  endPrice?: InputMaybe<Scalars["BigInt"]["input"]>;
  endPrice_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  endPrice_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  endPrice_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  endPrice_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  endPrice_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  endPrice_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  endPrice_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  end_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  end_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  end_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  end_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  end_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  end_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  end_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isKilled?: InputMaybe<Scalars["Boolean"]["input"]>;
  isKilled_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isKilled_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isKilled_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  launchTimeout?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchTimeout_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchTimeout_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchTimeout_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  launchTimeout_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchTimeout_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchTimeout_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchTimeout_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  launchedBlockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedBlockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedBlockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedBlockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  launchedBlockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedBlockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedBlockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedBlockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  launchedTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  launchedTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  launchedTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  launchedTransactionHash?: InputMaybe<Scalars["String"]["input"]>;
  launchedTransactionHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  launchedTransactionHash_contains_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  launchedTransactionHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  launchedTransactionHash_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  launchedTransactionHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  launchedTransactionHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  launchedTransactionHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  launchedTransactionHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  launchedTransactionHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  launchedTransactionHash_not?: InputMaybe<Scalars["String"]["input"]>;
  launchedTransactionHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  launchedTransactionHash_not_contains_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  launchedTransactionHash_not_ends_with?: InputMaybe<
    Scalars["String"]["input"]
  >;
  launchedTransactionHash_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  launchedTransactionHash_not_in?: InputMaybe<
    Array<Scalars["String"]["input"]>
  >;
  launchedTransactionHash_not_starts_with?: InputMaybe<
    Scalars["String"]["input"]
  >;
  launchedTransactionHash_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  launchedTransactionHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  launchedTransactionHash_starts_with_nocase?: InputMaybe<
    Scalars["String"]["input"]
  >;
  or?: InputMaybe<Array<InputMaybe<Trade_Filter>>>;
  sell?: InputMaybe<Scalars["String"]["input"]>;
  sellLimitHigh?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitHigh_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitHigh_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitHigh_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  sellLimitHigh_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitHigh_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitHigh_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitHigh_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  sellLimitLow?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitLow_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitLow_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitLow_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  sellLimitLow_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitLow_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitLow_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitLow_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  sellLimitSpot?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitSpot_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitSpot_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitSpot_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  sellLimitSpot_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitSpot_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitSpot_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  sellLimitSpot_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  sell_?: InputMaybe<Token_Filter>;
  sell_contains?: InputMaybe<Scalars["String"]["input"]>;
  sell_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  sell_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  sell_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  sell_gt?: InputMaybe<Scalars["String"]["input"]>;
  sell_gte?: InputMaybe<Scalars["String"]["input"]>;
  sell_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  sell_lt?: InputMaybe<Scalars["String"]["input"]>;
  sell_lte?: InputMaybe<Scalars["String"]["input"]>;
  sell_not?: InputMaybe<Scalars["String"]["input"]>;
  sell_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  sell_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  sell_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  sell_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  sell_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  sell_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  sell_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  sell_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  sell_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  soldAmount?: InputMaybe<Scalars["BigInt"]["input"]>;
  soldAmount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  soldAmount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  soldAmount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  soldAmount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  soldAmount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  soldAmount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  soldAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  start?: InputMaybe<Scalars["BigInt"]["input"]>;
  startPrice?: InputMaybe<Scalars["BigInt"]["input"]>;
  startPrice_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  startPrice_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  startPrice_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  startPrice_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  startPrice_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  startPrice_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  startPrice_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  start_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  start_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  start_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  start_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  start_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  start_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  start_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  state?: InputMaybe<TradeState>;
  state_in?: InputMaybe<Array<TradeState>>;
  state_not?: InputMaybe<TradeState>;
  state_not_in?: InputMaybe<Array<TradeState>>;
};

export enum Trade_OrderBy {
  ApprovedBlockNumber = "approvedBlockNumber",
  ApprovedBuyLimitSpot = "approvedBuyLimitSpot",
  ApprovedEndPrice = "approvedEndPrice",
  ApprovedSellLimitSpot = "approvedSellLimitSpot",
  ApprovedStartPrice = "approvedStartPrice",
  ApprovedTimestamp = "approvedTimestamp",
  ApprovedTransactionHash = "approvedTransactionHash",
  AvailableAt = "availableAt",
  AvailableRuns = "availableRuns",
  Bids = "bids",
  BoughtAmount = "boughtAmount",
  Buy = "buy",
  BuyLimitHigh = "buyLimitHigh",
  BuyLimitLow = "buyLimitLow",
  BuyLimitSpot = "buyLimitSpot",
  BuyAddress = "buy__address",
  BuyBurnCount = "buy__burnCount",
  BuyCumulativeHolderCount = "buy__cumulativeHolderCount",
  BuyCurrentHolderCount = "buy__currentHolderCount",
  BuyDecimals = "buy__decimals",
  BuyId = "buy__id",
  BuyMintCount = "buy__mintCount",
  BuyName = "buy__name",
  BuySymbol = "buy__symbol",
  BuyTotalBurned = "buy__totalBurned",
  BuyTotalMinted = "buy__totalMinted",
  BuyTotalSupply = "buy__totalSupply",
  BuyTransferCount = "buy__transferCount",
  BuyType = "buy__type",
  ClosedBlockNumber = "closedBlockNumber",
  ClosedTimestamp = "closedTimestamp",
  ClosedTransactionHash = "closedTransactionHash",
  Dtf = "dtf",
  DtfAnnualizedTvlFee = "dtf__annualizedTvlFee",
  DtfAuctionDelay = "dtf__auctionDelay",
  DtfAuctionLength = "dtf__auctionLength",
  DtfBidsEnabled = "dtf__bidsEnabled",
  DtfBlockNumber = "dtf__blockNumber",
  DtfDeployer = "dtf__deployer",
  DtfExternalRevenue = "dtf__externalRevenue",
  DtfFeeRecipients = "dtf__feeRecipients",
  DtfGovernanceRevenue = "dtf__governanceRevenue",
  DtfId = "dtf__id",
  DtfMandate = "dtf__mandate",
  DtfMintingFee = "dtf__mintingFee",
  DtfOwnerAddress = "dtf__ownerAddress",
  DtfPriceControl = "dtf__priceControl",
  DtfProtocolRevenue = "dtf__protocolRevenue",
  DtfProxyAdmin = "dtf__proxyAdmin",
  DtfStTokenAddress = "dtf__stTokenAddress",
  DtfTimestamp = "dtf__timestamp",
  DtfTotalRevenue = "dtf__totalRevenue",
  DtfTrustedFillerEnabled = "dtf__trustedFillerEnabled",
  DtfTrustedFillerRegistry = "dtf__trustedFillerRegistry",
  DtfTvlFee = "dtf__tvlFee",
  DtfWeightControl = "dtf__weightControl",
  End = "end",
  EndPrice = "endPrice",
  Id = "id",
  IsKilled = "isKilled",
  LaunchTimeout = "launchTimeout",
  LaunchedBlockNumber = "launchedBlockNumber",
  LaunchedTimestamp = "launchedTimestamp",
  LaunchedTransactionHash = "launchedTransactionHash",
  Sell = "sell",
  SellLimitHigh = "sellLimitHigh",
  SellLimitLow = "sellLimitLow",
  SellLimitSpot = "sellLimitSpot",
  SellAddress = "sell__address",
  SellBurnCount = "sell__burnCount",
  SellCumulativeHolderCount = "sell__cumulativeHolderCount",
  SellCurrentHolderCount = "sell__currentHolderCount",
  SellDecimals = "sell__decimals",
  SellId = "sell__id",
  SellMintCount = "sell__mintCount",
  SellName = "sell__name",
  SellSymbol = "sell__symbol",
  SellTotalBurned = "sell__totalBurned",
  SellTotalMinted = "sell__totalMinted",
  SellTotalSupply = "sell__totalSupply",
  SellTransferCount = "sell__transferCount",
  SellType = "sell__type",
  SoldAmount = "soldAmount",
  Start = "start",
  StartPrice = "startPrice",
  State = "state",
}

export type TransferEvent = Event & {
  __typename?: "TransferEvent";
  /**  Quantity of tokens transferred  */
  amount: Scalars["BigInt"]["output"];
  /**  Block number of this event  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  Account that sent the tokens  */
  from?: Maybe<Account>;
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars["String"]["output"];
  /**  { Token ID }-{ Transaction hash }-{ Log index }  */
  id: Scalars["ID"]["output"];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars["Int"]["output"];
  /**  Nonce of the transaction that emitted this event  */
  nonce: Scalars["Int"]["output"];
  /**  Timestamp of this event  */
  timestamp: Scalars["BigInt"]["output"];
  /**  Account that received the tokens  */
  to?: Maybe<Account>;
  /**  The token this event belongs to  */
  token: Token;
  /**  Transaction type  */
  type: Scalars["String"]["output"];
};

export type TransferEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<TransferEvent_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  from?: InputMaybe<Scalars["String"]["input"]>;
  from_?: InputMaybe<Account_Filter>;
  from_contains?: InputMaybe<Scalars["String"]["input"]>;
  from_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  from_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_gt?: InputMaybe<Scalars["String"]["input"]>;
  from_gte?: InputMaybe<Scalars["String"]["input"]>;
  from_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  from_lt?: InputMaybe<Scalars["String"]["input"]>;
  from_lte?: InputMaybe<Scalars["String"]["input"]>;
  from_not?: InputMaybe<Scalars["String"]["input"]>;
  from_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  from_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  from_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  from_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  from_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  from_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  from_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash?: InputMaybe<Scalars["String"]["input"]>;
  hash_contains?: InputMaybe<Scalars["String"]["input"]>;
  hash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash_gt?: InputMaybe<Scalars["String"]["input"]>;
  hash_gte?: InputMaybe<Scalars["String"]["input"]>;
  hash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hash_lt?: InputMaybe<Scalars["String"]["input"]>;
  hash_lte?: InputMaybe<Scalars["String"]["input"]>;
  hash_not?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  hash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  hash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  hash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  logIndex?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_gt?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_gte?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  logIndex_lt?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_lte?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_not?: InputMaybe<Scalars["Int"]["input"]>;
  logIndex_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  nonce?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_gt?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_gte?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  nonce_lt?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_lte?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_not?: InputMaybe<Scalars["Int"]["input"]>;
  nonce_not_in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<TransferEvent_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  to?: InputMaybe<Scalars["String"]["input"]>;
  to_?: InputMaybe<Account_Filter>;
  to_contains?: InputMaybe<Scalars["String"]["input"]>;
  to_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  to_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_gt?: InputMaybe<Scalars["String"]["input"]>;
  to_gte?: InputMaybe<Scalars["String"]["input"]>;
  to_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  to_lt?: InputMaybe<Scalars["String"]["input"]>;
  to_lte?: InputMaybe<Scalars["String"]["input"]>;
  to_not?: InputMaybe<Scalars["String"]["input"]>;
  to_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  to_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  to_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  to_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  to_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  to_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  to_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  type_contains?: InputMaybe<Scalars["String"]["input"]>;
  type_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  type_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  type_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  type_gt?: InputMaybe<Scalars["String"]["input"]>;
  type_gte?: InputMaybe<Scalars["String"]["input"]>;
  type_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  type_lt?: InputMaybe<Scalars["String"]["input"]>;
  type_lte?: InputMaybe<Scalars["String"]["input"]>;
  type_not?: InputMaybe<Scalars["String"]["input"]>;
  type_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  type_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  type_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  type_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  type_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  type_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  type_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  type_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  type_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum TransferEvent_OrderBy {
  Amount = "amount",
  BlockNumber = "blockNumber",
  From = "from",
  FromId = "from__id",
  Hash = "hash",
  Id = "id",
  LogIndex = "logIndex",
  Nonce = "nonce",
  Timestamp = "timestamp",
  To = "to",
  ToId = "to__id",
  Token = "token",
  TokenAddress = "token__address",
  TokenBurnCount = "token__burnCount",
  TokenCumulativeHolderCount = "token__cumulativeHolderCount",
  TokenCurrentHolderCount = "token__currentHolderCount",
  TokenDecimals = "token__decimals",
  TokenId = "token__id",
  TokenMintCount = "token__mintCount",
  TokenName = "token__name",
  TokenSymbol = "token__symbol",
  TokenTotalBurned = "token__totalBurned",
  TokenTotalMinted = "token__totalMinted",
  TokenTotalSupply = "token__totalSupply",
  TokenTransferCount = "token__transferCount",
  TokenType = "token__type",
  Type = "type",
}

export type UnstakingManager = {
  __typename?: "UnstakingManager";
  /**  Unstaking manager address  */
  id: Scalars["ID"]["output"];
  /**  Staking token  */
  token: StakingToken;
};

export type UnstakingManager_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UnstakingManager_Filter>>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<UnstakingManager_Filter>>>;
  token?: InputMaybe<Scalars["String"]["input"]>;
  token_?: InputMaybe<StakingToken_Filter>;
  token_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_gt?: InputMaybe<Scalars["String"]["input"]>;
  token_gte?: InputMaybe<Scalars["String"]["input"]>;
  token_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_lt?: InputMaybe<Scalars["String"]["input"]>;
  token_lte?: InputMaybe<Scalars["String"]["input"]>;
  token_not?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum UnstakingManager_OrderBy {
  Id = "id",
  Token = "token",
  TokenCurrentDelegates = "token__currentDelegates",
  TokenDelegatedVotes = "token__delegatedVotes",
  TokenDelegatedVotesRaw = "token__delegatedVotesRaw",
  TokenId = "token__id",
  TokenTotalDelegates = "token__totalDelegates",
}

export type Version = {
  __typename?: "Version";
  /**  Folio deployer address  */
  address: Scalars["Bytes"]["output"];
  /**  Block number  */
  blockNumber: Scalars["BigInt"]["output"];
  /**  Version hash  */
  hash: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  /**  Timestamp  */
  timestamp: Scalars["BigInt"]["output"];
};

export type Version_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  address_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Version_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  hash?: InputMaybe<Scalars["Bytes"]["input"]>;
  hash_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  hash_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  hash_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  hash_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  hash_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  hash_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  hash_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  hash_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  hash_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Version_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum Version_OrderBy {
  Address = "address",
  BlockNumber = "blockNumber",
  Hash = "hash",
  Id = "id",
  Timestamp = "timestamp",
}

export type Vote = {
  __typename?: "Vote";
  /** Block number vote is cast in */
  block: Scalars["BigInt"]["output"];
  /** Timestamp of block vote was cast in */
  blockTime: Scalars["BigInt"]["output"];
  /** Unique ID based on the blockTime and logIndex */
  blockTimeId: Scalars["String"]["output"];
  /** Whether the vote is in favour, against or abstaining to the proposal */
  choice: VoteChoice;
  /** Delegate ID + Proposal ID + Token ID */
  id: Scalars["ID"]["output"];
  /** Log Index of the event */
  logIndex: Scalars["BigInt"]["output"];
  /** Proposal that is being voted on */
  proposal: Proposal;
  /** Reason for voting choice */
  reason?: Maybe<Scalars["String"]["output"]>;
  /** Transaction hash of the vote */
  txnHash: Scalars["String"]["output"];
  /** Delegate that emitted the vote */
  voter: Delegate;
  /** Voting weight expressed in the vote */
  weight: Scalars["BigInt"]["output"];
};

export enum VoteChoice {
  Abstain = "ABSTAIN",
  Against = "AGAINST",
  For = "FOR",
}

export type VoteDailySnapshot = {
  __typename?: "VoteDailySnapshot";
  /** Weighted votes for the proposal at snapshot */
  abstainWeightedVotes: Scalars["BigInt"]["output"];
  /** Weighted votes abstaining to the proposal at snapshot */
  againstWeightedVotes: Scalars["BigInt"]["output"];
  /** Block number of last block in snapshot */
  blockNumber: Scalars["BigInt"]["output"];
  /** Weighted votes against the proposal at snapshot */
  forWeightedVotes: Scalars["BigInt"]["output"];
  /** Number of days from Unix epoch time */
  id: Scalars["ID"]["output"];
  /** Proposal this snapshot is associated with */
  proposal: Proposal;
  /** Timestamp of snapshot */
  timestamp: Scalars["BigInt"]["output"];
  /** Total weighted for/against/abstaining votes at snapshot */
  totalWeightedVotes: Scalars["BigInt"]["output"];
};

export type VoteDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  abstainWeightedVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  abstainWeightedVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  abstainWeightedVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  againstWeightedVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  againstWeightedVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  againstWeightedVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<VoteDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  forWeightedVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  forWeightedVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  forWeightedVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<VoteDailySnapshot_Filter>>>;
  proposal?: InputMaybe<Scalars["String"]["input"]>;
  proposal_?: InputMaybe<Proposal_Filter>;
  proposal_contains?: InputMaybe<Scalars["String"]["input"]>;
  proposal_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_gt?: InputMaybe<Scalars["String"]["input"]>;
  proposal_gte?: InputMaybe<Scalars["String"]["input"]>;
  proposal_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  proposal_lt?: InputMaybe<Scalars["String"]["input"]>;
  proposal_lte?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  proposal_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalWeightedVotes?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalWeightedVotes_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalWeightedVotes_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum VoteDailySnapshot_OrderBy {
  AbstainWeightedVotes = "abstainWeightedVotes",
  AgainstWeightedVotes = "againstWeightedVotes",
  BlockNumber = "blockNumber",
  ForWeightedVotes = "forWeightedVotes",
  Id = "id",
  Proposal = "proposal",
  ProposalAbstainDelegateVotes = "proposal__abstainDelegateVotes",
  ProposalAbstainWeightedVotes = "proposal__abstainWeightedVotes",
  ProposalAgainstDelegateVotes = "proposal__againstDelegateVotes",
  ProposalAgainstWeightedVotes = "proposal__againstWeightedVotes",
  ProposalCancellationBlock = "proposal__cancellationBlock",
  ProposalCancellationTime = "proposal__cancellationTime",
  ProposalCancellationTxnHash = "proposal__cancellationTxnHash",
  ProposalCreationBlock = "proposal__creationBlock",
  ProposalCreationTime = "proposal__creationTime",
  ProposalDelegatesAtStart = "proposal__delegatesAtStart",
  ProposalDescription = "proposal__description",
  ProposalExecutionBlock = "proposal__executionBlock",
  ProposalExecutionEta = "proposal__executionETA",
  ProposalExecutionTime = "proposal__executionTime",
  ProposalExecutionTxnHash = "proposal__executionTxnHash",
  ProposalForDelegateVotes = "proposal__forDelegateVotes",
  ProposalForWeightedVotes = "proposal__forWeightedVotes",
  ProposalId = "proposal__id",
  ProposalQueueBlock = "proposal__queueBlock",
  ProposalQueueTime = "proposal__queueTime",
  ProposalQueueTxnHash = "proposal__queueTxnHash",
  ProposalQuorumVotes = "proposal__quorumVotes",
  ProposalState = "proposal__state",
  ProposalTimelockId = "proposal__timelockId",
  ProposalTokenHoldersAtStart = "proposal__tokenHoldersAtStart",
  ProposalTotalDelegateVotes = "proposal__totalDelegateVotes",
  ProposalTotalWeightedVotes = "proposal__totalWeightedVotes",
  ProposalTxnHash = "proposal__txnHash",
  ProposalVoteEnd = "proposal__voteEnd",
  ProposalVoteStart = "proposal__voteStart",
  Timestamp = "timestamp",
  TotalWeightedVotes = "totalWeightedVotes",
}

export type Vote_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Vote_Filter>>>;
  block?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTime?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTimeId?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_contains?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_gt?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_gte?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  blockTimeId_lt?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_lte?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_not?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  blockTimeId_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  blockTimeId_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  blockTime_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTime_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTime_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  blockTime_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTime_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTime_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  blockTime_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  block_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  block_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  block_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  block_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  block_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  block_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  block_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  choice?: InputMaybe<VoteChoice>;
  choice_in?: InputMaybe<Array<VoteChoice>>;
  choice_not?: InputMaybe<VoteChoice>;
  choice_not_in?: InputMaybe<Array<VoteChoice>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  logIndex?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  logIndex_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  logIndex_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Vote_Filter>>>;
  proposal?: InputMaybe<Scalars["String"]["input"]>;
  proposal_?: InputMaybe<Proposal_Filter>;
  proposal_contains?: InputMaybe<Scalars["String"]["input"]>;
  proposal_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_gt?: InputMaybe<Scalars["String"]["input"]>;
  proposal_gte?: InputMaybe<Scalars["String"]["input"]>;
  proposal_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  proposal_lt?: InputMaybe<Scalars["String"]["input"]>;
  proposal_lte?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  proposal_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  proposal_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  proposal_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  reason_contains?: InputMaybe<Scalars["String"]["input"]>;
  reason_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  reason_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  reason_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  reason_gt?: InputMaybe<Scalars["String"]["input"]>;
  reason_gte?: InputMaybe<Scalars["String"]["input"]>;
  reason_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  reason_lt?: InputMaybe<Scalars["String"]["input"]>;
  reason_lte?: InputMaybe<Scalars["String"]["input"]>;
  reason_not?: InputMaybe<Scalars["String"]["input"]>;
  reason_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  reason_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  reason_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  reason_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  reason_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  reason_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  reason_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  reason_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  reason_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_contains?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_gt?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_gte?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txnHash_lt?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_lte?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  txnHash_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  txnHash_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  voter?: InputMaybe<Scalars["String"]["input"]>;
  voter_?: InputMaybe<Delegate_Filter>;
  voter_contains?: InputMaybe<Scalars["String"]["input"]>;
  voter_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  voter_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  voter_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  voter_gt?: InputMaybe<Scalars["String"]["input"]>;
  voter_gte?: InputMaybe<Scalars["String"]["input"]>;
  voter_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  voter_lt?: InputMaybe<Scalars["String"]["input"]>;
  voter_lte?: InputMaybe<Scalars["String"]["input"]>;
  voter_not?: InputMaybe<Scalars["String"]["input"]>;
  voter_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  voter_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  voter_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  voter_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  voter_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  voter_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  voter_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  voter_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  voter_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  weight?: InputMaybe<Scalars["BigInt"]["input"]>;
  weight_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  weight_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  weight_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  weight_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  weight_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  weight_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  weight_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum Vote_OrderBy {
  Block = "block",
  BlockTime = "blockTime",
  BlockTimeId = "blockTimeId",
  Choice = "choice",
  Id = "id",
  LogIndex = "logIndex",
  Proposal = "proposal",
  ProposalAbstainDelegateVotes = "proposal__abstainDelegateVotes",
  ProposalAbstainWeightedVotes = "proposal__abstainWeightedVotes",
  ProposalAgainstDelegateVotes = "proposal__againstDelegateVotes",
  ProposalAgainstWeightedVotes = "proposal__againstWeightedVotes",
  ProposalCancellationBlock = "proposal__cancellationBlock",
  ProposalCancellationTime = "proposal__cancellationTime",
  ProposalCancellationTxnHash = "proposal__cancellationTxnHash",
  ProposalCreationBlock = "proposal__creationBlock",
  ProposalCreationTime = "proposal__creationTime",
  ProposalDelegatesAtStart = "proposal__delegatesAtStart",
  ProposalDescription = "proposal__description",
  ProposalExecutionBlock = "proposal__executionBlock",
  ProposalExecutionEta = "proposal__executionETA",
  ProposalExecutionTime = "proposal__executionTime",
  ProposalExecutionTxnHash = "proposal__executionTxnHash",
  ProposalForDelegateVotes = "proposal__forDelegateVotes",
  ProposalForWeightedVotes = "proposal__forWeightedVotes",
  ProposalId = "proposal__id",
  ProposalQueueBlock = "proposal__queueBlock",
  ProposalQueueTime = "proposal__queueTime",
  ProposalQueueTxnHash = "proposal__queueTxnHash",
  ProposalQuorumVotes = "proposal__quorumVotes",
  ProposalState = "proposal__state",
  ProposalTimelockId = "proposal__timelockId",
  ProposalTokenHoldersAtStart = "proposal__tokenHoldersAtStart",
  ProposalTotalDelegateVotes = "proposal__totalDelegateVotes",
  ProposalTotalWeightedVotes = "proposal__totalWeightedVotes",
  ProposalTxnHash = "proposal__txnHash",
  ProposalVoteEnd = "proposal__voteEnd",
  ProposalVoteStart = "proposal__voteStart",
  Reason = "reason",
  TxnHash = "txnHash",
  Voter = "voter",
  VoterAddress = "voter__address",
  VoterDelegatedVotes = "voter__delegatedVotes",
  VoterDelegatedVotesRaw = "voter__delegatedVotesRaw",
  VoterId = "voter__id",
  VoterNumberVotes = "voter__numberVotes",
  VoterTokenHoldersRepresentedAmount = "voter__tokenHoldersRepresentedAmount",
  Weight = "weight",
}

export type _Block_ = {
  __typename?: "_Block_";
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]["output"]>;
  /** The block number */
  number: Scalars["Int"]["output"];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars["Bytes"]["output"]>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]["output"]>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: "_Meta_";
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars["String"]["output"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"]["output"];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = "allow",
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = "deny",
}

export type GetIndexDtfQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetIndexDtfQuery = {
  __typename?: "Query";
  dtf?: {
    __typename?: "DTF";
    id: string;
    proxyAdmin: any;
    timestamp: any;
    deployer: any;
    ownerAddress: any;
    admins: Array<string>;
    mintingFee: any;
    tvlFee: any;
    annualizedTvlFee: any;
    mandate: string;
    auctionDelay: any;
    auctionLength: any;
    auctionApprovers: Array<string>;
    auctionLaunchers: Array<string>;
    brandManagers: Array<string>;
    totalRevenue: any;
    protocolRevenue: any;
    governanceRevenue: any;
    externalRevenue: any;
    feeRecipients: string;
    bidsEnabled?: boolean | null;
    trustedFillerRegistry?: any | null;
    trustedFillerEnabled?: boolean | null;
    weightControl: boolean;
    priceControl: number;
    legacyAdmins: Array<string>;
    legacyAuctionApprovers: Array<string>;
    ownerGovernance?: {
      __typename?: "Governance";
      id: string;
      votingDelay: any;
      votingPeriod: any;
      proposalThreshold: any;
      quorumNumerator?: any | null;
      quorumDenominator?: any | null;
      timelock: {
        __typename?: "GovernanceTimelock";
        id: string;
        guardians: Array<string>;
        executionDelay: any;
      };
    } | null;
    tradingGovernance?: {
      __typename?: "Governance";
      id: string;
      votingDelay: any;
      votingPeriod: any;
      proposalThreshold: any;
      quorumNumerator?: any | null;
      quorumDenominator?: any | null;
      timelock: {
        __typename?: "GovernanceTimelock";
        id: string;
        guardians: Array<string>;
        executionDelay: any;
      };
    } | null;
    token: {
      __typename?: "Token";
      id: string;
      address: any;
      name: string;
      symbol: string;
      decimals: number;
      totalSupply: any;
      currentHolderCount: any;
      cumulativeHolderCount: any;
      transferCount: any;
      mintCount: any;
      burnCount: any;
      totalBurned: any;
      totalMinted: any;
    };
    stToken?: {
      __typename?: "StakingToken";
      id: string;
      legacyGovernance: Array<string>;
      token: {
        __typename?: "Token";
        id: string;
        address: any;
        name: string;
        symbol: string;
        decimals: number;
        totalSupply: any;
        currentHolderCount: any;
        cumulativeHolderCount: any;
        transferCount: any;
        mintCount: any;
        burnCount: any;
        totalBurned: any;
        totalMinted: any;
      };
      underlying?: {
        __typename?: "Token";
        name: string;
        symbol: string;
        address: any;
        decimals: number;
      } | null;
      governance?: {
        __typename?: "Governance";
        id: string;
        votingDelay: any;
        votingPeriod: any;
        proposalThreshold: any;
        quorumNumerator?: any | null;
        quorumDenominator?: any | null;
        timelock: {
          __typename?: "GovernanceTimelock";
          id: string;
          guardians: Array<string>;
          executionDelay: any;
        };
      } | null;
      rewards: Array<{
        __typename?: "StakingTokenRewards";
        rewardToken: {
          __typename?: "Token";
          address: any;
          name: string;
          symbol: string;
          decimals: number;
        };
      }>;
    } | null;
  } | null;
};

export const GetIndexDtfDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetIndexDTF" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "dtf" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "proxyAdmin" } },
                { kind: "Field", name: { kind: "Name", value: "timestamp" } },
                { kind: "Field", name: { kind: "Name", value: "deployer" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "ownerAddress" },
                },
                { kind: "Field", name: { kind: "Name", value: "admins" } },
                { kind: "Field", name: { kind: "Name", value: "mintingFee" } },
                { kind: "Field", name: { kind: "Name", value: "tvlFee" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "annualizedTvlFee" },
                },
                { kind: "Field", name: { kind: "Name", value: "mandate" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "auctionDelay" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "auctionLength" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "auctionApprovers" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "auctionLaunchers" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "brandManagers" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "totalRevenue" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "protocolRevenue" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "governanceRevenue" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "externalRevenue" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "feeRecipients" },
                },
                { kind: "Field", name: { kind: "Name", value: "bidsEnabled" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "trustedFillerRegistry" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "trustedFillerEnabled" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "weightControl" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "priceControl" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "ownerGovernance" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "votingDelay" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "votingPeriod" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "proposalThreshold" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "quorumNumerator" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "quorumDenominator" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "timelock" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "guardians" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "executionDelay" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "legacyAdmins" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "tradingGovernance" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "votingDelay" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "votingPeriod" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "proposalThreshold" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "quorumNumerator" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "quorumDenominator" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "timelock" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "guardians" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "executionDelay" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "legacyAuctionApprovers" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "token" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "address" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "symbol" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "decimals" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "totalSupply" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "currentHolderCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "cumulativeHolderCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "transferCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "mintCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "burnCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "totalBurned" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "totalMinted" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "stToken" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "token" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "address" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "symbol" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "decimals" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "totalSupply" },
                            },
                            {
                              kind: "Field",
                              name: {
                                kind: "Name",
                                value: "currentHolderCount",
                              },
                            },
                            {
                              kind: "Field",
                              name: {
                                kind: "Name",
                                value: "cumulativeHolderCount",
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "transferCount" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "mintCount" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "burnCount" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "totalBurned" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "totalMinted" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "underlying" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "symbol" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "address" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "decimals" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "governance" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "votingDelay" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "votingPeriod" },
                            },
                            {
                              kind: "Field",
                              name: {
                                kind: "Name",
                                value: "proposalThreshold",
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "quorumNumerator" },
                            },
                            {
                              kind: "Field",
                              name: {
                                kind: "Name",
                                value: "quorumDenominator",
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "timelock" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "guardians" },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "executionDelay",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "legacyGovernance" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "rewards" },
                        arguments: [
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "where" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "active" },
                                  value: { kind: "BooleanValue", value: true },
                                },
                              ],
                            },
                          },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "rewardToken" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "address" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "symbol" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "decimals" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetIndexDtfQuery, GetIndexDtfQueryVariables>;
