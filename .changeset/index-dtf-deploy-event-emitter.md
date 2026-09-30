---
"@reserve-protocol/sdk": minor
---

Index DTF: deploy event extraction only trusts the deployer.

- Breaking: `extractIndexDtfDeployedAddress(logs, target)` takes the deploy target (`{ chainId, version, deployer? }`, the same object the deploy builders take) and only reads `FolioDeployed` / `GovernedFolioDeployed` emitted by that version's deployer. Before, any emitter was accepted, so a basket token could emit a lookalike event during `transferFrom` and the SDK returned the attacker's address.
- Breaking: `extractIndexDtfDeployedStakingTokenAddress(logs, { chainId })` only reads `DeployedGovernedStakingToken` from the chain's `INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS`.
- Both throw `RECORD_NOT_FOUND` without the deployer's event and `INVALID_RESPONSE` when the deployer's events name more than one address.
