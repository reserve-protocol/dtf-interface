import type { DefaultError, QueryKey, UseQueryOptions } from "@tanstack/react-query";

/** Prices, auctions, issuance quotes — data that moves block to block. */
export const LIVE_STALE_TIME = 10_000;
/** Governance and account state — fresh enough for UI without refetching every mount. */
export const DEFAULT_STALE_TIME = 30_000;
/** Identity, brand, version, catalogs, immutable decodes — rarely or never change. */
export const STATIC_STALE_TIME = 300_000;

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

export function createDtfQueryOptions<TQueryFnData, TData = TQueryFnData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TQueryFnData>,
  enabled: boolean,
  options: DtfQueryOptions<TQueryFnData, TData> = {},
  staleTime: number = DEFAULT_STALE_TIME,
): DtfQueryOptionsResult<TQueryFnData, TData> {
  return {
    staleTime,
    ...options,
    queryKey,
    queryFn,
    enabled: enabled && options.enabled !== false,
  };
}

export function requireParams<T>(params: T | undefined, method: string): T {
  if (params === undefined) {
    throw new Error(`${method} params are required.`);
  }

  return params;
}
