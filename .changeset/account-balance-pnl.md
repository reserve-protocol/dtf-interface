---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Account-balance snapshot primitives: `getIndexDtfAccountBalanceSnapshot` (carry-forward daily balance at a mark) on the namespace and bound ref, with `selectPriceAtMark(points, mark?)` selecting the latest positive timestamped price at or before an optional mark while preserving its one-argument behavior. The read is exposed through `useIndexDtfAccountBalanceSnapshot`, plus `usePrefetchIndexDtfPriceHistory` lets apps warm sibling price-history windows without touching the SDK client. Product metrics (e.g. a week-ago PnL) compose these app-side — the SDK deliberately ships no PnL semantics.
