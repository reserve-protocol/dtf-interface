import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getYieldDtf } from "@/yield-dtf/dtf/index";

const DTF = "0x0000000000000000000000000000000000000001";

describe("getYieldDtf", () => {
  it("does not make RPC reads when the subgraph has no rToken", async () => {
    const multicall = vi.fn();
    const client = {
      subgraph: {
        queryYield: vi.fn(async () => ({ rtoken: null })),
      },
      viem: {
        getPublicClient: vi.fn(() => ({ multicall })),
      },
    } as unknown as DtfClient;

    await expect(getYieldDtf(client, { address: DTF, chainId: 1 })).rejects.toThrow("Yield DTF not found");
    expect(multicall).not.toHaveBeenCalled();
  });
});
