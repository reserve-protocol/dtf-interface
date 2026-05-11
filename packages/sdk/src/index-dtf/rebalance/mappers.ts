import { getAddress, type Address } from "viem";

import type { Token } from "../../types/common.js";
import type {
  GetIndexDtfRebalanceQuery,
  GetIndexDtfRebalanceAuctionsQuery,
  GetIndexDtfRebalancesQuery,
} from "../subgraph/dtf.generated.js";
import type { IndexDtfAuction, IndexDtfBid, IndexDtfRebalance } from "./types.js";

type SubgraphRebalance =
  | GetIndexDtfRebalancesQuery["rebalances"][number]
  | NonNullable<GetIndexDtfRebalanceQuery["rebalance"]>;
type SubgraphAuction = GetIndexDtfRebalanceAuctionsQuery["auctions"][number];
type SubgraphBid = SubgraphAuction["bids"][number];

export function mapSubgraphRebalance(rebalance: SubgraphRebalance): IndexDtfRebalance {
  return {
    id: rebalance.id,
    nonce: rebalance.nonce,
    tokens: rebalance.tokens.map(mapToken),
    priceControl: rebalance.priceControl,
    weightLowLimit: rebalance.weightLowLimit.map(BigInt),
    weightSpotLimit: rebalance.weightSpotLimit.map(BigInt),
    weightHighLimit: rebalance.weightHighLimit.map(BigInt),
    rebalanceLimits: {
      low: BigInt(rebalance.rebalanceLowLimit),
      spot: BigInt(rebalance.rebalanceSpotLimit),
      high: BigInt(rebalance.rebalanceHighLimit),
    },
    priceLowLimit: rebalance.priceLowLimit.map(BigInt),
    priceHighLimit: rebalance.priceHighLimit.map(BigInt),
    restrictedUntil: Number(rebalance.restrictedUntil),
    availableUntil: Number(rebalance.availableUntil),
    transactionHash: rebalance.transactionHash,
    blockNumber: BigInt(rebalance.blockNumber),
    timestamp: Number(rebalance.timestamp),
  };
}

export function mapSubgraphAuction(auction: SubgraphAuction): IndexDtfAuction {
  return {
    id: auction.id,
    tokens: auction.tokens.map(mapToken),
    weightLowLimit: auction.weightLowLimit.map(BigInt),
    weightSpotLimit: auction.weightSpotLimit.map(BigInt),
    weightHighLimit: auction.weightHighLimit.map(BigInt),
    rebalanceLimits: {
      low: BigInt(auction.rebalanceLowLimit),
      spot: BigInt(auction.rebalanceSpotLimit),
      high: BigInt(auction.rebalanceHighLimit),
    },
    priceLowLimit: auction.priceLowLimit.map(BigInt),
    priceHighLimit: auction.priceHighLimit.map(BigInt),
    startTime: Number(auction.startTime),
    endTime: Number(auction.endTime),
    transactionHash: auction.transactionHash,
    blockNumber: BigInt(auction.blockNumber),
    timestamp: Number(auction.timestamp),
    bids: auction.bids.map(mapSubgraphBid),
  };
}

function mapSubgraphBid(bid: SubgraphBid): IndexDtfBid {
  return {
    id: bid.id,
    bidder: getAddress(bid.bidder),
    sellToken: mapToken(bid.sellToken),
    buyToken: mapToken(bid.buyToken),
    sellAmount: BigInt(bid.sellAmount),
    buyAmount: BigInt(bid.buyAmount),
    blockNumber: BigInt(bid.blockNumber),
    timestamp: Number(bid.timestamp),
    transactionHash: bid.transactionHash,
  };
}

function mapToken(token: {
  readonly address: string;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
}): Token {
  return {
    address: getAddress(token.address) as Address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
  };
}
