import { parseAbi } from "viem";

// ReserveOptimisticGovernorDeployer 1.1.0 (reserve-governor r1.1.0, contracts/interfaces/IDeployer.sol): the calls a
// new staking vault needs.
export const optimisticGovernorDeployerAbi = parseAbi([
  "struct OptimisticGovernanceParams { uint48 vetoDelay; uint32 vetoPeriod; uint256 vetoThreshold; }",
  "struct StandardGovernanceParams { uint48 votingDelay; uint32 votingPeriod; uint48 voteExtension; uint256 proposalThreshold; uint256 quorumNumerator; }",
  "struct SelectorData { address target; bytes4[] selectors; }",
  "struct BaseDeploymentParams { OptimisticGovernanceParams optimisticParams; StandardGovernanceParams standardParams; SelectorData[] selectorData; address[] optimisticProposers; address[] additionalGuardians; uint256 timelockDelay; uint256 proposalThrottleCapacity; }",
  "struct NewStakingVaultParams { address underlying; address[] rewardTokens; uint256 rewardHalfLife; uint256 unstakingDelay; }",
  "function deployWithNewStakingVault(BaseDeploymentParams baseParams, NewStakingVaultParams newStakingVaultParams, bytes32 deploymentNonce) returns (address stakingVault, address governor, address timelock, address selectorRegistry)",
  "event ReserveOptimisticGovernorSystemDeployed(address indexed stakingVault, address indexed governor, address indexed timelock, address optimisticSelectorRegistry)",
]);
