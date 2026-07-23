import { PriceControl } from "@reserve-protocol/dtf-rebalance-lib";
import { describe, expect, it } from "vitest";

import type { IndexDtfOpenAuctionInput } from "@/index-dtf/rebalance/types";

import { prepareIndexDtfOpenAuction, prepareIndexDtfOpenAuctionArgs } from "@/index-dtf/rebalance/open-auction";

// Runs the REAL dtf-rebalance-lib (unlike open-auction.test.ts, which mocks it)
// so its zero-price/zero-supply guards provably surface through the SDK builder
// instead of producing silently skewed auction args.

const DTF = "0x0000000000000000000000000000000000000D7F";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC_KEY = USDC.toLowerCase();
const DAI_KEY = DAI.toLowerCase();

const USDC_WEIGHT = { low: 45n * 10n ** 13n, spot: 5n * 10n ** 14n, high: 55n * 10n ** 13n } as const;
const DAI_WEIGHT = { low: 45n * 10n ** 25n, spot: 5n * 10n ** 26n, high: 55n * 10n ** 25n } as const;

describe("prepareIndexDtfOpenAuctionArgs with the real rebalance library", () => {
  it("throws on a zero-price token instead of building skewed auction args", () => {
    const input = createInput();

    expect(() =>
      prepareIndexDtfOpenAuctionArgs({
        ...input,
        prices: { ...input.prices, [USDC_KEY]: { currentPrice: 0, snapshotPrice: 1 } },
      }),
    ).toThrow(/missing price for token/);
  });

  it("throws on a zero-price token in the target basket price set", () => {
    const input = createInput();

    expect(() =>
      prepareIndexDtfOpenAuctionArgs({
        ...input,
        initialPrices: { ...input.initialPrices, [DAI_KEY]: 0 },
      }),
    ).toThrow(/missing price for token index/);
  });

  it("throws on zero supply instead of building skewed auction args", () => {
    expect(() => prepareIndexDtfOpenAuctionArgs({ ...createInput(), supply: 0n })).toThrow(/Division by zero/);
  });

  it("builds exact openAuction calldata for a fixed rebalance snapshot", () => {
    const built = prepareIndexDtfOpenAuctionArgs(createInput());
    const call = prepareIndexDtfOpenAuction({ address: DTF, chainId: 1, args: built.args });

    expect(call.to).toBe(DTF);
    expect(call.data).toBe(
      "0x3c46570f000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000d2f13f7789f00000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000e92596fd62900000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000006b175474e89094c44da98b954eedeac495271d0f00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000001c6bf526340000000000000000000000000000000000000000000000000000001c6bf526340000000000000000000000000000000000000000000000000000001c6bf526340000000000000000000000000000000000000000000019d971e4fe8401e740000000000000000000000000000000000000000000000019d971e4fe8401e740000000000000000000000000000000000000000000000019d971e4fe8401e740000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000b5c0e8d21d902d61fa0000000000000000000000000000000000000000000000de24aac7eb3e705b4e00000000000000000000000000000000000000000000000000000000c7d713b49da00000000000000000000000000000000000000000000000000000f43fc2c04ee0000",
    );
  });
});

// 1000 whole shares fully in USDC at $1, rebalancing toward a 50/50 USDC/DAI
// basket — every value fixed so the built calldata is deterministic.
function createInput(): IndexDtfOpenAuctionInput {
  return {
    rebalance: {
      nonce: 3n,
      priceControl: PriceControl.NONE,
      tokens: [
        {
          token: USDC,
          weight: USDC_WEIGHT,
          price: { low: 9n * 10n ** 29n, high: 11n * 10n ** 29n },
          maxAuctionSize: 10n ** 12n,
          inRebalance: true,
        },
        {
          token: DAI,
          weight: DAI_WEIGHT,
          price: { low: 9n * 10n ** 17n, high: 11n * 10n ** 17n },
          maxAuctionSize: 10n ** 24n,
          inRebalance: true,
        },
      ],
      limits: { low: 9n * 10n ** 17n, spot: 10n ** 18n, high: 11n * 10n ** 17n },
      timestamps: {
        startedAt: 1_700_000_000n,
        restrictedUntil: 1_700_003_600n,
        availableUntil: 1_700_007_200n,
      },
      bidsEnabled: true,
    },
    tokens: [
      { address: USDC, name: "USD Coin", symbol: "USDC", decimals: 6 },
      { address: DAI, name: "Dai Stablecoin", symbol: "DAI", decimals: 18 },
    ],
    supply: 1_000n * 10n ** 18n,
    initialSupply: 1_000n * 10n ** 18n,
    currentAssets: { [USDC_KEY]: 1_000n * 10n ** 6n, [DAI_KEY]: 0n },
    initialAssets: { [USDC_KEY]: 1_000n * 10n ** 6n, [DAI_KEY]: 0n },
    initialPrices: { [USDC_KEY]: 1, [DAI_KEY]: 1 },
    initialWeights: { [USDC_KEY]: USDC_WEIGHT, [DAI_KEY]: DAI_WEIGHT },
    prices: {
      [USDC_KEY]: { currentPrice: 1, snapshotPrice: 1 },
      [DAI_KEY]: { currentPrice: 1, snapshotPrice: 1 },
    },
    tokenPriceVolatility: { [USDC_KEY]: 0.01, [DAI_KEY]: 0.01 },
    rebalancePercent: 90,
    isTrackingDtf: false,
  };
}
