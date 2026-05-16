import { D18n } from "@reserve-protocol/dtf-rebalance-lib";
import { getAddress, zeroAddress, type Address } from "viem";

import { SdkError } from "@/lib/errors";
import { TARGET_BASKET_TOLERANCE, type IndexDtfBasketToken } from "@/index-dtf/dtf/basket/types";

export function validateBasketTokens(tokens: readonly IndexDtfBasketToken[]) {
  if (tokens.length === 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket must include at least one token",
    });
  }

  assertUniqueAddresses(tokens.map((token) => token.address));
  assertValidBasketAddresses(tokens.map((token) => token.address));

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

export function assertValidBasketAddresses(addresses: readonly Address[]) {
  for (const address of addresses) {
    if (address.toLowerCase() === zeroAddress) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "Basket token address cannot be the zero address",
        meta: { address },
      });
    }
  }
}

export function assertNoDtfBasketToken(dtfAddress: Address, tokens: readonly Address[]) {
  const dtfKey = dtfAddress.toLowerCase();

  for (const token of tokens) {
    if (token.toLowerCase() === dtfKey) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "Basket token cannot be the DTF address",
        meta: { address: token, dtfAddress },
      });
    }
  }
}

export function validateShares(shares: readonly bigint[]) {
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

  if (total < D18n - TARGET_BASKET_TOLERANCE || total > D18n + TARGET_BASKET_TOLERANCE) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Basket shares must add up to 100%",
      meta: { total },
    });
  }
}

export function assertUniqueAddresses(addresses: readonly Address[]) {
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

export function assertPositiveNumber(value: number, field: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} must be a positive number`,
      meta: { [field]: value },
    });
  }
}
