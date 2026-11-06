---
"@reserve-protocol/sdk": patch
---

Index DTF governance amounts now use the decimals of the vote token. Before, the SDK formatted them with 18 decimals, so a DAO with a 6-decimal vote token (for example a vote-lock vault on USDC) showed a quorum of 0.00000000000003 instead of 0.03. Raw values did not change.

- Proposals, proposal lists and voting snapshots get a `voteTokenDecimals` field from the subgraph. `getProposalState` uses it for the threshold amounts and uses 18 when it is missing.
- `getVoterState`, `getProposalVoterState`, `getOptimisticProposalVoterState`, `getOptimisticVotes`, `getPastOptimisticVotes` and `getOptimisticProposalContext` read `decimals()` in the same multicall as their other reads.
- `getDelegates` reads the vote token decimals from the subgraph.
- The vote-lock state formats `optimisticVotingPower` with the vault decimals.
- `getProposalVotes`, `getProposerState` and `getOptimisticProposalContext` accept an optional `voteTokenDecimals`. Without it, `getProposalVotes` and `getProposerState` with a `timepoint` make one more `decimals()` call.
