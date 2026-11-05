import { erc20Abi, getAddress, type Address } from "viem";

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
import { mapAmount, sameAddress } from "@/lib/utils";

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
  const [delegate, balance, votingPower, voteSupply, decimals] = (await publicClient.multicall({
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
      {
        address: stToken,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ],
  })) as readonly [Address, bigint, bigint, bigint, number];
  const [optimisticDelegate, optimisticVotingPower] = await readOptionalCurrentOptimisticVoterState(
    client,
    params.chainId,
    stToken,
    account,
  );
  const mappedOptimisticVotingPower =
    optimisticVotingPower === null ? null : mapAmount(optimisticVotingPower, decimals);

  return {
    account,
    delegate,
    optimisticDelegate,
    balance: mapAmount(balance, decimals),
    votingPower: mapAmount(votingPower, decimals),
    votingWeight: voteSupply === 0n ? 0 : (Number(votingPower) / Number(voteSupply)) * 100,
    optimisticVotingPower: mappedOptimisticVotingPower,
    voteSupply: mapAmount(voteSupply, decimals),
    isSelfDelegated: sameAddress(delegate, account),
    isOptimisticSelfDelegated: optimisticDelegate !== null && sameAddress(optimisticDelegate, account),
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
    const [votingPower, proposalThreshold, voteToken] = (await publicClient.multicall({
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
        {
          ...baseCall,
          functionName: "token",
        },
      ],
    })) as readonly [bigint, bigint, Address];
    const decimals = params.voteTokenDecimals ?? (await readTokenDecimals(client, params.chainId, voteToken));

    return {
      account,
      governance,
      votingPower: mapAmount(votingPower, decimals),
      proposalThreshold: mapAmount(proposalThreshold, decimals),
      canPropose: votingPower >= proposalThreshold,
    };
  }

  const [clock, proposalThreshold, voteToken] = (await publicClient.multicall({
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
      {
        ...baseCall,
        functionName: "token",
      },
    ],
  })) as readonly [number | bigint, bigint, Address];
  const clockTimepoint = typeof clock === "bigint" ? clock : BigInt(clock);
  const timepoint = clockTimepoint > 0n ? clockTimepoint - 1n : 0n;
  const [votingPower, voteTokenDecimals] = (await publicClient.multicall({
    allowFailure: false,
    contracts: [
      {
        ...baseCall,
        functionName: "getVotes",
        args: [account, timepoint],
      },
      {
        address: voteToken,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ],
  })) as readonly [bigint, number];
  const decimals = params.voteTokenDecimals ?? voteTokenDecimals;

  return {
    account,
    governance,
    votingPower: mapAmount(votingPower, decimals),
    proposalThreshold: mapAmount(proposalThreshold, decimals),
    canPropose: votingPower >= proposalThreshold,
  };
}

export async function getProposalVotes(
  client: DtfClient,
  params: GetIndexDtfProposalVotesParams,
): Promise<IndexDtfProposalVotes> {
  const governance = getAddress(params.governance);
  const [[againstVotes, forVotes, abstainVotes], voteToken] = (await client.viem
    .getPublicClient(params.chainId)
    .multicall({
      allowFailure: false,
      contracts: [
        {
          address: governance,
          abi: dtfIndexGovernanceAbi,
          functionName: "proposalVotes",
          args: [BigInt(params.proposalId)],
        },
        {
          address: governance,
          abi: dtfIndexGovernanceAbi,
          functionName: "token",
        },
      ],
    })) as readonly [readonly [bigint, bigint, bigint], Address];
  const decimals = params.voteTokenDecimals ?? (await readTokenDecimals(client, params.chainId, voteToken));

  return {
    againstVotes: mapAmount(againstVotes, decimals),
    forVotes: mapAmount(forVotes, decimals),
    abstainVotes: mapAmount(abstainVotes, decimals),
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
  const [votingPower, decimals] = await readStandardProposalVotingPower(
    client,
    params.chainId,
    governance,
    getAddress(params.proposal.voteToken),
    account,
    params.proposal.voteStart,
  );

  return {
    account,
    votingPower: mapAmount(votingPower, decimals),
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
  const [optimisticVotingPower, decimals] = await readProposalOptimisticVotingPower(
    client,
    params.chainId,
    account,
    params.proposal,
  );
  const vote = getAccountProposalVote(params.proposal.votes, account);
  const votingPower = mapAmount(optimisticVotingPower ?? 0n, decimals);

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
  const [optimisticVotingPower, decimals] = await readProposalOptimisticVotingPower(
    client,
    params.chainId,
    account,
    params.proposal,
  );
  const vote = getAccountProposalVote(params.proposal.votes, account);

  return {
    account,
    optimisticVotingPower: optimisticVotingPower === null ? null : mapAmount(optimisticVotingPower, decimals),
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
  const [timepoint, decimals] = await getPastVoteTimepoint(client, chainId, voteToken, snapshot);
  const votingPower = await readPastOptimisticVotes(client, chainId, voteToken, account, timepoint);

  return [votingPower, decimals] as const;
}

async function readStandardProposalVotingPower(
  client: DtfClient,
  chainId: GetIndexDtfProposalVoterStateParams["chainId"],
  governance: Address,
  voteToken: Address,
  account: GetIndexDtfProposalVoterStateParams["account"],
  voteStart: number,
) {
  const snapshotTimepoint = BigInt(voteStart);
  const publicClient = client.viem.getPublicClient(chainId);
  const [clock, decimals] = (await publicClient.multicall({
    allowFailure: false,
    contracts: [
      {
        address: governance,
        abi: dtfIndexGovernanceAbi,
        functionName: "clock",
      },
      {
        address: voteToken,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ],
  })) as readonly [number | bigint, number];
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

  return [votingPower, decimals] as const;
}

async function getPastVoteTimepoint(
  client: DtfClient,
  chainId: GetIndexDtfProposalVoterStateParams["chainId"],
  voteToken: Address,
  snapshotTimepoint: bigint,
) {
  const [clock, decimals] = (await client.viem.getPublicClient(chainId).multicall({
    allowFailure: false,
    contracts: [
      {
        address: voteToken,
        abi: dtfIndexStakingVaultAbi,
        functionName: "clock",
      },
      {
        address: voteToken,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ],
  })) as readonly [number | bigint, number];
  const clockTimepoint = typeof clock === "bigint" ? clock : BigInt(clock);
  const latestSafeTimepoint = clockTimepoint > 0n ? clockTimepoint - 1n : 0n;

  return [snapshotTimepoint > latestSafeTimepoint ? latestSafeTimepoint : snapshotTimepoint, decimals] as const;
}

async function readTokenDecimals(
  client: DtfClient,
  chainId: GetIndexDtfProposalVotesParams["chainId"],
  token: Address,
): Promise<number> {
  return client.viem.readContract({
    chainId,
    address: token,
    abi: erc20Abi,
    functionName: "decimals",
  });
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
