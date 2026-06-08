import type { DtfSdk } from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

type Params = Parameters<DtfSdk["index"]["getSelectorRegistryTargets"]>[0];
type Result = Awaited<ReturnType<DtfSdk["index"]["getSelectorRegistryTargets"]>>;

export function indexDtfSelectorRegistryTargetsQueryOptions<TData = Result>(
  sdk: DtfSdk,
  params: Params | undefined,
  options?: DtfQueryOptions<Result, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.selectorRegistryTargets(params),
    () => sdk.index.getSelectorRegistryTargets(requireParams(params, "indexDtfSelectorRegistryTargetsQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useIndexDtfSelectorRegistryTargets<TData = Result>(
  params: Params | undefined,
  options?: DtfQueryOptions<Result, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfSelectorRegistryTargetsQueryOptions(sdk, params, options));
}
