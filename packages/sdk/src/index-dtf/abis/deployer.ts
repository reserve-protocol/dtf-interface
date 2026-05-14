export const indexDtfDeployerAbi = [
  {
    type: "function",
    name: "deployFolio",
    inputs: [
      {
        name: "basicDetails",
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "assets", type: "address[]" },
          { name: "amounts", type: "uint256[]" },
          { name: "initialShares", type: "uint256" },
        ],
      },
      {
        name: "additionalDetails",
        type: "tuple",
        components: [
          { name: "auctionLength", type: "uint256" },
          {
            name: "feeRecipients",
            type: "tuple[]",
            components: [
              { name: "recipient", type: "address" },
              { name: "portion", type: "uint96" },
            ],
          },
          { name: "tvlFee", type: "uint256" },
          { name: "mintFee", type: "uint256" },
          { name: "mandate", type: "string" },
        ],
      },
      {
        name: "folioFlags",
        type: "tuple",
        components: [
          { name: "trustedFillerEnabled", type: "bool" },
          {
            name: "rebalanceControl",
            type: "tuple",
            components: [
              { name: "weightControl", type: "bool" },
              { name: "priceControl", type: "uint8" },
            ],
          },
          { name: "bidsEnabled", type: "bool" },
        ],
      },
      { name: "owner", type: "address" },
      { name: "basketManagers", type: "address[]" },
      { name: "auctionLaunchers", type: "address[]" },
      { name: "brandManagers", type: "address[]" },
      { name: "deploymentNonce", type: "bytes32" },
    ],
    outputs: [
      { name: "folio", type: "address" },
      { name: "proxyAdmin", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deployGovernedFolio",
    inputs: [
      { name: "stToken", type: "address" },
      {
        name: "basicDetails",
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "assets", type: "address[]" },
          { name: "amounts", type: "uint256[]" },
          { name: "initialShares", type: "uint256" },
        ],
      },
      {
        name: "additionalDetails",
        type: "tuple",
        components: [
          { name: "auctionLength", type: "uint256" },
          {
            name: "feeRecipients",
            type: "tuple[]",
            components: [
              { name: "recipient", type: "address" },
              { name: "portion", type: "uint96" },
            ],
          },
          { name: "tvlFee", type: "uint256" },
          { name: "mintFee", type: "uint256" },
          { name: "mandate", type: "string" },
        ],
      },
      {
        name: "folioFlags",
        type: "tuple",
        components: [
          { name: "trustedFillerEnabled", type: "bool" },
          {
            name: "rebalanceControl",
            type: "tuple",
            components: [
              { name: "weightControl", type: "bool" },
              { name: "priceControl", type: "uint8" },
            ],
          },
          { name: "bidsEnabled", type: "bool" },
        ],
      },
      {
        name: "ownerGovParams",
        type: "tuple",
        components: [
          { name: "votingDelay", type: "uint48" },
          { name: "votingPeriod", type: "uint32" },
          { name: "proposalThreshold", type: "uint256" },
          { name: "quorumThreshold", type: "uint256" },
          { name: "timelockDelay", type: "uint256" },
          { name: "guardians", type: "address[]" },
        ],
      },
      {
        name: "tradingGovParams",
        type: "tuple",
        components: [
          { name: "votingDelay", type: "uint48" },
          { name: "votingPeriod", type: "uint32" },
          { name: "proposalThreshold", type: "uint256" },
          { name: "quorumThreshold", type: "uint256" },
          { name: "timelockDelay", type: "uint256" },
          { name: "guardians", type: "address[]" },
        ],
      },
      {
        name: "govRoles",
        type: "tuple",
        components: [
          { name: "existingBasketManagers", type: "address[]" },
          { name: "auctionLaunchers", type: "address[]" },
          { name: "brandManagers", type: "address[]" },
        ],
      },
      { name: "deploymentNonce", type: "bytes32" },
    ],
    outputs: [
      { name: "folio", type: "address" },
      { name: "proxyAdmin", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "FolioDeployed",
    inputs: [
      { name: "folioOwner", type: "address", indexed: true },
      { name: "folio", type: "address", indexed: true },
      { name: "folioAdmin", type: "address", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GovernedFolioDeployed",
    inputs: [
      { name: "stToken", type: "address", indexed: true },
      { name: "folio", type: "address", indexed: true },
      { name: "ownerGovernor", type: "address", indexed: false },
      { name: "ownerTimelock", type: "address", indexed: false },
      { name: "tradingGovernor", type: "address", indexed: false },
      { name: "tradingTimelock", type: "address", indexed: false },
    ],
    anonymous: false,
  },
] as const;
