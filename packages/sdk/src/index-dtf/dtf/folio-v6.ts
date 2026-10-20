import {
  BaseError,
  ContractFunctionRevertedError,
  ContractFunctionZeroDataError,
  getAddress,
  type Address,
} from "viem";

import type { DtfClient } from "@/client";
import type { IndexDtfFeeRecipient } from "@/index-dtf/fee-recipients";
import type { Amount, DtfParams } from "@/types/common";

import { folioV6Abi } from "@/index-dtf/abis/folio-v6.generated";
import { INDEX_DTF_MAX_FEE_RECIPIENTS } from "@/index-dtf/fee-recipients";
import { SdkError } from "@/lib/errors";
import { mapAmount } from "@/lib/utils";

export type IndexDtfTradeAllowlist = {
  readonly enabled: boolean;
  readonly tokens: readonly Address[];
};

export type GetIndexDtfIsTokenAllowlistedParams = DtfParams & {
  readonly token: Address;
};

/**
 * Reads Folio 6.0's `maxAuctionLength()`: the per-auction length ceiling and the
 * only valid `openAuction` length under PriceControl NONE. Reverts on v5 proxies.
 */
export async function getIndexDtfMaxAuctionLength(client: DtfClient, params: DtfParams): Promise<bigint> {
  return client.viem.readContract({
    address: getAddress(params.address),
    abi: folioV6Abi,
    functionName: "maxAuctionLength",
    chainId: params.chainId,
    blockNumber: params.blockNumber,
  });
}

/** Reads Folio 6.0's `folioFeeForSelf()`: the D18 fraction of non-DAO fees the Folio keeps for its holders. */
export async function getIndexDtfSelfFee(client: DtfClient, params: DtfParams): Promise<Amount> {
  const raw = await client.viem.readContract({
    address: getAddress(params.address),
    abi: folioV6Abi,
    functionName: "folioFeeForSelf",
    chainId: params.chainId,
    blockNumber: params.blockNumber,
  });

  return mapAmount(raw, 18);
}

/**
 * Reads Folio 6.0's full immutable fee recipient table. `setFeeRecipients` must be given this exact
 * table back, so it is read from RPC at one block rather than from the subgraph.
 */
export async function getIndexDtfImmutableFeeRecipients(
  client: DtfClient,
  params: DtfParams,
): Promise<readonly IndexDtfFeeRecipient[]> {
  const address = getAddress(params.address);
  const publicClient = client.viem.getPublicClient(params.chainId);
  // viem caches getBlockNumber for a polling interval; a write mined a moment ago must be visible here.
  const blockNumber = params.blockNumber ?? (await publicClient.getBlockNumber({ cacheTime: 0 }));
  // The array getter reverts past the end of the table, which is indistinguishable from a v5 proxy or a
  // non-Folio address, so a v6-only read at the same block must succeed before a short table means "short".
  await publicClient.readContract({ address, abi: folioV6Abi, functionName: "folioFeeForSelf", blockNumber });
  const entries = await publicClient.multicall({
    allowFailure: true,
    batchSize: 0,
    blockNumber,
    contracts: Array.from({ length: INDEX_DTF_MAX_FEE_RECIPIENTS }, (_, index) => ({
      address,
      abi: folioV6Abi,
      functionName: "immutableFeeRecipients" as const,
      args: [BigInt(index)] as const,
    })),
  });

  const recipients: IndexDtfFeeRecipient[] = [];
  for (const entry of entries) {
    if (entry.status !== "success") {
      break;
    }
    const [recipient, portion] = entry.result;
    recipients.push({ recipient: getAddress(recipient), portion });
  }

  // A transport failure inside the multicall also reads as "end of table"; the boundary index must revert
  // as a contract call, not fail as a request, before a short table is trusted.
  if (recipients.length < INDEX_DTF_MAX_FEE_RECIPIENTS) {
    try {
      await publicClient.readContract({
        address,
        abi: folioV6Abi,
        functionName: "immutableFeeRecipients",
        args: [BigInt(recipients.length)],
        blockNumber,
      });
      throw new SdkError({
        code: "REQUEST_FAILED",
        message: "immutable fee recipient table read was truncated; retry",
        meta: { address, blockNumber, length: recipients.length },
      });
    } catch (error) {
      // viem wraps transport failures in the same execution error; only a revert or empty return is end-of-table.
      const reverted =
        error instanceof BaseError &&
        error.walk(
          (cause) => cause instanceof ContractFunctionRevertedError || cause instanceof ContractFunctionZeroDataError,
        ) !== null;
      if (!reverted) {
        throw error;
      }
    }
  }

  return recipients;
}

/** Reads Folio 6.0's trade allowlist state: whether enforcement is on and the allowlisted tokens. */
export async function getIndexDtfTradeAllowlist(client: DtfClient, params: DtfParams): Promise<IndexDtfTradeAllowlist> {
  const address = getAddress(params.address);
  const [enabled, tokens] = await client.viem.getPublicClient(params.chainId).multicall({
    allowFailure: false,
    blockNumber: params.blockNumber,
    contracts: [
      { address, abi: folioV6Abi, functionName: "tradeAllowlistEnabled" },
      { address, abi: folioV6Abi, functionName: "getTokenAllowlist" },
    ],
  });

  return { enabled, tokens: tokens.map((token) => getAddress(token)) };
}

/** Reads Folio 6.0's `isTokenAllowlisted(token)`: membership only; with enforcement off every token is tradable. */
export async function getIndexDtfIsTokenAllowlisted(
  client: DtfClient,
  params: GetIndexDtfIsTokenAllowlistedParams,
): Promise<boolean> {
  return client.viem.readContract({
    address: getAddress(params.address),
    abi: folioV6Abi,
    functionName: "isTokenAllowlisted",
    args: [getAddress(params.token)],
    chainId: params.chainId,
    blockNumber: params.blockNumber,
  });
}
