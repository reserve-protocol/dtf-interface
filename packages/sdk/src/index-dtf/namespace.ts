import type { DtfClient } from "@/client";
import type {
  BuildIndexDtfBasketProposalParams,
  BuildIndexDtfBasketSettingsProposalParams,
  BuildIndexDtfDaoSettingsProposalParams,
  BuildIndexDtfSettingsProposalParams,
} from "@/index-dtf/governance/propose/index";
import type { DtfParams } from "@/types/common";
import type {
  GetAllIndexDtfProposalsParams,
  GetIndexDtfDelegatesParams,
  GetIndexDtfGuardiansParams,
  GetIndexDtfLegacyVoteLocksParams,
  GetIndexDtfOptimisticGovernanceParams,
  GetIndexDtfOptimisticProposalContextParams,
  GetIndexDtfProposalParams,
  GetIndexDtfProposalStateParams,
  GetIndexDtfProposalStatesParams,
  GetIndexDtfProposalThrottleChargesParams,
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposalsParams,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
} from "@/types/governance";
import type {
  GetFullIndexDtfParams,
  GetIndexDtfBasketParams,
  GetIndexDtfBasketSnapshotParams,
  GetIndexDtfParams,
  GetIndexDtfPriceHistoryParams,
  GetIndexDtfPriceParams,
  GetIndexDtfTotalAssetsParams,
  GetIndexDtfTotalSupplyParams,
  GetIndexDtfVersionParams,
} from "@/types/index-dtf";
import type { ListIndexDtfsParams } from "@/types/protocol";

import { getAssetList } from "@/index-dtf/assets/index";
import {
  discoverIndexDtfs,
  discoverIndexDtfsByChain,
  getIndexDtfStatus,
  getIndexDtfStatuses,
} from "@/index-dtf/dtf/discovery";
import { getIndexDtfExposure } from "@/index-dtf/dtf/exposure";
import {
  getBasket,
  getBasketSnapshot,
  getBrand,
  getDtf,
  getFull,
  getMandate,
  getPrice,
  getPriceHistory,
  getPrices,
  getTotalAssets,
  getTotalSupply,
  getVersion,
} from "@/index-dtf/dtf/index";
import {
  getIndexDtfIssuanceState,
  getIndexDtfRedeemMinAmounts,
  prepareIndexDtfBasketApproval,
  prepareIndexDtfMint,
  prepareIndexDtfMintPlan,
  prepareIndexDtfRedeem,
} from "@/index-dtf/dtf/issuance";
import {
  getIndexDtfApprovedRevenueTokens,
  getIndexDtfBidsEnabled,
  getIndexDtfPendingFeeShares,
  getIndexDtfPlatformFee,
  getIndexDtfRebalanceControl,
  getIndexDtfRevenue,
  prepareIndexDtfDistributeFees,
} from "@/index-dtf/dtf/revenue";
import { getIndexDtfTransactions } from "@/index-dtf/dtf/transactions";
import {
  getAllProposals,
  getDelegates,
  getGuardians,
  getLegacyVoteLocks,
  getOptimisticGovernance,
  getOptimisticProposalContext,
  getOptimisticTimelockRoles,
  getOptimisticVotes,
  getPastOptimisticVotes,
  getProposal,
  getProposalDeadline,
  getProposalEta,
  getProposalRpcDetails,
  getProposalSnapshot,
  getProposalState,
  getProposalStates,
  getProposalThrottleCharges,
  getProposalVoterState,
  getProposalVotes,
  getProposals,
  getProposerState,
  getVoterState,
  prepareIndexDtfCancelProposal,
  prepareIndexDtfExecuteProposal,
  prepareIndexDtfQueueProposal,
  prepareIndexDtfSubmitOptimisticProposal,
  prepareIndexDtfSubmitProposal,
  prepareIndexDtfVote,
  getSelectorRegistryAllowedSelectors,
  getSelectorRegistryIsAllowed,
  getSelectorRegistryTargets,
  prepareSelectorRegistryRegisterSelectors,
  prepareSelectorRegistryUnregisterSelectors,
} from "@/index-dtf/governance/index";
import {
  buildIndexDtfBasketProposal,
  buildIndexDtfBasketSettingsProposal,
  buildIndexDtfDaoSettingsProposal,
  buildIndexDtfSettingsProposal,
} from "@/index-dtf/governance/propose/index";
import { listIndexDtfs } from "@/index-dtf/protocol/index";
import {
  getActiveAuction,
  getBidQuote,
  getIndexDtfCurrentRebalance,
  getCompletedRebalance,
  getCompletedRebalances,
  getRebalance,
  getRebalanceAuctions,
  getRebalances,
  prepareIndexDtfBid,
  prepareIndexDtfCloseAuction,
  prepareIndexDtfEndRebalance,
  prepareIndexDtfOpenAuctionArgs,
  prepareIndexDtfOpenAuction,
  prepareIndexDtfOpenAuctionUnrestricted,
  type GetIndexDtfCompletedRebalanceParams,
  type GetIndexDtfCompletedRebalancesParams,
  type GetIndexDtfRebalanceParams,
  type GetIndexDtfRebalancesParams,
} from "@/index-dtf/rebalance/index";
import { createIndexDtfRef } from "@/index-dtf/ref";
import {
  getVoteLockDao,
  getVoteLockDaos,
  getVoteLockState,
  prepareVoteLockApproval,
  prepareVoteLockClaimRewards,
  prepareVoteLockClaimWithdrawal,
  prepareVoteLockDelegate,
  prepareVoteLockDelegateOptimistic,
  prepareVoteLockDeposit,
  prepareVoteLockDepositPlan,
  prepareVoteLockUnlock,
} from "@/index-dtf/vote-lock/index";

/** Creates the direct Index DTF namespace for scripts, bots, CLI, and apps. */
export function createIndexDtfNamespace(client: DtfClient) {
  return {
    ref: (params: DtfParams) => createIndexDtfRef(client, params),
    discover: (params?: Parameters<typeof discoverIndexDtfs>[1]) =>
      discoverIndexDtfs(client, params),
    discoverByChain: (params: Parameters<typeof discoverIndexDtfsByChain>[1]) =>
      discoverIndexDtfsByChain(client, params),
    list: (params?: ListIndexDtfsParams) => listIndexDtfs(client, params),
    getAssetList: (params: Parameters<typeof getAssetList>[1]) =>
      getAssetList(client, params),
    get: (params: GetIndexDtfParams) => getFull(client, params),
    getDtf: (params: DtfParams) => getDtf(client, params),
    getFull: (params: GetFullIndexDtfParams) => getFull(client, params),
    getBasket: (params: GetIndexDtfBasketParams) => getBasket(client, params),
    getBasketSnapshot: (params: GetIndexDtfBasketSnapshotParams) => getBasketSnapshot(client, params),
    getVersion: (params: GetIndexDtfVersionParams) => getVersion(client, params),
    getTotalSupply: (params: GetIndexDtfTotalSupplyParams) => getTotalSupply(client, params),
    getTotalAssets: (params: GetIndexDtfTotalAssetsParams) => getTotalAssets(client, params),
    getBrand: (params: DtfParams) => getBrand(client, params),
    getMandate: (params: DtfParams) => getMandate(client, params),
    getPrice: (params: GetIndexDtfPriceParams) => getPrice(client, params),
    getPrices: (params: Parameters<typeof getPrices>[1]) =>
      getPrices(client, params),
    getPriceHistory: (params: GetIndexDtfPriceHistoryParams) =>
      getPriceHistory(client, params),
    getStatus: (params: Parameters<typeof getIndexDtfStatus>[1]) =>
      getIndexDtfStatus(client, params),
    getStatuses: (params?: Parameters<typeof getIndexDtfStatuses>[1]) =>
      getIndexDtfStatuses(client, params),
    getExposure: (params: Parameters<typeof getIndexDtfExposure>[1]) =>
      getIndexDtfExposure(client, params),
    getTransactions: (params: Parameters<typeof getIndexDtfTransactions>[1]) =>
      getIndexDtfTransactions(client, params),
    getBidsEnabled: (params: Parameters<typeof getIndexDtfBidsEnabled>[1]) =>
      getIndexDtfBidsEnabled(client, params),
    getRebalanceControl: (
      params: Parameters<typeof getIndexDtfRebalanceControl>[1],
    ) => getIndexDtfRebalanceControl(client, params),
    getPendingFeeShares: (
      params: Parameters<typeof getIndexDtfPendingFeeShares>[1],
    ) => getIndexDtfPendingFeeShares(client, params),
    getApprovedRevenueTokens: (
      params: Parameters<typeof getIndexDtfApprovedRevenueTokens>[1],
    ) => getIndexDtfApprovedRevenueTokens(client, params),
    getPlatformFee: (params: Parameters<typeof getIndexDtfPlatformFee>[1]) =>
      getIndexDtfPlatformFee(client, params),
    getRevenue: (params: Parameters<typeof getIndexDtfRevenue>[1]) =>
      getIndexDtfRevenue(client, params),
    getIssuanceState: (
      params: Parameters<typeof getIndexDtfIssuanceState>[1],
    ) => getIndexDtfIssuanceState(client, params),
    prepareMint: prepareIndexDtfMint,
    prepareMintPlan: prepareIndexDtfMintPlan,
    prepareRedeem: prepareIndexDtfRedeem,
    prepareBasketApproval: prepareIndexDtfBasketApproval,
    prepareDistributeFees: prepareIndexDtfDistributeFees,
    getRedeemMinAmounts: getIndexDtfRedeemMinAmounts,
    getProposals: (params: GetIndexDtfProposalsParams) =>
      getProposals(client, params),
    getProposal: (params: GetIndexDtfProposalParams) =>
      getProposal(client, params),
    getAllProposals: (params: GetAllIndexDtfProposalsParams) =>
      getAllProposals(client, params),
    getProposalState: (params: GetIndexDtfProposalStateParams) =>
      getProposalState(client, params),
    getProposalStates: (params: GetIndexDtfProposalStatesParams) =>
      getProposalStates(client, params),
    getProposalEta: (params: GetIndexDtfProposalStateParams) =>
      getProposalEta(client, params),
    getProposalDeadline: (params: GetIndexDtfProposalStateParams) =>
      getProposalDeadline(client, params),
    getProposalSnapshot: (params: GetIndexDtfProposalStateParams) =>
      getProposalSnapshot(client, params),
    getProposalRpcDetails: (params: GetIndexDtfProposalStateParams) =>
      getProposalRpcDetails(client, params),
    getDelegates: (params: GetIndexDtfDelegatesParams) =>
      getDelegates(client, params),
    getGuardians: (params: GetIndexDtfGuardiansParams) =>
      getGuardians(client, params),
    getLegacyVoteLocks: (params: GetIndexDtfLegacyVoteLocksParams) =>
      getLegacyVoteLocks(client, params),
    getVoterState: (params: GetIndexDtfVoterStateParams) =>
      getVoterState(client, params),
    getOptimisticGovernance: (params: GetIndexDtfOptimisticGovernanceParams) =>
      getOptimisticGovernance(client, params),
    getOptimisticProposalContext: (
      params: GetIndexDtfOptimisticProposalContextParams,
    ) => getOptimisticProposalContext(client, params),
    getOptimisticTimelockRoles: (
      params: Parameters<typeof getOptimisticTimelockRoles>[1],
    ) => getOptimisticTimelockRoles(client, params),
    getOptimisticVotes: (params: Parameters<typeof getOptimisticVotes>[1]) =>
      getOptimisticVotes(client, params),
    getPastOptimisticVotes: (
      params: Parameters<typeof getPastOptimisticVotes>[1],
    ) => getPastOptimisticVotes(client, params),
    getProposalThrottleCharges: (
      params: GetIndexDtfProposalThrottleChargesParams,
    ) => getProposalThrottleCharges(client, params),
    getProposerState: (params: GetIndexDtfProposerStateParams) =>
      getProposerState(client, params),
    getProposalVotes: (params: GetIndexDtfProposalVotesParams) =>
      getProposalVotes(client, params),
    getProposalVoterState: (params: GetIndexDtfProposalVoterStateParams) =>
      getProposalVoterState(client, params),
    prepareVote: prepareIndexDtfVote,
    prepareQueueProposal: prepareIndexDtfQueueProposal,
    prepareExecuteProposal: prepareIndexDtfExecuteProposal,
    prepareCancelProposal: prepareIndexDtfCancelProposal,
    prepareSubmitProposal: prepareIndexDtfSubmitProposal,
    prepareSubmitOptimisticProposal: prepareIndexDtfSubmitOptimisticProposal,
    getSelectorRegistryTargets: (
      params: Parameters<typeof getSelectorRegistryTargets>[1],
    ) => getSelectorRegistryTargets(client, params),
    getSelectorRegistryAllowedSelectors: (
      params: Parameters<typeof getSelectorRegistryAllowedSelectors>[1],
    ) => getSelectorRegistryAllowedSelectors(client, params),
    getSelectorRegistryIsAllowed: (
      params: Parameters<typeof getSelectorRegistryIsAllowed>[1],
    ) => getSelectorRegistryIsAllowed(client, params),
    prepareSelectorRegistryRegisterSelectors,
    prepareSelectorRegistryUnregisterSelectors,
    buildBasketProposal: (params: BuildIndexDtfBasketProposalParams) =>
      buildIndexDtfBasketProposal(client, params),
    buildBasketSettingsProposal: (
      params: BuildIndexDtfBasketSettingsProposalParams,
    ) => buildIndexDtfBasketSettingsProposal(client, params),
    buildDaoSettingsProposal: (
      params: BuildIndexDtfDaoSettingsProposalParams,
    ) => buildIndexDtfDaoSettingsProposal(client, params),
    buildSettingsProposal: (params: BuildIndexDtfSettingsProposalParams) =>
      buildIndexDtfSettingsProposal(client, params),
    getRebalances: (params: GetIndexDtfRebalancesParams) =>
      getRebalances(client, params),
    getRebalance: (params: GetIndexDtfRebalanceParams) =>
      getRebalance(client, params),
    getCompletedRebalances: (params: GetIndexDtfCompletedRebalancesParams) =>
      getCompletedRebalances(client, params),
    getCompletedRebalance: (params: GetIndexDtfCompletedRebalanceParams) =>
      getCompletedRebalance(client, params),
    getRebalanceAuctions: (
      params: Parameters<typeof getRebalanceAuctions>[1],
    ) => getRebalanceAuctions(client, params),
    getCurrentRebalance: (
      params: Parameters<typeof getIndexDtfCurrentRebalance>[1],
    ) => getIndexDtfCurrentRebalance(client, params),
    getActiveAuction: (params: Parameters<typeof getActiveAuction>[1]) =>
      getActiveAuction(client, params),
    getBidQuote: (params: Parameters<typeof getBidQuote>[1]) =>
      getBidQuote(client, params),
    prepareBid: prepareIndexDtfBid,
    prepareCloseAuction: prepareIndexDtfCloseAuction,
    prepareEndRebalance: prepareIndexDtfEndRebalance,
    prepareOpenAuctionArgs: prepareIndexDtfOpenAuctionArgs,
    prepareOpenAuction: prepareIndexDtfOpenAuction,
    prepareOpenAuctionUnrestricted: prepareIndexDtfOpenAuctionUnrestricted,
    getVoteLockState: (params: Parameters<typeof getVoteLockState>[1]) => getVoteLockState(client, params),
    getVoteLockDao: (params: Parameters<typeof getVoteLockDao>[1]) => getVoteLockDao(client, params),
    getVoteLockDaos: () => getVoteLockDaos(client),
    prepareVoteLockApproval,
    prepareVoteLockDeposit,
    prepareVoteLockDepositPlan,
    prepareVoteLockDelegate,
    prepareVoteLockDelegateOptimistic,
    prepareVoteLockUnlock,
    prepareVoteLockClaimRewards,
    prepareVoteLockClaimWithdrawal,
  };
}
