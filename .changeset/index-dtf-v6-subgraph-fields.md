---
"@reserve-protocol/sdk": minor
---

Index DTF: Folio 6.0 fields from the subgraph. `IndexDtf` gains `version`, `rebalance.maxAuctionLength`, `rebalance.tradeAllowlist`, `fees.immutableRecipients` and `fees.selfFee` (empty or zero before 6.0), and `getIndexDtfRevenue` folds the immutable table and the holders' share into `effectiveDistribution` (`holders.percentage`). Requires the index subgraph 1.11.0 schema on the configured endpoint.
