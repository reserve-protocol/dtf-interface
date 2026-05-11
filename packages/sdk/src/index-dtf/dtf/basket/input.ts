import type { Decimal as DecimalType } from "decimal.js-light";

import { Decimal } from "@reserve-protocol/dtf-rebalance-lib";
import { getAddress, parseUnits, type Address } from "viem";

import { SdkError } from "@/errors";
import {
  SHARE_DECIMALS,
  type IndexDtfBasketDefinition,
  type IndexDtfBasketInput,
  type IndexDtfBasketToken,
} from "@/index-dtf/dtf/basket/types";
import { validateShares } from "@/index-dtf/dtf/basket/validation";

export function getBasketFromInput(
  input: IndexDtfBasketInput,
  tokenOrder: readonly Address[],
  tokens: readonly IndexDtfBasketToken[],
): IndexDtfBasketDefinition {
  const inputByAddress = new Map(input.tokens.map((token) => [getAddress(token.address).toLowerCase(), token]));

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

    return token && "units" in token ? parseTokenUnits(token.units, tokens[index]!.decimals) : 0n;
  });

  return { type: "units", units };
}

export function parseTokenUnits(value: string | number, decimals: number): bigint {
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

export function parseShare(value: string | number): bigint {
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
