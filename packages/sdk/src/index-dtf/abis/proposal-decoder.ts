import type { Abi } from "viem";

import { dtfAdminProposalAbi } from "@/index-dtf/abis/dtf-admin-proposal";
import { dtfIndexGovernanceProposalAbi } from "@/index-dtf/abis/dtf-index-governance-proposal";
import { dtfIndexProposalAbi } from "@/index-dtf/abis/dtf-index-proposal";
import { dtfIndexStakingVaultProposalAbi } from "@/index-dtf/abis/dtf-index-staking-vault-proposal";
import { timelockProposalAbi } from "@/index-dtf/abis/timelock-proposal";
import { upgradeSpellProposalAbi } from "@/index-dtf/abis/upgrade-spell-proposal";

export const indexDtfProposalDecoderAbi: Abi = [
  ...dtfIndexProposalAbi,
  ...dtfAdminProposalAbi,
  ...dtfIndexGovernanceProposalAbi,
  ...dtfIndexStakingVaultProposalAbi,
  ...timelockProposalAbi,
  ...upgradeSpellProposalAbi,
];

export {
  dtfAdminProposalAbi,
  dtfIndexProposalAbi,
  dtfIndexGovernanceProposalAbi,
  dtfIndexStakingVaultProposalAbi,
  timelockProposalAbi,
  upgradeSpellProposalAbi,
};
