import { getAddress, type Hex } from "viem";

import type { DtfClient } from "@/client";
import type {
  GetYieldDtfGovernanceActivityParams,
  GetYieldDtfProposalFeedParams,
  GetYieldDtfTopVotersParams,
  GovernedYieldDtf,
  YieldDtfGovernanceActivity,
  YieldDtfGovernanceProposalActivity,
  YieldDtfProposalFeedItem,
  YieldDtfTopVoter,
} from "@/types/yield-dtf";
import type { YieldDtfChainId } from "@/yield-dtf/config";

import { dedupeById, fetchSubgraphPages, resolveSubgraphTimeRange, SUBGRAPH_MAX_ROWS } from "@/lib/subgraph-pages";
import { getCurrentTime, mapAmount } from "@/lib/utils";
import { yieldDtfChainIds } from "@/yield-dtf/config";
import { mapYieldDtfProposalSummary, withYieldDtfProposalListStates } from "@/yield-dtf/governance";
import {
  GetYieldDtfGovernanceActivityDocument,
  GetYieldDtfProposalFeedDocument,
  GetYieldDtfTopVotersDocument,
  type Proposal_Filter,
} from "@/yield-dtf/subgraph/yield.generated";

const DEFAULT_TOP_VOTER_LIMIT = 20;
const DEFAULT_ACTIVITY_LIMIT = 50;

type SubgraphGovernedRToken = {
  readonly id: string;
  readonly token: { readonly symbol: string; readonly name: string };
};

/** Reads Yield DTF proposals created inside a time window across chains, newest first, with derived list state. `limit` caps each chain. */
export async function getYieldDtfProposalFeed(
  client: DtfClient,
  params: GetYieldDtfProposalFeedParams = {},
): Promise<readonly YieldDtfProposalFeedItem[]> {
  const limit = params.limit ?? SUBGRAPH_MAX_ROWS;
  const range = resolveSubgraphTimeRange(params, getCurrentTime());
  const where: Proposal_Filter = {
    creationTime_gte: String(range.since),
    ...(range.until === undefined ? {} : { creationTime_lte: String(range.until) }),
  };
  const chains = await Promise.all(
    (params.chainIds ?? yieldDtfChainIds).map(async (chainId) => {
      const proposals = await fetchSubgraphPages(async (offset, pageSize) => {
        const data = await client.subgraph.queryYield({
          chainId,
          query: GetYieldDtfProposalFeedDocument,
          variables: { limit: pageSize, offset, where },
        });

        return data.proposals;
      }, limit);

      const summaries = dedupeById(proposals).map((proposal) => ({
        ...mapYieldDtfProposalSummary(proposal, chainId),
        rToken: mapGovernedYieldDtf(proposal.governance.rToken, chainId),
        forDelegateVotes: Number(proposal.forDelegateVotes),
        againstDelegateVotes: Number(proposal.againstDelegateVotes),
        abstainDelegateVotes: Number(proposal.abstainDelegateVotes),
      }));

      return withYieldDtfProposalListStates(client, chainId, summaries);
    }),
  );

  return chains.flat().sort((a, b) => b.creationTime - a.creationTime);
}

/** Reads the most active Yield DTF voters across chains, by proposals voted on. */
export async function getYieldDtfTopVoters(
  client: DtfClient,
  params: GetYieldDtfTopVotersParams = {},
): Promise<readonly YieldDtfTopVoter[]> {
  const limit = params.limit ?? DEFAULT_TOP_VOTER_LIMIT;
  const chains = await Promise.all(
    (params.chainIds ?? yieldDtfChainIds).map(async (chainId) => {
      const { delegates } = await client.subgraph.queryYield({
        chainId,
        query: GetYieldDtfTopVotersDocument,
        variables: { limit },
      });

      return delegates.map((delegate) => ({
        chainId,
        address: getAddress(delegate.address),
        rToken: mapGovernedYieldDtf(delegate.governance.rToken, chainId),
        numberVotes: delegate.numberVotes,
        delegatedVotes: mapAmount(delegate.delegatedVotesRaw),
        tokenHoldersRepresented: delegate.tokenHoldersRepresentedAmount,
      }));
    }),
  );

  return chains
    .flat()
    .sort((a, b) => b.numberVotes - a.numberVotes)
    .slice(0, limit);
}

/**
 * Reads the latest Yield DTF governance events across chains, newest first:
 * votes cast, proposal lifecycle transitions (each ordered by its own
 * timestamp), and RSR stakes and unstake starts.
 */
export async function getYieldDtfGovernanceActivity(
  client: DtfClient,
  params: GetYieldDtfGovernanceActivityParams = {},
): Promise<readonly YieldDtfGovernanceActivity[]> {
  const limit = params.limit ?? DEFAULT_ACTIVITY_LIMIT;
  const chains = await Promise.all(
    (params.chainIds ?? yieldDtfChainIds).map(async (chainId) => {
      const data = await client.subgraph.queryYield({
        chainId,
        query: GetYieldDtfGovernanceActivityDocument,
        variables: { limit },
      });

      return [
        ...data.votes.map(
          (vote): YieldDtfGovernanceActivity => ({
            type: "vote",
            chainId,
            timestamp: Number(vote.blockTime),
            txnHash: vote.txnHash as Hex,
            rToken: mapGovernedYieldDtf(vote.proposal.governance.rToken, chainId),
            account: getAddress(vote.voter.address),
            proposalId: vote.proposal.id,
            choice: vote.choice,
            weight: mapAmount(vote.weight),
          }),
        ),
        ...data.proposals.map((proposal) =>
          mapTransition("proposal-created", proposal, chainId, proposal.creationTime, proposal.txnHash),
        ),
        ...data.queued.map((proposal) =>
          mapTransition("proposal-queued", proposal, chainId, proposal.queueTime!, proposal.queueTxnHash!),
        ),
        ...data.executed.map((proposal) =>
          mapTransition("proposal-executed", proposal, chainId, proposal.executionTime!, proposal.executionTxnHash!),
        ),
        ...data.canceled.map((proposal) =>
          mapTransition(
            "proposal-canceled",
            proposal,
            chainId,
            proposal.cancellationTime!,
            proposal.cancellationTxnHash!,
          ),
        ),
        // Entries are written by the Staked / UnstakingStarted handlers only; stRSR
        // transfers get their own entry type, so they never show up as staking.
        ...data.entries.map(
          (entry): YieldDtfGovernanceActivity => ({
            type: entry.type === "STAKE" ? "stake" : "unstake",
            chainId,
            timestamp: Number(entry.timestamp),
            txnHash: entry.hash as Hex,
            rToken: mapGovernedYieldDtf(entry.rToken!, chainId),
            account: getAddress(entry.from.id),
            rsrAmount: mapAmount(entry.amount!),
            stRsrAmount: mapAmount(entry.stAmount!),
          }),
        ),
      ];
    }),
  );

  return chains
    .flat()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

function mapTransition(
  type: YieldDtfGovernanceProposalActivity["type"],
  proposal: {
    readonly id: string;
    readonly proposer: { readonly address: string };
    readonly governance: { readonly rToken: SubgraphGovernedRToken };
  },
  chainId: YieldDtfChainId,
  time: string,
  txnHash: string,
): YieldDtfGovernanceProposalActivity {
  return {
    type,
    chainId,
    timestamp: Number(time),
    txnHash: txnHash as Hex,
    rToken: mapGovernedYieldDtf(proposal.governance.rToken, chainId),
    proposer: getAddress(proposal.proposer.address),
    proposalId: proposal.id,
  };
}

function mapGovernedYieldDtf(rToken: SubgraphGovernedRToken, chainId: YieldDtfChainId): GovernedYieldDtf {
  return {
    address: getAddress(rToken.id),
    chainId,
    symbol: rToken.token.symbol,
    name: rToken.token.name,
  };
}
