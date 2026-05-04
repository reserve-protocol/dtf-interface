const dtfIndexCommonProposalAbi = [
  {
    type: "function",
    name: "addToBasket",
    inputs: [{ name: "erc20", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "grantRole",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeFromBasket",
    inputs: [{ name: "token", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeRole",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAuctionDelay",
    inputs: [{ name: "_newDelay", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAuctionLength",
    inputs: [{ name: "_newLength", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setFeeRecipients",
    inputs: [
      {
        name: "_newRecipients",
        type: "tuple[]",
        components: [
          { name: "recipient", type: "address" },
          { name: "portion", type: "uint96" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMandate",
    inputs: [{ name: "_newMandate", type: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMintFee",
    inputs: [{ name: "_newFee", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTVLFee",
    inputs: [{ name: "_newFee", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const dtfIndexProposalAbiV1 = [
  ...dtfIndexCommonProposalAbi,
  {
    type: "function",
    name: "approveAuction",
    inputs: [
      { name: "sell", type: "address" },
      { name: "buy", type: "address" },
      {
        name: "sellLimit",
        type: "tuple",
        components: [
          { name: "spot", type: "uint256" },
          { name: "low", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      {
        name: "buyLimit",
        type: "tuple",
        components: [
          { name: "spot", type: "uint256" },
          { name: "low", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      {
        name: "prices",
        type: "tuple",
        components: [
          { name: "start", type: "uint256" },
          { name: "end", type: "uint256" },
        ],
      },
      { name: "ttl", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approveAuction",
    inputs: [
      { name: "sell", type: "address" },
      { name: "buy", type: "address" },
      {
        name: "sellLimit",
        type: "tuple",
        components: [
          { name: "spot", type: "uint256" },
          { name: "low", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      {
        name: "buyLimit",
        type: "tuple",
        components: [
          { name: "spot", type: "uint256" },
          { name: "low", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      {
        name: "prices",
        type: "tuple",
        components: [
          { name: "start", type: "uint256" },
          { name: "end", type: "uint256" },
        ],
      },
      { name: "ttl", type: "uint256" },
      { name: "runs", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "startRebalance",
    inputs: [
      { name: "tokens", type: "address[]" },
      {
        name: "weights",
        type: "tuple[]",
        components: [
          { name: "low", type: "uint256" },
          { name: "spot", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      {
        name: "prices",
        type: "tuple[]",
        components: [
          { name: "low", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      {
        name: "limits",
        type: "tuple",
        components: [
          { name: "low", type: "uint256" },
          { name: "spot", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      { name: "auctionLauncherWindow", type: "uint256" },
      { name: "ttl", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const dtfIndexProposalAbiV2 = [
  ...dtfIndexCommonProposalAbi,
  {
    type: "function",
    name: "approveAuction",
    inputs: [
      { name: "sell", type: "address" },
      { name: "buy", type: "address" },
      {
        name: "sellLimit",
        type: "tuple",
        components: [
          { name: "spot", type: "uint256" },
          { name: "low", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      {
        name: "buyLimit",
        type: "tuple",
        components: [
          { name: "spot", type: "uint256" },
          { name: "low", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      {
        name: "prices",
        type: "tuple",
        components: [
          { name: "start", type: "uint256" },
          { name: "end", type: "uint256" },
        ],
      },
      { name: "ttl", type: "uint256" },
      { name: "runs", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setDustAmount",
    inputs: [
      { name: "erc20", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const dtfIndexProposalAbiV4 = [
  ...dtfIndexCommonProposalAbi,
  {
    type: "function",
    name: "setRebalanceControl",
    inputs: [
      {
        name: "_rebalanceControl",
        type: "tuple",
        components: [
          { name: "weightControl", type: "bool" },
          { name: "priceControl", type: "uint8" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTrustedFillerRegistry",
    inputs: [
      { name: "_newFillerRegistry", type: "address" },
      { name: "_enabled", type: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "startRebalance",
    inputs: [
      { name: "tokens", type: "address[]" },
      {
        name: "weights",
        type: "tuple[]",
        components: [
          { name: "low", type: "uint256" },
          { name: "spot", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      {
        name: "prices",
        type: "tuple[]",
        components: [
          { name: "low", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      {
        name: "limits",
        type: "tuple",
        components: [
          { name: "low", type: "uint256" },
          { name: "spot", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      { name: "auctionLauncherWindow", type: "uint256" },
      { name: "ttl", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const dtfIndexProposalAbiV5 = [
  ...dtfIndexProposalAbiV4,
  {
    type: "function",
    name: "setBidsEnabled",
    inputs: [{ name: "_bidsEnabled", type: "bool" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setName",
    inputs: [{ name: "_newName", type: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "startRebalance",
    inputs: [
      {
        name: "tokens",
        type: "tuple[]",
        components: [
          { name: "token", type: "address" },
          {
            name: "weight",
            type: "tuple",
            components: [
              { name: "low", type: "uint256" },
              { name: "spot", type: "uint256" },
              { name: "high", type: "uint256" },
            ],
          },
          {
            name: "price",
            type: "tuple",
            components: [
              { name: "low", type: "uint256" },
              { name: "high", type: "uint256" },
            ],
          },
          { name: "maxAuctionSize", type: "uint256" },
          { name: "inRebalance", type: "bool" },
        ],
      },
      {
        name: "limits",
        type: "tuple",
        components: [
          { name: "low", type: "uint256" },
          { name: "spot", type: "uint256" },
          { name: "high", type: "uint256" },
        ],
      },
      { name: "auctionLauncherWindow", type: "uint256" },
      { name: "ttl", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
