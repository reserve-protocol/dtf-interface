import { getAddress, type Address, type Hex } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { DtfParams } from "@/types/common";
import type { IndexDtfCall } from "@/types/governance";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { getIndexDtfWriteAbi, type IndexDtfWriteVersion } from "@/index-dtf/write-version";
import { prepareContractCall } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";

export type IndexDtfLatestAuction = {
  readonly auctionId: bigint;
  readonly rebalanceNonce: bigint;
  /** `getRebalance().nonce` at the same block; bids are rejected when it differs from `rebalanceNonce`. */
  readonly currentRebalanceNonce: bigint;
  readonly startTime: bigint;
  readonly endTime: bigint;
  /** Block every field above was read at. */
  readonly blockNumber: bigint;
  readonly isActive: boolean;
};

export type IndexDtfActiveAuction = Omit<IndexDtfLatestAuction, "isActive"> & {
  readonly isActive: true;
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
  readonly version: IndexDtfWriteVersion;
  readonly auctionId: bigint;
  readonly sellToken: Address;
  readonly buyToken: Address;
  readonly sellAmount: bigint;
  readonly maxBuyAmount: bigint;
  readonly withCallback?: boolean;
  readonly data?: Hex;
};

/**
 * Resolves one block first and pins every read to it: auction id, auction
 * window, current rebalance nonce and timestamp all describe the same state.
 * Folio accepts bids while `startTime <= now <= endTime` (inclusive) and only
 * when the auction's nonce equals the current rebalance nonce.
 */
export async function getLatestAuction(client: DtfClient, params: DtfParams): Promise<IndexDtfLatestAuction | null> {
  const address = getAddress(params.address);
  const block = await getAuctionBlock(client, params);
  const blockNumber = block.number;
  const nextAuctionId = await client.viem.readContract({
    chainId: params.chainId,
    address,
    abi: dtfIndexAbi,
    functionName: "nextAuctionId",
    blockNumber,
  });

  if (nextAuctionId === 0n) {
    return null;
  }

  const auctionId = nextAuctionId - 1n;
  const [[rebalanceNonce, startTime, endTime], rebalance] = await Promise.all([
    client.viem.readContract({
      chainId: params.chainId,
      address,
      abi: dtfIndexAbi,
      functionName: "auctions",
      args: [auctionId],
      blockNumber,
    }),
    client.viem.readContract({
      chainId: params.chainId,
      address,
      abi: dtfIndexAbi,
      functionName: "getRebalance",
      blockNumber,
    }),
  ]);
  const currentRebalanceNonce = (rebalance as unknown as readonly unknown[])[0] as bigint;
  const now = block.timestamp;

  return {
    auctionId,
    rebalanceNonce,
    currentRebalanceNonce,
    startTime,
    endTime,
    blockNumber,
    isActive: rebalanceNonce === currentRebalanceNonce && startTime <= now && now <= endTime,
  };
}

export async function getActiveAuction(client: DtfClient, params: DtfParams): Promise<IndexDtfActiveAuction | null> {
  const auction = await getLatestAuction(client, params);

  return auction?.isActive ? { ...auction, isActive: true } : null;
}

async function getAuctionBlock(
  client: DtfClient,
  params: DtfParams,
): Promise<{ readonly number: bigint; readonly timestamp: bigint }> {
  const publicClient = client.viem.getPublicClient(params.chainId);
  const block =
    params.blockNumber === undefined
      ? await publicClient.getBlock({})
      : await publicClient.getBlock({ blockNumber: params.blockNumber });

  return { number: block.number, timestamp: block.timestamp };
}

export async function getBidQuote(client: DtfClient, params: GetIndexDtfBidQuoteParams): Promise<IndexDtfBidQuote> {
  const [sellAmount, bidAmount, price] = await client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: dtfIndexAbi,
    functionName: "getBid",
    args: [params.auctionId, getAddress(params.sellToken), getAddress(params.buyToken), params.maxSellAmount],
    blockNumber: params.blockNumber,
  });

  return { sellAmount, bidAmount, price };
}

export function prepareIndexDtfBid(params: PrepareIndexDtfBidParams): IndexDtfCall {
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
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "bid",
    args: [
      params.auctionId,
      params.sellToken,
      params.buyToken,
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
  readonly version: IndexDtfWriteVersion;
  readonly auctionId: bigint;
}): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "closeAuction",
    args: [params.auctionId] as const,
  });
}

export function prepareIndexDtfEndRebalance(params: {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly version: IndexDtfWriteVersion;
}): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "endRebalance",
    args: [] as const,
  });
}
