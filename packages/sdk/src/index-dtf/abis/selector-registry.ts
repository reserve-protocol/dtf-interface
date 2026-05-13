export const selectorRegistryAbi = [
  {
    type: "function",
    name: "governor",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isAllowed",
    inputs: [
      { name: "target", type: "address", internalType: "address" },
      { name: "selector", type: "bytes4", internalType: "bytes4" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "registerSelectors",
    inputs: [
      {
        name: "selectorData",
        type: "tuple[]",
        internalType: "struct IOptimisticSelectorRegistry.SelectorData[]",
        components: [
          { name: "target", type: "address", internalType: "address" },
          { name: "selectors", type: "bytes4[]", internalType: "bytes4[]" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "selectorsAllowed",
    inputs: [{ name: "target", type: "address", internalType: "address" }],
    outputs: [
      { name: "allowedSelectors4", type: "bytes4[]", internalType: "bytes4[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "targets",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "unregisterSelectors",
    inputs: [
      {
        name: "selectorData",
        type: "tuple[]",
        internalType: "struct IOptimisticSelectorRegistry.SelectorData[]",
        components: [
          { name: "target", type: "address", internalType: "address" },
          { name: "selectors", type: "bytes4[]", internalType: "bytes4[]" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
