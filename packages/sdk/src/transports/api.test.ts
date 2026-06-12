import { afterEach, describe, expect, it, vi } from "vitest";

import { createDtfClient } from "@/client";
import { isSdkError } from "@/lib/errors";
import { get } from "@/transports/api";

describe("api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts JSON through the API transport", async () => {
    const fetch = vi.fn(async () => Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetch);

    const client = createDtfClient({
      apiBaseUrl: "https://api.example",
    });
    const result = await client.api.post<{ readonly ok: boolean }, { readonly name: string }>({
      path: "/folio-manager/write",
      query: {
        chainId: 8453,
      },
      body: {
        name: "CMC20",
      },
    });

    expect(result).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledOnce();

    const [url, init] = fetch.mock.calls[0] as unknown as [URL, RequestInit];
    expect(String(url)).toBe("https://api.example/folio-manager/write?chainId=8453");
    expect(init.method).toBe("POST");
    expect(new Headers(init.headers).get("content-type")).toBe("application/json");
    expect(JSON.parse(String(init.body))).toEqual({ name: "CMC20" });
  });

  it("throws SdkError with status metadata on non-ok responses", async () => {
    const fetch = vi.fn(async () => new Response("nope", { status: 503, statusText: "Service Unavailable" }));
    vi.stubGlobal("fetch", fetch);

    try {
      await get({ baseUrl: "https://api.example", path: "/discover/dtfs" });
      expect.unreachable("expected get to throw");
    } catch (error) {
      expect(isSdkError(error)).toBe(true);
      expect(error).toMatchObject({
        code: "REQUEST_FAILED",
        meta: {
          status: 503,
          statusText: "Service Unavailable",
          transport: "api",
          url: "https://api.example/discover/dtfs",
        },
      });
    }
  });

  it("skips null and undefined query params and strips leading path slashes", async () => {
    const fetch = vi.fn(async () => Response.json({}));
    vi.stubGlobal("fetch", fetch);

    await get({
      baseUrl: "https://api.example",
      path: "//discover/dtfs",
      query: { chainId: 1, cursor: null, limit: undefined, active: false },
    });

    const [url] = fetch.mock.calls[0] as unknown as [URL];
    expect(String(url)).toBe("https://api.example/discover/dtfs?chainId=1&active=false");
  });

  it("propagates network failures from fetch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed");
      }),
    );

    await expect(get({ baseUrl: "https://api.example", path: "/x" })).rejects.toThrow("fetch failed");
  });
});
