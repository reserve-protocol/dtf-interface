import type { DtfClient } from "@/client";
import type {
  BuildIndexDtfBasketSettingsProposalParams,
  BuiltIndexDtfCalls,
  BuiltIndexDtfProposal,
} from "@/index-dtf/governance/propose/settings-types";

import { timelockAbi } from "@/index-dtf/abis/timelock";
import { buildGovernanceCalls } from "@/index-dtf/governance/propose/settings-governance";
import { CANCELLER_ROLE, buildRoleDiffCalls } from "@/index-dtf/governance/propose/settings-roles";
import {
  buildCallPayload,
  buildSettingsProposal,
  getAuthorityGovernance,
  getDtfIfNeeded,
} from "@/index-dtf/governance/propose/settings-shared";

/** Builds a proposal that changes basket governance settings. */
export async function buildIndexDtfBasketSettingsProposal(
  client: DtfClient,
  params: BuildIndexDtfBasketSettingsProposalParams,
): Promise<BuiltIndexDtfProposal> {
  return buildSettingsProposal({
    ...(await buildIndexDtfBasketSettingsCalls(client, params)),
    description: params.description,
  });
}

async function buildIndexDtfBasketSettingsCalls(
  client: DtfClient,
  params: BuildIndexDtfBasketSettingsProposalParams,
): Promise<BuiltIndexDtfCalls> {
  const needsDtf =
    params.dtf === undefined &&
    (params.governance === undefined ||
      (params.governanceChanges?.executionDelay !== undefined && params.timelock === undefined) ||
      (params.governanceChanges?.quorumPercent !== undefined && params.quorumDenominator === undefined) ||
      (params.guardians !== undefined && (params.timelock === undefined || params.currentGuardians === undefined)));
  const dtf = await getDtfIfNeeded(client, params, needsDtf);
  const rebalanceGovernance = getAuthorityGovernance(dtf?.governance.rebalance.primary);
  const governance = params.governance ?? rebalanceGovernance?.address;
  const timelock = params.timelock ?? rebalanceGovernance?.timelock.address;
  const currentGuardians = params.currentGuardians ?? rebalanceGovernance?.timelock.guardians ?? [];

  return buildCallPayload({
    governance,
    timelock,
    calls: [
      ...buildGovernanceCalls({
        chainId: params.chainId,
        governance,
        timelock,
        changes: params.governanceChanges,
        quorumDenominator: params.quorumDenominator ?? rebalanceGovernance?.quorumDenominator,
      }),
      ...buildRoleDiffCalls({
        chainId: params.chainId,
        target: timelock,
        role: CANCELLER_ROLE,
        current: currentGuardians,
        next: params.guardians,
        abi: timelockAbi,
      }),
    ],
  });
}
