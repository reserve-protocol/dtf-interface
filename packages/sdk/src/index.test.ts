import { describe, expect, it } from "vitest";

import * as sdk from "@/index";

// @ts-expect-error wallet client params must not be public SDK types.
import type { CreateWalletClientParams } from "@/index";

describe("SDK public surface", () => {
  it("does not export wallet-client creation helpers", () => {
    expect("createWalletClient" in sdk).toBe(false);
  });
});
