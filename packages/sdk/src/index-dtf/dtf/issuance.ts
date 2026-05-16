import { erc20Abi, getAddress, type Address, type PublicClient } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { Amount, Token } from "@/types/common";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { getTotalAssets, getTotalSupply } from "@/index-dtf/dtf/index";
import { mapAmount } from "@/lib/utils";
import { getTokensData } from "@/tokens/index";

export {
  getIndexDtfRedeemMinAmounts,
  prepareIndexDtfBasketApproval,
  prepareIndexDtfMint,
  prepareIndexDtfMintPlan,
  prepareIndexDtfRedeem,
} from "@/index-dtf/dtf/issuance-calls";
export type {
  PrepareIndexDtfBasketApprovalParams,
  PrepareIndexDtfMintParams,
  PrepareIndexDtfMintPlanParams,
  PrepareIndexDtfRedeemParams,
} from "@/index-dtf/dtf/issuance-calls";

const D18 = 10n ** 18n;
const ROUNDING_FLOOR = 0;
const ROUNDING_CEIL = 1;

export type GetIndexDtfIssuanceStateParams = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
  readonly account: Address;
  readonly shares?: bigint;
};

export type IndexDtfIssuanceAsset = {
  readonly token: Token;
  readonly folioBalance: Amount;
  readonly walletBalance: Amount;
  readonly allowance: Amount;
  readonly amountPerDtf: Amount;
  readonly mintAmount?: Amount;
  readonly redeemAmount?: Amount;
};

export type IndexDtfIssuanceState = {
  readonly address: Address;
  readonly account: Address;
  readonly chainId: number;
  readonly totalSupply: Amount;
  readonly dtfBalance: Amount;
  readonly maxMintShares: Amount;
  readonly maxRedeemShares: Amount;
  readonly assets: readonly IndexDtfIssuanceAsset[];
};

/**
 * Reads the wallet balances, basket allowances, and exact v5 mint/redeem asset
 * amounts for manual Index DTF issuance.
 */
export async function getIndexDtfIssuanceState(
  client: DtfClient,
  params: GetIndexDtfIssuanceStateParams,
): Promise<IndexDtfIssuanceState> {
  const address = getAddress(params.address);
  const account = getAddress(params.account);
  const publicClient = client.viem.getPublicClient(params.chainId);
  const [totalAssets, totalSupply, dtfBalance] = await Promise.all([
    getTotalAssets(client, params),
    getTotalSupply(client, params),
    publicClient.readContract({
      address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account],
    }),
  ]);
  const tokens = await getTokensData(publicClient, [...totalAssets.tokens]);
  const [balances, allowances, amountPerDtf, mintAmounts, redeemAmounts] = await Promise.all([
    readTokenBalances(publicClient, totalAssets.tokens, account),
    readTokenAllowances(publicClient, totalAssets.tokens, account, address),
    readToAssets(client, address, params.chainId, D18, ROUNDING_FLOOR),
    params.shares === undefined
      ? Promise.resolve(undefined)
      : readToAssets(client, address, params.chainId, params.shares, ROUNDING_CEIL),
    params.shares === undefined
      ? Promise.resolve(undefined)
      : readToAssets(client, address, params.chainId, params.shares, ROUNDING_FLOOR),
  ]);

  return {
    address,
    account,
    chainId: params.chainId,
    totalSupply: mapAmount(totalSupply, 18),
    dtfBalance: mapAmount(dtfBalance, 18),
    maxMintShares: mapAmount(getMaxMintShares(totalAssets.balances, balances, totalSupply), 18),
    maxRedeemShares: mapAmount(dtfBalance, 18),
    assets: tokens.map((token, index) => ({
      token,
      folioBalance: mapAmount(totalAssets.balances[index] ?? 0n, token.decimals),
      walletBalance: mapAmount(balances[index] ?? 0n, token.decimals),
      allowance: mapAmount(allowances[index] ?? 0n, token.decimals),
      amountPerDtf: mapAmount(amountPerDtf.amounts[index] ?? 0n, token.decimals),
      ...(mintAmounts ? { mintAmount: mapAmount(mintAmounts.amounts[index] ?? 0n, token.decimals) } : {}),
      ...(redeemAmounts ? { redeemAmount: mapAmount(redeemAmounts.amounts[index] ?? 0n, token.decimals) } : {}),
    })),
  };
}

async function readToAssets(
  client: DtfClient,
  address: Address,
  chainId: SupportedChainId,
  shares: bigint,
  rounding: 0 | 1,
) {
  const [assets, amounts] = await client.viem.readContract({
    address,
    abi: dtfIndexAbi,
    functionName: "toAssets",
    args: [shares, rounding],
    chainId,
  });

  return { assets, amounts };
}

async function readTokenBalances(publicClient: PublicClient, tokens: readonly Address[], account: Address) {
  return publicClient.multicall({
    allowFailure: false,
    contracts: tokens.map((address) => ({ address, abi: erc20Abi, functionName: "balanceOf", args: [account] })),
  }) as Promise<readonly bigint[]>;
}

async function readTokenAllowances(
  publicClient: PublicClient,
  tokens: readonly Address[],
  account: Address,
  spender: Address,
) {
  return publicClient.multicall({
    allowFailure: false,
    contracts: tokens.map((address) => ({
      address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [account, spender],
    })),
  }) as Promise<readonly bigint[]>;
}

function getMaxMintShares(
  folioBalances: readonly bigint[],
  walletBalances: readonly bigint[],
  totalSupply: bigint,
): bigint {
  let max: bigint | undefined;

  for (let i = 0; i < folioBalances.length; i++) {
    const folioBalance = folioBalances[i] ?? 0n;
    if (folioBalance === 0n) continue;

    const possible = ((walletBalances[i] ?? 0n) * totalSupply) / folioBalance;
    max = max === undefined || possible < max ? possible : max;
  }

  return max ?? 0n;
}
