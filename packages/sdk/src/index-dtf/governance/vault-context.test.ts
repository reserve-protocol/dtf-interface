import { getAddress } from "viem";
import { describe, expect, it } from "vitest";

import { mapGovernedDtfs, mapVaultUnderlying } from "@/index-dtf/governance/vault-context";

const OWNER_GOVERNANCE = "0x00000000000000000000000000000000000000ab";
const DAO_GOVERNANCE = "0x00000000000000000000000000000000000000cd";
const vault = {
  dtfs: [
    {
      id: "0x00000000000000000000000000000000000000a1",
      token: { symbol: "AAA", name: "Triple A" },
      ownerGovernance: { id: OWNER_GOVERNANCE },
      tradingGovernance: { id: "0x00000000000000000000000000000000000000ef" },
      legacyAdmins: [],
      legacyAuctionApprovers: [],
    },
    {
      id: "0x00000000000000000000000000000000000000b2",
      token: { symbol: "BBB", name: "Triple B" },
      ownerGovernance: null,
      tradingGovernance: null,
      legacyAdmins: ["0x0000000000000000000000000000000000000099"],
      legacyAuctionApprovers: [],
    },
  ],
};

describe("mapGovernedDtfs", () => {
  it("attributes an owner or trading governance to its single DTF, case-insensitively", () => {
    const dtfs = mapGovernedDtfs(vault, 8453, getAddress(OWNER_GOVERNANCE));

    expect(dtfs).toEqual([
      {
        address: getAddress("0x00000000000000000000000000000000000000a1"),
        chainId: 8453,
        symbol: "AAA",
        name: "Triple A",
      },
    ]);
  });

  it("attributes a legacy owner governance to the DTF it used to govern", () => {
    expect(mapGovernedDtfs(vault, 8453, "0x0000000000000000000000000000000000000099").map((dtf) => dtf.symbol)).toEqual(
      ["BBB"],
    );
  });

  it("attributes the vault DAO governance to every DTF on the vault", () => {
    const dtfs = mapGovernedDtfs(vault, 1, DAO_GOVERNANCE);

    expect(dtfs.map((dtf) => dtf.symbol)).toEqual(["AAA", "BBB"]);
  });

  it("returns every DTF when no governance is given", () => {
    expect(mapGovernedDtfs(vault, 56)).toHaveLength(2);
  });
});

describe("mapVaultUnderlying", () => {
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
