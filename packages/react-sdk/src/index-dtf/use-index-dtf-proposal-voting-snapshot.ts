import type {
  DtfSdk,
  GetIndexDtfProposalVotingSnapshotParams,
  IndexDtfProposalVotingSnapshot,
} from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

export function indexDtfProposalVotingSnapshotQueryOptions<TData = IndexDtfProposalVotingSnapshot>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalVotingSnapshotParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalVotingSnapshot, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalVotingSnapshot(params),
    () => sdk.index.getProposalVotingSnapshot(requireParams(params, "indexDtfProposalVotingSnapshotQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfProposalVotingSnapshot<TData = IndexDtfProposalVotingSnapshot>(
  params: GetIndexDtfProposalVotingSnapshotParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalVotingSnapshot, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalVotingSnapshotQueryOptions(sdk, params, options));
}
