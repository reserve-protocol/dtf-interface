import { describe, expect, it } from "vitest";

import * as reactSdk from "@/index";

describe("React SDK public surface", () => {
  it("re-exports core prepare helpers without wallet-bound mutation hooks", () => {
    expect(typeof reactSdk.prepareIndexDtfVote).toBe("function");
    expect(typeof reactSdk.prepareIndexDtfQueueProposal).toBe("function");
    expect(typeof reactSdk.createWalletClient).toBe("function");
    expect("useIndexDtfVoteMutation" in reactSdk).toBe(false);
    expect("useIndexDtfDelegateMutation" in reactSdk).toBe(false);
  });
});
