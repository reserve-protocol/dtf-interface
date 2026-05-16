import type { DiscoverDtf, DtfClientApi, GetDiscoverDtfsOptions } from "@/types/api";

export async function getDiscoverDtfs(
  client: { readonly api: DtfClientApi },
  { chainId, limit, offset, sort }: GetDiscoverDtfsOptions = {},
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
