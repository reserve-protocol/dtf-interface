import type {
  DtfSdk,
  GetIndexDtfOptimisticProposalVoterStateParams,
  IndexDtfOptimisticProposalVoterState,
} from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

export function indexDtfOptimisticProposalVoterStateQueryOptions<TData = IndexDtfOptimisticProposalVoterState>(
  sdk: DtfSdk,
  params: GetIndexDtfOptimisticProposalVoterStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfOptimisticProposalVoterState, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.optimisticProposalVoterState(params),
    () =>
      sdk.index.getOptimisticProposalVoterState(
        requireParams(params, "indexDtfOptimisticProposalVoterStateQueryOptions"),
      ),
    params !== undefined,
    options,
  );
}

export function useIndexDtfOptimisticProposalVoterState<TData = IndexDtfOptimisticProposalVoterState>(
  params: GetIndexDtfOptimisticProposalVoterStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfOptimisticProposalVoterState, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfOptimisticProposalVoterStateQueryOptions(sdk, params, options));
}
