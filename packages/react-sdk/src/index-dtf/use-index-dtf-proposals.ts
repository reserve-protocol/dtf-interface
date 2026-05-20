import type {
  DtfSdk,
  GetIndexDtfProposalsParams,
  IndexDtfProposalList,
  IndexDtfProposalSummary,
} from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

export function indexDtfProposalsQueryOptions<TData = readonly IndexDtfProposalSummary[]>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalsParams | undefined,
  options?: DtfQueryOptions<readonly IndexDtfProposalSummary[], TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposals(params),
    () => sdk.index.getProposals(requireParams(params, "indexDtfProposalsQueryOptions")),
    params !== undefined,
    options,
  );
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
  options?: DtfQueryOptions<readonly IndexDtfProposalSummary[], TData>,
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
