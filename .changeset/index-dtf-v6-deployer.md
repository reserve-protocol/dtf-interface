---
"@reserve-protocol/sdk": minor
---

Index DTF: Folio 6.0 deployments.

- `prepareIndexDtfDeploy`, `prepareIndexDtfDeployGoverned` and their plans take `version`. `"5.0.0"` keeps the registered per-chain deployer and the existing shapes. `"6.0.0"` deploys through `INDEX_DTF_V6_DEPLOYER_ADDRESS` and takes v6 additional details (`maxAuctionLength`, `feeRecipients`, `immutableFeeRecipients`, `tvlFee`, `mintFee`, `selfFee`, `mandate`) and, for governed deploys, one optimistic `governance` table instead of owner/trading pairs.
- Deploy plans approve the deployer they resolved. `getIndexDtfDeployerAddress` resolves the target for `{ chainId, version, deployer? }`. Both deploy builders now return `IndexDtfCall`, so `call.contract` is typed against the generic `Abi`.
