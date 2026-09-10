import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { GetIndexDtfProposalFeedParams, IndexDtfProposalFeedItem } from "@/types/governance";

import { supportedChainIds } from "@/config";
import { loadGovernedDtfDirectory } from "@/index-dtf/governance/governed-dtfs";
import { mapIndexDtfProposalSummary } from "@/index-dtf/governance/mapper";
import { withProposalSummaryState } from "@/index-dtf/governance/proposals";
import { GetAllIndexDtfProposalsDocument } from "@/index-dtf/subgraph/dtf.generated";
import { assertSubgraphWindow, fetchSubgraphPages, SUBGRAPH_MAX_ROWS } from "@/lib/subgraph-pages";
import { getCurrentTime } from "@/lib/utils";

/**
 * Reads indexed proposals across Index DTF chains, newest first, with the
 * time-derived state and the DTFs each governance controls. `limit` caps each
 * chain. Meant for cross-DTF views (dashboards, explorers); per-DTF screens use
 * `getProposals`.
 */
export async function getProposalFeed(
  client: DtfClient,
  params: GetIndexDtfProposalFeedParams = {},
): Promise<readonly IndexDtfProposalFeedItem[]> {
  const limit = params.limit ?? SUBGRAPH_MAX_ROWS;
  assertSubgraphWindow(limit);
  const timestamp = getCurrentTime();
  const chains = await Promise.all(
    (params.chainIds ?? supportedChainIds).map((chainId) => getChainProposalFeed(client, chainId, limit, timestamp)),
  );

  return chains.flat().sort((a, b) => b.creationTime - a.creationTime);
}

async function getChainProposalFeed(
  client: DtfClient,
  chainId: SupportedChainId,
  limit: number,
  timestamp: number,
): Promise<readonly IndexDtfProposalFeedItem[]> {
  const [directory, proposals] = await Promise.all([
    loadGovernedDtfDirectory(client, chainId),
    fetchSubgraphPages(async (offset, pageSize) => {
      const data = await client.subgraph.queryIndex({
        chainId,
        query: GetAllIndexDtfProposalsDocument,
        variables: { limit: pageSize, offset },
      });

      return data.proposals;
    }, limit),
  ]);

  const parsed = proposals.map((proposal) => ({
    ...mapIndexDtfProposalSummary(proposal, chainId),
    dtfs: directory.forGovernanceOrVault(proposal.governance.id, proposal.governance.token.id),
    forDelegateVotes: Number(proposal.forDelegateVotes),
    againstDelegateVotes: Number(proposal.againstDelegateVotes),
    abstainDelegateVotes: Number(proposal.abstainDelegateVotes),
  }));

  return withProposalSummaryState(parsed, timestamp);
}
