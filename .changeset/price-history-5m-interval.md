---
"@reserve-protocol/sdk": minor
---

`getIndexDtfPriceHistory` interval accepts `"5m"`, the granularity the API serves for the 24h range — previously the union only declared `1h | 1d` and forced a cast.
