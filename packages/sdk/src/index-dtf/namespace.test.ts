import type { PublicClient } from "viem";

import { describe, expect, it, vi } from "vitest";

import { createDtfClient } from "@/client";
import { createIndexDtfNamespace, createIndexDtfRef } from "@/index-dtf/index";

describe("Index DTF namespace", () => {
  it("passes blockNumber to ref basket shorthand", async () => {
    const readContract = vi.fn(async () => [["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"], [1_000_000n]]);
    const multicall = vi.fn(async () => ["USD Coin", "USDC", 6]);
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
    const dtf = createIndexDtfRef(client, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 1,
    });

    await dtf.getBasket(123n);

    expect(readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        blockNumber: 123n,
      }),
    );
    expect(multicall).toHaveBeenCalledOnce();
  });

  it("exposes live Folio reads on refs", async () => {
    const readContract = vi
      .fn()
      .mockResolvedValueOnce("5.0.0")
      .mockResolvedValueOnce(10n ** 18n)
      .mockResolvedValueOnce([["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"], [1_000_000n]]);
    const client = createDtfClient({
      chains: {
        1: {
          publicClient: {
            readContract,
          } as unknown as PublicClient,
        },
      },
    });
    const dtf = createIndexDtfRef(client, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 1,
    });

    await expect(dtf.getVersion()).resolves.toBe("5.0.0");
    await expect(dtf.getTotalSupply()).resolves.toBe(10n ** 18n);
    await expect(dtf.getTotalAssets()).resolves.toMatchObject({
      tokens: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
      balances: [1_000_000n],
    });
    expect(readContract).toHaveBeenCalledTimes(3);
  });

  it("binds ref proposal vote calls to the ref chain", () => {
    const dtf = createIndexDtfRef({} as never, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 8453,
    });

    const call = dtf.prepareVote({
      governance: "0x0000000000000000000000000000000000000002",
      proposalId: "1",
      support: 1,
    });

    expect(call.chainId).toBe(8453);
    expect(call.contract.address).toBe("0x0000000000000000000000000000000000000002");
    expect(call.contract.functionName).toBe("castVote");
    expect(call.contract.args).toEqual([1n, 1]);
  });

  it("accepts proposal payloads directly for ref queue calls", () => {
    const dtf = createIndexDtfRef({} as never, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 8453,
    });

    const call = dtf.prepareQueueProposal({
      proposal: {
        governance: "0x0000000000000000000000000000000000000002",
        timelock: "0x0000000000000000000000000000000000000003",
        targets: ["0x0000000000000000000000000000000000000004"],
        calldatas: ["0x1234"],
        description: "Queue me",
      },
    });

    expect(call.chainId).toBe(8453);
    expect(call.contract.address).toBe("0x0000000000000000000000000000000000000002");
    expect(call.contract.functionName).toBe("queue");
  });

  it("prepares write calls through namespace and ref wrappers", () => {
    const address = "0x0000000000000000000000000000000000000001";
    const token = "0x0000000000000000000000000000000000000002";
    const account = "0x0000000000000000000000000000000000000003";
    const namespace = createIndexDtfNamespace({} as never);
    const dtf = createIndexDtfRef({} as never, { address, chainId: 8453 });

    const directMint = namespace.prepareMint({
      address,
      chainId: 1,
      shares: 1n,
      receiver: account,
      minSharesOut: 1n,
    });
    const refMint = dtf.prepareMint({
      shares: 1n,
      receiver: account,
      minSharesOut: 1n,
    });
    const auction = dtf.prepareOpenAuctionUnrestricted({ rebalanceNonce: 4n });
    const plan = dtf.prepareVoteLockDepositPlan({
      stToken: token,
      amount: 1n,
      delegateToSelf: true,
      approval: { underlying: account, amount: 1n },
    });

    expect(directMint.chainId).toBe(1);
    expect(directMint.contract.functionName).toBe("mint");
    expect(refMint.chainId).toBe(8453);
    expect(refMint.contract.address).toBe(address);
    expect(auction.chainId).toBe(8453);
    expect(auction.contract.functionName).toBe("openAuctionUnrestricted");
    expect(plan.type).toBe("approval-required");
    if (plan.type !== "approval-required") {
      throw new Error("expected approval plan");
    }
    expect(plan.approvals[0]?.chainId).toBe(8453);
    expect(plan.call.contract.functionName).toBe("depositAndDelegate");
  });
});
