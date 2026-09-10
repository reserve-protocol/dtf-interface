import type { DtfSdk } from "@reserve-protocol/sdk";

import { describe, expect, it, vi } from "vitest";

import {
  indexDtfGovernanceActivityQueryOptions,
  indexDtfProposalFeedQueryOptions,
  indexDtfVoteLockDaosQueryOptions,
  indexDtfVoteLockLifetimeTotalsQueryOptions,
  yieldDtfProtocolStakingTotalsQueryOptions,
  yieldDtfTopVotersQueryOptions,
} from "@/governance-overview-hooks";
import { DEFAULT_STALE_TIME, STATIC_STALE_TIME } from "@/query";
import { dtfQueryKeys } from "@/query-keys";

function createSdk() {
  return {
    index: {
      getProposalFeed: vi.fn(async () => [{ id: "p1" }]),
      getGovernanceActivity: vi.fn(async () => [{ type: "vote" }]),
      getVoteLockDaos: vi.fn(async () => [{ apr: 1 }]),
      getVoteLockLifetimeTotals: vi.fn(async () => [{ positionCount: 2 }]),
    },
    yield: {
      getTopVoters: vi.fn(async () => [{ numberVotes: 3 }]),
      getProtocolStakingTotals: vi.fn(async () => [{ chainId: 1 }]),
    },
  } as unknown as DtfSdk;
}

describe("governance overview query options", () => {
  it("stays enabled without params and forwards the chain scope to the SDK", async () => {
    const sdk = createSdk();

    const feed = indexDtfProposalFeedQueryOptions(sdk);
    expect(feed.enabled).toBe(true);
    expect(feed.queryKey).toEqual(dtfQueryKeys.index.governance.proposalFeed());
    await expect(feed.queryFn()).resolves.toEqual([{ id: "p1" }]);
    expect(sdk.index.getProposalFeed).toHaveBeenCalledWith(undefined);

    const scoped = indexDtfGovernanceActivityQueryOptions(sdk, { chainIds: [8453], limit: 5 });
    expect(scoped.queryKey).toEqual(dtfQueryKeys.index.governance.activity({ chainIds: [8453], limit: 5 }));
    expect(scoped.queryKey).not.toEqual(dtfQueryKeys.index.governance.activity());
    await scoped.queryFn();
    expect(sdk.index.getGovernanceActivity).toHaveBeenCalledWith({ chainIds: [8453], limit: 5 });
  });

  it("caches lifetime totals and proposal feeds at the static tier and the rest at the default tier", () => {
    const sdk = createSdk();

    expect(indexDtfVoteLockLifetimeTotalsQueryOptions(sdk).staleTime).toBe(STATIC_STALE_TIME);
    expect(indexDtfProposalFeedQueryOptions(sdk).staleTime).toBe(STATIC_STALE_TIME);
    expect(indexDtfVoteLockDaosQueryOptions(sdk).staleTime).toBe(DEFAULT_STALE_TIME);
    expect(yieldDtfProtocolStakingTotalsQueryOptions(sdk).staleTime).toBe(DEFAULT_STALE_TIME);
  });

  it("keys yield reads under dtf/yield with normalized params", async () => {
    const sdk = createSdk();

    const options = yieldDtfTopVotersQueryOptions(sdk, { limit: 10 });
    expect(options.queryKey).toEqual(["dtf", "yield", "top-voters", { limit: 10 }]);
    await expect(options.queryFn()).resolves.toEqual([{ numberVotes: 3 }]);
    expect(sdk.yield.getTopVoters).toHaveBeenCalledWith({ limit: 10 });
  });
});
