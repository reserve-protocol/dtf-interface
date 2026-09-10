---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Add cross-DTF governance reads for dashboards and explorers.

- `sdk.index.getProposalFeed`, `getTopVoters`, `getGovernanceActivity`: proposals inside a creation-time window (`since`/`until`, default the last 60 days), most active voters, and a merged event feed (votes, proposal lifecycle, vault deposits/withdrawals) across every Index DTF chain, with derived proposal state and the DTFs each governance controls. Attribution resolves from the DTF side (owner/trading governances, current or legacy, then the vault), so proposals on a governance or vault a DTF has since replaced still name that DTF.
- `sdk.index.getVoteLockTotals`, `getVoteLockLifetimeTotals`: per-vault staked, share supply, pending-unstake locks, and lifetime deposits/withdrawals.
- `sdk.yield.getProposalFeed`, `getTopVoters`, `getGovernanceActivity`, `getProtocolStakingTotals`: the Yield DTF equivalents plus protocol-wide RSR staking totals per chain. Staking rows come from the subgraph's stake and unstake entries, so stRSR transfers never appear as staking.
- React SDK query options and hooks for each read, plus `useIndexDtfVoteLockDaos` for the Reserve API vote-lock DAO rows.
- `SdkErrorCode` gains `LIMIT_EXCEEDED`, thrown when a read-everything subgraph walk passes 10k rows instead of returning a partial total.
- Fix: Index proposal vote weights, quorum, veto thresholds, and vote rows are now formatted with the vote-lock share token's decimals instead of a fixed 18 (`raw` is unchanged; `formatted` changes for six- and eight-decimal vaults).
- `IndexDtfProposalVote.choice` is typed as `IndexDtfVoteChoice` instead of `string`.
- New root exports: `withIndexDtfProposalSummaryState`, `mapYieldDtfProposalSummary`, `withYieldDtfProposalListStates`, `yieldDtfChainIds`.
