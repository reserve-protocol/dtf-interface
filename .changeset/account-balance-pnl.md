---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Account-balance snapshot primitives: `getIndexDtfAccountBalanceSnapshot` (carry-forward daily balance at a mark) with the `selectPriceAtMark` data-hygiene helper, exposed through `useIndexDtfAccountBalanceSnapshot` on the hook layer, plus `usePrefetchIndexDtfPriceHistory` so apps can warm sibling price-history windows without touching the sdk client. Product metrics (e.g. a week-ago PnL) compose these app-side — the SDK deliberately ships no PnL semantics.
