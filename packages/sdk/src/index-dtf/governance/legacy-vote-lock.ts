import { getAddress, zeroAddress, type Address } from "viem";

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

  const legacyGovernance = context?.legacyGovernance.filter((governance) => governance.toLowerCase() !== zeroAddress);

  if (!context || !legacyGovernance || legacyGovernance.length === 0) {
    return [];
  }

  const legacyVoteLocks = await Promise.all(
    legacyGovernance.map((governance) => readLegacyVoteLock(client, context.chainId, governance)),
  );
  const currentVoteLock = context.currentVoteLock.toLowerCase();
  const result: Address[] = [];

  for (const voteLock of legacyVoteLocks) {
    if (!voteLock) {
      continue;
    }

    const address = voteLock;

    if (address.toLowerCase() === currentVoteLock) {
      continue;
    }

    if (!result.some((existing) => existing.toLowerCase() === address.toLowerCase())) {
      result.push(address);
    }
  }

  return result;
}

async function readLegacyVoteLock(
  client: DtfClient,
  chainId: IndexDtf["chainId"],
  governance: Address,
): Promise<Address | null> {
  try {
    return await client.viem.readContract({
      chainId,
      address: governance,
      abi: dtfIndexGovernanceAbi,
      functionName: "token",
    });
  } catch (error) {
    if (isUnreadableLegacyGovernance(error)) {
      return null;
    }

    throw error;
  }
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
      legacyGovernance: params.legacyGovernance.map((address) => getAddress(address)),
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

function isUnreadableLegacyGovernance(error: unknown): boolean {
  const message = error instanceof Error
    ? error.message.toLowerCase()
    : String(error).toLowerCase();

  // Legacy subgraph rows can include stale governor addresses that no longer expose token().
  return message.includes("returned no data") || message.includes('function "token" reverted');
}
