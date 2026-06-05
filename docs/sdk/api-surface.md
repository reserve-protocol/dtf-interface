# SDK API Surface

This doc summarizes the implemented public API shape. Verify exact exports in source before adding examples to public docs.

## Entry Points

Main package exports live in:

- `packages/sdk/src/index.ts`
- `packages/sdk/src/index-dtf/index.ts`
- `packages/sdk/src/index-dtf/namespace.ts`

## Namespaces

`createDtfSdk()` returns these namespaces:

- `sdk.index`: implemented Index DTF reads, builders, and refs.
- `sdk.portfolio`: implemented portfolio helpers.
- `sdk.yield`: placeholder boundary only; `yield.get` and `yield.list` throw `NOT_IMPLEMENTED`.

## Index Namespace

The Index namespace currently exposes product actions such as:

- get DTF metadata.
- get basket/current state.
- get price/API-backed views.
- discover/list DTFs.
- get holders.
- get proposals/proposal detail.
- prepare governance actions.
- prepare mint/redeem calls.
- prepare deploy calls.
- build proposal calls.

Do not document Zapper quote/deploy/zap methods here until code exists. Current Zapper behavior and pending SDK work live in `docs/integrations/zapper.md` and `docs/plans/zapper-integration.md`.

## Refs

`sdk.index.ref({ address, chainId })` binds identity and forwards to namespace methods.

Ref rules:

- no network call on creation.
- no hidden cache.
- flat methods where possible: `ref.get()`, `ref.getProposal(id)`, `ref.prepareMint(params)`.
- use object params when multiple non-bound values are required.

## Contract Calls

Write builders return `ContractCall` objects or `ContractCallPlan` objects.

`ContractCall` includes:

- `chainId`.
- `to`.
- `data`.
- `value`.
- `contract.address`.
- `contract.abi`.
- `contract.functionName`.
- `contract.args`.

`ContractCallPlan` can be either:

- direct call.
- approval-required plan with approvals and call.

## Source-Specific Reads

Prefer names that reveal behavior:

- discovery/listing methods can be API-backed.
- subgraph discovery should say it uses subgraph when that matters.
- historical methods should identify source and time behavior.
- RPC live state methods should support block numbers only when every field can be pinned.

## Examples

Keep examples small and compile-check them before publishing externally. These docs are internal source-of-truth context, not generated API reference.

## Source References

- `dtf-sdk/packages/sdk/src/index.ts`
- `dtf-sdk/packages/sdk/src/create-dtf-sdk.ts`
- `dtf-sdk/packages/sdk/src/index-dtf/index.ts`
- `dtf-sdk/packages/sdk/src/index-dtf/namespace.ts`
- `dtf-sdk/packages/sdk/src/lib/contract-call.ts`

## Do Not Infer

- Do not invent API names in docs before checking exports.
- Do not put pending plan APIs in canonical API docs.
