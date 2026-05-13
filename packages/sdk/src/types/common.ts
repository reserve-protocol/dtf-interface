import type { Address } from "viem";

import type { SupportedChainId } from "@/defaults";

export type BlockNumber = bigint;

export type DtfParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly blockNumber?: bigint;
};

export type Token = {
  readonly address: Address;
  readonly symbol: string;
  readonly name: string;
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

export type Timelock = {
  readonly address: Address;
  readonly guardians: readonly Address[];
  readonly optimisticProposers: readonly Address[];
  readonly executionDelay: number;
  readonly type: string;
};

export type OptimisticGovernanceSettings = {
  readonly vetoDelay: number;
  readonly vetoPeriod: number;
  readonly vetoThreshold: number;
  readonly proposalThrottleCapacity: bigint;
  readonly selectorRegistry: Address;
  readonly proposers: readonly Address[];
};

export type Governance = {
  readonly address: Address;
  readonly name: string;
  readonly version: string;
  readonly votingDelay: number;
  readonly votingPeriod: number;
  readonly proposalThreshold: number;
  readonly quorumVotes?: Amount;
  readonly quorumNumerator: number;
  readonly quorumDenominator: number;
  readonly quorum: number;
  readonly isOptimistic: boolean;
  readonly optimistic?: OptimisticGovernanceSettings;
  readonly timelock: Timelock;
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

export type DtfStatus = "active" | "deprecated" | "unsupported";

export type DtfBasketAsset = {
  readonly address: Address;
  readonly symbol: string;
  readonly name: string;
  readonly decimals: number;
  readonly amount: number;
  readonly amountRaw: string;
  readonly price: number;
  readonly weight: string;
  readonly priceSource?: string;
};

export type DtfBasketSummaryAsset = {
  readonly address: Address;
  readonly symbol: string;
  readonly name: string;
  readonly weight: string;
};

export type DtfMarketData = {
  readonly price: number;
  readonly marketCap: number;
  readonly totalSupply: number;
};

export type DtfPerformancePoint = {
  readonly timestamp: number;
  readonly value: number;
};

export type DtfBrand = {
  readonly icon?: string;
  readonly cover?: string;
  readonly tags?: readonly string[];
  readonly about?: string;
};

export type TokenPrice = {
  readonly address: Address;
  readonly price: number;
  readonly timestamp: number;
  readonly priceSources?: readonly string[];
  readonly source?: string;
};

export type TokenVolatility = "low" | "medium" | "high" | "degen";

export type GetTokenPricesParams = {
  readonly chainId: SupportedChainId;
  readonly addresses: readonly Address[];
};

export type GetTokenVolatilitiesParams = GetTokenPricesParams;
