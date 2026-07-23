import { BaseError, ContractFunctionRevertedError, getAddress, type Address, type Hex } from "viem";

import type { DtfClient } from "@/client";
import type { ContractCall } from "@/lib/contract-call";
import type {
  YieldDtfGovernance,
  YieldDtfParams,
  YieldDtfProposalDetail,
  YieldDtfProposalState,
  YieldDtfProposalSummary,
  YieldDtfVoterState,
} from "@/types/yield-dtf";

import { SdkError } from "@/lib/errors";
import {
  getGovernorTimelockOperationIdV4,
  prepareGovernorCancel,
  prepareGovernorExecute,
  prepareGovernorPropose,
  prepareGovernorQueue,
  prepareGovernorVote,
  prepareGovernorVoteWithReason,
  prepareTimelockCancel,
  type GovernorProposalPayload,
} from "@/lib/governor-calls";
import { mapAmount, sameAddress } from "@/lib/utils";
import { yieldGovernanceAbi } from "@/yield-dtf/abis/governance";
import { yieldGovernanceAnastasiusAbi } from "@/yield-dtf/abis/governance-anastasius";
import { stRsrVotesAbi } from "@/yield-dtf/abis/st-rsr-votes";
import { type YieldDtfChainId } from "@/yield-dtf/config";
import {
  GetYieldDtfGovernanceDocument,
  GetYieldDtfProposalDocument,
  GetYieldDtfProposalsDocument,
  type GetYieldDtfProposalQuery,
  type GetYieldDtfProposalsQuery,
} from "@/yield-dtf/subgraph/yield.generated";

// OZ ProposalState enum order, shared by both governor flavors.
const PROPOSAL_STATES = [
  "PENDING",
  "ACTIVE",
  "CANCELED",
  "DEFEATED",
  "SUCCEEDED",
  "QUEUED",
  "EXPIRED",
  "EXECUTED",
] as const;

export function isTimepointGovernor(name: string): boolean {
  return name === "Governor Anastasius";
}

/**
 * Reads governance settings for a Yield DTF. The active framework is the one
 * whose timelock holds the OWNER role. Anastasius (timepoint-based) governors
 * report quorum/threshold on-chain because the subgraph values go stale.
 */
export async function getYieldDtfGovernance(client: DtfClient, params: YieldDtfParams): Promise<YieldDtfGovernance> {
  const address = getAddress(params.address);
  const { rtoken, governance } = await client.subgraph.queryYield({
    chainId: params.chainId,
    query: GetYieldDtfGovernanceDocument,
    variables: { id: address.toLowerCase() },
  });

  if (!governance || governance.governanceFrameworks.length === 0) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Yield DTF governance not found: ${address} on chain ${params.chainId}`,
      meta: { chainId: params.chainId, entity: "yieldDtfGovernance", address },
    });
  }

  const owners = rtoken?.owners ?? [];
  const framework =
    governance.governanceFrameworks.find((candidate) =>
      owners.some((owner) => sameAddress(owner, candidate.timelockAddress)),
    ) ?? governance.governanceFrameworks[0]!;
  const governor = getAddress(framework.contractAddress);
  const isTimepointBased = isTimepointGovernor(framework.name);

  // Quorum and threshold always come from the governor: the subgraph stores
  // quorumVotes as null for most Alexios frameworks and proposalThreshold in
  // micro-percent — on-chain both are actual vote amounts for both flavors.
  // Anastasius timepoints are timestamps, Alexios are block numbers; slightly
  // in the past to avoid future-lookup reverts.
  const publicClient = client.viem.getPublicClient(params.chainId);
  const timepoint = isTimepointBased
    ? BigInt(
        await publicClient.readContract({
          address: governor,
          abi: yieldGovernanceAnastasiusAbi,
          functionName: "clock",
        }),
      ) - 100n
    : (await publicClient.getBlockNumber()) - 5n;
  const [quorumVotes, thresholdVotes, quorumNumerator, quorumDenominator] = await publicClient.multicall({
    allowFailure: false,
    contracts: [
      { address: governor, abi: yieldGovernanceAnastasiusAbi, functionName: "quorum", args: [timepoint] },
      { address: governor, abi: yieldGovernanceAnastasiusAbi, functionName: "proposalThreshold" },
      { address: governor, abi: yieldGovernanceAnastasiusAbi, functionName: "quorumNumerator", args: [timepoint] },
      { address: governor, abi: yieldGovernanceAnastasiusAbi, functionName: "quorumDenominator" },
    ],
  });
  const quorum = mapAmount(quorumVotes);
  const proposalThreshold = mapAmount(thresholdVotes);

  return {
    governor,
    name: framework.name,
    isTimepointBased,
    timelock: getAddress(framework.timelockAddress),
    guardians: governance.guardians.map((guardian) => getAddress(guardian)),
    votingDelay: Number(framework.votingDelay),
    votingPeriod: Number(framework.votingPeriod),
    executionDelay: Number(framework.executionDelay),
    proposalThreshold,
    quorum,
    quorumNumerator: Number(quorumNumerator),
    quorumDenominator: Number(quorumDenominator),
    stats: {
      proposals: Number(governance.proposals),
      proposalsExecuted: Number(governance.proposalsExecuted),
      proposalsQueued: Number(governance.proposalsQueued),
      proposalsCanceled: Number(governance.proposalsCanceled),
      currentDelegates: Number(governance.currentDelegates),
      delegatedVotes: Number(governance.delegatedVotes),
    },
  };
}

export type GetYieldDtfProposalsParams = YieldDtfParams & {
  readonly limit?: number;
  readonly offset?: number;
};

export async function getYieldDtfProposals(
  client: DtfClient,
  params: GetYieldDtfProposalsParams,
): Promise<readonly YieldDtfProposalSummary[]> {
  const { proposals } = await client.subgraph.queryYield({
    chainId: params.chainId,
    query: GetYieldDtfProposalsDocument,
    variables: {
      governanceId: getAddress(params.address).toLowerCase(),
      limit: params.limit ?? 50,
      offset: params.offset ?? 0,
    },
  });

  const summaries = proposals.map((proposal) => mapProposalSummary(proposal, params.chainId));
  // One latest block serves both clock domains (timestamp for Anastasius,
  // number for Alexios), fetched once per request. Vote totals remain indexed,
  // so list state is eventually consistent near the deadline; detail reads the
  // authoritative governor state.
  const needsTimepoint = summaries.some((summary) => summary.state === "PENDING" || summary.state === "ACTIVE");
  const block = needsTimepoint ? await client.viem.getPublicClient(params.chainId).getBlock() : undefined;

  return summaries.map((summary) => ({
    ...summary,
    state: block
      ? getYieldDtfProposalState(
          summary,
          isTimepointGovernor(summary.governorName) ? Number(block.timestamp) : Number(block.number),
        )
      : summary.state,
  }));
}

/**
 * Derives the summary display state without an on-chain read. The subgraph
 * state is event-driven and lags time-based transitions (PENDING -> ACTIVE,
 * ACTIVE -> DEFEATED/QUORUM_NOT_REACHED/SUCCEEDED). `currentTimepoint` must be
 * in the proposal's native unit: unix seconds for Anastasius, block number for
 * Alexios.
 */
export function getYieldDtfProposalState(
  proposal: Pick<
    YieldDtfProposalSummary,
    | "abstainWeightedVotes"
    | "againstWeightedVotes"
    | "forWeightedVotes"
    | "quorumVotes"
    | "state"
    | "voteEnd"
    | "voteStart"
  >,
  currentTimepoint: number,
): YieldDtfProposalState {
  if (proposal.state !== "PENDING" && proposal.state !== "ACTIVE") {
    return proposal.state;
  }

  if (currentTimepoint <= proposal.voteEnd) {
    if (proposal.state === "PENDING") {
      return currentTimepoint > proposal.voteStart ? "ACTIVE" : "PENDING";
    }

    return "ACTIVE";
  }

  // WHY: past the deadline OZ Governor.state() derives Succeeded/Defeated from
  // the vote counts regardless of whether an ACTIVE transition was ever
  // indexed — a stale PENDING is never EXPIRED (that is a queue-lifecycle
  // state the subgraph reports directly).

  // WHY: OZ GovernorCountingSimple._voteSucceeded requires forVotes STRICTLY
  // over againstVotes (Reserve's Governance.sol keeps it) — a tie is defeated.
  if (proposal.forWeightedVotes.raw <= proposal.againstWeightedVotes.raw) {
    return "DEFEATED";
  }

  if (proposal.forWeightedVotes.raw + proposal.abstainWeightedVotes.raw < proposal.quorumVotes.raw) {
    return "QUORUM_NOT_REACHED";
  }

  return "SUCCEEDED";
}

export type GetYieldDtfProposalParams = {
  readonly chainId: YieldDtfChainId;
  readonly proposalId: string;
};

/**
 * Reads a proposal with its authoritative on-chain state. The subgraph state
 * lags time-based transitions (ACTIVE -> DEFEATED/SUCCEEDED), so the governor
 * is the source of truth.
 */
export async function getYieldDtfProposal(
  client: DtfClient,
  params: GetYieldDtfProposalParams,
): Promise<YieldDtfProposalDetail> {
  const { proposal } = await client.subgraph.queryYield({
    chainId: params.chainId,
    query: GetYieldDtfProposalDocument,
    variables: { id: params.proposalId },
  });

  if (!proposal) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Yield DTF proposal not found: ${params.proposalId} on chain ${params.chainId}`,
      meta: { chainId: params.chainId, entity: "yieldDtfProposal", id: params.proposalId },
    });
  }

  const summary = mapProposalSummary(proposal, params.chainId);
  const onChainState = await readProposalState(client, params.chainId, summary.governor, proposal.id);

  return {
    ...summary,
    state: onChainState ?? summary.state,
    txnHash: proposal.txnHash,
    creationBlock: Number(proposal.creationBlock),
    forDelegateVotes: Number(proposal.forDelegateVotes),
    againstDelegateVotes: Number(proposal.againstDelegateVotes),
    abstainDelegateVotes: Number(proposal.abstainDelegateVotes),
    ...(proposal.queueTime ? { queueTime: Number(proposal.queueTime) } : {}),
    ...(proposal.queueTxnHash ? { queueTxnHash: proposal.queueTxnHash } : {}),
    ...(proposal.executionTime ? { executionTime: Number(proposal.executionTime) } : {}),
    ...(proposal.executionTxnHash ? { executionTxnHash: proposal.executionTxnHash } : {}),
    ...(proposal.cancellationTime ? { cancellationTime: Number(proposal.cancellationTime) } : {}),
    timelock: getAddress(proposal.governanceFramework!.timelockAddress),
    targets: (proposal.targets ?? []).map((target) => getAddress(target)),
    calldatas: (proposal.calldatas ?? []) as readonly Hex[],
    votes: proposal.votes.map((vote) => ({
      voter: getAddress(vote.voter.address),
      choice: vote.choice,
      weight: mapAmount(vote.weight),
    })),
  };
}

export type GetYieldDtfVoterStateParams = {
  readonly chainId: YieldDtfChainId;
  readonly stToken: Address;
  readonly account: Address;
};

/** Current voting power and delegation from the StRSRVotes token. */
export async function getYieldDtfVoterState(
  client: DtfClient,
  params: GetYieldDtfVoterStateParams,
): Promise<YieldDtfVoterState> {
  const stToken = getAddress(params.stToken);
  const account = getAddress(params.account);
  const [votingPower, delegate, balance] = await client.viem.getPublicClient(params.chainId).multicall({
    allowFailure: false,
    contracts: [
      { address: stToken, abi: stRsrVotesAbi, functionName: "getVotes", args: [account] },
      { address: stToken, abi: stRsrVotesAbi, functionName: "delegates", args: [account] },
      { address: stToken, abi: stRsrVotesAbi, functionName: "balanceOf", args: [account] },
    ],
  });

  return {
    account,
    votingPower: mapAmount(votingPower),
    delegate: getAddress(delegate),
    isSelfDelegated: sameAddress(delegate, account),
    stTokenBalance: mapAmount(balance),
  };
}

export type GetYieldDtfProposalVotePowerParams = {
  readonly chainId: YieldDtfChainId;
  readonly governor: Address;
  readonly account: Address;
  /** Proposal voteStart timepoint (seconds for Anastasius, block for Alexios). */
  readonly voteStart: number;
  readonly isTimepointBased: boolean;
};

/** Voting power for a specific proposal, read at the proposal snapshot. */
export async function getYieldDtfProposalVotePower(
  client: DtfClient,
  params: GetYieldDtfProposalVotePowerParams,
): Promise<bigint> {
  const publicClient = client.viem.getPublicClient(params.chainId);
  const governor = getAddress(params.governor);
  const current = params.isTimepointBased
    ? Number(
        await publicClient.readContract({
          address: governor,
          abi: yieldGovernanceAnastasiusAbi,
          functionName: "clock",
        }),
      )
    : Number(await publicClient.getBlockNumber());
  const snapshot = BigInt(Math.max(Math.min(params.voteStart - 1, current - 1), 0));

  return publicClient.readContract({
    address: governor,
    abi: yieldGovernanceAbi,
    functionName: "getVotes",
    args: [getAddress(params.account), snapshot],
  });
}

export type YieldDtfVoteParams = {
  readonly chainId: YieldDtfChainId;
  readonly governor: Address;
  readonly proposalId: bigint | string;
  readonly support: number;
  readonly reason?: string;
};

export function prepareYieldDtfVote(params: YieldDtfVoteParams): ContractCall {
  if (params.reason !== undefined) {
    return prepareGovernorVoteWithReason({ ...params, reason: params.reason });
  }

  return prepareGovernorVote(params);
}

export type YieldDtfProposalActionParams = {
  readonly chainId: YieldDtfChainId;
  readonly proposal: GovernorProposalPayload;
};

export function prepareYieldDtfQueueProposal(params: YieldDtfProposalActionParams): ContractCall {
  return prepareGovernorQueue(params);
}

export function prepareYieldDtfExecuteProposal(params: YieldDtfProposalActionParams): ContractCall {
  return prepareGovernorExecute(params);
}

/** Proposer cancellation via the governor (only while PENDING). */
export function prepareYieldDtfCancelProposal(params: YieldDtfProposalActionParams): ContractCall {
  return prepareGovernorCancel(params);
}

/** Guardian cancellation of a QUEUED proposal, straight on the timelock (CANCELLER_ROLE). */
export function prepareYieldDtfTimelockCancelProposal(
  params: YieldDtfProposalActionParams & { readonly timelock: Address },
): ContractCall {
  return prepareTimelockCancel({
    chainId: params.chainId,
    timelock: params.timelock,
    // Yield governors are OZ 4.x: timelock salt is the plain description hash.
    operationId: getGovernorTimelockOperationIdV4(params.proposal),
  });
}

export function prepareYieldDtfSubmitProposal(params: YieldDtfProposalActionParams): ContractCall {
  return prepareGovernorPropose(params);
}

function mapProposalSummary(
  proposal: NonNullable<GetYieldDtfProposalQuery["proposal"]> | GetYieldDtfProposalsQuery["proposals"][number],
  chainId: YieldDtfChainId,
): YieldDtfProposalSummary {
  return {
    id: proposal.id,
    chainId,
    governor: getAddress(proposal.governanceFramework!.contractAddress),
    governorName: proposal.governanceFramework!.name,
    description: proposal.description,
    proposer: getAddress(proposal.proposer.address),
    state: proposal.state as YieldDtfProposalState,
    creationTime: Number(proposal.creationTime),
    voteStart: Number(proposal.startBlock),
    voteEnd: Number(proposal.endBlock),
    ...(proposal.executionETA ? { executionEta: Number(proposal.executionETA) } : {}),
    forWeightedVotes: mapAmount(proposal.forWeightedVotes),
    againstWeightedVotes: mapAmount(proposal.againstWeightedVotes),
    abstainWeightedVotes: mapAmount(proposal.abstainWeightedVotes),
    quorumVotes: mapAmount(proposal.quorumVotes),
  };
}

async function readProposalState(
  client: DtfClient,
  chainId: YieldDtfChainId,
  governor: Address,
  proposalId: string,
): Promise<YieldDtfProposalState | undefined> {
  try {
    const state = await client.viem.readContract({
      address: governor,
      abi: yieldGovernanceAbi,
      functionName: "state",
      args: [BigInt(proposalId)],
      chainId,
    });

    return PROPOSAL_STATES[state];
  } catch (error) {
    // Unknown-proposal reverts happen for proposals that predate the current
    // governor — fall back to the subgraph state. Anything else (RPC down)
    // must not be silently mislabeled as authoritative.
    if (error instanceof BaseError) {
      const revertError = error.walk((cause) => cause instanceof ContractFunctionRevertedError);

      if (
        revertError instanceof ContractFunctionRevertedError &&
        (revertError.data?.errorName === "GovernorNonexistentProposal" ||
          revertError.reason === "Governor: unknown proposal id")
      ) {
        return undefined;
      }
    }

    throw error;
  }
}
