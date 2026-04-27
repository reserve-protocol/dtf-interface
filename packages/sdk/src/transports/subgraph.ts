import {
  ClientError,
  request,
  type RequestDocument,
  type TypedDocumentString,
  type Variables,
} from "graphql-request";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  resolveDtfClient,
  type DtfClientOptions,
} from "../clients/create-dtf-client.js";
import { supportedChainIds, type SupportedChainId } from "../defaults.js";

type SubgraphProduct = "index" | "yield";

export type SubgraphDocument<
  TResult,
  TVariables extends Variables = Record<string, never>,
> =
  | RequestDocument
  | TypedDocumentNode<TResult, TVariables>
  | TypedDocumentString<TResult, TVariables>;

type QueryProductSubgraphOptions<
  TResult,
  TVariables extends Variables = Record<string, never>,
> = DtfClientOptions & {
  readonly chainId: SupportedChainId;
  readonly product: SubgraphProduct;
  readonly query: SubgraphDocument<TResult, TVariables>;
  readonly requestHeaders?: HeadersInit;
  readonly variables?: TVariables;
};

export type QueryIndexSubgraphOptions<
  TResult,
  TVariables extends Variables = Record<string, never>,
> = Omit<QueryProductSubgraphOptions<TResult, TVariables>, "product">;

export type QueryYieldSubgraphOptions<
  TResult,
  TVariables extends Variables = Record<string, never>,
> = Omit<QueryProductSubgraphOptions<TResult, TVariables>, "product">;

export type QueryIndexSubgraphsOptions<
  TResult,
  TVariables extends Variables = Record<string, never>,
> = DtfClientOptions & {
  readonly chainIds?: readonly SupportedChainId[];
  readonly query: SubgraphDocument<TResult, TVariables>;
  readonly requestHeaders?: HeadersInit;
  readonly variables?: TVariables | ((chainId: SupportedChainId) => TVariables);
};

async function queryProductSubgraph<
  TResult,
  TVariables extends Variables = Record<string, never>,
>({
  chainId,
  client,
  product,
  query,
  requestHeaders,
  variables,
}: QueryProductSubgraphOptions<TResult, TVariables>): Promise<TResult> {
  const dtfClient = resolveDtfClient(client);
  const url =
    product === "index"
      ? dtfClient.getIndexSubgraphUrl(chainId)
      : dtfClient.getYieldSubgraphUrl(chainId);

  try {
    const requestGraphql = request as (
      url: string,
      query: SubgraphDocument<TResult, TVariables>,
      variables?: TVariables,
      requestHeaders?: HeadersInit,
    ) => Promise<TResult>;

    return await requestGraphql(url, query, variables, requestHeaders);
  } catch (cause) {
    throw new Error(
      formatSubgraphErrorMessage({
        cause,
        chainId,
        product,
      }),
      { cause },
    );
  }
}

export function queryIndexSubgraph<
  TResult,
  TVariables extends Variables = Record<string, never>,
>(options: QueryIndexSubgraphOptions<TResult, TVariables>): Promise<TResult> {
  return queryProductSubgraph<TResult, TVariables>({
    ...options,
    product: "index",
  });
}

export function queryYieldSubgraph<
  TResult,
  TVariables extends Variables = Record<string, never>,
>(options: QueryYieldSubgraphOptions<TResult, TVariables>): Promise<TResult> {
  return queryProductSubgraph<TResult, TVariables>({
    ...options,
    product: "yield",
  });
}

export async function queryIndexSubgraphs<
  TResult,
  TVariables extends Variables = Record<string, never>,
>({
  chainIds = supportedChainIds,
  client,
  query,
  requestHeaders,
  variables,
}: QueryIndexSubgraphsOptions<TResult, TVariables>): Promise<
  Partial<Record<SupportedChainId, TResult>>
> {
  const results = await Promise.all(
    chainIds.map(async (chainId) => {
      const data = await queryIndexSubgraph<TResult, TVariables>({
        chainId,
        query,
        ...(client === undefined ? {} : { client }),
        ...(requestHeaders === undefined ? {} : { requestHeaders }),
        ...(variables === undefined
          ? {}
          : {
              variables:
                typeof variables === "function"
                  ? variables(chainId)
                  : variables,
            }),
      });

      return [chainId, data] as const;
    }),
  );

  return Object.fromEntries(results) as Partial<
    Record<SupportedChainId, TResult>
  >;
}

function formatSubgraphErrorMessage({
  cause,
  chainId,
  product,
}: {
  readonly cause: unknown;
  readonly chainId: SupportedChainId;
  readonly product: SubgraphProduct;
}): string {
  const prefix = `DTF SDK ${product} subgraph request failed on chain ${chainId}`;

  if (cause instanceof ClientError) {
    const status = cause.response.status;
    const messages = cause.response.errors
      ?.map((error) => error.message)
      .filter(Boolean)
      .join("; ");

    return `${prefix}${status ? ` (${status})` : ""}${
      messages ? `: ${messages}` : "."
    }`;
  }

  return cause instanceof Error ? `${prefix}: ${cause.message}` : `${prefix}.`;
}
