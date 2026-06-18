import { BaseError, ContractFunctionRevertedError } from "viem";
import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { getYieldDtfGovernance, getYieldDtfProposal } from "@/yield-dtf/governance";

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
