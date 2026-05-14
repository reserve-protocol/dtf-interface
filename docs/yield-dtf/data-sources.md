# Yield DTF Data Sources

Yield DTF data routing differs from Index DTF data routing.

## Source Rules

| Data | Source |
| --- | --- |
| Current basket/backing | RPC/facade reads |
| Current protocol status | RPC/facade/component reads |
| Discovery | Yield subgraph plus supported-token registry |
| Governance history | Yield subgraph |
| Revenue/staking history | Yield subgraph |
| Live staking balances | RPC |
| Prices | source depends on surface; verify before use |

## Stale Price Warning

Yield subgraph prices can be stale because they update on indexed onchain activity. Do not treat subgraph price fields as fresh market data unless the UI explicitly accepts that freshness model.

## Discovery Warning

Raw Yield subgraph discovery can include unsupported or spam deployments. Product discovery should filter through supported token registries/whitelists.

## SDK Boundary

The current SDK does not implement Yield discovery or detail reads. `sdk.yield.get` and `sdk.yield.list` throw `NOT_IMPLEMENTED`.

Source owner: use `reserve-sdk` and the Yield subgraph as references for future implementation, but verify endpoint and schema details before coding.

## Source References

- `reserve-sdk/docs/yield-dtf-reference.md`
- `reserve-sdk/packages/sdk/src/yield-dtf/fetch-discover.ts`
- `reserve-sdk/packages/sdk/src/yield-dtf/read-config.ts`
- `reserve-sdk/packages/sdk/src/yield-dtf/read-distribution.ts`
- `protocol-docs-website/protocol_pages/protocol/yield_dtfs/*`

## Do Not Infer

- Do not assume Reserve API owns Yield current data the same way it owns Index current data.
- Do not use raw Yield subgraph discovery as product-supported discovery.
