# @dtf-interface/dtf-catalog

Curated catalog for DTFs.

This replaces the old `@reserve-protocol/rtokens` naming. RTokens are now called Yield DTFs.

## Usage

```ts
import dtfs, { indexDtfs, yieldDtfs } from "@dtf-interface/dtf-catalog";
import type { CatalogIndexDTF, CatalogYieldDTF } from "@dtf-interface/dtf-catalog";

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
      logo,
      status
    }
  }
}
```

The raw JSON files are also exported:

```ts
import baseIndexDtfs from "@dtf-interface/dtf-catalog/index-dtf/base.json";
import baseYieldDtfs from "@dtf-interface/dtf-catalog/yield-dtf/base.json";
```

Logos live in `images`. Index DTF logos are WebP files, and Yield DTF logos currently keep the legacy SVG files.

## Status

- `active`: supported and visible by default.
- `unsupported`: marked as unsupported in the UI, but not fully deprecated onchain yet.
- `deprecated`: officially deprecated or paused onchain.

The normal lifecycle is:

```text
active -> unsupported -> deprecated
```

## Publishing

The package is structured for npm publishing, but `"private": true` is set intentionally while the catalog is still being integrated.

To publish later:

1. Remove `"private": true` from `package.json`.
2. Set the package version.
3. Run `pnpm --filter @dtf-interface/dtf-catalog build`.
4. Publish with public access.
