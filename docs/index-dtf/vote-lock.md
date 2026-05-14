# Vote-Lock

Index DTF vote-lock vaults provide governance power and can receive rewards. They are distinct from Yield DTF stRSR staking.

## Model

A vote-lock vault has:

- an underlying token.
- vault shares / vote token behavior.
- delegation for governance voting power.
- optional optimistic delegation.
- reward tokens.
- unlock/withdraw delay mechanics.

The underlying token is not always RSR. Read vault metadata instead of assuming.

## Lock Flow

Register lock behavior:

1. User chooses an amount of underlying token.
2. User approves underlying token to the vote-lock vault if needed.
3. If delegating to self, Register can call `depositAndDelegate(amount)`.
4. Otherwise it calls `deposit(amount, account)` and handles delegation separately.
5. UI refreshes balances and governance state after confirmation.

Users must delegate voting power for votes to count.

## Unlock Flow

Unlock behavior:

1. User chooses amount to unlock.
2. Register checks `amount <= maxWithdraw`.
3. User calls `withdraw(amount, account, account)` to begin unlock.
4. Rewards stop according to vault behavior.
5. User waits unlock delay.
6. User returns to claim/withdraw unlocked underlying when available.

Register requires users to acknowledge the unlock delay before starting the flow.

## Rewards

Vote-lock holders can receive rewards from DTF fee distributions and approved reward tokens.

Reward data can come from multiple places:

- vault RPC for live claim/balance behavior.
- Index subgraph for reward token events and claim history.
- Reserve API `/dtf/daos` for user-facing APR and position aggregates.

APR is product analytics, not protocol truth. Treat it as API-owned.

## Governance Power

Standard voting power and optimistic voting power are separate.

Standard:

- `delegate`.
- `delegates`.
- `getVotes`.
- `getPastVotes`.

Optimistic:

- `delegateOptimistic`.
- `optimisticDelegates`.
- `getOptimisticVotes`.
- `getPastOptimisticVotes`.

Do not combine standard and optimistic powers unless a UI explicitly labels the combined value as display-only.

## Register UI

Register exposes vote-lock through:

- governance hub card.
- overview page vote-lock drawer.
- Earn page vote-lock positions.

The UI explains that users lock the underlying token to become governors and earn a share of fee rewards.

## Source References

- `reserve-index-dtf/contracts/deployer/FolioDeployer.sol`
- `register/src/views/index-dtf/governance/components/governance-vote-lock.tsx`
- `register/src/views/index-dtf/overview/components/staking/*`
- `register/src/views/index-dtf/overview/hooks/use-staking-vault-apy.ts`
- `register/src/views/earn/views/index-dtf/hooks/use-vote-lock-positions.ts`
- `dtf-index-subgraph/src/staking-token/*`
- `dtf-sdk/packages/sdk/src/index-dtf/vote-lock/*`

## Do Not Infer

- Do not assume vote-lock underlying is RSR.
- Do not treat vote-lock APR as an onchain contract value.
- Do not use Yield stRSR docs as the source for Index vote-lock behavior.
