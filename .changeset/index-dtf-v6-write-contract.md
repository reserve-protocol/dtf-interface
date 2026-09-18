---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Index DTF: every Folio write builder takes `version`.

- `prepareIndexDtfBid`, `prepareIndexDtfCloseAuction`, `prepareIndexDtfEndRebalance`, `prepareIndexDtfOpenAuctionUnrestricted` and `prepareIndexDtfDistributeFees` now require `version` (`"5.0.0"` | `"6.0.0"`) and reject anything else with `SdkError(INVALID_INPUT)`. Their calldata is byte-identical across both versions; the ABI attached to the call follows the version.
- Breaking for ref callers: `dtf.prepareEndRebalance()` and `dtf.prepareDistributeFees()` now take `{ version }`. Read it with `sdk.index.getVersion` / `useIndexDtfVersion`.
- These five builders now return `IndexDtfCall` (`contract.abi` is `Abi`, `contract.functionName` is `string`, `contract.args` is `readonly unknown[]`); call sites that relied on the narrower inferred type must widen.
- New `getIndexDtfRebalanceNonce` (`sdk.index.getRebalanceNonce`, `ref.getRebalanceNonce`, `useIndexDtfRebalanceNonce`) reads Folio 6.0's `getRebalanceNonce()`.
