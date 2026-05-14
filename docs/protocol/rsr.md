# RSR

RSR is Reserve Rights, the Reserve ecosystem governance token. Its exact role depends on the product family.

## Addresses

Canonical RSR token addresses used by current Reserve integrations:

| Chain | Chain ID | Address |
| --- | ---: | --- |
| Ethereum | 1 | `0x320623b8e4ff03373931769a31fc52a4e78b5d70` |
| BSC | 56 | `0x23f72a3Db61D6CB8aBE5d9AF1Ac4B6c99327bFee` |
| Base | 8453 | `0xaB36452DbAC151bE02b16Ca17d8919826072f64a` |

Do not use deprecated BSC RSR address `0x8762db106b2c2a0bccb3a80d1ed41273552616e8`.

## RSR In Yield DTFs

In Yield DTFs, RSR is staked as stRSR against a specific Yield DTF.

Main roles:

- Governance power for that Yield DTF.
- Economic backstop/overcollateralization in the Yield protocol model.
- Revenue participation depending on protocol configuration.

stRSR is product-specific. Staking RSR against one Yield DTF does not mean the position governs every Reserve product.

## RSR In Index DTFs

Index DTF governance commonly uses vote-lock vaults. The underlying token of a vote-lock vault is not always RSR.

Main Index-related roles:

- Some vote-lock vaults can use RSR as the underlying token.
- Vote-lock holders can receive rewards from Index DTF fee distributions.
- Some ecosystem-level Index DTF revenue flows can be associated with RSR burn mechanics.

Do not assume an Index DTF's governance token is RSR. Read the staking/vote-lock vault metadata.

## RSR Burns

RSR burn tracking is a specific onchain event/data concern. The Index subgraph tracks transfers to the dead address where configured. A burn is not the same as revenue distribution to vote-lock participants.

When documenting or coding burn behavior:

- Identify which token is burned.
- Identify which contract emits the transfer.
- Identify whether the burn is protocol-level, product-level, or fee-recipient behavior.
- Do not infer burns from fee percentages alone.

## Live Supply

Do not hardcode circulating supply, total supply changes, or market data in SDK docs. Use live token data and market-data sources when a UI needs those values.

## Source References

- `reserve-sdk/packages/sdk/src/constants.ts`
- `protocol-docs-website/protocol_pages/protocol/reserve_rights_rsr.md`
- `protocol-docs-website/protocol_pages/blog/posts/vote-locking-on-reserve.md`
- `protocol-docs-website/protocol_pages/blog/posts/staking-rsr-the-definitive-guide-2024.md`
- `dtf-index-subgraph/src/token/*`

## Do Not Infer

- Do not assume every vote-lock vault uses RSR.
- Do not treat stRSR and Index vote-lock positions as the same mechanism.
- Do not copy live RSR supply numbers into source-of-truth docs.
