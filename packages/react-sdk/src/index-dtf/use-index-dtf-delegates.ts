import type { DtfSdk, GetIndexDtfDelegatesParams, IndexDtfDelegates } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

export function indexDtfDelegatesQueryOptions<TData = IndexDtfDelegates>(
  sdk: DtfSdk,
  params: GetIndexDtfDelegatesParams | undefined,
  options?: DtfQueryOptions<IndexDtfDelegates, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.delegates(params),
    () => sdk.index.getDelegates(requireParams(params, "indexDtfDelegatesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfDelegates<TData = IndexDtfDelegates>(
  params: GetIndexDtfDelegatesParams | undefined,
  options?: DtfQueryOptions<IndexDtfDelegates, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfDelegatesQueryOptions(sdk, params, options));
}
