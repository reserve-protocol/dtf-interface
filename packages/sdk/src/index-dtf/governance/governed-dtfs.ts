import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { GovernedIndexDtf } from "@/types/governance";

import { GetIndexDtfDirectoryDocument } from "@/index-dtf/subgraph/dtf.generated";
import { walkSubgraphById } from "@/lib/subgraph-pages";

export type GovernedDtfDirectory = {
  /** DTFs a governance controls as owner or trading governance, current or legacy. */
  readonly forGovernance: (governanceId: string) => readonly GovernedIndexDtf[];
  /** DTFs currently staked through a vote-lock vault. */
  readonly forVault: (stToken: string) => readonly GovernedIndexDtf[];
  /** Direct governance match first; a vault DAO governance (no direct match) resolves to every DTF on its vault. */
  readonly forGovernanceOrVault: (governanceId: string, stToken: string) => readonly GovernedIndexDtf[];
};

/**
 * Resolves governance and vault addresses to DTFs from the DTF side of the
 * subgraph, so proposals from a governance a DTF has since replaced, or on a
 * vault it has since migrated away from, still attribute to that DTF.
 */
export async function loadGovernedDtfDirectory(
  client: DtfClient,
  chainId: SupportedChainId,
): Promise<GovernedDtfDirectory> {
  const dtfs = await walkSubgraphById(async (cursor, pageSize) => {
    const data = await client.subgraph.queryIndex({
      chainId,
      query: GetIndexDtfDirectoryDocument,
      variables: { limit: pageSize, cursor },
    });

    return data.dtfs;
  }, "dtfs");

  const byGovernance = new Map<string, GovernedIndexDtf[]>();
  const byVault = new Map<string, GovernedIndexDtf[]>();
  const add = (map: Map<string, GovernedIndexDtf[]>, key: string, dtf: GovernedIndexDtf) => {
    const list = map.get(key.toLowerCase()) ?? [];
    list.push(dtf);
    map.set(key.toLowerCase(), list);
  };

  for (const dtf of dtfs) {
    const ref: GovernedIndexDtf = {
      address: getAddress(dtf.id),
      chainId,
      symbol: dtf.token.symbol,
      name: dtf.token.name,
    };
    const governances = [
      dtf.ownerGovernance?.id,
      dtf.tradingGovernance?.id,
      ...dtf.legacyAdmins,
      ...dtf.legacyAuctionApprovers,
    ];
    for (const governance of new Set(governances)) {
      if (governance) add(byGovernance, governance, ref);
    }
    if (dtf.stToken) add(byVault, dtf.stToken.id, ref);
  }

  const forGovernance = (governanceId: string) => byGovernance.get(governanceId.toLowerCase()) ?? [];
  const forVault = (stToken: string) => byVault.get(stToken.toLowerCase()) ?? [];

  return {
    forGovernance,
    forVault,
    forGovernanceOrVault: (governanceId, stToken) => {
      const direct = forGovernance(governanceId);
      return direct.length > 0 ? direct : forVault(stToken);
    },
  };
}
