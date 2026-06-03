# Reserve DTF SDK

TypeScript monorepo for Reserve DTF SDK packages.

## Packages

- `@reserve-protocol/sdk`: Core environment-agnostic SDK for Node and browser/React consumers.
- `@reserve-protocol/react-sdk`: React Query hooks and providers on top of the core SDK.
- `@reserve-protocol/dtf-catalog`: Curated Yield DTF and Index DTF catalog, exported as chain maps like the old `@reserve-protocol/rtokens` package.

## Design Goal

This SDK is intentionally more opinionated than low-level libraries like viem. It should make common DTF workflows easy for apps, bots, scripts, and server code while still allowing advanced callers to prioritize custom RPC URLs, pass explicit viem clients, override subgraph URLs, and replace the few API-backed providers that need replacement.

Implemented SDK product surface:

- Index DTFs: Ethereum mainnet, Base, BSC.
- Account portfolio API reads: current portfolio, historical portfolio, and transactions.

Yield DTF catalog entries and subgraph defaults exist for Ethereum mainnet and Base, but `sdk.yield.get` and `sdk.yield.list` are not implemented yet.

The core rule is:

> Namespace methods are the public SDK surface. The client holds runtime configuration. Transports stay small. Defaults make the SDK easy to use.

Read [docs/sdk/architecture.md](./docs/sdk/architecture.md) before adding large features.

## Commands

```sh
pnpm install
pnpm build
pnpm typecheck
pnpm test
```

## Quick Example

```ts
import { createDtfSdk } from "@reserve-protocol/sdk";

const sdk = createDtfSdk();

const index = await sdk.index.get({
  address: "0x...",
  chainId: 8453,
});

const proposals = await sdk.index.getProposals({
  address: "0x...",
  chainId: 8453,
});
```

Advanced callers can create a client to prioritize custom RPC URLs and override API defaults:

```ts
import { createDtfSdk } from "@reserve-protocol/sdk";

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
