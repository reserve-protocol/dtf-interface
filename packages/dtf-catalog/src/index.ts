import indexBase from "../index-dtf/base.json" with { type: "json" };
import indexBnb from "../index-dtf/bnb.json" with { type: "json" };
import indexMainnet from "../index-dtf/mainnet.json" with { type: "json" };
import yieldBase from "../yield-dtf/base.json" with { type: "json" };
import yieldMainnet from "../yield-dtf/mainnet.json" with { type: "json" };
import type { CatalogIndexDTF, CatalogYieldDTF } from "./types.js";

export type { CatalogIndexDTF, CatalogYieldDTF } from "./types.js";

export const indexDtfs: Record<1 | 56 | 8453, Record<string, CatalogIndexDTF>> = {
  1: indexMainnet as Record<string, CatalogIndexDTF>,
  56: indexBnb as Record<string, CatalogIndexDTF>,
  8453: indexBase as Record<string, CatalogIndexDTF>,
};

export const yieldDtfs: Partial<
  Record<1 | 56 | 8453, Record<string, CatalogYieldDTF>>
> = {
  1: yieldMainnet as Record<string, CatalogYieldDTF>,
  8453: yieldBase as Record<string, CatalogYieldDTF>,
};

const dtfs: Record<
  1 | 56 | 8453,
  Record<string, CatalogIndexDTF | CatalogYieldDTF>
> = {
  1: {
    ...yieldDtfs[1],
    ...indexDtfs[1],
  },
  56: {
    ...indexDtfs[56],
  },
  8453: {
    ...yieldDtfs[8453],
    ...indexDtfs[8453],
  },
};

export {
  indexBase,
  indexBnb,
  indexMainnet,
  yieldBase,
  yieldMainnet,
};

export default dtfs;
