# @dtf-interface/sdk

Core TypeScript SDK for DTF integrations.

This package is environment-agnostic. It should work in modern Node, browser apps, React wrappers, scripts, and bots.

Supported products and chains:

- Index DTFs: Ethereum mainnet, Base, BSC.
- Yield DTFs: Ethereum mainnet, Base.

## Usage

```ts
import { createDtfSdk } from "@dtf-interface/sdk";

const sdk = createDtfSdk();

const dtf = await sdk.index.get({
  address: "0x...",
  chainId: 8453,
});

const cmc20 = sdk.index.ref({
  address: "0x...",
  chainId: 8453,
});

const proposals = await cmc20.proposals();
const price = await cmc20.getPrice();
const brand = await cmc20.getBrand();
const basketAtBlock = await cmc20.basket(123n);
```

With explicit configuration:

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

## Playground

Run a live Index DTF fetch and print real data:

```sh
pnpm playground:index
```

You can also pass `address chainId`:

```sh
pnpm playground:index 0x4da9a0f397db1397902070f93a4d6ddbc0e0e6e8 8453
```

This is intentionally not part of the normal test suite or CI path.

## Errors

SDK errors use stable machine-readable codes:

```ts
import { isSdkError } from "@dtf-interface/sdk";

try {
  await sdk.index.get({ address, chainId });
} catch (error) {
  if (isSdkError(error) && error.code === "INDEX_DTF_NOT_FOUND") {
    // handle known SDK error
  }
}
```

## Design

The SDK uses a small domain facade over a runtime client. One-off methods take plain inputs like `{ address, chainId }`. Repeated DTF workflows can use `sdk.index.ref({ address, chainId })`, which only binds identity and does not fetch by itself.

Do not add a class-based SDK surface unless there is a strong reason.

The intended model:

```text
namespace methods -> client -> small transports -> mappers
```

See [../../docs/sdk-architecture.md](../../docs/sdk-architecture.md).
