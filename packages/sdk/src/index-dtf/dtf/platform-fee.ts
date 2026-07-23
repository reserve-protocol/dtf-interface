import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { IndexDtf, IndexDtfPlatformFee } from "@/types/index-dtf";

import { daoFeeRegistryAbi } from "@/index-dtf/abis/dao-fee-registry";
import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { Decimal } from "@/lib/decimal";
import { SdkError } from "@/lib/errors";

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

  // A zero denominator is an impossible fee tuple, not a 0% fee (numerator=0,
  // denominator>0 is the real 0%). Fail loud so consumers show "unavailable"
  // rather than a confident fabricated 0%.
  if (denominator === 0n) {
    throw new SdkError({
      code: "INVALID_RESPONSE",
      message: `DAO fee registry returned a zero denominator for ${address} on chain ${params.chainId}`,
      meta: { chainId: params.chainId, entity: "indexDtfPlatformFee", address },
    });
  }

  return {
    registry,
    recipient,
    numerator,
    denominator,
    floor,
    percent: new Decimal(numerator.toString()).mul(100).div(denominator.toString()).toNumber(),
  };
}
