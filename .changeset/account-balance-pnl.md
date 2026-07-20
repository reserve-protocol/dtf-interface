---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Account balance PnL reads: `getIndexDtfAccountBalanceSnapshot` (carry-forward daily balance snapshot at a mark) plus the pure `selectPriceAtMark`/`calculateAccountBalancePnl` helpers, and `useAccountBalancePnl({ account, dtf, chainId, period })` composing snapshot × price-at-mark against the current position value. `pnl: null` means hide (not holding at the mark or an input unavailable) — never a fabricated figure.
