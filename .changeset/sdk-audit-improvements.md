---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Breaking audit pass plus new vote-lock and governance helpers.

Breaking:

- Removed `getFull`, `getFullIndexDtf`, `GetFullIndexDtfParams`, `GetFullIndexDtfOptions`, `fullIndexDtfQueryOptions`, and `useFullIndexDtf`. Use `get` / `getIndexDtf` / `indexDtfQueryOptions` / `useIndexDtf` — they were the same function.
- `getTransactions` no longer accepts `dtfPriceUsd` and no longer returns `amountUsd`. Multiply `amount.formatted` by a price from `getPrice` if a USD value is needed.
- Removed `dedupeAddresses`; use `uniqueAddresses` (case-insensitive, returns checksummed addresses).
- Removed the unused `dtfQueryKeys.index.dtf` key.

New:

- All contract ABIs are exported from the sdk root (timelock, optimistic timelock, selector registry, unstaking manager, deployers, DAO fee registry, proposal ABI catalog and decoder set, v1/v2/v4 index ABIs, `folioArtifactAbi`).
- `getVoteLockState` no longer fails when the price API is down; `underlyingPrice` is simply omitted. Prices are fetched in parallel with the on-chain reads.
- `getVoteLockVaultState({ stToken, chainId, account })` reads vote-lock drawer state straight from a staking vault without a DTF subgraph lookup, plus `useIndexDtfVoteLockVaultState` and `indexDtfVoteLockVaultStateQueryOptions`.
- `mergeIndexDtfProposalVotingSnapshot(proposal, snapshot)` overlays a fresher voting snapshot onto a proposal detail (root export).
- react-sdk queries now have staleTime defaults: 10s live data (prices, auctions, issuance), 30s governance/account state, 5min static metadata. Override per query; constants exported as `LIVE_STALE_TIME`, `DEFAULT_STALE_TIME`, `STATIC_STALE_TIME`.
- Type-safe calldata encoding in `prepareContractCall` (no more `as never`), with exact-encoding regression tests.
