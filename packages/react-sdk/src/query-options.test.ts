import type { DtfSdk } from "@reserve-protocol/sdk";

import { useQueries } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import {
  accountPortfolioHistoryQueryOptions,
  accountPortfolioQueryOptions,
  accountPortfolioTransactionsQueryOptions,
  indexDtfAccountBalanceSnapshotQueryOptions,
  indexDtfActiveAuctionQueryOptions,
  indexDtfApprovedRevenueTokensQueryOptions,
  indexDtfBidQuoteQueryOptions,
  indexDtfBidsEnabledQueryOptions,
  indexDtfCompletedRebalanceQueryOptions,
  indexDtfCompletedRebalancesQueryOptions,
  indexDtfHoldersQueryOptions,
  indexDtfLatestAuctionQueryOptions,
  indexDtfMandateQueryOptions,
  indexDtfPendingFeeSharesQueryOptions,
  indexDtfPlatformFeeQueryOptions,
  indexDtfRebalanceAuctionsQueryOptions,
  indexDtfRebalanceControlQueryOptions,
  indexDtfRebalanceLiquidityQueryOptions,
  indexDtfRebalanceQueryOptions,
  indexDtfRevenueQueryOptions,
  indexDtfTotalAssetsQueryOptions,
  indexDtfTotalSupplyQueryOptions,
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
  readonly build: (
    sdk: DtfSdk,
    params: never,
  ) => { readonly enabled?: unknown; readonly queryKey: unknown; readonly queryFn: () => Promise<unknown> };
  readonly key: (params: never) => unknown;
  readonly params: unknown;
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
    name: "mandate",
    method: "getMandate",
    build: indexDtfMandateQueryOptions,
    key: dtfQueryKeys.index.mandate,
    params: { address: DTF, chainId: 1 },
    result: "Diversified assets",
  },
  {
    name: "total supply",
    method: "getTotalSupply",
    build: indexDtfTotalSupplyQueryOptions,
    key: dtfQueryKeys.index.totalSupply,
    params: { address: DTF, chainId: 1 },
    result: 100n,
  },
  {
    name: "total assets",
    method: "getTotalAssets",
    build: indexDtfTotalAssetsQueryOptions,
    key: dtfQueryKeys.index.totalAssets,
    params: { address: DTF, chainId: 1 },
    result: { tokens: [TARGET], balances: [100n], balanceByToken: { [TARGET]: 100n } },
  },
  {
    name: "holders",
    method: "getHolders",
    build: indexDtfHoldersQueryOptions,
    key: dtfQueryKeys.index.holders,
    params: { address: DTF, chainId: 1, limit: 20 },
    result: { holders: [], totalHolders: 0 },
  },
  {
    name: "account balance snapshot",
    method: "getAccountBalanceSnapshot",
    build: indexDtfAccountBalanceSnapshotQueryOptions,
    key: dtfQueryKeys.index.accountBalanceSnapshot,
    params: { account: ACCOUNT, dtf: DTF, chainId: 1, before: 1_700_000_000 },
    result: { balance: { raw: 1n, formatted: "0.000000000000000001" }, timestamp: 1_700_000_000 },
  },
  {
    name: "bids enabled",
    method: "getBidsEnabled",
    build: indexDtfBidsEnabledQueryOptions,
    key: dtfQueryKeys.index.bidsEnabled,
    params: { address: DTF, chainId: 1 },
    result: true,
  },
  {
    name: "rebalance control",
    method: "getRebalanceControl",
    build: indexDtfRebalanceControlQueryOptions,
    key: dtfQueryKeys.index.rebalanceControl,
    params: { address: DTF, chainId: 1 },
    result: { weightControl: true, priceControl: 1 },
  },
  {
    name: "rebalance liquidity",
    method: "getRebalanceLiquidity",
    build: indexDtfRebalanceLiquidityQueryOptions,
    key: dtfQueryKeys.index.rebalanceLiquidity,
    params: { chainId: 1, nativePrice: 3000, trades: [] },
    result: { market: null, totals: { sellUsd: 0, buyUsd: 0 }, assets: [] },
  },
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
    name: "rebalance",
    method: "getRebalance",
    build: indexDtfRebalanceQueryOptions,
    key: dtfQueryKeys.index.rebalance,
    params: { address: DTF, chainId: 1, nonce: 1n },
    result: { id: "rebalance-1" },
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
    name: "active auction",
    method: "getActiveAuction",
    build: indexDtfActiveAuctionQueryOptions,
    key: dtfQueryKeys.index.activeAuction,
    params: { address: DTF, chainId: 1 },
    result: { auctionId: 1n, isActive: true },
  },
  {
    name: "latest auction",
    method: "getLatestAuction",
    build: indexDtfLatestAuctionQueryOptions,
    key: dtfQueryKeys.index.latestAuction,
    params: { address: DTF, chainId: 1 },
    result: { auctionId: 1n, isActive: false },
  },
  {
    name: "bid quote",
    method: "getBidQuote",
    build: indexDtfBidQuoteQueryOptions,
    key: dtfQueryKeys.index.bidQuote,
    params: { address: DTF, chainId: 1, auctionId: 1n, sellToken: TARGET, buyToken: ACCOUNT, maxSellAmount: 10n },
    result: { sellAmount: 10n, bidAmount: 9n, price: 1n },
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
      const disabledOptions = queryOption.build(sdk, undefined as never);
      const options = queryOption.build(sdk, queryOption.params as never);

      expect(disabledOptions.enabled).toBe(false);
      expect(disabledOptions.queryKey).toEqual(queryOption.key(undefined as never));
      expect(options.queryKey).toEqual(queryOption.key(queryOption.params as never));
      await expect(options.queryFn()).resolves.toBe(queryOption.result);
      expect(method).toHaveBeenCalledWith(queryOption.params);
    });
  }

  for (const queryOption of extraIndexQueryOptions) {
    it(`builds ${queryOption.name} extra query options`, async () => {
      const method = vi.fn(async () => queryOption.result);
      const sdk = { index: { [queryOption.method]: method } } as unknown as DtfSdk;
      const disabledOptions = queryOption.build(sdk, undefined as never);
      const options = queryOption.build(sdk, queryOption.params as never);

      expect(disabledOptions.enabled).toBe(false);
      expect(disabledOptions.queryKey).toEqual(queryOption.key(undefined as never));
      expect(options.queryKey).toEqual(queryOption.key(queryOption.params as never));
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

function typecheckUseQueries(sdk: DtfSdk) {
  return useQueries({
    queries: [
      indexDtfSelectorRegistryIsAllowedQueryOptions(sdk, {
        chainId: 1,
        registry: REGISTRY,
        selector: "0xabcdef12",
        target: TARGET,
      }),
    ],
  });
}

void typecheckUseQueries;

describe("staleTime defaults", () => {
  const sdk = {
    index: {
      getMandate: vi.fn(),
      getPrice: vi.fn(),
      getTotalSupply: vi.fn(),
      getVersion: vi.fn(),
      getProposal: vi.fn(),
    },
  } as unknown as DtfSdk;
  const dtfParams = { chainId: 1, address: DTF } as const;

  it("applies the live class to price queries", () => {
    expect(indexDtfPriceQueryOptions(sdk, dtfParams).staleTime).toBe(LIVE_STALE_TIME);
    expect(indexDtfTotalSupplyQueryOptions(sdk, dtfParams).staleTime).toBe(LIVE_STALE_TIME);
  });

  it("applies the static class to version queries", () => {
    expect(indexDtfVersionQueryOptions(sdk, dtfParams).staleTime).toBe(STATIC_STALE_TIME);
    expect(indexDtfMandateQueryOptions(sdk, dtfParams).staleTime).toBe(STATIC_STALE_TIME);
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
