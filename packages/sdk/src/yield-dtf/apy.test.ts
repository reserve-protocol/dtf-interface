import { describe, expect, it } from "vitest";

import { COLLATERAL_POOL_MAP, computeYieldDtfApy } from "@/yield-dtf/apy";

describe("computeYieldDtfApy", () => {
  // eUSD-shaped example: 4% blended yield, 60/40 split, 2x staker leverage.
  const params = {
    basket: [
      { symbol: "saUSDC", share: 50 },
      { symbol: "wcusdcv3", share: 50 },
    ],
    collateralYields: { sausdc: 3, wcusdcv3: 5 },
    revenueSplit: { holders: 60, stakers: 40 },
    supplyUsd: 20_000_000,
    stakedUsd: 10_000_000,
  };

  it("weights collateral yields by basket share", () => {
    expect(computeYieldDtfApy(params).basket).toBe(4);
  });

  it("splits holder APY by revenue share", () => {
    expect(computeYieldDtfApy(params).holders).toBeCloseTo(2.4);
  });

  it("levers staker APY by supply over stake", () => {
    // 4% basket on 20M supply -> 800k revenue; 40% of that on 10M stake = 3.2%.
    expect(computeYieldDtfApy(params).stakers).toBeCloseTo(3.2);
  });

  it("does not lever stakers when nothing is staked", () => {
    expect(computeYieldDtfApy({ ...params, stakedUsd: 0 }).stakers).toBeCloseTo(1.6);
  });

  it("matches symbols case-insensitively and skips unknown collateral", () => {
    const apy = computeYieldDtfApy({
      ...params,
      basket: [
        { symbol: "SAUSDC", share: 50 },
        { symbol: "unknown", share: 50 },
      ],
    });

    expect(apy.basket).toBe(1.5);
  });
});

describe("COLLATERAL_POOL_MAP", () => {
  it("has unique pool ids per chain and lowercase symbols", () => {
    for (const map of Object.values(COLLATERAL_POOL_MAP)) {
      const ids = Object.keys(map);
      expect(new Set(ids).size).toBe(ids.length);
      for (const symbol of Object.values(map)) {
        expect(symbol).toBe(symbol.toLowerCase());
      }
    }
  });
});
