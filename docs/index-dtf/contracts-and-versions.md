# Contracts And Versions

Index DTF contracts are versioned. Source code can be ahead of live deployments, so SDK behavior must encode against the target DTF version.

## Core Contracts

| Contract               | Purpose                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `Folio`                | Main Index DTF ERC20, basket, mint/redeem, fees, rebalances, auctions, roles                     |
| `FolioDeployer`        | Deploys ungoverned and governed Folios                                                           |
| `FolioVersionRegistry` | Tracks registered Folio implementations and latest version                                       |
| `FolioProxy`           | Upgradeable proxy for Folio instances                                                            |
| `FolioProxyAdmin`      | Owns upgrade authority for a Folio proxy                                                         |
| `FolioDAOFeeRegistry`  | DAO/platform fee recipient, fee numerator, fee floor, per-Folio overrides                        |
| `FolioGovernor`        | Governor wrapper for governed deployments                                                        |
| Staking vault          | Vote-lock vault used by governed deployments; implementation comes from Reserve governor package |

## Folio Responsibilities

`Folio` owns:

- ERC20 share token behavior.
- Basket asset set and balances.
- `mint(shares, receiver, minSharesOut)`.
- `redeem(shares, receiver, assets, minAmountsOut)`.
- TVL fee, mint fee, fee recipients, pending fee shares.
- Rebalance state.
- Auction opening and bidding.
- Trusted filler integration.
- Role-based permissions.
- Deprecation and settings.

## Roles

| Role                 | Meaning                                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `DEFAULT_ADMIN_ROLE` | Broad Folio admin. Can update settings, fees, roles, allowlists, deprecate, and own proxy admin flow through governed deployment. |
| `REBALANCE_MANAGER`  | Can start rebalances. Usually the trading/basket governance timelock.                                                             |
| `AUCTION_LAUNCHER`   | Can open restricted-window auctions and close/end through privileged checks. Usually semi-trusted launchers.                      |
| `BRAND_MANAGER`      | Offchain/product role. Used by Register/brand metadata flows, not core onchain basket control.                                    |

Register may label roles differently. Encode the contract role, not the UI label.

## Version History

Only include version deltas verified from source, changelogs, or SDK ABIs. Older public docs and local contract source may not describe every deployed SDK target.

| Version | Important Deltas                                                                                                                         |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `1.0.0` | Initial release.                                                                                                                         |
| `2.0.0` | Repeatable auctions, dust limits, minimum mint output.                                                                                   |
| `3.0.0` | Skipped/deprecated path around individual repeatable auctions against target weights.                                                    |
| `4.0.0` | Trusted fillers, rebalance targets, auction overhaul, daily fee accounting, `AUCTION_APPROVER` replaced by `REBALANCE_MANAGER`.          |
| `5.0.0` | SDK-supported write ABI for current deployed Index DTF settings and rebalance proposal flows.                                            |
| `6.0.0` | SDK-supported write ABI with v6-specific settings names such as `setMaxAuctionLength`; verify function support from ABI before encoding. |

## SDK Version Handling

The SDK handles version-specific write calls where the affected builder encodes the calldata. Example:

- v5 auction length setter: `setAuctionLength`.
- v6 auction length setter: `setMaxAuctionLength`.

Product builders should accept a known DTF version or fetch it when needed. Keep version checks local to the affected write/read handler instead of adding a central operation registry.

Current rebalance/open-auction and issuance helpers are v5-shaped unless the builder explicitly accepts a version. Do not assume every write helper supports every listed version.

Source owner: SDK calldata builders are owned by `dtf-sdk/packages/sdk/src/index-dtf/governance/propose/calls.ts`; protocol mechanics are owned by the Index DTF contract repo.

## ABI Gotchas

- `startRebalance` signatures changed across versions.
- `openAuction` signatures changed across versions.
- `bid` signatures changed across versions.
- v5 and v6 settings may share product intent but use different function names.
- Local source contracts may be newer than deployed contracts.

Before adding a write builder, verify:

- Target DTF version.
- ABI item and function name.
- Argument order and units.
- Whether the function is admin, rebalance manager, launcher, or public.

## Source References

- `reserve-index-dtf/contracts/Folio.sol`
- `reserve-index-dtf/contracts/interfaces/IFolio.sol`
- `reserve-index-dtf/contracts/utils/Constants.sol`
- `reserve-index-dtf/contracts/deployer/FolioDeployer.sol`
- `reserve-index-dtf/contracts/folio/FolioVersionRegistry.sol`
- `reserve-index-dtf/contracts/folio/FolioProxy.sol`
- `reserve-index-dtf/contracts/folio/FolioDAOFeeRegistry.sol`
- `reserve-index-dtf/contracts/governance/FolioGovernor.sol`
- `reserve-index-dtf/contracts/utils/Versioned.sol`
- `reserve-index-dtf/CHANGELOG.md`
- `dtf-sdk/packages/sdk/src/index-dtf/governance/propose/calls.ts`

## Do Not Infer

- Do not use a function signature from old docs without ABI verification.
- Do not assume the newest source version is the deployed version for every DTF.
- Do not assume Register only needs one ABI forever; product can include multiple deployed versions.
