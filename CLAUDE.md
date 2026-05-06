# DTF SDK Coding Notes

Keep code boring and product-shaped.

- Prefer explicit product flow over generic SDK abstractions.
- Do not add compatibility, input modes, fallback paths, or defensive checks unless there is a concrete product need.
- If a requirement seems wrong, push back before implementing it.
- If code standards or preferred API shape are unclear, ask before inventing a pattern.
- Keep action functions readable top-to-bottom. Helpers should represent real domain concepts, not hide branching or parameter plumbing.
- Keep mappers deterministic: raw data shape conversion only. No time, fetching, decoding, or business state derivation.
- Trust product invariants that are already guaranteed by the protocol/subgraph model. Do not treat every nullable schema field as a runtime possibility.
- Index DTF governance proposal IDs are unique. They encode the governor plus targets/calldatas and are very long decimal strings, for example `114143694312255605278636846982278574633125503103201258989783472858643695239364`. Do not add DTF membership checks around proposal IDs unless the data model changes.
- Ref APIs should stay flat where possible: `ref.method()`, `ref.method(id)`, or `ref.method(options)` only when options are optional filters.
- Namespace/direct APIs should use object params when they require multiple values like `{ address, chainId }`.
- Before finishing meaningful SDK changes, do a simplicity pass: if it looks like LLM-generated framework code, rewrite it simpler.
