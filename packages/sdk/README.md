# @dtf-interface/sdk

Core TypeScript SDK for DTF integrations.

This package is environment-agnostic. It should work in modern Node, browser apps, React wrappers, scripts, and bots.

## Usage

```ts
import { createDtfSdk } from "@dtf-interface/sdk";

const sdk = createDtfSdk();

const dtf = await sdk.index.get({
  address: "0x...",
  chainId: 8453,
});
```

With explicit configuration:

```ts
import { createDtfSdk } from "@dtf-interface/sdk";

const sdk = createDtfSdk({
  apiBaseUrl: "https://api.reserve.org",
  rpcUrls: {
    1: ["https://eth-mainnet.example"],
  },
});

const dtfs = await sdk.index.list({ chainId: 1 });
```

## Design

The SDK uses a small domain facade over replaceable sources.

```ts
const ref = sdk.index.ref({ address: "0x...", chainId: 8453 }); // no fetch

await sdk.index.get(ref);
await sdk.index.proposals(ref);
```

Do not add a class-based SDK surface unless there is a strong reason.

The intended long-term model:

```text
namespace methods -> client -> sources -> transports
```

See [../../docs/sdk-architecture.md](../../docs/sdk-architecture.md).
