---
title: React SDK Domain
updated: 2026-07-09
type: domain
sources:
  - packages/react-sdk/src/**
---

# React SDK Domain

## Boundary

`@reserve-protocol/react-sdk` wraps core reads and prepared calls with React context, canonical TanStack Query keys, exported query options, and thin hooks. The UI owns forms, transaction submission, notifications, and route behavior.

## Shape

- `DtfSdkProvider` owns one configured core SDK; `IndexDtfProvider` optionally binds route identity.
- Query options are the reusable primitive. Hooks call `useQuery()` directly and preserve `select` and caller overrides.
- Query keys include normalized identity and parameters. Bigints and addresses must remain stable across equivalent calls.
- Freshness is explicit: live 10s, ordinary 30s, static 5m unless the source needs a documented exception.

## Performance

The wrapper externalizes core SDK and peer dependencies and remains small. Keep provider configuration identity stable. Preserve-modules core packaging fixed the measured named-import leakage without changing the hook shape; do not add a hook factory or runtime registry for packaging.

## Current pressure

Index read coverage is broad. The next large maintenance split is `yield-dtf-hooks.ts`, but only when another Yield feature lands so the split follows real domains rather than speculative structure.
