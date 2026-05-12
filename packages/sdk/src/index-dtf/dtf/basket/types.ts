import type { RebalanceLimits, TokenRebalanceParams } from "@reserve-protocol/dtf-rebalance-lib";

import { isAddress, type Address } from "viem";
import { z } from "zod";

import type { DtfParams, TokenVolatility } from "@/types/common";
import type { IndexDtf, IndexDtfTotalAssets } from "@/types/index-dtf";

export const DEFAULT_AUCTION_LAUNCHER_WINDOW = 72 * 60 * 60;
export const DEFAULT_MAX_AUCTION_SIZE_USD = 1_000_000;

export const SHARE_DECIMALS = 16;
export const TARGET_BASKET_TOLERANCE = 10n ** 13n;

export const PRICE_ERROR_BY_VOLATILITY: Record<TokenVolatility, number> = {
  low: 0.25,
  medium: 0.5,
  high: 0.75,
  degen: 0.9,
};

export const indexDtfBasketTokenSchema = z.object({
  address: z.string().refine(isAddress, "Invalid address"),
  decimals: z.number().int().min(0).max(255).optional(),
  price: z.number().positive().optional(),
  priceError: z.number().min(0).max(0.9).optional(),
  priceVolatility: z.enum(["low", "medium", "high", "degen"]).optional(),
  maxAuctionSizeUsd: z.number().positive().optional(),
});

export const indexDtfBasketSharesSchema = z.object({
  type: z.literal("shares"),
  tokens: z.array(
    indexDtfBasketTokenSchema.extend({
      share: z.union([z.string(), z.number()]),
    }),
  ),
});

export const indexDtfBasketUnitsSchema = z.object({
  type: z.literal("units"),
  tokens: z.array(
    indexDtfBasketTokenSchema.extend({
      units: z.union([z.string(), z.number()]),
    }),
  ),
});

export const indexDtfBasketSchema = z.union([indexDtfBasketSharesSchema, indexDtfBasketUnitsSchema]);

export type IndexDtfBasketToken = {
  readonly address: Address;
  readonly decimals: number;
  readonly price: number;
  readonly name?: string;
  readonly symbol?: string;
};

export type IndexDtfBasketDefinition =
  | {
      readonly type: "shares";
      // D18{1}. 50% is 0.5e18.
      readonly shares: readonly bigint[];
    }
  | {
      readonly type: "units";
      // Raw token units. 1 USDC is 1_000_000n.
      readonly units: readonly bigint[];
    };

export type IndexDtfBasketTokenInput = {
  readonly address: Address;
  readonly decimals?: number;
  readonly price?: number;
  readonly priceError?: number;
  readonly priceVolatility?: TokenVolatility;
  readonly maxAuctionSizeUsd?: number;
};

export type IndexDtfBasketSharesInput = {
  readonly type: "shares";
  readonly tokens: readonly (IndexDtfBasketTokenInput & {
    // Human percent. 50 means 50%.
    readonly share: string | number;
  })[];
};

export type IndexDtfBasketUnitsInput = {
  readonly type: "units";
  readonly tokens: readonly (IndexDtfBasketTokenInput & {
    // Human units. 1 USDC is "1", not 1_000_000n.
    readonly units: string | number;
  })[];
};

export type IndexDtfBasketInput = IndexDtfBasketSharesInput | IndexDtfBasketUnitsInput;

export type IndexDtfBasketCurrentBalancesInput =
  | IndexDtfTotalAssets
  | Readonly<Record<string, bigint>>
  | readonly { readonly address: Address; readonly balance: bigint }[];

export type IndexDtfInitialBasket = {
  readonly assets: readonly Address[];
  readonly amounts: readonly bigint[];
  readonly initialShares: bigint;
  readonly shares: readonly bigint[];
};

export type BuildIndexDtfInitialBasketParams = {
  readonly tokens: readonly IndexDtfBasketToken[];
  readonly basket: IndexDtfBasketDefinition;
  readonly initialSharePriceUsd: number;
  readonly initialShares: bigint;
};

export type StartRebalanceArgsV5 = {
  readonly tokens: readonly TokenRebalanceParams[];
  readonly limits: RebalanceLimits;
};

export type BuildIndexDtfStartRebalanceArgsParams = {
  readonly tokens: readonly IndexDtfBasketToken[];
  readonly supply: bigint;
  readonly balances: readonly bigint[];
  readonly basket: IndexDtfBasketDefinition;
  readonly priceErrors: readonly number[];
  readonly maxAuctionSizesUsd: readonly number[];
  readonly weightControl: boolean;
  readonly deferWeights?: boolean;
};

export type BuildIndexDtfStartRebalanceParams = DtfParams & {
  readonly basket: IndexDtfBasketInput;
  readonly dtf?: IndexDtf;
  readonly supply?: bigint;
  readonly currentBalances?: IndexDtfBasketCurrentBalancesInput;
  readonly tokenDecimals?: Readonly<Record<string, number>>;
  readonly prices?: Readonly<Record<string, number>>;
  readonly priceErrors?: Readonly<Record<string, number>>;
  readonly priceVolatilities?: Readonly<Record<string, TokenVolatility>>;
  readonly maxAuctionSizeUsd?: number;
  readonly maxAuctionSizesUsd?: Readonly<Record<string, number>>;
  readonly weightControl?: boolean;
  readonly deferWeights?: boolean;
};

export type BuiltIndexDtfStartRebalanceAsset = {
  readonly token: IndexDtfBasketToken;
  readonly currentBalance: bigint;
  readonly targetShare: bigint;
  readonly priceError: number;
  readonly maxAuctionSizeUsd: number;
};

export type BuiltIndexDtfStartRebalance = {
  readonly address: Address;
  readonly chainId: DtfParams["chainId"];
  readonly tokens: readonly IndexDtfBasketToken[];
  readonly assets: readonly BuiltIndexDtfStartRebalanceAsset[];
  readonly supply: bigint;
  readonly weightControl: boolean;
  readonly deferWeights: boolean;
  readonly startRebalanceArgs: StartRebalanceArgsV5;
};
