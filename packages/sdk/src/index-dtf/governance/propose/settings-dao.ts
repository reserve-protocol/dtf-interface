import { encodeFunctionData, getAddress } from "viem";
import type { DtfClient } from "../../../client.js";
import { SdkError } from "../../../errors.js";
import type { IndexDtfCall } from "../../../types/governance.js";
import { dtfIndexStakingVaultAbi } from "../../abis/dtf-index-staking-vault.js";
import { timelockAbi } from "../../abis/timelock.js";
import { buildGovernanceCalls } from "./settings-governance.js";
import { CANCELLER_ROLE, buildRoleDiffCalls } from "./settings-roles.js";
import {
  buildCallPayload,
  buildSettingsProposal,
  getDtfIfNeeded,
} from "./settings-shared.js";
import type {
  BuildIndexDtfDaoSettingsProposalParams,
  BuiltIndexDtfCalls,
  BuiltIndexDtfProposal,
} from "./settings-types.js";

/** Builds a proposal that changes vote-lock DAO settings and rewards. */
export async function buildIndexDtfDaoSettingsProposal(
  client: DtfClient,
  params: BuildIndexDtfDaoSettingsProposalParams,
): Promise<BuiltIndexDtfProposal> {
  return buildSettingsProposal({
    ...await buildIndexDtfDaoSettingsCalls(client, params),
    description: params.description,
  });
}

async function buildIndexDtfDaoSettingsCalls(
  client: DtfClient,
  params: BuildIndexDtfDaoSettingsProposalParams,
): Promise<BuiltIndexDtfCalls> {
  const hasRewardChanges = (params.addRewardTokens?.length ?? 0) > 0 ||
    (params.removeRewardTokens?.length ?? 0) > 0;
  const needsDtf = params.dtf === undefined && (
    params.governance === undefined ||
    (hasRewardChanges && params.stToken === undefined) ||
    (params.governanceChanges?.executionDelay !== undefined && params.timelock === undefined) ||
    (params.governanceChanges?.quorumPercent !== undefined && params.quorumDenominator === undefined) ||
    (params.guardians !== undefined && (params.timelock === undefined || params.currentGuardians === undefined))
  );
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
      calls.push(encodeRewardTokenCall(stToken, "removeRewardToken", token));
    }
    for (const token of params.addRewardTokens ?? []) {
      calls.push(encodeRewardTokenCall(stToken, "addRewardToken", token));
    }
  }

  calls.push(
    ...buildGovernanceCalls({
      governance,
      timelock,
      changes: params.governanceChanges,
      quorumDenominator: params.quorumDenominator ?? vault?.governance?.quorumDenominator,
    }),
    ...buildRoleDiffCalls({
      target: timelock,
      role: CANCELLER_ROLE,
      current: currentGuardians,
      next: params.guardians,
      abi: timelockAbi,
    }),
  );

  return buildCallPayload({ governance, timelock, calls });
}

function encodeRewardTokenCall(
  target: `0x${string}`,
  functionName: "addRewardToken" | "removeRewardToken",
  token: `0x${string}`,
): IndexDtfCall {
  return {
    target,
    calldata: encodeFunctionData({
      abi: dtfIndexStakingVaultAbi,
      functionName,
      args: [getAddress(token)],
    }),
  };
}
