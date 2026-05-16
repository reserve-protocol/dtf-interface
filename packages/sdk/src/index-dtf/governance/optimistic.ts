import { getAddress, type Address, type Hex } from "viem";

import type { DtfClient } from "@/client";
import type {
  GetIndexDtfOptimisticGovernanceParams,
  GetIndexDtfOptimisticProposalContextParams,
  GetIndexDtfOptimisticVotesParams,
  GetIndexDtfPastOptimisticVotesParams,
  GetIndexDtfProposalThrottleChargesParams,
  IndexDtfOptimisticGovernance,
  IndexDtfOptimisticProposalContext,
} from "@/types/governance";

import { getLatestBlockTimepoint } from "@/client/viem";
import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";
import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { dtfIndexStakingVaultOptimisticAbi } from "@/index-dtf/abis/dtf-index-staking-vault-optimistic";
import { optimisticTimelockAbi } from "@/index-dtf/abis/optimistic-timelock";
import { isUnsupportedOptimisticContractError } from "@/index-dtf/governance/optimistic-errors";
import { getOptimisticVetoThresholdVotes } from "@/index-dtf/governance/utils";
import { mapAmount } from "@/lib/utils";

export const OPTIMISTIC_PROPOSER_ROLE =
  "0x26f49d08685d9cdd4951a7470bc8fbe9dd0f00419c1a44c1b89f845867ae12e0" as Hex;

export const CANCELLER_ROLE =
  "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783" as Hex;

export async function getOptimisticProposalContext(
  client: DtfClient,
  params: GetIndexDtfOptimisticProposalContextParams,
): Promise<IndexDtfOptimisticProposalContext | null> {
  const governance = getAddress(params.governance);
  const proposalId = BigInt(params.proposalId);
  let isOptimistic = params.isOptimistic;

  if (isOptimistic === undefined) {
    try {
      isOptimistic = await client.viem.readContract({
        chainId: params.chainId,
        address: governance,
        abi: dtfIndexGovernanceOptimisticAbi,
        functionName: "isOptimistic",
        args: [proposalId],
      });
    } catch (error) {
      if (!isUnsupportedOptimisticContractError(error)) {
        throw error;
      }

      return null;
    }
  }

  if (!isOptimistic) {
    return null;
  }

  const [vetoThreshold, snapshot, token] = await Promise.all([
    client.viem.readContract({
      chainId: params.chainId,
      address: governance,
      abi: dtfIndexGovernanceOptimisticAbi,
      functionName: "vetoThreshold",
      args: [proposalId],
    }),
    client.viem.readContract({
      chainId: params.chainId,
      address: governance,
      abi: dtfIndexGovernanceOptimisticAbi,
      functionName: "proposalSnapshot",
      args: [proposalId],
    }),
    client.viem.readContract({
      chainId: params.chainId,
      address: governance,
      abi: dtfIndexGovernanceOptimisticAbi,
      functionName: "token",
    }),
  ]);
  const snapshotSupply = await client.viem.readContract({
    chainId: params.chainId,
    address: token,
    abi: dtfIndexStakingVaultAbi,
    functionName: "getPastTotalSupply",
    args: [snapshot],
  });
  const mappedSnapshotSupply = mapAmount(snapshotSupply);
  const vetoThresholdVotes = getOptimisticVetoThresholdVotes({
    snapshotSupply: mappedSnapshotSupply,
    vetoThreshold,
  });

  return {
    proposalId: String(proposalId),
    voteToken: token,
    snapshot,
    snapshotSupply: mappedSnapshotSupply,
    vetoThreshold,
    vetoThresholdVotes: mapAmount(vetoThresholdVotes),
  };
}

export async function getOptimisticGovernance(
  client: DtfClient,
  params: GetIndexDtfOptimisticGovernanceParams,
): Promise<IndexDtfOptimisticGovernance> {
  const governance = getAddress(params.governance);
  const [
    lateQuorumVoteExtension,
    proposalThrottleCapacity,
    optimisticParams,
    selectorRegistry,
    token,
    timelock,
  ] = await Promise.all([
    client.viem.readContract({
      chainId: params.chainId,
      address: governance,
      abi: dtfIndexGovernanceOptimisticAbi,
      functionName: "lateQuorumVoteExtension",
    }),
    client.viem.readContract({
      chainId: params.chainId,
      address: governance,
      abi: dtfIndexGovernanceOptimisticAbi,
      functionName: "proposalThrottleCapacity",
    }),
    client.viem.readContract({
      chainId: params.chainId,
      address: governance,
      abi: dtfIndexGovernanceOptimisticAbi,
      functionName: "optimisticParams",
    }),
    client.viem.readContract({
      chainId: params.chainId,
      address: governance,
      abi: dtfIndexGovernanceOptimisticAbi,
      functionName: "selectorRegistry",
    }),
    client.viem.readContract({
      chainId: params.chainId,
      address: governance,
      abi: dtfIndexGovernanceOptimisticAbi,
      functionName: "token",
    }),
    client.viem.readContract({
      chainId: params.chainId,
      address: governance,
      abi: dtfIndexGovernanceOptimisticAbi,
      functionName: "timelock",
    }),
  ]);
  const [vetoDelay, vetoPeriod, vetoThreshold] = optimisticParams as readonly [
    number | bigint,
    number | bigint,
    bigint,
  ];
  const roles = await getOptimisticTimelockRoles(client, {
    chainId: params.chainId,
    timelock,
  });

  return {
    governance,
    token,
    timelock,
    selectorRegistry,
    lateQuorumVoteExtension: toBigInt(lateQuorumVoteExtension),
    proposalThrottleCapacity,
    optimisticParams: {
      vetoDelay: toBigInt(vetoDelay),
      vetoPeriod: toBigInt(vetoPeriod),
      vetoThreshold,
    },
    ...roles,
  };
}

export async function getOptimisticTimelockRoles(
  client: DtfClient,
  params: {
    readonly chainId: GetIndexDtfOptimisticGovernanceParams["chainId"];
    readonly timelock: Address;
  },
) {
  const timelock = getAddress(params.timelock);
  const [optimisticProposerCount, guardianCount] = await Promise.all([
    readRoleMemberCount(
      client,
      params.chainId,
      timelock,
      OPTIMISTIC_PROPOSER_ROLE,
    ),
    readRoleMemberCount(client, params.chainId, timelock, CANCELLER_ROLE),
  ]);
  const [optimisticProposers, guardians] = await Promise.all([
    readRoleMembers(
      client,
      params.chainId,
      timelock,
      OPTIMISTIC_PROPOSER_ROLE,
      optimisticProposerCount,
    ),
    readRoleMembers(
      client,
      params.chainId,
      timelock,
      CANCELLER_ROLE,
      guardianCount,
    ),
  ]);

  return { optimisticProposers, guardians };
}

export async function getProposalThrottleCharges(
  client: DtfClient,
  params: GetIndexDtfProposalThrottleChargesParams,
) {
  const charges = await client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.governance),
    abi: dtfIndexGovernanceOptimisticAbi,
    functionName: "proposalThrottleCharges",
    args: [getAddress(params.account)],
  });

  return charges;
}

export async function getOptimisticVotes(
  client: DtfClient,
  params: GetIndexDtfOptimisticVotesParams,
) {
  const votes = await client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.voteToken),
    abi: dtfIndexStakingVaultOptimisticAbi,
    functionName: "getOptimisticVotes",
    args: [getAddress(params.account)],
  });

  return mapAmount(votes);
}

export async function getPastOptimisticVotes(
  client: DtfClient,
  params: GetIndexDtfPastOptimisticVotesParams,
) {
  const timepoint =
    params.timepoint ??
    (await getLatestBlockTimepoint(client.viem, params.chainId));
  const votes = await client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.voteToken),
    abi: dtfIndexStakingVaultOptimisticAbi,
    functionName: "getPastOptimisticVotes",
    args: [getAddress(params.account), timepoint],
  });

  return mapAmount(votes);
}

async function readRoleMemberCount(
  client: DtfClient,
  chainId: GetIndexDtfOptimisticGovernanceParams["chainId"],
  timelock: Address,
  role: Hex,
) {
  return client.viem.readContract({
    chainId,
    address: timelock,
    abi: optimisticTimelockAbi,
    functionName: "getRoleMemberCount",
    args: [role],
  });
}

async function readRoleMembers(
  client: DtfClient,
  chainId: GetIndexDtfOptimisticGovernanceParams["chainId"],
  timelock: Address,
  role: Hex,
  count: bigint,
): Promise<readonly Address[]> {
  const members = await Promise.all(
    Array.from({ length: Number(count) }, (_, index) =>
      client.viem.readContract({
        chainId,
        address: timelock,
        abi: optimisticTimelockAbi,
        functionName: "getRoleMember",
        args: [role, BigInt(index)],
      }),
    ),
  );

  return members;
}

function toBigInt(value: number | bigint): bigint {
  return typeof value === "bigint" ? value : BigInt(value);
}
