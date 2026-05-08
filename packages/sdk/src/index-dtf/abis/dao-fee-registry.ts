export const daoFeeRegistryAbi = [
  {
    type: "function",
    name: "getFeeDetails",
    inputs: [{ name: "fToken", type: "address", internalType: "address" }],
    outputs: [
      { name: "recipient", type: "address", internalType: "address" },
      { name: "feeNumerator", type: "uint256", internalType: "uint256" },
      { name: "feeDenominator", type: "uint256", internalType: "uint256" },
      { name: "feeFloor", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;
