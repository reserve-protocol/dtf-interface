import { FolioVersion, getStartRebalance } from "@reserve-protocol/dtf-rebalance-lib";

import type { BuildIndexDtfStartRebalanceArgsParams, StartRebalanceArgsV5 } from "./types.js";

import { SdkError } from "../../../errors.js";
import { getBasketShares } from "./math.js";
import { assertPositiveNumber, validateBasketTokens } from "./validation.js";

export function buildStartRebalanceArgs(params: BuildIndexDtfStartRebalanceArgsParams): StartRebalanceArgsV5 {
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

  validateBasketTokens(params.tokens);
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
