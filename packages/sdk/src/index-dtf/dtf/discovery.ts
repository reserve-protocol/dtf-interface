import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/defaults";
import type { DtfBrand, DtfBasketSummaryAsset, DtfPerformancePoint, DtfStatus } from "@/types/common";

export type DiscoverIndexDtfsParams = {
  readonly chainId?: SupportedChainId;
  readonly brand?: boolean;
  readonly performance?: boolean;
  readonly limit?: number;
  readonly offset?: number;
  readonly sort?: string;
};

export type DiscoverIndexDtfsByChainParams = Omit<
  DiscoverIndexDtfsParams,
  "chainId"
> & {
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
 * Reads the API-backed active/deprecated/unsupported status for one Index DTF.
 */
export async function getIndexDtfStatus(
  client: DtfClient,
  params: { readonly address: Address; readonly chainId: SupportedChainId },
): Promise<DtfStatus> {
  const address = getAddress(params.address);
  const limit = 1000;
  let offset = 0;

  while (true) {
    const items = await fetchDiscoveryItems(client, "/discover/dtfs", {
      chainId: params.chainId,
      limit,
      offset,
    });
    const item = items.find(
      (dtf) => isIndexDiscoveryItem(dtf) && dtf.address.toLowerCase() === address.toLowerCase(),
    );

    if (item) {
      return item.status ?? "active";
    }

    if (items.length < limit) {
      return "active";
    }

    offset += limit;
  }
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
