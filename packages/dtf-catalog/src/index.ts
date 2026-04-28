import indexBase from "../index-dtf/base.json" with { type: "json" };
import indexBnb from "../index-dtf/bnb.json" with { type: "json" };
import indexMainnet from "../index-dtf/mainnet.json" with { type: "json" };
import yieldBase from "../yield-dtf/base.json" with { type: "json" };
import yieldMainnet from "../yield-dtf/mainnet.json" with { type: "json" };
import type {
  CatalogChainId,
  DTFCatalogByChain,
  DTFCatalogMap,
  IndexDTFCatalogItem,
  YieldDTFCatalogItem,
} from "./types.js";

export type {
  BaseDTFCatalogItem,
  DTFCatalogByChain,
  CatalogChainId,
  DTFCatalogLinks,
  DTFCatalogMap,
  DTFCatalogStatus,
  IndexDTFCatalogItem,
  YieldDTFCatalogItem,
} from "./types.js";

export const indexDtfs: Partial<
  Record<CatalogChainId, DTFCatalogMap<IndexDTFCatalogItem>>
> = {
  1: indexMainnet as DTFCatalogMap<IndexDTFCatalogItem>,
  56: indexBnb as DTFCatalogMap<IndexDTFCatalogItem>,
  8453: indexBase as DTFCatalogMap<IndexDTFCatalogItem>,
};

export const yieldDtfs: Partial<
  Record<CatalogChainId, DTFCatalogMap<YieldDTFCatalogItem>>
> = {
  1: yieldMainnet as DTFCatalogMap<YieldDTFCatalogItem>,
  8453: yieldBase as DTFCatalogMap<YieldDTFCatalogItem>,
};

const dtfs: DTFCatalogByChain = {
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
