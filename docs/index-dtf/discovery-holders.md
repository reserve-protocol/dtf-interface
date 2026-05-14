# Discovery And Holders

Discovery, product status, and holder analytics are separate concerns.

## Discovery Sources

### Reserve API Discovery

Primary product discovery comes from Reserve API:

- `/discover/dtf`: chain-scoped Index DTF discovery.
- `/discover/dtfs`: aggregate discovery used by Register list/status screens.

Register uses `/discover/dtfs?performance=true&brand=true`, filters `type === "index"`, and sorts by market cap for discovery tables.

### Catalog Discovery

The SDK can expose catalog-backed entries from `@dtf-interface/dtf-catalog`. Catalog entries are static/product-curated and useful for aliases or known products, not a complete onchain deployment list.

### Subgraph Fresh Discovery

Fresh/internal discovery can read recent DTF deployments from the Index subgraph and enrich them with Reserve API current prices. This is best-effort because price API coverage can lag new deployments.

Best-effort behavior should be explicit:

- exclude known addresses when requested.
- enrich priced rows.
- skip rows missing current price/basket data when the API cannot price them.
- fall back from batch current-price reads to single-address reads when needed.

## Status

Product status values include active/deprecated/unsupported depending on API data.

Register behavior:

- inactive DTFs are hidden by default in discovery unless searching.
- deprecated DTFs are sell-only in zap flows.
- deprecated/unsupported DTFs disable auction surfaces.
- missing status defaults to active in some fast-path SDK/Register behavior.

## Search And Filters

Register discovery search matches:

- DTF name.
- DTF symbol.
- brand tags.
- basket collateral symbols.

Chain filters include Ethereum, Base, and BSC for Index DTF product scope.

## Holder Data

Holder counts and holder balances are transfer-derived indexed data from the Index subgraph.

Useful fields/entities:

- token current holder count.
- account balances.
- account balance daily snapshots.
- token transfer/mint/burn counts.

Transfer-derived data has indexing limitations:

- It depends on the subgraph indexing from the relevant start block.
- Token metadata is fetched when first seen and may not refresh.
- Direct state changes outside normal transfer semantics can require special handling.

## Holder Concentration

SDK holder surfaces can compute concentration metrics from holder balances, such as top 5 or top 10 holder percentages. These are analytics derived from indexed balances, not protocol fields.

## Source References

- `register/src/hooks/useIndexDTFList.ts`
- `register/src/hooks/use-dtf-status.ts`
- `register/src/views/home/hooks/use-filtered-index-dtf.ts`
- `register/src/views/home/components/discover-index-dtf/*`
- `register/src/views/index-dtf/overview/components/fees-stats.tsx`
- `dtf-index-subgraph/src/token/*`
- `dtf-index-subgraph/src/account/*`
- `dtf-sdk/packages/sdk/src/index-dtf/dtf/discovery.ts`
- `dtf-sdk/packages/sdk/src/index-dtf/dtf/holders.ts`
- `dtf-sdk/packages/sdk/src/index-dtf/protocol/index.ts`

## Do Not Infer

- Do not treat catalog entries as complete deployment discovery.
- Do not treat subgraph deployments as product-listed DTFs.
- Do not treat holder concentration as an onchain protocol invariant.
