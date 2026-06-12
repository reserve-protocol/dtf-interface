import type { IndexDtfFull } from "@reserve-protocol/sdk";

import type { DtfQueryOptions } from "@/query";

import { useIndexDtf } from "@/hooks";
import { mapIndexDtfData, type IndexDtfData } from "@/index-dtf/index-dtf-data";
import { useIndexDtfIdentity } from "@/index-dtf/index-dtf-provider";

export function useCurrentIndexDtf(options?: Omit<DtfQueryOptions<IndexDtfFull, IndexDtfData>, "select">) {
  const identity = useIndexDtfIdentity();

  return useIndexDtf<IndexDtfData>({ ...identity, brand: true }, { ...options, select: mapIndexDtfData });
}
