# Data Sources

Reserve integrations should route reads by ownership, not convenience. A composed SDK method can combine sources, but each field should still have an explicit owner.

## Index DTF Source Rules

| Data                               | Source                                        | Why                                                     |
| ---------------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| Live basket assets and balances    | RPC `totalAssets()`                           | Basket is live onchain state                            |
| Live share supply                  | RPC `totalSupply()`                           | Includes pending fee shares                             |
| Current price and basket valuation | Reserve API `/current/dtf`, `/current/dtfs`   | API aggregates prices and weights                       |
| Discovery/status/listing           | Reserve API `/discover/dtf`, `/discover/dtfs` | Product listing and status are curated there            |
| Historical price/performance       | Reserve API historical endpoints              | API owns analytics windows                              |
| Governance metadata                | Index subgraph                                | Historical proposals, governances, roles                |
| Live proposal state                | RPC governor reads                            | Subgraph state can lag or be event-only                 |
| Rebalance history                  | Index subgraph and Reserve API analytics      | Subgraph indexes events; API computes product analytics |
| Active rebalance/auction           | RPC `getRebalance()` and contract reads       | Must be current                                         |
| Vote-lock positions/APR            | Reserve API `/dtf/daos`                       | API aggregates user-facing DAO stats                    |
| Holder counts/transfers            | Index subgraph token/account entities         | Transfer-derived indexed history                        |

## Yield DTF Source Rules

| Data                    | Source                                       | Why                                              |
| ----------------------- | -------------------------------------------- | ------------------------------------------------ |
| Basket/backing state    | RPC FacadeRead and component contracts       | Live protocol state                              |
| Governance/history      | Yield subgraph                               | Historical metadata and events                   |
| Staking/revenue history | Yield subgraph plus RPC for live state       | Subgraph has history; RPC has current state      |
| Discovery               | Yield subgraph plus supported-token registry | Raw deployments include unsupported/spam tokens  |
| Prices                  | Subgraph or RPC depending on surface         | No Index-style Reserve API dependency by default |

## Reserve API

Reserve API is not just a transport wrapper. It computes and aggregates product data that Register and the SDK depend on.

Common Index endpoints:

- `GET /current/dtf?address={address}&chainId={chainId}`
- `GET /current/dtfs?addresses={addresses}&chainId={chainId}`
- `GET /current/prices?chainId={chainId}&tokens={tokens}`
- `GET /discover/dtf?chainId={chainId}`
- `GET /discover/dtfs`
- `GET /dtf/daos`
- historical DTF, price, exposure, and rebalance analytics endpoints

Endpoint availability can change. Verify endpoint shape against SDK/API source before adding new wrappers.

## RPC

Use RPC for data that changes with the latest block or must match a block number:

- `totalAssets()`
- `totalSupply()`
- `getRebalance()`
- `rebalanceControl()`
- `bidsEnabled()`
- `getPendingFeeShares()`
- governor `state(proposalId)`
- staking vault balances, delegation, withdrawal state

Block-aware reads should be explicit. Do not combine a historical RPC read with current API prices unless the method name makes that tradeoff clear.

## Subgraphs

Use subgraphs for indexed metadata and history:

- DTF deployment metadata.
- Role changes.
- Governance/proposal/vote history.
- Transfer-derived holder analytics.
- Rebalance and auction events.
- Staking/vote-lock delegation, rewards, locks, and claims.

Do not use subgraphs as live truth for basket balances, prices, active auction state, or final proposal state.

## Register

Register is a product source, not a protocol source. Use it to verify:

- Page routes and deep links.
- UI defaults and disabled states.
- Deprecated/sell-only behavior.
- Proposal list/detail display behavior.
- Deploy wizard defaults.
- Zapper/manual issuance split.

Do not infer contract behavior from Register labels or form names without checking contracts.

## Source References

- `dtf-sdk/packages/sdk/src/client/api.ts`
- `dtf-sdk/packages/sdk/src/client/subgraph.ts`
- `dtf-sdk/packages/sdk/src/client/viem.ts`
- `register/docs/data-sources.md`
- `register/src/hooks/useIndexPrice.ts`
- `register/src/hooks/useIndexDTF.ts`
- `register/src/hooks/useIndexDTFList.ts`
- `register/src/views/earn/views/index-dtf/hooks/use-vote-lock-positions.ts`
- `dtf-index-subgraph/schema.graphql`

## Do Not Infer

- Do not use Reserve API discovery as proof of all deployed DTFs.
- Do not use subgraph deployment history as proof of product-listed status.
- Do not use current API data inside historical methods unless explicitly documented.
