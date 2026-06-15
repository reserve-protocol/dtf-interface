import { erc20Abi, getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { ContractCall, ContractCallPlan } from "@/lib/contract-call";
import type { YieldDtfIssuanceQuote, YieldDtfParams, YieldDtfRedemptionQuote } from "@/types/yield-dtf";

import { prepareContractCall, prepareErc20Approval } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";
import { mapAmount } from "@/lib/utils";
import { facadeReadAbi } from "@/yield-dtf/abis/facade-read";
import { rTokenAbi } from "@/yield-dtf/abis/r-token";
import { FACADE_READ_ADDRESS } from "@/yield-dtf/config";

export type GetYieldDtfIssuanceQuoteParams = YieldDtfParams & {
  readonly amount: bigint;
};

export type GetYieldDtfMaxIssuableParams = YieldDtfParams & {
  readonly account: Address;
};

/** Quotes the collateral deposits required to issue `amount` of the Yield DTF. */
export async function getYieldDtfIssuanceQuote(
  client: DtfClient,
  params: GetYieldDtfIssuanceQuoteParams,
): Promise<YieldDtfIssuanceQuote> {
  const address = getAddress(params.address);
  const { result } = await client.viem.getPublicClient(params.chainId).simulateContract({
    address: FACADE_READ_ADDRESS[params.chainId],
    abi: facadeReadAbi,
    functionName: "issue",
    args: [address, params.amount],
  });
  const [tokens, deposits] = result;
  const decimals = await readDecimals(client, params.chainId, tokens);

  return {
    amount: mapAmount(params.amount),
    deposits: tokens.map((token, index) => ({
      token: getAddress(token),
      amount: mapAmount(deposits[index]!, decimals[index]!),
    })),
  };
}

/** Quotes the collateral returned when redeeming `amount` of the Yield DTF. */
export async function getYieldDtfRedemptionQuote(
  client: DtfClient,
  params: GetYieldDtfIssuanceQuoteParams,
): Promise<YieldDtfRedemptionQuote> {
  const address = getAddress(params.address);
  const { result } = await client.viem.getPublicClient(params.chainId).simulateContract({
    address: FACADE_READ_ADDRESS[params.chainId],
    abi: facadeReadAbi,
    functionName: "redeem",
    args: [address, params.amount],
  });
  const [tokens, withdrawals, available] = result;
  const decimals = await readDecimals(client, params.chainId, tokens);

  return {
    amount: mapAmount(params.amount),
    withdrawals: tokens.map((token, index) => ({
      token: getAddress(token),
      amount: mapAmount(withdrawals[index]!, decimals[index]!),
      available: mapAmount(available[index]!, decimals[index]!),
    })),
  };
}

/** Max amount of the Yield DTF `account` can issue with its current balances. */
export async function getYieldDtfMaxIssuable(client: DtfClient, params: GetYieldDtfMaxIssuableParams): Promise<bigint> {
  const { result } = await client.viem.getPublicClient(params.chainId).simulateContract({
    address: FACADE_READ_ADDRESS[params.chainId],
    abi: facadeReadAbi,
    functionName: "maxIssuable",
    args: [getAddress(params.address), getAddress(params.account)],
  });

  return result;
}

export type YieldDtfIssueParams = YieldDtfParams & {
  readonly amount: bigint;
};

export function prepareYieldDtfIssue(params: YieldDtfIssueParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: rTokenAbi,
    functionName: "issue",
    args: [params.amount],
  });
}

export type YieldDtfIssuePlanParams = YieldDtfIssueParams & {
  /** Deposits from getYieldDtfIssuanceQuote; approvals target the Yield DTF token. */
  readonly deposits: readonly { readonly token: Address; readonly amount: bigint }[];
};

/** Issue call plus the collateral approvals it needs. */
export function prepareYieldDtfIssuePlan(params: YieldDtfIssuePlanParams): ContractCallPlan {
  const call = prepareYieldDtfIssue(params);
  const approvals = params.deposits.map((deposit) =>
    prepareErc20Approval({
      chainId: params.chainId,
      token: deposit.token,
      spender: getAddress(params.address),
      amount: deposit.amount,
    }),
  );

  if (approvals.length === 0) {
    return { type: "call", call };
  }

  return { type: "approval-required", approvals, call };
}

export function prepareYieldDtfRedeem(params: YieldDtfIssueParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: rTokenAbi,
    functionName: "redeem",
    args: [params.amount],
  });
}

export type YieldDtfRedeemCustomParams = YieldDtfParams & {
  readonly recipient: Address;
  readonly amount: bigint;
  readonly basketNonces: readonly number[];
  readonly portions: readonly bigint[];
  readonly expectedTokensOut: readonly Address[];
  readonly minAmountsOut: readonly bigint[];
};

/** Redemption against historical basket nonces (used during rebalances). */
export function prepareYieldDtfRedeemCustom(params: YieldDtfRedeemCustomParams): ContractCall {
  if (params.basketNonces.length !== params.portions.length) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "basketNonces and portions must have the same length",
      meta: { basketNonces: params.basketNonces.length, portions: params.portions.length },
    });
  }

  if (params.expectedTokensOut.length !== params.minAmountsOut.length) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "expectedTokensOut and minAmountsOut must have the same length",
      meta: { expectedTokensOut: params.expectedTokensOut.length, minAmountsOut: params.minAmountsOut.length },
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: rTokenAbi,
    functionName: "redeemCustom",
    args: [
      getAddress(params.recipient),
      params.amount,
      [...params.basketNonces],
      [...params.portions],
      params.expectedTokensOut.map((token) => getAddress(token)),
      [...params.minAmountsOut],
    ],
  });
}

async function readDecimals(
  client: DtfClient,
  chainId: YieldDtfParams["chainId"],
  tokens: readonly Address[],
): Promise<readonly number[]> {
  if (tokens.length === 0) {
    return [];
  }

  const results = await client.viem.getPublicClient(chainId).multicall({
    allowFailure: false,
    contracts: tokens.map((token) => ({
      address: token,
      abi: erc20Abi,
      functionName: "decimals" as const,
    })),
  });

  return results.map(Number);
}
