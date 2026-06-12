---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Yield DTF (RToken) domain, Phase 1: core reads, issuance, and staking.

`sdk.yield` is now a real namespace (the NOT_IMPLEMENTED placeholder is gone):

- Reads: `get`, `list`, `getContracts`, `getState`, `getPrice` (on-chain via the protocol facade — no Reserve API), `getBasket`, `getHolders`, `getTransactions`, `getIssuanceQuote`, `getRedemptionQuote`, `getMaxIssuable`, `getStakingState`, `getStakeHistory`, plus `sdk.yield.ref({ address, chainId })`.
- Builders: `prepareIssue(+Plan)`, `prepareRedeem`, `prepareRedeemCustom`, `prepareStake(+Plan)`, `prepareUnstake`, `prepareWithdraw`, `prepareCancelUnstake`.
- ABIs exported: `facadeReadAbi`, `facadeActAbi`, `rTokenAbi`, `rTokenMainAbi`, `stRsrAbi`, `stRsrVotesAbi`, `basketHandlerAbi`; facade + RSR addresses for mainnet and Base.
- react-sdk: `useYieldDtf*` hooks (13 query hooks + 5 call hooks) with `dtfQueryKeys.yield.*` and staleTime defaults.
- New Yield DTF subgraph codegen target and types.

Breaking: the speculative `YieldDtf`/`YieldDtfListItem` placeholder types are replaced by the real Yield DTF type set. Governance, auctions, and APY follow in later phases.
