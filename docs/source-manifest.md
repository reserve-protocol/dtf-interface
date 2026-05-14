# Source Manifest

This file records which source owns which facts. Source references use `repo/path` when they cross repository boundaries and repo-relative paths inside a repo's own section. Do not use local absolute paths.

## Primary Repos

### `dtf-sdk`

Owns the SDK behavior documented in this repository.

- `packages/sdk/src/index.ts`: package exports.
- `packages/sdk/src/index-dtf/index.ts`: Index DTF top-level exports.
- `packages/sdk/src/index-dtf/namespace.ts`: `sdk.index` namespace and ref shape.
- `packages/sdk/src/index-dtf/dtf/*`: Index DTF reads, basket, issuance, discovery, holders.
- `packages/sdk/src/index-dtf/governance/*`: governance reads, proposal actions, proposal builders.
- `packages/sdk/src/index-dtf/deploy/*`: deploy builders and deploy event helpers.
- `packages/sdk/src/index-dtf/subgraph/*`: SDK GraphQL queries and generated Index subgraph types.
- `packages/sdk/src/client/*`: Reserve API, subgraph, and viem client boundaries.

Use this repo to verify current SDK API names and examples.

### `reserve-index-dtf`

Owns Index DTF contract mechanics.

- `contracts/Folio.sol`: core Folio token, mint/redeem, fees, rebalances, auctions, roles.
- `contracts/interfaces/IFolio.sol`: external structs, events, and function signatures.
- `contracts/utils/FolioLib.sol`: fee recipient validation, TVL fee, mint fee, pending fee math.
- `contracts/utils/RebalancingLib.sol`: rebalance validation, auction opening, bid sizing, Dutch price curve, trusted fills.
- `contracts/utils/Constants.sol`: role hashes and protocol limits.
- `contracts/deployer/FolioDeployer.sol`: ungoverned and governed Folio deployment.
- `contracts/folio/FolioVersionRegistry.sol`: registered versions and latest-version/deprecation behavior.
- `contracts/folio/FolioProxy.sol`: proxy upgrade-to-version behavior.
- `contracts/folio/FolioDAOFeeRegistry.sol`: DAO/platform fee recipient, fee numerator, fee floor, overrides.
- `contracts/governance/FolioGovernor.sol`: Index DTF governor wrapper and dynamic proposal threshold.
- `contracts/utils/Versioned.sol`: current source version string.
- `CHANGELOG.md`: verified version deltas.
- `script/Deploy.s.sol`: deployment wiring and registry/deployer configuration.

Use this repo to verify protocol-level Index DTF mechanics. Do not copy old function signatures without checking the current ABI/version targeted by this SDK.

### `register`

Owns product behavior for the Register interface.

- `src/app-routes.tsx`: route tree, deep-link shape, page slugs.
- `src/views/index-dtf/index-dtf-container.tsx`: Index DTF container, context setup, updaters, chain/address validation.
- `src/state/dtf/atoms.ts`: product state model and derived product permissions.
- `src/hooks/useIndexDTF.ts`: Index subgraph metadata read and mapping.
- `src/hooks/useIndexPrice.ts`: Reserve API current basket/price read.
- `src/hooks/use-dtf-status.ts`: active/deprecated/unsupported status behavior.
- `src/hooks/useIndexDTFList.ts`: discovery endpoint and Register filtering source.
- `src/views/index-dtf/issuance/*`: zapper and manual mint/redeem flows.
- `src/views/index-dtf/governance/*`: governance hub, proposals, proposal detail, vote/delegate/queue/execute flows.
- `src/views/index-dtf/governance/views/propose/*`: proposal creation flows.
- `src/views/index-dtf/deploy/*`: permissionless deploy product defaults, validation, revenue distribution.
- `src/views/index-dtf/settings/*`: details, roles, fee distribution, governance settings.
- `src/views/earn/views/index-dtf/*`: vote-lock position UI and Reserve API use.

Use this repo to verify UI state, default values, page behavior, and product assumptions. Do not infer protocol behavior from UI names alone.

### `dtf-index-subgraph`

Owns Index DTF indexed data semantics.

- `schema.graphql`: entity fields and relationships.
- `subgraph.yaml.mustache`: multi-network manifest template.
- `networks.json`: chain/deployer template configuration.
- `src/deploy/*`: deployer events, DTF creation, governed deployment attachment.
- `src/dtf/*`: Folio events, fees, roles, rebalances, auctions, bids.
- `src/governance/*`: governor, proposal, vote, timelock, optimistic governance indexing.
- `src/staking-token/*`: staking/vote-lock transfers, delegation, rewards, locks.
- `src/token/*`: ERC20 transfer-derived token/holder/snapshot indexing.
- `src/utils/getters.ts`: get-or-create helpers and cross-entity attachment logic.
- `src/utils/rebalance.ts`: rebalance/auction entity helpers.

Use this repo to verify GraphQL IDs, indexed fields, data limitations, and subgraph-only history. Do not treat subgraph state as live onchain truth when RPC is required.

### `reserve-sdk`

Reference implementation and historical context. Useful, but verify against current sources.

- `docs/KNOWLEDGE.md`: high-signal context and gotchas.
- `docs/subgraph-reference.md`: useful Index subgraph notes, verify against current `dtf-index-subgraph`.
- `docs/yield-dtf-reference.md`: useful Yield DTF context, verify against current source.
- `docs/api-reference.md`: Reserve API endpoint inventory, verify against API/client source.
- `docs/rebalance-lib-reference.md`: useful rebalance math notes.
- `packages/sdk/src/*`: older SDK behavior and endpoint wrappers.

Treat this repo as a guide, not an authority, when it conflicts with source contracts/Register/current SDK.

### `protocol-docs-website`

Public-facing explanatory docs. Useful for wording and broad descriptions.

- `protocol_pages/protocol/index_dtfs/*`: Index DTF public docs.
- `protocol_pages/protocol/yield_dtfs/*`: Yield DTF public docs.
- `protocol_pages/protocol/reserve_rights_rsr.md`: public RSR explanation.
- `protocol_pages/blog/posts/*`: launch posts and product framing.

Use public docs for concepts and user-facing language. Verify technical claims before making them canonical here.

## Source Ownership By Topic

| Topic | Primary Source | Secondary Source |
| --- | --- | --- |
| Index DTF mint/redeem | `reserve-index-dtf/contracts/Folio.sol` | `register/src/views/index-dtf/issuance/*` |
| Index DTF fees | `reserve-index-dtf/contracts/utils/FolioLib.sol` | `register/src/views/index-dtf/settings/*` |
| Index DTF auctions | `reserve-index-dtf/contracts/utils/RebalancingLib.sol` | `register/src/views/index-dtf/governance/views/propose/basket/*` |
| Index DTF versions | `reserve-index-dtf/CHANGELOG.md` | `dtf-sdk/packages/sdk/src/index-dtf/versions.ts` |
| Register routes | `register/src/app-routes.tsx` | `register/docs/*` |
| Register discovery | `register/src/hooks/useIndexDTFList.ts` | `dtf-sdk/packages/sdk/src/index-dtf/dtf/discovery.ts` |
| Proposal UI state | `register/src/lib/governance.ts` | `dtf-index-subgraph/src/governance/*` |
| Optimistic governance indexing | `dtf-index-subgraph/src/governance/*` | `dtf-index-subgraph/docs/optimistic-governance.md` |
| Vote-lock UI | `register/src/views/index-dtf/overview/components/staking/*` | `reserve-index-dtf/contracts/deployer/FolioDeployer.sol` |
| Index vote-lock/governance relationships | `dtf-index-subgraph/src/staking-token/*` | `dtf-index-subgraph/src/deploy/*` |
| Index subgraph IDs | `dtf-index-subgraph/src/*` | `dtf-index-subgraph/schema.graphql` |
| SDK API names | `dtf-sdk/packages/sdk/src/index.ts` | `dtf-sdk/packages/sdk/src/index-dtf/namespace.ts` |
| Yield DTF mechanics | `reserve-sdk/docs/yield-dtf-reference.md` | `protocol-docs-website/protocol_pages/protocol/yield_dtfs/*` |
| Yield SDK boundary | `dtf-sdk/packages/sdk/src/create-dtf-sdk.ts` | `dtf-sdk/docs/yield-dtf/*` |

## Do Not Use As Sole Authority

- Old gap analyses, audits, and planning docs.
- Public docs that mention outdated chain support.
- Frontend network maps that include legacy chains.
- Generated subgraph manifests for one network when a mustache template and `networks.json` drive multi-network behavior.
- Live market numbers copied into markdown.
