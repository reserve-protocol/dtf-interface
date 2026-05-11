import {
  AuctionRound,
  FolioVersion,
  PriceControl,
  getOpenAuction,
  getTargetBasket,
  type WeightRange,
} from "@reserve-protocol/dtf-rebalance-lib";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { IndexDtfOpenAuctionInput } from "./types.js";

import { prepareIndexDtfOpenAuctionArgs } from "./open-auction.js";

vi.mock("@reserve-protocol/dtf-rebalance-lib", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@reserve-protocol/dtf-rebalance-lib")>();

  return {
    ...actual,
    getTargetBasket: vi.fn(() => [999n]),
    getOpenAuction: vi.fn(() => [
      {
        rebalanceNonce: 7n,
        tokens: [],
        newWeights: [],
        newPrices: [],
        newLimits: { low: 0n, spot: 0n, high: 0n },
      },
      {
        round: actual.AuctionRound.FINAL,
        initialProgression: 0,
        absoluteProgression: 0,
        relativeProgression: 0,
        target: 0,
        relativeTarget: 0,
        auctionSize: 0,
        surplusTokens: [],
        surplusTokenSizes: [],
        deficitTokens: [],
        deficitTokenSizes: [],
      },
    ]),
  };
});

const TOKEN = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const TOKEN_KEY = TOKEN.toLowerCase();
const WEIGHT: WeightRange = { low: 1n, spot: 2n, high: 3n };

describe("prepareIndexDtfOpenAuctionArgs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("defaults native DTF target basket calculation to initial snapshot prices", () => {
    prepareIndexDtfOpenAuctionArgs(createInput());

    expect(getTargetBasket).toHaveBeenCalledWith([WEIGHT], [1], [6n], false);
  });

  it("uses current prices when the target basket mode is explicit", () => {
    prepareIndexDtfOpenAuctionArgs(createInput({ targetBasketPriceMode: "current" }));

    expect(getTargetBasket).toHaveBeenCalledWith([WEIGHT], [3.5], [6n], false);
  });

  it("keeps the legacy tracking fallback on current prices", () => {
    prepareIndexDtfOpenAuctionArgs(createInput({ isTrackingDtf: true }));

    expect(getTargetBasket).toHaveBeenCalledWith([WEIGHT], [3.5], [6n], false);
  });

  it("lets explicit snapshot mode override the legacy tracking fallback", () => {
    prepareIndexDtfOpenAuctionArgs(
      createInput({
        isTrackingDtf: true,
        targetBasketPriceMode: "snapshot",
      }),
    );

    expect(getTargetBasket).toHaveBeenCalledWith([WEIGHT], [1], [6n], false);
  });

  it("passes rebalance context to the rebalance library without sending a transaction", () => {
    const input = createInput({ rebalancePercent: 80 });
    const built = prepareIndexDtfOpenAuctionArgs(input);

    expect(built.targetBasket).toEqual([999n]);
    expect(built.metrics.round).toBe(AuctionRound.FINAL);
    expect(getOpenAuction).toHaveBeenCalledWith(
      FolioVersion.V5,
      input.rebalance,
      1_000n,
      900n,
      [50n],
      [999n],
      [75n],
      [6n],
      [3.5],
      [0.02],
      0.8,
      false,
    );
  });

  it("rejects invalid rebalance percentages before calling the rebalance library", () => {
    expect(() => prepareIndexDtfOpenAuctionArgs(createInput({ rebalancePercent: 101 }))).toThrow(
      "rebalancePercent must be between 0 and 100",
    );

    expect(getTargetBasket).not.toHaveBeenCalled();
    expect(getOpenAuction).not.toHaveBeenCalled();
  });
});

function createInput(overrides: Partial<IndexDtfOpenAuctionInput> = {}): IndexDtfOpenAuctionInput {
  return {
    rebalance: {
      nonce: 7n,
      priceControl: PriceControl.NONE,
      tokens: [
        {
          token: TOKEN,
          weight: WEIGHT,
          price: { low: 1n, high: 2n },
          maxAuctionSize: 10n,
          inRebalance: true,
        },
      ],
      limits: { low: 1n, spot: 2n, high: 3n },
      timestamps: {
        startedAt: 1n,
        restrictedUntil: 2n,
        availableUntil: 3n,
      },
      bidsEnabled: true,
    },
    tokens: [
      {
        address: TOKEN,
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
      },
    ],
    supply: 1_000n,
    initialSupply: 900n,
    currentAssets: { [TOKEN_KEY]: 75n },
    initialAssets: { [TOKEN_KEY]: 50n },
    initialPrices: { [TOKEN_KEY]: 1 },
    initialWeights: { [TOKEN_KEY]: WEIGHT },
    prices: {
      [TOKEN_KEY]: {
        currentPrice: 3.5,
        snapshotPrice: 1.25,
      },
    },
    tokenPriceVolatility: { [TOKEN_KEY]: 0.02 },
    rebalancePercent: 90,
    isTrackingDtf: false,
    ...overrides,
  };
}
