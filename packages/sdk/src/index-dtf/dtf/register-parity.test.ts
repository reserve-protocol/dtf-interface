import { decodeFunctionData, erc20Abi, parseEther } from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createDtfClient, type DtfClient } from "@/client";
import { getAssetList } from "@/index-dtf/assets/index";
import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { dtfIndexStakingVaultOptimisticAbi } from "@/index-dtf/abis/dtf-index-staking-vault-optimistic";
import { unstakingManagerAbi } from "@/index-dtf/abis/unstaking-manager";
import { discoverIndexDtfs, discoverIndexDtfsByChain, getIndexDtfStatus } from "@/index-dtf/dtf/discovery";
import { getIndexDtfExposure } from "@/index-dtf/dtf/exposure";
import { getPrices } from "@/index-dtf/dtf/index";
import {
  getCompletedRebalance,
  getCompletedRebalances,
  getRebalance,
  getRebalances,
} from "@/index-dtf/rebalance/index";
import {
  prepareVoteLockClaimRewards,
  prepareVoteLockClaimWithdrawal,
  prepareVoteLockDelegateOptimistic,
  prepareVoteLockDeposit,
  prepareVoteLockDepositPlan,
} from "@/index-dtf/vote-lock/index";
import {
  getIndexDtfRedeemMinAmounts,
  prepareIndexDtfMint,
  prepareIndexDtfMintPlan,
  prepareIndexDtfRedeem,
} from "@/index-dtf/dtf/issuance";
import { getEffectiveRevenueDistribution, prepareIndexDtfDistributeFees } from "@/index-dtf/dtf/revenue";
import { getIndexDtfTransactions } from "@/index-dtf/dtf/transactions";

const DTF = "0x0000000000000000000000000000000000000001";
const TOKEN = "0x0000000000000000000000000000000000000002";
const ACCOUNT = "0x0000000000000000000000000000000000000003";

describe("Index DTF Register parity SDK surfaces", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("discovers Index DTFs and maps status", async () => {
    const fetch = vi.fn(async () =>
      Response.json([
        { type: "index", address: DTF, chainId: 8453, status: "deprecated", symbol: "DTF" },
        { type: "yield", address: TOKEN, chainId: 1, status: "active" },
      ]),
    );
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    const dtfs = await discoverIndexDtfs(client, { brand: true, performance: true });
    const status = await getIndexDtfStatus(client, { address: DTF, chainId: 8453 });

    expect(dtfs).toHaveLength(1);
    expect(dtfs[0]?.address).toBe(DTF);
    expect(status).toBe("deprecated");
  });

  it("supports chain-scoped Index DTF discovery", async () => {
    const fetch = vi.fn(async () =>
      Response.json([
        { address: DTF, chainId: 8453, status: "active", symbol: "DTF" },
      ]),
    );
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    const dtfs = await discoverIndexDtfsByChain(client, {
      chainId: 8453,
      limit: 10,
      sort: "marketCap",
    });

    expect(dtfs[0]?.address).toBe(DTF);
    expect(String((fetch.mock.calls[0] as unknown as [URL])[0])).toBe(
      "https://api.example/discover/dtf?chainId=8453&limit=10&sort=marketCap",
    );
  });

  it("exposes the zapper asset list used by deploy and basket flows", async () => {
    const fetch = vi.fn(async () =>
      Response.json([
        {
          address: TOKEN,
          chainId: 8453,
          decimals: 18,
          name: "Token",
          symbol: "TKN",
          volatility: "medium",
        },
      ]),
    );
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    const assets = await getAssetList(client, { chainId: 8453, unfiltered: true });

    expect(assets[0]?.address).toBe(TOKEN);
    expect(String((fetch.mock.calls[0] as unknown as [URL])[0])).toBe(
      "https://api.example/zapper/tokens?chainId=8453&unfiltered=true",
    );
  });

  it("fetches batch current Index DTF prices", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const fetch = vi.fn(async () =>
      Response.json([
        {
          address: DTF,
          price: 2,
          marketCap: 200,
          totalSupply: 100,
          basket: [
            {
              address: TOKEN,
              amount: 1,
              amountRaw: "1000000000000000000",
              decimals: 18,
              price: 1,
              weight: "50",
            },
          ],
        },
      ]),
    );
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    const prices = await getPrices(client, { chainId: 1, addresses: [DTF] });

    expect(prices[0]).toMatchObject({
      address: DTF,
      chainId: 1,
      price: 2,
      marketCap: 200,
      totalSupply: 100,
      timestamp: 1_000_000_000,
    });
    expect(prices[0]?.basket[0]?.amount.raw).toBe(1000000000000000000n);
    expect(String((fetch.mock.calls[0] as unknown as [URL])[0])).toBe(
      "https://api.example/current/dtfs?chainId=1&addresses=0x0000000000000000000000000000000000000001",
    );
  });

  it("treats missing API discovery status as unsupported", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json([])),
    );
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    await expect(getIndexDtfStatus(client, { address: DTF, chainId: 8453 })).resolves.toBe("unsupported");
  });

  it("reads exposure groups from Reserve API", async () => {
    const fetch = vi.fn(async () =>
      Response.json([
        {
          native: { symbol: "ETH" },
          totalWeight: 100,
          tokens: [{ address: TOKEN, symbol: "TOKEN", weight: 100 }],
        },
      ]),
    );
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    const exposure = await getIndexDtfExposure(client, { address: DTF, chainId: 1, period: "7d" });

    expect(exposure[0]?.tokens[0]?.address).toBe(TOKEN);
    expect(String((fetch.mock.calls[0] as unknown as [URL])[0])).toBe(
      "https://api.example/dtf/exposure?address=0x0000000000000000000000000000000000000001&chainId=1&period=7d",
    );
  });

  it("maps mint/redeem transactions from the subgraph", async () => {
    const queryIndex = vi.fn(async () => ({
      transferEvents: [
        {
          id: "1",
          hash: "0xabc",
          amount: parseEther("2").toString(),
          timestamp: "100",
          type: "MINT",
          to: { id: ACCOUNT },
          from: null,
        },
      ],
    }));
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const transactions = await getIndexDtfTransactions(client, {
      address: DTF,
      chainId: 1,
      dtfPriceUsd: 5,
    });

    expect(transactions[0]?.amount.raw).toBe(parseEther("2"));
    expect(transactions[0]?.amountUsd).toBe(10);
    expect(transactions[0]?.type).toBe("mint");
  });

  it("prepares v5 manual issuance calls", () => {
    const mint = prepareIndexDtfMint({
      address: DTF,
      chainId: 1,
      shares: parseEther("1"),
      receiver: ACCOUNT,
      minSharesOut: parseEther("0.99"),
    });
    const redeem = prepareIndexDtfRedeem({
      address: DTF,
      chainId: 1,
      shares: parseEther("1"),
      receiver: ACCOUNT,
      assets: [TOKEN],
      minAmountsOut: [10n],
    });
    const mintPlan = prepareIndexDtfMintPlan({
      address: DTF,
      chainId: 1,
      shares: parseEther("1"),
      receiver: ACCOUNT,
      minSharesOut: parseEther("0.99"),
      approvals: [{ token: TOKEN, amount: 10n }],
    });

    expect(decodeFunctionData({ abi: dtfIndexAbi, data: mint.data }).functionName).toBe("mint");
    expect(decodeFunctionData({ abi: dtfIndexAbi, data: redeem.data }).functionName).toBe("redeem");
    expect(mintPlan.type).toBe("approval-required");
    expect(getIndexDtfRedeemMinAmounts([100n], 500)).toEqual([95n]);
    expect(() => getIndexDtfRedeemMinAmounts([100n], 10_001)).toThrow("slippageBps");
  });

  it("prepares fee and vote-lock calls", () => {
    const distribute = prepareIndexDtfDistributeFees({ address: DTF, chainId: 1 });
    const deposit = prepareVoteLockDeposit({ stToken: DTF, chainId: 1, amount: parseEther("1"), delegateToSelf: true });
    const optimisticDelegate = prepareVoteLockDelegateOptimistic({ stToken: DTF, chainId: 1, delegatee: ACCOUNT });
    const rewards = prepareVoteLockClaimRewards({ stToken: DTF, chainId: 1, rewardTokens: [TOKEN] });
    const withdrawal = prepareVoteLockClaimWithdrawal({ unstakingManager: DTF, chainId: 1, lockId: 1n });

    expect(decodeFunctionData({ abi: dtfIndexAbi, data: distribute.data }).functionName).toBe("distributeFees");
    expect(decodeFunctionData({ abi: dtfIndexStakingVaultAbi, data: deposit.data }).functionName).toBe("depositAndDelegate");
    expect(decodeFunctionData({ abi: dtfIndexStakingVaultOptimisticAbi, data: optimisticDelegate.data }).functionName).toBe("delegateOptimistic");
    expect(decodeFunctionData({ abi: dtfIndexStakingVaultAbi, data: rewards.data }).functionName).toBe("claimRewards");
    expect(decodeFunctionData({ abi: unstakingManagerAbi, data: withdrawal.data }).functionName).toBe("claimLock");
    expect(() =>
      prepareVoteLockDeposit({
        stToken: DTF,
        chainId: 1,
        amount: 1n,
        delegateToSelf: true,
        receiver: ACCOUNT,
      } as never),
    ).toThrow("receiver");
  });

  it("computes effective revenue distribution after platform fee", () => {
    const distribution = getEffectiveRevenueDistribution(
      [
        { address: DTF, percentage: "60" },
        { address: ACCOUNT, percentage: "40" },
      ],
      {
        registry: DTF,
        recipient: TOKEN,
        numerator: 1n,
        denominator: 2n,
        floor: 0n,
        percent: 50,
      },
    );

    expect(distribution).toEqual({
      platform: { recipient: TOKEN, percentage: "50" },
      recipients: [
        {
          address: DTF,
          configuredPercentage: "60",
          effectivePercentage: "30",
        },
        {
          address: ACCOUNT,
          configuredPercentage: "40",
          effectivePercentage: "20",
        },
      ],
    });
  });

  it("prepares vote-lock deposit plans", () => {
    const depositPlan = prepareVoteLockDepositPlan({
      stToken: DTF,
      chainId: 1,
      amount: parseEther("1"),
      delegateToSelf: false,
      receiver: ACCOUNT,
    });
    const approvalPlan = prepareVoteLockDepositPlan({
      stToken: DTF,
      chainId: 1,
      amount: parseEther("1"),
      delegateToSelf: false,
      receiver: ACCOUNT,
      approval: { underlying: TOKEN, amount: parseEther("1") },
    });

    expect(depositPlan.type).toBe("call");
    if (depositPlan.type !== "call") throw new Error("expected call plan");
    expect(
      decodeFunctionData({
        abi: dtfIndexStakingVaultAbi,
        data: depositPlan.call.data,
      }).functionName,
    ).toBe("deposit");

    expect(approvalPlan.type).toBe("approval-required");
    if (approvalPlan.type !== "approval-required") {
      throw new Error("expected approval plan");
    }
    expect(approvalPlan.approvals).toHaveLength(1);
    expect(
      decodeFunctionData({
        abi: erc20Abi,
        data: approvalPlan.approvals[0]!.data,
      }).functionName,
    ).toBe("approve");
    expect(
      decodeFunctionData({
        abi: dtfIndexStakingVaultAbi,
        data: approvalPlan.call.data,
      }).functionName,
    ).toBe("deposit");
  });

  it("reads rebalances by list and id", async () => {
    const rebalance = {
      id: `${DTF}-1`,
      nonce: "1",
      tokens: [{ address: TOKEN, name: "Token", symbol: "TKN", decimals: 18 }],
      priceControl: "1",
      weightLowLimit: ["1"],
      weightSpotLimit: ["2"],
      weightHighLimit: ["3"],
      rebalanceLowLimit: "4",
      rebalanceSpotLimit: "5",
      rebalanceHighLimit: "6",
      priceLowLimit: ["7"],
      priceHighLimit: ["8"],
      restrictedUntil: "9",
      availableUntil: "10",
      transactionHash: "0xabc",
      blockNumber: "11",
      timestamp: "12",
    };
    const queryIndex = vi.fn(async (options: { readonly variables: Record<string, unknown> }) =>
      "id" in options.variables ? { rebalance } : { rebalances: [rebalance] },
    );
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const rebalances = await getRebalances(client, { address: DTF, chainId: 1 });
    const byId = await getRebalance(client, { id: `${DTF}-1`, chainId: 1 });

    expect(rebalances[0]?.rebalanceLimits.spot).toBe(5n);
    expect(byId.tokens[0]?.address).toBe(TOKEN);
  });

  it("reads rebalances by nonce with an exact subgraph query", async () => {
    const rebalance = {
      id: `${DTF}-1`,
      nonce: "1",
      tokens: [{ address: TOKEN, name: "Token", symbol: "TKN", decimals: 18 }],
      priceControl: "1",
      weightLowLimit: ["1"],
      weightSpotLimit: ["2"],
      weightHighLimit: ["3"],
      rebalanceLowLimit: "4",
      rebalanceSpotLimit: "5",
      rebalanceHighLimit: "6",
      priceLowLimit: ["7"],
      priceHighLimit: ["8"],
      restrictedUntil: "9",
      availableUntil: "10",
      transactionHash: "0xabc",
      blockNumber: "11",
      timestamp: "12",
    };
    const queryIndex = vi.fn(async () => ({ rebalances: [rebalance] }));
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const byNonce = await getRebalance(client, { address: DTF, chainId: 1, nonce: 1n });

    expect(byNonce.nonce).toBe("1");
    expect(queryIndex).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { dtf: DTF.toLowerCase(), nonce: "1" },
      }),
    );
  });

  it("reads completed rebalance metrics from Reserve API", async () => {
    const getIndexDtfRebalanceHistory = vi.fn(async () => [
      {
        nonce: 4,
        timestamp: 100,
        availableUntil: 200,
        totalRebalancedUsd: 50,
      },
    ]);
    const getIndexDtfRebalanceDetail = vi.fn(async () => ({
      nonce: 4,
      timestamp: 100,
      rebalanceGainLossUsd: null,
      auctions: [
        {
          startTime: 101,
          endTime: 120,
          bids: [
            {
              bidder: ACCOUNT,
              sellToken: { address: TOKEN, symbol: "TKN", decimals: 18 },
              buyToken: { address: DTF, symbol: "DTF", decimals: 18 },
              sellAmount: "1000000000000000000",
              buyAmount: "2000000000000000000",
              sellAmountUsd: null,
              buyAmountUsd: 2,
            },
          ],
        },
      ],
      totalRebalancedUsd: 50,
    }));
    const client = {
      api: { getIndexDtfRebalanceHistory, getIndexDtfRebalanceDetail },
    } as unknown as DtfClient;

    const history = await getCompletedRebalances(client, {
      address: DTF,
      chainId: 1,
      skip: 10,
      limit: 5,
    });
    const detail = await getCompletedRebalance(client, {
      address: DTF,
      chainId: 1,
      nonce: 4n,
    });

    expect(history[0]).toMatchObject({
      nonce: 4,
      totalRebalancedUsd: 50,
    });
    expect(detail.auctions[0]?.bids[0]).toMatchObject({
      bidder: ACCOUNT,
      sellToken: { address: TOKEN, name: "TKN" },
      sellAmount: 1000000000000000000n,
    });
    expect(detail).not.toHaveProperty("rebalanceGainLossUsd");
    expect(detail.auctions[0]?.bids[0]).not.toHaveProperty("sellAmountUsd");
    expect(getIndexDtfRebalanceHistory).toHaveBeenCalledWith({
      address: DTF,
      chainId: 1,
      skip: 10,
      limit: 5,
    });
    expect(getIndexDtfRebalanceDetail).toHaveBeenCalledWith({
      address: DTF,
      chainId: 1,
      nonce: 4n,
    });
  });

  it("rejects completed rebalance detail responses without auctions", async () => {
    const client = {
      api: {
        getIndexDtfRebalanceDetail: vi.fn(async () => ({
          nonce: 4,
          timestamp: 100,
        })),
      },
    } as unknown as DtfClient;

    await expect(
      getCompletedRebalance(client, { address: DTF, chainId: 1, nonce: 4n }),
    ).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
  });
});
