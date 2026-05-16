import { erc20Abi, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";

import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { dtfIndexStakingVaultOptimisticAbi } from "@/index-dtf/abis/dtf-index-staking-vault-optimistic";
import { unstakingManagerAbi } from "@/index-dtf/abis/unstaking-manager";

export type ReadVoteLockUnderlyingBalanceParams = {
  readonly underlying: Address;
  readonly chainId: SupportedChainId;
  readonly account: Address;
};

export type ReadVoteLockAllowanceParams = ReadVoteLockUnderlyingBalanceParams & {
  readonly stToken: Address;
};

export type ReadVoteLockAccountParams = {
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
  readonly account: Address;
};

export type ReadVoteLockCheckpointParams = ReadVoteLockAccountParams & {
  readonly position: number;
};

export type ReadVoteLockParams = {
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
};

export type ReadVoteLockAmountParams = ReadVoteLockParams & {
  readonly amount: bigint;
};

export type ReadVoteLockSharesParams = ReadVoteLockParams & {
  readonly shares: bigint;
};

export type ReadVoteLockTimepointParams = ReadVoteLockParams & {
  readonly timepoint: bigint;
};

export type ReadVoteLockAccountTimepointParams = ReadVoteLockAccountParams & {
  readonly timepoint: bigint;
};

export type ReadVoteLockRewardTokenParams = ReadVoteLockParams & {
  readonly rewardToken: Address;
};

export type ReadVoteLockUserRewardTrackerParams = ReadVoteLockRewardTokenParams & {
  readonly account: Address;
};

export type ReadVoteLockUnstakingManagerParams = {
  readonly unstakingManager: Address;
  readonly chainId: SupportedChainId;
};

export type ReadVoteLockLockParams = ReadVoteLockUnstakingManagerParams & {
  readonly lockId: bigint;
};

export function readVoteLockUnderlyingBalance(client: DtfClient, params: ReadVoteLockUnderlyingBalanceParams) {
  return client.viem.readContract({
    address: params.underlying,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockAllowance(client: DtfClient, params: ReadVoteLockAllowanceParams) {
  return client.viem.readContract({
    address: params.underlying,
    abi: erc20Abi,
    functionName: "allowance",
    args: [params.account, params.stToken],
    chainId: params.chainId,
  });
}

export function readVoteLockAsset(client: DtfClient, params: ReadVoteLockParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "asset",
    chainId: params.chainId,
  });
}

export function readVoteLockBalanceOf(client: DtfClient, params: ReadVoteLockAccountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "balanceOf",
    args: [params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockClockMode(client: DtfClient, params: ReadVoteLockParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "CLOCK_MODE",
    chainId: params.chainId,
  });
}

export function readVoteLockClock(client: DtfClient, params: ReadVoteLockParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "clock",
    chainId: params.chainId,
  });
}

export function readVoteLockCheckpoint(client: DtfClient, params: ReadVoteLockCheckpointParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "checkpoints",
    args: [params.account, params.position],
    chainId: params.chainId,
  });
}

export function readVoteLockNumCheckpoints(client: DtfClient, params: ReadVoteLockAccountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "numCheckpoints",
    args: [params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockDelegates(client: DtfClient, params: ReadVoteLockAccountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "delegates",
    args: [params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockMaxWithdraw(client: DtfClient, params: ReadVoteLockAccountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "maxWithdraw",
    args: [params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockTotalSupply(client: DtfClient, params: ReadVoteLockParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "totalSupply",
    chainId: params.chainId,
  });
}

export function readVoteLockTotalAssets(client: DtfClient, params: ReadVoteLockParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "totalAssets",
    chainId: params.chainId,
  });
}

export function readVoteLockGetVotes(client: DtfClient, params: ReadVoteLockAccountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "getVotes",
    args: [params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockGetPastVotes(client: DtfClient, params: ReadVoteLockAccountTimepointParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "getPastVotes",
    args: [params.account, params.timepoint],
    chainId: params.chainId,
  });
}

export function readVoteLockGetPastTotalSupply(client: DtfClient, params: ReadVoteLockTimepointParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "getPastTotalSupply",
    args: [params.timepoint],
    chainId: params.chainId,
  });
}

export function readVoteLockAllRewardTokens(client: DtfClient, params: ReadVoteLockParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "getAllRewardTokens",
    chainId: params.chainId,
  });
}

export function readVoteLockDisallowedRewardToken(client: DtfClient, params: ReadVoteLockRewardTokenParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "disallowedRewardTokens",
    args: [params.rewardToken],
    chainId: params.chainId,
  });
}

export function readVoteLockRewardRatio(client: DtfClient, params: ReadVoteLockParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "rewardRatio",
    chainId: params.chainId,
  });
}

export function readVoteLockRewardTracker(client: DtfClient, params: ReadVoteLockRewardTokenParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "rewardTrackers",
    args: [params.rewardToken],
    chainId: params.chainId,
  });
}

export function readVoteLockUserRewardTracker(client: DtfClient, params: ReadVoteLockUserRewardTrackerParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "userRewardTrackers",
    args: [params.rewardToken, params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockConvertToAssets(client: DtfClient, params: ReadVoteLockSharesParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "convertToAssets",
    args: [params.shares],
    chainId: params.chainId,
  });
}

export function readVoteLockConvertToShares(client: DtfClient, params: ReadVoteLockAmountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "convertToShares",
    args: [params.amount],
    chainId: params.chainId,
  });
}

export function readVoteLockMaxDeposit(client: DtfClient, params: ReadVoteLockAccountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "maxDeposit",
    args: [params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockMaxMint(client: DtfClient, params: ReadVoteLockAccountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "maxMint",
    args: [params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockMaxRedeem(client: DtfClient, params: ReadVoteLockAccountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "maxRedeem",
    args: [params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockPreviewDeposit(client: DtfClient, params: ReadVoteLockAmountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "previewDeposit",
    args: [params.amount],
    chainId: params.chainId,
  });
}

export function readVoteLockPreviewMint(client: DtfClient, params: ReadVoteLockSharesParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "previewMint",
    args: [params.shares],
    chainId: params.chainId,
  });
}

export function readVoteLockPreviewRedeem(client: DtfClient, params: ReadVoteLockSharesParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "previewRedeem",
    args: [params.shares],
    chainId: params.chainId,
  });
}

export function readVoteLockPreviewWithdraw(client: DtfClient, params: ReadVoteLockAmountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "previewWithdraw",
    args: [params.amount],
    chainId: params.chainId,
  });
}

export function readVoteLockUnstakingDelay(client: DtfClient, params: ReadVoteLockParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "unstakingDelay",
    chainId: params.chainId,
  });
}

export function readVoteLockUnstakingManager(client: DtfClient, params: ReadVoteLockParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "unstakingManager",
    chainId: params.chainId,
  });
}

export function readVoteLockOptimisticDelegates(client: DtfClient, params: ReadVoteLockAccountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultOptimisticAbi,
    functionName: "optimisticDelegates",
    args: [params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockOptimisticVotes(client: DtfClient, params: ReadVoteLockAccountParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultOptimisticAbi,
    functionName: "getOptimisticVotes",
    args: [params.account],
    chainId: params.chainId,
  });
}

export function readVoteLockPastOptimisticVotes(client: DtfClient, params: ReadVoteLockAccountTimepointParams) {
  return client.viem.readContract({
    address: params.stToken,
    abi: dtfIndexStakingVaultOptimisticAbi,
    functionName: "getPastOptimisticVotes",
    args: [params.account, params.timepoint],
    chainId: params.chainId,
  });
}

export function readVoteLockLock(client: DtfClient, params: ReadVoteLockLockParams) {
  return client.viem.readContract({
    address: params.unstakingManager,
    abi: unstakingManagerAbi,
    functionName: "locks",
    args: [params.lockId],
    chainId: params.chainId,
  });
}

export function readVoteLockUnstakingTargetToken(client: DtfClient, params: ReadVoteLockUnstakingManagerParams) {
  return client.viem.readContract({
    address: params.unstakingManager,
    abi: unstakingManagerAbi,
    functionName: "targetToken",
    chainId: params.chainId,
  });
}

export function readVoteLockUnstakingVault(client: DtfClient, params: ReadVoteLockUnstakingManagerParams) {
  return client.viem.readContract({
    address: params.unstakingManager,
    abi: unstakingManagerAbi,
    functionName: "vault",
    chainId: params.chainId,
  });
}
