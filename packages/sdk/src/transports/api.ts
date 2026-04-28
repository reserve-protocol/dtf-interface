import {
  resolveDtfClient,
  type DtfClientOptions,
} from "../client.js";

type ApiGetOptions = DtfClientOptions & {
  readonly path: string;
  readonly query?: Record<string, boolean | number | string | null | undefined>;
};

export async function apiGet<TResult>({
  client,
  path,
  query,
}: ApiGetOptions): Promise<TResult> {
  const dtfClient = resolveDtfClient(client);
  const url = new URL(`${dtfClient.apiBaseUrl}/${path.replace(/^\/+/, "")}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Reserve API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<TResult>;
}
