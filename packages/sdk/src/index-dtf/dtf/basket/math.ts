import type { Decimal as DecimalType } from "decimal.js-light";

import { D18d, Decimal, getBasketDistribution } from "@reserve-protocol/dtf-rebalance-lib";
import { parseUnits } from "viem";

import type {
  BuildIndexDtfInitialBasketParams,
  IndexDtfBasketDefinition,
  IndexDtfBasketToken,
  IndexDtfInitialBasket,
} from "./types.js";

import { SdkError } from "../../../errors.js";
import { assertPositiveNumber, validateBasketTokens, validateShares } from "./validation.js";

export function getBasketSharesFromUnits(params: {
  readonly tokens: readonly IndexDtfBasketToken[];
  readonly units: readonly bigint[];
}): bigint[] {
  validateBasketTokens(params.tokens);

  let hasValue = false;
  for (const unit of params.units) {
    if (unit < 0n) {
      throw new SdkError({ code: "INVALID_INPUT", message: "Basket units must be non-negative" });
    }
    if (unit > 0n) hasValue = true;
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
  validateBasketTokens(params.tokens);
  validateShares(params.shares);

  return getUnitsFromShares(params.tokens, params.shares, new Decimal(params.targetValueUsd.toString()));
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

  validateBasketTokens(params.tokens);

  const totalValue = params.tokens.reduce((sum, token, index) => {
    const wholeTokens = new Decimal(params.balances[index]!.toString()).div(new Decimal(`1e${token.decimals}`));

    return sum.add(wholeTokens.mul(token.price));
  }, new Decimal(0));
  const supply = new Decimal(params.supply.toString()).div(D18d);

  return totalValue.div(supply).toNumber();
}

export function buildInitialBasket(params: BuildIndexDtfInitialBasketParams): IndexDtfInitialBasket {
  assertPositiveNumber(params.initialSharePriceUsd, "initialSharePriceUsd");
  if (params.initialShares <= 0n) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "initialShares must be positive",
      meta: { initialShares: params.initialShares },
    });
  }

  validateBasketTokens(params.tokens);
  const shares = getBasketShares(params.tokens, params.basket);
  const amounts =
    params.basket.type === "units"
      ? getScaledUnits(params.tokens, params.basket.units, getInitialValueUsd(params))
      : getUnitsFromShares(params.tokens, shares, getInitialValueUsd(params));

  for (const amount of amounts) {
    if (amount <= 0n) {
      throw new SdkError({ code: "INVALID_INPUT", message: "Initial basket amounts must be positive" });
    }
  }

  return {
    assets: params.tokens.map((token) => token.address),
    amounts,
    initialShares: params.initialShares,
    shares,
  };
}

export function getBasketShares(tokens: readonly IndexDtfBasketToken[], basket: IndexDtfBasketDefinition): bigint[] {
  if (basket.type === "shares") {
    validateShares(basket.shares);

    return [...basket.shares];
  }

  return getBasketSharesFromUnits({ tokens, units: basket.units });
}

function getInitialValueUsd(params: BuildIndexDtfInitialBasketParams): DecimalType {
  return new Decimal(params.initialShares.toString()).div(D18d).mul(params.initialSharePriceUsd);
}

function getUnitsFromShares(
  tokens: readonly IndexDtfBasketToken[],
  shares: readonly bigint[],
  targetValueUsd: DecimalType,
): bigint[] {
  return tokens.map((token, index) => {
    const valueUsd = targetValueUsd.mul(new Decimal(shares[index]!.toString()).div(D18d));
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
    const wholeTokens = new Decimal(unit.toString()).div(new Decimal(`1e${token.decimals}`));

    return sum.add(wholeTokens.mul(token.price));
  }, new Decimal(0));

  if (currentValueUsd.lte(0)) {
    throw new SdkError({ code: "INVALID_INPUT", message: "Basket units must have positive USD value" });
  }

  const scale = targetValueUsd.div(currentValueUsd);

  return units.map((unit) => BigInt(new Decimal(unit.toString()).mul(scale).toFixed(0)));
}
