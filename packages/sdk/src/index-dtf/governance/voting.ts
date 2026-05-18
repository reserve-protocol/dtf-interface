import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type {
  GetIndexDtfOptimisticProposalVoterStateParams,
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
  IndexDtfOptimisticProposalVoterState,
  IndexDtfProposalVoterState,
  IndexDtfProposalVote,
  IndexDtfProposalVotes,
  IndexDtfProposerState,
  IndexDtfVoterState,
} from "@/types/governance";

import { getLatestBlockTimepoint } from "@/client/viem";
import { dtfIndexGovernanceAbi } from "@/index-dtf/abis/dtf-index-governance";
import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";
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
  const [optimisticDelegateResult, optimisticVotingPowerResult] = (await publicClient.multicall({
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
  const optimisticDelegate = getOptionalOptimisticResult(optimisticDelegateResult);
  const optimisticVotingPower = getOptionalOptimisticResult(optimisticVotingPowerResult);
  const mappedOptimisticVotingPower = optimisticVotingPower === null ? null : mapAmount(optimisticVotingPower);

  return {
    account,
    delegate,
    optimisticDelegate,
    balance: mapAmount(balance),
    votingPower: mapAmount(votingPower),
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
  const timepoint = params.timepoint ?? (await getLatestBlockTimepoint(client.viem, params.chainId));
  const baseCall = {
    address: governance,
    abi: dtfIndexGovernanceAbi,
  } as const;
  const [votingPower, proposalThreshold] = (await client.viem.getPublicClient(params.chainId).multicall({
    allowFailure: false,
    contracts: [
      {
        ...baseCall,
        functionName: "getVotes",
        args: [account, timepoint],
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

export async function getProposalVotes(
  client: DtfClient,
  params: GetIndexDtfProposalVotesParams,
): Promise<IndexDtfProposalVotes> {
  const [againstVotes, forVotes, abstainVotes] = await client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.governance),
    abi: dtfIndexGovernanceAbi,
    functionName: "proposalVotes",
    args: [BigInt(params.proposalId)],
  });

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
  const account = getAddress(params.account);
  const latestTimepoint = await getLatestBlockTimepoint(client.viem, params.chainId);
  const governance = getAddress(params.governance);
  const standardTimepoint = BigInt(Math.max(params.proposal.voteStart - 1, 0));
  const timepoint = latestTimepoint < standardTimepoint ? latestTimepoint : standardTimepoint;
  const votingPower = await client.viem.readContract({
    chainId: params.chainId,
    address: governance,
    abi: dtfIndexGovernanceAbi,
    functionName: "getVotes",
    args: [account, timepoint],
  });
  const vote = getAccountProposalVote(params.proposal.votes, account);

  return {
    account,
    votingPower: mapAmount(votingPower),
    vote,
    hasVoted: vote !== null,
    hasVotingPower: votingPower > 0n,
  };
}

export async function getOptimisticProposalVoterState(
  client: DtfClient,
  params: GetIndexDtfOptimisticProposalVoterStateParams,
): Promise<IndexDtfOptimisticProposalVoterState> {
  const account = getAddress(params.account);
  const latestTimepoint = await getLatestBlockTimepoint(client.viem, params.chainId);
  const governance = getAddress(params.governance);
  const optimisticVotingPower = await readPastOptimisticVotes(
    client,
    params.chainId,
    await getProposalVoteToken(client, params.chainId, governance, params.proposal.voteToken),
    account,
    getOptimisticProposalTimepoint(latestTimepoint, params.proposal),
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

function getOptimisticProposalTimepoint(
  latestTimepoint: bigint,
  proposal: GetIndexDtfOptimisticProposalVoterStateParams["proposal"],
) {
  const optimisticTimepoint = proposal.optimistic?.snapshot ?? BigInt(proposal.voteStart);

  return latestTimepoint < optimisticTimepoint ? latestTimepoint : optimisticTimepoint;
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

function getAccountProposalVote(votes: readonly IndexDtfProposalVote[], account: Address) {
  const normalizedAccount = account.toLowerCase();

  return votes.find((proposalVote) => proposalVote.voter.toLowerCase() === normalizedAccount)?.choice ?? null;
}

async function getProposalVoteToken(
  client: DtfClient,
  chainId: GetIndexDtfOptimisticProposalVoterStateParams["chainId"],
  governance: GetIndexDtfOptimisticProposalVoterStateParams["governance"],
  voteToken: GetIndexDtfOptimisticProposalVoterStateParams["proposal"]["voteToken"],
) {
  if (voteToken) {
    return getAddress(voteToken);
  }

  return client.viem.readContract({
    chainId,
    address: governance,
    abi: dtfIndexGovernanceOptimisticAbi,
    functionName: "token",
  });
}

async function readPastOptimisticVotes(
  client: DtfClient,
  chainId: GetIndexDtfOptimisticProposalVoterStateParams["chainId"],
  voteToken: NonNullable<GetIndexDtfOptimisticProposalVoterStateParams["proposal"]["voteToken"]>,
  account: GetIndexDtfOptimisticProposalVoterStateParams["account"],
  timepoint: bigint,
) {
  try {
    const votes = await client.viem.readContract({
      chainId,
      address: voteToken,
      abi: dtfIndexStakingVaultOptimisticAbi,
      functionName: "getPastOptimisticVotes",
      args: [account, timepoint],
    });

    return votes ?? null;
  } catch (error) {
    if (!isUnsupportedVoteLockOptimisticReadError(error)) {
      throw error;
    }

    return null;
  }
}
