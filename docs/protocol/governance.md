# Protocol Governance

Reserve governance is not one universal mechanism. Index DTFs and Yield DTFs share broad governance concepts, but their contract systems and product flows differ.

## Shared Concepts

Most Reserve governance flows use OpenZeppelin-style governor and timelock mechanics:

```text
PROPOSE -> VOTE -> QUEUE -> EXECUTE
```

Proposal payloads usually include:

- `targets`
- `values`
- `calldatas`
- `description`

Queue and execute actions use a description hash. The SDK should expose helpers for this instead of making consumers guess the hash format.

## Timelocks

Timelocks enforce an execution delay after successful governance. A timelock can also own roles on protocol contracts.

For Index DTFs, common timelock-owned permissions include:

- Folio admin permissions.
- Rebalance manager permissions.
- Guardian/canceller permissions.
- Proxy admin ownership.

Register may label a timelock canceller as a guardian. When building calldata, use the contract role, not the UI label.

## Index DTF Governance Domains

Index DTFs can have multiple governance domains:

- Owner/admin governance controls broad DTF settings and ownership-level actions.
- Trading/basket governance controls basket changes and rebalances.
- DAO/vote-lock governance controls vote-lock settings and reward token changes.

Some deployments share domains. Some have legacy governances that still matter for historical proposals.

## Optimistic Governance

Optimistic governance is a newer Index DTF governance mode layered on top of standard governance.

Detection rule:

- Use `optimisticParams()` as the governance-level support probe.
- Use `isOptimistic(proposalId)` only at proposal level.

Optimistic proposals are limited to allowlisted target/function selectors. During the veto period, only `Against` votes are valid and count toward vetoing. If veto threshold is not reached, the proposal can proceed through the optimistic path.

Normal and optimistic vote-lock delegation are separate systems:

- Standard delegation: `delegate`, `delegates`, `getVotes`, `getPastVotes`.
- Optimistic delegation: `delegateOptimistic`, `optimisticDelegates`, `getOptimisticVotes`, `getPastOptimisticVotes`.

Do not merge these powers into one number.

## Yield DTF Governance

Yield DTF governance uses RSR staking in the legacy RToken system. Staked RSR provides governance power and absorbs losses in default scenarios. Yield governance controls protocol configuration, backing, and revenue behavior through the Yield DTF contract system.

The SDK should document Yield governance separately from Index vote-lock governance because the underlying token mechanics differ.

## Source References

- `reserve-index-dtf/contracts/governance/FolioGovernor.sol`
- `reserve-index-dtf/contracts/deployer/FolioDeployer.sol`
- `register/src/views/index-dtf/governance/*`
- `register/src/lib/governance.ts`
- `dtf-index-subgraph/src/governance/*`
- `dtf-index-subgraph/docs/optimistic-governance.md`

## Do Not Infer

- Do not assume a proposal is executable from subgraph state alone.
- Do not assume all Index DTFs share one governor.
- Do not assume standard and optimistic voting power are interchangeable.
- Do not assume Yield DTF stRSR behavior applies to Index DTF vote-lock vaults.
