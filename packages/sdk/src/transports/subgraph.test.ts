import { afterEach, describe, expect, it, vi } from "vitest";
import { createDtfClient } from "../client.js";
import {
  queryIndexSubgraph,
  queryIndexSubgraphs,
  queryYieldSubgraph,
} from "./subgraph.js";

describe("subgraph transport", () => {
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

    const data = await queryIndexSubgraph<Result, Variables>({
      client,
      chainId: 1,
      query: "query GetDtf($id: String!) { dtf(id: $id) { id } }",
      variables: { id: "0x0000000000000000000000000000000000000001" },
      requestHeaders: {
        "x-request": "request",
      },
    });

    expect(data.dtf.id).toBe("0x0000000000000000000000000000000000000001");
    expect(fetch).toHaveBeenCalledOnce();

    const [url, init] = fetch.mock.calls[0] as unknown as [
      URL,
      RequestInit,
    ];
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
      queryYieldSubgraph<{
        readonly vaults: readonly { readonly id: string }[];
      }>({
        client,
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
      queryIndexSubgraph<{ readonly dtfs: readonly { readonly id: string }[] }>(
        {
          client,
          chainId: 1,
          query: "{ dtfs { id } }",
        },
      ),
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

    const result = await queryIndexSubgraphs<
      { readonly endpoint: string },
      { readonly limit: number; readonly chainId: number }
    >({
      client,
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
      queryIndexSubgraph({
        client,
        chainId: 1,
        query: "{ broken }",
      }),
    ).rejects.toThrow(
      "DTF SDK index subgraph request failed on chain 1 (200): bad query",
    );
  });
});
