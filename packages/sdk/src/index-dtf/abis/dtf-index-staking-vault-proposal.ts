export const dtfIndexStakingVaultProposalAbi = [
  {
    type: "function",
    name: "addRewardToken",
    inputs: [{ name: "_rewardToken", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeRewardToken",
    inputs: [{ name: "_rewardToken", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
