# Deployment

Index DTF deployment has three distinct concerns:

- Protocol deployment contracts.
- Register product defaults and validation.
- SDK call builders that prepare transactions but do not send them.

Keep these separate in code and docs.

## Ungoverned Folio Deployment

`FolioDeployer.deployFolio(...)` deploys a Folio with a direct owner.

High-level flow:

1. Deploy proxy admin and proxy using a deployment nonce/salt.
2. Transfer initial basket assets from deployer to the new Folio.
3. Initialize Folio with basic details, additional details, flags, and initial shares.
4. Grant admin to the owner.
5. Grant `REBALANCE_MANAGER` to basket managers.
6. Grant `AUCTION_LAUNCHER` to auction launchers.
7. Grant `BRAND_MANAGER` to brand managers.
8. Renounce deployer admin if owner is not deployer.

The deploy caller must approve each initial basket asset to the Folio deployer before deployment.

## Governed Folio Deployment

`FolioDeployer.deployGovernedFolio(...)` deploys a Folio and wires governance around it.

High-level flow:

1. Deploy raw Folio with deployer as temporary owner.
2. Deploy or attach vote-lock/governance infrastructure.
3. Configure owner/admin governance.
4. Configure trading/basket governance.
5. Transfer Folio admin and proxy admin ownership to the appropriate timelock.
6. Grant rebalance and launcher roles according to parameters.

If no existing basket managers are provided, trading timelock typically receives `REBALANCE_MANAGER`.

## Staking Token / Vote-Lock Deployment

Governed deployments can deploy a governed staking token/vote-lock vault. In the Index product, this vault is used for governance and reward distribution.

Important parameters:

- name and symbol.
- underlying token.
- voting delay and voting period.
- proposal threshold.
- quorum threshold.
- timelock delay.
- guardians.

The underlying token is not always RSR.

## Register Product Defaults

Register permissionless deploy defaults are product choices, not protocol requirements.

Current product behavior includes:

- default chain is Base in permissionless deploy.
- governance option forced to an existing vote-lock in that flow.
- basket input forced to share mode.
- connected wallet injected as brand manager, guardian, and auction launcher.
- auction length defaults to 30 minutes.
- weight control enabled by default.
- bids enabled by default.
- platform/governance/deployer fee shares are recalculated when chain changes.

Verify defaults in Register source before copying them into SDK defaults.

## Revenue Distribution At Deploy

Register-style deploy revenue distribution:

1. Platform fee is removed first.
2. Remaining shares are split among governance, deployer, and additional recipients.
3. Recipients with zero share are filtered after validation.
4. Recipients are sorted by address.
5. Last recipient is adjusted so portions sum exactly to `1e18`.

The SDK should use the same deterministic recipient math for deploy and settings proposals.

Source owner: deploy transaction shape is owned by `reserve-index-dtf/contracts/deployer/FolioDeployer.sol`; product defaults and validation are owned by Register.

## SDK Deploy Builders

The SDK prepares transaction objects:

- ungoverned deploy call.
- governed deploy call.
- governed staking-token deploy call.
- asset approval calls.
- deploy plans that combine approvals and deploy call.
- event helpers to extract deployed Folio and staking-token addresses.

The SDK does not own wallet connection, chain switching, transaction sending, toasts, or post-transaction UI refreshes.

## Zapper Deploy Boundary

Register has a simple deploy path that uses the Zapper API to return a transaction payload. That is not the same as the direct deploy builder path.

Core SDK deploy builders should cover direct protocol deploy calls. Zapper deploy work belongs in `docs/plans/zapper-integration.md` until there is a product consumer that needs it in the SDK.

## Source References

- `reserve-index-dtf/contracts/deployer/FolioDeployer.sol`
- `reserve-index-dtf/script/Deploy.s.sol`
- `register/src/views/index-dtf/deploy/*`
- `register/src/views/index-dtf/deploy/permissionless-defaults.ts`
- `register/src/views/index-dtf/deploy/utils/index.ts`
- `dtf-sdk/packages/sdk/src/index-dtf/deploy/index.ts`

## Do Not Infer

- Do not assume Zapper deploy and direct deploy have the same API shape.
- Do not add wallet sending into core SDK deploy builders.
- Do not assume deployment addresses from old docs without source/config verification.
