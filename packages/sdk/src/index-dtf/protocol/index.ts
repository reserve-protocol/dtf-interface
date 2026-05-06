import {
  indexDtfs as indexDtfCatalog,
  type CatalogIndexDTF as CatalogIndexDtf,
} from "@dtf-interface/dtf-catalog";
import type { DtfClient } from "../../client.js";
import type { ListIndexDtfsParams } from "../../types/protocol.js";

export async function listIndexDtfs(
  _client: DtfClient,
  params: ListIndexDtfsParams = {},
): Promise<readonly CatalogIndexDtf[]> {
  const statuses = params.status
    ? new Set(Array.isArray(params.status) ? params.status : [params.status])
    : undefined;

  return Object.values(indexDtfCatalog)
    .flatMap((dtfs) => Object.values(dtfs))
    .filter((dtf) => (params.chainId ? dtf.chainId === params.chainId : true))
    .filter((dtf) => (statuses ? statuses.has(dtf.status) : true));
}
