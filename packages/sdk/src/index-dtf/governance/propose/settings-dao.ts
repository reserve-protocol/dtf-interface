import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type {
  BuildIndexDtfDaoSettingsProposalParams,
  BuiltIndexDtfCalls,
  BuiltIndexDtfProposal,
} from "@/index-dtf/governance/propose/settings-types";
import type { IndexDtfCall } from "@/types/governance";

import { prepareContractCall } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";
import { dtfIndexStakingVaultAbi } from "@/index-dtf/abis/dtf-index-staking-vault";
import { timelockAbi } from "@/index-dtf/abis/timelock";
import { buildGovernanceCalls } from "@/index-dtf/governance/propose/settings-governance";
import { CANCELLER_ROLE, buildRoleDiffCalls } from "@/index-dtf/governance/propose/settings-roles";
import {
  buildCallPayload,
  buildSettingsProposal,
  getDtfIfNeeded,
} from "@/index-dtf/governance/propose/settings-shared";

/** Builds a proposal that changes vote-lock DAO settings and rewards. */
export async function buildIndexDtfDaoSettingsProposal(
  client: DtfClient,
  params: BuildIndexDtfDaoSettingsProposalParams,
): Promise<BuiltIndexDtfProposal> {
  return buildSettingsProposal({
    ...(await buildIndexDtfDaoSettingsCalls(client, params)),
    description: params.description,
  });
}

async function buildIndexDtfDaoSettingsCalls(
  client: DtfClient,
  params: BuildIndexDtfDaoSettingsProposalParams,
): Promise<BuiltIndexDtfCalls> {
  const hasRewardChanges = (params.addRewardTokens?.length ?? 0) > 0 || (params.removeRewardTokens?.length ?? 0) > 0;
  const needsDtf =
    params.dtf === undefined &&
    (params.governance === undefined ||
      (hasRewardChanges && params.stToken === undefined) ||
      (params.governanceChanges?.executionDelay !== undefined && params.timelock === undefined) ||
      (params.governanceChanges?.quorumPercent !== undefined && params.quorumDenominator === undefined) ||
      (params.guardians !== undefined && (params.timelock === undefined || params.currentGuardians === undefined)));
  const dtf = await getDtfIfNeeded(client, params, needsDtf);
  const vault = dtf?.voteLockVault;
  const governance = params.governance ?? vault?.governance?.address;
  const timelock = params.timelock ?? vault?.governance?.timelock.address;
  const stToken = params.stToken ?? vault?.token.address;
  const currentGuardians = params.currentGuardians ?? vault?.governance?.timelock.guardians ?? [];
  const calls: IndexDtfCall[] = [];

  if (hasRewardChanges && !stToken) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "stToken is required to build DAO reward token proposals",
    });
  }

  if (stToken) {
    for (const token of params.removeRewardTokens ?? []) {
      calls.push(prepareRewardTokenCall(params.chainId, stToken, "removeRewardToken", token));
    }
    for (const token of params.addRewardTokens ?? []) {
      calls.push(prepareRewardTokenCall(params.chainId, stToken, "addRewardToken", token));
    }
  }

  calls.push(
    ...buildGovernanceCalls({
      chainId: params.chainId,
      governance,
      timelock,
      changes: params.governanceChanges,
      quorumDenominator: params.quorumDenominator ?? vault?.governance?.quorumDenominator,
    }),
    ...buildRoleDiffCalls({
      chainId: params.chainId,
      target: timelock,
      role: CANCELLER_ROLE,
      current: currentGuardians,
      next: params.guardians,
      abi: timelockAbi,
    }),
  );

  return buildCallPayload({ governance, timelock, calls });
}

function prepareRewardTokenCall(
  chainId: BuildIndexDtfDaoSettingsProposalParams["chainId"],
  target: `0x${string}`,
  functionName: "addRewardToken" | "removeRewardToken",
  token: `0x${string}`,
): IndexDtfCall {
  const args = [getAddress(token)] as const;

  return prepareContractCall({
    chainId,
    address: target,
    abi: dtfIndexStakingVaultAbi,
    functionName,
    args,
  });
}
