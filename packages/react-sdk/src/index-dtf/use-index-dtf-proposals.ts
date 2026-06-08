import type {
  DtfSdk,
  GetIndexDtfProposalsParams,
  IndexDtfProposalList,
  IndexDtfProposalSummary,
} from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

type IndexDtfProposalsQueryOptions<TData> = Omit<DtfQueryOptions<IndexDtfProposalList, TData>, "select"> & {
  readonly select?: (data: readonly IndexDtfProposalSummary[]) => TData;
};

export function indexDtfProposalsQueryOptions<TData = readonly IndexDtfProposalSummary[]>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalsParams | undefined,
  options?: IndexDtfProposalsQueryOptions<TData>,
) {
  const { select, ...queryOptions } = options ?? {};

  return indexDtfProposalListQueryOptions(sdk, params, {
    ...queryOptions,
    select: (data) => (select ? select(data.proposals) : (data.proposals as TData)),
  });
}

export function indexDtfProposalListQueryOptions<TData = IndexDtfProposalList>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalsParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalList, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalList(params),
    () => sdk.index.getProposalList(requireParams(params, "indexDtfProposalListQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfProposals<TData = readonly IndexDtfProposalSummary[]>(
  params: GetIndexDtfProposalsParams | undefined,
  options?: IndexDtfProposalsQueryOptions<TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalsQueryOptions(sdk, params, options));
}

export function useIndexDtfProposalList<TData = IndexDtfProposalList>(
  params: GetIndexDtfProposalsParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalList, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalListQueryOptions(sdk, params, options));
}
