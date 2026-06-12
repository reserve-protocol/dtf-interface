import type { Address } from "viem";

import type { Amount, Token } from "@/types/common";
import type { YieldDtfChainId } from "@/yield-dtf/config";

export type YieldDtfParams = {
  readonly address: Address;
  readonly chainId: YieldDtfChainId;
};

export type YieldDtfRoles = {
  readonly owners: readonly Address[];
  readonly pausers: readonly Address[];
  readonly freezers: readonly Address[];
  readonly longFreezers: readonly Address[];
};

export type YieldDtfRevenueSplit = {
  /** Percentage of revenue to Yield DTF holders (via furnace), 0-100. */
  readonly holders: number;
  /** Percentage of revenue to RSR stakers, 0-100. */
  readonly stakers: number;
  readonly external: readonly {
    readonly destination: Address;
    readonly holdersShare: number;
    readonly stakersShare: number;
  }[];
};

export type YieldDtf = {
  readonly id: Address;
  readonly chainId: YieldDtfChainId;
  readonly token: Token & {
    readonly totalSupply: Amount;
    readonly holderCount: number;
    readonly transferCount: number;
    readonly mintCount: number;
    readonly burnCount: number;
  };
  readonly main: Address;
  readonly mandate: string;
  readonly stToken: Token;
  readonly collaterals: readonly Token[];
  /** Concatenated unique target unit names, e.g. "USD" or "ETHUSD". */
  readonly targetUnits: string;
  readonly basketsNeeded: Amount;
  readonly roles: YieldDtfRoles;
  readonly staking: {
    readonly rsrStaked: Amount;
    readonly rsrStakedUsd: number;
    /** RSR per stRSR; grows as revenue accrues to stakers (display-class). */
    readonly exchangeRate: number;
    readonly stTokenSupply: Amount;
  };
  readonly revenueSplit: YieldDtfRevenueSplit;
  readonly createdAt: number;
};

export type YieldDtfSummary = {
  readonly id: Address;
  readonly chainId: YieldDtfChainId;
  readonly token: Token & {
    readonly totalSupply: Amount;
    readonly holderCount: number;
  };
  readonly targetUnits: string;
  readonly rsrStaked: Amount;
  readonly basketsNeeded: Amount;
  readonly priceUsd: number;
  /** From the curated dtf-catalog; absent for unlisted Yield DTFs. */
  readonly status?: "active" | "unsupported" | "deprecated";
  readonly logo?: string;
};

export type YieldDtfContracts = {
  readonly token: Address;
  readonly main: Address;
  readonly stRsr: Address;
  readonly distributor: Address;
  readonly backingManager: Address;
  readonly rTokenTrader: Address;
  readonly rsrTrader: Address;
  readonly furnace: Address;
  readonly broker: Address;
  readonly assetRegistry: Address;
  readonly basketHandler: Address;
  /** Main contract version, e.g. "3.4.0". */
  readonly version: string;
};

export type YieldDtfThrottle = {
  /** Fixed hourly limit. */
  readonly amountRate: Amount;
  /** Hourly limit as a fraction of supply (D18). */
  readonly percentRate: Amount;
  /** Currently available to issue/redeem. */
  readonly available: Amount;
};

export type YieldDtfState = {
  readonly totalSupply: Amount;
  readonly basketsNeeded: Amount;
  readonly stTokenSupply: Amount;
  /** RSR per stRSR (D18). */
  readonly exchangeRate: Amount;
  readonly issuance: YieldDtfThrottle;
  readonly redemption: YieldDtfThrottle;
  readonly basketNonce: number;
  readonly isCollateralized: boolean;
  readonly tradingPaused: boolean;
  readonly issuancePaused: boolean;
  readonly frozen: boolean;
};

export type YieldDtfPrice = {
  readonly address: Address;
  readonly chainId: YieldDtfChainId;
  readonly low: Amount;
  readonly high: Amount;
  /** Midpoint of low/high (display-class). */
  readonly price: number;
  readonly timestamp: number;
};

export type YieldDtfBasketCollateral = {
  readonly address: Address;
  /** Share of basket value, 0-100 (display-class). */
  readonly share: number;
  /** Prime basket target amount per basket unit. */
  readonly targetAmount: Amount;
  /** Target unit name, e.g. "USD", "ETH". */
  readonly targetUnit: string;
};

export type YieldDtfBasket = {
  readonly address: Address;
  readonly chainId: YieldDtfChainId;
  /** Backing percentage, 0-100. */
  readonly backing: number;
  /** Overcollateralization from staked RSR as a percentage of value. */
  readonly staked: number;
  readonly collaterals: readonly YieldDtfBasketCollateral[];
  readonly backingBuffer: {
    readonly required: number;
    readonly actual: number;
  };
};

export type YieldDtfHolder = {
  readonly address: Address;
  /** Subgraph BigDecimal in human units — display-class. */
  readonly balance: number;
  readonly transferCount: number;
  readonly lastActivity: number;
};

export type YieldDtfTransactionType =
  | "transfer"
  /** Issuance mint. */
  | "mint"
  /** Furnace melt — not a user redemption. */
  | "burn"
  | "redeem"
  | "stake"
  | "unstake"
  | "unstakeCancelled"
  | "withdraw"
  | "other";

export type YieldDtfTransaction = {
  readonly id: string;
  readonly hash: string;
  readonly type: YieldDtfTransactionType;
  readonly amount: Amount;
  readonly amountUsd: number;
  readonly timestamp: number;
  readonly chainId: YieldDtfChainId;
  readonly from?: Address;
  readonly to?: Address;
};

export type YieldDtfIssuanceQuote = {
  readonly amount: Amount;
  readonly deposits: readonly {
    readonly token: Address;
    readonly amount: Amount;
  }[];
};

export type YieldDtfRedemptionQuote = {
  readonly amount: Amount;
  readonly withdrawals: readonly {
    readonly token: Address;
    readonly amount: Amount;
    /** Currently available in the backing manager; below `amount` means a prorata shortfall. */
    readonly available: Amount;
  }[];
};

export type YieldDtfPendingUnstake = {
  readonly index: number;
  readonly availableAt: number;
  readonly amount: Amount;
};

export type YieldDtfStakingState = {
  readonly stToken: Address;
  readonly account: Address;
  /** RSR per stRSR (D18). */
  readonly exchangeRate: Amount;
  /** Seconds. */
  readonly unstakingDelay: number;
  readonly rsrBalance: Amount;
  readonly rsrAllowance: Amount;
  readonly stTokenBalance: Amount;
  readonly pendingUnstakes: readonly YieldDtfPendingUnstake[];
};

export type YieldDtfStakeRecord = {
  readonly id: string;
  readonly hash: string;
  readonly isStake: boolean;
  /** stRSR amount. */
  readonly amount: Amount;
  /** RSR amount at the record's exchange rate. */
  readonly rsrAmount: Amount;
  /** RSR per stRSR at the time of the record (display-class). */
  readonly exchangeRate: number;
  readonly rsrPriceUsd: number;
  readonly timestamp: number;
  readonly blockNumber: number;
};
