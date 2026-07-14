---
title: Progress
updated: 2026-07-14
type: ledger
---

# Progress

Stage ledger. One row per stage; keep entries short. Verifier = exact fresh commands that ran green. Lenses = one line each in the Review column.

| Stage                                                                   | Status              | Verifier                                                                                                                                                                                  | Review                                                                                                                                                                                                                                                     | Next                                                                       |
| ----------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| governance tie semantics + yield list state + rebalance hardening tests | done (base 588954e) | full gate on Node 24: forced builds + sdk-bundle + typecheck + lint + format + forced tests (sdk 287 passed/17 live skipped, react-sdk 72) + docs links + catalog checks; wiki-lint green | correctness+security+product+complexity: Dark+Light subagent pair; adopted boundary/mixed-flavor vectors and pinned zero-supply message; PENDING-expired labeling and detail QUORUM_NOT_REACHED split verified against Register reference, sent to backlog | Luis review (user-visible governance badge change); release patch          |
| Current DTF aggregate, rebalance health, and bundle packaging           | done (base 4bcda6a) | `turbo build --force` + SDK bundle gate + typecheck + lint + format + forced tests (340 passed, 17 live skipped) + 93-doc links + catalog checks                                          | correctness+security+product+complexity: self-review, no blockers; external reviewer skipped because delegation was not authorized for closeout                                                                                                            | release SDK/React SDK; replace Register local links with released versions |
| SDK audit and Register gap closure                                      | done (base 4bcda6a) | forced builds + types + lint/format + 331 tests (+17 live skipped) + 93-doc links/routes + catalog; release:ci pack dry-runs; workflow 24 tests                                           | correctness+security+product+complexity: independent review; fixed dirty-tree codegen, public-route coverage, docs routing, fresh-build gate                                                                                                               | release SDK/React SDK and bump Register                                    |
| workflow adoption                                                       | done (base 4bcda6a) | build + typecheck + lint (2 baseline warnings) + format + 321 tests + docs + catalog checks; workflow 24 tests                                                                            | correctness+complexity: independent review; fixed build/codegen/risk routing, rule preservation, formatter ownership, attribute precedence                                                                                                                 | audit SDK/React SDK and Register gaps                                      |

## Backlog

<!-- Minor/deferred findings. Delete items when done or obsolete. -->

- `getYieldDtfProposalState` labels zero-engagement PENDING proposals past `voteEnd` as EXPIRED, matching Register's `getProposalStatus` and the Index derivation; strict OZ semantics would compute the vote outcome instead. Product decision whether to change all three surfaces together.
- Yield detail (`getYieldDtfProposal`) trusts on-chain `governor.state()`, which reports failed-quorum proposals as DEFEATED while the list derivation distinguishes QUORUM_NOT_REACHED. Decide whether detail should layer the display distinction.
- `getYieldDtfProposalState(proposal, currentTimepoint)` relies on the caller passing the governor-native unit (seconds vs blocks); consider an explicit `isTimepointBased` param like `getYieldDtfProposalVotePower` if external adoption grows.
