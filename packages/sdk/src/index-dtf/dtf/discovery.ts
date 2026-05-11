import { getAddress, type Address } from "viem";

import type { DtfClient } from "../../client.js";
import type { SupportedChainId } from "../../defaults.js";
import type { DtfBrand, DtfBasketSummaryAsset, DtfPerformancePoint, DtfStatus } from "../../types/common.js";

export type DiscoverIndexDtfsParams = {
  readonly chainId?: SupportedChainId;
  readonly brand?: boolean;
  readonly performance?: boolean;
  readonly limit?: number;
  readonly offset?: number;
  readonly sort?: string;
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

type RawDiscoveryItem = Omit<IndexDtfDiscoveryItem, "address" | "basket" | "chainId"> & {
  readonly address: string;
  readonly chainId: number;
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
  const response = await client.api.get<readonly RawDiscoveryItem[]>({
    path: "/discover/dtfs",
    query: {
      chainId: params.chainId,
      brand: params.brand,
      performance: params.performance,
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
    },
  });

  return response.filter((item) => item.type === undefined || item.type === "index").map(mapDiscoveryItem);
}

/**
 * Reads the API-backed active/deprecated/unsupported status for one Index DTF.
 */
export async function getIndexDtfStatus(
  client: DtfClient,
  params: { readonly address: Address; readonly chainId: SupportedChainId },
): Promise<DtfStatus> {
  const address = getAddress(params.address);
  const items = await discoverIndexDtfs(client, { chainId: params.chainId, limit: 1000 });
  const item = items.find((dtf) => dtf.address.toLowerCase() === address.toLowerCase());

  return item?.status ?? "unsupported";
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
