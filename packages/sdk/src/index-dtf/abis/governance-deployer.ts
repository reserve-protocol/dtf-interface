export const indexDtfGovernanceDeployerAbi = [
  {
    type: "function",
    name: "deployGovernanceWithTimelock",
    inputs: [
      {
        name: "govParams",
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
      { name: "stToken", type: "address" },
      { name: "deploymentNonce", type: "bytes32" },
    ],
    outputs: [
      { name: "governor", type: "address" },
      { name: "timelock", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deployGovernedStakingToken",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "underlying", type: "address" },
      {
        name: "govParams",
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
      { name: "deploymentNonce", type: "bytes32" },
    ],
    outputs: [
      { name: "stToken", type: "address" },
      { name: "governor", type: "address" },
      { name: "timelock", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "DeployedGovernance",
    inputs: [
      { name: "stToken", type: "address", indexed: true },
      { name: "governor", type: "address", indexed: false },
      { name: "timelock", type: "address", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DeployedGovernedStakingToken",
    inputs: [
      { name: "underlying", type: "address", indexed: true },
      { name: "stToken", type: "address", indexed: true },
      { name: "governor", type: "address", indexed: false },
      { name: "timelock", type: "address", indexed: false },
    ],
    anonymous: false,
  },
] as const;
