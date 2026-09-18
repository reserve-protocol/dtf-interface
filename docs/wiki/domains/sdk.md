---
title: Core SDK Domain
updated: 2026-09-18
type: domain
sources:
  - packages/sdk/src/**
---

# Core SDK Domain

## Boundary

`@reserve-protocol/sdk` owns deterministic source reads, domain mapping, and prepared contract calls for Index and Yield DTFs. It does not connect wallets, submit transactions, show notifications, or own application route state.

## Shape

- `createDtfSdk()` composes flat Index, Yield, and portfolio namespaces.
- DTF refs bind stable address/chain identity and expose the same product operations without a generic binder.
- RPC, subgraph, Reserve API, explorer, and catalog boundaries stay visible in their domain modules.
- Single-DTF status is a synchronous, validated catalog lookup; bulk `getStatuses` stays Reserve API-backed for list screens. They are related product views, not aliases.
- Mappers convert raw source shapes only. Business state, time, and network calls remain outside mappers.
- Cross-DTF governance reads (`getProposalFeed`, `getTopVoters`, `getGovernanceActivity`, `getVoteLockTotals`, `getVoteLockLifetimeTotals` on Index; the first three plus `getProtocolStakingTotals` on Yield) fan one subgraph document out per chain, merge, sort newest-first, and slice. Feeds take a creation-time window (`since`/`until`; `since` defaults to the last 60 days, so an all-time pull is opt-in) plus `chainIds`/`limit`; feed `limit` caps each chain, voter and activity `limit` caps the merged result. Skip walks dedupe by `id` because a row landing mid-walk shifts offsets. `lib/subgraph-pages.ts` pages time-ordered windows by `first`/`skip` and walks whole entities by `id` cursor; a walk past 10k rows throws `LIMIT_EXCEEDED` instead of returning a partial sum (graph-node answers deep `skip` with empty data, silently).

## Invariants

- On-chain integer amounts are `Amount`; display-class values may be numbers. Vote weights, quorum, and veto thresholds are denominated in the vote-lock share token, whose decimals the proposal documents carry (Base has six-decimal vaults).
- Proposal vote success is OZ strict majority for both products: a for/against tie is DEFEATED. Subgraph proposal state lags time-based transitions, so proposal-state surfaces derive from votes, quorum, and deadline instead of returning the raw field — except Yield proposal detail, which reads authoritative governor state (last bullet).
- Index DTF proposal IDs are globally unique and do not need DTF-membership checks.
- Governance→DTF attribution (`governance/governed-dtfs.ts`) is the reverse index of `getDtfProposalGovernanceIds` over every DTF on a chain, memoized per client and chain for 60s so reads mounting together share one walk: owner, trading, and vault governances, current or legacy, each map to the DTFs that name them. Resolving from the vault's current DTF list broke after vault migrations (old MAG7 vault on Base lists no DTFs). Vault-scoped rows (top voters, totals, stake records) still use the vault's current DTFs. Vaults without an indexed `underlying` are skipped, never invented.
- Activity feeds fetch each lifecycle transition ordered by its own timestamp (aliased root fields in one document), so an old proposal executed today still surfaces. Index vault rows skip zero-share records (a withdrawal to another receiver writes a bookkeeping row on the receiver). Yield staking rows come from `Entry` rows of type STAKE/UNSTAKE; `AccountStakeRecord` is also written for stRSR transfers and for the zero address. The Index subgraph records the caller for queue, execute, and governor cancels but not guardian cancels (they run through the timelock), so that row carries the timelock address. Yield lifecycle rows carry only the proposer because that subgraph indexes no lifecycle callers.
- Standard proposal voting power uses the exact `voteStart` snapshot, including checkpoints written at that timepoint; only current/future snapshots clamp to `clock - 1`.
- Public call builders require exact calldata and value assertions when changed. Folio v6 basket proposals require at least two tokens, read and increment the current rebalance nonce, and require an explicit execution deadline; v5 remains the four-argument call. V6 fee-recipient writes must preserve the full immutable table. Every Folio write builder (`prepareIndexDtfBid`, `CloseAuction`, `EndRebalance`, `OpenAuctionUnrestricted`, `DistributeFees`, open auction, start rebalance, settings calls) takes `version` and selects its ABI through `index-dtf/write-version.ts` (`assertIndexDtfWriteVersion` / `getIndexDtfWriteAbi`); calls whose shape is identical across v5/v6 are pinned byte-equal in tests. v6-only reads live in `dtf/folio-v6.ts` (`getIndexDtfMaxAuctionLength`, `getIndexDtfRebalanceNonce`, `getIndexDtfSelfFee`, `getIndexDtfImmutableFeeRecipients`, `getIndexDtfTradeAllowlist`, `getIndexDtfIsTokenAllowlisted`), take no version and fail on a v5 proxy; gate them on `getVersion`. The immutable-table read pins one block (`getBlockNumber({ cacheTime: 0 })`), probes `folioFeeForSelf` first, reads the 64-slot array getter in one unchunked multicall and confirms the boundary index reverts as a contract call before trusting a short table. `version-registry.ts` reads `FolioVersionRegistry` (`INDEX_DTF_VERSION_REGISTRY_ADDRESS`, overridable for forks). Fee tables go through `fee-recipients.ts`: sorted numerically by address, no zero/folio entries, ≤64 combined, exactly 1e18 across mutable + immutable; v6 `setFeeRecipients` and v6 deploys assert this at build time, and a v6 revenue proposal scales the mutable shares into what the immutable table leaves. Deploys are version-discriminated: v5 keeps the per-chain deployer map, v6 requires an explicit `deployer` until one is registered. `governance/propose/upgrade-v6.ts` builds the 5.0.0 → 6.0.0 spell proposal (selector swap for optimistic governors, `transferOwnership(spell)`, `cast`). `prepareIndexDtfMint`/`Redeem` take `version` too (identical v5/v6 bytes, v4 rejected). `getIndexDtfRevenue` stays subgraph-shaped: the v6 fee fields land with the subgraph release, not through RPC fallbacks.
- GraphQL-generated output must match the configured deployed schemas; ordinary CI and `release:ci` rerun codegen and reject drift.
- Account balance snapshots bind through both the namespace and DTF ref. `selectPriceAtMark(points, mark?)` requires timestamped points, never selects a future or non-positive price when a mark is provided, and preserves latest-positive selection when it is omitted.
- Yield proposal lists combine indexed vote totals with the latest chain-native timepoint, so they can be eventually consistent near `voteEnd`; proposal detail reads authoritative governor state.

Regression tests use complete decoded transaction payloads and independent economic fixtures. Distinct token targets, owner/trading settings, unequal basket shares, and request-sensitive historical reads expose wiring mistakes that equal inputs and unconditional mocks hide. Keep tests colocated and use tables for meaningful boundaries; the package README owns test authoring guidance.

## Current pressure

Register adoption lags the published SDK. Add new core reads only when a concrete consumer cannot be migrated with the existing namespace. The full/current DTF route fields and rebalance-health boundary are implemented; current pressure is consuming them in Register and filling the consumption-driven Yield gaps in `docs/SDK_AUDIT_2026-07-09.md`.

The package preserves internal modules while retaining one ergonomic root API. Folio v6, FolioDeployer v6, and FolioVersionRegistry ABIs are generated from the pinned protocol checkout; sync verifies artifact source hashes and ABI digests, while release CI verifies the checked-in digests without requiring a sibling repo. The generated Folio ABI is the single source used for v6 reads, writes, and proposal decoding; do not restore duplicate `folio-artifact` or `dtf-index-abi-v6` copies. A consumer price reader is 15.41 kB minified/5.12 kB gzip and excludes Zod, rebalance-lib, and Decimal; `check:sdk-bundle` protects that boundary.
