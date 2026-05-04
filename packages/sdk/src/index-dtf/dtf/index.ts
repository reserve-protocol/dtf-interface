import type { Address } from "viem";
import { getAddress } from "viem";
import type { DtfClient } from "../../client.js";
import { SdkError } from "../../errors.js";
import { mapAmount } from "../../lib/utils.js";
import { getTokensData } from "../../tokens/index.js";
import type { DtfParams, DtfParamsWithBlock } from "../../types/common.js";
import type {
  GetFullIndexDtfParams,
  GetIndexDtfParams,
  GetIndexDtfPriceHistoryParams,
  IndexDtf,
  IndexDtfBasket,
  IndexDtfBasketAssetWithPrice,
  IndexDtfBasketWithPrice,
  IndexDtfBrand,
  IndexDtfFull,
  IndexDtfPrice,
  IndexDtfPricePoint,
} from "../../types/index-dtf.js";
import { folioAbi } from "../abis/folio.js";
import {
  mapIndexDtf,
  mapIndexDtfBrand,
  mapIndexDtfPrice,
  type IndexDtfBrandResponse,
  type IndexDtfPriceResponse,
} from "./mappers.js";
import { GetIndexDtfDocument } from "../subgraph/dtf.generated.js";

export async function getIndexDtf(
  client: DtfClient,
  params: GetIndexDtfParams,
): Promise<IndexDtf> {
  const { dtf } = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfDocument,
    variables: {
      id: getAddress(params.address).toLowerCase(),
      ...(params.blockNumber === undefined
        ? {}
        : { block: { number: Number(params.blockNumber) } }),
    },
  });

  if (!dtf) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Index DTF not found: ${getAddress(params.address)} on chain ${params.chainId}`,
      meta: {
        address: getAddress(params.address),
        chainId: params.chainId,
        entity: "indexDtf",
      },
    });
  }

  return mapIndexDtf(dtf, params.chainId);
}

export async function getFullIndexDtf(
  client: DtfClient,
  params: GetFullIndexDtfParams,
): Promise<IndexDtfFull> {
  const [dtf, market, brand] = await Promise.all([
    getIndexDtf(client, params),
    getIndexDtfBasketWithPrice(client, params),
    params.brand ? getIndexDtfBrand(client, params) : undefined,
  ]);

  return {
    ...dtf,
    market: {
      price: market.price,
      marketCap: market.marketCap,
      totalSupply: market.totalSupply,
      fetchedAt: market.timestamp,
    },
    basket: market.basket,
    ...(brand ? { brand } : {}),
  };
}

export async function getIndexDtfBasketWithPrice(
  client: DtfClient,
  params: DtfParams,
): Promise<IndexDtfBasketWithPrice> {
  const [basket, price] = await Promise.all([
    getIndexDtfBasket(client, params),
    getIndexDtfPrice(client, params),
  ]);

  const basketWithPrice: Record<Address, IndexDtfBasketAssetWithPrice> = {};

  for (const priceAsset of price.basket) {
    const tokenAddress = getAddress(priceAsset.token.address);
    const asset = basket[tokenAddress];

    if (!asset) {
      throw new SdkError({
        code: "INVALID_RESPONSE",
        message: `Basket onchain mismatch with API for token: ${tokenAddress}`,
        meta: {
          address: params.address,
          chainId: params.chainId,
          entity: "indexDtfBasket",
          token: tokenAddress,
        },
      });
    }

    basketWithPrice[tokenAddress] = {
      ...asset,
      ...priceAsset,
      token: asset.token,
    };
  }

  return {
    ...price,
    basket: basketWithPrice,
  };
}

export async function getIndexDtfBasket(
  client: DtfClient,
  params: DtfParamsWithBlock,
): Promise<IndexDtfBasket> {
  const publicClient = client.viem.getPublicClient(params.chainId);
  const [assetAddresses, balances] = await publicClient.readContract({
    address: params.address,
    abi: folioAbi,
    functionName: "totalAssets",
    blockNumber: params.blockNumber,
  });
  const tokens = await getTokensData(publicClient, [...assetAddresses]);
  const basket: IndexDtfBasket = {};

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const balance = balances[i];

    if (!token || balance === undefined) {
      throw new SdkError({
        code: "INVALID_RESPONSE",
        message: `Invalid Index DTF basket response: ${params.address} on chain ${params.chainId}`,
        meta: {
          address: params.address,
          chainId: params.chainId,
          entity: "indexDtfBasket",
        },
      });
    }

    const tokenAddress = getAddress(token.address);

    basket[tokenAddress] = {
      token: {
        ...token,
        address: tokenAddress,
      },
      balance: mapAmount(balance, token.decimals),
    };
  }

  return basket;
}

export async function getIndexDtfPrice(
  client: DtfClient,
  params: DtfParams,
): Promise<IndexDtfPrice> {
  if (client.indexPricingProvider) {
    return client.indexPricingProvider.getCurrent(params);
  }

  const address = getAddress(params.address);
  const response = await client.api.get<IndexDtfPriceResponse>({
    path: "/current/dtf",
    query: {
      address: address.toLowerCase(),
      chainId: params.chainId,
    },
  });

  return mapIndexDtfPrice(response, { address, chainId: params.chainId });
}

export async function getIndexDtfBrand(
  client: DtfClient,
  params: DtfParams,
): Promise<IndexDtfBrand | undefined> {
  if (client.indexBrandProvider) {
    return client.indexBrandProvider.get(params);
  }

  const address = getAddress(params.address);
  const response = await client.api.get<IndexDtfBrandResponse>({
    path: "/folio-manager/read",
    query: {
      folio: address.toLowerCase(),
      chainId: params.chainId,
    },
  });

  return mapIndexDtfBrand(response);
}

export async function getIndexDtfPriceHistory(
  client: DtfClient,
  params: GetIndexDtfPriceHistoryParams,
): Promise<readonly IndexDtfPricePoint[]> {
  if (client.indexPricingProvider?.getHistory) {
    return client.indexPricingProvider.getHistory(params);
  }

  throw new SdkError({
    code: "NOT_IMPLEMENTED",
    message: "getIndexDtfPriceHistory is not implemented yet.",
    meta: { method: "getIndexDtfPriceHistory" },
  });
}
