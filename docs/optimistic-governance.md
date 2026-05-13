# Optimistic Governance

Index DTF optimistic governance is a newer governor mode layered on top of the standard proposal flow.

## Detection

Use `optimisticParams()` as the governance-level support probe.

- If the call succeeds, the governor supports optimistic proposals.
- The returned values are `vetoDelay`, `vetoPeriod`, and `vetoThreshold`.
- If the call reverts because the function is missing, treat the governor as standard governance.

Use `isOptimistic(proposalId)` only at the proposal level. It can revert for nonexistent proposal IDs, so it should not be used as the governance-level detection call.

## Proposal Behavior

Standard proposals keep normal voting and quorum semantics.

Optimistic proposals are limited to allowlisted target/function selectors. During the veto period, only `Against` votes are valid and count toward vetoing the optimistic proposal. If the veto threshold is not reached, the proposal can execute through the optimistic path.

## Vote-Lock Delegation

Normal voting power and optimistic voting power are separate vote-lock systems.

- Standard delegation uses `delegate`, `delegates`, `getVotes`, and `getPastVotes`.
- Optimistic delegation uses `delegateOptimistic`, `optimisticDelegates`, `getOptimisticVotes`, and `getPastOptimisticVotes`.
- Users can delegate normal and optimistic voting power to different addresses.

SDK helpers should expose this distinction directly instead of merging both powers into one number.

Subgraph consumers should read both standard and optimistic fields from `Delegate`. The identity stays `{stToken}-{address}`, while standard and optimistic voting power, holder counts, vote counts, and total delegate counters stay separate. Proposal votes keep one `voter` relation; use `Proposal.isOptimistic` to know which voting system they belong to.
