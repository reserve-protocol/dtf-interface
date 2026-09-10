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
const OLD_VAULT_DAO = "0x00000000000000000000000000000000000000ce";

const dtfs = [
  {
    id: "0x00000000000000000000000000000000000000a1",
    token: { symbol: "AAA", name: "Triple A" },
    stToken: { id: CURRENT_VAULT, governance: { id: VAULT_DAO }, legacyGovernance: [OLD_VAULT_DAO] },
    ownerGovernance: { id: OWNER },
    tradingGovernance: { id: TRADING },
    legacyAdmins: [LEGACY_OWNER],
    legacyAuctionApprovers: [],
  },
  {
    id: "0x00000000000000000000000000000000000000b2",
    token: { symbol: "BBB", name: "Triple B" },
    stToken: { id: CURRENT_VAULT, governance: { id: VAULT_DAO }, legacyGovernance: [] },
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

  it("resolves a vault DAO governance, current or legacy, to every DTF that vault governs", async () => {
    const directory = await load();

    expect(directory.forGovernance(VAULT_DAO).map((dtf) => dtf.symbol)).toEqual(["AAA", "BBB"]);
    // AAA migrated vaults: its old vault's DAO governance still resolves to AAA, even though that vault lists no DTF.
    expect(directory.forGovernance(OLD_VAULT_DAO).map((dtf) => dtf.symbol)).toEqual(["AAA"]);
    expect(directory.forVault(OLD_VAULT)).toEqual([]);
  });

  it("shares one walk per client and chain across concurrent reads", async () => {
    const queryIndex = vi.fn(async () => ({ dtfs }));
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    const [first, second] = await Promise.all([
      loadGovernedDtfDirectory(client, 1),
      loadGovernedDtfDirectory(client, 1),
    ]);
    await loadGovernedDtfDirectory(client, 8453);

    expect(first).toBe(second);
    expect(queryIndex).toHaveBeenCalledTimes(2);
  });

  it("does not keep a failed walk", async () => {
    const queryIndex = vi.fn().mockRejectedValueOnce(new Error("subgraph down")).mockResolvedValue({ dtfs });
    const client = { subgraph: { queryIndex } } as unknown as DtfClient;

    await expect(loadGovernedDtfDirectory(client, 56)).rejects.toThrow("subgraph down");
    await expect(loadGovernedDtfDirectory(client, 56)).resolves.toBeDefined();
    expect(queryIndex).toHaveBeenCalledTimes(2);
  });

  it("returns nothing for a governance no DTF has ever named", async () => {
    const directory = await load();

    expect(directory.forGovernance("0x0000000000000000000000000000000000000001")).toEqual([]);
    expect(directory.forVault(CURRENT_VAULT).map((dtf) => dtf.symbol)).toEqual(["AAA", "BBB"]);
  });
});
