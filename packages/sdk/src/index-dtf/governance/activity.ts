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
import { loadGovernedDtfDirectory, type GovernedDtfDirectory } from "@/index-dtf/governance/governed-dtfs";
import { mapVaultShareToken, mapVaultUnderlying } from "@/index-dtf/governance/vault-context";
import { GetIndexDtfGovernanceActivityDocument } from "@/index-dtf/subgraph/dtf.generated";
import { mapAmount } from "@/lib/utils";

const DEFAULT_ACTIVITY_LIMIT = 50;

type ActivityData = GetIndexDtfGovernanceActivityQuery;
type ActivityGovernance = ActivityData["proposals"][number]["governance"];
type ActivityProposal = { readonly id: string; readonly governance: ActivityGovernance };

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
  const chains = await Promise.all(
    (params.chainIds ?? supportedChainIds).map((chainId) => getChainActivity(client, chainId, limit)),
  );

  return chains
    .flat()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

async function getChainActivity(
  client: DtfClient,
  chainId: SupportedChainId,
  limit: number,
): Promise<readonly IndexDtfGovernanceActivity[]> {
  const [directory, data] = await Promise.all([
    loadGovernedDtfDirectory(client, chainId),
    client.subgraph.queryIndex({ chainId, query: GetIndexDtfGovernanceActivityDocument, variables: { limit } }),
  ]);
  const transition = (
    type: IndexDtfGovernanceProposalActivity["type"],
    proposal: ActivityProposal,
    time: string,
    txnHash: string,
    account: string,
  ): IndexDtfGovernanceProposalActivity => ({
    type,
    chainId,
    timestamp: Number(time),
    txnHash: txnHash as Hex,
    account: getAddress(account),
    governance: getAddress(proposal.governance.id),
    proposalId: proposal.id,
    dtfs: directory.forGovernance(proposal.governance.id),
  });

  return [
    ...data.votes.map((vote) => mapVote(vote, chainId, directory)),
    ...data.proposals.map((p) => transition("proposal-created", p, p.creationTime, p.txnHash, p.proposer.address)),
    ...data.queued.map((p) => transition("proposal-queued", p, p.queueTime!, p.queueTxnHash!, p.queueAccount!.id)),
    ...data.executed.map((p) =>
      transition("proposal-executed", p, p.executionTime!, p.executionTxnHash!, p.executionAccount!.id),
    ),
    // WHY: the subgraph records the caller for governor cancels only; a guardian
    // cancel runs through the timelock and leaves `cancellationAccount` empty.
    ...data.canceled.map((p) =>
      transition(
        "proposal-canceled",
        p,
        p.cancellationTime!,
        p.cancellationTxnHash!,
        p.cancellationAccount?.id ?? p.governance.timelock.id,
      ),
    ),
    ...data.stakingPositionRecords.flatMap((record) => mapStakeRecord(record, chainId, directory)),
  ];
}

function mapVote(
  vote: ActivityData["votes"][number],
  chainId: SupportedChainId,
  directory: GovernedDtfDirectory,
): IndexDtfGovernanceVoteActivity {
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
    dtfs: directory.forGovernance(governance.id),
  };
}

function mapStakeRecord(
  record: ActivityData["stakingPositionRecords"][number],
  chainId: SupportedChainId,
  directory: GovernedDtfDirectory,
): readonly IndexDtfGovernanceStakeActivity[] {
  const underlying = mapVaultUnderlying(record.token.underlying);

  // WHY: a withdrawal to another receiver also writes a zero-share bookkeeping
  // record on the receiver's position; only the position that burned or minted
  // shares is the event.
  if (!underlying || record.shares === "0") {
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
      dtfs: directory.forVault(record.token.id),
    },
  ];
}
