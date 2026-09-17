import { decodeFunctionData } from "viem";
import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import {
  getActiveAuction,
  getBidQuote,
  getLatestAuction,
  prepareIndexDtfBid,
  prepareIndexDtfCloseAuction,
  prepareIndexDtfEndRebalance,
} from "@/index-dtf/rebalance/execution";

const DTF = "0x0000000000000000000000000000000000000001";
const SELL_TOKEN = "0x0000000000000000000000000000000000000002";
const BUY_TOKEN = "0x0000000000000000000000000000000000000003";

type MockChain = {
  readonly nextAuctionId: bigint;
  readonly auction: readonly [bigint, bigint, bigint];
  readonly rebalanceNonce: bigint;
  readonly block: { readonly number: bigint; readonly timestamp: bigint };
};

// One fake chain: every read is served from the same state and records the
// block it was asked for, so same-block pinning is observable.
function createChainClient(chain: MockChain) {
  const readContract = vi.fn(
    async (request: {
      chainId: number;
      address: string;
      functionName: string;
      blockNumber?: bigint;
      args?: readonly unknown[];
    }) => {
      switch (request.functionName) {
        case "nextAuctionId":
          return chain.nextAuctionId;
        case "auctions":
          return chain.auction;
        case "getRebalance":
          return [
            chain.rebalanceNonce,
            0,
            [],
            { low: 0n, spot: 0n, high: 0n },
            { startedAt: 0n, restrictedUntil: 0n, availableUntil: 0n },
            true,
          ];
        default:
          throw new Error(`Unexpected read: ${request.functionName}`);
      }
    },
  );
  const getBlock = vi.fn(async () => ({ number: chain.block.number, timestamp: chain.block.timestamp }));
  const client = { viem: { readContract, getPublicClient: vi.fn(() => ({ getBlock })) } } as unknown as DtfClient;

  return { client, readContract, getBlock };
}

const AUCTION: MockChain["auction"] = [9n, 999_900n, 1_000_100n];

describe("Index DTF rebalance execution", () => {
  it("reads the latest auction from RPC pinned to the resolved head block", async () => {
    const { client, readContract, getBlock } = createChainClient({
      nextAuctionId: 3n,
      auction: AUCTION,
      rebalanceNonce: 9n,
      block: { number: 777n, timestamp: 1_000_000n },
    });

    const auction = await getLatestAuction(client, { address: DTF, chainId: 1 });

    expect(getBlock).toHaveBeenCalledWith({});
    expect(readContract.mock.calls.map(([request]) => [request.functionName, request.blockNumber])).toEqual([
      ["nextAuctionId", 777n],
      ["auctions", 777n],
      ["getRebalance", 777n],
    ]);
    expect(auction).toEqual({
      auctionId: 2n,
      rebalanceNonce: 9n,
      currentRebalanceNonce: 9n,
      startTime: 999_900n,
      endTime: 1_000_100n,
      blockNumber: 777n,
      isActive: true,
    });
  });

  it("returns null when no auctions have opened", async () => {
    const { client, readContract } = createChainClient({
      nextAuctionId: 0n,
      auction: AUCTION,
      rebalanceNonce: 0n,
      block: { number: 1n, timestamp: 1n },
    });

    await expect(getLatestAuction(client, { address: DTF, chainId: 1 })).resolves.toBeNull();
    expect(readContract).toHaveBeenCalledTimes(1);
  });

  // Folio: `block.timestamp >= startTime && block.timestamp <= endTime` (inclusive both ends).
  it.each([
    { timestamp: 999_899n, active: false },
    { timestamp: 999_900n, active: true },
    { timestamp: 1_000_099n, active: true },
    { timestamp: 1_000_100n, active: true },
    { timestamp: 1_000_101n, active: false },
  ])("reports active=$active at timestamp $timestamp", async ({ timestamp, active }) => {
    const { client } = createChainClient({
      nextAuctionId: 3n,
      auction: AUCTION,
      rebalanceNonce: 9n,
      block: { number: 5n, timestamp },
    });

    const auction = await getActiveAuction(client, { address: DTF, chainId: 1 });

    expect(auction === null).toBe(!active);
  });

  it("treats an atomic auction (start == end) as active only at that timestamp", async () => {
    const atomic: MockChain["auction"] = [9n, 1_000_000n, 1_000_000n];
    const at = async (timestamp: bigint) => {
      const { client } = createChainClient({
        nextAuctionId: 3n,
        auction: atomic,
        rebalanceNonce: 9n,
        block: { number: 5n, timestamp },
      });
      return getActiveAuction(client, { address: DTF, chainId: 1 });
    };

    expect(await at(999_999n)).toBeNull();
    expect(await at(1_000_000n)).not.toBeNull();
    expect(await at(1_000_001n)).toBeNull();
  });

  it("is not active when the latest auction belongs to a previous rebalance nonce", async () => {
    const { client } = createChainClient({
      nextAuctionId: 3n,
      auction: AUCTION,
      rebalanceNonce: 10n,
      block: { number: 5n, timestamp: 1_000_000n },
    });

    const latest = await getLatestAuction(client, { address: DTF, chainId: 1 });

    expect(latest).toMatchObject({ rebalanceNonce: 9n, currentRebalanceNonce: 10n, isActive: false });
    await expect(getActiveAuction(client, { address: DTF, chainId: 1 })).resolves.toBeNull();
  });

  it("pins auction state, nonce and timestamp to the same historical block", async () => {
    const { client, readContract, getBlock } = createChainClient({
      nextAuctionId: 3n,
      auction: AUCTION,
      rebalanceNonce: 9n,
      block: { number: 123n, timestamp: 1_000_000n },
    });

    const auction = await getActiveAuction(client, { address: DTF, chainId: 1, blockNumber: 123n });

    expect(getBlock).toHaveBeenCalledWith({ blockNumber: 123n });
    expect(
      readContract.mock.calls.map(([{ chainId, address, functionName, blockNumber, args }]) => ({
        chainId,
        address,
        functionName,
        blockNumber,
        args,
      })),
    ).toEqual([
      { chainId: 1, address: DTF, functionName: "nextAuctionId", blockNumber: 123n, args: undefined },
      { chainId: 1, address: DTF, functionName: "auctions", args: [2n], blockNumber: 123n },
      { chainId: 1, address: DTF, functionName: "getRebalance", blockNumber: 123n, args: undefined },
    ]);
    expect(auction).toMatchObject({ auctionId: 2n, isActive: true, blockNumber: 123n });
  });

  it("reads v5 bid quotes with stable token order", async () => {
    const readContract = vi.fn(async () => [100n, 120n, 12n]);
    const client = { viem: { readContract } } as unknown as DtfClient;

    const quote = await getBidQuote(client, {
      address: DTF,
      chainId: 1,
      auctionId: 4n,
      sellToken: SELL_TOKEN,
      buyToken: BUY_TOKEN,
      maxSellAmount: 100n,
    });

    expect(readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: "getBid",
        args: [4n, SELL_TOKEN, BUY_TOKEN, 100n],
      }),
    );
    expect(quote).toEqual({ sellAmount: 100n, bidAmount: 120n, price: 12n });
  });

  it("prepares bid, close auction, and end rebalance calls", () => {
    const bid = prepareIndexDtfBid({
      address: DTF,
      chainId: 8453,
      auctionId: 4n,
      sellToken: SELL_TOKEN,
      buyToken: BUY_TOKEN,
      sellAmount: 100n,
      maxBuyAmount: 130n,
      withCallback: true,
      data: "0x1234",
    });
    const close = prepareIndexDtfCloseAuction({
      address: DTF,
      chainId: 8453,
      auctionId: 4n,
    });
    const end = prepareIndexDtfEndRebalance({ address: DTF, chainId: 8453 });

    expect([bid, close, end].map(({ to, chainId, value }) => ({ to, chainId, value }))).toEqual([
      { to: DTF, chainId: 8453, value: 0n },
      { to: DTF, chainId: 8453, value: 0n },
      { to: DTF, chainId: 8453, value: 0n },
    ]);
    expect([bid, close, end].map(({ data }) => decodeFunctionData({ abi: dtfIndexAbi, data }))).toEqual([
      { functionName: "bid", args: [4n, SELL_TOKEN, BUY_TOKEN, 100n, 130n, true, "0x1234"] },
      { functionName: "closeAuction", args: [4n] },
      { functionName: "endRebalance", args: undefined },
    ]);
  });

  it("rejects zero-size bids", () => {
    expect(() =>
      prepareIndexDtfBid({
        address: DTF,
        chainId: 1,
        auctionId: 4n,
        sellToken: SELL_TOKEN,
        buyToken: BUY_TOKEN,
        sellAmount: 0n,
        maxBuyAmount: 1n,
      }),
    ).toThrow("sellAmount must be greater than 0");
  });
});
