import type { DtfSdk, GetIndexDtfProposalVotesParams, IndexDtfProposalVotes } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

export function indexDtfProposalVotesQueryOptions<TData = IndexDtfProposalVotes>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalVotesParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalVotes, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalVotes(params),
    () => sdk.index.getProposalVotes(requireParams(params, "indexDtfProposalVotesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfProposalVotes<TData = IndexDtfProposalVotes>(
  params: GetIndexDtfProposalVotesParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalVotes, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalVotesQueryOptions(sdk, params, options));
}
