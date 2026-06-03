import { getAddress, type Address, type Hex } from "viem";

import type { DtfClient } from "@/client";
import type { Amount } from "@/types/common";
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
import { getOptimisticVetoThresholdVotes } from "@/index-dtf/governance/utils";
import { optimisticTimelockAbi } from "@/index-dtf/abis/optimistic-timelock";
import { isUnsupportedOptimisticContractError } from "@/index-dtf/governance/optimistic-errors";
import { mapAmount } from "@/lib/utils";

const MAX_UINT256 = (1n << 256n) - 1n;

export const OPTIMISTIC_PROPOSER_ROLE = "0x26f49d08685d9cdd4951a7470bc8fbe9dd0f00419c1a44c1b89f845867ae12e0" as Hex;

export const CANCELLER_ROLE = "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783" as Hex;

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

  const vetoThreshold = params.vetoThreshold;
  let snapshot = params.snapshot;
  let token = params.voteToken ? getAddress(params.voteToken) : undefined;

  if (vetoThreshold === undefined || vetoThreshold === 0n || vetoThreshold === MAX_UINT256) {
    return null;
  }

  if (snapshot === undefined || token === undefined) {
    const [contractSnapshot, contractToken] = (await client.viem
      .getPublicClient(params.chainId)
      .multicall({
        allowFailure: false,
        contracts: [
          {
            address: governance,
            abi: dtfIndexGovernanceOptimisticAbi,
            functionName: "proposalSnapshot",
            args: [proposalId],
          },
          {
            address: governance,
            abi: dtfIndexGovernanceOptimisticAbi,
            functionName: "token",
          },
        ],
      })) as readonly [bigint, Address];

    snapshot = snapshot ?? contractSnapshot;
    token = token ?? contractToken;
  }

  if (vetoThreshold === undefined || snapshot === undefined || token === undefined) {
    throw new Error("Missing optimistic proposal context values");
  }

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
  const [lateQuorumVoteExtension, proposalThrottleCapacity, optimisticParams, selectorRegistry, token, timelock] =
    (await client.viem.getPublicClient(params.chainId).multicall({
      allowFailure: false,
      contracts: [
        {
          address: governance,
          abi: dtfIndexGovernanceOptimisticAbi,
          functionName: "lateQuorumVoteExtension",
        },
        {
          address: governance,
          abi: dtfIndexGovernanceOptimisticAbi,
          functionName: "proposalThrottleCapacity",
        },
        {
          address: governance,
          abi: dtfIndexGovernanceOptimisticAbi,
          functionName: "optimisticParams",
        },
        {
          address: governance,
          abi: dtfIndexGovernanceOptimisticAbi,
          functionName: "selectorRegistry",
        },
        {
          address: governance,
          abi: dtfIndexGovernanceOptimisticAbi,
          functionName: "token",
        },
        {
          address: governance,
          abi: dtfIndexGovernanceOptimisticAbi,
          functionName: "timelock",
        },
      ],
    })) as readonly [
      number | bigint,
      bigint,
      readonly [number | bigint, number | bigint, bigint],
      Address,
      Address,
      Address,
    ];
  const [vetoDelay, vetoPeriod, vetoThreshold] = optimisticParams;
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
  const publicClient = client.viem.getPublicClient(params.chainId);
  const [optimisticProposerCount, guardianCount] = (await publicClient.multicall({
    allowFailure: false,
    contracts: [
      {
        address: timelock,
        abi: optimisticTimelockAbi,
        functionName: "getRoleMemberCount",
        args: [OPTIMISTIC_PROPOSER_ROLE],
      },
      {
        address: timelock,
        abi: optimisticTimelockAbi,
        functionName: "getRoleMemberCount",
        args: [CANCELLER_ROLE],
      },
    ],
  })) as readonly [bigint, bigint];
  const memberCalls = [
    ...getRoleMemberCalls(timelock, OPTIMISTIC_PROPOSER_ROLE, optimisticProposerCount),
    ...getRoleMemberCalls(timelock, CANCELLER_ROLE, guardianCount),
  ];
  const members =
    memberCalls.length === 0
      ? []
      : ((await publicClient.multicall({
          allowFailure: false,
          contracts: memberCalls,
        })) as readonly Address[]);
  const optimisticProposerCountNumber = Number(optimisticProposerCount);
  const optimisticProposers = members.slice(0, optimisticProposerCountNumber);
  const guardians = members.slice(optimisticProposerCountNumber);

  return { optimisticProposers, guardians };
}

export async function getProposalThrottleCharges(
  client: DtfClient,
  params: GetIndexDtfProposalThrottleChargesParams,
): Promise<bigint> {
  const charges = await client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.governance),
    abi: dtfIndexGovernanceOptimisticAbi,
    functionName: "proposalThrottleCharges",
    args: [getAddress(params.account)],
  });

  return charges;
}

export async function getOptimisticVotes(client: DtfClient, params: GetIndexDtfOptimisticVotesParams): Promise<Amount> {
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
): Promise<Amount> {
  const timepoint = params.timepoint ?? (await getLatestBlockTimepoint(client.viem, params.chainId));
  const votes = await client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.voteToken),
    abi: dtfIndexStakingVaultOptimisticAbi,
    functionName: "getPastOptimisticVotes",
    args: [getAddress(params.account), timepoint],
  });

  return mapAmount(votes);
}

function getRoleMemberCalls(timelock: Address, role: Hex, count: bigint) {
  return Array.from(
    { length: Number(count) },
    (_, index) =>
      ({
        address: timelock,
        abi: optimisticTimelockAbi,
        functionName: "getRoleMember",
        args: [role, BigInt(index)],
      }) as const,
  );
}

function toBigInt(value: number | bigint): bigint {
  return typeof value === "bigint" ? value : BigInt(value);
}
