# Rebalances And Auctions

Rebalances are governance-directed changes to the target basket. Auctions execute the trades needed to move the Folio from current holdings toward target holdings.

## Lifecycle

```text
Proposal executes
-> startRebalance(...)
-> restricted launcher window
-> auction launcher opens auction
-> bids fill auction
-> more auctions may open
-> rebalance completes or expires
```

If launchers do not act during the restricted window, permissionless auction opening can become available.

## `startRebalance`

`startRebalance` is called by `REBALANCE_MANAGER`, usually through trading/basket governance.

Rebalance inputs include:

- token list.
- target weight ranges.
- price ranges.
- max auction size per token.
- basket-unit/share limits.
- restricted auction launcher window.
- TTL.
- version-specific structs and argument shape.

Starting a rebalance adds all rebalance tokens to the basket.

## Validation Rules

Contract-level rules include:

- TTL must be nonzero.
- TTL must be greater than or equal to the auction launcher window.
- TTL must be no more than 4 weeks.
- At least two tokens are required.
- Token addresses must be nonzero and non-self.
- Token addresses must be unique.
- Limits must satisfy low <= spot <= high.
- Price high must be no more than 100 times price low.
- If `weightControl = false`, weight low, spot, and high must be equal.
- If trade allowlist is enabled, non-allowlisted tokens can only be traded out with zero weights.

SDK validation should catch product mistakes early, but contracts remain final authority.

## Auction Windows

### Restricted Launcher Window

During the restricted window, `AUCTION_LAUNCHER` addresses can open auctions. This lets trusted operators sequence auctions and avoid bad execution.

### Community Window

After the restricted window, permissionless opening can be available through unrestricted auction calls. The exact behavior depends on version and rebalance state.

## Auction Opening

Privileged launcher path:

- Launcher selects auction parameters within rebalance constraints.
- Opening a new restricted auction can close/replace a previous path where permitted.

Permissionless path:

- Opens after restricted window.
- Uses all in-rebalance tokens.
- Collapses weights/limits to spot values.
- Uses initial prices.

## Pricing

Auctions use Dutch pricing. The price moves over time from an optimistic start price toward a pessimistic end price.

Important points:

- Non-atomic auctions include a warmup period.
- Atomic swap price-control modes can use fixed prices and immediate execution windows.
- Bid sizing is constrained by surplus/deficit, max auction size, current price, and user max buy amount.

## Bids

Bid flow:

1. Bidder requests a sell amount.
2. Contract computes actual sell amount and buy amount.
3. Bidder receives sell token.
4. Bidder pays buy token by allowance or callback.

Permissionless `bid` requires the rebalance-level `bidsEnabled` captured when rebalance started.

## Trusted Fillers

Trusted fillers are async fill paths, currently used for integrations such as CoW-style execution.

Trusted fill behavior:

- Requires trusted filler registry and enabled flag.
- Can create a fill even when permissionless bids are disabled.
- Folio approves/sends sell tokens to filler.
- Filler closes later and returns balances.
- Active trusted fills affect accounting and `totalAssets()` behavior.

Consumers should be careful around mid-fill state. Contract docs expose `stateChangeActive()` for async state-change awareness.

## Product Basket Proposal Inputs

Register basket proposals can be:

- share-based native basket updates.
- unit-based tracking basket updates.
- hybrid unit input with deferred weights.

The product flow uses token prices, price errors, volatility, max auction sizes, current balances, and total supply to build rebalance calldata.

## SDK Scope

The SDK should provide product-shaped helpers for:

- target basket conversion.
- start-rebalance calldata building.
- auction read helpers.
- bid preview and bid call building.
- version-aware operation encoding.

Avoid generic rebalance frameworks unless a concrete consumer needs one.

## Source References

- `reserve-index-dtf/contracts/Folio.sol`
- `reserve-index-dtf/contracts/utils/RebalancingLib.sol`
- `reserve-index-dtf/contracts/interfaces/IFolio.sol`
- `reserve-index-dtf/contracts/utils/Constants.sol`
- `register/src/views/index-dtf/governance/views/propose/basket/*`
- `dtf-sdk/packages/sdk/src/index-dtf/dtf/basket/*`
- `dtf-sdk/packages/sdk/src/index-dtf/rebalance/*`

## Do Not Infer

- Do not use `Date.now()` for onchain active-state checks when block timestamp is required.
- Do not assume subgraph auction state is live.
- Do not assume `bidsEnabled` can be changed mid-rebalance for the already captured rebalance state.
