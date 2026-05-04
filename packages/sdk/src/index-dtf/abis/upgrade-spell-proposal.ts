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
] as const;
