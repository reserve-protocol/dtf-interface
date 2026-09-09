import { getAddress, type Hex } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { GetIndexDtfGovernanceActivityQuery } from "@/index-dtf/subgraph/dtf.generated";
import type {
  GetIndexDtfGovernanceActivityParams,
  IndexDtfGovernanceActivity,
  IndexDtfGovernanceProposalActivity,
  IndexDtfGovernanceStakeActivity,
  IndexDtfGovernanceVoteActivity,
} from "@/types/governance";

import { supportedChainIds } from "@/config";
import { mapGovernedDtfs, mapVaultShareToken, mapVaultUnderlying } from "@/index-dtf/governance/vault-context";
import { GetIndexDtfGovernanceActivityDocument } from "@/index-dtf/subgraph/dtf.generated";
import { mapAmount } from "@/lib/utils";

const DEFAULT_ACTIVITY_LIMIT = 50;

type ActivityData = GetIndexDtfGovernanceActivityQuery;
type ActivityGovernance = ActivityData["proposals"][number]["governance"];

/**
 * Reads the latest governance events across Index DTF chains, newest first:
 * votes cast, proposal lifecycle transitions (each ordered by its own
 * timestamp), and vote-lock deposits/withdrawals.
 */
export async function getGovernanceActivity(
  client: DtfClient,
  params: GetIndexDtfGovernanceActivityParams = {},
): Promise<readonly IndexDtfGovernanceActivity[]> {
  const limit = params.limit ?? DEFAULT_ACTIVITY_LIMIT;
  const byChain = await client.subgraph.queryIndexAll({
    chainIds: params.chainIds ?? supportedChainIds,
    query: GetIndexDtfGovernanceActivityDocument,
    variables: { limit },
  });

  return Object.entries(byChain)
    .flatMap(([key, data]) => {
      const chainId = Number(key) as SupportedChainId;

      return [
        ...data.votes.map((vote) => mapVote(vote, chainId)),
        ...data.proposals.map((proposal) =>
          mapTransition(
            "proposal-created",
            proposal,
            chainId,
            proposal.creationTime,
            proposal.txnHash,
            proposal.proposer.address,
          ),
        ),
        ...data.queued.map((proposal) =>
          mapTransition(
            "proposal-queued",
            proposal,
            chainId,
            proposal.queueTime!,
            proposal.queueTxnHash!,
            proposal.queueAccount!.id,
          ),
        ),
        ...data.executed.map((proposal) =>
          mapTransition(
            "proposal-executed",
            proposal,
            chainId,
            proposal.executionTime!,
            proposal.executionTxnHash!,
            proposal.executionAccount!.id,
          ),
        ),
        // WHY: the subgraph records the caller for governor cancels only; a guardian
        // cancel runs through the timelock and leaves `cancellationAccount` empty.
        ...data.canceled.map((proposal) =>
          mapTransition(
            "proposal-canceled",
            proposal,
            chainId,
            proposal.cancellationTime!,
            proposal.cancellationTxnHash!,
            proposal.cancellationAccount?.id ?? proposal.governance.timelock.id,
          ),
        ),
        ...data.stakingPositionRecords.flatMap((record) => mapStakeRecord(record, chainId)),
      ];
    })
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

function mapVote(vote: ActivityData["votes"][number], chainId: SupportedChainId): IndexDtfGovernanceVoteActivity {
  const governance = vote.proposal.governance;

  return {
    type: "vote",
    chainId,
    timestamp: Number(vote.blockTime),
    txnHash: vote.txnHash as Hex,
    account: getAddress(vote.voter.address),
    governance: getAddress(governance.id),
    proposalId: vote.proposal.id,
    choice: vote.choice,
    weight: mapAmount(vote.weight, governance.token.token.decimals),
    dtfs: mapGovernedDtfs(governance.token, chainId, governance.id),
  };
}

function mapTransition(
  type: IndexDtfGovernanceProposalActivity["type"],
  proposal: { readonly id: string; readonly governance: ActivityGovernance },
  chainId: SupportedChainId,
  time: string,
  txnHash: string,
  account: string,
): IndexDtfGovernanceProposalActivity {
  return {
    type,
    chainId,
    timestamp: Number(time),
    txnHash: txnHash as Hex,
    account: getAddress(account),
    governance: getAddress(proposal.governance.id),
    proposalId: proposal.id,
    dtfs: mapGovernedDtfs(proposal.governance.token, chainId, proposal.governance.id),
  };
}

function mapStakeRecord(
  record: ActivityData["stakingPositionRecords"][number],
  chainId: SupportedChainId,
): readonly IndexDtfGovernanceStakeActivity[] {
  const underlying = mapVaultUnderlying(record.token.underlying);

  if (!underlying) {
    return [];
  }

  return [
    {
      type: record.type === "DEPOSIT" ? "stake" : "unstake",
      chainId,
      timestamp: Number(record.timestamp),
      txnHash: record.hash as Hex,
      account: getAddress(record.account.id),
      stToken: mapVaultShareToken(record.token),
      underlying,
      amount: mapAmount(record.assets, underlying.decimals),
      dtfs: mapGovernedDtfs(record.token, chainId),
    },
  ];
}
