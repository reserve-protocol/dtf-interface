import { getAddress, type Address, type WalletClient } from "viem";
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
  IndexDtfGovernanceWriter,
} from "../types/governance.js";
import type {
  BuildIndexDtfBasketProposalParams,
  BuildIndexDtfBasketSettingsProposalParams,
  BuildIndexDtfDaoSettingsProposalParams,
  BuildIndexDtfSettingsProposalParams,
} from "./governance/propose/index.js";
import { getBasket, getBasketSnapshot, getBrand, getDtf, getFull, getPrice, getPriceHistory, getTotalAssets, getTotalSupply, getVersion } from "./dtf/index.js";
import { getIndexDtfExposure } from "./dtf/exposure.js";
import { getIndexDtfTransactions } from "./dtf/transactions.js";
import { getIndexDtfIssuanceState, buildIndexDtfBasketApprovalCall, buildIndexDtfMintCall, buildIndexDtfRedeemCall } from "./dtf/issuance.js";
import { buildIndexDtfDistributeFeesCall, getIndexDtfApprovedRevenueTokens, getIndexDtfBidsEnabled, getIndexDtfPendingFeeShares, getIndexDtfPlatformFee, getIndexDtfRebalanceControl, getIndexDtfRevenue } from "./dtf/revenue.js";
import { getIndexDtfStatus } from "./dtf/discovery.js";
import { createIndexDtfRefGovernanceWriter, getDelegates, getGuardians, getProposal, getProposalVoterState, getProposalVotes, getProposals, getProposerState, getVoterState } from "./governance/index.js";
import { buildIndexDtfBasketProposal, buildIndexDtfBasketSettingsProposal, buildIndexDtfDaoSettingsProposal, buildIndexDtfSettingsProposal } from "./governance/propose/index.js";
import { buildIndexDtfOpenAuctionArgs, buildIndexDtfOpenAuctionCall, buildIndexDtfOpenAuctionUnrestrictedCall, getIndexDtfCurrentRebalance, getRebalance, getRebalanceAuctions, getRebalances, type GetIndexDtfRebalanceParams } from "./rebalance/index.js";
import { buildClaimVoteLockRewardsCall, buildClaimVoteLockWithdrawalCall, buildVoteLockApprovalCall, buildVoteLockDelegateCall, buildVoteLockDepositCall, buildVoteLockUnlockCall, getVoteLockDao, getVoteLockState } from "./vote-lock/index.js";

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
    getDtf: (options?: BlockNumberOption | BlockNumber) => getDtf(client, { address, chainId, ...blockParams(options) }),
    getFull: (options: GetFullIndexDtfOptions = {}) => getFull(client, { ...options, address, chainId }),
    getBasket: (options?: GetIndexDtfBasketOptions) => getBasket(client, { address, chainId, ...blockParams(options) }),
    getBasketSnapshot: (options?: GetIndexDtfBasketSnapshotOptions) => getBasketSnapshot(client, { address, chainId, ...blockParams(options) }),
    getVersion: (options?: BlockNumberOption | BlockNumber) => getVersion(client, { address, chainId, ...blockParams(options) }),
    getTotalSupply: (options?: BlockNumberOption | BlockNumber) => getTotalSupply(client, { address, chainId, ...blockParams(options) }),
    getTotalAssets: (options?: BlockNumberOption | BlockNumber) => getTotalAssets(client, { address, chainId, ...blockParams(options) }),
    getBrand: () => getBrand(client, { address, chainId }),
    getPrice: () => getPrice(client, { address, chainId }),
    getPriceHistory: (options: GetIndexDtfPriceHistoryOptions) => getPriceHistory(client, { ...options, address, chainId }),
    getStatus: () => getIndexDtfStatus(client, { address, chainId }),
    getExposure: (options: Omit<Parameters<typeof getIndexDtfExposure>[1], "address" | "chainId"> = {}) => getIndexDtfExposure(client, { ...options, address, chainId }),
    getTransactions: (options: Omit<Parameters<typeof getIndexDtfTransactions>[1], "address" | "chainId"> = {}) => getIndexDtfTransactions(client, { ...options, address, chainId }),
    getBidsEnabled: (options?: BlockNumberOption | BlockNumber) => getIndexDtfBidsEnabled(client, { address, chainId, ...blockParams(options) }),
    getRebalanceControl: (options?: BlockNumberOption | BlockNumber) => getIndexDtfRebalanceControl(client, { address, chainId, ...blockParams(options) }),
    getPendingFeeShares: (options?: BlockNumberOption | BlockNumber) => getIndexDtfPendingFeeShares(client, { address, chainId, ...blockParams(options) }),
    getApprovedRevenueTokens: (options: { readonly stToken?: Address } = {}) => getIndexDtfApprovedRevenueTokens(client, { ...options, address, chainId }),
    getPlatformFee: (options?: BlockNumberOption | BlockNumber) => getIndexDtfPlatformFee(client, { address, chainId, ...blockParams(options) }),
    getRevenue: () => getIndexDtfRevenue(client, { address, chainId }),
    getIssuanceState: (options: Omit<Parameters<typeof getIndexDtfIssuanceState>[1], "address" | "chainId">) => getIndexDtfIssuanceState(client, { ...options, address, chainId }),
    buildMintCall: (call: Omit<Parameters<typeof buildIndexDtfMintCall>[0], "address">) => buildIndexDtfMintCall({ ...call, address }),
    buildRedeemCall: (call: Omit<Parameters<typeof buildIndexDtfRedeemCall>[0], "address">) => buildIndexDtfRedeemCall({ ...call, address }),
    buildBasketApprovalCall: (call: Omit<Parameters<typeof buildIndexDtfBasketApprovalCall>[0], "address">) => buildIndexDtfBasketApprovalCall({ ...call, address }),
    buildDistributeFeesCall: () => buildIndexDtfDistributeFeesCall({ address }),
    getProposals: (options: GetIndexDtfProposalsOptions = {}) => getProposals(client, { ...options, address, chainId }),
    getProposal: (proposalId: string) => getProposal(client, { proposalId, address, chainId }),
    getDelegates: (options: Pick<GetIndexDtfDelegatesParams, "stToken" | "limit">) => getDelegates(client, { ...options, chainId }),
    getGuardians: () => getGuardians(client, { address, chainId }),
    getVoterState: (voter: Pick<GetIndexDtfVoterStateParams, "account" | "stToken">) => getVoterState(client, { ...voter, chainId }),
    getProposerState: (proposer: Pick<GetIndexDtfProposerStateParams, "account" | "governance" | "timepoint">) => getProposerState(client, { ...proposer, chainId }),
    getProposalVotes: (votes: Pick<GetIndexDtfProposalVotesParams, "governance" | "proposalId">) => getProposalVotes(client, { ...votes, chainId }),
    getProposalVoterState: (voter: Pick<GetIndexDtfProposalVoterStateParams, "account" | "governance" | "proposal">) => getProposalVoterState(client, { ...voter, chainId }),
    buildBasketProposal: (proposal: Omit<BuildIndexDtfBasketProposalParams, "address" | "chainId">) => buildIndexDtfBasketProposal(client, { ...proposal, address, chainId }),
    buildBasketSettingsProposal: (proposal: Omit<BuildIndexDtfBasketSettingsProposalParams, "address" | "chainId">) => buildIndexDtfBasketSettingsProposal(client, { ...proposal, address, chainId }),
    buildDaoSettingsProposal: (proposal: Omit<BuildIndexDtfDaoSettingsProposalParams, "address" | "chainId">) => buildIndexDtfDaoSettingsProposal(client, { ...proposal, address, chainId }),
    buildSettingsProposal: (proposal: Omit<BuildIndexDtfSettingsProposalParams, "address" | "chainId">) => buildIndexDtfSettingsProposal(client, { ...proposal, address, chainId }),
    governance: (walletClient: WalletClient): IndexDtfGovernanceWriter => createIndexDtfRefGovernanceWriter(walletClient, chainId),
    getRebalances: (options: Omit<Parameters<typeof getRebalances>[1], "address" | "chainId"> = {}) => getRebalances(client, { ...options, address, chainId }),
    getRebalance: (rebalance: string | bigint | Omit<GetIndexDtfRebalanceParams, "address" | "chainId">) => typeof rebalance === "object" ? getRebalance(client, { ...rebalance, address, chainId }) : getRebalance(client, { address, chainId, nonce: rebalance }),
    getRebalanceAuctions: (rebalanceId: string) => getRebalanceAuctions(client, { chainId, rebalanceId }),
    getCurrentRebalance: (options?: BlockNumberOption | BlockNumber) => getIndexDtfCurrentRebalance(client, { address, chainId, ...blockParams(options) }),
    buildOpenAuctionArgs: buildIndexDtfOpenAuctionArgs,
    buildOpenAuctionCall: (call: Omit<Parameters<typeof buildIndexDtfOpenAuctionCall>[0], "address">) => buildIndexDtfOpenAuctionCall({ ...call, address }),
    buildOpenAuctionUnrestrictedCall: (call: Omit<Parameters<typeof buildIndexDtfOpenAuctionUnrestrictedCall>[0], "address">) => buildIndexDtfOpenAuctionUnrestrictedCall({ ...call, address }),
    getVoteLockState: (options: Omit<Parameters<typeof getVoteLockState>[1], "address" | "chainId">) => getVoteLockState(client, { ...options, address, chainId }),
    getVoteLockDao: () => getVoteLockDao(client, { address, chainId }),
    buildVoteLockApprovalCall,
    buildVoteLockDepositCall,
    buildVoteLockDelegateCall,
    buildVoteLockUnlockCall,
    buildClaimVoteLockRewardsCall,
    buildClaimVoteLockWithdrawalCall,
  };
}
