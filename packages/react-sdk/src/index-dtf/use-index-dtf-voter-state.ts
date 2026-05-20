import type { DtfSdk, GetIndexDtfVoterStateParams, IndexDtfVoterState } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

export function indexDtfVoterStateQueryOptions<TData = IndexDtfVoterState>(
  sdk: DtfSdk,
  params: GetIndexDtfVoterStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfVoterState, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.voterState(params),
    () => sdk.index.getVoterState(requireParams(params, "indexDtfVoterStateQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfVoterState<TData = IndexDtfVoterState>(
  params: GetIndexDtfVoterStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfVoterState, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfVoterStateQueryOptions(sdk, params, options));
}
