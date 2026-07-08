---
"@reserve-protocol/dtf-catalog": patch
---

Ship a CommonJS build alongside ESM so Node CJS backends (reserve-api) can import the catalog directly instead of through dynamic-import workarounds. ESM consumers are unaffected.
