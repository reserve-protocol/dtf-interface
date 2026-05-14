# Reserve Protocol Overview

Reserve is a protocol and product ecosystem for asset-backed onchain tokens called DTFs: Decentralized Token Folios.

There are two product families:

| Product | Legacy Name | Core Mechanism | Current Product Priority |
| --- | --- | --- | --- |
| Index DTF | Folio | Onchain index fund with governance-directed rebalances and auctions | Primary |
| Yield DTF | RToken | Collateral-backed yield token with revenue distribution and RSR staking | Legacy/support |

## Index DTFs

Index DTFs are ERC20 tokens backed by a basket of ERC20 assets. Users can mint by providing the basket proportionally or redeem by burning shares for proportional basket assets. Governance changes the target basket, and the protocol runs Dutch auctions to move the actual basket toward the target.

The core contract implementation is Folio.

Main properties:

- Basket assets and balances are onchain.
- Rebalances are governance initiated.
- Auctions execute trades between basket assets.
- Minting and redeeming are direct onchain actions.
- Vote-lock vaults provide governance power and reward distribution for many governed deployments.
- Current price, discovery, and analytics are served by Reserve API.
- Governance metadata and historical events are indexed by the Index subgraph.

Index DTF lifecycle:

```text
DEPLOY -> MINT/REDEEM -> PROPOSE REBALANCE -> VOTE -> QUEUE -> EXECUTE
-> LAUNCHER WINDOW -> COMMUNITY WINDOW -> AUCTION -> BID -> REPEAT/EXPIRE
```

## Yield DTFs

Yield DTFs are the older Reserve product line. They are collateral-backed tokens with protocol-managed baskets, revenue distribution, and RSR staking.

Main properties:

- Basket and backing state are protocol-controlled through Yield DTF contracts.
- Users issue and redeem against collateral backing.
- Revenue from collateral yield is routed through protocol components.
- RSR stakers provide governance and overcollateralization.
- Data is primarily subgraph and RPC sourced.

Yield DTFs are still important protocol context, but Index DTFs are the primary product scope for current SDK work.

## Supported Chains

Current product scope:

| Product | Chains |
| --- | --- |
| Index DTF | Ethereum, Base, BSC |
| Yield DTF | Ethereum, Base |

Legacy code and older docs can mention Arbitrum. Do not treat legacy frontend constants as product support.

## Protocol Data Model

Reserve data intentionally comes from multiple sources:

- RPC owns live onchain state.
- Reserve API owns current prices, discovery, analytics, and some aggregate product data.
- Subgraphs own historical/indexed metadata and events.
- Register source owns product UI decisions and user-facing defaults.

The SDK should not collapse these into one generic source abstraction. Keeping source boundaries explicit prevents stale or imprecise data from looking authoritative.

## Source References

- `reserve-index-dtf/contracts/Folio.sol`
- `reserve-index-dtf/README.md`
- `register/src/views/index-dtf/index-dtf-container.tsx`
- `register/docs/data-sources.md`
- `dtf-index-subgraph/schema.graphql`
- `protocol-docs-website/protocol_pages/protocol/index_dtfs/*`
- `protocol-docs-website/protocol_pages/protocol/yield_dtfs/*`

## Do Not Infer

- Do not infer live Index DTF basket state from the subgraph.
- Do not infer active product chain support from old public docs.
- Do not treat Yield DTF behavior as Index DTF behavior or the reverse.
- Do not assume all Index DTF vote-lock vaults use RSR as the underlying token.
