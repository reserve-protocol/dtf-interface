import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { folioV6Abi } from "@/index-dtf/abis/folio-v6.generated";
import { getIndexDtfRebalanceNonce } from "@/index-dtf/rebalance/current";

const DTF = "0x0000000000000000000000000000000000000001";

describe("getIndexDtfRebalanceNonce", () => {
  it("reads getRebalanceNonce with the v6 ABI at the requested block", async () => {
    const readContract = vi.fn(async () => 12n);
    const client = { viem: { readContract } } as unknown as DtfClient;

    await expect(
      getIndexDtfRebalanceNonce(client, { address: DTF, chainId: 56, blockNumber: 119_967_348n }),
    ).resolves.toBe(12n);
    expect(readContract).toHaveBeenCalledWith({
      address: DTF,
      abi: folioV6Abi,
      functionName: "getRebalanceNonce",
      chainId: 56,
      blockNumber: 119_967_348n,
    });
  });
});
