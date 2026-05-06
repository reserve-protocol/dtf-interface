import { Decimal } from "decimal.js-light";
import {
  encodeFunctionData,
  getAddress,
  isAddress,
  keccak256,
  parseEther,
  toBytes,
  type Address,
  type Hex,
} from "viem";
import { z } from "zod";
import type { DtfClient } from "../../../client.js";
import { SdkError } from "../../../errors.js";
import type { Authority, DtfParams, Governance } from "../../../types/common.js";
import type { IndexDtfCall } from "../../../types/governance.js";
import type { IndexDtf, PriceControl } from "../../../types/index-dtf.js";
import { dtfIndexAbi } from "../../abis/dtf-index-abi.js";
import { dtfIndexGovernanceAbi } from "../../abis/dtf-index-governance.js";
import { dtfIndexStakingVaultAbi } from "../../abis/dtf-index-staking-vault.js";
import { timelockAbi } from "../../abis/timelock.js";
import { getIndexDtf, getIndexDtfVersion } from "../../dtf/index.js";
import {
  buildIndexDtfRemoveFromBasketCall,
  buildIndexDtfSetAuctionLengthCall,
  buildIndexDtfSetBidsEnabledCall,
  buildIndexDtfSetMandateCall,
  buildIndexDtfSetMintFeeCall,
  buildIndexDtfSetNameCall,
  buildIndexDtfSetRebalanceControlCall,
  buildIndexDtfSetTvlFeeCall,
} from "./calls.js";
import type { IndexDtfVersion } from "../../versions.js";
import {
  buildRevenueDistributionCall,
  type IndexDtfRevenueDistributionInput,
  type IndexDtfRevenueRecipientInput,
} from "./revenue.js";

// Register labels owner timelock guardians as GUARDIAN_ROLE, but the contract
// role bytes are the Timelock CANCELLER_ROLE hash.
const GUARDIAN_ROLE =
  "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783" as const;
const BRAND_MANAGER_ROLE =
  "0x2d8e650da9bd8c373ab2450d770f2ed39549bfc28d3630025cecc51511bcd374" as const;
const AUCTION_LAUNCHER_ROLE =
  "0x13ff1b2625181b311f257c723b5e6d366eb318b212d9dd694c48fcf227659df5" as const;
const CANCELLER_ROLE = keccak256(toBytes("CANCELLER_ROLE"));
const MAX_TOKEN_NAME_LENGTH = 32;
const MAX_MINT_FEE = 5;
const MAX_TVL_FEE = 10;
const MIN_AUCTION_LENGTH_MINUTES = 15;
const MAX_AUCTION_LENGTH_MINUTES = 1440;

const addressSchema = z.string().refine(isAddress, "Invalid address");

export const indexDtfGovernanceChangesSchema = z.object({
  votingDelay: z.coerce.number().min(0).optional(),
  votingPeriod: z.coerce.number().min(0).optional(),
  proposalThreshold: z.coerce.number().min(0).max(100).optional(),
  quorumPercent: z.coerce.number().min(0).max(100).optional(),
  executionDelay: z.coerce.number().min(0).optional(),
});

export const indexDtfBasketSettingsProposalSchema = z.object({
  governanceChanges: indexDtfGovernanceChangesSchema.optional(),
  guardians: z.array(addressSchema).optional(),
});

export const indexDtfDaoSettingsProposalSchema = z.object({
  addRewardTokens: z.array(addressSchema).optional(),
  removeRewardTokens: z.array(addressSchema).optional(),
  governanceChanges: indexDtfGovernanceChangesSchema.optional(),
  guardians: z.array(addressSchema).optional(),
});

export const indexDtfSettingsProposalSchema = z.object({
  tokenName: z.string().min(1).max(32).optional(),
  mandate: z.string().optional(),
  mintFee: z.coerce.number().min(0).max(5).optional(),
  tvlFee: z.coerce.number().min(0).max(10).optional(),
  auctionLength: z.coerce.number().min(15).max(1440).optional(),
  weightControl: z.boolean().optional(),
  priceControl: z.coerce.number().int().min(0).max(2).optional(),
  bidsEnabled: z.boolean().optional(),
  removeBasketTokens: z.array(addressSchema).optional(),
  guardians: z.array(addressSchema).optional(),
  brandManagers: z.array(addressSchema).optional(),
  auctionLaunchers: z.array(addressSchema).optional(),
  governanceChanges: indexDtfGovernanceChangesSchema.optional(),
  version: z.string().optional(),
  revenueDistribution: z
    .object({
      platformFee: z.coerce.number().min(0).lt(100),
      governanceShare: z.coerce.number().min(0).max(100),
      deployerShare: z.coerce.number().min(0).max(100),
      additionalRecipients: z
        .array(
          z.object({
            address: addressSchema,
            share: z.coerce.number().min(0).max(100),
          }),
        ),
    })
    .optional(),
});

export type IndexDtfGovernanceChanges = {
  readonly votingDelay?: number;
  readonly votingPeriod?: number;
  readonly proposalThreshold?: number;
  readonly quorumPercent?: number;
  readonly executionDelay?: number;
};

export type BuiltIndexDtfProposal = {
  readonly governance: Address;
  readonly timelock: Address;
  readonly targets: readonly Address[];
  readonly calldatas: readonly Hex[];
  readonly description: string;
};

type BuiltIndexDtfCalls = {
  readonly governance?: Address;
  readonly timelock?: Address;
  readonly calls: readonly IndexDtfCall[];
  readonly targets: readonly Address[];
  readonly calldatas: readonly Hex[];
};

export type BuildIndexDtfBasketSettingsProposalParams = DtfParams & {
  readonly dtf?: IndexDtf;
  readonly description?: string;
  readonly governance?: Address;
  readonly timelock?: Address;
  readonly governanceChanges?: IndexDtfGovernanceChanges;
  readonly guardians?: readonly Address[];
  readonly currentGuardians?: readonly Address[];
  readonly quorumDenominator?: number;
};

export type BuildIndexDtfDaoSettingsProposalParams = DtfParams & {
  readonly dtf?: IndexDtf;
  readonly description?: string;
  readonly governance?: Address;
  readonly timelock?: Address;
  readonly stToken?: Address;
  readonly addRewardTokens?: readonly Address[];
  readonly removeRewardTokens?: readonly Address[];
  readonly governanceChanges?: IndexDtfGovernanceChanges;
  readonly guardians?: readonly Address[];
  readonly currentGuardians?: readonly Address[];
  readonly quorumDenominator?: number;
};

export type {
  IndexDtfRevenueDistributionInput,
  IndexDtfRevenueRecipientInput,
} from "./revenue.js";

export type BuildIndexDtfSettingsProposalParams = DtfParams & {
  readonly dtf?: IndexDtf;
  readonly description?: string;
  readonly governance?: Address;
  readonly timelock?: Address;
  readonly tokenName?: string;
  readonly mandate?: string;
  readonly mintFee?: number;
  readonly tvlFee?: number;
  readonly auctionLength?: number;
  readonly weightControl?: boolean;
  readonly priceControl?: PriceControl;
  readonly bidsEnabled?: boolean;
  readonly removeBasketTokens?: readonly Address[];
  readonly guardians?: readonly Address[];
  readonly currentGuardians?: readonly Address[];
  readonly brandManagers?: readonly Address[];
  readonly auctionLaunchers?: readonly Address[];
  readonly governanceChanges?: IndexDtfGovernanceChanges;
  readonly quorumDenominator?: number;
  readonly revenueDistribution?: IndexDtfRevenueDistributionInput;
  readonly version?: IndexDtfVersion | undefined;
};

export async function buildIndexDtfBasketSettingsProposal(
  client: DtfClient,
  params: BuildIndexDtfBasketSettingsProposalParams,
): Promise<BuiltIndexDtfProposal> {
  return buildSettingsProposal({
    ...await buildIndexDtfBasketSettingsCalls(client, params),
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
      (params.governanceChanges?.executionDelay !== undefined &&
        params.timelock === undefined) ||
      (params.governanceChanges?.quorumPercent !== undefined &&
        params.quorumDenominator === undefined) ||
      (params.guardians !== undefined &&
        (params.timelock === undefined || params.currentGuardians === undefined)));
  const dtf = await getDtfIfNeeded(client, params, needsDtf);
  const rebalanceGovernance = getAuthorityGovernance(
    dtf?.governance.rebalance.primary,
  );
  const governance = params.governance ?? rebalanceGovernance?.address;
  const timelock = params.timelock ?? rebalanceGovernance?.timelock.address;
  const currentGuardians = params.currentGuardians ??
    rebalanceGovernance?.timelock.guardians ??
    [];

  return buildCallPayload({
    governance,
    timelock,
    calls: [
      ...buildGovernanceCalls({
        governance,
        timelock,
        changes: params.governanceChanges,
        quorumDenominator: params.quorumDenominator ??
          rebalanceGovernance?.quorumDenominator,
      }),
      ...buildRoleDiffCalls({
        target: timelock,
        role: CANCELLER_ROLE,
        current: currentGuardians,
        next: params.guardians,
        abi: timelockAbi,
      }),
    ],
  });
}

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
  const needsDtf =
    params.dtf === undefined &&
    (params.governance === undefined ||
      (((params.addRewardTokens?.length ?? 0) > 0 ||
      (params.removeRewardTokens?.length ?? 0) > 0) &&
      params.stToken === undefined) ||
      (params.governanceChanges?.executionDelay !== undefined &&
        params.timelock === undefined) ||
      (params.governanceChanges?.quorumPercent !== undefined &&
        params.quorumDenominator === undefined) ||
      (params.guardians !== undefined &&
        (params.timelock === undefined || params.currentGuardians === undefined)));
  const dtf = await getDtfIfNeeded(client, params, needsDtf);
  const vault = dtf?.voteLockVault;
  const governance = params.governance ?? vault?.governance?.address;
  const timelock = params.timelock ?? vault?.governance?.timelock.address;
  const stToken = params.stToken ?? vault?.token.address;
  const currentGuardians = params.currentGuardians ?? vault?.governance?.timelock.guardians ?? [];
  const calls: IndexDtfCall[] = [];

  if (
    ((params.addRewardTokens?.length ?? 0) > 0 ||
      (params.removeRewardTokens?.length ?? 0) > 0) &&
    !stToken
  ) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "stToken is required to build DAO reward token proposals",
    });
  }

  if (stToken) {
    for (const token of params.removeRewardTokens ?? []) {
      calls.push({
        target: stToken,
        calldata: encodeFunctionData({
          abi: dtfIndexStakingVaultAbi,
          functionName: "removeRewardToken",
          args: [getAddress(token)],
        }),
      });
    }
    for (const token of params.addRewardTokens ?? []) {
      calls.push({
        target: stToken,
        calldata: encodeFunctionData({
          abi: dtfIndexStakingVaultAbi,
          functionName: "addRewardToken",
          args: [getAddress(token)],
        }),
      });
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

  return buildCallPayload({
    governance,
    timelock,
    calls,
  });
}

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

  const needsDtf =
    params.dtf === undefined &&
    (params.governance === undefined ||
      (params.governanceChanges?.executionDelay !== undefined &&
        params.timelock === undefined) ||
      (params.guardians !== undefined &&
        (params.timelock === undefined || params.currentGuardians === undefined)) ||
      params.brandManagers !== undefined ||
      params.auctionLaunchers !== undefined ||
      params.revenueDistribution !== undefined ||
      (params.weightControl !== undefined && params.priceControl === undefined) ||
      (params.governanceChanges?.quorumPercent !== undefined &&
        params.quorumDenominator === undefined));
  const hasIndexDtfCall = hasIndexDtfSettingsCall(params);
  const [dtf, indexDtfVersion] = await Promise.all([
    getDtfIfNeeded(client, params, needsDtf),
    hasIndexDtfCall ? getIndexDtfSettingsVersion(client, params) : undefined,
  ]);
  const dtfAddress = getAddress(params.address);
  const adminGovernance = getAuthorityGovernance(dtf?.governance.admin.primary);
  const governance = params.governance ?? adminGovernance?.address;
  const timelock = params.timelock ?? adminGovernance?.timelock.address;
  const currentGuardians = params.currentGuardians ??
    adminGovernance?.timelock.guardians ??
    [];
  const calls: IndexDtfCall[] = [];

  if (indexDtfVersion !== undefined) {
    for (const token of params.removeBasketTokens ?? []) {
      calls.push(
        buildIndexDtfRemoveFromBasketCall({
          address: dtfAddress,
          token,
          version: indexDtfVersion,
        }),
      );
    }

    if (params.tokenName !== undefined) {
      calls.push(
        buildIndexDtfSetNameCall({
          address: dtfAddress,
          name: params.tokenName,
          version: indexDtfVersion,
        }),
      );
    }
    if (params.mandate !== undefined) {
      calls.push(
        buildIndexDtfSetMandateCall({
          address: dtfAddress,
          mandate: params.mandate,
          version: indexDtfVersion,
        }),
      );
    }
    if (params.mintFee !== undefined) {
      calls.push(
        buildIndexDtfSetMintFeeCall({
          address: dtfAddress,
          percentage: params.mintFee,
          version: indexDtfVersion,
        }),
      );
    }
    if (params.tvlFee !== undefined) {
      calls.push(
        buildIndexDtfSetTvlFeeCall({
          address: dtfAddress,
          percentage: params.tvlFee,
          version: indexDtfVersion,
        }),
      );
    }
    if (params.auctionLength !== undefined) {
      calls.push(
        buildIndexDtfSetAuctionLengthCall({
          address: dtfAddress,
          auctionLength: params.auctionLength * 60,
          version: indexDtfVersion,
        }),
      );
    }
    if (params.weightControl !== undefined) {
      const priceControl = params.priceControl ?? dtf?.rebalance.priceControl;

      if (priceControl === undefined) {
        throw new SdkError({
          code: "INVALID_INPUT",
          message: "priceControl is required to build a weightControl settings proposal",
          meta: { address: dtfAddress, chainId: params.chainId },
        });
      }

      calls.push(
        buildIndexDtfSetRebalanceControlCall({
          address: dtfAddress,
          weightControl: params.weightControl,
          priceControl,
          version: indexDtfVersion,
        }),
      );
    }
    if (params.bidsEnabled !== undefined) {
      calls.push(
        buildIndexDtfSetBidsEnabledCall({
          address: dtfAddress,
          enabled: params.bidsEnabled,
          version: indexDtfVersion,
        }),
      );
    }
  }

  calls.push(
    ...buildRoleDiffCalls({
      target: timelock ?? dtfAddress,
      role: GUARDIAN_ROLE,
      current: currentGuardians,
      next: params.guardians,
      abi: timelock ? timelockAbi : dtfIndexAbi,
    }),
    ...buildRoleDiffCalls({
      target: dtfAddress,
      role: BRAND_MANAGER_ROLE,
      current: dtf?.roles.metadata.brandManagers ?? [],
      next: params.brandManagers,
      abi: dtfIndexAbi,
    }),
    ...buildRoleDiffCalls({
      target: dtfAddress,
      role: AUCTION_LAUNCHER_ROLE,
      current: dtf?.roles.rebalance.auctionLaunchers ?? [],
      next: params.auctionLaunchers,
      abi: dtfIndexAbi,
    }),
    ...buildGovernanceCalls({
      governance,
      timelock,
      changes: params.governanceChanges,
      quorumDenominator: params.quorumDenominator ??
        adminGovernance?.quorumDenominator,
    }),
  );

  const revenueCall = indexDtfVersion && params.revenueDistribution
    ? buildRevenueDistributionCall(
        dtfAddress,
        dtf,
        params.revenueDistribution,
        indexDtfVersion,
      )
    : undefined;
  if (revenueCall) {
    calls.push(revenueCall);
  }

  return buildCallPayload({
    governance,
    timelock,
    calls,
  });
}

function buildSettingsProposal({
  calls,
  calldatas,
  description,
  governance,
  timelock,
  targets,
}: {
  readonly governance?: Address;
  readonly timelock?: Address;
  readonly description: string | undefined;
  readonly calls: readonly IndexDtfCall[];
  readonly targets: readonly Address[];
  readonly calldatas: readonly Hex[];
}): BuiltIndexDtfProposal {
  if (calls.length === 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "proposal must include at least one call",
    });
  }

  const resolvedGovernance = getProposalGovernance(governance);
  const resolvedTimelock = getProposalTimelock(timelock);

  return {
    governance: resolvedGovernance,
    timelock: resolvedTimelock,
    targets,
    calldatas,
    description: description ?? "",
  };
}

function buildCallPayload({
  calls,
  governance,
  timelock,
}: {
  readonly governance: Address | undefined;
  readonly timelock: Address | undefined;
  readonly calls: readonly IndexDtfCall[];
}): BuiltIndexDtfCalls {
  return {
    ...(governance ? { governance } : {}),
    ...(timelock ? { timelock } : {}),
    calls,
    targets: calls.map((call) => call.target),
    calldatas: calls.map((call) => call.calldata),
  };
}

async function getDtfIfNeeded(
  client: DtfClient,
  params: DtfParams & { readonly dtf?: IndexDtf },
  needed: boolean,
): Promise<IndexDtf | undefined> {
  return params.dtf ?? (needed ? getIndexDtf(client, params) : undefined);
}

async function getIndexDtfSettingsVersion(
  client: DtfClient,
  params: BuildIndexDtfSettingsProposalParams,
): Promise<IndexDtfVersion> {
  if (params.version) {
    return params.version;
  }

  return await getIndexDtfVersion(client, params) as IndexDtfVersion;
}

function hasIndexDtfSettingsCall(params: BuildIndexDtfSettingsProposalParams): boolean {
  return (params.removeBasketTokens?.length ?? 0) > 0 ||
    params.tokenName !== undefined ||
    params.mandate !== undefined ||
    params.mintFee !== undefined ||
    params.tvlFee !== undefined ||
    params.auctionLength !== undefined ||
    params.weightControl !== undefined ||
    params.bidsEnabled !== undefined ||
    params.revenueDistribution !== undefined;
}

function buildGovernanceCalls({
  changes,
  governance,
  quorumDenominator,
  timelock,
}: {
  readonly governance: Address | undefined;
  readonly timelock: Address | undefined;
  readonly quorumDenominator: number | undefined;
  readonly changes: IndexDtfGovernanceChanges | undefined;
}): IndexDtfCall[] {
  if (!changes) {
    return [];
  }
  if (!governance) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "governance is required to build governance settings calls",
    });
  }

  validateGovernanceChanges(changes);

  const calls: IndexDtfCall[] = [];

  if (changes.votingDelay !== undefined) {
    calls.push({
      target: governance,
      calldata: encodeFunctionData({
        abi: dtfIndexGovernanceAbi,
        functionName: "setVotingDelay",
        args: [changes.votingDelay],
      }),
    });
  }
  if (changes.votingPeriod !== undefined) {
    calls.push({
      target: governance,
      calldata: encodeFunctionData({
        abi: dtfIndexGovernanceAbi,
        functionName: "setVotingPeriod",
        args: [changes.votingPeriod],
      }),
    });
  }
  if (changes.proposalThreshold !== undefined) {
    calls.push({
      target: governance,
      calldata: encodeFunctionData({
        abi: dtfIndexGovernanceAbi,
        functionName: "setProposalThreshold",
        args: [encodePercent(changes.proposalThreshold)],
      }),
    });
  }
  if (changes.quorumPercent !== undefined) {
    if (quorumDenominator === undefined) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "quorumDenominator is required to build a quorum proposal",
      });
    }

    calls.push({
      target: governance,
      calldata: encodeFunctionData({
        abi: dtfIndexGovernanceAbi,
        functionName: "updateQuorumNumerator",
        args: [getQuorumNumerator(changes.quorumPercent, quorumDenominator)],
      }),
    });
  }
  if (changes.executionDelay !== undefined) {
    if (!timelock) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "timelock is required to build an execution delay proposal",
      });
    }

    calls.push({
      target: timelock,
      calldata: encodeFunctionData({
        abi: timelockAbi,
        functionName: "updateDelay",
        args: [BigInt(Math.round(changes.executionDelay))],
      }),
    });
  }

  return calls;
}

function buildRoleDiffCalls({
  abi,
  current,
  next,
  role,
  target,
}: {
  readonly target: Address | undefined;
  readonly role: Hex;
  readonly current: readonly Address[];
  readonly next: readonly Address[] | undefined;
  readonly abi: typeof timelockAbi | typeof dtfIndexAbi;
}): IndexDtfCall[] {
  if (!next) {
    return [];
  }
  if (!target) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "target is required to build role calls",
      meta: { role },
    });
  }

  const normalizedCurrent = current.map((address) => getAddress(address));
  const normalizedNext = next.map((address) => getAddress(address));
  const calls: IndexDtfCall[] = [];

  for (const address of normalizedCurrent) {
    if (!normalizedNext.some((nextAddress) => sameAddress(nextAddress, address))) {
      calls.push({
        target,
        calldata: encodeFunctionData({
          abi,
          functionName: "revokeRole",
          args: [role, address],
        }),
      });
    }
  }

  for (const address of normalizedNext) {
    if (!normalizedCurrent.some((currentAddress) => sameAddress(currentAddress, address))) {
      calls.push({
        target,
        calldata: encodeFunctionData({
          abi,
          functionName: "grantRole",
          args: [role, address],
        }),
      });
    }
  }

  return calls;
}

function getProposalGovernance(
  governance: Address | undefined,
): Address {
  if (!governance) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "governance is required to build an Index DTF proposal",
      meta: { governance },
    });
  }

  return governance;
}

function getProposalTimelock(timelock: Address | undefined): Address {
  if (!timelock) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "timelock is required to build this Index DTF proposal",
      meta: { timelock },
    });
  }

  return timelock;
}

function validateDtfSettingsParams(params: BuildIndexDtfSettingsProposalParams) {
  if (params.tokenName !== undefined) {
    assertStringLength(params.tokenName, "tokenName", 1, MAX_TOKEN_NAME_LENGTH);
  }
  if (params.mintFee !== undefined) {
    assertNumberRange(params.mintFee, "mintFee", 0, MAX_MINT_FEE);
  }
  if (params.tvlFee !== undefined) {
    assertNumberRange(params.tvlFee, "tvlFee", 0, MAX_TVL_FEE);
  }
  if (params.auctionLength !== undefined) {
    assertNumberRange(
      params.auctionLength,
      "auctionLength",
      MIN_AUCTION_LENGTH_MINUTES,
      MAX_AUCTION_LENGTH_MINUTES,
    );
  }
  if (params.priceControl !== undefined && !isPriceControl(params.priceControl)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "priceControl must be 0, 1, or 2",
      meta: { priceControl: params.priceControl },
    });
  }
}

function validateGovernanceChanges(changes: IndexDtfGovernanceChanges) {
  if (changes.votingDelay !== undefined) {
    assertNumberRange(changes.votingDelay, "votingDelay", 0);
  }
  if (changes.votingPeriod !== undefined) {
    assertNumberRange(changes.votingPeriod, "votingPeriod", 0);
  }
  if (changes.proposalThreshold !== undefined) {
    assertNumberRange(changes.proposalThreshold, "proposalThreshold", 0, 100);
  }
  if (changes.quorumPercent !== undefined) {
    assertNumberRange(changes.quorumPercent, "quorumPercent", 0, 100);
  }
  if (changes.executionDelay !== undefined) {
    assertNumberRange(changes.executionDelay, "executionDelay", 0);
  }
}

function assertStringLength(
  value: string,
  field: string,
  minLength: number,
  maxLength: number,
) {
  if (value.length < minLength || value.length > maxLength) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} must be between ${minLength} and ${maxLength} characters`,
      meta: { [field]: value },
    });
  }
}

function assertNumberRange(
  value: number,
  field: string,
  min: number,
  max?: number,
) {
  if (!Number.isFinite(value) || value < min || (max !== undefined && value > max)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: max === undefined
        ? `${field} must be greater than or equal to ${min}`
        : `${field} must be between ${min} and ${max}`,
      meta: { [field]: value },
    });
  }
}

function getAuthorityGovernance(
  authority: Authority | undefined,
): Governance | undefined {
  return authority?.type === "governance" ? authority.governance : undefined;
}

function encodePercent(percentage: number): bigint {
  return parseEther(new Decimal(percentage).div(100).toFixed());
}

function getQuorumNumerator(percent: number, denominator: number): bigint {
  const basisPoints = Math.round(percent * 100);

  return (BigInt(basisPoints) * BigInt(denominator)) / 10_000n;
}

function isPriceControl(value: number): value is PriceControl {
  return Number.isInteger(value) && (value === 0 || value === 1 || value === 2);
}

function sameAddress(a: Address, b: Address): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
