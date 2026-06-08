import type { DtfSdk } from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

type Params = Parameters<DtfSdk["index"]["getOptimisticTimelockRoles"]>[0];
type Result = Awaited<ReturnType<DtfSdk["index"]["getOptimisticTimelockRoles"]>>;

export function indexDtfOptimisticTimelockRolesQueryOptions<TData = Result>(
  sdk: DtfSdk,
  params: Params | undefined,
  options?: DtfQueryOptions<Result, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.optimisticTimelockRoles(params),
    () => sdk.index.getOptimisticTimelockRoles(requireParams(params, "indexDtfOptimisticTimelockRolesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfOptimisticTimelockRoles<TData = Result>(
  params: Params | undefined,
  options?: DtfQueryOptions<Result, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfOptimisticTimelockRolesQueryOptions(sdk, params, options));
}
