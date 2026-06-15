import { afterEach, describe, expect, it, vi } from "vitest";

import { COLLATERAL_POOL_MAP, computeYieldDtfApy, getCollateralYields } from "@/yield-dtf/apy";

afterEach(() => {
  vi.unstubAllGlobals();
});

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

describe("getCollateralYields", () => {
  it("uses Ethereum canonical LST yields even when non-Ethereum entries arrive first", async () => {
    const baseWstethPool = "df65c4f4-e33a-481c-bac8-0c2252867c93";
    const baseCbethPool = "0c8567f8-ba5b-41ad-80de-00a71895eb19";
    const originalWsteth = COLLATERAL_POOL_MAP[8453][baseWstethPool];
    const originalCbeth = COLLATERAL_POOL_MAP[8453][baseCbethPool];

    COLLATERAL_POOL_MAP[8453][baseWstethPool] = "wsteth";
    COLLATERAL_POOL_MAP[8453][baseCbethPool] = "cbeth";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          data: [
            { chain: "Base", pool: baseWstethPool, apyMean30d: 99 },
            { chain: "Base", pool: baseCbethPool, apyMean30d: 88 },
            { chain: "Ethereum", pool: "747c1d2a-c668-4682-b9f9-296708a3dd90", apyMean30d: 3 },
            { chain: "Ethereum", pool: "0f45d730-b279-4629-8e11-ccb5cc3038b4", apyMean30d: 4 },
          ],
        }),
      })) as unknown as typeof fetch,
    );

    try {
      const yields = await getCollateralYields(8453);

      expect(yields.wsteth).toBe(3);
      expect(yields.cbeth).toBe(4);
    } finally {
      COLLATERAL_POOL_MAP[8453][baseWstethPool] = originalWsteth!;
      COLLATERAL_POOL_MAP[8453][baseCbethPool] = originalCbeth!;
    }
  });
});
