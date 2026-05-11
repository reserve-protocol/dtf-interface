import type { Abi } from "viem";

import { dtfAdminProposalAbi } from "./dtf-admin-proposal.js";
import { dtfIndexGovernanceProposalAbi } from "./dtf-index-governance-proposal.js";
import { dtfIndexProposalAbi } from "./dtf-index-proposal.js";
import { dtfIndexStakingVaultProposalAbi } from "./dtf-index-staking-vault-proposal.js";
import { timelockProposalAbi } from "./timelock-proposal.js";
import { upgradeSpellProposalAbi } from "./upgrade-spell-proposal.js";

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
