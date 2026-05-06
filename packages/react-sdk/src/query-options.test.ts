import { describe, expect, it, vi } from "vitest";
import type { DtfSdk } from "@dtf-interface/sdk";
import { dtfQueryKeys } from "./query-keys.js";
import {
  indexDtfProposalQueryOptions,
  indexDtfQueryOptions,
} from "./query-options.js";

describe("react SDK query options", () => {
  it("builds disabled options until required params exist", () => {
    const sdk = { index: { get: vi.fn() } } as unknown as DtfSdk;
    const options = indexDtfQueryOptions(sdk, undefined);

    expect(options.enabled).toBe(false);
    expect(options.queryKey).toEqual(dtfQueryKeys.index.dtf(undefined));
  });

  it("calls the core SDK from query functions", async () => {
    const proposal = { id: "1" };
    const sdk = {
      index: {
        proposal: vi.fn(async () => proposal),
      },
    } as unknown as DtfSdk;
    const params = {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 1,
      proposalId: "1",
    } as const;
    const options = indexDtfProposalQueryOptions(sdk, params);

    await expect(options.queryFn()).resolves.toBe(proposal);
    expect(sdk.index.proposal).toHaveBeenCalledWith(params);
  });
});
