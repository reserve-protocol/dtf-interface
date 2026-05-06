import {
  FolioVersion as RebalanceLibVersion,
  getBasketDistribution,
  getStartRebalance,
  type PriceRange,
  type RebalanceLimits,
  type TokenRebalanceParams,
  type WeightRange,
} from "@reserve-protocol/dtf-rebalance-lib";
import { Decimal } from "decimal.js-light";
import { getAddress, isAddress, parseUnits, type Address } from "viem";
import { z } from "zod";
import type { DtfClient } from "../../../client.js";
import { SdkError } from "../../../errors.js";
import { getTokensData } from "../../../tokens/index.js";
import {
  getTokenPrices,
  getTokenVolatilities,
} from "../../../tokens/prices.js";
import type {
  DtfParams,
  Token,
  TokenVolatility,
} from "../../../types/common.js";
import type {
  IndexDtf,
  IndexDtfTotalAssets,
} from "../../../types/index-dtf.js";
import {
  getIndexDtf,
  getIndexDtfTotalAssets,
  getIndexDtfTotalSupply,
  getIndexDtfVersion,
} from "../index.js";
import {
  INDEX_DTF_VERSION_5_0_0,
  INDEX_DTF_VERSION_6_0_0,
} from "../../versions.js";

export const DEFAULT_AUCTION_LAUNCHER_WINDOW = 72 * 60 * 60;
export const DEFAULT_MAX_AUCTION_SIZE_USD = 1_000_000;

const SHARE_DECIMALS = 16;
const TARGET_BASKET_TOLERANCE = 10n ** 13n;
const D18 = 10n ** 18n;

const PRICE_ERROR_BY_VOLATILITY: Record<TokenVolatility, number> = {
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
      units: z.union([z.string(), z.number(), z.bigint()]),
    }),
  ),
});

export const indexDtfBasketSchema = z.union([
  indexDtfBasketSharesSchema,
  indexDtfBasketUnitsSchema,
]);

export type IndexDtfBasketBuildVersion =
  | 4
  | 5
  | 6
  | "4.0.0"
  | typeof INDEX_DTF_VERSION_5_0_0
  | typeof INDEX_DTF_VERSION_6_0_0;

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
    readonly share: string | number;
  })[];
};

export type IndexDtfBasketUnitsInput = {
  readonly type: "units";
  readonly tokens: readonly (IndexDtfBasketTokenInput & {
    readonly units: string | number | bigint;
  })[];
};

export type IndexDtfBasketInput =
  | IndexDtfBasketSharesInput
  | IndexDtfBasketUnitsInput;

export type IndexDtfBasketBuildAsset = {
  readonly token: Token;
  readonly currentBalance: bigint;
  readonly price: number;
  readonly targetBasketShare: bigint;
  readonly priceError: number;
  readonly maxAuctionSizeUsd: number;
};

export type IndexDtfBasketCurrentBalancesInput =
  | IndexDtfTotalAssets
  | Readonly<Record<string, bigint>>
  | readonly { readonly address: Address; readonly balance: bigint }[];

export type BuildIndexDtfBasketParams = DtfParams & {
  readonly basket: IndexDtfBasketInput;
  readonly currentBalances?: IndexDtfBasketCurrentBalancesInput;
  readonly tokenDecimals?: Readonly<Record<string, number>>;
  readonly prices?: Readonly<Record<string, number>>;
  readonly priceErrors?: Readonly<Record<string, number>>;
  readonly priceVolatilities?: Readonly<Record<string, TokenVolatility>>;
  readonly maxAuctionSizeUsd?: number;
  readonly maxAuctionSizesUsd?: Readonly<Record<string, number>>;
};

export type BuiltIndexDtfBasket = {
  readonly address: Address;
  readonly chainId: DtfParams["chainId"];
  readonly tokenOrder: readonly Address[];
  readonly assets: readonly IndexDtfBasketBuildAsset[];
};

export type BuildIndexDtfTargetBasketParams = {
  readonly basket: IndexDtfBasketInput;
  readonly tokens: readonly Token[];
  readonly prices: readonly number[];
};

export type BuiltIndexDtfTargetBasket = {
  readonly tokenOrder: readonly Address[];
  readonly assets: readonly {
    readonly token: Token;
    readonly price: number;
    readonly targetBasketShare: bigint;
  }[];
};

export type StartRebalanceArgsV4 = {
  readonly tokens: readonly string[];
  readonly weights: readonly WeightRange[];
  readonly prices: readonly PriceRange[];
  readonly limits: RebalanceLimits;
};

export type StartRebalanceArgsV5 = {
  readonly tokens: readonly TokenRebalanceParams[];
  readonly limits: RebalanceLimits;
};

export type BuildIndexDtfBasketRebalanceParams = BuildIndexDtfBasketParams & {
  readonly dtf?: IndexDtf;
  readonly version?: IndexDtfBasketBuildVersion;
  readonly supply?: bigint;
  readonly weightControl?: boolean;
  readonly deferWeights?: boolean;
  readonly auctionLauncherWindow?: number | bigint;
  readonly permissionlessWindow?: number | bigint;
  readonly ttl?: number | bigint;
};

export type BuiltIndexDtfBasketRebalance = BuiltIndexDtfBasket & {
  readonly version: IndexDtfRebalanceVersion;
  readonly supply: bigint;
  readonly weightControl: boolean;
  readonly deferWeights: boolean;
  readonly auctionLauncherWindow: bigint;
  readonly ttl: bigint;
  readonly startRebalanceArgs: StartRebalanceArgsV4 | StartRebalanceArgsV5;
};

export type IndexDtfRebalanceVersion = 4 | 5;

export async function buildIndexDtfBasket(
  client: DtfClient,
  params: BuildIndexDtfBasketParams,
): Promise<BuiltIndexDtfBasket> {
  const address = getAddress(params.address);
  const currentBalances = await getCurrentBalances(client, params);
  const inputTokens = params.basket.tokens.map((token) => ({
    ...token,
    address: getAddress(token.address),
  }));
  const tokenOrder = getBasketTokenOrder(currentBalances, inputTokens);
  const tokens = await getBasketTokens(client, params, tokenOrder, inputTokens);
  const prices = await getBasketPrices(client, params, tokenOrder, inputTokens);
  const targetBasket = getTargetBasket(
    params.basket,
    tokenOrder,
    tokens,
    prices,
  );
  const priceErrors = await getBasketPriceErrors(
    client,
    params,
    tokenOrder,
    inputTokens,
  );
  const maxAuctionSizes = getMaxAuctionSizes(params, tokenOrder, inputTokens);

  return {
    address,
    chainId: params.chainId,
    tokenOrder,
    assets: tokenOrder.map((token, index) => ({
      token: tokens[index]!,
      currentBalance: currentBalances[token.toLowerCase()] ?? 0n,
      price: prices[index]!,
      targetBasketShare: targetBasket[index]!,
      priceError: priceErrors[index]!,
      maxAuctionSizeUsd: maxAuctionSizes[index]!,
    })),
  };
}

export function buildIndexDtfTargetBasket(
  params: BuildIndexDtfTargetBasketParams,
): BuiltIndexDtfTargetBasket {
  if (params.tokens.length !== params.prices.length) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "tokens and prices must have the same length",
    });
  }

  const tokens = params.tokens.map((token) => ({
    ...token,
    address: getAddress(token.address),
  }));
  const prices = params.prices.map((price, index) => {
    if (!Number.isFinite(price) || price <= 0) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `Invalid price for token ${tokens[index]?.address ?? index}`,
        meta: { price, index },
      });
    }

    return price;
  });
  const tokenKeys = new Set(tokens.map((token) => token.address.toLowerCase()));

  for (const token of params.basket.tokens) {
    const address = getAddress(token.address);

    if (!tokenKeys.has(address.toLowerCase())) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `Missing token metadata for basket token ${address}`,
        meta: { address },
      });
    }
  }

  const tokenOrder = tokens.map((token) => token.address);
  const targetBasket = getTargetBasket(
    params.basket,
    tokenOrder,
    tokens,
    prices,
  );

  return {
    tokenOrder,
    assets: tokens.map((token, index) => ({
      token,
      price: prices[index]!,
      targetBasketShare: targetBasket[index]!,
    })),
  };
}

export async function buildIndexDtfBasketRebalance(
  client: DtfClient,
  params: BuildIndexDtfBasketRebalanceParams,
): Promise<BuiltIndexDtfBasketRebalance> {
  const [basket, version, supply, dtf] = await Promise.all([
    buildIndexDtfBasket(client, params),
    getBasketBuildVersion(client, params),
    getBasketBuildSupply(client, params),
    getBasketBuildDtf(client, params),
  ]);
  const weightControl = params.weightControl ?? dtf?.rebalance.weightControl;

  if (weightControl === undefined) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "weightControl is required when dtf context is not provided",
      meta: { address: basket.address, chainId: params.chainId },
    });
  }

  const deferWeights = params.deferWeights ?? false;
  const auctionLauncherWindow = toSeconds(
    params.auctionLauncherWindow ?? DEFAULT_AUCTION_LAUNCHER_WINDOW,
    "auctionLauncherWindow",
  );
  const ttl =
    params.ttl === undefined
      ? auctionLauncherWindow +
        toSeconds(params.permissionlessWindow ?? 0, "permissionlessWindow")
      : toSeconds(params.ttl, "ttl");
  const startRebalanceArgs = getStartRebalance(
    version,
    supply,
    [...basket.tokenOrder],
    basket.assets.map((asset) => asset.currentBalance),
    basket.assets.map((asset) => BigInt(asset.token.decimals)),
    basket.assets.map((asset) => asset.targetBasketShare),
    basket.assets.map((asset) => asset.price),
    basket.assets.map((asset) => asset.priceError),
    basket.assets.map((asset) => asset.maxAuctionSizeUsd),
    weightControl,
    deferWeights,
  ) as StartRebalanceArgsV4 | StartRebalanceArgsV5;

  return {
    ...basket,
    version,
    supply,
    weightControl,
    deferWeights,
    auctionLauncherWindow,
    ttl,
    startRebalanceArgs,
  };
}

async function getCurrentBalances(
  client: DtfClient,
  params: BuildIndexDtfBasketParams,
): Promise<Record<string, bigint>> {
  const totalAssets =
    params.currentBalances ?? (await getIndexDtfTotalAssets(client, params));

  return normalizeCurrentBalances(totalAssets);
}

async function getBasketBuildVersion(
  client: DtfClient,
  params: BuildIndexDtfBasketRebalanceParams,
): Promise<IndexDtfRebalanceVersion> {
  const version = params.version ?? (await getIndexDtfVersion(client, params));

  return normalizeRebalanceVersion(version);
}

async function getBasketBuildSupply(
  client: DtfClient,
  params: BuildIndexDtfBasketRebalanceParams,
): Promise<bigint> {
  return params.supply ?? getIndexDtfTotalSupply(client, params);
}

async function getBasketBuildDtf(
  client: DtfClient,
  params: BuildIndexDtfBasketRebalanceParams,
): Promise<IndexDtf | undefined> {
  if (params.weightControl !== undefined) {
    return params.dtf;
  }

  return params.dtf ?? getIndexDtf(client, params);
}

function normalizeCurrentBalances(
  input: IndexDtfBasketCurrentBalancesInput,
): Record<string, bigint> {
  if (Array.isArray(input)) {
    const result: Record<string, bigint> = {};

    for (const item of input) {
      result[getAddress(item.address).toLowerCase()] = item.balance;
    }

    return result;
  }

  if (isTotalAssetsInput(input)) {
    const result: Record<string, bigint> = {};

    for (let i = 0; i < input.tokens.length; i++) {
      result[getAddress(input.tokens[i]!).toLowerCase()] =
        input.balances[i] ?? 0n;
    }

    return result;
  }

  const result: Record<string, bigint> = {};

  for (const [token, balance] of Object.entries(input)) {
    result[getAddress(token as Address).toLowerCase()] = balance;
  }

  return result;
}

function getBasketTokenOrder(
  currentBalances: Readonly<Record<string, bigint>>,
  inputTokens: readonly IndexDtfBasketTokenInput[],
): Address[] {
  const addresses: Address[] = [];
  const seen = new Set<string>();
  const add = (token: Address) => {
    const address = getAddress(token);
    const key = address.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      addresses.push(address);
    }
  };

  for (const token of Object.keys(currentBalances)) {
    add(token as Address);
  }
  for (const token of inputTokens) {
    add(token.address);
  }

  return addresses;
}

function isTotalAssetsInput(
  input: IndexDtfBasketCurrentBalancesInput,
): input is IndexDtfTotalAssets {
  if (Array.isArray(input)) {
    return false;
  }

  const value = input as Partial<IndexDtfTotalAssets>;

  return Array.isArray(value.tokens) && Array.isArray(value.balances);
}

async function getBasketTokens(
  client: DtfClient,
  params: BuildIndexDtfBasketParams,
  tokenOrder: readonly Address[],
  inputTokens: readonly IndexDtfBasketTokenInput[],
): Promise<readonly Token[]> {
  const publicClient = client.viem.getPublicClient(params.chainId);
  const fetchedTokens = await getTokensData(publicClient, [...tokenOrder]);
  const decimalsByAddress = new Map<string, number>();

  for (const [address, decimals] of Object.entries(
    params.tokenDecimals ?? {},
  )) {
    decimalsByAddress.set(
      getAddress(address as Address).toLowerCase(),
      decimals,
    );
  }
  for (const token of inputTokens) {
    if (token.decimals !== undefined) {
      decimalsByAddress.set(token.address.toLowerCase(), token.decimals);
    }
  }

  return fetchedTokens.map((token) => ({
    ...token,
    decimals:
      decimalsByAddress.get(token.address.toLowerCase()) ?? token.decimals,
  }));
}

async function getBasketPrices(
  client: DtfClient,
  params: BuildIndexDtfBasketParams,
  tokenOrder: readonly Address[],
  inputTokens: readonly IndexDtfBasketTokenInput[],
): Promise<number[]> {
  const prices = new Map<string, number>();

  for (const [address, price] of Object.entries(params.prices ?? {})) {
    prices.set(getAddress(address as Address).toLowerCase(), price);
  }
  for (const token of inputTokens) {
    if (token.price !== undefined) {
      prices.set(token.address.toLowerCase(), token.price);
    }
  }

  const missing = tokenOrder.filter(
    (address) => prices.get(address.toLowerCase()) === undefined,
  );

  if (missing.length > 0) {
    const fetchedPrices = await getTokenPrices(client, {
      chainId: params.chainId,
      addresses: missing,
    });

    for (const token of fetchedPrices) {
      prices.set(token.address.toLowerCase(), token.price);
    }
  }

  return tokenOrder.map((address) => {
    const price = prices.get(address.toLowerCase()) ?? 0;

    if (price <= 0) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `Missing price for token ${address}`,
        meta: { address, chainId: params.chainId },
      });
    }

    return price;
  });
}

function getTargetBasket(
  basket: IndexDtfBasketInput,
  tokenOrder: readonly Address[],
  tokens: readonly Token[],
  prices: readonly number[],
): bigint[] {
  if (basket.type === "shares") {
    const inputByAddress = new Map(
      basket.tokens.map((token) => [
        getAddress(token.address).toLowerCase(),
        token,
      ]),
    );

    return getSharesTargetBasket(basket, tokenOrder, inputByAddress);
  }

  const inputByAddress = new Map(
    basket.tokens.map((token) => [
      getAddress(token.address).toLowerCase(),
      token,
    ]),
  );
  const units = tokenOrder.map((address, index) => {
    const input = inputByAddress.get(address.toLowerCase());

    return input && "units" in input
      ? parseTokenUnits(input.units, tokens[index]!.decimals)
      : 0n;
  });

  return getBasketDistribution(
    units,
    [...prices],
    tokens.map((token) => BigInt(token.decimals)),
  );
}

function getSharesTargetBasket(
  basket: IndexDtfBasketSharesInput,
  tokenOrder: readonly Address[],
  inputByAddress: ReadonlyMap<
    string,
    IndexDtfBasketSharesInput["tokens"][number]
  >,
): bigint[] {
  const targetBasket = tokenOrder.map((address) => {
    const input = inputByAddress.get(address.toLowerCase());

    return input ? parseShare(input.share) : 0n;
  });
  const total = targetBasket.reduce((sum, share) => sum + share, 0n);

  if (
    total < D18 - TARGET_BASKET_TOLERANCE ||
    total > D18 + TARGET_BASKET_TOLERANCE
  ) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket shares must add up to 100%",
      meta: { total },
    });
  }

  return targetBasket;
}

async function getBasketPriceErrors(
  client: DtfClient,
  params: BuildIndexDtfBasketParams,
  tokenOrder: readonly Address[],
  inputTokens: readonly IndexDtfBasketTokenInput[],
): Promise<number[]> {
  const explicitErrors = new Map<string, number>();
  const explicitVolatilities = new Map<string, TokenVolatility>();

  for (const [address, priceError] of Object.entries(
    params.priceErrors ?? {},
  )) {
    explicitErrors.set(
      getAddress(address as Address).toLowerCase(),
      priceError,
    );
  }
  for (const [address, volatility] of Object.entries(
    params.priceVolatilities ?? {},
  )) {
    explicitVolatilities.set(
      getAddress(address as Address).toLowerCase(),
      volatility,
    );
  }
  for (const token of inputTokens) {
    if (token.priceError !== undefined) {
      explicitErrors.set(token.address.toLowerCase(), token.priceError);
    }
    if (token.priceVolatility !== undefined) {
      explicitVolatilities.set(
        token.address.toLowerCase(),
        token.priceVolatility,
      );
    }
  }

  const missingVolatility = tokenOrder.filter((address) => {
    const key = address.toLowerCase();

    return !explicitErrors.has(key) && !explicitVolatilities.has(key);
  });
  const fetchedVolatilities =
    missingVolatility.length > 0
      ? await getTokenVolatilities(client, {
          chainId: params.chainId,
          addresses: missingVolatility,
        })
      : {};

  return tokenOrder.map((address) => {
    const key = address.toLowerCase();
    const volatility =
      explicitVolatilities.get(key) ?? fetchedVolatilities[address] ?? "medium";
    const priceError =
      explicitErrors.get(key) ?? PRICE_ERROR_BY_VOLATILITY[volatility];

    if (priceError < 0 || priceError > 0.9) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `Invalid price error for token ${address}`,
        meta: { address, priceError },
      });
    }

    return priceError;
  });
}

function getMaxAuctionSizes(
  params: BuildIndexDtfBasketParams,
  tokenOrder: readonly Address[],
  inputTokens: readonly IndexDtfBasketTokenInput[],
): number[] {
  const inputByAddress = new Map(
    inputTokens.map((token) => [token.address.toLowerCase(), token]),
  );
  const sizes = new Map<string, number>();

  for (const [address, size] of Object.entries(
    params.maxAuctionSizesUsd ?? {},
  )) {
    sizes.set(getAddress(address as Address).toLowerCase(), size);
  }

  return tokenOrder.map((address) => {
    const key = address.toLowerCase();

    return (
      inputByAddress.get(key)?.maxAuctionSizeUsd ??
      sizes.get(key) ??
      params.maxAuctionSizeUsd ??
      DEFAULT_MAX_AUCTION_SIZE_USD
    );
  });
}

function normalizeRebalanceVersion(
  version: IndexDtfBasketBuildVersion | string,
): IndexDtfRebalanceVersion {
  switch (version) {
    case 4:
    case "4.0.0":
      return RebalanceLibVersion.V4;
    case 5:
    case 6:
    case INDEX_DTF_VERSION_5_0_0:
    case INDEX_DTF_VERSION_6_0_0:
      return RebalanceLibVersion.V5;
  }

  throw new SdkError({
    code: "INVALID_INPUT",
    message: `Unsupported Index DTF rebalance version: ${version}`,
    meta: { version },
  });
}

function toSeconds(value: number | bigint, field: string): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  if (!Number.isFinite(value) || value < 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} must be a positive number of seconds`,
      meta: { [field]: value },
    });
  }

  return BigInt(Math.round(value));
}

function parseTokenUnits(
  value: string | number | bigint,
  decimals: number,
): bigint {
  if (typeof value === "bigint") {
    if (value < 0n) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "Basket token units must be positive",
      });
    }

    return value;
  }

  const units = toDecimal(value, "units");

  if (units.isNegative()) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket token units must be positive",
      meta: { units: value },
    });
  }

  return parseUnits(units.toFixed(), decimals);
}

function parseShare(value: string | number): bigint {
  const share = toDecimal(value, "share");

  if (share.isNegative() || share.gt(100)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket token shares must be between 0 and 100",
      meta: { share: value },
    });
  }

  return parseUnits(share.toFixed(), SHARE_DECIMALS);
}

function toDecimal(value: string | number, field: string): Decimal {
  try {
    return new Decimal(String(value));
  } catch (cause) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} must be a valid number`,
      cause,
      meta: { [field]: value },
    });
  }
}
