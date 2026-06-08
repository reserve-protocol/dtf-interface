import type { DtfSdk, GetIndexDtfProposalParams, IndexDtfProposalDetail } from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

export function indexDtfProposalQueryOptions<TData = IndexDtfProposalDetail>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalDetail, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposal(params),
    () => sdk.index.getProposal(requireParams(params, "indexDtfProposalQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfProposal<TData = IndexDtfProposalDetail>(
  params: GetIndexDtfProposalParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalDetail, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalQueryOptions(sdk, params, options));
}
