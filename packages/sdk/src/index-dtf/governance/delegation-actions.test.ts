import { describe, expect, it, vi } from "vitest";
import { delegate } from "./delegation-actions.js";

describe("Index DTF delegation actions", () => {
  it("writes account delegation through the staking vault", async () => {
    const writeContract = vi.fn(async () => "0xabc");

    await delegate({ writeContract } as never, {
      account: "0x0000000000000000000000000000000000000009",
      chainId: 1,
      stToken: "0x0000000000000000000000000000000000000001",
      delegatee: "0x0000000000000000000000000000000000000002",
    });

    expect(writeContract).toHaveBeenCalledWith({
      chain: expect.objectContaining({ id: 1 }),
      account: "0x0000000000000000000000000000000000000009",
      address: "0x0000000000000000000000000000000000000001",
      abi: expect.anything(),
      functionName: "delegate",
      args: ["0x0000000000000000000000000000000000000002"],
    });
  });
});
