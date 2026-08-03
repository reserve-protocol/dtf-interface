import { buildIndexDtfStartRebalanceArgs } from "@reserve-protocol/sdk";

import type { ProposalContext } from "@/rebalance-validation/context";
import type { Report } from "@/rebalance-validation/report";

import { formatPercent } from "@/rebalance-validation/report";
import { recoverTokenInputs } from "@/rebalance-validation/start-rebalance";

export type RecoveredBasket = {
  readonly targetShares: readonly bigint[];
  readonly prices: readonly number[];
  readonly priceErrors: readonly number[];
  readonly maxAuctionSizesUsd: readonly number[];
  readonly shareValueUsd: number;
};

/**
 * Recovers the inputs the proposer fed the rebalance library from the encoded
 * ranges: target shares (D18) from `weight.spot * price`, prices and price
 * errors from the price range, and max auction sizes from `{tok}` back to USD.
 */
export function recoverBasket(context: ProposalContext): RecoveredBasket {
  const recovered = context.rebalance.tokens.map((token, index) =>
    recoverTokenInputs(token, context.tokens[index]!.decimals),
  );
  const valuesUsd = recovered.map((token) => token.wholeTokensPerShare * token.price);
  const shareValueUsd = valuesUsd.reduce((total, value) => total + value, 0);

  return {
    targetShares: valuesUsd.map((value) => BigInt(Math.round((value / shareValueUsd) * 1e18))),
    prices: recovered.map((token) => token.price),
    priceErrors: recovered.map((token) => token.priceError),
    maxAuctionSizesUsd: context.rebalance.tokens.map(
      (token, index) =>
        (Number(token.maxAuctionSize) / 10 ** context.tokens[index]!.decimals) * recovered[index]!.price,
    ),
    shareValueUsd,
  };
}

const WEIGHT_TOLERANCE = 2e-6;

/**
 * Re-derives the whole action from the recovered inputs with the same library
 * the propose flow uses. Matching output means the calldata is unmodified
 * library output; a mismatch means it was hand-edited or built by something
 * else, which is the only way the encoded ranges can disagree with the intent.
 */
export function checkLibraryReproduction(report: Report, context: ProposalContext, basket: RecoveredBasket): void {
  const { rebalance, tokens, supply, currentBalances, dtf } = context;
  let derived: ReturnType<typeof buildIndexDtfStartRebalanceArgs>;

  try {
    derived = buildIndexDtfStartRebalanceArgs({
      tokens: tokens.map((token, index) => ({
        address: token.address,
        decimals: token.decimals,
        price: basket.prices[index]!,
      })),
      supply,
      balances: tokens.map((token) => currentBalances.get(token.address) ?? 0n),
      basket: { type: "shares", shares: [...basket.targetShares] },
      priceErrors: [...basket.priceErrors],
      maxAuctionSizesUsd: [...basket.maxAuctionSizesUsd],
      weightControl: dtf.rebalance.weightControl,
    });
  } catch (error) {
    report.record("disasters", "fail", "could not re-derive startRebalance from the library", String(error));

    return;
  }

  const drift = (encoded: bigint, expected: bigint) =>
    expected === 0n ? (encoded === 0n ? 0 : 1) : Math.abs(Number(encoded - expected) / Number(expected));
  const mismatches = rebalance.tokens.flatMap((token, index) => {
    const expected = derived.tokens[index];
    if (!expected) return [`${tokens[index]!.symbol}: missing from re-derivation`];
    const worst = Math.max(
      drift(token.weight.low, expected.weight.low),
      drift(token.weight.spot, expected.weight.spot),
      drift(token.weight.high, expected.weight.high),
      drift(token.price.low, expected.price.low),
      drift(token.price.high, expected.price.high),
    );

    return worst > WEIGHT_TOLERANCE ? [`${tokens[index]!.symbol}: ranges drift by ${formatPercent(worst, 5)}`] : [];
  });

  report.record(
    "disasters",
    mismatches.length === 0 ? "pass" : "fail",
    mismatches.length === 0
      ? "weights and price ranges reproduce from the rebalance library"
      : "encoded ranges do not reproduce from the rebalance library",
    mismatches.join(" · ") || `${rebalance.tokens.length} tokens · price errors ${describeErrors(basket)}`,
  );

  const limitDrift = Math.max(
    drift(rebalance.limits.low, derived.limits.low),
    drift(rebalance.limits.spot, derived.limits.spot),
    drift(rebalance.limits.high, derived.limits.high),
  );
  report.record(
    "disasters",
    limitDrift <= WEIGHT_TOLERANCE ? "pass" : "fail",
    limitDrift <= WEIGHT_TOLERANCE
      ? "rebalance limits reproduce from the rebalance library"
      : "rebalance limits do not reproduce from the rebalance library",
    `encoded high ${Number(rebalance.limits.high) / 1e18} vs derived ${Number(derived.limits.high) / 1e18}`,
  );
}

const describeErrors = (basket: RecoveredBasket): string =>
  [...new Set(basket.priceErrors.map((error) => formatPercent(error, 0)))].join(", ");
