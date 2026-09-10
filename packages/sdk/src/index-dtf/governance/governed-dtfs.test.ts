import { getAddress } from "viem";
import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { loadGovernedDtfDirectory } from "@/index-dtf/governance/governed-dtfs";

const CURRENT_VAULT = "0x0000000000000000000000000000000000000007";
const OLD_VAULT = "0x0000000000000000000000000000000000000008";
const OWNER = "0x00000000000000000000000000000000000000ab";
const TRADING = "0x00000000000000000000000000000000000000ef";
const LEGACY_OWNER = "0x0000000000000000000000000000000000000099";
const VAULT_DAO = "0x00000000000000000000000000000000000000cd";

const dtfs = [
  {
    id: "0x00000000000000000000000000000000000000a1",
    token: { symbol: "AAA", name: "Triple A" },
    stToken: { id: CURRENT_VAULT },
    ownerGovernance: { id: OWNER },
    tradingGovernance: { id: TRADING },
    legacyAdmins: [LEGACY_OWNER],
    legacyAuctionApprovers: [],
  },
  {
    id: "0x00000000000000000000000000000000000000b2",
    token: { symbol: "BBB", name: "Triple B" },
    stToken: { id: CURRENT_VAULT },
    ownerGovernance: null,
    tradingGovernance: null,
    legacyAdmins: [],
    legacyAuctionApprovers: [],
  },
  {
    id: "0x00000000000000000000000000000000000000c3",
    token: { symbol: "CCC", name: "No vault" },
    stToken: null,
    ownerGovernance: null,
    tradingGovernance: null,
    legacyAdmins: [],
    legacyAuctionApprovers: [],
  },
];

async function load() {
  const queryIndex = vi.fn(async () => ({ dtfs }));
  const client = { subgraph: { queryIndex } } as unknown as DtfClient;

  return loadGovernedDtfDirectory(client, 8453);
}

describe("governed DTF directory", () => {
  it("resolves current and legacy owner/trading governances to their single DTF, case-insensitively", async () => {
    const directory = await load();

    expect(directory.forGovernance(getAddress(OWNER)).map((dtf) => dtf.symbol)).toEqual(["AAA"]);
    expect(directory.forGovernance(TRADING).map((dtf) => dtf.symbol)).toEqual(["AAA"]);
    expect(directory.forGovernance(LEGACY_OWNER)).toEqual([
      {
        address: getAddress("0x00000000000000000000000000000000000000a1"),
        chainId: 8453,
        symbol: "AAA",
        name: "Triple A",
      },
    ]);
  });

  it("keeps attribution for a governance whose DTF migrated to another vault", async () => {
    const directory = await load();

    // The proposal lives on the old vault, which no longer lists any DTF.
    expect(directory.forVault(OLD_VAULT)).toEqual([]);
    expect(directory.forGovernanceOrVault(LEGACY_OWNER, OLD_VAULT).map((dtf) => dtf.symbol)).toEqual(["AAA"]);
  });

  it("falls back to every DTF on the vault for a vault DAO governance", async () => {
    const directory = await load();

    expect(directory.forGovernanceOrVault(VAULT_DAO, CURRENT_VAULT).map((dtf) => dtf.symbol)).toEqual(["AAA", "BBB"]);
    expect(directory.forGovernanceOrVault(VAULT_DAO, OLD_VAULT)).toEqual([]);
  });
});
