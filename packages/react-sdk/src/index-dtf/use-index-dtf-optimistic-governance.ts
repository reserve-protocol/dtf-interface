import type { DtfSdk, GetIndexDtfOptimisticGovernanceParams, IndexDtfOptimisticGovernance } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

export function indexDtfOptimisticGovernanceQueryOptions<TData = IndexDtfOptimisticGovernance>(
  sdk: DtfSdk,
  params: GetIndexDtfOptimisticGovernanceParams | undefined,
  options?: DtfQueryOptions<IndexDtfOptimisticGovernance, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.optimisticGovernance(params),
    () => sdk.index.getOptimisticGovernance(requireParams(params, "indexDtfOptimisticGovernanceQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfOptimisticGovernance<TData = IndexDtfOptimisticGovernance>(
  params: GetIndexDtfOptimisticGovernanceParams | undefined,
  options?: DtfQueryOptions<IndexDtfOptimisticGovernance, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfOptimisticGovernanceQueryOptions(sdk, params, options));
}
