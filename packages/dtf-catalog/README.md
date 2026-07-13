# @reserve-protocol/dtf-catalog

Curated catalog for DTFs.

This replaces the old `@reserve-protocol/rtokens` naming. RTokens are now called Yield DTFs.

## Usage

```ts
import dtfs, { indexDtfs, yieldDtfs } from "@reserve-protocol/dtf-catalog";
import type { CatalogIndexDTF, CatalogYieldDTF } from "@reserve-protocol/dtf-catalog";

const baseDtfs = dtfs[8453];
const baseIndexDtfs = indexDtfs[8453];
const baseYieldDtfs = yieldDtfs[8453];
```

The package follows the old `@reserve-protocol/rtokens` shape:

```ts
{
  [chainId]: {
    [tokenAddress]: {
      address,
      name,
      symbol,
      decimals,
      createdAt,
      logo,
      status
    }
  }
}
```

`createdAt` is the contract creation Unix timestamp in seconds.

The raw JSON files are also exported:

```ts
import baseIndexDtfs from "@reserve-protocol/dtf-catalog/index-dtf/base.json";
import baseYieldDtfs from "@reserve-protocol/dtf-catalog/yield-dtf/base.json";
```

Logos live in `images` and can be WebP or SVG files.

## Status

- `active`: supported and visible by default.
- `unsupported`: marked as unsupported in the UI, but not fully deprecated onchain yet.
- `deprecated`: officially deprecated or paused onchain.

The normal lifecycle is:

```text
active -> unsupported -> deprecated
```

## Publishing

The package is public and released with Changesets. Do not edit its version or changelog by hand.

Before release, run the catalog consistency checks:

```sh
pnpm --filter @reserve-protocol/dtf-catalog check:restricted
pnpm --filter @reserve-protocol/dtf-catalog check:tokenlists
pnpm --filter @reserve-protocol/dtf-catalog build
```
