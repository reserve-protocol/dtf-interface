import { SdkError } from "@/lib/errors";

export const SUBGRAPH_PAGE_SIZE = 1000;
/** Our own ceiling for "read everything" walks; hitting it throws instead of returning a partial sum. */
export const SUBGRAPH_MAX_ROWS = 10_000;

/**
 * Walks `first`/`skip` pages of a time-ordered window until a short page or
 * `limit` rows. Rejects limits past the ceiling: graph-node answers deep `skip`
 * offsets with empty data, so a bigger window would truncate silently.
 */
export async function fetchSubgraphPages<T>(
  fetchPage: (offset: number, pageSize: number) => Promise<readonly T[]>,
  limit: number,
): Promise<readonly T[]> {
  assertSubgraphWindow(limit);
  const rows: T[] = [];

  while (rows.length < limit) {
    const pageSize = Math.min(SUBGRAPH_PAGE_SIZE, limit - rows.length);
    const page = await fetchPage(rows.length, pageSize);
    rows.push(...page);

    if (page.length < pageSize) {
      break;
    }
  }

  return rows;
}

/** Validates a `first`/`skip` window before any request goes out. */
export function assertSubgraphWindow(limit: number): void {
  if (!Number.isInteger(limit) || limit < 1 || limit > SUBGRAPH_MAX_ROWS) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `Subgraph window limit must be an integer between 1 and ${SUBGRAPH_MAX_ROWS}, received ${limit}.`,
      meta: { limit, max: SUBGRAPH_MAX_ROWS },
    });
  }
}

/**
 * Walks every row of an entity by `id` cursor (`orderBy: id, where: { id_gt }`),
 * which stays consistent when rows land mid-walk and does not hit graph-node's
 * silent `skip` cutoff. Throws once the walk passes `SUBGRAPH_MAX_ROWS`.
 */
export async function walkSubgraphById<T extends { readonly id: string }>(
  fetchPage: (cursor: string, pageSize: number) => Promise<readonly T[]>,
  entity: string,
): Promise<readonly T[]> {
  const rows: T[] = [];
  let cursor = "";

  while (true) {
    const page = await fetchPage(cursor, SUBGRAPH_PAGE_SIZE);
    rows.push(...page);

    if (page.length < SUBGRAPH_PAGE_SIZE) {
      return rows;
    }

    // WHY: a full page at the ceiling may still be the last one; only more rows beyond it are a partial walk.
    if (rows.length >= SUBGRAPH_MAX_ROWS) {
      const beyond = await fetchPage(page[page.length - 1]!.id, 1);
      if (beyond.length === 0) {
        return rows;
      }

      throw new SdkError({
        code: "LIMIT_EXCEEDED",
        message: `Subgraph walk over ${entity} passed ${SUBGRAPH_MAX_ROWS} rows; add an aggregate to the subgraph instead of paging.`,
        meta: { entity, rows: rows.length },
      });
    }

    cursor = page[page.length - 1]!.id;
  }
}
