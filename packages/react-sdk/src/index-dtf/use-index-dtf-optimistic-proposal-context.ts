import type { DtfSdk, GetIndexDtfOptimisticProposalContextParams, IndexDtfOptimisticProposalContext } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

export function indexDtfOptimisticProposalContextQueryOptions<TData = IndexDtfOptimisticProposalContext | null>(
  sdk: DtfSdk,
  params: GetIndexDtfOptimisticProposalContextParams | undefined,
  options?: DtfQueryOptions<IndexDtfOptimisticProposalContext | null, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.optimisticProposalContext(params),
    () => sdk.index.getOptimisticProposalContext(requireParams(params, "indexDtfOptimisticProposalContextQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfOptimisticProposalContext<TData = IndexDtfOptimisticProposalContext | null>(
  params: GetIndexDtfOptimisticProposalContextParams | undefined,
  options?: DtfQueryOptions<IndexDtfOptimisticProposalContext | null, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfOptimisticProposalContextQueryOptions(sdk, params, options));
}
