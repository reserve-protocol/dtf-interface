import type { Address } from "viem";

import type { SupportedChainId } from "@/config";
import type {
  Amount,
  Authority,
  AuthorityGroup,
  BlockNumber,
  DtfParams,
  DtfStatus,
  Governance,
  Token,
  TokenWithSnapshot,
} from "@/types/common";

export type FeeRecipients = readonly {
  readonly address: Address;
  readonly percentage: string;
}[];

export type Fees = {
  readonly mintingFee: Amount;
  readonly tvlFee: Amount;
  readonly annualizedTvlFee: number;
  readonly recipients: FeeRecipients;
  /** Folio 6.0: recipients governance cannot remove; empty before 6.0. */
  readonly immutableRecipients: FeeRecipients;
  /** Folio 6.0: D18 share of the recipient pool kept for holders; zero before 6.0. */
  readonly selfFee: Amount;
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
  readonly delegation: {
    readonly currentDelegates: number;
    readonly totalDelegates: number;
    readonly delegatedVotes: Amount;
    readonly currentOptimisticDelegates: number;
    readonly totalOptimisticDelegates: number;
    readonly optimisticDelegatedVotes: Amount;
  };
};

// A Folio admin governor replaced by a governance migration, with the vote-lock vault it voted with.
export type LegacyAdminGovernance = {
  readonly governance: Address;
  readonly voteLock: Address;
  readonly voteLockGovernance?: Address;
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
  readonly legacyGovernances: readonly LegacyAdminGovernance[];
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
  /** Folio 6.0 mirrors `maxAuctionLength` here so existing readers keep working. */
  readonly auctionLength: number;
  readonly maxAuctionLength?: number;
  /** Folio 6.0 trade allowlist; absent before 6.0. */
  readonly tradeAllowlist?: { readonly enabled: boolean; readonly tokens: readonly Address[] };
  readonly bidsEnabled?: boolean;
  readonly trustedFillerRegistry?: Address;
  readonly trustedFillerEnabled?: boolean;
  // Tracking DTFs preserve units; native DTFs can manage target weights.
  readonly weightControl: boolean;
  readonly priceControl: PriceControl;
};

/** Fee shares paid, as raw 18-decimal share amounts from the subgraph (display-class numbers). */
export type Financials = {
  /** protocol + governance + external + self. */
  readonly totalRevenue: number;
  readonly protocolRevenue: number;
  readonly governanceRevenue: number;
  readonly externalRevenue: number;
  /** Folio 6.0 self fee kept for holders; 0 before 6.0 and for DTFs the subgraph indexed before 1.11.1. */
  readonly selfRevenue: number;
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

export type IndexDtfBatchPrice = Omit<IndexDtfPrice, "marketCap" | "totalSupply"> & {
  readonly marketCap?: number;
  readonly totalSupply?: number;
};

export type IndexDtfBasketAsset = {
  readonly token: Token;
  readonly balance: Amount;
};

export type IndexDtfBasketAssetWithPrice = IndexDtfBasketAsset & Omit<IndexDtfPriceBasketAsset, "token">;

export type IndexDtfBasket = Record<Address, IndexDtfBasketAsset>;

export type IndexDtfTotalAssets = {
  readonly tokens: readonly Address[];
  readonly balances: readonly bigint[];
  readonly balanceByToken: Readonly<Record<Address, bigint>>;
};

export type IndexDtfBasketWithPrice = Omit<IndexDtfPrice, "basket"> & {
  basket: Record<Address, IndexDtfBasketAssetWithPrice>;
};

export type IndexDtfBasketSnapshot = {
  readonly price: number;
  readonly basket: readonly {
    readonly address: Address;
    readonly symbol: string;
    readonly decimals: number;
    readonly price: number;
    readonly weight: string;
  }[];
};

export type IndexDtfPricePoint = {
  readonly timestamp: number;
  readonly price: number;
  readonly marketCap: number;
  readonly totalSupply: number;
  readonly basket: readonly {
    readonly address: Address;
    readonly price: number;
    readonly amount: number;
  }[];
};

export type IndexDtfBrandProfile = {
  readonly name: string;
  readonly icon: string;
  readonly link: string;
};

export type IndexDtfBrandSocials = {
  readonly twitter: string;
  readonly telegram: string;
  readonly discord: string;
  readonly website: string;
};

export type IndexDtfBrandFile = {
  readonly url: string;
  readonly name: string;
};

export type IndexDtfBasketType = "percentage-based" | "unit-based";

// Display-ready shape: every field present, absent API values coerced to ""
// defaults so consumers store it as-is without a mapping layer.
export type IndexDtfBrand = {
  readonly hidden: boolean;
  readonly dtf: {
    readonly icon: string;
    readonly cover: string;
    readonly mobileCover: string;
    readonly video: string;
    readonly description: string;
    readonly notesFromCreator: string;
    readonly prospectus: string;
    readonly files: readonly IndexDtfBrandFile[];
    readonly tags: readonly string[];
    readonly basketType: IndexDtfBasketType;
  };
  readonly creator: IndexDtfBrandProfile;
  readonly curator: IndexDtfBrandProfile;
  readonly socials: IndexDtfBrandSocials;
};

export type IndexDtfMarket = {
  readonly price: number;
  readonly marketCap: number;
  readonly totalSupply: number;
  readonly fetchedAt: number;
};

export type IndexDtfPlatformFee = {
  readonly registry: Address;
  readonly recipient: Address;
  readonly numerator: bigint;
  readonly denominator: bigint;
  readonly floor: bigint;
  readonly percent: number;
};

export type IndexDtfFull = IndexDtf & {
  readonly market: IndexDtfMarket;
  readonly basket: Record<Address, IndexDtfBasketAssetWithPrice>;
  readonly status: DtfStatus;
  readonly brand?: IndexDtfBrand;
};

export type IndexDtf = {
  readonly id: Address;
  readonly chainId: SupportedChainId;
  /** Folio release read from `version()` by the subgraph (1.11+); absent while a grafted DTF's field is still null. */
  readonly version?: string;
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

type IndexDtfIdentityParams = Omit<DtfParams, "blockNumber">;

export type GetIndexDtfOptions = {
  readonly brand?: boolean;
};

export type GetIndexDtfParams = IndexDtfIdentityParams & GetIndexDtfOptions;

export type GetIndexDtfBasketParams = DtfParams;

export type GetIndexDtfBasketOptions = BlockNumber | Pick<DtfParams, "blockNumber">;

export type GetIndexDtfBasketSnapshotParams = DtfParams;

export type GetIndexDtfBasketSnapshotOptions = BlockNumber | Pick<DtfParams, "blockNumber">;

export type GetIndexDtfVersionParams = DtfParams;

export type GetIndexDtfTotalSupplyParams = DtfParams;

export type GetIndexDtfTotalAssetsParams = DtfParams;

export type GetIndexDtfPriceParams = DtfParams;

export type GetIndexDtfPricesParams = {
  readonly chainId: SupportedChainId;
  readonly addresses: readonly Address[];
};

export type GetIndexDtfPriceHistoryParams = IndexDtfIdentityParams & {
  readonly from: number;
  readonly to: number;
  readonly interval: "5m" | "1h" | "1d";
};

export type GetIndexDtfPriceHistoryOptions = Pick<GetIndexDtfPriceHistoryParams, "from" | "interval" | "to">;
