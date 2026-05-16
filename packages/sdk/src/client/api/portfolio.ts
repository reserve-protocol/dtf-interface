import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { AccountPortfolio, PortfolioPeriod, PortfolioTransaction } from "@/types/api";

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
