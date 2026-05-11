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
  GetIndexDtfDelegatesParams,
  GetIndexDtfGuardiansParams,
  GetIndexDtfParams,
  GetIndexDtfPriceHistoryParams,
  GetIndexDtfPriceParams,
  GetIndexDtfProposalParams,
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposalsParams,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
  IndexDtfBasket,
  IndexDtfBrand,
  IndexDtfDelegate,
  IndexDtfFull,
  IndexDtfGuardians,
  IndexDtfPrice,
  IndexDtfPricePoint,
  IndexDtfProposalDetail,
  IndexDtfProposalSummary,
  IndexDtfProposalVoterState,
  IndexDtfProposalVotes,
  IndexDtfProposerState,
  IndexDtfVoterState,
  ListIndexDtfsParams,
} from "@dtf-interface/sdk";

import { useQuery } from "@tanstack/react-query";

import { useDtfSdk } from "./provider.js";
import {
  buildIndexDtfBasketProposalQueryOptions,
  buildIndexDtfBasketSettingsProposalQueryOptions,
  buildIndexDtfDaoSettingsProposalQueryOptions,
  buildIndexDtfSettingsProposalQueryOptions,
  discoverDtfsQueryOptions,
  fullIndexDtfQueryOptions,
  indexDtfBasketQueryOptions,
  indexDtfBrandQueryOptions,
  indexDtfDelegatesQueryOptions,
  indexDtfGuardiansQueryOptions,
  indexDtfListQueryOptions,
  indexDtfPriceHistoryQueryOptions,
  indexDtfPriceQueryOptions,
  indexDtfProposalQueryOptions,
  indexDtfProposalVoterStateQueryOptions,
  indexDtfProposalVotesQueryOptions,
  indexDtfProposalsQueryOptions,
  indexDtfProposerStateQueryOptions,
  indexDtfQueryOptions,
  indexDtfVoterStateQueryOptions,
  type DtfQueryOptions,
  type IndexDtfList,
} from "./query-options.js";

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

export function useIndexDtfProposals<TData = readonly IndexDtfProposalSummary[]>(
  params: GetIndexDtfProposalsParams | undefined,
  options?: DtfQueryOptions<readonly IndexDtfProposalSummary[], TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalsQueryOptions(sdk, params, options));
}

export function useIndexDtfProposal<TData = IndexDtfProposalDetail>(
  params: GetIndexDtfProposalParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalDetail, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalQueryOptions(sdk, params, options));
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

export function useIndexDtfDelegates<TData = readonly IndexDtfDelegate[]>(
  params: GetIndexDtfDelegatesParams | undefined,
  options?: DtfQueryOptions<readonly IndexDtfDelegate[], TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfDelegatesQueryOptions(sdk, params, options));
}

export function useIndexDtfGuardians<TData = IndexDtfGuardians>(
  params: GetIndexDtfGuardiansParams | undefined,
  options?: DtfQueryOptions<IndexDtfGuardians, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfGuardiansQueryOptions(sdk, params, options));
}

export function useIndexDtfVoterState<TData = IndexDtfVoterState>(
  params: GetIndexDtfVoterStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfVoterState, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfVoterStateQueryOptions(sdk, params, options));
}

export function useIndexDtfProposerState<TData = IndexDtfProposerState>(
  params: GetIndexDtfProposerStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposerState, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposerStateQueryOptions(sdk, params, options));
}

export function useIndexDtfProposalVotes<TData = IndexDtfProposalVotes>(
  params: GetIndexDtfProposalVotesParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalVotes, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalVotesQueryOptions(sdk, params, options));
}

export function useIndexDtfProposalVoterState<TData = IndexDtfProposalVoterState>(
  params: GetIndexDtfProposalVoterStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalVoterState, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalVoterStateQueryOptions(sdk, params, options));
}
