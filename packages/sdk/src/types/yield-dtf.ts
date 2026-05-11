import type { Address } from "viem";

import type { SupportedChainId } from "../defaults.js";
import type {
  DtfBasketAsset,
  DtfBasketSummaryAsset,
  DtfBrand,
  DtfMarketData,
  DtfPerformancePoint,
  DtfStatus,
} from "./common.js";

export type YieldDtf = DtfMarketData & {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly name?: string;
  readonly symbol?: string;
  readonly decimals?: number;
  readonly basket: readonly DtfBasketAsset[];
};

export type YieldDtfListItem = Pick<YieldDtf, "address" | "chainId" | "name" | "symbol" | "price" | "marketCap"> & {
  readonly type: "yield";
  readonly status: Exclude<DtfStatus, "unsupported">;
  readonly basket: readonly DtfBasketSummaryAsset[];
  readonly brand?: DtfBrand;
  readonly performance?: readonly DtfPerformancePoint[];
};
