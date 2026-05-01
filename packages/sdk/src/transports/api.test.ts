import { afterEach, describe, expect, it, vi } from "vitest";
import { createDtfClient } from "../client.js";

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
    const result = await client.api.post<
      { readonly ok: boolean },
      { readonly name: string }
    >({
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

    const [url, init] = fetch.mock.calls[0] as unknown as [
      URL,
      RequestInit,
    ];
    expect(String(url)).toBe(
      "https://api.example/folio-manager/write?chainId=8453",
    );
    expect(init.method).toBe("POST");
    expect(new Headers(init.headers).get("content-type")).toBe(
      "application/json",
    );
    expect(JSON.parse(String(init.body))).toEqual({ name: "CMC20" });
  });
});
