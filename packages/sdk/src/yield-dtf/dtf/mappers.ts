import { getAddress, type Address } from "viem";

import type { Token } from "@/types/common";
import type {
  YieldDtf,
  YieldDtfHolder,
  YieldDtfRevenueSplit,
  YieldDtfStakeRecord,
  YieldDtfSummary,
  YieldDtfTransaction,
  YieldDtfTransactionType,
} from "@/types/yield-dtf";
import type { YieldDtfChainId } from "@/yield-dtf/config";
import type {
  GetAccountStakeRecordsQuery,
  GetYieldDtfHoldersQuery,
  GetYieldDtfQuery,
  GetYieldDtfTransactionsQuery,
  ListYieldDtfsQuery,
} from "@/yield-dtf/subgraph/yield.generated";

import { mapAmount } from "@/lib/utils";

type SubgraphYieldDtf = NonNullable<GetYieldDtfQuery["rtoken"]>;
type SubgraphYieldDtfSummary = ListYieldDtfsQuery["rtokens"][number];
type SubgraphEntry = GetYieldDtfTransactionsQuery["entries"][number];
type SubgraphStakeRecord = GetAccountStakeRecordsQuery["accountStakeRecords"][number];
type SubgraphHolderBalance = NonNullable<GetYieldDtfHoldersQuery["token"]>["holdersBalance"][number];

// Distributor sentinel destinations: revenue routed to holders burns through the
// furnace (0x..01) and revenue to stakers flows to stRSR (0x..02).
const FURNACE_DESTINATION = "0x0000000000000000000000000000000000000001";
const ST_RSR_DESTINATION = "0x0000000000000000000000000000000000000002";

export function mapYieldDtf(
  dtf: SubgraphYieldDtf,
  chainId: YieldDtfChainId,
  onChain: {
    readonly main: Address;
    readonly mandate: string;
    readonly collaterals: readonly Token[];
  },
): YieldDtf {
  return {
    id: getAddress(dtf.id),
    chainId,
    token: {
      address: getAddress(dtf.token.id),
      name: dtf.token.name,
      symbol: dtf.token.symbol,
      decimals: dtf.token.decimals,
      totalSupply: mapAmount(dtf.token.totalSupply, dtf.token.decimals),
      holderCount: Number(dtf.token.holderCount),
      transferCount: Number(dtf.token.transferCount),
      mintCount: Number(dtf.token.mintCount),
      burnCount: Number(dtf.token.burnCount),
    },
    main: onChain.main,
    mandate: onChain.mandate,
    stToken: {
      address: getAddress(dtf.rewardToken.token.id),
      name: dtf.rewardToken.token.name,
      symbol: dtf.rewardToken.token.symbol,
      decimals: dtf.rewardToken.token.decimals,
    },
    collaterals: onChain.collaterals,
    targetUnits: dtf.targetUnits,
    basketsNeeded: mapAmount(dtf.basketsNeeded),
    roles: {
      owners: dtf.owners.map((address) => getAddress(address)),
      pausers: dtf.pausers.map((address) => getAddress(address)),
      freezers: dtf.freezers.map((address) => getAddress(address)),
      longFreezers: dtf.longFreezers.map((address) => getAddress(address)),
    },
    staking: {
      rsrStaked: mapAmount(dtf.rsrStaked),
      rsrStakedUsd: Number(dtf.rsrStakedUSD),
      exchangeRate: Number(dtf.rsrExchangeRate),
      stTokenSupply: mapAmount(dtf.rewardTokenSupply, dtf.rewardToken.token.decimals),
    },
    revenueSplit: mapRevenueSplit(dtf.revenueDistribution),
    createdAt: Number(dtf.createdTimestamp),
  };
}

export function mapYieldDtfSummary(dtf: SubgraphYieldDtfSummary, chainId: YieldDtfChainId): YieldDtfSummary {
  return {
    id: getAddress(dtf.id),
    chainId,
    token: {
      address: getAddress(dtf.token.id),
      name: dtf.token.name,
      symbol: dtf.token.symbol,
      decimals: dtf.token.decimals,
      totalSupply: mapAmount(dtf.token.totalSupply, dtf.token.decimals),
      holderCount: Number(dtf.token.holderCount),
    },
    targetUnits: dtf.targetUnits,
    rsrStaked: mapAmount(dtf.rsrStaked),
    basketsNeeded: mapAmount(dtf.basketsNeeded),
    priceUsd: Number(dtf.token.lastPriceUSD),
  };
}

export function mapRevenueSplit(distribution: SubgraphYieldDtf["revenueDistribution"]): YieldDtfRevenueSplit {
  let holders = 0;
  let stakers = 0;
  const external: {
    readonly destination: Address;
    readonly holdersShare: number;
    readonly stakersShare: number;
  }[] = [];

  for (const entry of distribution) {
    const destination = entry.destination.toLowerCase();

    // Shares are basis points of 10000.
    if (destination === FURNACE_DESTINATION) {
      holders = entry.rTokenDist / 100;
    } else if (destination === ST_RSR_DESTINATION) {
      stakers = entry.rsrDist / 100;
    } else if (entry.rTokenDist > 0 || entry.rsrDist > 0) {
      external.push({
        destination: getAddress(entry.destination),
        holdersShare: entry.rTokenDist / 100,
        stakersShare: entry.rsrDist / 100,
      });
    }
  }

  return { holders, stakers, external };
}

export function mapYieldDtfHolder(balance: SubgraphHolderBalance): YieldDtfHolder {
  return {
    address: getAddress(balance.account.id),
    // NOTE: subgraph stores balances as BigDecimal in human units — display-class.
    balance: Number(balance.amount),
    transferCount: balance.transferCount,
    lastActivity: Number(balance.timestamp),
  };
}

export function mapYieldDtfTransaction(entry: SubgraphEntry, chainId: YieldDtfChainId): YieldDtfTransaction {
  return {
    id: entry.id,
    hash: entry.hash,
    type: mapEntryType(entry.type),
    // NOTE: entry amounts are subgraph BigDecimal in human units — display-class.
    amount: Number(entry.amount ?? 0),
    amountUsd: Number(entry.amountUSD ?? 0),
    timestamp: Number(entry.timestamp),
    chainId,
    from: getAddress(entry.from.id),
    ...(entry.to ? { to: getAddress(entry.to.id) } : {}),
  };
}

export function mapYieldDtfStakeRecord(record: SubgraphStakeRecord): YieldDtfStakeRecord {
  return {
    id: record.id,
    hash: record.hash,
    isStake: record.isStake,
    amount: mapAmount(record.amountRaw),
    rsrAmount: mapAmount(record.rsrAmountRaw),
    exchangeRate: Number(record.exchangeRate),
    rsrPriceUsd: Number(record.rsrPriceUSD),
    timestamp: Number(record.timestamp),
    blockNumber: Number(record.blockNumber),
  };
}

function mapEntryType(type: string): YieldDtfTransactionType {
  switch (type) {
    case "TRANSFER":
      return "transfer";
    case "MINT":
    case "ISSUE":
      return "issue";
    case "BURN":
    case "REDEEM":
      return "redeem";
    case "STAKE":
      return "stake";
    case "UNSTAKE":
      return "unstake";
    case "UNSTAKE_CANCELLED":
      return "unstakeCancelled";
    case "WITHDRAW":
      return "withdraw";
    default:
      return "other";
  }
}
