---
title: Decisions
updated: 2026-07-09
type: decision
---

# Decisions

Durable decisions with the why. One `##` per decision, newest last. Split into linked pages if this file outgrows the split rule in `skills/wiki.md`.

## 2026-07-09 — Agent workflow adopted

The repo adopted the production-tested agent-workflow kit used by Register. The radius × size profiles keep trivial work cheap while routing shared SDK and money/protocol boundaries through stronger review. Existing DTF SDK rules remain authoritative in [[project]]; kit-owned skills and scripts update from the workflow repository, while project context and verification mapping remain local.

## 2026-07-09 — Keep one ergonomic React API

The React wrapper itself is small, and explicit hooks/query options remain the right product API. Keep root exports and do not add a hook factory or runtime registry. Packaging may still use multiple generated entries or a read-only subpath to prevent unrelated core modules from entering consumer bundles; see the later bundle decision.

## 2026-07-09 — Migrate consumers before expanding abstractions

Register's main gap is its 0.2.0 dependency and duplicated data paths, not a missing generic SDK layer. Release and migrate coherent product flows first. Add the five identified Yield reads only when their Register consumer is ready, with namespace/ref, query, fixture, and live-boundary evidence together.

## 2026-07-09 — Bundle debt is in core packaging

A consumer module trace showed that a direct price read retains unrelated Zod schema construction and rebalance-library code. Viem is not the dominant cause, and the React hook wrapper is small. Keep the ergonomic root API, add a consumer bundle budget, and test multi-entry or preserve-modules output; a packaging-only read entry is acceptable if unrelated modules cannot otherwise be eliminated.

## 2026-07-09 — Current DTF is the route aggregate

Platform fee and status belong on the full/current DTF route model so Register does not mount one updater per field. Focused hooks remain for consumers that only need one value. Status must reuse batch/discovery data rather than scan paginated discovery per DTF. Rebalance health calculations and the Reserve API liquidity boundary belong in the SDK; interaction timing, retry UI, warnings, and Zapper support checks stay in Register.

## 2026-07-09 — Preserve modules, keep the root API

Preserve-modules output reduced a direct price-reader bundle from 538.08 kB to 15.41 kB without adding public subpaths or changing imports. The consumer bundle gate asserts that price reads stay below budget and do not retain Zod, rebalance-lib, or Decimal. Viem remains expected address/encoding weight.
