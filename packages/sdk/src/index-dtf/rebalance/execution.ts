import { getAddress, type Address, type Hex } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/defaults";
import type { DtfParams } from "@/types/common";

import { prepareContractCall } from "@/contract-call";
import { SdkError } from "@/errors";
import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";

export type IndexDtfActiveAuction = {
  readonly auctionId: bigint;
  readonly rebalanceNonce: bigint;
  readonly startTime: bigint;
  readonly endTime: bigint;
  readonly isActive: boolean;
};

export type IndexDtfBidQuote = {
  readonly sellAmount: bigint;
  readonly bidAmount: bigint;
  readonly price: bigint;
};

export type GetIndexDtfBidQuoteParams = DtfParams & {
  readonly auctionId: bigint;
  readonly sellToken: Address;
  readonly buyToken: Address;
  readonly maxSellAmount: bigint;
};

export type PrepareIndexDtfBidParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly auctionId: bigint;
  readonly sellToken: Address;
  readonly buyToken: Address;
  readonly sellAmount: bigint;
  readonly maxBuyAmount: bigint;
  readonly withCallback?: boolean;
  readonly data?: Hex;
};

export async function getActiveAuction(
  client: DtfClient,
  params: DtfParams,
): Promise<IndexDtfActiveAuction | null> {
  const address = getAddress(params.address);
  const nextAuctionId = await client.viem.readContract({
    chainId: params.chainId,
    address,
    abi: dtfIndexAbi,
    functionName: "nextAuctionId",
    blockNumber: params.blockNumber,
  });

  if (nextAuctionId === 0n) {
    return null;
  }

  const auctionId = nextAuctionId - 1n;
  const [rebalanceNonce, startTime, endTime] = await client.viem.readContract({
    chainId: params.chainId,
    address,
    abi: dtfIndexAbi,
    functionName: "auctions",
    args: [auctionId],
    blockNumber: params.blockNumber,
  });
  const now = BigInt(Math.floor(Date.now() / 1000));

  return {
    auctionId,
    rebalanceNonce,
    startTime,
    endTime,
    isActive: startTime <= now && now < endTime,
  };
}

export async function getBidQuote(
  client: DtfClient,
  params: GetIndexDtfBidQuoteParams,
): Promise<IndexDtfBidQuote> {
  const [sellAmount, bidAmount, price] = await client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: dtfIndexAbi,
    functionName: "getBid",
    args: [
      params.auctionId,
      getAddress(params.sellToken),
      getAddress(params.buyToken),
      params.maxSellAmount,
    ],
    blockNumber: params.blockNumber,
  });

  return { sellAmount, bidAmount, price };
}

export function prepareIndexDtfBid(params: PrepareIndexDtfBidParams) {
  if (params.sellAmount <= 0n) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "sellAmount must be greater than 0",
      meta: { sellAmount: params.sellAmount },
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: dtfIndexAbi,
    functionName: "bid",
    args: [
      params.auctionId,
      getAddress(params.sellToken),
      getAddress(params.buyToken),
      params.sellAmount,
      params.maxBuyAmount,
      params.withCallback ?? false,
      params.data ?? "0x",
    ] as const,
  });
}

export function prepareIndexDtfCloseAuction(params: {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly auctionId: bigint;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: dtfIndexAbi,
    functionName: "closeAuction",
    args: [params.auctionId] as const,
  });
}

export function prepareIndexDtfEndRebalance(params: {
  readonly address: Address;
  readonly chainId: SupportedChainId;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: dtfIndexAbi,
    functionName: "endRebalance",
    args: [] as const,
  });
}
