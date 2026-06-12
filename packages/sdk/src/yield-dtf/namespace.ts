import type { DtfClient } from "@/client";
import type { YieldDtfParams } from "@/types/yield-dtf";

import {
  getYieldDtf,
  getYieldDtfBasket,
  getYieldDtfContracts,
  getYieldDtfHolders,
  getYieldDtfPrice,
  getYieldDtfState,
  getYieldDtfTransactions,
  listYieldDtfs,
} from "@/yield-dtf/dtf/index";
import {
  getYieldDtfIssuanceQuote,
  getYieldDtfMaxIssuable,
  getYieldDtfRedemptionQuote,
  prepareYieldDtfIssue,
  prepareYieldDtfIssuePlan,
  prepareYieldDtfRedeem,
  prepareYieldDtfRedeemCustom,
} from "@/yield-dtf/issuance";
import { createYieldDtfRef } from "@/yield-dtf/ref";
import {
  getYieldDtfStakeHistory,
  getYieldDtfStakingState,
  prepareYieldDtfCancelUnstake,
  prepareYieldDtfStake,
  prepareYieldDtfStakePlan,
  prepareYieldDtfUnstake,
  prepareYieldDtfWithdraw,
} from "@/yield-dtf/staking";

/** Creates the direct Yield DTF namespace for scripts, bots, CLI, and apps. */
export function createYieldDtfNamespace(client: DtfClient) {
  return {
    ref: (params: YieldDtfParams) => createYieldDtfRef(client, params),
    get: (params: Parameters<typeof getYieldDtf>[1]) => getYieldDtf(client, params),
    list: (params: Parameters<typeof listYieldDtfs>[1]) => listYieldDtfs(client, params),
    getContracts: (params: Parameters<typeof getYieldDtfContracts>[1]) => getYieldDtfContracts(client, params),
    getState: (params: Parameters<typeof getYieldDtfState>[1]) => getYieldDtfState(client, params),
    getPrice: (params: Parameters<typeof getYieldDtfPrice>[1]) => getYieldDtfPrice(client, params),
    getBasket: (params: Parameters<typeof getYieldDtfBasket>[1]) => getYieldDtfBasket(client, params),
    getHolders: (params: Parameters<typeof getYieldDtfHolders>[1]) => getYieldDtfHolders(client, params),
    getTransactions: (params: Parameters<typeof getYieldDtfTransactions>[1]) => getYieldDtfTransactions(client, params),
    getIssuanceQuote: (params: Parameters<typeof getYieldDtfIssuanceQuote>[1]) =>
      getYieldDtfIssuanceQuote(client, params),
    getRedemptionQuote: (params: Parameters<typeof getYieldDtfRedemptionQuote>[1]) =>
      getYieldDtfRedemptionQuote(client, params),
    getMaxIssuable: (params: Parameters<typeof getYieldDtfMaxIssuable>[1]) => getYieldDtfMaxIssuable(client, params),
    getStakingState: (params: Parameters<typeof getYieldDtfStakingState>[1]) => getYieldDtfStakingState(client, params),
    getStakeHistory: (params: Parameters<typeof getYieldDtfStakeHistory>[1]) => getYieldDtfStakeHistory(client, params),
    prepareIssue: prepareYieldDtfIssue,
    prepareIssuePlan: prepareYieldDtfIssuePlan,
    prepareRedeem: prepareYieldDtfRedeem,
    prepareRedeemCustom: prepareYieldDtfRedeemCustom,
    prepareStake: prepareYieldDtfStake,
    prepareStakePlan: prepareYieldDtfStakePlan,
    prepareUnstake: prepareYieldDtfUnstake,
    prepareWithdraw: prepareYieldDtfWithdraw,
    prepareCancelUnstake: prepareYieldDtfCancelUnstake,
  };
}
