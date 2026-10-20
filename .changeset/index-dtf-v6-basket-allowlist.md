---
"@reserve-protocol/sdk": patch
---

Index DTF: the Folio 6.0 basket proposal builder reads the trade allowlist and throws `INVALID_INPUT` (meta `tokens`) when enforcement is on and a rebalance token is missing from it, instead of building a proposal whose `startRebalance` reverts `Folio__TokenNotAllowlisted` on execution.
