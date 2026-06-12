import type { DecodeIndexDtfProposalParams, DtfSdk, IndexDtfProposalDecoded } from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import { createDtfQueryOptions, requireParams, STATIC_STALE_TIME, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

export function indexDtfProposalDecodeQueryOptions<TData = IndexDtfProposalDecoded>(
  sdk: DtfSdk,
  params: DecodeIndexDtfProposalParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalDecoded, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalDecode(params),
    () => sdk.index.decodeProposalCalldatas(requireParams(params, "indexDtfProposalDecodeQueryOptions")),
    params !== undefined,
    options,
    // Proposal calldatas are immutable once submitted; the decode never changes.
    STATIC_STALE_TIME,
  );
}

export function useIndexDtfProposalDecode<TData = IndexDtfProposalDecoded>(
  params: DecodeIndexDtfProposalParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalDecoded, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalDecodeQueryOptions(sdk, params, options));
}
