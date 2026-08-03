import type { DtfSdk } from "@reserve-protocol/sdk";

import type { ProposalContext } from "@/rebalance-validation/context";
import type { ParsedProposalUrl } from "@/rebalance-validation/proposal-url";

import {
  checkBasketMembership,
  checkWeightHistory,
  fetchPreviousRebalance,
} from "@/rebalance-validation/checks/basket";
import { checkAuctionTiming, checkGovernanceRouting } from "@/rebalance-validation/checks/governance";
import { checkTokenIdentity } from "@/rebalance-validation/checks/identity";
import { checkLibraryReproduction, recoverBasket } from "@/rebalance-validation/checks/library";
import {
  buildTradeLegs,
  checkPoolDepth,
  checkTradeLiquidity,
  reportTurnover,
} from "@/rebalance-validation/checks/liquidity";
import { checkBasketSharesAtPoolPrices, checkPoolPrices } from "@/rebalance-validation/checks/prices";
import { loadProposalContext } from "@/rebalance-validation/context";
import { Report, formatUsd } from "@/rebalance-validation/report";
import { fetchPoolQuotes } from "@/rebalance-validation/sources/pool-prices";
import { fetchListedCoinsByAddress } from "@/rebalance-validation/sources/token-identity";

const NATIVE_TOKEN_BY_CHAIN: Record<number, string> = {
  1: "ETH",
  8453: "ETH",
  56: "BNB",
};

export type ValidationResult = { readonly report: Report; readonly context: ProposalContext };

/**
 * Runs the two-pass review: disaster checks that gate the proposal, then
 * execution checks that inform it. Independent data (pools, listings) is fetched
 * once and shared by the checks that need it.
 */
export async function validateRebalanceProposal(sdk: DtfSdk, url: ParsedProposalUrl): Promise<ValidationResult> {
  const report = new Report();
  const context = await loadProposalContext(sdk, url);
  const basket = recoverBasket(context);
  const addresses = context.tokens.map((token) => token.address);

  report.record(
    "disasters",
    "pass",
    `${context.dtf.token.symbol} v${context.version} · ${context.dtf.rebalance.weightControl ? "NATIVE" : "TRACKING"} · ${context.tokens.length} constituents`,
    `proposal ${context.proposal.id} (${context.proposal.votingState.state}) · supply ${(Number(context.supply) / 1e18).toFixed(2)} shares · AUM ${formatUsd(aumUsd(context, basket.shareValueUsd))}`,
  );

  checkGovernanceRouting(report, context);
  checkBasketMembership(report, context);
  checkLibraryReproduction(report, context, basket);

  const [quotes, listed, previous] = await Promise.all([
    fetchPoolQuotes(context.chainId, addresses),
    fetchListedCoinsByAddress(context.chainId).catch(() => new Map()),
    fetchPreviousRebalance(sdk, context).catch(() => undefined),
  ]);

  checkPoolPrices(report, context, quotes);
  checkBasketSharesAtPoolPrices(report, context, basket, quotes);
  checkWeightHistory(report, context, previous);
  checkTokenIdentity(report, context, listed);

  checkAuctionTiming(report, context);
  const legs = buildTradeLegs(context, quotes);
  reportTurnover(report, legs, aumUsd(context, basket.shareValueUsd));
  checkPoolDepth(report, context, quotes);
  await checkTradeLiquidity(report, sdk, context, legs, await nativePrice(sdk, context));

  return { report, context };
}

const aumUsd = (context: ProposalContext, shareValueUsd: number): number =>
  (Number(context.supply) / 1e18) * shareValueUsd;

async function nativePrice(sdk: DtfSdk, context: ProposalContext): Promise<number> {
  const symbol = NATIVE_TOKEN_BY_CHAIN[context.chainId] ?? "ETH";
  const wrapped = context.tokens.find((token) => token.symbol.toUpperCase() === `W${symbol}`);
  if (!wrapped) return 0;
  const [price] = await sdk.client.api.getTokenPrices({ chainId: context.chainId, addresses: [wrapped.address] });

  return price?.price ?? 0;
}
