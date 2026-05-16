import { isAddress, type Address, type Hex } from "viem";
import { z } from "zod";

import type { IndexDtfRevenueDistributionInput } from "@/index-dtf/governance/propose/revenue";
import type { DtfParams } from "@/types/common";
import type { IndexDtfCall } from "@/types/governance";
import type { IndexDtf, PriceControl } from "@/types/index-dtf";

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
  version: z.enum(["5.0.0", "6.0.0"]).optional(),
  revenueDistribution: z
    .object({
      platformFee: z.coerce.number().min(0).lt(100),
      governanceShare: z.coerce.number().min(0).max(100),
      deployerShare: z.coerce.number().min(0).max(100),
      additionalRecipients: z.array(
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

export type BuiltIndexDtfCalls = {
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
  readonly version?: "5.0.0" | "6.0.0" | undefined;
};

export type {
  IndexDtfRevenueDistributionInput,
  IndexDtfRevenueRecipientInput,
} from "@/index-dtf/governance/propose/revenue";
