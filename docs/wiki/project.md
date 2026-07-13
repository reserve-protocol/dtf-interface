---
title: Project
updated: 2026-07-09
type: context
---

# DTF SDK

## Product

TypeScript monorepo for Reserve's public DTF ecosystem libraries. `@reserve-protocol/sdk` is the environment-agnostic product API; `@reserve-protocol/react-sdk` adds React Query hooks and providers; `@reserve-protocol/dtf-catalog` is curated data. Register is the primary consumer, but Node services, bots, and third-party apps are first-class consumers. The direction is to move protocol and product logic out of Register so its UI selects data, invokes SDK operations, and renders results.

Start with `docs/README.md`, then `docs/sdk/architecture.md` and `docs/sdk/api-surface.md`. Register behavior is documented under `docs/register/`; pending work lives under `docs/plans/` and is not canonical behavior.

## Stack Specifics

- pnpm/Turbo monorepo on Node 24; TypeScript 6, viem, Zod, GraphQL Codegen, Vitest, React 18/19, TanStack Query 5, tsdown, and Vocs.
- Normal closeout commands are owned by `llm-workflow.config.json`. `pnpm release:ci` is the publication check and additionally dry-runs package tarballs.
- Generated GraphQL documents are committed. Run `pnpm graphql:codegen` after GraphQL document or codegen changes.
- Releases use Changesets. Never edit package versions or changelogs by hand.

## Safety Rules

- Keep mappers deterministic: raw shape conversion only. No time, fetching, decoding, or business-state derivation.
- Every on-chain integer amount is `Amount { raw: bigint, formatted: string }` via `mapAmount`. Plain numbers are only display-class values: counts, timestamps, durations, percentages, rates, and subgraph BigDecimal analytics.
- Trust protocol/subgraph invariants already guaranteed by the data model. Do not add nullable/fallback behavior without a real product case.
- Index DTF proposal IDs are globally unique, long decimal identifiers encoding governor plus proposal calls. Do not add DTF-membership checks around them.
- Calldata builders, amount/decimal conversions, public API contracts, transport validation, governance, issuance, staking, auctions, and release configuration require human review in the handoff.

## API Shape

- Prefer explicit product flows over generic SDK abstractions. No compatibility shims or alternate input modes without a concrete consumer.
- Ref methods stay flat: `ref.method()`, `ref.method(id)`, or `ref.method(options)` only for optional filters. Namespace methods with multiple required values take one object.
- `index-dtf/namespace.ts` and `index-dtf/ref.ts` are composition roots. A growing domain gets explicit `reads.ts`, `builders.ts`, `namespace.ts`, and `ref.ts` factories spread into the flat API; never add a generic binder.
- Actions should read top-to-bottom. Inline a one-off condition instead of hiding it in a tiny helper. Helpers name domain concepts, not parameter plumbing.
- Before meaningful SDK closeout, perform a simplicity pass and remove framework-shaped or defensive ceremony.
- If requirements, code standards, or public API shape are unclear, ask before inventing a pattern.
- Pass optional object values directly (`{ value }`) unless omitting the key is required for exact optional typing or serialization; avoid conditional-spread plumbing noise.

## Validation

- Do not run broad build/typecheck/test after a trivial mechanical edit. Behavior changes and risky SDK work get the checks mapped by `scope.mjs`; release work gets `pnpm release:ci`.
- Do not remove SDK tests unless explicitly requested. Tests must catch behavior, especially exact calldata, boundary failures, mappers, and query semantics—not duplicate the compiler.

## Overrides

- Existing package tests are colocated as `*.test.ts(x)` beside source. This repo convention overrides the kit's generic dedicated-`tests/` rule; do not churn test locations without a product reason.
- Repo validation is risk-scaled as described above; this overrides any reading of the generic workflow that broad checks are required after simple mechanical edits.

## Active Risks

- Register can lag the published SDK version; confirm its installed package before planning an integration against current source.
- Root `docs/IMPROVEMENT_PLAN.mdx` is a historical execution log. Use `docs/SDK_AUDIT_2026-07-09.md` for the current audit and integration order.
- Live-smoke suites require explicit environment flags and network access; normal tests do not prove live RPC/subgraph/API health.
