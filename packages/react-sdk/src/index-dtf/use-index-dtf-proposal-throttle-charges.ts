import type { DtfSdk, GetIndexDtfProposalThrottleChargesParams } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

export function indexDtfProposalThrottleChargesQueryOptions<TData = bigint>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalThrottleChargesParams | undefined,
  options?: DtfQueryOptions<bigint, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalThrottleCharges(params),
    () => sdk.index.getProposalThrottleCharges(requireParams(params, "indexDtfProposalThrottleChargesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfProposalThrottleCharges<TData = bigint>(
  params: GetIndexDtfProposalThrottleChargesParams | undefined,
  options?: DtfQueryOptions<bigint, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalThrottleChargesQueryOptions(sdk, params, options));
}
