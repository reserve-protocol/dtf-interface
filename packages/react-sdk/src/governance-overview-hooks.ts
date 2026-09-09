import type { DtfSdk } from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import type { IndexMethod, MethodParams, MethodResult, YieldMethod } from "@/sdk-methods";

import { useDtfSdk } from "@/provider";
import { createDtfQueryOptions, STATIC_STALE_TIME, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

// Cross-DTF governance reads for dashboards and explorers. Every read takes
// optional params (chain scope, limit), so the queries are always enabled.

// --- Index DTF ---

export function indexDtfProposalFeedQueryOptions<TData = MethodResult<IndexMethod<"getProposalFeed">>>(
  sdk: DtfSdk,
  params?: MethodParams<IndexMethod<"getProposalFeed">>,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getProposalFeed">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.proposalFeed(params),
    () => sdk.index.getProposalFeed(params),
    true,
    options,
  );
}

export function useIndexDtfProposalFeed<TData = MethodResult<IndexMethod<"getProposalFeed">>>(
  params?: MethodParams<IndexMethod<"getProposalFeed">>,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getProposalFeed">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfProposalFeedQueryOptions(sdk, params, options));
}

export function indexDtfTopVotersQueryOptions<TData = MethodResult<IndexMethod<"getTopVoters">>>(
  sdk: DtfSdk,
  params?: MethodParams<IndexMethod<"getTopVoters">>,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getTopVoters">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.topVoters(params),
    () => sdk.index.getTopVoters(params),
    true,
    options,
  );
}

export function useIndexDtfTopVoters<TData = MethodResult<IndexMethod<"getTopVoters">>>(
  params?: MethodParams<IndexMethod<"getTopVoters">>,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getTopVoters">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfTopVotersQueryOptions(sdk, params, options));
}

export function indexDtfGovernanceActivityQueryOptions<TData = MethodResult<IndexMethod<"getGovernanceActivity">>>(
  sdk: DtfSdk,
  params?: MethodParams<IndexMethod<"getGovernanceActivity">>,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getGovernanceActivity">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.governance.activity(params),
    () => sdk.index.getGovernanceActivity(params),
    true,
    options,
  );
}

export function useIndexDtfGovernanceActivity<TData = MethodResult<IndexMethod<"getGovernanceActivity">>>(
  params?: MethodParams<IndexMethod<"getGovernanceActivity">>,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getGovernanceActivity">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfGovernanceActivityQueryOptions(sdk, params, options));
}

export function indexDtfVoteLockDaosQueryOptions<TData = MethodResult<IndexMethod<"getVoteLockDaos">>>(
  sdk: DtfSdk,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockDaos">>, TData>,
) {
  return createDtfQueryOptions(dtfQueryKeys.index.voteLockDaos(), () => sdk.index.getVoteLockDaos(), true, options);
}

/** Reserve API vote-lock DAO rows: locked value, APR, and the DTFs each vault governs. */
export function useIndexDtfVoteLockDaos<TData = MethodResult<IndexMethod<"getVoteLockDaos">>>(
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockDaos">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfVoteLockDaosQueryOptions(sdk, options));
}

export function indexDtfVoteLockTotalsQueryOptions<TData = MethodResult<IndexMethod<"getVoteLockTotals">>>(
  sdk: DtfSdk,
  params?: MethodParams<IndexMethod<"getVoteLockTotals">>,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockTotals">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.voteLockTotals(params),
    () => sdk.index.getVoteLockTotals(params),
    true,
    options,
  );
}

export function useIndexDtfVoteLockTotals<TData = MethodResult<IndexMethod<"getVoteLockTotals">>>(
  params?: MethodParams<IndexMethod<"getVoteLockTotals">>,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockTotals">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfVoteLockTotalsQueryOptions(sdk, params, options));
}

export function indexDtfVoteLockLifetimeTotalsQueryOptions<
  TData = MethodResult<IndexMethod<"getVoteLockLifetimeTotals">>,
>(
  sdk: DtfSdk,
  params?: MethodParams<IndexMethod<"getVoteLockLifetimeTotals">>,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockLifetimeTotals">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.voteLockLifetimeTotals(params),
    () => sdk.index.getVoteLockLifetimeTotals(params),
    true,
    options,
    STATIC_STALE_TIME,
  );
}

/** Walks every staking position page, so it is cached at the static tier. */
export function useIndexDtfVoteLockLifetimeTotals<TData = MethodResult<IndexMethod<"getVoteLockLifetimeTotals">>>(
  params?: MethodParams<IndexMethod<"getVoteLockLifetimeTotals">>,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockLifetimeTotals">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfVoteLockLifetimeTotalsQueryOptions(sdk, params, options));
}

// --- Yield DTF ---

export function yieldDtfProposalFeedQueryOptions<TData = MethodResult<YieldMethod<"getProposalFeed">>>(
  sdk: DtfSdk,
  params?: MethodParams<YieldMethod<"getProposalFeed">>,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getProposalFeed">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.proposalFeed(params),
    () => sdk.yield.getProposalFeed(params),
    true,
    options,
  );
}

export function useYieldDtfProposalFeed<TData = MethodResult<YieldMethod<"getProposalFeed">>>(
  params?: MethodParams<YieldMethod<"getProposalFeed">>,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getProposalFeed">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfProposalFeedQueryOptions(sdk, params, options));
}

export function yieldDtfTopVotersQueryOptions<TData = MethodResult<YieldMethod<"getTopVoters">>>(
  sdk: DtfSdk,
  params?: MethodParams<YieldMethod<"getTopVoters">>,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getTopVoters">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.topVoters(params),
    () => sdk.yield.getTopVoters(params),
    true,
    options,
  );
}

export function useYieldDtfTopVoters<TData = MethodResult<YieldMethod<"getTopVoters">>>(
  params?: MethodParams<YieldMethod<"getTopVoters">>,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getTopVoters">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfTopVotersQueryOptions(sdk, params, options));
}

export function yieldDtfGovernanceActivityQueryOptions<TData = MethodResult<YieldMethod<"getGovernanceActivity">>>(
  sdk: DtfSdk,
  params?: MethodParams<YieldMethod<"getGovernanceActivity">>,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getGovernanceActivity">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.governanceActivity(params),
    () => sdk.yield.getGovernanceActivity(params),
    true,
    options,
  );
}

export function useYieldDtfGovernanceActivity<TData = MethodResult<YieldMethod<"getGovernanceActivity">>>(
  params?: MethodParams<YieldMethod<"getGovernanceActivity">>,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getGovernanceActivity">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfGovernanceActivityQueryOptions(sdk, params, options));
}

export function yieldDtfProtocolStakingTotalsQueryOptions<
  TData = MethodResult<YieldMethod<"getProtocolStakingTotals">>,
>(
  sdk: DtfSdk,
  params?: MethodParams<YieldMethod<"getProtocolStakingTotals">>,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getProtocolStakingTotals">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.protocolStakingTotals(params),
    () => sdk.yield.getProtocolStakingTotals(params),
    true,
    options,
  );
}

export function useYieldDtfProtocolStakingTotals<TData = MethodResult<YieldMethod<"getProtocolStakingTotals">>>(
  params?: MethodParams<YieldMethod<"getProtocolStakingTotals">>,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getProtocolStakingTotals">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfProtocolStakingTotalsQueryOptions(sdk, params, options));
}
