---
"@reserve-protocol/dtf-catalog": patch
"@reserve-protocol/sdk": patch
---

Ship CommonJS builds alongside ESM for the catalog and the SDK so Node CJS backends (reserve-api) can import them directly instead of through dynamic-import workarounds. ESM consumers are unaffected.
