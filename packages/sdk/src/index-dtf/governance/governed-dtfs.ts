import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { GovernedIndexDtf } from "@/types/governance";

import { getDtfProposalGovernanceIds } from "@/index-dtf/governance/utils";
import { GetIndexDtfDirectoryDocument } from "@/index-dtf/subgraph/dtf.generated";
import { walkSubgraphById } from "@/lib/subgraph-pages";

export type GovernedDtfDirectory = {
  /** DTFs whose proposals a governance can carry: owner, trading, and vault governances, current or legacy. */
  readonly forGovernance: (governanceId: string) => readonly GovernedIndexDtf[];
  /** DTFs currently staked through a vote-lock vault. */
  readonly forVault: (stToken: string) => readonly GovernedIndexDtf[];
};

/** Reads that mount together share one directory walk per chain for this long. */
const DIRECTORY_TTL_MS = 60_000;

type DirectoryEntry = { readonly expires: number; readonly directory: Promise<GovernedDtfDirectory> };
const directories = new WeakMap<DtfClient, Map<SupportedChainId, DirectoryEntry>>();

/**
 * Reverse index of `getDtfProposalGovernanceIds` over every DTF on a chain, so a
 * proposal's governance resolves to its DTF even after the DTF replaced that
 * governance or migrated to another vault. Memoized per client and chain for
 * `DIRECTORY_TTL_MS`; a failed walk is not kept.
 */
export function loadGovernedDtfDirectory(client: DtfClient, chainId: SupportedChainId): Promise<GovernedDtfDirectory> {
  const perChain = directories.get(client) ?? new Map<SupportedChainId, DirectoryEntry>();
  directories.set(client, perChain);
  const cached = perChain.get(chainId);

  if (cached && cached.expires > Date.now()) {
    return cached.directory;
  }

  const directory = walkGovernedDtfDirectory(client, chainId).catch((error: unknown) => {
    perChain.delete(chainId);
    throw error;
  });
  perChain.set(chainId, { expires: Date.now() + DIRECTORY_TTL_MS, directory });

  return directory;
}

async function walkGovernedDtfDirectory(client: DtfClient, chainId: SupportedChainId): Promise<GovernedDtfDirectory> {
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
    const governanceIds = getDtfProposalGovernanceIds({
      ...dtf,
      stToken: dtf.stToken ?? { governance: null, legacyGovernance: [] },
    });
    for (const governanceId of governanceIds) {
      add(byGovernance, governanceId, ref);
    }
    if (dtf.stToken) {
      add(byVault, dtf.stToken.id, ref);
    }
  }

  return {
    forGovernance: (governanceId) => byGovernance.get(governanceId.toLowerCase()) ?? [],
    forVault: (stToken) => byVault.get(stToken.toLowerCase()) ?? [],
  };
}
