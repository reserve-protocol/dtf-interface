import type { DtfSdk, GetIndexDtfGuardiansParams, IndexDtfGuardians } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

export function indexDtfGuardiansQueryOptions<TData = IndexDtfGuardians>(
  sdk: DtfSdk,
  params: GetIndexDtfGuardiansParams | undefined,
  options?: DtfQueryOptions<IndexDtfGuardians, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.guardians(params),
    () => sdk.index.getGuardians(requireParams(params, "indexDtfGuardiansQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfGuardians<TData = IndexDtfGuardians>(
  params: GetIndexDtfGuardiansParams | undefined,
  options?: DtfQueryOptions<IndexDtfGuardians, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfGuardiansQueryOptions(sdk, params, options));
}
