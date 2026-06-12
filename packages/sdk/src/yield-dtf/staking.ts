import { erc20Abi, getAddress, hexToBigInt, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { ContractCall, ContractCallPlan } from "@/lib/contract-call";
import type { YieldDtfParams, YieldDtfStakeRecord, YieldDtfStakingState } from "@/types/yield-dtf";

import { prepareContractCall, prepareErc20Approval } from "@/lib/contract-call";
import { mapAmount } from "@/lib/utils";
import { facadeReadAbi } from "@/yield-dtf/abis/facade-read";
import { stRsrAbi } from "@/yield-dtf/abis/st-rsr";
import { FACADE_READ_ADDRESS, RSR_ADDRESS, type YieldDtfChainId } from "@/yield-dtf/config";
import { mapYieldDtfStakeRecord } from "@/yield-dtf/dtf/mappers";
import { GetAccountStakeRecordsDocument } from "@/yield-dtf/subgraph/yield.generated";

export type GetYieldDtfStakingStateParams = YieldDtfParams & {
  readonly stToken: Address;
  readonly account: Address;
};

/** Reads everything the staking drawer needs for one account. */
export async function getYieldDtfStakingState(
  client: DtfClient,
  params: GetYieldDtfStakingStateParams,
): Promise<YieldDtfStakingState> {
  const address = getAddress(params.address);
  const stToken = getAddress(params.stToken);
  const account = getAddress(params.account);
  const rsr = RSR_ADDRESS[params.chainId];
  const publicClient = client.viem.getPublicClient(params.chainId);

  const [[exchangeRate, unstakingDelay, rsrBalance, rsrAllowance, stTokenBalance], draftEraSlot] = await Promise.all([
    publicClient.multicall({
      allowFailure: false,
      contracts: [
        { address: stToken, abi: stRsrAbi, functionName: "exchangeRate" },
        { address: stToken, abi: stRsrAbi, functionName: "unstakingDelay" },
        { address: rsr, abi: erc20Abi, functionName: "balanceOf", args: [account] },
        { address: rsr, abi: erc20Abi, functionName: "allowance", args: [account, stToken] },
        { address: stToken, abi: erc20Abi, functionName: "balanceOf", args: [account] },
      ],
    }),
    // WHY: stRSR has no public getter for draftEra; the protocol's own UI reads
    // storage slot 0x109 directly, and the facade needs it for pendingUnstakings.
    publicClient.getStorageAt({
      address: stToken,
      slot: "0x0000000000000000000000000000000000000000000000000000000000000109",
    }),
  ]);
  const draftEra = draftEraSlot ? hexToBigInt(draftEraSlot) : 0n;

  const pendingUnstakes = await publicClient.readContract({
    address: FACADE_READ_ADDRESS[params.chainId],
    abi: facadeReadAbi,
    functionName: "pendingUnstakings",
    args: [address, draftEra, account],
  });

  return {
    stToken,
    account,
    exchangeRate: mapAmount(exchangeRate),
    unstakingDelay: Number(unstakingDelay),
    rsrBalance: mapAmount(rsrBalance),
    rsrAllowance: mapAmount(rsrAllowance),
    stTokenBalance: mapAmount(stTokenBalance),
    pendingUnstakes: pendingUnstakes.map((pending) => ({
      index: Number(pending.index),
      availableAt: Number(pending.availableAt),
      amount: mapAmount(pending.amount),
    })),
  };
}

export type GetYieldDtfStakeHistoryParams = YieldDtfParams & {
  readonly account: Address;
  readonly limit?: number;
  readonly offset?: number;
};

/** Historical stake/unstake records for an account, oldest first. */
export async function getYieldDtfStakeHistory(
  client: DtfClient,
  params: GetYieldDtfStakeHistoryParams,
): Promise<readonly YieldDtfStakeRecord[]> {
  const { accountStakeRecords } = await client.subgraph.queryYield({
    chainId: params.chainId,
    query: GetAccountStakeRecordsDocument,
    variables: {
      accountRTokenId: `${params.account.toLowerCase()}-${params.address.toLowerCase()}`,
      limit: params.limit ?? 500,
      offset: params.offset ?? 0,
    },
  });
  return accountStakeRecords.map(mapYieldDtfStakeRecord);
}

export type YieldDtfStakeParams = {
  readonly chainId: YieldDtfChainId;
  readonly stToken: Address;
  readonly amount: bigint;
};

export function prepareYieldDtfStake(params: YieldDtfStakeParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.stToken),
    abi: stRsrAbi,
    functionName: "stake",
    args: [params.amount],
  });
}

/** Stake call plus the RSR approval it needs. */
export function prepareYieldDtfStakePlan(params: YieldDtfStakeParams): ContractCallPlan {
  return {
    type: "approval-required",
    approvals: [
      prepareErc20Approval({
        chainId: params.chainId,
        token: RSR_ADDRESS[params.chainId],
        spender: getAddress(params.stToken),
        amount: params.amount,
      }),
    ],
    call: prepareYieldDtfStake(params),
  };
}

export function prepareYieldDtfUnstake(params: YieldDtfStakeParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.stToken),
    abi: stRsrAbi,
    functionName: "unstake",
    args: [params.amount],
  });
}

export type YieldDtfWithdrawParams = {
  readonly chainId: YieldDtfChainId;
  readonly stToken: Address;
  readonly account: Address;
  /** Drafts with id < endId are withdrawn; they must be past `availableAt`. Pass BigInt(lastAvailable.index + 1). */
  readonly endId: bigint;
};

export function prepareYieldDtfWithdraw(params: YieldDtfWithdrawParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.stToken),
    abi: stRsrAbi,
    functionName: "withdraw",
    args: [getAddress(params.account), params.endId],
  });
}

export type YieldDtfCancelUnstakeParams = {
  readonly chainId: YieldDtfChainId;
  readonly stToken: Address;
  readonly endId: bigint;
};

export function prepareYieldDtfCancelUnstake(params: YieldDtfCancelUnstakeParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.stToken),
    abi: stRsrAbi,
    functionName: "cancelUnstake",
    args: [params.endId],
  });
}
