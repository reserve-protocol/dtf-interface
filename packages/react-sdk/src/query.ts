import type { DefaultError, QueryKey, UseQueryOptions } from "@tanstack/react-query";

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
): DtfQueryOptionsResult<TQueryFnData, TData> {
  return {
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
