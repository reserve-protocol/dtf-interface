import { getAddress } from "viem";
import { describe, expect, it } from "vitest";

import { mapVaultShareToken, mapVaultUnderlying } from "@/index-dtf/governance/vault-context";

describe("vault token mapping", () => {
  it("maps the share token with its own decimals", () => {
    expect(
      mapVaultShareToken({
        id: "0x00000000000000000000000000000000000000a7",
        token: { symbol: "vlUSDC", name: "Vote-locked USDC", decimals: 6 },
      }),
    ).toEqual({
      address: getAddress("0x00000000000000000000000000000000000000a7"),
      symbol: "vlUSDC",
      name: "Vote-locked USDC",
      decimals: 6,
    });
  });

  it("skips vaults without an indexed underlying and checksums the rest", () => {
    expect(mapVaultUnderlying(null)).toBeUndefined();
    expect(
      mapVaultUnderlying({
        id: "0x00000000000000000000000000000000000000c3",
        symbol: "RSR",
        name: "Reserve Rights",
        decimals: 18,
      }),
    ).toEqual({
      address: getAddress("0x00000000000000000000000000000000000000c3"),
      symbol: "RSR",
      name: "Reserve Rights",
      decimals: 18,
    });
  });
});
