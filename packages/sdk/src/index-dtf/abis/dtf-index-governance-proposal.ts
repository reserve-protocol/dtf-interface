import { dtfIndexGovernanceAbi } from "@/index-dtf/abis/dtf-index-governance";
import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";

export const dtfIndexGovernanceProposalAbi = [
  ...dtfIndexGovernanceAbi,
  ...dtfIndexGovernanceOptimisticAbi,
] as const;
