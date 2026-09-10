import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { GetIndexDtfTopVotersQuery } from "@/index-dtf/subgraph/dtf.generated";
import type { GetIndexDtfTopVotersParams, IndexDtfTopVoter } from "@/types/governance";

import { supportedChainIds } from "@/config";
import { loadGovernedDtfDirectory, type GovernedDtfDirectory } from "@/index-dtf/governance/governed-dtfs";
import { mapVaultShareToken, mapVaultUnderlying } from "@/index-dtf/governance/vault-context";
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
  const chains = await Promise.all(
    (params.chainIds ?? supportedChainIds).map(async (chainId) => {
      const [directory, { delegates }] = await Promise.all([
        loadGovernedDtfDirectory(client, chainId),
        client.subgraph.queryIndex({ chainId, query: GetIndexDtfTopVotersDocument, variables: { limit } }),
      ]);

      return delegates.flatMap((delegate) => mapTopVoter(delegate, chainId, directory));
    }),
  );

  return chains
    .flat()
    .sort((a, b) => b.numberVotes - a.numberVotes)
    .slice(0, limit);
}

function mapTopVoter(
  delegate: GetIndexDtfTopVotersQuery["delegates"][number],
  chainId: SupportedChainId,
  directory: GovernedDtfDirectory,
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
      dtfs: directory.forVault(delegate.token.id),
    },
  ];
}
