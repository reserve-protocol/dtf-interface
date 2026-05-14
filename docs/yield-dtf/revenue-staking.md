# Yield DTF Revenue And Staking

Yield DTF revenue and staking are centered on RSR staking and protocol revenue distribution.

## Revenue Routing

Yield DTF collateral can generate revenue. Protocol configuration determines how that revenue is distributed between token holders, stakers, and other configured destinations.

Important components can include:

- Distributor.
- Furnace.
- Backing manager.
- StRSR staking.

Revenue behavior should be read from Yield protocol contracts and verified against the Yield subgraph for historical views.

## stRSR

RSR staked against a Yield DTF becomes stRSR for that DTF.

stRSR roles:

- governance power.
- revenue participation depending on configuration.
- economic backstop/overcollateralization in the Yield DTF system.

stRSR is not the same as Index DTF vote-lock vault shares.

## Data Sources

- RPC/facade reads for current staking and revenue state.
- Yield subgraph for historical distribution, staking, and governance data.
- Supported-token registry/whitelist for product discovery.

## Source References

- `protocol-docs-website/protocol_pages/protocol/yield_dtfs/overview.md`
- `protocol-docs-website/protocol_pages/protocol/yield_dtfs/protocol_operations.md`
- `protocol-docs-website/protocol_pages/protocol/reserve_rights_rsr.md`
- `reserve-sdk/docs/yield-dtf-reference.md`
- `reserve-sdk/packages/sdk/src/yield-dtf/read-distribution.ts`

## Do Not Infer

- Do not apply Index DTF vote-lock reward assumptions to stRSR.
- Do not display stale revenue USD fields without verifying source freshness.
