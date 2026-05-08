import type { QueryKey } from "@tanstack/react-query";
import type { DtfSdk } from "@dtf-interface/sdk";
import type { DtfQueryOptions, DtfQueryOptionsResult } from "./query-options.js";
import { normalizeQueryKeyValue } from "./normalize-query-key.js";

type IndexMethod<TKey extends keyof DtfSdk["index"]> = DtfSdk["index"][TKey] extends (...args: any) => any
  ? DtfSdk["index"][TKey]
  : never;
type PortfolioMethod<TKey extends keyof DtfSdk["portfolio"]> = DtfSdk["portfolio"][TKey] extends (...args: any) => any
  ? DtfSdk["portfolio"][TKey]
  : never;
type MethodParams<TMethod extends (...args: any) => any> = Parameters<TMethod>[0];
type MethodResult<TMethod extends (...args: any) => any> = Awaited<ReturnType<TMethod>>;

function queryOptions<TQueryFnData, TData = TQueryFnData>(
  key: QueryKey,
  queryFn: () => Promise<TQueryFnData>,
  enabled: boolean,
  options: DtfQueryOptions<TQueryFnData, TData> = {},
): DtfQueryOptionsResult<TQueryFnData, TData> {
  return {
    ...options,
    queryKey: key,
    queryFn,
    enabled: enabled && options.enabled !== false,
  };
}

function key(scope: string, params: unknown): QueryKey {
  return ["dtf", "index", scope, normalizeQueryKeyValue(params)];
}

function requireParams<T>(params: T | undefined, method: string): T {
  if (params === undefined) {
    throw new Error(`${method} params are required.`);
  }

  return params;
}

export function indexDtfStatusQueryOptions<TData = MethodResult<IndexMethod<"getStatus">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getStatus">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getStatus">>, TData>,
) {
  return queryOptions(key("status", params), () => sdk.index.getStatus(requireParams(params, "indexDtfStatusQueryOptions")), params !== undefined, options);
}

export function indexDtfExposureQueryOptions<TData = MethodResult<IndexMethod<"getExposure">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getExposure">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getExposure">>, TData>,
) {
  return queryOptions(key("exposure", params), () => sdk.index.getExposure(requireParams(params, "indexDtfExposureQueryOptions")), params !== undefined, options);
}

export function indexDtfTransactionsQueryOptions<TData = MethodResult<IndexMethod<"getTransactions">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getTransactions">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getTransactions">>, TData>,
) {
  return queryOptions(key("transactions", params), () => sdk.index.getTransactions(requireParams(params, "indexDtfTransactionsQueryOptions")), params !== undefined, options);
}

export function indexDtfRevenueQueryOptions<TData = MethodResult<IndexMethod<"getRevenue">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getRevenue">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getRevenue">>, TData>,
) {
  return queryOptions(key("revenue", params), () => sdk.index.getRevenue(requireParams(params, "indexDtfRevenueQueryOptions")), params !== undefined, options);
}

export function indexDtfIssuanceStateQueryOptions<TData = MethodResult<IndexMethod<"getIssuanceState">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getIssuanceState">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getIssuanceState">>, TData>,
) {
  return queryOptions(key("issuance-state", params), () => sdk.index.getIssuanceState(requireParams(params, "indexDtfIssuanceStateQueryOptions")), params !== undefined, options);
}

export function indexDtfRebalancesQueryOptions<TData = MethodResult<IndexMethod<"getRebalances">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getRebalances">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getRebalances">>, TData>,
) {
  return queryOptions(key("rebalances", params), () => sdk.index.getRebalances(requireParams(params, "indexDtfRebalancesQueryOptions")), params !== undefined, options);
}

export function indexDtfCurrentRebalanceQueryOptions<TData = MethodResult<IndexMethod<"getCurrentRebalance">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getCurrentRebalance">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getCurrentRebalance">>, TData>,
) {
  return queryOptions(key("current-rebalance", params), () => sdk.index.getCurrentRebalance(requireParams(params, "indexDtfCurrentRebalanceQueryOptions")), params !== undefined, options);
}

export function indexDtfVoteLockStateQueryOptions<TData = MethodResult<IndexMethod<"getVoteLockState">>>(
  sdk: DtfSdk,
  params: MethodParams<IndexMethod<"getVoteLockState">> | undefined,
  options?: DtfQueryOptions<MethodResult<IndexMethod<"getVoteLockState">>, TData>,
) {
  return queryOptions(key("vote-lock-state", params), () => sdk.index.getVoteLockState(requireParams(params, "indexDtfVoteLockStateQueryOptions")), params !== undefined, options);
}

export function accountPortfolioQueryOptions<TData = MethodResult<PortfolioMethod<"get">>>(
  sdk: DtfSdk,
  params: MethodParams<PortfolioMethod<"get">> | undefined,
  options?: DtfQueryOptions<MethodResult<PortfolioMethod<"get">>, TData>,
) {
  return queryOptions(["dtf", "portfolio", normalizeQueryKeyValue(params)], () => sdk.portfolio.get(requireParams(params, "accountPortfolioQueryOptions")), params !== undefined, options);
}
