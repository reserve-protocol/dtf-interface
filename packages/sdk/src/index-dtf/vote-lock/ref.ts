import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { DtfParams } from "@/types/common";

import {
  getVoteLockDao,
  getVoteLockState,
  readVoteLockAllRewardTokens,
  readVoteLockAsset,
  readVoteLockBalanceOf,
  readVoteLockCheckpoint,
  readVoteLockClock,
  readVoteLockClockMode,
  readVoteLockConvertToAssets,
  readVoteLockConvertToShares,
  readVoteLockDelegates,
  readVoteLockDisallowedRewardToken,
  readVoteLockGetPastTotalSupply,
  readVoteLockGetPastVotes,
  readVoteLockGetVotes,
  readVoteLockLock,
  readVoteLockMaxDeposit,
  readVoteLockMaxMint,
  readVoteLockMaxRedeem,
  readVoteLockMaxWithdraw,
  readVoteLockNumCheckpoints,
  readVoteLockOptimisticDelegates,
  readVoteLockOptimisticVotes,
  readVoteLockPastOptimisticVotes,
  readVoteLockPreviewDeposit,
  readVoteLockPreviewMint,
  readVoteLockPreviewRedeem,
  readVoteLockPreviewWithdraw,
  readVoteLockRewardRatio,
  readVoteLockRewardTracker,
  readVoteLockTotalAssets,
  readVoteLockTotalSupply,
  readVoteLockUnderlyingAllowance,
  readVoteLockUnderlyingBalance,
  readVoteLockUnstakingDelay,
  readVoteLockUnstakingManager,
  readVoteLockUnstakingTargetToken,
  readVoteLockUnstakingVault,
  readVoteLockUserRewardTracker,
  prepareVoteLockAddRewardToken,
  prepareVoteLockCancelLock,
  prepareVoteLockClaimLock,
  prepareVoteLockClaimRewards,
  prepareVoteLockDelegate,
  prepareVoteLockDelegateOptimistic,
  prepareVoteLockDeposit,
  prepareVoteLockDepositPlan,
  prepareVoteLockPoke,
  prepareVoteLockRemoveRewardToken,
  prepareVoteLockSetRewardRatio,
  prepareVoteLockSetUnstakingDelay,
  prepareVoteLockWithdraw,
} from "@/index-dtf/vote-lock/index";

type WithoutChainId<T> = T extends unknown ? Omit<T, "chainId"> : never;
type VoteLockDepositRefParams = WithoutChainId<Parameters<typeof prepareVoteLockDeposit>[0]>;
type VoteLockDepositPlanRefParams = WithoutChainId<Parameters<typeof prepareVoteLockDepositPlan>[0]>;

/** Creates address-bound Index DTF vote-lock methods for the flat ref. */
export function createIndexDtfVoteLockRef(client: DtfClient, params: DtfParams) {
  const address = getAddress(params.address);
  const chainId = params.chainId;

  return {
    getVoteLockState: (options: Omit<Parameters<typeof getVoteLockState>[1], "address" | "chainId">) =>
      getVoteLockState(client, { ...options, address, chainId }),
    getVoteLockDao: () => getVoteLockDao(client, { address, chainId }),
    readVoteLockAllRewardTokens: (call: WithoutChainId<Parameters<typeof readVoteLockAllRewardTokens>[1]>) =>
      readVoteLockAllRewardTokens(client, { ...call, chainId }),
    readVoteLockUnderlyingBalance: (call: WithoutChainId<Parameters<typeof readVoteLockUnderlyingBalance>[1]>) =>
      readVoteLockUnderlyingBalance(client, { ...call, chainId }),
    readVoteLockUnderlyingAllowance: (call: WithoutChainId<Parameters<typeof readVoteLockUnderlyingAllowance>[1]>) =>
      readVoteLockUnderlyingAllowance(client, { ...call, chainId }),
    readVoteLockAsset: (call: WithoutChainId<Parameters<typeof readVoteLockAsset>[1]>) =>
      readVoteLockAsset(client, { ...call, chainId }),
    readVoteLockBalanceOf: (call: WithoutChainId<Parameters<typeof readVoteLockBalanceOf>[1]>) =>
      readVoteLockBalanceOf(client, { ...call, chainId }),
    readVoteLockCheckpoint: (call: WithoutChainId<Parameters<typeof readVoteLockCheckpoint>[1]>) =>
      readVoteLockCheckpoint(client, { ...call, chainId }),
    readVoteLockClock: (call: WithoutChainId<Parameters<typeof readVoteLockClock>[1]>) =>
      readVoteLockClock(client, { ...call, chainId }),
    readVoteLockClockMode: (call: WithoutChainId<Parameters<typeof readVoteLockClockMode>[1]>) =>
      readVoteLockClockMode(client, { ...call, chainId }),
    readVoteLockConvertToAssets: (call: WithoutChainId<Parameters<typeof readVoteLockConvertToAssets>[1]>) =>
      readVoteLockConvertToAssets(client, { ...call, chainId }),
    readVoteLockConvertToShares: (call: WithoutChainId<Parameters<typeof readVoteLockConvertToShares>[1]>) =>
      readVoteLockConvertToShares(client, { ...call, chainId }),
    readVoteLockDelegates: (call: WithoutChainId<Parameters<typeof readVoteLockDelegates>[1]>) =>
      readVoteLockDelegates(client, { ...call, chainId }),
    readVoteLockDisallowedRewardToken: (
      call: WithoutChainId<Parameters<typeof readVoteLockDisallowedRewardToken>[1]>,
    ) => readVoteLockDisallowedRewardToken(client, { ...call, chainId }),
    readVoteLockGetPastTotalSupply: (call: WithoutChainId<Parameters<typeof readVoteLockGetPastTotalSupply>[1]>) =>
      readVoteLockGetPastTotalSupply(client, { ...call, chainId }),
    readVoteLockGetPastVotes: (call: WithoutChainId<Parameters<typeof readVoteLockGetPastVotes>[1]>) =>
      readVoteLockGetPastVotes(client, { ...call, chainId }),
    readVoteLockGetVotes: (call: WithoutChainId<Parameters<typeof readVoteLockGetVotes>[1]>) =>
      readVoteLockGetVotes(client, { ...call, chainId }),
    readVoteLockLock: (call: WithoutChainId<Parameters<typeof readVoteLockLock>[1]>) =>
      readVoteLockLock(client, { ...call, chainId }),
    readVoteLockMaxDeposit: (call: WithoutChainId<Parameters<typeof readVoteLockMaxDeposit>[1]>) =>
      readVoteLockMaxDeposit(client, { ...call, chainId }),
    readVoteLockMaxMint: (call: WithoutChainId<Parameters<typeof readVoteLockMaxMint>[1]>) =>
      readVoteLockMaxMint(client, { ...call, chainId }),
    readVoteLockMaxRedeem: (call: WithoutChainId<Parameters<typeof readVoteLockMaxRedeem>[1]>) =>
      readVoteLockMaxRedeem(client, { ...call, chainId }),
    readVoteLockMaxWithdraw: (call: WithoutChainId<Parameters<typeof readVoteLockMaxWithdraw>[1]>) =>
      readVoteLockMaxWithdraw(client, { ...call, chainId }),
    readVoteLockNumCheckpoints: (call: WithoutChainId<Parameters<typeof readVoteLockNumCheckpoints>[1]>) =>
      readVoteLockNumCheckpoints(client, { ...call, chainId }),
    readVoteLockUnstakingDelay: (call: WithoutChainId<Parameters<typeof readVoteLockUnstakingDelay>[1]>) =>
      readVoteLockUnstakingDelay(client, { ...call, chainId }),
    readVoteLockUnstakingManager: (call: WithoutChainId<Parameters<typeof readVoteLockUnstakingManager>[1]>) =>
      readVoteLockUnstakingManager(client, { ...call, chainId }),
    readVoteLockUnstakingTargetToken: (call: WithoutChainId<Parameters<typeof readVoteLockUnstakingTargetToken>[1]>) =>
      readVoteLockUnstakingTargetToken(client, { ...call, chainId }),
    readVoteLockUnstakingVault: (call: WithoutChainId<Parameters<typeof readVoteLockUnstakingVault>[1]>) =>
      readVoteLockUnstakingVault(client, { ...call, chainId }),
    readVoteLockOptimisticDelegates: (call: WithoutChainId<Parameters<typeof readVoteLockOptimisticDelegates>[1]>) =>
      readVoteLockOptimisticDelegates(client, { ...call, chainId }),
    readVoteLockOptimisticVotes: (call: WithoutChainId<Parameters<typeof readVoteLockOptimisticVotes>[1]>) =>
      readVoteLockOptimisticVotes(client, { ...call, chainId }),
    readVoteLockPastOptimisticVotes: (call: WithoutChainId<Parameters<typeof readVoteLockPastOptimisticVotes>[1]>) =>
      readVoteLockPastOptimisticVotes(client, { ...call, chainId }),
    readVoteLockPreviewDeposit: (call: WithoutChainId<Parameters<typeof readVoteLockPreviewDeposit>[1]>) =>
      readVoteLockPreviewDeposit(client, { ...call, chainId }),
    readVoteLockPreviewMint: (call: WithoutChainId<Parameters<typeof readVoteLockPreviewMint>[1]>) =>
      readVoteLockPreviewMint(client, { ...call, chainId }),
    readVoteLockPreviewRedeem: (call: WithoutChainId<Parameters<typeof readVoteLockPreviewRedeem>[1]>) =>
      readVoteLockPreviewRedeem(client, { ...call, chainId }),
    readVoteLockPreviewWithdraw: (call: WithoutChainId<Parameters<typeof readVoteLockPreviewWithdraw>[1]>) =>
      readVoteLockPreviewWithdraw(client, { ...call, chainId }),
    readVoteLockRewardRatio: (call: WithoutChainId<Parameters<typeof readVoteLockRewardRatio>[1]>) =>
      readVoteLockRewardRatio(client, { ...call, chainId }),
    readVoteLockRewardTracker: (call: WithoutChainId<Parameters<typeof readVoteLockRewardTracker>[1]>) =>
      readVoteLockRewardTracker(client, { ...call, chainId }),
    readVoteLockTotalAssets: (call: WithoutChainId<Parameters<typeof readVoteLockTotalAssets>[1]>) =>
      readVoteLockTotalAssets(client, { ...call, chainId }),
    readVoteLockTotalSupply: (call: WithoutChainId<Parameters<typeof readVoteLockTotalSupply>[1]>) =>
      readVoteLockTotalSupply(client, { ...call, chainId }),
    readVoteLockUserRewardTracker: (call: WithoutChainId<Parameters<typeof readVoteLockUserRewardTracker>[1]>) =>
      readVoteLockUserRewardTracker(client, { ...call, chainId }),
    prepareVoteLockAddRewardToken: (call: Omit<Parameters<typeof prepareVoteLockAddRewardToken>[0], "chainId">) =>
      prepareVoteLockAddRewardToken({ ...call, chainId }),
    prepareVoteLockCancelLock: (call: Omit<Parameters<typeof prepareVoteLockCancelLock>[0], "chainId">) =>
      prepareVoteLockCancelLock({ ...call, chainId }),
    prepareVoteLockDeposit: (call: VoteLockDepositRefParams) => prepareVoteLockDeposit({ ...call, chainId }),
    prepareVoteLockDepositPlan: (call: VoteLockDepositPlanRefParams) =>
      prepareVoteLockDepositPlan({ ...call, chainId }),
    prepareVoteLockDelegate: (call: Omit<Parameters<typeof prepareVoteLockDelegate>[0], "chainId">) =>
      prepareVoteLockDelegate({ ...call, chainId }),
    prepareVoteLockDelegateOptimistic: (
      call: Omit<Parameters<typeof prepareVoteLockDelegateOptimistic>[0], "chainId">,
    ) => prepareVoteLockDelegateOptimistic({ ...call, chainId }),
    prepareVoteLockPoke: (call: Omit<Parameters<typeof prepareVoteLockPoke>[0], "chainId">) =>
      prepareVoteLockPoke({ ...call, chainId }),
    prepareVoteLockRemoveRewardToken: (call: Omit<Parameters<typeof prepareVoteLockRemoveRewardToken>[0], "chainId">) =>
      prepareVoteLockRemoveRewardToken({ ...call, chainId }),
    prepareVoteLockSetRewardRatio: (call: Omit<Parameters<typeof prepareVoteLockSetRewardRatio>[0], "chainId">) =>
      prepareVoteLockSetRewardRatio({ ...call, chainId }),
    prepareVoteLockSetUnstakingDelay: (call: Omit<Parameters<typeof prepareVoteLockSetUnstakingDelay>[0], "chainId">) =>
      prepareVoteLockSetUnstakingDelay({ ...call, chainId }),
    prepareVoteLockWithdraw: (call: Omit<Parameters<typeof prepareVoteLockWithdraw>[0], "chainId">) =>
      prepareVoteLockWithdraw({ ...call, chainId }),
    prepareVoteLockClaimRewards: (call: Omit<Parameters<typeof prepareVoteLockClaimRewards>[0], "chainId">) =>
      prepareVoteLockClaimRewards({ ...call, chainId }),
    prepareVoteLockClaimLock: (call: Omit<Parameters<typeof prepareVoteLockClaimLock>[0], "chainId">) =>
      prepareVoteLockClaimLock({ ...call, chainId }),
  };
}
