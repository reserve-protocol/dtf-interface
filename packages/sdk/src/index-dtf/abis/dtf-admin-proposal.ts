export const dtfAdminProposalAbi = [
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeToVersion",
    inputs: [
      { name: "proxyTarget", type: "address" },
      { name: "versionHash", type: "bytes32" },
      { name: "data", type: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
