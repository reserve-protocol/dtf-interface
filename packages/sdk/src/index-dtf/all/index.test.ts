import { describe, expect, it } from "vitest";
import { createDtfClient } from "../../client.js";
import { listIndexDtfs } from "./index.js";

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
});
