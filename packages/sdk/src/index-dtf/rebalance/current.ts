import type { PriceControl } from "@reserve-protocol/dtf-rebalance-lib";

import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { IndexDtfCurrentRebalance, PriceRange, RebalanceLimits, WeightRange } from "@/index-dtf/rebalance/types";
import type { DtfParams } from "@/types/common";
import type { IndexDtfTotalAssets } from "@/types/index-dtf";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { getTotalAssets, getTotalSupply } from "@/index-dtf/dtf/index";

export type IndexDtfCurrentRebalanceState = {
  readonly rebalance: IndexDtfCurrentRebalance;
  readonly totalSupply: bigint;
  readonly totalAssets: IndexDtfTotalAssets;
};

/**
 * Reads live v5 rebalance state from RPC together with current supply/assets.
 */
export async function getIndexDtfCurrentRebalance(
  client: DtfClient,
  params: DtfParams,
): Promise<IndexDtfCurrentRebalanceState> {
  const [raw, totalSupply, totalAssets] = await Promise.all([
    client.viem.readContract({
      address: getAddress(params.address),
      abi: dtfIndexAbi,
      functionName: "getRebalance",
      chainId: params.chainId,
      blockNumber: params.blockNumber,
    }),
    getTotalSupply(client, params),
    getTotalAssets(client, params),
  ]);

  return {
    rebalance: mapCurrentRebalance(raw as unknown as readonly unknown[]),
    totalSupply,
    totalAssets,
  };
}

export function mapCurrentRebalance(raw: readonly unknown[]): IndexDtfCurrentRebalance {
  const tokens = raw[2] as readonly RawTokenRebalance[];

  return {
    nonce: raw[0] as bigint,
    priceControl: Number(raw[1]) as PriceControl,
    tokens: tokens.map((token) => ({
      token: getAddress(readTupleValue(token, "token", 0) as Address),
      weight: mapWeight(readTupleValue(token, "weight", 1)),
      price: mapPrice(readTupleValue(token, "price", 2)),
      maxAuctionSize: readTupleValue(token, "maxAuctionSize", 3) as bigint,
      inRebalance: readTupleValue(token, "inRebalance", 4) as boolean,
    })),
    limits: mapLimits(raw[3]),
    timestamps: {
      startedAt: readTupleValue(raw[4], "startedAt", 0) as bigint,
      restrictedUntil: readTupleValue(raw[4], "restrictedUntil", 1) as bigint,
      availableUntil: readTupleValue(raw[4], "availableUntil", 2) as bigint,
    },
    bidsEnabled: raw[5] as boolean,
  };
}

type RawTokenRebalance = Record<string, unknown> | readonly unknown[];

function mapWeight(value: unknown): WeightRange {
  return {
    low: readTupleValue(value, "low", 0) as bigint,
    spot: readTupleValue(value, "spot", 1) as bigint,
    high: readTupleValue(value, "high", 2) as bigint,
  };
}

function mapPrice(value: unknown): PriceRange {
  return {
    low: readTupleValue(value, "low", 0) as bigint,
    high: readTupleValue(value, "high", 1) as bigint,
  };
}

function mapLimits(value: unknown): RebalanceLimits {
  return mapWeight(value);
}

function readTupleValue(value: unknown, key: string, index: number): unknown {
  if (Array.isArray(value)) {
    return value[index];
  }

  return (value as Record<string, unknown>)[key];
}
