import { describe, expect, it, vi } from "vitest";
import type { PublicClient } from "viem";
import { createDtfClient } from "../client.js";
import { createIndexDtfRef } from "./index.js";

describe("Index DTF namespace", () => {
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
});
