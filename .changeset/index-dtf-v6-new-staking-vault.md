---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Index DTF 6.0.0 deploy: create the governance vault and reject parameters the contracts would revert on.

- New `prepareIndexDtfDeployStakingVault` builds `deployWithNewStakingVault` on the governance deployer 1.1.0 (`INDEX_DTF_OPTIMISTIC_GOVERNOR_DEPLOYER_ADDRESS`), creating an optimistic staking vault (vlX) with its own governor and timelock. `extractIndexDtfDeployedStakingVault` reads the vault and its DAO from that deployer's `ReserveOptimisticGovernorSystemDeployed` event only.
- 6.0.0 deploy builders now reject what the Folio, governor or vault would revert on: zero basket amounts, TVL fee above 10% and mint fee above 5%, veto delay under 1 s and veto period under 5 minutes, veto/proposal threshold and quorum outside (0, 1e18], proposal throttle outside 1–12, the zero selector, a zero `stToken` on governed deploys, and vault reward half-life outside 1 day–2 weeks, unstaking delay over 4 weeks or more than 20 reward tokens. Zero basket amounts are rejected for 5.0.0 too.
