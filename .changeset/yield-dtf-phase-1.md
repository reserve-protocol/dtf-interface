---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Full Yield DTF (RToken) domain: reads, issuance, staking, governance, auctions, APY, and proposal building.

`sdk.yield` is now a complete namespace (the NOT_IMPLEMENTED placeholder is gone):

- Core reads: `get`, `list` (with dtf-catalog status/logo), `getContracts`, `getState`, `getPrice` (on-chain via the protocol facade — no Reserve API), `getBasket`, `getHolders`, `getTransactions`, plus `sdk.yield.ref({ address, chainId })`.
- Issuance/staking: facade quotes, `getMaxIssuable`, `getStakingState` (incl. pending unstakings), `getStakeHistory`, and prepare builders for issue/redeem/redeemCustom/stake/unstake/withdraw/cancelUnstake with approval plans.
- Governance: `getGovernance` (quorum/threshold always read on-chain, both Alexios and Anastasius flavors), `getProposals`/`getProposal` (authoritative on-chain state), `getVoterState`, `getProposalVotePower`, and vote/queue/execute/cancel/propose builders — including the guardian timelock cancel path.
- Auctions/revenue: `getRevenue` (canStart reconciled with pending recollateralization, amounts in each token's decimals), `getTrades`, `getDutchAuction`, and run-auctions/rebalance/bid/claim-rewards builders.
- APY: SDK-owned DefiLlama integration (`getCollateralYields`, `COLLATERAL_POOL_MAP`), pure `computeYieldDtfApy`, `getApy`, and realized staking APY from exchange-rate snapshots.
- Proposal builders for every governed parameter (delays, buffers, slippage, ratios, throttles, freezes, auction lengths), roles (`YIELD_DTF_ROLES`), prime basket + refresh, backup config, and revenue distribution; `toYieldDtfProposalPayload` composes them into proposals.
- Shared OZ governor call builders in `lib/governor-calls` (`prepareGovernorVote/Propose/Queue/Execute/Cancel`, `prepareTimelockCancel`, `getGovernorTimelockOperationId`) — the index-dtf governance actions now encode through the same module.
- react-sdk: ~25 `useYieldDtf*` query hooks + call hooks with `dtfQueryKeys.yield.*` and staleTime defaults.
- ABIs exported: facade read/act, rToken, Main, stRSR(+Votes), basket handler, governance (both flavors), broker, distributor, furnace, backing manager, revenue trader, dutch trade.

Breaking: the speculative `YieldDtf`/`YieldDtfListItem` placeholder types are replaced by the real Yield DTF type set.

Validated end-to-end against live eUSD, ETH+ (mainnet), and bsdETH (base): `pnpm --filter @reserve-protocol/sdk validate:yield`.
