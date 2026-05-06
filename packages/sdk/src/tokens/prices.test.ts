import { getAddress } from "viem";
import { describe, expect, it, vi } from "vitest";
import { getTokenVolatilities } from "./prices.js";

describe("token price helpers", () => {
  it("normalizes API volatility address keys", async () => {
    const token = getAddress("0x0000000000000000000000000000000000000001");
    const get = vi.fn(async () => [
      { address: token.toLowerCase(), volatility: "high" as const },
    ]);
    const client = {
      api: { get },
    } as never;

    const volatilities = await getTokenVolatilities(client, {
      chainId: 1,
      addresses: [token],
    });

    expect(volatilities[token]).toBe("high");
  });
});
