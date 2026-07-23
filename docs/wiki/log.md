---
title: Log
updated: 2026-07-22
type: log
---

# Log

Append-only chronological record: lessons, corrections, friction. Newest section last. Tag kit-caused friction with `kit-friction`.

## 2026-07-09

- Wiki initialized by llm-workflow install.
- Brownfield adoption inventory contained root `AGENTS.md`, its `CLAUDE.md` pointer, the canonical `docs/` knowledge base, package READMEs, package scripts, and CI workflows. Existing SDK rules moved to [[project]]; none were dropped. Generic rules covered by kit skills were not duplicated.
- kit improvement evidence from Register: append-oriented wiki files repeatedly conflicted across branches; the narrow union-merge rule is being upstreamed and installed here. No other workflow change is justified—the current radius × size calibration already came from measured Register latency and its tests are green.
- Adoption closeout caught two useful local assumptions: the shell defaulted to unsupported Node 22, and Turbo replayed cached test results during a nominally fresh gate. The project workflow now forces test tasks; validation uses Node 24. A frozen-lockfile refresh also restored a declared-but-missing catalog validator dependency.
- SDK audit found adoption lag as the primary ecosystem issue: Register declares React SDK `^0.2.0` while this repo had already reached 0.3.2. The audit added missing brand metadata, ten React read surfaces, native `useQueries` compatibility, current integration priorities, and a local documentation-link check.
- Closeout review hardened the workflow against three false-green cases: GraphQL freshness now compares codegen output to the pre-run working tree, public Vocs routes are validated as routes, and full gates force builds instead of trusting Turbo cache. The upstream workflow installer preserves project-owned attributes while adding wiki union merges; wiki-lint rejects duplicate merge artifacts. All 24 upstream tests pass.
- Current-DTF integration added platform fee and status to the aggregate while preserving focused hooks, moved rebalance liquidity/Ondo health into core plus React, and removed the duplicated Register route/API/calculation paths. Preserve-modules packaging reduced the traced price reader from 538.08 kB to 15.41 kB (5.12 kB gzip); the bundle gate excludes Zod, rebalance-lib, and Decimal from that path.
- Workflow evaluation was useful: the red-flag scan exposed broad `any` in a table-driven React SDK test, and the gate caught formatting before review. Preserve-modules build reporting then flooded and truncated verification output, so SDK per-file reports were disabled and the dedicated bundle assertion was added to scoped/full gates. The full high-profile loop remained fast enough; no kit boundary change is justified.

## 2026-07-14

- Governance hardening (Register audit Z18/Z22 follow-through): Index `getProposalState` treated a for/against tie as SUCCEEDED; both FolioGovernor (OZ 5.1.0 GovernorCountingSimpleUpgradeable) and Yield Governance.sol (vendored GovernorCountingSimple) require forVotes strictly over againstVotes, so ties now resolve DEFEATED. Yield proposal lists previously returned raw subgraph state, which lags time-based transitions; `getYieldDtfProposalState` now derives PENDING/ACTIVE resolution summary-level (bigint votes, quorum, native timepoint), fetching the block number only when a non-terminal Alexios proposal needs it. Lesson: subgraph state is event-driven everywhere — any list surface showing proposal state needs a derivation, not the raw field.
- The open-auction builder tests fully mocked dtf-rebalance-lib, so nothing proved its zero-price/zero-supply guards surfaced through `prepareIndexDtfOpenAuctionArgs`. An unmocked integration spec now pins those throws and one golden exact-calldata fixture for a fixed two-token rebalance snapshot. Lib errors intentionally pass through raw (no SdkError wrap): messages like "auction launcher MUST closeRebalance" carry operator instructions that must not be reshaped.

## 2026-07-22

- Multi-repo SDK/Register work exposed avoidable approval churn when only Register was writable. Start those sessions with both repositories as writable workspace roots (or their parent as the workspace); sibling read-only inspection does not need escalation, and write-heavy SDK verification should be batched into the release gate.
