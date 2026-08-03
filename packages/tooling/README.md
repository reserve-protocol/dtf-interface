# @reserve-protocol/tooling

Operational tooling for reviewing protocol activity, built on `@reserve-protocol/sdk`
and `@reserve-protocol/dtf-catalog`. Private to the workspace — scripts and agent
skills, not a published surface.

## Rebalance validation

```bash
pnpm --filter @reserve-protocol/tooling validate:rebalance \
  "https://app.reserve.org/bsc/index-dtf/cmc20/governance/proposal/<id>"
```

Exits 1 when a disaster check fails, 0 otherwise. The agent-facing procedure —
how to triage the output and who owns each warning — is
[`skills/validating-dtf-rebalances/SKILL.md`](./skills/validating-dtf-rebalances/SKILL.md).

### What it checks

Pass one, "preventing disasters" (blocking):

| Check                                                                                                    | Catches                                                                                |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| single `startRebalance` on the DTF, routed through the governor whose timelock holds `REBALANCE_MANAGER` | a proposal that passes and then reverts, or a rebalance smuggled in with other actions |
| calldata re-derived through `@reserve-protocol/dtf-rebalance-lib` (via the SDK)                          | hand-edited weights, price ranges or rebalance limits                                  |
| every held asset present in the calldata; additions and zero-weight exits surfaced                       | assets stranded outside the rebalance                                                  |
| encoded price vs the deepest-pool price, per asset                                                       | wrong decimals, a stale or wrong API price, the wrong token                            |
| proposed basket shares re-valued at pool prices                                                          | value shifted into the wrong place while each price still looks plausible              |
| per-share units vs the last executed rebalance                                                           | order-of-magnitude weight jumps                                                        |
| basket addresses against a third-party address→coin map                                                  | look-alike and scam addresses                                                          |

Pass two, "optimizing outcomes" (informational): auction launcher window vs TTL
and the resulting permissionless tail, turnover as a share of AUM, legs above
$10,000, constituents with less than $50,000 of pooled liquidity, and price
impact per leg from the production `POST /rebalance/liquidity` route.

Prices and token identity in pass one come from sources outside Reserve
(DEXScreener, CoinGecko) on purpose: the proposal was built from the Reserve API,
so only an independent mark can catch that API being wrong.

### Encoding notes

`weight.spot` is `D27{tok/share}` — per _share_, so whole tokens per whole share is
`spot / 1e27 * 1e18 / 10**decimals`. `price` is `D27{nanoUSD/tok}` with
`low = p*(1-e)`, `high = p/(1-e)`, so the asset price is `sqrt(low*high)` and the
price-error preset is `1 - low/price`. `maxAuctionSize` is encoded in `{tok}`, not
USD. `limits.high` is `1/(1-basketError)` for TRACKING DTFs and `1e18` for NATIVE.
