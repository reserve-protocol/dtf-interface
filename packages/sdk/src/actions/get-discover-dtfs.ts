import { apiGet } from "../transports/api.js";
import type { DtfClientOptions } from "../client.js";
import type { SupportedChainId } from "../defaults.js";
import type { DtfStatus } from "../types/common.js";

export type DiscoverDtf = {
  readonly address: string;
  readonly chainId: number;
  readonly status: DtfStatus;
};

export type GetDiscoverDtfsOptions = DtfClientOptions & {
  readonly chainId?: SupportedChainId;
  readonly limit?: number;
  readonly offset?: number;
  readonly sort?: string;
};

export async function getDiscoverDtfs({
  chainId,
  client,
  limit,
  offset,
  sort,
}: GetDiscoverDtfsOptions = {}): Promise<readonly DiscoverDtf[]> {
  const dtfs = await apiGet<readonly DiscoverDtf[]>({
    path: "/discover/dtfs",
    query: {
      chainId,
      limit,
      offset,
      sort,
    },
    client,
  });

  return dtfs.map((dtf) => ({
    ...dtf,
    address: dtf.address.toLowerCase(),
    status: dtf.status ?? "active",
  }));
}
