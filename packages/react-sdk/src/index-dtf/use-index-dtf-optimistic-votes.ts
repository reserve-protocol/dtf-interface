import type { Amount, DtfSdk, GetIndexDtfOptimisticVotesParams } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

export function indexDtfOptimisticVotesQueryOptions<TData = Amount>(
  sdk: DtfSdk,
  params: GetIndexDtfOptimisticVotesParams | undefined,
  options?: DtfQueryOptions<Amount, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.optimisticVotes(params),
    () => sdk.index.getOptimisticVotes(requireParams(params, "indexDtfOptimisticVotesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfOptimisticVotes<TData = Amount>(
  params: GetIndexDtfOptimisticVotesParams | undefined,
  options?: DtfQueryOptions<Amount, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfOptimisticVotesQueryOptions(sdk, params, options));
}
