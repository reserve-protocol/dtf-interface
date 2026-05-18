import { afterEach, describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

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

describe("Index DTF rebalance execution", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reads the latest auction from RPC", async () => {
    const readContract = vi.fn().mockResolvedValueOnce(3n).mockResolvedValueOnce([9n, 999_900n, 1_000_100n]);
    const getBlock = vi.fn(async () => ({ timestamp: 1_000_000n }));
    const client = {
      viem: {
        readContract,
        getPublicClient: vi.fn(() => ({ getBlock })),
      },
    } as unknown as DtfClient;

    const auction = await getLatestAuction(client, {
      address: DTF,
      chainId: 1,
    });

    expect(readContract).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        functionName: "auctions",
        args: [2n],
      }),
    );
    expect(getBlock).toHaveBeenCalledWith();
    expect(auction).toEqual({
      auctionId: 2n,
      rebalanceNonce: 9n,
      startTime: 999_900n,
      endTime: 1_000_100n,
      isActive: true,
    });
  });

  it("returns null when no auctions have opened", async () => {
    const readContract = vi.fn(async () => 0n);
    const client = { viem: { readContract } } as unknown as DtfClient;

    await expect(getLatestAuction(client, { address: DTF, chainId: 1 })).resolves.toBeNull();
    expect(readContract).toHaveBeenCalledTimes(1);
  });

  it("returns only the active latest auction from RPC", async () => {
    const readContract = vi.fn().mockResolvedValueOnce(3n).mockResolvedValueOnce([9n, 999_900n, 1_000_100n]);
    const getBlock = vi.fn(async () => ({ timestamp: 1_000_000n }));
    const client = {
      viem: {
        readContract,
        getPublicClient: vi.fn(() => ({ getBlock })),
      },
    } as unknown as DtfClient;

    const auction = await getActiveAuction(client, {
      address: DTF,
      chainId: 1,
    });

    expect(auction).toEqual({
      auctionId: 2n,
      rebalanceNonce: 9n,
      startTime: 999_900n,
      endTime: 1_000_100n,
      isActive: true,
    });
  });

  it("returns null when the latest auction is not active", async () => {
    const readContract = vi.fn().mockResolvedValueOnce(3n).mockResolvedValueOnce([9n, 999_000n, 999_900n]);
    const getBlock = vi.fn(async () => ({ timestamp: 1_000_000n }));
    const client = {
      viem: {
        readContract,
        getPublicClient: vi.fn(() => ({ getBlock })),
      },
    } as unknown as DtfClient;

    await expect(getActiveAuction(client, { address: DTF, chainId: 1 })).resolves.toBeNull();
  });

  it("uses block timestamp for historical active auction reads", async () => {
    const readContract = vi.fn().mockResolvedValueOnce(3n).mockResolvedValueOnce([9n, 999_900n, 1_000_100n]);
    const getBlock = vi.fn(async () => ({ timestamp: 1_000_000n }));
    const client = {
      viem: {
        readContract,
        getPublicClient: vi.fn(() => ({ getBlock })),
      },
    } as unknown as DtfClient;

    const auction = await getActiveAuction(client, {
      address: DTF,
      chainId: 1,
      blockNumber: 123n,
    });

    expect(getBlock).toHaveBeenCalledWith({ blockNumber: 123n });
    expect(auction?.isActive).toBe(true);
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

    expect(bid.contract.functionName).toBe("bid");
    expect(bid.contract.args).toEqual([4n, SELL_TOKEN, BUY_TOKEN, 100n, 130n, true, "0x1234"]);
    expect(close.contract.functionName).toBe("closeAuction");
    expect(close.contract.args).toEqual([4n]);
    expect(end.contract.functionName).toBe("endRebalance");
    expect(end.contract.args).toEqual([]);
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
