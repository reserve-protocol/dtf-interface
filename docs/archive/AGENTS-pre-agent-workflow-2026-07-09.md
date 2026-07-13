# DTF SDK Agent Notes (pre-agent-workflow archive)

This is the verbatim pre-adoption root guidance retained for audit history. The live rules are in `docs/wiki/project.md`.

Keep code boring and product-shaped.

## Product Direction

- Prefer explicit product flow over generic SDK abstractions.
- Push back when a request adds unnecessary abstraction, compatibility, fallback behavior, or defensive ceremony.
- Do not add compatibility, input modes, fallback paths, or defensive checks unless there is a concrete product need.
- If requirements, code standards, or API shape are unclear, ask before inventing a pattern.
- Trust product invariants that are already guaranteed by the protocol/subgraph model. Do not treat every nullable schema field as a runtime possibility.

## Code Style

- Match the developer's review feedback: dumb, explicit, low-abstraction code.
- Prefer direct inline checks over tiny helpers that only hide one condition, assertion, or parameter shuffle.
- Keep action functions readable top-to-bottom. Helpers should represent real domain concepts, not hide branching or parameter plumbing.
- Avoid `...(value === undefined ? {} : { value })` noise when passing object params; use `{ value }` unless omitting the key is required for exact optional typing or serialization behavior.
- Before finishing meaningful SDK changes, do a simplicity pass. If it looks like LLM-generated framework code, rewrite it simpler.

## Data Boundaries

- Keep mappers deterministic: raw data shape conversion only. No time, fetching, decoding, or business state derivation.
- Money rule: on-chain integer amounts are always `Amount { raw: bigint, formatted: string }` via `mapAmount`. Plain `number` is reserved for display-class values: counts, timestamps, durations, percentages, rates, and subgraph BigDecimal analytics.
- Index DTF governance proposal IDs are unique. They encode the governor plus targets/calldatas and are very long decimal strings, for example `114143694312255605278636846982278574633125503103201258989783472858643695239364`. Do not add DTF membership checks around proposal IDs unless the data model changes.

## API Shape

- Ref APIs should stay flat where possible: `ref.method()`, `ref.method(id)`, or `ref.method(options)` only when options are optional filters.
- Namespace/direct APIs should use object params when they require multiple values like `{ address, chainId }`.
- Keep `index-dtf/namespace.ts` and `index-dtf/ref.ts` as composition roots. When a domain surface grows, give that domain its own `reads.ts`, `builders.ts`, `namespace.ts`, and `ref.ts`, then spread the domain factory into the flat root API.
- Do not add a generic binder abstraction for namespace/ref composition; explicit domain factories are easier to rewrite.

## Validation

- Do not run build/typecheck/test after simple mechanical edits unless requested.
- Run validation for complex, risky, or behavior-changing SDK work, and when explicitly requested.
- Do not remove SDK tests unless explicitly requested. Avoid tests that only duplicate what typecheck or build already catches.

## Releases

- When preparing a new package release, use Changesets. Do not manually edit package versions or changelogs.

## Feedback Loop

- Treat validated review feedback as repo style guidance for future changes.
- Push back when you disagree or when a requested change seems wrong; do not act as a yes-man.
