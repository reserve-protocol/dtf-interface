import { describe, expect, it, vi } from "vitest";

import { fetchSubgraphPages, SUBGRAPH_MAX_ROWS, SUBGRAPH_PAGE_SIZE, walkSubgraphById } from "@/lib/subgraph-pages";

describe("fetchSubgraphPages", () => {
  it("walks full pages and stops at the requested limit", async () => {
    const fetchPage = vi.fn(async (offset: number, pageSize: number) =>
      Array.from({ length: pageSize }, (_, index) => offset + index),
    );

    const rows = await fetchSubgraphPages(fetchPage, 2500);

    expect(rows).toHaveLength(2500);
    expect(rows[2499]).toBe(2499);
    expect(fetchPage.mock.calls).toEqual([
      [0, SUBGRAPH_PAGE_SIZE],
      [1000, SUBGRAPH_PAGE_SIZE],
      [2000, 500],
    ]);
  });

  it("rejects windows past the ceiling instead of paging into graph-node's silent skip cutoff", async () => {
    const fetchPage = vi.fn(async () => [1]);

    await expect(fetchSubgraphPages(fetchPage, SUBGRAPH_MAX_ROWS + 1)).rejects.toMatchObject({ code: "INVALID_INPUT" });
    await expect(fetchSubgraphPages(fetchPage, 0)).rejects.toMatchObject({ code: "INVALID_INPUT" });
    expect(fetchPage).not.toHaveBeenCalled();
  });

  it("stops on the first short page", async () => {
    const fetchPage = vi.fn(async (offset: number) => (offset === 0 ? [1, 2, 3] : []));

    const rows = await fetchSubgraphPages(fetchPage, 5000);

    expect(rows).toEqual([1, 2, 3]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });
});

describe("walkSubgraphById", () => {
  it("advances the id cursor from the last row of each full page", async () => {
    const fetchPage = vi.fn(async (cursor: string, pageSize: number) => {
      const start = cursor === "" ? 0 : Number(cursor) + 1;
      const size = start === 0 ? pageSize : 3;

      return Array.from({ length: size }, (_, index) => ({ id: String(start + index) }));
    });

    const rows = await walkSubgraphById(fetchPage, "things");

    expect(rows).toHaveLength(SUBGRAPH_PAGE_SIZE + 3);
    expect(fetchPage.mock.calls).toEqual([
      ["", SUBGRAPH_PAGE_SIZE],
      [String(SUBGRAPH_PAGE_SIZE - 1), SUBGRAPH_PAGE_SIZE],
    ]);
  });

  it("returns a walk that ends exactly at the ceiling and throws only when rows exist beyond it", async () => {
    const walker = (total: number) =>
      vi.fn(async (cursor: string, pageSize: number) => {
        const start = cursor === "" ? 0 : Number(cursor) + 1;

        return Array.from({ length: Math.max(0, Math.min(pageSize, total - start)) }, (_, index) => ({
          id: String(start + index),
        }));
      });

    const exact = walker(SUBGRAPH_MAX_ROWS);
    await expect(walkSubgraphById(exact, "stakingPositions")).resolves.toHaveLength(SUBGRAPH_MAX_ROWS);
    expect(exact.mock.calls.at(-1)).toEqual([String(SUBGRAPH_MAX_ROWS - 1), 1]);

    await expect(walkSubgraphById(walker(SUBGRAPH_MAX_ROWS + 1), "stakingPositions")).rejects.toMatchObject({
      code: "LIMIT_EXCEEDED",
      meta: { entity: "stakingPositions", rows: SUBGRAPH_MAX_ROWS },
    });
  });
});
