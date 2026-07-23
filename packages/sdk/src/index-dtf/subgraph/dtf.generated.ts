import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: string; output: string; }
  BigInt: { input: string; output: string; }
  Bytes: { input: string; output: string; }
  Int8: { input: string; output: string; }
  Timestamp: { input: string; output: string; }
};

export type AccountBalanceDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<AccountBalanceDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AccountBalanceDailySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type AccountBalanceDailySnapshot_OrderBy =
  | 'account'
  | 'account__id'
  | 'amount'
  | 'blockNumber'
  | 'id'
  | 'timestamp'
  | 'token'
  | 'token__address'
  | 'token__burnCount'
  | 'token__cumulativeHolderCount'
  | 'token__currentHolderCount'
  | 'token__decimals'
  | 'token__id'
  | 'token__mintCount'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBurned'
  | 'token__totalMinted'
  | 'token__totalSupply'
  | 'token__transferCount'
  | 'token__type';

export type AccountBalance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<AccountBalance_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentHoldStartTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  currentHoldStartTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentHoldStartTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentHoldStartTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentHoldStartTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentHoldStartTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentHoldStartTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentHoldStartTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegate?: InputMaybe<Scalars['String']['input']>;
  delegate_?: InputMaybe<Delegate_Filter>;
  delegate_contains?: InputMaybe<Scalars['String']['input']>;
  delegate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_gt?: InputMaybe<Scalars['String']['input']>;
  delegate_gte?: InputMaybe<Scalars['String']['input']>;
  delegate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegate_lt?: InputMaybe<Scalars['String']['input']>;
  delegate_lte?: InputMaybe<Scalars['String']['input']>;
  delegate_not?: InputMaybe<Scalars['String']['input']>;
  delegate_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  firstHoldTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  firstHoldTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  firstHoldTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  firstHoldTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  firstHoldTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  firstHoldTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  firstHoldTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  firstHoldTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  optimisticDelegate?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_?: InputMaybe<Delegate_Filter>;
  optimisticDelegate_contains?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_ends_with?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_gt?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_gte?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticDelegate_lt?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_lte?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_not?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_not_contains?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticDelegate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_starts_with?: InputMaybe<Scalars['String']['input']>;
  optimisticDelegate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<AccountBalance_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type AccountBalance_OrderBy =
  | 'account'
  | 'account__id'
  | 'amount'
  | 'blockNumber'
  | 'currentHoldStartTimestamp'
  | 'delegate'
  | 'delegate__address'
  | 'delegate__delegatedVotes'
  | 'delegate__delegatedVotesRaw'
  | 'delegate__hasBeenOptimisticDelegate'
  | 'delegate__hasBeenStandardDelegate'
  | 'delegate__id'
  | 'delegate__numberOptimisticVotes'
  | 'delegate__numberVotes'
  | 'delegate__optimisticDelegatedVotes'
  | 'delegate__optimisticDelegatedVotesRaw'
  | 'delegate__optimisticTokenHoldersRepresentedAmount'
  | 'delegate__tokenHoldersRepresentedAmount'
  | 'firstHoldTimestamp'
  | 'id'
  | 'optimisticDelegate'
  | 'optimisticDelegate__address'
  | 'optimisticDelegate__delegatedVotes'
  | 'optimisticDelegate__delegatedVotesRaw'
  | 'optimisticDelegate__hasBeenOptimisticDelegate'
  | 'optimisticDelegate__hasBeenStandardDelegate'
  | 'optimisticDelegate__id'
  | 'optimisticDelegate__numberOptimisticVotes'
  | 'optimisticDelegate__numberVotes'
  | 'optimisticDelegate__optimisticDelegatedVotes'
  | 'optimisticDelegate__optimisticDelegatedVotesRaw'
  | 'optimisticDelegate__optimisticTokenHoldersRepresentedAmount'
  | 'optimisticDelegate__tokenHoldersRepresentedAmount'
  | 'timestamp'
  | 'token'
  | 'token__address'
  | 'token__burnCount'
  | 'token__cumulativeHolderCount'
  | 'token__currentHolderCount'
  | 'token__decimals'
  | 'token__id'
  | 'token__mintCount'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBurned'
  | 'token__totalMinted'
  | 'token__totalSupply'
  | 'token__transferCount'
  | 'token__type';

export type Account_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  balancesSnapshot_?: InputMaybe<AccountBalanceDailySnapshot_Filter>;
  balances_?: InputMaybe<AccountBalance_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  locks_?: InputMaybe<Lock_Filter>;
  mintings_?: InputMaybe<Minting_Filter>;
  or?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  rewardClaims_?: InputMaybe<RewardClaim_Filter>;
  transferFrom_?: InputMaybe<TransferEvent_Filter>;
  transferTo_?: InputMaybe<TransferEvent_Filter>;
};

export type Account_OrderBy =
  | 'balances'
  | 'balancesSnapshot'
  | 'id'
  | 'locks'
  | 'mintings'
  | 'rewardClaims'
  | 'transferFrom'
  | 'transferTo';

/** Indicates whether the current, partially filled bucket should be included in the response. Defaults to `exclude` */
export type Aggregation_Current =
  /** Exclude the current, partially filled bucket from the response */
  | 'exclude'
  /** Include the current, partially filled bucket in the response */
  | 'include';

export type Aggregation_Interval =
  | 'day'
  | 'hour';

export type AuctionBid_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AuctionBid_Filter>>>;
  auction?: InputMaybe<Scalars['String']['input']>;
  auction_?: InputMaybe<Trade_Filter>;
  auction_contains?: InputMaybe<Scalars['String']['input']>;
  auction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_gt?: InputMaybe<Scalars['String']['input']>;
  auction_gte?: InputMaybe<Scalars['String']['input']>;
  auction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_lt?: InputMaybe<Scalars['String']['input']>;
  auction_lte?: InputMaybe<Scalars['String']['input']>;
  auction_not?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_contains?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_gt?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_gte?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  bidder_lt?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_lte?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_not?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buyAmount?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buyAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dtf?: InputMaybe<Scalars['String']['input']>;
  dtf_?: InputMaybe<Dtf_Filter>;
  dtf_contains?: InputMaybe<Scalars['String']['input']>;
  dtf_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_ends_with?: InputMaybe<Scalars['String']['input']>;
  dtf_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_gt?: InputMaybe<Scalars['String']['input']>;
  dtf_gte?: InputMaybe<Scalars['String']['input']>;
  dtf_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dtf_lt?: InputMaybe<Scalars['String']['input']>;
  dtf_lte?: InputMaybe<Scalars['String']['input']>;
  dtf_not?: InputMaybe<Scalars['String']['input']>;
  dtf_not_contains?: InputMaybe<Scalars['String']['input']>;
  dtf_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dtf_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dtf_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dtf_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_starts_with?: InputMaybe<Scalars['String']['input']>;
  dtf_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AuctionBid_Filter>>>;
  sellAmount?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sellAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type AuctionBid_OrderBy =
  | 'auction'
  | 'auction__approvedBlockNumber'
  | 'auction__approvedBuyLimitSpot'
  | 'auction__approvedEndPrice'
  | 'auction__approvedSellLimitSpot'
  | 'auction__approvedStartPrice'
  | 'auction__approvedTimestamp'
  | 'auction__approvedTransactionHash'
  | 'auction__availableAt'
  | 'auction__availableRuns'
  | 'auction__boughtAmount'
  | 'auction__buyLimitHigh'
  | 'auction__buyLimitLow'
  | 'auction__buyLimitSpot'
  | 'auction__closedBlockNumber'
  | 'auction__closedTimestamp'
  | 'auction__closedTransactionHash'
  | 'auction__end'
  | 'auction__endPrice'
  | 'auction__id'
  | 'auction__isKilled'
  | 'auction__launchTimeout'
  | 'auction__launchedBlockNumber'
  | 'auction__launchedTimestamp'
  | 'auction__launchedTransactionHash'
  | 'auction__sellLimitHigh'
  | 'auction__sellLimitLow'
  | 'auction__sellLimitSpot'
  | 'auction__soldAmount'
  | 'auction__start'
  | 'auction__startPrice'
  | 'auction__state'
  | 'bidder'
  | 'blockNumber'
  | 'buyAmount'
  | 'dtf'
  | 'dtf__annualizedTvlFee'
  | 'dtf__auctionDelay'
  | 'dtf__auctionLength'
  | 'dtf__bidsEnabled'
  | 'dtf__blockNumber'
  | 'dtf__deployer'
  | 'dtf__externalRevenue'
  | 'dtf__feeRecipients'
  | 'dtf__governanceRevenue'
  | 'dtf__id'
  | 'dtf__mandate'
  | 'dtf__mintingFee'
  | 'dtf__ownerAddress'
  | 'dtf__priceControl'
  | 'dtf__protocolRevenue'
  | 'dtf__proxyAdmin'
  | 'dtf__stTokenAddress'
  | 'dtf__timestamp'
  | 'dtf__totalRevenue'
  | 'dtf__trustedFillerEnabled'
  | 'dtf__trustedFillerRegistry'
  | 'dtf__tvlFee'
  | 'dtf__weightControl'
  | 'id'
  | 'sellAmount'
  | 'timestamp'
  | 'transactionHash';

export type Auction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Auction_Filter>>>;
  bids_?: InputMaybe<RebalanceAuctionBid_Filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dtf?: InputMaybe<Scalars['String']['input']>;
  dtf_?: InputMaybe<Dtf_Filter>;
  dtf_contains?: InputMaybe<Scalars['String']['input']>;
  dtf_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_ends_with?: InputMaybe<Scalars['String']['input']>;
  dtf_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_gt?: InputMaybe<Scalars['String']['input']>;
  dtf_gte?: InputMaybe<Scalars['String']['input']>;
  dtf_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dtf_lt?: InputMaybe<Scalars['String']['input']>;
  dtf_lte?: InputMaybe<Scalars['String']['input']>;
  dtf_not?: InputMaybe<Scalars['String']['input']>;
  dtf_not_contains?: InputMaybe<Scalars['String']['input']>;
  dtf_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dtf_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dtf_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dtf_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_starts_with?: InputMaybe<Scalars['String']['input']>;
  dtf_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Auction_Filter>>>;
  priceHighLimit?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceHighLimit_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceHighLimit_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceHighLimit_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceLowLimit?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceLowLimit_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceLowLimit_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceLowLimit_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalance?: InputMaybe<Scalars['String']['input']>;
  rebalanceHighLimit?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceHighLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceLowLimit?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceLowLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceSpotLimit?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceSpotLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalance_?: InputMaybe<Rebalance_Filter>;
  rebalance_contains?: InputMaybe<Scalars['String']['input']>;
  rebalance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rebalance_ends_with?: InputMaybe<Scalars['String']['input']>;
  rebalance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rebalance_gt?: InputMaybe<Scalars['String']['input']>;
  rebalance_gte?: InputMaybe<Scalars['String']['input']>;
  rebalance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rebalance_lt?: InputMaybe<Scalars['String']['input']>;
  rebalance_lte?: InputMaybe<Scalars['String']['input']>;
  rebalance_not?: InputMaybe<Scalars['String']['input']>;
  rebalance_not_contains?: InputMaybe<Scalars['String']['input']>;
  rebalance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rebalance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rebalance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rebalance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rebalance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rebalance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rebalance_starts_with?: InputMaybe<Scalars['String']['input']>;
  rebalance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokens?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_?: InputMaybe<Token_Filter>;
  tokens_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weightHighLimit?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightHighLimit_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightHighLimit_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightHighLimit_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightLowLimit?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightLowLimit_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightLowLimit_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightLowLimit_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightSpotLimit?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightSpotLimit_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightSpotLimit_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightSpotLimit_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Auction_OrderBy =
  | 'bids'
  | 'blockNumber'
  | 'dtf'
  | 'dtf__annualizedTvlFee'
  | 'dtf__auctionDelay'
  | 'dtf__auctionLength'
  | 'dtf__bidsEnabled'
  | 'dtf__blockNumber'
  | 'dtf__deployer'
  | 'dtf__externalRevenue'
  | 'dtf__feeRecipients'
  | 'dtf__governanceRevenue'
  | 'dtf__id'
  | 'dtf__mandate'
  | 'dtf__mintingFee'
  | 'dtf__ownerAddress'
  | 'dtf__priceControl'
  | 'dtf__protocolRevenue'
  | 'dtf__proxyAdmin'
  | 'dtf__stTokenAddress'
  | 'dtf__timestamp'
  | 'dtf__totalRevenue'
  | 'dtf__trustedFillerEnabled'
  | 'dtf__trustedFillerRegistry'
  | 'dtf__tvlFee'
  | 'dtf__weightControl'
  | 'endTime'
  | 'id'
  | 'priceHighLimit'
  | 'priceLowLimit'
  | 'rebalance'
  | 'rebalanceHighLimit'
  | 'rebalanceLowLimit'
  | 'rebalanceSpotLimit'
  | 'rebalance__availableUntil'
  | 'rebalance__bidsEnabled'
  | 'rebalance__blockNumber'
  | 'rebalance__id'
  | 'rebalance__nonce'
  | 'rebalance__priceControl'
  | 'rebalance__rebalanceHighLimit'
  | 'rebalance__rebalanceLowLimit'
  | 'rebalance__rebalanceSpotLimit'
  | 'rebalance__restrictedUntil'
  | 'rebalance__startedAt'
  | 'rebalance__timestamp'
  | 'rebalance__transactionHash'
  | 'startTime'
  | 'timestamp'
  | 'tokens'
  | 'transactionHash'
  | 'weightHighLimit'
  | 'weightLowLimit'
  | 'weightSpotLimit';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Dtf_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  admins?: InputMaybe<Array<Scalars['String']['input']>>;
  admins_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  admins_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  admins_not?: InputMaybe<Array<Scalars['String']['input']>>;
  admins_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  admins_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Dtf_Filter>>>;
  annualizedTvlFee?: InputMaybe<Scalars['BigInt']['input']>;
  annualizedTvlFee_gt?: InputMaybe<Scalars['BigInt']['input']>;
  annualizedTvlFee_gte?: InputMaybe<Scalars['BigInt']['input']>;
  annualizedTvlFee_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  annualizedTvlFee_lt?: InputMaybe<Scalars['BigInt']['input']>;
  annualizedTvlFee_lte?: InputMaybe<Scalars['BigInt']['input']>;
  annualizedTvlFee_not?: InputMaybe<Scalars['BigInt']['input']>;
  annualizedTvlFee_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  auctionApprovers?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionApprovers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionApprovers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionApprovers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionApprovers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionApprovers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionDelay?: InputMaybe<Scalars['BigInt']['input']>;
  auctionDelay_gt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionDelay_gte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionDelay_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  auctionDelay_lt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionDelay_lte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionDelay_not?: InputMaybe<Scalars['BigInt']['input']>;
  auctionDelay_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  auctionLaunchers?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionLaunchers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionLaunchers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionLaunchers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionLaunchers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionLaunchers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  auctionLength?: InputMaybe<Scalars['BigInt']['input']>;
  auctionLength_gt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionLength_gte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionLength_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  auctionLength_lt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionLength_lte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionLength_not?: InputMaybe<Scalars['BigInt']['input']>;
  auctionLength_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bidsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  bidsEnabled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  bidsEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  bidsEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  brandManagers?: InputMaybe<Array<Scalars['String']['input']>>;
  brandManagers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  brandManagers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  brandManagers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  brandManagers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  brandManagers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  deployer?: InputMaybe<Scalars['Bytes']['input']>;
  deployer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  deployer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  deployer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  deployer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  deployer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  deployer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  deployer_not?: InputMaybe<Scalars['Bytes']['input']>;
  deployer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  deployer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  externalRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  externalRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  externalRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  externalRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  externalRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  externalRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  externalRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  externalRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  feeRecipients?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_contains?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_ends_with?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_gt?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_gte?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_in?: InputMaybe<Array<Scalars['String']['input']>>;
  feeRecipients_lt?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_lte?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_not?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_not_contains?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  feeRecipients_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_starts_with?: InputMaybe<Scalars['String']['input']>;
  feeRecipients_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governanceRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  governanceRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  governanceRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  governanceRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  governanceRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  governanceRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  governanceRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  governanceRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  legacyAdmins?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyAdmins_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyAdmins_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyAdmins_not?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyAdmins_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyAdmins_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyAuctionApprovers?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyAuctionApprovers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyAuctionApprovers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyAuctionApprovers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyAuctionApprovers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyAuctionApprovers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  mandate?: InputMaybe<Scalars['String']['input']>;
  mandate_contains?: InputMaybe<Scalars['String']['input']>;
  mandate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  mandate_ends_with?: InputMaybe<Scalars['String']['input']>;
  mandate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mandate_gt?: InputMaybe<Scalars['String']['input']>;
  mandate_gte?: InputMaybe<Scalars['String']['input']>;
  mandate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mandate_lt?: InputMaybe<Scalars['String']['input']>;
  mandate_lte?: InputMaybe<Scalars['String']['input']>;
  mandate_not?: InputMaybe<Scalars['String']['input']>;
  mandate_not_contains?: InputMaybe<Scalars['String']['input']>;
  mandate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  mandate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  mandate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mandate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mandate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  mandate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mandate_starts_with?: InputMaybe<Scalars['String']['input']>;
  mandate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mintingFee?: InputMaybe<Scalars['BigInt']['input']>;
  mintingFee_gt?: InputMaybe<Scalars['BigInt']['input']>;
  mintingFee_gte?: InputMaybe<Scalars['BigInt']['input']>;
  mintingFee_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mintingFee_lt?: InputMaybe<Scalars['BigInt']['input']>;
  mintingFee_lte?: InputMaybe<Scalars['BigInt']['input']>;
  mintingFee_not?: InputMaybe<Scalars['BigInt']['input']>;
  mintingFee_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Dtf_Filter>>>;
  ownerAddress?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  ownerAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  ownerGovernance?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_?: InputMaybe<Governance_Filter>;
  ownerGovernance_contains?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_ends_with?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_gt?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_gte?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ownerGovernance_lt?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_lte?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_not?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_not_contains?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ownerGovernance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_starts_with?: InputMaybe<Scalars['String']['input']>;
  ownerGovernance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceControl?: InputMaybe<Scalars['Int']['input']>;
  priceControl_gt?: InputMaybe<Scalars['Int']['input']>;
  priceControl_gte?: InputMaybe<Scalars['Int']['input']>;
  priceControl_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  priceControl_lt?: InputMaybe<Scalars['Int']['input']>;
  priceControl_lte?: InputMaybe<Scalars['Int']['input']>;
  priceControl_not?: InputMaybe<Scalars['Int']['input']>;
  priceControl_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  protocolRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  protocolRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  protocolRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  protocolRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  protocolRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  protocolRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  protocolRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  protocolRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proxyAdmin?: InputMaybe<Scalars['Bytes']['input']>;
  proxyAdmin_contains?: InputMaybe<Scalars['Bytes']['input']>;
  proxyAdmin_gt?: InputMaybe<Scalars['Bytes']['input']>;
  proxyAdmin_gte?: InputMaybe<Scalars['Bytes']['input']>;
  proxyAdmin_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  proxyAdmin_lt?: InputMaybe<Scalars['Bytes']['input']>;
  proxyAdmin_lte?: InputMaybe<Scalars['Bytes']['input']>;
  proxyAdmin_not?: InputMaybe<Scalars['Bytes']['input']>;
  proxyAdmin_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  proxyAdmin_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rebalances_?: InputMaybe<Rebalance_Filter>;
  stToken?: InputMaybe<Scalars['String']['input']>;
  stTokenAddress?: InputMaybe<Scalars['Bytes']['input']>;
  stTokenAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  stTokenAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  stTokenAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  stTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  stTokenAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  stTokenAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  stTokenAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  stTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  stTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  stToken_?: InputMaybe<StakingToken_Filter>;
  stToken_contains?: InputMaybe<Scalars['String']['input']>;
  stToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  stToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stToken_gt?: InputMaybe<Scalars['String']['input']>;
  stToken_gte?: InputMaybe<Scalars['String']['input']>;
  stToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stToken_lt?: InputMaybe<Scalars['String']['input']>;
  stToken_lte?: InputMaybe<Scalars['String']['input']>;
  stToken_not?: InputMaybe<Scalars['String']['input']>;
  stToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  stToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  stToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  totalRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradingGovernance?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_?: InputMaybe<Governance_Filter>;
  tradingGovernance_contains?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_ends_with?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_gt?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_gte?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tradingGovernance_lt?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_lte?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_not?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_not_contains?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tradingGovernance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_starts_with?: InputMaybe<Scalars['String']['input']>;
  tradingGovernance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  trustedFillerEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  trustedFillerEnabled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  trustedFillerEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  trustedFillerEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  trustedFillerRegistry?: InputMaybe<Scalars['Bytes']['input']>;
  trustedFillerRegistry_contains?: InputMaybe<Scalars['Bytes']['input']>;
  trustedFillerRegistry_gt?: InputMaybe<Scalars['Bytes']['input']>;
  trustedFillerRegistry_gte?: InputMaybe<Scalars['Bytes']['input']>;
  trustedFillerRegistry_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  trustedFillerRegistry_lt?: InputMaybe<Scalars['Bytes']['input']>;
  trustedFillerRegistry_lte?: InputMaybe<Scalars['Bytes']['input']>;
  trustedFillerRegistry_not?: InputMaybe<Scalars['Bytes']['input']>;
  trustedFillerRegistry_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  trustedFillerRegistry_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tvlFee?: InputMaybe<Scalars['BigInt']['input']>;
  tvlFee_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tvlFee_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tvlFee_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tvlFee_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tvlFee_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tvlFee_not?: InputMaybe<Scalars['BigInt']['input']>;
  tvlFee_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightControl?: InputMaybe<Scalars['Boolean']['input']>;
  weightControl_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  weightControl_not?: InputMaybe<Scalars['Boolean']['input']>;
  weightControl_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export type Dtf_OrderBy =
  | 'admins'
  | 'annualizedTvlFee'
  | 'auctionApprovers'
  | 'auctionDelay'
  | 'auctionLaunchers'
  | 'auctionLength'
  | 'bidsEnabled'
  | 'blockNumber'
  | 'brandManagers'
  | 'deployer'
  | 'externalRevenue'
  | 'feeRecipients'
  | 'governanceRevenue'
  | 'id'
  | 'legacyAdmins'
  | 'legacyAuctionApprovers'
  | 'mandate'
  | 'mintingFee'
  | 'ownerAddress'
  | 'ownerGovernance'
  | 'ownerGovernance__id'
  | 'ownerGovernance__isOptimistic'
  | 'ownerGovernance__name'
  | 'ownerGovernance__optimisticProposalThrottleCapacity'
  | 'ownerGovernance__optimisticSelectorRegistry'
  | 'ownerGovernance__optimisticVetoDelay'
  | 'ownerGovernance__optimisticVetoPeriod'
  | 'ownerGovernance__optimisticVetoThreshold'
  | 'ownerGovernance__proposalCount'
  | 'ownerGovernance__proposalThreshold'
  | 'ownerGovernance__proposalsCanceled'
  | 'ownerGovernance__proposalsExecuted'
  | 'ownerGovernance__proposalsQueued'
  | 'ownerGovernance__quorumDenominator'
  | 'ownerGovernance__quorumNumerator'
  | 'ownerGovernance__quorumVotes'
  | 'ownerGovernance__version'
  | 'ownerGovernance__votingDelay'
  | 'ownerGovernance__votingPeriod'
  | 'priceControl'
  | 'protocolRevenue'
  | 'proxyAdmin'
  | 'rebalances'
  | 'stToken'
  | 'stTokenAddress'
  | 'stToken__currentDelegates'
  | 'stToken__currentOptimisticDelegates'
  | 'stToken__delegatedVotes'
  | 'stToken__delegatedVotesRaw'
  | 'stToken__id'
  | 'stToken__optimisticDelegatedVotes'
  | 'stToken__optimisticDelegatedVotesRaw'
  | 'stToken__tokenJar'
  | 'stToken__totalDelegates'
  | 'stToken__totalOptimisticDelegates'
  | 'timestamp'
  | 'token'
  | 'token__address'
  | 'token__burnCount'
  | 'token__cumulativeHolderCount'
  | 'token__currentHolderCount'
  | 'token__decimals'
  | 'token__id'
  | 'token__mintCount'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBurned'
  | 'token__totalMinted'
  | 'token__totalSupply'
  | 'token__transferCount'
  | 'token__type'
  | 'totalRevenue'
  | 'tradingGovernance'
  | 'tradingGovernance__id'
  | 'tradingGovernance__isOptimistic'
  | 'tradingGovernance__name'
  | 'tradingGovernance__optimisticProposalThrottleCapacity'
  | 'tradingGovernance__optimisticSelectorRegistry'
  | 'tradingGovernance__optimisticVetoDelay'
  | 'tradingGovernance__optimisticVetoPeriod'
  | 'tradingGovernance__optimisticVetoThreshold'
  | 'tradingGovernance__proposalCount'
  | 'tradingGovernance__proposalThreshold'
  | 'tradingGovernance__proposalsCanceled'
  | 'tradingGovernance__proposalsExecuted'
  | 'tradingGovernance__proposalsQueued'
  | 'tradingGovernance__quorumDenominator'
  | 'tradingGovernance__quorumNumerator'
  | 'tradingGovernance__quorumVotes'
  | 'tradingGovernance__version'
  | 'tradingGovernance__votingDelay'
  | 'tradingGovernance__votingPeriod'
  | 'trustedFillerEnabled'
  | 'trustedFillerRegistry'
  | 'tvlFee'
  | 'weightControl';

export type DelegateChange_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DelegateChange_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegate?: InputMaybe<Scalars['String']['input']>;
  delegate_contains?: InputMaybe<Scalars['String']['input']>;
  delegate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_gt?: InputMaybe<Scalars['String']['input']>;
  delegate_gte?: InputMaybe<Scalars['String']['input']>;
  delegate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegate_lt?: InputMaybe<Scalars['String']['input']>;
  delegate_lte?: InputMaybe<Scalars['String']['input']>;
  delegate_not?: InputMaybe<Scalars['String']['input']>;
  delegate_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator?: InputMaybe<Scalars['String']['input']>;
  delegator_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_gt?: InputMaybe<Scalars['String']['input']>;
  delegator_gte?: InputMaybe<Scalars['String']['input']>;
  delegator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_lt?: InputMaybe<Scalars['String']['input']>;
  delegator_lte?: InputMaybe<Scalars['String']['input']>;
  delegator_not?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isOptimistic?: InputMaybe<Scalars['Boolean']['input']>;
  isOptimistic_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isOptimistic_not?: InputMaybe<Scalars['Boolean']['input']>;
  isOptimistic_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  logIndex?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DelegateChange_Filter>>>;
  previousDelegate?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_contains?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_ends_with?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_gt?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_gte?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  previousDelegate_lt?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_lte?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_contains?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  previousDelegate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_starts_with?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_gt?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_gte?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenAddress_lt?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_lte?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_gt?: InputMaybe<Scalars['String']['input']>;
  txnHash_gte?: InputMaybe<Scalars['String']['input']>;
  txnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_lt?: InputMaybe<Scalars['String']['input']>;
  txnHash_lte?: InputMaybe<Scalars['String']['input']>;
  txnHash_not?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type DelegateChange_OrderBy =
  | 'blockNumber'
  | 'blockTimestamp'
  | 'delegate'
  | 'delegator'
  | 'id'
  | 'isOptimistic'
  | 'logIndex'
  | 'previousDelegate'
  | 'tokenAddress'
  | 'txnHash';

export type DelegateVotingPowerChange_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DelegateVotingPowerChange_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegate?: InputMaybe<Scalars['String']['input']>;
  delegate_contains?: InputMaybe<Scalars['String']['input']>;
  delegate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_gt?: InputMaybe<Scalars['String']['input']>;
  delegate_gte?: InputMaybe<Scalars['String']['input']>;
  delegate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegate_lt?: InputMaybe<Scalars['String']['input']>;
  delegate_lte?: InputMaybe<Scalars['String']['input']>;
  delegate_not?: InputMaybe<Scalars['String']['input']>;
  delegate_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isOptimistic?: InputMaybe<Scalars['Boolean']['input']>;
  isOptimistic_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isOptimistic_not?: InputMaybe<Scalars['Boolean']['input']>;
  isOptimistic_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  logIndex?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  newBalance?: InputMaybe<Scalars['BigInt']['input']>;
  newBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  newBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  newBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  newBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  newBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  newBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  newBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DelegateVotingPowerChange_Filter>>>;
  previousBalance?: InputMaybe<Scalars['BigInt']['input']>;
  previousBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  previousBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  previousBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  previousBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  previousBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  previousBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  previousBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_gt?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_gte?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenAddress_lt?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_lte?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_gt?: InputMaybe<Scalars['String']['input']>;
  txnHash_gte?: InputMaybe<Scalars['String']['input']>;
  txnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_lt?: InputMaybe<Scalars['String']['input']>;
  txnHash_lte?: InputMaybe<Scalars['String']['input']>;
  txnHash_not?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type DelegateVotingPowerChange_OrderBy =
  | 'blockNumber'
  | 'blockTimestamp'
  | 'delegate'
  | 'id'
  | 'isOptimistic'
  | 'logIndex'
  | 'newBalance'
  | 'previousBalance'
  | 'tokenAddress'
  | 'txnHash';

export type Delegate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Delegate_Filter>>>;
  delegatedVotes?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotesRaw?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatedVotesRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatedVotes_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotes_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotes_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  delegatedVotes_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotes_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotes_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotes_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hasBeenOptimisticDelegate?: InputMaybe<Scalars['Boolean']['input']>;
  hasBeenOptimisticDelegate_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  hasBeenOptimisticDelegate_not?: InputMaybe<Scalars['Boolean']['input']>;
  hasBeenOptimisticDelegate_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  hasBeenStandardDelegate?: InputMaybe<Scalars['Boolean']['input']>;
  hasBeenStandardDelegate_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  hasBeenStandardDelegate_not?: InputMaybe<Scalars['Boolean']['input']>;
  hasBeenStandardDelegate_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  numberOptimisticVotes?: InputMaybe<Scalars['Int']['input']>;
  numberOptimisticVotes_gt?: InputMaybe<Scalars['Int']['input']>;
  numberOptimisticVotes_gte?: InputMaybe<Scalars['Int']['input']>;
  numberOptimisticVotes_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOptimisticVotes_lt?: InputMaybe<Scalars['Int']['input']>;
  numberOptimisticVotes_lte?: InputMaybe<Scalars['Int']['input']>;
  numberOptimisticVotes_not?: InputMaybe<Scalars['Int']['input']>;
  numberOptimisticVotes_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberVotes?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_gt?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_gte?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberVotes_lt?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_lte?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_not?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  optimisticDelegatedVotes?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotesRaw?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticDelegatedVotesRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticDelegatedVotes_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotes_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotes_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  optimisticDelegatedVotes_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotes_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotes_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotes_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  optimisticTokenHoldersRepresentedAmount?: InputMaybe<Scalars['Int']['input']>;
  optimisticTokenHoldersRepresentedAmount_gt?: InputMaybe<Scalars['Int']['input']>;
  optimisticTokenHoldersRepresentedAmount_gte?: InputMaybe<Scalars['Int']['input']>;
  optimisticTokenHoldersRepresentedAmount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  optimisticTokenHoldersRepresentedAmount_lt?: InputMaybe<Scalars['Int']['input']>;
  optimisticTokenHoldersRepresentedAmount_lte?: InputMaybe<Scalars['Int']['input']>;
  optimisticTokenHoldersRepresentedAmount_not?: InputMaybe<Scalars['Int']['input']>;
  optimisticTokenHoldersRepresentedAmount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  optimisticTokenHoldersRepresented_?: InputMaybe<AccountBalance_Filter>;
  or?: InputMaybe<Array<InputMaybe<Delegate_Filter>>>;
  proposals_?: InputMaybe<Proposal_Filter>;
  token?: InputMaybe<Scalars['String']['input']>;
  tokenHoldersRepresentedAmount?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_gt?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_gte?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokenHoldersRepresentedAmount_lt?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_lte?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_not?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokenHoldersRepresented_?: InputMaybe<AccountBalance_Filter>;
  token_?: InputMaybe<StakingToken_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votes_?: InputMaybe<Vote_Filter>;
};

export type Delegate_OrderBy =
  | 'address'
  | 'delegatedVotes'
  | 'delegatedVotesRaw'
  | 'hasBeenOptimisticDelegate'
  | 'hasBeenStandardDelegate'
  | 'id'
  | 'numberOptimisticVotes'
  | 'numberVotes'
  | 'optimisticDelegatedVotes'
  | 'optimisticDelegatedVotesRaw'
  | 'optimisticTokenHoldersRepresented'
  | 'optimisticTokenHoldersRepresentedAmount'
  | 'proposals'
  | 'token'
  | 'tokenHoldersRepresented'
  | 'tokenHoldersRepresentedAmount'
  | 'token__currentDelegates'
  | 'token__currentOptimisticDelegates'
  | 'token__delegatedVotes'
  | 'token__delegatedVotesRaw'
  | 'token__id'
  | 'token__optimisticDelegatedVotes'
  | 'token__optimisticDelegatedVotesRaw'
  | 'token__tokenJar'
  | 'token__totalDelegates'
  | 'token__totalOptimisticDelegates'
  | 'votes';

export type Event_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Event_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_?: InputMaybe<Account_Filter>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  nonce?: InputMaybe<Scalars['Int']['input']>;
  nonce_gt?: InputMaybe<Scalars['Int']['input']>;
  nonce_gte?: InputMaybe<Scalars['Int']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  nonce_lt?: InputMaybe<Scalars['Int']['input']>;
  nonce_lte?: InputMaybe<Scalars['Int']['input']>;
  nonce_not?: InputMaybe<Scalars['Int']['input']>;
  nonce_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Event_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_?: InputMaybe<Account_Filter>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Event_OrderBy =
  | 'blockNumber'
  | 'from'
  | 'from__id'
  | 'hash'
  | 'id'
  | 'logIndex'
  | 'nonce'
  | 'timestamp'
  | 'to'
  | 'to__id'
  | 'token'
  | 'token__address'
  | 'token__burnCount'
  | 'token__cumulativeHolderCount'
  | 'token__currentHolderCount'
  | 'token__decimals'
  | 'token__id'
  | 'token__mintCount'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBurned'
  | 'token__totalMinted'
  | 'token__totalSupply'
  | 'token__transferCount'
  | 'token__type';

export type GovernanceTimelock_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GovernanceTimelock_Filter>>>;
  entity?: InputMaybe<Scalars['String']['input']>;
  entity_contains?: InputMaybe<Scalars['String']['input']>;
  entity_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  entity_ends_with?: InputMaybe<Scalars['String']['input']>;
  entity_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  entity_gt?: InputMaybe<Scalars['String']['input']>;
  entity_gte?: InputMaybe<Scalars['String']['input']>;
  entity_in?: InputMaybe<Array<Scalars['String']['input']>>;
  entity_lt?: InputMaybe<Scalars['String']['input']>;
  entity_lte?: InputMaybe<Scalars['String']['input']>;
  entity_not?: InputMaybe<Scalars['String']['input']>;
  entity_not_contains?: InputMaybe<Scalars['String']['input']>;
  entity_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  entity_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  entity_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  entity_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  entity_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  entity_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  entity_starts_with?: InputMaybe<Scalars['String']['input']>;
  entity_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executionDelay?: InputMaybe<Scalars['BigInt']['input']>;
  executionDelay_gt?: InputMaybe<Scalars['BigInt']['input']>;
  executionDelay_gte?: InputMaybe<Scalars['BigInt']['input']>;
  executionDelay_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionDelay_lt?: InputMaybe<Scalars['BigInt']['input']>;
  executionDelay_lte?: InputMaybe<Scalars['BigInt']['input']>;
  executionDelay_not?: InputMaybe<Scalars['BigInt']['input']>;
  executionDelay_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  governance?: InputMaybe<Scalars['String']['input']>;
  governance_?: InputMaybe<Governance_Filter>;
  governance_contains?: InputMaybe<Scalars['String']['input']>;
  governance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_ends_with?: InputMaybe<Scalars['String']['input']>;
  governance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_gt?: InputMaybe<Scalars['String']['input']>;
  governance_gte?: InputMaybe<Scalars['String']['input']>;
  governance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  governance_lt?: InputMaybe<Scalars['String']['input']>;
  governance_lte?: InputMaybe<Scalars['String']['input']>;
  governance_not?: InputMaybe<Scalars['String']['input']>;
  governance_not_contains?: InputMaybe<Scalars['String']['input']>;
  governance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  governance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  governance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  governance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_starts_with?: InputMaybe<Scalars['String']['input']>;
  governance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  guardians?: InputMaybe<Array<Scalars['String']['input']>>;
  guardians_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  guardians_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  guardians_not?: InputMaybe<Array<Scalars['String']['input']>>;
  guardians_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  guardians_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  optimisticProposers?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticProposers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticProposers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticProposers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticProposers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticProposers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GovernanceTimelock_Filter>>>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type GovernanceTimelock_OrderBy =
  | 'entity'
  | 'executionDelay'
  | 'governance'
  | 'governance__id'
  | 'governance__isOptimistic'
  | 'governance__name'
  | 'governance__optimisticProposalThrottleCapacity'
  | 'governance__optimisticSelectorRegistry'
  | 'governance__optimisticVetoDelay'
  | 'governance__optimisticVetoPeriod'
  | 'governance__optimisticVetoThreshold'
  | 'governance__proposalCount'
  | 'governance__proposalThreshold'
  | 'governance__proposalsCanceled'
  | 'governance__proposalsExecuted'
  | 'governance__proposalsQueued'
  | 'governance__quorumDenominator'
  | 'governance__quorumNumerator'
  | 'governance__quorumVotes'
  | 'governance__version'
  | 'governance__votingDelay'
  | 'governance__votingPeriod'
  | 'guardians'
  | 'id'
  | 'optimisticProposers'
  | 'type';

export type Governance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Governance_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isOptimistic?: InputMaybe<Scalars['Boolean']['input']>;
  isOptimistic_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isOptimistic_not?: InputMaybe<Scalars['Boolean']['input']>;
  isOptimistic_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  optimisticProposalThrottleCapacity?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticProposalThrottleCapacity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticProposalThrottleCapacity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticProposalThrottleCapacity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticProposalThrottleCapacity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticProposalThrottleCapacity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticProposalThrottleCapacity_not?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticProposalThrottleCapacity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticProposers?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticProposers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticProposers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticProposers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticProposers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticProposers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticSelectorRegistry?: InputMaybe<Scalars['Bytes']['input']>;
  optimisticSelectorRegistry_contains?: InputMaybe<Scalars['Bytes']['input']>;
  optimisticSelectorRegistry_gt?: InputMaybe<Scalars['Bytes']['input']>;
  optimisticSelectorRegistry_gte?: InputMaybe<Scalars['Bytes']['input']>;
  optimisticSelectorRegistry_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  optimisticSelectorRegistry_lt?: InputMaybe<Scalars['Bytes']['input']>;
  optimisticSelectorRegistry_lte?: InputMaybe<Scalars['Bytes']['input']>;
  optimisticSelectorRegistry_not?: InputMaybe<Scalars['Bytes']['input']>;
  optimisticSelectorRegistry_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  optimisticSelectorRegistry_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  optimisticVetoDelay?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoDelay_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoDelay_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoDelay_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticVetoDelay_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoDelay_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoDelay_not?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoDelay_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticVetoPeriod?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoPeriod_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoPeriod_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoPeriod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticVetoPeriod_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoPeriod_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoPeriod_not?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticVetoThreshold?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoThreshold_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoThreshold_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoThreshold_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticVetoThreshold_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoThreshold_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoThreshold_not?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticVetoThreshold_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Governance_Filter>>>;
  proposalCount?: InputMaybe<Scalars['BigInt']['input']>;
  proposalCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalThreshold?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalThreshold_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalsCanceled?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsCanceled_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsCanceled_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsCanceled_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalsCanceled_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsCanceled_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsCanceled_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsCanceled_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalsExecuted?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsExecuted_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsExecuted_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsExecuted_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalsExecuted_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsExecuted_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsExecuted_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsExecuted_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalsQueued?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalsQueued_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposals_?: InputMaybe<Proposal_Filter>;
  quorumDenominator?: InputMaybe<Scalars['BigInt']['input']>;
  quorumDenominator_gt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumDenominator_gte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumDenominator_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumDenominator_lt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumDenominator_lte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumDenominator_not?: InputMaybe<Scalars['BigInt']['input']>;
  quorumDenominator_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumNumerator?: InputMaybe<Scalars['BigInt']['input']>;
  quorumNumerator_gt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumNumerator_gte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumNumerator_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumNumerator_lt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumNumerator_lte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumNumerator_not?: InputMaybe<Scalars['BigInt']['input']>;
  quorumNumerator_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumVotes?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timelock?: InputMaybe<Scalars['String']['input']>;
  timelock_?: InputMaybe<GovernanceTimelock_Filter>;
  timelock_contains?: InputMaybe<Scalars['String']['input']>;
  timelock_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  timelock_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelock_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelock_gt?: InputMaybe<Scalars['String']['input']>;
  timelock_gte?: InputMaybe<Scalars['String']['input']>;
  timelock_in?: InputMaybe<Array<Scalars['String']['input']>>;
  timelock_lt?: InputMaybe<Scalars['String']['input']>;
  timelock_lte?: InputMaybe<Scalars['String']['input']>;
  timelock_not?: InputMaybe<Scalars['String']['input']>;
  timelock_not_contains?: InputMaybe<Scalars['String']['input']>;
  timelock_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  timelock_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelock_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelock_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  timelock_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelock_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelock_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelock_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<StakingToken_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
  version_contains?: InputMaybe<Scalars['String']['input']>;
  version_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  version_ends_with?: InputMaybe<Scalars['String']['input']>;
  version_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_gt?: InputMaybe<Scalars['String']['input']>;
  version_gte?: InputMaybe<Scalars['String']['input']>;
  version_in?: InputMaybe<Array<Scalars['String']['input']>>;
  version_lt?: InputMaybe<Scalars['String']['input']>;
  version_lte?: InputMaybe<Scalars['String']['input']>;
  version_not?: InputMaybe<Scalars['String']['input']>;
  version_not_contains?: InputMaybe<Scalars['String']['input']>;
  version_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  version_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  version_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  version_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  version_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_starts_with?: InputMaybe<Scalars['String']['input']>;
  version_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votingDelay?: InputMaybe<Scalars['BigInt']['input']>;
  votingDelay_gt?: InputMaybe<Scalars['BigInt']['input']>;
  votingDelay_gte?: InputMaybe<Scalars['BigInt']['input']>;
  votingDelay_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votingDelay_lt?: InputMaybe<Scalars['BigInt']['input']>;
  votingDelay_lte?: InputMaybe<Scalars['BigInt']['input']>;
  votingDelay_not?: InputMaybe<Scalars['BigInt']['input']>;
  votingDelay_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votingPeriod?: InputMaybe<Scalars['BigInt']['input']>;
  votingPeriod_gt?: InputMaybe<Scalars['BigInt']['input']>;
  votingPeriod_gte?: InputMaybe<Scalars['BigInt']['input']>;
  votingPeriod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votingPeriod_lt?: InputMaybe<Scalars['BigInt']['input']>;
  votingPeriod_lte?: InputMaybe<Scalars['BigInt']['input']>;
  votingPeriod_not?: InputMaybe<Scalars['BigInt']['input']>;
  votingPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Governance_OrderBy =
  | 'id'
  | 'isOptimistic'
  | 'name'
  | 'optimisticProposalThrottleCapacity'
  | 'optimisticProposers'
  | 'optimisticSelectorRegistry'
  | 'optimisticVetoDelay'
  | 'optimisticVetoPeriod'
  | 'optimisticVetoThreshold'
  | 'proposalCount'
  | 'proposalThreshold'
  | 'proposals'
  | 'proposalsCanceled'
  | 'proposalsExecuted'
  | 'proposalsQueued'
  | 'quorumDenominator'
  | 'quorumNumerator'
  | 'quorumVotes'
  | 'timelock'
  | 'timelock__entity'
  | 'timelock__executionDelay'
  | 'timelock__id'
  | 'timelock__type'
  | 'token'
  | 'token__currentDelegates'
  | 'token__currentOptimisticDelegates'
  | 'token__delegatedVotes'
  | 'token__delegatedVotesRaw'
  | 'token__id'
  | 'token__optimisticDelegatedVotes'
  | 'token__optimisticDelegatedVotesRaw'
  | 'token__tokenJar'
  | 'token__totalDelegates'
  | 'token__totalOptimisticDelegates'
  | 'version'
  | 'votingDelay'
  | 'votingPeriod';

export type Lock_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Lock_Filter>>>;
  cancelledBlock?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledTxnHash?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_contains?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_gt?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_gte?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cancelledTxnHash_lt?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_lte?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_not?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cancelledTxnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  cancelledTxnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  claimedBlock?: InputMaybe<Scalars['BigInt']['input']>;
  claimedBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimedBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimedBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimedBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimedBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimedBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimedBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  claimedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimedTxnHash?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_contains?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_gt?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_gte?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  claimedTxnHash_lt?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_lte?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_not?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  claimedTxnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  claimedTxnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdBlock?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTxnHash?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_contains?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_gt?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_gte?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  createdTxnHash_lt?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_lte?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_not?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  createdTxnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  createdTxnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lockId?: InputMaybe<Scalars['BigInt']['input']>;
  lockId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lockId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lockId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lockId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lockId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lockId_not?: InputMaybe<Scalars['BigInt']['input']>;
  lockId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Lock_Filter>>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<StakingToken_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unlockTime?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unlockTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Lock_OrderBy =
  | 'account'
  | 'account__id'
  | 'amount'
  | 'cancelledBlock'
  | 'cancelledTimestamp'
  | 'cancelledTxnHash'
  | 'claimedBlock'
  | 'claimedTimestamp'
  | 'claimedTxnHash'
  | 'createdBlock'
  | 'createdTimestamp'
  | 'createdTxnHash'
  | 'id'
  | 'lockId'
  | 'token'
  | 'token__currentDelegates'
  | 'token__currentOptimisticDelegates'
  | 'token__delegatedVotes'
  | 'token__delegatedVotesRaw'
  | 'token__id'
  | 'token__optimisticDelegatedVotes'
  | 'token__optimisticDelegatedVotesRaw'
  | 'token__tokenJar'
  | 'token__totalDelegates'
  | 'token__totalOptimisticDelegates'
  | 'unlockTime';

export type Minting_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Minting_Filter>>>;
  firstMintTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  firstMintTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  firstMintTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  firstMintTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  firstMintTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  firstMintTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  firstMintTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  firstMintTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Minting_Filter>>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Minting_OrderBy =
  | 'account'
  | 'account__id'
  | 'amount'
  | 'firstMintTimestamp'
  | 'id'
  | 'token'
  | 'token__address'
  | 'token__burnCount'
  | 'token__cumulativeHolderCount'
  | 'token__currentHolderCount'
  | 'token__decimals'
  | 'token__id'
  | 'token__mintCount'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBurned'
  | 'token__totalMinted'
  | 'token__totalSupply'
  | 'token__transferCount'
  | 'token__type';

export type OptimisticProposalMetadata_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OptimisticProposalMetadata_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  governance?: InputMaybe<Scalars['String']['input']>;
  governance_?: InputMaybe<Governance_Filter>;
  governance_contains?: InputMaybe<Scalars['String']['input']>;
  governance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_ends_with?: InputMaybe<Scalars['String']['input']>;
  governance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_gt?: InputMaybe<Scalars['String']['input']>;
  governance_gte?: InputMaybe<Scalars['String']['input']>;
  governance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  governance_lt?: InputMaybe<Scalars['String']['input']>;
  governance_lte?: InputMaybe<Scalars['String']['input']>;
  governance_not?: InputMaybe<Scalars['String']['input']>;
  governance_not_contains?: InputMaybe<Scalars['String']['input']>;
  governance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  governance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  governance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  governance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_starts_with?: InputMaybe<Scalars['String']['input']>;
  governance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<OptimisticProposalMetadata_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txnHash?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_gt?: InputMaybe<Scalars['String']['input']>;
  txnHash_gte?: InputMaybe<Scalars['String']['input']>;
  txnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_lt?: InputMaybe<Scalars['String']['input']>;
  txnHash_lte?: InputMaybe<Scalars['String']['input']>;
  txnHash_not?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vetoDelay?: InputMaybe<Scalars['BigInt']['input']>;
  vetoDelay_gt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoDelay_gte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoDelay_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoDelay_lt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoDelay_lte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoDelay_not?: InputMaybe<Scalars['BigInt']['input']>;
  vetoDelay_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoPeriod?: InputMaybe<Scalars['BigInt']['input']>;
  vetoPeriod_gt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoPeriod_gte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoPeriod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoPeriod_lt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoPeriod_lte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoPeriod_not?: InputMaybe<Scalars['BigInt']['input']>;
  vetoPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoThreshold?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThreshold_gt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThreshold_gte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThreshold_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoThreshold_lt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThreshold_lte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThreshold_not?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThreshold_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type OptimisticProposalMetadata_OrderBy =
  | 'blockNumber'
  | 'governance'
  | 'governance__id'
  | 'governance__isOptimistic'
  | 'governance__name'
  | 'governance__optimisticProposalThrottleCapacity'
  | 'governance__optimisticSelectorRegistry'
  | 'governance__optimisticVetoDelay'
  | 'governance__optimisticVetoPeriod'
  | 'governance__optimisticVetoThreshold'
  | 'governance__proposalCount'
  | 'governance__proposalThreshold'
  | 'governance__proposalsCanceled'
  | 'governance__proposalsExecuted'
  | 'governance__proposalsQueued'
  | 'governance__quorumDenominator'
  | 'governance__quorumNumerator'
  | 'governance__quorumVotes'
  | 'governance__version'
  | 'governance__votingDelay'
  | 'governance__votingPeriod'
  | 'id'
  | 'timestamp'
  | 'txnHash'
  | 'vetoDelay'
  | 'vetoPeriod'
  | 'vetoThreshold';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type ProposalState =
  | 'ACTIVE'
  | 'CANCELED'
  | 'DEFEATED'
  | 'EXECUTED'
  | 'EXPIRED'
  | 'PENDING'
  | 'QUEUED'
  | 'SUCCEEDED'
  | 'VETOED';

export type Proposal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  abstainDelegateVotes?: InputMaybe<Scalars['BigInt']['input']>;
  abstainDelegateVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  abstainDelegateVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  abstainDelegateVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  abstainDelegateVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  abstainDelegateVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  abstainDelegateVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  abstainDelegateVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  abstainWeightedVotes?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  abstainWeightedVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  againstDelegateVotes?: InputMaybe<Scalars['BigInt']['input']>;
  againstDelegateVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  againstDelegateVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  againstDelegateVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  againstDelegateVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  againstDelegateVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  againstDelegateVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  againstDelegateVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  againstWeightedVotes?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  againstWeightedVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Proposal_Filter>>>;
  calldatas?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  cancellationAccount?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_?: InputMaybe<Account_Filter>;
  cancellationAccount_contains?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_gt?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_gte?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cancellationAccount_lt?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_lte?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_not?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cancellationAccount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  cancellationAccount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cancellationBlock?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancellationBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancellationTime?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancellationTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancellationTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancellationTxnHash?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_contains?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_gt?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_gte?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cancellationTxnHash_lt?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_lte?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_not?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cancellationTxnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  cancellationTxnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creationBlock?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creationBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creationTime?: InputMaybe<Scalars['BigInt']['input']>;
  creationTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  creationTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  creationTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creationTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  creationTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  creationTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  creationTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatesAtStart?: InputMaybe<Scalars['BigInt']['input']>;
  delegatesAtStart_gt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatesAtStart_gte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatesAtStart_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatesAtStart_lt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatesAtStart_lte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatesAtStart_not?: InputMaybe<Scalars['BigInt']['input']>;
  delegatesAtStart_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executionAccount?: InputMaybe<Scalars['String']['input']>;
  executionAccount_?: InputMaybe<Account_Filter>;
  executionAccount_contains?: InputMaybe<Scalars['String']['input']>;
  executionAccount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  executionAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  executionAccount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executionAccount_gt?: InputMaybe<Scalars['String']['input']>;
  executionAccount_gte?: InputMaybe<Scalars['String']['input']>;
  executionAccount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  executionAccount_lt?: InputMaybe<Scalars['String']['input']>;
  executionAccount_lte?: InputMaybe<Scalars['String']['input']>;
  executionAccount_not?: InputMaybe<Scalars['String']['input']>;
  executionAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  executionAccount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  executionAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  executionAccount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executionAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  executionAccount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  executionAccount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executionAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  executionAccount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executionBlock?: InputMaybe<Scalars['BigInt']['input']>;
  executionBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  executionBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  executionBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  executionBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  executionBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  executionBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionETA?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_gt?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_gte?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionETA_lt?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_lte?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_not?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionTime?: InputMaybe<Scalars['BigInt']['input']>;
  executionTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  executionTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  executionTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  executionTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  executionTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  executionTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionTxnHash?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_contains?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_gt?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_gte?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  executionTxnHash_lt?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_lte?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_not?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  executionTxnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  executionTxnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  forDelegateVotes?: InputMaybe<Scalars['BigInt']['input']>;
  forDelegateVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  forDelegateVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  forDelegateVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  forDelegateVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  forDelegateVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  forDelegateVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  forDelegateVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  forWeightedVotes?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  forWeightedVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  governance?: InputMaybe<Scalars['String']['input']>;
  governance_?: InputMaybe<Governance_Filter>;
  governance_contains?: InputMaybe<Scalars['String']['input']>;
  governance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_ends_with?: InputMaybe<Scalars['String']['input']>;
  governance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_gt?: InputMaybe<Scalars['String']['input']>;
  governance_gte?: InputMaybe<Scalars['String']['input']>;
  governance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  governance_lt?: InputMaybe<Scalars['String']['input']>;
  governance_lte?: InputMaybe<Scalars['String']['input']>;
  governance_not?: InputMaybe<Scalars['String']['input']>;
  governance_not_contains?: InputMaybe<Scalars['String']['input']>;
  governance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  governance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  governance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  governance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_starts_with?: InputMaybe<Scalars['String']['input']>;
  governance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isOptimistic?: InputMaybe<Scalars['Boolean']['input']>;
  isOptimistic_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isOptimistic_not?: InputMaybe<Scalars['Boolean']['input']>;
  isOptimistic_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  optimisticSnapshot?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshotSupply?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshotSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshotSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshotSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticSnapshotSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshotSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshotSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshotSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticSnapshot_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshot_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshot_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticSnapshot_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshot_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshot_not?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticSnapshot_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Proposal_Filter>>>;
  proposer?: InputMaybe<Scalars['String']['input']>;
  proposer_?: InputMaybe<Delegate_Filter>;
  proposer_contains?: InputMaybe<Scalars['String']['input']>;
  proposer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_gt?: InputMaybe<Scalars['String']['input']>;
  proposer_gte?: InputMaybe<Scalars['String']['input']>;
  proposer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposer_lt?: InputMaybe<Scalars['String']['input']>;
  proposer_lte?: InputMaybe<Scalars['String']['input']>;
  proposer_not?: InputMaybe<Scalars['String']['input']>;
  proposer_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queueAccount?: InputMaybe<Scalars['String']['input']>;
  queueAccount_?: InputMaybe<Account_Filter>;
  queueAccount_contains?: InputMaybe<Scalars['String']['input']>;
  queueAccount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  queueAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  queueAccount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queueAccount_gt?: InputMaybe<Scalars['String']['input']>;
  queueAccount_gte?: InputMaybe<Scalars['String']['input']>;
  queueAccount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  queueAccount_lt?: InputMaybe<Scalars['String']['input']>;
  queueAccount_lte?: InputMaybe<Scalars['String']['input']>;
  queueAccount_not?: InputMaybe<Scalars['String']['input']>;
  queueAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  queueAccount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  queueAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  queueAccount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queueAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  queueAccount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  queueAccount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queueAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  queueAccount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queueBlock?: InputMaybe<Scalars['BigInt']['input']>;
  queueBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  queueBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  queueBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  queueBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  queueBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  queueBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  queueBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  queueTime?: InputMaybe<Scalars['BigInt']['input']>;
  queueTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  queueTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  queueTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  queueTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  queueTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  queueTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  queueTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  queueTxnHash?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_contains?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_gt?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_gte?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  queueTxnHash_lt?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_lte?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_not?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  queueTxnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  queueTxnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  quorumVotes?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  signatures?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  state?: InputMaybe<ProposalState>;
  state_in?: InputMaybe<Array<ProposalState>>;
  state_not?: InputMaybe<ProposalState>;
  state_not_in?: InputMaybe<Array<ProposalState>>;
  targets?: InputMaybe<Array<Scalars['String']['input']>>;
  targets_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  targets_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  targets_not?: InputMaybe<Array<Scalars['String']['input']>>;
  targets_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  targets_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  timelockId?: InputMaybe<Scalars['String']['input']>;
  timelockId_contains?: InputMaybe<Scalars['String']['input']>;
  timelockId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockId_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelockId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockId_gt?: InputMaybe<Scalars['String']['input']>;
  timelockId_gte?: InputMaybe<Scalars['String']['input']>;
  timelockId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  timelockId_lt?: InputMaybe<Scalars['String']['input']>;
  timelockId_lte?: InputMaybe<Scalars['String']['input']>;
  timelockId_not?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_contains?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  timelockId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockId_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelockId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenHoldersAtStart?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHoldersAtStart_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHoldersAtStart_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHoldersAtStart_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenHoldersAtStart_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHoldersAtStart_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHoldersAtStart_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHoldersAtStart_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegateVotes?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegateVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegateVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegateVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegateVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegateVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegateVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegateVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalWeightedVotes?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalWeightedVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txnHash?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_gt?: InputMaybe<Scalars['String']['input']>;
  txnHash_gte?: InputMaybe<Scalars['String']['input']>;
  txnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_lt?: InputMaybe<Scalars['String']['input']>;
  txnHash_lte?: InputMaybe<Scalars['String']['input']>;
  txnHash_not?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoThreshold?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThresholdVotes?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThresholdVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThresholdVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThresholdVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoThresholdVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThresholdVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThresholdVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThresholdVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoThreshold_gt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThreshold_gte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThreshold_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoThreshold_lt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThreshold_lte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThreshold_not?: InputMaybe<Scalars['BigInt']['input']>;
  vetoThreshold_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  voteEnd?: InputMaybe<Scalars['BigInt']['input']>;
  voteEnd_gt?: InputMaybe<Scalars['BigInt']['input']>;
  voteEnd_gte?: InputMaybe<Scalars['BigInt']['input']>;
  voteEnd_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  voteEnd_lt?: InputMaybe<Scalars['BigInt']['input']>;
  voteEnd_lte?: InputMaybe<Scalars['BigInt']['input']>;
  voteEnd_not?: InputMaybe<Scalars['BigInt']['input']>;
  voteEnd_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  voteStart?: InputMaybe<Scalars['BigInt']['input']>;
  voteStart_gt?: InputMaybe<Scalars['BigInt']['input']>;
  voteStart_gte?: InputMaybe<Scalars['BigInt']['input']>;
  voteStart_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  voteStart_lt?: InputMaybe<Scalars['BigInt']['input']>;
  voteStart_lte?: InputMaybe<Scalars['BigInt']['input']>;
  voteStart_not?: InputMaybe<Scalars['BigInt']['input']>;
  voteStart_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votes_?: InputMaybe<Vote_Filter>;
};

export type Proposal_OrderBy =
  | 'abstainDelegateVotes'
  | 'abstainWeightedVotes'
  | 'againstDelegateVotes'
  | 'againstWeightedVotes'
  | 'calldatas'
  | 'cancellationAccount'
  | 'cancellationAccount__id'
  | 'cancellationBlock'
  | 'cancellationTime'
  | 'cancellationTxnHash'
  | 'creationBlock'
  | 'creationTime'
  | 'delegatesAtStart'
  | 'description'
  | 'executionAccount'
  | 'executionAccount__id'
  | 'executionBlock'
  | 'executionETA'
  | 'executionTime'
  | 'executionTxnHash'
  | 'forDelegateVotes'
  | 'forWeightedVotes'
  | 'governance'
  | 'governance__id'
  | 'governance__isOptimistic'
  | 'governance__name'
  | 'governance__optimisticProposalThrottleCapacity'
  | 'governance__optimisticSelectorRegistry'
  | 'governance__optimisticVetoDelay'
  | 'governance__optimisticVetoPeriod'
  | 'governance__optimisticVetoThreshold'
  | 'governance__proposalCount'
  | 'governance__proposalThreshold'
  | 'governance__proposalsCanceled'
  | 'governance__proposalsExecuted'
  | 'governance__proposalsQueued'
  | 'governance__quorumDenominator'
  | 'governance__quorumNumerator'
  | 'governance__quorumVotes'
  | 'governance__version'
  | 'governance__votingDelay'
  | 'governance__votingPeriod'
  | 'id'
  | 'isOptimistic'
  | 'optimisticSnapshot'
  | 'optimisticSnapshotSupply'
  | 'proposer'
  | 'proposer__address'
  | 'proposer__delegatedVotes'
  | 'proposer__delegatedVotesRaw'
  | 'proposer__hasBeenOptimisticDelegate'
  | 'proposer__hasBeenStandardDelegate'
  | 'proposer__id'
  | 'proposer__numberOptimisticVotes'
  | 'proposer__numberVotes'
  | 'proposer__optimisticDelegatedVotes'
  | 'proposer__optimisticDelegatedVotesRaw'
  | 'proposer__optimisticTokenHoldersRepresentedAmount'
  | 'proposer__tokenHoldersRepresentedAmount'
  | 'queueAccount'
  | 'queueAccount__id'
  | 'queueBlock'
  | 'queueTime'
  | 'queueTxnHash'
  | 'quorumVotes'
  | 'signatures'
  | 'state'
  | 'targets'
  | 'timelockId'
  | 'tokenHoldersAtStart'
  | 'totalDelegateVotes'
  | 'totalWeightedVotes'
  | 'txnHash'
  | 'values'
  | 'vetoThreshold'
  | 'vetoThresholdVotes'
  | 'voteEnd'
  | 'voteStart'
  | 'votes';

export type RsrBurnDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RsrBurnDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBurned?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBurned_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyBurnAmount?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyBurnAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyBurnCount?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyBurnCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RsrBurnDailySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type RsrBurnDailySnapshot_OrderBy =
  | 'blockNumber'
  | 'cumulativeBurned'
  | 'dailyBurnAmount'
  | 'dailyBurnCount'
  | 'id'
  | 'timestamp';

export type RsrBurnGlobal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RsrBurnGlobal_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastUpdateBlock?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RsrBurnGlobal_Filter>>>;
  totalBurnCount?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurnCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurnCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurnCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBurnCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurnCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurnCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurnCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBurned?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBurned_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type RsrBurnGlobal_OrderBy =
  | 'id'
  | 'lastUpdateBlock'
  | 'lastUpdateTimestamp'
  | 'totalBurnCount'
  | 'totalBurned';

export type RsrBurnMonthlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RsrBurnMonthlySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBurned?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBurned_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurned_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  monthlyBurnAmount?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyBurnAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyBurnCount?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_gt?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_gte?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  monthlyBurnCount_lt?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_lte?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_not?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RsrBurnMonthlySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type RsrBurnMonthlySnapshot_OrderBy =
  | 'blockNumber'
  | 'cumulativeBurned'
  | 'id'
  | 'monthlyBurnAmount'
  | 'monthlyBurnCount'
  | 'timestamp';

export type RsrBurn_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<RsrBurn_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  burner?: InputMaybe<Scalars['Bytes']['input']>;
  burner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  burner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  burner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  burner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  burner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  burner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  burner_not?: InputMaybe<Scalars['Bytes']['input']>;
  burner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  burner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RsrBurn_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type RsrBurn_OrderBy =
  | 'amount'
  | 'blockNumber'
  | 'burner'
  | 'id'
  | 'timestamp'
  | 'transactionHash';

export type RebalanceAuctionBid_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RebalanceAuctionBid_Filter>>>;
  auction?: InputMaybe<Scalars['String']['input']>;
  auction_?: InputMaybe<Auction_Filter>;
  auction_contains?: InputMaybe<Scalars['String']['input']>;
  auction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_gt?: InputMaybe<Scalars['String']['input']>;
  auction_gte?: InputMaybe<Scalars['String']['input']>;
  auction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_lt?: InputMaybe<Scalars['String']['input']>;
  auction_lte?: InputMaybe<Scalars['String']['input']>;
  auction_not?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_contains?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_gt?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_gte?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  bidder_lt?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_lte?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_not?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  bidder_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buyAmount?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buyAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  buyAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buyToken?: InputMaybe<Scalars['String']['input']>;
  buyToken_?: InputMaybe<Token_Filter>;
  buyToken_contains?: InputMaybe<Scalars['String']['input']>;
  buyToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  buyToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  buyToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buyToken_gt?: InputMaybe<Scalars['String']['input']>;
  buyToken_gte?: InputMaybe<Scalars['String']['input']>;
  buyToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  buyToken_lt?: InputMaybe<Scalars['String']['input']>;
  buyToken_lte?: InputMaybe<Scalars['String']['input']>;
  buyToken_not?: InputMaybe<Scalars['String']['input']>;
  buyToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  buyToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  buyToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  buyToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buyToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  buyToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  buyToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buyToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  buyToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf?: InputMaybe<Scalars['String']['input']>;
  dtf_?: InputMaybe<Dtf_Filter>;
  dtf_contains?: InputMaybe<Scalars['String']['input']>;
  dtf_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_ends_with?: InputMaybe<Scalars['String']['input']>;
  dtf_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_gt?: InputMaybe<Scalars['String']['input']>;
  dtf_gte?: InputMaybe<Scalars['String']['input']>;
  dtf_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dtf_lt?: InputMaybe<Scalars['String']['input']>;
  dtf_lte?: InputMaybe<Scalars['String']['input']>;
  dtf_not?: InputMaybe<Scalars['String']['input']>;
  dtf_not_contains?: InputMaybe<Scalars['String']['input']>;
  dtf_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dtf_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dtf_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dtf_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_starts_with?: InputMaybe<Scalars['String']['input']>;
  dtf_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  filler?: InputMaybe<Scalars['Bytes']['input']>;
  filler_contains?: InputMaybe<Scalars['Bytes']['input']>;
  filler_gt?: InputMaybe<Scalars['Bytes']['input']>;
  filler_gte?: InputMaybe<Scalars['Bytes']['input']>;
  filler_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  filler_lt?: InputMaybe<Scalars['Bytes']['input']>;
  filler_lte?: InputMaybe<Scalars['Bytes']['input']>;
  filler_not?: InputMaybe<Scalars['Bytes']['input']>;
  filler_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  filler_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RebalanceAuctionBid_Filter>>>;
  sellAmount?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sellAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  sellAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sellToken?: InputMaybe<Scalars['String']['input']>;
  sellToken_?: InputMaybe<Token_Filter>;
  sellToken_contains?: InputMaybe<Scalars['String']['input']>;
  sellToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sellToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  sellToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sellToken_gt?: InputMaybe<Scalars['String']['input']>;
  sellToken_gte?: InputMaybe<Scalars['String']['input']>;
  sellToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sellToken_lt?: InputMaybe<Scalars['String']['input']>;
  sellToken_lte?: InputMaybe<Scalars['String']['input']>;
  sellToken_not?: InputMaybe<Scalars['String']['input']>;
  sellToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  sellToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sellToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sellToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sellToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sellToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sellToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sellToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  sellToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type RebalanceAuctionBid_OrderBy =
  | 'auction'
  | 'auction__blockNumber'
  | 'auction__endTime'
  | 'auction__id'
  | 'auction__rebalanceHighLimit'
  | 'auction__rebalanceLowLimit'
  | 'auction__rebalanceSpotLimit'
  | 'auction__startTime'
  | 'auction__timestamp'
  | 'auction__transactionHash'
  | 'bidder'
  | 'blockNumber'
  | 'buyAmount'
  | 'buyToken'
  | 'buyToken__address'
  | 'buyToken__burnCount'
  | 'buyToken__cumulativeHolderCount'
  | 'buyToken__currentHolderCount'
  | 'buyToken__decimals'
  | 'buyToken__id'
  | 'buyToken__mintCount'
  | 'buyToken__name'
  | 'buyToken__symbol'
  | 'buyToken__totalBurned'
  | 'buyToken__totalMinted'
  | 'buyToken__totalSupply'
  | 'buyToken__transferCount'
  | 'buyToken__type'
  | 'dtf'
  | 'dtf__annualizedTvlFee'
  | 'dtf__auctionDelay'
  | 'dtf__auctionLength'
  | 'dtf__bidsEnabled'
  | 'dtf__blockNumber'
  | 'dtf__deployer'
  | 'dtf__externalRevenue'
  | 'dtf__feeRecipients'
  | 'dtf__governanceRevenue'
  | 'dtf__id'
  | 'dtf__mandate'
  | 'dtf__mintingFee'
  | 'dtf__ownerAddress'
  | 'dtf__priceControl'
  | 'dtf__protocolRevenue'
  | 'dtf__proxyAdmin'
  | 'dtf__stTokenAddress'
  | 'dtf__timestamp'
  | 'dtf__totalRevenue'
  | 'dtf__trustedFillerEnabled'
  | 'dtf__trustedFillerRegistry'
  | 'dtf__tvlFee'
  | 'dtf__weightControl'
  | 'filler'
  | 'id'
  | 'sellAmount'
  | 'sellToken'
  | 'sellToken__address'
  | 'sellToken__burnCount'
  | 'sellToken__cumulativeHolderCount'
  | 'sellToken__currentHolderCount'
  | 'sellToken__decimals'
  | 'sellToken__id'
  | 'sellToken__mintCount'
  | 'sellToken__name'
  | 'sellToken__symbol'
  | 'sellToken__totalBurned'
  | 'sellToken__totalMinted'
  | 'sellToken__totalSupply'
  | 'sellToken__transferCount'
  | 'sellToken__type'
  | 'timestamp'
  | 'transactionHash';

export type Rebalance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Rebalance_Filter>>>;
  auctions_?: InputMaybe<Auction_Filter>;
  availableUntil?: InputMaybe<Scalars['BigInt']['input']>;
  availableUntil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  availableUntil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  availableUntil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableUntil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  availableUntil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  availableUntil_not?: InputMaybe<Scalars['BigInt']['input']>;
  availableUntil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bidsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  bidsEnabled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  bidsEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  bidsEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dtf?: InputMaybe<Scalars['String']['input']>;
  dtf_?: InputMaybe<Dtf_Filter>;
  dtf_contains?: InputMaybe<Scalars['String']['input']>;
  dtf_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_ends_with?: InputMaybe<Scalars['String']['input']>;
  dtf_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_gt?: InputMaybe<Scalars['String']['input']>;
  dtf_gte?: InputMaybe<Scalars['String']['input']>;
  dtf_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dtf_lt?: InputMaybe<Scalars['String']['input']>;
  dtf_lte?: InputMaybe<Scalars['String']['input']>;
  dtf_not?: InputMaybe<Scalars['String']['input']>;
  dtf_not_contains?: InputMaybe<Scalars['String']['input']>;
  dtf_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dtf_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dtf_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dtf_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_starts_with?: InputMaybe<Scalars['String']['input']>;
  dtf_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inRebalance?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  inRebalance_contains?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  inRebalance_not?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  inRebalance_not_contains?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  maxAuctionSize?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxAuctionSize_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxAuctionSize_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxAuctionSize_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  nonce?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  nonce_lt?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_not?: InputMaybe<Scalars['BigInt']['input']>;
  nonce_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Rebalance_Filter>>>;
  priceControl?: InputMaybe<Scalars['String']['input']>;
  priceControl_contains?: InputMaybe<Scalars['String']['input']>;
  priceControl_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  priceControl_ends_with?: InputMaybe<Scalars['String']['input']>;
  priceControl_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceControl_gt?: InputMaybe<Scalars['String']['input']>;
  priceControl_gte?: InputMaybe<Scalars['String']['input']>;
  priceControl_in?: InputMaybe<Array<Scalars['String']['input']>>;
  priceControl_lt?: InputMaybe<Scalars['String']['input']>;
  priceControl_lte?: InputMaybe<Scalars['String']['input']>;
  priceControl_not?: InputMaybe<Scalars['String']['input']>;
  priceControl_not_contains?: InputMaybe<Scalars['String']['input']>;
  priceControl_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  priceControl_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  priceControl_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceControl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  priceControl_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  priceControl_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceControl_starts_with?: InputMaybe<Scalars['String']['input']>;
  priceControl_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceHighLimit?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceHighLimit_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceHighLimit_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceHighLimit_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceLowLimit?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceLowLimit_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceLowLimit_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceLowLimit_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceHighLimit?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceHighLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceHighLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceLowLimit?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceLowLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceLowLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceSpotLimit?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceSpotLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceSpotLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  restrictedUntil?: InputMaybe<Scalars['BigInt']['input']>;
  restrictedUntil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  restrictedUntil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  restrictedUntil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  restrictedUntil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  restrictedUntil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  restrictedUntil_not?: InputMaybe<Scalars['BigInt']['input']>;
  restrictedUntil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startedAt?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokens?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_?: InputMaybe<Token_Filter>;
  tokens_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weightHighLimit?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightHighLimit_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightHighLimit_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightHighLimit_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightLowLimit?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightLowLimit_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightLowLimit_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightLowLimit_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightSpotLimit?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightSpotLimit_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightSpotLimit_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weightSpotLimit_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Rebalance_OrderBy =
  | 'auctions'
  | 'availableUntil'
  | 'bidsEnabled'
  | 'blockNumber'
  | 'dtf'
  | 'dtf__annualizedTvlFee'
  | 'dtf__auctionDelay'
  | 'dtf__auctionLength'
  | 'dtf__bidsEnabled'
  | 'dtf__blockNumber'
  | 'dtf__deployer'
  | 'dtf__externalRevenue'
  | 'dtf__feeRecipients'
  | 'dtf__governanceRevenue'
  | 'dtf__id'
  | 'dtf__mandate'
  | 'dtf__mintingFee'
  | 'dtf__ownerAddress'
  | 'dtf__priceControl'
  | 'dtf__protocolRevenue'
  | 'dtf__proxyAdmin'
  | 'dtf__stTokenAddress'
  | 'dtf__timestamp'
  | 'dtf__totalRevenue'
  | 'dtf__trustedFillerEnabled'
  | 'dtf__trustedFillerRegistry'
  | 'dtf__tvlFee'
  | 'dtf__weightControl'
  | 'id'
  | 'inRebalance'
  | 'maxAuctionSize'
  | 'nonce'
  | 'priceControl'
  | 'priceHighLimit'
  | 'priceLowLimit'
  | 'rebalanceHighLimit'
  | 'rebalanceLowLimit'
  | 'rebalanceSpotLimit'
  | 'restrictedUntil'
  | 'startedAt'
  | 'timestamp'
  | 'tokens'
  | 'transactionHash'
  | 'weightHighLimit'
  | 'weightLowLimit'
  | 'weightSpotLimit';

export type RewardClaim_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<RewardClaim_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RewardClaim_Filter>>>;
  rewardToken?: InputMaybe<Scalars['String']['input']>;
  rewardToken_?: InputMaybe<Token_Filter>;
  rewardToken_contains?: InputMaybe<Scalars['String']['input']>;
  rewardToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_gt?: InputMaybe<Scalars['String']['input']>;
  rewardToken_gte?: InputMaybe<Scalars['String']['input']>;
  rewardToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardToken_lt?: InputMaybe<Scalars['String']['input']>;
  rewardToken_lte?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<StakingToken_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_gt?: InputMaybe<Scalars['String']['input']>;
  txnHash_gte?: InputMaybe<Scalars['String']['input']>;
  txnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_lt?: InputMaybe<Scalars['String']['input']>;
  txnHash_lte?: InputMaybe<Scalars['String']['input']>;
  txnHash_not?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type RewardClaim_OrderBy =
  | 'account'
  | 'account__id'
  | 'amount'
  | 'blockNumber'
  | 'id'
  | 'rewardToken'
  | 'rewardToken__address'
  | 'rewardToken__burnCount'
  | 'rewardToken__cumulativeHolderCount'
  | 'rewardToken__currentHolderCount'
  | 'rewardToken__decimals'
  | 'rewardToken__id'
  | 'rewardToken__mintCount'
  | 'rewardToken__name'
  | 'rewardToken__symbol'
  | 'rewardToken__totalBurned'
  | 'rewardToken__totalMinted'
  | 'rewardToken__totalSupply'
  | 'rewardToken__transferCount'
  | 'rewardToken__type'
  | 'timestamp'
  | 'token'
  | 'token__currentDelegates'
  | 'token__currentOptimisticDelegates'
  | 'token__delegatedVotes'
  | 'token__delegatedVotesRaw'
  | 'token__id'
  | 'token__optimisticDelegatedVotes'
  | 'token__optimisticDelegatedVotesRaw'
  | 'token__tokenJar'
  | 'token__totalDelegates'
  | 'token__totalOptimisticDelegates'
  | 'txnHash';

export type StakingTokenRewards_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  active_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  active_not?: InputMaybe<Scalars['Boolean']['input']>;
  active_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  and?: InputMaybe<Array<InputMaybe<StakingTokenRewards_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<StakingTokenRewards_Filter>>>;
  rewardToken?: InputMaybe<Scalars['String']['input']>;
  rewardToken_?: InputMaybe<Token_Filter>;
  rewardToken_contains?: InputMaybe<Scalars['String']['input']>;
  rewardToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_gt?: InputMaybe<Scalars['String']['input']>;
  rewardToken_gte?: InputMaybe<Scalars['String']['input']>;
  rewardToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardToken_lt?: InputMaybe<Scalars['String']['input']>;
  rewardToken_lte?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stToken?: InputMaybe<Scalars['String']['input']>;
  stToken_?: InputMaybe<StakingToken_Filter>;
  stToken_contains?: InputMaybe<Scalars['String']['input']>;
  stToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  stToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stToken_gt?: InputMaybe<Scalars['String']['input']>;
  stToken_gte?: InputMaybe<Scalars['String']['input']>;
  stToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stToken_lt?: InputMaybe<Scalars['String']['input']>;
  stToken_lte?: InputMaybe<Scalars['String']['input']>;
  stToken_not?: InputMaybe<Scalars['String']['input']>;
  stToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  stToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  stToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type StakingTokenRewards_OrderBy =
  | 'active'
  | 'id'
  | 'rewardToken'
  | 'rewardToken__address'
  | 'rewardToken__burnCount'
  | 'rewardToken__cumulativeHolderCount'
  | 'rewardToken__currentHolderCount'
  | 'rewardToken__decimals'
  | 'rewardToken__id'
  | 'rewardToken__mintCount'
  | 'rewardToken__name'
  | 'rewardToken__symbol'
  | 'rewardToken__totalBurned'
  | 'rewardToken__totalMinted'
  | 'rewardToken__totalSupply'
  | 'rewardToken__transferCount'
  | 'rewardToken__type'
  | 'stToken'
  | 'stToken__currentDelegates'
  | 'stToken__currentOptimisticDelegates'
  | 'stToken__delegatedVotes'
  | 'stToken__delegatedVotesRaw'
  | 'stToken__id'
  | 'stToken__optimisticDelegatedVotes'
  | 'stToken__optimisticDelegatedVotesRaw'
  | 'stToken__tokenJar'
  | 'stToken__totalDelegates'
  | 'stToken__totalOptimisticDelegates';

export type StakingToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StakingToken_Filter>>>;
  currentDelegates?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentDelegates_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentOptimisticDelegates?: InputMaybe<Scalars['BigInt']['input']>;
  currentOptimisticDelegates_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentOptimisticDelegates_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentOptimisticDelegates_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentOptimisticDelegates_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentOptimisticDelegates_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentOptimisticDelegates_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentOptimisticDelegates_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  daos_?: InputMaybe<Governance_Filter>;
  delegatedVotes?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotesRaw?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatedVotesRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatedVotes_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotes_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotes_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  delegatedVotes_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotes_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotes_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  delegatedVotes_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  delegates_?: InputMaybe<Delegate_Filter>;
  dtfs_?: InputMaybe<Dtf_Filter>;
  governance?: InputMaybe<Scalars['String']['input']>;
  governance_?: InputMaybe<Governance_Filter>;
  governance_contains?: InputMaybe<Scalars['String']['input']>;
  governance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_ends_with?: InputMaybe<Scalars['String']['input']>;
  governance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_gt?: InputMaybe<Scalars['String']['input']>;
  governance_gte?: InputMaybe<Scalars['String']['input']>;
  governance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  governance_lt?: InputMaybe<Scalars['String']['input']>;
  governance_lte?: InputMaybe<Scalars['String']['input']>;
  governance_not?: InputMaybe<Scalars['String']['input']>;
  governance_not_contains?: InputMaybe<Scalars['String']['input']>;
  governance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  governance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  governance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  governance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governance_starts_with?: InputMaybe<Scalars['String']['input']>;
  governance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  legacyGovernance?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyGovernance_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyGovernance_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyGovernance_not?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyGovernance_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyGovernance_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  optimisticDelegatedVotes?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotesRaw?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticDelegatedVotesRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  optimisticDelegatedVotesRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimisticDelegatedVotes_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotes_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotes_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  optimisticDelegatedVotes_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotes_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotes_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  optimisticDelegatedVotes_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<StakingToken_Filter>>>;
  rewards_?: InputMaybe<StakingTokenRewards_Filter>;
  token?: InputMaybe<Scalars['String']['input']>;
  tokenJar?: InputMaybe<Scalars['String']['input']>;
  tokenJar_contains?: InputMaybe<Scalars['String']['input']>;
  tokenJar_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenJar_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenJar_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenJar_gt?: InputMaybe<Scalars['String']['input']>;
  tokenJar_gte?: InputMaybe<Scalars['String']['input']>;
  tokenJar_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenJar_lt?: InputMaybe<Scalars['String']['input']>;
  tokenJar_lte?: InputMaybe<Scalars['String']['input']>;
  tokenJar_not?: InputMaybe<Scalars['String']['input']>;
  tokenJar_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenJar_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenJar_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenJar_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenJar_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenJar_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenJar_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenJar_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenJar_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalDelegates?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegates_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalOptimisticDelegates?: InputMaybe<Scalars['BigInt']['input']>;
  totalOptimisticDelegates_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalOptimisticDelegates_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalOptimisticDelegates_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalOptimisticDelegates_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalOptimisticDelegates_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalOptimisticDelegates_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalOptimisticDelegates_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  underlying?: InputMaybe<Scalars['String']['input']>;
  underlying_?: InputMaybe<Token_Filter>;
  underlying_contains?: InputMaybe<Scalars['String']['input']>;
  underlying_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlying_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlying_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlying_gt?: InputMaybe<Scalars['String']['input']>;
  underlying_gte?: InputMaybe<Scalars['String']['input']>;
  underlying_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlying_lt?: InputMaybe<Scalars['String']['input']>;
  underlying_lte?: InputMaybe<Scalars['String']['input']>;
  underlying_not?: InputMaybe<Scalars['String']['input']>;
  underlying_not_contains?: InputMaybe<Scalars['String']['input']>;
  underlying_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlying_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlying_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlying_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlying_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlying_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlying_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlying_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type StakingToken_OrderBy =
  | 'currentDelegates'
  | 'currentOptimisticDelegates'
  | 'daos'
  | 'delegatedVotes'
  | 'delegatedVotesRaw'
  | 'delegates'
  | 'dtfs'
  | 'governance'
  | 'governance__id'
  | 'governance__isOptimistic'
  | 'governance__name'
  | 'governance__optimisticProposalThrottleCapacity'
  | 'governance__optimisticSelectorRegistry'
  | 'governance__optimisticVetoDelay'
  | 'governance__optimisticVetoPeriod'
  | 'governance__optimisticVetoThreshold'
  | 'governance__proposalCount'
  | 'governance__proposalThreshold'
  | 'governance__proposalsCanceled'
  | 'governance__proposalsExecuted'
  | 'governance__proposalsQueued'
  | 'governance__quorumDenominator'
  | 'governance__quorumNumerator'
  | 'governance__quorumVotes'
  | 'governance__version'
  | 'governance__votingDelay'
  | 'governance__votingPeriod'
  | 'id'
  | 'legacyGovernance'
  | 'optimisticDelegatedVotes'
  | 'optimisticDelegatedVotesRaw'
  | 'rewards'
  | 'token'
  | 'tokenJar'
  | 'token__address'
  | 'token__burnCount'
  | 'token__cumulativeHolderCount'
  | 'token__currentHolderCount'
  | 'token__decimals'
  | 'token__id'
  | 'token__mintCount'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBurned'
  | 'token__totalMinted'
  | 'token__totalSupply'
  | 'token__transferCount'
  | 'token__type'
  | 'totalDelegates'
  | 'totalOptimisticDelegates'
  | 'underlying'
  | 'underlying__address'
  | 'underlying__burnCount'
  | 'underlying__cumulativeHolderCount'
  | 'underlying__currentHolderCount'
  | 'underlying__decimals'
  | 'underlying__id'
  | 'underlying__mintCount'
  | 'underlying__name'
  | 'underlying__symbol'
  | 'underlying__totalBurned'
  | 'underlying__totalMinted'
  | 'underlying__totalSupply'
  | 'underlying__transferCount'
  | 'underlying__type';

export type TimelockOperationByTx_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TimelockOperationByTx_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TimelockOperationByTx_Filter>>>;
  timelockId?: InputMaybe<Scalars['String']['input']>;
  timelockId_contains?: InputMaybe<Scalars['String']['input']>;
  timelockId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockId_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelockId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockId_gt?: InputMaybe<Scalars['String']['input']>;
  timelockId_gte?: InputMaybe<Scalars['String']['input']>;
  timelockId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  timelockId_lt?: InputMaybe<Scalars['String']['input']>;
  timelockId_lte?: InputMaybe<Scalars['String']['input']>;
  timelockId_not?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_contains?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  timelockId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelockId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockId_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelockId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type TimelockOperationByTx_OrderBy =
  | 'id'
  | 'timelockId';

export type TimelockOperation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TimelockOperation_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TimelockOperation_Filter>>>;
  proposal?: InputMaybe<Scalars['String']['input']>;
  proposal_?: InputMaybe<Proposal_Filter>;
  proposal_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_gt?: InputMaybe<Scalars['String']['input']>;
  proposal_gte?: InputMaybe<Scalars['String']['input']>;
  proposal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_lt?: InputMaybe<Scalars['String']['input']>;
  proposal_lte?: InputMaybe<Scalars['String']['input']>;
  proposal_not?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type TimelockOperation_OrderBy =
  | 'blockNumber'
  | 'id'
  | 'proposal'
  | 'proposal__abstainDelegateVotes'
  | 'proposal__abstainWeightedVotes'
  | 'proposal__againstDelegateVotes'
  | 'proposal__againstWeightedVotes'
  | 'proposal__cancellationBlock'
  | 'proposal__cancellationTime'
  | 'proposal__cancellationTxnHash'
  | 'proposal__creationBlock'
  | 'proposal__creationTime'
  | 'proposal__delegatesAtStart'
  | 'proposal__description'
  | 'proposal__executionBlock'
  | 'proposal__executionETA'
  | 'proposal__executionTime'
  | 'proposal__executionTxnHash'
  | 'proposal__forDelegateVotes'
  | 'proposal__forWeightedVotes'
  | 'proposal__id'
  | 'proposal__isOptimistic'
  | 'proposal__optimisticSnapshot'
  | 'proposal__optimisticSnapshotSupply'
  | 'proposal__queueBlock'
  | 'proposal__queueTime'
  | 'proposal__queueTxnHash'
  | 'proposal__quorumVotes'
  | 'proposal__state'
  | 'proposal__timelockId'
  | 'proposal__tokenHoldersAtStart'
  | 'proposal__totalDelegateVotes'
  | 'proposal__totalWeightedVotes'
  | 'proposal__txnHash'
  | 'proposal__vetoThreshold'
  | 'proposal__vetoThresholdVotes'
  | 'proposal__voteEnd'
  | 'proposal__voteStart'
  | 'timestamp'
  | 'transactionHash';

export type TokenDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeHolderCount?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeHolderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentHolderCount?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentHolderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyBurnAmount?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyBurnAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyBurnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyBurnCount?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyBurnCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyBurnCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyEventCount?: InputMaybe<Scalars['Int']['input']>;
  dailyEventCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyEventCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyEventCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyEventCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyEventCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyEventCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyEventCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyExternalRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  dailyExternalRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyExternalRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyExternalRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyExternalRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyExternalRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyExternalRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyExternalRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyGovernanceRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  dailyGovernanceRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyGovernanceRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyGovernanceRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyGovernanceRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyGovernanceRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyGovernanceRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyGovernanceRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyMintAmount?: InputMaybe<Scalars['BigInt']['input']>;
  dailyMintAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyMintAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyMintAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyMintAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyMintAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyMintAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyMintAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyMintCount?: InputMaybe<Scalars['Int']['input']>;
  dailyMintCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyMintCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyMintCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyMintCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyMintCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyMintCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyMintCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyProtocolRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  dailyProtocolRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyProtocolRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyProtocolRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyProtocolRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyProtocolRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyProtocolRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyProtocolRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyTotalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyTotalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyTransferAmount?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTransferAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTransferAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTransferAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyTransferAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTransferAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTransferAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTransferAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyTransferCount?: InputMaybe<Scalars['Int']['input']>;
  dailyTransferCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyTransferCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyTransferCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyTransferCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyTransferCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyTransferCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyTransferCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenDailySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type TokenDailySnapshot_OrderBy =
  | 'blockNumber'
  | 'cumulativeHolderCount'
  | 'currentHolderCount'
  | 'dailyBurnAmount'
  | 'dailyBurnCount'
  | 'dailyEventCount'
  | 'dailyExternalRevenue'
  | 'dailyGovernanceRevenue'
  | 'dailyMintAmount'
  | 'dailyMintCount'
  | 'dailyProtocolRevenue'
  | 'dailyRevenue'
  | 'dailyTotalSupply'
  | 'dailyTransferAmount'
  | 'dailyTransferCount'
  | 'id'
  | 'timestamp'
  | 'token'
  | 'token__address'
  | 'token__burnCount'
  | 'token__cumulativeHolderCount'
  | 'token__currentHolderCount'
  | 'token__decimals'
  | 'token__id'
  | 'token__mintCount'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBurned'
  | 'token__totalMinted'
  | 'token__totalSupply'
  | 'token__transferCount'
  | 'token__type';

export type TokenHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenHourlySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeHolderCount?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeHolderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentHolderCount?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentHolderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyBurnAmount?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyBurnAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyBurnAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyBurnAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyBurnAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyBurnAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyBurnAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyBurnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyBurnCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyBurnCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyBurnCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyBurnCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyBurnCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyBurnCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyBurnCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyBurnCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyEventCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyEventCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyEventCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyEventCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyEventCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyEventCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyEventCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyEventCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyExternalRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyExternalRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyExternalRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyExternalRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyExternalRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyExternalRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyExternalRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyExternalRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyGovernanceRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyGovernanceRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyGovernanceRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyGovernanceRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyGovernanceRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyGovernanceRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyGovernanceRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyGovernanceRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyMintAmount?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyMintAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyMintAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyMintAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyMintAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyMintAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyMintAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyMintAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyMintCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyMintCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyMintCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyMintCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyMintCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyMintCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyMintCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyMintCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyProtocolRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyProtocolRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyProtocolRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyProtocolRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyProtocolRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyProtocolRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyProtocolRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyProtocolRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyTotalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyTotalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyTransferAmount?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTransferAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTransferAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTransferAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyTransferAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTransferAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTransferAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTransferAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyTransferCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransferCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransferCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransferCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyTransferCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransferCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransferCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransferCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenHourlySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type TokenHourlySnapshot_OrderBy =
  | 'blockNumber'
  | 'cumulativeHolderCount'
  | 'currentHolderCount'
  | 'hourlyBurnAmount'
  | 'hourlyBurnCount'
  | 'hourlyEventCount'
  | 'hourlyExternalRevenue'
  | 'hourlyGovernanceRevenue'
  | 'hourlyMintAmount'
  | 'hourlyMintCount'
  | 'hourlyProtocolRevenue'
  | 'hourlyRevenue'
  | 'hourlyTotalSupply'
  | 'hourlyTransferAmount'
  | 'hourlyTransferCount'
  | 'id'
  | 'timestamp'
  | 'token'
  | 'token__address'
  | 'token__burnCount'
  | 'token__cumulativeHolderCount'
  | 'token__currentHolderCount'
  | 'token__decimals'
  | 'token__id'
  | 'token__mintCount'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBurned'
  | 'token__totalMinted'
  | 'token__totalSupply'
  | 'token__transferCount'
  | 'token__type';

export type TokenMonthlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenMonthlySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBurnAmount?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurnAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurnAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurnAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBurnAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurnAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurnAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeBurnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeExternalRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeExternalRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeExternalRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeExternalRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeExternalRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeExternalRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeExternalRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeExternalRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeGovernanceRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeGovernanceRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeGovernanceRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeGovernanceRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeGovernanceRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeGovernanceRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeGovernanceRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeGovernanceRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeHolderCount?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeHolderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeMintAmount?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeMintAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeMintAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeMintAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeMintAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeMintAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeMintAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeMintAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeProtocolRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProtocolRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProtocolRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProtocolRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeProtocolRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProtocolRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProtocolRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeProtocolRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentHolderCount?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentHolderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  monthlyBurnAmount?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyBurnAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyBurnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyBurnCount?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_gt?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_gte?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  monthlyBurnCount_lt?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_lte?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_not?: InputMaybe<Scalars['Int']['input']>;
  monthlyBurnCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  monthlyEventCount?: InputMaybe<Scalars['Int']['input']>;
  monthlyEventCount_gt?: InputMaybe<Scalars['Int']['input']>;
  monthlyEventCount_gte?: InputMaybe<Scalars['Int']['input']>;
  monthlyEventCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  monthlyEventCount_lt?: InputMaybe<Scalars['Int']['input']>;
  monthlyEventCount_lte?: InputMaybe<Scalars['Int']['input']>;
  monthlyEventCount_not?: InputMaybe<Scalars['Int']['input']>;
  monthlyEventCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  monthlyExternalRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyExternalRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyExternalRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyExternalRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyExternalRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyExternalRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyExternalRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyExternalRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyGovernanceRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyGovernanceRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyGovernanceRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyGovernanceRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyGovernanceRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyGovernanceRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyGovernanceRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyGovernanceRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyMintAmount?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyMintAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyMintAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyMintAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyMintAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyMintAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyMintAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyMintAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyMintCount?: InputMaybe<Scalars['Int']['input']>;
  monthlyMintCount_gt?: InputMaybe<Scalars['Int']['input']>;
  monthlyMintCount_gte?: InputMaybe<Scalars['Int']['input']>;
  monthlyMintCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  monthlyMintCount_lt?: InputMaybe<Scalars['Int']['input']>;
  monthlyMintCount_lte?: InputMaybe<Scalars['Int']['input']>;
  monthlyMintCount_not?: InputMaybe<Scalars['Int']['input']>;
  monthlyMintCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  monthlyProtocolRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyProtocolRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyProtocolRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyProtocolRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyProtocolRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyProtocolRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyProtocolRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyProtocolRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyTotalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTotalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTotalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTotalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyTotalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTotalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTotalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTotalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyTransferAmount?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTransferAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTransferAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTransferAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyTransferAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTransferAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTransferAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  monthlyTransferAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  monthlyTransferCount?: InputMaybe<Scalars['Int']['input']>;
  monthlyTransferCount_gt?: InputMaybe<Scalars['Int']['input']>;
  monthlyTransferCount_gte?: InputMaybe<Scalars['Int']['input']>;
  monthlyTransferCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  monthlyTransferCount_lt?: InputMaybe<Scalars['Int']['input']>;
  monthlyTransferCount_lte?: InputMaybe<Scalars['Int']['input']>;
  monthlyTransferCount_not?: InputMaybe<Scalars['Int']['input']>;
  monthlyTransferCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenMonthlySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type TokenMonthlySnapshot_OrderBy =
  | 'blockNumber'
  | 'cumulativeBurnAmount'
  | 'cumulativeExternalRevenue'
  | 'cumulativeGovernanceRevenue'
  | 'cumulativeHolderCount'
  | 'cumulativeMintAmount'
  | 'cumulativeProtocolRevenue'
  | 'cumulativeRevenue'
  | 'currentHolderCount'
  | 'id'
  | 'monthlyBurnAmount'
  | 'monthlyBurnCount'
  | 'monthlyEventCount'
  | 'monthlyExternalRevenue'
  | 'monthlyGovernanceRevenue'
  | 'monthlyMintAmount'
  | 'monthlyMintCount'
  | 'monthlyProtocolRevenue'
  | 'monthlyRevenue'
  | 'monthlyTotalSupply'
  | 'monthlyTransferAmount'
  | 'monthlyTransferCount'
  | 'timestamp'
  | 'token'
  | 'token__address'
  | 'token__burnCount'
  | 'token__cumulativeHolderCount'
  | 'token__currentHolderCount'
  | 'token__decimals'
  | 'token__id'
  | 'token__mintCount'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBurned'
  | 'token__totalMinted'
  | 'token__totalSupply'
  | 'token__transferCount'
  | 'token__type';

export type TokenType =
  | 'ASSET'
  | 'BRIDGED_DTF'
  | 'DTF'
  | 'VOTE';

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  burnCount?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  burnCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeHolderCount?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeHolderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeHolderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentHolderCount?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentHolderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentHolderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyTokenSnapshot_?: InputMaybe<TokenDailySnapshot_Filter>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  holdersBalance_?: InputMaybe<AccountBalance_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  mintCount?: InputMaybe<Scalars['BigInt']['input']>;
  mintCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  mintCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  mintCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mintCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  mintCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  mintCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  mintCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalBurned?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBurned_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBurned_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalMinted?: InputMaybe<Scalars['BigInt']['input']>;
  totalMinted_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalMinted_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalMinted_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalMinted_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalMinted_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalMinted_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalMinted_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transferCount?: InputMaybe<Scalars['BigInt']['input']>;
  transferCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  transferCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  transferCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transferCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  transferCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transferCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  transferCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transfers_?: InputMaybe<TransferEvent_Filter>;
  type?: InputMaybe<TokenType>;
  type_in?: InputMaybe<Array<TokenType>>;
  type_not?: InputMaybe<TokenType>;
  type_not_in?: InputMaybe<Array<TokenType>>;
};

export type Token_OrderBy =
  | 'address'
  | 'burnCount'
  | 'cumulativeHolderCount'
  | 'currentHolderCount'
  | 'dailyTokenSnapshot'
  | 'decimals'
  | 'holdersBalance'
  | 'id'
  | 'mintCount'
  | 'name'
  | 'symbol'
  | 'totalBurned'
  | 'totalMinted'
  | 'totalSupply'
  | 'transferCount'
  | 'transfers'
  | 'type';

export type TradeState =
  | 'APPROVED'
  | 'CLOSED'
  | 'LAUNCHED';

export type Trade_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Trade_Filter>>>;
  approvedBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedBuyLimitSpot?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBuyLimitSpot_gt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBuyLimitSpot_gte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBuyLimitSpot_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedBuyLimitSpot_lt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBuyLimitSpot_lte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBuyLimitSpot_not?: InputMaybe<Scalars['BigInt']['input']>;
  approvedBuyLimitSpot_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedEndPrice?: InputMaybe<Scalars['BigInt']['input']>;
  approvedEndPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedEndPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedEndPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedEndPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedEndPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedEndPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  approvedEndPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedSellLimitSpot?: InputMaybe<Scalars['BigInt']['input']>;
  approvedSellLimitSpot_gt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedSellLimitSpot_gte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedSellLimitSpot_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedSellLimitSpot_lt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedSellLimitSpot_lte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedSellLimitSpot_not?: InputMaybe<Scalars['BigInt']['input']>;
  approvedSellLimitSpot_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedStartPrice?: InputMaybe<Scalars['BigInt']['input']>;
  approvedStartPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedStartPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedStartPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedStartPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedStartPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedStartPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  approvedStartPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  approvedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  approvedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  approvedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  approvedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  approvedTransactionHash?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  approvedTransactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_not?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  approvedTransactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  approvedTransactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  availableAt?: InputMaybe<Scalars['BigInt']['input']>;
  availableAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  availableAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  availableAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  availableAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  availableAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  availableAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableRuns?: InputMaybe<Scalars['BigInt']['input']>;
  availableRuns_gt?: InputMaybe<Scalars['BigInt']['input']>;
  availableRuns_gte?: InputMaybe<Scalars['BigInt']['input']>;
  availableRuns_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableRuns_lt?: InputMaybe<Scalars['BigInt']['input']>;
  availableRuns_lte?: InputMaybe<Scalars['BigInt']['input']>;
  availableRuns_not?: InputMaybe<Scalars['BigInt']['input']>;
  availableRuns_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bids_?: InputMaybe<AuctionBid_Filter>;
  boughtAmount?: InputMaybe<Scalars['BigInt']['input']>;
  boughtAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  boughtAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  boughtAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  boughtAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  boughtAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  boughtAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  boughtAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buy?: InputMaybe<Scalars['String']['input']>;
  buyLimitHigh?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitHigh_gt?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitHigh_gte?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitHigh_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buyLimitHigh_lt?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitHigh_lte?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitHigh_not?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitHigh_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buyLimitLow?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitLow_gt?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitLow_gte?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitLow_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buyLimitLow_lt?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitLow_lte?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitLow_not?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitLow_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buyLimitSpot?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitSpot_gt?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitSpot_gte?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitSpot_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buyLimitSpot_lt?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitSpot_lte?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitSpot_not?: InputMaybe<Scalars['BigInt']['input']>;
  buyLimitSpot_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  buy_?: InputMaybe<Token_Filter>;
  buy_contains?: InputMaybe<Scalars['String']['input']>;
  buy_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  buy_ends_with?: InputMaybe<Scalars['String']['input']>;
  buy_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buy_gt?: InputMaybe<Scalars['String']['input']>;
  buy_gte?: InputMaybe<Scalars['String']['input']>;
  buy_in?: InputMaybe<Array<Scalars['String']['input']>>;
  buy_lt?: InputMaybe<Scalars['String']['input']>;
  buy_lte?: InputMaybe<Scalars['String']['input']>;
  buy_not?: InputMaybe<Scalars['String']['input']>;
  buy_not_contains?: InputMaybe<Scalars['String']['input']>;
  buy_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  buy_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  buy_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buy_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  buy_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  buy_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buy_starts_with?: InputMaybe<Scalars['String']['input']>;
  buy_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closedBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  closedBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  closedBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  closedBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  closedBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  closedBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  closedBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  closedBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  closedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  closedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  closedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  closedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  closedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  closedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  closedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  closedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  closedTransactionHash?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  closedTransactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_not?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  closedTransactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  closedTransactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf?: InputMaybe<Scalars['String']['input']>;
  dtf_?: InputMaybe<Dtf_Filter>;
  dtf_contains?: InputMaybe<Scalars['String']['input']>;
  dtf_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_ends_with?: InputMaybe<Scalars['String']['input']>;
  dtf_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_gt?: InputMaybe<Scalars['String']['input']>;
  dtf_gte?: InputMaybe<Scalars['String']['input']>;
  dtf_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dtf_lt?: InputMaybe<Scalars['String']['input']>;
  dtf_lte?: InputMaybe<Scalars['String']['input']>;
  dtf_not?: InputMaybe<Scalars['String']['input']>;
  dtf_not_contains?: InputMaybe<Scalars['String']['input']>;
  dtf_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dtf_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dtf_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dtf_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dtf_starts_with?: InputMaybe<Scalars['String']['input']>;
  dtf_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  end?: InputMaybe<Scalars['BigInt']['input']>;
  endPrice?: InputMaybe<Scalars['BigInt']['input']>;
  endPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  endPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  end_gt?: InputMaybe<Scalars['BigInt']['input']>;
  end_gte?: InputMaybe<Scalars['BigInt']['input']>;
  end_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  end_lt?: InputMaybe<Scalars['BigInt']['input']>;
  end_lte?: InputMaybe<Scalars['BigInt']['input']>;
  end_not?: InputMaybe<Scalars['BigInt']['input']>;
  end_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isKilled?: InputMaybe<Scalars['Boolean']['input']>;
  isKilled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isKilled_not?: InputMaybe<Scalars['Boolean']['input']>;
  isKilled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  launchTimeout?: InputMaybe<Scalars['BigInt']['input']>;
  launchTimeout_gt?: InputMaybe<Scalars['BigInt']['input']>;
  launchTimeout_gte?: InputMaybe<Scalars['BigInt']['input']>;
  launchTimeout_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  launchTimeout_lt?: InputMaybe<Scalars['BigInt']['input']>;
  launchTimeout_lte?: InputMaybe<Scalars['BigInt']['input']>;
  launchTimeout_not?: InputMaybe<Scalars['BigInt']['input']>;
  launchTimeout_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  launchedBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  launchedBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  launchedBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  launchedBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  launchedBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  launchedBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  launchedBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  launchedBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  launchedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  launchedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  launchedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  launchedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  launchedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  launchedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  launchedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  launchedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  launchedTransactionHash?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  launchedTransactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_not?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  launchedTransactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  launchedTransactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Trade_Filter>>>;
  sell?: InputMaybe<Scalars['String']['input']>;
  sellLimitHigh?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitHigh_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitHigh_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitHigh_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sellLimitHigh_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitHigh_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitHigh_not?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitHigh_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sellLimitLow?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitLow_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitLow_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitLow_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sellLimitLow_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitLow_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitLow_not?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitLow_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sellLimitSpot?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitSpot_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitSpot_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitSpot_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sellLimitSpot_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitSpot_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitSpot_not?: InputMaybe<Scalars['BigInt']['input']>;
  sellLimitSpot_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sell_?: InputMaybe<Token_Filter>;
  sell_contains?: InputMaybe<Scalars['String']['input']>;
  sell_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sell_ends_with?: InputMaybe<Scalars['String']['input']>;
  sell_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sell_gt?: InputMaybe<Scalars['String']['input']>;
  sell_gte?: InputMaybe<Scalars['String']['input']>;
  sell_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sell_lt?: InputMaybe<Scalars['String']['input']>;
  sell_lte?: InputMaybe<Scalars['String']['input']>;
  sell_not?: InputMaybe<Scalars['String']['input']>;
  sell_not_contains?: InputMaybe<Scalars['String']['input']>;
  sell_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sell_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sell_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sell_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sell_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sell_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sell_starts_with?: InputMaybe<Scalars['String']['input']>;
  sell_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  soldAmount?: InputMaybe<Scalars['BigInt']['input']>;
  soldAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  soldAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  soldAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  soldAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  soldAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  soldAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  soldAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  start?: InputMaybe<Scalars['BigInt']['input']>;
  startPrice?: InputMaybe<Scalars['BigInt']['input']>;
  startPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  startPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  start_gt?: InputMaybe<Scalars['BigInt']['input']>;
  start_gte?: InputMaybe<Scalars['BigInt']['input']>;
  start_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  start_lt?: InputMaybe<Scalars['BigInt']['input']>;
  start_lte?: InputMaybe<Scalars['BigInt']['input']>;
  start_not?: InputMaybe<Scalars['BigInt']['input']>;
  start_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  state?: InputMaybe<TradeState>;
  state_in?: InputMaybe<Array<TradeState>>;
  state_not?: InputMaybe<TradeState>;
  state_not_in?: InputMaybe<Array<TradeState>>;
};

export type Trade_OrderBy =
  | 'approvedBlockNumber'
  | 'approvedBuyLimitSpot'
  | 'approvedEndPrice'
  | 'approvedSellLimitSpot'
  | 'approvedStartPrice'
  | 'approvedTimestamp'
  | 'approvedTransactionHash'
  | 'availableAt'
  | 'availableRuns'
  | 'bids'
  | 'boughtAmount'
  | 'buy'
  | 'buyLimitHigh'
  | 'buyLimitLow'
  | 'buyLimitSpot'
  | 'buy__address'
  | 'buy__burnCount'
  | 'buy__cumulativeHolderCount'
  | 'buy__currentHolderCount'
  | 'buy__decimals'
  | 'buy__id'
  | 'buy__mintCount'
  | 'buy__name'
  | 'buy__symbol'
  | 'buy__totalBurned'
  | 'buy__totalMinted'
  | 'buy__totalSupply'
  | 'buy__transferCount'
  | 'buy__type'
  | 'closedBlockNumber'
  | 'closedTimestamp'
  | 'closedTransactionHash'
  | 'dtf'
  | 'dtf__annualizedTvlFee'
  | 'dtf__auctionDelay'
  | 'dtf__auctionLength'
  | 'dtf__bidsEnabled'
  | 'dtf__blockNumber'
  | 'dtf__deployer'
  | 'dtf__externalRevenue'
  | 'dtf__feeRecipients'
  | 'dtf__governanceRevenue'
  | 'dtf__id'
  | 'dtf__mandate'
  | 'dtf__mintingFee'
  | 'dtf__ownerAddress'
  | 'dtf__priceControl'
  | 'dtf__protocolRevenue'
  | 'dtf__proxyAdmin'
  | 'dtf__stTokenAddress'
  | 'dtf__timestamp'
  | 'dtf__totalRevenue'
  | 'dtf__trustedFillerEnabled'
  | 'dtf__trustedFillerRegistry'
  | 'dtf__tvlFee'
  | 'dtf__weightControl'
  | 'end'
  | 'endPrice'
  | 'id'
  | 'isKilled'
  | 'launchTimeout'
  | 'launchedBlockNumber'
  | 'launchedTimestamp'
  | 'launchedTransactionHash'
  | 'sell'
  | 'sellLimitHigh'
  | 'sellLimitLow'
  | 'sellLimitSpot'
  | 'sell__address'
  | 'sell__burnCount'
  | 'sell__cumulativeHolderCount'
  | 'sell__currentHolderCount'
  | 'sell__decimals'
  | 'sell__id'
  | 'sell__mintCount'
  | 'sell__name'
  | 'sell__symbol'
  | 'sell__totalBurned'
  | 'sell__totalMinted'
  | 'sell__totalSupply'
  | 'sell__transferCount'
  | 'sell__type'
  | 'soldAmount'
  | 'start'
  | 'startPrice'
  | 'state';

export type TransferEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<TransferEvent_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_?: InputMaybe<Account_Filter>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  nonce?: InputMaybe<Scalars['Int']['input']>;
  nonce_gt?: InputMaybe<Scalars['Int']['input']>;
  nonce_gte?: InputMaybe<Scalars['Int']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  nonce_lt?: InputMaybe<Scalars['Int']['input']>;
  nonce_lte?: InputMaybe<Scalars['Int']['input']>;
  nonce_not?: InputMaybe<Scalars['Int']['input']>;
  nonce_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TransferEvent_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_?: InputMaybe<Account_Filter>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type TransferEvent_OrderBy =
  | 'amount'
  | 'blockNumber'
  | 'from'
  | 'from__id'
  | 'hash'
  | 'id'
  | 'logIndex'
  | 'nonce'
  | 'timestamp'
  | 'to'
  | 'to__id'
  | 'token'
  | 'token__address'
  | 'token__burnCount'
  | 'token__cumulativeHolderCount'
  | 'token__currentHolderCount'
  | 'token__decimals'
  | 'token__id'
  | 'token__mintCount'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBurned'
  | 'token__totalMinted'
  | 'token__totalSupply'
  | 'token__transferCount'
  | 'token__type'
  | 'type';

export type UnstakingManager_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UnstakingManager_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UnstakingManager_Filter>>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<StakingToken_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type UnstakingManager_OrderBy =
  | 'id'
  | 'token'
  | 'token__currentDelegates'
  | 'token__currentOptimisticDelegates'
  | 'token__delegatedVotes'
  | 'token__delegatedVotesRaw'
  | 'token__id'
  | 'token__optimisticDelegatedVotes'
  | 'token__optimisticDelegatedVotesRaw'
  | 'token__tokenJar'
  | 'token__totalDelegates'
  | 'token__totalOptimisticDelegates';

export type Version_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Version_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Version_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Version_OrderBy =
  | 'address'
  | 'blockNumber'
  | 'hash'
  | 'id'
  | 'timestamp';

export type VoteChoice =
  | 'ABSTAIN'
  | 'AGAINST'
  | 'FOR';

export type VoteDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  abstainWeightedVotes?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  abstainWeightedVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  abstainWeightedVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  againstWeightedVotes?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  againstWeightedVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  againstWeightedVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<VoteDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  forWeightedVotes?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  forWeightedVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  forWeightedVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<VoteDailySnapshot_Filter>>>;
  proposal?: InputMaybe<Scalars['String']['input']>;
  proposal_?: InputMaybe<Proposal_Filter>;
  proposal_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_gt?: InputMaybe<Scalars['String']['input']>;
  proposal_gte?: InputMaybe<Scalars['String']['input']>;
  proposal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_lt?: InputMaybe<Scalars['String']['input']>;
  proposal_lte?: InputMaybe<Scalars['String']['input']>;
  proposal_not?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalWeightedVotes?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalWeightedVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalWeightedVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type VoteDailySnapshot_OrderBy =
  | 'abstainWeightedVotes'
  | 'againstWeightedVotes'
  | 'blockNumber'
  | 'forWeightedVotes'
  | 'id'
  | 'proposal'
  | 'proposal__abstainDelegateVotes'
  | 'proposal__abstainWeightedVotes'
  | 'proposal__againstDelegateVotes'
  | 'proposal__againstWeightedVotes'
  | 'proposal__cancellationBlock'
  | 'proposal__cancellationTime'
  | 'proposal__cancellationTxnHash'
  | 'proposal__creationBlock'
  | 'proposal__creationTime'
  | 'proposal__delegatesAtStart'
  | 'proposal__description'
  | 'proposal__executionBlock'
  | 'proposal__executionETA'
  | 'proposal__executionTime'
  | 'proposal__executionTxnHash'
  | 'proposal__forDelegateVotes'
  | 'proposal__forWeightedVotes'
  | 'proposal__id'
  | 'proposal__isOptimistic'
  | 'proposal__optimisticSnapshot'
  | 'proposal__optimisticSnapshotSupply'
  | 'proposal__queueBlock'
  | 'proposal__queueTime'
  | 'proposal__queueTxnHash'
  | 'proposal__quorumVotes'
  | 'proposal__state'
  | 'proposal__timelockId'
  | 'proposal__tokenHoldersAtStart'
  | 'proposal__totalDelegateVotes'
  | 'proposal__totalWeightedVotes'
  | 'proposal__txnHash'
  | 'proposal__vetoThreshold'
  | 'proposal__vetoThresholdVotes'
  | 'proposal__voteEnd'
  | 'proposal__voteStart'
  | 'timestamp'
  | 'totalWeightedVotes';

export type Vote_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Vote_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  blockTime?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimeId?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_contains?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_ends_with?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_gt?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_gte?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  blockTimeId_lt?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_lte?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_not?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_not_contains?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  blockTimeId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_starts_with?: InputMaybe<Scalars['String']['input']>;
  blockTimeId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  choice?: InputMaybe<VoteChoice>;
  choice_in?: InputMaybe<Array<VoteChoice>>;
  choice_not?: InputMaybe<VoteChoice>;
  choice_not_in?: InputMaybe<Array<VoteChoice>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Vote_Filter>>>;
  proposal?: InputMaybe<Scalars['String']['input']>;
  proposal_?: InputMaybe<Proposal_Filter>;
  proposal_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_gt?: InputMaybe<Scalars['String']['input']>;
  proposal_gte?: InputMaybe<Scalars['String']['input']>;
  proposal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_lt?: InputMaybe<Scalars['String']['input']>;
  proposal_lte?: InputMaybe<Scalars['String']['input']>;
  proposal_not?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  reason_contains?: InputMaybe<Scalars['String']['input']>;
  reason_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_gt?: InputMaybe<Scalars['String']['input']>;
  reason_gte?: InputMaybe<Scalars['String']['input']>;
  reason_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_lt?: InputMaybe<Scalars['String']['input']>;
  reason_lte?: InputMaybe<Scalars['String']['input']>;
  reason_not?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_gt?: InputMaybe<Scalars['String']['input']>;
  txnHash_gte?: InputMaybe<Scalars['String']['input']>;
  txnHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_lt?: InputMaybe<Scalars['String']['input']>;
  txnHash_lte?: InputMaybe<Scalars['String']['input']>;
  txnHash_not?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txnHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  txnHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter?: InputMaybe<Scalars['String']['input']>;
  voter_?: InputMaybe<Delegate_Filter>;
  voter_contains?: InputMaybe<Scalars['String']['input']>;
  voter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_gt?: InputMaybe<Scalars['String']['input']>;
  voter_gte?: InputMaybe<Scalars['String']['input']>;
  voter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_lt?: InputMaybe<Scalars['String']['input']>;
  voter_lte?: InputMaybe<Scalars['String']['input']>;
  voter_not?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['BigInt']['input']>;
  weight_gt?: InputMaybe<Scalars['BigInt']['input']>;
  weight_gte?: InputMaybe<Scalars['BigInt']['input']>;
  weight_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weight_lt?: InputMaybe<Scalars['BigInt']['input']>;
  weight_lte?: InputMaybe<Scalars['BigInt']['input']>;
  weight_not?: InputMaybe<Scalars['BigInt']['input']>;
  weight_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Vote_OrderBy =
  | 'block'
  | 'blockTime'
  | 'blockTimeId'
  | 'choice'
  | 'id'
  | 'logIndex'
  | 'proposal'
  | 'proposal__abstainDelegateVotes'
  | 'proposal__abstainWeightedVotes'
  | 'proposal__againstDelegateVotes'
  | 'proposal__againstWeightedVotes'
  | 'proposal__cancellationBlock'
  | 'proposal__cancellationTime'
  | 'proposal__cancellationTxnHash'
  | 'proposal__creationBlock'
  | 'proposal__creationTime'
  | 'proposal__delegatesAtStart'
  | 'proposal__description'
  | 'proposal__executionBlock'
  | 'proposal__executionETA'
  | 'proposal__executionTime'
  | 'proposal__executionTxnHash'
  | 'proposal__forDelegateVotes'
  | 'proposal__forWeightedVotes'
  | 'proposal__id'
  | 'proposal__isOptimistic'
  | 'proposal__optimisticSnapshot'
  | 'proposal__optimisticSnapshotSupply'
  | 'proposal__queueBlock'
  | 'proposal__queueTime'
  | 'proposal__queueTxnHash'
  | 'proposal__quorumVotes'
  | 'proposal__state'
  | 'proposal__timelockId'
  | 'proposal__tokenHoldersAtStart'
  | 'proposal__totalDelegateVotes'
  | 'proposal__totalWeightedVotes'
  | 'proposal__txnHash'
  | 'proposal__vetoThreshold'
  | 'proposal__vetoThresholdVotes'
  | 'proposal__voteEnd'
  | 'proposal__voteStart'
  | 'reason'
  | 'txnHash'
  | 'voter'
  | 'voter__address'
  | 'voter__delegatedVotes'
  | 'voter__delegatedVotesRaw'
  | 'voter__hasBeenOptimisticDelegate'
  | 'voter__hasBeenStandardDelegate'
  | 'voter__id'
  | 'voter__numberOptimisticVotes'
  | 'voter__numberVotes'
  | 'voter__optimisticDelegatedVotes'
  | 'voter__optimisticDelegatedVotesRaw'
  | 'voter__optimisticTokenHoldersRepresentedAmount'
  | 'voter__tokenHoldersRepresentedAmount'
  | 'weight';

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type GetIndexDtfQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_Height>;
}>;


export type GetIndexDtfQuery = { dtf?: { id: string, proxyAdmin: string, timestamp: string, deployer: string, ownerAddress: string, admins: Array<string>, mintingFee: string, tvlFee: string, annualizedTvlFee: string, mandate: string, auctionDelay: string, auctionLength: string, auctionApprovers: Array<string>, auctionLaunchers: Array<string>, brandManagers: Array<string>, totalRevenue: string, protocolRevenue: string, governanceRevenue: string, externalRevenue: string, feeRecipients: string, bidsEnabled?: boolean | null, trustedFillerRegistry?: string | null, trustedFillerEnabled?: boolean | null, weightControl: boolean, priceControl: number, legacyAdmins: Array<string>, legacyAuctionApprovers: Array<string>, ownerGovernance?: { id: string, name: string, version: string, votingDelay: string, votingPeriod: string, proposalThreshold: string, quorumVotes?: string | null, quorumNumerator?: string | null, quorumDenominator?: string | null, isOptimistic?: boolean | null, optimisticVetoDelay?: string | null, optimisticVetoPeriod?: string | null, optimisticVetoThreshold?: string | null, optimisticProposalThrottleCapacity?: string | null, optimisticSelectorRegistry?: string | null, optimisticProposers?: Array<string> | null, timelock: { id: string, guardians: Array<string>, optimisticProposers?: Array<string> | null, executionDelay: string, type: string } } | null, tradingGovernance?: { id: string, name: string, version: string, votingDelay: string, votingPeriod: string, proposalThreshold: string, quorumVotes?: string | null, quorumNumerator?: string | null, quorumDenominator?: string | null, isOptimistic?: boolean | null, optimisticVetoDelay?: string | null, optimisticVetoPeriod?: string | null, optimisticVetoThreshold?: string | null, optimisticProposalThrottleCapacity?: string | null, optimisticSelectorRegistry?: string | null, optimisticProposers?: Array<string> | null, timelock: { id: string, guardians: Array<string>, optimisticProposers?: Array<string> | null, executionDelay: string, type: string } } | null, token: { id: string, address: string, name: string, symbol: string, decimals: number, totalSupply: string, currentHolderCount: string, cumulativeHolderCount: string, transferCount: string, mintCount: string, burnCount: string, totalBurned: string, totalMinted: string }, stToken?: { id: string, currentDelegates: string, totalDelegates: string, delegatedVotesRaw: string, currentOptimisticDelegates: string, totalOptimisticDelegates: string, optimisticDelegatedVotesRaw: string, legacyGovernance: Array<string>, token: { id: string, address: string, name: string, symbol: string, decimals: number, totalSupply: string, currentHolderCount: string, cumulativeHolderCount: string, transferCount: string, mintCount: string, burnCount: string, totalBurned: string, totalMinted: string }, underlying?: { name: string, symbol: string, address: string, decimals: number } | null, governance?: { id: string, name: string, version: string, votingDelay: string, votingPeriod: string, proposalThreshold: string, quorumVotes?: string | null, quorumNumerator?: string | null, quorumDenominator?: string | null, isOptimistic?: boolean | null, optimisticVetoDelay?: string | null, optimisticVetoPeriod?: string | null, optimisticVetoThreshold?: string | null, optimisticProposalThrottleCapacity?: string | null, optimisticSelectorRegistry?: string | null, optimisticProposers?: Array<string> | null, timelock: { id: string, guardians: Array<string>, optimisticProposers?: Array<string> | null, executionDelay: string, type: string } } | null, rewards: Array<{ rewardToken: { address: string, name: string, symbol: string, decimals: number } }> } | null } | null };

export type GetIndexDtfProposalsQueryVariables = Exact<{
  governanceIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetIndexDtfProposalsQuery = { governances: Array<{ id: string, proposalCount: string, proposals: Array<{ id: string, description: string, creationTime: string, state: ProposalState, isOptimistic?: boolean | null, vetoThreshold?: string | null, vetoThresholdVotes?: string | null, optimisticSnapshot?: string | null, optimisticSnapshotSupply?: string | null, forWeightedVotes: string, abstainWeightedVotes: string, againstWeightedVotes: string, executionETA?: string | null, executionTime?: string | null, quorumVotes: string, voteStart: string, voteEnd: string, executionBlock?: string | null, creationBlock: string, proposer: { address: string }, governance: { id: string, token: { id: string }, timelock: { id: string } } }> }> };

export type GetAllIndexDtfProposalsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Proposal_Filter>;
}>;


export type GetAllIndexDtfProposalsQuery = { proposals: Array<{ id: string, description: string, creationTime: string, state: ProposalState, isOptimistic?: boolean | null, vetoThreshold?: string | null, vetoThresholdVotes?: string | null, optimisticSnapshot?: string | null, optimisticSnapshotSupply?: string | null, forWeightedVotes: string, abstainWeightedVotes: string, againstWeightedVotes: string, executionETA?: string | null, executionTime?: string | null, quorumVotes: string, voteStart: string, voteEnd: string, executionBlock?: string | null, creationBlock: string, proposer: { address: string }, governance: { id: string, token: { id: string }, timelock: { id: string } } }> };

export type GetIndexDtfProposalGovernanceAddressesQueryVariables = Exact<{
  dtfId: Scalars['ID']['input'];
}>;


export type GetIndexDtfProposalGovernanceAddressesQuery = { dtf?: { legacyAdmins: Array<string>, legacyAuctionApprovers: Array<string>, ownerGovernance?: { id: string } | null, tradingGovernance?: { id: string } | null, stToken?: { legacyGovernance: Array<string>, governance?: { id: string } | null } | null } | null };

export type IndexDtfProposalContractContextFragment = { id: string, proxyAdmin: string, legacyAdmins: Array<string>, legacyAuctionApprovers: Array<string>, ownerGovernance?: { id: string, optimisticSelectorRegistry?: string | null, timelock: { id: string } } | null, tradingGovernance?: { id: string, optimisticSelectorRegistry?: string | null, timelock: { id: string } } | null, stToken?: { id: string, legacyGovernance: Array<string>, governance?: { id: string, optimisticSelectorRegistry?: string | null, timelock: { id: string } } | null } | null };

export type GetIndexDtfProposalQueryVariables = Exact<{
  proposalId: Scalars['ID']['input'];
  dtfId: Scalars['ID']['input'];
}>;


export type GetIndexDtfProposalQuery = { dtf?: { id: string, proxyAdmin: string, legacyAdmins: Array<string>, legacyAuctionApprovers: Array<string>, ownerGovernance?: { id: string, optimisticSelectorRegistry?: string | null, timelock: { id: string } } | null, tradingGovernance?: { id: string, optimisticSelectorRegistry?: string | null, timelock: { id: string } } | null, stToken?: { id: string, legacyGovernance: Array<string>, governance?: { id: string, optimisticSelectorRegistry?: string | null, timelock: { id: string } } | null } | null } | null, proposal?: { id: string, txnHash: string, timelockId?: string | null, description: string, creationTime: string, voteStart: string, voteEnd: string, queueBlock?: string | null, queueTxnHash?: string | null, queueTime?: string | null, state: ProposalState, isOptimistic?: boolean | null, vetoThreshold?: string | null, vetoThresholdVotes?: string | null, optimisticSnapshot?: string | null, optimisticSnapshotSupply?: string | null, executionETA?: string | null, executionTime?: string | null, executionBlock?: string | null, creationBlock: string, cancellationTime?: string | null, calldatas?: Array<string> | null, targets?: Array<string> | null, forWeightedVotes: string, againstWeightedVotes: string, abstainWeightedVotes: string, quorumVotes: string, forDelegateVotes: string, abstainDelegateVotes: string, againstDelegateVotes: string, executionTxnHash?: string | null, proposer: { address: string }, votes: Array<{ choice: VoteChoice, weight: string, voter: { address: string } }>, governance: { id: string, optimisticSelectorRegistry?: string | null, token: { id: string }, timelock: { id: string, type: string } } } | null };

export type GetIndexDtfProposalChallengeQueryVariables = Exact<{
  governanceId: Scalars['String']['input'];
  description: Scalars['String']['input'];
  creationBlock: Scalars['BigInt']['input'];
}>;


export type GetIndexDtfProposalChallengeQuery = { proposals: Array<{ id: string }> };

export type GetIndexDtfProposalVotingSnapshotQueryVariables = Exact<{
  proposalId: Scalars['ID']['input'];
}>;


export type GetIndexDtfProposalVotingSnapshotQuery = { proposal?: { id: string, state: ProposalState, isOptimistic?: boolean | null, vetoThreshold?: string | null, vetoThresholdVotes?: string | null, optimisticSnapshot?: string | null, optimisticSnapshotSupply?: string | null, voteStart: string, voteEnd: string, forWeightedVotes: string, againstWeightedVotes: string, abstainWeightedVotes: string, quorumVotes: string, governance: { id: string, token: { id: string } }, votes: Array<{ choice: VoteChoice, weight: string, voter: { address: string } }> } | null };

export type GetIndexDtfDelegatesQueryVariables = Exact<{
  stToken: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetIndexDtfDelegatesQuery = { stakingToken?: { id: string, totalDelegates: string, currentDelegates: string, totalOptimisticDelegates: string, currentOptimisticDelegates: string, token: { totalSupply: string }, delegates: Array<{ address: string, delegatedVotesRaw: string, optimisticDelegatedVotesRaw: string, numberVotes: number, numberOptimisticVotes: number, hasBeenStandardDelegate: boolean, hasBeenOptimisticDelegate: boolean, tokenHoldersRepresentedAmount: number, optimisticTokenHoldersRepresentedAmount: number }> } | null };

export type GetIndexDtfRebalancesQueryVariables = Exact<{
  dtf: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetIndexDtfRebalancesQuery = { rebalances: Array<{ id: string, nonce: string, priceControl: string, weightLowLimit: Array<string>, weightSpotLimit: Array<string>, weightHighLimit: Array<string>, rebalanceLowLimit: string, rebalanceSpotLimit: string, rebalanceHighLimit: string, priceLowLimit: Array<string>, priceHighLimit: Array<string>, restrictedUntil: string, availableUntil: string, transactionHash: string, blockNumber: string, timestamp: string, tokens: Array<{ address: string, name: string, symbol: string, decimals: number }> }> };

export type GetIndexDtfRebalanceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetIndexDtfRebalanceQuery = { rebalance?: { id: string, nonce: string, priceControl: string, weightLowLimit: Array<string>, weightSpotLimit: Array<string>, weightHighLimit: Array<string>, rebalanceLowLimit: string, rebalanceSpotLimit: string, rebalanceHighLimit: string, priceLowLimit: Array<string>, priceHighLimit: Array<string>, restrictedUntil: string, availableUntil: string, transactionHash: string, blockNumber: string, timestamp: string, tokens: Array<{ address: string, name: string, symbol: string, decimals: number }> } | null };

export type GetIndexDtfRebalanceByNonceQueryVariables = Exact<{
  dtf: Scalars['String']['input'];
  nonce: Scalars['BigInt']['input'];
}>;


export type GetIndexDtfRebalanceByNonceQuery = { rebalances: Array<{ id: string, nonce: string, priceControl: string, weightLowLimit: Array<string>, weightSpotLimit: Array<string>, weightHighLimit: Array<string>, rebalanceLowLimit: string, rebalanceSpotLimit: string, rebalanceHighLimit: string, priceLowLimit: Array<string>, priceHighLimit: Array<string>, restrictedUntil: string, availableUntil: string, transactionHash: string, blockNumber: string, timestamp: string, tokens: Array<{ address: string, name: string, symbol: string, decimals: number }> }> };

export type GetIndexDtfTransactionsQueryVariables = Exact<{
  dtf: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetIndexDtfTransactionsQuery = { transferEvents: Array<{ id: string, hash: string, amount: string, timestamp: string, type: string, to?: { id: string } | null, from?: { id: string } | null }> };

export type GetIndexDtfRebalanceAuctionsQueryVariables = Exact<{
  rebalanceId: Scalars['String']['input'];
}>;


export type GetIndexDtfRebalanceAuctionsQuery = { auctions: Array<{ id: string, weightLowLimit: Array<string>, weightSpotLimit: Array<string>, weightHighLimit: Array<string>, rebalanceLowLimit: string, rebalanceSpotLimit: string, rebalanceHighLimit: string, priceLowLimit: Array<string>, priceHighLimit: Array<string>, startTime: string, endTime: string, blockNumber: string, timestamp: string, transactionHash: string, tokens: Array<{ address: string, name: string, symbol: string, decimals: number }>, bids: Array<{ id: string, bidder: string, sellAmount: string, buyAmount: string, blockNumber: string, timestamp: string, transactionHash: string, sellToken: { address: string, name: string, symbol: string, decimals: number }, buyToken: { address: string, name: string, symbol: string, decimals: number } }> }> };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const IndexDtfProposalContractContextFragmentDoc = new TypedDocumentString(`
    fragment IndexDtfProposalContractContext on DTF {
  id
  proxyAdmin
  legacyAdmins
  legacyAuctionApprovers
  ownerGovernance {
    id
    optimisticSelectorRegistry
    timelock {
      id
    }
  }
  tradingGovernance {
    id
    optimisticSelectorRegistry
    timelock {
      id
    }
  }
  stToken {
    id
    legacyGovernance
    governance {
      id
      optimisticSelectorRegistry
      timelock {
        id
      }
    }
  }
}
    `, {"fragmentName":"IndexDtfProposalContractContext"}) as unknown as TypedDocumentString<IndexDtfProposalContractContextFragment, unknown>;
export const GetIndexDtfDocument = new TypedDocumentString(`
    query GetIndexDTF($id: ID!, $block: Block_height) {
  dtf(id: $id, block: $block) {
    id
    proxyAdmin
    timestamp
    deployer
    ownerAddress
    admins
    mintingFee
    tvlFee
    annualizedTvlFee
    mandate
    auctionDelay
    auctionLength
    auctionApprovers
    auctionLaunchers
    brandManagers
    totalRevenue
    protocolRevenue
    governanceRevenue
    externalRevenue
    feeRecipients
    bidsEnabled
    trustedFillerRegistry
    trustedFillerEnabled
    weightControl
    priceControl
    ownerGovernance {
      id
      name
      version
      votingDelay
      votingPeriod
      proposalThreshold
      quorumVotes
      quorumNumerator
      quorumDenominator
      isOptimistic
      optimisticVetoDelay
      optimisticVetoPeriod
      optimisticVetoThreshold
      optimisticProposalThrottleCapacity
      optimisticSelectorRegistry
      optimisticProposers
      timelock {
        id
        guardians
        optimisticProposers
        executionDelay
        type
      }
    }
    legacyAdmins
    tradingGovernance {
      id
      name
      version
      votingDelay
      votingPeriod
      proposalThreshold
      quorumVotes
      quorumNumerator
      quorumDenominator
      isOptimistic
      optimisticVetoDelay
      optimisticVetoPeriod
      optimisticVetoThreshold
      optimisticProposalThrottleCapacity
      optimisticSelectorRegistry
      optimisticProposers
      timelock {
        id
        guardians
        optimisticProposers
        executionDelay
        type
      }
    }
    legacyAuctionApprovers
    token {
      id
      address
      name
      symbol
      decimals
      totalSupply
      currentHolderCount
      cumulativeHolderCount
      transferCount
      mintCount
      burnCount
      totalBurned
      totalMinted
    }
    stToken {
      id
      token {
        id
        address
        name
        symbol
        decimals
        totalSupply
        currentHolderCount
        cumulativeHolderCount
        transferCount
        mintCount
        burnCount
        totalBurned
        totalMinted
      }
      currentDelegates
      totalDelegates
      delegatedVotesRaw
      currentOptimisticDelegates
      totalOptimisticDelegates
      optimisticDelegatedVotesRaw
      underlying {
        name
        symbol
        address
        decimals
      }
      governance {
        id
        name
        version
        votingDelay
        votingPeriod
        proposalThreshold
        quorumVotes
        quorumNumerator
        quorumDenominator
        isOptimistic
        optimisticVetoDelay
        optimisticVetoPeriod
        optimisticVetoThreshold
        optimisticProposalThrottleCapacity
        optimisticSelectorRegistry
        optimisticProposers
        timelock {
          id
          guardians
          optimisticProposers
          executionDelay
          type
        }
      }
      legacyGovernance
      rewards(where: {active: true}) {
        rewardToken {
          address
          name
          symbol
          decimals
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfQuery, GetIndexDtfQueryVariables>;
export const GetIndexDtfProposalsDocument = new TypedDocumentString(`
    query GetIndexDtfProposals($governanceIds: [ID!]!, $limit: Int = 100) {
  governances(where: {id_in: $governanceIds}) {
    id
    proposals(first: $limit, orderBy: creationTime, orderDirection: desc) {
      id
      description
      creationTime
      state
      isOptimistic
      vetoThreshold
      vetoThresholdVotes
      optimisticSnapshot
      optimisticSnapshotSupply
      forWeightedVotes
      abstainWeightedVotes
      againstWeightedVotes
      executionETA
      executionTime
      quorumVotes
      voteStart
      voteEnd
      executionBlock
      creationBlock
      proposer {
        address
      }
      governance {
        id
        token {
          id
        }
        timelock {
          id
        }
      }
    }
    proposalCount
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfProposalsQuery, GetIndexDtfProposalsQueryVariables>;
export const GetAllIndexDtfProposalsDocument = new TypedDocumentString(`
    query GetAllIndexDtfProposals($limit: Int = 100, $offset: Int = 0, $where: Proposal_filter) {
  proposals(
    first: $limit
    skip: $offset
    orderBy: creationTime
    orderDirection: desc
    where: $where
  ) {
    id
    description
    creationTime
    state
    isOptimistic
    vetoThreshold
    vetoThresholdVotes
    optimisticSnapshot
    optimisticSnapshotSupply
    forWeightedVotes
    abstainWeightedVotes
    againstWeightedVotes
    executionETA
    executionTime
    quorumVotes
    voteStart
    voteEnd
    executionBlock
    creationBlock
    proposer {
      address
    }
    governance {
      id
      token {
        id
      }
      timelock {
        id
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetAllIndexDtfProposalsQuery, GetAllIndexDtfProposalsQueryVariables>;
export const GetIndexDtfProposalGovernanceAddressesDocument = new TypedDocumentString(`
    query GetIndexDtfProposalGovernanceAddresses($dtfId: ID!) {
  dtf(id: $dtfId) {
    ownerGovernance {
      id
    }
    tradingGovernance {
      id
    }
    legacyAdmins
    legacyAuctionApprovers
    stToken {
      governance {
        id
      }
      legacyGovernance
    }
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfProposalGovernanceAddressesQuery, GetIndexDtfProposalGovernanceAddressesQueryVariables>;
export const GetIndexDtfProposalDocument = new TypedDocumentString(`
    query GetIndexDtfProposal($proposalId: ID!, $dtfId: ID!) {
  dtf(id: $dtfId) {
    ...IndexDtfProposalContractContext
  }
  proposal(id: $proposalId) {
    id
    txnHash
    timelockId
    description
    creationTime
    voteStart
    voteEnd
    queueBlock
    queueTxnHash
    queueTime
    state
    isOptimistic
    vetoThreshold
    vetoThresholdVotes
    optimisticSnapshot
    optimisticSnapshotSupply
    executionETA
    executionTime
    executionBlock
    creationBlock
    cancellationTime
    calldatas
    targets
    proposer {
      address
    }
    votes {
      choice
      voter {
        address
      }
      weight
    }
    forWeightedVotes
    againstWeightedVotes
    abstainWeightedVotes
    quorumVotes
    forDelegateVotes
    abstainDelegateVotes
    againstDelegateVotes
    executionTxnHash
    governance {
      id
      optimisticSelectorRegistry
      token {
        id
      }
      timelock {
        id
        type
      }
    }
  }
}
    fragment IndexDtfProposalContractContext on DTF {
  id
  proxyAdmin
  legacyAdmins
  legacyAuctionApprovers
  ownerGovernance {
    id
    optimisticSelectorRegistry
    timelock {
      id
    }
  }
  tradingGovernance {
    id
    optimisticSelectorRegistry
    timelock {
      id
    }
  }
  stToken {
    id
    legacyGovernance
    governance {
      id
      optimisticSelectorRegistry
      timelock {
        id
      }
    }
  }
}`) as unknown as TypedDocumentString<GetIndexDtfProposalQuery, GetIndexDtfProposalQueryVariables>;
export const GetIndexDtfProposalChallengeDocument = new TypedDocumentString(`
    query GetIndexDtfProposalChallenge($governanceId: String!, $description: String!, $creationBlock: BigInt!) {
  proposals(
    first: 1
    orderBy: creationBlock
    orderDirection: desc
    where: {governance: $governanceId, description: $description, creationBlock_lte: $creationBlock, isOptimistic: true}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfProposalChallengeQuery, GetIndexDtfProposalChallengeQueryVariables>;
export const GetIndexDtfProposalVotingSnapshotDocument = new TypedDocumentString(`
    query GetIndexDtfProposalVotingSnapshot($proposalId: ID!) {
  proposal(id: $proposalId) {
    id
    state
    isOptimistic
    vetoThreshold
    vetoThresholdVotes
    optimisticSnapshot
    optimisticSnapshotSupply
    voteStart
    voteEnd
    forWeightedVotes
    againstWeightedVotes
    abstainWeightedVotes
    quorumVotes
    governance {
      id
      token {
        id
      }
    }
    votes {
      choice
      voter {
        address
      }
      weight
    }
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfProposalVotingSnapshotQuery, GetIndexDtfProposalVotingSnapshotQueryVariables>;
export const GetIndexDtfDelegatesDocument = new TypedDocumentString(`
    query GetIndexDtfDelegates($stToken: ID!, $limit: Int = 10) {
  stakingToken(id: $stToken) {
    id
    totalDelegates
    currentDelegates
    totalOptimisticDelegates
    currentOptimisticDelegates
    token {
      totalSupply
    }
    delegates(
      first: $limit
      orderBy: delegatedVotes
      orderDirection: desc
      where: {or: [{address_not: "0x0000000000000000000000000000000000000000", delegatedVotesRaw_gt: "0"}, {address_not: "0x0000000000000000000000000000000000000000", optimisticDelegatedVotesRaw_gt: "0"}]}
    ) {
      address
      delegatedVotesRaw
      optimisticDelegatedVotesRaw
      numberVotes
      numberOptimisticVotes
      hasBeenStandardDelegate
      hasBeenOptimisticDelegate
      tokenHoldersRepresentedAmount
      optimisticTokenHoldersRepresentedAmount
    }
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfDelegatesQuery, GetIndexDtfDelegatesQueryVariables>;
export const GetIndexDtfRebalancesDocument = new TypedDocumentString(`
    query GetIndexDtfRebalances($dtf: String!, $limit: Int = 100, $offset: Int = 0) {
  rebalances(
    where: {dtf: $dtf}
    orderBy: timestamp
    orderDirection: desc
    first: $limit
    skip: $offset
  ) {
    id
    nonce
    tokens {
      address
      name
      symbol
      decimals
    }
    priceControl
    weightLowLimit
    weightSpotLimit
    weightHighLimit
    rebalanceLowLimit
    rebalanceSpotLimit
    rebalanceHighLimit
    priceLowLimit
    priceHighLimit
    restrictedUntil
    availableUntil
    transactionHash
    blockNumber
    timestamp
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfRebalancesQuery, GetIndexDtfRebalancesQueryVariables>;
export const GetIndexDtfRebalanceDocument = new TypedDocumentString(`
    query GetIndexDtfRebalance($id: ID!) {
  rebalance(id: $id) {
    id
    nonce
    tokens {
      address
      name
      symbol
      decimals
    }
    priceControl
    weightLowLimit
    weightSpotLimit
    weightHighLimit
    rebalanceLowLimit
    rebalanceSpotLimit
    rebalanceHighLimit
    priceLowLimit
    priceHighLimit
    restrictedUntil
    availableUntil
    transactionHash
    blockNumber
    timestamp
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfRebalanceQuery, GetIndexDtfRebalanceQueryVariables>;
export const GetIndexDtfRebalanceByNonceDocument = new TypedDocumentString(`
    query GetIndexDtfRebalanceByNonce($dtf: String!, $nonce: BigInt!) {
  rebalances(where: {dtf: $dtf, nonce: $nonce}, first: 1) {
    id
    nonce
    tokens {
      address
      name
      symbol
      decimals
    }
    priceControl
    weightLowLimit
    weightSpotLimit
    weightHighLimit
    rebalanceLowLimit
    rebalanceSpotLimit
    rebalanceHighLimit
    priceLowLimit
    priceHighLimit
    restrictedUntil
    availableUntil
    transactionHash
    blockNumber
    timestamp
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfRebalanceByNonceQuery, GetIndexDtfRebalanceByNonceQueryVariables>;
export const GetIndexDtfTransactionsDocument = new TypedDocumentString(`
    query GetIndexDtfTransactions($dtf: String!, $limit: Int = 50, $offset: Int = 0) {
  transferEvents(
    where: {token: $dtf, type_not: "TRANSFER"}
    orderBy: timestamp
    orderDirection: desc
    first: $limit
    skip: $offset
  ) {
    id
    hash
    amount
    timestamp
    to {
      id
    }
    from {
      id
    }
    type
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfTransactionsQuery, GetIndexDtfTransactionsQueryVariables>;
export const GetIndexDtfRebalanceAuctionsDocument = new TypedDocumentString(`
    query GetIndexDtfRebalanceAuctions($rebalanceId: String!) {
  auctions(where: {rebalance: $rebalanceId}) {
    id
    tokens {
      address
      name
      symbol
      decimals
    }
    weightLowLimit
    weightSpotLimit
    weightHighLimit
    rebalanceLowLimit
    rebalanceSpotLimit
    rebalanceHighLimit
    priceLowLimit
    priceHighLimit
    startTime
    endTime
    blockNumber
    timestamp
    transactionHash
    bids {
      id
      bidder
      sellToken {
        address
        name
        symbol
        decimals
      }
      buyToken {
        address
        name
        symbol
        decimals
      }
      sellAmount
      buyAmount
      blockNumber
      timestamp
      transactionHash
    }
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfRebalanceAuctionsQuery, GetIndexDtfRebalanceAuctionsQueryVariables>;