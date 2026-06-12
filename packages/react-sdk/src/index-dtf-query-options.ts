import type { DtfSdk } from "@reserve-protocol/sdk";

import { createDtfQueryOptions, LIVE_STALE_TIME, requireParams, type DtfQueryOptions } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

type IndexMethod<TKey extends keyof DtfSdk["index"]> = DtfSdk["index"][TKey] extends (...args: any) => any
  ? DtfSdk["index"][TKey]
  : never;
type PortfolioMethod<TKey extends keyof DtfSdk["portfolio"]> = DtfSdk["portfolio"][TKey] extends (...args: any) => any
  ? DtfSdk["portfolio"][TKey]
  : never;
type MethodParams<TMethod extends (...args: any) => any> = Parameters<TMethod>[0];
type MethodResult<TMethod extends (...args: any) => any> = Awaited<ReturnType<TMethod>>;

export function indexDtfStatusQueryOptions<TData = MethodResult<IndexMethod<"getStatus">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getStatus">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getStatus">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.status(params),
    () => sdk.index.getStatus(requireParams(params, "indexDtfStatusQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfExposureQueryOptions<TData = MethodResult<IndexMethod<"getExposure">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getExposure">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getExposure">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.exposure(params),
    () => sdk.index.getExposure(requireParams(params, "indexDtfExposureQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfTransactionsQueryOptions<TData = MethodResult<IndexMethod<"getTransactions">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getTransactions">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getTransactions">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.transactions(params),
    () => sdk.index.getTransactions(requireParams(params, "indexDtfTransactionsQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfRevenueQueryOptions<TData = MethodResult<IndexMethod<"getRevenue">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getRevenue">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getRevenue">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.revenue(params),
    () => sdk.index.getRevenue(requireParams(params, "indexDtfRevenueQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfIssuanceStateQueryOptions<TData = MethodResult<IndexMethod<"getIssuanceState">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getIssuanceState">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getIssuanceState">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.issuanceState(params),
    () => sdk.index.getIssuanceState(requireParams(params, "indexDtfIssuanceStateQueryOptions")),
    params !== undefined,
    options,
    LIVE_STALE_TIME,
  );
}

export function indexDtfRebalancesQueryOptions<TData = MethodResult<IndexMethod<"getRebalances">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getRebalances">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getRebalances">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.rebalances(params),
    () => sdk.index.getRebalances(requireParams(params, "indexDtfRebalancesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfCurrentRebalanceQueryOptions<TData = MethodResult<IndexMethod<"getCurrentRebalance">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getCurrentRebalance">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getCurrentRebalance">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.currentRebalance(params),
    () => sdk.index.getCurrentRebalance(requireParams(params, "indexDtfCurrentRebalanceQueryOptions")),
    params !== undefined,
    options,
    LIVE_STALE_TIME,
  );
}

export function indexDtfVoteLockStateQueryOptions<TData = MethodResult<IndexMethod<"getVoteLockState">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getVoteLockState">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockState">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.voteLockState(params),
    () => sdk.index.getVoteLockState(requireParams(params, "indexDtfVoteLockStateQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfVoteLockVaultStateQueryOptions<TData = MethodResult<IndexMethod<"getVoteLockVaultState">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getVoteLockVaultState">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockVaultState">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.voteLockVaultState(params),
    () => sdk.index.getVoteLockVaultState(requireParams(params, "indexDtfVoteLockVaultStateQueryOptions")),
    params !== undefined,
    options,
  );
}

export function accountPortfolioQueryOptions<TData = MethodResult<PortfolioMethod<"get">>>(
  sdk: DtfSdk,
  params: MethodParams<PortfolioMethod<"get">> | undefined,
  options?: DtfQueryOptions<MethodResult<PortfolioMethod<"get">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.portfolio.account(params),
    () => sdk.portfolio.get(requireParams(params, "accountPortfolioQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfPlatformFeeQueryOptions<TData = MethodResult<IndexMethod<"getPlatformFee">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getPlatformFee">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getPlatformFee">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.platformFee(params),
    () => sdk.index.getPlatformFee(requireParams(params, "indexDtfPlatformFeeQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfPendingFeeSharesQueryOptions<TData = MethodResult<IndexMethod<"getPendingFeeShares">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getPendingFeeShares">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getPendingFeeShares">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.pendingFeeShares(params),
    () => sdk.index.getPendingFeeShares(requireParams(params, "indexDtfPendingFeeSharesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfApprovedRevenueTokensQueryOptions<
  TData = MethodResult<IndexMethod<"getApprovedRevenueTokens">>,
>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getApprovedRevenueTokens">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getApprovedRevenueTokens">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.approvedRevenueTokens(params),
    () => sdk.index.getApprovedRevenueTokens(requireParams(params, "indexDtfApprovedRevenueTokensQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfRebalanceAuctionsQueryOptions<TData = MethodResult<IndexMethod<"getRebalanceAuctions">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getRebalanceAuctions">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getRebalanceAuctions">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.rebalanceAuctions(params),
    () => sdk.index.getRebalanceAuctions(requireParams(params, "indexDtfRebalanceAuctionsQueryOptions")),
    params !== undefined,
    options,
    LIVE_STALE_TIME,
  );
}

export function indexDtfCompletedRebalanceQueryOptions<TData = MethodResult<IndexMethod<"getCompletedRebalance">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getCompletedRebalance">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getCompletedRebalance">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.completedRebalance(params),
    () => sdk.index.getCompletedRebalance(requireParams(params, "indexDtfCompletedRebalanceQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfCompletedRebalancesQueryOptions<TData = MethodResult<IndexMethod<"getCompletedRebalances">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getCompletedRebalances">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getCompletedRebalances">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.completedRebalances(params),
    () => sdk.index.getCompletedRebalances(requireParams(params, "indexDtfCompletedRebalancesQueryOptions")),
    params !== undefined,
    options,
  );
}

export function accountPortfolioHistoryQueryOptions<TData = MethodResult<PortfolioMethod<"getHistory">>>(
  sdk: DtfSdk,
  params: MethodParams<PortfolioMethod<"getHistory">> | undefined,
  options?: DtfQueryOptions<MethodResult<PortfolioMethod<"getHistory">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.portfolio.history(params),
    () => sdk.portfolio.getHistory(requireParams(params, "accountPortfolioHistoryQueryOptions")),
    params !== undefined,
    options,
  );
}

export function accountPortfolioTransactionsQueryOptions<TData = MethodResult<PortfolioMethod<"getTransactions">>>(
  sdk: DtfSdk,
  params: MethodParams<PortfolioMethod<"getTransactions">> | undefined,
  options?: DtfQueryOptions<MethodResult<PortfolioMethod<"getTransactions">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.portfolio.transactions(params),
    () => sdk.portfolio.getTransactions(requireParams(params, "accountPortfolioTransactionsQueryOptions")),
    params !== undefined,
    options,
  );
}
