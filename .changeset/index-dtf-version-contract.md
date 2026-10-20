---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Index DTF rebalance: explicit version contract and protocol-accurate auction state.

- `prepareIndexDtfOpenAuctionArgs`, `prepareIndexDtfOpenAuction` and `buildIndexDtfStartRebalanceArgs` now require `version` (`"5.0.0"` | `"6.0.0"`) and reject anything else with `SdkError(INVALID_INPUT)`; there is no silent v5 default. `buildIndexDtfStartRebalance` reads the proxy version when none is passed and applies the same check.
- v6 open-auction math takes `auctionLength` and carries it into the args; `prepareIndexDtfOpenAuction` uses it when no explicit length is passed.
- `getLatestAuction` / `getActiveAuction` resolve one block first and pin every read to it, report `currentRebalanceNonce` and `blockNumber`, and treat an auction as active only while `startTime <= now <= endTime` (inclusive, as Folio checks) and its nonce matches the current rebalance.
- Open-auction inputs reject zero, negative or non-finite prices before the rebalance library runs.
