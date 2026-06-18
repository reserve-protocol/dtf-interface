import type { DtfClient } from "@/client";
import type { YieldDtfParams } from "@/types/yield-dtf";

import { SdkError } from "@/lib/errors";
import { type YieldDtfChainId } from "@/yield-dtf/config";
import { getYieldDtf, getYieldDtfBasket, getYieldDtfPrice } from "@/yield-dtf/dtf/index";
import { GetYieldDtfDailySnapshotsDocument } from "@/yield-dtf/subgraph/yield.generated";

const DEFI_LLAMA_POOLS_URL = "https://yields.llama.fi/pools";

const DEFI_LLAMA_CHAINS: Record<string, YieldDtfChainId> = {
  Ethereum: 1,
  Base: 8453,
};

// DefiLlama pool id -> collateral symbol, maintained alongside listed collateral
// plugins (previously Register's CollateralYieldUpdater).
export const COLLATERAL_POOL_MAP: Record<YieldDtfChainId, Record<string, string>> = {
  1: {
    "acee1e4d-a73c-4e20-98f7-e87c13d446e4": "apxeth",
    "405d8dad-5c99-4c91-90d3-82813ade1ff1": "sadai",
    "a349fea4-d780-4e16-973e-70ca9b606db2": "sausdc",
    "60d657c9-5f63-4771-a85b-2cf8d507ec00": "sausdt",
    "1d53fa29-b918-4d74-9508-8fcf8173ca51": "sausdp",
    "cc110152-36c2-4e10-9c12-c5b4eb662143": "cdai",
    "cefa9bb8-c230-459a-a855-3b94e96acd8c": "cusdc",
    "57647093-2868-4e65-97ab-9cae8ec74e7d": "cusdt",
    "6c2b7a5c-6c4f-49ea-a08c-0366b772f2c2": "cusdp",
    "1d876729-4445-4623-8b6b-c5290db5d100": "cwbtc",
    "1e5da7c6-59bb-49bd-9f97-4f4fceeffad4": "ceth",
    "fa4d7ee4-0001-4133-9e8d-cf7d5d194a91": "fusdc",
    "ed227286-abb0-4a34-ada5-39f7ebd81afb": "fdai",
    "6600934f-6323-447d-8a7d-67fbede8529d": "fusdt",
    "747c1d2a-c668-4682-b9f9-296708a3dd90": "wsteth",
    "d4b3c522-6127-4b89-bedf-83641cdcd2eb": "reth",
    "7da72d09-56ca-4ec5-a45f-59114353e487": "wcusdcv3",
    "f4d5b566-e815-4ca2-bb07-7bcd8bc797f1": "wcusdtv3",
    "8a20c472-142c-4442-b724-40f2183c073e": "stkcvxmim-3lp3crv-f",
    "ad3d7253-fb8f-402f-a6f8-821bc0a055cb": "stkcvxcrv3crypto",
    "7394f1bc-840a-4ff0-9e87-5e0ef932943a": "stkcvx3crv",
    "c04005c9-7e34-41a6-91c4-295834ed8ac0": "stkcvxeusd3crv-f",
    "325ad2d6-70b1-48d7-a557-c2c99a036f87": "mrp-ausdc",
    "1343a280-7812-4bc3-8f98-d1c37e11d271": "mrp-ausdt",
    "b8bcdf8e-96ed-40ca-a7aa-aa048b9874e5": "mrp-adai",
    "7be52986-18c2-450f-b74b-d65fb1205bbf": "mrp-aweth",
    "ff61171d-d7b0-4989-816c-b9bf02a15f00": "mrp-awbtc",
    "eab8d63d-8a8f-48cb-8027-583508831d24": "mrp-asteth",
    "0f45d730-b279-4629-8e11-ccb5cc3038b4": "cbeth",
    "c8a24fee-ec00-4f38-86c0-9f6daebc4225": "sdai",
    "55de30c3-bf9f-4d4e-9e0b-536a8ef5ab35": "sfrax",
    "aa70268e-4b52-42bf-a116-608b370f9501": "saethusdc",
    "d118f505-e75f-4152-bad3-49a2dc7482bf": "saethpyusd",
    "01146cce-9140-4e03-9a2e-82c99ccc42f1": "stkcvxpyusdusdc",
    "5b3aebb3-891d-47fc-92e2-927ada3d5b82": "sfrxeth",
    "d741644d-86ea-44ad-af5e-3042de381173": "re7weth",
    "a3ffd3fe-b21c-44eb-94d5-22c80057a600": "stkcvxcrvusdusdt-f",
    "755fcec6-f4fd-4150-9184-60f099206694": "stkcvxcrvusdusdc-f",
    "d1dacce1-7815-420c-bb6d-d3c4320e1b2a": "steakpyusd",
    "043a8330-bc29-4164-aa1c-28de7bf87755": "bbusdt",
    "152b7ce2-7193-475d-9b15-3f17fee66047": "stkcvxeth+eth",
    "74346f6f-c7ee-4506-a204-baf48e13decb": "stkcvxeth+eth-f",
    "66985a81-9c51-46ca-9977-42b4fe7bc6df": "susde",
    "90bfb3c2-5d35-4959-a275-ba5085b08aa3": "ethx",
    "d8c4eff5-c8a9-46fc-a888-057c4c668e72": "susds",
    "423681e3-4787-40ce-ae43-e9f67c5269b3": "woeth",
    "f981a304-bb6c-45b8-b0c5-fd2f515ad23a": "saethusdt",
    "85fc6934-c94d-4ebe-9c60-66beb363669f": "saethrlusd",
    "46bd2bdf-6d92-4066-b482-e885ee172264": "weeth",
    "b55f43a8-f444-4cd8-a3a4-0a4e786ba566": "steakusdc",
  },
  8453: {
    "df65c4f4-e33a-481c-bac8-0c2252867c93": "wcusdbcv3",
    "0c8567f8-ba5b-41ad-80de-00a71895eb19": "wcusdcv3",
    "9d09b0be-f6c2-463a-ad2c-4552b3e12bd9": "wsgusdbc",
    "7e0661bf-8cf3-45e6-9424-31916d4c7b84": "sabasusdc",
    "833ec61b-f9e6-46ac-9eff-2785808b2389": "sabasusdbc",
    "b90eba2e-ed29-414e-b16d-82f9c3eae707": "meusd",
    "bde35fef-649f-4514-a564-e7e7da05eb52": "wsamm-eusd/usdc",
    "69c0fc74-dee5-4c60-9aed-a593661d54ea": "wvamm-weth/aero",
    "7b542141-5eed-4d70-bee6-0f9733beb362": "wvamm-mog/weth",
    "be8a4206-6543-4690-a5c2-b3e032245aa2": "wsamm-usdz/usdc",
    "593056a0-1e39-451d-acc8-081526625ab3": "wvamm-weth/cbbtc",
    "8af246ee-cf26-4c8e-88f8-f2021a69e44d": "wvamm-weth/well",
    "7e15dae2-ba5c-4658-b1a2-efb908a15200": "wvamm-weth/degen",
    "f388573e-5c0f-4dac-9f70-116a4aabaf17": "wsuperoethb",
  },
};

/** 30-day mean APY per collateral symbol (lowercase), in percent. */
export type CollateralYields = Record<string, number>;

/** Fetches collateral 30d yields from DefiLlama for one chain. */
export async function getCollateralYields(chainId: YieldDtfChainId): Promise<CollateralYields> {
  const response = await fetch(DEFI_LLAMA_POOLS_URL);

  if (!response.ok) {
    throw new SdkError({
      code: "REQUEST_FAILED",
      message: `DefiLlama pools request failed: ${response.status}`,
      meta: { status: response.status, url: DEFI_LLAMA_POOLS_URL },
    });
  }

  const { data } = (await response.json()) as {
    readonly data: readonly { readonly chain: string; readonly pool: string; readonly apyMean30d?: number }[];
  };
  const yields: CollateralYields = {};

  for (const pool of data) {
    const poolChainId = DEFI_LLAMA_CHAINS[pool.chain];
    const symbol = poolChainId === undefined ? undefined : COLLATERAL_POOL_MAP[poolChainId]?.[pool.pool];

    if (!symbol) {
      continue;
    }

    const apy = pool.apyMean30d ?? 0;
    const isLst = symbol === "wsteth" || symbol === "cbeth";

    // LSTs yield the same everywhere; mainnet rates cover other chains.
    if (isLst) {
      if (poolChainId === 1 && yields[symbol] === undefined) {
        yields[symbol] = apy;
      }
      continue;
    }

    if (poolChainId === chainId) {
      yields[symbol] = apy;
      // Vault wrappers track the underlying market rate.
      if (symbol === "cusdc" || symbol === "cusdt") {
        yields[`${symbol}-vault`] = apy;
      }
    }
  }

  return yields;
}

export type ComputeYieldDtfApyParams = {
  /** Basket collateral with value shares (0-100) and symbols. */
  readonly basket: readonly { readonly symbol: string; readonly share: number }[];
  readonly collateralYields: CollateralYields;
  /** Revenue split percentages (0-100). */
  readonly revenueSplit: { readonly holders: number; readonly stakers: number };
  readonly supplyUsd: number;
  readonly stakedUsd: number;
};

export type YieldDtfApy = {
  /** Weighted underlying basket yield, percent. */
  readonly basket: number;
  /** Holder APY after the revenue split, percent. */
  readonly holders: number;
  /** Staker APY, leveraged by supply/stake, percent. */
  readonly stakers: number;
};

/** Pure estimated-APY math; same formula Register displays. */
export function computeYieldDtfApy(params: ComputeYieldDtfApyParams): YieldDtfApy {
  let basket = 0;

  for (const collateral of params.basket) {
    basket += (params.collateralYields[collateral.symbol.toLowerCase()] ?? 0) * (collateral.share / 100);
  }

  const holders = basket * (params.revenueSplit.holders / 100);
  const stakers =
    params.stakedUsd > 0
      ? ((basket * params.supplyUsd) / params.stakedUsd) * (params.revenueSplit.stakers / 100)
      : basket * (params.revenueSplit.stakers / 100);

  return { basket, holders, stakers };
}

/** Estimated APY for a Yield DTF from live basket, prices, and DefiLlama yields. */
export async function getYieldDtfApy(client: DtfClient, params: YieldDtfParams): Promise<YieldDtfApy> {
  const [dtf, basket, price, collateralYields] = await Promise.all([
    getYieldDtf(client, params),
    getYieldDtfBasket(client, params),
    getYieldDtfPrice(client, params),
    getCollateralYields(params.chainId),
  ]);
  const symbolsByAddress = new Map(dtf.collaterals.map((token) => [token.address.toLowerCase(), token.symbol]));

  return computeYieldDtfApy({
    basket: basket.collaterals.map((collateral) => ({
      symbol: symbolsByAddress.get(collateral.address.toLowerCase()) ?? "",
      share: collateral.share,
    })),
    collateralYields,
    revenueSplit: dtf.revenueSplit,
    supplyUsd: Number(dtf.token.totalSupply.formatted) * price.price,
    stakedUsd: dtf.staking.rsrStakedUsd,
  });
}

export type YieldDtfStakingApyPoint = {
  readonly timestamp: number;
  readonly exchangeRate: number;
  /** Annualized growth vs the previous snapshot, percent. */
  readonly apy: number;
};

/**
 * Realized staking APY from the stRSR exchange-rate growth in daily
 * subgraph snapshots, oldest first.
 */
export async function getYieldDtfStakingApyHistory(
  client: DtfClient,
  params: YieldDtfParams & { readonly days?: number },
): Promise<readonly YieldDtfStakingApyPoint[]> {
  const { rtokenDailySnapshots } = await client.subgraph.queryYield({
    chainId: params.chainId,
    query: GetYieldDtfDailySnapshotsDocument,
    variables: {
      rTokenId: params.address.toLowerCase(),
      limit: params.days ?? 365,
    },
  });
  const ordered = [...rtokenDailySnapshots].reverse();
  const points: YieldDtfStakingApyPoint[] = [];

  for (let i = 1; i < ordered.length; i++) {
    const previous = ordered[i - 1]!;
    const current = ordered[i]!;
    const previousRate = Number(previous.rsrExchangeRate);
    const currentRate = Number(current.rsrExchangeRate);
    const elapsedDays = (Number(current.timestamp) - Number(previous.timestamp)) / 86400;

    if (previousRate <= 0 || elapsedDays <= 0) {
      continue;
    }

    points.push({
      timestamp: Number(current.timestamp),
      exchangeRate: currentRate,
      apy: (currentRate / previousRate - 1) * (365 / elapsedDays) * 100,
    });
  }

  return points;
}
