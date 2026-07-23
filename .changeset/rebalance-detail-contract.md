---
"@reserve-protocol/sdk": minor
---

Breaking: `ReserveApiIndexDtfRebalanceDetail.auctions` is now required (`[]` when no auctions ran); a truly-absent field is treated as a malformed response and fails loud. Completed-rebalance detail reads now work end-to-end: the single-element-array envelope from `/dtf/rebalance` is normalized inside the client (`RECORD_NOT_FOUND` on empty), and `IndexDtfCompletedRebalanceDetail` carries the analytics fields the detail surface renders (avgPriceImpactPercent, totalPriceImpactUsd, marketCapRebalanceImpact, tracking/native basket deviation).
