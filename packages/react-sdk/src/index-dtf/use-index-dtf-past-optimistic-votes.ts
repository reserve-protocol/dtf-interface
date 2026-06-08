import type { Amount, DtfSdk, GetIndexDtfPastOptimisticVotesParams } from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

export type IndexDtfPastOptimisticVotesQueryParams = Omit<GetIndexDtfPastOptimisticVotesParams, "timepoint"> & {
  readonly timepoint: bigint;
};

export function indexDtfPastOptimisticVotesQueryOptions<TData = Amount>(
  sdk: DtfSdk,
  params: IndexDtfPastOptimisticVotesQueryParams | undefined,
  options?: DtfQueryOptions<Amount, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.pastOptimisticVotes(params),
    () => sdk.index.getPastOptimisticVotes(requireParams(params, "indexDtfPastOptimisticVotesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfPastOptimisticVotes<TData = Amount>(
  params: IndexDtfPastOptimisticVotesQueryParams | undefined,
  options?: DtfQueryOptions<Amount, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfPastOptimisticVotesQueryOptions(sdk, params, options));
}
