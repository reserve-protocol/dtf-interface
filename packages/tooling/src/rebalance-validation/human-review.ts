/**
 * Questions no data source can settle. They are printed on every run so a clean
 * report is never mistaken for a complete review.
 */
export const HUMAN_REVIEW_QUESTIONS: readonly string[] = [
  "Is the constituent list the mandate's official universe, or was it assembled by hand? Any large-cap name missing needs a reason.",
  "For each added token: is this the canonical representation on this chain, or a bridged/synthetic wrapper with its own risk?",
  "Are the maxAuctionSize values sized for these trades, or a leftover flat default?",
  "Should the trading bot hold inventory for the flagged legs before the auction opens?",
  "Is the permissionless tail (ttl beyond the launcher window) intended for this DTF?",
];
