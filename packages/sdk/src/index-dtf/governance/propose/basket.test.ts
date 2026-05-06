import { describe, expect, it, vi } from "vitest";
import { decodeFunctionData, type PublicClient } from "viem";
import { createDtfClient } from "../../../client.js";
import { buildIndexDtfTargetBasket } from "../../dtf/basket/index.js";
import { dtfIndexAbi } from "../../abis/dtf-index-abi.js";
import { dtfIndexProposalAbiV4 } from "../../abis/dtf-index-proposal.js";
import { buildIndexDtfBasketProposal } from "./basket.js";

const DTF = "0x0000000000000000000000000000000000000001";
const GOVERNANCE = "0x0000000000000000000000000000000000000002";
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";

describe("buildIndexDtfBasketProposal", () => {
  it("builds a v5 startRebalance proposal from target shares", async () => {
    const client = createDtfClient({
      chains: {
        1: {
          publicClient: {
            multicall: vi.fn(async () => [
              "USD Coin",
              "USDC",
              6,
              "Dai Stablecoin",
              "DAI",
              18,
            ]),
          } as unknown as PublicClient,
        },
      },
    });

    const proposal = await buildIndexDtfBasketProposal(client, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      version: "6.0.0",
      supply: 10n ** 18n,
      currentBalances: {
        [USDC]: 1_000_000n,
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
    expect(
      proposal.context.assets.map((asset) => asset.targetBasketShare),
    ).toEqual([500000000000000000n, 500000000000000000n]);

    const decoded = decodeFunctionData({
      abi: dtfIndexAbi,
      data: proposal.calldatas[0]!,
    });

    expect(decoded.functionName).toBe("startRebalance");
    expect(decoded.args[2]).toBe(3600n);
    expect(decoded.args[3]).toBe(10_800n);
  });

  it("does not require timelock to build a basket proposal", async () => {
    const client = createDtfClient({
      chains: {
        1: {
          publicClient: {
            multicall: vi.fn(async () => [
              "USD Coin",
              "USDC",
              6,
              "Dai Stablecoin",
              "DAI",
              18,
            ]),
          } as unknown as PublicClient,
        },
      },
    });

    const proposal = await buildIndexDtfBasketProposal(client, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      version: "5.0.0",
      supply: 10n ** 18n,
      currentBalances: {
        [USDC]: 1_000_000n,
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
    });

    expect(proposal.governance).toBe(GOVERNANCE);
    expect("timelock" in proposal).toBe(false);
    expect(proposal.targets).toEqual([DTF]);
  });

  it("converts target units into basket shares", async () => {
    const client = createDtfClient({
      chains: {
        1: {
          publicClient: {
            multicall: vi.fn(async () => [
              "USD Coin",
              "USDC",
              6,
              "Dai Stablecoin",
              "DAI",
              18,
            ]),
          } as unknown as PublicClient,
        },
      },
    });

    const params = {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      version: "5.0.0",
      supply: 10n ** 18n,
      currentBalances: {
        [USDC]: 1_000_000n,
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
        type: "units",
        tokens: [
          { address: USDC, units: "1" },
          { address: DAI, units: "1" },
        ],
      },
    } as const;
    const proposal = await buildIndexDtfBasketProposal(client, params);
    const deferredProposal = await buildIndexDtfBasketProposal(client, {
      ...params,
      deferWeights: true,
    });

    expect(proposal.context.deferWeights).toBe(false);
    expect(deferredProposal.context.deferWeights).toBe(true);
    expect(
      proposal.context.assets.map((asset) => asset.targetBasketShare),
    ).toEqual([500000000000000000n, 500000000000000000n]);
  });

  it("builds a v4 startRebalance proposal", async () => {
    const client = createDtfClient({
      chains: {
        1: {
          publicClient: {
            multicall: vi.fn(async () => [
              "USD Coin",
              "USDC",
              6,
              "Dai Stablecoin",
              "DAI",
              18,
            ]),
          } as unknown as PublicClient,
        },
      },
    });

    const proposal = await buildIndexDtfBasketProposal(client, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      version: "4.0.0",
      supply: 10n ** 18n,
      currentBalances: {
        [USDC]: 1_000_000n,
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
    });

    const decoded = decodeFunctionData({
      abi: dtfIndexProposalAbiV4,
      data: proposal.calldatas[0]!,
    });

    expect(decoded.functionName).toBe("startRebalance");
    expect(
      (decoded.args[0] as readonly string[]).map((address) =>
        address.toLowerCase(),
      ),
    ).toEqual([USDC, DAI]);
    expect(decoded.args[4]).toBe(3600n);
    expect(decoded.args[5]).toBe(10_800n);
  });
});

describe("buildIndexDtfTargetBasket", () => {
  it("rejects basket tokens missing from token metadata", () => {
    expect(() =>
      buildIndexDtfTargetBasket({
        tokens: [createToken(USDC, 6)],
        prices: [1],
        basket: {
          type: "shares",
          tokens: [
            { address: USDC, share: 50 },
            { address: DAI, share: 50 },
          ],
        },
      }),
    ).toThrow("Missing token metadata");
  });

  it("rejects invalid direct prices", () => {
    expect(() =>
      buildIndexDtfTargetBasket({
        tokens: [createToken(USDC, 6)],
        prices: [0],
        basket: {
          type: "shares",
          tokens: [{ address: USDC, share: 100 }],
        },
      }),
    ).toThrow("Invalid price");

    expect(() =>
      buildIndexDtfTargetBasket({
        tokens: [createToken(USDC, 6)],
        prices: [Number.NaN],
        basket: {
          type: "shares",
          tokens: [{ address: USDC, share: 100 }],
        },
      }),
    ).toThrow("Invalid price");
  });

  it("rejects negative basket shares and units", () => {
    expect(() =>
      buildIndexDtfTargetBasket({
        tokens: [createToken(USDC, 6), createToken(DAI, 18)],
        prices: [1, 1],
        basket: {
          type: "shares",
          tokens: [
            { address: USDC, share: -1 },
            { address: DAI, share: 101 },
          ],
        },
      }),
    ).toThrow("Basket token shares");

    expect(() =>
      buildIndexDtfTargetBasket({
        tokens: [createToken(USDC, 6), createToken(DAI, 18)],
        prices: [1, 1],
        basket: {
          type: "units",
          tokens: [
            { address: USDC, units: "-1" },
            { address: DAI, units: "1" },
          ],
        },
      }),
    ).toThrow("Basket token units");
  });
});

function createToken(address: typeof USDC | typeof DAI, decimals: number) {
  return {
    address,
    decimals,
    name: address === USDC ? "USD Coin" : "Dai Stablecoin",
    symbol: address === USDC ? "USDC" : "DAI",
  };
}
