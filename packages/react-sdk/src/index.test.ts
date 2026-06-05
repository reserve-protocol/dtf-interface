import { describe, expect, it } from "vitest";

import * as reactSdk from "@/index";

describe("React SDK public surface", () => {
  it("re-exports core prepare helpers without wallet-bound mutation hooks", () => {
    const publicSurface = reactSdk as Record<string, unknown>;
    const newQueryOptions = [
      "indexDtfOptimisticGovernanceQueryOptions",
      "indexDtfOptimisticProposalContextQueryOptions",
      "indexDtfOptimisticProposalVoterStateQueryOptions",
      "indexDtfOptimisticTimelockRolesQueryOptions",
      "indexDtfOptimisticVotesQueryOptions",
      "indexDtfPastOptimisticVotesQueryOptions",
      "indexDtfProposalListQueryOptions",
      "indexDtfProposalThrottleChargesQueryOptions",
      "indexDtfSelectorRegistryTargetsQueryOptions",
      "indexDtfSelectorRegistryAllowedSelectorsQueryOptions",
      "indexDtfSelectorRegistryIsAllowedQueryOptions",
      "accountPortfolioHistoryQueryOptions",
      "accountPortfolioTransactionsQueryOptions",
      "indexDtfApprovedRevenueTokensQueryOptions",
      "indexDtfCompletedRebalanceQueryOptions",
      "indexDtfCompletedRebalancesQueryOptions",
      "indexDtfPendingFeeSharesQueryOptions",
      "indexDtfPlatformFeeQueryOptions",
      "indexDtfRebalanceAuctionsQueryOptions",
    ];
    const newHooks = [
      "useIndexDtfOptimisticGovernance",
      "useIndexDtfOptimisticProposalContext",
      "useIndexDtfOptimisticProposalVoterState",
      "useIndexDtfOptimisticTimelockRoles",
      "useIndexDtfOptimisticVotes",
      "useIndexDtfPastOptimisticVotes",
      "useIndexDtfCancelProposalCall",
      "useIndexDtfExecuteProposalCall",
      "useIndexDtfProposalList",
      "useIndexDtfQueueProposalCall",
      "useIndexDtfProposalThrottleCharges",
      "useIndexDtfVoteCall",
      "useIndexDtfSelectorRegistryTargets",
      "useIndexDtfSelectorRegistryAllowedSelectors",
      "useIndexDtfSelectorRegistryIsAllowed",
      "useAccountPortfolioHistory",
      "useAccountPortfolioTransactions",
      "useIndexDtfApprovedRevenueTokens",
      "useIndexDtfCompletedRebalance",
      "useIndexDtfCompletedRebalances",
      "useIndexDtfPendingFeeShares",
      "useIndexDtfPlatformFee",
      "useIndexDtfRebalanceAuctions",
    ];

    expect(typeof reactSdk.prepareIndexDtfVote).toBe("function");
    expect(typeof reactSdk.prepareIndexDtfQueueProposal).toBe("function");
    for (const exportName of [...newQueryOptions, ...newHooks]) {
      expect(typeof publicSurface[exportName]).toBe("function");
    }
    expect("useIndexDtfVoteMutation" in reactSdk).toBe(false);
    expect("useIndexDtfDelegateMutation" in reactSdk).toBe(false);
  });
});
