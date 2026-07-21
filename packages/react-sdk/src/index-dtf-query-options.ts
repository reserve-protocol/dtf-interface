import type { DtfSdk } from "@reserve-protocol/sdk";

import type { IndexMethod, MethodParams, MethodResult, PortfolioMethod } from "@/sdk-methods";

import {
  createDtfQueryOptions,
  LIVE_STALE_TIME,
  requireParams,
  STATIC_STALE_TIME,
  type DtfQueryOptions,
} from "@/query";
import { dtfQueryKeys } from "@/query-keys";

export function indexDtfMandateQueryOptions<TData = MethodResult<IndexMethod<"getMandate">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getMandate">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getMandate">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.mandate(params),
    () => sdk.index.getMandate(requireParams(params, "indexDtfMandateQueryOptions")),
    params !== undefined,
    options,
    STATIC_STALE_TIME,
  );
}

export function indexDtfTotalSupplyQueryOptions<TData = MethodResult<IndexMethod<"getTotalSupply">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getTotalSupply">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getTotalSupply">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.totalSupply(params),
    () => sdk.index.getTotalSupply(requireParams(params, "indexDtfTotalSupplyQueryOptions")),
    params !== undefined,
    options,
    LIVE_STALE_TIME,
  );
}

export function indexDtfTotalAssetsQueryOptions<TData = MethodResult<IndexMethod<"getTotalAssets">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getTotalAssets">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getTotalAssets">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.totalAssets(params),
    () => sdk.index.getTotalAssets(requireParams(params, "indexDtfTotalAssetsQueryOptions")),
    params !== undefined,
    options,
    LIVE_STALE_TIME,
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

export function indexDtfAccountBalanceSnapshotQueryOptions<
  TData = MethodResult<IndexMethod<"getAccountBalanceSnapshot">>,
>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getAccountBalanceSnapshot">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getAccountBalanceSnapshot">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.accountBalanceSnapshot(params),
    () => sdk.index.getAccountBalanceSnapshot(requireParams(params, "indexDtfAccountBalanceSnapshotQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfHoldersQueryOptions<TData = MethodResult<IndexMethod<"getHolders">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getHolders">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getHolders">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.holders(params),
    () => sdk.index.getHolders(requireParams(params, "indexDtfHoldersQueryOptions")),
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

export function indexDtfBidsEnabledQueryOptions<TData = MethodResult<IndexMethod<"getBidsEnabled">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getBidsEnabled">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getBidsEnabled">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.bidsEnabled(params),
    () => sdk.index.getBidsEnabled(requireParams(params, "indexDtfBidsEnabledQueryOptions")),
    params !== undefined,
    options,
  );
}

export function indexDtfRebalanceControlQueryOptions<TData = MethodResult<IndexMethod<"getRebalanceControl">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getRebalanceControl">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getRebalanceControl">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.rebalanceControl(params),
    () => sdk.index.getRebalanceControl(requireParams(params, "indexDtfRebalanceControlQueryOptions")),
    params !== undefined,
    options,
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

export function indexDtfRebalanceQueryOptions<TData = MethodResult<IndexMethod<"getRebalance">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getRebalance">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getRebalance">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.rebalance(params),
    () => sdk.index.getRebalance(requireParams(params, "indexDtfRebalanceQueryOptions")),
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

export function indexDtfRebalanceLiquidityQueryOptions<TData = MethodResult<IndexMethod<"getRebalanceLiquidity">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getRebalanceLiquidity">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getRebalanceLiquidity">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.rebalanceLiquidity(params),
    () => sdk.index.getRebalanceLiquidity(requireParams(params, "indexDtfRebalanceLiquidityQueryOptions")),
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

export function indexDtfActiveAuctionQueryOptions<TData = MethodResult<IndexMethod<"getActiveAuction">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getActiveAuction">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getActiveAuction">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.activeAuction(params),
    () => sdk.index.getActiveAuction(requireParams(params, "indexDtfActiveAuctionQueryOptions")),
    params !== undefined,
    options,
    LIVE_STALE_TIME,
  );
}

export function indexDtfLatestAuctionQueryOptions<TData = MethodResult<IndexMethod<"getLatestAuction">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getLatestAuction">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getLatestAuction">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.latestAuction(params),
    () => sdk.index.getLatestAuction(requireParams(params, "indexDtfLatestAuctionQueryOptions")),
    params !== undefined,
    options,
    LIVE_STALE_TIME,
  );
}

export function indexDtfBidQuoteQueryOptions<TData = MethodResult<IndexMethod<"getBidQuote">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getBidQuote">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getBidQuote">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.index.bidQuote(params),
    () => sdk.index.getBidQuote(requireParams(params, "indexDtfBidQuoteQueryOptions")),
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
