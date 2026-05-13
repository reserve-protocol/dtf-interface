import { getAddress, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { GetIndexDtfLegacyVoteLocksParams } from "@/types/governance";
import type { IndexDtf } from "@/types/index-dtf";

import { dtfIndexGovernanceAbi } from "@/index-dtf/abis/dtf-index-governance";
import { getDtf } from "@/index-dtf/dtf/index";

export async function getLegacyVoteLocks(
  client: DtfClient,
  params: GetIndexDtfLegacyVoteLocksParams,
): Promise<readonly Address[]> {
  const context = await getLegacyVoteLockContext(client, params);

  if (!context || context.legacyGovernance.length === 0) {
    return [];
  }

  const legacyVoteLocks = await Promise.all(
    context.legacyGovernance.map((governance) =>
      client.viem.readContract({
        chainId: context.chainId,
        address: governance,
        abi: dtfIndexGovernanceAbi,
        functionName: "token",
      }),
    ),
  );
  const currentVoteLock = context.currentVoteLock.toLowerCase();
  const result: Address[] = [];

  for (const voteLock of legacyVoteLocks) {
    const address = getAddress(voteLock);

    if (address.toLowerCase() === currentVoteLock) {
      continue;
    }

    if (!result.some((existing) => existing.toLowerCase() === address.toLowerCase())) {
      result.push(address);
    }
  }

  return result;
}

async function getLegacyVoteLockContext(
  client: DtfClient,
  params: GetIndexDtfLegacyVoteLocksParams,
): Promise<{
  readonly chainId: IndexDtf["chainId"];
  readonly currentVoteLock: Address;
  readonly legacyGovernance: readonly Address[];
} | null> {
  if ("currentVoteLock" in params) {
    return {
      chainId: params.chainId,
      currentVoteLock: getAddress(params.currentVoteLock),
      legacyGovernance: params.legacyGovernance.map(getAddress),
    };
  }

  const dtf = "dtf" in params ? params.dtf : await getDtf(client, params);

  if (!dtf.voteLockVault) {
    return null;
  }

  return {
    chainId: dtf.chainId,
    currentVoteLock: dtf.voteLockVault.token.address,
    legacyGovernance: dtf.voteLockVault.legacyGovernance,
  };
}
