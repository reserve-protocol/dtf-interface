---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Index DTF: Folio 6.0 ABIs re-synced to the deployed 6.0.0 (`reserve-index-dtf@7d97c80`, identical to the explorer-verified implementation on mainnet, Base and BSC).

- Breaking for 6.0.0: `prepareIndexDtfEndRebalance` / `ref.prepareEndRebalance` require `rebalanceNonce` and encode `endRebalance(uint256)`; the previous nonce-less call reverted on every real 6.0.0 Folio. 5.0.0 still encodes `endRebalance()`. New `PrepareIndexDtfEndRebalanceParams` type.
- `folioV6Abi` / `folioArtifactAbi` now carry `endRebalance(uint256 rebalanceNonce)`. A unit test compares the generated Folio and FolioDeployer ABIs item for item with the Base Blockscout verified ABIs, so drift from the deployed contracts fails CI.
