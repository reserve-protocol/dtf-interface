import type { Address } from "viem";

import type { SupportedChainId } from "@/config";
import type { ContractCallPlan } from "@/lib/contract-call";
import type { IndexDtfCall } from "@/types/governance";

import { getIndexDtfWriteAbi, type IndexDtfWriteVersion } from "@/index-dtf/write-version";
import { prepareContractCall, prepareErc20Approval } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";

type MintArgs = readonly [bigint, Address, bigint];
type RedeemArgs = readonly [bigint, Address, readonly Address[], readonly bigint[]];

export type PrepareIndexDtfMintParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly version: IndexDtfWriteVersion;
  readonly shares: bigint;
  readonly receiver: Address;
  readonly minSharesOut: bigint;
};

export type PrepareIndexDtfRedeemParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly version: IndexDtfWriteVersion;
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

/** Prepares a `mint(shares, receiver, minSharesOut)` contract call (identical bytes on 5.0.0 and 6.0.0). */
export function prepareIndexDtfMint(params: PrepareIndexDtfMintParams): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "mint",
    args: getMintArgs(params),
  });
}

/** Prepares the approval calls plus mint call for manual issuance. */
export function prepareIndexDtfMintPlan(
  params: PrepareIndexDtfMintPlanParams,
): ContractCallPlan<ReturnType<typeof prepareIndexDtfMint>, ReturnType<typeof prepareIndexDtfBasketApproval>> {
  const call = prepareIndexDtfMint(params);
  const approvals = (params.approvals ?? []).map((approval) =>
    prepareIndexDtfBasketApproval({
      chainId: params.chainId,
      address: params.address,
      token: approval.token,
      amount: approval.amount,
    }),
  );

  return approvals.length ? { type: "approval-required", approvals, call } : { type: "call", call };
}

/** Prepares a `redeem(shares, receiver, assets, minAmountsOut)` contract call (identical bytes on 5.0.0 and 6.0.0). */
export function prepareIndexDtfRedeem(params: PrepareIndexDtfRedeemParams): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "redeem",
    args: getRedeemArgs(params),
  });
}

/** Prepares one ERC20 approval call for a basket token and the DTF as spender. */
export function prepareIndexDtfBasketApproval(params: PrepareIndexDtfBasketApprovalParams) {
  return prepareErc20Approval({
    chainId: params.chainId,
    token: params.token,
    spender: params.address,
    amount: params.amount,
  });
}

/** Applies basis-point slippage to redeem amounts while preserving token order. */
export function getIndexDtfRedeemMinAmounts(params: {
  readonly amounts: readonly bigint[];
  readonly slippageBps: number;
}): readonly bigint[] {
  if (!Number.isInteger(params.slippageBps) || params.slippageBps < 0 || params.slippageBps > 10_000) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "slippageBps must be an integer between 0 and 10000",
      meta: { slippageBps: params.slippageBps },
    });
  }

  const keepBps = BigInt(10_000 - params.slippageBps);

  return params.amounts.map((amount) => (amount * keepBps) / 10_000n);
}

function getMintArgs(params: {
  readonly shares: bigint;
  readonly receiver: Address;
  readonly minSharesOut: bigint;
}): MintArgs {
  return [params.shares, params.receiver, params.minSharesOut] as const;
}

function getRedeemArgs(params: {
  readonly shares: bigint;
  readonly receiver: Address;
  readonly assets: readonly Address[];
  readonly minAmountsOut: readonly bigint[];
}): RedeemArgs {
  return [params.shares, params.receiver, params.assets, params.minAmountsOut] as const;
}
