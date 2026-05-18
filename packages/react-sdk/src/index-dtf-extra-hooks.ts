import type { DtfSdk } from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import type { DtfQueryOptions } from "@/query-options";

import {
  accountPortfolioQueryOptions,
  indexDtfCurrentRebalanceQueryOptions,
  indexDtfExposureQueryOptions,
  indexDtfIssuanceStateQueryOptions,
  indexDtfRebalancesQueryOptions,
  indexDtfRevenueQueryOptions,
  indexDtfStatusQueryOptions,
  indexDtfTransactionsQueryOptions,
  indexDtfVoteLockStateQueryOptions,
} from "@/index-dtf-query-options";
import { useDtfSdk } from "@/provider";

type IndexMethod<TKey extends keyof DtfSdk["index"]> = DtfSdk["index"][TKey] extends (...args: any) => any
  ? DtfSdk["index"][TKey]
  : never;
type PortfolioMethod<TKey extends keyof DtfSdk["portfolio"]> = DtfSdk["portfolio"][TKey] extends (...args: any) => any
  ? DtfSdk["portfolio"][TKey]
  : never;
type MethodParams<TMethod extends (...args: any) => any> = Parameters<TMethod>[0];
type MethodResult<TMethod extends (...args: any) => any> = Awaited<ReturnType<TMethod>>;

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

export function useIndexDtfVoteLockState<TData = MethodResult<IndexMethod<"getVoteLockState">>>(
  params: MethodParams<IndexMethod<"getVoteLockState">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockState">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(indexDtfVoteLockStateQueryOptions(sdk, params, options));
}

export function useAccountPortfolio<TData = MethodResult<PortfolioMethod<"get">>>(
  params: MethodParams<PortfolioMethod<"get">> | undefined,
  options?: DtfQueryOptions<MethodResult<PortfolioMethod<"get">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(accountPortfolioQueryOptions(sdk, params, options));
}
