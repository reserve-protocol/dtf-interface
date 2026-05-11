import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { BuildIndexDtfStartRebalanceParams, BuiltIndexDtfStartRebalance } from "@/index-dtf/dtf/basket/types";

import { SdkError } from "@/errors";
import { getCurrentBalances, getDtfForWeightControl, getBasketTokenOrder } from "@/index-dtf/dtf/basket/current";
import { getBasketFromInput } from "@/index-dtf/dtf/basket/input";
import { getBasketShares } from "@/index-dtf/dtf/basket/math";
import { buildStartRebalanceArgs } from "@/index-dtf/dtf/basket/rebalance-args";
import {
  getBasketPriceErrors,
  getBasketPrices,
  getBasketTokens,
  getMaxAuctionSizes,
} from "@/index-dtf/dtf/basket/token-data";
import {
  assertNoDtfBasketToken,
  assertUniqueAddresses,
  assertValidBasketAddresses,
} from "@/index-dtf/dtf/basket/validation";
import { getTotalSupply } from "@/index-dtf/dtf/index";

export async function buildIndexDtfStartRebalance(
  client: DtfClient,
  params: BuildIndexDtfStartRebalanceParams,
): Promise<BuiltIndexDtfStartRebalance> {
  const address = getAddress(params.address);
  const inputTokens = params.basket.tokens.map((token) => ({ ...token, address: getAddress(token.address) }));
  assertUniqueAddresses(inputTokens.map((token) => token.address));
  assertValidBasketAddresses(inputTokens.map((token) => token.address));
  assertNoDtfBasketToken(
    address,
    inputTokens.map((token) => token.address),
  );

  const [currentBalances, supply, dtf] = await Promise.all([
    getCurrentBalances(client, params),
    params.supply ?? getTotalSupply(client, params),
    getDtfForWeightControl(client, params),
  ]);
  const tokenOrder = getBasketTokenOrder(currentBalances, inputTokens);
  assertValidBasketAddresses(tokenOrder);
  assertNoDtfBasketToken(address, tokenOrder);

  const [tokens, prices] = await Promise.all([
    getBasketTokens(client, params, tokenOrder, inputTokens),
    getBasketPrices(client, params, tokenOrder, inputTokens),
  ]);
  const pricedTokens = tokens.map((token, index) => ({ ...token, price: prices[index]! }));
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

  const balances = tokenOrder.map((token) => currentBalances[token.toLowerCase()] ?? 0n);
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
    startRebalanceArgs: buildStartRebalanceArgs({
      tokens: pricedTokens,
      supply,
      balances,
      basket: targetBasket,
      priceErrors,
      maxAuctionSizesUsd,
      weightControl,
      deferWeights: params.deferWeights ?? false,
    }),
  };
}
