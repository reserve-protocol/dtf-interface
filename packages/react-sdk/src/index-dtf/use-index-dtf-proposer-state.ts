import type { DtfSdk, GetIndexDtfProposerStateParams, IndexDtfProposerState } from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

export function indexDtfProposerStateQueryOptions<TData = IndexDtfProposerState>(
  sdk: DtfSdk,
  params: GetIndexDtfProposerStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposerState, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposerState(params),
    () => sdk.index.getProposerState(requireParams(params, "indexDtfProposerStateQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfProposerState<TData = IndexDtfProposerState>(
  params: GetIndexDtfProposerStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposerState, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposerStateQueryOptions(sdk, params, options));
}
