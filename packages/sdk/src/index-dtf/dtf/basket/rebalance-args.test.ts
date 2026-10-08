import { describe, expect, it } from "vitest";

import type { BuildIndexDtfStartRebalanceArgsParams } from "@/index-dtf/dtf/basket/types";

import { buildStartRebalanceArgs } from "@/index-dtf/dtf/basket/rebalance-args";

// The pure builder has no client to resolve a version from, so an unsupported
// or missing version must fail before any math runs (v4 is Register-local).
describe("buildStartRebalanceArgs version contract", () => {
  it.each([undefined, "4.0.0", "5.1.0", "7.0.0"])("rejects version %s with a typed error", (version) => {
    expect(() => buildStartRebalanceArgs({ version } as unknown as BuildIndexDtfStartRebalanceArgsParams)).toThrow(
      /Unsupported Index DTF version/,
    );
  });
});
