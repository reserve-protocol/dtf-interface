import { getAddress, type Address } from "viem";
import { describe, expect, it } from "vitest";

import { getIndexDtfStatus } from "@/index-dtf/dtf/status";

// Real catalog entry: VTF on Base, deprecated.
const DEPRECATED_BASE = "0x47686106181b3cefe4eaf94c4c10b48ac750370b";
const UNKNOWN = "0x0000000000000000000000000000000000000001";

describe("getIndexDtfStatus", () => {
  it("reads a deprecated entry from the real catalog", () => {
    expect(getIndexDtfStatus({ address: DEPRECATED_BASE, chainId: 8453 })).toBe("deprecated");
  });

  it("matches regardless of address casing", () => {
    expect(getIndexDtfStatus({ address: getAddress(DEPRECATED_BASE), chainId: 8453 })).toBe("deprecated");
  });

  it("treats DTFs absent from the catalog as active", () => {
    expect(getIndexDtfStatus({ address: UNKNOWN, chainId: 8453 })).toBe("active");
  });

  it("scopes the lookup to the requested chain", () => {
    expect(getIndexDtfStatus({ address: DEPRECATED_BASE, chainId: 1 })).toBe("active");
  });

  it("rejects malformed addresses instead of reporting an active product", () => {
    expect(() => getIndexDtfStatus({ address: "not-an-address" as Address, chainId: 8453 })).toThrow();
  });
});
