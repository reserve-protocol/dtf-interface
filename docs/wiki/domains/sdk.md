---
title: Core SDK Domain
updated: 2026-07-14
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
- Mappers convert raw source shapes only. Business state, time, and network calls remain outside mappers.

## Invariants

- On-chain integer amounts are `Amount`; display-class values may be numbers.
- Proposal vote success is OZ strict majority: a for/against tie is DEFEATED. Subgraph proposal state lags time-based transitions, so list/detail state surfaces derive from votes, quorum, and deadline instead of returning the raw field.
- Index proposal IDs are globally unique and do not need DTF-membership checks.
- Public call builders require exact calldata and value assertions when changed.
- GraphQL document changes must regenerate and diff committed generated outputs.

## Current pressure

Register adoption lags the published SDK. Add new core reads only when a concrete consumer cannot be migrated with the existing namespace. The full/current DTF route fields and rebalance-health boundary are implemented; current pressure is consuming them in Register and filling the consumption-driven Yield gaps in `docs/SDK_AUDIT_2026-07-09.md`.

The package preserves internal modules while retaining one ergonomic root API. A consumer price reader is 15.41 kB minified/5.12 kB gzip and excludes Zod, rebalance-lib, and Decimal; `check:sdk-bundle` protects that boundary.
