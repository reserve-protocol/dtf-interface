import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type {
  GetIndexDtfOptimisticProposalVoterStateParams,
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
  IndexDtfOptimisticProposalVoterState,
  IndexDtfProposalVote,
  IndexDtfProposalVoterState,
  IndexDtfProposalVotes,
  IndexDtfProposerState,
  IndexDtfVoterState,
} from "@/types/governance";

import { dtfIndexGovernanceAbi } from "@/index-dtf/abis/dtf-index-governance";
import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { dtfIndexStakingVaultOptimisticAbi } from "@/index-dtf/abis/dtf-index-staking-vault-optimistic";
import { isUnsupportedVoteLockOptimisticReadError } from "@/index-dtf/governance/optimistic-errors";
import { mapAmount } from "@/lib/utils";

type VotingMulticallResult<T> =
  | { readonly status: "success"; readonly result: T }
  | { readonly status: "failure"; readonly error: Error };

type OptionalOptimisticVoterStateResults = readonly [VotingMulticallResult<Address>, VotingMulticallResult<bigint>];

export async function getVoterState(
  client: DtfClient,
  params: GetIndexDtfVoterStateParams,
): Promise<IndexDtfVoterState> {
  const stToken = getAddress(params.stToken);
  const account = getAddress(params.account);
  const baseCall = {
    address: stToken,
    abi: dtfIndexStakingVaultAbi,
  } as const;
  const publicClient = client.viem.getPublicClient(params.chainId);
  const [delegate, balance, votingPower, voteSupply] = (await publicClient.multicall({
    allowFailure: false,
    contracts: [
      {
        ...baseCall,
        functionName: "delegates",
        args: [account],
      },
      {
        ...baseCall,
        functionName: "balanceOf",
        args: [account],
      },
      {
        ...baseCall,
        functionName: "getVotes",
        args: [account],
      },
      {
        ...baseCall,
        functionName: "totalSupply",
      },
    ],
  })) as readonly [Address, bigint, bigint, bigint];
  const [optimisticDelegate, optimisticVotingPower] = await readOptionalCurrentOptimisticVoterState(
    client,
    params.chainId,
    stToken,
    account,
  );
  const mappedOptimisticVotingPower = optimisticVotingPower === null ? null : mapAmount(optimisticVotingPower);

  return {
    account,
    delegate,
    optimisticDelegate,
    balance: mapAmount(balance),
    votingPower: mapAmount(votingPower),
    votingWeight: voteSupply === 0n ? 0 : (Number(votingPower) / Number(voteSupply)) * 100,
    optimisticVotingPower: mappedOptimisticVotingPower,
    voteSupply: mapAmount(voteSupply),
    isSelfDelegated: delegate.toLowerCase() === account.toLowerCase(),
    isOptimisticSelfDelegated: optimisticDelegate?.toLowerCase() === account.toLowerCase(),
    hasVotingPower: votingPower > 0n,
    hasOptimisticVotingPower: (optimisticVotingPower ?? 0n) > 0n,
  };
}

export async function getProposerState(
  client: DtfClient,
  params: GetIndexDtfProposerStateParams,
): Promise<IndexDtfProposerState> {
  const governance = getAddress(params.governance);
  const account = getAddress(params.account);
  const publicClient = client.viem.getPublicClient(params.chainId);
  const baseCall = {
    address: governance,
    abi: dtfIndexGovernanceAbi,
  } as const;

  if (params.timepoint !== undefined) {
    const [votingPower, proposalThreshold] = (await publicClient.multicall({
      allowFailure: false,
      contracts: [
        {
          ...baseCall,
          functionName: "getVotes",
          args: [account, params.timepoint],
        },
        {
          ...baseCall,
          functionName: "proposalThreshold",
        },
      ],
    })) as readonly [bigint, bigint];

    return {
      account,
      governance,
      votingPower: mapAmount(votingPower),
      proposalThreshold: mapAmount(proposalThreshold),
      canPropose: votingPower >= proposalThreshold,
    };
  }

  const [clock, proposalThreshold] = (await publicClient.multicall({
    allowFailure: false,
    contracts: [
      {
        ...baseCall,
        functionName: "clock",
      },
      {
        ...baseCall,
        functionName: "proposalThreshold",
      },
    ],
  })) as readonly [number | bigint, bigint];
  const clockTimepoint = typeof clock === "bigint" ? clock : BigInt(clock);
  const timepoint = clockTimepoint > 0n ? clockTimepoint - 1n : 0n;
  const [votingPower] = (await publicClient.multicall({
    allowFailure: false,
    contracts: [
      {
        ...baseCall,
        functionName: "getVotes",
        args: [account, timepoint],
      },
    ],
  })) as readonly [bigint];

  return {
    account,
    governance,
    votingPower: mapAmount(votingPower),
    proposalThreshold: mapAmount(proposalThreshold),
    canPropose: votingPower >= proposalThreshold,
  };
}

export async function getProposalVotes(
  client: DtfClient,
  params: GetIndexDtfProposalVotesParams,
): Promise<IndexDtfProposalVotes> {
  const [[againstVotes, forVotes, abstainVotes]] = (await client.viem.getPublicClient(params.chainId).multicall({
    allowFailure: false,
    contracts: [
      {
        address: getAddress(params.governance),
        abi: dtfIndexGovernanceAbi,
        functionName: "proposalVotes",
        args: [BigInt(params.proposalId)],
      },
    ],
  })) as readonly [readonly [bigint, bigint, bigint]];

  return {
    againstVotes: mapAmount(againstVotes),
    forVotes: mapAmount(forVotes),
    abstainVotes: mapAmount(abstainVotes),
  };
}

export async function getProposalVoterState(
  client: DtfClient,
  params: GetIndexDtfProposalVoterStateParams,
): Promise<IndexDtfProposalVoterState> {
  if (params.proposal.isOptimistic === true) {
    return getUnifiedOptimisticProposalVoterState(client, params);
  }

  return getStandardProposalVoterState(client, params);
}

async function getStandardProposalVoterState(
  client: DtfClient,
  params: GetIndexDtfProposalVoterStateParams,
): Promise<IndexDtfProposalVoterState> {
  const account = getAddress(params.account);
  const governance = getAddress(params.governance);
  const vote = getAccountProposalVote(params.proposal.votes, account);
  const votingPower = await readStandardProposalVotingPower(
    client,
    params.chainId,
    governance,
    account,
    params.proposal.voteStart,
  );

  return {
    account,
    votingPower: mapAmount(votingPower),
    vote,
    hasVoted: vote !== null,
    hasVotingPower: votingPower > 0n,
  };
}

async function getUnifiedOptimisticProposalVoterState(
  client: DtfClient,
  params: GetIndexDtfProposalVoterStateParams,
): Promise<IndexDtfProposalVoterState> {
  const account = getAddress(params.account);
  const optimisticVotingPower = await readProposalOptimisticVotingPower(
    client,
    params.chainId,
    account,
    params.proposal,
  );
  const vote = getAccountProposalVote(params.proposal.votes, account);
  const votingPower = mapAmount(optimisticVotingPower ?? 0n);

  return {
    account,
    votingPower,
    vote,
    hasVoted: vote !== null,
    hasVotingPower: votingPower.raw > 0n,
  };
}

export async function getOptimisticProposalVoterState(
  client: DtfClient,
  params: GetIndexDtfOptimisticProposalVoterStateParams,
): Promise<IndexDtfOptimisticProposalVoterState> {
  const account = getAddress(params.account);
  const optimisticVotingPower = await readProposalOptimisticVotingPower(
    client,
    params.chainId,
    account,
    params.proposal,
  );
  const vote = getAccountProposalVote(params.proposal.votes, account);

  return {
    account,
    optimisticVotingPower: optimisticVotingPower === null ? null : mapAmount(optimisticVotingPower),
    vote,
    hasVoted: vote !== null,
    hasOptimisticVotingPower: (optimisticVotingPower ?? 0n) > 0n,
  };
}

function getOptionalOptimisticResult<T>(result: VotingMulticallResult<T>): T | null {
  if (result.status === "success") {
    return result.result;
  }

  if (isUnsupportedVoteLockOptimisticReadError(result.error)) {
    return null;
  }

  throw result.error;
}

async function readOptionalCurrentOptimisticVoterState(
  client: DtfClient,
  chainId: GetIndexDtfVoterStateParams["chainId"],
  stToken: Address,
  account: Address,
): Promise<readonly [Address | null, bigint | null]> {
  try {
    const [delegateResult, votingPowerResult] = (await client.viem.getPublicClient(chainId).multicall({
      allowFailure: true,
      contracts: [
        {
          address: stToken,
          abi: dtfIndexStakingVaultOptimisticAbi,
          functionName: "optimisticDelegates",
          args: [account],
        },
        {
          address: stToken,
          abi: dtfIndexStakingVaultOptimisticAbi,
          functionName: "getOptimisticVotes",
          args: [account],
        },
      ],
    })) as OptionalOptimisticVoterStateResults;

    return [getOptionalOptimisticResult(delegateResult), getOptionalOptimisticResult(votingPowerResult)];
  } catch (error) {
    if (isUnsupportedVoteLockOptimisticReadError(error)) {
      return [null, null];
    }

    throw error;
  }
}

function getAccountProposalVote(votes: readonly IndexDtfProposalVote[], account: Address) {
  const normalizedAccount = account.toLowerCase();

  return votes.find((proposalVote) => proposalVote.voter.toLowerCase() === normalizedAccount)?.choice ?? null;
}

async function readProposalOptimisticVotingPower(
  client: DtfClient,
  chainId: GetIndexDtfOptimisticProposalVoterStateParams["chainId"],
  account: GetIndexDtfOptimisticProposalVoterStateParams["account"],
  proposal: GetIndexDtfOptimisticProposalVoterStateParams["proposal"],
) {
  const voteToken = getAddress(proposal.optimistic?.voteToken ?? proposal.voteToken);
  const snapshot = proposal.optimistic?.snapshot ?? BigInt(proposal.voteStart);
  const timepoint = await getPastVoteTimepoint(client, chainId, voteToken, snapshot);

  return readPastOptimisticVotes(client, chainId, voteToken, account, timepoint);
}

async function readStandardProposalVotingPower(
  client: DtfClient,
  chainId: GetIndexDtfProposalVoterStateParams["chainId"],
  governance: Address,
  account: GetIndexDtfProposalVoterStateParams["account"],
  voteStart: number,
) {
  const snapshotTimepoint = BigInt(Math.max(voteStart - 1, 0));
  const publicClient = client.viem.getPublicClient(chainId);
  const [clock] = (await publicClient.multicall({
    allowFailure: false,
    contracts: [
      {
        address: governance,
        abi: dtfIndexGovernanceAbi,
        functionName: "clock",
      },
    ],
  })) as readonly [number | bigint];
  const clockTimepoint = typeof clock === "bigint" ? clock : BigInt(clock);
  const latestSafeTimepoint = clockTimepoint > 0n ? clockTimepoint - 1n : 0n;
  const timepoint = snapshotTimepoint > latestSafeTimepoint ? latestSafeTimepoint : snapshotTimepoint;
  const [votingPower] = (await publicClient.multicall({
    allowFailure: false,
    contracts: [
      {
        address: governance,
        abi: dtfIndexGovernanceAbi,
        functionName: "getVotes",
        args: [account, timepoint],
      },
    ],
  })) as readonly [bigint];

  return votingPower;
}

async function getPastVoteTimepoint(
  client: DtfClient,
  chainId: GetIndexDtfProposalVoterStateParams["chainId"],
  voteToken: Address,
  snapshotTimepoint: bigint,
) {
  const [clock] = (await client.viem.getPublicClient(chainId).multicall({
    allowFailure: false,
    contracts: [
      {
        address: voteToken,
        abi: dtfIndexStakingVaultAbi,
        functionName: "clock",
      },
    ],
  })) as readonly [number | bigint];
  const clockTimepoint = typeof clock === "bigint" ? clock : BigInt(clock);
  const latestSafeTimepoint = clockTimepoint > 0n ? clockTimepoint - 1n : 0n;

  return snapshotTimepoint > latestSafeTimepoint ? latestSafeTimepoint : snapshotTimepoint;
}

async function readPastOptimisticVotes(
  client: DtfClient,
  chainId: GetIndexDtfOptimisticProposalVoterStateParams["chainId"],
  voteToken: Address,
  account: GetIndexDtfOptimisticProposalVoterStateParams["account"],
  timepoint: bigint,
) {
  const [votingPowerResult] = (await client.viem.getPublicClient(chainId).multicall({
    allowFailure: true,
    contracts: [
      {
        address: voteToken,
        abi: dtfIndexStakingVaultOptimisticAbi,
        functionName: "getPastOptimisticVotes",
        args: [account, timepoint],
      },
    ],
  })) as readonly [VotingMulticallResult<bigint>];

  if (votingPowerResult.status === "success") {
    return votingPowerResult.result ?? null;
  }

  if (isUnsupportedVoteLockOptimisticReadError(votingPowerResult.error)) {
    return null;
  }

  throw votingPowerResult.error;
}
