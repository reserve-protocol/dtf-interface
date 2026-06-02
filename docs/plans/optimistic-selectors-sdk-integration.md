# Optimistic Selectors SDK Integration

## Status

Blocked until the Index DTF subgraph is deployed and reindexed with `Governance.optimisticSelectors`.

Do not add `optimisticSelectors { target selector }` to SDK GraphQL queries before that field exists on the runtime subgraph endpoint. Existing SDK DTF queries will fail at runtime if the deployed schema does not expose the field.

## Trigger

When the subgraph has finished indexing the selector registry entities, ask for:

`Implement docs/plans/optimistic-selectors-sdk-integration.md`

## Source References

- `dtf-index-subgraph/schema.graphql`: `Governance.optimisticSelectors` derived field.
- `dtf-index-subgraph/src/governance/mappings.ts`: `handleSelectorAdded` and `handleSelectorRemoved`.
- `dtf-index-subgraph/src/utils/getters.ts`: selector registry entity creation and current selector backfill.
- `packages/sdk/src/index-dtf/governance/selector-registry.ts`: current on-chain selector registry reader/builder helpers.
- `packages/sdk/src/index-dtf/subgraph/dtf.graphql`: DTF query to extend after the deployed schema supports the field.
- `packages/sdk/src/index-dtf/dtf/mappers.ts`: `mapOptimisticGovernanceSettings`.
- `packages/sdk/src/types/common.ts`: `OptimisticGovernanceSettings`.

## Current Implemented Boundary

SDK currently supports selector registry reads from RPC:

- `getIndexDtfSelectorRegistryTargets`
- `getIndexDtfSelectorRegistryAllowedSelectors`
- `getIndexDtfSelectorRegistryIsAllowed`
- `getIndexDtfOptimisticSelectors`

SDK currently supports selector registry proposal calldata builders:

- `prepareSelectorRegistryRegisterSelectors`
- `prepareSelectorRegistryUnregisterSelectors`

The DTF subgraph query should not request `Governance.optimisticSelectors` until the deployed subgraph schema supports it.

## Proposed SDK Scope

After the deployed subgraph supports `Governance.optimisticSelectors`, expose indexed optimistic selectors on `OptimisticGovernanceSettings`.

Add this type in `packages/sdk/src/types/common.ts`:

```ts
export type OptimisticGovernanceSelector = {
  readonly target: Address;
  readonly selector: Hex;
};
```

Add this field to `OptimisticGovernanceSettings`:

```ts
readonly selectors: readonly OptimisticGovernanceSelector[];
```

Add this selection to every optimistic governance block in `packages/sdk/src/index-dtf/subgraph/dtf.graphql`:

```graphql
optimisticSelectors {
  target
  selector
}
```

Run GraphQL codegen after the field exists on the configured schema endpoint:

`pnpm --filter @reserve-protocol/sdk graphql:codegen`

Map the field in `mapOptimisticGovernanceSettings`:

```ts
selectors: governance.optimisticSelectors.map((selector) => ({
  target: getAddress(selector.target),
  selector: selector.selector as Hex,
})),
```

Keep `getIndexDtfOptimisticSelectors` as the RPC fallback for callers that need fresh on-chain selector data before the subgraph catches up.

## Out Of Scope

- Do not change selector registry indexing in the SDK task.
- Do not add Register UI behavior that depends only on subgraph freshness; use the RPC helper when exact current selectors are required.
- Do not remove low-level selector registry helpers.

## Open Questions

- Should SDK sort indexed selectors by target then selector for stable UI output, or preserve subgraph event/order output?
- Should Register prefer indexed selectors for initial render and then hydrate with RPC, or use RPC only for the settings form?

## Validation Plan

1. Confirm the deployed subgraph schema exposes `Governance.optimisticSelectors`.
2. Run `pnpm --filter @reserve-protocol/sdk graphql:codegen`.
3. Run `pnpm --filter @reserve-protocol/sdk typecheck`.
4. Add or update a mapper test if this repo has DTF mapper fixtures available.
5. Confirm an optimistic DTF returns non-empty `governance.optimistic.selectors` when selectors are registered.
