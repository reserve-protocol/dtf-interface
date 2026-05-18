import { indexDtfs as indexDtfCatalog, type CatalogIndexDTF as CatalogIndexDtf } from "@dtf-interface/dtf-catalog";
import { getAddress, isAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { ListIndexDtfsParams } from "@/types/protocol";

export type IndexDtfCatalogEntry = CatalogIndexDtf & {
  readonly address: Address;
};

export type ResolveIndexDtfAliasParams = {
  readonly input: string;
  readonly chainId?: SupportedChainId;
  readonly status?: ListIndexDtfsParams["status"];
};

export type ResolvedIndexDtfAlias = IndexDtfCatalogEntry;

export type AmbiguousIndexDtfAlias = {
  readonly ambiguous: readonly Pick<IndexDtfCatalogEntry, "address" | "chainId" | "name" | "symbol" | "status">[];
};

export async function listIndexDtfs(
  _client: DtfClient,
  params: ListIndexDtfsParams = {},
): Promise<readonly IndexDtfCatalogEntry[]> {
  return getIndexDtfCatalogEntries(params);
}

export function getIndexDtfCatalogEntries(params: ListIndexDtfsParams = {}): readonly IndexDtfCatalogEntry[] {
  const statuses = params.status ? new Set(Array.isArray(params.status) ? params.status : [params.status]) : undefined;

  return Object.values(indexDtfCatalog)
    .flatMap((dtfs) => Object.values(dtfs))
    .filter((dtf) => (params.chainId ? dtf.chainId === params.chainId : true))
    .filter((dtf) => (statuses ? statuses.has(dtf.status) : true))
    .map((dtf) => ({ ...dtf, address: getAddress(dtf.address) }));
}

export function resolveIndexDtfAlias(
  params: ResolveIndexDtfAliasParams,
): ResolvedIndexDtfAlias | AmbiguousIndexDtfAlias | null {
  const input = params.input.trim().toLowerCase();
  if (!input) {
    return null;
  }

  const entries = getIndexDtfCatalogEntries({
    ...(params.chainId !== undefined ? { chainId: params.chainId } : {}),
    ...(params.status !== undefined ? { status: params.status } : {}),
  });
  const matches = isAddress(input)
    ? entries.filter((dtf) => dtf.address.toLowerCase() === input)
    : getAliasMatches(entries, input);

  if (matches.length === 0) {
    return null;
  }
  if (matches.length === 1) {
    return matches[0]!;
  }

  return {
    ambiguous: matches.map((dtf) => ({
      address: dtf.address,
      chainId: dtf.chainId,
      name: dtf.name,
      symbol: dtf.symbol,
      status: dtf.status,
    })),
  };
}

function getAliasMatches(entries: readonly IndexDtfCatalogEntry[], input: string): readonly IndexDtfCatalogEntry[] {
  const symbolMatches = entries.filter((dtf) => dtf.symbol.toLowerCase() === input);

  return symbolMatches.length > 0 ? symbolMatches : entries.filter((dtf) => dtf.name.toLowerCase().includes(input));
}
