import type { DecodeIndexDtfProposalParams, DtfSdk, IndexDtfProposalDecoded } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

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
  );
}

export function useIndexDtfProposalDecode<TData = IndexDtfProposalDecoded>(
  params: DecodeIndexDtfProposalParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalDecoded, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalDecodeQueryOptions(sdk, params, options));
}
