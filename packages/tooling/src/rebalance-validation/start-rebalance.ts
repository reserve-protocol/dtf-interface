import type { Abi, Address, Hex } from "viem";

import { dtfIndexAbi, dtfIndexAbiV4 } from "@reserve-protocol/sdk";
import { decodeFunctionData, getAddress } from "viem";

export type WeightRange = { readonly low: bigint; readonly spot: bigint; readonly high: bigint };

export type TokenRebalanceParams = {
  readonly token: Address;
  readonly weight: WeightRange;
  readonly price: { readonly low: bigint; readonly high: bigint };
  readonly maxAuctionSize: bigint;
  readonly inRebalance: boolean;
};

export type DecodedStartRebalance = {
  readonly abiLabel: "v4" | "v5/v6";
  readonly target: Address;
  readonly tokens: readonly TokenRebalanceParams[];
  readonly limits: WeightRange;
  readonly auctionLauncherWindow: bigint;
  readonly ttl: bigint;
};

const ABIS: readonly { readonly label: DecodedStartRebalance["abiLabel"]; readonly abi: Abi }[] = [
  { label: "v5/v6", abi: dtfIndexAbi as Abi },
  { label: "v4", abi: dtfIndexAbiV4 as Abi },
];

/**
 * Decodes a `startRebalance` action. The v4 and v5+ signatures differ, so both
 * ABIs are tried; anything else returns undefined and is reported as a
 * non-routine action rather than silently ignored.
 */
export function decodeStartRebalance(target: Address, callData: Hex): DecodedStartRebalance | undefined {
  for (const { label, abi } of ABIS) {
    try {
      const decoded = decodeFunctionData({ abi, data: callData });
      if (decoded.functionName !== "startRebalance") continue;
      const [tokens, limits, auctionLauncherWindow, ttl] = decoded.args as unknown as [
        readonly TokenRebalanceParams[],
        WeightRange,
        bigint,
        bigint,
      ];

      return {
        abiLabel: label,
        target: getAddress(target),
        tokens: tokens.map((token) => ({ ...token, token: getAddress(token.token) })),
        limits,
        auctionLauncherWindow,
        ttl,
      };
    } catch {
      continue;
    }
  }

  return undefined;
}

/**
 * Recovers the proposer's inputs from the encoded ranges. `price` is
 * D27{nanoUSD/tok} with `low = p*(1-e)` and `high = p/(1-e)`, so the geometric
 * mean is the price and `1 - low/price` is the price-error preset; `weight.spot`
 * is D27{tok/share}.
 */
export function recoverTokenInputs(token: TokenRebalanceParams, decimals: number) {
  const scale = 10 ** (27 + 9 - decimals);
  const low = Number(token.price.low) / scale;
  const high = Number(token.price.high) / scale;
  const price = Math.sqrt(low * high);

  return {
    price,
    priceLow: low,
    priceHigh: high,
    priceError: 1 - low / price,
    wholeTokensPerShare: (Number(token.weight.spot) / 1e27 / 10 ** decimals) * 1e18,
  };
}
