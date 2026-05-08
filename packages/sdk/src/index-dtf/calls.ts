import { encodeFunctionData, erc20Abi, getAddress, type Address, type Hex } from "viem";
import type { IndexDtfCall } from "../types/governance.js";

export type BuiltIndexDtfCall<TArgs extends readonly unknown[] = readonly unknown[]> =
  IndexDtfCall & {
    readonly functionName: string;
    readonly args: TArgs;
  };

/**
 * Builds a standard ERC20 approval call for SDK consumers that want calldata
 * instead of a wallet-bound write helper.
 */
export function buildErc20ApprovalCall(params: {
  readonly token: Address;
  readonly spender: Address;
  readonly amount: bigint;
}): BuiltIndexDtfCall<readonly [Address, bigint]> {
  const args = [getAddress(params.spender), params.amount] as const;

  return {
    target: getAddress(params.token),
    functionName: "approve",
    args,
    calldata: encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args,
    }) as Hex,
  };
}
