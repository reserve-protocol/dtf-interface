import { getAddress, type Address } from "viem";
import type { DtfClient } from "../../../client.js";
import { SdkError } from "../../../errors.js";
import { getTokensData } from "../../../tokens/index.js";
import { getTokenPrices, getTokenVolatilities } from "../../../tokens/prices.js";
import type { TokenVolatility } from "../../../types/common.js";
import {
  DEFAULT_MAX_AUCTION_SIZE_USD,
  PRICE_ERROR_BY_VOLATILITY,
  type BuildIndexDtfStartRebalanceParams,
  type IndexDtfBasketToken,
  type IndexDtfBasketTokenInput,
} from "./types.js";
import { assertPositiveNumber } from "./validation.js";

export async function getBasketTokens(
  client: DtfClient,
  params: BuildIndexDtfStartRebalanceParams,
  tokenOrder: readonly Address[],
  inputTokens: readonly IndexDtfBasketTokenInput[],
): Promise<readonly Omit<IndexDtfBasketToken, "price">[]> {
  const publicClient = client.viem.getPublicClient(params.chainId);
  const fetchedTokens = await getTokensData(publicClient, [...tokenOrder]);
  const decimalsByAddress = new Map<string, number>();

  for (const [address, decimals] of Object.entries(params.tokenDecimals ?? {})) {
    decimalsByAddress.set(getAddress(address as Address).toLowerCase(), decimals);
  }
  for (const token of inputTokens) {
    if (token.decimals !== undefined) {
      decimalsByAddress.set(token.address.toLowerCase(), token.decimals);
    }
  }

  return fetchedTokens.map((token) => ({
    ...token,
    decimals: decimalsByAddress.get(token.address.toLowerCase()) ?? token.decimals,
  }));
}

export async function getBasketPrices(
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

  const missing = tokenOrder.filter((address) => prices.get(address.toLowerCase()) === undefined);

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

export async function getBasketPriceErrors(
  client: DtfClient,
  params: BuildIndexDtfStartRebalanceParams,
  tokenOrder: readonly Address[],
  inputTokens: readonly IndexDtfBasketTokenInput[],
): Promise<number[]> {
  const explicitErrors = new Map<string, number>();
  const explicitVolatilities = new Map<string, TokenVolatility>();

  for (const [address, priceError] of Object.entries(params.priceErrors ?? {})) {
    explicitErrors.set(getAddress(address as Address).toLowerCase(), priceError);
  }
  for (const [address, volatility] of Object.entries(params.priceVolatilities ?? {})) {
    explicitVolatilities.set(getAddress(address as Address).toLowerCase(), volatility);
  }
  for (const token of inputTokens) {
    if (token.priceError !== undefined) explicitErrors.set(token.address.toLowerCase(), token.priceError);
    if (token.priceVolatility !== undefined) explicitVolatilities.set(token.address.toLowerCase(), token.priceVolatility);
  }

  const missingVolatility = tokenOrder.filter((address) => {
    const key = address.toLowerCase();

    return !explicitErrors.has(key) && !explicitVolatilities.has(key);
  });
  const fetchedVolatilities = missingVolatility.length > 0
    ? await getTokenVolatilities(client, { chainId: params.chainId, addresses: missingVolatility })
    : {};
  const fetchedVolatilityByAddress = new Map(
    Object.entries(fetchedVolatilities).map(([address, volatility]) => [address.toLowerCase(), volatility]),
  );

  return tokenOrder.map((address) => {
    const key = address.toLowerCase();
    const volatility = explicitVolatilities.get(key) ?? fetchedVolatilityByAddress.get(key) ?? "medium";
    const priceError = explicitErrors.get(key) ?? PRICE_ERROR_BY_VOLATILITY[volatility];

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

export function getMaxAuctionSizes(
  params: BuildIndexDtfStartRebalanceParams,
  tokenOrder: readonly Address[],
  inputTokens: readonly IndexDtfBasketTokenInput[],
): number[] {
  const inputByAddress = new Map(inputTokens.map((token) => [token.address.toLowerCase(), token]));
  const sizes = new Map<string, number>();

  for (const [address, size] of Object.entries(params.maxAuctionSizesUsd ?? {})) {
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
