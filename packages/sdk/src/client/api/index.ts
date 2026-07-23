import { getAddress } from "viem";

import type {
  DtfClientApi,
  ReserveApiDtfPrice,
  ReserveApiHistoricalTokenPrices,
  ReserveApiIndexDtfBasketSnapshot,
  ReserveApiIndexDtfPrice,
  ReserveApiIndexDtfPriceHistory,
  ReserveApiIndexDtfRebalanceDetail,
  ReserveApiIndexDtfRebalanceHistoryItem,
} from "@/types/api";

import { getApiTokenPrices, getBasketTokenPricesWithSnapshot } from "@/client/api/prices";
import { SdkError } from "@/lib/errors";
import { uniqueAddresses } from "@/lib/utils";
import { get, post, type GetOptions } from "@/transports/api";

export type * from "@/types/api";

export function createDtfClientApi({ baseUrl }: { readonly baseUrl: string }): DtfClientApi {
  const apiGet = <TResult>(options: Omit<GetOptions, "baseUrl">) =>
    get<TResult>({
      ...options,
      baseUrl,
    });

  return {
    baseUrl,
    get(options) {
      return apiGet(options);
    },
    post(options) {
      return post({
        ...options,
        baseUrl,
      });
    },
    getTokenPrices(params) {
      return getApiTokenPrices(apiGet, params);
    },
    getDtfPrices(params) {
      const addresses = uniqueAddresses(params.addresses);

      if (addresses.length === 0) {
        return Promise.resolve([]);
      }

      return apiGet<readonly ReserveApiDtfPrice[]>({
        path: "/current/dtfs",
        query: {
          chainId: params.chainId,
          addresses: addresses.join(","),
        },
      });
    },
    getHistoricalTokenPrices(params) {
      return apiGet<ReserveApiHistoricalTokenPrices>({
        path: "/historical/prices",
        query: {
          chainId: params.chainId,
          from: params.from,
          to: params.to,
          interval: params.interval,
          address: getAddress(params.address).toLowerCase(),
        },
      });
    },
    getBasketTokenPricesWithSnapshot(params) {
      return getBasketTokenPricesWithSnapshot(apiGet, params);
    },
    getIndexDtfPrice(params) {
      return apiGet<ReserveApiIndexDtfPrice>({
        path: "/current/dtf",
        query: {
          address: getAddress(params.address).toLowerCase(),
          chainId: params.chainId,
        },
      });
    },
    getIndexDtfPriceHistory(params) {
      return apiGet<ReserveApiIndexDtfPriceHistory>({
        path: "/historical/dtf",
        query: {
          chainId: params.chainId,
          address: getAddress(params.address).toLowerCase(),
          from: params.from,
          to: params.to,
          interval: params.interval,
        },
      });
    },
    getIndexDtfBasketSnapshot(params) {
      const blockNumber = params.blockNumber === undefined ? undefined : Number(params.blockNumber);

      return apiGet<ReserveApiIndexDtfBasketSnapshot>({
        path: blockNumber === undefined ? "/current/dtf" : "/snapshot/dtf",
        query: {
          address: getAddress(params.address).toLowerCase(),
          chainId: params.chainId,
          blockNumber,
          cache: false,
        },
      });
    },
    getIndexDtfRebalanceHistory(params) {
      return apiGet<readonly ReserveApiIndexDtfRebalanceHistoryItem[]>({
        path: "/dtf/rebalance",
        query: {
          address: getAddress(params.address).toLowerCase(),
          chainId: params.chainId,
          skip: params.skip ?? 0,
          limit: params.limit ?? 50,
        },
      });
    },
    async getIndexDtfRebalanceDetail(params) {
      // The nonce-filtered endpoint returns a single-element array; normalize the
      // envelope here so callers get one detail record.
      const response = await apiGet<readonly ReserveApiIndexDtfRebalanceDetail[]>({
        path: "/dtf/rebalance",
        query: {
          address: getAddress(params.address).toLowerCase(),
          chainId: params.chainId,
          nonce: String(params.nonce),
        },
      });

      const detail = response[0];
      if (!detail) {
        throw new SdkError({
          code: "RECORD_NOT_FOUND",
          message: `Reserve API returned no rebalance detail for nonce ${String(params.nonce)}`,
          meta: { chainId: params.chainId, nonce: String(params.nonce) },
        });
      }

      return detail;
    },
  };
}
