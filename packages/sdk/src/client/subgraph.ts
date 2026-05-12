import type { Variables } from "graphql-request";

import { supportedChainIds, type SupportedChainId } from "@/defaults";
import { SdkError } from "@/errors";
import { querySubgraph, type SubgraphDocument } from "@/transports/subgraph";

export type DtfClientSubgraphChainConfig = {
  readonly indexSubgraphUrl?: string;
  readonly yieldSubgraphUrl?: string;
};

export type DtfClientSubgraphConfig = {
  readonly chains: Partial<Record<SupportedChainId, DtfClientSubgraphChainConfig>>;
};

export type QueryIndexSubgraphOptions<TResult, TVariables extends Variables = Record<string, never>> = {
  readonly chainId: SupportedChainId;
  readonly query: SubgraphDocument<TResult, TVariables>;
  readonly requestHeaders?: HeadersInit;
  readonly variables?: TVariables;
};

export type QueryYieldSubgraphOptions<
  TResult,
  TVariables extends Variables = Record<string, never>,
> = QueryIndexSubgraphOptions<TResult, TVariables>;

export type QueryIndexAllSubgraphsOptions<TResult, TVariables extends Variables = Record<string, never>> = {
  readonly chainIds?: readonly SupportedChainId[];
  readonly query: SubgraphDocument<TResult, TVariables>;
  readonly requestHeaders?: HeadersInit;
  readonly variables?: TVariables | ((chainId: SupportedChainId) => TVariables);
};

export type DtfClientSubgraph = {
  readonly getIndexUrl: (chainId: SupportedChainId) => string;
  readonly getYieldUrl: (chainId: SupportedChainId) => string;
  readonly queryIndex: <TResult, TVariables extends Variables = Record<string, never>>(
    options: QueryIndexSubgraphOptions<TResult, TVariables>,
  ) => Promise<TResult>;
  readonly queryIndexAll: <TResult, TVariables extends Variables = Record<string, never>>(
    options: QueryIndexAllSubgraphsOptions<TResult, TVariables>,
  ) => Promise<Partial<Record<SupportedChainId, TResult>>>;
  readonly queryYield: <TResult, TVariables extends Variables = Record<string, never>>(
    options: QueryYieldSubgraphOptions<TResult, TVariables>,
  ) => Promise<TResult>;
};

export function createDtfClientSubgraph({ chains }: DtfClientSubgraphConfig): DtfClientSubgraph {
  const subgraph: DtfClientSubgraph = {
    getIndexUrl(chainId) {
      const url = chains[chainId]?.indexSubgraphUrl;

      if (!url) {
        throw new SdkError({
          code: "NOT_CONFIGURED",
          message: `No Index DTF subgraph configured for chain id: ${chainId}`,
          meta: { chainId, product: "index", resource: "subgraph" },
        });
      }

      return url;
    },
    getYieldUrl(chainId) {
      const url = chains[chainId]?.yieldSubgraphUrl;

      if (!url) {
        throw new SdkError({
          code: "NOT_CONFIGURED",
          message: `No Yield DTF subgraph configured for chain id: ${chainId}`,
          meta: { chainId, product: "yield", resource: "subgraph" },
        });
      }

      return url;
    },
    queryIndex(options) {
      return querySubgraph({
        ...options,
        product: "index",
        url: subgraph.getIndexUrl(options.chainId),
      });
    },
    async queryIndexAll({ chainIds = supportedChainIds, query, requestHeaders, variables }) {
      const results = await Promise.all(
        chainIds.map(async (chainId) => {
          const chainVariables = typeof variables === "function" ? variables(chainId) : variables;
          const data = await subgraph.queryIndex({
            chainId,
            query,
            ...(requestHeaders === undefined ? {} : { requestHeaders }),
            ...(chainVariables === undefined ? {} : { variables: chainVariables }),
          });

          return [chainId, data] as const;
        }),
      );

      return Object.fromEntries(results) as Partial<Record<SupportedChainId, Awaited<(typeof results)[number][1]>>>;
    },
    queryYield(options) {
      return querySubgraph({
        ...options,
        product: "yield",
        url: subgraph.getYieldUrl(options.chainId),
      });
    },
  };

  return subgraph;
}
