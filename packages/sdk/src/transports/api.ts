import {
  resolveDtfClient,
  type DtfClientOptions,
} from "../clients/create-dtf-client.js";

export type ApiRequestOptions<TBody = unknown> = DtfClientOptions & {
  readonly body?: TBody;
  readonly headers?: HeadersInit;
  readonly method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  readonly path: string;
  readonly query?: Record<string, boolean | number | string | null | undefined>;
};

export async function apiGet<TResult>(
  options: Omit<ApiRequestOptions, "method" | "body">,
): Promise<TResult> {
  return apiRequest<TResult>({ ...options, method: "GET" });
}

async function apiRequest<TResult>({
  body,
  client,
  headers,
  method = "GET",
  path,
  query,
}: ApiRequestOptions): Promise<TResult> {
  const dtfClient = resolveDtfClient(client);
  const url = new URL(`${dtfClient.apiBaseUrl}/${path.replace(/^\/+/, "")}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const requestInit: RequestInit = {
    ...dtfClient.fetchOptions,
    method,
    headers: {
      ...(body === undefined
        ? undefined
        : { "content-type": "application/json" }),
      ...dtfClient.fetchOptions?.headers,
      ...headers,
    },
  };

  if (body !== undefined) {
    requestInit.body = JSON.stringify(body);
  }

  const response = await dtfClient.fetch(url, requestInit);

  if (!response.ok) {
    throw new Error(
      `Reserve API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<TResult>;
}
