import { describe, expect, it } from "vitest";

import { normalizeQueryKeyValue } from "@/normalize-query-key";

describe("normalizeQueryKeyValue", () => {
  it("normalizes addresses and bigints for React Query keys", () => {
    expect(
      normalizeQueryKeyValue({
        amount: 10n,
        address: "0x000000000000000000000000000000000000000A",
      }),
    ).toEqual({
      address: "0x000000000000000000000000000000000000000a",
      amount: "10",
    });
  });

  it("sorts object keys and drops undefined values", () => {
    expect(
      normalizeQueryKeyValue({
        z: 1,
        a: undefined,
        b: { d: 2, c: 1 },
      }),
    ).toEqual({
      b: { c: 1, d: 2 },
      z: 1,
    });
  });
});
