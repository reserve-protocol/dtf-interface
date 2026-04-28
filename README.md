# dtf-interface

TypeScript monorepo for DTF interface packages.

## Packages

- `@dtf-interface/sdk`: Core environment-agnostic SDK for Node and browser/React consumers.
- `@dtf-interface/dtf-catalog`: Curated Yield DTF and Index DTF catalog, exported as chain maps like the old `@reserve-protocol/rtokens` package.

## Design Goal

This SDK is intentionally more opinionated than low-level libraries like viem. It should make common DTF workflows easy for apps, bots, scripts, and server code while still allowing advanced callers to override RPC providers, subgraph URLs, and the few API-backed providers that need replacement.

The core rule is:

> Namespace methods are the public SDK surface. The client holds runtime configuration. Transports stay small. Defaults make the SDK easy to use.

Read [docs/sdk-architecture.md](./docs/sdk-architecture.md) before adding large features.

## Commands

```sh
pnpm install
pnpm build
pnpm typecheck
pnpm test
```

## Quick Example

```ts
import { createDtfSdk } from "@dtf-interface/sdk";

const sdk = createDtfSdk();

const index = await sdk.index.get({
  address: "0x...",
  chainId: 8453,
});

const proposals = await sdk.index.proposals({
  address: "0x...",
  chainId: 8453,
});
```

Advanced callers can create a client to override defaults:

```ts
import { createDtfSdk } from "@dtf-interface/sdk";

const sdk = createDtfSdk({
  apiBaseUrl: "https://api.reserve.org",
  chains: {
    1: {
      rpcUrls: ["https://eth-mainnet.example"],
    },
  },
});

const dtfs = await sdk.index.list({ chainId: 1 });
```
