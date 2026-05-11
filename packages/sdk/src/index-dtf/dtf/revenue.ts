import { getAddress, type Address } from "viem";

import type { DtfClient } from "../../client.js";
import type { Amount, Token } from "../../types/common.js";
import type { Financials, IndexDtf, PriceControl } from "../../types/index-dtf.js";

import { prepareContractCall } from "../../contract-call.js";
import { Decimal } from "../../lib/decimal.js";
import { mapAmount } from "../../lib/utils.js";
import { getTokensData } from "../../tokens/index.js";
import { daoFeeRegistryAbi } from "../abis/dao-fee-registry.js";
import { dtfIndexAbi } from "../abis/dtf-index-abi.js";
import { dtfIndexStakingVaultAbi } from "../abis/dtf-index-staking-vault.js";
import { getDtf, getPrice } from "./index.js";

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
  readonly pendingFeeShares: Amount;
  readonly pendingFeeSharesUsd: number;
  readonly platformFee: IndexDtfPlatformFee;
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
    registry: getAddress(registry),
    recipient: getAddress(recipient),
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

  return getTokensData(client.viem.getPublicClient(params.chainId), addresses.map(getAddress));
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
    pendingFeeShares,
    pendingFeeSharesUsd: new Decimal(pendingFeeShares.formatted).mul(price.price).toNumber(),
    platformFee,
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
