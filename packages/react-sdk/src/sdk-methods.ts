import type { DtfSdk } from "@reserve-protocol/sdk";

/** Resolves an sdk.index method by name, for deriving param/result types. */
export type IndexMethod<TKey extends keyof DtfSdk["index"]> = DtfSdk["index"][TKey] extends (...args: any) => any
  ? DtfSdk["index"][TKey]
  : never;

export type IndexMethodParams<TKey extends keyof DtfSdk["index"]> = Parameters<IndexMethod<TKey>>[0];

/** Resolves an sdk.portfolio method by name, for deriving param/result types. */
export type PortfolioMethod<TKey extends keyof DtfSdk["portfolio"]> = DtfSdk["portfolio"][TKey] extends (
  ...args: any
) => any
  ? DtfSdk["portfolio"][TKey]
  : never;

export type PortfolioMethodParams<TKey extends keyof DtfSdk["portfolio"]> = Parameters<PortfolioMethod<TKey>>[0];

/** Resolves an sdk.yield method by name, for deriving param/result types. */
export type YieldMethod<TKey extends keyof DtfSdk["yield"]> = DtfSdk["yield"][TKey] extends (...args: any) => any
  ? DtfSdk["yield"][TKey]
  : never;

export type YieldMethodParams<TKey extends keyof DtfSdk["yield"]> = Parameters<YieldMethod<TKey>>[0];

export type MethodParams<TMethod extends (...args: any) => any> = Parameters<TMethod>[0];

export type MethodResult<TMethod extends (...args: any) => any> = Awaited<ReturnType<TMethod>>;
