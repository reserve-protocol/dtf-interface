import { getAddress, type PublicClient } from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createDtfClient, type DtfClient } from "@/client";
import { getDtf, getBasket, getBasketSnapshot, getBrand, getPrice, getPriceHistory } from "@/index-dtf/dtf/index";
import { mapIndexDtf } from "@/index-dtf/dtf/mappers";

describe("Index DTF getters", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("passes blockNumber to subgraph-backed Index DTF get", async () => {
    const queryIndex = vi.fn(async () => ({ dtf: null }));
    const subgraphClient = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    await expect(
      getDtf(subgraphClient, {
        address: "0x0000000000000000000000000000000000000001",
        chainId: 1,
        blockNumber: 123n,
      }),
    ).rejects.toMatchObject({ code: "RECORD_NOT_FOUND" });

    expect(queryIndex).toHaveBeenCalledWith(
      expect.objectContaining({
        chainId: 1,
        variables: {
          id: "0x0000000000000000000000000000000000000001",
          block: { number: 123 },
        },
      }),
    );
  });

  it("fetches and maps API-backed Index DTF price", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        price: 152.96,
        marketCap: 16101233.28,
        totalSupply: 105259.21,
        basket: [
          {
            address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
            amount: 0.001443507783055415,
            amountRaw: "1443507783055415",
            decimals: 18,
            price: 75816.19,
            weight: "71.53",
            priceSource: "cmc",
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetch);

    const apiClient = createDtfClient({
      apiBaseUrl: "https://api.example",
    });

    const price = await getPrice(apiClient, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 8453,
    });

    expect(price.address).toBe("0x0000000000000000000000000000000000000001");
    expect(price.chainId).toBe(8453);
    expect(price.price).toBe(152.96);
    expect(price.basket[0]?.token.address).toBe("0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c");
    expect(price.basket[0]?.amount.raw).toBe(1443507783055415n);
    expect(fetch).toHaveBeenCalledOnce();

    const [priceUrl] = fetch.mock.calls[0] as unknown as [URL];
    expect(String(priceUrl)).toBe(
      "https://api.example/current/dtf?address=0x0000000000000000000000000000000000000001&chainId=8453",
    );
  });

  it("fetches current API-backed Index DTF basket snapshots", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        price: 152.96,
        basket: [
          {
            address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
            symbol: "BTCB",
            decimals: 18,
            price: 75816.19,
            weight: "71.53",
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetch);

    const apiClient = createDtfClient({
      apiBaseUrl: "https://api.example",
    });

    const snapshot = await getBasketSnapshot(apiClient, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 8453,
    });

    expect(snapshot).toEqual({
      price: 152.96,
      basket: [
        {
          address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
          symbol: "BTCB",
          decimals: 18,
          price: 75816.19,
          weight: "71.53",
        },
      ],
    });
    expect(fetch).toHaveBeenCalledOnce();

    const [snapshotUrl] = fetch.mock.calls[0] as unknown as [URL];
    expect(String(snapshotUrl)).toBe(
      "https://api.example/current/dtf?address=0x0000000000000000000000000000000000000001&chainId=8453&cache=false",
    );
  });

  it("fetches block API-backed Index DTF basket snapshots", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        price: 149.5,
        basket: [
          {
            address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            symbol: "USDC",
            decimals: 6,
            price: 1,
            weight: "10.00",
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetch);

    const apiClient = createDtfClient({
      apiBaseUrl: "https://api.example",
    });

    const snapshot = await getBasketSnapshot(apiClient, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 8453,
      blockNumber: 123n,
    });

    expect(snapshot.basket[0]?.address).toBe("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
    expect(fetch).toHaveBeenCalledOnce();

    const [snapshotUrl] = fetch.mock.calls[0] as unknown as [URL];
    expect(String(snapshotUrl)).toBe(
      "https://api.example/snapshot/dtf?address=0x0000000000000000000000000000000000000001&chainId=8453&blockNumber=123&cache=false",
    );
  });

  it("fetches and maps API-backed Index DTF brand", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        status: "ok",
        parsedData: {
          hidden: false,
          dtf: {
            icon: "https://example.com/icon.png",
            cover: "",
            mobileCover: "",
            description: "CMC20 brand",
            notesFromCreator: "",
            prospectus: "",
            tags: ["Majors", "DeFi"],
            basketType: "percentage-based",
          },
          creator: {
            name: "ListaDAO",
            icon: "https://example.com/creator.png",
            link: "https://lista.org/",
          },
          curator: {
            name: "",
            icon: "",
            link: "",
          },
          socials: {
            twitter: "https://x.com/CoinMarketCap",
            telegram: "",
            discord: "",
            website: "https://coinmarketcap.com/charts/cmc20/",
          },
        },
      }),
    );
    vi.stubGlobal("fetch", fetch);

    const apiClient = createDtfClient({
      apiBaseUrl: "https://api.example",
    });

    const brand = await getBrand(apiClient, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 8453,
    });

    expect(brand).toMatchObject({
      hidden: false,
      icon: "https://example.com/icon.png",
      description: "CMC20 brand",
      tags: ["Majors", "DeFi"],
      basketType: "percentage-based",
      creator: {
        name: "ListaDAO",
        icon: "https://example.com/creator.png",
        link: "https://lista.org/",
      },
      socials: {
        twitter: "https://x.com/CoinMarketCap",
        website: "https://coinmarketcap.com/charts/cmc20/",
      },
    });
    expect(brand?.cover).toBeUndefined();
    expect(brand?.curator).toBeUndefined();
    expect(fetch).toHaveBeenCalledOnce();

    const [brandUrl] = fetch.mock.calls[0] as unknown as [URL];
    expect(String(brandUrl)).toBe(
      "https://api.example/folio-manager/read?folio=0x0000000000000000000000000000000000000001&chainId=8453",
    );
  });

  it("fetches and maps API-backed Index DTF price history", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        address: "0x0000000000000000000000000000000000000001",
        timeseries: [
          {
            timestamp: 1_715_000_000,
            price: 151.25,
            marketCap: 15_125_000,
            totalSupply: 100_000,
            basket: [
              {
                address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
                price: 75_000,
                amount: 0.001,
              },
            ],
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetch);

    const apiClient = createDtfClient({
      apiBaseUrl: "https://api.example",
    });

    const history = await getPriceHistory(apiClient, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 8453,
      from: 1_714_000_000,
      to: 1_715_000_000,
      interval: "1h",
    });

    expect(history).toEqual([
      {
        timestamp: 1_715_000_000,
        price: 151.25,
        marketCap: 15_125_000,
        totalSupply: 100_000,
        basket: [
          {
            address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
            price: 75_000,
            amount: 0.001,
          },
        ],
      },
    ]);
    expect(fetch).toHaveBeenCalledOnce();

    const [historyUrl] = fetch.mock.calls[0] as unknown as [URL];
    expect(String(historyUrl)).toBe(
      "https://api.example/historical/dtf?chainId=8453&address=0x0000000000000000000000000000000000000001&from=1714000000&to=1715000000&interval=1h",
    );
  });

  it("maps governance proposal thresholds from D18 fractions to percentages", () => {
    const dtf = mapIndexDtf(createSubgraphDtf(), 1);

    expect(dtf.governance.admin.primary).toMatchObject({
      type: "governance",
      governance: {
        proposalThreshold: 1,
      },
    });
  });

  it("fetches and maps onchain Index DTF basket holdings", async () => {
    const usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    const weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    const readContract = vi.fn(async () => [
      [usdc, weth],
      [1_000_000n, 2_000_000_000_000_000_000n],
    ]);
    const multicall = vi.fn(async () => ["USD Coin", "USDC", 6, "Wrapped Ether", "WETH", 18]);
    const client = createDtfClient({
      chains: {
        1: {
          publicClient: {
            readContract,
            multicall,
          } as unknown as PublicClient,
        },
      },
    });

    const basket = await getBasket(client, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 1,
    });

    const usdcAddress = getAddress(usdc);
    const wethAddress = getAddress(weth);

    expect(basket).toEqual({
      [usdcAddress]: {
        token: {
          address: usdcAddress,
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
        },
        balance: {
          raw: 1_000_000n,
          formatted: "1",
        },
      },
      [wethAddress]: {
        token: {
          address: wethAddress,
          name: "Wrapped Ether",
          symbol: "WETH",
          decimals: 18,
        },
        balance: {
          raw: 2_000_000_000_000_000_000n,
          formatted: "2",
        },
      },
    });
    expect(readContract).toHaveBeenCalledOnce();
    expect(multicall).toHaveBeenCalledOnce();
  });
});

function createSubgraphDtf() {
  return {
    id: "0x0000000000000000000000000000000000000001",
    proxyAdmin: "0x0000000000000000000000000000000000000002",
    timestamp: "1",
    deployer: "0x0000000000000000000000000000000000000003",
    ownerAddress: "0x0000000000000000000000000000000000000004",
    admins: ["0x0000000000000000000000000000000000000004"],
    mintingFee: "0",
    tvlFee: "0",
    annualizedTvlFee: "0",
    mandate: "Mandate",
    auctionDelay: "0",
    auctionLength: "3600",
    auctionApprovers: [],
    auctionLaunchers: [],
    brandManagers: [],
    totalRevenue: "0",
    protocolRevenue: "0",
    governanceRevenue: "0",
    externalRevenue: "0",
    feeRecipients: "",
    bidsEnabled: true,
    trustedFillerRegistry: null,
    trustedFillerEnabled: null,
    weightControl: true,
    priceControl: 0,
    legacyAdmins: [],
    legacyAuctionApprovers: [],
    ownerGovernance: {
      id: "0x0000000000000000000000000000000000000004",
      votingDelay: "1",
      votingPeriod: "2",
      proposalThreshold: "10000000000000000",
      quorumNumerator: "10000000000000000",
      quorumDenominator: "1000000000000000000",
      timelock: {
        id: "0x0000000000000000000000000000000000000005",
        guardians: [],
        executionDelay: "3",
      },
    },
    tradingGovernance: null,
    token: {
      id: "0x0000000000000000000000000000000000000001",
      address: "0x0000000000000000000000000000000000000001",
      name: "DTF",
      symbol: "DTF",
      decimals: 18,
      totalSupply: "0",
      currentHolderCount: "0",
      cumulativeHolderCount: "0",
      transferCount: "0",
      mintCount: "0",
      burnCount: "0",
      totalBurned: "0",
      totalMinted: "0",
    },
    stToken: null,
  } as never;
}
