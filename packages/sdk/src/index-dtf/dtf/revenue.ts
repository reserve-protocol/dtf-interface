import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { Amount, Token } from "@/types/common";
import type { IndexDtfCall } from "@/types/governance";
import type { Financials, IndexDtf, IndexDtfPlatformFee, PriceControl } from "@/types/index-dtf";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { getDtf, getPrice } from "@/index-dtf/dtf/index";
import { getIndexDtfPlatformFee } from "@/index-dtf/dtf/platform-fee";
import { getIndexDtfWriteAbi, type IndexDtfWriteVersion } from "@/index-dtf/write-version";
import { prepareContractCall } from "@/lib/contract-call";
import { Decimal } from "@/lib/decimal";
import { getTokensData } from "@/lib/tokens";
import { mapAmount } from "@/lib/utils";

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
  /** Percentage of total fees kept for holders (Folio 6.0 self fee); "0" before 6.0. */
  readonly holders: { readonly percentage: string };
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
    effectiveDistribution: getEffectiveRevenueDistribution(dtf.fees, platformFee),
    pendingFeeShares,
    pendingFeeSharesUsd: new Decimal(pendingFeeShares.formatted).mul(price.price).toNumber(),
    platformFee,
  };
}

/**
 * The configured fee split, in the order Folio pays it: the DAO fee first, then (6.0) `selfFee` of the rest kept for
 * holders, then the mutable and immutable tables, whose portions sum to 100% together. With both tables empty,
 * `distributeFees` pays the recipients' pool to the DAO as well. It uses the DAO's nominal share: when a Folio's TVL
 * or mint fee is low enough that the DAO fee floor binds, the DAO takes more and everyone else proportionally less.
 */
export function getEffectiveRevenueDistribution(
  fees: Pick<IndexDtf["fees"], "recipients" | "immutableRecipients" | "selfFee">,
  platformFee: IndexDtfPlatformFee,
): IndexDtfRevenueDistribution {
  const platformPercentage = new Decimal(platformFee.percent);
  const nonDaoPool = new Decimal(100).minus(platformPercentage);
  const holdersPercentage = nonDaoPool.mul(fees.selfFee.formatted);
  const recipientPool = nonDaoPool.minus(holdersPercentage);
  const recipients = [...fees.recipients, ...fees.immutableRecipients];

  return {
    platform: {
      recipient: platformFee.recipient,
      percentage: (recipients.length === 0 ? platformPercentage.plus(recipientPool) : platformPercentage).toString(),
    },
    holders: { percentage: holdersPercentage.toString() },
    recipients: recipients.map((recipient) => ({
      address: recipient.address,
      configuredPercentage: recipient.percentage,
      effectivePercentage: new Decimal(recipient.percentage).mul(recipientPool).div(100).toString(),
    })),
  };
}

/** Prepares a `distributeFees()` contract call without binding a wallet client. */
export function prepareIndexDtfDistributeFees(params: {
  readonly address: Address;
  readonly chainId: IndexDtf["chainId"];
  readonly version: IndexDtfWriteVersion;
}): IndexDtfCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.address,
    abi: getIndexDtfWriteAbi(params.version),
    functionName: "distributeFees",
    args: [] as const,
  });
}
