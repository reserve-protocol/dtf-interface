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
      "indexDtfRebalanceLiquidityQueryOptions",
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
      "useIndexCatalog",
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
      "useIndexDtfRebalanceLiquidity",
    ];

    expect(typeof reactSdk.prepareIndexDtfVote).toBe("function");
    expect(typeof reactSdk.prepareIndexDtfQueueProposal).toBe("function");
    for (const exportName of [...newQueryOptions, ...newHooks]) {
      expect(typeof publicSurface[exportName]).toBe("function");
    }
    expect("useIndexDtfVoteMutation" in reactSdk).toBe(false);
    expect("useIndexDtfDelegateMutation" in reactSdk).toBe(false);
  });

  it("re-exports Yield DTF hooks and query option builders", () => {
    const publicSurface = reactSdk as Record<string, unknown>;
    const yieldHooks = [
      "useYieldDtf",
      "useYieldDtfApy",
      "useYieldDtfBasket",
      "useYieldDtfContracts",
      "useYieldDtfDutchAuction",
      "useYieldDtfHolders",
      "useYieldDtfIssuanceQuote",
      "useYieldDtfCancelProposalCall",
      "useYieldDtfClaimRewardsCall",
      "useYieldDtfCancelUnstakeCall",
      "useYieldDtfExecuteProposalCall",
      "useYieldDtfGovernance",
      "useYieldDtfIssueCall",
      "useYieldDtfList",
      "useYieldDtfMaxIssuable",
      "useYieldDtfPrice",
      "useYieldDtfProposal",
      "useYieldDtfProposals",
      "useYieldDtfProposalVotePower",
      "useYieldDtfQueueProposalCall",
      "useYieldDtfSubmitProposalCall",
      "useYieldDtfTimelockCancelProposalCall",
      "useYieldDtfVoteCall",
      "useYieldDtfVoterState",
      "useYieldDtfRedeemCall",
      "useYieldDtfRevenue",
      "useYieldDtfRedemptionQuote",
      "useYieldDtfStakeCall",
      "useYieldDtfStakeHistory",
      "useYieldDtfStakingApyHistory",
      "useYieldDtfStakingState",
      "useYieldDtfState",
      "useYieldDtfTrades",
      "useYieldDtfTransactions",
      "useYieldDtfUnstakeCall",
      "useYieldDtfWithdrawCall",
    ];
    const yieldQueryOptions = [
      "yieldDtfApyQueryOptions",
      "yieldDtfBasketQueryOptions",
      "yieldDtfContractsQueryOptions",
      "yieldDtfDutchAuctionQueryOptions",
      "yieldDtfHoldersQueryOptions",
      "yieldDtfIssuanceQuoteQueryOptions",
      "yieldDtfListQueryOptions",
      "yieldDtfMaxIssuableQueryOptions",
      "yieldDtfGovernanceQueryOptions",
      "yieldDtfPriceQueryOptions",
      "yieldDtfProposalQueryOptions",
      "yieldDtfProposalsQueryOptions",
      "yieldDtfProposalVotePowerQueryOptions",
      "yieldDtfVoterStateQueryOptions",
      "yieldDtfQueryOptions",
      "yieldDtfRedemptionQuoteQueryOptions",
      "yieldDtfRevenueQueryOptions",
      "yieldDtfStakeHistoryQueryOptions",
      "yieldDtfStakingApyHistoryQueryOptions",
      "yieldDtfStakingStateQueryOptions",
      "yieldDtfStateQueryOptions",
      "yieldDtfTradesQueryOptions",
      "yieldDtfTransactionsQueryOptions",
    ];

    for (const exportName of [...yieldHooks, ...yieldQueryOptions]) {
      expect(typeof publicSurface[exportName]).toBe("function");
    }
  });
});
