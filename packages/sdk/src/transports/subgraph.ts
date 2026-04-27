import { resolveDtfClient, type DtfClientOptions } from "../clients/create-dtf-client.js";
import type { SupportedChainId } from "../defaults.js";

export type SubgraphRequestOptions<TVariables extends Record<string, unknown>> =
  DtfClientOptions & {
    readonly chainId: SupportedChainId;
    readonly product: "index" | "yield";
    readonly query: string;
    readonly variables?: TVariables;
  };

type GraphqlResponse<TResult> = {
  readonly data?: TResult;
  readonly errors?: readonly { readonly message: string }[];
};

export async function querySubgraph<
  TResult,
  TVariables extends Record<string, unknown> = Record<string, never>,
>({
  chainId,
  client,
  product,
  query,
  variables,
}: SubgraphRequestOptions<TVariables>): Promise<TResult> {
  const dtfClient = resolveDtfClient(client);
  const url =
    product === "index"
      ? dtfClient.getIndexSubgraphUrl(chainId)
      : dtfClient.getYieldSubgraphUrl(chainId);

  const response = await dtfClient.fetch(url, {
    ...dtfClient.fetchOptions,
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...dtfClient.fetchOptions?.headers,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Subgraph request failed: ${response.status} ${response.statusText}`);
  }

  const result = (await response.json()) as GraphqlResponse<TResult>;

  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join("; "));
  }

  if (!result.data) {
    throw new Error("Subgraph response did not include data.");
  }

  return result.data;
}
