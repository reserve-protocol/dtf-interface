import type { IndexDtfFull } from "@reserve-protocol/sdk";

import { useFullIndexDtf } from "@/hooks";
import { mapIndexDtfData, type IndexDtfData } from "@/index-dtf/index-dtf-data";
import { useIndexDtfIdentity } from "@/index-dtf/index-dtf-provider";
import type { DtfQueryOptions } from "@/query";

export function useCurrentIndexDtf(options?: Omit<DtfQueryOptions<IndexDtfFull, IndexDtfData>, "select">) {
  const identity = useIndexDtfIdentity();

  return useFullIndexDtf<IndexDtfData>({ ...identity, brand: true }, { ...options, select: mapIndexDtfData });
}
