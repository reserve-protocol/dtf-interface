import { getAddress, keccak256, toHex, zeroHash, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { GetIndexDtfVoteLockDependentsParams, IndexDtfVoteLockDependent } from "@/types/governance";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { GetIndexDtfVoteLockDependentsDocument } from "@/index-dtf/subgraph/dtf.generated";
import { sameAddress } from "@/lib/utils";

const REBALANCE_MANAGER = keccak256(toHex("REBALANCE_MANAGER"));

type GovernanceRef =
  | { readonly token: { readonly id: string }; readonly timelock: { readonly id: string } }
  | null
  | undefined;

/**
 * DTFs governed through `voteLock` by their owner (admin role) or trading (REBALANCE_MANAGER) governance,
 * with the on-chain role as the source of truth: the subgraph only drops a DTF after indexing its migration.
 */
export async function getVoteLockDependents(
  client: DtfClient,
  params: GetIndexDtfVoteLockDependentsParams,
): Promise<readonly IndexDtfVoteLockDependent[]> {
  const { dtfs } = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfVoteLockDependentsDocument,
    variables: { voteLock: params.voteLock.toLowerCase() },
  });

  const checks = dtfs.flatMap((dtf) => [
    ...roleCheck(dtf.id, dtf.ownerGovernance, zeroHash, params.voteLock),
    ...roleCheck(dtf.id, dtf.tradingGovernance, REBALANCE_MANAGER, params.voteLock),
  ]);
  const roles =
    checks.length === 0
      ? []
      : await client.viem.getPublicClient(params.chainId).multicall({
          allowFailure: false,
          contracts: checks.map(({ dtf, role, timelock }) => ({
            address: dtf,
            abi: dtfIndexAbi,
            functionName: "hasRole" as const,
            args: [role, timelock] as const,
          })),
        });

  return dtfs.map((dtf) => ({
    address: getAddress(dtf.id),
    symbol: dtf.token.symbol,
    name: dtf.token.name,
    governedByVoteLock: checks.some((check, index) => sameAddress(check.dtf, dtf.id) && roles[index] === true),
  }));
}

function roleCheck(dtf: string, governance: GovernanceRef, role: `0x${string}`, voteLock: Address) {
  if (!governance || !sameAddress(governance.token.id, voteLock)) {
    return [];
  }

  return [{ dtf: getAddress(dtf), role, timelock: getAddress(governance.timelock.id) }];
}
