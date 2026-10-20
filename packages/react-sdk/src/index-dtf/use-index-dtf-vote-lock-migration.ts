import type {
  DtfParams,
  DtfSdk,
  GetIndexDtfVoteLockDependentsParams,
  IndexDtfVoteLockDependent,
} from "@reserve-protocol/sdk";
import type { Address } from "viem";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

export function indexDtfLegacyVoteLocksQueryOptions<TData = readonly Address[]>(
  sdk: DtfSdk,
  params: DtfParams | undefined,
  options?: DtfQueryOptions<readonly Address[], TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.legacyVoteLocks(params),
    () => sdk.index.getLegacyVoteLocks(requireParams(params, "indexDtfLegacyVoteLocksQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfLegacyVoteLocks<TData = readonly Address[]>(
  params: DtfParams | undefined,
  options?: DtfQueryOptions<readonly Address[], TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfLegacyVoteLocksQueryOptions(sdk, params, options));
}

export function indexDtfVoteLockDependentsQueryOptions<TData = readonly IndexDtfVoteLockDependent[]>(
  sdk: DtfSdk,
  params: GetIndexDtfVoteLockDependentsParams | undefined,
  options?: DtfQueryOptions<readonly IndexDtfVoteLockDependent[], TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.voteLockDependents(params),
    () => sdk.index.getVoteLockDependents(requireParams(params, "indexDtfVoteLockDependentsQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfVoteLockDependents<TData = readonly IndexDtfVoteLockDependent[]>(
  params: GetIndexDtfVoteLockDependentsParams | undefined,
  options?: DtfQueryOptions<readonly IndexDtfVoteLockDependent[], TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfVoteLockDependentsQueryOptions(sdk, params, options));
}
