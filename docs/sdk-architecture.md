# SDK Architecture

This document is the working design guide for `dtf-interface`. It explains the shape of the SDK, why it is structured this way, and how to extend it without boxing the project into a bad API.

The target reader is a senior engineer who knows TypeScript and application architecture, but has not built a public SDK before.

## What This SDK Is

`@dtf-interface/sdk` should be the shared DTF domain layer for:

- React apps, through a future `@dtf-interface/react` wrapper.
- Node scripts.
- Bots.
- Server-side jobs.
- The Reserve API itself.

The SDK is not trying to be as general as viem. Viem has to support the whole Ethereum ecosystem. This SDK can be much more opinionated because it knows about DTFs, Reserve API endpoints, Reserve subgraphs, supported chains, and DTF contract behavior.

That opinionated default is a feature. The important constraint is that opinionated must not mean hardcoded in a way that prevents internal reuse.

## Core Principle

Namespace methods are stable public SDK functions.

Sources are replaceable implementation details.

Defaults make the SDK easy to use.

In practice:

```ts
const sdk = createDtfSdk();
const dtfs = await sdk.index.list({ chainId: 8453 });
```

should work for a normal external user with no configuration.

But the same namespace method should also be usable in controlled environments:

```ts
const sdk = createDtfSdk({ client: internalApiClient });
const dtf = await sdk.index.get({ address, chainId });
```

The caller should not have to learn the whole data-routing system just to fetch DTFs. But the SDK must still expose enough seams for the Reserve API, bots, and tests to replace default behavior.

## Why Not A Class

Avoid this as the core shape:

```ts
const dtf = new Dtf("0x...", 8453);
await dtf.proposals();
```

Classes are not automatically bad, but they are rarely the best shape for a modern TypeScript SDK:

- They encourage a large method bucket over time.
- They make tree-shaking less obvious.
- They make standalone source functions harder to test.
- They hide dependencies behind instance state.
- They tend to grow into inheritance or lifecycle problems.

The preferred shape is a domain facade over functional sources:

```ts
const sdk = createDtfSdk();
const dtf = await sdk.index.get({ address, chainId });
```

And for the common case:

```ts
const dtf = await createDtfSdk().index.get({ address, chainId });
```

The SDK facade owns no domain state. It delegates to `client.sources.*`.

## Mental Model

Think in four layers:

```text
Namespace method
  Domain operation: sdk.index.get, sdk.index.proposals, sdk.yield.get.

Client
  Runtime configuration: API URL, subgraph URLs, viem clients, fetch options.

Source
  Concrete implementation for a kind of data: public API, internal service,
  subgraph, RPC, database, cache, mock.

Transport
  Low-level request mechanics: fetch HTTP, GraphQL POST, viem RPC call.
```

The application should usually create one SDK facade and call namespaced methods.

The SDK internals use clients, sources, and transports.

## The Public API Should Feel Small

External users should usually write:

```ts
import { createDtfSdk } from "@dtf-interface/sdk";

const sdk = createDtfSdk();
const dtf = await sdk.index.get({ address, chainId });
```

or:

```ts
import { createDtfSdk } from "@dtf-interface/sdk";

const sdk = createDtfSdk({
  rpcUrls: {
    1: [process.env.MAINNET_RPC_URL!],
  },
});

const dtfs = await sdk.index.list({ chainId: 1 });
```

They should not need to know about Goldsky URLs, fallback RPCs, GraphQL clients, or Reserve API routing unless they are doing something advanced.

## The Internal API Problem

Some SDK namespace methods will naturally correspond to public API endpoints:

```text
GET /current/dtf
GET /current/prices
GET /historical/dtf
GET /discover/dtfs
```

For external consumers, using `https://api.reserve.org` is correct.

For the Reserve API itself, hardcoding those public endpoints inside namespace methods is a problem:

```text
API route
  -> SDK namespace method
    -> https://api.reserve.org/current/dtf
      -> API route
```

That can create recursion, extra latency, duplicate caching layers, and confusing ownership.

The fix is source injection.

A namespace method should not mean "call the public API." It should mean "perform this domain operation using the configured source."

Default external client:

```ts
const client = createDtfClient();
```

Internal API client, eventually:

```ts
const client = createDtfClient({
  sources: {
    index: {
      get: getIndexDtfFromInternalService,
    },
    tokenPrices: {
      getCurrent: getPricesFromAggregator,
    },
  },
});
```

Both callers should use the same namespace method:

```ts
await sdk.index.get({ address, chainId });
```

The public namespace method stays stable. The source behind it changes.

## Source Interfaces

Source interfaces are the contracts that alternative implementations must match. This is the mechanism that prevents `reserve-api` from calling its own public HTTP routes through the SDK.

Do not start with one giant interface. Prefer small source groups:

```ts
export type IndexDtfSource = {
  get(params: GetIndexDtfParams): Promise<IndexDtf>;
  getMany(params: GetIndexDtfsParams): Promise<readonly IndexDtf[]>;
  list(params?: ListIndexDtfsParams): Promise<readonly IndexDtfListItem[]>;
};

export type YieldDtfSource = {
  get(params: GetYieldDtfParams): Promise<YieldDtf>;
  getMany(params: GetYieldDtfsParams): Promise<readonly YieldDtf[]>;
  list(params?: ListYieldDtfsParams): Promise<readonly YieldDtfListItem[]>;
};

export type TokenPriceSource = {
  getCurrent(params: GetTokenPricesParams): Promise<readonly TokenPrice[]>;
};
```

Then compose them:

```ts
export type DtfSources = {
  index: IndexDtfSource;
  yield: YieldDtfSource;
  tokenPrices: TokenPriceSource;
};
```

This lets the Reserve API override only the sources it owns internally while keeping SDK defaults for everything else.

Example:

```ts
const internalClient = createDtfClient({
  sources: {
    index: {
      get: ({ chainId, address }) =>
        indexDTFService.getCurrentPriceAndBasket(chainId, address),
      getMany: ({ chainId, addresses }) =>
        indexDTFService.getCurrentPricesAndBaskets(chainId, [...addresses]),
    },
    tokenPrices: {
      getCurrent: ({ chainId, tokens, minConsensusSources }) =>
        priceServices[chainId].getCurrentPrices([...tokens], minConsensusSources),
    },
  },
});
```

The shape above is the current direction: source interfaces are part of the skeleton and should remain the first extension point for new domain behavior.

## Namespace Design

A namespace method should be a small domain operation with typed input and output.

Good:

```ts
const sdk = createDtfSdk();
const ref = sdk.index.ref({ address, chainId }); // no network call

await sdk.index.get(ref);
await sdk.index.proposals(ref);
```

Avoid:

```ts
const dtf = await sdk.index.get({ address, chainId });
await dtf.proposals();
```

Reasons:

- Positional params become hard to evolve.
- Returned data objects should stay serializable and cache-friendly.
- Method calls on data objects hide network requests.
- React Query hooks are easier when fetches are namespace methods.

Use an options object even if there are only one or two params:

```ts
await sdk.index.get({ address, chainId });
```

This is easier to extend later:

```ts
await sdk.index.get({
  address,
  chainId,
});
```

## Client Design

The client should be a plain object created by a factory. Most users should use `createDtfSdk()`, which creates a client internally.

```ts
const sdk = createDtfSdk({
  apiBaseUrl: "https://api.reserve.org",
  subgraphUrls: {
    8453: "https://api.goldsky.com/...",
  },
  rpcUrls: {
    1: ["https://eth-mainnet.example"],
  },
});
```

The client is not the main user experience. It is the configuration object namespace methods use.

The default client should work with zero config:

```ts
await createDtfSdk().index.list();
```

But the client should support:

- Custom API base URL for staging.
- Custom subgraph URLs.
- Custom RPC URLs.
- Injected viem public clients.
- Injected fetch implementation for tests or nonstandard runtimes.
- Injected source implementations.

## Defaults

Defaults should encode Reserve's current production choices:

- API base URL: `https://api.reserve.org`
- Supported chains: mainnet, Base, Arbitrum, BSC
- Goldsky DTF index subgraphs where available
- viem public clients for RPC-backed operations

Defaults should be centralized in `src/defaults.ts`.

Do not scatter URLs and chain IDs across namespace or source files.

## Data Routing Guidance

Use the same source-of-truth rules that Register already documents:

```text
Basket tokens + balances       RPC / viem
Token prices                   Reserve API
Current DTF display data       Reserve API
DTF metadata                   Subgraph
Rebalance state                RPC / viem
Proposal state                 RPC / viem
Historical data                Reserve API
Revenue data                   Subgraph + Reserve API
Vote-lock yield                Reserve API
```

This does not mean every namespace method must be a thin wrapper over exactly one source. Opinionated methods can compose multiple sources.

For example:

```ts
sdk.index.overview()
  -> current DTF from API
  -> metadata from subgraph
  -> live basket from RPC if requested
```

The namespace method should hide the annoying details when there is a clear product-level operation.

## React Wrapper Direction

The React package should not reimplement domain logic.

It should wrap SDK namespace methods in React Query hooks:

```ts
export function useIndexDTF(params: GetIndexDtfParams) {
  const sdk = useDtfSdk();

  return useQuery({
    queryKey: ["index-dtf", params.chainId, params.address],
    queryFn: () => sdk.index.get(params),
  });
}
```

The React wrapper owns:

- Providers.
- Hook ergonomics.
- React Query keys.
- Loading/error states.
- Refetch intervals.

The core SDK owns:

- Domain namespace methods.
- Data source contracts.
- Runtime-independent TypeScript types.
- API/subgraph/RPC implementations.

## File Layout

Current baseline:

```text
packages/sdk/src/
  clients/
    create-dtf-client.ts
  sdk/
    create-dtf-sdk.ts
  sources/
    api.ts
    merge.ts
    types.ts
  types/
    common.ts
    index-dtf.ts
    yield-dtf.ts
  transports/
    api.ts
    subgraph.ts
  defaults.ts
  index.ts
```

Likely future layout:

```text
packages/sdk/src/
  clients/
    create-dtf-client.ts
  sources/
    api/
      current-dtf.ts
      prices.ts
      historical.ts
    rpc/
      basket.ts
      rebalance.ts
    subgraph/
      metadata.ts
      governance.ts
    types.ts
  transports/
    api.ts
    subgraph.ts
  types/
    dtf.ts
    prices.ts
    governance.ts
```

Keep namespace methods small. Push request mechanics into sources/transports.

## Type Design

SDK types are public API.

Be conservative:

- Prefer `readonly` output shapes.
- Prefer options objects over positional params.
- Use viem's `Address` type for EVM addresses when appropriate.
- Normalize addresses at source boundaries when the protocol expects lowercase IDs.
- Avoid `any`.
- Avoid leaking raw API response types if the SDK wants to promise a cleaner domain type.

Example:

```ts
import type { Address } from "viem";

export type GetCurrentDtfParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
};
```

If an API response is unstable, keep the raw type internal and map it into a stable exported type.

## Error Design

Start simple with `Error`, but keep errors actionable:

```ts
throw new Error(`No DTF subgraph configured for chain id: ${chainId}`);
```

Later, introduce typed SDK errors if callers need structured handling:

```ts
class DtfSdkError extends Error {
  constructor(
    message: string,
    readonly code: DtfSdkErrorCode,
    readonly cause?: unknown,
  ) {
    super(message);
  }
}
```

Do not swallow source errors in namespace methods unless the method has a clear fallback policy.

## Testing Strategy

Test by layer:

- Namespace methods: inject fake clients or fake sources.
- Sources: mock transport responses.
- Transports: test URL/query/body/error behavior.
- React hooks later: test query keys and hook states.

The source-interface model makes namespace tests simple:

```ts
const client = createDtfClient({
  sources: {
    index: {
      get: async () => fakeDtf,
    },
  },
});

const sdk = createDtfSdk({ client });
await expect(sdk.index.get({ address, chainId })).resolves.toEqual(fakeDtf);
```

## What To Avoid

Avoid hardcoding `api.reserve.org` inside namespace methods.

Avoid components importing viem/wagmi directly through the React wrapper. Components should use hooks.

Avoid putting React Query in the core SDK.

Avoid one massive `getEverything()` method unless it maps to a real product workflow.

Avoid creating abstractions before at least two namespace methods need them.

Avoid exposing raw implementation dependencies as required user config.

## Is The Current Base Solid?

Yes as a skeleton:

- pnpm monorepo is in place.
- The root package is private and package scripts recurse across workspaces.
- TypeScript is strict.
- The SDK package emits ESM and declaration files.
- viem is a runtime dependency of the SDK.
- The client is a plain factory-created object, not a class.
- Default API/subgraph/chain config is centralized.
- Namespace methods can be called without manually creating a client.

The main thing still to add before this becomes a real SDK is more domain coverage behind these source interfaces, not a different public architecture.

## Recommended Next Step

The first vertical slice is now scaffolded:

```text
sdk.index.get()
sdk.index.getMany()
sdk.index.list()
sdk.yield.get()
sdk.yield.list()
sdk.tokenPrices.getCurrent()
```

Next, wire `reserve-api` to provide internal sources for index DTF and token pricing. If that feels clean, the architecture is probably right.
