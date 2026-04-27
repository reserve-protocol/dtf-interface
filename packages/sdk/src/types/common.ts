import type { Address } from "viem";
import type { SupportedChainId } from "../defaults.js";

export type Token = {
  readonly address: Address;
  readonly symbol: string;
  readonly decimals: string;
  readonly name: string;
};

export type DtfStatus = "active" | "deprecated" | "unsupported";

// TODO: do we need this at all? let's see
export type DtfRef = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
};

export type DtfBasketAsset = {
  readonly address: Address;
  readonly symbol: string;
  readonly name: string;
  readonly decimals: number;
  readonly amount: number;
  readonly amountRaw: string;
  readonly price: number;
  readonly weight: string;
  readonly priceSource?: string;
};

export type DtfBasketSummaryAsset = {
  readonly address: Address;
  readonly symbol: string;
  readonly name: string;
  readonly weight: string;
};

export type DtfMarketData = {
  readonly price: number;
  readonly marketCap: number;
  readonly totalSupply: number;
};

export type DtfPerformancePoint = {
  readonly timestamp: number;
  readonly value: number;
};

export type DtfBrand = {
  readonly icon?: string;
  readonly cover?: string;
  readonly tags?: readonly string[];
  readonly about?: string;
};

export type TokenPrice = {
  readonly address: Address;
  readonly price: number;
  readonly timestamp: number;
  readonly priceSources?: readonly string[];
  readonly source?: string;
};
