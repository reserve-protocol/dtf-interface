/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
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
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  /** 8 bytes signed integer */
  Int8: { input: any; output: any; }
  /** A string representation of microseconds UNIX timestamp (16 digits) */
  Timestamp: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  /**  Token balances that this account holds  */
  balances: Array<AccountBalance>;
  /**  Token balances snapshot that this account holds  */
  balancesSnapshot: Array<AccountBalanceDailySnapshot>;
  /**  Address of the account  */
  id: Scalars['ID']['output'];
  /**  rTokens related to this account  */
  rTokens: Array<AccountRToken>;
  /**  rToken snapshots that this account holds  */
  rTokensSnapshot: Array<AccountRTokenDailySnapshot>;
  /**  rToken related transactions from this account  */
  records: Array<Entry>;
};


export type AccountBalancesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccountBalance_Filter>;
};


export type AccountBalancesSnapshotArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountBalanceDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccountBalanceDailySnapshot_Filter>;
};


export type AccountRTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountRToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccountRToken_Filter>;
};


export type AccountRTokensSnapshotArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountRTokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccountRTokenDailySnapshot_Filter>;
};


export type AccountRecordsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Entry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Entry_Filter>;
};

export type AccountBalance = {
  __typename?: 'AccountBalance';
  /**  Account address  */
  account: Account;
  /**  Current account balance  */
  amount: Scalars['BigDecimal']['output'];
  /**  Block number in which the balance was last modified  */
  blockNumber: Scalars['BigInt']['output'];
  /**  { Address Of the Account }-{ Address of the Token } */
  id: Scalars['ID']['output'];
  /**  Timestamp in which the balance was last modified  */
  timestamp: Scalars['BigInt']['output'];
  /**  Token address  */
  token: Token;
  /**  Transfer count  */
  transferCount: Scalars['Int']['output'];
};

export type AccountBalanceDailySnapshot = {
  __typename?: 'AccountBalanceDailySnapshot';
  /**  Account address  */
  account: Account;
  /**  Current account balance  */
  amount: Scalars['BigDecimal']['output'];
  /**  Account balance USD  */
  amountUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Block number in which the balance was last modified  */
  blockNumber: Scalars['BigInt']['output'];
  /**  { Address Of the Account }-{ Address of the Token }-{ # of hours since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Timestamp in which the balance was last modified  */
  timestamp: Scalars['BigInt']['output'];
  /**  Token address  */
  token: Token;
  /**  Transfer count  */
  transferCount: Scalars['Int']['output'];
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
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  transferCount?: InputMaybe<Scalars['Int']['input']>;
  transferCount_gt?: InputMaybe<Scalars['Int']['input']>;
  transferCount_gte?: InputMaybe<Scalars['Int']['input']>;
  transferCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  transferCount_lt?: InputMaybe<Scalars['Int']['input']>;
  transferCount_lte?: InputMaybe<Scalars['Int']['input']>;
  transferCount_not?: InputMaybe<Scalars['Int']['input']>;
  transferCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum AccountBalanceDailySnapshot_OrderBy {
  Account = 'account',
  AccountId = 'account__id',
  Amount = 'amount',
  AmountUsd = 'amountUSD',
  BlockNumber = 'blockNumber',
  Id = 'id',
  Timestamp = 'timestamp',
  Token = 'token',
  TokenBasketRate = 'token__basketRate',
  TokenBurnCount = 'token__burnCount',
  TokenCumulativeVolume = 'token__cumulativeVolume',
  TokenDecimals = 'token__decimals',
  TokenHolderCount = 'token__holderCount',
  TokenId = 'token__id',
  TokenLastMarketCapUsd = 'token__lastMarketCapUSD',
  TokenLastPriceTimestamp = 'token__lastPriceTimestamp',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenMintCount = 'token__mintCount',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  TokenTotalBurned = 'token__totalBurned',
  TokenTotalMinted = 'token__totalMinted',
  TokenTotalSupply = 'token__totalSupply',
  TokenTransferCount = 'token__transferCount',
  TokenUserCount = 'token__userCount',
  TransferCount = 'transferCount'
}

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
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<AccountBalance_Filter>>>;
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
  transferCount?: InputMaybe<Scalars['Int']['input']>;
  transferCount_gt?: InputMaybe<Scalars['Int']['input']>;
  transferCount_gte?: InputMaybe<Scalars['Int']['input']>;
  transferCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  transferCount_lt?: InputMaybe<Scalars['Int']['input']>;
  transferCount_lte?: InputMaybe<Scalars['Int']['input']>;
  transferCount_not?: InputMaybe<Scalars['Int']['input']>;
  transferCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum AccountBalance_OrderBy {
  Account = 'account',
  AccountId = 'account__id',
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  Id = 'id',
  Timestamp = 'timestamp',
  Token = 'token',
  TokenBasketRate = 'token__basketRate',
  TokenBurnCount = 'token__burnCount',
  TokenCumulativeVolume = 'token__cumulativeVolume',
  TokenDecimals = 'token__decimals',
  TokenHolderCount = 'token__holderCount',
  TokenId = 'token__id',
  TokenLastMarketCapUsd = 'token__lastMarketCapUSD',
  TokenLastPriceTimestamp = 'token__lastPriceTimestamp',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenMintCount = 'token__mintCount',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  TokenTotalBurned = 'token__totalBurned',
  TokenTotalMinted = 'token__totalMinted',
  TokenTotalSupply = 'token__totalSupply',
  TokenTransferCount = 'token__transferCount',
  TokenUserCount = 'token__userCount',
  TransferCount = 'transferCount'
}

export type AccountRToken = {
  __typename?: 'AccountRToken';
  /**  Account address  */
  account: Account;
  /**  Token balance  */
  balance: AccountBalance;
  /**  Block number in which the stake was last modified  */
  blockNumber: Scalars['BigInt']['output'];
  governance: Array<TokenHolder>;
  /**  { Address Of the Account }-{ Address of the rToken }  */
  id: Scalars['ID']['output'];
  /**  Pending stRSR to be unstaked  */
  pendingUnstake: Scalars['BigInt']['output'];
  /**  rToken address  */
  rToken: RToken;
  /**  Records  */
  records: Array<AccountStakeRecord>;
  /**  Stake stRSR balance  */
  stake: Scalars['BigDecimal']['output'];
  /**  Timestamp in which the stake was last modified  */
  timestamp: Scalars['BigInt']['output'];
  /**  Total historical stake RSR  */
  totalRSRStaked: Scalars['BigInt']['output'];
  /**  Total Unstaked  */
  totalRSRUnstaked: Scalars['BigInt']['output'];
  /**  Total staked stRSR  */
  totalStaked: Scalars['BigInt']['output'];
  /**  Total Unstaked stRSR  */
  totalUnstaked: Scalars['BigInt']['output'];
};


export type AccountRTokenGovernanceArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHolder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenHolder_Filter>;
};


export type AccountRTokenRecordsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountStakeRecord_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccountStakeRecord_Filter>;
};

export type AccountRTokenDailySnapshot = {
  __typename?: 'AccountRTokenDailySnapshot';
  /**  Account address  */
  account: Account;
  /**  Token balance snapshot if exists  */
  balance: AccountBalanceDailySnapshot;
  /**  Block number in which the stake was last modified  */
  blockNumber: Scalars['BigInt']['output'];
  /**  { Address Of the Account }-{ Address of the RToken }-{ # of hours since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  rToken address  */
  rToken: RToken;
  /**  Stake stRSR balance  */
  stake: Scalars['BigDecimal']['output'];
  /**  Timestamp in which the stake was last modified  */
  timestamp: Scalars['BigInt']['output'];
  /**  Total historical stake RSR  */
  totalRSRStaked: Scalars['BigInt']['output'];
  /**  Total Unstaked  */
  totalRSRUnstaked: Scalars['BigInt']['output'];
  /**  Total staked stRSR  */
  totalStaked: Scalars['BigInt']['output'];
  /**  Total Unstaked stRSR  */
  totalUnstaked: Scalars['BigInt']['output'];
};

export type AccountRTokenDailySnapshot_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<AccountRTokenDailySnapshot_Filter>>>;
  balance?: InputMaybe<Scalars['String']['input']>;
  balance_?: InputMaybe<AccountBalanceDailySnapshot_Filter>;
  balance_contains?: InputMaybe<Scalars['String']['input']>;
  balance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  balance_ends_with?: InputMaybe<Scalars['String']['input']>;
  balance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balance_gt?: InputMaybe<Scalars['String']['input']>;
  balance_gte?: InputMaybe<Scalars['String']['input']>;
  balance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  balance_lt?: InputMaybe<Scalars['String']['input']>;
  balance_lte?: InputMaybe<Scalars['String']['input']>;
  balance_not?: InputMaybe<Scalars['String']['input']>;
  balance_not_contains?: InputMaybe<Scalars['String']['input']>;
  balance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  balance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  balance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  balance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  balance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balance_starts_with?: InputMaybe<Scalars['String']['input']>;
  balance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  or?: InputMaybe<Array<InputMaybe<AccountRTokenDailySnapshot_Filter>>>;
  rToken?: InputMaybe<Scalars['String']['input']>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stake?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stake_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRSRStaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRSRStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRSRUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRSRUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum AccountRTokenDailySnapshot_OrderBy {
  Account = 'account',
  AccountId = 'account__id',
  Balance = 'balance',
  BalanceAmount = 'balance__amount',
  BalanceAmountUsd = 'balance__amountUSD',
  BalanceBlockNumber = 'balance__blockNumber',
  BalanceId = 'balance__id',
  BalanceTimestamp = 'balance__timestamp',
  BalanceTransferCount = 'balance__transferCount',
  BlockNumber = 'blockNumber',
  Id = 'id',
  RToken = 'rToken',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked',
  Stake = 'stake',
  Timestamp = 'timestamp',
  TotalRsrStaked = 'totalRSRStaked',
  TotalRsrUnstaked = 'totalRSRUnstaked',
  TotalStaked = 'totalStaked',
  TotalUnstaked = 'totalUnstaked'
}

export type AccountRToken_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<AccountRToken_Filter>>>;
  balance?: InputMaybe<Scalars['String']['input']>;
  balance_?: InputMaybe<AccountBalance_Filter>;
  balance_contains?: InputMaybe<Scalars['String']['input']>;
  balance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  balance_ends_with?: InputMaybe<Scalars['String']['input']>;
  balance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balance_gt?: InputMaybe<Scalars['String']['input']>;
  balance_gte?: InputMaybe<Scalars['String']['input']>;
  balance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  balance_lt?: InputMaybe<Scalars['String']['input']>;
  balance_lte?: InputMaybe<Scalars['String']['input']>;
  balance_not?: InputMaybe<Scalars['String']['input']>;
  balance_not_contains?: InputMaybe<Scalars['String']['input']>;
  balance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  balance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  balance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  balance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  balance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balance_starts_with?: InputMaybe<Scalars['String']['input']>;
  balance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  governance_?: InputMaybe<TokenHolder_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AccountRToken_Filter>>>;
  pendingUnstake?: InputMaybe<Scalars['BigInt']['input']>;
  pendingUnstake_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pendingUnstake_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pendingUnstake_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pendingUnstake_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pendingUnstake_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pendingUnstake_not?: InputMaybe<Scalars['BigInt']['input']>;
  pendingUnstake_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rToken?: InputMaybe<Scalars['String']['input']>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  records_?: InputMaybe<AccountStakeRecord_Filter>;
  stake?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stake_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  stake_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRSRStaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRSRStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRSRUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRSRUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRSRUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum AccountRToken_OrderBy {
  Account = 'account',
  AccountId = 'account__id',
  Balance = 'balance',
  BalanceAmount = 'balance__amount',
  BalanceBlockNumber = 'balance__blockNumber',
  BalanceId = 'balance__id',
  BalanceTimestamp = 'balance__timestamp',
  BalanceTransferCount = 'balance__transferCount',
  BlockNumber = 'blockNumber',
  Governance = 'governance',
  Id = 'id',
  PendingUnstake = 'pendingUnstake',
  RToken = 'rToken',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked',
  Records = 'records',
  Stake = 'stake',
  Timestamp = 'timestamp',
  TotalRsrStaked = 'totalRSRStaked',
  TotalRsrUnstaked = 'totalRSRUnstaked',
  TotalStaked = 'totalStaked',
  TotalUnstaked = 'totalUnstaked'
}

export type AccountStakeRecord = {
  __typename?: 'AccountStakeRecord';
  /**  Account related to  */
  account: AccountRToken;
  /**  readable amount  */
  amount: Scalars['BigDecimal']['output'];
  /**  stRSR amount  */
  amountRaw: Scalars['BigInt']['output'];
  /**  Block number  */
  blockNumber: Scalars['BigInt']['output'];
  /**  readable exchange rate  */
  exchangeRate: Scalars['BigDecimal']['output'];
  /**  Exchange rate  */
  exchangeRateRaw: Scalars['BigInt']['output'];
  /**  tx hash  */
  hash: Scalars['String']['output'];
  /**  { Address Of the Account }-{ Address of the rToken }-{ tx hash }  */
  id: Scalars['ID']['output'];
  /**  isStake  */
  isStake: Scalars['Boolean']['output'];
  /**  Readable RSR amount  */
  rsrAmount: Scalars['BigDecimal']['output'];
  /**  RSR amount  */
  rsrAmountRaw: Scalars['BigInt']['output'];
  /**  RSR price  */
  rsrPriceUSD: Scalars['BigDecimal']['output'];
  /**  Timestamp  */
  timestamp: Scalars['BigInt']['output'];
};

export type AccountStakeRecord_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<AccountRToken_Filter>;
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
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountRaw?: InputMaybe<Scalars['BigInt']['input']>;
  amountRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<AccountStakeRecord_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateRaw?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRateRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  exchangeRateRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exchangeRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  exchangeRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  isStake?: InputMaybe<Scalars['Boolean']['input']>;
  isStake_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isStake_not?: InputMaybe<Scalars['Boolean']['input']>;
  isStake_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AccountStakeRecord_Filter>>>;
  rsrAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrAmountRaw?: InputMaybe<Scalars['BigInt']['input']>;
  rsrAmountRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrAmountRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrAmountRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrAmountRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrAmountRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrAmountRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  rsrAmountRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum AccountStakeRecord_OrderBy {
  Account = 'account',
  AccountBlockNumber = 'account__blockNumber',
  AccountId = 'account__id',
  AccountPendingUnstake = 'account__pendingUnstake',
  AccountStake = 'account__stake',
  AccountTimestamp = 'account__timestamp',
  AccountTotalRsrStaked = 'account__totalRSRStaked',
  AccountTotalRsrUnstaked = 'account__totalRSRUnstaked',
  AccountTotalStaked = 'account__totalStaked',
  AccountTotalUnstaked = 'account__totalUnstaked',
  Amount = 'amount',
  AmountRaw = 'amountRaw',
  BlockNumber = 'blockNumber',
  ExchangeRate = 'exchangeRate',
  ExchangeRateRaw = 'exchangeRateRaw',
  Hash = 'hash',
  Id = 'id',
  IsStake = 'isStake',
  RsrAmount = 'rsrAmount',
  RsrAmountRaw = 'rsrAmountRaw',
  RsrPriceUsd = 'rsrPriceUSD',
  Timestamp = 'timestamp'
}

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
  or?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  rTokensSnapshot_?: InputMaybe<AccountRTokenDailySnapshot_Filter>;
  rTokens_?: InputMaybe<AccountRToken_Filter>;
  records_?: InputMaybe<Entry_Filter>;
};

export enum Account_OrderBy {
  Balances = 'balances',
  BalancesSnapshot = 'balancesSnapshot',
  Id = 'id',
  RTokens = 'rTokens',
  RTokensSnapshot = 'rTokensSnapshot',
  Records = 'records'
}

export type ActiveAccount = {
  __typename?: 'ActiveAccount';
  /**  { Address of the account }-{ [Optional] token address }-{ Days since Unix epoch }-{ [Optional] HH: hour of the day }  */
  id: Scalars['ID']['output'];
};

export type ActiveAccount_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ActiveAccount_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ActiveAccount_Filter>>>;
};

export enum ActiveAccount_OrderBy {
  Id = 'id'
}

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Collateral = {
  __typename?: 'Collateral';
  /**  Collateral erc20 address  */
  id: Scalars['ID']['output'];
  /**  Collateral erc20 symbol  */
  symbol: Scalars['String']['output'];
};

export type Collateral_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Collateral_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Collateral_Filter>>>;
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
};

export enum Collateral_OrderBy {
  Id = 'id',
  Symbol = 'symbol'
}

export type Delegate = {
  __typename?: 'Delegate';
  /** Delegate address */
  address: Scalars['String']['output'];
  /** Amount of votes delegated to this delegate to be used on proposal votings expressed as a BigDecimal normalized value */
  delegatedVotes: Scalars['BigDecimal']['output'];
  /** Amount of votes delegated to this delegate to be used on proposal votings expressed in the smallest unit of the token */
  delegatedVotesRaw: Scalars['BigInt']['output'];
  /** Governance this delegate is related to */
  governance: Governance;
  /** A Delegate is any address that has been delegated with voting tokens by a token holder, id is the blockchain address of said delegate */
  id: Scalars['ID']['output'];
  /** Number of proposals voted on */
  numberVotes: Scalars['Int']['output'];
  /** Proposals that the delegate has created */
  proposals: Array<Proposal>;
  /** Token holders that this delegate represents */
  tokenHoldersRepresented: Array<TokenHolder>;
  /** Total token holders that this delegate represents */
  tokenHoldersRepresentedAmount: Scalars['Int']['output'];
  /** Votes that a delegate has made in different proposals */
  votes: Array<Vote>;
};


export type DelegateProposalsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Proposal_Filter>;
};


export type DelegateTokenHoldersRepresentedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHolder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenHolder_Filter>;
};


export type DelegateVotesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Vote_Filter>;
};

export type DelegateChange = {
  __typename?: 'DelegateChange';
  /** Block number of event */
  blockNumber: Scalars['BigInt']['output'];
  /** Block time change happened */
  blockTimestamp: Scalars['BigInt']['output'];
  /** Address for delegate */
  delegate: Scalars['String']['output'];
  /** Address for delegator */
  delegator: Scalars['String']['output'];
  /** Unique entity used to keep track of delegate changes */
  id: Scalars['ID']['output'];
  /** Log index for delegate change */
  logIndex: Scalars['BigInt']['output'];
  /** Address for previous delegate */
  previousDelegate: Scalars['String']['output'];
  /** Token address */
  tokenAddress: Scalars['String']['output'];
  /** Transaction hash of the delegate change event */
  txnHash: Scalars['String']['output'];
};

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

export enum DelegateChange_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Delegate = 'delegate',
  Delegator = 'delegator',
  Id = 'id',
  LogIndex = 'logIndex',
  PreviousDelegate = 'previousDelegate',
  TokenAddress = 'tokenAddress',
  TxnHash = 'txnHash'
}

export type DelegateVotingPowerChange = {
  __typename?: 'DelegateVotingPowerChange';
  /** Block number of event */
  blockNumber: Scalars['BigInt']['output'];
  /** Block time change happened */
  blockTimestamp: Scalars['BigInt']['output'];
  /** Address for delegate */
  delegate: Scalars['String']['output'];
  /** Unique entity used to keep track of voting power delta */
  id: Scalars['ID']['output'];
  /** Log index for delegate voting power change */
  logIndex: Scalars['BigInt']['output'];
  /** New voting power of delegate */
  newBalance: Scalars['BigInt']['output'];
  /** Previous voting power of delegate */
  previousBalance: Scalars['BigInt']['output'];
  /** Token addresss */
  tokenAddress: Scalars['String']['output'];
  /** Transaction hash of the voting power change */
  txnHash: Scalars['String']['output'];
};

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

export enum DelegateVotingPowerChange_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Delegate = 'delegate',
  Id = 'id',
  LogIndex = 'logIndex',
  NewBalance = 'newBalance',
  PreviousBalance = 'previousBalance',
  TokenAddress = 'tokenAddress',
  TxnHash = 'txnHash'
}

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
  numberVotes?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_gt?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_gte?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberVotes_lt?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_lte?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_not?: InputMaybe<Scalars['Int']['input']>;
  numberVotes_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Delegate_Filter>>>;
  proposals_?: InputMaybe<Proposal_Filter>;
  tokenHoldersRepresentedAmount?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_gt?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_gte?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokenHoldersRepresentedAmount_lt?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_lte?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_not?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokenHoldersRepresented_?: InputMaybe<TokenHolder_Filter>;
  votes_?: InputMaybe<Vote_Filter>;
};

export enum Delegate_OrderBy {
  Address = 'address',
  DelegatedVotes = 'delegatedVotes',
  DelegatedVotesRaw = 'delegatedVotesRaw',
  Governance = 'governance',
  GovernanceCurrentDelegates = 'governance__currentDelegates',
  GovernanceCurrentTokenHolders = 'governance__currentTokenHolders',
  GovernanceDelegatedVotes = 'governance__delegatedVotes',
  GovernanceDelegatedVotesRaw = 'governance__delegatedVotesRaw',
  GovernanceId = 'governance__id',
  GovernanceProposals = 'governance__proposals',
  GovernanceProposalsCanceled = 'governance__proposalsCanceled',
  GovernanceProposalsExecuted = 'governance__proposalsExecuted',
  GovernanceProposalsQueued = 'governance__proposalsQueued',
  GovernanceTotalDelegates = 'governance__totalDelegates',
  GovernanceTotalTokenHolders = 'governance__totalTokenHolders',
  GovernanceTotalTokenSupply = 'governance__totalTokenSupply',
  Id = 'id',
  NumberVotes = 'numberVotes',
  Proposals = 'proposals',
  TokenHoldersRepresented = 'tokenHoldersRepresented',
  TokenHoldersRepresentedAmount = 'tokenHoldersRepresentedAmount',
  Votes = 'votes'
}

export type Deployer = {
  __typename?: 'Deployer';
  /**  Block number of Deployer registration  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Deployer version, in SemVer format (e.g. 2.1.0) */
  deployerVersion: Scalars['String']['output'];
  /**  Smart contract address of the Deployer  */
  id: Scalars['ID']['output'];
};

export type Deployer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Deployer_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deployerVersion?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_contains?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_gt?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_gte?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  deployerVersion_lt?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_lte?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_not?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  deployerVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  deployerVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Deployer_Filter>>>;
};

export enum Deployer_OrderBy {
  BlockNumber = 'blockNumber',
  DeployerVersion = 'deployerVersion',
  Id = 'id'
}

export type Entry = Event & {
  __typename?: 'Entry';
  /**  Transaction amount  */
  amount?: Maybe<Scalars['BigInt']['output']>;
  /**  Transaction amount USD */
  amountUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Account that sent the transaction  */
  from: Account;
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Token ID }-{ Transaction hash }-{ Log index }  */
  id: Scalars['ID']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  Nonce of the transaction that emitted this event  */
  nonce: Scalars['Int']['output'];
  /**  The rToken this event belongs to  */
  rToken?: Maybe<RToken>;
  /**  Stake/Unstake - staking token amount */
  stAmount?: Maybe<Scalars['BigInt']['output']>;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  TRANSFER - Account that received the tokens  */
  to?: Maybe<Account>;
  /**  The token this event belongs to  */
  token: Token;
  /**  Entry Type  */
  type: Scalars['String']['output'];
};

export type Entry_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Entry_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Entry_Filter>>>;
  rToken?: InputMaybe<Scalars['String']['input']>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stAmount?: InputMaybe<Scalars['BigInt']['input']>;
  stAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  stAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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

export enum Entry_OrderBy {
  Amount = 'amount',
  AmountUsd = 'amountUSD',
  BlockNumber = 'blockNumber',
  From = 'from',
  FromId = 'from__id',
  Hash = 'hash',
  Id = 'id',
  LogIndex = 'logIndex',
  Nonce = 'nonce',
  RToken = 'rToken',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked',
  StAmount = 'stAmount',
  Timestamp = 'timestamp',
  To = 'to',
  ToId = 'to__id',
  Token = 'token',
  TokenBasketRate = 'token__basketRate',
  TokenBurnCount = 'token__burnCount',
  TokenCumulativeVolume = 'token__cumulativeVolume',
  TokenDecimals = 'token__decimals',
  TokenHolderCount = 'token__holderCount',
  TokenId = 'token__id',
  TokenLastMarketCapUsd = 'token__lastMarketCapUSD',
  TokenLastPriceTimestamp = 'token__lastPriceTimestamp',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenMintCount = 'token__mintCount',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  TokenTotalBurned = 'token__totalBurned',
  TokenTotalMinted = 'token__totalMinted',
  TokenTotalSupply = 'token__totalSupply',
  TokenTransferCount = 'token__transferCount',
  TokenUserCount = 'token__userCount',
  Type = 'type'
}

export type Event = {
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Account that sent the transaction  */
  from: Account;
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Token ID }-{ Transaction hash }-{ Log index }  */
  id: Scalars['ID']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  Nonce of the transaction that emitted this event  */
  nonce: Scalars['Int']['output'];
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  The token this event belongs to  */
  token: Token;
};

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

export enum Event_OrderBy {
  BlockNumber = 'blockNumber',
  From = 'from',
  FromId = 'from__id',
  Hash = 'hash',
  Id = 'id',
  LogIndex = 'logIndex',
  Nonce = 'nonce',
  Timestamp = 'timestamp',
  Token = 'token',
  TokenBasketRate = 'token__basketRate',
  TokenBurnCount = 'token__burnCount',
  TokenCumulativeVolume = 'token__cumulativeVolume',
  TokenDecimals = 'token__decimals',
  TokenHolderCount = 'token__holderCount',
  TokenId = 'token__id',
  TokenLastMarketCapUsd = 'token__lastMarketCapUSD',
  TokenLastPriceTimestamp = 'token__lastPriceTimestamp',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenMintCount = 'token__mintCount',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  TokenTotalBurned = 'token__totalBurned',
  TokenTotalMinted = 'token__totalMinted',
  TokenTotalSupply = 'token__totalSupply',
  TokenTransferCount = 'token__transferCount',
  TokenUserCount = 'token__userCount'
}

export type FinancialsDailySnapshot = {
  __typename?: 'FinancialsDailySnapshot';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Revenue given to RSR Stakers  */
  cumulativeRSRRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Revenue given to RToken holders  */
  cumulativeRTokenRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the protocol from the collateral yield  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Total rToken usd value  */
  cumulativeVolumeUSD: Scalars['BigDecimal']['output'];
  /**  Total RToken combinated supply  */
  dailyVolumeUSD: Scalars['BigDecimal']['output'];
  /**  ID is # of days since Unix epoch time  */
  id: Scalars['ID']['output'];
  /**  Protocol this snapshot is associated with  */
  protocol: Protocol;
  /**  Total RSR locked on all RTokens  */
  rsrLocked: Scalars['BigInt']['output'];
  /**  Total USD equivalent RSR locked amount on the protocol  */
  rsrLockedUSD: Scalars['BigDecimal']['output'];
  /**  Total RSR staked on all RTokens  */
  rsrStaked: Scalars['BigInt']['output'];
  /**  Total USD equivalent RSR staked amount on the protocol  */
  rsrStakedUSD: Scalars['BigDecimal']['output'];
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Total USD amount of all rTokens  */
  totalRTokenUSD: Scalars['BigDecimal']['output'];
  /**  Current TVL (Total Value Locked) of the entire protocol  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
};

export type FinancialsDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FinancialsDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRTokenRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRTokenRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FinancialsDailySnapshot_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<Protocol_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rsrLocked?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrLocked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrLocked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_not?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrStaked?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrStakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRTokenUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalRTokenUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum FinancialsDailySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CumulativeRsrRevenueUsd = 'cumulativeRSRRevenueUSD',
  CumulativeRTokenRevenueUsd = 'cumulativeRTokenRevenueUSD',
  CumulativeTotalRevenueUsd = 'cumulativeTotalRevenueUSD',
  CumulativeVolumeUsd = 'cumulativeVolumeUSD',
  DailyVolumeUsd = 'dailyVolumeUSD',
  Id = 'id',
  Protocol = 'protocol',
  ProtocolCumulativeRsrRevenueUsd = 'protocol__cumulativeRSRRevenueUSD',
  ProtocolCumulativeRTokenRevenueUsd = 'protocol__cumulativeRTokenRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolCumulativeVolumeUsd = 'protocol__cumulativeVolumeUSD',
  ProtocolId = 'protocol__id',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolRTokenCount = 'protocol__rTokenCount',
  ProtocolRsrLocked = 'protocol__rsrLocked',
  ProtocolRsrLockedUsd = 'protocol__rsrLockedUSD',
  ProtocolRsrRevenue = 'protocol__rsrRevenue',
  ProtocolRsrStaked = 'protocol__rsrStaked',
  ProtocolRsrStakedUsd = 'protocol__rsrStakedUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalRTokenUsd = 'protocol__totalRTokenUSD',
  ProtocolTotalRsrStaked = 'protocol__totalRsrStaked',
  ProtocolTotalRsrStakedUsd = 'protocol__totalRsrStakedUSD',
  ProtocolTotalRsrUnstaked = 'protocol__totalRsrUnstaked',
  ProtocolTotalRsrUnstakedUsd = 'protocol__totalRsrUnstakedUSD',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolTransactionCount = 'protocol__transactionCount',
  RsrLocked = 'rsrLocked',
  RsrLockedUsd = 'rsrLockedUSD',
  RsrStaked = 'rsrStaked',
  RsrStakedUsd = 'rsrStakedUSD',
  Timestamp = 'timestamp',
  TotalRTokenUsd = 'totalRTokenUSD',
  TotalValueLockedUsd = 'totalValueLockedUSD'
}

export type Governance = {
  __typename?: 'Governance';
  /** Total number of delegates participating on the governance currently */
  currentDelegates: Scalars['BigInt']['output'];
  /** Total number of token holders currently */
  currentTokenHolders: Scalars['BigInt']['output'];
  /** Total number of votes delegated expressed as a BigDecimal normalized value for the token */
  delegatedVotes: Scalars['BigDecimal']['output'];
  /** Total number of votes delegated expressed in the smallest unit of the token */
  delegatedVotesRaw: Scalars['BigInt']['output'];
  /** Governance frameworks (ideally this is just Alexios) */
  governanceFrameworks: Array<GovernanceFramework>;
  /** Guardian role */
  guardians: Array<Scalars['String']['output']>;
  /**  Address of the rToken  */
  id: Scalars['ID']['output'];
  /**  Proposal list  */
  proposalList: Array<Proposal>;
  /** Total number of proposals created */
  proposals: Scalars['BigInt']['output'];
  /** Number of proposals currently canceled */
  proposalsCanceled: Scalars['BigInt']['output'];
  /** Number of proposals currently executed */
  proposalsExecuted: Scalars['BigInt']['output'];
  /** Number of proposals currently queued for execution */
  proposalsQueued: Scalars['BigInt']['output'];
  rToken: RToken;
  /** Total number of delegates that held delegated votes */
  totalDelegates: Scalars['BigInt']['output'];
  /** Total number of token holders */
  totalTokenHolders: Scalars['BigInt']['output'];
  /** Total Supply of token */
  totalTokenSupply: Scalars['BigInt']['output'];
};


export type GovernanceGovernanceFrameworksArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GovernanceFramework_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GovernanceFramework_Filter>;
};


export type GovernanceProposalListArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Proposal_Filter>;
};

export type GovernanceFramework = {
  __typename?: 'GovernanceFramework';
  /** Governance framework contract address */
  contractAddress: Scalars['String']['output'];
  /** timelock execution delay */
  executionDelay: Scalars['BigInt']['output'];
  /** RToken related to */
  governance: Governance;
  /** Governance contract addresss */
  id: Scalars['ID']['output'];
  /** Name of the governance framework */
  name: Scalars['String']['output'];
  /** The number of votes required in order for a voter to become a proposer */
  proposalThreshold: Scalars['BigInt']['output'];
  /** Quorum fraction denominator value. (OZ: quorum = totalSupply * numerator / denominator) */
  quorumDenominator?: Maybe<Scalars['BigInt']['output']>;
  /** Quorum fraction numerator value. (OZ: quorum = totalSupply * numerator / denominator) */
  quorumNumerator?: Maybe<Scalars['BigInt']['output']>;
  /** The number of votes for a proposal to succeed. */
  quorumVotes?: Maybe<Scalars['BigInt']['output']>;
  /** The contract address associated with the contract that manages the delay of administrative actions for the governance framework */
  timelockAddress: Scalars['String']['output'];
  /** The delay before voting on a proposal may take place in blocks */
  votingDelay: Scalars['BigInt']['output'];
  /** The duration of voting on a proposal in blocks */
  votingPeriod: Scalars['BigInt']['output'];
};

export type GovernanceFramework_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GovernanceFramework_Filter>>>;
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  contractAddress_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_gt?: InputMaybe<Scalars['String']['input']>;
  contractAddress_gte?: InputMaybe<Scalars['String']['input']>;
  contractAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contractAddress_lt?: InputMaybe<Scalars['String']['input']>;
  contractAddress_lte?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  contractAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  contractAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  contractAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<GovernanceFramework_Filter>>>;
  proposalThreshold?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalThreshold_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  timelockAddress?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_contains?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_gt?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_gte?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  timelockAddress_lt?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_lte?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_not?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  timelockAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  timelockAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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

export enum GovernanceFramework_OrderBy {
  ContractAddress = 'contractAddress',
  ExecutionDelay = 'executionDelay',
  Governance = 'governance',
  GovernanceCurrentDelegates = 'governance__currentDelegates',
  GovernanceCurrentTokenHolders = 'governance__currentTokenHolders',
  GovernanceDelegatedVotes = 'governance__delegatedVotes',
  GovernanceDelegatedVotesRaw = 'governance__delegatedVotesRaw',
  GovernanceId = 'governance__id',
  GovernanceProposals = 'governance__proposals',
  GovernanceProposalsCanceled = 'governance__proposalsCanceled',
  GovernanceProposalsExecuted = 'governance__proposalsExecuted',
  GovernanceProposalsQueued = 'governance__proposalsQueued',
  GovernanceTotalDelegates = 'governance__totalDelegates',
  GovernanceTotalTokenHolders = 'governance__totalTokenHolders',
  GovernanceTotalTokenSupply = 'governance__totalTokenSupply',
  Id = 'id',
  Name = 'name',
  ProposalThreshold = 'proposalThreshold',
  QuorumDenominator = 'quorumDenominator',
  QuorumNumerator = 'quorumNumerator',
  QuorumVotes = 'quorumVotes',
  TimelockAddress = 'timelockAddress',
  VotingDelay = 'votingDelay',
  VotingPeriod = 'votingPeriod'
}

export type Governance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Governance_Filter>>>;
  currentDelegates?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentDelegates_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentTokenHolders?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentTokenHolders_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  governanceFrameworks_?: InputMaybe<GovernanceFramework_Filter>;
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
  or?: InputMaybe<Array<InputMaybe<Governance_Filter>>>;
  proposalList_?: InputMaybe<Proposal_Filter>;
  proposals?: InputMaybe<Scalars['BigInt']['input']>;
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
  proposals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposals_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rToken?: InputMaybe<Scalars['String']['input']>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalDelegates?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegates_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokenHolders?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokenHolders_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Governance_OrderBy {
  CurrentDelegates = 'currentDelegates',
  CurrentTokenHolders = 'currentTokenHolders',
  DelegatedVotes = 'delegatedVotes',
  DelegatedVotesRaw = 'delegatedVotesRaw',
  GovernanceFrameworks = 'governanceFrameworks',
  Guardians = 'guardians',
  Id = 'id',
  ProposalList = 'proposalList',
  Proposals = 'proposals',
  ProposalsCanceled = 'proposalsCanceled',
  ProposalsExecuted = 'proposalsExecuted',
  ProposalsQueued = 'proposalsQueued',
  RToken = 'rToken',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked',
  TotalDelegates = 'totalDelegates',
  TotalTokenHolders = 'totalTokenHolders',
  TotalTokenSupply = 'totalTokenSupply'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Proposal = {
  __typename?: 'Proposal';
  /** Number of delegates that voted abstain to the proposal */
  abstainDelegateVotes: Scalars['BigInt']['output'];
  /** Weighted votes abstaining to the proposal */
  abstainWeightedVotes: Scalars['BigInt']['output'];
  /** Number of delegates that voted against the proposal */
  againstDelegateVotes: Scalars['BigInt']['output'];
  /** Weighted votes against the proposal */
  againstWeightedVotes: Scalars['BigInt']['output'];
  /** Call data for the change */
  calldatas?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** Block number proposal was canceled in */
  cancellationBlock?: Maybe<Scalars['BigInt']['output']>;
  /** Timestamp of block proposal was canceled in */
  cancellationTime?: Maybe<Scalars['BigInt']['output']>;
  /** Transaction hash of the proposal cancellation */
  cancellationTxnHash?: Maybe<Scalars['String']['output']>;
  /** Block number proposal was created in */
  creationBlock: Scalars['BigInt']['output'];
  /** Timestamp of block proposal was created in */
  creationTime: Scalars['BigInt']['output'];
  /** Number of delegates at start of voting */
  delegatesAtStart: Scalars['BigInt']['output'];
  /** Proposal description in markdown format */
  description: Scalars['String']['output'];
  /** Block number from where the voting ends */
  endBlock: Scalars['BigInt']['output'];
  /** Block number proposal was executed in */
  executionBlock?: Maybe<Scalars['BigInt']['output']>;
  /** Once the proposal is queued for execution it will have an ETA of the execution */
  executionETA?: Maybe<Scalars['BigInt']['output']>;
  /** executionStartBlock */
  executionStartBlock?: Maybe<Scalars['BigInt']['output']>;
  /** Timestamp of block proposal was executed in */
  executionTime?: Maybe<Scalars['BigInt']['output']>;
  /** Transaction hash of the proposal execution */
  executionTxnHash?: Maybe<Scalars['String']['output']>;
  /** Number of delegates that voted for the proposal */
  forDelegateVotes: Scalars['BigInt']['output'];
  /** Weighted votes for the proposal */
  forWeightedVotes: Scalars['BigInt']['output'];
  /** RToken related to */
  governance: Governance;
  /** Governance Framework that proposal is part of */
  governanceFramework: GovernanceFramework;
  /**  Internal proposal ID (uint256)  */
  id: Scalars['ID']['output'];
  /** Delegate that proposed the proposal */
  proposer: Delegate;
  /** Block number proposal was queued in */
  queueBlock?: Maybe<Scalars['BigInt']['output']>;
  /** Timestamp of block proposal was queued in */
  queueTime?: Maybe<Scalars['BigInt']['output']>;
  /** Transaction hash of the proposal being queued */
  queueTxnHash?: Maybe<Scalars['String']['output']>;
  /** The number of votes for a proposal to succeed. */
  quorumVotes: Scalars['BigInt']['output'];
  /** Signature data for the change */
  signatures?: Maybe<Array<Scalars['String']['output']>>;
  /** Block number from where the voting starts */
  startBlock: Scalars['BigInt']['output'];
  /** State of the proposal */
  state: ProposalState;
  /** Targets data for the change */
  targets?: Maybe<Array<Scalars['String']['output']>>;
  /** Number of tokenholders at start of voting */
  tokenHoldersAtStart: Scalars['BigInt']['output'];
  /** Total number of delegates that voted on the proposal */
  totalDelegateVotes: Scalars['BigInt']['output'];
  /** Total weighted for/against/abstaining votes */
  totalWeightedVotes: Scalars['BigInt']['output'];
  /** Transaction hash of the proposal creation */
  txnHash: Scalars['String']['output'];
  /** Values data for the change */
  values?: Maybe<Array<Scalars['BigInt']['output']>>;
  /** Votes associated to this proposal */
  votes: Array<Vote>;
};


export type ProposalVotesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Vote_Filter>;
};

export enum ProposalState {
  Active = 'ACTIVE',
  Canceled = 'CANCELED',
  Defeated = 'DEFEATED',
  Executed = 'EXECUTED',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
  Queued = 'QUEUED',
  Succeeded = 'SUCCEEDED'
}

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
  calldatas_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
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
  endBlock?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  executionStartBlock?: InputMaybe<Scalars['BigInt']['input']>;
  executionStartBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  executionStartBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  executionStartBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionStartBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  executionStartBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  executionStartBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  executionStartBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  governanceFramework?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_?: InputMaybe<GovernanceFramework_Filter>;
  governanceFramework_contains?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_ends_with?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_gt?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_gte?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_in?: InputMaybe<Array<Scalars['String']['input']>>;
  governanceFramework_lt?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_lte?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_not?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_not_contains?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  governanceFramework_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_starts_with?: InputMaybe<Scalars['String']['input']>;
  governanceFramework_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  startBlock?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  values_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votes_?: InputMaybe<Vote_Filter>;
};

export enum Proposal_OrderBy {
  AbstainDelegateVotes = 'abstainDelegateVotes',
  AbstainWeightedVotes = 'abstainWeightedVotes',
  AgainstDelegateVotes = 'againstDelegateVotes',
  AgainstWeightedVotes = 'againstWeightedVotes',
  Calldatas = 'calldatas',
  CancellationBlock = 'cancellationBlock',
  CancellationTime = 'cancellationTime',
  CancellationTxnHash = 'cancellationTxnHash',
  CreationBlock = 'creationBlock',
  CreationTime = 'creationTime',
  DelegatesAtStart = 'delegatesAtStart',
  Description = 'description',
  EndBlock = 'endBlock',
  ExecutionBlock = 'executionBlock',
  ExecutionEta = 'executionETA',
  ExecutionStartBlock = 'executionStartBlock',
  ExecutionTime = 'executionTime',
  ExecutionTxnHash = 'executionTxnHash',
  ForDelegateVotes = 'forDelegateVotes',
  ForWeightedVotes = 'forWeightedVotes',
  Governance = 'governance',
  GovernanceFramework = 'governanceFramework',
  GovernanceFrameworkContractAddress = 'governanceFramework__contractAddress',
  GovernanceFrameworkExecutionDelay = 'governanceFramework__executionDelay',
  GovernanceFrameworkId = 'governanceFramework__id',
  GovernanceFrameworkName = 'governanceFramework__name',
  GovernanceFrameworkProposalThreshold = 'governanceFramework__proposalThreshold',
  GovernanceFrameworkQuorumDenominator = 'governanceFramework__quorumDenominator',
  GovernanceFrameworkQuorumNumerator = 'governanceFramework__quorumNumerator',
  GovernanceFrameworkQuorumVotes = 'governanceFramework__quorumVotes',
  GovernanceFrameworkTimelockAddress = 'governanceFramework__timelockAddress',
  GovernanceFrameworkVotingDelay = 'governanceFramework__votingDelay',
  GovernanceFrameworkVotingPeriod = 'governanceFramework__votingPeriod',
  GovernanceCurrentDelegates = 'governance__currentDelegates',
  GovernanceCurrentTokenHolders = 'governance__currentTokenHolders',
  GovernanceDelegatedVotes = 'governance__delegatedVotes',
  GovernanceDelegatedVotesRaw = 'governance__delegatedVotesRaw',
  GovernanceId = 'governance__id',
  GovernanceProposals = 'governance__proposals',
  GovernanceProposalsCanceled = 'governance__proposalsCanceled',
  GovernanceProposalsExecuted = 'governance__proposalsExecuted',
  GovernanceProposalsQueued = 'governance__proposalsQueued',
  GovernanceTotalDelegates = 'governance__totalDelegates',
  GovernanceTotalTokenHolders = 'governance__totalTokenHolders',
  GovernanceTotalTokenSupply = 'governance__totalTokenSupply',
  Id = 'id',
  Proposer = 'proposer',
  ProposerAddress = 'proposer__address',
  ProposerDelegatedVotes = 'proposer__delegatedVotes',
  ProposerDelegatedVotesRaw = 'proposer__delegatedVotesRaw',
  ProposerId = 'proposer__id',
  ProposerNumberVotes = 'proposer__numberVotes',
  ProposerTokenHoldersRepresentedAmount = 'proposer__tokenHoldersRepresentedAmount',
  QueueBlock = 'queueBlock',
  QueueTime = 'queueTime',
  QueueTxnHash = 'queueTxnHash',
  QuorumVotes = 'quorumVotes',
  Signatures = 'signatures',
  StartBlock = 'startBlock',
  State = 'state',
  Targets = 'targets',
  TokenHoldersAtStart = 'tokenHoldersAtStart',
  TotalDelegateVotes = 'totalDelegateVotes',
  TotalWeightedVotes = 'totalWeightedVotes',
  TxnHash = 'txnHash',
  Values = 'values',
  Votes = 'votes'
}

export type Protocol = {
  __typename?: 'Protocol';
  /**  Revenue given to RSR Stakers  */
  cumulativeRSRRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Revenue given to RToken holders  */
  cumulativeRTokenRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the protocol from the collateral yield  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  cumulativeVolumeUSD token transfers value  */
  cumulativeVolumeUSD: Scalars['BigDecimal']['output'];
  /**  Daily usage metrics for this protocol  */
  dailyUsageMetrics: Array<UsageMetricsDailySnapshot>;
  /**  Daily financial metrics for this protocol  */
  financialMetrics: Array<FinancialsDailySnapshot>;
  /**  Hourly usage metrics for this protocol  */
  hourlyUsageMetrics: Array<UsageMetricsHourlySnapshot>;
  /**  Smart contract address of the protocol's main contract (Factory, Registry, etc)  */
  id: Scalars['ID']['output'];
  /**  Version of the methodology used to compute metrics, loosely based on SemVer format (e.g. 1.0.0)  */
  methodologyVersion: Scalars['String']['output'];
  /**  Name of the protocol, including version. e.g. Uniswap v3  */
  name: Scalars['String']['output'];
  /**  Total number of rTokens  */
  rTokenCount: Scalars['Int']['output'];
  /**  All rtokens that belong to this protocol  */
  rTokens: Array<RToken>;
  /**  RSR amount currently locked on the protocol  */
  rsrLocked: Scalars['BigInt']['output'];
  /**  USD equivalent RSR locked amount on the protocol  */
  rsrLockedUSD: Scalars['BigDecimal']['output'];
  /**  Total distributed rsr revenue to stakers  */
  rsrRevenue: Scalars['BigDecimal']['output'];
  /**  RSR amount currently locked on the protocol  */
  rsrStaked: Scalars['BigInt']['output'];
  /**  USD equivalent RSR staked amount on the protocol  */
  rsrStakedUSD: Scalars['BigDecimal']['output'];
  /**  Version of the subgraph schema, in SemVer format (e.g. 1.0.0)  */
  schemaVersion: Scalars['String']['output'];
  /**  Slug of protocol, including version. e.g. uniswap-v3  */
  slug: Scalars['String']['output'];
  /**  Version of the subgraph implementation, in SemVer format (e.g. 1.0.0)  */
  subgraphVersion: Scalars['String']['output'];
  /**  Total rToken usd value  */
  totalRTokenUSD: Scalars['BigDecimal']['output'];
  /**  Total amount of RSR that has been staked across all rTokens  */
  totalRsrStaked: Scalars['BigInt']['output'];
  /**  Total USD of staked rsr  */
  totalRsrStakedUSD: Scalars['BigDecimal']['output'];
  /**  Total RSR staked  */
  totalRsrUnstaked: Scalars['BigInt']['output'];
  /**  Total USD of stake rsr  */
  totalRsrUnstakedUSD: Scalars['BigDecimal']['output'];
  /**  Current TVL (Total Value Locked) of the entire protocol  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  Total number of transactions across all rTokens  */
  transactionCount: Scalars['BigInt']['output'];
};


export type ProtocolDailyUsageMetricsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UsageMetricsDailySnapshot_Filter>;
};


export type ProtocolFinancialMetricsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FinancialsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FinancialsDailySnapshot_Filter>;
};


export type ProtocolHourlyUsageMetricsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UsageMetricsHourlySnapshot_Filter>;
};


export type ProtocolRTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RToken_Filter>;
};

export type Protocol_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Protocol_Filter>>>;
  cumulativeRSRRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRTokenRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRTokenRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyUsageMetrics_?: InputMaybe<UsageMetricsDailySnapshot_Filter>;
  financialMetrics_?: InputMaybe<FinancialsDailySnapshot_Filter>;
  hourlyUsageMetrics_?: InputMaybe<UsageMetricsHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  methodologyVersion?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_contains?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_gt?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_gte?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  methodologyVersion_lt?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_lte?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  methodologyVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  or?: InputMaybe<Array<InputMaybe<Protocol_Filter>>>;
  rTokenCount?: InputMaybe<Scalars['Int']['input']>;
  rTokenCount_gt?: InputMaybe<Scalars['Int']['input']>;
  rTokenCount_gte?: InputMaybe<Scalars['Int']['input']>;
  rTokenCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rTokenCount_lt?: InputMaybe<Scalars['Int']['input']>;
  rTokenCount_lte?: InputMaybe<Scalars['Int']['input']>;
  rTokenCount_not?: InputMaybe<Scalars['Int']['input']>;
  rTokenCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rTokens_?: InputMaybe<RToken_Filter>;
  rsrLocked?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrLocked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrLocked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_not?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrRevenue?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrRevenue_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrRevenue_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrRevenue_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrRevenue_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrRevenue_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrRevenue_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrRevenue_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrStaked?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrStakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  schemaVersion?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_contains?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_gt?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_gte?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaVersion_lt?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_lte?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_contains?: InputMaybe<Scalars['String']['input']>;
  slug_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_gt?: InputMaybe<Scalars['String']['input']>;
  slug_gte?: InputMaybe<Scalars['String']['input']>;
  slug_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_lt?: InputMaybe<Scalars['String']['input']>;
  slug_lte?: InputMaybe<Scalars['String']['input']>;
  slug_not?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_gt?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_gte?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphVersion_lt?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_lte?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalRTokenUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalRTokenUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRTokenUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalRsrStaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrStakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrStakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrStakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalRsrStakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrStakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrStakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrStakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalRsrStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRsrStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRsrUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrUnstakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrUnstakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrUnstakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalRsrUnstakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrUnstakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrUnstakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalRsrUnstakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalRsrUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRsrUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  transactionCount?: InputMaybe<Scalars['BigInt']['input']>;
  transactionCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  transactionCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  transactionCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  transactionCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Protocol_OrderBy {
  CumulativeRsrRevenueUsd = 'cumulativeRSRRevenueUSD',
  CumulativeRTokenRevenueUsd = 'cumulativeRTokenRevenueUSD',
  CumulativeTotalRevenueUsd = 'cumulativeTotalRevenueUSD',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  CumulativeVolumeUsd = 'cumulativeVolumeUSD',
  DailyUsageMetrics = 'dailyUsageMetrics',
  FinancialMetrics = 'financialMetrics',
  HourlyUsageMetrics = 'hourlyUsageMetrics',
  Id = 'id',
  MethodologyVersion = 'methodologyVersion',
  Name = 'name',
  RTokenCount = 'rTokenCount',
  RTokens = 'rTokens',
  RsrLocked = 'rsrLocked',
  RsrLockedUsd = 'rsrLockedUSD',
  RsrRevenue = 'rsrRevenue',
  RsrStaked = 'rsrStaked',
  RsrStakedUsd = 'rsrStakedUSD',
  SchemaVersion = 'schemaVersion',
  Slug = 'slug',
  SubgraphVersion = 'subgraphVersion',
  TotalRTokenUsd = 'totalRTokenUSD',
  TotalRsrStaked = 'totalRsrStaked',
  TotalRsrStakedUsd = 'totalRsrStakedUSD',
  TotalRsrUnstaked = 'totalRsrUnstaked',
  TotalRsrUnstakedUsd = 'totalRsrUnstakedUSD',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  TransactionCount = 'transactionCount'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accountBalance?: Maybe<AccountBalance>;
  accountBalanceDailySnapshot?: Maybe<AccountBalanceDailySnapshot>;
  accountBalanceDailySnapshots: Array<AccountBalanceDailySnapshot>;
  accountBalances: Array<AccountBalance>;
  accountRToken?: Maybe<AccountRToken>;
  accountRTokenDailySnapshot?: Maybe<AccountRTokenDailySnapshot>;
  accountRTokenDailySnapshots: Array<AccountRTokenDailySnapshot>;
  accountRTokens: Array<AccountRToken>;
  accountStakeRecord?: Maybe<AccountStakeRecord>;
  accountStakeRecords: Array<AccountStakeRecord>;
  accounts: Array<Account>;
  activeAccount?: Maybe<ActiveAccount>;
  activeAccounts: Array<ActiveAccount>;
  collateral?: Maybe<Collateral>;
  collaterals: Array<Collateral>;
  delegate?: Maybe<Delegate>;
  delegateChange?: Maybe<DelegateChange>;
  delegateChanges: Array<DelegateChange>;
  delegateVotingPowerChange?: Maybe<DelegateVotingPowerChange>;
  delegateVotingPowerChanges: Array<DelegateVotingPowerChange>;
  delegates: Array<Delegate>;
  deployer?: Maybe<Deployer>;
  deployers: Array<Deployer>;
  entries: Array<Entry>;
  entry?: Maybe<Entry>;
  event?: Maybe<Event>;
  events: Array<Event>;
  financialsDailySnapshot?: Maybe<FinancialsDailySnapshot>;
  financialsDailySnapshots: Array<FinancialsDailySnapshot>;
  governance?: Maybe<Governance>;
  governanceFramework?: Maybe<GovernanceFramework>;
  governanceFrameworks: Array<GovernanceFramework>;
  governances: Array<Governance>;
  proposal?: Maybe<Proposal>;
  proposals: Array<Proposal>;
  protocol?: Maybe<Protocol>;
  protocols: Array<Protocol>;
  revenueDistribution?: Maybe<RevenueDistribution>;
  revenueDistributions: Array<RevenueDistribution>;
  rewardToken?: Maybe<RewardToken>;
  rewardTokens: Array<RewardToken>;
  rtoken?: Maybe<RToken>;
  rtokenContract?: Maybe<RTokenContract>;
  rtokenContracts: Array<RTokenContract>;
  rtokenDailySnapshot?: Maybe<RTokenDailySnapshot>;
  rtokenDailySnapshots: Array<RTokenDailySnapshot>;
  rtokenHistoricalBaskets?: Maybe<RTokenHistoricalBaskets>;
  rtokenHistoricalBaskets_collection: Array<RTokenHistoricalBaskets>;
  rtokenHourlySnapshot?: Maybe<RTokenHourlySnapshot>;
  rtokenHourlySnapshots: Array<RTokenHourlySnapshot>;
  rtokens: Array<RToken>;
  stTokenDailySnapshot?: Maybe<StTokenDailySnapshot>;
  stTokenDailySnapshots: Array<StTokenDailySnapshot>;
  timelockProposal?: Maybe<TimelockProposal>;
  timelockProposals: Array<TimelockProposal>;
  token?: Maybe<Token>;
  tokenDailySnapshot?: Maybe<TokenDailySnapshot>;
  tokenDailySnapshots: Array<TokenDailySnapshot>;
  tokenHolder?: Maybe<TokenHolder>;
  tokenHolders: Array<TokenHolder>;
  tokenHourlySnapshot?: Maybe<TokenHourlySnapshot>;
  tokenHourlySnapshots: Array<TokenHourlySnapshot>;
  tokens: Array<Token>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  usageMetricsDailySnapshot?: Maybe<UsageMetricsDailySnapshot>;
  usageMetricsDailySnapshots: Array<UsageMetricsDailySnapshot>;
  usageMetricsHourlySnapshot?: Maybe<UsageMetricsHourlySnapshot>;
  usageMetricsHourlySnapshots: Array<UsageMetricsHourlySnapshot>;
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
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountBalanceDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountBalanceDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountBalanceDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountBalanceDailySnapshot_Filter>;
};


export type QueryAccountBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountBalance_Filter>;
};


export type QueryAccountRTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountRTokenDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountRTokenDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountRTokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountRTokenDailySnapshot_Filter>;
};


export type QueryAccountRTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountRToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountRToken_Filter>;
};


export type QueryAccountStakeRecordArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountStakeRecordsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountStakeRecord_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountStakeRecord_Filter>;
};


export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type QueryActiveAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryActiveAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ActiveAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ActiveAccount_Filter>;
};


export type QueryCollateralArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCollateralsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Collateral_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Collateral_Filter>;
};


export type QueryDelegateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDelegateChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDelegateChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DelegateChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegateChange_Filter>;
};


export type QueryDelegateVotingPowerChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDelegateVotingPowerChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DelegateVotingPowerChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegateVotingPowerChange_Filter>;
};


export type QueryDelegatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Delegate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegate_Filter>;
};


export type QueryDeployerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDeployersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deployer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deployer_Filter>;
};


export type QueryEntriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Entry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Entry_Filter>;
};


export type QueryEntryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Event_Filter>;
};


export type QueryFinancialsDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFinancialsDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FinancialsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FinancialsDailySnapshot_Filter>;
};


export type QueryGovernanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGovernanceFrameworkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGovernanceFrameworksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GovernanceFramework_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GovernanceFramework_Filter>;
};


export type QueryGovernancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Governance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Governance_Filter>;
};


export type QueryProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Proposal_Filter>;
};


export type QueryProtocolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProtocolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Protocol_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Protocol_Filter>;
};


export type QueryRevenueDistributionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRevenueDistributionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RevenueDistribution_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RevenueDistribution_Filter>;
};


export type QueryRewardTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRewardTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardToken_Filter>;
};


export type QueryRtokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRtokenContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRtokenContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RTokenContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RTokenContract_Filter>;
};


export type QueryRtokenDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRtokenDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RTokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RTokenDailySnapshot_Filter>;
};


export type QueryRtokenHistoricalBasketsArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRtokenHistoricalBaskets_CollectionArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RTokenHistoricalBaskets_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RTokenHistoricalBaskets_Filter>;
};


export type QueryRtokenHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRtokenHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RTokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RTokenHourlySnapshot_Filter>;
};


export type QueryRtokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RToken_Filter>;
};


export type QueryStTokenDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStTokenDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StTokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StTokenDailySnapshot_Filter>;
};


export type QueryTimelockProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTimelockProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TimelockProposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TimelockProposal_Filter>;
};


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenDailySnapshot_Filter>;
};


export type QueryTokenHolderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenHoldersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHolder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHolder_Filter>;
};


export type QueryTokenHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHourlySnapshot_Filter>;
};


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type QueryTradeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTradesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trade_Filter>;
};


export type QueryUsageMetricsDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUsageMetricsDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UsageMetricsDailySnapshot_Filter>;
};


export type QueryUsageMetricsHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUsageMetricsHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UsageMetricsHourlySnapshot_Filter>;
};


export type QueryVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVoteDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVoteDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VoteDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VoteDailySnapshot_Filter>;
};


export type QueryVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vote_Filter>;
};

export type RToken = {
  __typename?: 'RToken';
  /**  Collaterization of this rToken % */
  backing: Scalars['BigInt']['output'];
  /**  Ratio of how much locked RSR there is corresponding to the mapping %  */
  backingRSR: Scalars['BigInt']['output'];
  /** Basket units of the rToken */
  basketsNeeded: Scalars['BigInt']['output'];
  /**  Collateral distribution  */
  collateralDistribution: Scalars['String']['output'];
  /**  Collaterals  */
  collaterals: Array<Collateral>;
  /**  Related contracts  */
  contracts: Array<RTokenContract>;
  /**  Creation block number  */
  createdBlockNumber: Scalars['BigInt']['output'];
  /**  Creation timestamp  */
  createdTimestamp: Scalars['BigInt']['output'];
  /**  Revenue given to RToken holders  */
  cumulativeRTokenRevenue: Scalars['BigDecimal']['output'];
  /**  Revenue given to RSR Stakers  */
  cumulativeStakerRevenue: Scalars['BigDecimal']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  RToken daily snapshots  */
  dailySnapshots: Array<RTokenDailySnapshot>;
  /**  short freezers (this role is revoked after action)  */
  freezers: Array<Scalars['String']['output']>;
  /**  RToken historical baskets  */
  historicalBaskets: Array<RTokenHistoricalBaskets>;
  /**  holders rewards distribution share  */
  holdersRewardShare: Scalars['BigDecimal']['output'];
  /**  RToken hourly snapshots  */
  hourlySnapshots: Array<RTokenHourlySnapshot>;
  /**  RToken address  */
  id: Scalars['ID']['output'];
  /**  long freezers (this role is revoked after action)  */
  longFreezers: Array<Scalars['String']['output']>;
  /**  Token owner (can be governance address)  */
  owners: Array<Scalars['String']['output']>;
  /**  Pausers  */
  pausers: Array<Scalars['String']['output']>;
  /**  The protocol this pool belongs to  */
  protocol: Protocol;
  /**  Exchange rate on big int for internal calculations  */
  rawRsrExchangeRate: Scalars['BigInt']['output'];
  /**  Revenue distribution  */
  revenueDistribution: Array<RevenueDistribution>;
  /**  stRSR Token  */
  rewardToken: RewardToken;
  /**  Total supply of rewardToken (stRSR)  */
  rewardTokenSupply: Scalars['BigInt']['output'];
  /**  Reward token exchange rate  */
  rsrExchangeRate: Scalars['BigDecimal']['output'];
  /**  How much RSR is currently locked in this RToken (overcollateralization)  */
  rsrLocked: Scalars['BigInt']['output'];
  /**  USD equivalent RSR locked amount on the staking contract  */
  rsrLockedUSD: Scalars['BigDecimal']['output'];
  /**  How much RSR is currently pooled in this RToken (earning rewards)  */
  rsrStaked: Scalars['BigInt']['output'];
  /**  USD equivalent RSR staked amount on the staking contract  */
  rsrStakedUSD: Scalars['BigDecimal']['output'];
  /**  Stakers rewards distribution share %  */
  stakersRewardShare: Scalars['BigDecimal']['output'];
  /**  Targets units for the primary basket */
  targetUnits: Scalars['String']['output'];
  /**  ERC20 token  */
  token: Token;
  /**  Total revenue distributed in RSR  */
  totalDistributedRSRRevenue: Scalars['BigInt']['output'];
  /**  Total revenue distributed in RToken  */
  totalDistributedRTokenRevenue: Scalars['BigInt']['output'];
  /**  Total RSR staked (cumulative)  */
  totalRsrStaked: Scalars['BigInt']['output'];
  /**  Total RSR unStaked (cumulative)  */
  totalRsrUnstaked: Scalars['BigInt']['output'];
  /**  Related auctions  */
  trades: Array<Trade>;
};


export type RTokenCollateralsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Collateral_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Collateral_Filter>;
};


export type RTokenContractsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RTokenContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RTokenContract_Filter>;
};


export type RTokenDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RTokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RTokenDailySnapshot_Filter>;
};


export type RTokenHistoricalBasketsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RTokenHistoricalBaskets_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RTokenHistoricalBaskets_Filter>;
};


export type RTokenHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RTokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RTokenHourlySnapshot_Filter>;
};


export type RTokenRevenueDistributionArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RevenueDistribution_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RevenueDistribution_Filter>;
};


export type RTokenTradesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Trade_Filter>;
};

export type RTokenContract = {
  __typename?: 'RTokenContract';
  /**  {Address of related contract}  */
  id: Scalars['ID']['output'];
  /**  Contract name  */
  name: Scalars['String']['output'];
  /**  Related rToken */
  rToken: RToken;
};

export type RTokenContract_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RTokenContract_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<RTokenContract_Filter>>>;
  rToken?: InputMaybe<Scalars['String']['input']>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum RTokenContract_OrderBy {
  Id = 'id',
  Name = 'name',
  RToken = 'rToken',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked'
}

export type RTokenDailySnapshot = {
  __typename?: 'RTokenDailySnapshot';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Revenue given to RSR Stakers  */
  cumulativeRSRRevenueUSD: Scalars['BigDecimal']['output'];
  /**  cumulative RSR staked  */
  cumulativeRSRStaked: Scalars['BigInt']['output'];
  /**  cumulative RSR staked  */
  cumulativeRSRUnstaked: Scalars['BigInt']['output'];
  /**  Revenue given to RToken holders  */
  cumulativeRTokenRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Number of unique daily active users  */
  dailyActiveUsers: Scalars['Int']['output'];
  /**  Daily Revenue given to RSR Stakers  */
  dailyRSRRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Total RSR staked  */
  dailyRSRStaked: Scalars['BigInt']['output'];
  /**  Total RSR staked  */
  dailyRSRUnstaked: Scalars['BigInt']['output'];
  /**  Daily revenue given to RToken holders  */
  dailyRTokenRevenueUSD: Scalars['BigDecimal']['output'];
  /**  { Smart contract address of the rToken }-{ # of days since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  The protocol this snapshot belongs to  */
  protocol: Protocol;
  /**  The rToken this snapshot belongs to  */
  rToken: RToken;
  /**  Total supply of rewardToken  */
  rewardTokenSupply: Scalars['BigInt']['output'];
  /**  Reward token exchange rate  */
  rsrExchangeRate: Scalars['BigDecimal']['output'];
  /**  RSR price  */
  rsrPrice: Scalars['BigDecimal']['output'];
  /**  How much RSR is currently locked  */
  rsrStaked: Scalars['BigInt']['output'];
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
};

export type RTokenDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RTokenDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRStaked?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRTokenRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRTokenRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyActiveUsers?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyActiveUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_not?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyRSRRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyRSRRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyRSRStaked?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyRSRStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyRSRUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyRSRUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyRTokenRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRTokenRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRTokenRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRTokenRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyRTokenRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRTokenRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRTokenRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRTokenRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RTokenDailySnapshot_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<Protocol_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken?: InputMaybe<Scalars['String']['input']>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrExchangeRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrExchangeRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrStaked?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum RTokenDailySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CumulativeRsrRevenueUsd = 'cumulativeRSRRevenueUSD',
  CumulativeRsrStaked = 'cumulativeRSRStaked',
  CumulativeRsrUnstaked = 'cumulativeRSRUnstaked',
  CumulativeRTokenRevenueUsd = 'cumulativeRTokenRevenueUSD',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  DailyActiveUsers = 'dailyActiveUsers',
  DailyRsrRevenueUsd = 'dailyRSRRevenueUSD',
  DailyRsrStaked = 'dailyRSRStaked',
  DailyRsrUnstaked = 'dailyRSRUnstaked',
  DailyRTokenRevenueUsd = 'dailyRTokenRevenueUSD',
  Id = 'id',
  Protocol = 'protocol',
  ProtocolCumulativeRsrRevenueUsd = 'protocol__cumulativeRSRRevenueUSD',
  ProtocolCumulativeRTokenRevenueUsd = 'protocol__cumulativeRTokenRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolCumulativeVolumeUsd = 'protocol__cumulativeVolumeUSD',
  ProtocolId = 'protocol__id',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolRTokenCount = 'protocol__rTokenCount',
  ProtocolRsrLocked = 'protocol__rsrLocked',
  ProtocolRsrLockedUsd = 'protocol__rsrLockedUSD',
  ProtocolRsrRevenue = 'protocol__rsrRevenue',
  ProtocolRsrStaked = 'protocol__rsrStaked',
  ProtocolRsrStakedUsd = 'protocol__rsrStakedUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalRTokenUsd = 'protocol__totalRTokenUSD',
  ProtocolTotalRsrStaked = 'protocol__totalRsrStaked',
  ProtocolTotalRsrStakedUsd = 'protocol__totalRsrStakedUSD',
  ProtocolTotalRsrUnstaked = 'protocol__totalRsrUnstaked',
  ProtocolTotalRsrUnstakedUsd = 'protocol__totalRsrUnstakedUSD',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolTransactionCount = 'protocol__transactionCount',
  RToken = 'rToken',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked',
  RewardTokenSupply = 'rewardTokenSupply',
  RsrExchangeRate = 'rsrExchangeRate',
  RsrPrice = 'rsrPrice',
  RsrStaked = 'rsrStaked',
  Timestamp = 'timestamp'
}

export type RTokenHistoricalBaskets = {
  __typename?: 'RTokenHistoricalBaskets';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Collateral distribution  */
  collateralDistribution: Scalars['String']['output'];
  /**  Collaterals  */
  collaterals: Array<Collateral>;
  /**  RToken address  */
  id: Scalars['ID']['output'];
  /**  The rToken this entity belongs to  */
  rToken: RToken;
  /**  Number of shares in RToken  */
  rTokenDist: Scalars['Int']['output'];
  /**  Number of shares in RSR  */
  rsrDist: Scalars['Int']['output'];
  /**  Targets units for the primary basket */
  targetUnits: Scalars['String']['output'];
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
};


export type RTokenHistoricalBasketsCollateralsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Collateral_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Collateral_Filter>;
};

export type RTokenHistoricalBaskets_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RTokenHistoricalBaskets_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateralDistribution?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_contains?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_gt?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_gte?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateralDistribution_lt?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_lte?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_contains?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateralDistribution_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collaterals?: InputMaybe<Array<Scalars['String']['input']>>;
  collaterals_?: InputMaybe<Collateral_Filter>;
  collaterals_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  collaterals_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  collaterals_not?: InputMaybe<Array<Scalars['String']['input']>>;
  collaterals_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  collaterals_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RTokenHistoricalBaskets_Filter>>>;
  rToken?: InputMaybe<Scalars['String']['input']>;
  rTokenDist?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_gt?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_gte?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rTokenDist_lt?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_lte?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_not?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rsrDist?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_gt?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_gte?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rsrDist_lt?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_lte?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_not?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  targetUnits?: InputMaybe<Scalars['String']['input']>;
  targetUnits_contains?: InputMaybe<Scalars['String']['input']>;
  targetUnits_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  targetUnits_ends_with?: InputMaybe<Scalars['String']['input']>;
  targetUnits_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  targetUnits_gt?: InputMaybe<Scalars['String']['input']>;
  targetUnits_gte?: InputMaybe<Scalars['String']['input']>;
  targetUnits_in?: InputMaybe<Array<Scalars['String']['input']>>;
  targetUnits_lt?: InputMaybe<Scalars['String']['input']>;
  targetUnits_lte?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_contains?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  targetUnits_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  targetUnits_starts_with?: InputMaybe<Scalars['String']['input']>;
  targetUnits_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum RTokenHistoricalBaskets_OrderBy {
  BlockNumber = 'blockNumber',
  CollateralDistribution = 'collateralDistribution',
  Collaterals = 'collaterals',
  Id = 'id',
  RToken = 'rToken',
  RTokenDist = 'rTokenDist',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked',
  RsrDist = 'rsrDist',
  TargetUnits = 'targetUnits',
  Timestamp = 'timestamp'
}

export type RTokenHourlySnapshot = {
  __typename?: 'RTokenHourlySnapshot';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Revenue given to RSR Stakers  */
  cumulativeRSRRevenueUSD: Scalars['BigDecimal']['output'];
  /**  cumulative RSR staked  */
  cumulativeRSRStaked: Scalars['BigInt']['output'];
  /**  cumulative RSR staked  */
  cumulativeRSRUnstaked: Scalars['BigInt']['output'];
  /**  Revenue given to RToken holders  */
  cumulativeRTokenRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Number of unique daily active users  */
  hourlyActiveUsers: Scalars['Int']['output'];
  /**  Hourly Revenue given to RSR Stakers  */
  hourlyRSRRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Total RSR staked in an hour */
  hourlyRSRStaked: Scalars['BigInt']['output'];
  /**  Total RSR staked  */
  hourlyRSRUnstaked: Scalars['BigInt']['output'];
  /**  Daily revenue given to RToken holders  */
  hourlyRTokenRevenueUSD: Scalars['BigDecimal']['output'];
  /**  { Smart contract address of the rToken }-{ # of hours since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  The protocol this snapshot belongs to  */
  protocol: Protocol;
  /**  The pool this snapshot belongs to  */
  rToken: RToken;
  /**  Total supply of rewardToken  */
  rewardTokenSupply?: Maybe<Scalars['BigInt']['output']>;
  /**  Reward token exchange rate  */
  rsrExchangeRate: Scalars['BigDecimal']['output'];
  /**  How much RSR is currently locked  */
  rsrStaked: Scalars['BigInt']['output'];
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
};

export type RTokenHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RTokenHourlySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRStaked?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRTokenRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRTokenRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyActiveUsers?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyActiveUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyRSRRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyRSRRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyRSRStaked?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyRSRStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyRSRUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyRSRUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyRTokenRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRTokenRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRTokenRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRTokenRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyRTokenRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRTokenRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRTokenRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRTokenRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RTokenHourlySnapshot_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<Protocol_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken?: InputMaybe<Scalars['String']['input']>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrExchangeRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrExchangeRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrStaked?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum RTokenHourlySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CumulativeRsrRevenueUsd = 'cumulativeRSRRevenueUSD',
  CumulativeRsrStaked = 'cumulativeRSRStaked',
  CumulativeRsrUnstaked = 'cumulativeRSRUnstaked',
  CumulativeRTokenRevenueUsd = 'cumulativeRTokenRevenueUSD',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  HourlyActiveUsers = 'hourlyActiveUsers',
  HourlyRsrRevenueUsd = 'hourlyRSRRevenueUSD',
  HourlyRsrStaked = 'hourlyRSRStaked',
  HourlyRsrUnstaked = 'hourlyRSRUnstaked',
  HourlyRTokenRevenueUsd = 'hourlyRTokenRevenueUSD',
  Id = 'id',
  Protocol = 'protocol',
  ProtocolCumulativeRsrRevenueUsd = 'protocol__cumulativeRSRRevenueUSD',
  ProtocolCumulativeRTokenRevenueUsd = 'protocol__cumulativeRTokenRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolCumulativeVolumeUsd = 'protocol__cumulativeVolumeUSD',
  ProtocolId = 'protocol__id',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolRTokenCount = 'protocol__rTokenCount',
  ProtocolRsrLocked = 'protocol__rsrLocked',
  ProtocolRsrLockedUsd = 'protocol__rsrLockedUSD',
  ProtocolRsrRevenue = 'protocol__rsrRevenue',
  ProtocolRsrStaked = 'protocol__rsrStaked',
  ProtocolRsrStakedUsd = 'protocol__rsrStakedUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalRTokenUsd = 'protocol__totalRTokenUSD',
  ProtocolTotalRsrStaked = 'protocol__totalRsrStaked',
  ProtocolTotalRsrStakedUsd = 'protocol__totalRsrStakedUSD',
  ProtocolTotalRsrUnstaked = 'protocol__totalRsrUnstaked',
  ProtocolTotalRsrUnstakedUsd = 'protocol__totalRsrUnstakedUSD',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolTransactionCount = 'protocol__transactionCount',
  RToken = 'rToken',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked',
  RewardTokenSupply = 'rewardTokenSupply',
  RsrExchangeRate = 'rsrExchangeRate',
  RsrStaked = 'rsrStaked',
  Timestamp = 'timestamp'
}

export type RToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RToken_Filter>>>;
  backing?: InputMaybe<Scalars['BigInt']['input']>;
  backingRSR?: InputMaybe<Scalars['BigInt']['input']>;
  backingRSR_gt?: InputMaybe<Scalars['BigInt']['input']>;
  backingRSR_gte?: InputMaybe<Scalars['BigInt']['input']>;
  backingRSR_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  backingRSR_lt?: InputMaybe<Scalars['BigInt']['input']>;
  backingRSR_lte?: InputMaybe<Scalars['BigInt']['input']>;
  backingRSR_not?: InputMaybe<Scalars['BigInt']['input']>;
  backingRSR_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  backing_gt?: InputMaybe<Scalars['BigInt']['input']>;
  backing_gte?: InputMaybe<Scalars['BigInt']['input']>;
  backing_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  backing_lt?: InputMaybe<Scalars['BigInt']['input']>;
  backing_lte?: InputMaybe<Scalars['BigInt']['input']>;
  backing_not?: InputMaybe<Scalars['BigInt']['input']>;
  backing_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  basketsNeeded?: InputMaybe<Scalars['BigInt']['input']>;
  basketsNeeded_gt?: InputMaybe<Scalars['BigInt']['input']>;
  basketsNeeded_gte?: InputMaybe<Scalars['BigInt']['input']>;
  basketsNeeded_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  basketsNeeded_lt?: InputMaybe<Scalars['BigInt']['input']>;
  basketsNeeded_lte?: InputMaybe<Scalars['BigInt']['input']>;
  basketsNeeded_not?: InputMaybe<Scalars['BigInt']['input']>;
  basketsNeeded_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateralDistribution?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_contains?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_gt?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_gte?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateralDistribution_lt?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_lte?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_contains?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateralDistribution_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateralDistribution_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collaterals?: InputMaybe<Array<Scalars['String']['input']>>;
  collaterals_?: InputMaybe<Collateral_Filter>;
  collaterals_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  collaterals_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  collaterals_not?: InputMaybe<Array<Scalars['String']['input']>>;
  collaterals_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  collaterals_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  contracts_?: InputMaybe<RTokenContract_Filter>;
  createdBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRTokenRevenue?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenue_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenue_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenue_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRTokenRevenue_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenue_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenue_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRTokenRevenue_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeStakerRevenue?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeStakerRevenue_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeStakerRevenue_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeStakerRevenue_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeStakerRevenue_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeStakerRevenue_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeStakerRevenue_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeStakerRevenue_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailySnapshots_?: InputMaybe<RTokenDailySnapshot_Filter>;
  freezers?: InputMaybe<Array<Scalars['String']['input']>>;
  freezers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  freezers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  freezers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  freezers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  freezers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  historicalBaskets_?: InputMaybe<RTokenHistoricalBaskets_Filter>;
  holdersRewardShare?: InputMaybe<Scalars['BigDecimal']['input']>;
  holdersRewardShare_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  holdersRewardShare_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  holdersRewardShare_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  holdersRewardShare_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  holdersRewardShare_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  holdersRewardShare_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  holdersRewardShare_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlySnapshots_?: InputMaybe<RTokenHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  longFreezers?: InputMaybe<Array<Scalars['String']['input']>>;
  longFreezers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  longFreezers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  longFreezers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  longFreezers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  longFreezers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RToken_Filter>>>;
  owners?: InputMaybe<Array<Scalars['String']['input']>>;
  owners_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  owners_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  owners_not?: InputMaybe<Array<Scalars['String']['input']>>;
  owners_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  owners_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  pausers?: InputMaybe<Array<Scalars['String']['input']>>;
  pausers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pausers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  pausers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  pausers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pausers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<Protocol_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rawRsrExchangeRate?: InputMaybe<Scalars['BigInt']['input']>;
  rawRsrExchangeRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rawRsrExchangeRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rawRsrExchangeRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rawRsrExchangeRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rawRsrExchangeRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rawRsrExchangeRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  rawRsrExchangeRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  revenueDistribution_?: InputMaybe<RevenueDistribution_Filter>;
  rewardToken?: InputMaybe<Scalars['String']['input']>;
  rewardTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  rewardTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardToken_?: InputMaybe<RewardToken_Filter>;
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
  rsrExchangeRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrExchangeRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrExchangeRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrLocked?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrLocked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrLocked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_not?: InputMaybe<Scalars['BigInt']['input']>;
  rsrLocked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrStaked?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrStakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rsrStakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rsrStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rsrStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  rsrStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakersRewardShare?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakersRewardShare_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakersRewardShare_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakersRewardShare_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakersRewardShare_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakersRewardShare_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakersRewardShare_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakersRewardShare_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  targetUnits?: InputMaybe<Scalars['String']['input']>;
  targetUnits_contains?: InputMaybe<Scalars['String']['input']>;
  targetUnits_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  targetUnits_ends_with?: InputMaybe<Scalars['String']['input']>;
  targetUnits_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  targetUnits_gt?: InputMaybe<Scalars['String']['input']>;
  targetUnits_gte?: InputMaybe<Scalars['String']['input']>;
  targetUnits_in?: InputMaybe<Array<Scalars['String']['input']>>;
  targetUnits_lt?: InputMaybe<Scalars['String']['input']>;
  targetUnits_lte?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_contains?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  targetUnits_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  targetUnits_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  targetUnits_starts_with?: InputMaybe<Scalars['String']['input']>;
  targetUnits_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  totalDistributedRSRRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRSRRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRSRRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRSRRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDistributedRSRRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRSRRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRSRRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRSRRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDistributedRTokenRevenue?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRTokenRevenue_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRTokenRevenue_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRTokenRevenue_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDistributedRTokenRevenue_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRTokenRevenue_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRTokenRevenue_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDistributedRTokenRevenue_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRsrStaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRsrStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRsrUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalRsrUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalRsrUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  trades_?: InputMaybe<Trade_Filter>;
};

export enum RToken_OrderBy {
  Backing = 'backing',
  BackingRsr = 'backingRSR',
  BasketsNeeded = 'basketsNeeded',
  CollateralDistribution = 'collateralDistribution',
  Collaterals = 'collaterals',
  Contracts = 'contracts',
  CreatedBlockNumber = 'createdBlockNumber',
  CreatedTimestamp = 'createdTimestamp',
  CumulativeRTokenRevenue = 'cumulativeRTokenRevenue',
  CumulativeStakerRevenue = 'cumulativeStakerRevenue',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  DailySnapshots = 'dailySnapshots',
  Freezers = 'freezers',
  HistoricalBaskets = 'historicalBaskets',
  HoldersRewardShare = 'holdersRewardShare',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  LongFreezers = 'longFreezers',
  Owners = 'owners',
  Pausers = 'pausers',
  Protocol = 'protocol',
  ProtocolCumulativeRsrRevenueUsd = 'protocol__cumulativeRSRRevenueUSD',
  ProtocolCumulativeRTokenRevenueUsd = 'protocol__cumulativeRTokenRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolCumulativeVolumeUsd = 'protocol__cumulativeVolumeUSD',
  ProtocolId = 'protocol__id',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolRTokenCount = 'protocol__rTokenCount',
  ProtocolRsrLocked = 'protocol__rsrLocked',
  ProtocolRsrLockedUsd = 'protocol__rsrLockedUSD',
  ProtocolRsrRevenue = 'protocol__rsrRevenue',
  ProtocolRsrStaked = 'protocol__rsrStaked',
  ProtocolRsrStakedUsd = 'protocol__rsrStakedUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalRTokenUsd = 'protocol__totalRTokenUSD',
  ProtocolTotalRsrStaked = 'protocol__totalRsrStaked',
  ProtocolTotalRsrStakedUsd = 'protocol__totalRsrStakedUSD',
  ProtocolTotalRsrUnstaked = 'protocol__totalRsrUnstaked',
  ProtocolTotalRsrUnstakedUsd = 'protocol__totalRsrUnstakedUSD',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolTransactionCount = 'protocol__transactionCount',
  RawRsrExchangeRate = 'rawRsrExchangeRate',
  RevenueDistribution = 'revenueDistribution',
  RewardToken = 'rewardToken',
  RewardTokenSupply = 'rewardTokenSupply',
  RewardTokenId = 'rewardToken__id',
  RewardTokenType = 'rewardToken__type',
  RsrExchangeRate = 'rsrExchangeRate',
  RsrLocked = 'rsrLocked',
  RsrLockedUsd = 'rsrLockedUSD',
  RsrStaked = 'rsrStaked',
  RsrStakedUsd = 'rsrStakedUSD',
  StakersRewardShare = 'stakersRewardShare',
  TargetUnits = 'targetUnits',
  Token = 'token',
  TokenBasketRate = 'token__basketRate',
  TokenBurnCount = 'token__burnCount',
  TokenCumulativeVolume = 'token__cumulativeVolume',
  TokenDecimals = 'token__decimals',
  TokenHolderCount = 'token__holderCount',
  TokenId = 'token__id',
  TokenLastMarketCapUsd = 'token__lastMarketCapUSD',
  TokenLastPriceTimestamp = 'token__lastPriceTimestamp',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenMintCount = 'token__mintCount',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  TokenTotalBurned = 'token__totalBurned',
  TokenTotalMinted = 'token__totalMinted',
  TokenTotalSupply = 'token__totalSupply',
  TokenTransferCount = 'token__transferCount',
  TokenUserCount = 'token__userCount',
  TotalDistributedRsrRevenue = 'totalDistributedRSRRevenue',
  TotalDistributedRTokenRevenue = 'totalDistributedRTokenRevenue',
  TotalRsrStaked = 'totalRsrStaked',
  TotalRsrUnstaked = 'totalRsrUnstaked',
  Trades = 'trades'
}

export type RevenueDistribution = {
  __typename?: 'RevenueDistribution';
  /**  Destination address  */
  destination: Scalars['String']['output'];
  /**  { Address Of the Account }-{ Address of the RToken }  */
  id: Scalars['ID']['output'];
  /**  RToken entity  */
  rToken: RToken;
  /**  Number of shares in RToken  */
  rTokenDist: Scalars['Int']['output'];
  /**  Number of shares in RSR  */
  rsrDist: Scalars['Int']['output'];
};

export type RevenueDistribution_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RevenueDistribution_Filter>>>;
  destination?: InputMaybe<Scalars['String']['input']>;
  destination_contains?: InputMaybe<Scalars['String']['input']>;
  destination_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  destination_ends_with?: InputMaybe<Scalars['String']['input']>;
  destination_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  destination_gt?: InputMaybe<Scalars['String']['input']>;
  destination_gte?: InputMaybe<Scalars['String']['input']>;
  destination_in?: InputMaybe<Array<Scalars['String']['input']>>;
  destination_lt?: InputMaybe<Scalars['String']['input']>;
  destination_lte?: InputMaybe<Scalars['String']['input']>;
  destination_not?: InputMaybe<Scalars['String']['input']>;
  destination_not_contains?: InputMaybe<Scalars['String']['input']>;
  destination_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  destination_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  destination_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  destination_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  destination_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  destination_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  destination_starts_with?: InputMaybe<Scalars['String']['input']>;
  destination_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RevenueDistribution_Filter>>>;
  rToken?: InputMaybe<Scalars['String']['input']>;
  rTokenDist?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_gt?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_gte?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rTokenDist_lt?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_lte?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_not?: InputMaybe<Scalars['Int']['input']>;
  rTokenDist_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rsrDist?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_gt?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_gte?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rsrDist_lt?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_lte?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_not?: InputMaybe<Scalars['Int']['input']>;
  rsrDist_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum RevenueDistribution_OrderBy {
  Destination = 'destination',
  Id = 'id',
  RToken = 'rToken',
  RTokenDist = 'rTokenDist',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked',
  RsrDist = 'rsrDist'
}

export type RewardToken = {
  __typename?: 'RewardToken';
  /**  { Reward token type }-{ Smart contract address of the reward token }  */
  id: Scalars['ID']['output'];
  /**  RToken relation  */
  rToken?: Maybe<RToken>;
  /**  Reference to the actual token  */
  token: Token;
  /**  The type of the reward token  */
  type: RewardTokenType;
};

export enum RewardTokenType {
  /**  For reward tokens awarded to borrowers  */
  Borrow = 'BORROW',
  /**  For reward tokens awarded to LPs/lenders  */
  Deposit = 'DEPOSIT'
}

export type RewardToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RewardToken_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RewardToken_Filter>>>;
  rToken?: InputMaybe<Scalars['String']['input']>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  type?: InputMaybe<RewardTokenType>;
  type_in?: InputMaybe<Array<RewardTokenType>>;
  type_not?: InputMaybe<RewardTokenType>;
  type_not_in?: InputMaybe<Array<RewardTokenType>>;
};

export enum RewardToken_OrderBy {
  Id = 'id',
  RToken = 'rToken',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked',
  Token = 'token',
  TokenBasketRate = 'token__basketRate',
  TokenBurnCount = 'token__burnCount',
  TokenCumulativeVolume = 'token__cumulativeVolume',
  TokenDecimals = 'token__decimals',
  TokenHolderCount = 'token__holderCount',
  TokenId = 'token__id',
  TokenLastMarketCapUsd = 'token__lastMarketCapUSD',
  TokenLastPriceTimestamp = 'token__lastPriceTimestamp',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenMintCount = 'token__mintCount',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  TokenTotalBurned = 'token__totalBurned',
  TokenTotalMinted = 'token__totalMinted',
  TokenTotalSupply = 'token__totalSupply',
  TokenTransferCount = 'token__transferCount',
  TokenUserCount = 'token__userCount',
  Type = 'type'
}

/**  Match timelock id with proposal id  */
export type TimelockProposal = {
  __typename?: 'TimelockProposal';
  /**  Timelock id  */
  id: Scalars['ID']['output'];
  /**  Proposal entity ID  */
  proposalId: Scalars['String']['output'];
};

export type TimelockProposal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TimelockProposal_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TimelockProposal_Filter>>>;
  proposalId?: InputMaybe<Scalars['String']['input']>;
  proposalId_contains?: InputMaybe<Scalars['String']['input']>;
  proposalId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposalId_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposalId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposalId_gt?: InputMaybe<Scalars['String']['input']>;
  proposalId_gte?: InputMaybe<Scalars['String']['input']>;
  proposalId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposalId_lt?: InputMaybe<Scalars['String']['input']>;
  proposalId_lte?: InputMaybe<Scalars['String']['input']>;
  proposalId_not?: InputMaybe<Scalars['String']['input']>;
  proposalId_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposalId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposalId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposalId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposalId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposalId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposalId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposalId_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposalId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum TimelockProposal_OrderBy {
  Id = 'id',
  ProposalId = 'proposalId'
}

export type Token = {
  __typename?: 'Token';
  /**  Exchange rate between basket units to totalSupply of rToken  */
  basketRate: Scalars['BigDecimal']['output'];
  /**  Total number of token burn events  */
  burnCount: Scalars['BigInt']['output'];
  /**  Cumulative all time token transfers volume  */
  cumulativeVolume: Scalars['BigInt']['output'];
  /**  Daily snapshot for this token  */
  dailyTokenSnapshot: Array<TokenDailySnapshot>;
  /**  The number of decimal places this token uses, default to 18  */
  decimals: Scalars['Int']['output'];
  /**  Number of unique token holders  */
  holderCount: Scalars['BigInt']['output'];
  /**  Token holder's balance  */
  holdersBalance: Array<AccountBalance>;
  /**  Hourly snapshot for this token  */
  hourlyTokenSnapshot: Array<TokenHourlySnapshot>;
  /**  Smart contract address of the token  */
  id: Scalars['ID']['output'];
  /**  last market cap in USD */
  lastMarketCapUSD: Scalars['BigDecimal']['output'];
  /**  Optional field to track the block number of the last token price  */
  lastPriceTimestamp: Scalars['BigInt']['output'];
  /**  USD Price  */
  lastPriceUSD: Scalars['BigDecimal']['output'];
  /**  Total number of token mint events  */
  mintCount: Scalars['BigInt']['output'];
  /**  Name of the token, mirrored from the smart contract  */
  name: Scalars['String']['output'];
  /**  RToken relation  */
  rToken?: Maybe<RToken>;
  /**  List of token entries  */
  records: Array<Entry>;
  /**  Symbol of the token, mirrored from the smart contract  */
  symbol: Scalars['String']['output'];
  /**  Total token burned  */
  totalBurned: Scalars['BigInt']['output'];
  /**  Total token minted  */
  totalMinted: Scalars['BigInt']['output'];
  /**  Total token supply  */
  totalSupply: Scalars['BigInt']['output'];
  /**  Total number of token transfer events  */
  transferCount: Scalars['BigInt']['output'];
  /**  Number of unique token users  */
  userCount: Scalars['Int']['output'];
};


export type TokenDailyTokenSnapshotArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenDailySnapshot_Filter>;
};


export type TokenHoldersBalanceArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccountBalance_Filter>;
};


export type TokenHourlyTokenSnapshotArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenHourlySnapshot_Filter>;
};


export type TokenRecordsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Entry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Entry_Filter>;
};

export type TokenDailySnapshot = {
  __typename?: 'TokenDailySnapshot';
  /**  Exchange rate between basket units to totalSupply of rToken  */
  basketRate: Scalars['BigDecimal']['output'];
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  # of cumulative unique users/holders  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  # of unique daily active users/holders  */
  dailyActiveUsers: Scalars['Int']['output'];
  /**  Total number of token burnt in a day  */
  dailyBurnAmount: Scalars['BigInt']['output'];
  /**  Total number of burns in a day  */
  dailyBurnCount: Scalars['Int']['output'];
  /**  Total number of events occurred in a day  */
  dailyEventCount: Scalars['Int']['output'];
  /**  # of accounts holding this token  */
  dailyHolderCount: Scalars['Int']['output'];
  /**  Total number of token minted in a day  */
  dailyMintAmount: Scalars['BigInt']['output'];
  /**  Total number of mints in a day  */
  dailyMintCount: Scalars['Int']['output'];
  /**  Daily total Supply of the token  */
  dailyTotalSupply: Scalars['BigInt']['output'];
  /**  Daily transfer volume  */
  dailyVolume: Scalars['BigInt']['output'];
  /**  { Token Address }-{ # of days since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  USD Price  */
  priceUSD: Scalars['BigDecimal']['output'];
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Token this snapshot is associated with  */
  token: Token;
};

export type TokenDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenDailySnapshot_Filter>>>;
  basketRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  basketRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyActiveUsers?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyActiveUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_not?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  dailyHolderCount?: InputMaybe<Scalars['Int']['input']>;
  dailyHolderCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyHolderCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyHolderCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyHolderCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyHolderCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyHolderCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyHolderCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  dailyTotalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyTotalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyTotalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyVolume?: InputMaybe<Scalars['BigInt']['input']>;
  dailyVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenDailySnapshot_Filter>>>;
  priceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  priceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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

export enum TokenDailySnapshot_OrderBy {
  BasketRate = 'basketRate',
  BlockNumber = 'blockNumber',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  DailyActiveUsers = 'dailyActiveUsers',
  DailyBurnAmount = 'dailyBurnAmount',
  DailyBurnCount = 'dailyBurnCount',
  DailyEventCount = 'dailyEventCount',
  DailyHolderCount = 'dailyHolderCount',
  DailyMintAmount = 'dailyMintAmount',
  DailyMintCount = 'dailyMintCount',
  DailyTotalSupply = 'dailyTotalSupply',
  DailyVolume = 'dailyVolume',
  Id = 'id',
  PriceUsd = 'priceUSD',
  Timestamp = 'timestamp',
  Token = 'token',
  TokenBasketRate = 'token__basketRate',
  TokenBurnCount = 'token__burnCount',
  TokenCumulativeVolume = 'token__cumulativeVolume',
  TokenDecimals = 'token__decimals',
  TokenHolderCount = 'token__holderCount',
  TokenId = 'token__id',
  TokenLastMarketCapUsd = 'token__lastMarketCapUSD',
  TokenLastPriceTimestamp = 'token__lastPriceTimestamp',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenMintCount = 'token__mintCount',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  TokenTotalBurned = 'token__totalBurned',
  TokenTotalMinted = 'token__totalMinted',
  TokenTotalSupply = 'token__totalSupply',
  TokenTransferCount = 'token__transferCount',
  TokenUserCount = 'token__userCount'
}

export type TokenHolder = {
  __typename?: 'TokenHolder';
  /** AccountRToken relationship */
  accountRToken: AccountRToken;
  /** Holder address */
  address: Scalars['String']['output'];
  /** Delegate address of the token holder which will participate in votings. Delegates don't need to hold any tokens and can even be the token holder itself. */
  delegate?: Maybe<Delegate>;
  /** Governance */
  governance: Governance;
  /** A TokenHolder is any address that holds any amount of tokens, the id used is the blockchain address. */
  id: Scalars['ID']['output'];
  /** Token balance of this address expressed as a BigDecimal normalized value */
  tokenBalance: Scalars['BigDecimal']['output'];
  /** Token balance of this address expressed in the smallest unit of the token */
  tokenBalanceRaw: Scalars['BigInt']['output'];
  /** Total amount of tokens ever held by this address expressed as a BigDecimal normalized value */
  totalTokensHeld: Scalars['BigDecimal']['output'];
  /** Total amount of tokens ever held by this address expressed in the smallest unit of the token */
  totalTokensHeldRaw: Scalars['BigInt']['output'];
};

export type TokenHolder_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accountRToken?: InputMaybe<Scalars['String']['input']>;
  accountRToken_?: InputMaybe<AccountRToken_Filter>;
  accountRToken_contains?: InputMaybe<Scalars['String']['input']>;
  accountRToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  accountRToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  accountRToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  accountRToken_gt?: InputMaybe<Scalars['String']['input']>;
  accountRToken_gte?: InputMaybe<Scalars['String']['input']>;
  accountRToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  accountRToken_lt?: InputMaybe<Scalars['String']['input']>;
  accountRToken_lte?: InputMaybe<Scalars['String']['input']>;
  accountRToken_not?: InputMaybe<Scalars['String']['input']>;
  accountRToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  accountRToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  accountRToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  accountRToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  accountRToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  accountRToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  accountRToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  accountRToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  accountRToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  and?: InputMaybe<Array<InputMaybe<TokenHolder_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<TokenHolder_Filter>>>;
  tokenBalance?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenBalanceRaw?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenBalanceRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenBalance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenBalance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenBalance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenBalance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenBalance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenBalance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalTokensHeld?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalTokensHeldRaw?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokensHeldRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokensHeld_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalTokensHeld_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalTokensHeld_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalTokensHeld_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalTokensHeld_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalTokensHeld_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalTokensHeld_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum TokenHolder_OrderBy {
  AccountRToken = 'accountRToken',
  AccountRTokenBlockNumber = 'accountRToken__blockNumber',
  AccountRTokenId = 'accountRToken__id',
  AccountRTokenPendingUnstake = 'accountRToken__pendingUnstake',
  AccountRTokenStake = 'accountRToken__stake',
  AccountRTokenTimestamp = 'accountRToken__timestamp',
  AccountRTokenTotalRsrStaked = 'accountRToken__totalRSRStaked',
  AccountRTokenTotalRsrUnstaked = 'accountRToken__totalRSRUnstaked',
  AccountRTokenTotalStaked = 'accountRToken__totalStaked',
  AccountRTokenTotalUnstaked = 'accountRToken__totalUnstaked',
  Address = 'address',
  Delegate = 'delegate',
  DelegateAddress = 'delegate__address',
  DelegateDelegatedVotes = 'delegate__delegatedVotes',
  DelegateDelegatedVotesRaw = 'delegate__delegatedVotesRaw',
  DelegateId = 'delegate__id',
  DelegateNumberVotes = 'delegate__numberVotes',
  DelegateTokenHoldersRepresentedAmount = 'delegate__tokenHoldersRepresentedAmount',
  Governance = 'governance',
  GovernanceCurrentDelegates = 'governance__currentDelegates',
  GovernanceCurrentTokenHolders = 'governance__currentTokenHolders',
  GovernanceDelegatedVotes = 'governance__delegatedVotes',
  GovernanceDelegatedVotesRaw = 'governance__delegatedVotesRaw',
  GovernanceId = 'governance__id',
  GovernanceProposals = 'governance__proposals',
  GovernanceProposalsCanceled = 'governance__proposalsCanceled',
  GovernanceProposalsExecuted = 'governance__proposalsExecuted',
  GovernanceProposalsQueued = 'governance__proposalsQueued',
  GovernanceTotalDelegates = 'governance__totalDelegates',
  GovernanceTotalTokenHolders = 'governance__totalTokenHolders',
  GovernanceTotalTokenSupply = 'governance__totalTokenSupply',
  Id = 'id',
  TokenBalance = 'tokenBalance',
  TokenBalanceRaw = 'tokenBalanceRaw',
  TotalTokensHeld = 'totalTokensHeld',
  TotalTokensHeldRaw = 'totalTokensHeldRaw'
}

export type TokenHourlySnapshot = {
  __typename?: 'TokenHourlySnapshot';
  /**  Exchange rate between basket units to totalSupply of rToken  */
  basketRate: Scalars['BigDecimal']['output'];
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  # of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  # of unique hourly active users  */
  hourlyActiveUsers: Scalars['Int']['output'];
  /**  Total number of token burnt in a hour  */
  hourlyBurnAmount: Scalars['BigInt']['output'];
  /**  Total number of burns in a hour  */
  hourlyBurnCount: Scalars['Int']['output'];
  /**  Total number of events occurred in an hour  */
  hourlyEventCount: Scalars['Int']['output'];
  /**  # of accounts holding this token  */
  hourlyHolderCount: Scalars['Int']['output'];
  /**  Total amount of token minted in a hour  */
  hourlyMintAmount: Scalars['BigInt']['output'];
  /**  Total number of mints in a hour  */
  hourlyMintCount: Scalars['Int']['output'];
  /**  Hourly total Supply of the token  */
  hourlyTotalSupply: Scalars['BigInt']['output'];
  /**  Hourly transfer volume  */
  hourlyVolume: Scalars['BigInt']['output'];
  /**  { Token Address }-{ # of hours since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  USD Price  */
  priceUSD: Scalars['BigDecimal']['output'];
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Token this snapshot is associated with  */
  token: Token;
};

export type TokenHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenHourlySnapshot_Filter>>>;
  basketRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  basketRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyActiveUsers?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyActiveUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  hourlyHolderCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyHolderCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyHolderCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyHolderCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyHolderCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyHolderCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyHolderCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyHolderCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  hourlyTotalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyTotalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyTotalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyVolume?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenHourlySnapshot_Filter>>>;
  priceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  priceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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

export enum TokenHourlySnapshot_OrderBy {
  BasketRate = 'basketRate',
  BlockNumber = 'blockNumber',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  HourlyActiveUsers = 'hourlyActiveUsers',
  HourlyBurnAmount = 'hourlyBurnAmount',
  HourlyBurnCount = 'hourlyBurnCount',
  HourlyEventCount = 'hourlyEventCount',
  HourlyHolderCount = 'hourlyHolderCount',
  HourlyMintAmount = 'hourlyMintAmount',
  HourlyMintCount = 'hourlyMintCount',
  HourlyTotalSupply = 'hourlyTotalSupply',
  HourlyVolume = 'hourlyVolume',
  Id = 'id',
  PriceUsd = 'priceUSD',
  Timestamp = 'timestamp',
  Token = 'token',
  TokenBasketRate = 'token__basketRate',
  TokenBurnCount = 'token__burnCount',
  TokenCumulativeVolume = 'token__cumulativeVolume',
  TokenDecimals = 'token__decimals',
  TokenHolderCount = 'token__holderCount',
  TokenId = 'token__id',
  TokenLastMarketCapUsd = 'token__lastMarketCapUSD',
  TokenLastPriceTimestamp = 'token__lastPriceTimestamp',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenMintCount = 'token__mintCount',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  TokenTotalBurned = 'token__totalBurned',
  TokenTotalMinted = 'token__totalMinted',
  TokenTotalSupply = 'token__totalSupply',
  TokenTransferCount = 'token__transferCount',
  TokenUserCount = 'token__userCount'
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  basketRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  basketRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  basketRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  burnCount?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  burnCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  burnCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolume?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyTokenSnapshot_?: InputMaybe<TokenDailySnapshot_Filter>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  holderCount?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  holderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  holderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  holdersBalance_?: InputMaybe<AccountBalance_Filter>;
  hourlyTokenSnapshot_?: InputMaybe<TokenHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastMarketCapUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastMarketCapUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastMarketCapUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastMarketCapUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastMarketCapUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastMarketCapUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastMarketCapUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastMarketCapUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPriceTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastPriceTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  rToken?: InputMaybe<Scalars['String']['input']>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  records_?: InputMaybe<Entry_Filter>;
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
  userCount?: InputMaybe<Scalars['Int']['input']>;
  userCount_gt?: InputMaybe<Scalars['Int']['input']>;
  userCount_gte?: InputMaybe<Scalars['Int']['input']>;
  userCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  userCount_lt?: InputMaybe<Scalars['Int']['input']>;
  userCount_lte?: InputMaybe<Scalars['Int']['input']>;
  userCount_not?: InputMaybe<Scalars['Int']['input']>;
  userCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum Token_OrderBy {
  BasketRate = 'basketRate',
  BurnCount = 'burnCount',
  CumulativeVolume = 'cumulativeVolume',
  DailyTokenSnapshot = 'dailyTokenSnapshot',
  Decimals = 'decimals',
  HolderCount = 'holderCount',
  HoldersBalance = 'holdersBalance',
  HourlyTokenSnapshot = 'hourlyTokenSnapshot',
  Id = 'id',
  LastMarketCapUsd = 'lastMarketCapUSD',
  LastPriceTimestamp = 'lastPriceTimestamp',
  LastPriceUsd = 'lastPriceUSD',
  MintCount = 'mintCount',
  Name = 'name',
  RToken = 'rToken',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked',
  Records = 'records',
  Symbol = 'symbol',
  TotalBurned = 'totalBurned',
  TotalMinted = 'totalMinted',
  TotalSupply = 'totalSupply',
  TransferCount = 'transferCount',
  UserCount = 'userCount'
}

export type Trade = {
  __typename?: 'Trade';
  /**  Auction trade amount  */
  amount: Scalars['BigDecimal']['output'];
  /**  GnosisAuctionId - Optional not required for dutchTrades  */
  auctionId?: Maybe<Scalars['BigInt']['output']>;
  /**  amount bought (on settle)  */
  boughtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Buying token  */
  buying: Scalars['String']['output'];
  /**  Buying token decimals  */
  buyingTokenDecimals: Scalars['Int']['output'];
  /**  Buy token symbol  */
  buyingTokenSymbol: Scalars['String']['output'];
  /**  End time timestamp  */
  endAt: Scalars['BigInt']['output'];
  /**  { Smart contract address of the auction }  */
  id: Scalars['ID']['output'];
  /**  Is settle check  */
  isSettled: Scalars['Boolean']['output'];
  /**  Trade kind 0 = dutch 1 = batch  */
  kind: Scalars['Int']['output'];
  /**  Min buy amount  */
  minBuyAmount: Scalars['BigDecimal']['output'];
  /**  rToken id  */
  rToken: RToken;
  /**  Selling token  */
  selling: Scalars['String']['output'];
  /** Sell token decimals */
  sellingTokenDecimals: Scalars['Int']['output'];
  /**  Sell tokens symbol  */
  sellingTokenSymbol: Scalars['String']['output'];
  /**  Settle tx hash  */
  settleTxHash?: Maybe<Scalars['String']['output']>;
  /**  started At timestamp  */
  startedAt: Scalars['BigInt']['output'];
  /**  Worst case price  */
  worstCasePrice: Scalars['BigDecimal']['output'];
};

export type Trade_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Trade_Filter>>>;
  auctionId?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  auctionId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_not?: InputMaybe<Scalars['BigInt']['input']>;
  auctionId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  boughtAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  boughtAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  boughtAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  boughtAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  boughtAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  boughtAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  boughtAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  boughtAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  buying?: InputMaybe<Scalars['String']['input']>;
  buyingTokenDecimals?: InputMaybe<Scalars['Int']['input']>;
  buyingTokenDecimals_gt?: InputMaybe<Scalars['Int']['input']>;
  buyingTokenDecimals_gte?: InputMaybe<Scalars['Int']['input']>;
  buyingTokenDecimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  buyingTokenDecimals_lt?: InputMaybe<Scalars['Int']['input']>;
  buyingTokenDecimals_lte?: InputMaybe<Scalars['Int']['input']>;
  buyingTokenDecimals_not?: InputMaybe<Scalars['Int']['input']>;
  buyingTokenDecimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  buyingTokenSymbol?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_contains?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_gt?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_gte?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  buyingTokenSymbol_lt?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_lte?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_not?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  buyingTokenSymbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  buyingTokenSymbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buying_contains?: InputMaybe<Scalars['String']['input']>;
  buying_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  buying_ends_with?: InputMaybe<Scalars['String']['input']>;
  buying_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buying_gt?: InputMaybe<Scalars['String']['input']>;
  buying_gte?: InputMaybe<Scalars['String']['input']>;
  buying_in?: InputMaybe<Array<Scalars['String']['input']>>;
  buying_lt?: InputMaybe<Scalars['String']['input']>;
  buying_lte?: InputMaybe<Scalars['String']['input']>;
  buying_not?: InputMaybe<Scalars['String']['input']>;
  buying_not_contains?: InputMaybe<Scalars['String']['input']>;
  buying_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  buying_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  buying_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buying_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  buying_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  buying_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  buying_starts_with?: InputMaybe<Scalars['String']['input']>;
  buying_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  endAt?: InputMaybe<Scalars['BigInt']['input']>;
  endAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  endAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isSettled?: InputMaybe<Scalars['Boolean']['input']>;
  isSettled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isSettled_not?: InputMaybe<Scalars['Boolean']['input']>;
  isSettled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  kind?: InputMaybe<Scalars['Int']['input']>;
  kind_gt?: InputMaybe<Scalars['Int']['input']>;
  kind_gte?: InputMaybe<Scalars['Int']['input']>;
  kind_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  kind_lt?: InputMaybe<Scalars['Int']['input']>;
  kind_lte?: InputMaybe<Scalars['Int']['input']>;
  kind_not?: InputMaybe<Scalars['Int']['input']>;
  kind_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minBuyAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  minBuyAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  minBuyAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  minBuyAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  minBuyAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  minBuyAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  minBuyAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  minBuyAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Trade_Filter>>>;
  rToken?: InputMaybe<Scalars['String']['input']>;
  rToken_?: InputMaybe<RToken_Filter>;
  rToken_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_gt?: InputMaybe<Scalars['String']['input']>;
  rToken_gte?: InputMaybe<Scalars['String']['input']>;
  rToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_lt?: InputMaybe<Scalars['String']['input']>;
  rToken_lte?: InputMaybe<Scalars['String']['input']>;
  rToken_not?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  selling?: InputMaybe<Scalars['String']['input']>;
  sellingTokenDecimals?: InputMaybe<Scalars['Int']['input']>;
  sellingTokenDecimals_gt?: InputMaybe<Scalars['Int']['input']>;
  sellingTokenDecimals_gte?: InputMaybe<Scalars['Int']['input']>;
  sellingTokenDecimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  sellingTokenDecimals_lt?: InputMaybe<Scalars['Int']['input']>;
  sellingTokenDecimals_lte?: InputMaybe<Scalars['Int']['input']>;
  sellingTokenDecimals_not?: InputMaybe<Scalars['Int']['input']>;
  sellingTokenDecimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  sellingTokenSymbol?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_contains?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_gt?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_gte?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sellingTokenSymbol_lt?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_lte?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_not?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sellingTokenSymbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  sellingTokenSymbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  selling_contains?: InputMaybe<Scalars['String']['input']>;
  selling_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  selling_ends_with?: InputMaybe<Scalars['String']['input']>;
  selling_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  selling_gt?: InputMaybe<Scalars['String']['input']>;
  selling_gte?: InputMaybe<Scalars['String']['input']>;
  selling_in?: InputMaybe<Array<Scalars['String']['input']>>;
  selling_lt?: InputMaybe<Scalars['String']['input']>;
  selling_lte?: InputMaybe<Scalars['String']['input']>;
  selling_not?: InputMaybe<Scalars['String']['input']>;
  selling_not_contains?: InputMaybe<Scalars['String']['input']>;
  selling_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  selling_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  selling_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  selling_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  selling_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  selling_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  selling_starts_with?: InputMaybe<Scalars['String']['input']>;
  selling_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  settleTxHash?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_contains?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_gt?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_gte?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  settleTxHash_lt?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_lte?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_not?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  settleTxHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  settleTxHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  startedAt?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  startedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  worstCasePrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  worstCasePrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  worstCasePrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  worstCasePrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  worstCasePrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  worstCasePrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  worstCasePrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  worstCasePrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum Trade_OrderBy {
  Amount = 'amount',
  AuctionId = 'auctionId',
  BoughtAmount = 'boughtAmount',
  Buying = 'buying',
  BuyingTokenDecimals = 'buyingTokenDecimals',
  BuyingTokenSymbol = 'buyingTokenSymbol',
  EndAt = 'endAt',
  Id = 'id',
  IsSettled = 'isSettled',
  Kind = 'kind',
  MinBuyAmount = 'minBuyAmount',
  RToken = 'rToken',
  RTokenBacking = 'rToken__backing',
  RTokenBackingRsr = 'rToken__backingRSR',
  RTokenBasketsNeeded = 'rToken__basketsNeeded',
  RTokenCollateralDistribution = 'rToken__collateralDistribution',
  RTokenCreatedBlockNumber = 'rToken__createdBlockNumber',
  RTokenCreatedTimestamp = 'rToken__createdTimestamp',
  RTokenCumulativeRTokenRevenue = 'rToken__cumulativeRTokenRevenue',
  RTokenCumulativeStakerRevenue = 'rToken__cumulativeStakerRevenue',
  RTokenCumulativeUniqueUsers = 'rToken__cumulativeUniqueUsers',
  RTokenHoldersRewardShare = 'rToken__holdersRewardShare',
  RTokenId = 'rToken__id',
  RTokenRawRsrExchangeRate = 'rToken__rawRsrExchangeRate',
  RTokenRewardTokenSupply = 'rToken__rewardTokenSupply',
  RTokenRsrExchangeRate = 'rToken__rsrExchangeRate',
  RTokenRsrLocked = 'rToken__rsrLocked',
  RTokenRsrLockedUsd = 'rToken__rsrLockedUSD',
  RTokenRsrStaked = 'rToken__rsrStaked',
  RTokenRsrStakedUsd = 'rToken__rsrStakedUSD',
  RTokenStakersRewardShare = 'rToken__stakersRewardShare',
  RTokenTargetUnits = 'rToken__targetUnits',
  RTokenTotalDistributedRsrRevenue = 'rToken__totalDistributedRSRRevenue',
  RTokenTotalDistributedRTokenRevenue = 'rToken__totalDistributedRTokenRevenue',
  RTokenTotalRsrStaked = 'rToken__totalRsrStaked',
  RTokenTotalRsrUnstaked = 'rToken__totalRsrUnstaked',
  Selling = 'selling',
  SellingTokenDecimals = 'sellingTokenDecimals',
  SellingTokenSymbol = 'sellingTokenSymbol',
  SettleTxHash = 'settleTxHash',
  StartedAt = 'startedAt',
  WorstCasePrice = 'worstCasePrice'
}

export type UsageMetricsDailySnapshot = {
  __typename?: 'UsageMetricsDailySnapshot';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Cumulative Staked RSR  */
  cumulativeRSRStaked: Scalars['BigInt']['output'];
  /**  Cumulative Staked RSR USD */
  cumulativeRSRStakedUSD: Scalars['BigDecimal']['output'];
  /**  Cumulative Staked RSR  */
  cumulativeRSRUnstaked: Scalars['BigInt']['output'];
  /**  Cumulative Staked RSR USD */
  cumulativeRSRUnstakedUSD: Scalars['BigDecimal']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Number of unique daily active users  */
  dailyActiveUsers: Scalars['Int']['output'];
  /**  All daily RSR staked  */
  dailyRSRStaked: Scalars['BigInt']['output'];
  /**  Total USD value of stake rsr from the day */
  dailyRSRStakedUSD: Scalars['BigDecimal']['output'];
  /**  All daily RSR Unstaked  */
  dailyRSRUnstaked: Scalars['BigInt']['output'];
  /**  Total USD value of stake rsr from the day */
  dailyRSRUnstakedUSD: Scalars['BigDecimal']['output'];
  /**  Total number of transactions occurred in a day. Transactions include all entities that implement the Event interface.  */
  dailyTransactionCount: Scalars['Int']['output'];
  /**  ID is # of days since Unix epoch time  */
  id: Scalars['ID']['output'];
  /**  Protocol this snapshot is associated with  */
  protocol: Protocol;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
};

export type UsageMetricsDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UsageMetricsDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRStaked?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRStakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRUnstakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyActiveUsers?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyActiveUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_not?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyRSRStaked?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRStakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRStakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRStakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyRSRStakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRStakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRStakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRStakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyRSRStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyRSRStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyRSRUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRUnstakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRUnstakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRUnstakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyRSRUnstakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRUnstakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRUnstakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyRSRUnstakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyRSRUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyRSRUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  dailyRSRUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyTransactionCount?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyTransactionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UsageMetricsDailySnapshot_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<Protocol_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum UsageMetricsDailySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CumulativeRsrStaked = 'cumulativeRSRStaked',
  CumulativeRsrStakedUsd = 'cumulativeRSRStakedUSD',
  CumulativeRsrUnstaked = 'cumulativeRSRUnstaked',
  CumulativeRsrUnstakedUsd = 'cumulativeRSRUnstakedUSD',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  DailyActiveUsers = 'dailyActiveUsers',
  DailyRsrStaked = 'dailyRSRStaked',
  DailyRsrStakedUsd = 'dailyRSRStakedUSD',
  DailyRsrUnstaked = 'dailyRSRUnstaked',
  DailyRsrUnstakedUsd = 'dailyRSRUnstakedUSD',
  DailyTransactionCount = 'dailyTransactionCount',
  Id = 'id',
  Protocol = 'protocol',
  ProtocolCumulativeRsrRevenueUsd = 'protocol__cumulativeRSRRevenueUSD',
  ProtocolCumulativeRTokenRevenueUsd = 'protocol__cumulativeRTokenRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolCumulativeVolumeUsd = 'protocol__cumulativeVolumeUSD',
  ProtocolId = 'protocol__id',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolRTokenCount = 'protocol__rTokenCount',
  ProtocolRsrLocked = 'protocol__rsrLocked',
  ProtocolRsrLockedUsd = 'protocol__rsrLockedUSD',
  ProtocolRsrRevenue = 'protocol__rsrRevenue',
  ProtocolRsrStaked = 'protocol__rsrStaked',
  ProtocolRsrStakedUsd = 'protocol__rsrStakedUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalRTokenUsd = 'protocol__totalRTokenUSD',
  ProtocolTotalRsrStaked = 'protocol__totalRsrStaked',
  ProtocolTotalRsrStakedUsd = 'protocol__totalRsrStakedUSD',
  ProtocolTotalRsrUnstaked = 'protocol__totalRsrUnstaked',
  ProtocolTotalRsrUnstakedUsd = 'protocol__totalRsrUnstakedUSD',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolTransactionCount = 'protocol__transactionCount',
  Timestamp = 'timestamp'
}

export type UsageMetricsHourlySnapshot = {
  __typename?: 'UsageMetricsHourlySnapshot';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Cumulative Staked RSR  */
  cumulativeRSRStaked: Scalars['BigInt']['output'];
  /**  Cumulative Staked RSR USD */
  cumulativeRSRStakedUSD: Scalars['BigDecimal']['output'];
  /**  Cumulative Staked RSR  */
  cumulativeRSRUnstaked: Scalars['BigInt']['output'];
  /**  Cumulative Staked RSR USD */
  cumulativeRSRUnstakedUSD: Scalars['BigDecimal']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Number of unique hourly active users  */
  hourlyActiveUsers: Scalars['Int']['output'];
  /**  All daily RSR staked  */
  hourlyRSRStaked: Scalars['BigInt']['output'];
  /**  Total USD value of stake rsr from the day */
  hourlyRSRStakedUSD: Scalars['BigDecimal']['output'];
  /**  All hourly RSR Unstaked  */
  hourlyRSRUnstaked: Scalars['BigInt']['output'];
  /**  Total USD value of stake rsr from the day */
  hourlyRSRUnstakedUSD: Scalars['BigDecimal']['output'];
  /**  Total number of transactions occurred in an hour. Transactions include all entities that implement the Event interface.  */
  hourlyTransactionCount: Scalars['Int']['output'];
  /**  { # of hours since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Protocol this snapshot is associated with  */
  protocol: Protocol;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
};

export type UsageMetricsHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UsageMetricsHourlySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRStaked?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRStakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRStakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRUnstakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeRSRUnstakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeRSRUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeRSRUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeRSRUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyActiveUsers?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyActiveUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyRSRStaked?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRStakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRStakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRStakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyRSRStakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRStakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRStakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRStakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyRSRStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyRSRStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyRSRUnstaked?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstakedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRUnstakedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRUnstakedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRUnstakedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyRSRUnstakedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRUnstakedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRUnstakedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyRSRUnstakedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyRSRUnstaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyRSRUnstaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  hourlyRSRUnstaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlyTransactionCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyTransactionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UsageMetricsHourlySnapshot_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<Protocol_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum UsageMetricsHourlySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CumulativeRsrStaked = 'cumulativeRSRStaked',
  CumulativeRsrStakedUsd = 'cumulativeRSRStakedUSD',
  CumulativeRsrUnstaked = 'cumulativeRSRUnstaked',
  CumulativeRsrUnstakedUsd = 'cumulativeRSRUnstakedUSD',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  HourlyActiveUsers = 'hourlyActiveUsers',
  HourlyRsrStaked = 'hourlyRSRStaked',
  HourlyRsrStakedUsd = 'hourlyRSRStakedUSD',
  HourlyRsrUnstaked = 'hourlyRSRUnstaked',
  HourlyRsrUnstakedUsd = 'hourlyRSRUnstakedUSD',
  HourlyTransactionCount = 'hourlyTransactionCount',
  Id = 'id',
  Protocol = 'protocol',
  ProtocolCumulativeRsrRevenueUsd = 'protocol__cumulativeRSRRevenueUSD',
  ProtocolCumulativeRTokenRevenueUsd = 'protocol__cumulativeRTokenRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolCumulativeVolumeUsd = 'protocol__cumulativeVolumeUSD',
  ProtocolId = 'protocol__id',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolRTokenCount = 'protocol__rTokenCount',
  ProtocolRsrLocked = 'protocol__rsrLocked',
  ProtocolRsrLockedUsd = 'protocol__rsrLockedUSD',
  ProtocolRsrRevenue = 'protocol__rsrRevenue',
  ProtocolRsrStaked = 'protocol__rsrStaked',
  ProtocolRsrStakedUsd = 'protocol__rsrStakedUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalRTokenUsd = 'protocol__totalRTokenUSD',
  ProtocolTotalRsrStaked = 'protocol__totalRsrStaked',
  ProtocolTotalRsrStakedUsd = 'protocol__totalRsrStakedUSD',
  ProtocolTotalRsrUnstaked = 'protocol__totalRsrUnstaked',
  ProtocolTotalRsrUnstakedUsd = 'protocol__totalRsrUnstakedUSD',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolTransactionCount = 'protocol__transactionCount',
  Timestamp = 'timestamp'
}

export type Vote = {
  __typename?: 'Vote';
  /** Block number vote is cast in */
  block: Scalars['BigInt']['output'];
  /** Timestamp of block vote was cast in */
  blockTime: Scalars['BigInt']['output'];
  /** Unique ID based on the blockTime and logIndex */
  blockTimeId: Scalars['String']['output'];
  /** Whether the vote is in favour, against or abstaining to the proposal */
  choice: VoteChoice;
  /** Delegate ID + Proposal ID */
  id: Scalars['ID']['output'];
  /** Log Index of the event */
  logIndex: Scalars['BigInt']['output'];
  /** Proposal that is being voted on */
  proposal: Proposal;
  /** Reason for voting choice */
  reason?: Maybe<Scalars['String']['output']>;
  /** Transaction hash of the vote */
  txnHash: Scalars['String']['output'];
  /** Delegate that emitted the vote */
  voter: Delegate;
  /** Voting weight expressed in the vote */
  weight: Scalars['BigInt']['output'];
};

export enum VoteChoice {
  Abstain = 'ABSTAIN',
  Against = 'AGAINST',
  For = 'FOR'
}

export type VoteDailySnapshot = {
  __typename?: 'VoteDailySnapshot';
  /** Weighted votes for the proposal at snapshot */
  abstainWeightedVotes: Scalars['BigInt']['output'];
  /** Weighted votes abstaining to the proposal at snapshot */
  againstWeightedVotes: Scalars['BigInt']['output'];
  /** Block number of last block in snapshot */
  blockNumber: Scalars['BigInt']['output'];
  /** Weighted votes against the proposal at snapshot */
  forWeightedVotes: Scalars['BigInt']['output'];
  /** Number of days from Unix epoch time */
  id: Scalars['ID']['output'];
  /** Proposal this snapshot is associated with */
  proposal: Proposal;
  /** Timestamp of snapshot */
  timestamp: Scalars['BigInt']['output'];
  /** Total weighted for/against/abstaining votes at snapshot */
  totalWeightedVotes: Scalars['BigInt']['output'];
};

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

export enum VoteDailySnapshot_OrderBy {
  AbstainWeightedVotes = 'abstainWeightedVotes',
  AgainstWeightedVotes = 'againstWeightedVotes',
  BlockNumber = 'blockNumber',
  ForWeightedVotes = 'forWeightedVotes',
  Id = 'id',
  Proposal = 'proposal',
  ProposalAbstainDelegateVotes = 'proposal__abstainDelegateVotes',
  ProposalAbstainWeightedVotes = 'proposal__abstainWeightedVotes',
  ProposalAgainstDelegateVotes = 'proposal__againstDelegateVotes',
  ProposalAgainstWeightedVotes = 'proposal__againstWeightedVotes',
  ProposalCancellationBlock = 'proposal__cancellationBlock',
  ProposalCancellationTime = 'proposal__cancellationTime',
  ProposalCancellationTxnHash = 'proposal__cancellationTxnHash',
  ProposalCreationBlock = 'proposal__creationBlock',
  ProposalCreationTime = 'proposal__creationTime',
  ProposalDelegatesAtStart = 'proposal__delegatesAtStart',
  ProposalDescription = 'proposal__description',
  ProposalEndBlock = 'proposal__endBlock',
  ProposalExecutionBlock = 'proposal__executionBlock',
  ProposalExecutionEta = 'proposal__executionETA',
  ProposalExecutionStartBlock = 'proposal__executionStartBlock',
  ProposalExecutionTime = 'proposal__executionTime',
  ProposalExecutionTxnHash = 'proposal__executionTxnHash',
  ProposalForDelegateVotes = 'proposal__forDelegateVotes',
  ProposalForWeightedVotes = 'proposal__forWeightedVotes',
  ProposalId = 'proposal__id',
  ProposalQueueBlock = 'proposal__queueBlock',
  ProposalQueueTime = 'proposal__queueTime',
  ProposalQueueTxnHash = 'proposal__queueTxnHash',
  ProposalQuorumVotes = 'proposal__quorumVotes',
  ProposalStartBlock = 'proposal__startBlock',
  ProposalState = 'proposal__state',
  ProposalTokenHoldersAtStart = 'proposal__tokenHoldersAtStart',
  ProposalTotalDelegateVotes = 'proposal__totalDelegateVotes',
  ProposalTotalWeightedVotes = 'proposal__totalWeightedVotes',
  ProposalTxnHash = 'proposal__txnHash',
  Timestamp = 'timestamp',
  TotalWeightedVotes = 'totalWeightedVotes'
}

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

export enum Vote_OrderBy {
  Block = 'block',
  BlockTime = 'blockTime',
  BlockTimeId = 'blockTimeId',
  Choice = 'choice',
  Id = 'id',
  LogIndex = 'logIndex',
  Proposal = 'proposal',
  ProposalAbstainDelegateVotes = 'proposal__abstainDelegateVotes',
  ProposalAbstainWeightedVotes = 'proposal__abstainWeightedVotes',
  ProposalAgainstDelegateVotes = 'proposal__againstDelegateVotes',
  ProposalAgainstWeightedVotes = 'proposal__againstWeightedVotes',
  ProposalCancellationBlock = 'proposal__cancellationBlock',
  ProposalCancellationTime = 'proposal__cancellationTime',
  ProposalCancellationTxnHash = 'proposal__cancellationTxnHash',
  ProposalCreationBlock = 'proposal__creationBlock',
  ProposalCreationTime = 'proposal__creationTime',
  ProposalDelegatesAtStart = 'proposal__delegatesAtStart',
  ProposalDescription = 'proposal__description',
  ProposalEndBlock = 'proposal__endBlock',
  ProposalExecutionBlock = 'proposal__executionBlock',
  ProposalExecutionEta = 'proposal__executionETA',
  ProposalExecutionStartBlock = 'proposal__executionStartBlock',
  ProposalExecutionTime = 'proposal__executionTime',
  ProposalExecutionTxnHash = 'proposal__executionTxnHash',
  ProposalForDelegateVotes = 'proposal__forDelegateVotes',
  ProposalForWeightedVotes = 'proposal__forWeightedVotes',
  ProposalId = 'proposal__id',
  ProposalQueueBlock = 'proposal__queueBlock',
  ProposalQueueTime = 'proposal__queueTime',
  ProposalQueueTxnHash = 'proposal__queueTxnHash',
  ProposalQuorumVotes = 'proposal__quorumVotes',
  ProposalStartBlock = 'proposal__startBlock',
  ProposalState = 'proposal__state',
  ProposalTokenHoldersAtStart = 'proposal__tokenHoldersAtStart',
  ProposalTotalDelegateVotes = 'proposal__totalDelegateVotes',
  ProposalTotalWeightedVotes = 'proposal__totalWeightedVotes',
  ProposalTxnHash = 'proposal__txnHash',
  Reason = 'reason',
  TxnHash = 'txnHash',
  Voter = 'voter',
  VoterAddress = 'voter__address',
  VoterDelegatedVotes = 'voter__delegatedVotes',
  VoterDelegatedVotesRaw = 'voter__delegatedVotesRaw',
  VoterId = 'voter__id',
  VoterNumberVotes = 'voter__numberVotes',
  VoterTokenHoldersRepresentedAmount = 'voter__tokenHoldersRepresentedAmount',
  Weight = 'weight'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type StTokenDailySnapshot = {
  __typename?: 'stTokenDailySnapshot';
  /** Block number of last block in snapshot */
  blockNumber: Scalars['BigInt']['output'];
  /** Number of delegates at snapshot */
  delegates: Scalars['BigInt']['output'];
  /** Governance */
  governance: Governance;
  /** Number of days from Unix epoch time */
  id: Scalars['ID']['output'];
  /** Timestamp of snapshot */
  timestamp: Scalars['BigInt']['output'];
  /** Number of tokenholders at snapshot */
  tokenHolders: Scalars['BigInt']['output'];
  /** Total Supply at snapshot */
  totalSupply: Scalars['BigInt']['output'];
};

export type StTokenDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StTokenDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegates?: InputMaybe<Scalars['BigInt']['input']>;
  delegates_gt?: InputMaybe<Scalars['BigInt']['input']>;
  delegates_gte?: InputMaybe<Scalars['BigInt']['input']>;
  delegates_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegates_lt?: InputMaybe<Scalars['BigInt']['input']>;
  delegates_lte?: InputMaybe<Scalars['BigInt']['input']>;
  delegates_not?: InputMaybe<Scalars['BigInt']['input']>;
  delegates_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<StTokenDailySnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenHolders?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHolders_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHolders_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHolders_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenHolders_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHolders_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHolders_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenHolders_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum StTokenDailySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  Delegates = 'delegates',
  Governance = 'governance',
  GovernanceCurrentDelegates = 'governance__currentDelegates',
  GovernanceCurrentTokenHolders = 'governance__currentTokenHolders',
  GovernanceDelegatedVotes = 'governance__delegatedVotes',
  GovernanceDelegatedVotesRaw = 'governance__delegatedVotesRaw',
  GovernanceId = 'governance__id',
  GovernanceProposals = 'governance__proposals',
  GovernanceProposalsCanceled = 'governance__proposalsCanceled',
  GovernanceProposalsExecuted = 'governance__proposalsExecuted',
  GovernanceProposalsQueued = 'governance__proposalsQueued',
  GovernanceTotalDelegates = 'governance__totalDelegates',
  GovernanceTotalTokenHolders = 'governance__totalTokenHolders',
  GovernanceTotalTokenSupply = 'governance__totalTokenSupply',
  Id = 'id',
  Timestamp = 'timestamp',
  TokenHolders = 'tokenHolders',
  TotalSupply = 'totalSupply'
}
