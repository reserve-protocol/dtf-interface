import { describe, expect, it } from "vitest";

import type { ReserveApiIndexDtfRebalanceDetail } from "@/types/api";

import { mapApiCompletedRebalanceDetail } from "@/index-dtf/rebalance/mappers";

const SELL_TOKEN = {
  address: "0x0000000000000000000000000000000000000011",
  symbol: "SELL",
  decimals: 18,
};
const BUY_TOKEN = {
  address: "0x0000000000000000000000000000000000000022",
  symbol: "BUY",
  decimals: 6,
};

const withAuctions: ReserveApiIndexDtfRebalanceDetail = {
  nonce: 7,
  timestamp: 1_700_000_000,
  totalRebalancedUsd: 1234.5,
  rebalanceAccuracy: 98.7,
  avgPriceImpactPercent: -0.42,
  totalPriceImpactUsd: -5.5,
  marketCapRebalanceImpact: 1.1,
  trackingBasketDeviation: 2.2,
  nativeBasketDeviation: 3.3,
  auctions: [
    {
      startTime: 1_700_000_100,
      endTime: 1_700_000_200,
      totalSellAmountUsd: 600,
      totalBuyAmountUsd: 610,
      bids: [
        {
          bidder: "0x0000000000000000000000000000000000000099",
          sellToken: SELL_TOKEN,
          buyToken: BUY_TOKEN,
          sellAmount: "1000000000000000000",
          buyAmount: "990000",
          sellAmountUsd: 600,
          buyAmountUsd: 610,
          priceImpactUsd: -2.5,
        },
      ],
    },
  ],
};

// A completed rebalance that ran no auctions returns `auctions: []` present-empty
// (verified against api.reserve.org base/lcap nonce 5), with some analytics
// fields absent. This maps to an empty list with no special handling.
const emptyAuctions: ReserveApiIndexDtfRebalanceDetail = {
  nonce: 8,
  timestamp: 1_700_100_000,
  totalRebalancedUsd: 0,
  rebalanceAccuracy: 100,
  auctions: [],
};

// A truly-absent `auctions` field never occurs in a well-formed response, so it
// is treated as malformed — fail loud rather than mask it as "0 auctions".
const malformed = {
  nonce: 9,
  timestamp: 1_700_200_000,
} as ReserveApiIndexDtfRebalanceDetail;

describe("mapApiCompletedRebalanceDetail", () => {
  it("maps a normal completed rebalance with auctions and analytics", () => {
    const result = mapApiCompletedRebalanceDetail(withAuctions);

    expect(result.auctions).toHaveLength(1);
    expect(result.auctions[0]?.bids[0]?.bidder).toBe("0x0000000000000000000000000000000000000099");
    expect(result.auctions[0]?.bids[0]?.sellAmount).toBe(1000000000000000000n);
    expect(result.avgPriceImpactPercent).toBe(-0.42);
    expect(result.totalPriceImpactUsd).toBe(-5.5);
    expect(result.marketCapRebalanceImpact).toBe(1.1);
    expect(result.trackingBasketDeviation).toBe(2.2);
    expect(result.nativeBasketDeviation).toBe(3.3);
    expect(result.rebalanceAccuracy).toBe(98.7);
  });

  it("maps a present-empty auctions list to an empty list", () => {
    const result = mapApiCompletedRebalanceDetail(emptyAuctions);

    expect(result.auctions).toEqual([]);
    expect(result.nonce).toBe(8);
    expect(result.rebalanceAccuracy).toBe(100);
    // Absent analytics fields stay absent — never fabricated.
    expect(result.avgPriceImpactPercent).toBeUndefined();
    expect(result.totalPriceImpactUsd).toBeUndefined();
  });

  it("throws INVALID_RESPONSE when auctions is truly absent (malformed)", () => {
    expect(() => mapApiCompletedRebalanceDetail(malformed)).toThrow(/missing auctions/i);
  });
});
