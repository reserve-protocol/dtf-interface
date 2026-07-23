import { BaseError, ContractFunctionRevertedError } from "viem";
import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import {
  getYieldDtfGovernance,
  getYieldDtfProposal,
  getYieldDtfProposals,
  getYieldDtfProposalState,
} from "@/yield-dtf/governance";

const DTF = "0x0000000000000000000000000000000000000001";
const GOVERNOR = "0x0000000000000000000000000000000000000002";
const TIMELOCK = "0x0000000000000000000000000000000000000003";
const GUARDIAN = "0x0000000000000000000000000000000000000004";
const PROPOSER = "0x0000000000000000000000000000000000000005";
const TARGET = "0x0000000000000000000000000000000000000006";

describe("getYieldDtfGovernance", () => {
  it("returns quorum ratio fields from the governor, not stale subgraph values", async () => {
    const multicall = vi.fn(async () => [123n, 45n, 6n, 100n]);
    const readContract = vi.fn(async () => 1_700_000_000n);
    const client = {
      subgraph: {
        queryYield: vi.fn(async () => ({
          rtoken: { owners: [TIMELOCK] },
          governance: {
            proposals: "5",
            proposalsQueued: "2",
            proposalsExecuted: "1",
            proposalsCanceled: "0",
            currentDelegates: "3",
            delegatedVotes: "400",
            totalTokenSupply: "1000",
            guardians: [GUARDIAN],
            governanceFrameworks: [
              {
                id: "framework",
                name: "Governor Anastasius",
                contractAddress: GOVERNOR,
                timelockAddress: TIMELOCK,
                executionDelay: "60",
                votingDelay: "10",
                votingPeriod: "100",
                proposalThreshold: "0",
                quorumVotes: null,
                quorumNumerator: "0",
                quorumDenominator: "0",
              },
            ],
          },
        })),
      },
      viem: {
        getPublicClient: vi.fn(() => ({
          multicall,
          readContract,
          getBlockNumber: vi.fn(async () => 1000n),
        })),
      },
    } as unknown as DtfClient;

    const governance = await getYieldDtfGovernance(client, { address: DTF, chainId: 1 });

    expect(governance.quorum.raw).toBe(123n);
    expect(governance.proposalThreshold.raw).toBe(45n);
    expect(governance.quorumNumerator).toBe(6);
    expect(governance.quorumDenominator).toBe(100);
    expect(readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: GOVERNOR,
        functionName: "clock",
      }),
    );
    expect(multicall).toHaveBeenCalledWith(
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({ functionName: "quorum", args: [1_699_999_900n] }),
          expect.objectContaining({ functionName: "quorumNumerator", args: [1_699_999_900n] }),
        ]),
      }),
    );
  });
});

describe("getYieldDtfProposal", () => {
  it("falls back to the subgraph state for proposals unknown to the current governor", async () => {
    const client = createProposalClient(
      new BaseError("readContract failed", {
        cause: new ContractFunctionRevertedError({
          abi: [],
          functionName: "state",
          message: "Governor: unknown proposal id",
        }),
      }),
    );

    const proposal = await getYieldDtfProposal(client, { chainId: 1, proposalId: "42" });

    expect(proposal.state).toBe("ACTIVE");
  });

  it("rethrows non-unknown-proposal state read failures", async () => {
    const error = new BaseError("RPC request failed");
    const client = createProposalClient(error);

    await expect(getYieldDtfProposal(client, { chainId: 1, proposalId: "42" })).rejects.toBe(error);
  });
});

describe("getYieldDtfProposalState", () => {
  const endedActiveProposal = {
    state: "ACTIVE",
    voteStart: 100,
    voteEnd: 200,
    forWeightedVotes: { raw: 0n, formatted: "0" },
    againstWeightedVotes: { raw: 0n, formatted: "0" },
    abstainWeightedVotes: { raw: 0n, formatted: "0" },
    quorumVotes: { raw: 100n, formatted: "100" },
  } as const;

  it("defeats a tie even when quorum is met", () => {
    expect(
      getYieldDtfProposalState(
        {
          ...endedActiveProposal,
          forWeightedVotes: { raw: 150n, formatted: "150" },
          againstWeightedVotes: { raw: 150n, formatted: "150" },
        },
        201,
      ),
    ).toBe("DEFEATED");
  });

  it("succeeds when for votes are one wei over against votes", () => {
    expect(
      getYieldDtfProposalState(
        {
          ...endedActiveProposal,
          forWeightedVotes: { raw: 151n, formatted: "151" },
          againstWeightedVotes: { raw: 150n, formatted: "150" },
        },
        201,
      ),
    ).toBe("SUCCEEDED");
  });

  it("marks winning votes under quorum as quorum not reached", () => {
    expect(
      getYieldDtfProposalState(
        {
          ...endedActiveProposal,
          forWeightedVotes: { raw: 50n, formatted: "50" },
          againstWeightedVotes: { raw: 10n, formatted: "10" },
        },
        201,
      ),
    ).toBe("QUORUM_NOT_REACHED");
  });

  it("keeps active proposals active until the vote deadline passes", () => {
    expect(getYieldDtfProposalState(endedActiveProposal, 200)).toBe("ACTIVE");
  });

  it("activates lagging pending proposals within the vote window", () => {
    const pending = { ...endedActiveProposal, state: "PENDING" } as const;

    expect(getYieldDtfProposalState(pending, 50)).toBe("PENDING");
    expect(getYieldDtfProposalState(pending, 100)).toBe("PENDING");
    expect(getYieldDtfProposalState(pending, 150)).toBe("ACTIVE");
    expect(getYieldDtfProposalState(pending, 200)).toBe("ACTIVE");
  });

  it("derives the vote outcome for stale pending proposals past the deadline, never EXPIRED", () => {
    const pending = { ...endedActiveProposal, state: "PENDING" } as const;

    expect(
      getYieldDtfProposalState(
        {
          ...pending,
          forWeightedVotes: { raw: 151n, formatted: "151" },
          againstWeightedVotes: { raw: 50n, formatted: "50" },
        },
        201,
      ),
    ).toBe("SUCCEEDED");
    expect(
      getYieldDtfProposalState(
        {
          ...pending,
          forWeightedVotes: { raw: 150n, formatted: "150" },
          againstWeightedVotes: { raw: 150n, formatted: "150" },
        },
        201,
      ),
    ).toBe("DEFEATED");
    expect(
      getYieldDtfProposalState(
        {
          ...pending,
          forWeightedVotes: { raw: 50n, formatted: "50" },
          againstWeightedVotes: { raw: 10n, formatted: "10" },
        },
        201,
      ),
    ).toBe("QUORUM_NOT_REACHED");
  });

  it("keeps terminal states untouched", () => {
    expect(getYieldDtfProposalState({ ...endedActiveProposal, state: "EXECUTED" }, 201)).toBe("EXECUTED");
  });
});

describe("getYieldDtfProposals", () => {
  it("derives timestamp-based proposals from the chain block timestamp, not the local clock", async () => {
    // voteEnd is ~year 2286 by the machine's wall clock, but the chain says
    // the deadline already passed — the chain must win.
    const getBlock = vi.fn(async () => ({ number: 1_000n, timestamp: 20_000_000_000n }));
    const client = createProposalsClient(
      [
        createSubgraphProposal({
          id: "tie",
          state: "ACTIVE",
          forWeightedVotes: "150",
          againstWeightedVotes: "150",
          endBlock: "9999999999",
        }),
      ],
      getBlock,
    );

    const [proposal] = await getYieldDtfProposals(client, { address: DTF, chainId: 1 });

    expect(proposal!.state).toBe("DEFEATED");
    expect(getBlock).toHaveBeenCalledTimes(1);
  });

  it("resolves lagging block-based proposals against the chain block number", async () => {
    const getBlock = vi.fn(async () => ({ number: 1_000n, timestamp: 1_000_000n }));
    const client = createProposalsClient(
      [
        createSubgraphProposal({
          id: "succeeded",
          state: "ACTIVE",
          governorName: "Governor Alexios",
          forWeightedVotes: "150",
          againstWeightedVotes: "10",
          endBlock: "999",
        }),
        createSubgraphProposal({
          id: "still-active",
          state: "ACTIVE",
          governorName: "Governor Alexios",
          forWeightedVotes: "150",
          againstWeightedVotes: "10",
          endBlock: "1001",
        }),
      ],
      getBlock,
    );

    const proposals = await getYieldDtfProposals(client, { address: DTF, chainId: 1 });

    expect(proposals.map((proposal) => proposal.state)).toEqual(["SUCCEEDED", "ACTIVE"]);
    expect(getBlock).toHaveBeenCalledTimes(1);
  });

  it("derives mixed governor flavors in one list from a single chain read", async () => {
    const getBlock = vi.fn(async () => ({ number: 1_000n, timestamp: 1_000_000n }));
    const client = createProposalsClient(
      [
        createSubgraphProposal({
          id: "anastasius-tie",
          state: "ACTIVE",
          forWeightedVotes: "150",
          againstWeightedVotes: "150",
          endBlock: "200",
        }),
        createSubgraphProposal({
          id: "alexios-still-active",
          state: "ACTIVE",
          governorName: "Governor Alexios",
          forWeightedVotes: "150",
          againstWeightedVotes: "10",
          endBlock: "1001",
        }),
      ],
      getBlock,
    );

    const proposals = await getYieldDtfProposals(client, { address: DTF, chainId: 1 });

    expect(proposals.map((proposal) => proposal.state)).toEqual(["DEFEATED", "ACTIVE"]);
    expect(getBlock).toHaveBeenCalledTimes(1);
  });

  it("does not read the chain when every proposal is terminal", async () => {
    const getBlock = vi.fn(async () => ({ number: 1_000n, timestamp: 1_000_000n }));
    const client = createProposalsClient(
      [
        createSubgraphProposal({
          id: "executed",
          state: "EXECUTED",
          governorName: "Governor Alexios",
          endBlock: "999",
        }),
      ],
      getBlock,
    );

    const [proposal] = await getYieldDtfProposals(client, { address: DTF, chainId: 1 });

    expect(proposal!.state).toBe("EXECUTED");
    expect(getBlock).not.toHaveBeenCalled();
  });
});

function createSubgraphProposal(overrides: {
  readonly id: string;
  readonly state: string;
  readonly governorName?: string;
  readonly forWeightedVotes?: string;
  readonly againstWeightedVotes?: string;
  readonly endBlock?: string;
}) {
  return {
    id: overrides.id,
    description: "Proposal",
    creationTime: "1000",
    state: overrides.state,
    forWeightedVotes: overrides.forWeightedVotes ?? "0",
    againstWeightedVotes: overrides.againstWeightedVotes ?? "0",
    abstainWeightedVotes: "0",
    quorumVotes: "100",
    startBlock: "100",
    endBlock: overrides.endBlock ?? "200",
    executionETA: null,
    proposer: { address: PROPOSER },
    governanceFramework: {
      name: overrides.governorName ?? "Governor Anastasius",
      contractAddress: GOVERNOR,
    },
  };
}

function createProposalsClient(
  proposals: readonly ReturnType<typeof createSubgraphProposal>[],
  getBlock: () => Promise<{ number: bigint; timestamp: bigint }>,
): DtfClient {
  return {
    subgraph: {
      queryYield: vi.fn(async () => ({ proposals })),
    },
    viem: {
      getPublicClient: vi.fn(() => ({ getBlock })),
    },
  } as unknown as DtfClient;
}

function createProposalClient(readError: Error): DtfClient {
  return {
    subgraph: {
      queryYield: vi.fn(async () => ({
        proposal: {
          id: "42",
          txnHash: "0xabc",
          description: "Proposal",
          creationTime: "1000",
          creationBlock: "900",
          state: "ACTIVE",
          forWeightedVotes: "1",
          againstWeightedVotes: "2",
          abstainWeightedVotes: "3",
          quorumVotes: "4",
          forDelegateVotes: "1",
          againstDelegateVotes: "2",
          abstainDelegateVotes: "3",
          startBlock: "100",
          endBlock: "200",
          queueTime: null,
          queueTxnHash: null,
          executionETA: null,
          executionTime: null,
          executionTxnHash: null,
          cancellationTime: null,
          targets: [TARGET],
          calldatas: ["0x1234"],
          proposer: { address: PROPOSER },
          votes: [],
          governanceFramework: {
            name: "Governor Anastasius",
            contractAddress: GOVERNOR,
            timelockAddress: TIMELOCK,
          },
        },
      })),
    },
    viem: {
      readContract: vi.fn(async () => {
        throw readError;
      }),
    },
  } as unknown as DtfClient;
}
