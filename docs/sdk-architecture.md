# SDK Architecture

This is the working design guide for `dtf-interface`. The project is still early, so the goal is not to freeze every API. The goal is to keep the foundation simple enough that the SDK can grow without turning into framework code.

## What This SDK Is

`@dtf-interface/sdk` is the shared TypeScript domain layer for DTF integrations:

- React apps, through `@dtf-interface/react-sdk`.
- Node scripts and bots.
- Server-side jobs.
- Internal Reserve code where it makes sense.

The SDK is intentionally more opinionated than viem. Viem must model Ethereum generally. This SDK can model Reserve DTFs directly: supported chains, subgraph entities, API-backed pricing, and DTF-specific workflows.

## Public Shape

The public API should stay functional and namespaced:

```ts
const sdk = createDtfSdk();

const dtf = await sdk.index.get({ address, chainId });
const dtfs = await sdk.index.list({ chainId });
const proposals = await sdk.index.getProposals({ address, chainId });
const price = await sdk.index.getPrice({ address, chainId });

const cmc20 = sdk.index.ref({ address, chainId });
const cmc20Details = await cmc20.get();
const cmc20Historical = await cmc20.get({ blockNumber: 123n });
const cmc20Basket = await cmc20.getBasket(123n);
const cmc20Proposals = await cmc20.getProposals();

const ydtf = await sdk.yield.get({ address, chainId });
```

`sdk.index.ref()` is a zero-network bound handle. It captures `{ client, address, chainId }` and forwards to the same functional actions used by the namespace methods.

This gives the readability of a domain SDK without creating stateful DTF model objects:

```ts
// Avoid this as the main public model.
const dtf = new DTF(address, chainId);
await dtf.getProposals();
```

Classes are not forbidden, but they should not be the default SDK surface. Stateless functions are easier to test, easier to compose, friendlier to tree-shaking, and less likely to hide network calls behind object lifecycle.

## Method Inputs

One-off methods should take plain inputs like `{ address, chainId }`.

Repeated workflows can bind that identity once:

```ts
const dtf = sdk.index.ref({ address, chainId });

await dtf.get();
await dtf.getPrice();
await dtf.getProposals();
await dtf.getRebalances();
```

The ref must not fetch or cache data by itself. It is only a convenience layer over the functional methods.

Methods that can accept either plain identity or a hydrated DTF should do so when it improves ergonomics:

```ts
await sdk.index.getProposals({ address, chainId });
await sdk.index.getProposals({ dtf });
```

The SDK should not require `getIndexDtf()` before fetching proposals. Consumers can decide whether their cache layer should hydrate the DTF first.

Block-aware reads should stay granular. Source-specific methods that can read historical state may accept `blockNumber`; composed methods should not unless every source in the composition is pinned to the same point in time.

```ts
await sdk.index.getDtf({ address, chainId, blockNumber: 123n }); // subgraph time travel
await sdk.index.getBasket({ address, chainId, blockNumber: 123n }); // onchain read at block
await sdk.index.get({ address, chainId }); // current-state composition only
```

## Layers

Keep the runtime model boring:

```text
namespace methods -> client -> small transports -> mappers
```

Namespace methods are the public SDK:

```ts
sdk.index.get();
sdk.index.getFull();
sdk.index.getBrand();
sdk.index.getPrice();
sdk.index.getProposals();
sdk.index.ref();
```

The client holds runtime configuration. `createDtfSdk(config)` returns an isolated plain object; it must not mutate global SDK state.

```ts
createDtfSdk({
  apiBaseUrl: "https://api.reserve.org",
  chains: {
    8453: {
      indexSubgraphUrl: "...",
      yieldSubgraphUrl: "...",
      rpcUrls: ["..."],
    },
  },
});
```

Keep `client.ts` as the assembly point. Client capabilities can live in small modules and be assembled into explicit namespaces:

```ts
const client = {
  api: createDtfClientApi({ baseUrl }),
  subgraph: createDtfClientSubgraph({ chains }),
  viem: createDtfClientViem({ chains }),
};
```

Module-level helpers may use production defaults, but custom configuration belongs to a created SDK instance or an explicitly passed transport client. Do not add global mutable SDK configuration.

Transports should be thin wrappers around known libraries:

- `graphql-request` for subgraphs.
- Native `fetch` for REST API calls.
- viem public clients for RPC reads.

Write builders should follow the same shape: core SDK methods prepare `ContractCall` values, and `sdk.index.ref()` only binds product identity like DTF address and chain. Wallet handling belongs to the consumer that sends the prepared call, not in DTF model objects.

Mappers translate raw GraphQL/API/RPC data into SDK domain types. They are where nullability, amount formatting, address normalization, and legacy fields should become clear.

## Wallet Clients

Do not store a browser wallet client as stable SDK state.

Viem treats public clients and wallet clients as low-level primitives. Public clients are stable enough to keep on the SDK client because they are chain/RPC configuration. Wallet clients are different: in React apps the connected account, connector, and chain can change while the SDK object continues to exist.

Core write surfaces should build calls, not send them:

```ts
const call = sdk.index.ref({ address, chainId }).prepareVote({
  governance,
  proposalId,
  support,
});
```

React apps should pass the built call to wagmi/viem simulation and write flows owned by the app. The SDK can provide the exact `to`, `data`, `value`, ABI, function name, and args, but it should not hide app-specific wallet state.

Bots or server scripts can create a viem wallet client through the SDK dependency when they want to avoid viem version drift:

```ts
const walletClient = createWalletClient({
  chainId,
  privateKey,
});
```

The React wrapper should keep query hooks focused on reads/builders. It should not capture wallet clients in long-lived SDK refs or provide protocol-specific mutation hooks unless there is a concrete product need.

## Data Boundaries

Keep index DTF data split by ownership:

```text
Onchain/subgraph:
  token metadata, supply snapshots, fees, roles, governance, vote lock vault,
  rebalance config, financial counters.

Reserve API:
  index pricing, current basket valuation, historical price series, brand data.

Yield DTF:
  currently subgraph/onchain sourced; no Reserve API dependency by default.
```

This boundary matters even if a high-level method later composes everything:

```ts
await sdk.index.get({ address, chainId }); // subgraph/onchain domain model
await sdk.index.getBasket({ address, chainId }); // onchain current holdings
await sdk.index.getPrice({ address, chainId }); // API-backed fresh price
await sdk.index.getBrand({ address, chainId }); // API-backed branding
await sdk.index.getFull({ address, chainId }); // composed convenience method
```

Price is live data and should be treated differently from slow-changing governance or token metadata. Consumers should be able to refresh price often without refetching the full DTF model.

Avoid mixing historical subgraph/onchain reads with current API data in the same result. If a future method needs historical composition, make it explicit instead of expanding `getFull()`.

## Overrides

Do not add a large generic "sources" system right now. It made the foundation harder to read.

Supported override points should stay narrow:

- `chains[chainId].indexSubgraphUrl`
- `chains[chainId].yieldSubgraphUrl`
- `chains[chainId].rpcUrls`
- `chains[chainId].publicClient`
- `indexPricingProvider`
- `indexBrandProvider`

That is enough for external users, tests, bots, and internal API code without forcing every domain operation through a custom source interface.

If the Reserve API uses the SDK, it should avoid SDK methods that call its own public API unless it explicitly provides an internal `indexPricingProvider`. Keep that replacement scoped to pricing instead of abstracting the whole SDK.

## GraphQL Pattern

Store GraphQL documents in `.graphql` files close to the domain:

```text
packages/sdk/src/index-dtf/subgraph/dtf.graphql
packages/sdk/src/index-dtf/subgraph/dtf.generated.ts
```

Run codegen after editing documents:

```sh
pnpm graphql:codegen
```

The SDK should import generated typed documents and pass them to the subgraph transport:

```ts
const { dtf } = await client.subgraph.queryIndex({
  chainId,
  query: GetIndexDtfDocument,
  variables: { id },
});
```

This keeps query strings out of domain methods while still making the request path easy to follow.

## Subgraph Helpers

Use the small helpers by intent:

```ts
await client.subgraph.queryIndex({ chainId, query, variables });
await client.subgraph.queryYield({ chainId, query, variables });
await client.subgraph.queryIndexAll({ query, variables });
```

Use product-specific helpers. Callers should not pass `product: "index"` or `product: "yield"` around application code.

`queryIndexAll` exists for "same query across every supported index subgraph" cases. It returns a chain-keyed result:

```ts
const results = await client.subgraph.queryIndexAll({ query });
// { 1: Result, 56: Result, 8453: Result }
```

Keep these helpers thin. Do not wrap `graphql-request` in a stateful GraphQL client unless real state appears.

## Domain Types

Prefer types that read like the product:

```ts
type TokenAmount = {
  raw: bigint;
  formatted: string;
};
```

Use `readonly` for SDK return types by default. It communicates that returned domain objects are snapshots, not mutable SDK state. It also makes accidental consumer mutation less likely.

Use optional fields when the real product allows absence:

- A DTF may have no governance.
- A DTF may have no vote lock vault.
- Vote lock vault governance may be missing.
- V5-only rebalance fields may be missing on older entities.

Do not encode unsupported theoretical cases just because contracts allow them. If the subgraph and product do not support a case, keep the SDK model honest and simple.

## Governance Model

Index DTF governance should distinguish two things:

- A plain address authority.
- A governance authority with governor/timelock metadata.

That is enough to represent the important cases:

- Three-governor DTF: admin, rebalance, vote lock.
- Future two-governor DTF: shared admin/rebalance, vote lock.
- Centralized rebalance: governance admin, plain address approver.
- Fully centralized: plain address admin and approver, no vote lock.

Keep repeated shapes consistent:

```ts
type AuthorityGroup = {
  primary?: Authority;
  all: readonly Authority[];
  legacy: readonly Address[];
};
```

The `legacy` addresses matter because old executed proposals still need to be shown after governance changes.

## Testing

Test at the lowest useful layer:

- Transport tests should stub `globalThis.fetch`.
- Mapper tests should use raw DTO fixtures and assert domain output.
- Namespace tests should verify composition and errors.

Avoid empty placeholder tests. They make the project look more covered than it is.

## When To Add Abstraction

Add an abstraction only when it removes real repeated complexity.

Good reasons:

- The same request mechanics appear in several domains.
- A raw GraphQL shape needs consistent domain mapping.
- An override point is required by a real consumer.

Weak reasons:

- A future implementation might need it.
- It feels more "SDK-like."
- A generalized library would do it that way.

For this SDK, boring code is usually the better foundation.
