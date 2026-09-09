---
title: Log
updated: 2026-08-25
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

## 2026-08-25

- The release workflow's `workflow_run` checkout allowed a successful fork workflow to select code executed with repository write permissions and npm OIDC. Publishing now starts only from `main` pushes or manual `main` dispatches, while the existing Changesets v1 release-PR and trusted-publishing flow remains unchanged.

## 2026-09-08

- Charted the governance dashboard reads with a wayfinder pass (map in reserve-dashboard `.scratch/governance-dashboard/`): both products from day one, RSR panel = current vault state + yield Protocol totals, one merged activity feed, Arbitrum dropped. Live subgraph counts (Base: ~600 governances, ~1000 proposals, <2000 staking positions) sized the pagination: 1000-row pages, 10k ceiling.
- Dark/Light review caught two silent-truncation paths (feed default of 1000 per chain with Base already past it; `skip`-based walks past 10k rows) and a misattribution (guardian cancels pinned on the proposer). Fixed with a 10k default plus `states` pre-filter, id-cursor walks that throw `LIMIT_EXCEEDED`, and timelock attribution. Lesson: probe the live subgraph for row counts and null patterns before trusting a schema comment.
- Codex senior review (gpt-5.6-sol, xhigh) returned BLOCK on five points. Adopted one: `fetchSubgraphPages` now rejects windows past the 10k ceiling with `INVALID_INPUT`. Declined four with evidence: the 1000-row feed default would drop Base's tail (>1000 proposals live); vote weights and delegated votes must use share-token decimals because Base has six-decimal vlUSDC vaults and BSC an eight-decimal vlDOGE vault; guardian cancels have no indexed canceller (index-subgraph `handlers.ts:370` only sets it on governor cancels), so attributing them to the proposer would be wrong. Three of the four restated the pre-review prompt rather than the code.

## 2026-09-09

- Second review pass (Dark + Light + codex) before the PR. Adopted: proposal vote weights, quorum, veto thresholds, and vote rows now carry the vote-lock share token's decimals through every proposal document and the shared mapper (the feed had inherited the mapper's fixed 18 while the other new reads used share decimals); feed items expose flat `forDelegateVotes`/`againstDelegateVotes`/`abstainDelegateVotes` like the detail types; the `states` pre-filter was dropped (no consumer, and it was typed wider than the subgraph enum); both feeds default to the 10k ceiling; an id-cursor walk that ends exactly at the ceiling returns instead of throwing; one `mapVaultShareToken` replaces four inline share-token blocks. Declined: trimming byproduct fields (delegated votes, holders represented, lifetime withdrawn) that Register's explorer plausibly wants.
- Codex round 2 (post-fixes tree): adopted legacy owner/trading governances in DTF attribution and per-transition ordering for lifecycle activity (queued/executed/canceled each fetched by their own timestamp); declined re-adding the `states` filter it had been told about in the prompt — no consumer, and the type was wider than the subgraph enum. Live smoke after the change: index activity now includes executions of proposals created months earlier.
