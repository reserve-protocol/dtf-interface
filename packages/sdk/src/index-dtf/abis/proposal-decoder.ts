import { dtfAdminProposalAbi } from "./dtf-admin-proposal.js";
import { dtfIndexGovernanceProposalAbi } from "./dtf-index-governance-proposal.js";
import { dtfIndexProposalAbiV1, dtfIndexProposalAbiV2, dtfIndexProposalAbiV4, dtfIndexProposalAbiV5 } from "./dtf-index-proposal.js";
import { dtfIndexStakingVaultProposalAbi } from "./dtf-index-staking-vault-proposal.js";
import { timelockProposalAbi } from "./timelock-proposal.js";
import { upgradeSpellProposalAbi } from "./upgrade-spell-proposal.js";

export const dtfIndexFolioProposalAbi = [
  ...dtfIndexProposalAbiV5,
  ...dtfIndexProposalAbiV4,
  ...dtfIndexProposalAbiV2,
  ...dtfIndexProposalAbiV1,
] as const;

export const indexDtfProposalDecoderAbi = [
  ...dtfIndexFolioProposalAbi,
  ...dtfAdminProposalAbi,
  ...dtfIndexGovernanceProposalAbi,
  ...dtfIndexStakingVaultProposalAbi,
  ...timelockProposalAbi,
  ...upgradeSpellProposalAbi,
] as const;

export {
  dtfAdminProposalAbi,
  dtfIndexGovernanceProposalAbi,
  dtfIndexStakingVaultProposalAbi,
  timelockProposalAbi,
  upgradeSpellProposalAbi,
};
