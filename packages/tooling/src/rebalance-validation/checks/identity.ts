import type { ProposalContext } from "@/rebalance-validation/context";
import type { Report } from "@/rebalance-validation/report";
import type { ListedCoin } from "@/rebalance-validation/sources/token-identity";

import { symbolMatchesListing } from "@/rebalance-validation/sources/token-identity";

/**
 * Checks each basket address against an outside address→coin map. A look-alike
 * contract with the right symbol prices and trades like nothing, so identity has
 * to be established off-protocol; a symbol that maps to a different coin is the
 * loudest possible signal and fails the run.
 */
export function checkTokenIdentity(
  report: Report,
  context: ProposalContext,
  listed: ReadonlyMap<string, ListedCoin>,
): void {
  const mismatched: string[] = [];
  const unlisted: string[] = [];

  for (const token of context.tokens) {
    const coin = listed.get(token.address.toLowerCase());
    if (!coin) {
      unlisted.push(`${token.symbol} ${token.address}`);
    } else if (!symbolMatchesListing(token.symbol, coin.symbol)) {
      mismatched.push(`${token.symbol} ${token.address} is listed as ${coin.symbol} (${coin.id})`);
    }
  }

  report.record(
    "disasters",
    mismatched.length === 0 ? "pass" : "fail",
    mismatched.length === 0
      ? "every listed basket address matches its symbol on an independent source"
      : "basket address is listed under a different symbol",
    mismatched.join(" · ") || undefined,
  );
  if (unlisted.length > 0) {
    report.record(
      "disasters",
      "warn",
      "basket addresses with no independent listing — verify by hand",
      unlisted.join(" · "),
    );
  }
}
