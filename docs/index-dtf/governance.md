# Index DTF Governance

Index DTF governance controls basket changes, DTF settings, vote-lock settings, and protocol actions. A single DTF can have multiple governance domains.

## Governance Domains

| Domain | Typical Control |
| --- | --- |
| Owner/admin governance | DTF settings, fees, roles, ownership-level changes, proxy admin |
| Trading/basket governance | Basket proposals, rebalances, rebalance-related settings |
| DAO/vote-lock governance | Vote-lock reward tokens, staking-vault settings, DAO-level parameters |

Some deployments share owner and trading governance. Historical governances can still matter for old proposals.

## Proposal Lifecycle

Standard lifecycle:

```text
PROPOSE -> PENDING -> ACTIVE -> SUCCEEDED/DEFEATED -> QUEUED -> EXECUTED
```

Register and SDK helpers should expect state to come from a mix of subgraph history and onchain governor reads.

Subgraph state is event-driven. It can miss time-derived transitions until another event occurs. Register derives display state from timestamps, quorum, and votes.

## Proposal Payloads

Index DTF proposal payloads use OpenZeppelin-style arrays:

- `targets`
- `values`
- `calldatas`
- `description`

Queue and execute use the description hash. The SDK should provide a helper for this rather than forcing consumers to remember encoding details.

## Proposal IDs

Proposal IDs are long decimal strings. They encode governor/targets/calldatas/description behavior and are unique in practice for Index DTF governance.

The SDK keeps proposal detail DTF-bound when it needs DTF context for calldata decoding:

```ts
getProposal({ address, chainId, proposalId })
```

Do not switch to proposal-ID-only lookup unless the subgraph exposes direct proposal-to-DTF context sufficient for decoding.

## Voting

Vote actions include:

- `castVote(proposalId, support)`.
- `castVoteWithReason(proposalId, support, reason)`.
- `castVoteWithReasonAndParams(proposalId, support, reason, params)`.

Register blocks voting if:

- wallet is disconnected.
- user already voted.
- proposal is not active.
- user has no voting power.
- user has undelegated balance and must delegate first.

## Delegation

Index vote-lock vaults expose ERC20Votes-style delegation. Users often need to delegate before their votes count.

Standard vote-lock delegation is separate from optimistic delegation:

- standard: `delegate`, `delegates`, `getVotes`, `getPastVotes`.
- optimistic: `delegateOptimistic`, `optimisticDelegates`, `getOptimisticVotes`, `getPastOptimisticVotes`.

## Queue And Execute

Queue action:

- called on governor.
- uses proposal tx args and description hash.
- after success Register optimistically updates proposal state to queued.

Execute action:

- called on governor after timelock delay.
- Register refreshes after transaction confirmation.

Cancel action:

- can involve governor cancel paths or timelock operation cancellation depending on state/version.
- SDK should expose explicit helpers instead of hiding important branch behavior.

## Optimistic Governance

Optimistic governance supports proposals that can pass if not vetoed.

Detection:

- Use `optimisticParams()` to detect governor support.
- Use `isOptimistic(proposalId)` only for a known proposal.

Optimistic proposal behavior:

- Proposal actions must be allowlisted by target/function selector.
- During veto period, only against votes are valid.
- Against votes count toward veto threshold.
- If veto threshold is not reached, proposal can execute through optimistic path.

## Proposal Builders

SDK proposal builders should stay product-shaped:

- basket proposal builder.
- DTF settings proposal builder.
- basket governance settings builder.
- DAO/vote-lock settings builder.
- direct governance/timelock utility call builders.

Avoid generic arbitrary proposal frameworks unless a product consumer needs it.

## Source References

- `reserve-index-dtf/contracts/governance/FolioGovernor.sol`
- `reserve-index-dtf/contracts/deployer/FolioDeployer.sol`
- `register/src/lib/governance.ts`
- `register/src/views/index-dtf/governance/*`
- `register/src/views/index-dtf/governance/views/propose/*`
- `dtf-index-subgraph/src/governance/*`
- `dtf-sdk/packages/sdk/src/index-dtf/governance/*`

## Do Not Infer

- Do not rely on subgraph proposal state alone for terminal/current state.
- Do not merge standard and optimistic voting power.
- Do not derive DTF membership from proposal ID unless the data model changes.
