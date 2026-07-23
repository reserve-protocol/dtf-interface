# @reserve-protocol/react-sdk

React Query hooks and providers for Reserve DTF integrations. The package re-exports `@reserve-protocol/sdk`, so React apps can use one import surface for core types/functions and hooks.

## Setup

Install the React SDK with its peer dependencies:

```sh
pnpm add @reserve-protocol/react-sdk @tanstack/react-query react viem
```

Mount TanStack Query and the DTF SDK once near the app root:

```tsx
import { DtfSdkProvider } from "@reserve-protocol/react-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DtfSdkProvider>{children}</DtfSdkProvider>
    </QueryClientProvider>
  );
}
```

Keep `chains` and other provider configuration referentially stable. For application-specific setup, create one SDK instance and pass `sdk={sdk}`.

## Hooks and query options

```tsx
import { useIndexDtfPrice } from "@reserve-protocol/react-sdk";

const price = useIndexDtfPrice({ address, chainId });
```

Query-backed core reads expose matching `*QueryOptions` exports for loaders, prefetching, `useQueries`, and direct query-client use. Required params accept `undefined` and disable the query. Query keys normalize addresses, bigints, object order, and omitted values. `useIndexDtfStatus` is a synchronous catalog lookup, so it returns the status directly and has no query options or cache key.

Freshness defaults:

- live price/auction/issuance state: 10 seconds;
- normal governance/account state: 30 seconds;
- identity, brand, version, catalog, and immutable decode data: 5 minutes.

Query-backed hooks accept TanStack Query options, including `select` and an explicit `staleTime` override. `useIndexDtfPerformance` owns its `select` composition to preserve the raw price-history cache, but accepts the remaining query options.

## Bundle shape

The React wrapper is ESM-only, side-effect free, and leaves the core SDK, React, TanStack Query, and viem external in its published build. The core SDK preserves internal modules so named browser imports do not retain unrelated proposal or rebalance code. Use named imports; avoid `import * as sdk` in browser entry points.
