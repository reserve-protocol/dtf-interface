import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type {
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
  IndexDtfProposalVoterState,
  IndexDtfProposalVotes,
  IndexDtfProposerState,
  IndexDtfVoterState,
} from "@/types/governance";

import { getLatestBlockTimepoint } from "@/client/viem";
import { dtfIndexGovernanceAbi } from "@/index-dtf/abis/dtf-index-governance";
import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";
import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { dtfIndexStakingVaultOptimisticAbi } from "@/index-dtf/abis/dtf-index-staking-vault-optimistic";
import { isUnsupportedVoteLockOptimisticReadError } from "@/index-dtf/optimistic-errors";
import { mapAmount } from "@/lib/utils";

export async function getVoterState(
  client: DtfClient,
  params: GetIndexDtfVoterStateParams,
): Promise<IndexDtfVoterState> {
  const stToken = getAddress(params.stToken);
  const account = getAddress(params.account);
  const baseCall = {
    chainId: params.chainId,
    address: stToken,
    abi: dtfIndexStakingVaultAbi,
  } as const;
  const [
    delegate,
    balance,
    votingPower,
    voteSupply,
    optimisticDelegate,
    optimisticVotingPower,
  ] = await Promise.all([
    client.viem.readContract({
      ...baseCall,
      functionName: "delegates",
      args: [account],
    }),
    client.viem.readContract({
      ...baseCall,
      functionName: "balanceOf",
      args: [account],
    }),
    client.viem.readContract({
      ...baseCall,
      functionName: "getVotes",
      args: [account],
    }),
    client.viem.readContract({
      ...baseCall,
      functionName: "totalSupply",
    }),
    readOptimisticDelegate(client, params.chainId, stToken, account),
    readVoteLockOptimisticVotes(client, params.chainId, stToken, account),
  ]);
  const mappedOptimisticVotingPower =
    optimisticVotingPower === null ? null : mapAmount(optimisticVotingPower);

  return {
    account,
    delegate,
    optimisticDelegate,
    balance: mapAmount(balance),
    votingPower: mapAmount(votingPower),
    optimisticVotingPower: mappedOptimisticVotingPower,
    voteSupply: mapAmount(voteSupply),
    isSelfDelegated: delegate.toLowerCase() === account.toLowerCase(),
    isOptimisticSelfDelegated:
      optimisticDelegate?.toLowerCase() === account.toLowerCase(),
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
    chainId: params.chainId,
    address: governance,
    abi: dtfIndexGovernanceAbi,
  } as const;
  const [votingPower, proposalThreshold] = await Promise.all([
    client.viem.readContract({
      ...baseCall,
      functionName: "getVotes",
      args: [account, timepoint],
    }),
    client.viem.readContract({
      ...baseCall,
      functionName: "proposalThreshold",
    }),
  ]);

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
  const latestTimepoint = await getLatestBlockTimepoint(
    client.viem,
    params.chainId,
  );
  const governance = getAddress(params.governance);
  const standardTimepoint = BigInt(Math.max(params.proposal.voteStart - 1, 0));
  const timepoint =
    latestTimepoint < standardTimepoint ? latestTimepoint : standardTimepoint;
  const votingPower = await client.viem.readContract({
    chainId: params.chainId,
    address: governance,
    abi: dtfIndexGovernanceAbi,
    functionName: "getVotes",
    args: [account, timepoint],
  });
  const optimisticVotingPower = params.proposal.isOptimistic
    ? await readPastOptimisticVotes(
        client,
        params.chainId,
        await getProposalVoteToken(
          client,
          params.chainId,
          governance,
          params.proposal.voteToken,
        ),
        account,
        getOptimisticProposalTimepoint(latestTimepoint, params.proposal),
      )
    : null;
  const mappedOptimisticVotingPower =
    optimisticVotingPower === null ? null : mapAmount(optimisticVotingPower);
  const vote =
    params.proposal.votes.find(
      (proposalVote) => getAddress(proposalVote.voter) === account,
    )?.choice ?? null;

  return {
    account,
    votingPower: mapAmount(votingPower),
    optimisticVotingPower: mappedOptimisticVotingPower,
    vote,
    hasVoted: vote !== null,
    hasVotingPower: votingPower > 0n,
    hasOptimisticVotingPower: (optimisticVotingPower ?? 0n) > 0n,
  };
}

async function readOptimisticDelegate(
  client: DtfClient,
  chainId: GetIndexDtfVoterStateParams["chainId"],
  stToken: GetIndexDtfVoterStateParams["stToken"],
  account: GetIndexDtfVoterStateParams["account"],
) {
  try {
    const delegate = await client.viem.readContract({
      chainId,
      address: stToken,
      abi: dtfIndexStakingVaultOptimisticAbi,
      functionName: "optimisticDelegates",
      args: [account],
    });

    return delegate;
  } catch (error) {
    if (!isUnsupportedVoteLockOptimisticReadError(error)) {
      throw error;
    }

    return null;
  }
}

async function readVoteLockOptimisticVotes(
  client: DtfClient,
  chainId: GetIndexDtfVoterStateParams["chainId"],
  stToken: GetIndexDtfVoterStateParams["stToken"],
  account: GetIndexDtfVoterStateParams["account"],
) {
  try {
    const votes = await client.viem.readContract({
      chainId,
      address: stToken,
      abi: dtfIndexStakingVaultOptimisticAbi,
      functionName: "getOptimisticVotes",
      args: [account],
    });

    return votes ?? null;
  } catch (error) {
    if (!isUnsupportedVoteLockOptimisticReadError(error)) {
      throw error;
    }

    return null;
  }
}

function getOptimisticProposalTimepoint(
  latestTimepoint: bigint,
  proposal: GetIndexDtfProposalVoterStateParams["proposal"],
) {
  const optimisticTimepoint =
    proposal.optimistic?.snapshot ?? BigInt(proposal.voteStart);

  return latestTimepoint < optimisticTimepoint
    ? latestTimepoint
    : optimisticTimepoint;
}

async function getProposalVoteToken(
  client: DtfClient,
  chainId: GetIndexDtfProposalVoterStateParams["chainId"],
  governance: GetIndexDtfProposalVoterStateParams["governance"],
  voteToken: GetIndexDtfProposalVoterStateParams["proposal"]["voteToken"],
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
  chainId: GetIndexDtfProposalVoterStateParams["chainId"],
  voteToken: NonNullable<
    GetIndexDtfProposalVoterStateParams["proposal"]["voteToken"]
  >,
  account: GetIndexDtfProposalVoterStateParams["account"],
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
