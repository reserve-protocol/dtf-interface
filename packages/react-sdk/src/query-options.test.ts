import type { DtfSdk } from "@reserve-protocol/sdk";

import { describe, expect, it, vi } from "vitest";

import {
  accountPortfolioHistoryQueryOptions,
  accountPortfolioQueryOptions,
  accountPortfolioTransactionsQueryOptions,
  indexDtfApprovedRevenueTokensQueryOptions,
  indexDtfCompletedRebalanceQueryOptions,
  indexDtfCompletedRebalancesQueryOptions,
  indexDtfPendingFeeSharesQueryOptions,
  indexDtfPlatformFeeQueryOptions,
  indexDtfRebalanceAuctionsQueryOptions,
  indexDtfRevenueQueryOptions,
} from "@/index-dtf-query-options";
import { DEFAULT_STALE_TIME, LIVE_STALE_TIME, STATIC_STALE_TIME } from "@/query";
import { dtfQueryKeys } from "@/query-keys";
import {
  indexDtfOptimisticGovernanceQueryOptions,
  indexDtfOptimisticProposalContextQueryOptions,
  indexDtfOptimisticProposalVoterStateQueryOptions,
  indexDtfOptimisticTimelockRolesQueryOptions,
  indexDtfOptimisticVotesQueryOptions,
  indexDtfPastOptimisticVotesQueryOptions,
  indexDtfProposalListQueryOptions,
  indexDtfProposalQueryOptions,
  indexDtfProposalThrottleChargesQueryOptions,
  indexDtfQueryOptions,
  indexDtfProposalsQueryOptions,
  indexDtfSelectorRegistryAllowedSelectorsQueryOptions,
  indexDtfSelectorRegistryIsAllowedQueryOptions,
  indexDtfPriceQueryOptions,
  indexDtfSelectorRegistryTargetsQueryOptions,
  indexDtfVersionQueryOptions,
} from "@/query-options";

const GOVERNANCE = "0x0000000000000000000000000000000000000001";
const ACCOUNT = "0x0000000000000000000000000000000000000002";
const VOTE_TOKEN = "0x0000000000000000000000000000000000000003";
const TIMELOCK = "0x0000000000000000000000000000000000000004";
const REGISTRY = "0x0000000000000000000000000000000000000005";
const TARGET = "0x0000000000000000000000000000000000000006";
const DTF = "0x0000000000000000000000000000000000000007";

type QueryOptionCase = {
  readonly name: string;
  readonly method: keyof DtfSdk["index"];
  readonly build: (sdk: DtfSdk, params: any) => any;
  readonly key: (params: any) => unknown;
  readonly params: any;
  readonly result: unknown;
};

const proposalParams = {
  chainId: 1,
  governance: GOVERNANCE,
  proposalId: 42n,
} as const;

const newReadQueryOptions: readonly QueryOptionCase[] = [
  {
    name: "optimistic governance",
    method: "getOptimisticGovernance",
    build: indexDtfOptimisticGovernanceQueryOptions,
    key: dtfQueryKeys.index.governance.optimisticGovernance,
    params: { chainId: 1, governance: GOVERNANCE },
    result: { governance: GOVERNANCE },
  },
  {
    name: "optimistic proposal context",
    method: "getOptimisticProposalContext",
    build: indexDtfOptimisticProposalContextQueryOptions,
    key: dtfQueryKeys.index.governance.optimisticProposalContext,
    params: proposalParams,
    result: null,
  },
  {
    name: "optimistic proposal voter state",
    method: "getOptimisticProposalVoterState",
    build: indexDtfOptimisticProposalVoterStateQueryOptions,
    key: dtfQueryKeys.index.governance.optimisticProposalVoterState,
    params: {
      account: ACCOUNT,
      chainId: 1,
      governance: GOVERNANCE,
      proposal: {
        id: "42",
        voteStart: 100,
        voteToken: VOTE_TOKEN,
        votes: [],
      },
    },
    result: { optimisticVotingPower: { raw: 2n, formatted: "2" } },
  },
  {
    name: "optimistic timelock roles",
    method: "getOptimisticTimelockRoles",
    build: indexDtfOptimisticTimelockRolesQueryOptions,
    key: dtfQueryKeys.index.governance.optimisticTimelockRoles,
    params: { chainId: 1, timelock: TIMELOCK },
    result: { optimisticProposers: [], guardians: [] },
  },
  {
    name: "optimistic votes",
    method: "getOptimisticVotes",
    build: indexDtfOptimisticVotesQueryOptions,
    key: dtfQueryKeys.index.governance.optimisticVotes,
    params: { account: ACCOUNT, chainId: 1, voteToken: VOTE_TOKEN },
    result: { raw: 1n, formatted: "1" },
  },
  {
    name: "past optimistic votes",
    method: "getPastOptimisticVotes",
    build: indexDtfPastOptimisticVotesQueryOptions,
    key: dtfQueryKeys.index.governance.pastOptimisticVotes,
    params: { account: ACCOUNT, chainId: 1, timepoint: 123n, voteToken: VOTE_TOKEN },
    result: { raw: 2n, formatted: "2" },
  },
  {
    name: "proposal list",
    method: "getProposalList",
    build: indexDtfProposalListQueryOptions,
    key: dtfQueryKeys.index.governance.proposalList,
    params: { chainId: 1, governanceAddresses: GOVERNANCE },
    result: { proposals: [], proposalCount: 0 },
  },
  {
    name: "proposal throttle charges",
    method: "getProposalThrottleCharges",
    build: indexDtfProposalThrottleChargesQueryOptions,
    key: dtfQueryKeys.index.governance.proposalThrottleCharges,
    params: { account: ACCOUNT, chainId: 1, governance: GOVERNANCE },
    result: 3n,
  },
  {
    name: "selector registry targets",
    method: "getSelectorRegistryTargets",
    build: indexDtfSelectorRegistryTargetsQueryOptions,
    key: dtfQueryKeys.index.governance.selectorRegistryTargets,
    params: { chainId: 1, registry: REGISTRY },
    result: [TARGET],
  },
  {
    name: "selector registry allowed selectors",
    method: "getSelectorRegistryAllowedSelectors",
    build: indexDtfSelectorRegistryAllowedSelectorsQueryOptions,
    key: dtfQueryKeys.index.governance.selectorRegistryAllowedSelectors,
    params: { chainId: 1, registry: REGISTRY, target: TARGET },
    result: ["0xabcdef12"],
  },
  {
    name: "selector registry is allowed",
    method: "getSelectorRegistryIsAllowed",
    build: indexDtfSelectorRegistryIsAllowedQueryOptions,
    key: dtfQueryKeys.index.governance.selectorRegistryIsAllowed,
    params: { chainId: 1, registry: REGISTRY, selector: "0xabcdef12", target: TARGET },
    result: true,
  },
];

const extraIndexQueryOptions: readonly QueryOptionCase[] = [
  {
    name: "revenue",
    method: "getRevenue",
    build: indexDtfRevenueQueryOptions,
    key: dtfQueryKeys.index.revenue,
    params: { address: DTF, chainId: 1 },
    result: { total: 100n },
  },
  {
    name: "platform fee",
    method: "getPlatformFee",
    build: indexDtfPlatformFeeQueryOptions,
    key: dtfQueryKeys.index.platformFee,
    params: { address: DTF, chainId: 1 },
    result: 50,
  },
  {
    name: "pending fee shares",
    method: "getPendingFeeShares",
    build: indexDtfPendingFeeSharesQueryOptions,
    key: dtfQueryKeys.index.pendingFeeShares,
    params: { address: DTF, chainId: 1 },
    result: 100n,
  },
  {
    name: "approved revenue tokens",
    method: "getApprovedRevenueTokens",
    build: indexDtfApprovedRevenueTokensQueryOptions,
    key: dtfQueryKeys.index.approvedRevenueTokens,
    params: { address: DTF, chainId: 1 },
    result: [TARGET],
  },
  {
    name: "rebalance auctions",
    method: "getRebalanceAuctions",
    build: indexDtfRebalanceAuctionsQueryOptions,
    key: dtfQueryKeys.index.rebalanceAuctions,
    params: { chainId: 1, rebalanceId: "rebalance-1" },
    result: [],
  },
  {
    name: "completed rebalance",
    method: "getCompletedRebalance",
    build: indexDtfCompletedRebalanceQueryOptions,
    key: dtfQueryKeys.index.completedRebalance,
    params: { address: DTF, chainId: 1, nonce: 1n },
    result: { id: "rebalance-1" },
  },
  {
    name: "completed rebalances",
    method: "getCompletedRebalances",
    build: indexDtfCompletedRebalancesQueryOptions,
    key: dtfQueryKeys.index.completedRebalances,
    params: { address: DTF, chainId: 1 },
    result: [],
  },
];

describe("react SDK query options", () => {
  it("builds disabled options until required params exist", () => {
    const sdk = { index: { get: vi.fn() } } as unknown as DtfSdk;
    const options = indexDtfQueryOptions(sdk, undefined);

    expect(options.enabled).toBe(false);
    expect(options.queryKey).toEqual(dtfQueryKeys.index.full(undefined));
  });

  it("calls the core SDK from query functions", async () => {
    const proposal = { id: "1" };
    const sdk = {
      index: {
        getProposal: vi.fn(async () => proposal),
      },
    } as unknown as DtfSdk;
    const params = {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 1,
      proposalId: "1",
    } as const;
    const options = indexDtfProposalQueryOptions(sdk, params);

    await expect(options.queryFn()).resolves.toBe(proposal);
    expect(sdk.index.getProposal).toHaveBeenCalledWith(params);
  });

  it("reuses proposal list query data for proposal arrays", async () => {
    const proposals: readonly never[] = [];
    const proposalList = { proposals, proposalCount: 1 };
    const sdk = {
      index: {
        getProposalList: vi.fn(async () => proposalList),
      },
    } as unknown as DtfSdk;
    const params = { chainId: 1, governanceAddresses: GOVERNANCE } as const;
    const options = indexDtfProposalsQueryOptions(sdk, params);

    expect(options.queryKey).toEqual(dtfQueryKeys.index.governance.proposalList(params));
    await expect(options.queryFn()).resolves.toBe(proposalList);
    expect(options.select?.(proposalList)).toBe(proposals);
    expect(sdk.index.getProposalList).toHaveBeenCalledWith(params);
  });

  it("keeps proposal array select semantics while sharing proposal list cache", () => {
    const sdk = {
      index: {
        getProposalList: vi.fn(),
      },
    } as unknown as DtfSdk;
    const params = { chainId: 1, governanceAddresses: GOVERNANCE } as const;
    const options = indexDtfProposalsQueryOptions(sdk, params, {
      select: (proposals) => proposals.length,
    });

    expect(options.queryKey).toEqual(dtfQueryKeys.index.governance.proposalList(params));
    expect(options.select?.({ proposals: [], proposalCount: 10 })).toBe(0);
  });

  for (const queryOption of newReadQueryOptions) {
    it(`builds ${queryOption.name} query options`, async () => {
      const method = vi.fn(async () => queryOption.result);
      const sdk = { index: { [queryOption.method]: method } } as unknown as DtfSdk;
      const disabledOptions = queryOption.build(sdk, undefined);
      const options = queryOption.build(sdk, queryOption.params);

      expect(disabledOptions.enabled).toBe(false);
      expect(disabledOptions.queryKey).toEqual(queryOption.key(undefined));
      expect(options.queryKey).toEqual(queryOption.key(queryOption.params));
      await expect(options.queryFn()).resolves.toBe(queryOption.result);
      expect(method).toHaveBeenCalledWith(queryOption.params);
    });
  }

  for (const queryOption of extraIndexQueryOptions) {
    it(`builds ${queryOption.name} extra query options`, async () => {
      const method = vi.fn(async () => queryOption.result);
      const sdk = { index: { [queryOption.method]: method } } as unknown as DtfSdk;
      const disabledOptions = queryOption.build(sdk, undefined);
      const options = queryOption.build(sdk, queryOption.params);

      expect(disabledOptions.enabled).toBe(false);
      expect(disabledOptions.queryKey).toEqual(queryOption.key(undefined));
      expect(options.queryKey).toEqual(queryOption.key(queryOption.params));
      await expect(options.queryFn()).resolves.toBe(queryOption.result);
      expect(method).toHaveBeenCalledWith(queryOption.params);
    });
  }

  it("builds portfolio query options", async () => {
    const portfolio = { indexDTFs: [], voteLocks: [] };
    const history = { timeline: [] };
    const transactions: readonly never[] = [];
    const sdk = {
      portfolio: {
        get: vi.fn(async () => portfolio),
        getHistory: vi.fn(async () => history),
        getTransactions: vi.fn(async () => transactions),
      },
    } as unknown as DtfSdk;
    const accountParams = { account: ACCOUNT } as const;
    const historyParams = { account: ACCOUNT, period: "1m" } as const;

    expect(accountPortfolioQueryOptions(sdk, undefined).queryKey).toEqual(dtfQueryKeys.portfolio.account(undefined));
    expect(accountPortfolioHistoryQueryOptions(sdk, undefined).enabled).toBe(false);
    expect(accountPortfolioTransactionsQueryOptions(sdk, undefined).enabled).toBe(false);

    const accountOptions = accountPortfolioQueryOptions(sdk, accountParams);
    const historyOptions = accountPortfolioHistoryQueryOptions(sdk, historyParams);
    const transactionsOptions = accountPortfolioTransactionsQueryOptions(sdk, accountParams);

    expect(accountOptions.queryKey).toEqual(dtfQueryKeys.portfolio.account(accountParams));
    expect(historyOptions.queryKey).toEqual(dtfQueryKeys.portfolio.history(historyParams));
    expect(transactionsOptions.queryKey).toEqual(dtfQueryKeys.portfolio.transactions(accountParams));
    await expect(accountOptions.queryFn()).resolves.toBe(portfolio);
    await expect(historyOptions.queryFn()).resolves.toBe(history);
    await expect(transactionsOptions.queryFn()).resolves.toBe(transactions);
  });
});

describe("staleTime defaults", () => {
  const sdk = {
    index: {
      getPrice: vi.fn(),
      getVersion: vi.fn(),
      getProposal: vi.fn(),
    },
  } as unknown as DtfSdk;
  const dtfParams = { chainId: 1, address: DTF } as const;

  it("applies the live class to price queries", () => {
    expect(indexDtfPriceQueryOptions(sdk, dtfParams).staleTime).toBe(LIVE_STALE_TIME);
  });

  it("applies the static class to version queries", () => {
    expect(indexDtfVersionQueryOptions(sdk, dtfParams).staleTime).toBe(STATIC_STALE_TIME);
  });

  it("applies the default class to governance queries", () => {
    expect(indexDtfProposalQueryOptions(sdk, { address: DTF, chainId: 1, proposalId: "1" }).staleTime).toBe(
      DEFAULT_STALE_TIME,
    );
  });

  it("lets callers override the default", () => {
    expect(indexDtfPriceQueryOptions(sdk, dtfParams, { staleTime: 0 }).staleTime).toBe(0);
  });
});
