# Index DTF Subgraph

The Index DTF subgraph indexes deployment, metadata, governance, transfer, holder, rebalance, auction, and staking/vote-lock history. It is not live protocol truth for everything.

## Use It For

- DTF deployment metadata.
- token metadata and transfer history.
- holder counts and balances.
- role changes.
- governance/proposal/vote history.
- timelock operations.
- optimistic governance metadata.
- rebalance and auction event history.
- staking/vote-lock delegation, rewards, locks, and claims.

## Do Not Use It For

- live basket composition and balances.
- live active rebalance state.
- live proposal state.
- current prices and TVL.
- final executable/expired/defeated/succeeded status without RPC/display derivation.
- complete offchain analytics.

## Main Entities

### `DTF`

Tracks:

- Folio address.
- deployer and proxy admin.
- fees.
- auction delay/length.
- v5/v6 settings such as bids/trusted filler fields where indexed.
- mandate.
- rebalance control.
- roles.
- owner/trading governance links.
- stToken/vote-lock link.
- fee recipients.
- revenue counters.

### `Token`

Tracks:

- token metadata.
- token type.
- total supply.
- minted/burned/transfer counts.
- current/cumulative holders.
- snapshots.

### Governance Entities

`Governance` tracks governor config, timelock, staking token, voting settings, quorum, proposal counters, and optimistic config.

`Proposal` tracks proposal ID, description, payload, state, votes, queue/execute/cancel metadata, timelock operation ID, and optimistic fields.

`Vote` and `Delegate` track voting and delegation history.

### Rebalance And Auction Entities

`Rebalance` tracks nonce, tokens, limits, restricted windows, availability, bids enabled, max auction sizes, and transaction metadata.

`Auction` tracks auction tokens, limits, time window, and bids.

`RebalanceAuctionBid` tracks bidder, optional trusted filler, sell/buy token amounts, and transaction metadata.

### Staking/Vote-Lock Entities

`StakingToken` tracks underlying token, vote token, governance, delegate stats, optimistic delegate stats, and rewards.

Other entities track reward token changes, claims, delegation, locks, and stToken transfers.

## Important IDs

Most IDs are lowercase hex strings or deterministic composite strings.

| Entity | ID Shape |
| --- | --- |
| `DTF` | `{dtfAddress}` |
| `Token` | `{tokenAddress}` |
| `Account` | `{accountAddress}` |
| `AccountBalance` | `{accountAddress}-{tokenAddress}` |
| `Rebalance` | `{dtfAddress}-{nonceHex}` |
| `Auction` | `{dtfAddress}-{auctionId}` |
| `RebalanceAuctionBid` | `{dtfAddress}-{auctionId}-{bidder}-{blockNumber}-{logIndex}` |
| `Proposal` | `{proposalId}` decimal string |
| `Vote` | `{voterAddress}-{proposalId}` |
| `Delegate` | `{stTokenAddress}-{delegateAddress}` |
| `Lock` | `{unstakingManagerAddress}-{lockId}` |
| `RewardClaim` | `{stakingTokenAddress}-{txHash}-{logIndex}` |
| `TimelockOperation` | `{operationId}` |
| `TimelockOperationByTx` | `{txHash}` |

Verify IDs in mappings when adding queries. Schema comments can be stale.

## Proposal State Gotcha

Proposal state is event-driven. The subgraph updates on proposal creation, votes, queue, execution, cancellation, and related events. It does not continuously recompute all time-derived terminal states.

Use RPC or Register-style state derivation when current display state matters.

## Trusted Fill Gotcha

Trusted-fill auction bids can be reconstructed from transaction receipt transfers. This is useful but heuristic and depends on transfer ordering/shape around the Folio.

## Version Gotchas

There are multiple version concepts:

- subgraph schema comment version.
- governance contract `version()`.
- Folio version/deployer version in network config.
- SDK ABI/write version.

Do not conflate them.

## Source References

- `dtf-index-subgraph/schema.graphql`
- `dtf-index-subgraph/subgraph.yaml.mustache`
- `dtf-index-subgraph/networks.json`
- `dtf-index-subgraph/src/deploy/*`
- `dtf-index-subgraph/src/dtf/*`
- `dtf-index-subgraph/src/governance/*`
- `dtf-index-subgraph/src/staking-token/*`
- `dtf-index-subgraph/src/token/*`
- `dtf-index-subgraph/src/account/*`
- `dtf-index-subgraph/src/utils/*`

## Do Not Infer

- Do not trust schema comments over mappings.
- Do not treat a generated single-network manifest as multi-network truth.
- Do not use subgraph proposal state as final current state when RPC is available.
