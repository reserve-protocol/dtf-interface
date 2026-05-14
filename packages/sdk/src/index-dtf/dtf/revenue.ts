import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { Amount, Token } from "@/types/common";
import type { Financials, IndexDtf, PriceControl } from "@/types/index-dtf";

import { prepareContractCall } from "@/contract-call";
import { daoFeeRegistryAbi } from "@/index-dtf/abis/dao-fee-registry";
import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { getDtf, getPrice } from "@/index-dtf/dtf/index";
import { Decimal } from "@/lib/decimal";
import { mapAmount } from "@/lib/utils";
import { getTokensData } from "@/tokens/index";

export type IndexDtfPlatformFee = {
  readonly registry: Address;
  readonly recipient: Address;
  readonly numerator: bigint;
  readonly denominator: bigint;
  readonly floor: bigint;
  readonly percent: number;
};

export type IndexDtfRevenue = {
  readonly financials: Financials;
  readonly feeRecipients: IndexDtf["fees"]["recipients"];
  readonly effectiveDistribution: IndexDtfRevenueDistribution;
  readonly pendingFeeShares: Amount;
  readonly pendingFeeSharesUsd: number;
  readonly platformFee: IndexDtfPlatformFee;
};

export type IndexDtfRevenueDistribution = {
  readonly platform: {
    readonly recipient: Address;
    readonly percentage: string;
  };
  readonly recipients: readonly {
    readonly address: Address;
    readonly configuredPercentage: string;
    readonly effectivePercentage: string;
  }[];
};

/** Reads the live v5 `bidsEnabled()` flag for settings and auction mode UIs. */
export async function getIndexDtfBidsEnabled(
  client: DtfClient,
  params: { readonly address: Address; readonly chainId: IndexDtf["chainId"]; readonly blockNumber?: bigint },
): Promise<boolean> {
  return client.viem.readContract({
    address: getAddress(params.address),
    abi: dtfIndexAbi,
    functionName: "bidsEnabled",
    chainId: params.chainId,
    blockNumber: params.blockNumber,
  });
}

/** Reads the live rebalance control tuple from the Index DTF contract. */
export async function getIndexDtfRebalanceControl(
  client: DtfClient,
  params: { readonly address: Address; readonly chainId: IndexDtf["chainId"]; readonly blockNumber?: bigint },
): Promise<{ readonly weightControl: boolean; readonly priceControl: PriceControl }> {
  const [weightControl, priceControl] = await client.viem.readContract({
    address: getAddress(params.address),
    abi: dtfIndexAbi,
    functionName: "rebalanceControl",
    chainId: params.chainId,
    blockNumber: params.blockNumber,
  });

  return { weightControl, priceControl: Number(priceControl) as PriceControl };
}

/** Reads pending fee shares accrued by the DTF before `distributeFees()`. */
export async function getIndexDtfPendingFeeShares(
  client: DtfClient,
  params: { readonly address: Address; readonly chainId: IndexDtf["chainId"]; readonly blockNumber?: bigint },
): Promise<Amount> {
  const raw = await client.viem.readContract({
    address: getAddress(params.address),
    abi: dtfIndexAbi,
    functionName: "getPendingFeeShares",
    chainId: params.chainId,
    blockNumber: params.blockNumber,
  });

  return mapAmount(raw, 18);
}

/** Reads the DAO fee registry settings that affect this DTF's revenue split. */
export async function getIndexDtfPlatformFee(
  client: DtfClient,
  params: { readonly address: Address; readonly chainId: IndexDtf["chainId"]; readonly blockNumber?: bigint },
): Promise<IndexDtfPlatformFee> {
  const address = getAddress(params.address);
  const registry = await client.viem.readContract({
    address,
    abi: dtfIndexAbi,
    functionName: "daoFeeRegistry",
    chainId: params.chainId,
    blockNumber: params.blockNumber,
  });
  const [recipient, numerator, denominator, floor] = await client.viem.readContract({
    address: registry,
    abi: daoFeeRegistryAbi,
    functionName: "getFeeDetails",
    args: [address],
    chainId: params.chainId,
    blockNumber: params.blockNumber,
  });

  return {
    registry,
    recipient,
    numerator,
    denominator,
    floor,
    percent: new Decimal(numerator.toString()).mul(100).div(denominator.toString()).toNumber(),
  };
}

/** Reads live staking-vault reward tokens approved for DTF fee distribution. */
export async function getIndexDtfApprovedRevenueTokens(
  client: DtfClient,
  params: { readonly address: Address; readonly chainId: IndexDtf["chainId"]; readonly stToken?: Address },
): Promise<readonly Token[]> {
  const dtf = params.stToken ? undefined : await getDtf(client, params);
  const stToken = params.stToken ?? dtf?.voteLockVault?.token.address;

  if (!stToken) return [];

  const addresses = await client.viem.readContract({
    address: getAddress(stToken),
    abi: dtfIndexStakingVaultAbi,
    functionName: "getAllRewardTokens",
    chainId: params.chainId,
  });

  return getTokensData(client.viem.getPublicClient(params.chainId), addresses);
}

/** Combines Register settings/revenue reads into one current DTF revenue view. */
export async function getIndexDtfRevenue(
  client: DtfClient,
  params: { readonly address: Address; readonly chainId: IndexDtf["chainId"] },
): Promise<IndexDtfRevenue> {
  const [dtf, pendingFeeShares, price, platformFee] = await Promise.all([
    getDtf(client, params),
    getIndexDtfPendingFeeShares(client, params),
    getPrice(client, params),
    getIndexDtfPlatformFee(client, params),
  ]);

  return {
    financials: dtf.financials,
    feeRecipients: dtf.fees.recipients,
    effectiveDistribution: getEffectiveRevenueDistribution(
      dtf.fees.recipients,
      platformFee,
    ),
    pendingFeeShares,
    pendingFeeSharesUsd: new Decimal(pendingFeeShares.formatted).mul(price.price).toNumber(),
    platformFee,
  };
}

export function getEffectiveRevenueDistribution(
  feeRecipients: IndexDtf["fees"]["recipients"],
  platformFee: IndexDtfPlatformFee,
): IndexDtfRevenueDistribution {
  const platformPercentage = new Decimal(platformFee.percent);
  const recipientPool = new Decimal(100).minus(platformPercentage);

  return {
    platform: {
      recipient: platformFee.recipient,
      percentage: platformPercentage.toString(),
    },
    recipients: feeRecipients.map((recipient) => ({
      address: recipient.address,
      configuredPercentage: recipient.percentage,
      effectivePercentage: new Decimal(recipient.percentage)
        .mul(recipientPool)
        .div(100)
        .toString(),
    })),
  };
}

/** Prepares a `distributeFees()` contract call without binding a wallet client. */
export function prepareIndexDtfDistributeFees(params: {
  readonly address: Address;
  readonly chainId: IndexDtf["chainId"];
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: dtfIndexAbi,
    functionName: "distributeFees",
    args: [] as const,
  });
}
