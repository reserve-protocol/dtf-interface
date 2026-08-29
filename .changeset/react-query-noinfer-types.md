---
"@reserve-protocol/react-sdk": patch
---

Build against `@tanstack/react-query` >=5.102 so published hook types no longer reference the removed `NoInfer` re-export. Consumers on react-query >=5.101 previously saw every hook's `data` collapse to `any`.
