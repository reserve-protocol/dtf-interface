import {
  encodeFunctionData,
  erc20Abi,
  getAddress,
  type Abi,
  type Address,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type Hex,
} from "viem";
import type { SupportedChainId } from "./defaults.js";

type WriteStateMutability = "nonpayable" | "payable";
type WriteFunctionArgs<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi, WriteStateMutability>,
> = ContractFunctionArgs<TAbi, WriteStateMutability, TFunctionName> extends readonly unknown[]
  ? ContractFunctionArgs<TAbi, WriteStateMutability, TFunctionName>
  : readonly [];

export type ContractCall<
  TArgs extends readonly unknown[] = readonly unknown[],
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
> = {
  readonly chainId: SupportedChainId;
  readonly to: Address;
  readonly data: Hex;
  readonly value: bigint;
  readonly contract: {
    readonly address: Address;
    readonly abi: TAbi;
    readonly functionName: TFunctionName;
    readonly args: TArgs;
  };
};

export type ContractCallPlan<
  TCall extends ContractCall = ContractCall,
  TApproval extends ContractCall = ContractCall,
> =
  | { readonly type: "call"; readonly call: TCall }
  | {
      readonly type: "approval-required";
      readonly approvals: readonly TApproval[];
      readonly call: TCall;
    };

export function prepareContractCall<
  const TAbi extends Abi | readonly unknown[],
  const TFunctionName extends ContractFunctionName<TAbi, WriteStateMutability>,
>(params: {
  readonly chainId: SupportedChainId;
  readonly address: Address;
  readonly abi: TAbi;
  readonly functionName: TFunctionName;
  readonly args: WriteFunctionArgs<TAbi, TFunctionName>;
  readonly value?: bigint;
}): ContractCall<WriteFunctionArgs<TAbi, TFunctionName>, TAbi, TFunctionName> {
  const address = getAddress(params.address);
  const data = encodeFunctionData({
    abi: params.abi,
    functionName: params.functionName,
    args: params.args,
  } as never) as Hex;

  return {
    chainId: params.chainId,
    to: address,
    data,
    value: params.value ?? 0n,
    contract: {
      address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args,
    },
  };
}

/** Prepares a standard ERC20 approval contract call for SDK consumers. */
export function prepareErc20Approval(params: {
  readonly chainId: SupportedChainId;
  readonly token: Address;
  readonly spender: Address;
  readonly amount: bigint;
}): ContractCall<readonly [Address, bigint], typeof erc20Abi, "approve"> {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.token,
    abi: erc20Abi,
    functionName: "approve",
    args: [getAddress(params.spender), params.amount] as const,
  });
}
