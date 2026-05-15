import type {
  BuildIndexDtfBasketProposalParams,
  BuildIndexDtfBasketSettingsProposalParams,
  BuildIndexDtfDaoSettingsProposalParams,
  BuildIndexDtfSettingsProposalParams,
  BuiltIndexDtfBasketProposal,
  BuiltIndexDtfProposal,
  DiscoverDtf,
  DtfParams,
  DtfSdk,
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
  indexDtfDelegatesQueryOptions,
  indexDtfGuardiansQueryOptions,
  indexDtfListQueryOptions,
  indexDtfOptimisticGovernanceQueryOptions,
  indexDtfOptimisticProposalContextQueryOptions,
  indexDtfOptimisticTimelockRolesQueryOptions,
  indexDtfOptimisticVotesQueryOptions,
  indexDtfPastOptimisticVotesQueryOptions,
  indexDtfPriceHistoryQueryOptions,
  indexDtfPriceQueryOptions,
  indexDtfProposalDeadlineQueryOptions,
  indexDtfProposalEtaQueryOptions,
  indexDtfProposalQueryOptions,
  indexDtfProposalRpcDetailsQueryOptions,
  indexDtfProposalSnapshotQueryOptions,
  indexDtfProposalStateQueryOptions,
  indexDtfProposalStatesQueryOptions,
  indexDtfProposalThrottleChargesQueryOptions,
  indexDtfProposalVoterStateQueryOptions,
  indexDtfProposalVotesQueryOptions,
  indexDtfProposalsQueryOptions,
  indexDtfProposerStateQueryOptions,
  indexDtfQueryOptions,
  indexDtfSelectorRegistryAllowedSelectorsQueryOptions,
  indexDtfSelectorRegistryIsAllowedQueryOptions,
  indexDtfSelectorRegistryTargetsQueryOptions,
  indexDtfVoterStateQueryOptions,
  type DtfQueryOptions,
  type IndexDtfList,
  type IndexDtfPastOptimisticVotesQueryParams,
} from "@/query-options";

type IndexMethod<TKey extends keyof DtfSdk["index"]> = DtfSdk["index"][TKey] extends (...args: any) => any
  ? DtfSdk["index"][TKey]
  : never;
type IndexMethodParams<TKey extends keyof DtfSdk["index"]> = Parameters<IndexMethod<TKey>>[0];
type IndexMethodResult<TKey extends keyof DtfSdk["index"]> = Awaited<ReturnType<IndexMethod<TKey>>>;

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

export function useIndexDtfProposalState<TData = IndexMethodResult<"getProposalState">>(
  params: IndexMethodParams<"getProposalState"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalState">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalStateQueryOptions(sdk, params, options));
}

export function useIndexDtfProposalStates<TData = IndexMethodResult<"getProposalStates">>(
  params: IndexMethodParams<"getProposalStates"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalStates">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalStatesQueryOptions(sdk, params, options));
}

export function useIndexDtfProposalEta<TData = IndexMethodResult<"getProposalEta">>(
  params: IndexMethodParams<"getProposalEta"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalEta">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalEtaQueryOptions(sdk, params, options));
}

export function useIndexDtfProposalDeadline<TData = IndexMethodResult<"getProposalDeadline">>(
  params: IndexMethodParams<"getProposalDeadline"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalDeadline">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalDeadlineQueryOptions(sdk, params, options));
}

export function useIndexDtfProposalSnapshot<TData = IndexMethodResult<"getProposalSnapshot">>(
  params: IndexMethodParams<"getProposalSnapshot"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalSnapshot">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalSnapshotQueryOptions(sdk, params, options));
}

export function useIndexDtfProposalRpcDetails<TData = IndexMethodResult<"getProposalRpcDetails">>(
  params: IndexMethodParams<"getProposalRpcDetails"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalRpcDetails">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalRpcDetailsQueryOptions(sdk, params, options));
}

export function useIndexDtfOptimisticGovernance<TData = IndexMethodResult<"getOptimisticGovernance">>(
  params: IndexMethodParams<"getOptimisticGovernance"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getOptimisticGovernance">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfOptimisticGovernanceQueryOptions(sdk, params, options));
}

export function useIndexDtfOptimisticProposalContext<TData = IndexMethodResult<"getOptimisticProposalContext">>(
  params: IndexMethodParams<"getOptimisticProposalContext"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getOptimisticProposalContext">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfOptimisticProposalContextQueryOptions(sdk, params, options));
}

export function useIndexDtfOptimisticTimelockRoles<TData = IndexMethodResult<"getOptimisticTimelockRoles">>(
  params: IndexMethodParams<"getOptimisticTimelockRoles"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getOptimisticTimelockRoles">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfOptimisticTimelockRolesQueryOptions(sdk, params, options));
}

export function useIndexDtfOptimisticVotes<TData = IndexMethodResult<"getOptimisticVotes">>(
  params: IndexMethodParams<"getOptimisticVotes"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getOptimisticVotes">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfOptimisticVotesQueryOptions(sdk, params, options));
}

export function useIndexDtfPastOptimisticVotes<TData = IndexMethodResult<"getPastOptimisticVotes">>(
  params: IndexDtfPastOptimisticVotesQueryParams | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getPastOptimisticVotes">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfPastOptimisticVotesQueryOptions(sdk, params, options));
}

export function useIndexDtfProposalThrottleCharges<TData = IndexMethodResult<"getProposalThrottleCharges">>(
  params: IndexMethodParams<"getProposalThrottleCharges"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalThrottleCharges">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfProposalThrottleChargesQueryOptions(sdk, params, options));
}

export function useIndexDtfSelectorRegistryTargets<TData = IndexMethodResult<"getSelectorRegistryTargets">>(
  params: IndexMethodParams<"getSelectorRegistryTargets"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getSelectorRegistryTargets">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfSelectorRegistryTargetsQueryOptions(sdk, params, options));
}

export function useIndexDtfSelectorRegistryAllowedSelectors<
  TData = IndexMethodResult<"getSelectorRegistryAllowedSelectors">,
>(
  params: IndexMethodParams<"getSelectorRegistryAllowedSelectors"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getSelectorRegistryAllowedSelectors">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfSelectorRegistryAllowedSelectorsQueryOptions(sdk, params, options));
}

export function useIndexDtfSelectorRegistryIsAllowed<TData = IndexMethodResult<"getSelectorRegistryIsAllowed">>(
  params: IndexMethodParams<"getSelectorRegistryIsAllowed"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getSelectorRegistryIsAllowed">, TData>,
) {
  const sdk = useDtfSdk();

  return useQuery(indexDtfSelectorRegistryIsAllowedQueryOptions(sdk, params, options));
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
