import { getAddress, type Address } from "viem";

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
} from "@/yield-dtf/dtf/index";
import { getYieldDtfGovernance, getYieldDtfProposals } from "@/yield-dtf/governance";
import {
  getYieldDtfIssuanceQuote,
  getYieldDtfMaxIssuable,
  getYieldDtfRedemptionQuote,
  prepareYieldDtfIssue,
  prepareYieldDtfIssuePlan,
  prepareYieldDtfRedeem,
  prepareYieldDtfRedeemCustom,
  type YieldDtfIssuePlanParams,
  type YieldDtfRedeemCustomParams,
} from "@/yield-dtf/issuance";
import { getYieldDtfStakeHistory, getYieldDtfStakingState } from "@/yield-dtf/staking";

export type YieldDtfRef = ReturnType<typeof createYieldDtfRef>;

/** Binds { address, chainId } once for flat Yield DTF reads and builders. */
export function createYieldDtfRef(client: DtfClient, params: YieldDtfParams) {
  const address = getAddress(params.address);
  const chainId = params.chainId;

  return {
    address,
    chainId,
    get: () => getYieldDtf(client, { address, chainId }),
    getContracts: () => getYieldDtfContracts(client, { address, chainId }),
    getState: () => getYieldDtfState(client, { address, chainId }),
    getPrice: () => getYieldDtfPrice(client, { address, chainId }),
    getBasket: () => getYieldDtfBasket(client, { address, chainId }),
    getHolders: (options?: { readonly limit?: number; readonly offset?: number }) =>
      getYieldDtfHolders(client, { address, chainId, ...options }),
    getTransactions: (options?: { readonly limit?: number; readonly offset?: number }) =>
      getYieldDtfTransactions(client, { address, chainId, ...options }),
    getIssuanceQuote: (amount: bigint) => getYieldDtfIssuanceQuote(client, { address, chainId, amount }),
    getRedemptionQuote: (amount: bigint) => getYieldDtfRedemptionQuote(client, { address, chainId, amount }),
    getMaxIssuable: (account: Address) => getYieldDtfMaxIssuable(client, { address, chainId, account }),
    getStakingState: (options: { readonly stToken: Address; readonly account: Address }) =>
      getYieldDtfStakingState(client, { address, chainId, ...options }),
    getStakeHistory: (options: { readonly account: Address; readonly limit?: number; readonly offset?: number }) =>
      getYieldDtfStakeHistory(client, { address, chainId, ...options }),
    prepareIssue: (amount: bigint) => prepareYieldDtfIssue({ address, chainId, amount }),
    prepareIssuePlan: (options: Omit<YieldDtfIssuePlanParams, "address" | "chainId">) =>
      prepareYieldDtfIssuePlan({ ...options, address, chainId }),
    prepareRedeem: (amount: bigint) => prepareYieldDtfRedeem({ address, chainId, amount }),
    prepareRedeemCustom: (options: Omit<YieldDtfRedeemCustomParams, "address" | "chainId">) =>
      prepareYieldDtfRedeemCustom({ ...options, address, chainId }),
    getGovernance: () => getYieldDtfGovernance(client, { address, chainId }),
    getProposals: (options?: { readonly limit?: number; readonly offset?: number }) =>
      getYieldDtfProposals(client, { address, chainId, ...options }),
  };
}
