import { getAddress } from "viem";
import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";
import type { IndexDtf } from "@/types/index-dtf";

import { getLegacyVoteLocks } from "@/index-dtf/governance/legacy-vote-lock";
import { getDtfProposalGovernanceIds, getProposalGovernanceAddresses } from "@/index-dtf/governance/utils";
import { getVoteLockDependents } from "@/index-dtf/governance/vote-lock-dependents";

const SINGLETON = "0x2F0D6538807a77d4AdDCd4b4DAf214Ea2E818E3D";
const OLD_VAULT = "0x45A96cD0E4D89a41eebF3cC4204B00B1cf1582FA";
const OLD_OWNER_GOVERNOR = "0x719eDEd05c7a6468E44AcFBBD19b2DF2EED7759E";
const OLD_VAULT_DAO = getAddress("0x2dee428bd8131faa4288750d707de6f3901afe3c");
const NEW_GOVERNOR = "0x00000000000000000000000000000000000000aa";
const MIGRATED = "0x4dA9A0f397dB1397902070f93a4D6ddBC0E0E6e8";
const PENDING = "0x00000000000000000000000000000000000000b2";

const migratedDtf = {
  chainId: 8453,
  roles: {
    admin: {
      legacy: [],
      legacyGovernances: [{ governance: OLD_OWNER_GOVERNOR, voteLock: OLD_VAULT, voteLockGovernance: OLD_VAULT_DAO }],
    },
    rebalance: { legacyAuctionApprovers: [] },
  },
  governance: { all: [], voteLock: undefined },
  voteLockVault: { token: { address: SINGLETON }, legacyGovernance: [] },
} as unknown as IndexDtf;

describe("vote-lock migration data", () => {
  it("lists the vault a replaced Folio admin governor voted with as a legacy vote lock", async () => {
    const readContract = vi.fn();
    const client = { viem: { readContract } } as unknown as DtfClient;

    expect(await getLegacyVoteLocks(client, { dtf: migratedDtf })).toEqual([OLD_VAULT]);
    expect(readContract).not.toHaveBeenCalled();
  });

  it("keeps the replaced admin governor and its vault DAO in the proposal governance set", () => {
    expect(getProposalGovernanceAddresses(migratedDtf)).toEqual([OLD_OWNER_GOVERNOR, OLD_VAULT_DAO]);
    expect(
      getDtfProposalGovernanceIds({
        ownerGovernance: { id: NEW_GOVERNOR },
        legacyAdmins: [],
        legacyAdminGovernances: [{ id: OLD_OWNER_GOVERNOR, token: { governance: { id: OLD_VAULT_DAO } } }],
        legacyAuctionApprovers: [],
        stToken: { governance: null, legacyGovernance: [] },
      }),
    ).toEqual([NEW_GOVERNOR, OLD_OWNER_GOVERNOR.toLowerCase(), OLD_VAULT_DAO.toLowerCase()]);
  });

  it("keeps a DTF pending while either its owner or its trading timelock still holds the role through the vault", async () => {
    const vault = OLD_VAULT.toLowerCase();
    const other = "0x00000000000000000000000000000000000000ff";
    const gov = (token: string, timelock: string) => ({ token: { id: token }, timelock: { id: timelock } });
    const queryIndex = vi.fn().mockResolvedValue({
      dtfs: [
        {
          id: MIGRATED.toLowerCase(),
          token: { symbol: "LCAP", name: "LCAP" },
          ownerGovernance: gov(vault, "0x0000000000000000000000000000000000000c01"),
          tradingGovernance: gov(vault, "0x0000000000000000000000000000000000000c02"),
        },
        {
          id: PENDING,
          token: { symbol: "TRADE", name: "Trading only" },
          ownerGovernance: gov(other, "0x0000000000000000000000000000000000000c03"),
          tradingGovernance: gov(vault, "0x0000000000000000000000000000000000000c04"),
        },
        {
          id: "0x00000000000000000000000000000000000000c3",
          token: { symbol: "NOGOV", name: "No governance" },
          ownerGovernance: null,
          tradingGovernance: null,
        },
      ],
    });
    const multicall = vi.fn().mockResolvedValue([false, false, true]);
    const client = {
      subgraph: { queryIndex },
      viem: { getPublicClient: () => ({ multicall }) },
    } as unknown as DtfClient;

    const dependents = await getVoteLockDependents(client, { chainId: 8453, voteLock: OLD_VAULT });

    expect(queryIndex).toHaveBeenCalledWith(expect.objectContaining({ variables: { voteLock: vault } }));
    expect(multicall.mock.calls[0]?.[0].contracts).toHaveLength(3);
    expect(dependents.map(({ symbol, governedByVoteLock }) => [symbol, governedByVoteLock])).toEqual([
      ["LCAP", false],
      ["TRADE", true],
      ["NOGOV", false],
    ]);
  });

  it("skips the role reads when no DTF uses the vault", async () => {
    const multicall = vi.fn();
    const client = {
      subgraph: { queryIndex: vi.fn().mockResolvedValue({ dtfs: [] }) },
      viem: { getPublicClient: () => ({ multicall }) },
    } as unknown as DtfClient;

    expect(await getVoteLockDependents(client, { chainId: 8453, voteLock: OLD_VAULT })).toEqual([]);
    expect(multicall).not.toHaveBeenCalled();
  });
});
