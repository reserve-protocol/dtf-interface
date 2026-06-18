import { indexDtfs as indexDtfCatalog } from "@reserve-protocol/dtf-catalog";
import { isAddress } from "viem";
import { describe, expect, it } from "vitest";

import { createDtfClient } from "@/client";
import { getIndexDtfCatalogEntries, listIndexDtfs, resolveIndexDtfAlias } from "@/index-dtf/protocol/index";

const INDEX_DTF_STATUSES = new Set(["active", "unsupported", "deprecated"]);

type IndexDtfCatalogTestEntry = ReturnType<typeof getIndexDtfCatalogEntries>[number];

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

  it("keeps catalog JSON entries structurally valid", () => {
    for (const [chainId, dtfs] of Object.entries(indexDtfCatalog)) {
      for (const [address, dtf] of Object.entries(dtfs)) {
        expect(isAddress(address)).toBe(true);
        expect(isAddress(dtf.address)).toBe(true);
        expect(dtf.address.toLowerCase()).toBe(address.toLowerCase());
        expect(dtf.chainId).toBe(Number(chainId));
        expect(Number.isInteger(dtf.decimals)).toBe(true);
        expect(dtf.decimals).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(dtf.createdAt)).toBe(true);
        expect(dtf.createdAt).toBeGreaterThan(0);
        expect(dtf.name.trim()).toBe(dtf.name);
        expect(dtf.name.length).toBeGreaterThan(0);
        expect(dtf.symbol.trim()).toBe(dtf.symbol);
        expect(dtf.symbol.length).toBeGreaterThan(0);
        expect(INDEX_DTF_STATUSES.has(dtf.status)).toBe(true);

        if (dtf.logo !== undefined) {
          expect(dtf.logo.trim()).toBe(dtf.logo);
          expect(dtf.logo.length).toBeGreaterThan(0);
        }
        if (dtf.tags !== undefined) {
          expect(dtf.tags.every((tag) => tag.trim() === tag && tag.length > 0)).toBe(true);
        }
      }
    }
  });

  it("resolves duplicate symbols when scoped to a chain", () => {
    const [first, second] = getDuplicateSymbolEntries();

    for (const dtf of [first, second]) {
      expect(resolveIndexDtfAlias({ input: dtf.symbol.toLowerCase(), chainId: dtf.chainId })).toMatchObject({
        address: dtf.address,
        chainId: dtf.chainId,
        name: dtf.name,
        symbol: dtf.symbol,
      });
    }
  });

  it("returns ambiguous matches for duplicate symbols without a chain", () => {
    const duplicateEntries = getDuplicateSymbolEntries();
    const result = resolveIndexDtfAlias({ input: duplicateEntries[0]!.symbol });

    expect(result).toEqual({
      ambiguous: duplicateEntries.map((dtf) => ({
        address: dtf.address,
        chainId: dtf.chainId,
        name: dtf.name,
        symbol: dtf.symbol,
        status: dtf.status,
      })),
    });
  });
});

function getDuplicateSymbolEntries(): readonly [
  IndexDtfCatalogTestEntry,
  IndexDtfCatalogTestEntry,
  ...IndexDtfCatalogTestEntry[],
] {
  const entriesBySymbol = new Map<string, IndexDtfCatalogTestEntry[]>();

  for (const dtf of getIndexDtfCatalogEntries()) {
    const entries = entriesBySymbol.get(dtf.symbol.toLowerCase()) ?? [];
    entries.push(dtf);
    entriesBySymbol.set(dtf.symbol.toLowerCase(), entries);
  }

  const duplicateEntries = [...entriesBySymbol.values()].find((entries) => entries.length > 1);
  if (!duplicateEntries) {
    throw new Error("Expected the catalog to include at least one duplicate symbol");
  }

  return duplicateEntries as [IndexDtfCatalogTestEntry, IndexDtfCatalogTestEntry, ...IndexDtfCatalogTestEntry[]];
}
