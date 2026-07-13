import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { BlockNumber, DtfParams } from "@/types/common";
import type {
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
import { getIndexDtfPlatformFee } from "@/index-dtf/dtf/platform-fee";
import {
  getIndexDtfApprovedRevenueTokens,
  getIndexDtfBidsEnabled,
  getIndexDtfPendingFeeShares,
  getIndexDtfRebalanceControl,
  getIndexDtfRevenue,
  prepareIndexDtfDistributeFees,
} from "@/index-dtf/dtf/revenue";
import { getIndexDtfTransactions } from "@/index-dtf/dtf/transactions";
import { createIndexDtfGovernanceRef } from "@/index-dtf/governance/ref";
import {
  getActiveAuction,
  getBidQuote,
  getLatestAuction,
  getIndexDtfCurrentRebalance,
  getIndexDtfRebalanceLiquidity,
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
    prepareDistributeFees: () => prepareIndexDtfDistributeFees({ address, chainId }),
    ...createIndexDtfGovernanceRef(client, { address, chainId }),
    getRebalances: (options: Omit<Parameters<typeof getRebalances>[1], "address" | "chainId"> = {}) =>
      getRebalances(client, { ...options, address, chainId }),
    getRebalance: (rebalance: string | bigint | Omit<GetIndexDtfRebalanceParams, "address" | "chainId">) =>
      typeof rebalance === "object"
        ? getRebalance(client, { ...rebalance, address, chainId })
        : getRebalance(client, { address, chainId, nonce: rebalance }),
    getCompletedRebalances: (options: GetIndexDtfCompletedRebalancesOptions = {}) =>
      getCompletedRebalances(client, { ...options, address, chainId }),
    getCompletedRebalance: (
      rebalance: number | string | bigint | Omit<GetIndexDtfCompletedRebalanceParams, "address" | "chainId">,
    ) =>
      typeof rebalance === "object"
        ? getCompletedRebalance(client, { ...rebalance, address, chainId })
        : getCompletedRebalance(client, { address, chainId, nonce: rebalance }),
    getRebalanceAuctions: (rebalanceId: string) => getRebalanceAuctions(client, { chainId, rebalanceId }),
    getCurrentRebalance: (options?: BlockNumberOption | BlockNumber) =>
      getIndexDtfCurrentRebalance(client, {
        address,
        chainId,
        ...blockParams(options),
      }),
    getRebalanceLiquidity: (options: Omit<Parameters<typeof getIndexDtfRebalanceLiquidity>[1], "chainId">) =>
      getIndexDtfRebalanceLiquidity(client, { ...options, chainId }),
    getActiveAuction: (options?: BlockNumberOption | BlockNumber) =>
      getActiveAuction(client, { address, chainId, ...blockParams(options) }),
    getLatestAuction: (options?: BlockNumberOption | BlockNumber) =>
      getLatestAuction(client, { address, chainId, ...blockParams(options) }),
    getBidQuote: (quote: Omit<Parameters<typeof getBidQuote>[1], "address" | "chainId">) =>
      getBidQuote(client, { ...quote, address, chainId }),
    prepareBid: (call: Omit<Parameters<typeof prepareIndexDtfBid>[0], "address" | "chainId">) =>
      prepareIndexDtfBid({ ...call, address, chainId }),
    prepareCloseAuction: (call: Omit<Parameters<typeof prepareIndexDtfCloseAuction>[0], "address" | "chainId">) =>
      prepareIndexDtfCloseAuction({ ...call, address, chainId }),
    prepareEndRebalance: () => prepareIndexDtfEndRebalance({ address, chainId }),
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
