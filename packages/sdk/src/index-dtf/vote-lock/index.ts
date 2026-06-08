import { erc20Abi, getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { Amount, Token } from "@/types/common";
import type { IndexDtf } from "@/types/index-dtf";

import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { dtfIndexStakingVaultOptimisticAbi } from "@/index-dtf/abis/dtf-index-staking-vault-optimistic";
import { getDtf } from "@/index-dtf/dtf/index";
import { isUnsupportedVoteLockOptimisticReadError } from "@/index-dtf/governance/optimistic-errors";
import { SdkError } from "@/lib/errors";
import { mapAmount } from "@/lib/utils";

export * from "@/index-dtf/vote-lock/builders";
export * from "@/index-dtf/vote-lock/reads";

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

export type VoteLockState = {
  readonly stToken: Address;
  readonly underlying: Token;
  readonly account: Address;
  readonly underlyingBalance: Amount;
  readonly underlyingAllowance: Amount;
  readonly delegate: Address;
  readonly optimisticDelegate: Address | null;
  readonly maxWithdraw: Amount;
  readonly optimisticVotingPower: Amount | null;
  readonly hasOptimisticVotingPower: boolean;
  readonly unstakingDelay: bigint;
  readonly unstakingManager: Address;
  readonly underlyingPrice?: number;
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

type VoteLockMulticallResult<T> =
  | { readonly status: "success"; readonly result: T }
  | { readonly status: "failure"; readonly error: Error };

type VoteLockStateMulticallResults = readonly [
  VoteLockMulticallResult<bigint>,
  VoteLockMulticallResult<bigint>,
  VoteLockMulticallResult<Address>,
  VoteLockMulticallResult<bigint>,
  VoteLockMulticallResult<bigint>,
  VoteLockMulticallResult<Address>,
];

type OptionalOptimisticVoteLockStateResults = readonly [
  VoteLockMulticallResult<Address>,
  VoteLockMulticallResult<bigint>,
];

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

  const account = params.account;
  const stToken = vault.token.address;
  const underlying = vault.underlying;
  const prices = await client.api.getTokenPrices({
    chainId: params.chainId,
    addresses: [underlying.address],
  });
  const [
    balanceResult,
    allowanceResult,
    delegateResult,
    maxWithdrawResult,
    unstakingDelayResult,
    unstakingManagerResult,
  ] = (await client.viem.getPublicClient(params.chainId).multicall({
    allowFailure: true,
    contracts: [
      {
        address: underlying.address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: underlying.address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [account, stToken],
      },
      {
        address: stToken,
        abi: dtfIndexStakingVaultAbi,
        functionName: "delegates",
        args: [account],
      },
      {
        address: stToken,
        abi: dtfIndexStakingVaultAbi,
        functionName: "maxWithdraw",
        args: [account],
      },
      {
        address: stToken,
        abi: dtfIndexStakingVaultAbi,
        functionName: "unstakingDelay",
      },
      {
        address: stToken,
        abi: dtfIndexStakingVaultAbi,
        functionName: "unstakingManager",
      },
    ],
  })) as VoteLockStateMulticallResults;
  const [optimisticDelegate, optimisticVotingPower] = await readOptionalOptimisticVoteLockState(
    client,
    params.chainId,
    stToken,
    account,
  );

  if (balanceResult.status === "failure") throw balanceResult.error;
  if (allowanceResult.status === "failure") throw allowanceResult.error;
  if (delegateResult.status === "failure") throw delegateResult.error;
  if (maxWithdrawResult.status === "failure") throw maxWithdrawResult.error;
  if (unstakingDelayResult.status === "failure") throw unstakingDelayResult.error;
  if (unstakingManagerResult.status === "failure") throw unstakingManagerResult.error;

  return {
    stToken,
    underlying,
    account,
    underlyingBalance: mapAmount(balanceResult.result, underlying.decimals),
    underlyingAllowance: mapAmount(allowanceResult.result, underlying.decimals),
    delegate: delegateResult.result,
    optimisticDelegate,
    maxWithdraw: mapAmount(maxWithdrawResult.result, underlying.decimals),
    optimisticVotingPower: optimisticVotingPower === null ? null : mapAmount(optimisticVotingPower),
    hasOptimisticVotingPower: (optimisticVotingPower ?? 0n) > 0n,
    unstakingDelay: unstakingDelayResult.result,
    unstakingManager: unstakingManagerResult.result,
    ...(prices[0] ? { underlyingPrice: prices[0].price } : {}),
  };
}

async function readOptionalOptimisticVoteLockState(
  client: DtfClient,
  chainId: IndexDtf["chainId"],
  stToken: Address,
  account: Address,
): Promise<readonly [Address | null, bigint | null]> {
  try {
    const [delegateResult, votingPowerResult] = (await client.viem.getPublicClient(chainId).multicall({
      allowFailure: true,
      contracts: [
        {
          address: stToken,
          abi: dtfIndexStakingVaultOptimisticAbi,
          functionName: "optimisticDelegates",
          args: [account],
        },
        {
          address: stToken,
          abi: dtfIndexStakingVaultOptimisticAbi,
          functionName: "getOptimisticVotes",
          args: [account],
        },
      ],
    })) as OptionalOptimisticVoteLockStateResults;

    return [
      readOptionalOptimisticVoteLockResult(delegateResult),
      readOptionalOptimisticVoteLockResult(votingPowerResult),
    ];
  } catch (error) {
    if (isUnsupportedVoteLockOptimisticReadError(error)) {
      return [null, null];
    }

    throw error;
  }
}

function readOptionalOptimisticVoteLockResult<T>(result: VoteLockMulticallResult<T>): T | null {
  if (result.status === "success") {
    return result.result;
  }

  if (isUnsupportedVoteLockOptimisticReadError(result.error)) {
    return null;
  }

  throw result.error;
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
