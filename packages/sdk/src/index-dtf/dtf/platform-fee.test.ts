import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getIndexDtfPlatformFee } from "@/index-dtf/dtf/platform-fee";
import { isSdkError } from "@/lib/errors";

const DTF = "0x0000000000000000000000000000000000000001";
const REGISTRY = "0x0000000000000000000000000000000000000002";
const RECIPIENT = "0x0000000000000000000000000000000000000003";

function createClient(feeDetails: readonly [string, bigint, bigint, bigint]): DtfClient {
  const readContract = vi.fn().mockResolvedValueOnce(REGISTRY).mockResolvedValueOnce(feeDetails);
  return { viem: { readContract } } as unknown as DtfClient;
}

describe("getIndexDtfPlatformFee", () => {
  it("computes the percentage from a valid fee tuple", async () => {
    const client = createClient([RECIPIENT, 50n, 100n, 0n]);
    const fee = await getIndexDtfPlatformFee(client, { address: DTF, chainId: 1 });
    expect(fee.percent).toBe(50);
  });

  it("keeps a real 0% fee (zero numerator over a positive denominator)", async () => {
    const client = createClient([RECIPIENT, 0n, 100n, 0n]);
    const fee = await getIndexDtfPlatformFee(client, { address: DTF, chainId: 1 });
    expect(fee.percent).toBe(0);
  });

  it("fails loud on a zero denominator instead of fabricating 0%", async () => {
    const client = createClient([RECIPIENT, 1n, 0n, 0n]);
    const error = await getIndexDtfPlatformFee(client, { address: DTF, chainId: 1 }).catch((e) => e);
    expect(isSdkError(error)).toBe(true);
    expect(error.code).toBe("INVALID_RESPONSE");
  });
});
