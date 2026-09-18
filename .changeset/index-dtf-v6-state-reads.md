---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Index DTF: Folio 6.0 state reads and the version registry.

- `getIndexDtfSelfFee`, `getIndexDtfImmutableFeeRecipients` (the full table `setFeeRecipients` must receive back), `getIndexDtfTradeAllowlist` (`{ enabled, tokens }`) and `getIndexDtfIsTokenAllowlisted` read the v6 contract from RPC at one pinned block; on a v5 proxy they throw (the immutable-table read probes `folioFeeForSelf` first instead of reporting an empty table). Exposed as `sdk.index.get*`, on the DTF ref, and as `useIndexDtf*` hooks.
- `getIndexDtfLatestVersion` and `getIndexDtfVersionDeployment` read `FolioVersionRegistry` (`INDEX_DTF_VERSION_REGISTRY_ADDRESS` per chain, overridable with `registry`); `getIndexDtfVersionHash` mirrors the registry's `keccak256(abi.encodePacked(version))`. Hooks sit at the static cache tier.
