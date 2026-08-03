import type { Address } from "viem";

import type { RecoveredBasket } from "@/rebalance-validation/checks/library";
import type { ProposalContext } from "@/rebalance-validation/context";
import type { Report } from "@/rebalance-validation/report";
import type { PoolQuote } from "@/rebalance-validation/sources/pool-prices";

import { formatPercent, formatUsd } from "@/rebalance-validation/report";
import { recoverTokenInputs } from "@/rebalance-validation/start-rebalance";

/** A pool price this far from the encoded price is the signature of wrong decimals or a wrong token. */
export const MAGNITUDE_FAIL = 0.5;
/** Inside the band but past this much of it, the auction can still fill badly. */
export const BAND_USAGE_WARN = 0.5;
/** Basket shares recomputed at pool prices may differ by rounding and stale pools, not by this much. */
export const BASKET_SHARE_FAIL = 0.01;

export const ordersOfMagnitude = (a: number, b: number): number =>
  a > 0 && b > 0 ? Math.abs(Math.log10(a / b)) : Number.POSITIVE_INFINITY;

/**
 * Fraction of the encoded price band consumed by the pool price: 0 at the
 * geometric mean, 1 at either edge.
 */
export const bandUsage = (poolPrice: number, low: number, high: number, price: number): number =>
  poolPrice >= price ? (poolPrice - price) / (high - price) : (price - poolPrice) / (price - low);

/**
 * Highest-value check in the whole review: the encoded price of every asset,
 * against a price from liquidity pools rather than from the API the proposal was
 * built with. Correlated errors between our price feed and our own calldata are
 * invisible to any self-consistency check, and pricing one asset wrong is how a
 * rebalance moves real value into the wrong place.
 */
export function checkPoolPrices(
  report: Report,
  context: ProposalContext,
  quotes: ReadonlyMap<Address, PoolQuote>,
): void {
  const outside: string[] = [];
  const wideBand: string[] = [];
  const missing: string[] = [];

  for (const [index, token] of context.rebalance.tokens.entries()) {
    const meta = context.tokens[index]!;
    const quote = quotes.get(token.token);
    if (!quote || !Number.isFinite(quote.price) || quote.price <= 0) {
      missing.push(meta.symbol);
      continue;
    }
    const { price, priceLow, priceHigh } = recoverTokenInputs(token, meta.decimals);
    const magnitudes = ordersOfMagnitude(quote.price, price);
    const usage = bandUsage(quote.price, priceLow, priceHigh, price);

    if (quote.price < priceLow || quote.price > priceHigh || magnitudes >= MAGNITUDE_FAIL) {
      outside.push(
        `${meta.symbol}: pool ${quote.price} vs encoded ${price} (${magnitudes.toFixed(2)} orders, band ${priceLow}–${priceHigh})`,
      );
    } else if (usage > BAND_USAGE_WARN) {
      wideBand.push(`${meta.symbol}: pool price uses ${formatPercent(usage, 0)} of the encoded band`);
    }
  }

  report.record(
    "disasters",
    outside.length === 0 ? "pass" : "fail",
    outside.length === 0
      ? "pool prices sit inside every encoded price range (independent of the Reserve API)"
      : "pool price disagrees with the encoded price range",
    outside.join(" · ") || undefined,
  );
  if (wideBand.length > 0) {
    report.record("disasters", "warn", "pool price near the edge of the encoded band", wideBand.join(" · "));
  }
  if (missing.length > 0) {
    report.record("disasters", "warn", "no pool price found — verify by hand", missing.join(", "));
  }
}

/**
 * Re-values the proposed basket at pool prices. If one asset is mispriced, its
 * target share moves, so this catches value being shifted into the wrong place
 * even when every individual price still looks plausible.
 */
export function checkBasketSharesAtPoolPrices(
  report: Report,
  context: ProposalContext,
  basket: RecoveredBasket,
  quotes: ReadonlyMap<Address, PoolQuote>,
): void {
  const priced = context.rebalance.tokens.map((token, index) => {
    const meta = context.tokens[index]!;
    const recovered = recoverTokenInputs(token, meta.decimals);
    const poolPrice = quotes.get(token.token)?.price;

    return { symbol: meta.symbol, units: recovered.wholeTokensPerShare, price: poolPrice ?? recovered.price };
  });
  const valuesUsd = priced.map((token) => token.units * token.price);
  const total = valuesUsd.reduce((sum, value) => sum + value, 0);
  const drifts = priced.map((token, index) => ({
    symbol: token.symbol,
    drift: Math.abs(valuesUsd[index]! / total - Number(basket.targetShares[index]!) / 1e18),
  }));
  const worst = drifts.reduce((max, entry) => (entry.drift > max.drift ? entry : max), { symbol: "-", drift: 0 });

  report.record(
    "disasters",
    worst.drift <= BASKET_SHARE_FAIL ? "pass" : "fail",
    worst.drift <= BASKET_SHARE_FAIL
      ? `basket shares agree when valued at pool prices (worst ${worst.symbol} ${formatPercent(worst.drift)})`
      : `basket share of ${worst.symbol} moves ${formatPercent(worst.drift)} when valued at pool prices`,
    `share value ${formatUsd(basket.shareValueUsd)} at encoded prices vs ${formatUsd(total)} at pool prices`,
  );
}
