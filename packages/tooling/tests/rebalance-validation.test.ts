import { describe, expect, it } from "vitest";

import { bandUsage, ordersOfMagnitude } from "@/rebalance-validation/checks/prices";
import { parseProposalUrl } from "@/rebalance-validation/proposal-url";
import { Report } from "@/rebalance-validation/report";
import { selectDeepestPool } from "@/rebalance-validation/sources/pool-prices";
import { symbolMatchesListing } from "@/rebalance-validation/sources/token-identity";
import { recoverTokenInputs } from "@/rebalance-validation/start-rebalance";

const shibToken = {
  token: "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D" as const,
  // price = 5.032e-6 USD/wholeTok with a 75% price error, D27{nanoUSD/tok}
  price: { low: 1_258_000_000_000n, high: 20_128_000_000_000n },
  weight: { low: 0n, spot: 0n, high: 0n },
  maxAuctionSize: 0n,
  inRebalance: true,
};

describe("parseProposalUrl", () => {
  it("parses chain, dtf and proposal id", () => {
    expect(
      parseProposalUrl("https://app.reserve.org/bsc/index-dtf/cmc20/governance/proposal/6159906300201580929499"),
    ).toEqual({ chainId: 56, dtf: "cmc20", proposalId: "6159906300201580929499" });
  });

  it("rejects anything that is not a proposal url", () => {
    expect(() => parseProposalUrl("https://app.reserve.org/bsc/index-dtf/cmc20")).toThrow(/not a governance proposal/);
    expect(() => parseProposalUrl("https://app.reserve.org/solana/index-dtf/x/governance/proposal/1")).toThrow();
  });
});

describe("recoverTokenInputs", () => {
  it("recovers the price and price error from the encoded band", () => {
    const recovered = recoverTokenInputs(shibToken, 18);

    expect(recovered.price).toBeCloseTo(5.032e-6, 12);
    expect(recovered.priceError).toBeCloseTo(0.75, 6);
    expect(recovered.priceLow).toBeLessThan(recovered.price);
    expect(recovered.priceHigh).toBeGreaterThan(recovered.price);
  });
});

describe("ordersOfMagnitude", () => {
  it("is zero for equal values and 1 for a 10x", () => {
    expect(ordersOfMagnitude(5, 5)).toBe(0);
    expect(ordersOfMagnitude(50, 5)).toBeCloseTo(1);
    expect(ordersOfMagnitude(5, 50)).toBeCloseTo(1);
  });

  it("treats non-positive values as infinitely far apart", () => {
    expect(ordersOfMagnitude(0, 5)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("bandUsage", () => {
  it("is zero at the mean and one at each edge", () => {
    expect(bandUsage(10, 5, 20, 10)).toBe(0);
    expect(bandUsage(20, 5, 20, 10)).toBe(1);
    expect(bandUsage(5, 5, 20, 10)).toBe(1);
    expect(bandUsage(15, 5, 20, 10)).toBeCloseTo(0.5);
  });
});

describe("selectDeepestPool", () => {
  const token = "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D" as const;
  const pair = (liquidityUsd: number, priceUsd: string, chainId = "bsc") => ({
    chainId,
    dexId: "pancakeswap",
    baseToken: { address: token, symbol: "SHIB" },
    quoteToken: { symbol: "WBNB" },
    priceUsd,
    liquidity: { usd: liquidityUsd },
  });

  it("prices from the deepest pool and sums liquidity across pools on the chain", () => {
    const quote = selectDeepestPool([pair(100, "0.9"), pair(300, "1.0"), pair(500, "2.0", "base")], 56, token);

    expect(quote?.price).toBe(1);
    expect(quote?.liquidityUsd).toBe(400);
  });

  it("ignores pools where the token is the quote side", () => {
    const quoted = { ...pair(900, "1.5"), baseToken: { address: "0x0000000000000000000000000000000000000001" } };

    expect(selectDeepestPool([quoted], 56, token)).toBeUndefined();
  });
});

describe("symbolMatchesListing", () => {
  it("accepts bridged wrappers of the same underlying", () => {
    expect(symbolMatchesListing("BTCB", "btc")).toBe(true);
    expect(symbolMatchesListing("SHIB", "shib")).toBe(true);
    expect(symbolMatchesListing("SHIB", "shibb")).toBe(false);
  });
});

describe("Report", () => {
  it("only counts disaster-pass failures as blocking", () => {
    const report = new Report();
    report.record("outcomes", "fail", "liquidity route failed");
    expect(report.failures).toBe(0);

    report.record("disasters", "fail", "pool price outside band");
    expect(report.failures).toBe(1);
  });
});
