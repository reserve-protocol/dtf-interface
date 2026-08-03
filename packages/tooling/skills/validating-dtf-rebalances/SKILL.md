---
name: validating-dtf-rebalances
description: Use when asked to review, validate, or sanity-check an Index DTF rebalance governance proposal (an app.reserve.org `.../governance/proposal/<id>` link), before voting on or executing one.
---

# Validating DTF rebalances

A rebalance proposal encodes weights, price ranges and auction timing as calldata.
Two kinds of thing go wrong, and they are not equally bad:

- **Disasters** — the calldata moves real value into the wrong place: a mispriced
  asset, wrong decimals, a scam or look-alike token address, the wrong governor.
  These block the proposal.
- **Execution** — the trade is correct but fills badly: thin liquidity, high price
  impact, an auction nobody opens. These need preparation, not a veto.

Run the disaster pass first and do not weigh execution findings against it.

## Steps

1. Run the checker on the proposal URL:

   ```bash
   pnpm --filter @reserve-protocol/tooling validate:rebalance "<proposal url>"
   ```

   Done when it prints a verdict line. Exit code 1 means a disaster check failed;
   0 with warnings means execution risks only.

2. Resolve every `FAIL`. A failure is a claim about the calldata, so answer it
   with the calldata: read the check's detail line, then confirm against an
   explorer or an independent price source. Done when each failure is either a
   fixed proposal or a written explanation of why the check is wrong here.

3. Take each `WARN` to the person who owns it. Done when each warning has a
   named owner and an answer:
   - trade above $10,000, price impact above 5%, or liquidity below $50,000 →
     the trading desk, who decides whether to buy inventory before the auction.
   - basket addition or removal → whoever owns the index mandate.
   - permissionless tail (`ttl` beyond the launcher window) → the auction
     launcher operator.

4. Answer the "still needs a human" questions the run prints. They cannot be
   checked mechanically (is the constituent universe official? is this wrapper
   canonical?), and a clean report without them is not a review. Done when each
   is answered or explicitly deferred to a named person.

5. Report the verdict as: disaster pass result, then execution flags with owners,
   then unanswered questions. Never report "looks good" while a question from
   step 4 is open.

## Adding a check

Add a check when a real proposal could go wrong in a way the current run would
miss, not to restate something already covered.

- Independent data only for disaster checks. The proposal was built from the
  Reserve API, so an API-vs-calldata comparison cannot detect a wrong API price;
  pool prices and third-party token listings can. New disaster checks belong in
  `src/rebalance-validation/checks/`, new outside sources in
  `src/rebalance-validation/sources/`.
- A check needs a threshold that separates "wrong model of the world" from
  "market moved". Order-of-magnitude comparisons and band-usage fractions do;
  "looks different" does not.
- Failing is for things that make the proposal wrong. Anything about execution
  quality is a warning, in the `outcomes` pass.
- Add a unit test for the pure math in `tests/`, and re-run the checker against a
  known-good historical proposal to confirm it still passes.
