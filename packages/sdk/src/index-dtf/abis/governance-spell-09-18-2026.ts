/** `GovernanceSpell_09_18_2026`: legacy Folio → optimistic governance 1.1.0 migration and old staking vault retirement. */
export const governanceSpell09182026Abi = [
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
  {
    type: "function",
    name: "retireOldStakingVault",
    inputs: [{ name: "oldStakingVault", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

/** OpenZeppelin `Ownable.transferOwnership`, for owned contracts outside the DTF's own map (e.g. a retiring staking vault). */
export const ownableTransferOwnershipAbi = [
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

/** Deployed `GovernanceSpell_09_18_2026` per chain. */
export const INDEX_DTF_GOVERNANCE_SPELL_09_18_2026_ADDRESS = {
  1: "0x11B1bF67F0c6495E1F2d34cDe0296A02C2540926",
  8453: "0x5771d976696AA180Fed276FB6571fE2f41D0b849",
  56: "0x60C384e226b120d93f3e0F4C502957b2B9C32B15",
} as const;
