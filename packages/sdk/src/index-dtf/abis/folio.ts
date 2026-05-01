export const folioAbi = [
  {
    type: "function",
    name: "toAssets",
    inputs: [
      { name: "shares", type: "uint256" },
      { name: "rounding", type: "uint8" },
    ],
    outputs: [
      { name: "_assets", type: "address[]" },
      { name: "_amounts", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalAssets",
    inputs: [],
    outputs: [
      { name: "_assets", type: "address[]" },
      { name: "_amounts", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
] as const;
