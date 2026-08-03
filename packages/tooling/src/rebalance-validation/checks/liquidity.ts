import type { DtfSdk, IndexDtfRebalanceLiquidityTrade } from "@reserve-protocol/sdk";
import type { Address } from "viem";

import type { ProposalContext } from "@/rebalance-validation/context";
import type { Report } from "@/rebalance-validation/report";
import type { PoolQuote } from "@/rebalance-validation/sources/pool-prices";

import { formatPercent, formatUsd } from "@/rebalance-validation/report";
import { recoverTokenInputs } from "@/rebalance-validation/start-rebalance";

/**
 * Trading-desk thresholds: a leg past these needs preparation before the auction
 * opens. The liquidity endpoint reports price impact in percent, signed by trade
 * direction.
 */
export const PRICE_IMPACT_FLAG_PERCENT = 5;
export const TRADE_SIZE_FLAG_USD = 10_000;
export const MIN_POOL_LIQUIDITY_USD = 50_000;

export type TradeLeg = {
  readonly address: Address;
  readonly symbol: string;
  readonly side: "buy" | "sell";
  readonly amountUsd: number;
  readonly price: number;
  readonly decimals: number;
};

/**
 * Sizes each leg from the delta between the live balance and the proposed
 * per-share units, valued at pool prices — the same reason the basket check uses
 * pool prices: an API mispricing would size the trades wrong in exactly the way
 * we are trying to detect.
 */
export function buildTradeLegs(context: ProposalContext, quotes: ReadonlyMap<Address, PoolQuote>): readonly TradeLeg[] {
  const shares = Number(context.supply) / 1e18;

  return context.rebalance.tokens.flatMap((token, index) => {
    const meta = context.tokens[index]!;
    const recovered = recoverTokenInputs(token, meta.decimals);
    const price = quotes.get(token.token)?.price ?? recovered.price;
    const currentUnits = Number(context.currentBalances.get(meta.address) ?? 0n) / 10 ** meta.decimals;
    const deltaUnits = recovered.wholeTokensPerShare * shares - currentUnits;
    const amountUsd = Math.abs(deltaUnits) * price;
    if (amountUsd < 1) return [];

    return [
      {
        address: meta.address,
        symbol: meta.symbol,
        side: deltaUnits > 0 ? ("buy" as const) : ("sell" as const),
        amountUsd,
        price,
        decimals: meta.decimals,
      },
    ];
  });
}

export function reportTurnover(report: Report, legs: readonly TradeLeg[], aumUsd: number): void {
  const buys = legs.filter((leg) => leg.side === "buy").reduce((total, leg) => total + leg.amountUsd, 0);
  const sells = legs.filter((leg) => leg.side === "sell").reduce((total, leg) => total + leg.amountUsd, 0);
  const turnover = Math.min(buys, sells);

  report.record(
    "outcomes",
    "pass",
    `turnover ${formatUsd(turnover)} — ${formatPercent(aumUsd > 0 ? turnover / aumUsd : 0)} of ${formatUsd(aumUsd)} AUM`,
    `${formatUsd(buys)} to buy, ${formatUsd(sells)} to sell`,
  );

  const large = legs.filter((leg) => leg.amountUsd > TRADE_SIZE_FLAG_USD);
  if (large.length > 0) {
    report.record(
      "outcomes",
      "warn",
      `legs above ${formatUsd(TRADE_SIZE_FLAG_USD)} — buy inventory before the auction opens`,
      large.map((leg) => `${leg.symbol} ${leg.side} ${formatUsd(leg.amountUsd)}`).join(" · "),
    );
  }
}

/** Every constituent needs a liquidity floor, not just the ones being traded this month. */
export function checkPoolDepth(
  report: Report,
  context: ProposalContext,
  quotes: ReadonlyMap<Address, PoolQuote>,
): void {
  const thin = context.tokens.flatMap((token) => {
    const quote = quotes.get(token.address);
    if (!quote) return [];

    return quote.liquidityUsd < MIN_POOL_LIQUIDITY_USD
      ? [`${token.symbol} ${formatUsd(quote.liquidityUsd)} (deepest pool ${quote.topPool.dex} ${quote.topPool.pair})`]
      : [];
  });

  report.record(
    "outcomes",
    thin.length === 0 ? "pass" : "warn",
    thin.length === 0
      ? `every constituent has at least ${formatUsd(MIN_POOL_LIQUIDITY_USD)} of pooled liquidity`
      : `constituents below ${formatUsd(MIN_POOL_LIQUIDITY_USD)} of pooled liquidity`,
    thin.join(" · ") || undefined,
  );
}

/**
 * Routes the legs through the same production endpoint the propose flow uses, so
 * the reviewer sees the price impact the auction would actually face.
 */
export async function checkTradeLiquidity(
  report: Report,
  sdk: DtfSdk,
  context: ProposalContext,
  legs: readonly TradeLeg[],
  nativePrice: number,
): Promise<void> {
  const trades: readonly IndexDtfRebalanceLiquidityTrade[] = legs.map((leg) => ({
    address: leg.address,
    side: leg.side,
    amountUsd: leg.amountUsd,
    price: leg.price,
    decimals: leg.decimals,
  }));
  if (trades.length === 0) return;

  let liquidity;
  try {
    liquidity = await sdk.index.getRebalanceLiquidity({ chainId: context.chainId, nativePrice, trades });
  } catch (error) {
    report.record("outcomes", "warn", "liquidity route unavailable — check impact by hand", String(error));

    return;
  }

  const symbols = new Map(context.tokens.map((token) => [token.address.toLowerCase(), token.symbol]));
  const flagged = liquidity.assets.filter(
    (asset) =>
      Math.abs(asset.liquidity.priceImpact) > PRICE_IMPACT_FLAG_PERCENT ||
      ["low", "insufficient", "error", "failed", "unknown"].includes(asset.liquidity.level),
  );

  report.record(
    "outcomes",
    flagged.length === 0 ? "pass" : "warn",
    flagged.length === 0
      ? `every leg routes under ${PRICE_IMPACT_FLAG_PERCENT}% price impact (${liquidity.assets.length} legs)`
      : `legs above ${PRICE_IMPACT_FLAG_PERCENT}% price impact or with weak routes`,
    flagged
      .map(
        (asset) =>
          `${symbols.get(asset.address.toLowerCase()) ?? asset.address} ${asset.side} ${formatUsd(asset.amountUsd)} -> impact ${asset.liquidity.priceImpact.toFixed(2)}%, level ${asset.liquidity.level}, score ${asset.liquidity.score.toFixed(0)}`,
      )
      .join(" · ") || undefined,
  );
}
