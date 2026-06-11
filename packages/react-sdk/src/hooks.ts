import type {
  BuildIndexDtfBasketProposalParams,
  BuildIndexDtfBasketSettingsProposalParams,
  BuildIndexDtfDaoSettingsProposalParams,
  BuildIndexDtfSettingsProposalParams,
  BuiltIndexDtfBasketProposal,
  BuiltIndexDtfProposal,
  DiscoverDtf,
  DtfParams,
  GetDiscoverDtfsOptions,
  GetFullIndexDtfParams,
  GetIndexDtfBasketParams,
  GetIndexDtfParams,
  GetIndexDtfPriceHistoryParams,
  GetIndexDtfPriceParams,
  GetIndexDtfVersionParams,
  IndexDtfBasket,
  IndexDtfBrand,
  IndexDtfFull,
  IndexDtfPrice,
  IndexDtfPricePoint,
  ListIndexDtfsParams,
} from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "@/provider";
import {
  buildIndexDtfBasketProposalQueryOptions,
  buildIndexDtfBasketSettingsProposalQueryOptions,
  buildIndexDtfDaoSettingsProposalQueryOptions,
  buildIndexDtfSettingsProposalQueryOptions,
  discoverDtfsQueryOptions,
  fullIndexDtfQueryOptions,
  indexDtfBasketQueryOptions,
  indexDtfBrandQueryOptions,
  indexDtfListQueryOptions,
  indexDtfPriceHistoryQueryOptions,
  indexDtfPriceQueryOptions,
  indexDtfQueryOptions,
  indexDtfVersionQueryOptions,
  type DtfQueryOptions,
  type IndexDtfList,
} from "@/query-options";

export function useDiscoverDtfs<TData = readonly DiscoverDtf[]>(
  params?: GetDiscoverDtfsOptions,
  options?: DtfQueryOptions<readonly DiscoverDtf[], TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(discoverDtfsQueryOptions(sdk, params, options));
}

export function useIndexDtfList<TData = IndexDtfList>(
  params?: ListIndexDtfsParams,
  options?: DtfQueryOptions<IndexDtfList, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfListQueryOptions(sdk, params, options));
}

export function useIndexCatalog<TData = IndexDtfList>(
  params?: ListIndexDtfsParams,
  options?: DtfQueryOptions<IndexDtfList, TData>,
) {
  return useIndexDtfList(params, options);
}

export function useIndexDtf<TData = IndexDtfFull>(
  params: GetIndexDtfParams | undefined,
  options?: DtfQueryOptions<IndexDtfFull, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfQueryOptions(sdk, params, options));
}

export function useFullIndexDtf<TData = IndexDtfFull>(
  params: GetFullIndexDtfParams | undefined,
  options?: DtfQueryOptions<IndexDtfFull, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(fullIndexDtfQueryOptions(sdk, params, options));
}

export function useIndexDtfBasket<TData = IndexDtfBasket>(
  params: GetIndexDtfBasketParams | undefined,
  options?: DtfQueryOptions<IndexDtfBasket, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfBasketQueryOptions(sdk, params, options));
}

export function useIndexDtfVersion<TData = string>(
  params: GetIndexDtfVersionParams | undefined,
  options?: DtfQueryOptions<string, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfVersionQueryOptions(sdk, params, options));
}

export function useIndexDtfBrand<TData = IndexDtfBrand | undefined>(
  params: DtfParams | undefined,
  options?: DtfQueryOptions<IndexDtfBrand | undefined, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfBrandQueryOptions(sdk, params, options));
}

export function useIndexDtfPrice<TData = IndexDtfPrice>(
  params: GetIndexDtfPriceParams | undefined,
  options?: DtfQueryOptions<IndexDtfPrice, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfPriceQueryOptions(sdk, params, options));
}

export function useIndexDtfPriceHistory<TData = readonly IndexDtfPricePoint[]>(
  params: GetIndexDtfPriceHistoryParams | undefined,
  options?: DtfQueryOptions<readonly IndexDtfPricePoint[], TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfPriceHistoryQueryOptions(sdk, params, options));
}

export function useBuildIndexDtfBasketProposal<TData = BuiltIndexDtfBasketProposal>(
  params: BuildIndexDtfBasketProposalParams | undefined,
  options?: DtfQueryOptions<BuiltIndexDtfBasketProposal, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(buildIndexDtfBasketProposalQueryOptions(sdk, params, options));
}

export function useBuildIndexDtfBasketSettingsProposal<TData = BuiltIndexDtfProposal>(
  params: BuildIndexDtfBasketSettingsProposalParams | undefined,
  options?: DtfQueryOptions<BuiltIndexDtfProposal, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(buildIndexDtfBasketSettingsProposalQueryOptions(sdk, params, options));
}

export function useBuildIndexDtfDaoSettingsProposal<TData = BuiltIndexDtfProposal>(
  params: BuildIndexDtfDaoSettingsProposalParams | undefined,
  options?: DtfQueryOptions<BuiltIndexDtfProposal, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(buildIndexDtfDaoSettingsProposalQueryOptions(sdk, params, options));
}

export function useBuildIndexDtfSettingsProposal<TData = BuiltIndexDtfProposal>(
  params: BuildIndexDtfSettingsProposalParams | undefined,
  options?: DtfQueryOptions<BuiltIndexDtfProposal, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(buildIndexDtfSettingsProposalQueryOptions(sdk, params, options));
}
