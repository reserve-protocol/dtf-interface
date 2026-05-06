import { getAddress } from "viem";
import type { DtfClient } from "../../client.js";
import { getLatestBlockTimepoint } from "../../client/viem.js";
import { mapAmount } from "../../lib/utils.js";
import type {
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
  IndexDtfProposalVoterState,
  IndexDtfProposalVotes,
  IndexDtfProposerState,
  IndexDtfVoterState,
} from "../../types/governance.js";
import { dtfIndexGovernanceAbi } from "../abis/dtf-index-governance.js";
import { dtfIndexStakingVaultAbi } from "../abis/dtf-index-staking-vault.js";

export async function getIndexDtfVoterState(
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
  const [delegate, balance, votingPower, voteSupply] = await Promise.all([
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
  ]);

  return {
    account,
    delegate,
    balance: mapAmount(balance),
    votingPower: mapAmount(votingPower),
    voteSupply: mapAmount(voteSupply),
    isSelfDelegated: delegate.toLowerCase() === account.toLowerCase(),
    hasVotingPower: votingPower > 0n,
  };
}

export async function getIndexDtfProposerState(
  client: DtfClient,
  params: GetIndexDtfProposerStateParams,
): Promise<IndexDtfProposerState> {
  const governance = getAddress(params.governance);
  const account = getAddress(params.account);
  const timepoint =
    params.timepoint ??
    (await getLatestBlockTimepoint(client.viem, params.chainId));
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

export async function getIndexDtfProposalVotes(
  client: DtfClient,
  params: GetIndexDtfProposalVotesParams,
): Promise<IndexDtfProposalVotes> {
  const [againstVotes, forVotes, abstainVotes] = await client.viem.readContract(
    {
      chainId: params.chainId,
      address: getAddress(params.governance),
      abi: dtfIndexGovernanceAbi,
      functionName: "proposalVotes",
      args: [BigInt(params.proposalId)],
    },
  );

  return {
    againstVotes: mapAmount(againstVotes),
    forVotes: mapAmount(forVotes),
    abstainVotes: mapAmount(abstainVotes),
  };
}

export async function getIndexDtfProposalVoterState(
  client: DtfClient,
  params: GetIndexDtfProposalVoterStateParams,
): Promise<IndexDtfProposalVoterState> {
  const account = getAddress(params.account);
  const latestTimepoint = await getLatestBlockTimepoint(
    client.viem,
    params.chainId,
  );
  const proposalTimepoint = BigInt(Math.max(params.proposal.voteStart - 1, 0));
  const timepoint =
    latestTimepoint < proposalTimepoint ? latestTimepoint : proposalTimepoint;
  const votingPower = await client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.governance),
    abi: dtfIndexGovernanceAbi,
    functionName: "getVotes",
    args: [account, timepoint],
  });
  const vote =
    params.proposal.votes.find(
      (proposalVote) => getAddress(proposalVote.voter) === account,
    )?.choice ?? null;

  return {
    account,
    votingPower: mapAmount(votingPower),
    vote,
    hasVoted: vote !== null,
    hasVotingPower: votingPower > 0n,
  };
}
