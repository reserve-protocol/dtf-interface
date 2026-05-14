# SDK Architecture

The SDK is the TypeScript domain layer for Reserve DTF integrations. It should be product-shaped, source-aware, and boring.

## Shape

Public APIs should stay functional and namespaced:

```ts
const sdk = createDtfSdk();
const dtf = await sdk.index.get({ address, chainId });
const ref = sdk.index.ref({ address, chainId });
const proposal = await ref.getProposal(proposalId);
```

Refs are zero-network convenience handles. They bind `{ address, chainId }` but do not fetch or cache by themselves.

## Layers

```text
namespace methods -> client -> transports -> mappers/helpers
```

Keep responsibilities clear:

- namespace methods are public product actions.
- client owns runtime configuration.
- transports wrap Reserve API, subgraph, and viem.
- mappers convert raw data only.
- builders prepare `ContractCall` objects.

## Wallet Boundary

Core SDK should prepare calls, not send them.

It can return:

- `chainId`.
- `to`.
- `data`.
- `value`.
- ABI/function/args metadata.

Apps own:

- wallet connection.
- chain switching.
- simulation.
- transaction sending.
- notifications.
- post-transaction refresh.

## Data Boundaries

Do not hide source ownership in generic abstractions.

Good examples:

- `getBasket` for RPC basket state.
- `getPrice` for Reserve API price.
- `getProposals` for subgraph/RPC-aware governance data.
- `prepareMint` for contract calldata.

Bad direction:

- one generic source resolver that makes it unclear whether a field is API, RPC, or subgraph owned.

## Implementation Rules

- Keep code product-shaped.
- Prefer explicit functions over general frameworks.
- Use bigint for onchain amounts.
- Use decimal/string math for human price/value calculations.
- Keep token arrays in stable order.
- Mappers should not fetch, decode, or derive business state.
- Do not add fallback paths or compatibility modes unless there is a concrete product need.

## Source References

- `dtf-sdk/packages/sdk/src/index.ts`
- `dtf-sdk/packages/sdk/src/client/*`
- `dtf-sdk/packages/sdk/src/contract-call.ts`
- `dtf-sdk/packages/sdk/src/index-dtf/namespace.ts`
- `dtf-sdk/packages/sdk/src/index-dtf/*`

## Do Not Infer

- Do not add a public SDK abstraction because another SDK had one.
- Do not store browser wallet clients in long-lived SDK state.
- Do not make refs stateful model objects.
