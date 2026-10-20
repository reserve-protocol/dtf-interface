# @reserve-protocol/react-sdk

## 0.7.0

### Minor Changes

- 8f12b39: Index DTF: deploy event extraction only trusts the deployer.

  - Breaking: `extractIndexDtfDeployedAddress(logs, target)` takes the deploy target (`{ chainId, version, deployer? }`, the same object the deploy builders take) and only reads `FolioDeployed` / `GovernedFolioDeployed` emitted by that version's deployer. Before, any emitter was accepted, so a basket token could emit a lookalike event during `transferFrom` and the SDK returned the attacker's address.
  - Breaking: `extractIndexDtfDeployedStakingTokenAddress(logs, { chainId })` only reads `DeployedGovernedStakingToken` from the chain's `INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS`.
  - Both throw `RECORD_NOT_FOUND` without the deployer's event and `INVALID_RESPONSE` when the deployer's events name more than one address.

- d26bccf: Index DTF: Folio 6.0 ABIs re-synced to the deployed 6.0.0 (`reserve-index-dtf@7d97c80`, identical to the explorer-verified implementation on mainnet, Base and BSC).

  - Breaking for 6.0.0: `prepareIndexDtfEndRebalance` / `ref.prepareEndRebalance` require `rebalanceNonce` and encode `endRebalance(uint256)`; the previous nonce-less call reverted on every real 6.0.0 Folio. 5.0.0 still encodes `endRebalance()`. New `PrepareIndexDtfEndRebalanceParams` type.
  - `folioV6Abi` / `folioArtifactAbi` now carry `endRebalance(uint256 rebalanceNonce)`. A unit test compares the generated Folio and FolioDeployer ABIs item for item with the Base Blockscout verified ABIs, so drift from the deployed contracts fails CI.

- 041b6fb: Index DTF 6.0.0 deploy: create the governance vault and reject parameters the contracts would revert on.

  - New `prepareIndexDtfDeployStakingVault` builds `deployWithNewStakingVault` on the governance deployer 1.1.0 (`INDEX_DTF_OPTIMISTIC_GOVERNOR_DEPLOYER_ADDRESS`), creating an optimistic staking vault (vlX) with its own governor and timelock. `extractIndexDtfDeployedStakingVault` reads the vault and its DAO from that deployer's `ReserveOptimisticGovernorSystemDeployed` event only.
  - 6.0.0 deploy builders now reject what the Folio, governor or vault would revert on: zero basket amounts, TVL fee above 10% and mint fee above 5%, veto delay under 1 s and veto period under 5 minutes, veto/proposal threshold and quorum outside (0, 1e18], proposal throttle outside 1–12, the zero selector, a zero `stToken` on governed deploys, and vault reward half-life outside 1 day–2 weeks, unstaking delay over 4 weeks or more than 20 reward tokens. Zero basket amounts are rejected for 5.0.0 too.

- 5f53142: Index DTF: Folio 6.0 state reads and the version registry.

  - `getIndexDtfSelfFee`, `getIndexDtfImmutableFeeRecipients` (the full table `setFeeRecipients` must receive back), `getIndexDtfTradeAllowlist` (`{ enabled, tokens }`) and `getIndexDtfIsTokenAllowlisted` read the v6 contract from RPC at one pinned block; on a v5 proxy they throw (the immutable-table read probes `folioFeeForSelf` first instead of reporting an empty table). Exposed as `sdk.index.get*`, on the DTF ref, and as `useIndexDtf*` hooks.
  - `getIndexDtfLatestVersion` and `getIndexDtfVersionDeployment` read `FolioVersionRegistry` (`INDEX_DTF_VERSION_REGISTRY_ADDRESS` per chain, overridable with `registry`); `getIndexDtfVersionHash` mirrors the registry's `keccak256(abi.encodePacked(version))`. Hooks sit at the static cache tier.

- 30f2e02: Index DTF: Folio 6.0 fields from the subgraph.

  - `IndexDtf` gains `version`, `rebalance.maxAuctionLength`, `rebalance.tradeAllowlist`, `fees.immutableRecipients`, `fees.selfFee` and `financials.selfRevenue` (absent, empty or zero before 6.0 and for grafted DTFs whose fields are null; `tradeAllowlist` is left out unless both the flag and the token list are indexed). `financials.totalRevenue` is protocol + governance + external + self; revenue fields are raw 18-decimal share amounts. The React SDK's flat `IndexDtfData` gains `selfRevenue`.
  - `getIndexDtfRevenue` folds the immutable table and the holders' share into `effectiveDistribution` (`holders.percentage`) in the order Folio pays: the DAO fee first, the self fee keeps its share of the rest for holders, and the mutable and immutable tables split what is left (DAO 50%, self fee 25%, tables 60/40 → mutable 22.5%, immutable 15%, holders 12.5%). With both tables empty the DAO gets the recipients' pool, as `distributeFees` does.
  - Breaking: `getIndexDtfEffectiveRevenueDistribution(fees, platformFee)` takes `{ recipients, immutableRecipients, selfFee }` instead of the recipients array.
  - Breaking for code that builds these objects by hand: `Fees` requires `immutableRecipients` and `selfFee`, `Financials` requires `selfRevenue`, and `IndexDtfRevenueDistribution` requires `holders`.

  Rollout blocker: `GetIndexDTF` now needs the index subgraph 1.11.1 schema. Against a 1.10.2 endpoint every Index DTF query fails, so this release must not be published (or Register pointed at it) before all three `prod` endpoints (mainnet, Base, BSC) serve 1.11.1. `release:ci` enforces it: `graphql:codegen:check` keeps checking Base `prod` by default (`INDEX_DTF_SUBGRAPH_SCHEMA=<.../dtf-index-base/1.11.1-test/gn>` checks the candidate), and the new `check:subgraph-endpoints` validates the shipped documents against every configured endpoint.

- 619142f: Index DTF: every Folio write builder takes `version`.

  - `prepareIndexDtfBid`, `prepareIndexDtfCloseAuction`, `prepareIndexDtfEndRebalance`, `prepareIndexDtfOpenAuctionUnrestricted`, `prepareIndexDtfDistributeFees`, `prepareIndexDtfMint` (and its plan) and `prepareIndexDtfRedeem` now require `version` (`"5.0.0"` | `"6.0.0"`) and reject anything else with `SdkError(INVALID_INPUT)`. Their calldata is byte-identical across both versions; the ABI attached to the call follows the version.
  - Breaking for ref callers: `dtf.prepareEndRebalance()` and `dtf.prepareDistributeFees()` now take `{ version }`. Read it with `sdk.index.getVersion` / `useIndexDtfVersion`.
  - These five builders now return `IndexDtfCall` (`contract.abi` is `Abi`, `contract.functionName` is `string`, `contract.args` is `readonly unknown[]`); call sites that relied on the narrower inferred type must widen.
  - New `getIndexDtfRebalanceNonce` (`sdk.index.getRebalanceNonce`, `ref.getRebalanceNonce`, `useIndexDtfRebalanceNonce`) reads Folio 6.0's `getRebalanceNonce()`.

- 9baa37a: Index DTF rebalance: explicit version contract and protocol-accurate auction state.

  - `prepareIndexDtfOpenAuctionArgs`, `prepareIndexDtfOpenAuction` and `buildIndexDtfStartRebalanceArgs` now require `version` (`"5.0.0"` | `"6.0.0"`) and reject anything else with `SdkError(INVALID_INPUT)`; there is no silent v5 default. `buildIndexDtfStartRebalance` reads the proxy version when none is passed and applies the same check.
  - v6 open-auction math takes `auctionLength` and carries it into the args; `prepareIndexDtfOpenAuction` uses it when no explicit length is passed.
  - `getLatestAuction` / `getActiveAuction` resolve one block first and pin every read to it, report `currentRebalanceNonce` and `blockNumber`, and treat an auction as active only while `startTime <= now <= endTime` (inclusive, as Folio checks) and its nonce matches the current rebalance.
  - Open-auction inputs reject zero, negative or non-finite prices before the rebalance library runs.

### Patch Changes

- 9baa37a: Generate and export the Folio v6, FolioDeployer v6, and FolioVersionRegistry ABIs from pinned `reserve-index-dtf` artifacts, and encode v6 basket proposals with the expected rebalance nonce and required execution deadline. V6 fee-recipient calls now require both mutable and immutable recipient tables; higher-level revenue proposals reject v6 until they can preserve the immutable table.
- Updated dependencies [5476fba]
- Updated dependencies [471ec49]
- Updated dependencies [9baa37a]
- Updated dependencies [9baa37a]
- Updated dependencies [8f12b39]
- Updated dependencies [5d5e35d]
- Updated dependencies [5f53142]
- Updated dependencies [d26bccf]
- Updated dependencies [041b6fb]
- Updated dependencies [9baa37a]
- Updated dependencies [46ddfcf]
- Updated dependencies [5f53142]
- Updated dependencies [5f53142]
- Updated dependencies [30f2e02]
- Updated dependencies [5f53142]
- Updated dependencies [619142f]
- Updated dependencies [9baa37a]
  - @reserve-protocol/sdk@0.7.0

## 0.6.2

### Patch Changes

- @reserve-protocol/sdk@0.6.2

## 0.6.1

### Patch Changes

- @reserve-protocol/sdk@0.6.1

## 0.6.0

### Minor Changes

- 1baead1: Add cross-DTF governance reads for dashboards and explorers.

  - `sdk.index.getProposalFeed`, `getTopVoters`, `getGovernanceActivity`: proposals inside a creation-time window (`since`/`until`, default the last 60 days), most active voters, and a merged event feed (votes, proposal lifecycle, vault deposits/withdrawals) across every Index DTF chain, with derived proposal state and the DTFs each governance controls. Attribution resolves from the DTF side (owner/trading governances, current or legacy, then the vault), so proposals on a governance or vault a DTF has since replaced still name that DTF.
  - `sdk.index.getVoteLockTotals`, `getVoteLockLifetimeTotals`: per-vault staked, share supply, pending-unstake locks, and lifetime deposits/withdrawals.
  - `sdk.yield.getProposalFeed`, `getTopVoters`, `getGovernanceActivity`, `getProtocolStakingTotals`: the Yield DTF equivalents plus protocol-wide RSR staking totals per chain. Staking rows come from the subgraph's stake and unstake entries, so stRSR transfers never appear as staking.
  - React SDK query options and hooks for each read, plus `useIndexDtfVoteLockDaos` for the Reserve API vote-lock DAO rows.
  - `SdkErrorCode` gains `LIMIT_EXCEEDED`, thrown when a read-everything subgraph walk passes 10k rows instead of returning a partial total.
  - Fix: Index proposal vote weights, quorum, veto thresholds, and vote rows are now formatted with the vote-lock share token's decimals instead of a fixed 18 (`raw` is unchanged; `formatted` changes for six- and eight-decimal vaults).
  - `IndexDtfProposalVote.choice` is typed as `IndexDtfVoteChoice` instead of `string`.
  - New root exports: `withIndexDtfProposalSummaryState`, `mapYieldDtfProposalSummary`, `withYieldDtfProposalListStates`, `yieldDtfChainIds`.

### Patch Changes

- 3cc1ce8: Build against `@tanstack/react-query` >=5.102 so published hook types no longer reference the removed `NoInfer` re-export. Consumers on react-query >=5.101 previously saw every hook's `data` collapse to `any`.
- Updated dependencies [69372d9]
- Updated dependencies [1baead1]
  - @reserve-protocol/sdk@0.6.0

## 0.5.3

### Patch Changes

- @reserve-protocol/sdk@0.5.3

## 0.5.2

### Patch Changes

- @reserve-protocol/sdk@0.5.2

## 0.5.1

### Patch Changes

- a33a5ae: Support self-appreciating vote-lock vaults (vlRSR): `prepareVoteLockRedeem` builder for shares-denominated unlocks, `VoteLockState.shareBalance` + `VoteLockState.exchangeRate` (same single multicall), and `useIndexDtfVoteLockPreviewDeposit` / `useIndexDtfVoteLockPreviewRedeem` hooks for lock/unlock quotes.
- Updated dependencies [a33a5ae]
  - @reserve-protocol/sdk@0.5.1

## 0.5.0

### Minor Changes

- 1baaff1: Account-balance snapshot primitives: `getIndexDtfAccountBalanceSnapshot` (carry-forward daily balance at a mark) on the namespace and bound ref, with `selectPriceAtMark(points, mark?)` selecting the latest positive timestamped price at or before an optional mark while preserving its one-argument behavior. The read is exposed through `useIndexDtfAccountBalanceSnapshot`, plus `usePrefetchIndexDtfPriceHistory` lets apps warm sibling price-history windows without touching the SDK client. Product metrics (e.g. a week-ago PnL) compose these app-side — the SDK deliberately ships no PnL semantics.
- 49aeb87: `useIndexDtfPerformance` — price history composed for display: deduped by timestamp, with a live point appended when `currentPrice` + `currentTotalSupply` are provided (marketCap derived). The cache entry stays the raw point array under the canonical price-history key; composition happens after the cache, so other consumers of the key keep the raw contract.
- 0453499: Breaking: `getIndexDtfStatus` is now a synchronous catalog lookup — `getIndexDtfStatus({ address, chainId }): DtfStatus` validates the address and reads `@reserve-protocol/dtf-catalog` directly (case-insensitive address match, absent entries are `active`) instead of scanning the `/discover/dtfs` endpoint. The plural `getIndexDtfStatuses` remains an asynchronous Reserve API discovery projection for bulk/list screens. `useIndexDtfStatus({ address, chainId })` returns the singular status directly with no react-query involved; `indexDtfStatusQueryOptions` and the `dtfQueryKeys.index.status` key are removed.

### Patch Changes

- Updated dependencies [1baaff1]
- Updated dependencies [1df9528]
- Updated dependencies [c51c120]
- Updated dependencies [c51c120]
- Updated dependencies [c51c120]
- Updated dependencies [c51c120]
- Updated dependencies [c51c120]
- Updated dependencies [0453499]
- Updated dependencies [6bd2e17]
  - @reserve-protocol/sdk@0.5.0

## 0.4.1

### Patch Changes

- @reserve-protocol/sdk@0.4.1

## 0.4.0

### Minor Changes

- 82f2cfa: Preserve Index DTF brand media, source the current DTF's status from the static catalog (no extra request; defaults to active for unlisted DTFs), keep the full DTF aggregate to one subgraph call plus the pricing API (platform fee stays a separate opt-in read), add the rebalance liquidity and Ondo health boundary, expand React Index read hooks/query options, and publish tree-shakeable preserve-modules core output with a consumer bundle regression gate.

### Patch Changes

- Updated dependencies [82f2cfa]
  - @reserve-protocol/sdk@0.4.0

## 0.3.2

### Patch Changes

- Updated dependencies [264f1f9]
  - @reserve-protocol/sdk@0.3.2

## 0.3.1

### Patch Changes

- @reserve-protocol/sdk@0.3.1

## 0.3.0

### Minor Changes

- e7bcc93: Full Yield DTF (RToken) domain: reads, issuance, staking, governance, auctions, APY, and proposal building.

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

### Patch Changes

- Updated dependencies [e7bcc93]
  - @reserve-protocol/sdk@0.3.0

## 0.2.0

### Minor Changes

- 63b453f: Breaking audit pass plus new vote-lock and governance helpers.

  Breaking:

  - Removed `getFull`, `getFullIndexDtf`, `GetFullIndexDtfParams`, `GetFullIndexDtfOptions`, `fullIndexDtfQueryOptions`, and `useFullIndexDtf`. Use `get` / `getIndexDtf` / `indexDtfQueryOptions` / `useIndexDtf` — they were the same function.
  - `getTransactions` no longer accepts `dtfPriceUsd` and no longer returns `amountUsd`. Multiply `amount.formatted` by a price from `getPrice` if a USD value is needed.
  - Removed `dedupeAddresses`; use `uniqueAddresses` (case-insensitive, returns checksummed addresses).
  - Removed the unused `dtfQueryKeys.index.dtf` key.

  New:

  - All contract ABIs are exported from the sdk root (timelock, optimistic timelock, selector registry, unstaking manager, deployers, DAO fee registry, proposal ABI catalog and decoder set, v1/v2/v4 index ABIs, `folioArtifactAbi`).
  - `getVoteLockState` no longer fails when the price API is down; `underlyingPrice` is simply omitted. Prices are fetched in parallel with the on-chain reads.
  - `getVoteLockVaultState({ stToken, chainId, account })` reads vote-lock drawer state straight from a staking vault without a DTF subgraph lookup, plus `useIndexDtfVoteLockVaultState` and `indexDtfVoteLockVaultStateQueryOptions`.
  - `mergeIndexDtfProposalVotingSnapshot(proposal, snapshot)` overlays a fresher voting snapshot onto a proposal detail (root export).
  - react-sdk queries now have staleTime defaults: 10s live data (prices, auctions, issuance), 30s governance/account state, 5min static metadata. Override per query; constants exported as `LIVE_STALE_TIME`, `DEFAULT_STALE_TIME`, `STATIC_STALE_TIME`.
  - Type-safe calldata encoding in `prepareContractCall` (no more `as never`), with exact-encoding regression tests.

### Patch Changes

- Updated dependencies [63b453f]
  - @reserve-protocol/sdk@0.2.0

## 0.1.5

### Patch Changes

- Add new Ethereum and BSC Index DTF catalog entries and expose `useIndexCatalog`.

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.3

## 0.1.2

### Patch Changes

- Remove the re-exported SDK wallet client helper from the React package surface.
- Add portfolio, revenue, and rebalance query options/hooks backed by existing SDK methods.
- Move extra Index DTF query options onto shared `dtfQueryKeys` helpers.
- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.2

## 0.1.1

### Patch Changes

- Fix `wasChallenged` detection for confirmation proposals whose original optimistic description has trailing whitespace. `getChallengeDescription` no longer trims the extracted description, so the subgraph challenge lookup matches the exact stored value instead of failing on a trailing newline/space.

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.1

## 0.1.0

### Minor Changes

- Add Index DTF proposal decoding and proposal action hooks.

  The React SDK now exposes proposal decode, voting snapshot, and proposal action call hooks, and the provider accepts an Etherscan API key for ABI enrichment.

### Patch Changes

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.0

## 0.0.1

### Patch Changes

- [`65463fd`](https://github.com/reserve-protocol/dtf-interface/commit/65463fd8cd36f6d6efe4157550173cc8b13bea98) Thanks [@lcamargof](https://github.com/lcamargof)! - Initial React SDK release for Index DTF apps. Provides a `DtfSdkProvider`, React Query options, hooks, and stable query keys for SDK-backed discovery, DTF reads, proposal reads, optimistic governance reads, selector registry reads, and proposal builder flows.

- [#1](https://github.com/reserve-protocol/dtf-interface/pull/1) [`1a67a57`](https://github.com/reserve-protocol/dtf-interface/commit/1a67a571363614c5e961b9c7c2e1c9f70d5ed1bc) Thanks [@akshatmittal](https://github.com/akshatmittal)! - Adopt tsdown builds, shared TypeScript config, Turborepo, and root lint, format, and release tooling.

- Updated dependencies [[`0ac1d50`](https://github.com/reserve-protocol/dtf-interface/commit/0ac1d50b162900a364f85f9ca11eb6bc375e324f), [`1a67a57`](https://github.com/reserve-protocol/dtf-interface/commit/1a67a571363614c5e961b9c7c2e1c9f70d5ed1bc)]:
  - @reserve-protocol/sdk@0.0.1
