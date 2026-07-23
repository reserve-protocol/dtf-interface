---
title: React SDK Domain
updated: 2026-07-22
type: domain
sources:
  - packages/react-sdk/src/**
---

# React SDK Domain

## Boundary

`@reserve-protocol/react-sdk` wraps core reads and prepared calls with React context, canonical TanStack Query keys, exported query options, and thin hooks. The UI owns forms, transaction submission, notifications, and route behavior.

## Shape

- `DtfSdkProvider` owns one configured core SDK; `IndexDtfProvider` optionally binds route identity.
- Query options are the reusable primitive. Query-backed hooks call `useQuery()` directly and preserve `select` and caller overrides.
- Query keys include normalized identity and parameters. Bigints and addresses must remain stable across equivalent calls.
- Freshness is explicit: live 10s, ordinary 30s, static 5m unless the source needs a documented exception.
- `useIndexDtfStatus` is the deliberate exception: a synchronous catalog lookup with no query key or options.
- `useIndexDtfPerformance` owns `select` so the canonical history cache stays raw; explicit zero price/supply values still append a live point. Account snapshots and price-history prefetch use the same canonical keys as their ordinary read hooks.

## Performance

The wrapper externalizes core SDK and peer dependencies and remains small. Keep provider configuration identity stable. Preserve-modules core packaging fixed the measured named-import leakage without changing the hook shape; do not add a hook factory or runtime registry for packaging.

## Current pressure

Index read coverage is broad. The next large maintenance split is `yield-dtf-hooks.ts`, but only when another Yield feature lands so the split follows real domains rather than speculative structure.
