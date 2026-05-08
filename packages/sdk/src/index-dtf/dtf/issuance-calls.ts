import {
  encodeFunctionData,
  getAddress,
  type Address,
  type Hex,
} from "viem";
import { SdkError } from "../../errors.js";
import { dtfIndexAbi } from "../abis/dtf-index-abi.js";
import type { BuiltIndexDtfCall } from "../calls.js";
import { buildErc20ApprovalCall } from "../calls.js";

/** Builds v5 `mint(shares, receiver, minSharesOut)` calldata. */
export function buildIndexDtfMintCall(params: {
  readonly address: Address;
  readonly shares: bigint;
  readonly receiver: Address;
  readonly minSharesOut: bigint;
}): BuiltIndexDtfCall<readonly [bigint, Address, bigint]> {
  const args = [params.shares, getAddress(params.receiver), params.minSharesOut] as const;

  return {
    target: getAddress(params.address),
    functionName: "mint",
    args,
    calldata: encodeFunctionData({ abi: dtfIndexAbi, functionName: "mint", args }) as Hex,
  };
}

/** Builds v5 `redeem(shares, receiver, assets, minAmountsOut)` calldata. */
export function buildIndexDtfRedeemCall(params: {
  readonly address: Address;
  readonly shares: bigint;
  readonly receiver: Address;
  readonly assets: readonly Address[];
  readonly minAmountsOut: readonly bigint[];
}): BuiltIndexDtfCall<readonly [bigint, Address, readonly Address[], readonly bigint[]]> {
  const assets = params.assets.map(getAddress);
  const args = [params.shares, getAddress(params.receiver), assets, params.minAmountsOut] as const;

  return {
    target: getAddress(params.address),
    functionName: "redeem",
    args,
    calldata: encodeFunctionData({ abi: dtfIndexAbi, functionName: "redeem", args }) as Hex,
  };
}

/** Builds one ERC20 approval call for a basket token and the DTF as spender. */
export function buildIndexDtfBasketApprovalCall(params: {
  readonly token: Address;
  readonly address: Address;
  readonly amount: bigint;
}) {
  return buildErc20ApprovalCall({
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
