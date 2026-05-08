import {
  D18d,
  D18n,
  Decimal,
  FolioVersion,
  getBasketDistribution,
  getStartRebalance,
  type RebalanceLimits,
  type TokenRebalanceParams,
} from "@reserve-protocol/dtf-rebalance-lib";
import type { Decimal as DecimalType } from "decimal.js-light";
import { getAddress, isAddress, parseUnits, type Address } from "viem";
import { z } from "zod";
import type { DtfClient } from "../../client.js";
import { SdkError } from "../../errors.js";
import { getTokensData } from "../../tokens/index.js";
import { getTokenPrices, getTokenVolatilities } from "../../tokens/prices.js";
import type { DtfParams, TokenVolatility } from "../../types/common.js";
import type { IndexDtf, IndexDtfTotalAssets } from "../../types/index-dtf.js";
import { getDtf, getTotalAssets, getTotalSupply } from "./index.js";

export const DEFAULT_AUCTION_LAUNCHER_WINDOW = 72 * 60 * 60;
export const DEFAULT_MAX_AUCTION_SIZE_USD = 1_000_000;

const SHARE_DECIMALS = 16;
const TARGET_BASKET_TOLERANCE = 10n ** 13n;

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
      units: z.union([z.string(), z.number()]),
    }),
  ),
});

export const indexDtfBasketSchema = z.union([
  indexDtfBasketSharesSchema,
  indexDtfBasketUnitsSchema,
]);

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

export type IndexDtfBasketInput =
  | IndexDtfBasketSharesInput
  | IndexDtfBasketUnitsInput;

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

export function getBasketSharesFromUnits(params: {
  readonly tokens: readonly IndexDtfBasketToken[];
  readonly units: readonly bigint[];
}): bigint[] {
  assertSameLength("tokens", params.tokens, "units", params.units);
  validateTokens(params.tokens);

  let hasValue = false;
  for (const unit of params.units) {
    if (unit < 0n) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "Basket units must be non-negative",
      });
    }
    if (unit > 0n) {
      hasValue = true;
    }
  }

  if (!hasValue) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket units must include at least one positive amount",
    });
  }

  return getBasketDistribution(
    [...params.units],
    params.tokens.map((token) => token.price),
    params.tokens.map((token) => BigInt(token.decimals)),
  );
}

export function getBasketUnitsFromShares(params: {
  readonly tokens: readonly IndexDtfBasketToken[];
  readonly shares: readonly bigint[];
  readonly targetValueUsd: number;
}): bigint[] {
  assertPositiveNumber(params.targetValueUsd, "targetValueUsd");
  assertSameLength("tokens", params.tokens, "shares", params.shares);
  validateTokens(params.tokens);
  validateShares(params.shares);

  return getUnitsFromShares(
    params.tokens,
    params.shares,
    new Decimal(params.targetValueUsd.toString()),
  );
}

export function getDtfPriceFromBalances(params: {
  readonly supply: bigint;
  readonly tokens: readonly IndexDtfBasketToken[];
  readonly balances: readonly bigint[];
}): number {
  if (params.supply <= 0n) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "supply must be positive",
      meta: { supply: params.supply },
    });
  }

  assertSameLength("tokens", params.tokens, "balances", params.balances);
  validateTokens(params.tokens);

  const totalValue = params.balances.reduce((sum, balance, index) => {
    const token = params.tokens[index]!;
    const wholeTokens = new Decimal(balance.toString()).div(
      new Decimal(`1e${token.decimals}`),
    );

    return sum.add(wholeTokens.mul(token.price));
  }, new Decimal(0));
  const supply = new Decimal(params.supply.toString()).div(D18d);

  return totalValue.div(supply).toNumber();
}

export function buildInitialBasket(
  params: BuildIndexDtfInitialBasketParams,
): IndexDtfInitialBasket {
  assertPositiveNumber(params.initialSharePriceUsd, "initialSharePriceUsd");
  if (params.initialShares <= 0n) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "initialShares must be positive",
      meta: { initialShares: params.initialShares },
    });
  }

  validateTokens(params.tokens);
  const shares = getBasketShares(params.tokens, params.basket);

  for (const share of shares) {
    if (share <= 0n) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "Initial basket shares must be positive",
      });
    }
  }

  if (params.basket.type === "units") {
    for (const unit of params.basket.units) {
      if (unit <= 0n) {
        throw new SdkError({
          code: "INVALID_INPUT",
          message: "Initial basket units must be positive",
        });
      }
    }
  }

  const initialShareCount = new Decimal(params.initialShares.toString()).div(
    D18d,
  );
  const totalValueUsd = initialShareCount.mul(params.initialSharePriceUsd);
  const amounts =
    params.basket.type === "units"
      ? getScaledUnits(params.tokens, params.basket.units, totalValueUsd)
      : getUnitsFromShares(params.tokens, shares, totalValueUsd);

  for (const amount of amounts) {
    if (amount <= 0n) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "Initial basket amounts must be positive",
      });
    }
  }

  return {
    assets: params.tokens.map((token) => token.address),
    amounts,
    initialShares: params.initialShares,
    shares,
  };
}

export function buildStartRebalanceArgs(
  params: BuildIndexDtfStartRebalanceArgsParams,
): StartRebalanceArgsV5 {
  if (params.supply <= 0n) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "supply must be positive",
      meta: { supply: params.supply },
    });
  }
  if (params.deferWeights && !params.weightControl) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "deferWeights is only supported for weight-control baskets",
    });
  }

  validateTokens(params.tokens);
  assertSameLength("tokens", params.tokens, "balances", params.balances);
  assertSameLength("tokens", params.tokens, "priceErrors", params.priceErrors);
  assertSameLength(
    "tokens",
    params.tokens,
    "maxAuctionSizesUsd",
    params.maxAuctionSizesUsd,
  );

  const targetShares = getBasketShares(params.tokens, params.basket);

  for (const priceError of params.priceErrors) {
    if (priceError < 0 || priceError > 0.9) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "priceErrors must be between 0 and 0.9",
        meta: { priceError },
      });
    }
  }
  for (const maxAuctionSizeUsd of params.maxAuctionSizesUsd) {
    assertPositiveNumber(maxAuctionSizeUsd, "maxAuctionSizeUsd");
  }

  return getStartRebalance(
    FolioVersion.V5,
    params.supply,
    params.tokens.map((token) => token.address),
    [...params.balances],
    params.tokens.map((token) => BigInt(token.decimals)),
    targetShares,
    params.tokens.map((token) => token.price),
    [...params.priceErrors],
    [...params.maxAuctionSizesUsd],
    params.weightControl,
    params.deferWeights ?? false,
  ) as StartRebalanceArgsV5;
}

export async function buildIndexDtfStartRebalance(
  client: DtfClient,
  params: BuildIndexDtfStartRebalanceParams,
): Promise<BuiltIndexDtfStartRebalance> {
  const address = getAddress(params.address);
  const inputTokens = params.basket.tokens.map((token) => ({
    ...token,
    address: getAddress(token.address),
  }));
  assertUniqueAddresses(inputTokens.map((token) => token.address));

  const [currentBalances, supply, dtf] = await Promise.all([
    getCurrentBalances(client, params),
    params.supply ?? getTotalSupply(client, params),
    getDtfForWeightControl(client, params),
  ]);
  const tokenOrder = getBasketTokenOrder(currentBalances, inputTokens);
  const [tokens, prices] = await Promise.all([
    getBasketTokens(client, params, tokenOrder, inputTokens),
    getBasketPrices(client, params, tokenOrder, inputTokens),
  ]);
  const pricedTokens = tokens.map((token, index) => ({
    ...token,
    price: prices[index]!,
  }));
  const targetBasket = getBasketFromInput(params.basket, tokenOrder, pricedTokens);
  const [priceErrors, maxAuctionSizesUsd] = await Promise.all([
    getBasketPriceErrors(client, params, tokenOrder, inputTokens),
    Promise.resolve(getMaxAuctionSizes(params, tokenOrder, inputTokens)),
  ]);
  const weightControl = params.weightControl ?? dtf?.rebalance.weightControl;

  if (weightControl === undefined) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "weightControl is required when DTF context is not provided",
      meta: { address, chainId: params.chainId },
    });
  }

  const balances = tokenOrder.map(
    (token) => currentBalances[token.toLowerCase()] ?? 0n,
  );
  const startRebalanceArgs = buildStartRebalanceArgs({
    tokens: pricedTokens,
    supply,
    balances,
    basket: targetBasket,
    priceErrors,
    maxAuctionSizesUsd,
    weightControl,
    deferWeights: params.deferWeights ?? false,
  });
  const targetShares = getBasketShares(pricedTokens, targetBasket);

  return {
    address,
    chainId: params.chainId,
    tokens: pricedTokens,
    assets: pricedTokens.map((token, index) => ({
      token,
      currentBalance: balances[index]!,
      targetShare: targetShares[index]!,
      priceError: priceErrors[index]!,
      maxAuctionSizeUsd: maxAuctionSizesUsd[index]!,
    })),
    supply,
    weightControl,
    deferWeights: params.deferWeights ?? false,
    startRebalanceArgs,
  };
}

function getBasketShares(
  tokens: readonly IndexDtfBasketToken[],
  basket: IndexDtfBasketDefinition,
): bigint[] {
  if (basket.type === "shares") {
    assertSameLength("tokens", tokens, "shares", basket.shares);
    validateShares(basket.shares);

    return [...basket.shares];
  }

  assertSameLength("tokens", tokens, "units", basket.units);

  return getBasketSharesFromUnits({ tokens, units: basket.units });
}

function getUnitsFromShares(
  tokens: readonly IndexDtfBasketToken[],
  shares: readonly bigint[],
  targetValueUsd: DecimalType,
): bigint[] {
  return tokens.map((token, index) => {
    const valueUsd = targetValueUsd.mul(
      new Decimal(shares[index]!.toString()).div(D18d),
    );
    const wholeTokens = valueUsd.div(token.price);

    return parseUnits(wholeTokens.toFixed(token.decimals), token.decimals);
  });
}

function getScaledUnits(
  tokens: readonly IndexDtfBasketToken[],
  units: readonly bigint[],
  targetValueUsd: DecimalType,
): bigint[] {
  const currentValueUsd = units.reduce((sum, unit, index) => {
    const token = tokens[index]!;
    const wholeTokens = new Decimal(unit.toString()).div(
      new Decimal(`1e${token.decimals}`),
    );

    return sum.add(wholeTokens.mul(token.price));
  }, new Decimal(0));

  if (currentValueUsd.lte(0)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket units must have positive USD value",
    });
  }

  const scale = targetValueUsd.div(currentValueUsd);

  return units.map((unit) => BigInt(new Decimal(unit.toString()).mul(scale).toFixed(0)));
}

async function getCurrentBalances(
  client: DtfClient,
  params: BuildIndexDtfStartRebalanceParams,
): Promise<Record<string, bigint>> {
  const totalAssets =
    params.currentBalances ?? (await getTotalAssets(client, params));

  return normalizeCurrentBalances(totalAssets);
}

async function getDtfForWeightControl(
  client: DtfClient,
  params: BuildIndexDtfStartRebalanceParams,
): Promise<IndexDtf | undefined> {
  if (params.weightControl !== undefined) {
    return params.dtf;
  }

  return params.dtf ?? getDtf(client, params);
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

function isTotalAssetsInput(
  input: IndexDtfBasketCurrentBalancesInput,
): input is IndexDtfTotalAssets {
  if (Array.isArray(input)) {
    return false;
  }

  const value = input as Partial<IndexDtfTotalAssets>;

  return Array.isArray(value.tokens) && Array.isArray(value.balances);
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

async function getBasketTokens(
  client: DtfClient,
  params: BuildIndexDtfStartRebalanceParams,
  tokenOrder: readonly Address[],
  inputTokens: readonly IndexDtfBasketTokenInput[],
): Promise<readonly Omit<IndexDtfBasketToken, "price">[]> {
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
  params: BuildIndexDtfStartRebalanceParams,
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
    const price = prices.get(address.toLowerCase());

    if (price === undefined || !Number.isFinite(price) || price <= 0) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `Missing price for token ${address}`,
        meta: { address, chainId: params.chainId },
      });
    }

    return price;
  });
}

function getBasketFromInput(
  input: IndexDtfBasketInput,
  tokenOrder: readonly Address[],
  tokens: readonly IndexDtfBasketToken[],
): IndexDtfBasketDefinition {
  const inputByAddress = new Map(
    input.tokens.map((token) => [getAddress(token.address).toLowerCase(), token]),
  );

  if (input.type === "shares") {
    const shares = tokenOrder.map((address) => {
      const token = inputByAddress.get(address.toLowerCase());

      return token && "share" in token ? parseShare(token.share) : 0n;
    });

    validateShares(shares);

    return { type: "shares", shares };
  }

  const units = tokenOrder.map((address, index) => {
    const token = inputByAddress.get(address.toLowerCase());

    return token && "units" in token
      ? parseTokenUnits(token.units, tokens[index]!.decimals)
      : 0n;
  });

  return { type: "units", units };
}

async function getBasketPriceErrors(
  client: DtfClient,
  params: BuildIndexDtfStartRebalanceParams,
  tokenOrder: readonly Address[],
  inputTokens: readonly IndexDtfBasketTokenInput[],
): Promise<number[]> {
  const explicitErrors = new Map<string, number>();
  const explicitVolatilities = new Map<string, TokenVolatility>();

  for (const [address, priceError] of Object.entries(
    params.priceErrors ?? {},
  )) {
    explicitErrors.set(getAddress(address as Address).toLowerCase(), priceError);
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
      explicitVolatilities.set(token.address.toLowerCase(), token.priceVolatility);
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
  const fetchedVolatilityByAddress = new Map(
    Object.entries(fetchedVolatilities).map(([address, volatility]) => [
      address.toLowerCase(),
      volatility,
    ]),
  );

  return tokenOrder.map((address) => {
    const key = address.toLowerCase();
    const volatility =
      explicitVolatilities.get(key) ??
      fetchedVolatilityByAddress.get(key) ??
      "medium";
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
  params: BuildIndexDtfStartRebalanceParams,
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
    const size =
      inputByAddress.get(key)?.maxAuctionSizeUsd ??
      sizes.get(key) ??
      params.maxAuctionSizeUsd ??
      DEFAULT_MAX_AUCTION_SIZE_USD;

    assertPositiveNumber(size, "maxAuctionSizeUsd");

    return size;
  });
}

function validateTokens(tokens: readonly IndexDtfBasketToken[]) {
  if (tokens.length === 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket must include at least one token",
    });
  }

  assertUniqueAddresses(tokens.map((token) => token.address));

  for (const token of tokens) {
    if (!Number.isInteger(token.decimals) || token.decimals < 0) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `Invalid decimals for token ${token.address}`,
        meta: { address: token.address, decimals: token.decimals },
      });
    }
    assertPositiveNumber(token.price, `price for token ${token.address}`);
  }
}

function validateShares(shares: readonly bigint[]) {
  let total = 0n;

  for (const share of shares) {
    if (share < 0n) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "Basket shares must be non-negative",
      });
    }
    total += share;
  }

  if (
    total < D18n - TARGET_BASKET_TOLERANCE ||
    total > D18n + TARGET_BASKET_TOLERANCE
  ) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket shares must add up to 100%",
      meta: { total },
    });
  }
}

function assertUniqueAddresses(addresses: readonly Address[]) {
  const seen = new Set<string>();

  for (const address of addresses) {
    const key = getAddress(address).toLowerCase();

    if (seen.has(key)) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `Duplicate basket token ${address}`,
        meta: { address },
      });
    }

    seen.add(key);
  }
}

function assertSameLength(
  leftName: string,
  left: readonly unknown[],
  rightName: string,
  right: readonly unknown[],
) {
  if (left.length !== right.length) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${leftName} and ${rightName} must have the same length`,
      meta: { [leftName]: left.length, [rightName]: right.length },
    });
  }
}

function assertPositiveNumber(value: number, field: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} must be a positive number`,
      meta: { [field]: value },
    });
  }
}

function parseTokenUnits(value: unknown, decimals: number): bigint {
  if (typeof value === "bigint") {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket token units must be human units, not raw bigint units",
    });
  }
  if (typeof value !== "string" && typeof value !== "number") {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket token units must be a string or number",
      meta: { units: value },
    });
  }

  const units = toDecimal(value, "units");

  if (units.isNegative()) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket token units must be non-negative",
      meta: { units: value },
    });
  }

  return parseUnits(units.toFixed(decimals), decimals);
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

  return parseUnits(share.toFixed(SHARE_DECIMALS), SHARE_DECIMALS);
}

function toDecimal(value: string | number, field: string): DecimalType {
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
