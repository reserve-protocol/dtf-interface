import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { Amount } from "@/types/common";

import { Decimal } from "@/lib/decimal";
import { mapAmount } from "@/lib/utils";

type RawHolder = {
  readonly account: { readonly id: string };
  readonly amount: string;
  readonly delegate?: { readonly address?: string | null; readonly id?: string | null } | null;
};

type HoldersResponse = {
  readonly token: {
    readonly currentHolderCount: string;
    readonly decimals: string;
    readonly totalSupply: string;
  } | null;
  readonly accountBalances: readonly RawHolder[];
};

export type GetIndexDtfHoldersParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly limit?: number;
};

export type IndexDtfHolder = {
  readonly account: Address;
  readonly balance: Amount;
  readonly balanceUsd: number;
  readonly supplyPercent: number;
  readonly delegate?: Address;
  readonly rank: number;
};

export type IndexDtfHolderConcentration = {
  readonly top5Percent: number;
  readonly top10Percent: number;
};

export type IndexDtfHolders = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly tokenPrice: number;
  readonly totalSupply: Amount;
  readonly totalHolders: number;
  readonly holders: readonly IndexDtfHolder[];
  readonly concentration: IndexDtfHolderConcentration;
};

const HOLDERS_QUERY = `
  query IndexDtfHolders($id: String!, $limit: Int!) {
    token(id: $id) {
      currentHolderCount
      decimals
      totalSupply
    }
    accountBalances(
      where: { token: $id, amount_gt: "0" }
      orderBy: amount
      orderDirection: desc
      first: $limit
    ) {
      account { id }
      amount
      delegate { id address }
    }
  }
`;

export async function getIndexDtfHolders(
  client: DtfClient,
  params: GetIndexDtfHoldersParams,
): Promise<IndexDtfHolders> {
  const address = getAddress(params.address);
  const limit = params.limit ?? 20;
  const [data, prices] = await Promise.all([
    client.subgraph.queryIndex<HoldersResponse, { id: string; limit: number }>({
      chainId: params.chainId,
      query: HOLDERS_QUERY,
      variables: { id: address.toLowerCase(), limit },
    }),
    client.api.getTokenPrices({ chainId: params.chainId, addresses: [address] }).catch(() => []),
  ]);
  const decimals = Number(data.token?.decimals ?? 18);
  const totalSupply = mapAmount(data.token?.totalSupply ?? 0n, decimals);
  const tokenPrice = prices[0]?.price ?? 0;
  const holders = data.accountBalances.map((holder, index) =>
    mapHolder(holder, {
      decimals,
      index,
      tokenPrice,
      totalSupply: totalSupply.raw,
    }),
  );

  return {
    address,
    chainId: params.chainId,
    tokenPrice,
    totalSupply,
    totalHolders: Number(data.token?.currentHolderCount ?? 0),
    holders,
    concentration: {
      top5Percent: sumSupplyPercent(holders.slice(0, 5)),
      top10Percent: sumSupplyPercent(holders.slice(0, 10)),
    },
  };
}

function mapHolder(
  holder: RawHolder,
  context: {
    readonly decimals: number;
    readonly index: number;
    readonly tokenPrice: number;
    readonly totalSupply: bigint;
  },
): IndexDtfHolder {
  const account = getAddress(holder.account.id);
  const balance = mapAmount(holder.amount, context.decimals);
  const supplyPercent = context.totalSupply > 0n
    ? new Decimal(balance.raw.toString()).mul(100).div(context.totalSupply.toString()).toNumber()
    : 0;
  const delegate = holder.delegate?.address ?? holder.delegate?.id;

  return {
    account,
    balance,
    balanceUsd: new Decimal(balance.formatted).mul(context.tokenPrice).toNumber(),
    supplyPercent,
    ...(delegate ? { delegate: getAddress(delegate) } : {}),
    rank: context.index + 1,
  };
}

function sumSupplyPercent(holders: readonly IndexDtfHolder[]): number {
  return holders.reduce((sum, holder) => sum + holder.supplyPercent, 0);
}
