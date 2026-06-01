import { describe, expect, it } from "vitest";

import { dtfQueryKeys } from "@/query-keys";

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
      "proposal-list",
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

  it("uses the same DTF identity params for proposal counts", () => {
    const proposalsKey = dtfQueryKeys.index.governance.proposals({ dtf: createDtfKeyFixture() });
    const proposalListKey = dtfQueryKeys.index.governance.proposalList({ dtf: createDtfKeyFixture() });

    expect(proposalsKey).toEqual(proposalListKey);
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
        voteToken: "0x000000000000000000000000000000000000000C",
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
          isOptimistic: false,
          optimisticSnapshot: null,
          vote: "FOR",
          voteStart: 100,
          voteToken: "0x000000000000000000000000000000000000000c",
        },
      },
    ]);
  });

  it("keys unified optimistic proposal voter state by token", () => {
    const key = dtfQueryKeys.index.governance.proposalVoterState({
      account: "0x000000000000000000000000000000000000000A",
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposal: {
        id: "42",
        isOptimistic: true,
        voteStart: 100,
        voteToken: "0x000000000000000000000000000000000000000B",
        votes: [],
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
          isOptimistic: true,
          optimisticSnapshot: null,
          vote: null,
          voteStart: 100,
          voteToken: "0x000000000000000000000000000000000000000b",
        },
      },
    ]);
  });

  it("keys optimistic proposal voter state by token and account vote", () => {
    const key = dtfQueryKeys.index.governance.optimisticProposalVoterState({
      account: "0x000000000000000000000000000000000000000A",
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposal: {
        id: "42",
        voteStart: 100,
        voteToken: "0x000000000000000000000000000000000000000B",
        votes: [
          {
            voter: "0x000000000000000000000000000000000000000C",
            choice: "FOR",
            weight: { raw: 1n, formatted: "1" },
          },
          {
            voter: "0x000000000000000000000000000000000000000A",
            choice: "AGAINST",
            weight: { raw: 2n, formatted: "2" },
          },
        ],
      },
    });

    expect(key).toEqual([
      "dtf",
      "index",
      "governance",
      "optimistic-proposal-voter-state",
      {
        account: "0x000000000000000000000000000000000000000a",
        chainId: 1,
        governance: "0x0000000000000000000000000000000000000001",
        proposal: {
          id: "42",
          optimisticSnapshot: null,
          vote: "AGAINST",
          voteStart: 100,
          voteToken: "0x000000000000000000000000000000000000000b",
        },
      },
    ]);
  });

  it("normalizes optimistic governance keys", () => {
    const key = dtfQueryKeys.index.governance.pastOptimisticVotes({
      account: "0x000000000000000000000000000000000000000A",
      chainId: 1,
      timepoint: 123n,
      voteToken: "0x000000000000000000000000000000000000000B",
    });

    expect(key).toEqual([
      "dtf",
      "index",
      "governance",
      "past-optimistic-votes",
      {
        account: "0x000000000000000000000000000000000000000a",
        chainId: 1,
        timepoint: "123",
        voteToken: "0x000000000000000000000000000000000000000b",
      },
    ]);
  });

  it("normalizes selector registry keys", () => {
    const firstKey = dtfQueryKeys.index.governance.selectorRegistryIsAllowed({
      chainId: 1,
      registry: "0x000000000000000000000000000000000000000A",
      selector: "0xABCDEF12",
      target: "0x000000000000000000000000000000000000000B",
    });
    const secondKey = dtfQueryKeys.index.governance.selectorRegistryIsAllowed({
      chainId: 1,
      registry: "0x000000000000000000000000000000000000000a",
      selector: "0xabcdef12",
      target: "0x000000000000000000000000000000000000000b",
    });

    expect(firstKey).toEqual(secondKey);
    expect(firstKey[4]).toEqual({
      chainId: 1,
      registry: "0x000000000000000000000000000000000000000a",
      selector: "0xabcdef12",
      target: "0x000000000000000000000000000000000000000b",
    });
  });

  it("normalizes proposal decode keys", () => {
    const key = dtfQueryKeys.index.governance.proposalDecode({
      chainId: 1,
      targets: ["0x000000000000000000000000000000000000000A"],
      calldatas: ["0xABCDEF12"],
      dtf: {
        address: "0x000000000000000000000000000000000000000B",
        proxyAdmin: "0x000000000000000000000000000000000000000C",
        legacyAdminGovernance: [],
        legacyTradingGovernance: [],
        stakingToken: {
          address: "0x000000000000000000000000000000000000000D",
          legacyGovernance: [],
        },
      },
    });

    expect(key).toEqual([
      "dtf",
      "index",
      "governance",
      "proposal-decode",
      {
        calldatas: ["0xABCDEF12"],
        chainId: 1,
        dtf: {
          address: "0x000000000000000000000000000000000000000b",
          legacyAdminGovernance: [],
          legacyTradingGovernance: [],
          proxyAdmin: "0x000000000000000000000000000000000000000c",
          stakingToken: {
            address: "0x000000000000000000000000000000000000000d",
            legacyGovernance: [],
          },
        },
        targets: ["0x000000000000000000000000000000000000000a"],
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
