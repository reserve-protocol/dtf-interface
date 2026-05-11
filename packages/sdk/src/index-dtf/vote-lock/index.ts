import { erc20Abi, getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { ContractCallPlan } from "@/contract-call";
import type { SupportedChainId } from "@/defaults";
import type { Amount, Token } from "@/types/common";
import type { IndexDtf } from "@/types/index-dtf";

import { prepareContractCall, prepareErc20Approval } from "@/contract-call";
import { SdkError } from "@/errors";
import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { unstakingManagerAbi } from "@/index-dtf/abis/unstaking-manager";
import { getDtf } from "@/index-dtf/dtf/index";
import { mapAmount } from "@/lib/utils";

export type VoteLockDao = {
  readonly chainId: number;
  readonly token: Token;
  readonly underlying: { readonly token: Token };
  readonly rewards: readonly {
    readonly token: Token;
    readonly amount: number;
    readonly amountUsd: number;
  }[];
  readonly dtfs: readonly Token[];
  readonly lockedAmount: number;
  readonly lockedAmountUsd: number;
  readonly totalRewardAmountUsd: number;
  readonly avgDailyRewardAmountUsd: number;
  readonly apr: number;
};

type RawToken = Omit<Token, "address"> & { readonly address: string };
type RawVoteLockDao = Omit<VoteLockDao, "token" | "underlying" | "rewards" | "dtfs"> & {
  readonly token: RawToken;
  readonly underlying: { readonly token: RawToken };
  readonly rewards: readonly {
    readonly token: RawToken;
    readonly amount: number;
    readonly amountUsd: number;
  }[];
  readonly dtfs: readonly RawToken[];
};

export type VoteLockState = {
  readonly stToken: Address;
  readonly underlying: Token;
  readonly account: Address;
  readonly underlyingBalance: Amount;
  readonly underlyingAllowance: Amount;
  readonly delegate: Address;
  readonly maxWithdraw: Amount;
  readonly unstakingDelay: bigint;
  readonly unstakingManager: Address;
  readonly underlyingPrice?: number;
};

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

/** Reads all Index DTF vote-lock DAO/APR rows from Reserve API. */
export async function getVoteLockDaos(client: DtfClient): Promise<readonly VoteLockDao[]> {
  const daos = await client.api.get<readonly RawVoteLockDao[]>({
    path: "/dtf/daos",
  });

  return daos.map(mapVoteLockDao);
}

/** Reads one Index DTF vote-lock DAO/APR row from Reserve API. */
export async function getVoteLockDao(
  client: DtfClient,
  params: { readonly address: Address; readonly chainId: IndexDtf["chainId"] },
): Promise<VoteLockDao> {
  const dao = await client.api.get<RawVoteLockDao>({
    path: `/dtf/daos/${getAddress(params.address).toLowerCase()}`,
    query: { chainId: params.chainId },
  });

  return mapVoteLockDao(dao);
}

/** Reads Register's vote-lock drawer state for one account. */
export async function getVoteLockState(
  client: DtfClient,
  params: {
    readonly address: Address;
    readonly chainId: IndexDtf["chainId"];
    readonly account: Address;
  },
): Promise<VoteLockState> {
  const dtf = await getDtf(client, params);
  const vault = dtf.voteLockVault;

  if (!vault) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Index DTF has no vote-lock vault: ${params.address}`,
      meta: { address: params.address, chainId: params.chainId },
    });
  }

  const account = getAddress(params.account);
  const stToken = vault.token.address;
  const underlying = vault.underlying;
  const [balance, allowance, delegate, maxWithdraw, unstakingDelay, unstakingManager, prices] = await Promise.all([
    client.viem.readContract({
      address: underlying.address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account],
      chainId: params.chainId,
    }),
    client.viem.readContract({
      address: underlying.address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [account, stToken],
      chainId: params.chainId,
    }),
    client.viem.readContract({
      address: stToken,
      abi: dtfIndexStakingVaultAbi,
      functionName: "delegates",
      args: [account],
      chainId: params.chainId,
    }),
    client.viem.readContract({
      address: stToken,
      abi: dtfIndexStakingVaultAbi,
      functionName: "maxWithdraw",
      args: [account],
      chainId: params.chainId,
    }),
    client.viem.readContract({
      address: stToken,
      abi: dtfIndexStakingVaultAbi,
      functionName: "unstakingDelay",
      chainId: params.chainId,
    }),
    client.viem.readContract({
      address: stToken,
      abi: dtfIndexStakingVaultAbi,
      functionName: "unstakingManager",
      chainId: params.chainId,
    }),
    client.api.getTokenPrices({
      chainId: params.chainId,
      addresses: [underlying.address],
    }),
  ]);

  return {
    stToken,
    underlying,
    account,
    underlyingBalance: mapAmount(balance, underlying.decimals),
    underlyingAllowance: mapAmount(allowance, underlying.decimals),
    delegate: getAddress(delegate),
    maxWithdraw: mapAmount(maxWithdraw, underlying.decimals),
    unstakingDelay,
    unstakingManager: getAddress(unstakingManager),
    ...(prices[0] ? { underlyingPrice: prices[0].price } : {}),
  };
}

/** Prepares underlying-token approval call for a vote-lock deposit. */
export function prepareVoteLockApproval(params: {
  readonly underlying: Address;
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
  readonly amount: bigint;
}) {
  return prepareErc20Approval({
    chainId: params.chainId,
    token: params.underlying,
    spender: params.stToken,
    amount: params.amount,
  });
}

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
    args: [params.amount, getAddress(params.receiver)] as const,
  });
}

/** Prepares approval + deposit calls for vote-lock deposits. */
export function prepareVoteLockDepositPlan(
  params: PrepareVoteLockDepositPlanParams,
): ContractCallPlan<ReturnType<typeof prepareVoteLockDeposit>, ReturnType<typeof prepareVoteLockApproval>> {
  const call = prepareVoteLockDeposit(params);

  if (!params.approval) {
    return { type: "call", call };
  }

  return {
    type: "approval-required",
    approvals: [
      prepareVoteLockApproval({
        chainId: params.chainId,
        underlying: params.approval.underlying,
        stToken: params.stToken,
        amount: params.approval.amount,
      }),
    ],
    call,
  };
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

function mapVoteLockDao(dao: RawVoteLockDao): VoteLockDao {
  return {
    ...dao,
    token: mapToken(dao.token),
    underlying: { token: mapToken(dao.underlying.token) },
    rewards: dao.rewards.map((reward) => ({
      ...reward,
      token: mapToken(reward.token),
    })),
    dtfs: dao.dtfs.map(mapToken),
  };
}

function mapToken(token: RawToken): Token {
  return {
    ...token,
    address: getAddress(token.address),
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
    args: [getAddress(params.delegatee)] as const,
  });
}

/** Prepares a staking-vault withdraw call that starts an unlock when delay is enabled. */
export function prepareVoteLockUnlock(params: {
  readonly stToken: Address;
  readonly chainId: SupportedChainId;
  readonly amount: bigint;
  readonly account: Address;
}) {
  const account = getAddress(params.account);

  return prepareContractCall({
    chainId: params.chainId,
    address: params.stToken,
    abi: dtfIndexStakingVaultAbi,
    functionName: "withdraw",
    args: [params.amount, account, account] as const,
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
    args: [params.rewardTokens.map(getAddress)] as const,
  });
}

/** Prepares an unstaking-manager `claimLock(lockId)` call. */
export function prepareVoteLockClaimWithdrawal(params: {
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
