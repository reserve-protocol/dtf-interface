import { describe, expect, it } from "vitest";

import { createDtfClient } from "@/client";
import { getIndexDtfCatalogEntries, listIndexDtfs, resolveIndexDtfAlias } from "@/index-dtf/protocol/index";

describe("Index DTF catalog list", () => {
  const client = createDtfClient();

  it("returns a flat list of catalog Index DTFs", async () => {
    const dtfs = await listIndexDtfs(client);

    expect(dtfs.length).toBeGreaterThan(0);
    expect(dtfs.every((dtf) => typeof dtf.address === "string")).toBe(true);
    expect(dtfs.every((dtf) => typeof dtf.chainId === "number")).toBe(true);
    expect(dtfs.every((dtf) => typeof dtf.status === "string")).toBe(true);
  });

  it("filters by chain id and status", async () => {
    const dtfs = await listIndexDtfs(client, {
      chainId: 8453,
      status: "active",
    });

    expect(dtfs.length).toBeGreaterThan(0);
    expect(dtfs.every((dtf) => dtf.chainId === 8453)).toBe(true);
    expect(dtfs.every((dtf) => dtf.status === "active")).toBe(true);
  });

  it("resolves Index DTF aliases from the catalog only", () => {
    const [dtf] = getIndexDtfCatalogEntries({ chainId: 8453, status: "active" });

    expect(dtf).toBeDefined();
    expect(resolveIndexDtfAlias({ input: dtf!.symbol, chainId: dtf!.chainId })).toMatchObject({
      address: dtf!.address,
      chainId: dtf!.chainId,
      symbol: dtf!.symbol,
    });
    expect(resolveIndexDtfAlias({ input: dtf!.address })).toMatchObject({ address: dtf!.address });
    expect(resolveIndexDtfAlias({ input: "   " })).toBeNull();
    expect(resolveIndexDtfAlias({ input: "not a real dtf" })).toBeNull();
  });
});
