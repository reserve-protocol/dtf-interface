import { describe, expect, it } from "vitest";

import type { GetYieldDtfQuery } from "@/yield-dtf/subgraph/yield.generated";

import { mapRevenueSplit, mapYieldDtf, mapYieldDtfStakeRecord, mapYieldDtfTransaction } from "@/yield-dtf/dtf/mappers";

const MAIN = "0x4444444444444444444444444444444444444444";
const OWNER = "0x5555555555555555555555555555555555555555";
const EXTERNAL = "0x6666666666666666666666666666666666666666";

// Frozen subgraph response shaped like eUSD; catches schema drift and mapping regressions.
const subgraphDtf: NonNullable<GetYieldDtfQuery["rtoken"]> = {
  id: "0xa0d69e286b938e21cbf7e51d71f6a4c8918f482f",
  createdTimestamp: "1664640000",
  owners: [OWNER],
  pausers: [OWNER],
  freezers: [],
  longFreezers: [],
  backing: "1000000000000000000",
  backingRSR: "50000000000000000",
  rewardTokenSupply: "21000000000000000000000000",
  rsrExchangeRate: "1.0845",
  rawRsrExchangeRate: "1084500000000000000",
  rsrStaked: "21000000000000000000000000",
  rsrStakedUSD: "157500.55",
  basketsNeeded: "24500000000000000000000000",
  holdersRewardShare: "60",
  stakersRewardShare: "40",
  targetUnits: "USD",
  collateralDistribution: "{}",
  token: {
    id: "0xa0d69e286b938e21cbf7e51d71f6a4c8918f482f",
    name: "Electronic Dollar",
    symbol: "eUSD",
    decimals: 18,
    totalSupply: "24500000000000000000000000",
    holderCount: "1234",
    transferCount: "99000",
    mintCount: "5000",
    burnCount: "3000",
    totalMinted: "30000000000000000000000000",
    totalBurned: "5500000000000000000000000",
    lastPriceUSD: "1.0001",
  },
  rewardToken: {
    token: {
      id: "0x18ba6e33ceb80f077deb9260c9111e62f21ae7b8",
      name: "eUSD RSR Vault",
      symbol: "eusdRSR",
      decimals: 18,
      totalSupply: "19000000000000000000000000",
    },
  },
  collaterals: [
    { id: "0x60c384e226b120d93f3e0f4c502957b2b9c32b15", symbol: "saUSDC" },
    { id: "0x465a5a630482f3abd6d3b84b39b29b07214d19e5", symbol: "fUSDC" },
  ],
  revenueDistribution: [
    { id: "1", destination: "0x0000000000000000000000000000000000000001", rTokenDist: 6000, rsrDist: 0 },
    { id: "2", destination: "0x0000000000000000000000000000000000000002", rTokenDist: 0, rsrDist: 3500 },
    { id: "3", destination: EXTERNAL, rTokenDist: 250, rsrDist: 250 },
  ],
};

describe("mapYieldDtf", () => {
  const dtf = mapYieldDtf(subgraphDtf, 1, {
    main: MAIN,
    mandate: "Stability first",
    collaterals: [
      {
        address: "0x60C384e226b120d93f3e0F4C502957b2B9C32B15",
        name: "Static Aave USDC",
        symbol: "saUSDC",
        decimals: 18,
      },
    ],
  });

  it("checksums addresses and maps identity", () => {
    expect(dtf.id).toBe("0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F");
    expect(dtf.main).toBe(MAIN);
    expect(dtf.mandate).toBe("Stability first");
    expect(dtf.stToken.symbol).toBe("eusdRSR");
    expect(dtf.targetUnits).toBe("USD");
    expect(dtf.createdAt).toBe(1664640000);
  });

  it("maps raw BigInt amounts through mapAmount", () => {
    expect(dtf.token.totalSupply.raw).toBe(24500000000000000000000000n);
    expect(dtf.token.totalSupply.formatted).toBe("24500000");
    expect(dtf.basketsNeeded.raw).toBe(24500000000000000000000000n);
    expect(dtf.staking.rsrStaked.raw).toBe(21000000000000000000000000n);
    expect(dtf.staking.stTokenSupply.formatted).toBe("21000000");
  });

  it("keeps display-class values as numbers", () => {
    expect(dtf.staking.exchangeRate).toBe(1.0845);
    expect(dtf.staking.rsrStakedUsd).toBe(157500.55);
    expect(dtf.token.holderCount).toBe(1234);
  });

  it("maps roles", () => {
    expect(dtf.roles.owners).toEqual([OWNER]);
    expect(dtf.roles.freezers).toEqual([]);
  });
});

describe("mapRevenueSplit", () => {
  it("resolves the furnace and stRSR sentinels into holder/staker shares", () => {
    const split = mapRevenueSplit(subgraphDtf.revenueDistribution);

    expect(split.holders).toBe(60);
    expect(split.stakers).toBe(35);
    expect(split.external).toEqual([{ destination: EXTERNAL, holdersShare: 2.5, stakersShare: 2.5 }]);
  });

  it("drops zeroed external destinations", () => {
    const split = mapRevenueSplit([{ id: "1", destination: EXTERNAL, rTokenDist: 0, rsrDist: 0 }]);

    expect(split.external).toEqual([]);
  });
});

describe("mapYieldDtfTransaction", () => {
  it("maps entry types and optional counterparties", () => {
    const transaction = mapYieldDtfTransaction(
      {
        id: "tx-1",
        hash: "0xabc",
        type: "STAKE",
        amount: "100.5",
        amountUSD: "100.45",
        stAmount: "98",
        timestamp: "1700000000",
        blockNumber: "18000000",
        from: { id: OWNER.toLowerCase() },
        to: null,
      },
      1,
    );

    expect(transaction.type).toBe("stake");
    expect(transaction.amount).toBe(100.5);
    expect(transaction.from).toBe(OWNER);
    expect(transaction.to).toBeUndefined();
  });
});

describe("mapYieldDtfStakeRecord", () => {
  it("uses raw fields for Amounts and decimal fields for display", () => {
    const record = mapYieldDtfStakeRecord({
      id: "rec-1",
      hash: "0xdef",
      isStake: true,
      amount: "100",
      amountRaw: "100000000000000000000",
      rsrAmount: "108.45",
      rsrAmountRaw: "108450000000000000000",
      exchangeRate: "1.0845",
      rsrPriceUSD: "0.0075",
      timestamp: "1700000000",
      blockNumber: "18000000",
    });

    expect(record.amount.raw).toBe(100000000000000000000n);
    expect(record.rsrAmount.formatted).toBe("108.45");
    expect(record.exchangeRate).toBe(1.0845);
    expect(record.isStake).toBe(true);
  });
});
