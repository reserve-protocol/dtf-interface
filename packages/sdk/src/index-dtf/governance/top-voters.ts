import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { GetIndexDtfTopVotersQuery } from "@/index-dtf/subgraph/dtf.generated";
import type { GetIndexDtfTopVotersParams, IndexDtfTopVoter } from "@/types/governance";

import { supportedChainIds } from "@/config";
import { mapGovernedDtfs, mapVaultShareToken, mapVaultUnderlying } from "@/index-dtf/governance/vault-context";
import { GetIndexDtfTopVotersDocument } from "@/index-dtf/subgraph/dtf.generated";
import { mapAmount } from "@/lib/utils";

const DEFAULT_TOP_VOTER_LIMIT = 20;

/**
 * Reads the most active voters across every Index DTF vote-lock vault, ranked by
 * standard proposals voted on. Optimistic votes are reported but do not rank.
 */
export async function getTopVoters(
  client: DtfClient,
  params: GetIndexDtfTopVotersParams = {},
): Promise<readonly IndexDtfTopVoter[]> {
  const limit = params.limit ?? DEFAULT_TOP_VOTER_LIMIT;
  const byChain = await client.subgraph.queryIndexAll({
    chainIds: params.chainIds ?? supportedChainIds,
    query: GetIndexDtfTopVotersDocument,
    variables: { limit },
  });

  return Object.entries(byChain)
    .flatMap(([chainId, data]) =>
      data.delegates.flatMap((delegate) => mapTopVoter(delegate, Number(chainId) as SupportedChainId)),
    )
    .sort((a, b) => b.numberVotes - a.numberVotes)
    .slice(0, limit);
}

function mapTopVoter(
  delegate: GetIndexDtfTopVotersQuery["delegates"][number],
  chainId: SupportedChainId,
): readonly IndexDtfTopVoter[] {
  const underlying = mapVaultUnderlying(delegate.token.underlying);

  if (!underlying) {
    return [];
  }

  return [
    {
      chainId,
      address: getAddress(delegate.address),
      stToken: mapVaultShareToken(delegate.token),
      underlying,
      numberVotes: delegate.numberVotes,
      numberOptimisticVotes: delegate.numberOptimisticVotes,
      delegatedVotes: mapAmount(delegate.delegatedVotesRaw, delegate.token.token.decimals),
      tokenHoldersRepresented: delegate.tokenHoldersRepresentedAmount,
      dtfs: mapGovernedDtfs(delegate.token, chainId),
    },
  ];
}
