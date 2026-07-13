import type { AuctionMetrics } from "@reserve-protocol/dtf-rebalance-lib";
import type { Address } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { Token } from "@/types/common";

import { SdkError } from "@/lib/errors";

export const INDEX_DTF_ONDO_LIMIT_BUFFER = 0.95;

export type IndexDtfRebalanceLiquiditySide = "buy" | "sell";

export type IndexDtfRebalanceLiquidityTrade = {
  readonly address: Address;
  readonly side: IndexDtfRebalanceLiquiditySide;
  readonly amountUsd: number;
  readonly price: number;
  readonly decimals: number;
};

export type IndexDtfRebalanceLiquiditySwapLeg = {
  readonly action: string;
  readonly address: readonly string[];
  readonly inputToken: readonly string[];
  readonly outputToken: readonly string[];
  readonly impact: number;
  readonly input: number;
  readonly output: number;
  readonly success: boolean;
};

export type IndexDtfRebalanceOndoUpcoming = {
  readonly code?: string;
  readonly message?: string;
  readonly start: string | null;
  readonly end: string | null;
};

export type IndexDtfRebalanceOndoInfo = {
  readonly symbol: string;
  readonly ticker?: string;
  readonly price?: number;
  readonly tradingOpen: boolean;
  readonly capacityUsd?: number;
  readonly withinCapacity: boolean;
  readonly reason?: { readonly code: string; readonly message: string } | null;
  readonly upcoming: readonly IndexDtfRebalanceOndoUpcoming[];
};

export type IndexDtfRebalanceOndoMarket = {
  readonly isOpen: boolean;
  readonly session: string;
  readonly nextOpen: string | null;
  readonly nextClose: string | null;
  readonly timestamp: string;
};

export type IndexDtfRebalanceLiquidityAsset = {
  readonly address: Address;
  readonly side: IndexDtfRebalanceLiquiditySide;
  readonly amountUsd: number;
  readonly liquidity: {
    readonly priceImpact: number;
    readonly level: "low" | "medium" | "high" | "insufficient" | "error" | "unknown" | "failed";
    readonly score: number;
    readonly counterpart?: string;
    readonly swapPath?: readonly IndexDtfRebalanceLiquiditySwapLeg[];
    readonly error?: string;
  };
  readonly ondo?: IndexDtfRebalanceOndoInfo;
};

export type IndexDtfRebalanceLiquidity = {
  readonly market: IndexDtfRebalanceOndoMarket | null;
  readonly totals: { readonly sellUsd: number; readonly buyUsd: number };
  readonly assets: readonly IndexDtfRebalanceLiquidityAsset[];
};

export type GetIndexDtfRebalanceLiquidityParams = {
  readonly chainId: SupportedChainId;
  readonly nativePrice: number;
  readonly trades: readonly IndexDtfRebalanceLiquidityTrade[];
};

export type IndexDtfOndoLimit = {
  readonly capacityUsd?: number;
  readonly tradingOpen: boolean;
};

export type IndexDtfRebalanceLegSizes = Readonly<Record<string, number>>;

export type IndexDtfExceededOndoLeg = {
  readonly address: string;
  readonly symbol: string;
  readonly sizeUsd: number;
  readonly capacityUsd: number;
};

/** Checks DEX liquidity and Ondo market limits for a set of proposed rebalance trades. */
export function getIndexDtfRebalanceLiquidity(
  client: DtfClient,
  params: GetIndexDtfRebalanceLiquidityParams,
): Promise<IndexDtfRebalanceLiquidity> {
  return client.api.post({
    path: "/rebalance/liquidity",
    body: params,
  });
}

/** Builds the matched buy and sell trades that can actually execute in one auction. */
export function buildIndexDtfRebalanceLiquidityTrades(params: {
  readonly metrics: AuctionMetrics;
  readonly tokens: readonly Token[];
  readonly prices: Readonly<Record<string, { readonly currentPrice: number }>>;
}): readonly IndexDtfRebalanceLiquidityTrade[] {
  const tokenByAddress = new Map(params.tokens.map((token) => [token.address.toLowerCase(), token]));
  const surplus = buildSide(params.metrics.surplusTokens, params.metrics.surplusTokenSizes, "sell");
  const deficit = buildSide(params.metrics.deficitTokens, params.metrics.deficitTokenSizes, "buy");
  const surplusTotal = surplus.reduce((total, trade) => total + trade.amountUsd, 0);
  const deficitTotal = deficit.reduce((total, trade) => total + trade.amountUsd, 0);
  const matchedTotal = Math.min(surplusTotal, deficitTotal);

  return [...surplus, ...deficit].map((trade) => {
    const token = tokenByAddress.get(trade.address);
    const price = params.prices[trade.address]?.currentPrice;

    if (!token || price === undefined) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `missing rebalance liquidity context for token ${trade.address}`,
        meta: { token: trade.address },
      });
    }

    return {
      address: trade.address as Address,
      side: trade.side,
      amountUsd: trade.amountUsd * (trade.side === "sell" ? matchedTotal / surplusTotal : matchedTotal / deficitTotal),
      price,
      decimals: token.decimals,
    };
  });
}

/** Sizes each auction leg for the largest single fill it can expose to a filler. */
export function getIndexDtfRebalanceLegSizes(metrics: AuctionMetrics): IndexDtfRebalanceLegSizes {
  const surplusTotal = metrics.surplusTokenSizes.reduce((total, size) => total + size, 0);
  const deficitTotal = metrics.deficitTokenSizes.reduce((total, size) => total + size, 0);
  const sizes: Record<string, number> = {};

  metrics.surplusTokens.forEach((token, index) => {
    sizes[token.toLowerCase()] = Math.min(metrics.surplusTokenSizes[index] ?? 0, deficitTotal);
  });
  metrics.deficitTokens.forEach((token, index) => {
    sizes[token.toLowerCase()] = Math.min(metrics.deficitTokenSizes[index] ?? 0, surplusTotal);
  });

  return sizes;
}

/** Finds the highest integer rebalance percent whose open Ondo legs fit their buffered session caps. */
export function getIndexDtfMaxSafeRebalancePercent(
  computeSizes: (percent: number) => IndexDtfRebalanceLegSizes | null,
  ondoLimits: Readonly<Record<string, IndexDtfOndoLimit>>,
  minPercent = 1,
): number {
  const constrained = Object.entries(ondoLimits).filter(
    ([, limit]) => limit.tradingOpen && limit.capacityUsd !== undefined && limit.capacityUsd > 0,
  );

  if (constrained.length === 0) return 100;

  const fits = (percent: number) => {
    const sizes = computeSizes(percent);
    if (!sizes) return false;

    return constrained.every(
      ([address, limit]) => (sizes[address] ?? 0) <= (limit.capacityUsd as number) * INDEX_DTF_ONDO_LIMIT_BUFFER,
    );
  };

  if (fits(100)) return 100;

  let low = minPercent;
  let high = 100;
  let best = minPercent;

  while (low <= high) {
    const percent = Math.floor((low + high) / 2);

    if (fits(percent)) {
      best = percent;
      low = percent + 1;
    } else {
      high = percent - 1;
    }
  }

  return best;
}

/** Returns open Ondo legs whose current size exceeds the buffered soft cap. */
export function getIndexDtfExceededOndoLegs(
  sizes: IndexDtfRebalanceLegSizes,
  ondoLimits: Readonly<Record<string, IndexDtfOndoLimit & { readonly symbol: string }>>,
): readonly IndexDtfExceededOndoLeg[] {
  return Object.entries(ondoLimits)
    .filter(
      ([address, limit]) =>
        limit.tradingOpen &&
        limit.capacityUsd !== undefined &&
        limit.capacityUsd > 0 &&
        (sizes[address] ?? 0) > limit.capacityUsd * INDEX_DTF_ONDO_LIMIT_BUFFER,
    )
    .map(([address, limit]) => ({
      address,
      symbol: limit.symbol,
      sizeUsd: sizes[address] ?? 0,
      capacityUsd: limit.capacityUsd as number,
    }));
}

function buildSide(addresses: readonly string[], sizes: readonly number[], side: IndexDtfRebalanceLiquiditySide) {
  return addresses.flatMap((address, index) => {
    const amountUsd = sizes[index] ?? 0;

    return amountUsd > 0 ? [{ address: address.toLowerCase(), side, amountUsd }] : [];
  });
}
