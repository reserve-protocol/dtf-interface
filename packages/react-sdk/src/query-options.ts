import type { DefaultError, QueryKey, UseQueryOptions } from "@tanstack/react-query";

import {
  getDiscoverDtfs,
  type BuildIndexDtfBasketProposalParams,
  type BuildIndexDtfBasketSettingsProposalParams,
  type BuildIndexDtfDaoSettingsProposalParams,
  type BuildIndexDtfSettingsProposalParams,
  type BuiltIndexDtfBasketProposal,
  type BuiltIndexDtfProposal,
  type DiscoverDtf,
  type DtfParams,
  type DtfSdk,
  type GetDiscoverDtfsOptions,
  type GetFullIndexDtfParams,
  type GetIndexDtfBasketParams,
  type GetIndexDtfDelegatesParams,
  type GetIndexDtfGuardiansParams,
  type GetIndexDtfParams,
  type GetIndexDtfPriceHistoryParams,
  type GetIndexDtfPriceParams,
  type GetIndexDtfProposalParams,
  type GetIndexDtfProposalVoterStateParams,
  type GetIndexDtfProposalVotesParams,
  type GetIndexDtfProposalsParams,
  type GetIndexDtfProposerStateParams,
  type GetIndexDtfVoterStateParams,
  type IndexDtfBasket,
  type IndexDtfBrand,
  type IndexDtfDelegate,
  type IndexDtfFull,
  type IndexDtfGuardians,
  type IndexDtfPrice,
  type IndexDtfPricePoint,
  type IndexDtfProposalDetail,
  type IndexDtfProposalSummary,
  type IndexDtfProposalVoterState,
  type IndexDtfProposalVotes,
  type IndexDtfProposerState,
  type IndexDtfVoterState,
  type ListIndexDtfsParams,
} from "@dtf-interface/sdk";

import { dtfQueryKeys } from "@/query-keys";

export type IndexDtfList = Awaited<ReturnType<DtfSdk["index"]["list"]>>;

type IndexMethod<TKey extends keyof DtfSdk["index"]> = DtfSdk["index"][TKey] extends (...args: any) => any
  ? DtfSdk["index"][TKey]
  : never;
type IndexMethodParams<TKey extends keyof DtfSdk["index"]> = Parameters<IndexMethod<TKey>>[0];
type IndexMethodResult<TKey extends keyof DtfSdk["index"]> = Awaited<ReturnType<IndexMethod<TKey>>>;

export type IndexDtfPastOptimisticVotesQueryParams = Omit<
  IndexMethodParams<"getPastOptimisticVotes">,
  "timepoint"
> & {
  readonly timepoint: bigint;
};

export type DtfQueryOptions<TQueryFnData, TData = TQueryFnData> = Omit<
  UseQueryOptions<TQueryFnData, DefaultError, TData, QueryKey>,
  "enabled" | "queryFn" | "queryKey"
> & {
  readonly enabled?: boolean;
};

export type DtfQueryOptionsResult<TQueryFnData, TData = TQueryFnData> = UseQueryOptions<
  TQueryFnData,
  DefaultError,
  TData,
  QueryKey
> & {
  readonly queryKey: QueryKey;
  readonly queryFn: () => Promise<TQueryFnData>;
};

function createDtfQueryOptions<TQueryFnData, TData = TQueryFnData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TQueryFnData>,
  enabled: boolean,
  options: DtfQueryOptions<TQueryFnData, TData> = {},
): DtfQueryOptionsResult<TQueryFnData, TData> {
  return {
    ...options,
    queryKey,
    queryFn,
    enabled: enabled && options.enabled !== false,
  };
}

function requireParams<T>(params: T | undefined, method: string): T {
  if (params === undefined) {
    throw new Error(`${method} params are required.`);
  }

  return params;
}

export function discoverDtfsQueryOptions<TData = readonly DiscoverDtf[]>(
  sdk: DtfSdk,
  params?: GetDiscoverDtfsOptions,
  options?: DtfQueryOptions<readonly DiscoverDtf[], TData>,
) {
  return createDtfQueryOptions(dtfQueryKeys.discover(params), () => getDiscoverDtfs(sdk.client, params), true, options);
}

export function indexDtfListQueryOptions<TData = IndexDtfList>(
  sdk: DtfSdk,
  params?: ListIndexDtfsParams,
  options?: DtfQueryOptions<IndexDtfList, TData>,
) {
  return createDtfQueryOptions(dtfQueryKeys.index.list(params), () => sdk.index.list(params), true, options);
}

export function indexDtfQueryOptions<TData = IndexDtfFull>(
  sdk: DtfSdk,
  params: GetIndexDtfParams | undefined,
  options?: DtfQueryOptions<IndexDtfFull, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.full(params),
    () => sdk.index.get(requireParams(params, "indexDtfQueryOptions")),
    params !== undefined,
    options,
  );
}

export function fullIndexDtfQueryOptions<TData = IndexDtfFull>(
  sdk: DtfSdk,
  params: GetFullIndexDtfParams | undefined,
  options?: DtfQueryOptions<IndexDtfFull, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.full(params),
    () => sdk.index.getFull(requireParams(params, "fullIndexDtfQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfBasketQueryOptions<TData = IndexDtfBasket>(
  sdk: DtfSdk,
  params: GetIndexDtfBasketParams | undefined,
  options?: DtfQueryOptions<IndexDtfBasket, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.basket(params),
    () => sdk.index.getBasket(requireParams(params, "indexDtfBasketQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfBrandQueryOptions<TData = IndexDtfBrand | undefined>(
  sdk: DtfSdk,
  params: DtfParams | undefined,
  options?: DtfQueryOptions<IndexDtfBrand | undefined, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.brand(params),
    () => sdk.index.getBrand(requireParams(params, "indexDtfBrandQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfPriceQueryOptions<TData = IndexDtfPrice>(
  sdk: DtfSdk,
  params: GetIndexDtfPriceParams | undefined,
  options?: DtfQueryOptions<IndexDtfPrice, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.price(params),
    () => sdk.index.getPrice(requireParams(params, "indexDtfPriceQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfPriceHistoryQueryOptions<TData = readonly IndexDtfPricePoint[]>(
  sdk: DtfSdk,
  params: GetIndexDtfPriceHistoryParams | undefined,
  options?: DtfQueryOptions<readonly IndexDtfPricePoint[], TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.priceHistory(params),
    () => sdk.index.getPriceHistory(requireParams(params, "indexDtfPriceHistoryQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposalsQueryOptions<TData = readonly IndexDtfProposalSummary[]>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalsParams | undefined,
  options?: DtfQueryOptions<readonly IndexDtfProposalSummary[], TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposals(params),
    () => sdk.index.getProposals(requireParams(params, "indexDtfProposalsQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposalQueryOptions<TData = IndexDtfProposalDetail>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalDetail, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposal(params),
    () => sdk.index.getProposal(requireParams(params, "indexDtfProposalQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposalStateQueryOptions<TData = IndexMethodResult<"getProposalState">>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getProposalState"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalState">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalState(params),
    () => sdk.index.getProposalState(requireParams(params, "indexDtfProposalStateQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposalStatesQueryOptions<TData = IndexMethodResult<"getProposalStates">>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getProposalStates"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalStates">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalStates(params),
    () => sdk.index.getProposalStates(requireParams(params, "indexDtfProposalStatesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposalEtaQueryOptions<TData = IndexMethodResult<"getProposalEta">>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getProposalEta"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalEta">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalEta(params),
    () => sdk.index.getProposalEta(requireParams(params, "indexDtfProposalEtaQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposalDeadlineQueryOptions<TData = IndexMethodResult<"getProposalDeadline">>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getProposalDeadline"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalDeadline">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalDeadline(params),
    () => sdk.index.getProposalDeadline(requireParams(params, "indexDtfProposalDeadlineQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposalSnapshotQueryOptions<TData = IndexMethodResult<"getProposalSnapshot">>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getProposalSnapshot"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalSnapshot">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalSnapshot(params),
    () => sdk.index.getProposalSnapshot(requireParams(params, "indexDtfProposalSnapshotQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposalRpcDetailsQueryOptions<TData = IndexMethodResult<"getProposalRpcDetails">>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getProposalRpcDetails"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalRpcDetails">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalRpcDetails(params),
    () => sdk.index.getProposalRpcDetails(requireParams(params, "indexDtfProposalRpcDetailsQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfOptimisticGovernanceQueryOptions<TData = IndexMethodResult<"getOptimisticGovernance">>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getOptimisticGovernance"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getOptimisticGovernance">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.optimisticGovernance(params),
    () => sdk.index.getOptimisticGovernance(requireParams(params, "indexDtfOptimisticGovernanceQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfOptimisticProposalContextQueryOptions<
  TData = IndexMethodResult<"getOptimisticProposalContext">,
>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getOptimisticProposalContext"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getOptimisticProposalContext">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.optimisticProposalContext(params),
    () =>
      sdk.index.getOptimisticProposalContext(
        requireParams(params, "indexDtfOptimisticProposalContextQueryOptions"),
      ),
    params !== undefined,
    options,
  );
}

export function indexDtfOptimisticTimelockRolesQueryOptions<
  TData = IndexMethodResult<"getOptimisticTimelockRoles">,
>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getOptimisticTimelockRoles"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getOptimisticTimelockRoles">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.optimisticTimelockRoles(params),
    () =>
      sdk.index.getOptimisticTimelockRoles(requireParams(params, "indexDtfOptimisticTimelockRolesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfOptimisticVotesQueryOptions<TData = IndexMethodResult<"getOptimisticVotes">>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getOptimisticVotes"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getOptimisticVotes">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.optimisticVotes(params),
    () => sdk.index.getOptimisticVotes(requireParams(params, "indexDtfOptimisticVotesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfPastOptimisticVotesQueryOptions<TData = IndexMethodResult<"getPastOptimisticVotes">>(
  sdk: DtfSdk,
  params: IndexDtfPastOptimisticVotesQueryParams | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getPastOptimisticVotes">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.pastOptimisticVotes(params),
    () => sdk.index.getPastOptimisticVotes(requireParams(params, "indexDtfPastOptimisticVotesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposalThrottleChargesQueryOptions<
  TData = IndexMethodResult<"getProposalThrottleCharges">,
>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getProposalThrottleCharges"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getProposalThrottleCharges">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalThrottleCharges(params),
    () => sdk.index.getProposalThrottleCharges(requireParams(params, "indexDtfProposalThrottleChargesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfSelectorRegistryTargetsQueryOptions<
  TData = IndexMethodResult<"getSelectorRegistryTargets">,
>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getSelectorRegistryTargets"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getSelectorRegistryTargets">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.selectorRegistryTargets(params),
    () => sdk.index.getSelectorRegistryTargets(requireParams(params, "indexDtfSelectorRegistryTargetsQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfSelectorRegistryAllowedSelectorsQueryOptions<
  TData = IndexMethodResult<"getSelectorRegistryAllowedSelectors">,
>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getSelectorRegistryAllowedSelectors"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getSelectorRegistryAllowedSelectors">, TData>,
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

export function indexDtfSelectorRegistryIsAllowedQueryOptions<
  TData = IndexMethodResult<"getSelectorRegistryIsAllowed">,
>(
  sdk: DtfSdk,
  params: IndexMethodParams<"getSelectorRegistryIsAllowed"> | undefined,
  options?: DtfQueryOptions<IndexMethodResult<"getSelectorRegistryIsAllowed">, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.selectorRegistryIsAllowed(params),
    () => sdk.index.getSelectorRegistryIsAllowed(requireParams(params, "indexDtfSelectorRegistryIsAllowedQueryOptions")),
    params !== undefined,
    options,
  );
}

export function buildIndexDtfBasketProposalQueryOptions<TData = BuiltIndexDtfBasketProposal>(
  sdk: DtfSdk,
  params: BuildIndexDtfBasketProposalParams | undefined,
  options?: DtfQueryOptions<BuiltIndexDtfBasketProposal, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.buildBasketProposal(params),
    () => sdk.index.buildBasketProposal(requireParams(params, "buildIndexDtfBasketProposalQueryOptions")),
    params !== undefined,
    options,
  );
}

export function buildIndexDtfBasketSettingsProposalQueryOptions<TData = BuiltIndexDtfProposal>(
  sdk: DtfSdk,
  params: BuildIndexDtfBasketSettingsProposalParams | undefined,
  options?: DtfQueryOptions<BuiltIndexDtfProposal, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.buildBasketSettingsProposal(params),
    () =>
      sdk.index.buildBasketSettingsProposal(requireParams(params, "buildIndexDtfBasketSettingsProposalQueryOptions")),
    params !== undefined,
    options,
  );
}

export function buildIndexDtfDaoSettingsProposalQueryOptions<TData = BuiltIndexDtfProposal>(
  sdk: DtfSdk,
  params: BuildIndexDtfDaoSettingsProposalParams | undefined,
  options?: DtfQueryOptions<BuiltIndexDtfProposal, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.buildDaoSettingsProposal(params),
    () => sdk.index.buildDaoSettingsProposal(requireParams(params, "buildIndexDtfDaoSettingsProposalQueryOptions")),
    params !== undefined,
    options,
  );
}

export function buildIndexDtfSettingsProposalQueryOptions<TData = BuiltIndexDtfProposal>(
  sdk: DtfSdk,
  params: BuildIndexDtfSettingsProposalParams | undefined,
  options?: DtfQueryOptions<BuiltIndexDtfProposal, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.buildSettingsProposal(params),
    () => sdk.index.buildSettingsProposal(requireParams(params, "buildIndexDtfSettingsProposalQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfDelegatesQueryOptions<TData = readonly IndexDtfDelegate[]>(
  sdk: DtfSdk,
  params: GetIndexDtfDelegatesParams | undefined,
  options?: DtfQueryOptions<readonly IndexDtfDelegate[], TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.delegates(params),
    () => sdk.index.getDelegates(requireParams(params, "indexDtfDelegatesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfGuardiansQueryOptions<TData = IndexDtfGuardians>(
  sdk: DtfSdk,
  params: GetIndexDtfGuardiansParams | undefined,
  options?: DtfQueryOptions<IndexDtfGuardians, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.guardians(params),
    () => sdk.index.getGuardians(requireParams(params, "indexDtfGuardiansQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfVoterStateQueryOptions<TData = IndexDtfVoterState>(
  sdk: DtfSdk,
  params: GetIndexDtfVoterStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfVoterState, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.voterState(params),
    () => sdk.index.getVoterState(requireParams(params, "indexDtfVoterStateQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposerStateQueryOptions<TData = IndexDtfProposerState>(
  sdk: DtfSdk,
  params: GetIndexDtfProposerStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposerState, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposerState(params),
    () => sdk.index.getProposerState(requireParams(params, "indexDtfProposerStateQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposalVotesQueryOptions<TData = IndexDtfProposalVotes>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalVotesParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalVotes, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalVotes(params),
    () => sdk.index.getProposalVotes(requireParams(params, "indexDtfProposalVotesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfProposalVoterStateQueryOptions<TData = IndexDtfProposalVoterState>(
  sdk: DtfSdk,
  params: GetIndexDtfProposalVoterStateParams | undefined,
  options?: DtfQueryOptions<IndexDtfProposalVoterState, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalVoterState(params),
    () => sdk.index.getProposalVoterState(requireParams(params, "indexDtfProposalVoterStateQueryOptions")),
    params !== undefined,
    options,
  );
}
