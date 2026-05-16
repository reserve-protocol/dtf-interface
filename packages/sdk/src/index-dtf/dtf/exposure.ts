import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";

export type IndexDtfExposurePeriod = "24h" | "7d" | "1m" | "3m" | "1y" | "all";

export type IndexDtfExposureToken = {
  readonly address: Address;
  readonly symbol: string;
  readonly name?: string;
  readonly weight: number;
  readonly marketCap?: number;
  readonly change?: number;
  readonly bridge?: unknown;
};

export type IndexDtfExposureGroup = {
  readonly native: unknown;
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
