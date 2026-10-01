---
"@reserve-protocol/dtf-catalog": minor
"@reserve-protocol/sdk": patch
---

Fix `require("@reserve-protocol/sdk").dtfCatalog`: the CommonJS entry re-exported the catalog's module namespace (`{ default, indexDtfs, ... }`) instead of the chain-keyed catalog, because the bundler's interop for a re-exported default hands out `module.exports`. The catalog now also exports the combined catalog by name (`dtfCatalog`, same object as the default export), and the SDK re-exports that. `check:package` now compares every export's value between the ESM and CommonJS entries, not just its kind.
