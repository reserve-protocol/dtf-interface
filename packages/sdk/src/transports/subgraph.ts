import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  ClientError,
  request,
  type RequestDocument,
  type TypedDocumentString,
  type Variables,
} from "graphql-request";
import type { SupportedChainId } from "@/config";
import { SdkError, type SdkErrorMeta } from "@/lib/errors";

type SubgraphProduct = "index" | "yield";

export type SubgraphDocument<
  TResult,
  TVariables extends Variables = Record<string, never>,
> =
  | RequestDocument
  | TypedDocumentNode<TResult, TVariables>
  | TypedDocumentString<TResult, TVariables>;

export type QuerySubgraphOptions<
  TResult,
  TVariables extends Variables = Record<string, never>,
> = {
  readonly chainId: SupportedChainId;
  readonly product: SubgraphProduct;
  readonly query: SubgraphDocument<TResult, TVariables>;
  readonly requestHeaders?: HeadersInit;
  readonly url: string;
  readonly variables?: TVariables;
};

export async function querySubgraph<
  TResult,
  TVariables extends Variables = Record<string, never>,
>({
  chainId,
  product,
  query,
  requestHeaders,
  url,
  variables,
}: QuerySubgraphOptions<TResult, TVariables>): Promise<TResult> {
  try {
    const requestGraphql = request as (
      url: string,
      query: SubgraphDocument<TResult, TVariables>,
      variables?: TVariables,
      requestHeaders?: HeadersInit,
    ) => Promise<TResult>;

    return await requestGraphql(url, query, variables, requestHeaders);
  } catch (cause) {
    throw new SdkError({
      code: "REQUEST_FAILED",
      message: formatSubgraphErrorMessage({
        cause,
        chainId,
        product,
      }),
      cause,
      meta: getSubgraphErrorMeta({ cause, chainId, product, url }),
    });
  }
}

function getSubgraphErrorMeta({
  cause,
  chainId,
  product,
  url,
}: {
  readonly cause: unknown;
  readonly chainId: SupportedChainId;
  readonly product: SubgraphProduct;
  readonly url: string;
}): SdkErrorMeta {
  if (cause instanceof ClientError) {
    const errors = cause.response.errors
      ?.map((error) => error.message)
      .filter(Boolean);

    return {
      chainId,
      product,
      url,
      ...(errors?.length ? { errors } : {}),
      ...(cause.response.status ? { status: cause.response.status } : {}),
    };
  }

  return {
    chainId,
    product,
    url,
  };
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

    return `${prefix}${status ? ` (${status})` : ""}${messages ? `: ${messages}` : "."}`;
  }

  return cause instanceof Error ? `${prefix}: ${cause.message}` : `${prefix}.`;
}
