import { getAddress, type Address } from "viem";
import type { DtfClient } from "../client.js";
import type { BlockNumber, DtfParams } from "../types/common.js";
import type {
  GetFullIndexDtfOptions,
  GetIndexDtfBasketOptions,
  GetIndexDtfBasketSnapshotOptions,
  GetIndexDtfOptions,
  GetIndexDtfPriceHistoryOptions,
} from "../types/index-dtf.js";
import type {
  GetIndexDtfDelegatesParams,
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposalsOptions,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
} from "../types/governance.js";
import type {
  BuildIndexDtfBasketProposalParams,
  BuildIndexDtfBasketSettingsProposalParams,
  BuildIndexDtfDaoSettingsProposalParams,
  BuildIndexDtfSettingsProposalParams,
} from "./governance/propose/index.js";
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
} from "./dtf/index.js";
import { getIndexDtfExposure } from "./dtf/exposure.js";
import { getIndexDtfTransactions } from "./dtf/transactions.js";
import {
  getIndexDtfIssuanceState,
  prepareIndexDtfBasketApproval,
  prepareIndexDtfMint,
  prepareIndexDtfMintPlan,
  prepareIndexDtfRedeem,
} from "./dtf/issuance.js";
import {
  getIndexDtfApprovedRevenueTokens,
  getIndexDtfBidsEnabled,
  getIndexDtfPendingFeeShares,
  getIndexDtfPlatformFee,
  getIndexDtfRebalanceControl,
  getIndexDtfRevenue,
  prepareIndexDtfDistributeFees,
} from "./dtf/revenue.js";
import { getIndexDtfStatus } from "./dtf/discovery.js";
import {
  getDelegates,
  getGuardians,
  getProposal,
  getProposalVoterState,
  getProposalVotes,
  getProposals,
  getProposerState,
  getVoterState,
  prepareIndexDtfCancelProposal,
  prepareIndexDtfExecuteProposal,
  prepareIndexDtfQueueProposal,
  prepareIndexDtfSubmitProposal,
  prepareIndexDtfVote,
} from "./governance/index.js";
import {
  buildIndexDtfBasketProposal,
  buildIndexDtfBasketSettingsProposal,
  buildIndexDtfDaoSettingsProposal,
  buildIndexDtfSettingsProposal,
} from "./governance/propose/index.js";
import {
  getIndexDtfCurrentRebalance,
  getRebalance,
  getRebalanceAuctions,
  getRebalances,
  prepareIndexDtfOpenAuctionArgs,
  prepareIndexDtfOpenAuction,
  prepareIndexDtfOpenAuctionUnrestricted,
  type GetIndexDtfRebalanceParams,
} from "./rebalance/index.js";
import {
  getVoteLockDao,
  getVoteLockState,
  prepareVoteLockApproval,
  prepareVoteLockClaimRewards,
  prepareVoteLockClaimWithdrawal,
  prepareVoteLockDelegate,
  prepareVoteLockDeposit,
  prepareVoteLockDepositPlan,
  prepareVoteLockUnlock,
} from "./vote-lock/index.js";

type BlockNumberOption = Pick<DtfParams, "blockNumber">;
type WithoutChainId<T> = T extends unknown ? Omit<T, "chainId"> : never;
type VoteLockDepositRefParams = WithoutChainId<
  Parameters<typeof prepareVoteLockDeposit>[0]
>;
type VoteLockDepositPlanRefParams = WithoutChainId<
  Parameters<typeof prepareVoteLockDepositPlan>[0]
>;

export type IndexDtfRef = ReturnType<typeof createIndexDtfRef>;

/** Creates an address-bound Index DTF ref with flat product methods. */
export function createIndexDtfRef(client: DtfClient, params: DtfParams) {
  const address = getAddress(params.address);
  const chainId = params.chainId;
  const blockParams = (
    options: BlockNumber | BlockNumberOption | undefined,
  ) => {
    const blockNumber =
      typeof options === "bigint" ? options : options?.blockNumber;
    return blockNumber === undefined ? {} : { blockNumber };
  };

  return {
    address,
    chainId,
    get: (options: GetIndexDtfOptions = {}) =>
      getFull(client, { ...options, address, chainId }),
    getDtf: (options?: BlockNumberOption | BlockNumber) =>
      getDtf(client, { address, chainId, ...blockParams(options) }),
    getFull: (options: GetFullIndexDtfOptions = {}) =>
      getFull(client, { ...options, address, chainId }),
    getBasket: (options?: GetIndexDtfBasketOptions) =>
      getBasket(client, { address, chainId, ...blockParams(options) }),
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
    getExposure: (
      options: Omit<
        Parameters<typeof getIndexDtfExposure>[1],
        "address" | "chainId"
      > = {},
    ) => getIndexDtfExposure(client, { ...options, address, chainId }),
    getTransactions: (
      options: Omit<
        Parameters<typeof getIndexDtfTransactions>[1],
        "address" | "chainId"
      > = {},
    ) => getIndexDtfTransactions(client, { ...options, address, chainId }),
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
    getIssuanceState: (
      options: Omit<
        Parameters<typeof getIndexDtfIssuanceState>[1],
        "address" | "chainId"
      >,
    ) => getIndexDtfIssuanceState(client, { ...options, address, chainId }),
    prepareMint: (
      call: Omit<
        Parameters<typeof prepareIndexDtfMint>[0],
        "address" | "chainId"
      >,
    ) => prepareIndexDtfMint({ ...call, address, chainId }),
    prepareMintPlan: (
      plan: Omit<
        Parameters<typeof prepareIndexDtfMintPlan>[0],
        "address" | "chainId"
      >,
    ) => prepareIndexDtfMintPlan({ ...plan, address, chainId }),
    prepareRedeem: (
      call: Omit<
        Parameters<typeof prepareIndexDtfRedeem>[0],
        "address" | "chainId"
      >,
    ) => prepareIndexDtfRedeem({ ...call, address, chainId }),
    prepareBasketApproval: (
      call: Omit<
        Parameters<typeof prepareIndexDtfBasketApproval>[0],
        "address" | "chainId"
      >,
    ) =>
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
    getDelegates: (
      options: Pick<GetIndexDtfDelegatesParams, "stToken" | "limit">,
    ) => getDelegates(client, { ...options, chainId }),
    getGuardians: () => getGuardians(client, { address, chainId }),
    getVoterState: (
      voter: Pick<GetIndexDtfVoterStateParams, "account" | "stToken">,
    ) => getVoterState(client, { ...voter, chainId }),
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
    buildDaoSettingsProposal: (
      proposal: Omit<
        BuildIndexDtfDaoSettingsProposalParams,
        "address" | "chainId"
      >,
    ) =>
      buildIndexDtfDaoSettingsProposal(client, {
        ...proposal,
        address,
        chainId,
      }),
    buildSettingsProposal: (
      proposal: Omit<
        BuildIndexDtfSettingsProposalParams,
        "address" | "chainId"
      >,
    ) =>
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
    getRebalanceAuctions: (rebalanceId: string) =>
      getRebalanceAuctions(client, { chainId, rebalanceId }),
    getCurrentRebalance: (options?: BlockNumberOption | BlockNumber) =>
      getIndexDtfCurrentRebalance(client, {
        address,
        chainId,
        ...blockParams(options),
      }),
    prepareOpenAuctionArgs: prepareIndexDtfOpenAuctionArgs,
    prepareOpenAuction: (
      call: Omit<
        Parameters<typeof prepareIndexDtfOpenAuction>[0],
        "address" | "chainId"
      >,
    ) => prepareIndexDtfOpenAuction({ ...call, address, chainId }),
    prepareOpenAuctionUnrestricted: (
      call: Omit<
        Parameters<typeof prepareIndexDtfOpenAuctionUnrestricted>[0],
        "address" | "chainId"
      >,
    ) =>
      prepareIndexDtfOpenAuctionUnrestricted({
        ...call,
        address,
        chainId,
      }),
    getVoteLockState: (
      options: Omit<
        Parameters<typeof getVoteLockState>[1],
        "address" | "chainId"
      >,
    ) => getVoteLockState(client, { ...options, address, chainId }),
    getVoteLockDao: () => getVoteLockDao(client, { address, chainId }),
    prepareVoteLockApproval: (
      call: Omit<Parameters<typeof prepareVoteLockApproval>[0], "chainId">,
    ) => prepareVoteLockApproval({ ...call, chainId }),
    prepareVoteLockDeposit: (call: VoteLockDepositRefParams) =>
      prepareVoteLockDeposit({ ...call, chainId }),
    prepareVoteLockDepositPlan: (call: VoteLockDepositPlanRefParams) =>
      prepareVoteLockDepositPlan({ ...call, chainId }),
    prepareVoteLockDelegate: (
      call: Omit<Parameters<typeof prepareVoteLockDelegate>[0], "chainId">,
    ) => prepareVoteLockDelegate({ ...call, chainId }),
    prepareVoteLockUnlock: (
      call: Omit<Parameters<typeof prepareVoteLockUnlock>[0], "chainId">,
    ) => prepareVoteLockUnlock({ ...call, chainId }),
    prepareVoteLockClaimRewards: (
      call: Omit<Parameters<typeof prepareVoteLockClaimRewards>[0], "chainId">,
    ) => prepareVoteLockClaimRewards({ ...call, chainId }),
    prepareVoteLockClaimWithdrawal: (
      call: Omit<
        Parameters<typeof prepareVoteLockClaimWithdrawal>[0],
        "chainId"
      >,
    ) => prepareVoteLockClaimWithdrawal({ ...call, chainId }),
  };
}
