---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Index DTF: Folio 6.0 fields from the subgraph. `IndexDtf` gains `version`, `rebalance.maxAuctionLength`, `rebalance.tradeAllowlist`, `fees.immutableRecipients`, `fees.selfFee` and `financials.selfRevenue` (absent, empty or zero before 6.0 and for grafted DTFs whose fields are null), and `getIndexDtfRevenue` folds the immutable table and the holders' share into `effectiveDistribution` (`holders.percentage`): the DAO fee comes off first, the self fee keeps its share of the rest for holders, and the mutable and immutable tables split what is left (DAO 50%, self fee 25%, tables 60/40 → mutable 22.5%, immutable 15%, holders 12.5%). `financials.totalRevenue` is protocol + governance + external + self; the React SDK's flat `IndexDtfData` gains `selfRevenue` too.

Rollout blocker: these queries need the index subgraph 1.11.1 schema. Against a 1.10.2 endpoint every Index DTF query fails, so this release must not be published (or Register pointed at it) before the configured `prod` endpoint serves 1.11.1. `graphql:codegen:check` keeps checking `prod` by default and fails until then; `INDEX_DTF_SUBGRAPH_SCHEMA=<.../dtf-index-base/1.11.1-test/gn>` checks the candidate.
