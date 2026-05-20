import type { DtfSdk } from "@reserve-protocol/sdk";
import { useQuery } from "@tanstack/react-query";

import { dtfQueryKeys } from "@/query-keys";
import { createDtfQueryOptions, requireParams, type DtfQueryOptions } from "@/query";
import { useDtfSdk } from "@/provider";

type Params = Parameters<DtfSdk["index"]["getSelectorRegistryAllowedSelectors"]>[0];
type Result = Awaited<ReturnType<DtfSdk["index"]["getSelectorRegistryAllowedSelectors"]>>;

export function indexDtfSelectorRegistryAllowedSelectorsQueryOptions<TData = Result>(
  sdk: DtfSdk,
  params: Params | undefined,
  options?: DtfQueryOptions<Result, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.selectorRegistryAllowedSelectors(params),
    () =>
      sdk.index.getSelectorRegistryAllowedSelectors(
        requireParams(params, "indexDtfSelectorRegistryAllowedSelectorsQueryOptions"),
      ),
    params !== undefined,
    options,
  );
}

export function useIndexDtfSelectorRegistryAllowedSelectors<TData = Result>(
  params: Params | undefined,
  options?: DtfQueryOptions<Result, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfSelectorRegistryAllowedSelectorsQueryOptions(sdk, params, options));
}
