---
"@reserve-protocol/sdk": patch
---

Fix the CommonJS entry: `require("@reserve-protocol/sdk")` exported `{ default: abi }` instead of the ABI array for `folioV6Abi`, `folioArtifactAbi`, `folioDeployerV6Abi`, `folioVersionRegistryAbi`, `dtfIndexAbi`, `dtfIndexAbiV1`, `dtfIndexAbiV2`, `dtfIndexAbiV4`, `dtfIndexGovernanceAbi`, `dtfIndexStakingVaultAbi` and `timelockAbi`, so encoding with them failed (`abi.filter is not a function`). ESM was unaffected. The ABI modules no longer carry a default export, and `check:package` now packs the tarball and loads it through both `import` and `require` in CI and the release gate.
