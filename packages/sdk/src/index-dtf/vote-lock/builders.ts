import type { Address } from "viem";

import type { SupportedChainId } from "@/config";
import type { ContractCallPlan } from "@/lib/contract-call";

import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { dtfIndexStakingVaultOptimisticAbi } from "@/index-dtf/abis/dtf-index-staking-vault-optimistic";
import { unstakingManagerAbi } from "@/index-dtf/abis/unstaking-manager";
import { prepareContractCall, prepareErc20Approval } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";
import { toUint } from "@/lib/utils";

type VoteLockDepositInput = {
  readonly stToken: Address;
  readonly amount: bigint;
} & ({ readonly delegateToSelf: true } | { readonly receiver: Address; readonly delegateToSelf?: false });

export type PrepareVoteLockDepositParams = VoteLockDepositInput & {
  readonly chainId: SupportedChainId;
};

export type PrepareVoteLockDepositPlanParams = PrepareVoteLockDepositParams & {
  readonly approval?: {
    readonly underlying: Address;
    readonly amount: bigint;
  };
};

/** Prepares a staking-vault deposit call, optionally self-delegating voting power. */
export function prepareVoteLockDeposit(params: PrepareVoteLockDepositParams) {
  if (params.delegateToSelf) {
    throwIfReceiverIsUnused(params);

    return prepareContractCall({
      chainId: params.chainId,
      address: params.stToken,
      abi: dtfIndexStakingVaultAbi,
      functionName: "depositAndDelegate",
      args: [params.amount] as const,
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "deposit",
    args: [params.amount, params.receiver] as const,
  });
}

/** Prepares approval + deposit calls for vote-lock deposits. */
export function prepareVoteLockDepositPlan(
  params: PrepareVoteLockDepositPlanParams,
): ContractCallPlan<ReturnType<typeof prepareVoteLockDeposit>, ReturnType<typeof prepareErc20Approval>> {
  const call = prepareVoteLockDeposit(params);

  if (!params.approval) {
    return { type: "call", call };
  }

  return {
    type: "approval-required",
    approvals: [
      prepareErc20Approval({
        chainId: params.chainId,
        token: params.approval.underlying,
        spender: params.stToken,
        amount: params.approval.amount,
      }),
    ],
    call,
  };
}

/** Prepares a staking-vault delegation call. */
export function prepareVoteLockDelegate(params: {
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
  readonly delegatee: Address;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "delegate",
    args: [params.delegatee] as const,
  });
}

/** Prepares a staking-vault optimistic delegation call used for veto power. */
export function prepareVoteLockDelegateOptimistic(params: {
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
  readonly delegatee: Address;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.stToken,
    abi: dtfIndexStakingVaultOptimisticAbi,
    functionName: "delegateOptimistic",
    args: [params.delegatee] as const,
  });
}

/** Prepares an admin `addRewardToken` call. */
export function prepareVoteLockAddRewardToken(params: {
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
  readonly rewardToken: Address;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "addRewardToken",
    args: [params.rewardToken] as const,
  });
}

/** Prepares an admin `removeRewardToken` call. */
export function prepareVoteLockRemoveRewardToken(params: {
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
  readonly rewardToken: Address;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "removeRewardToken",
    args: [params.rewardToken] as const,
  });
}

/** Prepares an admin `setRewardRatio` call. */
export function prepareVoteLockSetRewardRatio(params: {
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
  readonly rewardHalfLife: number | bigint;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "setRewardRatio",
    args: [toUint(params.rewardHalfLife, "rewardHalfLife")] as const,
  });
}

/** Prepares an admin `setUnstakingDelay` call. */
export function prepareVoteLockSetUnstakingDelay(params: {
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
  readonly delay: number | bigint;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "setUnstakingDelay",
    args: [toUint(params.delay, "delay")] as const,
  });
}

/** Prepares a staking-vault `poke` call. */
export function prepareVoteLockPoke(params: { readonly stToken: Address; readonly chainId: SupportedChainId }) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "poke",
    args: [] as const,
  });
}

/** Prepares a staking-vault `withdraw` call that starts an unlock when delay is enabled. */
export function prepareVoteLockWithdraw(params: {
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
  readonly amount: bigint;
  readonly account: Address;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "withdraw",
    args: [params.amount, params.account, params.account] as const,
  });
}

/** Prepares a staking-vault reward claim call. */
export function prepareVoteLockClaimRewards(params: {
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
  readonly rewardTokens: readonly Address[];
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "claimRewards",
    args: [params.rewardTokens] as const,
  });
}

/** Prepares an unstaking-manager `claimLock(lockId)` call. */
export function prepareVoteLockClaimLock(params: {
  readonly unstakingManager: Address;
  readonly chainId: SupportedChainId;
  readonly lockId: bigint;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.unstakingManager,
    abi: unstakingManagerAbi,
    functionName: "claimLock",
    args: [params.lockId] as const,
  });
}

/** Prepares an unstaking-manager `cancelLock(lockId)` call. */
export function prepareVoteLockCancelLock(params: {
  readonly unstakingManager: Address;
  readonly chainId: SupportedChainId;
  readonly lockId: bigint;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.unstakingManager,
    abi: unstakingManagerAbi,
    functionName: "cancelLock",
    args: [params.lockId] as const,
  });
}

function throwIfReceiverIsUnused(params: VoteLockDepositInput) {
  if (params.delegateToSelf && "receiver" in params) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "receiver is not used for depositAndDelegate",
      meta: { receiver: params.receiver },
    });
  }
}
