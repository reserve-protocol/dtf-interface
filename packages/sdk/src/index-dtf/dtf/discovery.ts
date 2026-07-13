import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { ReserveApiDtfPrice } from "@/client/api";
import type { SupportedChainId } from "@/config";
import type { DtfBrand, DtfBasketSummaryAsset, DtfPerformancePoint, DtfStatus } from "@/types/common";

export type DiscoverIndexDtfsParams = {
  readonly chainId?: SupportedChainId;
  readonly brand?: boolean;
  readonly performance?: boolean;
  readonly limit?: number;
  readonly offset?: number;
  readonly sort?: string;
};

export type DiscoverIndexDtfsByChainParams = Omit<DiscoverIndexDtfsParams, "chainId"> & {
  readonly chainId: SupportedChainId;
};

export type IndexDtfDiscoveryItem = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly status: DtfStatus;
  readonly name?: string;
  readonly symbol?: string;
  readonly price?: number;
  readonly fee?: number;
  readonly marketCap?: number;
  readonly basket?: readonly DtfBasketSummaryAsset[];
  readonly performance?: readonly DtfPerformancePoint[];
  readonly brand?: DtfBrand;
};

type DiscoveryPath = "/discover/dtf" | "/discover/dtfs";

type RawDiscoveryItem = Omit<IndexDtfDiscoveryItem, "address" | "basket" | "chainId" | "status"> & {
  readonly address: string;
  readonly chainId: number;
  readonly status?: DtfStatus;
  readonly type?: string;
  readonly basket?: readonly (Omit<DtfBasketSummaryAsset, "address"> & {
    readonly address: string;
  })[];
};

type SubgraphDiscoveryDtf = {
  readonly id: string;
  readonly annualizedTvlFee: string;
  readonly timestamp: string;
  readonly token: {
    readonly name: string;
    readonly symbol: string;
  };
};

type SubgraphDiscoveryResponse = {
  readonly dtfs: readonly SubgraphDiscoveryDtf[];
};

export type DiscoverIndexDtfsFromSubgraphParams = {
  readonly chainId: SupportedChainId;
  readonly first?: number;
  readonly skip?: number;
  readonly excludeAddresses?: readonly Address[];
};

const SUBGRAPH_DISCOVERY_QUERY = `
  query DiscoverIndexDtfsFromSubgraph($first: Int!, $skip: Int!) {
    dtfs(first: $first, skip: $skip, orderBy: timestamp, orderDirection: desc) {
      id
      annualizedTvlFee
      timestamp
      token {
        name
        symbol
      }
    }
  }
`;

/**
 * Discovers Index DTFs from Reserve API, including optional Register-style
 * performance and brand fields when requested.
 */
export async function discoverIndexDtfs(
  client: DtfClient,
  params: DiscoverIndexDtfsParams = {},
): Promise<readonly IndexDtfDiscoveryItem[]> {
  const response = await fetchDiscoveryItems(client, "/discover/dtfs", params);

  return response.filter(isIndexDiscoveryItem).map(mapDiscoveryItem);
}

/** Discovers Index DTFs from the chain-scoped Reserve API endpoint. */
export async function discoverIndexDtfsByChain(
  client: DtfClient,
  params: DiscoverIndexDtfsByChainParams,
): Promise<readonly IndexDtfDiscoveryItem[]> {
  const response = await fetchDiscoveryItems(client, "/discover/dtf", params);

  return response.filter(isIndexDiscoveryItem).map(mapDiscoveryItem);
}

/**
 * Discovers freshly indexed Index DTFs from the subgraph and enriches them with
 * current Reserve API pricing. Curated `/discover/dtf` can lag new deploys.
 */
export async function discoverIndexDtfsFromSubgraph(
  client: DtfClient,
  params: DiscoverIndexDtfsFromSubgraphParams,
): Promise<readonly IndexDtfDiscoveryItem[]> {
  const first = params.first ?? 1000;
  const skip = params.skip ?? 0;
  const excluded = new Set((params.excludeAddresses ?? []).map((address) => getAddress(address).toLowerCase()));
  const data = await client.subgraph.queryIndex<SubgraphDiscoveryResponse, { first: number; skip: number }>({
    chainId: params.chainId,
    query: SUBGRAPH_DISCOVERY_QUERY,
    variables: { first, skip },
  });
  const dtfs = data.dtfs.filter((dtf) => !excluded.has(dtf.id.toLowerCase()));
  const currentByAddress = await getDtfPricesByAddress(
    client,
    params.chainId,
    dtfs.map((dtf) => getAddress(dtf.id)),
  );

  return dtfs.flatMap((dtf) => {
    const current = currentByAddress.get(dtf.id.toLowerCase());

    return current ? [mapSubgraphDiscoveryItem(dtf, current, params.chainId)] : [];
  });
}

/**
 * Reads the API-backed active/deprecated/unsupported status for one Index DTF.
 */
export async function getIndexDtfStatus(
  client: DtfClient,
  params: { readonly address: Address; readonly chainId: SupportedChainId },
): Promise<DtfStatus> {
  const address = getAddress(params.address);
  const items = await fetchDiscoveryItems(client, "/discover/dtfs", {});
  const item = items.find(
    (dtf) =>
      isIndexDiscoveryItem(dtf) &&
      dtf.chainId === params.chainId &&
      dtf.address.toLowerCase() === address.toLowerCase(),
  );

  return item?.status ?? "active";
}

/**
 * Reads Index DTF statuses in one API request for list/status screens.
 */
export async function getIndexDtfStatuses(
  client: DtfClient,
  params: DiscoverIndexDtfsParams = {},
): Promise<readonly Pick<IndexDtfDiscoveryItem, "address" | "chainId" | "status">[]> {
  const items = await discoverIndexDtfs(client, params);

  return items.map((item) => ({
    address: item.address,
    chainId: item.chainId,
    status: item.status,
  }));
}

function mapDiscoveryItem(item: RawDiscoveryItem): IndexDtfDiscoveryItem {
  return {
    address: getAddress(item.address),
    chainId: item.chainId as SupportedChainId,
    status: item.status ?? "active",
    ...(item.name ? { name: item.name } : {}),
    ...(item.symbol ? { symbol: item.symbol } : {}),
    ...(item.price === undefined ? {} : { price: item.price }),
    ...(item.fee === undefined ? {} : { fee: item.fee }),
    ...(item.marketCap === undefined ? {} : { marketCap: item.marketCap }),
    ...(item.performance ? { performance: item.performance } : {}),
    ...(item.brand ? { brand: item.brand } : {}),
    ...(item.basket ? { basket: item.basket.map((asset) => ({ ...asset, address: getAddress(asset.address) })) } : {}),
  };
}

function mapSubgraphDiscoveryItem(
  item: SubgraphDiscoveryDtf,
  current: ReserveApiDtfPrice,
  chainId: SupportedChainId,
): IndexDtfDiscoveryItem {
  return {
    address: getAddress(item.id),
    chainId,
    status: "active",
    name: item.token.name,
    symbol: item.token.symbol,
    price: current.price,
    ...(current.marketCap === undefined ? {} : { marketCap: current.marketCap }),
    fee: Number(item.annualizedTvlFee) / 1e16,
    basket: current.basket.map((asset) => ({
      address: getAddress(asset.address),
      name: asset.name ?? asset.symbol ?? getAddress(asset.address),
      symbol: asset.symbol ?? asset.name ?? getAddress(asset.address),
      weight: asset.weight,
    })),
    ...(item.timestamp && current.price
      ? { performance: [{ timestamp: Number(item.timestamp), value: current.price }] }
      : {}),
  };
}

function isIndexDiscoveryItem(item: RawDiscoveryItem): boolean {
  return item.type === undefined || item.type === "index";
}

function fetchDiscoveryItems(
  client: DtfClient,
  path: DiscoveryPath,
  params: DiscoverIndexDtfsParams,
): Promise<readonly RawDiscoveryItem[]> {
  return client.api.get<readonly RawDiscoveryItem[]>({
    path,
    query: {
      chainId: params.chainId,
      brand: params.brand,
      performance: params.performance,
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
    },
  });
}

async function getDtfPricesByAddress(
  client: DtfClient,
  chainId: SupportedChainId,
  addresses: readonly Address[],
): Promise<ReadonlyMap<string, ReserveApiDtfPrice>> {
  const rows: ReserveApiDtfPrice[] = [];

  for (let i = 0; i < addresses.length; i += 25) {
    const chunk = addresses.slice(i, i + 25);

    try {
      rows.push(...(await client.api.getDtfPrices({ chainId, addresses: chunk })));
    } catch {
      for (const address of chunk) {
        try {
          rows.push(...(await client.api.getDtfPrices({ chainId, addresses: [address] })));
        } catch {
          // Fresh/internal discovery is best-effort; one unpriced DTF should not break the page.
        }
      }
    }
  }

  return new Map(rows.map((row) => [getAddress(row.address).toLowerCase(), row]));
}
