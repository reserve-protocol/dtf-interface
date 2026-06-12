import { erc20Abi, getAddress, hexToString, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { Token } from "@/types/common";
import type {
  YieldDtf,
  YieldDtfBasket,
  YieldDtfContracts,
  YieldDtfHolder,
  YieldDtfParams,
  YieldDtfPrice,
  YieldDtfState,
  YieldDtfSummary,
  YieldDtfTransaction,
} from "@/types/yield-dtf";

import { SdkError } from "@/lib/errors";
import { getCurrentTime, mapAmount } from "@/lib/utils";
import { basketHandlerAbi } from "@/yield-dtf/abis/basket-handler";
import { facadeReadAbi } from "@/yield-dtf/abis/facade-read";
import { rTokenMainAbi } from "@/yield-dtf/abis/main";
import { rTokenAbi } from "@/yield-dtf/abis/r-token";
import { stRsrAbi } from "@/yield-dtf/abis/st-rsr";
import { FACADE_READ_ADDRESS } from "@/yield-dtf/config";
import { mapYieldDtf, mapYieldDtfHolder, mapYieldDtfSummary, mapYieldDtfTransaction } from "@/yield-dtf/dtf/mappers";
import {
  GetYieldDtfDocument,
  GetYieldDtfHoldersDocument,
  GetYieldDtfTransactionsDocument,
  ListYieldDtfsDocument,
} from "@/yield-dtf/subgraph/yield.generated";

const DEFAULT_LIST_LIMIT = 100;

/** Reads the full Yield DTF view: subgraph identity plus on-chain mandate and basket tokens. */
export async function getYieldDtf(client: DtfClient, params: YieldDtfParams): Promise<YieldDtf> {
  const address = getAddress(params.address);
  const publicClient = client.viem.getPublicClient(params.chainId);
  const facade = FACADE_READ_ADDRESS[params.chainId];

  const [{ rtoken }, [main, mandate, basketTokens]] = await Promise.all([
    client.subgraph.queryYield({
      chainId: params.chainId,
      query: GetYieldDtfDocument,
      variables: { id: address.toLowerCase() },
    }),
    publicClient.multicall({
      allowFailure: false,
      contracts: [
        { address, abi: rTokenAbi, functionName: "main" },
        { address, abi: rTokenAbi, functionName: "mandate" },
        { address: facade, abi: facadeReadAbi, functionName: "basketTokens", args: [address] },
      ],
    }),
  ]);

  if (!rtoken) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Yield DTF not found: ${address} on chain ${params.chainId}`,
      meta: { chainId: params.chainId, entity: "yieldDtf", address },
    });
  }

  const collaterals = await readTokens(client, params.chainId, basketTokens);

  return mapYieldDtf(rtoken, params.chainId, {
    main: getAddress(main),
    mandate,
    collaterals,
  });
}

/** Lists Yield DTFs indexed by the subgraph for one chain. */
export async function listYieldDtfs(
  client: DtfClient,
  params: { readonly chainId: YieldDtfParams["chainId"]; readonly limit?: number; readonly offset?: number },
): Promise<readonly YieldDtfSummary[]> {
  const { rtokens } = await client.subgraph.queryYield({
    chainId: params.chainId,
    query: ListYieldDtfsDocument,
    variables: {
      limit: params.limit ?? DEFAULT_LIST_LIMIT,
      offset: params.offset ?? 0,
    },
  });

  return rtokens.map((rtoken) => mapYieldDtfSummary(rtoken, params.chainId));
}

/** Resolves every component address from Main, plus the Main version. */
export async function getYieldDtfContracts(client: DtfClient, params: YieldDtfParams): Promise<YieldDtfContracts> {
  const address = getAddress(params.address);
  const publicClient = client.viem.getPublicClient(params.chainId);
  const main = getAddress(await publicClient.readContract({ address, abi: rTokenAbi, functionName: "main" }));
  const mainContract = { address: main, abi: rTokenMainAbi } as const;
  const [
    distributor,
    backingManager,
    rTokenTrader,
    rsrTrader,
    furnace,
    broker,
    assetRegistry,
    basketHandler,
    stRsr,
    version,
  ] = await publicClient.multicall({
    allowFailure: false,
    contracts: [
      { ...mainContract, functionName: "distributor" },
      { ...mainContract, functionName: "backingManager" },
      { ...mainContract, functionName: "rTokenTrader" },
      { ...mainContract, functionName: "rsrTrader" },
      { ...mainContract, functionName: "furnace" },
      { ...mainContract, functionName: "broker" },
      { ...mainContract, functionName: "assetRegistry" },
      { ...mainContract, functionName: "basketHandler" },
      { ...mainContract, functionName: "stRSR" },
      { ...mainContract, functionName: "version" },
    ],
  });

  return {
    token: address,
    main,
    stRsr: getAddress(stRsr),
    distributor: getAddress(distributor),
    backingManager: getAddress(backingManager),
    rTokenTrader: getAddress(rTokenTrader),
    rsrTrader: getAddress(rsrTrader),
    furnace: getAddress(furnace),
    broker: getAddress(broker),
    assetRegistry: getAddress(assetRegistry),
    basketHandler: getAddress(basketHandler),
    version,
  };
}

/**
 * Reads block-by-block Yield DTF state. Targets protocol >= 3.0
 * (split tradingPaused/issuancePaused); 2.x mains are not supported.
 */
export async function getYieldDtfState(client: DtfClient, params: YieldDtfParams): Promise<YieldDtfState> {
  const address = getAddress(params.address);
  const contracts = await getYieldDtfContracts(client, params);
  const publicClient = client.viem.getPublicClient(params.chainId);
  const rToken = { address, abi: rTokenAbi } as const;
  const basketHandler = { address: contracts.basketHandler, abi: basketHandlerAbi } as const;
  const main = { address: contracts.main, abi: rTokenMainAbi } as const;

  const [
    totalSupply,
    basketsNeeded,
    stTokenSupply,
    exchangeRate,
    issuanceAvailable,
    issuanceThrottleParams,
    redemptionAvailable,
    redemptionThrottleParams,
    basketNonce,
    fullyCollateralized,
    frozen,
    tradingPaused,
    issuancePaused,
  ] = await publicClient.multicall({
    allowFailure: false,
    contracts: [
      { ...rToken, functionName: "totalSupply" },
      { ...rToken, functionName: "basketsNeeded" },
      { address: contracts.stRsr, abi: erc20Abi, functionName: "totalSupply" },
      { address: contracts.stRsr, abi: stRsrAbi, functionName: "exchangeRate" },
      { ...rToken, functionName: "issuanceAvailable" },
      { ...rToken, functionName: "issuanceThrottleParams" },
      { ...rToken, functionName: "redemptionAvailable" },
      { ...rToken, functionName: "redemptionThrottleParams" },
      { ...basketHandler, functionName: "nonce" },
      { ...basketHandler, functionName: "fullyCollateralized" },
      { ...main, functionName: "frozen" },
      { ...main, functionName: "tradingPaused" },
      { ...main, functionName: "issuancePaused" },
    ],
  });

  return {
    totalSupply: mapAmount(totalSupply),
    basketsNeeded: mapAmount(basketsNeeded),
    stTokenSupply: mapAmount(stTokenSupply),
    exchangeRate: mapAmount(exchangeRate),
    issuance: {
      amountRate: mapAmount(issuanceThrottleParams.amtRate),
      percentRate: mapAmount(issuanceThrottleParams.pctRate),
      available: mapAmount(issuanceAvailable),
    },
    redemption: {
      amountRate: mapAmount(redemptionThrottleParams.amtRate),
      percentRate: mapAmount(redemptionThrottleParams.pctRate),
      available: mapAmount(redemptionAvailable),
    },
    basketNonce: Number(basketNonce),
    isCollateralized: fullyCollateralized,
    tradingPaused,
    issuancePaused,
    frozen,
  };
}

/** Reads the on-chain Yield DTF price range from the facade. */
export async function getYieldDtfPrice(client: DtfClient, params: YieldDtfParams): Promise<YieldDtfPrice> {
  const address = getAddress(params.address);
  const [low, high] = await client.viem.readContract({
    address: FACADE_READ_ADDRESS[params.chainId],
    abi: facadeReadAbi,
    functionName: "price",
    args: [address],
    chainId: params.chainId,
  });

  return {
    address,
    chainId: params.chainId,
    low: mapAmount(low),
    high: mapAmount(high),
    price: Number(mapAmount((low + high) / 2n).formatted),
    timestamp: getCurrentTime(),
  };
}

/** Reads basket composition, backing, and buffer from the facade. */
export async function getYieldDtfBasket(client: DtfClient, params: YieldDtfParams): Promise<YieldDtfBasket> {
  const address = getAddress(params.address);
  const publicClient = client.viem.getPublicClient(params.chainId);
  const facade = { address: FACADE_READ_ADDRESS[params.chainId], abi: facadeReadAbi, args: [address] } as const;

  const [
    [erc20s, uoaShares, targets],
    [backing, overCollateralization],
    [, , targetAmts],
    [requiredBuffer, actualBuffer],
  ] = await publicClient.multicall({
    allowFailure: false,
    contracts: [
      { ...facade, functionName: "basketBreakdown" },
      { ...facade, functionName: "backingOverview" },
      { ...facade, functionName: "primeBasket" },
      { ...facade, functionName: "backingBuffer" },
    ],
  });

  return {
    address,
    chainId: params.chainId,
    backing: Math.min(100, Number(mapAmount(backing).formatted) * 100),
    staked: Number(mapAmount(overCollateralization).formatted) * 100,
    collaterals: erc20s.map((erc20, index) => ({
      address: getAddress(erc20),
      share: Number(mapAmount(uoaShares[index]!).formatted) * 100,
      targetAmount: mapAmount(targetAmts[index]!),
      targetUnit: hexToString(targets[index]!, { size: 32 }),
    })),
    backingBuffer: {
      required: Number(mapAmount(requiredBuffer).formatted),
      actual: Number(mapAmount(actualBuffer).formatted),
    },
  };
}

/** Reads top Yield DTF holders from the subgraph. */
export async function getYieldDtfHolders(
  client: DtfClient,
  params: YieldDtfParams & { readonly limit?: number; readonly offset?: number },
): Promise<readonly YieldDtfHolder[]> {
  const { token } = await client.subgraph.queryYield({
    chainId: params.chainId,
    query: GetYieldDtfHoldersDocument,
    variables: {
      id: getAddress(params.address).toLowerCase(),
      limit: params.limit ?? 50,
      offset: params.offset ?? 0,
    },
  });

  return (token?.holdersBalance ?? []).map(mapYieldDtfHolder);
}

/** Reads Yield DTF activity entries (transfers, issuance, staking) from the subgraph. */
export async function getYieldDtfTransactions(
  client: DtfClient,
  params: YieldDtfParams & { readonly limit?: number; readonly offset?: number },
): Promise<readonly YieldDtfTransaction[]> {
  const { entries } = await client.subgraph.queryYield({
    chainId: params.chainId,
    query: GetYieldDtfTransactionsDocument,
    variables: {
      rTokenId: getAddress(params.address).toLowerCase(),
      limit: params.limit ?? 50,
      offset: params.offset ?? 0,
    },
  });

  return entries.map((entry) => mapYieldDtfTransaction(entry, params.chainId));
}

async function readTokens(
  client: DtfClient,
  chainId: YieldDtfParams["chainId"],
  addresses: readonly Address[],
): Promise<readonly Token[]> {
  if (addresses.length === 0) {
    return [];
  }

  const publicClient = client.viem.getPublicClient(chainId);
  const results = await publicClient.multicall({
    allowFailure: false,
    contracts: addresses.flatMap((address) => [
      { address, abi: erc20Abi, functionName: "name" } as const,
      { address, abi: erc20Abi, functionName: "symbol" } as const,
      { address, abi: erc20Abi, functionName: "decimals" } as const,
    ]),
  });

  return addresses.map((address, index) => ({
    address: getAddress(address),
    name: results[index * 3] as string,
    symbol: results[index * 3 + 1] as string,
    decimals: Number(results[index * 3 + 2]),
  }));
}
