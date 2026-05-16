import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type {
  BuildIndexDtfBasketProposalParams,
  BuildIndexDtfBasketSettingsProposalParams,
  BuildIndexDtfDaoSettingsProposalParams,
  BuildIndexDtfSettingsProposalParams,
} from "@/index-dtf/governance/propose/index";
import type { BlockNumber, DtfParams } from "@/types/common";
import type {
  GetIndexDtfDelegatesParams,
  GetIndexDtfOptimisticGovernanceParams,
  GetIndexDtfOptimisticProposalContextParams,
  GetIndexDtfProposalStateParams,
  GetIndexDtfProposalThrottleChargesParams,
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposalsOptions,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
} from "@/types/governance";
import type {
  GetFullIndexDtfOptions,
  GetIndexDtfBasketOptions,
  GetIndexDtfBasketSnapshotOptions,
  GetIndexDtfOptions,
  GetIndexDtfPriceHistoryOptions,
} from "@/types/index-dtf";

import { getIndexDtfStatus } from "@/index-dtf/dtf/discovery";
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
  getTotalAssets,
  getTotalSupply,
  getVersion,
} from "@/index-dtf/dtf/index";
import {
  getIndexDtfIssuanceState,
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
  getDelegates,
  getGuardians,
  getLegacyVoteLocks,
  getOptimisticGovernance,
  getOptimisticProposalContext,
  getProposal,
  getProposalDeadline,
  getProposalEta,
  getProposalRpcDetails,
  getProposalSnapshot,
  getProposalState,
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
} from "@/index-dtf/governance/index";
import {
  buildIndexDtfBasketProposal,
  buildIndexDtfBasketSettingsProposal,
  buildIndexDtfDaoSettingsProposal,
  buildIndexDtfSettingsProposal,
} from "@/index-dtf/governance/propose/index";
import {
  getActiveAuction,
  getBidQuote,
  getLatestAuction,
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
  type GetIndexDtfCompletedRebalancesOptions,
  type GetIndexDtfRebalanceParams,
} from "@/index-dtf/rebalance/index";
import { createIndexDtfVoteLockRef } from "@/index-dtf/vote-lock/ref";

type BlockNumberOption = Pick<DtfParams, "blockNumber">;

export type IndexDtfRef = ReturnType<typeof createIndexDtfRef>;

/** Creates an address-bound Index DTF ref with flat product methods. */
export function createIndexDtfRef(client: DtfClient, params: DtfParams) {
  const address = getAddress(params.address);
  const chainId = params.chainId;
  const blockParams = (options: BlockNumber | BlockNumberOption | undefined) => {
    const blockNumber = typeof options === "bigint" ? options : options?.blockNumber;
    return blockNumber === undefined ? {} : { blockNumber };
  };

  return {
    address,
    chainId,
    get: (options: GetIndexDtfOptions = {}) => getFull(client, { ...options, address, chainId }),
    getDtf: (options?: BlockNumberOption | BlockNumber) =>
      getDtf(client, { address, chainId, ...blockParams(options) }),
    getFull: (options: GetFullIndexDtfOptions = {}) => getFull(client, { ...options, address, chainId }),
    getBasket: (options?: GetIndexDtfBasketOptions) => getBasket(client, { address, chainId, ...blockParams(options) }),
    getBasketSnapshot: (options?: GetIndexDtfBasketSnapshotOptions) =>
      getBasketSnapshot(client, { address, chainId, ...blockParams(options) }),
    getVersion: (options?: BlockNumberOption | BlockNumber) =>
      getVersion(client, { address, chainId, ...blockParams(options) }),
    getTotalSupply: (options?: BlockNumberOption | BlockNumber) =>
      getTotalSupply(client, { address, chainId, ...blockParams(options) }),
    getTotalAssets: (options?: BlockNumberOption | BlockNumber) =>
      getTotalAssets(client, { address, chainId, ...blockParams(options) }),
    getBrand: () => getBrand(client, { address, chainId }),
    getMandate: (options?: BlockNumberOption | BlockNumber) =>
      getMandate(client, { address, chainId, ...blockParams(options) }),
    getPrice: () => getPrice(client, { address, chainId }),
    getPriceHistory: (options: GetIndexDtfPriceHistoryOptions) =>
      getPriceHistory(client, { ...options, address, chainId }),
    getStatus: () => getIndexDtfStatus(client, { address, chainId }),
    getExposure: (options: Omit<Parameters<typeof getIndexDtfExposure>[1], "address" | "chainId"> = {}) =>
      getIndexDtfExposure(client, { ...options, address, chainId }),
    getTransactions: (options: Omit<Parameters<typeof getIndexDtfTransactions>[1], "address" | "chainId"> = {}) =>
      getIndexDtfTransactions(client, { ...options, address, chainId }),
    getBidsEnabled: (options?: BlockNumberOption | BlockNumber) =>
      getIndexDtfBidsEnabled(client, {
        address,
        chainId,
        ...blockParams(options),
      }),
    getRebalanceControl: (options?: BlockNumberOption | BlockNumber) =>
      getIndexDtfRebalanceControl(client, {
        address,
        chainId,
        ...blockParams(options),
      }),
    getPendingFeeShares: (options?: BlockNumberOption | BlockNumber) =>
      getIndexDtfPendingFeeShares(client, {
        address,
        chainId,
        ...blockParams(options),
      }),
    getApprovedRevenueTokens: (options: { readonly stToken?: Address } = {}) =>
      getIndexDtfApprovedRevenueTokens(client, {
        ...options,
        address,
        chainId,
      }),
    getPlatformFee: (options?: BlockNumberOption | BlockNumber) =>
      getIndexDtfPlatformFee(client, {
        address,
        chainId,
        ...blockParams(options),
      }),
    getRevenue: () => getIndexDtfRevenue(client, { address, chainId }),
    getIssuanceState: (options: Omit<Parameters<typeof getIndexDtfIssuanceState>[1], "address" | "chainId">) =>
      getIndexDtfIssuanceState(client, { ...options, address, chainId }),
    prepareMint: (call: Omit<Parameters<typeof prepareIndexDtfMint>[0], "address" | "chainId">) =>
      prepareIndexDtfMint({ ...call, address, chainId }),
    prepareMintPlan: (plan: Omit<Parameters<typeof prepareIndexDtfMintPlan>[0], "address" | "chainId">) =>
      prepareIndexDtfMintPlan({ ...plan, address, chainId }),
    prepareRedeem: (call: Omit<Parameters<typeof prepareIndexDtfRedeem>[0], "address" | "chainId">) =>
      prepareIndexDtfRedeem({ ...call, address, chainId }),
    prepareBasketApproval: (call: Omit<Parameters<typeof prepareIndexDtfBasketApproval>[0], "address" | "chainId">) =>
      prepareIndexDtfBasketApproval({
        ...call,
        address,
        chainId,
      }),
    prepareDistributeFees: () =>
      prepareIndexDtfDistributeFees({ address, chainId }),
    getProposals: (options: GetIndexDtfProposalsOptions = {}) =>
      getProposals(client, { ...options, address, chainId }),
    getProposal: (proposalId: string) =>
      getProposal(client, { proposalId, address, chainId }),
    getProposalState: (
      proposal: Pick<GetIndexDtfProposalStateParams, "governance" | "proposalId">,
    ) => getProposalState(client, { ...proposal, chainId }),
    getProposalEta: (
      proposal: Pick<GetIndexDtfProposalStateParams, "governance" | "proposalId">,
    ) => getProposalEta(client, { ...proposal, chainId }),
    getProposalDeadline: (
      proposal: Pick<GetIndexDtfProposalStateParams, "governance" | "proposalId">,
    ) => getProposalDeadline(client, { ...proposal, chainId }),
    getProposalSnapshot: (
      proposal: Pick<GetIndexDtfProposalStateParams, "governance" | "proposalId">,
    ) => getProposalSnapshot(client, { ...proposal, chainId }),
    getProposalRpcDetails: (
      proposal: Pick<GetIndexDtfProposalStateParams, "governance" | "proposalId">,
    ) => getProposalRpcDetails(client, { ...proposal, chainId }),
    getDelegates: (
      options: Pick<GetIndexDtfDelegatesParams, "stToken" | "limit">,
    ) => getDelegates(client, { ...options, chainId }),
    getGuardians: () => getGuardians(client, { address, chainId }),
    getLegacyVoteLocks: () => getLegacyVoteLocks(client, { address, chainId }),
    getVoterState: (
      voter: Pick<GetIndexDtfVoterStateParams, "account" | "stToken">,
    ) => getVoterState(client, { ...voter, chainId }),
    getOptimisticGovernance: (
      governance: Pick<GetIndexDtfOptimisticGovernanceParams, "governance">,
    ) => getOptimisticGovernance(client, { ...governance, chainId }),
    getOptimisticProposalContext: (
      proposal: Pick<
        GetIndexDtfOptimisticProposalContextParams,
        "governance" | "proposalId"
      >,
    ) => getOptimisticProposalContext(client, { ...proposal, chainId }),
    getProposalThrottleCharges: (
      charges: Pick<
        GetIndexDtfProposalThrottleChargesParams,
        "account" | "governance"
      >,
    ) => getProposalThrottleCharges(client, { ...charges, chainId }),
    getProposerState: (
      proposer: Pick<
        GetIndexDtfProposerStateParams,
        "account" | "governance" | "timepoint"
      >,
    ) => getProposerState(client, { ...proposer, chainId }),
    getProposalVotes: (
      votes: Pick<GetIndexDtfProposalVotesParams, "governance" | "proposalId">,
    ) => getProposalVotes(client, { ...votes, chainId }),
    getProposalVoterState: (
      voter: Pick<
        GetIndexDtfProposalVoterStateParams,
        "account" | "governance" | "proposal"
      >,
    ) => getProposalVoterState(client, { ...voter, chainId }),
    buildBasketProposal: (
      proposal: Omit<BuildIndexDtfBasketProposalParams, "address" | "chainId">,
    ) => buildIndexDtfBasketProposal(client, { ...proposal, address, chainId }),
    buildBasketSettingsProposal: (
      proposal: Omit<
        BuildIndexDtfBasketSettingsProposalParams,
        "address" | "chainId"
      >,
    ) =>
      buildIndexDtfBasketSettingsProposal(client, {
        ...proposal,
        address,
        chainId,
      }),
    buildDaoSettingsProposal: (proposal: Omit<BuildIndexDtfDaoSettingsProposalParams, "address" | "chainId">) =>
      buildIndexDtfDaoSettingsProposal(client, {
        ...proposal,
        address,
        chainId,
    }),
    buildSettingsProposal: (proposal: Omit<BuildIndexDtfSettingsProposalParams, "address" | "chainId">) =>
      buildIndexDtfSettingsProposal(client, { ...proposal, address, chainId }),
    prepareVote: (
      call: Omit<
        Parameters<typeof prepareIndexDtfVote>[0],
        "chainId"
      >,
    ) => prepareIndexDtfVote({ ...call, chainId }),
    prepareQueueProposal: (
      call: Omit<
        Parameters<typeof prepareIndexDtfQueueProposal>[0],
        "chainId"
      >,
    ) => prepareIndexDtfQueueProposal({ ...call, chainId }),
    prepareExecuteProposal: (
      call: Omit<
        Parameters<typeof prepareIndexDtfExecuteProposal>[0],
        "chainId"
      >,
    ) => prepareIndexDtfExecuteProposal({ ...call, chainId }),
    prepareCancelProposal: (
      call: Omit<
        Parameters<typeof prepareIndexDtfCancelProposal>[0],
        "chainId"
      >,
    ) => prepareIndexDtfCancelProposal({ ...call, chainId }),
    prepareSubmitProposal: (
      call: Omit<
        Parameters<typeof prepareIndexDtfSubmitProposal>[0],
        "chainId"
      >,
    ) => prepareIndexDtfSubmitProposal({ ...call, chainId }),
    prepareSubmitOptimisticProposal: (
      call: Omit<
        Parameters<typeof prepareIndexDtfSubmitOptimisticProposal>[0],
        "chainId"
      >,
    ) => prepareIndexDtfSubmitOptimisticProposal({ ...call, chainId }),
    getRebalances: (
      options: Omit<
        Parameters<typeof getRebalances>[1],
        "address" | "chainId"
      > = {},
    ) => getRebalances(client, { ...options, address, chainId }),
    getRebalance: (
      rebalance:
        | string
        | bigint
        | Omit<GetIndexDtfRebalanceParams, "address" | "chainId">,
    ) =>
      typeof rebalance === "object"
        ? getRebalance(client, { ...rebalance, address, chainId })
        : getRebalance(client, { address, chainId, nonce: rebalance }),
    getCompletedRebalances: (options: GetIndexDtfCompletedRebalancesOptions = {}) =>
      getCompletedRebalances(client, { ...options, address, chainId }),
    getCompletedRebalance: (
      rebalance:
        | number
        | string
        | bigint
        | Omit<GetIndexDtfCompletedRebalanceParams, "address" | "chainId">,
    ) =>
      typeof rebalance === "object"
        ? getCompletedRebalance(client, { ...rebalance, address, chainId })
        : getCompletedRebalance(client, { address, chainId, nonce: rebalance }),
    getRebalanceAuctions: (rebalanceId: string) =>
      getRebalanceAuctions(client, { chainId, rebalanceId }),
    getCurrentRebalance: (options?: BlockNumberOption | BlockNumber) =>
      getIndexDtfCurrentRebalance(client, {
        address,
        chainId,
        ...blockParams(options),
      }),
    getActiveAuction: (options?: BlockNumberOption | BlockNumber) =>
      getActiveAuction(client, { address, chainId, ...blockParams(options) }),
    getLatestAuction: (options?: BlockNumberOption | BlockNumber) =>
      getLatestAuction(client, { address, chainId, ...blockParams(options) }),
    getBidQuote: (
      quote: Omit<Parameters<typeof getBidQuote>[1], "address" | "chainId">,
    ) => getBidQuote(client, { ...quote, address, chainId }),
    prepareBid: (
      call: Omit<Parameters<typeof prepareIndexDtfBid>[0], "address" | "chainId">,
    ) => prepareIndexDtfBid({ ...call, address, chainId }),
    prepareCloseAuction: (
      call: Omit<Parameters<typeof prepareIndexDtfCloseAuction>[0], "address" | "chainId">,
    ) => prepareIndexDtfCloseAuction({ ...call, address, chainId }),
    prepareEndRebalance: () =>
      prepareIndexDtfEndRebalance({ address, chainId }),
    prepareOpenAuctionArgs: prepareIndexDtfOpenAuctionArgs,
    prepareOpenAuction: (call: Omit<Parameters<typeof prepareIndexDtfOpenAuction>[0], "address" | "chainId">) =>
      prepareIndexDtfOpenAuction({ ...call, address, chainId }),
    prepareOpenAuctionUnrestricted: (
      call: Omit<Parameters<typeof prepareIndexDtfOpenAuctionUnrestricted>[0], "address" | "chainId">,
    ) =>
      prepareIndexDtfOpenAuctionUnrestricted({
        ...call,
        address,
        chainId,
      }),
    ...createIndexDtfVoteLockRef(client, { address, chainId }),
  };
}
