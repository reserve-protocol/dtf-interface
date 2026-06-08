import type { DtfSdk, GetIndexDtfProposalVoterStateParams, IndexDtfProposalVoterState } from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

export function indexDtfProposalVoterStateQueryOptions<TData = IndexDtfProposalVoterState>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalVoterStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalVoterState, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalVoterState(params),
    () => sdk.index.getProposalVoterState(requireParams(params, "indexDtfProposalVoterStateQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfProposalVoterState<TData = IndexDtfProposalVoterState>(
  params: GetIndexDtfProposalVoterStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalVoterState, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalVoterStateQueryOptions(sdk, params, options));
}
