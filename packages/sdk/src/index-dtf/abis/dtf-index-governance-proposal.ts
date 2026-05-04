export const dtfIndexGovernanceProposalAbi = [
  {
    type: "function",
    name: "setProposalThreshold",
    inputs: [{ name: "newProposalThreshold", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setVotingDelay",
    inputs: [{ name: "newVotingDelay", type: "uint48" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setVotingPeriod",
    inputs: [{ name: "newVotingPeriod", type: "uint32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateQuorumNumerator",
    inputs: [{ name: "newQuorumNumerator", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
