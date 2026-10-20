---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Index DTF: Folio 6.0 fields from the subgraph.

- `IndexDtf` gains `version`, `rebalance.maxAuctionLength`, `rebalance.tradeAllowlist`, `fees.immutableRecipients`, `fees.selfFee` and `financials.selfRevenue` (absent, empty or zero before 6.0 and for grafted DTFs whose fields are null; `tradeAllowlist` is left out unless both the flag and the token list are indexed). `financials.totalRevenue` is protocol + governance + external + self; revenue fields are raw 18-decimal share amounts. The React SDK's flat `IndexDtfData` gains `selfRevenue`.
- `getIndexDtfRevenue` folds the immutable table and the holders' share into `effectiveDistribution` (`holders.percentage`) in the order Folio pays: the DAO fee first, the self fee keeps its share of the rest for holders, and the mutable and immutable tables split what is left (DAO 50%, self fee 25%, tables 60/40 → mutable 22.5%, immutable 15%, holders 12.5%). With both tables empty the DAO gets the recipients' pool, as `distributeFees` does.
- Breaking: `getIndexDtfEffectiveRevenueDistribution(fees, platformFee)` takes `{ recipients, immutableRecipients, selfFee }` instead of the recipients array.
- Breaking for code that builds these objects by hand: `Fees` requires `immutableRecipients` and `selfFee`, `Financials` requires `selfRevenue`, and `IndexDtfRevenueDistribution` requires `holders`.

Rollout blocker: `GetIndexDTF` now needs the index subgraph 1.11.1 schema. Against a 1.10.2 endpoint every Index DTF query fails, so this release must not be published (or Register pointed at it) before all three `prod` endpoints (mainnet, Base, BSC) serve 1.11.1. `release:ci` enforces it: `graphql:codegen:check` keeps checking Base `prod` by default (`INDEX_DTF_SUBGRAPH_SCHEMA=<.../dtf-index-base/1.11.1-test/gn>` checks the candidate), and the new `check:subgraph-endpoints` validates the shipped documents against every configured endpoint.
