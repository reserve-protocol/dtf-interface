import { getAddress, type Address } from "viem";
import type { SupportedChainId } from "../../defaults.js";
import { SdkError } from "../../errors.js";
import type { ContractCallPlan } from "../../contract-call.js";
import {
  prepareContractCall,
  prepareErc20Approval,
} from "../../contract-call.js";
import { dtfIndexAbi } from "../abis/dtf-index-abi.js";

type MintArgs = readonly [bigint, Address, bigint];
type RedeemArgs = readonly [bigint, Address, readonly Address[], readonly bigint[]];

export type PrepareIndexDtfMintParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly shares: bigint;
  readonly receiver: Address;
  readonly minSharesOut: bigint;
};

export type PrepareIndexDtfRedeemParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly shares: bigint;
  readonly receiver: Address;
  readonly assets: readonly Address[];
  readonly minAmountsOut: readonly bigint[];
};

export type PrepareIndexDtfBasketApprovalParams = {
  readonly token: Address;
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly amount: bigint;
};

export type PrepareIndexDtfMintPlanParams = PrepareIndexDtfMintParams & {
  readonly approvals?: readonly {
    readonly token: Address;
    readonly amount: bigint;
  }[];
};

/** Prepares a v5 `mint(shares, receiver, minSharesOut)` contract call. */
export function prepareIndexDtfMint(
  params: PrepareIndexDtfMintParams,
) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: dtfIndexAbi,
    functionName: "mint",
    args: getMintArgs(params),
  });
}

/** Prepares the approval calls plus mint call for manual issuance. */
export function prepareIndexDtfMintPlan(
  params: PrepareIndexDtfMintPlanParams,
): ContractCallPlan<
  ReturnType<typeof prepareIndexDtfMint>,
  ReturnType<typeof prepareIndexDtfBasketApproval>
> {
  const call = prepareIndexDtfMint(params);
  const approvals = (params.approvals ?? []).map((approval) =>
    prepareIndexDtfBasketApproval({
      chainId: params.chainId,
      address: params.address,
      token: approval.token,
      amount: approval.amount,
    }),
  );

  return approvals.length
    ? { type: "approval-required", approvals, call }
    : { type: "call", call };
}

/** Prepares a v5 `redeem(shares, receiver, assets, minAmountsOut)` contract call. */
export function prepareIndexDtfRedeem(
  params: PrepareIndexDtfRedeemParams,
) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: dtfIndexAbi,
    functionName: "redeem",
    args: getRedeemArgs(params),
  });
}

/** Prepares one ERC20 approval call for a basket token and the DTF as spender. */
export function prepareIndexDtfBasketApproval(
  params: PrepareIndexDtfBasketApprovalParams,
) {
  return prepareErc20Approval({
    chainId: params.chainId,
    token: params.token,
    spender: params.address,
    amount: params.amount,
  });
}

/** Applies basis-point slippage to redeem amounts while preserving token order. */
export function getIndexDtfRedeemMinAmounts(
  amounts: readonly bigint[],
  slippageBps: number,
): readonly bigint[] {
  if (!Number.isInteger(slippageBps) || slippageBps < 0 || slippageBps > 10_000) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "slippageBps must be an integer between 0 and 10000",
      meta: { slippageBps },
    });
  }

  const keepBps = BigInt(10_000 - slippageBps);

  return amounts.map((amount) => (amount * keepBps) / 10_000n);
}

function getMintArgs(params: {
  readonly shares: bigint;
  readonly receiver: Address;
  readonly minSharesOut: bigint;
}): MintArgs {
  return [params.shares, getAddress(params.receiver), params.minSharesOut] as const;
}

function getRedeemArgs(params: {
  readonly shares: bigint;
  readonly receiver: Address;
  readonly assets: readonly Address[];
  readonly minAmountsOut: readonly bigint[];
}): RedeemArgs {
  return [
    params.shares,
    getAddress(params.receiver),
    params.assets.map(getAddress),
    params.minAmountsOut,
  ] as const;
}
