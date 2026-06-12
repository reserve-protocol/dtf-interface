import { useQuery } from "@tanstack/react-query";

import type { DtfQueryOptions } from "@/query-options";
import type { IndexMethod, MethodParams, MethodResult, PortfolioMethod } from "@/sdk-methods";

import {
  accountPortfolioHistoryQueryOptions,
  accountPortfolioQueryOptions,
  accountPortfolioTransactionsQueryOptions,
  indexDtfApprovedRevenueTokensQueryOptions,
  indexDtfCompletedRebalanceQueryOptions,
  indexDtfCompletedRebalancesQueryOptions,
  indexDtfCurrentRebalanceQueryOptions,
  indexDtfExposureQueryOptions,
  indexDtfIssuanceStateQueryOptions,
  indexDtfPendingFeeSharesQueryOptions,
  indexDtfPlatformFeeQueryOptions,
  indexDtfRebalanceAuctionsQueryOptions,
  indexDtfRebalancesQueryOptions,
  indexDtfRevenueQueryOptions,
  indexDtfStatusQueryOptions,
  indexDtfTransactionsQueryOptions,
  indexDtfVoteLockStateQueryOptions,
  indexDtfVoteLockVaultStateQueryOptions,
} from "@/index-dtf-query-options";
import { useDtfSdk } from "@/provider";

export function useIndexDtfStatus<TData = MethodResult<IndexMethod<"getStatus">>>(
  params: MethodParams<IndexMethod<"getStatus">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getStatus">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfStatusQueryOptions(sdk, params, options));
}

export function useIndexDtfExposure<TData = MethodResult<IndexMethod<"getExposure">>>(
  params: MethodParams<IndexMethod<"getExposure">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getExposure">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfExposureQueryOptions(sdk, params, options));
}

export function useIndexDtfTransactions<TData = MethodResult<IndexMethod<"getTransactions">>>(
  params: MethodParams<IndexMethod<"getTransactions">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getTransactions">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfTransactionsQueryOptions(sdk, params, options));
}

export function useIndexDtfRevenue<TData = MethodResult<IndexMethod<"getRevenue">>>(
  params: MethodParams<IndexMethod<"getRevenue">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getRevenue">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfRevenueQueryOptions(sdk, params, options));
}

export function useIndexDtfPlatformFee<TData = MethodResult<IndexMethod<"getPlatformFee">>>(
  params: MethodParams<IndexMethod<"getPlatformFee">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getPlatformFee">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfPlatformFeeQueryOptions(sdk, params, options));
}

export function useIndexDtfPendingFeeShares<TData = MethodResult<IndexMethod<"getPendingFeeShares">>>(
  params: MethodParams<IndexMethod<"getPendingFeeShares">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getPendingFeeShares">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfPendingFeeSharesQueryOptions(sdk, params, options));
}

export function useIndexDtfApprovedRevenueTokens<TData = MethodResult<IndexMethod<"getApprovedRevenueTokens">>>(
  params: MethodParams<IndexMethod<"getApprovedRevenueTokens">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getApprovedRevenueTokens">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfApprovedRevenueTokensQueryOptions(sdk, params, options));
}

export function useIndexDtfIssuanceState<TData = MethodResult<IndexMethod<"getIssuanceState">>>(
  params: MethodParams<IndexMethod<"getIssuanceState">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getIssuanceState">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfIssuanceStateQueryOptions(sdk, params, options));
}

export function useIndexDtfRebalances<TData = MethodResult<IndexMethod<"getRebalances">>>(
  params: MethodParams<IndexMethod<"getRebalances">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getRebalances">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfRebalancesQueryOptions(sdk, params, options));
}

export function useIndexDtfCurrentRebalance<TData = MethodResult<IndexMethod<"getCurrentRebalance">>>(
  params: MethodParams<IndexMethod<"getCurrentRebalance">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getCurrentRebalance">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfCurrentRebalanceQueryOptions(sdk, params, options));
}

export function useIndexDtfRebalanceAuctions<TData = MethodResult<IndexMethod<"getRebalanceAuctions">>>(
  params: MethodParams<IndexMethod<"getRebalanceAuctions">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getRebalanceAuctions">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfRebalanceAuctionsQueryOptions(sdk, params, options));
}

export function useIndexDtfCompletedRebalance<TData = MethodResult<IndexMethod<"getCompletedRebalance">>>(
  params: MethodParams<IndexMethod<"getCompletedRebalance">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getCompletedRebalance">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfCompletedRebalanceQueryOptions(sdk, params, options));
}

export function useIndexDtfCompletedRebalances<TData = MethodResult<IndexMethod<"getCompletedRebalances">>>(
  params: MethodParams<IndexMethod<"getCompletedRebalances">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getCompletedRebalances">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfCompletedRebalancesQueryOptions(sdk, params, options));
}

export function useIndexDtfVoteLockState<TData = MethodResult<IndexMethod<"getVoteLockState">>>(
  params: MethodParams<IndexMethod<"getVoteLockState">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockState">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfVoteLockStateQueryOptions(sdk, params, options));
}

export function useIndexDtfVoteLockVaultState<TData = MethodResult<IndexMethod<"getVoteLockVaultState">>>(
  params: MethodParams<IndexMethod<"getVoteLockVaultState">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockVaultState">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfVoteLockVaultStateQueryOptions(sdk, params, options));
}

export function useAccountPortfolio<TData = MethodResult<PortfolioMethod<"get">>>(
  params: MethodParams<PortfolioMethod<"get">> | undefined,
  options?: DtfQueryOptions<MethodResult<PortfolioMethod<"get">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(accountPortfolioQueryOptions(sdk, params, options));
}

export function useAccountPortfolioHistory<TData = MethodResult<PortfolioMethod<"getHistory">>>(
  params: MethodParams<PortfolioMethod<"getHistory">> | undefined,
  options?: DtfQueryOptions<MethodResult<PortfolioMethod<"getHistory">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(accountPortfolioHistoryQueryOptions(sdk, params, options));
}

export function useAccountPortfolioTransactions<TData = MethodResult<PortfolioMethod<"getTransactions">>>(
  params: MethodParams<PortfolioMethod<"getTransactions">> | undefined,
  options?: DtfQueryOptions<MethodResult<PortfolioMethod<"getTransactions">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(accountPortfolioTransactionsQueryOptions(sdk, params, options));
}
