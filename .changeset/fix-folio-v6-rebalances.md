---
"@reserve-protocol/sdk": patch
"@reserve-protocol/react-sdk": patch
---

Generate and export the Folio v6, FolioDeployer v6, and FolioVersionRegistry ABIs from pinned `reserve-index-dtf` artifacts, and encode v6 basket proposals with the expected rebalance nonce and required execution deadline. V6 fee-recipient calls now require both mutable and immutable recipient tables; higher-level revenue proposals reject v6 until they can preserve the immutable table.
