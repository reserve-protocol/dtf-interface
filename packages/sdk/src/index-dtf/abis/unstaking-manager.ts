export const unstakingManagerAbi = [
  {
    type: "function",
    name: "claimLock",
    inputs: [{ name: "lockId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
