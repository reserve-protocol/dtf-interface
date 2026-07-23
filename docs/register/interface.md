# Register Interface

Register is the product source of truth for Index DTF user behavior. Use this doc when SDK behavior needs to match the app.

## Route Shape

Index DTF deep links follow this product shape:

```text
/{chainSlug}/index-dtf/{address}/{page}
```

Known chain slugs:

- `ethereum`
- `base`
- `bsc`

Common pages:

- `overview`
- `issuance`
- `governance`
- `auctions`
- `settings`
- `performance`

Source note: Register route constants may use internal names that differ from the slug. The factsheet route uses the `performance` slug.

## Container Behavior

The Index DTF container owns product context setup:

- validates chain and token address from the URL.
- redirects invalid chain/address to not-found behavior.
- switches wallet chain to URL chain where applicable.
- resets Index DTF atoms when token changes or page unmounts.
- fetches metadata, brand, basket, prices, rebalance control, platform fee, exposure, status, and governance overview.
- exposes refresh functions for post-transaction flows.

This is Register behavior. SDK methods should provide the underlying reads/builders, not reproduce React state orchestration.

## Navigation

Main Index DTF navigation:

- Overview
- Mint + Redeem
- Governance
- Auctions
- Details + Roles

Deprecated/unsupported DTFs disable auction surfaces. Factsheet/performance hides normal nav behavior in some contexts.

## Data Dependencies

Register container/page data uses:

- Index subgraph for DTF metadata, governance, roles, vote-lock, fee recipient history.
- Reserve API for current basket/price, brand, discovery/bulk status, exposure, historical charts, vote-lock positions.
- `@reserve-protocol/dtf-catalog` through the SDK for synchronous single-route status.
- RPC for live `totalAssets`, `totalSupply`, `rebalanceControl`, platform fee registry, staking vault state, proposal/gov actions.

See `protocol/data-sources.md` for source ownership.

## Product State

Register tracks product state such as:

- DTF metadata.
- brand metadata.
- basket tokens, prices, amounts, shares.
- platform fee.
- rebalance control.
- version.
- active/deprecated/unsupported status.
- brand manager permission.
- auction launcher permission.
- hybrid DTF product exceptions.

SDK should expose source-backed data, not Register atom names.

## Overview Page

Overview includes:

- price/performance chart.
- basket/about sections.
- fees and stats.
- governance/vote-lock overview when present.
- creator notes.
- transactions table.
- disclosure.
- zapper entry points.

Metrics can include market cap, supply, 24h supply change, TVL fee, mint fee, created date, website, and holder counts depending on layout.

## Details + Roles

Settings/details sections include:

- Basics.
- Governance token.
- Approved revenue tokens.
- Fees and revenue distribution.
- Basket governance.
- Non-basket governance.
- DAO governance.
- Roles.
- Distribute fees.

This page is a good source for how Register explains governance domains and fee recipient percentages.

## Invalid And Inactive Behavior

- Invalid chain/address redirects to not found.
- Deprecated DTFs are sell-only in zap flows.
- Deprecated/unsupported DTFs disable auctions.
- Inactive rows are hidden in discovery unless searching.

## Source References

- `register/src/app-routes.tsx`
- `register/src/views/index-dtf/index-dtf-container.tsx`
- `register/src/views/index-dtf/components/navigation/index.tsx`
- `register/src/state/dtf/atoms.ts`
- `register/src/hooks/useIndexDTF.ts`
- `register/src/hooks/useIndexPrice.ts`
- `register/src/hooks/use-dtf-status.ts`
- `register/src/views/index-dtf/overview/*`
- `register/src/views/index-dtf/settings/*`

## Do Not Infer

- Do not infer protocol permissions from navigation visibility alone.
- Do not infer chain support from generic app network maps.
- Do not encode Register atom names into SDK API names.
