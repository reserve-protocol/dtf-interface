---
"@reserve-protocol/react-sdk": minor
---

`useIndexDtfPerformance` — price history composed for display: deduped by timestamp, with a live point appended when `currentPrice` + `currentTotalSupply` are provided (marketCap derived). The cache entry stays the raw point array under the canonical price-history key; composition happens after the cache, so other consumers of the key keep the raw contract.
