import type { DtfSdk, GetIndexDtfDelegatesParams, IndexDtfDelegate } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

export function indexDtfDelegatesQueryOptions<TData = readonly IndexDtfDelegate[]>(
  sdk: DtfSdk,
  params: GetIndexDtfDelegatesParams | undefined,
  options?: DtfQueryOptions<readonly IndexDtfDelegate[], TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.delegates(params),
    () => sdk.index.getDelegates(requireParams(params, "indexDtfDelegatesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfDelegates<TData = readonly IndexDtfDelegate[]>(
  params: GetIndexDtfDelegatesParams | undefined,
  options?: DtfQueryOptions<readonly IndexDtfDelegate[], TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfDelegatesQueryOptions(sdk, params, options));
}
