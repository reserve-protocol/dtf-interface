---
"@reserve-protocol/sdk": minor
---

Index DTF: Folio 6.0 deploys target the real 6.0.0 `FolioDeployer`.

- New `INDEX_DTF_V6_DEPLOYER_ADDRESS` per chain (mainnet `0x2B1C…7392`, Base `0x4c89…cF67`, BSC `0x9837…1963`). `"6.0.0"` deploys go there by default, whether or not the chain's `FolioVersionRegistry` has registered 6.0.0 yet; `deployer` is an optional override for fork and sandbox deployers.
- Breaking: `prepareIndexDtfDeployAssetApproval(s)` require `version` and default the spender to that version's deployer, so a 6.0.0 deploy never approves the 5.0.0 deployer by default. `deployer` still overrides the spender.
