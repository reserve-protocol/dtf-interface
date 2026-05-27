# Decisions

Durable implementation decisions that affect more than one file or consumer.

## 2026-05-20: Index DTF Optimistic Governance Proposal Data

SDK proposal reads expose standard and optimistic proposal metadata through one proposal shape. Register should not split normal and optimistic proposal detail/list paths.

Decision:

- `getProposalList`, `getProposals`, and `getProposal` are subgraph-backed proposal reads.
- Proposal reads include optimistic fields when the subgraph has them: `isOptimistic`, `vetoThreshold`, and `voteToken` from the proposal's governance token.
- `getProposalVoterState` is the unified account voter-state read for standard and optimistic proposals.
- `getOptimisticProposalVoterState` can remain as an explicit compatibility/read helper, but consumers should not need it for mixed proposal detail pages.
- React SDK proposal array hooks reuse proposal-list cache data. `useIndexDtfProposals` should still behave like an array hook for `select`, while `useIndexDtfProposalList` exposes `{ proposals, proposalCount }`.
- Register owns wallet state, transaction sending, Jotai state, toasts, routes, and refresh timing. SDK/react-sdk own proposal/voter-state data reads.

Optimistic voter-state fallback:

- Exact optimistic proposal context comes from `getOptimisticProposalContext`, which reads `proposalSnapshot(proposalId)`, `vetoThreshold(proposalId)`, and the optimistic vote token from the governor.
- Proposal list/detail reads do not automatically hydrate that context with extra RPC calls.
- `getProposalVoterState` reads optimistic account power from `proposal.voteToken` at `proposal.voteStart`, unless explicit `proposal.optimistic.snapshot` context is passed.
- Proposal reads get the vote token from the subgraph in the same proposal query. Consumers that need exact optimistic snapshot/supply/veto-threshold context can call `getOptimisticProposalContext` explicitly and pass that context to voter-state reads.
- Subgraph `proposal.quorumVotes` is the governor's standard quorum value, not optimistic veto-threshold votes. One-shot proposal reads must not use it as the optimistic veto threshold.
- Without explicit optimistic context, SDK optimistic proposal state still treats an ended zero-veto proposal as `SUCCEEDED`; otherwise it keeps the indexed state and leaves veto/quorum flags false. Exact veto-state display requires `getOptimisticProposalContext`.
- Register proposal detail explicitly reads `getOptimisticProposalContext` for optimistic proposals and passes the result into SDK proposal/voter-state derivation.

Challenge matching:

- A challenge confirmation proposal is detected by the `Confirmation For:` description prefix.
- The stripped confirmation description must exactly match a prior optimistic proposal description in the same governance.
- Optimistic proposals are expected to run for about one day, then a challenged proposal creates the confirmation soon after. There are not enough governance proposals to justify a full-history scan or generic matching system.
- Proposal lists only mark `wasChallenged` when the matched optimistic proposal is present in the returned set.
- Proposal detail does not do hidden challenge lookups. Challenge resolution happens in proposal lists where the candidate proposals are already present.

Why:

- Register should receive product-shaped proposal/voter-state data instead of branching on governance type.
- Hidden per-proposal RPC hydration in list/detail reads would make proposal pages harder to reason about and could add surprising over-fetching.
- Exact optimistic context remains available as an explicit SDK read for flows that need it.
