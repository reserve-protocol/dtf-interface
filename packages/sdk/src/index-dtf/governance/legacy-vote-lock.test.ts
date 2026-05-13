import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getLegacyVoteLocks } from "@/index-dtf/governance/legacy-vote-lock";

describe("Index DTF legacy vote locks", () => {
  it("returns legacy governor vote tokens that differ from the current vote lock", async () => {
    const currentVoteLock = "0x0000000000000000000000000000000000000001";
    const legacyVoteLock = "0x0000000000000000000000000000000000000002";
    const readContract = vi
      .fn()
      .mockResolvedValueOnce(currentVoteLock)
      .mockResolvedValueOnce(legacyVoteLock)
      .mockResolvedValueOnce(legacyVoteLock.toLowerCase());
    const client = { viem: { readContract } } as unknown as DtfClient;

    const voteLocks = await getLegacyVoteLocks(client, {
      chainId: 1,
      currentVoteLock,
      legacyGovernance: [
        "0x0000000000000000000000000000000000000011",
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000013",
      ],
    });

    expect(voteLocks).toEqual([legacyVoteLock]);
    expect(readContract).toHaveBeenCalledTimes(3);
    expect(readContract).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        functionName: "token",
        address: "0x0000000000000000000000000000000000000011",
      }),
    );
  });
});
