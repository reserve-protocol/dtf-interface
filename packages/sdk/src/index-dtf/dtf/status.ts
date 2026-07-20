import type { Address } from "viem";

import { indexDtfs } from "@reserve-protocol/dtf-catalog";

import type { SupportedChainId } from "@/config";
import type { DtfStatus } from "@/types/common";

export type GetIndexDtfStatusParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
};

/**
 * Reads the curated catalog listing status for one Index DTF. DTFs absent from
 * the catalog are active.
 */
export function getIndexDtfStatus(params: GetIndexDtfStatusParams): DtfStatus {
  const address = params.address.toLowerCase();
  const entries = Object.entries(indexDtfs[params.chainId] ?? {});
  const entry = entries.find(([key]) => key.toLowerCase() === address)?.[1];

  return entry?.status ?? "active";
}
