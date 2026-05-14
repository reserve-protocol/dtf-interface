# Yield DTF Governance

Yield DTF governance is tied to RSR staking in the RToken system. It should be documented separately from Index DTF vote-lock governance.

## Model

Staked RSR gives governance power for a specific Yield DTF. Governance can control protocol parameters, basket/collateral behavior, revenue routing, and other Yield DTF settings through the Yield protocol contract system.

## Difference From Index Governance

| Area | Yield DTF | Index DTF |
| --- | --- | --- |
| Governance token | stRSR for that Yield DTF | vote-lock vault token/underlying for that Index DTF |
| Backstop role | yes, RSR staking participates in overcollateralization | not the same mechanism |
| Proposal targets | Yield protocol components | Folio, governors, timelocks, staking vaults |
| Data | Yield subgraph/RPC | Index subgraph/RPC/API |

## SDK Implications

The SDK should avoid one generic governance type that erases product differences. Shared proposal helpers can exist, but product-specific reads and write builders should remain explicit.

## Source References

- `protocol-docs-website/protocol_pages/protocol/yield_dtfs/protocol_operations.md`
- `protocol-docs-website/protocol_pages/protocol/yield_dtfs/smart_contracts.md`
- `reserve-sdk/docs/yield-dtf-reference.md`
- `reserve-sdk/packages/sdk/src/yield-dtf/*`

## Do Not Infer

- Do not treat stRSR delegation as Index optimistic delegation.
- Do not use Index proposal ID assumptions without checking Yield governance data.
