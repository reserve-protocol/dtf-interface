import { SdkError } from "@/errors";

type Query = Record<string, boolean | number | string | null | undefined>;

export type GetOptions = {
  readonly baseUrl: string;
  readonly path: string;
  readonly query?: Query;
};

export type PostOptions<TBody = unknown> = GetOptions & {
  readonly body?: TBody;
};

export async function get<TResult>({ baseUrl, path, query }: GetOptions): Promise<TResult> {
  const url = createUrl({
    baseUrl,
    path,
    ...(query === undefined ? {} : { query }),
  });
  const response = await fetch(url);

  return readResponse<TResult>(response, url);
}

export async function post<TResult, TBody = unknown>({
  baseUrl,
  body,
  path,
  query,
}: PostOptions<TBody>): Promise<TResult> {
  const url = createUrl({
    baseUrl,
    path,
    ...(query === undefined ? {} : { query }),
  });
  const response = await fetch(url, {
    method: "POST",
    ...(body === undefined
      ? {}
      : {
          body: JSON.stringify(body),
          headers: {
            "content-type": "application/json",
          },
        }),
  });

  return readResponse<TResult>(response, url);
}

function createUrl({ baseUrl, path, query }: GetOptions): URL {
  const url = new URL(`${baseUrl}/${path.replace(/^\/+/, "")}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

async function readResponse<TResult>(response: Response, url: URL): Promise<TResult> {
  if (!response.ok) {
    throw new SdkError({
      code: "REQUEST_FAILED",
      message: `Reserve API request failed: ${response.status} ${response.statusText}`,
      meta: {
        status: response.status,
        statusText: response.statusText,
        transport: "api",
        url: String(url),
      },
    });
  }

  return response.json() as Promise<TResult>;
}
