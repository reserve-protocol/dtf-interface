import { describe, expect, it, vi } from "vitest";
import type { PublicClient } from "viem";
import { createDtfClient } from "../client.js";
import { createIndexDtfRef } from "./index.js";

describe("Index DTF namespace", () => {
  const account = "0x0000000000000000000000000000000000000009";

  it("passes blockNumber to ref basket shorthand", async () => {
    const readContract = vi.fn(async () => [
      ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
      [1_000_000n],
    ]);
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

    await dtf.basket(123n);

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
      .mockResolvedValueOnce([
        ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
        [1_000_000n],
      ]);
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

    await expect(dtf.version()).resolves.toBe("5.0.0");
    await expect(dtf.totalSupply()).resolves.toBe(10n ** 18n);
    await expect(dtf.totalAssets()).resolves.toMatchObject({
      tokens: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
      balances: [1_000_000n],
    });
    expect(readContract).toHaveBeenCalledTimes(3);
  });

  it("binds ref governance writes to the ref chain", async () => {
    const writeContract = vi.fn(async () => "0xabc");
    const dtf = createIndexDtfRef({} as never, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 8453,
    });

    await dtf.write({ writeContract } as never).vote({
      account,
      governance: "0x0000000000000000000000000000000000000002",
      proposalId: "1",
      support: 1,
    });

    expect(writeContract).toHaveBeenCalledWith({
      chain: expect.objectContaining({ id: 8453 }),
      account,
      address: "0x0000000000000000000000000000000000000002",
      abi: expect.anything(),
      functionName: "castVote",
      args: [1n, 1],
    });
  });

  it("accepts proposal payloads directly for ref queue writes", async () => {
    const writeContract = vi.fn(async () => "0xabc");
    const dtf = createIndexDtfRef({} as never, {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 8453,
    });

    await dtf.write({ writeContract } as never).queue(
      {
        governance: "0x0000000000000000000000000000000000000002",
        timelock: "0x0000000000000000000000000000000000000003",
        targets: ["0x0000000000000000000000000000000000000004"],
        calldatas: ["0x1234"],
        description: "Queue me",
      },
      { account },
    );

    expect(writeContract).toHaveBeenCalledWith(
      expect.objectContaining({
        chain: expect.objectContaining({ id: 8453 }),
        account,
        address: "0x0000000000000000000000000000000000000002",
        functionName: "queue",
      }),
    );
  });
});
