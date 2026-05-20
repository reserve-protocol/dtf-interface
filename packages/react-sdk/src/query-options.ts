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
  type GetIndexDtfParams,
  type GetIndexDtfPriceHistoryParams,
  type GetIndexDtfPriceParams,
  type GetIndexDtfVersionParams,
  type IndexDtfBasket,
  type IndexDtfBrand,
  type IndexDtfFull,
  type IndexDtfPrice,
  type IndexDtfPricePoint,
  type ListIndexDtfsParams,
} from "@reserve-protocol/sdk";

import { dtfQueryKeys } from "@/query-keys";
import {
  createDtfQueryOptions,
  requireParams,
  type DtfQueryOptions,
} from "@/query";

export type { DtfQueryOptions, DtfQueryOptionsResult } from "@/query";
export { indexDtfDelegatesQueryOptions } from "@/index-dtf/use-index-dtf-delegates";
export { indexDtfGuardiansQueryOptions } from "@/index-dtf/use-index-dtf-guardians";
export { indexDtfOptimisticGovernanceQueryOptions } from "@/index-dtf/use-index-dtf-optimistic-governance";
export { indexDtfOptimisticProposalContextQueryOptions } from "@/index-dtf/use-index-dtf-optimistic-proposal-context";
export { indexDtfOptimisticProposalVoterStateQueryOptions } from "@/index-dtf/use-index-dtf-optimistic-proposal-voter-state";
export { indexDtfOptimisticTimelockRolesQueryOptions } from "@/index-dtf/use-index-dtf-optimistic-timelock-roles";
export { indexDtfOptimisticVotesQueryOptions } from "@/index-dtf/use-index-dtf-optimistic-votes";
export {
  indexDtfPastOptimisticVotesQueryOptions,
  type IndexDtfPastOptimisticVotesQueryParams,
} from "@/index-dtf/use-index-dtf-past-optimistic-votes";
export { indexDtfProposalQueryOptions } from "@/index-dtf/use-index-dtf-proposal";
export { indexDtfProposalThrottleChargesQueryOptions } from "@/index-dtf/use-index-dtf-proposal-throttle-charges";
export { indexDtfProposalVoterStateQueryOptions } from "@/index-dtf/use-index-dtf-proposal-voter-state";
export { indexDtfProposalVotesQueryOptions } from "@/index-dtf/use-index-dtf-proposal-votes";
export { indexDtfProposalListQueryOptions, indexDtfProposalsQueryOptions } from "@/index-dtf/use-index-dtf-proposals";
export { indexDtfProposerStateQueryOptions } from "@/index-dtf/use-index-dtf-proposer-state";
export { indexDtfSelectorRegistryAllowedSelectorsQueryOptions } from "@/index-dtf/use-index-dtf-selector-registry-allowed-selectors";
export { indexDtfSelectorRegistryIsAllowedQueryOptions } from "@/index-dtf/use-index-dtf-selector-registry-is-allowed";
export { indexDtfSelectorRegistryTargetsQueryOptions } from "@/index-dtf/use-index-dtf-selector-registry-targets";
export { indexDtfVoterStateQueryOptions } from "@/index-dtf/use-index-dtf-voter-state";

export type IndexDtfList = Awaited<ReturnType<DtfSdk["index"]["list"]>>;

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

export function indexDtfVersionQueryOptions<TData = string>(
  sdk: DtfSdk,
  params: GetIndexDtfVersionParams | undefined,
  options?: DtfQueryOptions<string, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.version(params),
    () => sdk.index.getVersion(requireParams(params, "indexDtfVersionQueryOptions")),
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
