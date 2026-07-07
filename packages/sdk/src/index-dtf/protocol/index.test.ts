import { indexDtfs as indexDtfCatalog } from "@reserve-protocol/dtf-catalog";
import { isAddress } from "viem";
import { describe, expect, it } from "vitest";

import { createDtfClient } from "@/client";
import { getIndexDtfCatalogEntries, listIndexDtfs, resolveIndexDtfAlias } from "@/index-dtf/protocol/index";

const INDEX_DTF_STATUSES = new Set(["active", "unsupported", "deprecated"]);

type IndexDtfCatalogTestEntry = ReturnType<typeof getIndexDtfCatalogEntries>[number];

const DUPLICATE_SYMBOL_ENTRIES = [
  {
    chainId: 1,
    address: "0x0000000000000000000000000000000000000001",
    name: "Duplicate Symbol Fixture Ethereum",
    symbol: "DUPLICATE",
    logo: "default.webp",
    decimals: 18,
    createdAt: 1,
    status: "active",
    restricted: false,
  },
  {
    chainId: 56,
    address: "0x0000000000000000000000000000000000000002",
    name: "Duplicate Symbol Fixture BSC",
    symbol: "DUPLICATE",
    logo: "default.webp",
    decimals: 18,
    createdAt: 1,
    status: "active",
    restricted: false,
  },
] satisfies readonly [IndexDtfCatalogTestEntry, IndexDtfCatalogTestEntry];

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
    withDuplicateSymbolEntries(() => {
      for (const dtf of DUPLICATE_SYMBOL_ENTRIES) {
        expect(resolveIndexDtfAlias({ input: dtf.symbol.toLowerCase(), chainId: dtf.chainId })).toMatchObject({
          address: dtf.address,
          chainId: dtf.chainId,
          name: dtf.name,
          symbol: dtf.symbol,
        });
      }
    });
  });

  it("returns ambiguous matches for duplicate symbols without a chain", () => {
    withDuplicateSymbolEntries(() => {
      const result = resolveIndexDtfAlias({ input: DUPLICATE_SYMBOL_ENTRIES[0].symbol });

      expect(result).toEqual({
        ambiguous: DUPLICATE_SYMBOL_ENTRIES.map((dtf) => ({
          address: dtf.address,
          chainId: dtf.chainId,
          name: dtf.name,
          symbol: dtf.symbol,
          status: dtf.status,
        })),
      });
    });
  });
});

function withDuplicateSymbolEntries(run: () => void) {
  const originalEntries = DUPLICATE_SYMBOL_ENTRIES.map((dtf) => indexDtfCatalog[dtf.chainId][dtf.address]);

  for (const dtf of DUPLICATE_SYMBOL_ENTRIES) {
    indexDtfCatalog[dtf.chainId][dtf.address] = dtf;
  }

  try {
    run();
  } finally {
    for (const [index, dtf] of DUPLICATE_SYMBOL_ENTRIES.entries()) {
      const originalEntry = originalEntries[index];
      if (originalEntry) {
        indexDtfCatalog[dtf.chainId][dtf.address] = originalEntry;
      } else {
        delete indexDtfCatalog[dtf.chainId][dtf.address];
      }
    }
  }
}
