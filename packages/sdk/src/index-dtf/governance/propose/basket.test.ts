import { decodeFunctionData, parseEther, parseUnits, type Address, type PublicClient } from "viem";
import { describe, expect, it, vi } from "vitest";

import { createDtfClient } from "@/client";
import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import {
  buildInitialBasket,
  getBasketSharesFromUnits,
  getBasketUnitsFromShares,
  getDtfPriceFromBalances,
  type IndexDtfBasketToken,
} from "@/index-dtf/dtf/basket/index";
import { buildIndexDtfBasketProposal } from "@/index-dtf/governance/propose/basket";

const DTF = "0x0000000000000000000000000000000000000001";
const GOVERNANCE = "0x0000000000000000000000000000000000000002";
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
const WBTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";

describe("basket conversion helpers", () => {
  it("converts raw units to D18 basket shares", () => {
    const shares = getBasketSharesFromUnits({
      tokens: [token(USDC, 6, 1), token(DAI, 18, 1)],
      units: [parseUnits("1", 6), parseUnits("1", 18)],
    });

    expect(shares).toEqual([500000000000000000n, 500000000000000000n]);
  });

  it("converts D18 basket shares to raw units for a target value", () => {
    const units = getBasketUnitsFromShares({
      tokens: [token(USDC, 6, 1), token(WBTC, 8, 50_000)],
      shares: [500000000000000000n, 500000000000000000n],
      targetValueUsd: 100,
    });

    expect(units).toEqual([parseUnits("50", 6), parseUnits("0.001", 8)]);
  });

  it("calculates DTF price from balances and supply", () => {
    const price = getDtfPriceFromBalances({
      supply: parseEther("10"),
      tokens: [token(USDC, 6, 1), token(DAI, 18, 1)],
      balances: [parseUnits("25", 6), parseUnits("25", 18)],
    });

    expect(price).toBe(5);
  });

  it("rejects duplicate tokens and missing prices", () => {
    expect(() =>
      getBasketSharesFromUnits({
        tokens: [token(USDC, 6, 1), token(USDC, 6, 1)],
        units: [1n, 1n],
      }),
    ).toThrow("Duplicate basket token");

    expect(() =>
      getBasketSharesFromUnits({
        tokens: [token(USDC, 6, 0)],
        units: [1n],
      }),
    ).toThrow("positive number");
  });

  it("rejects zero address basket tokens", () => {
    expect(() =>
      getBasketSharesFromUnits({
        tokens: [token("0x0000000000000000000000000000000000000000", 18, 1)],
        units: [1n],
      }),
    ).toThrow("Basket token address cannot be the zero address");
  });
});

describe("buildInitialBasket", () => {
  it("builds deploy amounts from target shares", () => {
    const basket = buildInitialBasket({
      tokens: [token(USDC, 6, 1), token(DAI, 18, 1)],
      basket: {
        type: "shares",
        shares: [500000000000000000n, 500000000000000000n],
      },
      initialSharePriceUsd: 1,
      initialShares: parseEther("100"),
    });

    expect(basket.assets).toEqual([USDC, DAI]);
    expect(basket.amounts).toEqual([parseUnits("50", 6), parseUnits("50", 18)]);
    expect(basket.initialShares).toBe(parseEther("100"));
  });

  it("uses unit input as ratios, then scales to the initial share price", () => {
    const basket = buildInitialBasket({
      tokens: [token(USDC, 6, 1), token(DAI, 18, 1)],
      basket: {
        type: "units",
        units: [parseUnits("1", 6), parseUnits("2", 18)],
      },
      initialSharePriceUsd: 6,
      initialShares: parseEther("1"),
    });

    expect(basket.amounts).toEqual([parseUnits("2", 6), parseUnits("4", 18)]);
  });

  it("scales fractional initial shares without bigint truncation", () => {
    const basket = buildInitialBasket({
      tokens: [token(DAI, 18, 2)],
      basket: { type: "shares", shares: [1000000000000000000n] },
      initialSharePriceUsd: 100,
      initialShares: parseEther("0.5"),
    });

    expect(basket.amounts).toEqual([parseUnits("25", 18)]);
  });

  it("handles mixed decimals with non-1 prices", () => {
    const basket = buildInitialBasket({
      tokens: [token(USDC, 6, 1), token(WBTC, 8, 50_000)],
      basket: {
        type: "shares",
        shares: [500000000000000000n, 500000000000000000n],
      },
      initialSharePriceUsd: 100,
      initialShares: parseEther("1"),
    });

    expect(basket.amounts).toEqual([parseUnits("50", 6), parseUnits("0.001", 8)]);
  });
});

describe("buildIndexDtfBasketProposal", () => {
  it("builds a v5 startRebalance proposal from target shares", async () => {
    const proposal = await buildIndexDtfBasketProposal(testClient(), {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      supply: parseEther("1"),
      currentBalances: {
        [USDC]: parseUnits("1", 6),
        [DAI]: 0n,
      },
      prices: {
        [USDC]: 1,
        [DAI]: 1,
      },
      priceErrors: {
        [USDC]: 0.5,
        [DAI]: 0.5,
      },
      weightControl: true,
      basket: {
        type: "shares",
        tokens: [
          { address: USDC, share: "50" },
          { address: DAI, share: "50" },
        ],
      },
      auctionLauncherWindow: 3600,
      permissionlessWindow: 7200,
      description: "Rebalance basket",
    });

    expect(proposal).toMatchObject({
      governance: GOVERNANCE,
      targets: [DTF],
      description: "Rebalance basket",
    });
    expect(proposal.context.ttl).toBe(10_800n);
    expect(proposal.context.assets.map((asset) => asset.targetShare)).toEqual([
      500000000000000000n,
      500000000000000000n,
    ]);

    const decoded = decodeFunctionData({
      abi: dtfIndexAbi,
      data: proposal.calldatas[0]!,
    });

    expect(decoded.functionName).toBe("startRebalance");
    expect(decoded.args[2]).toBe(3600n);
    expect(decoded.args[3]).toBe(10_800n);

    const decodedTokens = decoded.args[0] as readonly {
      readonly token: Address;
      readonly inRebalance: boolean;
      readonly maxAuctionSize: bigint;
      readonly weight: { readonly low: bigint; readonly spot: bigint; readonly high: bigint };
      readonly price: { readonly low: bigint; readonly high: bigint };
    }[];

    expect(decodedTokens.map((tokenParams) => tokenParams.token.toLowerCase())).toEqual([USDC, DAI]);
    expect(decodedTokens.every((tokenParams) => tokenParams.inRebalance)).toBe(true);
    expect(decodedTokens.every((tokenParams) => tokenParams.maxAuctionSize > 0n)).toBe(true);
    expect(
      decodedTokens.every(
        (tokenParams) =>
          tokenParams.weight.low <= tokenParams.weight.spot &&
          tokenParams.weight.spot <= tokenParams.weight.high &&
          tokenParams.price.low < tokenParams.price.high,
      ),
    ).toBe(true);
  });

  it("builds tracking rebalance args from unit input", async () => {
    const proposal = await buildIndexDtfBasketProposal(testClient(), {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      supply: parseEther("1"),
      currentBalances: {
        [USDC]: parseUnits("1", 6),
        [DAI]: parseUnits("1", 18),
      },
      prices: {
        [USDC]: 1,
        [DAI]: 1,
      },
      priceErrors: {
        [USDC]: 0.5,
        [DAI]: 0.5,
      },
      weightControl: false,
      basket: {
        type: "units",
        tokens: [
          { address: USDC, units: "1" },
          { address: DAI, units: "1" },
        ],
      },
    });

    const weights = proposal.context.startRebalanceArgs.tokens.map((tokenParams) => tokenParams.weight);

    expect(proposal.context.weightControl).toBe(false);
    expect(proposal.context.assets.map((asset) => asset.targetShare)).toEqual([
      500000000000000000n,
      500000000000000000n,
    ]);
    expect(weights.every((weight) => weight.low === weight.spot)).toBe(true);
    expect(weights.every((weight) => weight.spot === weight.high)).toBe(true);
  });

  it("builds hybrid rebalance args from unit input with deferred weights", async () => {
    const proposal = await buildIndexDtfBasketProposal(testClient(), {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      supply: parseEther("1"),
      currentBalances: {
        [USDC]: parseUnits("1", 6),
        [DAI]: parseUnits("1", 18),
      },
      prices: {
        [USDC]: 1,
        [DAI]: 1,
      },
      priceErrors: {
        [USDC]: 0.5,
        [DAI]: 0.5,
      },
      weightControl: true,
      deferWeights: true,
      basket: {
        type: "units",
        tokens: [
          { address: USDC, units: "1" },
          { address: DAI, units: "1" },
        ],
      },
    });

    expect(proposal.context.weightControl).toBe(true);
    expect(proposal.context.deferWeights).toBe(true);
    expect(proposal.context.startRebalanceArgs.tokens.every((tokenParams) => tokenParams.weight.low === 0n)).toBe(true);
  });

  it("keeps current token order before new basket additions", async () => {
    const proposal = await buildIndexDtfBasketProposal(testClient(), {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      supply: parseEther("1"),
      currentBalances: {
        [USDC]: parseUnits("1", 6),
      },
      prices: {
        [USDC]: 1,
        [DAI]: 1,
      },
      priceErrors: {
        [USDC]: 0.5,
        [DAI]: 0.5,
      },
      weightControl: true,
      basket: {
        type: "shares",
        tokens: [
          { address: DAI, share: "50" },
          { address: USDC, share: "50" },
        ],
      },
    });

    expect(proposal.context.assets.map((asset) => asset.token.address.toLowerCase())).toEqual([USDC, DAI]);
    expect(proposal.context.assets.map((asset) => asset.targetShare)).toEqual([
      500000000000000000n,
      500000000000000000n,
    ]);
  });

  it("rejects negative bigint proposal windows", async () => {
    await expect(
      buildIndexDtfBasketProposal(testClient(), {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        supply: parseEther("1"),
        currentBalances: {
          [USDC]: parseUnits("1", 6),
        },
        prices: {
          [USDC]: 1,
        },
        priceErrors: {
          [USDC]: 0.5,
        },
        weightControl: true,
        ttl: -1n,
        basket: {
          type: "shares",
          tokens: [{ address: USDC, share: "100" }],
        },
      }),
    ).rejects.toThrow("ttl must be a positive number of seconds");
  });

  it("rejects ttl shorter than the auction launcher window", async () => {
    await expect(
      buildIndexDtfBasketProposal(testClient(), {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        supply: parseEther("1"),
        currentBalances: {
          [USDC]: parseUnits("1", 6),
          [DAI]: parseUnits("1", 18),
        },
        prices: {
          [USDC]: 1,
          [DAI]: 1,
        },
        priceErrors: {
          [USDC]: 0.5,
          [DAI]: 0.5,
        },
        weightControl: true,
        auctionLauncherWindow: 3600,
        ttl: 3599,
        basket: {
          type: "shares",
          tokens: [
            { address: USDC, share: "50" },
            { address: DAI, share: "50" },
          ],
        },
      }),
    ).rejects.toThrow("ttl must be greater than or equal to auctionLauncherWindow");
  });

  it("rejects ttl longer than the protocol max", async () => {
    await expect(
      buildIndexDtfBasketProposal(testClient(), {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        supply: parseEther("1"),
        currentBalances: {
          [USDC]: parseUnits("1", 6),
          [DAI]: parseUnits("1", 18),
        },
        prices: {
          [USDC]: 1,
          [DAI]: 1,
        },
        priceErrors: {
          [USDC]: 0.5,
          [DAI]: 0.5,
        },
        weightControl: true,
        ttl: 604_800 * 4 + 1,
        basket: {
          type: "shares",
          tokens: [
            { address: USDC, share: "50" },
            { address: DAI, share: "50" },
          ],
        },
      }),
    ).rejects.toThrow("ttl must be less than or equal to 4 weeks");
  });

  it("rejects DTF address as a basket token", async () => {
    await expect(
      buildIndexDtfBasketProposal(testClient(), {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        supply: parseEther("1"),
        currentBalances: {
          [USDC]: parseUnits("1", 6),
        },
        prices: {
          [USDC]: 1,
          [DTF]: 1,
        },
        priceErrors: {
          [USDC]: 0.5,
          [DTF]: 0.5,
        },
        weightControl: true,
        basket: {
          type: "shares",
          tokens: [
            { address: USDC, share: "50" },
            { address: DTF, share: "50" },
          ],
        },
      }),
    ).rejects.toThrow("Basket token cannot be the DTF address");
  });
});

function testClient() {
  return createDtfClient({
    chains: {
      1: {
        publicClient: {
          multicall: vi.fn(async ({ contracts }: { contracts: unknown[] }) => {
            const tokens = [USDC, DAI, WBTC];
            const metadata: Record<string, readonly [string, string, number]> = {
              [USDC]: ["USD Coin", "USDC", 6],
              [DAI]: ["Dai Stablecoin", "DAI", 18],
              [WBTC]: ["Wrapped Bitcoin", "WBTC", 8],
            };

            return contracts.map((_, index) => {
              const tokenAddress = tokens[Math.floor(index / 3)]!;
              const field = (index % 3) as 0 | 1 | 2;

              return metadata[tokenAddress]![field];
            });
          }),
        } as unknown as PublicClient,
      },
    },
  });
}

function token(
  address: typeof USDC | typeof DAI | typeof WBTC | Address,
  decimals: number,
  price: number,
): IndexDtfBasketToken {
  return {
    address: address as Address,
    decimals,
    price,
    name: address === USDC ? "USD Coin" : address === DAI ? "Dai Stablecoin" : "Wrapped Bitcoin",
    symbol: address === USDC ? "USDC" : address === DAI ? "DAI" : "WBTC",
  };
}
