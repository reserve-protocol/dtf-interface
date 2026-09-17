import { PriceControl } from "@reserve-protocol/dtf-rebalance-lib";
import { decodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";

import type { IndexDtfOpenAuctionInput } from "@/index-dtf/rebalance/types";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { folioArtifactAbi } from "@/index-dtf/abis/folio-artifact";
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
    ).toThrow(/missing price for token/);
  });

  it("throws on zero supply instead of building skewed auction args", () => {
    expect(() => prepareIndexDtfOpenAuctionArgs({ ...createInput(), supply: 0n })).toThrow(/Division by zero/);
  });

  it.each([
    { version: "5.0.0", abi: dtfIndexAbi, selector: "0x3c46570f" },
    { version: "6.0.0", abi: folioArtifactAbi, selector: "0x9bd97b3e" },
  ] as const)("encodes the full auction payload for version $version", ({ version, abi, selector }) => {
    const built = prepareIndexDtfOpenAuctionArgs({
      ...createInput(),
      version,
      ...(version === "6.0.0" ? { auctionLength: 1800n } : {}),
    });
    const call = prepareIndexDtfOpenAuction({
      address: DTF,
      chainId: 1,
      version,
      args: built.args,
    });

    expect(call).toMatchObject({ to: DTF, chainId: 1, value: 0n });
    expect(call.data.slice(0, 10)).toBe(selector);
    expect(decodeFunctionData({ abi, data: call.data })).toEqual({
      functionName: "openAuction",
      args: version === "6.0.0" ? [...EXPECTED_AUCTION_ARGS, 1800n] : EXPECTED_AUCTION_ARGS,
    });
  });

  it.each([undefined, "4.0.0"])("rejects version %s at the calldata boundary", (version) => {
    const built = prepareIndexDtfOpenAuctionArgs(createInput());

    expect(() =>
      prepareIndexDtfOpenAuction({
        address: DTF,
        chainId: 1,
        version: version as unknown as "5.0.0",
        args: built.args,
      }),
    ).toThrow(/Unsupported Index DTF version/);
  });

  it("uses the auction length carried by v6 args when none is passed explicitly", () => {
    const built = prepareIndexDtfOpenAuctionArgs({ ...createInput(), version: "6.0.0", auctionLength: 1800n });
    const call = prepareIndexDtfOpenAuction({ address: DTF, chainId: 1, version: "6.0.0", args: built.args });

    expect(decodeFunctionData({ abi: folioArtifactAbi, data: call.data })).toEqual({
      functionName: "openAuction",
      args: [...EXPECTED_AUCTION_ARGS, 1800n],
    });
  });

  it.each([undefined, 0n, -1n])("rejects invalid v6 auctionLength %s", (auctionLength) => {
    const built = prepareIndexDtfOpenAuctionArgs(createInput());

    expect(() =>
      prepareIndexDtfOpenAuction({
        address: DTF,
        chainId: 1,
        version: "6.0.0",
        args: built.args,
        ...(auctionLength === undefined ? {} : { auctionLength }),
      }),
    ).toThrow("auctionLength must be positive");
  });
});

// Golden vector: 50/50 spot weights in D27 token units, initial price ranges,
// and a 5% target-limit range around one basket per share. Keep this independent
// of the builder output so changes to rebalance math or argument order fail.
const EXPECTED_AUCTION_ARGS = [
  3n,
  [USDC, DAI],
  [
    { low: 5n * 10n ** 14n, spot: 5n * 10n ** 14n, high: 5n * 10n ** 14n },
    { low: 5n * 10n ** 26n, spot: 5n * 10n ** 26n, high: 5n * 10n ** 26n },
  ],
  [
    { low: 9n * 10n ** 29n, high: 11n * 10n ** 29n },
    { low: 9n * 10n ** 17n, high: 11n * 10n ** 17n },
  ],
  { low: 95n * 10n ** 16n, spot: 10n ** 18n, high: 105n * 10n ** 16n },
] as const;

// 1000 whole shares fully in USDC at $1, rebalancing toward a 50/50 USDC/DAI
// basket — every value fixed so the built calldata is deterministic.
function createInput(): IndexDtfOpenAuctionInput {
  return {
    version: "5.0.0",
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
