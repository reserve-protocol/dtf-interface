import type { DtfClient } from "@/client";
import type { DtfParams } from "@/types/common";
import type {
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

import { getAssetList } from "@/client/api/assets";
import {
  buildIndexDtfDeployFeeRecipients,
  getIndexDtfDeployApprovalAmount,
  prepareIndexDtfDeploy,
  prepareIndexDtfDeployAssetApproval,
  prepareIndexDtfDeployAssetApprovals,
  prepareIndexDtfDeployGoverned,
  prepareIndexDtfDeployGovernedPlan,
  prepareIndexDtfDeployPlan,
  prepareIndexDtfDeployStakingToken,
} from "@/index-dtf/deploy/index";
import {
  discoverIndexDtfs,
  discoverIndexDtfsByChain,
  discoverIndexDtfsFromSubgraph,
  getIndexDtfStatuses,
} from "@/index-dtf/dtf/discovery";
import { getIndexDtfStatus } from "@/index-dtf/dtf/status";
import { getIndexDtfExposure } from "@/index-dtf/dtf/exposure";
import { getIndexDtfHolders } from "@/index-dtf/dtf/holders";
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
import { createIndexDtfGovernanceNamespace } from "@/index-dtf/governance/namespace";
import { getIndexDtfCatalogEntries, listIndexDtfs, resolveIndexDtfAlias } from "@/index-dtf/protocol/index";
import {
  buildIndexDtfRebalanceLiquidityTrades,
  getActiveAuction,
  getBidQuote,
  getLatestAuction,
  getIndexDtfCurrentRebalance,
  getIndexDtfExceededOndoLegs,
  getIndexDtfMaxSafeRebalancePercent,
  getIndexDtfRebalanceLegSizes,
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
  type GetIndexDtfCompletedRebalancesParams,
  type GetIndexDtfRebalanceParams,
  type GetIndexDtfRebalancesParams,
} from "@/index-dtf/rebalance/index";
import { createIndexDtfRef } from "@/index-dtf/ref";
import { createIndexDtfVoteLockNamespace } from "@/index-dtf/vote-lock/namespace";

/** Creates the direct Index DTF namespace for scripts, bots, CLI, and apps. */
export function createIndexDtfNamespace(client: DtfClient) {
  return {
    ref: (params: DtfParams) => createIndexDtfRef(client, params),
    discover: (params?: Parameters<typeof discoverIndexDtfs>[1]) => discoverIndexDtfs(client, params),
    discoverByChain: (params: Parameters<typeof discoverIndexDtfsByChain>[1]) =>
      discoverIndexDtfsByChain(client, params),
    discoverFromSubgraph: (params: Parameters<typeof discoverIndexDtfsFromSubgraph>[1]) =>
      discoverIndexDtfsFromSubgraph(client, params),
    list: (params?: ListIndexDtfsParams) => listIndexDtfs(client, params),
    getCatalogEntries: getIndexDtfCatalogEntries,
    resolveAlias: resolveIndexDtfAlias,
    getAssetList: (params: Parameters<typeof getAssetList>[1]) => getAssetList(client, params),
    get: (params: GetIndexDtfParams) => getFull(client, params),
    getDtf: (params: DtfParams) => getDtf(client, params),
    getBasket: (params: GetIndexDtfBasketParams) => getBasket(client, params),
    getBasketSnapshot: (params: GetIndexDtfBasketSnapshotParams) => getBasketSnapshot(client, params),
    getVersion: (params: GetIndexDtfVersionParams) => getVersion(client, params),
    getTotalSupply: (params: GetIndexDtfTotalSupplyParams) => getTotalSupply(client, params),
    getTotalAssets: (params: GetIndexDtfTotalAssetsParams) => getTotalAssets(client, params),
    getBrand: (params: DtfParams) => getBrand(client, params),
    getMandate: (params: DtfParams) => getMandate(client, params),
    getPrice: (params: GetIndexDtfPriceParams) => getPrice(client, params),
    getPrices: (params: Parameters<typeof getPrices>[1]) => getPrices(client, params),
    getPriceHistory: (params: GetIndexDtfPriceHistoryParams) => getPriceHistory(client, params),
    getStatus: getIndexDtfStatus,
    getStatuses: (params?: Parameters<typeof getIndexDtfStatuses>[1]) => getIndexDtfStatuses(client, params),
    getExposure: (params: Parameters<typeof getIndexDtfExposure>[1]) => getIndexDtfExposure(client, params),
    getHolders: (params: Parameters<typeof getIndexDtfHolders>[1]) => getIndexDtfHolders(client, params),
    getTransactions: (params: Parameters<typeof getIndexDtfTransactions>[1]) => getIndexDtfTransactions(client, params),
    getBidsEnabled: (params: Parameters<typeof getIndexDtfBidsEnabled>[1]) => getIndexDtfBidsEnabled(client, params),
    getRebalanceControl: (params: Parameters<typeof getIndexDtfRebalanceControl>[1]) =>
      getIndexDtfRebalanceControl(client, params),
    getPendingFeeShares: (params: Parameters<typeof getIndexDtfPendingFeeShares>[1]) =>
      getIndexDtfPendingFeeShares(client, params),
    getApprovedRevenueTokens: (params: Parameters<typeof getIndexDtfApprovedRevenueTokens>[1]) =>
      getIndexDtfApprovedRevenueTokens(client, params),
    getPlatformFee: (params: Parameters<typeof getIndexDtfPlatformFee>[1]) => getIndexDtfPlatformFee(client, params),
    getRevenue: (params: Parameters<typeof getIndexDtfRevenue>[1]) => getIndexDtfRevenue(client, params),
    getIssuanceState: (params: Parameters<typeof getIndexDtfIssuanceState>[1]) =>
      getIndexDtfIssuanceState(client, params),
    prepareMint: prepareIndexDtfMint,
    prepareMintPlan: prepareIndexDtfMintPlan,
    prepareRedeem: prepareIndexDtfRedeem,
    prepareBasketApproval: prepareIndexDtfBasketApproval,
    prepareDistributeFees: prepareIndexDtfDistributeFees,
    getRedeemMinAmounts: getIndexDtfRedeemMinAmounts,
    buildDeployFeeRecipients: buildIndexDtfDeployFeeRecipients,
    getDeployApprovalAmount: getIndexDtfDeployApprovalAmount,
    prepareDeploy: prepareIndexDtfDeploy,
    prepareDeployGoverned: prepareIndexDtfDeployGoverned,
    prepareDeployStakingToken: prepareIndexDtfDeployStakingToken,
    prepareDeployPlan: prepareIndexDtfDeployPlan,
    prepareDeployGovernedPlan: prepareIndexDtfDeployGovernedPlan,
    prepareDeployAssetApproval: prepareIndexDtfDeployAssetApproval,
    prepareDeployAssetApprovals: prepareIndexDtfDeployAssetApprovals,
    ...createIndexDtfGovernanceNamespace(client),
    getRebalances: (params: GetIndexDtfRebalancesParams) => getRebalances(client, params),
    getRebalance: (params: GetIndexDtfRebalanceParams) => getRebalance(client, params),
    getCompletedRebalances: (params: GetIndexDtfCompletedRebalancesParams) => getCompletedRebalances(client, params),
    getCompletedRebalance: (params: GetIndexDtfCompletedRebalanceParams) => getCompletedRebalance(client, params),
    getRebalanceAuctions: (params: Parameters<typeof getRebalanceAuctions>[1]) => getRebalanceAuctions(client, params),
    getCurrentRebalance: (params: Parameters<typeof getIndexDtfCurrentRebalance>[1]) =>
      getIndexDtfCurrentRebalance(client, params),
    getRebalanceLiquidity: (params: Parameters<typeof getIndexDtfRebalanceLiquidity>[1]) =>
      getIndexDtfRebalanceLiquidity(client, params),
    buildRebalanceLiquidityTrades: buildIndexDtfRebalanceLiquidityTrades,
    getRebalanceLegSizes: getIndexDtfRebalanceLegSizes,
    getMaxSafeRebalancePercent: getIndexDtfMaxSafeRebalancePercent,
    getExceededOndoLegs: getIndexDtfExceededOndoLegs,
    getActiveAuction: (params: Parameters<typeof getActiveAuction>[1]) => getActiveAuction(client, params),
    getLatestAuction: (params: Parameters<typeof getLatestAuction>[1]) => getLatestAuction(client, params),
    getBidQuote: (params: Parameters<typeof getBidQuote>[1]) => getBidQuote(client, params),
    prepareBid: prepareIndexDtfBid,
    prepareCloseAuction: prepareIndexDtfCloseAuction,
    prepareEndRebalance: prepareIndexDtfEndRebalance,
    prepareOpenAuctionArgs: prepareIndexDtfOpenAuctionArgs,
    prepareOpenAuction: prepareIndexDtfOpenAuction,
    prepareOpenAuctionUnrestricted: prepareIndexDtfOpenAuctionUnrestricted,
    ...createIndexDtfVoteLockNamespace(client),
  };
}
