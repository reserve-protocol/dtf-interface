# Reserve Protocol Documentation

This directory is the shared source-of-truth context for Reserve Protocol work in this SDK. It is written for humans first, but structured so LLMs can load the right files quickly without guessing.

## How To Use

- Start with `source-manifest.md` when checking where a fact comes from.
- Start with `protocol/overview.md` when you need broad Reserve context.
- Start with `protocol/data-sources.md` when deciding whether to use RPC, Reserve API, or a subgraph.
- Start with `index-dtf/overview.md` for Index DTF product and mechanism work.
- Start with `index-dtf/governance.md` for proposal, voting, timelock, or optimistic governance work.
- Start with `subgraphs/index-dtf.md` for indexing, GraphQL, or missed-event questions.
- Start with `register/interface.md` when matching Register product behavior.
- Start with `decisions.md` when checking recent cross-cutting SDK/Register implementation decisions.
- Start with `plans/README.md` for pending implementation tracks that are not canonical SDK behavior yet.

## Source Hierarchy

Use sources in this order when docs conflict:

1. Contract and source code for protocol mechanics.
2. Register source for product behavior and UI rules.
3. Subgraph schema and mappings for indexed data semantics.
4. Current SDK source for exposed API and implementation behavior.
5. Public protocol docs for explanatory wording.
6. Historical notes and older docs only as pointers to verify elsewhere.

Do not copy facts from old docs without checking the source that owns the behavior.

## Canonical Terms

- **DTF**: Decentralized Token Folio, the umbrella product category.
- **Index DTF**: Folio-based onchain index fund. Basket is onchain, governance-driven rebalances create auctions.
- **Yield DTF**: Legacy RToken product. Backed by collateral baskets, uses stRSR staking and revenue distribution.
- **Folio**: The Index DTF contract/token implementation.
- **RToken**: Legacy technical/product name for Yield DTF tokens.
- **Vote-lock**: Index DTF governance token flow using a staking vault. Users lock an underlying token and delegate voting power.
- **stRSR**: Yield DTF staking position. RSR is staked against a Yield DTF for governance and overcollateralization.
- **Reserve API**: Reserve-hosted service for live prices, discovery, analytics, and vote-lock position data.
- **Index subgraph**: Goldsky/The Graph indexing layer for Index DTF metadata, governance, transfers, holders, rebalances, auctions, and staking-vault history.

## Task Reading Order

### Build Or Debug Index DTF Reads

1. `protocol/data-sources.md`
2. `index-dtf/overview.md`
3. `index-dtf/discovery-holders.md`
4. `subgraphs/index-dtf.md`
5. `sdk/api-surface.md`

### Build Mint, Redeem, Or Zap UX

1. `index-dtf/issuance-redemption.md`
2. `integrations/zapper.md`
3. `register/issuance-deploy-flows.md`
4. `protocol/data-sources.md`

### Build Governance Or Proposal Flows

1. `protocol/governance.md`
2. `index-dtf/governance.md`
3. `register/governance-flows.md`
4. `subgraphs/index-dtf.md`

### Work On Rebalances Or Auctions

1. `index-dtf/rebalance-auctions.md`
2. `index-dtf/contracts-and-versions.md`
3. `register/governance-flows.md`
4. `protocol/data-sources.md`

### Work On Revenue Or RSR

1. `protocol/rsr.md`
2. `index-dtf/revenue-fees.md`
3. `index-dtf/vote-lock.md`
4. `yield-dtf/revenue-staking.md`

### Pick Up Pending Implementation Work

1. `plans/README.md`
2. The specific plan file, such as `plans/zapper-integration.md`
3. The canonical docs that describe current behavior

## LLM Rules

- Prefer explicit source-backed facts over inferred behavior.
- Do not infer chain support from frontend network constants alone.
- Do not infer live basket state from the subgraph.
- Do not infer final proposal state from subgraph state alone.
- Do not treat archived, old, or public marketing docs as authoritative when source code disagrees.
- Do not treat `plans/` as implemented behavior. Plans describe intended or pending work.
- Do not hardcode live market data in code or docs.
- Keep examples product-shaped, not generic protocol abstractions.

## Freshness

These docs intentionally avoid volatile stats such as circulating supply, TVL, APR, live market cap, and exact active deployment lists unless the source is a contract/config file. For live values, use the data source documented in `protocol/data-sources.md`.
