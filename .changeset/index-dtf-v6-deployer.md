---
"@reserve-protocol/sdk": minor
---

Index DTF: Folio 6.0 deployments.

- `prepareIndexDtfDeploy`, `prepareIndexDtfDeployGoverned` and their plans take `version`. `"5.0.0"` keeps the registered per-chain deployer and the existing shapes. `"6.0.0"` requires an explicit `deployer` (no public v6 `FolioDeployer` is registered yet), v6 additional details (`maxAuctionLength`, `feeRecipients`, `immutableFeeRecipients`, `tvlFee`, `mintFee`, `selfFee`, `mandate`) and, for governed deploys, one optimistic `governance` table instead of owner/trading pairs.
- `prepareIndexDtfDeployAssetApproval(s)` accept `deployer` so approvals can target the v6 deployer; plans pass it through automatically. `getIndexDtfDeployerAddress` resolves the target for `{ chainId, version }` (v5) or `{ chainId, version, deployer }` (v6). Both deploy builders now return `IndexDtfCall`, so `call.contract` is typed against the generic `Abi`.
