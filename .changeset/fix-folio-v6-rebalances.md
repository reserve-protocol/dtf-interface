---
"@reserve-protocol/sdk": patch
"@reserve-protocol/react-sdk": patch
---

Sync the Folio v6 ABI with `reserve-index-dtf` main and encode v6 basket proposals with the expected rebalance nonce and required execution deadline. V6 fee-recipient calls now require both mutable and immutable recipient tables; higher-level revenue proposals reject v6 until they can preserve the immutable table.
