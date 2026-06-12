# @reserve-protocol/react-sdk

## 0.2.0

### Minor Changes

- 63b453f: Breaking audit pass plus new vote-lock and governance helpers.

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

### Patch Changes

- Updated dependencies [63b453f]
  - @reserve-protocol/sdk@0.2.0

## 0.1.5

### Patch Changes

- Add new Ethereum and BSC Index DTF catalog entries and expose `useIndexCatalog`.

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.3

## 0.1.2

### Patch Changes

- Remove the re-exported SDK wallet client helper from the React package surface.
- Add portfolio, revenue, and rebalance query options/hooks backed by existing SDK methods.
- Move extra Index DTF query options onto shared `dtfQueryKeys` helpers.
- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.2

## 0.1.1

### Patch Changes

- Fix `wasChallenged` detection for confirmation proposals whose original optimistic description has trailing whitespace. `getChallengeDescription` no longer trims the extracted description, so the subgraph challenge lookup matches the exact stored value instead of failing on a trailing newline/space.

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.1

## 0.1.0

### Minor Changes

- Add Index DTF proposal decoding and proposal action hooks.

  The React SDK now exposes proposal decode, voting snapshot, and proposal action call hooks, and the provider accepts an Etherscan API key for ABI enrichment.

### Patch Changes

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.0

## 0.0.1

### Patch Changes

- [`65463fd`](https://github.com/reserve-protocol/dtf-interface/commit/65463fd8cd36f6d6efe4157550173cc8b13bea98) Thanks [@lcamargof](https://github.com/lcamargof)! - Initial React SDK release for Index DTF apps. Provides a `DtfSdkProvider`, React Query options, hooks, and stable query keys for SDK-backed discovery, DTF reads, proposal reads, optimistic governance reads, selector registry reads, and proposal builder flows.

- [#1](https://github.com/reserve-protocol/dtf-interface/pull/1) [`1a67a57`](https://github.com/reserve-protocol/dtf-interface/commit/1a67a571363614c5e961b9c7c2e1c9f70d5ed1bc) Thanks [@akshatmittal](https://github.com/akshatmittal)! - Adopt tsdown builds, shared TypeScript config, Turborepo, and root lint, format, and release tooling.

- Updated dependencies [[`0ac1d50`](https://github.com/reserve-protocol/dtf-interface/commit/0ac1d50b162900a364f85f9ca11eb6bc375e324f), [`1a67a57`](https://github.com/reserve-protocol/dtf-interface/commit/1a67a571363614c5e961b9c7c2e1c9f70d5ed1bc)]:
  - @reserve-protocol/sdk@0.0.1
