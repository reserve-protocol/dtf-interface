import type { DtfClient } from "@/client";

import {
  getVoteLockDao,
  getVoteLockDaos,
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

/** Creates the direct Index DTF vote-lock methods for the flat root namespace. */
export function createIndexDtfVoteLockNamespace(client: DtfClient) {
  return {
    getVoteLockState: (params: Parameters<typeof getVoteLockState>[1]) => getVoteLockState(client, params),
    getVoteLockDao: (params: Parameters<typeof getVoteLockDao>[1]) => getVoteLockDao(client, params),
    getVoteLockDaos: () => getVoteLockDaos(client),
    readVoteLockAllRewardTokens: (params: Parameters<typeof readVoteLockAllRewardTokens>[1]) =>
      readVoteLockAllRewardTokens(client, params),
    readVoteLockUnderlyingBalance: (params: Parameters<typeof readVoteLockUnderlyingBalance>[1]) =>
      readVoteLockUnderlyingBalance(client, params),
    readVoteLockUnderlyingAllowance: (params: Parameters<typeof readVoteLockUnderlyingAllowance>[1]) =>
      readVoteLockUnderlyingAllowance(client, params),
    readVoteLockAsset: (params: Parameters<typeof readVoteLockAsset>[1]) => readVoteLockAsset(client, params),
    readVoteLockBalanceOf: (params: Parameters<typeof readVoteLockBalanceOf>[1]) =>
      readVoteLockBalanceOf(client, params),
    readVoteLockCheckpoint: (params: Parameters<typeof readVoteLockCheckpoint>[1]) =>
      readVoteLockCheckpoint(client, params),
    readVoteLockClock: (params: Parameters<typeof readVoteLockClock>[1]) => readVoteLockClock(client, params),
    readVoteLockClockMode: (params: Parameters<typeof readVoteLockClockMode>[1]) =>
      readVoteLockClockMode(client, params),
    readVoteLockConvertToAssets: (params: Parameters<typeof readVoteLockConvertToAssets>[1]) =>
      readVoteLockConvertToAssets(client, params),
    readVoteLockConvertToShares: (params: Parameters<typeof readVoteLockConvertToShares>[1]) =>
      readVoteLockConvertToShares(client, params),
    readVoteLockDelegates: (params: Parameters<typeof readVoteLockDelegates>[1]) =>
      readVoteLockDelegates(client, params),
    readVoteLockDisallowedRewardToken: (params: Parameters<typeof readVoteLockDisallowedRewardToken>[1]) =>
      readVoteLockDisallowedRewardToken(client, params),
    readVoteLockGetPastTotalSupply: (params: Parameters<typeof readVoteLockGetPastTotalSupply>[1]) =>
      readVoteLockGetPastTotalSupply(client, params),
    readVoteLockGetPastVotes: (params: Parameters<typeof readVoteLockGetPastVotes>[1]) =>
      readVoteLockGetPastVotes(client, params),
    readVoteLockGetVotes: (params: Parameters<typeof readVoteLockGetVotes>[1]) => readVoteLockGetVotes(client, params),
    readVoteLockLock: (params: Parameters<typeof readVoteLockLock>[1]) => readVoteLockLock(client, params),
    readVoteLockMaxDeposit: (params: Parameters<typeof readVoteLockMaxDeposit>[1]) =>
      readVoteLockMaxDeposit(client, params),
    readVoteLockMaxMint: (params: Parameters<typeof readVoteLockMaxMint>[1]) => readVoteLockMaxMint(client, params),
    readVoteLockMaxRedeem: (params: Parameters<typeof readVoteLockMaxRedeem>[1]) =>
      readVoteLockMaxRedeem(client, params),
    readVoteLockMaxWithdraw: (params: Parameters<typeof readVoteLockMaxWithdraw>[1]) =>
      readVoteLockMaxWithdraw(client, params),
    readVoteLockNumCheckpoints: (params: Parameters<typeof readVoteLockNumCheckpoints>[1]) =>
      readVoteLockNumCheckpoints(client, params),
    readVoteLockUnstakingDelay: (params: Parameters<typeof readVoteLockUnstakingDelay>[1]) =>
      readVoteLockUnstakingDelay(client, params),
    readVoteLockUnstakingManager: (params: Parameters<typeof readVoteLockUnstakingManager>[1]) =>
      readVoteLockUnstakingManager(client, params),
    readVoteLockUnstakingTargetToken: (params: Parameters<typeof readVoteLockUnstakingTargetToken>[1]) =>
      readVoteLockUnstakingTargetToken(client, params),
    readVoteLockUnstakingVault: (params: Parameters<typeof readVoteLockUnstakingVault>[1]) =>
      readVoteLockUnstakingVault(client, params),
    readVoteLockOptimisticDelegates: (params: Parameters<typeof readVoteLockOptimisticDelegates>[1]) =>
      readVoteLockOptimisticDelegates(client, params),
    readVoteLockOptimisticVotes: (params: Parameters<typeof readVoteLockOptimisticVotes>[1]) =>
      readVoteLockOptimisticVotes(client, params),
    readVoteLockPastOptimisticVotes: (params: Parameters<typeof readVoteLockPastOptimisticVotes>[1]) =>
      readVoteLockPastOptimisticVotes(client, params),
    readVoteLockPreviewDeposit: (params: Parameters<typeof readVoteLockPreviewDeposit>[1]) =>
      readVoteLockPreviewDeposit(client, params),
    readVoteLockPreviewMint: (params: Parameters<typeof readVoteLockPreviewMint>[1]) =>
      readVoteLockPreviewMint(client, params),
    readVoteLockPreviewRedeem: (params: Parameters<typeof readVoteLockPreviewRedeem>[1]) =>
      readVoteLockPreviewRedeem(client, params),
    readVoteLockPreviewWithdraw: (params: Parameters<typeof readVoteLockPreviewWithdraw>[1]) =>
      readVoteLockPreviewWithdraw(client, params),
    readVoteLockRewardRatio: (params: Parameters<typeof readVoteLockRewardRatio>[1]) =>
      readVoteLockRewardRatio(client, params),
    readVoteLockRewardTracker: (params: Parameters<typeof readVoteLockRewardTracker>[1]) =>
      readVoteLockRewardTracker(client, params),
    readVoteLockTotalAssets: (params: Parameters<typeof readVoteLockTotalAssets>[1]) =>
      readVoteLockTotalAssets(client, params),
    readVoteLockTotalSupply: (params: Parameters<typeof readVoteLockTotalSupply>[1]) =>
      readVoteLockTotalSupply(client, params),
    readVoteLockUserRewardTracker: (params: Parameters<typeof readVoteLockUserRewardTracker>[1]) =>
      readVoteLockUserRewardTracker(client, params),
    prepareVoteLockAddRewardToken,
    prepareVoteLockCancelLock,
    prepareVoteLockDeposit,
    prepareVoteLockDepositPlan,
    prepareVoteLockDelegate,
    prepareVoteLockDelegateOptimistic,
    prepareVoteLockPoke,
    prepareVoteLockRemoveRewardToken,
    prepareVoteLockSetRewardRatio,
    prepareVoteLockSetUnstakingDelay,
    prepareVoteLockWithdraw,
    prepareVoteLockClaimRewards,
    prepareVoteLockClaimLock,
  };
}
