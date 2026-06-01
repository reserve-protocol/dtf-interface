import { encodeFunctionData } from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { dtfIndexProposalAbi } from "@/index-dtf/abis/proposal-decoder";
import {
  getAllProposals,
  getProposal,
  getProposalList,
  getProposalVotingSnapshot,
  getProposals,
} from "@/index-dtf/governance/index";

describe("Index DTF governance proposals", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps proposal detail and derives Register-compatible voting state", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const setMandateCalldata = encodeFunctionData({
      abi: dtfIndexProposalAbi,
      functionName: "setMandate",
      args: ["New mandate"],
    });

    const queryIndex = vi.fn(async () => ({
      dtf: {
        id: "0x0000000000000000000000000000000000000003",
        proxyAdmin: "0x0000000000000000000000000000000000000008",
        legacyAdmins: [],
        legacyAuctionApprovers: [],
        ownerGovernance: {
          id: "0x0000000000000000000000000000000000000001",
          optimisticSelectorRegistry: null,
          timelock: {
            id: "0x0000000000000000000000000000000000000006",
          },
        },
        tradingGovernance: null,
        stToken: {
          id: "0x0000000000000000000000000000000000000007",
          legacyGovernance: [],
          governance: null,
        },
      },
      proposal: {
        id: "42",
        timelockId: "0x0000000000000000000000000000000000000000000000000000000000000042",
        description: "Proposal description",
        creationTime: "999000",
        voteStart: "999900",
        voteEnd: "1000100",
        queueBlock: null,
        queueTime: null,
        state: "PENDING",
        isOptimistic: false,
        vetoThreshold: null,
        executionETA: null,
        executionTime: null,
        executionBlock: null,
        creationBlock: "123",
        cancellationTime: null,
        calldatas: [setMandateCalldata, "0x1234", "0x12345678"],
        targets: [
          "0x0000000000000000000000000000000000000003",
          "0x0000000000000000000000000000000000000005",
          "0x0000000000000000000000000000000000000003",
        ],
        proposer: {
          address: "0x0000000000000000000000000000000000000002",
        },
        votes: [
          {
            choice: "FOR",
            voter: {
              address: "0x0000000000000000000000000000000000000004",
            },
            weight: "2000000000000000000",
          },
        ],
        forWeightedVotes: "2000000000000000000",
        againstWeightedVotes: "1000000000000000000",
        abstainWeightedVotes: "2000000000000000000",
        quorumVotes: "3000000000000000000",
        forDelegateVotes: "2",
        abstainDelegateVotes: "0",
        againstDelegateVotes: "1",
        executionTxnHash: null,
        governance: {
          id: "0x0000000000000000000000000000000000000001",
          optimisticSelectorRegistry: null,
          token: {
            id: "0x0000000000000000000000000000000000000007",
          },
          timelock: {
            id: "0x0000000000000000000000000000000000000006",
            type: "OWNER",
          },
        },
      },
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
      viem: {
        readContract: vi.fn(async () => {
          throw new Error("The contract function returned no data");
        }),
      },
    } as unknown as DtfClient;

    const proposal = await getProposal(client, {
      proposalId: "42",
      address: "0x0000000000000000000000000000000000000003",
      chainId: 1,
    });

    expect(queryIndex).toHaveBeenCalledTimes(1);
    expect(queryIndex).toHaveBeenCalledWith({
      chainId: 1,
      query: expect.anything(),
      variables: {
        dtfId: "0x0000000000000000000000000000000000000003",
        proposalId: "42",
      },
    });
    expect(proposal).toMatchObject({
      id: "42",
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      voteToken: "0x0000000000000000000000000000000000000007",
      dtf: {
        address: "0x0000000000000000000000000000000000000003",
        chainId: 1,
      },
      proposer: "0x0000000000000000000000000000000000000002",
      description: "Proposal description",
      state: "ACTIVE",
      isOptimistic: false,
      creationTime: 999000,
      creationBlock: 123,
      voteStart: 999900,
      voteEnd: 1000100,
      timelockId: "0x0000000000000000000000000000000000000000000000000000000000000042",
      votingState: {
        state: "ACTIVE",
        deadline: 100,
        quorum: false,
        forVotesReachedQuorum: false,
        participationQuorumReached: true,
        for: 40,
        against: 20,
        abstain: 40,
      },
    });
    expect(proposal.optimistic).toBeUndefined();
    expect(proposal.vetoThreshold).toBeUndefined();
    expect(proposal.forWeightedVotes).toEqual({
      raw: 2000000000000000000n,
      formatted: "2",
    });
    expect(proposal.votes[0]).toEqual({
      voter: "0x0000000000000000000000000000000000000004",
      choice: "FOR",
      weight: {
        raw: 2000000000000000000n,
        formatted: "2",
      },
    });
    expect(proposal.targets).toEqual([
      "0x0000000000000000000000000000000000000003",
      "0x0000000000000000000000000000000000000005",
      "0x0000000000000000000000000000000000000003",
    ]);
    expect(proposal.calldatas).toEqual([setMandateCalldata, "0x1234", "0x12345678"]);
    expect(proposal.decoded.calls).toEqual([
      {
        index: 0,
        target: "0x0000000000000000000000000000000000000003",
        contract: "Index DTF",
        functionName: "setMandate",
        signature: "setMandate(_newMandate: string)",
        parameters: ["_newMandate: string"],
        params: ["New mandate"],
        callData: setMandateCalldata,
      },
    ]);
    expect(proposal.decoded.dataByContract).toEqual([
      {
        target: "0x0000000000000000000000000000000000000003",
        contract: "Index DTF",
        calls: proposal.decoded.calls,
      },
    ]);
    expect(proposal.decoded.unknownCalls).toEqual([
      {
        index: 1,
        target: "0x0000000000000000000000000000000000000005",
        contract: "Unknown",
        callData: "0x1234",
      },
      {
        index: 2,
        target: "0x0000000000000000000000000000000000000003",
        contract: "Index DTF",
        callData: "0x12345678",
      },
    ]);
    expect(proposal.decoded.unknownContracts).toEqual([
      {
        target: "0x0000000000000000000000000000000000000005",
        contract: "Unknown",
        calls: [proposal.decoded.unknownCalls[0]],
      },
      {
        target: "0x0000000000000000000000000000000000000003",
        contract: "Index DTF",
        calls: [proposal.decoded.unknownCalls[1]],
      },
    ]);
  });

  it("maps optimistic proposal threshold from indexed snapshot values", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      dtf: {
        id: "0x0000000000000000000000000000000000000003",
        proxyAdmin: "0x0000000000000000000000000000000000000008",
        legacyAdmins: [],
        legacyAuctionApprovers: [],
        ownerGovernance: null,
        tradingGovernance: null,
        stToken: {
          id: "0x0000000000000000000000000000000000000007",
          legacyGovernance: [],
          governance: {
            id: "0x0000000000000000000000000000000000000001",
            optimisticSelectorRegistry: null,
            timelock: {
              id: "0x0000000000000000000000000000000000000006",
            },
          },
        },
      },
      proposal: {
        id: "42",
        timelockId: null,
        description: "Optimistic proposal",
        creationTime: "999000",
        voteStart: "999900",
        voteEnd: "1000100",
        queueBlock: null,
        queueTime: null,
        state: "PENDING",
        isOptimistic: true,
        vetoThreshold: "200000000000000000",
        vetoThresholdVotes: "20000000000000000000",
        optimisticSnapshot: "999900",
        optimisticSnapshotSupply: "100000000000000000000",
        executionETA: null,
        executionTime: null,
        executionBlock: null,
        creationBlock: "123",
        cancellationTime: null,
        calldatas: [],
        targets: [],
        proposer: {
          address: "0x0000000000000000000000000000000000000002",
        },
        votes: [],
        forWeightedVotes: "0",
        againstWeightedVotes: "0",
        abstainWeightedVotes: "0",
        quorumVotes: "999000000000000000000",
        forDelegateVotes: "0",
        abstainDelegateVotes: "0",
        againstDelegateVotes: "0",
        executionTxnHash: null,
        governance: {
          id: "0x0000000000000000000000000000000000000001",
          optimisticSelectorRegistry: null,
          token: {
            id: "0x0000000000000000000000000000000000000007",
          },
          timelock: {
            id: "0x0000000000000000000000000000000000000006",
            type: "GOVERNANCE",
          },
        },
      },
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposal = await getProposal(client, {
      proposalId: "42",
      address: "0x0000000000000000000000000000000000000003",
      chainId: 1,
    });

    expect(proposal.quorumVotes).toEqual({
      raw: 999000000000000000000n,
      formatted: "999",
    });
    expect(proposal.optimistic?.vetoThresholdVotes).toEqual({
      raw: 20000000000000000000n,
      formatted: "20",
    });
    expect(proposal.optimistic).toMatchObject({
      proposalId: "42",
      voteToken: "0x0000000000000000000000000000000000000007",
      snapshot: 999900n,
      snapshotSupply: {
        raw: 100000000000000000000n,
        formatted: "100",
      },
      vetoThreshold: 200000000000000000n,
    });
    expect(proposal.votingState).toMatchObject({
      state: "ACTIVE",
      vetoReached: false,
    });
  });

  it("hydrates active optimistic detail threshold before the first vote", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      dtf: {
        id: "0x0000000000000000000000000000000000000003",
        proxyAdmin: "0x0000000000000000000000000000000000000008",
        legacyAdmins: [],
        legacyAuctionApprovers: [],
        ownerGovernance: null,
        tradingGovernance: null,
        stToken: {
          id: "0x0000000000000000000000000000000000000007",
          legacyGovernance: [],
          governance: {
            id: "0x0000000000000000000000000000000000000001",
            optimisticSelectorRegistry: null,
            timelock: {
              id: "0x0000000000000000000000000000000000000006",
            },
          },
        },
      },
      proposal: {
        id: "42",
        timelockId: null,
        description: "Optimistic proposal",
        creationTime: "999000",
        voteStart: "999900",
        voteEnd: "1000100",
        queueBlock: null,
        queueTime: null,
        state: "ACTIVE",
        isOptimistic: true,
        vetoThreshold: "20000000000000000",
        vetoThresholdVotes: "1",
        optimisticSnapshot: "999900",
        optimisticSnapshotSupply: "50",
        executionETA: null,
        executionTime: null,
        executionBlock: null,
        creationBlock: "123",
        cancellationTime: null,
        calldatas: [],
        targets: [],
        proposer: {
          address: "0x0000000000000000000000000000000000000002",
        },
        votes: [],
        forWeightedVotes: "0",
        againstWeightedVotes: "0",
        abstainWeightedVotes: "0",
        quorumVotes: "1",
        forDelegateVotes: "0",
        abstainDelegateVotes: "0",
        againstDelegateVotes: "0",
        executionTxnHash: null,
        governance: {
          id: "0x0000000000000000000000000000000000000001",
          optimisticSelectorRegistry: null,
          token: {
            id: "0x0000000000000000000000000000000000000007",
          },
          timelock: {
            id: "0x0000000000000000000000000000000000000006",
            type: "GOVERNANCE",
          },
        },
      },
    }));
    const getPublicClient = vi.fn();
    const readContract = vi.fn(async () => 1000000000000000000n);
    const client = {
      subgraph: {
        queryIndex,
      },
      viem: {
        getPublicClient,
        readContract,
      },
    } as unknown as DtfClient;

    const proposal = await getProposal(client, {
      proposalId: "42",
      address: "0x0000000000000000000000000000000000000003",
      chainId: 1,
    });

    expect(getPublicClient).not.toHaveBeenCalled();
    expect(readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: "0x0000000000000000000000000000000000000007",
        functionName: "getPastTotalSupply",
        args: [999900n],
      }),
    );
    expect(proposal.optimistic?.vetoThresholdVotes).toEqual({
      raw: 20000000000000000n,
      formatted: "0.02",
    });
    expect(proposal.votingState.threshold).toMatchObject({
      targetVotes: {
        raw: 20000000000000000n,
        formatted: "0.02",
      },
      hasTarget: true,
    });
  });

  it("maps optimistic proposal voting snapshots from indexed threshold values", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      proposal: {
        id: "42",
        state: "ACTIVE",
        isOptimistic: true,
        vetoThreshold: "20000000000000000",
        vetoThresholdVotes: "20000000000000000",
        optimisticSnapshot: "999900",
        optimisticSnapshotSupply: "1000000000000000000",
        voteStart: "999900",
        voteEnd: "999950",
        forWeightedVotes: "0",
        againstWeightedVotes: "1000000000000000000",
        abstainWeightedVotes: "0",
        quorumVotes: "999000000000000000000",
        governance: {
          id: "0x0000000000000000000000000000000000000001",
          token: {
            id: "0x0000000000000000000000000000000000000007",
          },
        },
        votes: [
          {
            choice: "AGAINST",
            voter: {
              address: "0x0000000000000000000000000000000000000004",
            },
            weight: "1000000000000000000",
          },
        ],
      },
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposal = await getProposalVotingSnapshot(client, {
      proposalId: "42",
      chainId: 1,
    });

    expect(proposal.quorumVotes).toEqual({
      raw: 999000000000000000000n,
      formatted: "999",
    });
    expect(proposal.optimistic?.vetoThresholdVotes).toEqual({
      raw: 20000000000000000n,
      formatted: "0.02",
    });
    expect(proposal.votingState).toMatchObject({
      state: "DEFEATED",
      quorum: true,
      vetoReached: true,
    });
  });

  it("uses indexed optimistic threshold values when veto votes exist", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      dtf: {
        id: "0x0000000000000000000000000000000000000003",
        proxyAdmin: "0x0000000000000000000000000000000000000008",
        legacyAdmins: [],
        legacyAuctionApprovers: [],
        ownerGovernance: null,
        tradingGovernance: null,
        stToken: {
          id: "0x0000000000000000000000000000000000000007",
          legacyGovernance: [],
          governance: {
            id: "0x0000000000000000000000000000000000000001",
            optimisticSelectorRegistry: null,
            timelock: {
              id: "0x0000000000000000000000000000000000000006",
            },
          },
        },
      },
      proposal: {
        id: "42",
        timelockId: null,
        description: "Vetoed optimistic proposal",
        creationTime: "999000",
        voteStart: "999900",
        voteEnd: "999950",
        queueBlock: null,
        queueTime: null,
        state: "ACTIVE",
        isOptimistic: true,
        vetoThreshold: "20000000000000000",
        vetoThresholdVotes: "20000000000000000",
        optimisticSnapshot: "999900",
        optimisticSnapshotSupply: "1000000000000000000",
        executionETA: null,
        executionTime: null,
        executionBlock: null,
        creationBlock: "123",
        cancellationTime: null,
        calldatas: [],
        targets: [],
        proposer: {
          address: "0x0000000000000000000000000000000000000002",
        },
        votes: [
          {
            choice: "AGAINST",
            voter: {
              address: "0x0000000000000000000000000000000000000004",
            },
            weight: "1000000000000000000",
          },
        ],
        forWeightedVotes: "0",
        againstWeightedVotes: "1000000000000000000",
        abstainWeightedVotes: "0",
        quorumVotes: "20000000000000000",
        forDelegateVotes: "0",
        abstainDelegateVotes: "0",
        againstDelegateVotes: "1",
        executionTxnHash: null,
        governance: {
          id: "0x0000000000000000000000000000000000000001",
          optimisticSelectorRegistry: null,
          token: {
            id: "0x0000000000000000000000000000000000000007",
          },
          timelock: {
            id: "0x0000000000000000000000000000000000000006",
            type: "GOVERNANCE",
          },
        },
      },
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposal = await getProposal(client, {
      proposalId: "42",
      address: "0x0000000000000000000000000000000000000003",
      chainId: 1,
    });

    expect(proposal.quorumVotes).toEqual({
      raw: 20000000000000000n,
      formatted: "0.02",
    });
    expect(proposal.optimistic?.vetoThresholdVotes).toEqual({
      raw: 20000000000000000n,
      formatted: "0.02",
    });
    expect(proposal.votingState).toMatchObject({
      state: "DEFEATED",
      quorum: true,
      vetoReached: true,
    });
  });

  it("does not fail proposal lists when optimistic threshold fields are incomplete", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      governances: [
        {
          id: "0x0000000000000000000000000000000000000001",
          proposalCount: "1",
          proposals: [
            createProposalSummary({
              id: "optimistic-incomplete",
              creationTime: "999000",
              state: "ACTIVE",
              forWeightedVotes: "0",
              abstainWeightedVotes: "0",
              againstWeightedVotes: "1000000000000000000",
              quorumVotes: "1000000000000000000",
              voteStart: "999900",
              voteEnd: "1000100",
              creationBlock: "10",
              proposer: "0x0000000000000000000000000000000000000002",
              governance: "0x0000000000000000000000000000000000000001",
              timelock: "0x0000000000000000000000000000000000000008",
              isOptimistic: true,
              vetoThreshold: "20000000000000000",
              optimisticSnapshot: "999900",
            }),
          ],
        },
      ],
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposals = await getProposals(client, {
      chainId: 1,
      governanceAddresses: "0x0000000000000000000000000000000000000001",
    });

    expect(proposals[0]).toMatchObject({
      id: "optimistic-incomplete",
      isOptimistic: true,
    });
    expect(proposals[0]?.optimistic).toBeUndefined();
    expect(proposals[0]?.vetoThreshold).toBe(20000000000000000n);
    expect(proposals[0]?.votingState).toMatchObject({
      state: "ACTIVE",
      quorum: false,
      vetoReached: false,
      against: 100,
      threshold: {
        hasTarget: false,
      },
    });
  });

  it("throws generic record-not-found when proposal is missing", async () => {
    const queryIndex = vi.fn(async () => ({ dtf: null, proposal: null }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    await expect(
      getProposal(client, {
        proposalId: "missing",
        address: "0x0000000000000000000000000000000000000003",
        chainId: 1,
      }),
    ).rejects.toMatchObject({
      code: "RECORD_NOT_FOUND",
      meta: {
        chainId: 1,
        entity: "indexDtfProposal",
        id: "missing",
      },
    });
  });

  it("does not run hidden challenge lookups for proposal detail confirmations", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      dtf: {
        id: "0x0000000000000000000000000000000000000003",
        proxyAdmin: "0x0000000000000000000000000000000000000008",
        legacyAdmins: [],
        legacyAuctionApprovers: [],
        ownerGovernance: {
          id: "0x0000000000000000000000000000000000000001",
          optimisticSelectorRegistry: null,
          timelock: {
            id: "0x0000000000000000000000000000000000000006",
          },
        },
        tradingGovernance: null,
        stToken: {
          id: "0x0000000000000000000000000000000000000007",
          legacyGovernance: [],
          governance: null,
        },
      },
      proposal: {
        id: "confirmation",
        timelockId: null,
        description: "Confirmation For: Same proposal",
        creationTime: "999100",
        voteStart: "999000",
        voteEnd: "1000100",
        queueBlock: null,
        queueTime: null,
        state: "ACTIVE",
        isOptimistic: false,
        vetoThreshold: null,
        executionETA: null,
        executionTime: null,
        executionBlock: null,
        creationBlock: "124",
        cancellationTime: null,
        calldatas: [],
        targets: [],
        proposer: {
          address: "0x0000000000000000000000000000000000000002",
        },
        votes: [],
        forWeightedVotes: "0",
        againstWeightedVotes: "0",
        abstainWeightedVotes: "0",
        quorumVotes: "1000000000000000000",
        forDelegateVotes: "0",
        abstainDelegateVotes: "0",
        againstDelegateVotes: "0",
        executionTxnHash: null,
        governance: {
          id: "0x0000000000000000000000000000000000000001",
          optimisticSelectorRegistry: null,
          token: {
            id: "0x0000000000000000000000000000000000000007",
          },
          timelock: {
            id: "0x0000000000000000000000000000000000000006",
            type: "OWNER",
          },
        },
      },
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposal = await getProposal(client, {
      proposalId: "confirmation",
      address: "0x0000000000000000000000000000000000000003",
      chainId: 1,
    });

    expect(queryIndex).toHaveBeenCalledTimes(1);
    expect(proposal).toMatchObject({
      id: "confirmation",
    });
    expect(proposal.wasChallenged).toBeUndefined();
    expect(proposal.challengedProposalId).toBeUndefined();
  });

  it("lists proposals from DTF governances and derives vote state", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi
      .fn()
      .mockResolvedValueOnce({
        dtf: {
          ownerGovernance: {
            id: "0x0000000000000000000000000000000000000001",
          },
          tradingGovernance: {
            id: "0x0000000000000000000000000000000000000001",
          },
          legacyAdmins: ["0x0000000000000000000000000000000000000004"],
          legacyAuctionApprovers: [],
          stToken: {
            governance: {
              id: "0x0000000000000000000000000000000000000003",
            },
            legacyGovernance: ["0x0000000000000000000000000000000000000005"],
          },
        },
      })
      .mockResolvedValueOnce({
        governances: [
          {
            id: "0x0000000000000000000000000000000000000001",
            proposalCount: "1",
            proposals: [
              createProposalSummary({
                id: "older",
                creationTime: "999000",
                state: "PENDING",
                forWeightedVotes: "2000000000000000000",
                abstainWeightedVotes: "2000000000000000000",
                againstWeightedVotes: "1000000000000000000",
                quorumVotes: "3000000000000000000",
                voteStart: "999900",
                voteEnd: "1000100",
                creationBlock: "10",
                proposer: "0x0000000000000000000000000000000000000002",
                governance: "0x0000000000000000000000000000000000000001",
                timelock: "0x0000000000000000000000000000000000000008",
              }),
            ],
          },
          {
            id: "0x0000000000000000000000000000000000000003",
            proposalCount: "1",
            proposals: [
              createProposalSummary({
                id: "newer",
                creationTime: "999500",
                state: "ACTIVE",
                forWeightedVotes: "1000000000000000000",
                abstainWeightedVotes: "0",
                againstWeightedVotes: "0",
                quorumVotes: "2000000000000000000",
                voteStart: "999000",
                voteEnd: "999900",
                creationBlock: "11",
                proposer: "0x0000000000000000000000000000000000000006",
                governance: "0x0000000000000000000000000000000000000003",
                timelock: "0x0000000000000000000000000000000000000009",
              }),
            ],
          },
        ],
      });
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposals = await getProposals(client, {
      address: "0x0000000000000000000000000000000000000007",
      chainId: 1,
    });

    expect(queryIndex).toHaveBeenCalledTimes(2);
    expect(queryIndex).toHaveBeenNthCalledWith(1, {
      chainId: 1,
      query: expect.anything(),
      variables: {
        dtfId: "0x0000000000000000000000000000000000000007",
      },
    });
    expect(queryIndex).toHaveBeenNthCalledWith(2, {
      chainId: 1,
      query: expect.anything(),
      variables: {
        governanceIds: [
          "0x0000000000000000000000000000000000000001",
          "0x0000000000000000000000000000000000000003",
          "0x0000000000000000000000000000000000000004",
          "0x0000000000000000000000000000000000000005",
        ],
        limit: 100,
      },
    });
    expect(proposals.map((proposal) => proposal.id)).toEqual(["newer", "older"]);
    expect(proposals[0]).toMatchObject({
      id: "newer",
      state: "QUORUM_NOT_REACHED",
      dtf: {
        address: "0x0000000000000000000000000000000000000007",
        chainId: 1,
      },
      votingState: {
        state: "QUORUM_NOT_REACHED",
        deadline: null,
        quorum: false,
        forVotesReachedQuorum: false,
        participationQuorumReached: false,
        for: 100,
        against: 0,
        abstain: 0,
      },
    });
    expect(proposals[1]).toMatchObject({
      id: "older",
      state: "ACTIVE",
      votingState: {
        state: "ACTIVE",
        deadline: 100,
        quorum: false,
        forVotesReachedQuorum: false,
        participationQuorumReached: true,
        for: 40,
        against: 20,
        abstain: 40,
      },
    });
  });

  it("lists proposals from provided governance addresses without fetching DTF context", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      governances: [
        {
          id: "0x0000000000000000000000000000000000000001",
          proposalCount: "1",
          proposals: [
            createProposalSummary({
              id: "known-governor-proposal",
              description: "Known governor proposal",
              creationTime: "999000",
              state: "PENDING",
              forWeightedVotes: "0",
              abstainWeightedVotes: "0",
              againstWeightedVotes: "0",
              quorumVotes: "1000000000000000000",
              voteStart: "999900",
              voteEnd: "1000100",
              creationBlock: "10",
              proposer: "0x0000000000000000000000000000000000000002",
              governance: "0x0000000000000000000000000000000000000001",
              timelock: "0x0000000000000000000000000000000000000008",
            }),
          ],
        },
      ],
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposals = await getProposals(client, {
      address: "0x0000000000000000000000000000000000000007",
      chainId: 1,
      governanceAddresses: ["0x0000000000000000000000000000000000000001"],
    });

    expect(queryIndex).toHaveBeenCalledTimes(1);
    expect(queryIndex).toHaveBeenCalledWith({
      chainId: 1,
      query: expect.anything(),
      variables: {
        governanceIds: ["0x0000000000000000000000000000000000000001"],
        limit: 100,
      },
    });
    expect(proposals[0]).toMatchObject({
      id: "known-governor-proposal",
      dtf: {
        address: "0x0000000000000000000000000000000000000007",
        chainId: 1,
      },
      state: "ACTIVE",
    });
  });

  it("returns total proposal count separately from the limited proposal list", async () => {
    const queryIndex = vi.fn(async () => ({
      governances: [
        {
          id: "0x0000000000000000000000000000000000000001",
          proposalCount: "123",
          proposals: [],
        },
      ],
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposalList = await getProposalList(client, {
      chainId: 1,
      governanceAddresses: ["0x0000000000000000000000000000000000000001"],
      limit: 10,
    });

    expect(proposalList).toEqual({
      proposals: [],
      proposalCount: 123,
    });
  });

  it("uses indexed optimistic veto threshold votes", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      governances: [
        {
          id: "0x0000000000000000000000000000000000000001",
          proposalCount: "1",
          proposals: [
            createProposalSummary({
              id: "optimistic-ended",
              creationTime: "998000",
              state: "ACTIVE",
              forWeightedVotes: "0",
              abstainWeightedVotes: "0",
              againstWeightedVotes: "100000000000000000000",
              quorumVotes: "1000000000000000000",
              voteStart: "998000",
              voteEnd: "999000",
              creationBlock: "10",
              proposer: "0x0000000000000000000000000000000000000002",
              governance: "0x0000000000000000000000000000000000000001",
              timelock: "0x0000000000000000000000000000000000000008",
              isOptimistic: true,
              vetoThreshold: "500000000000000000",
              vetoThresholdVotes: "1000000000000000000",
              optimisticSnapshot: "998000",
              optimisticSnapshotSupply: "2000000000000000000",
            }),
          ],
        },
      ],
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposals = await getProposals(client, {
      chainId: 1,
      governanceAddresses: "0x0000000000000000000000000000000000000001",
    });

    expect(proposals[0]).toMatchObject({
      id: "optimistic-ended",
      isOptimistic: true,
      vetoThreshold: 500000000000000000n,
      state: "DEFEATED",
      votingState: {
        state: "DEFEATED",
        quorum: true,
        vetoReached: true,
        against: 10000,
      },
    });
  });

  it("shows ended optimistic proposals with no veto votes as succeeded before queue", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      governances: [
        {
          id: "0x0000000000000000000000000000000000000001",
          proposalCount: "1",
          proposals: [
            createProposalSummary({
              id: "optimistic-ended-no-veto",
              creationTime: "998000",
              state: "ACTIVE",
              forWeightedVotes: "0",
              abstainWeightedVotes: "0",
              againstWeightedVotes: "0",
              quorumVotes: "1000000000000000000",
              voteStart: "998000",
              voteEnd: "999000",
              creationBlock: "10",
              proposer: "0x0000000000000000000000000000000000000002",
              governance: "0x0000000000000000000000000000000000000001",
              timelock: "0x0000000000000000000000000000000000000008",
              isOptimistic: true,
              vetoThreshold: "500000000000000000",
              vetoThresholdVotes: "1000000000000000000",
              optimisticSnapshot: "998000",
              optimisticSnapshotSupply: "2000000000000000000",
            }),
          ],
        },
      ],
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposals = await getProposals(client, {
      chainId: 1,
      governanceAddresses: "0x0000000000000000000000000000000000000001",
    });

    expect(proposals[0]).toMatchObject({
      id: "optimistic-ended-no-veto",
      isOptimistic: true,
      state: "SUCCEEDED",
      votingState: {
        state: "SUCCEEDED",
        quorum: false,
        vetoReached: false,
      },
    });
  });

  it("marks normal proposals created after a challenged optimistic proposal", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      governances: [
        {
          id: "0x0000000000000000000000000000000000000001",
          proposalCount: "3",
          proposals: [
            createProposalSummary({
              id: "100000000000000000000000000000000000000000000000000000000000000000000000000002",
              description: "Confirmation For: Same proposal",
              creationTime: "999100",
              state: "ACTIVE",
              forWeightedVotes: "0",
              abstainWeightedVotes: "0",
              againstWeightedVotes: "0",
              quorumVotes: "1000000000000000000",
              voteStart: "999000",
              voteEnd: "1000100",
              creationBlock: "11",
              proposer: "0x0000000000000000000000000000000000000002",
              governance: "0x0000000000000000000000000000000000000001",
              timelock: "0x0000000000000000000000000000000000000008",
              isOptimistic: false,
            }),
            createProposalSummary({
              id: "100000000000000000000000000000000000000000000000000000000000000000000000000001",
              description: "Same proposal",
              creationTime: "999000",
              state: "ACTIVE",
              forWeightedVotes: "0",
              abstainWeightedVotes: "0",
              againstWeightedVotes: "100000000000000000000",
              quorumVotes: "1000000000000000000",
              voteStart: "998900",
              voteEnd: "1000000",
              creationBlock: "10",
              proposer: "0x0000000000000000000000000000000000000002",
              governance: "0x0000000000000000000000000000000000000001",
              timelock: "0x0000000000000000000000000000000000000008",
              isOptimistic: true,
              vetoThreshold: "1000000000000000000",
              vetoThresholdVotes: "1000000000000000000",
              optimisticSnapshot: "998900",
              optimisticSnapshotSupply: "1000000000000000000",
            }),
            createProposalSummary({
              id: "100000000000000000000000000000000000000000000000000000000000000000000000000003",
              description: "Same",
              creationTime: "998900",
              state: "ACTIVE",
              forWeightedVotes: "0",
              abstainWeightedVotes: "0",
              againstWeightedVotes: "100000000000000000000",
              quorumVotes: "1000000000000000000",
              voteStart: "998800",
              voteEnd: "1000000",
              creationBlock: "9",
              proposer: "0x0000000000000000000000000000000000000002",
              governance: "0x0000000000000000000000000000000000000001",
              timelock: "0x0000000000000000000000000000000000000008",
              isOptimistic: true,
              vetoThreshold: "1000000000000000000",
              vetoThresholdVotes: "1000000000000000000",
              optimisticSnapshot: "998800",
              optimisticSnapshotSupply: "1000000000000000000",
            }),
          ],
        },
      ],
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposals = await getProposals(client, {
      chainId: 1,
      governanceAddresses: "0x0000000000000000000000000000000000000001",
    });

    expect(proposals[0]).toMatchObject({
      id: "100000000000000000000000000000000000000000000000000000000000000000000000000002",
      isOptimistic: false,
      wasChallenged: true,
      challengedProposalId: "100000000000000000000000000000000000000000000000000000000000000000000000000001",
    });
    expect(proposals[1]).toMatchObject({
      id: "100000000000000000000000000000000000000000000000000000000000000000000000000001",
      isOptimistic: true,
    });
  });

  it("does not mark challenge confirmations without a matching optimistic proposal id", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      governances: [
        {
          id: "0x0000000000000000000000000000000000000001",
          proposalCount: "1",
          proposals: [
            createProposalSummary({
              id: "100000000000000000000000000000000000000000000000000000000000000000000000000002",
              description: "Confirmation For: Missing optimistic proposal",
              creationTime: "999100",
              state: "ACTIVE",
              forWeightedVotes: "0",
              abstainWeightedVotes: "0",
              againstWeightedVotes: "0",
              quorumVotes: "1000000000000000000",
              voteStart: "999000",
              voteEnd: "1000100",
              creationBlock: "11",
              proposer: "0x0000000000000000000000000000000000000002",
              governance: "0x0000000000000000000000000000000000000001",
              timelock: "0x0000000000000000000000000000000000000008",
              isOptimistic: false,
            }),
          ],
        },
      ],
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposals = await getProposals(client, {
      chainId: 1,
      governanceAddresses: "0x0000000000000000000000000000000000000001",
    });

    expect(proposals[0]).toMatchObject({
      id: "100000000000000000000000000000000000000000000000000000000000000000000000000002",
      isOptimistic: false,
    });
    expect(proposals[0]?.wasChallenged).toBeUndefined();
    expect(proposals[0]?.challengedProposalId).toBeUndefined();
  });

  it("lists all chain proposals with state filters", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const queryIndex = vi.fn(async () => ({
      proposals: [
        createProposalSummary({
          id: "100000000000000000000000000000000000000000000000000000000000000000000000000001",
          creationTime: "999000",
          state: "QUEUED",
          forWeightedVotes: "2000000000000000000",
          abstainWeightedVotes: "1000000000000000000",
          againstWeightedVotes: "0",
          quorumVotes: "2000000000000000000",
          voteStart: "998000",
          voteEnd: "999000",
          creationBlock: "10",
          proposer: "0x0000000000000000000000000000000000000002",
          governance: "0x0000000000000000000000000000000000000001",
          timelock: "0x0000000000000000000000000000000000000008",
          isOptimistic: true,
          vetoThreshold: "1000000000000000000",
          vetoThresholdVotes: "2000000000000000000",
          optimisticSnapshot: "998000",
          optimisticSnapshotSupply: "2000000000000000000",
        }),
      ],
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposals = await getAllProposals(client, {
      chainId: 1,
      limit: 25,
      offset: 50,
      states: ["QUEUED"],
    });

    expect(queryIndex).toHaveBeenCalledWith({
      chainId: 1,
      query: expect.anything(),
      variables: {
        limit: 25,
        offset: 50,
        where: { state_in: ["QUEUED"] },
      },
    });
    expect(proposals[0]).toMatchObject({
      id: "100000000000000000000000000000000000000000000000000000000000000000000000000001",
      governance: "0x0000000000000000000000000000000000000001",
      timelock: "0x0000000000000000000000000000000000000008",
      state: "QUEUED",
      isOptimistic: true,
      vetoThreshold: 1000000000000000000n,
    });
  });
});

function createProposalSummary({
  id,
  description = `${id} proposal`,
  creationTime,
  state,
  forWeightedVotes,
  abstainWeightedVotes,
  againstWeightedVotes,
  quorumVotes,
  voteStart,
  voteEnd,
  creationBlock,
  proposer,
  governance,
  timelock,
  isOptimistic,
  vetoThreshold,
  vetoThresholdVotes,
  optimisticSnapshot,
  optimisticSnapshotSupply,
}: {
  readonly id: string;
  readonly description?: string;
  readonly creationTime: string;
  readonly state: string;
  readonly forWeightedVotes: string;
  readonly abstainWeightedVotes: string;
  readonly againstWeightedVotes: string;
  readonly quorumVotes: string;
  readonly voteStart: string;
  readonly voteEnd: string;
  readonly creationBlock: string;
  readonly proposer: string;
  readonly governance: string;
  readonly timelock: string;
  readonly isOptimistic?: boolean;
  readonly vetoThreshold?: string;
  readonly vetoThresholdVotes?: string;
  readonly optimisticSnapshot?: string;
  readonly optimisticSnapshotSupply?: string;
}) {
  return {
    id,
    description,
    creationTime,
    state,
    forWeightedVotes,
    abstainWeightedVotes,
    againstWeightedVotes,
    executionETA: null,
    executionTime: null,
    isOptimistic,
    vetoThreshold,
    vetoThresholdVotes,
    optimisticSnapshot,
    optimisticSnapshotSupply,
    quorumVotes,
    voteStart,
    voteEnd,
    executionBlock: null,
    creationBlock,
    proposer: {
      address: proposer,
    },
    governance: {
      id: governance,
      token: {
        id: governance,
      },
      timelock: {
        id: timelock,
      },
    },
  };
}
