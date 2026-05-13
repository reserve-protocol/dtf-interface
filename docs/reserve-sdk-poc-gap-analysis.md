# reserve-sdk POC Gap Analysis

Last updated: 2026-05-11

This compares `/Users/luis/projects/reserve-sdk` against this SDK. The POC is useful as a behavior reference, but it should not be ported as-is. Keep this SDK's current shape: product namespaces, explicit reads, `prepare*` helpers returning `ContractCall`, and no wallet-bound protocol senders.

## Summary

Core Optimistic Governance support is now covered in this SDK: optimistic proposal preparation, selector-registry reads/prepare calls, optimistic governor context reads, and veto-style proposal state computation. Remaining governance gaps are mostly settings-builder polish, direct proposal RPC reads, and decoder coverage.

The POC also contains broader product surfaces that are not in this SDK yet: Yield DTF reads, deploy/zap-deploy flows, rebalance execution helpers, global revenue/RSR burn analytics, holder/concentration analytics, DTF comparison, performance metrics, Chainlink reads, and a CLI.

## Missing Features

| Area | POC source | Current status here | Recommendation |
| --- | --- | --- | --- |
| Optimistic proposal creation | `governance/build-proposal.ts` | Covered | `prepareIndexDtfSubmitOptimisticProposal` uses `proposeOptimistic(...)`. Standard `prepareSubmitProposal` is unchanged. |
| Optimistic governor reads | `governance/read-governance.ts`, Register `feature/optimistic-governance-views` | Covered for current scope | Added `getOptimisticGovernance`, `getOptimisticProposalContext`, role reads, and `getProposalThrottleCharges`. Individual low-level reads can be added later if consumers need them. |
| Optimistic proposal state | `governance/compute-proposal-state.ts` | Covered | `getVoteState` accepts optimistic context and uses veto-threshold math after `voteEnd`. |
| Direct proposal RPC reads | `governance/read-proposals.ts` | Partial | Current SDK derives proposal state from subgraph and timestamps. Add focused RPC reads for `state`, `proposalEta`, `proposalDeadline`, and `proposalSnapshot` where correctness depends on governor source of truth. |
| Selector registry whitelist | `governance/read-selector-registry.ts`, `governance/build-settings-calldata.ts` | Covered for raw calls | Added selector-registry reads and `prepareSelectorRegistryRegisterSelectors` / `prepareSelectorRegistryUnregisterSelectors`. Settings-builder integration is still separate. |
| Optimistic settings changes | `governance/build-settings-calldata.ts` | Missing | Add normal-governance prepare helpers for `setOptimisticParams`, `setProposalThrottle`, and `setLateQuorumVoteExtension`. |
| Optimistic timelock helpers | `governance/build-settings-calldata.ts` | Missing | Add prepare helpers for `revokeOptimisticProposer` and decide whether `executeBatchBypass` belongs in SDK. |
| Optimistic voting power | `governance/read-voting-power.ts`, Register `votes-token.ts` | Covered | Added vote-token `getOptimisticVotes` / `getPastOptimisticVotes` helpers and proposal voter-state optimistic voting power. |
| Vote-lock optimistic reads | `vote-lock/read-vote-lock.ts`, Register `governance-voting-power.tsx` | Covered | `getVoteLockState` / `getVoterState` include optimistic delegate and optimistic voting power. Added `prepareVoteLockDelegateOptimistic`. |
| Proposal decoder coverage | `governance/decode-proposal.ts`, optimistic ABI files | Missing | Add optimistic governor, selector registry, and optimistic timelock fragments to proposal decoding. |
| All/global proposals | `governance/fetch-proposals.ts` | `getAllIndexDtfProposals` currently throws | Implement API/subgraph-backed all-proposal listing or remove the public method until ready. |
| Governance settings read | `governance/read-governance.ts` | Partial via `getDtf` and proposal builders | Add a direct `getGovernanceSettings` if consumers need live governor settings including optimistic fields. |
| Rebalance execution helpers | `rebalance/build-auction.ts`, `rebalance/read-bid-quote.ts` | Partial | Current SDK covers rebalance reads and open-auction calls. Missing bid quote, bid call, close auction, end rebalance, and active-auction convenience reads. |
| Completed rebalance metrics | `dtf/fetch-analytics.ts` | Covered | Added Reserve API `/dtf/rebalance` history/detail wrappers and Index DTF rebalance helpers. |
| Historical analytics | `dtf/fetch-analytics.ts`, `analytics/compute-performance.ts` | Partial | Current SDK has price history. Missing historical token prices, max drawdown, volatility, Sharpe, VaR, correlation, beta, and tracking error helpers. |
| Zapper quote | `dtf/fetch-dtf.ts`, `prices/zapper-quote.ts` | Missing/deferred | Separate track. Add only when zap issuance is in SDK scope. |
| Deploy and zap deploy | `deploy/*` | Missing/deferred | POC has direct deploy calldata, governed deploy, staking-token deploy, deployment nonce, permissionless defaults, token registry, and `/zapper/{chainId}/deploy` wrappers. Treat as a deploy track, not part of optimistic governance. |
| Yield DTF namespace | `yield-dtf/*` | Placeholder methods throw | POC has type detection, components, basket/backing, stRSR, distribution, config, discovery, collateral yields, APY, revenue, status/throttle, and issue/redeem quotes. This is a large separate track. |
| Ecosystem revenue and RSR burns | `revenue/*` | Partial | Current SDK has per-DTF revenue. Missing ecosystem aggregation, revenue snapshots, RSR burn fetches, RSR price history, burn projections, and fee metrics. |
| Holders and concentration | `dtf/fetch-holders.ts`, `signals/*` | Missing | POC reads top holders for index/yield DTFs and computes concentration signals. Product need unclear. |
| DTF comparison | `dtf/compare-dtfs.ts` | Missing | POC compares multiple DTFs by basket overlap, canonical assets, fees, HHI, and errors. Product need unclear. |
| Token/price extras | `prices/chainlink.ts`, `prices/reserve-api.ts` | Partial | Current SDK has Reserve API token prices and volatility. Missing Chainlink reads/backfill and volatility-to-price-error helper constants. |
| CLI and agent tooling | `packages/cli/*` | Missing | This repo has SDK/react-sdk only. CLI/MCP/skills are separate product decisions. |

## Already Covered Here

- Index DTF discovery, status, brand, basket, price, price history, exposure, transfers, revenue, issuance state, and portfolio endpoints.
- Manual v5 mint/redeem prepare calls and mint approval plans.
- Proposal builders for basket/admin/basket-settings/DAO-settings flows.
- Vote-lock DAO rows, vote-lock drawer state, approval/deposit plan, delegate, unlock, rewards claim, and withdrawal claim.
- SDK private-key viem wallet client factory for bots/CLI consumers.
- Optimistic proposal preparation, selector registry reads/prepare calls, optimistic governor context reads, and veto-style proposal state computation.
- Optimistic voting-power/delegation reads and optimistic delegation prepare calls, aligned with Register's `feature/optimistic-governance-views` branch.
- Completed rebalance history/detail metrics from Reserve API.

## Optimistic Governance Behavior

The POC models Optimistic Governance as a Reserve governor variant with these behaviors:

- Optimistic proposals use `proposeOptimistic(targets, values, calldatas, description)`.
- Only whitelisted target/function selectors can be submitted optimistically.
- Whitelisting is managed through a selector registry using normal governance, not through optimistic governance.
- The voting window is usually short, for example 24 hours, but configurable through `optimisticParams`.
- Voting is veto-style. If the against votes do not reach the veto threshold before the window ends, the proposal succeeds.
- `vetoThreshold(proposalId)` returns the proposal-specific D18 threshold used with governance-token snapshot supply.
- This SDK does not special-case `MAX_UINT256` veto thresholds until that behavior is confirmed against the protocol. Zero snapshot supply is treated as canceled.

The POC's final-state math:

```ts
thresholdVotes = (vetoThreshold * snapshotSupply) / 1e18
vetoThresholdVotes = thresholdVotes > 0n ? thresholdVotes : 1n

if (againstVotes >= vetoThresholdVotes) state = "DEFEATED"
else state = "SUCCEEDED"
```

## Integration Plan

### 1. Confirm Contract Surface

- Pull ABI fragments from the real protocol/Register source, not from the POC blindly.
- Confirm exact function names and argument types for remaining settings/admin actions: `setOptimisticParams`, `setProposalThrottle`, `setLateQuorumVoteExtension`, and `revokeOptimisticProposer`.
- Confirm whether the subgraph exposes optimistic proposal flags or whether all optimistic state must be RPC-overlaid.
- Confirm the `MAX_UINT256` veto-threshold behavior before adding a special state rule.

### 2. Add Minimal ABIs And Types

- Add small ABI fragments instead of importing the full POC governor ABI.
- Add `selector-registry` ABI.
- Add optimistic timelock ABI fragments only where needed.
- Add types for `OptimisticGovernanceParams`, `OptimisticProposalContext`, `OptimisticProposalEligibility`, and selector data.
- Extend `IndexDtfProposalSummary` and `IndexDtfProposalDetail` with optional optimistic fields, without requiring optimistic data for standard governors.

### 3. Add Pure Prepare Helpers

- Add `prepareIndexDtfSubmitOptimisticProposal({ chainId, proposal })`.
- Add low-level prepared target calls for `setOptimisticParams`, `setProposalThrottle`, and `setLateQuorumVoteExtension` only as inputs to normal-governance proposal builders or explicit advanced consumers.
- Add low-level prepared target calls for `registerSelectors` and `unregisterSelectors` so normal-governance proposals can whitelist optimistic actions.
- Add `prepareIndexDtfRevokeOptimisticProposer(...)` if product flows need it.
- Expose direct helpers from root exports and `sdk.index` where useful. Only add `sdk.index.ref(...)` wrappers when the ref can inject product identity cleanly; registry/governor-address-scoped helpers can stay direct.
- Do not add wallet-bound `submitOptimisticProposal` functions. Consumers still send `ContractCall`s.

### 4. Add Optimistic Reads

- Add `getOptimisticGovernanceState({ chainId, governance, account? })` for selector registry, params, throttle capacity, and optional account charge.
- Add `getSelectorRegistryTargets({ chainId, registry })`.
- Add `getAllowedSelectors({ chainId, registry, target })`.
- Add `getSelectorAllowed({ chainId, registry, target, selector })`.
- Add `getOptimisticProposalContext({ chainId, governance, proposalId })`. It should return `null` for standard proposals on optimistic-capable governors and handle unsupported legacy governors explicitly instead of blindly calling optimistic-only functions.
- Optimistic voting power/delegation is separate from standard voting power. Register reads `optimisticDelegates`, `getOptimisticVotes`, and `getPastOptimisticVotes` from the vote token.

### 5. Add Whitelist Validation

The POC only exposes raw selector-registry reads. The validation shape below is a new SDK convenience so consumers can avoid building optimistic proposals that the governor will reject.

- Add a pure selector extractor that takes calldata and returns the first 4-byte selector.
- Add `getOptimisticProposalEligibility({ chainId, governance, targets, calldatas })` that reads the governor selector registry and checks every target/selector pair.
- Return `{ eligible: boolean, violations: [...] }` instead of throwing by default.
- Keep `prepareIndexDtfSubmitOptimisticProposal` pure. It can optionally accept precomputed eligibility if we want an asserting variant later, but it should not fetch.

### 6. Wire Proposal State

- Refactor `getVoteState` to accept optional optimistic context.
- For optimistic proposals after `voteEnd`, use veto-threshold math instead of standard quorum/for-vs-against math.
- Enrich `getProposal` with optimistic context because detail pages need correct state.
- Add an option for `getProposals` list enrichment if needed. Avoid unconditional N+1 reads across every historical proposal.
- Make voting UI semantics explicit in types: optimistic proposals are veto proposals. If the contract only accepts `Against`, expose that in docs/tests and let consumers hide unsupported vote choices.

### 7. Extend Settings Builders

- Add optimistic governance fields to existing settings proposal builders only where they are normal-governance actions.
- Add selector whitelist changes as explicit inputs, not a generic proposal framework.
- Keep low-level selector prepare helpers public only if consumers need raw control.

### 8. Tests

- Port the useful POC tests, not the structure.
- Decode-test `prepareIndexDtfSubmitOptimisticProposal` to `proposeOptimistic`.
- Unit-test selector extraction and eligibility checks.
- Unit-test `getOptimisticProposalContext` for standard and optimistic proposals.
- Unit-test optimistic state transitions: below threshold succeeds, at threshold defeats, and zero snapshot supply cancels.
- Unit-test optimistic settings prepare helpers and selector registry prepare helpers.
- Add namespace/ref smoke tests for the new methods.
- Add proposal decoder tests for optimistic governor and selector registry actions.

## Suggested Order

1. ABI fragments, types, and pure prepare helpers.
2. Selector registry reads and eligibility checks.
3. Optimistic proposal context reads.
4. Proposal state computation and `getProposal` integration.
5. Settings proposal builder support for whitelisting and optimistic params.
6. React SDK query wrappers only after the core SDK API shape settles.

## Open Questions

- Which deployed governors already use the optimistic framework on Ethereum, Base, and BSC?
- Does the index subgraph expose optimistic proposal fields, or should this SDK always use RPC overlays?
- Should `getProposals` enrich optimistic state by default, or only when explicitly requested?
- Should `prepareVote` validate vote support for optimistic proposals, or should consumers choose the right support based on proposal detail?
- Is `executeBatchBypass` a product-supported flow, or should it stay internal/admin-only?
- Do we want a CLI in this repo, or should bot/CLI consumers use the SDK directly?
