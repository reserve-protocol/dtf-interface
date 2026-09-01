---
"@reserve-protocol/sdk": minor
---

Remove `discoverIndexDtfsByChain` / `sdk.index.discoverByChain` and the `DiscoverIndexDtfsByChainParams` type. Its backing `/discover/dtf` endpoint is a popularity-filtered browse view that omits supported DTFs and is deprecated in reserve-api. Use `discoverIndexDtfs` (`sdk.index.discover`) with `chainId` instead.
