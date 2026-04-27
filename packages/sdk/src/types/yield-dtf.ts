import type {
  DtfBasketAsset,
  DtfBasketSummaryAsset,
  DtfBrand,
  DtfMarketData,
  DtfPerformancePoint,
  DtfRef,
  DtfStatus,
} from "./common.js";

export type YieldDtfRef = DtfRef;

export type YieldDtf = DtfRef &
  DtfMarketData & {
    readonly name?: string;
    readonly symbol?: string;
    readonly decimals?: number;
    readonly basket: readonly DtfBasketAsset[];
  };

export type YieldDtfListItem = DtfRef &
  Pick<YieldDtf, "name" | "symbol" | "price" | "marketCap"> & {
    readonly type: "yield";
    readonly status: Exclude<DtfStatus, "unsupported">;
    readonly basket: readonly DtfBasketSummaryAsset[];
    readonly brand?: DtfBrand;
    readonly performance?: readonly DtfPerformancePoint[];
  };

