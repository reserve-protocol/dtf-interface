import type { DtfClient } from "../client.js";
import type { SupportedChainId } from "../defaults.js";
import type { DtfStatus } from "../types/common.js";

export type DiscoverDtf = {
  readonly address: string;
  readonly chainId: number;
  readonly status: DtfStatus;
};

export type GetDiscoverDtfsOptions = {
  readonly chainId?: SupportedChainId;
  readonly limit?: number;
  readonly offset?: number;
  readonly sort?: string;
};

export async function getDiscoverDtfs(
  client: DtfClient,
  {
    chainId,
    limit,
    offset,
    sort,
  }: GetDiscoverDtfsOptions = {},
): Promise<readonly DiscoverDtf[]> {
  const dtfs = await client.api.get<readonly DiscoverDtf[]>({
    path: "/discover/dtfs",
    query: {
      chainId,
      limit,
      offset,
      sort,
    },
  });

  return dtfs.map((dtf) => ({
    ...dtf,
    address: dtf.address.toLowerCase(),
    status: dtf.status ?? "active",
  }));
}
