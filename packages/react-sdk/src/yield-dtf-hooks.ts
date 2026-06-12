import { useMemo } from "react";

import type { DtfSdk } from "@reserve-protocol/sdk";

import { useQuery } from "@tanstack/react-query";

import type { MethodParams, MethodResult, YieldMethod } from "@/sdk-methods";

import { useDtfSdk } from "@/provider";
import {
  createDtfQueryOptions,
  LIVE_STALE_TIME,
  requireParams,
  STATIC_STALE_TIME,
  type DtfQueryOptions,
} from "@/query";
import { dtfQueryKeys } from "@/query-keys";

export function yieldDtfQueryOptions<TData = MethodResult<YieldMethod<"get">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"get">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"get">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.full(params),
    () => sdk.yield.get(requireParams(params, "yieldDtfQueryOptions")),
    params !== undefined,
    options,
    STATIC_STALE_TIME,
  );
}

export function yieldDtfListQueryOptions<TData = MethodResult<YieldMethod<"list">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"list">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"list">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.list(params),
    () => sdk.yield.list(requireParams(params, "yieldDtfListQueryOptions")),
    params !== undefined,
    options,
    STATIC_STALE_TIME,
  );
}

export function yieldDtfContractsQueryOptions<TData = MethodResult<YieldMethod<"getContracts">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"getContracts">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getContracts">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.contracts(params),
    () => sdk.yield.getContracts(requireParams(params, "yieldDtfContractsQueryOptions")),
    params !== undefined,
    options,
    STATIC_STALE_TIME,
  );
}

export function yieldDtfStateQueryOptions<TData = MethodResult<YieldMethod<"getState">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"getState">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getState">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.state(params),
    () => sdk.yield.getState(requireParams(params, "yieldDtfStateQueryOptions")),
    params !== undefined,
    options,
  );
}

export function yieldDtfPriceQueryOptions<TData = MethodResult<YieldMethod<"getPrice">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"getPrice">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getPrice">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.price(params),
    () => sdk.yield.getPrice(requireParams(params, "yieldDtfPriceQueryOptions")),
    params !== undefined,
    options,
    LIVE_STALE_TIME,
  );
}

export function yieldDtfBasketQueryOptions<TData = MethodResult<YieldMethod<"getBasket">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"getBasket">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getBasket">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.basket(params),
    () => sdk.yield.getBasket(requireParams(params, "yieldDtfBasketQueryOptions")),
    params !== undefined,
    options,
  );
}

export function yieldDtfHoldersQueryOptions<TData = MethodResult<YieldMethod<"getHolders">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"getHolders">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getHolders">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.holders(params),
    () => sdk.yield.getHolders(requireParams(params, "yieldDtfHoldersQueryOptions")),
    params !== undefined,
    options,
  );
}

export function yieldDtfTransactionsQueryOptions<TData = MethodResult<YieldMethod<"getTransactions">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"getTransactions">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getTransactions">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.transactions(params),
    () => sdk.yield.getTransactions(requireParams(params, "yieldDtfTransactionsQueryOptions")),
    params !== undefined,
    options,
  );
}

export function yieldDtfIssuanceQuoteQueryOptions<TData = MethodResult<YieldMethod<"getIssuanceQuote">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"getIssuanceQuote">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getIssuanceQuote">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.issuanceQuote(params),
    () => sdk.yield.getIssuanceQuote(requireParams(params, "yieldDtfIssuanceQuoteQueryOptions")),
    params !== undefined,
    options,
    LIVE_STALE_TIME,
  );
}

export function yieldDtfRedemptionQuoteQueryOptions<TData = MethodResult<YieldMethod<"getRedemptionQuote">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"getRedemptionQuote">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getRedemptionQuote">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.redemptionQuote(params),
    () => sdk.yield.getRedemptionQuote(requireParams(params, "yieldDtfRedemptionQuoteQueryOptions")),
    params !== undefined,
    options,
    LIVE_STALE_TIME,
  );
}

export function yieldDtfMaxIssuableQueryOptions<TData = MethodResult<YieldMethod<"getMaxIssuable">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"getMaxIssuable">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getMaxIssuable">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.maxIssuable(params),
    () => sdk.yield.getMaxIssuable(requireParams(params, "yieldDtfMaxIssuableQueryOptions")),
    params !== undefined,
    options,
    LIVE_STALE_TIME,
  );
}

export function yieldDtfStakingStateQueryOptions<TData = MethodResult<YieldMethod<"getStakingState">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"getStakingState">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getStakingState">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.stakingState(params),
    () => sdk.yield.getStakingState(requireParams(params, "yieldDtfStakingStateQueryOptions")),
    params !== undefined,
    options,
  );
}

export function yieldDtfStakeHistoryQueryOptions<TData = MethodResult<YieldMethod<"getStakeHistory">>>(
  sdk: DtfSdk,
  params: MethodParams<YieldMethod<"getStakeHistory">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getStakeHistory">>, TData>,
) {
  return createDtfQueryOptions(
    dtfQueryKeys.yield.stakeHistory(params),
    () => sdk.yield.getStakeHistory(requireParams(params, "yieldDtfStakeHistoryQueryOptions")),
    params !== undefined,
    options,
  );
}

export function useYieldDtf<TData = MethodResult<YieldMethod<"get">>>(
  params: MethodParams<YieldMethod<"get">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"get">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfQueryOptions(sdk, params, options));
}

export function useYieldDtfList<TData = MethodResult<YieldMethod<"list">>>(
  params: MethodParams<YieldMethod<"list">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"list">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfListQueryOptions(sdk, params, options));
}

export function useYieldDtfContracts<TData = MethodResult<YieldMethod<"getContracts">>>(
  params: MethodParams<YieldMethod<"getContracts">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getContracts">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfContractsQueryOptions(sdk, params, options));
}

export function useYieldDtfState<TData = MethodResult<YieldMethod<"getState">>>(
  params: MethodParams<YieldMethod<"getState">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getState">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfStateQueryOptions(sdk, params, options));
}

export function useYieldDtfPrice<TData = MethodResult<YieldMethod<"getPrice">>>(
  params: MethodParams<YieldMethod<"getPrice">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getPrice">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfPriceQueryOptions(sdk, params, options));
}

export function useYieldDtfBasket<TData = MethodResult<YieldMethod<"getBasket">>>(
  params: MethodParams<YieldMethod<"getBasket">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getBasket">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfBasketQueryOptions(sdk, params, options));
}

export function useYieldDtfHolders<TData = MethodResult<YieldMethod<"getHolders">>>(
  params: MethodParams<YieldMethod<"getHolders">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getHolders">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfHoldersQueryOptions(sdk, params, options));
}

export function useYieldDtfTransactions<TData = MethodResult<YieldMethod<"getTransactions">>>(
  params: MethodParams<YieldMethod<"getTransactions">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getTransactions">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfTransactionsQueryOptions(sdk, params, options));
}

export function useYieldDtfIssuanceQuote<TData = MethodResult<YieldMethod<"getIssuanceQuote">>>(
  params: MethodParams<YieldMethod<"getIssuanceQuote">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getIssuanceQuote">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfIssuanceQuoteQueryOptions(sdk, params, options));
}

export function useYieldDtfRedemptionQuote<TData = MethodResult<YieldMethod<"getRedemptionQuote">>>(
  params: MethodParams<YieldMethod<"getRedemptionQuote">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getRedemptionQuote">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfRedemptionQuoteQueryOptions(sdk, params, options));
}

export function useYieldDtfMaxIssuable<TData = MethodResult<YieldMethod<"getMaxIssuable">>>(
  params: MethodParams<YieldMethod<"getMaxIssuable">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getMaxIssuable">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfMaxIssuableQueryOptions(sdk, params, options));
}

export function useYieldDtfStakingState<TData = MethodResult<YieldMethod<"getStakingState">>>(
  params: MethodParams<YieldMethod<"getStakingState">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getStakingState">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfStakingStateQueryOptions(sdk, params, options));
}

export function useYieldDtfStakeHistory<TData = MethodResult<YieldMethod<"getStakeHistory">>>(
  params: MethodParams<YieldMethod<"getStakeHistory">> | undefined,
  options?: DtfQueryOptions<MethodResult<YieldMethod<"getStakeHistory">>, TData>,
) {
  const sdk = useDtfSdk();
  return useQuery(yieldDtfStakeHistoryQueryOptions(sdk, params, options));
}

export function useYieldDtfIssueCall(params: Parameters<DtfSdk["yield"]["prepareIssue"]>[0] | undefined) {
  const sdk = useDtfSdk();
  const chainId = params?.chainId;
  const address = params?.address;
  const amount = params?.amount;

  return useMemo(() => {
    if (chainId === undefined || !address || amount === undefined) {
      return undefined;
    }

    return sdk.yield.prepareIssue({ chainId, address, amount });
  }, [chainId, address, amount, sdk]);
}

export function useYieldDtfRedeemCall(params: Parameters<DtfSdk["yield"]["prepareRedeem"]>[0] | undefined) {
  const sdk = useDtfSdk();
  const chainId = params?.chainId;
  const address = params?.address;
  const amount = params?.amount;

  return useMemo(() => {
    if (chainId === undefined || !address || amount === undefined) {
      return undefined;
    }

    return sdk.yield.prepareRedeem({ chainId, address, amount });
  }, [chainId, address, amount, sdk]);
}

export function useYieldDtfStakeCall(params: Parameters<DtfSdk["yield"]["prepareStake"]>[0] | undefined) {
  const sdk = useDtfSdk();
  const chainId = params?.chainId;
  const stToken = params?.stToken;
  const amount = params?.amount;

  return useMemo(() => {
    if (chainId === undefined || !stToken || amount === undefined) {
      return undefined;
    }

    return sdk.yield.prepareStake({ chainId, stToken, amount });
  }, [chainId, stToken, amount, sdk]);
}

export function useYieldDtfUnstakeCall(params: Parameters<DtfSdk["yield"]["prepareUnstake"]>[0] | undefined) {
  const sdk = useDtfSdk();
  const chainId = params?.chainId;
  const stToken = params?.stToken;
  const amount = params?.amount;

  return useMemo(() => {
    if (chainId === undefined || !stToken || amount === undefined) {
      return undefined;
    }

    return sdk.yield.prepareUnstake({ chainId, stToken, amount });
  }, [chainId, stToken, amount, sdk]);
}

export function useYieldDtfWithdrawCall(params: Parameters<DtfSdk["yield"]["prepareWithdraw"]>[0] | undefined) {
  const sdk = useDtfSdk();
  const chainId = params?.chainId;
  const stToken = params?.stToken;
  const account = params?.account;
  const endId = params?.endId;

  return useMemo(() => {
    if (chainId === undefined || !stToken || !account || endId === undefined) {
      return undefined;
    }

    return sdk.yield.prepareWithdraw({ chainId, stToken, account, endId });
  }, [chainId, stToken, account, endId, sdk]);
}
