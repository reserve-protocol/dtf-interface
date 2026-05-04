import { afterEach, describe, expect, it, vi } from "vitest";
import { encodeFunctionData } from "viem";
import type { DtfClient } from "../../client.js";
import { dtfIndexFolioProposalAbi } from "../abis/proposal-decoder.js";
import { buildProposalContractMap, getContractAliases } from "./contract-map.js";
import { getIndexDtfProposal, getIndexDtfProposals } from "./index.js";

describe("Index DTF governance", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps proposal detail and derives Register-compatible voting state", async () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000_000);
    const setMandateCalldata = encodeFunctionData({
      abi: dtfIndexFolioProposalAbi,
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
        timelockId: "timelock-operation",
        description: "Proposal description",
        creationTime: "999000",
        voteStart: "999900",
        voteEnd: "1000100",
        queueBlock: null,
        queueTime: null,
        state: "PENDING",
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

    const proposal = await getIndexDtfProposal(client, {
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
      dtf: {
        address: "0x0000000000000000000000000000000000000003",
        chainId: 1,
      },
      proposer: "0x0000000000000000000000000000000000000002",
      description: "Proposal description",
      state: "ACTIVE",
      creationTime: 999000,
      creationBlock: 123,
      voteStart: 999900,
      voteEnd: 1000100,
      timelockId: "timelock-operation",
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
    expect(proposal.calldatas).toEqual([
      setMandateCalldata,
      "0x1234",
      "0x12345678",
    ]);
    expect(proposal.decoded.calls).toEqual([
      {
        index: 0,
        target: "0x0000000000000000000000000000000000000003",
        contract: "Folio",
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
        contract: "Folio",
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
        contract: "Folio",
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
        contract: "Folio",
        calls: [proposal.decoded.unknownCalls[1]],
      },
    ]);
  });

  it("throws generic record-not-found when proposal is missing", async () => {
    const queryIndex = vi.fn(async () => ({ dtf: null, proposal: null }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    await expect(
      getIndexDtfProposal(client, {
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
            legacyGovernance: [
              "0x0000000000000000000000000000000000000005",
            ],
          },
        },
      })
      .mockResolvedValueOnce({
        governances: [
          {
            id: "0x0000000000000000000000000000000000000001",
            proposalCount: "1",
            proposals: [
              {
                id: "older",
                description: "Older proposal",
                creationTime: "999000",
                state: "PENDING",
                forWeightedVotes: "2000000000000000000",
                abstainWeightedVotes: "2000000000000000000",
                againstWeightedVotes: "1000000000000000000",
                executionETA: null,
                executionTime: null,
                quorumVotes: "3000000000000000000",
                voteStart: "999900",
                voteEnd: "1000100",
                executionBlock: null,
                creationBlock: "10",
                proposer: {
                  address: "0x0000000000000000000000000000000000000002",
                },
                governance: {
                  id: "0x0000000000000000000000000000000000000001",
                },
              },
            ],
          },
          {
            id: "0x0000000000000000000000000000000000000003",
            proposalCount: "1",
            proposals: [
              {
                id: "newer",
                description: "Newer proposal",
                creationTime: "999500",
                state: "ACTIVE",
                forWeightedVotes: "1000000000000000000",
                abstainWeightedVotes: "0",
                againstWeightedVotes: "0",
                executionETA: null,
                executionTime: null,
                quorumVotes: "2000000000000000000",
                voteStart: "999000",
                voteEnd: "999900",
                executionBlock: null,
                creationBlock: "11",
                proposer: {
                  address: "0x0000000000000000000000000000000000000006",
                },
                governance: {
                  id: "0x0000000000000000000000000000000000000003",
                },
              },
            ],
          },
        ],
      });
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposals = await getIndexDtfProposals(client, {
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
    expect(proposals.map((proposal) => proposal.id)).toEqual([
      "newer",
      "older",
    ]);
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
            {
              id: "known-governor-proposal",
              description: "Known governor proposal",
              creationTime: "999000",
              state: "PENDING",
              forWeightedVotes: "0",
              abstainWeightedVotes: "0",
              againstWeightedVotes: "0",
              executionETA: null,
              executionTime: null,
              quorumVotes: "1000000000000000000",
              voteStart: "999900",
              voteEnd: "1000100",
              executionBlock: null,
              creationBlock: "10",
              proposer: {
                address: "0x0000000000000000000000000000000000000002",
              },
              governance: {
                id: "0x0000000000000000000000000000000000000001",
              },
            },
          ],
        },
      ],
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const proposals = await getIndexDtfProposals(client, {
      address: "0x0000000000000000000000000000000000000007",
      chainId: 1,
      governanceAddresses: [
        "0x0000000000000000000000000000000000000001",
      ],
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

  it("labels shared owner and basket governance without losing the timelock", () => {
    const contractMap = buildProposalContractMap({
      chainId: 1,
      dtf: {
        address: "0x0000000000000000000000000000000000000003",
        proxyAdmin: "0x0000000000000000000000000000000000000008",
        legacyAdminGovernance: [],
        legacyTradingGovernance: [],
        ownerGovernance: {
          address: "0x0000000000000000000000000000000000000001",
          timelock: "0x0000000000000000000000000000000000000006",
        },
        tradingGovernance: {
          address: "0x0000000000000000000000000000000000000001",
          timelock: "0x0000000000000000000000000000000000000006",
        },
        stakingToken: {
          address: "0x0000000000000000000000000000000000000007",
          legacyGovernance: [],
        },
      },
    });

    expect(getContractAliases(contractMap)).toMatchObject({
      "0x0000000000000000000000000000000000000001":
        "Owner/Basket Governance",
      "0x0000000000000000000000000000000000000006":
        "Owner/Basket Governance Timelock",
    });
  });
});
