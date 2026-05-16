import { afterEach, describe, expect, it, vi } from "vitest";

import type { SdkError } from "@/lib/errors";

import { createDtfClient } from "@/client";

describe("subgraph client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests the configured product subgraph with typed variables", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        data: {
          dtf: {
            id: "0x0000000000000000000000000000000000000001",
          },
        },
      }),
    );
    vi.stubGlobal("fetch", fetch);

    const client = createDtfClient({
      chains: {
        1: {
          indexSubgraphUrl: "https://example.com/index",
          yieldSubgraphUrl: "https://example.com/yield",
        },
      },
    });

    type Result = {
      readonly dtf: {
        readonly id: string;
      };
    };
    type Variables = {
      readonly id: string;
    };

    const data = await client.subgraph.queryIndex<Result, Variables>({
      chainId: 1,
      query: "query GetDtf($id: String!) { dtf(id: $id) { id } }",
      variables: { id: "0x0000000000000000000000000000000000000001" },
      requestHeaders: {
        "x-request": "request",
      },
    });

    expect(data.dtf.id).toBe("0x0000000000000000000000000000000000000001");
    expect(fetch).toHaveBeenCalledOnce();

    const [url, init] = fetch.mock.calls[0] as unknown as [URL, RequestInit];
    expect(String(url)).toBe("https://example.com/index");
    expect(JSON.parse(String(init.body))).toMatchObject({
      variables: { id: "0x0000000000000000000000000000000000000001" },
    });
    expect(new Headers(init.headers).get("x-request")).toBe("request");
  });

  it("queries yield subgraphs without passing a product", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        data: {
          vaults: [{ id: "vault" }],
        },
      }),
    );
    vi.stubGlobal("fetch", fetch);

    const client = createDtfClient({
      chains: {
        1: {
          yieldSubgraphUrl: "https://example.com/yield",
        },
      },
    });

    await expect(
      client.subgraph.queryYield<{
        readonly vaults: readonly { readonly id: string }[];
      }>({
        chainId: 1,
        query: "{ vaults { id } }",
      }),
    ).resolves.toEqual({ vaults: [{ id: "vault" }] });
  });

  it("queries one index subgraph without passing a product", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        data: {
          dtfs: [{ id: "dtf" }],
        },
      }),
    );
    vi.stubGlobal("fetch", fetch);

    const client = createDtfClient({
      chains: {
        1: {
          indexSubgraphUrl: "https://example.com/index",
        },
      },
    });

    await expect(
      client.subgraph.queryIndex<{
        readonly dtfs: readonly { readonly id: string }[];
      }>({
        chainId: 1,
        query: "{ dtfs { id } }",
      }),
    ).resolves.toEqual({ dtfs: [{ id: "dtf" }] });
  });

  it("queries index subgraphs across chains in parallel", async () => {
    const fetch = vi.fn(async (input: RequestInfo | URL) =>
      Response.json({
        data: {
          endpoint: String(input),
        },
      }),
    );
    vi.stubGlobal("fetch", fetch);

    const client = createDtfClient({
      chains: {
        1: {
          indexSubgraphUrl: "https://example.com/mainnet",
        },
        8453: {
          indexSubgraphUrl: "https://example.com/base",
        },
      },
    });

    const result = await client.subgraph.queryIndexAll<
      { readonly endpoint: string },
      { readonly limit: number; readonly chainId: number }
    >({
      chainIds: [1, 8453],
      query: "query Dtfs($limit: Int!, $chainId: Int!) { dtfs(first: $limit) { id } }",
      variables: (chainId) => ({ limit: 10, chainId }),
    });

    expect(result).toEqual({
      1: { endpoint: "https://example.com/mainnet" },
      8453: { endpoint: "https://example.com/base" },
    });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("adds SDK context to GraphQL errors", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        errors: [{ message: "bad query" }],
      }),
    );
    vi.stubGlobal("fetch", fetch);

    const client = createDtfClient({
      chains: {
        1: {
          indexSubgraphUrl: "https://example.com/index",
        },
      },
    });

    await expect(
      client.subgraph.queryIndex({
        chainId: 1,
        query: "{ broken }",
      }),
    ).rejects.toMatchObject({
      code: "REQUEST_FAILED",
      message: "DTF SDK index subgraph request failed on chain 1 (200): bad query",
      meta: {
        chainId: 1,
        errors: ["bad query"],
        product: "index",
        status: 200,
        url: "https://example.com/index",
      },
    } satisfies Partial<SdkError>);
  });
});
