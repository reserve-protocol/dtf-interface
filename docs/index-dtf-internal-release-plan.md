# Index DTF Internal SDK Release Plan

This is the execution plan for the first internal Index DTF SDK release.

## Assumptions

- Index subgraph `v1.9.1` will be tagged to `prod` on Mainnet, Base, and BSC with optimistic governance fields mapped correctly.
- Register is the only product source of truth for this pass, starting with governance/optimistic governance flows.
- Ignore other local apps when making SDK product-shape decisions.
- This is an internal release. Broad exports and noisy surfaces are acceptable until Register integration proves what should be hidden.
- Do not remove Index DTF functionality just because it is not polished yet.
- Keep `getProposal` able to decode calldatas. It stays DTF-bound for now because decode context must be unambiguous. Only move to `{ chainId, proposalId }` after the subgraph exposes a direct proposal-to-DTF context.
- Keep `IndexDtf` broad for now. One subgraph call returning extra product-shaped data is fine.
- Remove the generic Register parity test; Register-specific concerns should live in product integration tests.

## Stages

1. Wait for `v1.9.1` indexing/prod tags, then point SDK codegen at the prod schema or a checked-in v1.9.1 schema and regenerate types.
2. Inspect Register governance/discovery flows before changing API behavior.
3. Keep proposal detail DTF-bound for this internal release: `{ address, chainId, proposalId }`.
4. Revisit proposal-ID-only lookup later only if the subgraph exposes direct DTF context for decoding.
5. Fix concrete correctness issues that are not API pruning: auction active timestamp semantics, status lookup correctness, deterministic timestamp mapping.
6. Keep optimistic governance in the primary SDK path; do not remove selector/optimistic helpers during this internal release pass.
7. Delete `register-parity.test.ts`; keep focused SDK behavior tests.
8. Validate with Node 24: typecheck, tests, build, `git diff --check`, and live subgraph checks after `prod` is tagged.
