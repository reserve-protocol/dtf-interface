import { describe, expect, it } from "vitest";

import { dtfQueryKeys } from "./query-keys.js";

describe("dtfQueryKeys", () => {
  it("keys proposal lists by DTF identity instead of the full DTF object", () => {
    const key = dtfQueryKeys.index.governance.proposals({
      dtf: createDtfKeyFixture(),
      limit: 5,
    });

    expect(key).toEqual([
      "dtf",
      "index",
      "governance",
      "proposals",
      {
        dtf: {
          address: "0x000000000000000000000000000000000000000a",
          chainId: 1,
          governanceAddresses: [
            "0x0000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000002",
            "0x0000000000000000000000000000000000000003",
            "0x0000000000000000000000000000000000000004",
            "0x0000000000000000000000000000000000000005",
            "0x0000000000000000000000000000000000000006",
          ],
        },
        limit: 5,
      },
    ]);
  });

  it("keys proposal lists by sorted governance address sets", () => {
    const firstKey = dtfQueryKeys.index.governance.proposals({
      chainId: 1,
      governanceAddresses: ["0x000000000000000000000000000000000000000B", "0x000000000000000000000000000000000000000A"],
    });
    const secondKey = dtfQueryKeys.index.governance.proposals({
      chainId: 1,
      governanceAddresses: ["0x000000000000000000000000000000000000000A", "0x000000000000000000000000000000000000000B"],
    });

    expect(firstKey).toEqual(secondKey);
    expect(firstKey[4]).toEqual({
      chainId: 1,
      governanceAddresses: ["0x000000000000000000000000000000000000000a", "0x000000000000000000000000000000000000000b"],
    });
  });

  it("keys guardians by DTF identity instead of the full DTF object", () => {
    const key = dtfQueryKeys.index.governance.guardians({
      dtf: createDtfKeyFixture(),
    });

    expect(key).toEqual([
      "dtf",
      "index",
      "governance",
      "guardians",
      {
        dtf: {
          address: "0x000000000000000000000000000000000000000a",
          chainId: 1,
          guardians: [
            "0x0000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000002",
            "0x0000000000000000000000000000000000000003",
            "0x0000000000000000000000000000000000000007",
            "0x0000000000000000000000000000000000000008",
            "0x0000000000000000000000000000000000000009",
            "0x000000000000000000000000000000000000000b",
            "0x000000000000000000000000000000000000000c",
            "0x000000000000000000000000000000000000000d",
          ],
        },
      },
    ]);
  });

  it("keys proposal voter state by account vote instead of all votes", () => {
    const key = dtfQueryKeys.index.governance.proposalVoterState({
      account: "0x000000000000000000000000000000000000000A",
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposal: {
        id: "42",
        voteStart: 100,
        votes: [
          {
            voter: "0x000000000000000000000000000000000000000B",
            choice: "AGAINST",
            weight: { raw: 1n, formatted: "1" },
          },
          {
            voter: "0x000000000000000000000000000000000000000A",
            choice: "FOR",
            weight: { raw: 2n, formatted: "2" },
          },
        ],
      },
    });

    expect(key).toEqual([
      "dtf",
      "index",
      "governance",
      "proposal-voter-state",
      {
        account: "0x000000000000000000000000000000000000000a",
        chainId: 1,
        governance: "0x0000000000000000000000000000000000000001",
        proposal: {
          id: "42",
          vote: "FOR",
          voteStart: 100,
        },
      },
    ]);
  });
});

function createDtfKeyFixture() {
  const ownerGovernance = governanceAuthority(
    "0x0000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000007",
    ["0x000000000000000000000000000000000000000B"],
  );
  const basketGovernance = governanceAuthority(
    "0x0000000000000000000000000000000000000002",
    "0x0000000000000000000000000000000000000008",
    ["0x000000000000000000000000000000000000000C"],
  );
  const lockGovernance = governanceAuthority(
    "0x0000000000000000000000000000000000000003",
    "0x0000000000000000000000000000000000000009",
    ["0x000000000000000000000000000000000000000D"],
  );

  return {
    id: "0x000000000000000000000000000000000000000A",
    chainId: 1,
    governance: {
      admin: { primary: ownerGovernance },
      rebalance: { primary: basketGovernance },
      voteLock: lockGovernance,
      all: [ownerGovernance, basketGovernance],
    },
    roles: {
      admin: {
        legacy: ["0x0000000000000000000000000000000000000004"],
      },
      rebalance: {
        legacyAuctionApprovers: ["0x0000000000000000000000000000000000000005"],
      },
    },
    voteLockVault: {
      legacyGovernance: ["0x0000000000000000000000000000000000000006"],
    },
    volatile: "ignored",
  } as never;
}

function governanceAuthority(address: string, timelock: string, guardians: readonly string[]) {
  return {
    type: "governance",
    address,
    governance: {
      timelock: {
        address: timelock,
        guardians,
      },
    },
  } as never;
}
