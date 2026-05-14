# Register Governance Flows

Register governance flows define the product behavior users see around proposals, voting, delegation, queueing, execution, and proposal creation.

## Governance Hub

The governance page includes:

- recent proposal list.
- vote-lock CTA.
- governance stats.
- guardians.
- delegate list.

The proposal list aggregates across relevant governances:

- owner governance.
- legacy admin governances.
- trading governance.
- legacy auction approver governances.
- stToken DAO governance.
- stToken legacy governance.

## Proposal List

Proposal list behavior:

- sorted newest first.
- default limit then show-all option.
- create proposal disabled for inactive DTFs.
- item displays title, state badge, vote start/end countdown, quorum status, and vote percentages.

## Proposal State Derivation

Register does not blindly show raw subgraph state. It derives state from timestamps and votes:

- pending becomes active when current timestamp is inside the vote window.
- active can become defeated, quorum-not-reached, or succeeded after vote end.
- queued uses execution ETA for countdown.
- quorum display uses for-weighted votes against quorum, not total votes.

SDK consumers should know whether they need Register-style display state or onchain governor state.

## Proposal Detail

Proposal detail reads:

- timelock.
- description.
- targets.
- calldatas.
- votes and weighted votes.
- delegate votes.
- queue/execute/cancel timestamps.
- execution tx hash.
- governance address.

The detail updater refreshes local voting state every minute until finalized and exposes refresh hooks for post-action behavior.

## Proposal Actions

Action visibility:

- queued: cancel and execute.
- succeeded: queue.
- executed: view tx.
- pending/active: vote button and voting power/delegation prompts.

Vote button disables when:

- wallet disconnected.
- already voted.
- proposal not active.
- no voting power.
- undelegated balance requires delegation first.

## Queue And Execute

Queue uses governor `queue(...)` with proposal tx args.

Execute uses governor `execute(...)` after timelock delay.

Register optimistically mutates queued state after queue tx success and refreshes after execute success.

## Proposal Creation

Register proposal types:

- DTF Basket.
- DTF Settings.
- Basket settings.
- DAO.

Basket proposals are staged:

1. edit basket.
2. confirm proposal.
3. review/submit.

Basket proposal builder supports:

- share input.
- unit input.
- hybrid DTF unit behavior.
- v4/v5 singleton `startRebalance` calldata.
- older legacy auction approval paths where still relevant in the app.

## Simulation

Register includes Tenderly proposal simulation behavior. It simulates governor `execute()` and manually configures proposal/timelock storage for OpenZeppelin v5 ERC-7201 layout.

This is product/debug tooling. Do not add it to SDK core unless there is a clear consumer and source-verified API.

## Source References

- `register/src/views/index-dtf/governance/index.tsx`
- `register/src/views/index-dtf/governance/updater.tsx`
- `register/src/views/index-dtf/governance/components/governance-proposal-list.tsx`
- `register/src/lib/governance.ts`
- `register/src/views/index-dtf/governance/views/proposal/*`
- `register/src/views/index-dtf/governance/views/propose/*`
- `register/src/hooks/use-proposal-simulation.ts`

## Do Not Infer

- Do not treat Register display state as exact onchain state.
- Do not implement simulation in SDK core without a product requirement.
- Do not assume all proposal types target the same governor.
