import type { DtfSdk } from "@reserve-protocol/sdk";

import { describe, expect, it, vi } from "vitest";

import { DEFAULT_STALE_TIME, LIVE_STALE_TIME, STATIC_STALE_TIME } from "@/query";
import { dtfQueryKeys } from "@/query-keys";
import {
  yieldDtfIssuanceQuoteQueryOptions,
  yieldDtfListQueryOptions,
  yieldDtfPriceQueryOptions,
  yieldDtfQueryOptions,
  yieldDtfStakingStateQueryOptions,
  yieldDtfStateQueryOptions,
} from "@/yield-dtf-hooks";

const DTF = "0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F";
const ACCOUNT = "0x0000000000000000000000000000000000000002";
const params = { address: DTF, chainId: 1 } as const;

function createSdk() {
  return {
    yield: {
      get: vi.fn(async () => ({ id: DTF })),
      list: vi.fn(async () => ({ dtfs: [] })),
      getState: vi.fn(async () => ({ frozen: false })),
      getPrice: vi.fn(async () => ({ price: 1 })),
      getIssuanceQuote: vi.fn(async () => ({ deposits: [] })),
      getStakingState: vi.fn(async () => ({ account: ACCOUNT })),
    },
  } as unknown as DtfSdk;
}

describe("yield query options", () => {
  it("disables queries without params and keys them under dtf/yield", async () => {
    const sdk = createSdk();

    expect(yieldDtfQueryOptions(sdk, undefined).enabled).toBe(false);

    const options = yieldDtfQueryOptions(sdk, params);
    expect(options.enabled).toBe(true);
    expect(options.queryKey).toEqual(dtfQueryKeys.yield.full(params));
    expect(options.queryKey.slice(0, 2)).toEqual(["dtf", "yield"]);
    await expect(options.queryFn()).resolves.toEqual({ id: DTF });
  });

  it("normalizes addresses in yield keys case-insensitively", () => {
    const lower = dtfQueryKeys.yield.full({ address: DTF.toLowerCase() as typeof DTF, chainId: 1 });
    const checksummed = dtfQueryKeys.yield.full(params);

    expect(lower).toEqual(checksummed);
  });

  it("normalizes bigint params in quote keys", () => {
    const key = dtfQueryKeys.yield.issuanceQuote({ ...params, amount: 42n });

    expect(JSON.stringify(key)).toContain("42");
  });

  it("applies staleTime classes per data kind", () => {
    const sdk = createSdk();

    // full view carries supply/staking data, so it gets the default class.
    expect(yieldDtfQueryOptions(sdk, params).staleTime).toBe(DEFAULT_STALE_TIME);
    expect(yieldDtfListQueryOptions(sdk, { chainId: 1 }).staleTime).toBe(STATIC_STALE_TIME);
    expect(yieldDtfPriceQueryOptions(sdk, params).staleTime).toBe(LIVE_STALE_TIME);
    expect(yieldDtfIssuanceQuoteQueryOptions(sdk, { ...params, amount: 1n }).staleTime).toBe(LIVE_STALE_TIME);
    expect(yieldDtfStateQueryOptions(sdk, params).staleTime).toBe(DEFAULT_STALE_TIME);
    expect(yieldDtfStakingStateQueryOptions(sdk, { ...params, stToken: ACCOUNT, account: ACCOUNT }).staleTime).toBe(
      DEFAULT_STALE_TIME,
    );
  });

  it("lets callers override staleTime", () => {
    const sdk = createSdk();

    expect(yieldDtfPriceQueryOptions(sdk, params, { staleTime: 0 }).staleTime).toBe(0);
  });
});
