# Yield DTF Overview

Yield DTFs are the legacy Reserve product line, historically called RTokens. They are collateral-backed tokens designed to hold productive collateral and distribute revenue through the Reserve protocol system.

## How Yield DTFs Differ From Index DTFs

| Area | Yield DTF | Index DTF |
| --- | --- | --- |
| Legacy name | RToken | Folio |
| Backing model | Collateral basket managed by protocol components | Basket of ERC20s held directly by Folio |
| Rebalancing | Protocol-managed through backing/collateral mechanisms | Governance starts rebalances and auctions |
| Staking | RSR staked as stRSR | vote-lock vault can use different underlying tokens |
| Data source | Subgraph + RPC | RPC + Reserve API + Index subgraph |
| Product priority | Legacy/support | Primary current product |

## Core Components

Yield DTFs involve more protocol components than Index DTFs. Common concepts include:

- RToken.
- Main contract.
- Backing manager.
- Basket handler.
- Asset registry.
- Distributor.
- Furnace.
- StRSR staking.
- Trading/auction components.

Do not assume a Folio-style direct basket contract when working with Yield DTFs.

## Data Model

Yield DTF basket/backing state is live protocol state. Prefer RPC/facade reads for current state and the Yield subgraph for historical/config data.

Unlike Index DTFs, Yield DTFs do not rely on Reserve API as the default source for current price/discovery surfaces in the same way.

## Source References

- `protocol-docs-website/protocol_pages/protocol/yield_dtfs/*`
- `reserve-sdk/docs/yield-dtf-reference.md`
- `reserve-sdk/packages/sdk/src/yield-dtf/*`
- `reserve-sdk/packages/sdk/src/constants.ts`

## Do Not Infer

- Do not treat Yield DTF `RToken` behavior as Index DTF Folio behavior.
- Do not use Index DTF Reserve API assumptions for Yield DTF data.
- Do not assume Arbitrum is current product scope because old docs mention it.
