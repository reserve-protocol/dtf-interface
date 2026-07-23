---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Breaking: `getIndexDtfStatus` is now a synchronous catalog lookup — `getIndexDtfStatus({ address, chainId }): DtfStatus` validates the address and reads `@reserve-protocol/dtf-catalog` directly (case-insensitive address match, absent entries are `active`) instead of scanning the `/discover/dtfs` endpoint. The plural `getIndexDtfStatuses` remains an asynchronous Reserve API discovery projection for bulk/list screens. `useIndexDtfStatus({ address, chainId })` returns the singular status directly with no react-query involved; `indexDtfStatusQueryOptions` and the `dtfQueryKeys.index.status` key are removed.
