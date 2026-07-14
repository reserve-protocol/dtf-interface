import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";

export type IndexDtfExposurePeriod = "24h" | "7d" | "1m" | "3m" | "1y" | "ytd" | "all";

/** The bridge protocol wrapping a tokenized asset, when the group is bridged. */
export type IndexDtfExposureBridge = {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly logo: string;
  readonly logoDark?: string | null;
  readonly risks: readonly string[];
  readonly wrappedVersion: boolean;
};

/** The underlying real-world asset a group tracks (a tradfi equity, a native L1 coin). */
export type IndexDtfExposureNative = {
  readonly symbol: string;
  readonly name: string;
  readonly logo: string;
  readonly caip2: string;
  readonly address?: string;
  readonly url?: string;
  readonly coingeckoId?: string;
  readonly marketCap?: number;
  readonly price?: number;
  readonly priceChange7d?: number;
};

export type IndexDtfExposureToken = {
  readonly address: Address;
  readonly symbol: string;
  readonly name?: string;
  readonly weight: number;
  /** On-chain (tokenized supply) market cap — the Collateral-tab figure. */
  readonly marketCap?: number;
  /** Real-company market cap for tokenized equities — the Exposure-tab figure. */
  readonly underlyingMarketCap?: number;
  readonly change?: number;
  readonly bridge?: IndexDtfExposureBridge;
};

export type IndexDtfExposureGroup = {
  readonly native: IndexDtfExposureNative;
  readonly tokens: readonly IndexDtfExposureToken[];
  readonly totalWeight: number;
  readonly change?: number;
  readonly hasNewlyAdded?: boolean;
  readonly marketCap?: number;
};

type RawExposureGroup = Omit<IndexDtfExposureGroup, "tokens"> & {
  readonly tokens: readonly (Omit<IndexDtfExposureToken, "address"> & {
    readonly address: string;
  })[];
};

export type GetIndexDtfExposureParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly period?: IndexDtfExposurePeriod;
};

/**
 * Reads Register's exposure grouping for an Index DTF overview/factsheet view.
 */
export async function getIndexDtfExposure(
  client: DtfClient,
  params: GetIndexDtfExposureParams,
): Promise<readonly IndexDtfExposureGroup[]> {
  const response = await client.api.get<readonly RawExposureGroup[]>({
    path: "/dtf/exposure",
    query: {
      address: getAddress(params.address).toLowerCase(),
      chainId: params.chainId,
      period: params.period ?? "24h",
    },
  });

  return response.map((group) => ({
    ...group,
    tokens: group.tokens.map((token) => ({
      ...token,
      address: getAddress(token.address),
    })),
  }));
}
