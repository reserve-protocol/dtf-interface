import { afterEach, describe, expect, it, vi } from "vitest";
import { decodeFunctionData, erc20Abi, parseEther } from "viem";
import { createDtfClient, type DtfClient } from "../../client.js";
import { dtfIndexAbi } from "../abis/dtf-index-abi.js";
import { dtfIndexStakingVaultAbi } from "../abis/dtf-index-staking-vault.js";
import { unstakingManagerAbi } from "../abis/unstaking-manager.js";
import { getRebalance, getRebalances } from "../rebalance/index.js";
import {
  prepareVoteLockClaimRewards,
  prepareVoteLockClaimWithdrawal,
  prepareVoteLockDeposit,
  prepareVoteLockDepositPlan,
} from "../vote-lock/index.js";
import { discoverIndexDtfs, getIndexDtfStatus } from "./discovery.js";
import { getIndexDtfExposure } from "./exposure.js";
import {
  getIndexDtfRedeemMinAmounts,
  prepareIndexDtfMint,
  prepareIndexDtfMintPlan,
  prepareIndexDtfRedeem,
} from "./issuance.js";
import { prepareIndexDtfDistributeFees } from "./revenue.js";
import { getIndexDtfTransactions } from "./transactions.js";

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

  it("treats missing API discovery status as unsupported", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json([])));
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
        { id: "1", hash: "0xabc", amount: parseEther("2").toString(), timestamp: "100", type: "MINT", to: { id: ACCOUNT }, from: null },
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
    const rewards = prepareVoteLockClaimRewards({ stToken: DTF, chainId: 1, rewardTokens: [TOKEN] });
    const withdrawal = prepareVoteLockClaimWithdrawal({ unstakingManager: DTF, chainId: 1, lockId: 1n });

    expect(decodeFunctionData({ abi: dtfIndexAbi, data: distribute.data }).functionName).toBe("distributeFees");
    expect(decodeFunctionData({ abi: dtfIndexStakingVaultAbi, data: deposit.data }).functionName).toBe("depositAndDelegate");
    expect(decodeFunctionData({ abi: dtfIndexStakingVaultAbi, data: rewards.data }).functionName).toBe("claimRewards");
    expect(decodeFunctionData({ abi: unstakingManagerAbi, data: withdrawal.data }).functionName).toBe("claimLock");
    expect(() => prepareVoteLockDeposit({ stToken: DTF, chainId: 1, amount: 1n, delegateToSelf: true, receiver: ACCOUNT } as never)).toThrow("receiver");
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
    expect(queryIndex).toHaveBeenCalledWith(expect.objectContaining({
      variables: { dtf: DTF.toLowerCase(), nonce: "1" },
    }));
  });
});
