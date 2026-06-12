import { describe, expect, it } from "vitest";

import { isSdkError } from "@/lib/errors";
import { mapAmount, sameAddress, toUint, toUintNumber, uniqueAddresses } from "@/lib/utils";

const CHECKSUMMED = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const LOWERCASE = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

describe("uniqueAddresses", () => {
  it("dedupes case-insensitively and returns checksummed addresses", () => {
    expect(uniqueAddresses([LOWERCASE, CHECKSUMMED])).toEqual([CHECKSUMMED]);
  });

  it("preserves first-seen order", () => {
    const a = "0x1111111111111111111111111111111111111111";
    const b = "0x2222222222222222222222222222222222222222";

    expect(uniqueAddresses([b, a, b])).toEqual([b, a]);
  });
});

describe("sameAddress", () => {
  it("compares case-insensitively", () => {
    expect(sameAddress(LOWERCASE, CHECKSUMMED)).toBe(true);
    expect(sameAddress(LOWERCASE, "0x1111111111111111111111111111111111111111")).toBe(false);
  });
});

describe("mapAmount", () => {
  it("formats bigints with 18 decimals by default", () => {
    expect(mapAmount(1_500_000_000_000_000_000n)).toEqual({
      raw: 1_500_000_000_000_000_000n,
      formatted: "1.5",
    });
  });

  it("converts subgraph string values", () => {
    expect(mapAmount("250000", 6)).toEqual({ raw: 250_000n, formatted: "0.25" });
  });

  it("keeps full precision for values beyond Number.MAX_SAFE_INTEGER", () => {
    const huge = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    expect(mapAmount(huge, 18).raw).toBe(BigInt(huge));
  });

  it("throws on non-numeric input", () => {
    expect(() => mapAmount("not-a-number")).toThrow();
  });
});

describe("toUint", () => {
  it("passes through non-negative bigints and converts integers", () => {
    expect(toUint(5n, "field")).toBe(5n);
    expect(toUint(5, "field")).toBe(5n);
  });

  it("rejects negatives, floats, and non-finite numbers with INVALID_INPUT", () => {
    for (const bad of [-1n, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY] as const) {
      try {
        toUint(bad, "field");
        expect.unreachable("expected toUint to throw");
      } catch (error) {
        expect(isSdkError(error)).toBe(true);
        expect((error as { code: string }).code).toBe("INVALID_INPUT");
      }
    }
  });
});

describe("toUintNumber", () => {
  it("converts values within the safe integer range", () => {
    expect(toUintNumber(42n, "field")).toBe(42);
  });

  it("rejects values beyond Number.MAX_SAFE_INTEGER", () => {
    expect(() => toUintNumber(BigInt(Number.MAX_SAFE_INTEGER) + 1n, "field")).toThrow();
  });
});
