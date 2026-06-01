export const upgradeSpellProposalAbi = [
  {
    type: "function",
    name: "cast",
    inputs: [
      { name: "folio", type: "address" },
      { name: "proxyAdmin", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeFolioGovernance",
    inputs: [
      { name: "folio", type: "address" },
      { name: "proxyAdmin", type: "address" },
      { name: "oldOwnerGovernor", type: "address" },
      { name: "oldTradingGovernor", type: "address" },
      { name: "ownerGuardians", type: "address[]" },
      { name: "tradingGuardians", type: "address[]" },
      { name: "deploymentNonce", type: "bytes32" },
    ],
    outputs: [
      { name: "newOwnerGovernor", type: "address" },
      { name: "newTradingGovernor", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeStakingVaultGovernance",
    inputs: [
      { name: "stakingVault", type: "address" },
      { name: "oldGovernor", type: "address" },
      { name: "guardians", type: "address[]" },
      { name: "deploymentNonce", type: "bytes32" },
    ],
    outputs: [{ name: "newGovernor", type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeFolio",
    inputs: [
      { name: "folio", type: "address" },
      { name: "folioProxyAdmin", type: "address" },
      { name: "newStakingVault", type: "address" },
      { name: "oldFolioGovernor", type: "address" },
      { name: "tradingGovernor", type: "address" },
      {
        name: "optimisticParams",
        type: "tuple",
        components: [
          { name: "vetoDelay", type: "uint48" },
          { name: "vetoPeriod", type: "uint32" },
          { name: "vetoThreshold", type: "uint256" },
        ],
      },
      { name: "optimisticProposers", type: "address[]" },
      { name: "guardians", type: "address[]" },
      { name: "newFeeRecipient", type: "address" },
      { name: "deploymentNonce", type: "bytes32" },
    ],
    outputs: [
      {
        name: "newDeployment",
        type: "tuple",
        components: [
          { name: "stakingVault", type: "address" },
          { name: "newGovernor", type: "address" },
          { name: "newTimelock", type: "address" },
          { name: "newSelectorRegistry", type: "address" },
        ],
      },
    ],
    stateMutability: "nonpayable",
  },
] as const;
