import { getAddress } from "viem";
import type { DtfClient } from "../../../client.js";
import { SdkError } from "../../../errors.js";
import type { IndexDtfCall } from "../../../types/governance.js";
import { dtfIndexAbi } from "../../abis/dtf-index-abi.js";
import { timelockAbi } from "../../abis/timelock.js";
import {
  prepareIndexDtfRemoveFromBasket,
  prepareIndexDtfSetAuctionLength,
  prepareIndexDtfSetBidsEnabled,
  prepareIndexDtfSetMandate,
  prepareIndexDtfSetMintFee,
  prepareIndexDtfSetName,
  prepareIndexDtfSetRebalanceControl,
  prepareIndexDtfSetTvlFee,
} from "./calls.js";
import {
  prepareRevenueDistribution,
  validateRevenueDistributionInput,
} from "./revenue.js";
import { buildGovernanceCalls } from "./settings-governance.js";
import {
  AUCTION_LAUNCHER_ROLE,
  BRAND_MANAGER_ROLE,
  GUARDIAN_ROLE,
  buildRoleDiffCalls,
} from "./settings-roles.js";
import {
  buildCallPayload,
  buildSettingsProposal,
  getAuthorityGovernance,
  getDtfIfNeeded,
  getIndexDtfSettingsVersion,
  hasIndexDtfSettingsCall,
  validateDtfSettingsParams,
} from "./settings-shared.js";
import type {
  BuildIndexDtfSettingsProposalParams,
  BuiltIndexDtfCalls,
  BuiltIndexDtfProposal,
} from "./settings-types.js";

/** Builds a proposal that changes core Index DTF settings. */
export async function buildIndexDtfSettingsProposal(
  client: DtfClient,
  params: BuildIndexDtfSettingsProposalParams,
): Promise<BuiltIndexDtfProposal> {
  return buildSettingsProposal({
    ...await buildIndexDtfSettingsCalls(client, params),
    description: params.description,
  });
}

async function buildIndexDtfSettingsCalls(
  client: DtfClient,
  params: BuildIndexDtfSettingsProposalParams,
): Promise<BuiltIndexDtfCalls> {
  validateDtfSettingsParams(params);

  const needsDtf = params.dtf === undefined && (
    params.governance === undefined ||
    (params.governanceChanges?.executionDelay !== undefined && params.timelock === undefined) ||
    (params.guardians !== undefined && (params.timelock === undefined || params.currentGuardians === undefined)) ||
    params.brandManagers !== undefined ||
    params.auctionLaunchers !== undefined ||
    params.revenueDistribution !== undefined ||
    (params.weightControl !== undefined && params.priceControl === undefined) ||
    (params.priceControl !== undefined && params.weightControl === undefined) ||
    (params.governanceChanges?.quorumPercent !== undefined && params.quorumDenominator === undefined)
  );
  const hasIndexDtfCall = hasIndexDtfSettingsCall(params);
  if (hasIndexDtfCall && !needsDtf && params.timelock === undefined && params.dtf === undefined) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "timelock is required to build this Index DTF proposal",
      meta: { timelock: params.timelock },
    });
  }

  const dtf = await getDtfIfNeeded(client, params, needsDtf);
  if (params.revenueDistribution) validateRevenueDistributionInput(dtf, params.revenueDistribution);

  const version = hasIndexDtfCall ? await getIndexDtfSettingsVersion(client, params) : undefined;
  const dtfAddress = getAddress(params.address);
  const adminGovernance = getAuthorityGovernance(dtf?.governance.admin.primary);
  const governance = params.governance ?? adminGovernance?.address;
  const timelock = params.timelock ?? adminGovernance?.timelock.address;
  const currentGuardians = params.currentGuardians ?? adminGovernance?.timelock.guardians ?? [];
  const calls: IndexDtfCall[] = [];

  if (version !== undefined) {
    calls.push(...buildDtfCalls(dtfAddress, params, version, dtf?.rebalance));
  }

  calls.push(
    ...buildRoleDiffCalls({ chainId: params.chainId, target: timelock ?? dtfAddress, role: GUARDIAN_ROLE, current: currentGuardians, next: params.guardians, abi: timelock ? timelockAbi : dtfIndexAbi }),
    ...buildRoleDiffCalls({ chainId: params.chainId, target: dtfAddress, role: BRAND_MANAGER_ROLE, current: dtf?.roles.metadata.brandManagers ?? [], next: params.brandManagers, abi: dtfIndexAbi }),
    ...buildRoleDiffCalls({ chainId: params.chainId, target: dtfAddress, role: AUCTION_LAUNCHER_ROLE, current: dtf?.roles.rebalance.auctionLaunchers ?? [], next: params.auctionLaunchers, abi: dtfIndexAbi }),
    ...buildGovernanceCalls({
      chainId: params.chainId,
      governance,
      timelock,
      changes: params.governanceChanges,
      quorumDenominator: params.quorumDenominator ?? adminGovernance?.quorumDenominator,
    }),
  );

  const revenueCall = version && params.revenueDistribution
    ? prepareRevenueDistribution(dtfAddress, params.chainId, dtf, params.revenueDistribution, version)
    : undefined;
  if (revenueCall) calls.push(revenueCall);

  return buildCallPayload({ governance, timelock, calls });
}

function buildDtfCalls(
  address: `0x${string}`,
  params: BuildIndexDtfSettingsProposalParams,
  version: NonNullable<BuildIndexDtfSettingsProposalParams["version"]>,
  currentRebalanceControl: Pick<NonNullable<BuildIndexDtfSettingsProposalParams["dtf"]>["rebalance"], "weightControl" | "priceControl"> | undefined,
): IndexDtfCall[] {
  const calls: IndexDtfCall[] = [];

  for (const token of params.removeBasketTokens ?? []) {
    calls.push(prepareIndexDtfRemoveFromBasket({ address, chainId: params.chainId, token, version }));
  }
  if (params.tokenName !== undefined) calls.push(prepareIndexDtfSetName({ address, chainId: params.chainId, name: params.tokenName, version }));
  if (params.mandate !== undefined) calls.push(prepareIndexDtfSetMandate({ address, chainId: params.chainId, mandate: params.mandate, version }));
  if (params.mintFee !== undefined) calls.push(prepareIndexDtfSetMintFee({ address, chainId: params.chainId, percentage: params.mintFee, version }));
  if (params.tvlFee !== undefined) calls.push(prepareIndexDtfSetTvlFee({ address, chainId: params.chainId, percentage: params.tvlFee, version }));
  if (params.auctionLength !== undefined) calls.push(prepareIndexDtfSetAuctionLength({ address, chainId: params.chainId, auctionLength: params.auctionLength * 60, version }));
  if (params.weightControl !== undefined || params.priceControl !== undefined) {
    const weightControl = params.weightControl ?? currentRebalanceControl?.weightControl;
    const priceControl = params.priceControl ?? currentRebalanceControl?.priceControl;
    if (weightControl === undefined) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "weightControl is required to build a priceControl settings proposal",
        meta: { address, chainId: params.chainId },
      });
    }
    if (priceControl === undefined) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "priceControl is required to build a weightControl settings proposal",
        meta: { address, chainId: params.chainId },
      });
    }
    calls.push(prepareIndexDtfSetRebalanceControl({ address, chainId: params.chainId, weightControl, priceControl, version }));
  }
  if (params.bidsEnabled !== undefined) calls.push(prepareIndexDtfSetBidsEnabled({ address, chainId: params.chainId, enabled: params.bidsEnabled, version }));

  return calls;
}
