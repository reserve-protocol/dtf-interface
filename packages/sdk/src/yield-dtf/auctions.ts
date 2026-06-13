import { erc20Abi, getAddress, zeroAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { ContractCall, ContractCallPlan } from "@/lib/contract-call";
import type { Amount } from "@/types/common";
import type { YieldDtfContracts, YieldDtfParams } from "@/types/yield-dtf";

import { prepareContractCall, prepareErc20Approval } from "@/lib/contract-call";
import { mapAmount, sameAddress } from "@/lib/utils";
import { backingManagerAbi } from "@/yield-dtf/abis/backing-manager";
import { dutchTradeAbi } from "@/yield-dtf/abis/dutch-trade";
import { facadeActAbi } from "@/yield-dtf/abis/facade-act";
import { facadeReadAbi } from "@/yield-dtf/abis/facade-read";
import { FACADE_ACT_ADDRESS, FACADE_READ_ADDRESS, RSR_ADDRESS, type YieldDtfChainId } from "@/yield-dtf/config";
import { getYieldDtfContracts } from "@/yield-dtf/dtf/index";
import { GetYieldDtfTradesDocument } from "@/yield-dtf/subgraph/yield.generated";

/** 0 = Dutch (falling price), 1 = Batch (sealed bid via Gnosis). */
export type YieldDtfTradeKind = 0 | 1;

export type YieldDtfRevenueAuction = {
  readonly erc20: Address;
  readonly canStart: boolean;
  readonly surplus: Amount;
  readonly minTradeAmount: Amount;
};

export type YieldDtfTraderRevenue = {
  readonly trader: Address;
  readonly auctions: readonly YieldDtfRevenueAuction[];
  /** ERC20s with finished auctions ready to settle on this trader. */
  readonly settleable: readonly Address[];
};

export type YieldDtfRevenue = {
  readonly rsrTrader: YieldDtfTraderRevenue;
  readonly rTokenTrader: YieldDtfTraderRevenue;
  /** Null when the read reverts (trading paused/frozen or legacy versions). */
  readonly recollateralization: {
    readonly canStart: boolean;
    readonly sell: Address;
    readonly buy: Address;
    readonly sellAmount: Amount;
  } | null;
};

/**
 * Full revenue/auction surface for a Yield DTF: per-trader surpluses with
 * canStart flags, settleable auctions, and the next recollateralization
 * auction. Facade "reads" are callStatic, so everything goes through
 * simulateContract/eth_call in parallel.
 */
export async function getYieldDtfRevenue(
  client: DtfClient,
  params: YieldDtfParams & { readonly contracts?: YieldDtfContracts },
): Promise<YieldDtfRevenue> {
  const contracts = params.contracts ?? (await getYieldDtfContracts(client, params));
  const publicClient = client.viem.getPublicClient(params.chainId);
  const facadeAct = FACADE_ACT_ADDRESS[params.chainId];

  const [rsrOverview, rTokenOverview, recoResult, [rsrSettleable, rTokenSettleable]] = await Promise.all([
    publicClient.simulateContract({
      address: facadeAct,
      abi: facadeActAbi,
      functionName: "revenueOverview",
      args: [contracts.rsrTrader],
    }),
    publicClient.simulateContract({
      address: facadeAct,
      abi: facadeActAbi,
      functionName: "revenueOverview",
      args: [contracts.rTokenTrader],
    }),
    // WHY: reverts while trading is paused/frozen and on some legacy versions;
    // a dead reco read must not take the revenue overviews down with it.
    publicClient
      .simulateContract({
        address: facadeAct,
        abi: facadeActAbi,
        functionName: "nextRecollateralizationAuction",
        args: [contracts.backingManager, 0],
      })
      .catch(() => null),
    publicClient.multicall({
      allowFailure: false,
      contracts: [
        {
          address: FACADE_READ_ADDRESS[params.chainId],
          abi: facadeReadAbi,
          functionName: "auctionsSettleable",
          args: [contracts.rsrTrader],
        },
        {
          address: FACADE_READ_ADDRESS[params.chainId],
          abi: facadeReadAbi,
          functionName: "auctionsSettleable",
          args: [contracts.rTokenTrader],
        },
      ],
    }),
  ]);

  const reco = recoResult?.result;
  const recoCanStart = reco?.[0] ?? false;
  // The facade returns zero addresses when no recollateralization can start.
  const recoSell = reco && reco[1] !== zeroAddress ? getAddress(reco[1]) : undefined;

  // Surpluses (and the reco sell amount) are denominated in each ERC20's own decimals.
  const erc20s = [
    ...new Set(
      [...rsrOverview.result[0], ...rTokenOverview.result[0], ...(recoSell ? [recoSell] : [])].map((erc20) =>
        getAddress(erc20),
      ),
    ),
  ];
  const decimalResults = await publicClient.multicall({
    allowFailure: false,
    contracts: erc20s.map((erc20) => ({ address: erc20, abi: erc20Abi, functionName: "decimals" as const })),
  });
  const decimals = new Map(erc20s.map((erc20, index) => [erc20, Number(decimalResults[index])]));

  return {
    // While a recollateralization can start, revenue auctions revert on-chain
    // (forwardRevenue requires full collateralization), so canStart is
    // overridden — same derivation Register uses. The trader's own buy token
    // is a distribution, not an auction, and is filtered out like Register.
    rsrTrader: mapTraderRevenue(contracts.rsrTrader, rsrOverview.result, rsrSettleable, decimals, {
      blocked: recoCanStart,
      tokenToBuy: RSR_ADDRESS[params.chainId],
    }),
    rTokenTrader: mapTraderRevenue(contracts.rTokenTrader, rTokenOverview.result, rTokenSettleable, decimals, {
      blocked: recoCanStart,
      tokenToBuy: getAddress(params.address),
    }),
    recollateralization: reco
      ? {
          canStart: reco[0],
          sell: getAddress(reco[1]),
          buy: getAddress(reco[2]),
          sellAmount: mapAmount(reco[3], decimals.get(getAddress(reco[1]))),
        }
      : null,
  };
}

export type YieldDtfTrade = {
  readonly id: Address;
  readonly chainId: YieldDtfChainId;
  readonly kind: YieldDtfTradeKind;
  readonly selling: Address;
  readonly sellingSymbol: string;
  readonly buying: Address;
  readonly buyingSymbol: string;
  /** Subgraph BigDecimal in human units — display-class. */
  readonly amount: number;
  readonly minBuyAmount: number;
  /** Absent until the trade settles. */
  readonly boughtAmount?: number;
  readonly worstCasePrice: number;
  readonly startedAt: number;
  readonly endAt: number;
  readonly isSettled: boolean;
  readonly settleTxHash?: string;
};

/** Historical auctions (revenue + recollateralization) from the subgraph. */
export async function getYieldDtfTrades(
  client: DtfClient,
  params: YieldDtfParams & { readonly limit?: number; readonly offset?: number },
): Promise<readonly YieldDtfTrade[]> {
  const { trades } = await client.subgraph.queryYield({
    chainId: params.chainId,
    query: GetYieldDtfTradesDocument,
    variables: {
      rTokenId: getAddress(params.address).toLowerCase(),
      limit: params.limit ?? 50,
      offset: params.offset ?? 0,
    },
  });

  return trades.map((trade) => ({
    id: getAddress(trade.id),
    chainId: params.chainId,
    kind: trade.kind === 1 ? 1 : 0,
    selling: getAddress(trade.selling),
    sellingSymbol: trade.sellingTokenSymbol,
    buying: getAddress(trade.buying),
    buyingSymbol: trade.buyingTokenSymbol,
    amount: Number(trade.amount),
    minBuyAmount: Number(trade.minBuyAmount),
    ...(trade.boughtAmount === null || trade.boughtAmount === undefined
      ? {}
      : { boughtAmount: Number(trade.boughtAmount) }),
    worstCasePrice: Number(trade.worstCasePrice),
    startedAt: Number(trade.startedAt),
    endAt: Number(trade.endAt),
    isSettled: trade.isSettled,
    ...(trade.settleTxHash ? { settleTxHash: trade.settleTxHash } : {}),
  }));
}

export type YieldDtfDutchAuction = {
  readonly trade: Address;
  readonly sell: Address;
  readonly buy: Address;
  readonly sellAmount: Amount;
  readonly endTime: number;
  readonly canSettle: boolean;
  /** Cost in buy tokens to take the full lot right now; absent outside the bidding window. */
  readonly currentBid?: Amount;
};

/** Live state of one Dutch auction, including the current bid cost. */
export async function getYieldDtfDutchAuction(
  client: DtfClient,
  params: { readonly chainId: YieldDtfChainId; readonly trade: Address },
): Promise<YieldDtfDutchAuction> {
  const trade = getAddress(params.trade);
  const publicClient = client.viem.getPublicClient(params.chainId);
  const tradeContract = { address: trade, abi: dutchTradeAbi } as const;

  const [[sell, buy, lot, endTime, canSettle], block] = await Promise.all([
    publicClient.multicall({
      allowFailure: false,
      contracts: [
        { ...tradeContract, functionName: "sell" },
        { ...tradeContract, functionName: "buy" },
        { ...tradeContract, functionName: "lot" },
        { ...tradeContract, functionName: "endTime" },
        { ...tradeContract, functionName: "canSettle" },
      ],
    }),
    publicClient.getBlock(),
  ]);
  // bidAmount reverts outside the OPEN window (not started yet / ended), which
  // is exactly the canSettle case — it must not take the whole read down.
  const [sellDecimals, buyDecimals, currentBid] = await publicClient.multicall({
    allowFailure: true,
    contracts: [
      { address: getAddress(sell), abi: erc20Abi, functionName: "decimals" },
      { address: getAddress(buy), abi: erc20Abi, functionName: "decimals" },
      { ...tradeContract, functionName: "bidAmount", args: [Number(block.timestamp)] },
    ],
  });

  if (sellDecimals.status === "failure") throw sellDecimals.error;
  if (buyDecimals.status === "failure") throw buyDecimals.error;

  return {
    trade,
    sell: getAddress(sell),
    buy: getAddress(buy),
    sellAmount: mapAmount(lot, Number(sellDecimals.result)),
    endTime: Number(endTime),
    canSettle,
    ...(currentBid.status === "success"
      ? { currentBid: mapAmount(currentBid.result, Number(buyDecimals.result)) }
      : {}),
  };
}

export type YieldDtfRunRevenueAuctionsParams = {
  readonly chainId: YieldDtfChainId;
  readonly trader: Address;
  readonly toSettle: readonly Address[];
  readonly toStart: readonly Address[];
  readonly kind: YieldDtfTradeKind;
};

/** Settles finished auctions and starts new ones on a revenue trader. */
export function prepareYieldDtfRunRevenueAuctions(params: YieldDtfRunRevenueAuctionsParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: FACADE_ACT_ADDRESS[params.chainId],
    abi: facadeActAbi,
    functionName: "runRevenueAuctions",
    args: [
      getAddress(params.trader),
      params.toSettle.map((erc20) => getAddress(erc20)),
      params.toStart.map((erc20) => getAddress(erc20)),
      new Array<number>(params.toStart.length).fill(params.kind),
    ],
  });
}

export type YieldDtfRebalanceParams = {
  readonly chainId: YieldDtfChainId;
  readonly backingManager: Address;
  readonly kind: YieldDtfTradeKind;
};

/** Starts the next recollateralization auction. */
export function prepareYieldDtfRebalance(params: YieldDtfRebalanceParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.backingManager),
    abi: backingManagerAbi,
    functionName: "rebalance",
    args: [params.kind],
  });
}

export type YieldDtfBidParams = {
  readonly chainId: YieldDtfChainId;
  readonly trade: Address;
  /** Buy-token amount to approve; `currentBid.raw` at fetch time is the max the bid can cost (price only falls). */
  readonly approveAmount: bigint;
  readonly buyToken: Address;
};

/** Dutch auction bid: approve the buy token to the trade, then bid(). */
export function prepareYieldDtfBidPlan(params: YieldDtfBidParams): ContractCallPlan {
  return {
    type: "approval-required",
    approvals: [
      prepareErc20Approval({
        chainId: params.chainId,
        token: params.buyToken,
        spender: getAddress(params.trade),
        amount: params.approveAmount,
      }),
    ],
    call: prepareContractCall({
      chainId: params.chainId,
      address: getAddress(params.trade),
      abi: dutchTradeAbi,
      functionName: "bid",
      args: [],
    }),
  };
}

/** Claims collateral rewards across the backing manager and traders. */
export function prepareYieldDtfClaimRewards(params: YieldDtfParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: FACADE_ACT_ADDRESS[params.chainId],
    abi: facadeActAbi,
    functionName: "claimRewards",
    args: [getAddress(params.address)],
  });
}

function mapTraderRevenue(
  trader: Address,
  overview: readonly [
    readonly Address[],
    readonly boolean[],
    readonly bigint[],
    readonly bigint[],
    readonly bigint[],
    readonly bigint[],
  ],
  settleable: readonly Address[],
  decimals: ReadonlyMap<Address, number>,
  context: { readonly blocked: boolean; readonly tokenToBuy: Address },
): YieldDtfTraderRevenue {
  const [erc20s, canStart, surpluses, minTradeAmounts] = overview;
  const auctions: YieldDtfRevenueAuction[] = [];

  for (const [index, erc20] of erc20s.entries()) {
    const address = getAddress(erc20);

    if (sameAddress(address, context.tokenToBuy)) {
      continue;
    }

    auctions.push({
      erc20: address,
      canStart: canStart[index]! && !context.blocked,
      surplus: mapAmount(surpluses[index]!, decimals.get(address)),
      minTradeAmount: mapAmount(minTradeAmounts[index]!, decimals.get(address)),
    });
  }

  return {
    trader,
    auctions,
    settleable: settleable.map((erc20) => getAddress(erc20)),
  };
}
