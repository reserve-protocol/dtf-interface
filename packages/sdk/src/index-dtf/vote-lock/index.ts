import { encodeFunctionData, erc20Abi, getAddress, type Address, type Hex } from "viem";
import type { DtfClient } from "../../client.js";
import { SdkError } from "../../errors.js";
import { mapAmount } from "../../lib/utils.js";
import type { Amount, Token } from "../../types/common.js";
import type { IndexDtf } from "../../types/index-dtf.js";
import { unstakingManagerAbi } from "../abis/unstaking-manager.js";
import { dtfIndexStakingVaultAbi } from "../abis/dtf-index-staking-vault.js";
import type { BuiltIndexDtfCall } from "../calls.js";
import { buildErc20ApprovalCall } from "../calls.js";
import { getDtf } from "../dtf/index.js";

export type VoteLockDao = {
  readonly chainId: number;
  readonly token: Token;
  readonly underlying: { readonly token: Token };
  readonly rewards: readonly { readonly token: Token; readonly amount: number; readonly amountUsd: number }[];
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
  readonly rewards: readonly { readonly token: RawToken; readonly amount: number; readonly amountUsd: number }[];
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

export type BuildVoteLockDepositCallParams = {
  readonly stToken: Address;
  readonly amount: bigint;
} & (
  | { readonly delegateToSelf: true }
  | { readonly receiver: Address; readonly delegateToSelf?: false }
);

/** Reads all Index DTF vote-lock DAO/APR rows from Reserve API. */
export async function getVoteLockDaos(client: DtfClient): Promise<readonly VoteLockDao[]> {
  const daos = await client.api.get<readonly RawVoteLockDao[]>({ path: "/dtf/daos" });

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
  params: { readonly address: Address; readonly chainId: IndexDtf["chainId"]; readonly account: Address },
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
    client.viem.readContract({ address: underlying.address, abi: erc20Abi, functionName: "balanceOf", args: [account], chainId: params.chainId }),
    client.viem.readContract({ address: underlying.address, abi: erc20Abi, functionName: "allowance", args: [account, stToken], chainId: params.chainId }),
    client.viem.readContract({ address: stToken, abi: dtfIndexStakingVaultAbi, functionName: "delegates", args: [account], chainId: params.chainId }),
    client.viem.readContract({ address: stToken, abi: dtfIndexStakingVaultAbi, functionName: "maxWithdraw", args: [account], chainId: params.chainId }),
    client.viem.readContract({ address: stToken, abi: dtfIndexStakingVaultAbi, functionName: "unstakingDelay", chainId: params.chainId }),
    client.viem.readContract({ address: stToken, abi: dtfIndexStakingVaultAbi, functionName: "unstakingManager", chainId: params.chainId }),
    client.api.getTokenPrices({ chainId: params.chainId, addresses: [underlying.address] }),
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

/** Builds underlying-token approval calldata for a vote-lock deposit. */
export function buildVoteLockApprovalCall(params: { readonly underlying: Address; readonly stToken: Address; readonly amount: bigint }) {
  return buildErc20ApprovalCall({ token: params.underlying, spender: params.stToken, amount: params.amount });
}

/** Builds staking-vault deposit calldata, optionally self-delegating voting power. */
export function buildVoteLockDepositCall(params: BuildVoteLockDepositCallParams): BuiltIndexDtfCall {
  if (params.delegateToSelf && "receiver" in params) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "receiver is not used for depositAndDelegate",
      meta: { receiver: params.receiver },
    });
  }

  const args = params.delegateToSelf ? [params.amount] as const : [params.amount, getAddress(params.receiver)] as const;

  return {
    target: getAddress(params.stToken),
    functionName: params.delegateToSelf ? "depositAndDelegate" : "deposit",
    args,
    calldata: encodeFunctionData({
      abi: dtfIndexStakingVaultAbi,
      functionName: params.delegateToSelf ? "depositAndDelegate" : "deposit",
      args,
    } as never) as Hex,
  };
}

function mapVoteLockDao(dao: RawVoteLockDao): VoteLockDao {
  return {
    ...dao,
    token: mapToken(dao.token),
    underlying: { token: mapToken(dao.underlying.token) },
    rewards: dao.rewards.map((reward) => ({ ...reward, token: mapToken(reward.token) })),
    dtfs: dao.dtfs.map(mapToken),
  };
}

function mapToken(token: RawToken): Token {
  return {
    ...token,
    address: getAddress(token.address),
  };
}

/** Builds staking-vault delegation calldata. */
export function buildVoteLockDelegateCall(params: { readonly stToken: Address; readonly delegatee: Address }): BuiltIndexDtfCall<readonly [Address]> {
  const args = [getAddress(params.delegatee)] as const;
  return { target: getAddress(params.stToken), functionName: "delegate", args, calldata: encodeFunctionData({ abi: dtfIndexStakingVaultAbi, functionName: "delegate", args }) as Hex };
}

/** Builds staking-vault withdraw calldata that starts an unlock when delay is enabled. */
export function buildVoteLockUnlockCall(params: { readonly stToken: Address; readonly amount: bigint; readonly account: Address }): BuiltIndexDtfCall<readonly [bigint, Address, Address]> {
  const account = getAddress(params.account);
  const args = [params.amount, account, account] as const;
  return { target: getAddress(params.stToken), functionName: "withdraw", args, calldata: encodeFunctionData({ abi: dtfIndexStakingVaultAbi, functionName: "withdraw", args }) as Hex };
}

/** Builds staking-vault reward claim calldata. */
export function buildClaimVoteLockRewardsCall(params: { readonly stToken: Address; readonly rewardTokens: readonly Address[] }): BuiltIndexDtfCall<readonly [readonly Address[]]> {
  const args = [params.rewardTokens.map(getAddress)] as const;
  return { target: getAddress(params.stToken), functionName: "claimRewards", args, calldata: encodeFunctionData({ abi: dtfIndexStakingVaultAbi, functionName: "claimRewards", args }) as Hex };
}

/** Builds unstaking-manager `claimLock(lockId)` calldata. */
export function buildClaimVoteLockWithdrawalCall(params: { readonly unstakingManager: Address; readonly lockId: bigint }): BuiltIndexDtfCall<readonly [bigint]> {
  const args = [params.lockId] as const;
  return { target: getAddress(params.unstakingManager), functionName: "claimLock", args, calldata: encodeFunctionData({ abi: unstakingManagerAbi, functionName: "claimLock", args }) as Hex };
}
