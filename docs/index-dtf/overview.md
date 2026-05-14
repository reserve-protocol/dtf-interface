# Index DTF Overview

Index DTFs are Folio-based onchain index tokens. A user holds one ERC20 share token backed by a basket of ERC20 assets. The basket changes through governance proposals and auction execution.

## Mental Model

An Index DTF has four major layers:

| Layer | What It Owns |
| --- | --- |
| Folio contract | Shares, basket assets, mint/redeem, fees, rebalances, auctions, roles |
| Governance contracts | Proposal creation, voting, queueing, execution, timelock permissions |
| Reserve API | Current prices, discovery, product analytics, vote-lock aggregates |
| Index subgraph | Deployments, metadata, roles, governance history, transfers, holders, rebalance/auction history |

Do not collapse these into one source. The protocol is safer to reason about when each field has an owner.

## Core Lifecycle

```text
Deploy Folio
-> Mint initial supply from basket assets
-> Users mint/redeem shares
-> Governance proposes basket/settings changes
-> Vote/queue/execute proposal
-> Rebalance starts
-> Auction launcher window
-> Community window
-> Auctions execute trades
-> Rebalance completes or expires
```

## Basket Model

The basket is a set of ERC20 assets held by the Folio contract. The contract tracks asset balances directly. Product UIs usually show basket weights, but the protocol also cares about token units and basket-unit limits.

Useful views:

- **Raw balance**: token balance held by the Folio.
- **Units**: token amount per DTF share or per basket unit.
- **Shares/weights**: USD-value percentage derived from units and prices.
- **Target weights**: desired post-rebalance basket weights.
- **Weight ranges**: low/spot/high limits used by rebalance auctions.

Shares are a product view and require prices. Do not store them as protocol truth.

## Basket Types

### Native DTF

- `weightControl = true`.
- Product input is usually target shares, like 50% BTC and 50% ETH.
- Rebalances can update weights directly.

### Tracking DTF

- `weightControl = false`.
- Product input is usually target units, like 0.1 BTC and 1 ETH per DTF.
- Weights are derived for display and validation.
- Rebalances use fixed weights where low = spot = high.

### Hybrid DTF

- Hybrid is a product/UI category, not a separate protocol mode.
- Product input uses units.
- Rebalance can use `weightControl = true` with deferred weights so the basket can be updated before auctions.

## Product Pages

Register exposes an Index DTF through nested pages:

- Overview
- Mint + Redeem
- Governance
- Auctions
- Details + Roles
- Performance/factsheet

The SDK should not copy page state directly, but product behavior from Register is useful when deciding API shape and defaults.

## Source References

- `reserve-index-dtf/contracts/Folio.sol`
- `reserve-index-dtf/contracts/interfaces/IFolio.sol`
- `reserve-index-dtf/contracts/utils/RebalancingLib.sol`
- `register/src/views/index-dtf/index-dtf-container.tsx`
- `register/src/state/dtf/atoms.ts`
- `register/src/app-routes.tsx`
- `dtf-sdk/packages/sdk/src/index-dtf/dtf/*`

## Do Not Infer

- Do not infer basket composition from subgraph fields.
- Do not infer current active auction state from historical auction entities.
- Do not assume every Index DTF has a vote-lock vault.
- Do not assume every vote-lock vault uses RSR.
