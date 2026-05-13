import { afterEach, describe, expect, it, vi } from "vitest";

import { createDtfClient } from "@/client";
import { discoverIndexDtfs, discoverIndexDtfsByChain, getIndexDtfStatus } from "@/index-dtf/dtf/discovery";

const DTF = "0x0000000000000000000000000000000000000001";
const TOKEN = "0x0000000000000000000000000000000000000002";

describe("Index DTF discovery", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("discovers Index DTFs from the Register discovery endpoint", async () => {
    const fetch = vi.fn(async () =>
      Response.json([
        { type: "index", address: DTF, chainId: 8453, status: "deprecated", symbol: "DTF" },
        { type: "yield", address: TOKEN, chainId: 1, status: "active" },
      ]),
    );
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    const dtfs = await discoverIndexDtfs(client, { brand: true, performance: true });

    expect(dtfs).toHaveLength(1);
    expect(dtfs[0]?.address).toBe(DTF);
    expect(String((fetch.mock.calls[0] as unknown as [URL])[0])).toBe(
      "https://api.example/discover/dtfs?brand=true&performance=true",
    );
  });

  it("returns API status for a known Index DTF", async () => {
    const fetch = vi.fn(async () => Response.json([{ type: "index", address: DTF, chainId: 8453, status: "deprecated" }]));
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    await expect(getIndexDtfStatus(client, { address: DTF, chainId: 8453 })).resolves.toBe("deprecated");
    expect(String((fetch.mock.calls[0] as unknown as [URL])[0])).toBe(
      "https://api.example/discover/dtfs?chainId=8453&limit=1000&offset=0",
    );
  });

  it("paginates status lookups before defaulting to active", async () => {
    const firstPage = Array.from({ length: 1000 }, (_, index) => ({
      type: "index",
      address: `0x${(index + 10).toString(16).padStart(40, "0")}`,
      chainId: 8453,
      status: "active",
    }));
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json(firstPage))
      .mockResolvedValueOnce(Response.json([{ type: "index", address: DTF, chainId: 8453, status: "deprecated" }]));
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    await expect(getIndexDtfStatus(client, { address: DTF, chainId: 8453 })).resolves.toBe("deprecated");
    expect(String((fetch.mock.calls[1] as unknown as [URL])[0])).toBe(
      "https://api.example/discover/dtfs?chainId=8453&limit=1000&offset=1000",
    );
  });

  it("filters chain-scoped discovery to Index DTFs", async () => {
    const fetch = vi.fn(async () =>
      Response.json([
        { type: "index", address: DTF, chainId: 8453, status: "active" },
        { type: "yield", address: TOKEN, chainId: 8453, status: "active" },
      ]),
    );
    vi.stubGlobal("fetch", fetch);
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    const dtfs = await discoverIndexDtfsByChain(client, { chainId: 8453 });

    expect(dtfs.map((dtf) => dtf.address)).toEqual([DTF]);
  });

  it("treats missing discovery status as active like Register", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json([])));
    const client = createDtfClient({ apiBaseUrl: "https://api.example" });

    await expect(getIndexDtfStatus(client, { address: DTF, chainId: 8453 })).resolves.toBe("active");
  });
});
