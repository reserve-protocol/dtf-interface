import type { Address } from "viem";

import { getAddress } from "viem";

import type { DtfClient } from "../../client.js";
import type { DtfParams } from "../../types/common.js";
import type {
  GetFullIndexDtfParams,
  GetIndexDtfPriceHistoryParams,
  GetIndexDtfTotalAssetsParams,
  GetIndexDtfTotalSupplyParams,
  GetIndexDtfVersionParams,
  IndexDtf,
  IndexDtfBasket,
  IndexDtfBasketSnapshot,
  IndexDtfBasketAssetWithPrice,
  IndexDtfBasketWithPrice,
  IndexDtfBrand,
  IndexDtfFull,
  IndexDtfPrice,
  IndexDtfPricePoint,
  IndexDtfTotalAssets,
} from "../../types/index-dtf.js";

import { SdkError } from "../../errors.js";
import { mapAmount } from "../../lib/utils.js";
import { getTokensData } from "../../tokens/index.js";
import dtfAbi from "../abis/dtf-index-abi-v6.js";
import { GetIndexDtfDocument } from "../subgraph/dtf.generated.js";
import {
  mapIndexDtf,
  mapIndexDtfBasketSnapshot,
  mapIndexDtfBrand,
  mapIndexDtfPrice,
  mapIndexDtfPriceHistory,
  type IndexDtfBrandResponse,
} from "./mappers.js";

export async function getDtf(client: DtfClient, params: DtfParams): Promise<IndexDtf> {
  const { dtf } = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfDocument,
    variables: {
      id: getAddress(params.address).toLowerCase(),
      ...(params.blockNumber === undefined ? {} : { block: { number: Number(params.blockNumber) } }),
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

export async function getFull(client: DtfClient, params: GetFullIndexDtfParams): Promise<IndexDtfFull> {
  const [dtf, market, brand] = await Promise.all([
    getDtf(client, params),
    getBasketWithPrice(client, params),
    params.brand ? getBrand(client, params) : undefined,
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

export async function getBasketWithPrice(client: DtfClient, params: DtfParams): Promise<IndexDtfBasketWithPrice> {
  const [basket, price] = await Promise.all([getBasket(client, params), getPrice(client, params)]);

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

export async function getBasket(client: DtfClient, params: DtfParams): Promise<IndexDtfBasket> {
  const publicClient = client.viem.getPublicClient(params.chainId);
  const { tokens: assetAddresses, balances } = await getTotalAssets(client, params);
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

export async function getBasketSnapshot(client: DtfClient, params: DtfParams): Promise<IndexDtfBasketSnapshot> {
  const response = await client.api.getIndexDtfBasketSnapshot(params);

  return mapIndexDtfBasketSnapshot(response);
}

export async function getVersion(client: DtfClient, params: GetIndexDtfVersionParams): Promise<string> {
  const publicClient = client.viem.getPublicClient(params.chainId);

  return publicClient.readContract({
    address: getAddress(params.address),
    abi: dtfAbi,
    functionName: "version",
    blockNumber: params.blockNumber,
  });
}

export async function getTotalSupply(client: DtfClient, params: GetIndexDtfTotalSupplyParams): Promise<bigint> {
  const publicClient = client.viem.getPublicClient(params.chainId);

  return publicClient.readContract({
    address: getAddress(params.address),
    abi: dtfAbi,
    functionName: "totalSupply",
    blockNumber: params.blockNumber,
  });
}

export async function getTotalAssets(
  client: DtfClient,
  params: GetIndexDtfTotalAssetsParams,
): Promise<IndexDtfTotalAssets> {
  const publicClient = client.viem.getPublicClient(params.chainId);
  const [tokens, balances] = await publicClient.readContract({
    address: getAddress(params.address),
    abi: dtfAbi,
    functionName: "totalAssets",
    blockNumber: params.blockNumber,
  });
  const normalizedTokens = tokens.map((token) => getAddress(token));
  const balanceByToken: Record<Address, bigint> = {};

  for (let i = 0; i < normalizedTokens.length; i++) {
    balanceByToken[normalizedTokens[i]!] = balances[i]!;
  }

  return {
    tokens: normalizedTokens,
    balances,
    balanceByToken,
  };
}

export async function getPrice(client: DtfClient, params: DtfParams): Promise<IndexDtfPrice> {
  const address = getAddress(params.address);
  const response = await client.api.getIndexDtfPrice(params);

  return mapIndexDtfPrice(response, { address, chainId: params.chainId });
}

export async function getBrand(client: DtfClient, params: DtfParams): Promise<IndexDtfBrand | undefined> {
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

export async function getPriceHistory(
  client: DtfClient,
  params: GetIndexDtfPriceHistoryParams,
): Promise<readonly IndexDtfPricePoint[]> {
  const response = await client.api.getIndexDtfPriceHistory(params);

  return mapIndexDtfPriceHistory(response);
}

export async function getMandate(client: DtfClient, params: DtfParams): Promise<string> {
  const { address, chainId, blockNumber } = params;
  const publicClient = client.viem.getPublicClient(chainId);

  return publicClient.readContract({
    address,
    abi: dtfAbi,
    functionName: "mandate",
    blockNumber,
  });
}

// // Setter methods
// // ONLY available for the ADMIN role, solidity runs the validation
// export async function setIndexDtfTvlFee
