import { getAddress, type Address } from "viem";

import type { DtfClient } from "../client.js";

export type PortfolioPeriod = "24h" | "7d" | "1m" | "3m" | "1y" | "all";

export type PortfolioReward = {
  readonly address: Address;
  readonly chainId: number;
  readonly symbol: string;
  readonly name: string;
  readonly decimals: number;
  readonly amount: string;
  readonly value: number;
};

export type PortfolioVoteLock = {
  readonly stTokenAddress: Address;
  readonly chainId: number;
  readonly name: string;
  readonly symbol: string;
  readonly underlying: { readonly address: Address; readonly symbol: string; readonly name: string };
  readonly dtfs: readonly { readonly address: Address; readonly name: string; readonly symbol: string }[];
  readonly apy: number;
  readonly amount: string;
  readonly value: number;
  readonly votingPower: string;
  readonly delegation?: Address;
  readonly rewards: readonly PortfolioReward[];
  readonly locks: readonly {
    readonly lockId: string;
    readonly amount: string;
    readonly unlockTime: number;
    readonly delay: number;
    readonly value: number;
  }[];
  readonly votingWeight: number;
  readonly activeProposals: readonly unknown[];
};

export type PortfolioIndexDtf = {
  readonly address: Address;
  readonly chainId: number;
  readonly name: string;
  readonly symbol: string;
  readonly amount: string;
  readonly value: number;
};

export type AccountPortfolio = {
  readonly totalHoldingsUSD: number;
  readonly indexDTFs: readonly PortfolioIndexDtf[];
  readonly voteLocks: readonly PortfolioVoteLock[];
};

export type PortfolioTransaction = {
  readonly chainId: number;
  readonly timestamp: number;
  readonly block: number;
  readonly txHash: string;
  readonly protocol: string;
  readonly type: string;
  readonly title: string;
  readonly description: string;
  readonly token: {
    readonly address: Address;
    readonly symbol: string;
    readonly underlying?: { readonly address: Address; readonly symbol: string };
  } | null;
  readonly proposalId?: string;
};

/** Reads the account portfolio fields used by Index DTF and vote-lock views. */
export async function getAccountPortfolio(
  client: DtfClient,
  params: { readonly account: Address },
): Promise<AccountPortfolio> {
  const response = await client.api.get<AccountPortfolio>({
    path: `/v1/portfolio/${getAddress(params.account).toLowerCase()}`,
  });

  return mapPortfolio(response);
}

/** Reads the historical account portfolio chart from Reserve API. */
export async function getAccountPortfolioHistory(
  client: DtfClient,
  params: { readonly account: Address; readonly period: PortfolioPeriod },
): Promise<unknown> {
  return client.api.get<unknown>({
    path: `/v1/historical/portfolio/${getAddress(params.account).toLowerCase()}`,
    query: { period: params.period },
  });
}

/** Reads account portfolio transactions across Reserve products. */
export async function getAccountPortfolioTransactions(
  client: DtfClient,
  params: { readonly account: Address },
): Promise<readonly PortfolioTransaction[]> {
  const response = await client.api.get<readonly PortfolioTransaction[]>({
    path: `/v1/portfolio/${getAddress(params.account).toLowerCase()}/transactions`,
  });

  return response.map(mapPortfolioTransaction);
}

export function createPortfolioNamespace(client: DtfClient) {
  return {
    get: (params: { readonly account: Address }) => getAccountPortfolio(client, params),
    getHistory: (params: { readonly account: Address; readonly period: PortfolioPeriod }) =>
      getAccountPortfolioHistory(client, params),
    getTransactions: (params: { readonly account: Address }) => getAccountPortfolioTransactions(client, params),
  };
}

function mapPortfolio(portfolio: AccountPortfolio): AccountPortfolio {
  return {
    ...portfolio,
    indexDTFs: portfolio.indexDTFs.map((dtf) => ({ ...dtf, address: getAddress(dtf.address) })),
    voteLocks: portfolio.voteLocks.map((lock) => ({
      ...lock,
      stTokenAddress: getAddress(lock.stTokenAddress),
      underlying: { ...lock.underlying, address: getAddress(lock.underlying.address) },
      dtfs: lock.dtfs.map((dtf) => ({ ...dtf, address: getAddress(dtf.address) })),
      ...(lock.delegation ? { delegation: getAddress(lock.delegation) } : {}),
      rewards: lock.rewards.map((reward) => ({ ...reward, address: getAddress(reward.address) })),
    })),
  };
}

function mapPortfolioTransaction(transaction: PortfolioTransaction): PortfolioTransaction {
  return {
    ...transaction,
    token: transaction.token
      ? {
          ...transaction.token,
          address: getAddress(transaction.token.address),
          ...(transaction.token.underlying
            ? {
                underlying: {
                  ...transaction.token.underlying,
                  address: getAddress(transaction.token.underlying.address),
                },
              }
            : {}),
        }
      : null,
  };
}
