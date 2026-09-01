---
"@reserve-protocol/sdk": patch
---

Deprecate `discoverIndexDtfsByChain` / `sdk.index.discoverByChain`: the backing `/discover/dtf` endpoint is a popularity-filtered browse view that omits supported DTFs and is slated for removal. Use `discoverIndexDtfs` (`sdk.index.discover`) and filter by `chainId`/`status`.
