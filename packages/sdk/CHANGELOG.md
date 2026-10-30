# @reserve-protocol/sdk

## 0.8.0

### Minor Changes

- 7f9c3b5: Index DTF governance reads two new subgraph fields. Needs the Index subgraph 1.11.3 or later on `prod`.

  - `Governance.proposalThresholdExact`: false while the indexer could not read the governor's ratio (under one token of vote supply). `proposalThreshold` is then a placeholder, not the governor's value.
  - `Governance.voteExtension`: seconds that voting stays open after a late quorum. It is absent on governors without the extension.

## 0.7.0

### Minor Changes

- 8f12b39: Index DTF: deploy event extraction only trusts the deployer.

  - Breaking: `extractIndexDtfDeployedAddress(logs, target)` takes the deploy target (`{ chainId, version, deployer? }`, the same object the deploy builders take) and only reads `FolioDeployed` / `GovernedFolioDeployed` emitted by that version's deployer. Before, any emitter was accepted, so a basket token could emit a lookalike event during `transferFrom` and the SDK returned the attacker's address.
  - Breaking: `extractIndexDtfDeployedStakingTokenAddress(logs, { chainId })` only reads `DeployedGovernedStakingToken` from the chain's `INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS`.
  - Both throw `RECORD_NOT_FOUND` without the deployer's event and `INVALID_RESPONSE` when the deployer's events name more than one address.

- 5f53142: Index DTF: Folio 6.0 deployments.

  - `prepareIndexDtfDeploy`, `prepareIndexDtfDeployGoverned` and their plans take `version`. `"5.0.0"` keeps the registered per-chain deployer and the existing shapes. `"6.0.0"` deploys through `INDEX_DTF_V6_DEPLOYER_ADDRESS` and takes v6 additional details (`maxAuctionLength`, `feeRecipients`, `immutableFeeRecipients`, `tvlFee`, `mintFee`, `selfFee`, `mandate`) and, for governed deploys, one optimistic `governance` table instead of owner/trading pairs.
  - Deploy plans approve the deployer they resolved. `getIndexDtfDeployerAddress` resolves the target for `{ chainId, version, deployer? }`. Both deploy builders now return `IndexDtfCall`, so `call.contract` is typed against the generic `Abi`.

- d26bccf: Index DTF: Folio 6.0 ABIs re-synced to the deployed 6.0.0 (`reserve-index-dtf@7d97c80`, identical to the explorer-verified implementation on mainnet, Base and BSC).

  - Breaking for 6.0.0: `prepareIndexDtfEndRebalance` / `ref.prepareEndRebalance` require `rebalanceNonce` and encode `endRebalance(uint256)`; the previous nonce-less call reverted on every real 6.0.0 Folio. 5.0.0 still encodes `endRebalance()`. New `PrepareIndexDtfEndRebalanceParams` type.
  - `folioV6Abi` / `folioArtifactAbi` now carry `endRebalance(uint256 rebalanceNonce)`. A unit test compares the generated Folio and FolioDeployer ABIs item for item with the Base Blockscout verified ABIs, so drift from the deployed contracts fails CI.

- 041b6fb: Index DTF 6.0.0 deploy: create the governance vault and reject parameters the contracts would revert on.

  - New `prepareIndexDtfDeployStakingVault` builds `deployWithNewStakingVault` on the governance deployer 1.1.0 (`INDEX_DTF_OPTIMISTIC_GOVERNOR_DEPLOYER_ADDRESS`), creating an optimistic staking vault (vlX) with its own governor and timelock. `extractIndexDtfDeployedStakingVault` reads the vault and its DAO from that deployer's `ReserveOptimisticGovernorSystemDeployed` event only.
  - 6.0.0 deploy builders now reject what the Folio, governor or vault would revert on: zero basket amounts, TVL fee above 10% and mint fee above 5%, veto delay under 1 s and veto period under 5 minutes, veto/proposal threshold and quorum outside (0, 1e18], proposal throttle outside 1–12, the zero selector, a zero `stToken` on governed deploys, and vault reward half-life outside 1 day–2 weeks, unstaking delay over 4 weeks or more than 20 reward tokens. Zero basket amounts are rejected for 5.0.0 too.

- 46ddfcf: Index DTF: Folio 6.0 deploys target the real 6.0.0 `FolioDeployer`.

  - New `INDEX_DTF_V6_DEPLOYER_ADDRESS` per chain (mainnet `0x2B1C…7392`, Base `0x4c89…cF67`, BSC `0x9837…1963`). `"6.0.0"` deploys go there by default, whether or not the chain's `FolioVersionRegistry` has registered 6.0.0 yet; `deployer` is an optional override for fork and sandbox deployers.
  - Breaking: `prepareIndexDtfDeployAssetApproval(s)` require `version` and default the spender to that version's deployer, so a 6.0.0 deploy never approves the 5.0.0 deployer by default. `deployer` still overrides the spender.

- 5f53142: Index DTF: Folio 6.0 settings and revenue proposals.

  - `buildIndexDtfSettingsProposal` accepts `selfFee` (percent kept for holders), `tradeAllowlist: { enabled?, add?, remove? }` and, for revenue changes on 6.0.0, `immutableFeeRecipients`. When the table is omitted the client-bound builder reads it from RPC. The mutable shares are scaled into whatever the immutable table leaves; v5 DTFs reject the v6-only fields by name.
  - `prepareIndexDtfSetFeeRecipients` on 6.0.0 sorts both tables by address and rejects tables that do not total 100%, mirroring FolioLib so a bad table fails at build time. Folio 6.0 deploys apply the same check.
  - New `sortIndexDtfFeeRecipients`, `scaleIndexDtfFeeRecipients`, `assertIndexDtfFeeRecipientTables` helpers.

- 5f53142: Index DTF: Folio 6.0 state reads and the version registry.

  - `getIndexDtfSelfFee`, `getIndexDtfImmutableFeeRecipients` (the full table `setFeeRecipients` must receive back), `getIndexDtfTradeAllowlist` (`{ enabled, tokens }`) and `getIndexDtfIsTokenAllowlisted` read the v6 contract from RPC at one pinned block; on a v5 proxy they throw (the immutable-table read probes `folioFeeForSelf` first instead of reporting an empty table). Exposed as `sdk.index.get*`, on the DTF ref, and as `useIndexDtf*` hooks.
  - `getIndexDtfLatestVersion` and `getIndexDtfVersionDeployment` read `FolioVersionRegistry` (`INDEX_DTF_VERSION_REGISTRY_ADDRESS` per chain, overridable with `registry`); `getIndexDtfVersionHash` mirrors the registry's `keccak256(abi.encodePacked(version))`. Hooks sit at the static cache tier.

- 30f2e02: Index DTF: Folio 6.0 fields from the subgraph.

  - `IndexDtf` gains `version`, `rebalance.maxAuctionLength`, `rebalance.tradeAllowlist`, `fees.immutableRecipients`, `fees.selfFee` and `financials.selfRevenue` (absent, empty or zero before 6.0 and for grafted DTFs whose fields are null; `tradeAllowlist` is left out unless both the flag and the token list are indexed). `financials.totalRevenue` is protocol + governance + external + self; revenue fields are raw 18-decimal share amounts. The React SDK's flat `IndexDtfData` gains `selfRevenue`.
  - `getIndexDtfRevenue` folds the immutable table and the holders' share into `effectiveDistribution` (`holders.percentage`) in the order Folio pays: the DAO fee first, the self fee keeps its share of the rest for holders, and the mutable and immutable tables split what is left (DAO 50%, self fee 25%, tables 60/40 → mutable 22.5%, immutable 15%, holders 12.5%). With both tables empty the DAO gets the recipients' pool, as `distributeFees` does.
  - Breaking: `getIndexDtfEffectiveRevenueDistribution(fees, platformFee)` takes `{ recipients, immutableRecipients, selfFee }` instead of the recipients array.
  - Breaking for code that builds these objects by hand: `Fees` requires `immutableRecipients` and `selfFee`, `Financials` requires `selfRevenue`, and `IndexDtfRevenueDistribution` requires `holders`.

  Rollout blocker: `GetIndexDTF` now needs the index subgraph 1.11.1 schema. Against a 1.10.2 endpoint every Index DTF query fails, so this release must not be published (or Register pointed at it) before all three `prod` endpoints (mainnet, Base, BSC) serve 1.11.1. `release:ci` enforces it: `graphql:codegen:check` keeps checking Base `prod` by default (`INDEX_DTF_SUBGRAPH_SCHEMA=<.../dtf-index-base/1.11.1-test/gn>` checks the candidate), and the new `check:subgraph-endpoints` validates the shipped documents against every configured endpoint.

- 5f53142: Index DTF: 5.0.0 → 6.0.0 upgrade proposals. `buildIndexDtfUpgradeToV6Proposal` (`sdk.index.buildUpgradeToV6Proposal`, `ref.buildUpgradeToV6Proposal`) builds the spell migration against the DTF's admin governance: selector-registry swap of `startRebalance` for optimistic governors, `transferOwnership(spell)` on the proxy admin, then `cast`. `buildIndexDtfUpgradeToV6Calls` is the pure form (`selectorRegistry` present means optimistic); the description defaults to "Upgrade to Folio 6.0.0" and the DTF can be injected with `dtf`; `INDEX_DTF_START_REBALANCE_SELECTOR` and `upgradeSpell600Abi` are exported.
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

- 5476fba: Fix the CommonJS entry: `require("@reserve-protocol/sdk")` exported `{ default: abi }` instead of the ABI array for `folioV6Abi`, `folioArtifactAbi`, `folioDeployerV6Abi`, `folioVersionRegistryAbi`, `dtfIndexAbi`, `dtfIndexAbiV1`, `dtfIndexAbiV2`, `dtfIndexAbiV4`, `dtfIndexGovernanceAbi`, `dtfIndexStakingVaultAbi` and `timelockAbi`, so encoding with them failed (`abi.filter is not a function`). ESM was unaffected. The ABI modules no longer carry a default export, and `check:package` now packs the tarball and loads it through both `import` and `require` in CI and the release gate.
- 471ec49: Fix `require("@reserve-protocol/sdk").dtfCatalog`: the CommonJS entry re-exported the catalog's module namespace (`{ default, indexDtfs, ... }`) instead of the chain-keyed catalog, because the bundler's interop for a re-exported default hands out `module.exports`. The catalog now also exports the combined catalog by name (`dtfCatalog`, same object as the default export), and the SDK re-exports that. `check:package` now compares every export's value between the ESM and CommonJS entries, not just its kind.
- 9baa37a: Generate and export the Folio v6, FolioDeployer v6, and FolioVersionRegistry ABIs from pinned `reserve-index-dtf` artifacts, and encode v6 basket proposals with the expected rebalance nonce and required execution deadline. V6 fee-recipient calls now require both mutable and immutable recipient tables; higher-level revenue proposals reject v6 until they can preserve the immutable table.
- 9baa37a: Read standard Index DTF proposal voting power at the proposal snapshot itself, matching the governor and including delegation checkpoints created at that timepoint. Preserve clamping for snapshots at or after the current clock.
- 5d5e35d: Index DTF: the Folio 6.0 basket proposal builder reads the trade allowlist and throws `INVALID_INPUT` (meta `tokens`) when enforcement is on and a rebalance token is missing from it, instead of building a proposal whose `startRebalance` reverts `Folio__TokenNotAllowlisted` on execution.
- 9baa37a: Encode Folio 6.0 `openAuction` calls with the required trailing auction length while preserving the existing Folio 5.0 call shape.
- Updated dependencies [471ec49]
  - @reserve-protocol/dtf-catalog@0.2.0

## 0.6.2

### Patch Changes

- Updated dependencies [2367cfd]
  - @reserve-protocol/dtf-catalog@0.1.7

## 0.6.1

### Patch Changes

- Updated dependencies [fe59b55]
  - @reserve-protocol/dtf-catalog@0.1.6

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

- 69372d9: Refresh `DEFAULT_RPC_URLS` with stress-tested keyless endpoints: drop the tenderly gateways and the slower BSC dataseed mirrors, add drpc/sentio/blastapi/blockpi/bnbchain.

## 0.5.3

### Patch Changes

- Updated dependencies [6a0b7e8]
  - @reserve-protocol/dtf-catalog@0.1.5

## 0.5.2

### Patch Changes

- Updated dependencies [472e6c2]
  - @reserve-protocol/dtf-catalog@0.1.4

## 0.5.1

### Patch Changes

- a33a5ae: Support self-appreciating vote-lock vaults (vlRSR): `prepareVoteLockRedeem` builder for shares-denominated unlocks, `VoteLockState.shareBalance` + `VoteLockState.exchangeRate` (same single multicall), and `useIndexDtfVoteLockPreviewDeposit` / `useIndexDtfVoteLockPreviewRedeem` hooks for lock/unlock quotes.

## 0.5.0

### Minor Changes

- 1baaff1: Account-balance snapshot primitives: `getIndexDtfAccountBalanceSnapshot` (carry-forward daily balance at a mark) on the namespace and bound ref, with `selectPriceAtMark(points, mark?)` selecting the latest positive timestamped price at or before an optional mark while preserving its one-argument behavior. The read is exposed through `useIndexDtfAccountBalanceSnapshot`, plus `usePrefetchIndexDtfPriceHistory` lets apps warm sibling price-history windows without touching the SDK client. Product metrics (e.g. a week-ago PnL) compose these app-side — the SDK deliberately ships no PnL semantics.
- 1df9528: Breaking: `IndexDtfBrand` is now the display-ready shape consumers can store directly — `{ hidden, dtf: { icon, cover, mobileCover, video, description, notesFromCreator, prospectus, files, tags, basketType }, creator, curator, socials }`. Every field is always present: absent API values coerce to `""`, `files` is always `{ url, name }[]`, `tags` always `string[]`, and `basketType` narrows to `"percentage-based" | "unit-based"` (defaulting `"percentage-based"`). App-side brand mapping layers are no longer needed.
- c51c120: Typed the Index DTF exposure API contract to match the live response: `period` accepts `ytd`, `underlyingMarketCap` is exposed, and native/bridge metadata is fully typed instead of `unknown` — no more consumer-side casts.
- c51c120: Breaking: `getIndexDtfPlatformFee` now throws `SdkError` (`INVALID_RESPONSE`) when the DAO fee registry returns a zero denominator, instead of fabricating a confident 0% fee. A real 0% (zero numerator over a positive denominator) is unaffected; consumers should treat the error as "fee unavailable".
- c51c120: `getIndexDtfPriceHistory` interval accepts `"5m"`, the granularity the API serves for the 24h range — previously the union only declared `1h | 1d` and forced a cast.
- c51c120: Breaking: `ReserveApiIndexDtfRebalanceDetail.auctions` is now required (`[]` when no auctions ran); a truly-absent field is treated as a malformed response and fails loud. Completed-rebalance detail reads now work end-to-end: the single-element-array envelope from `/dtf/rebalance` is normalized inside the client (`RECORD_NOT_FOUND` on empty), and `IndexDtfCompletedRebalanceDetail` carries the analytics fields the detail surface renders (avgPriceImpactPercent, totalPriceImpactUsd, marketCapRebalanceImpact, tracking/native basket deviation).
- 0453499: Breaking: `getIndexDtfStatus` is now a synchronous catalog lookup — `getIndexDtfStatus({ address, chainId }): DtfStatus` validates the address and reads `@reserve-protocol/dtf-catalog` directly (case-insensitive address match, absent entries are `active`) instead of scanning the `/discover/dtfs` endpoint. The plural `getIndexDtfStatuses` remains an asynchronous Reserve API discovery projection for bulk/list screens. `useIndexDtfStatus({ address, chainId })` returns the singular status directly with no react-query involved; `indexDtfStatusQueryOptions` and the `dtfQueryKeys.index.status` key are removed.
- 6bd2e17: Match OZ Governor strict-majority semantics in Index DTF proposal state derivation (a for/against tie is now DEFEATED, not SUCCEEDED) and derive lagging Yield DTF proposal list states (ACTIVE past the vote deadline now resolves to DEFEATED/QUORUM_NOT_REACHED/SUCCEEDED) via the new getYieldDtfProposalState. Breaking: the `YieldDtfProposalState` union gained `"QUORUM_NOT_REACHED"` — exhaustive switches over it must handle the new member.

### Patch Changes

- c51c120: A proposal stuck in subgraph PENDING past its vote deadline now derives the vote outcome (DEFEATED / QUORUM_NOT_REACHED / SUCCEEDED) like a stale ACTIVE, matching Governor.state() semantics — it is never reported as EXPIRED. Applies to both Index DTF (`getProposalState`) and Yield DTF (`getYieldDtfProposalState`). Yield proposal reads also derive the current timepoint from the chain (block timestamp or number per governor version) instead of the consumer machine's clock.

## 0.4.1

### Patch Changes

- Updated dependencies [1dbc095]
  - @reserve-protocol/dtf-catalog@0.1.3

## 0.4.0

### Minor Changes

- 82f2cfa: Preserve Index DTF brand media, source the current DTF's status from the static catalog (no extra request; defaults to active for unlisted DTFs), keep the full DTF aggregate to one subgraph call plus the pricing API (platform fee stays a separate opt-in read), add the rebalance liquidity and Ondo health boundary, expand React Index read hooks/query options, and publish tree-shakeable preserve-modules core output with a consumer bundle regression gate.

## 0.3.2

### Patch Changes

- 264f1f9: Ship CommonJS builds alongside ESM for the catalog and the SDK so Node CJS backends (reserve-api) can import them directly instead of through dynamic-import workarounds. ESM consumers are unaffected.
- Updated dependencies [264f1f9]
  - @reserve-protocol/dtf-catalog@0.1.2

## 0.3.1

### Patch Changes

- Updated dependencies
  - @reserve-protocol/dtf-catalog@0.1.1

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

## 0.1.5

### Patch Changes

- Add new Ethereum and BSC Index DTF catalog entries and expose `useIndexCatalog`.

- Updated dependencies []:
  - @reserve-protocol/dtf-catalog@0.0.2

## 0.1.4

### Patch Changes

- Fix proposal decoding when known upgrade spell addresses also appear as legacy governance roles.

## 0.1.3

### Patch Changes

- Update optimistic governance proposal decoding to recognize the current Reserve Optimistic Governance Spell deployments.

## 0.1.2

### Patch Changes

- Remove SDK-owned wallet client creation from the public API. Consumers now bring their own viem or wagmi wallet clients and pass SDK-prepared calls to them.
- Switch deploy approval and redeem-minimum helper APIs to named params.
- Clarify version-sensitive write builder behavior and document v5-shaped issuance/rebalance helpers.

## 0.1.1

### Patch Changes

- Fix `wasChallenged` detection for confirmation proposals whose original optimistic description has trailing whitespace. `getChallengeDescription` no longer trims the extracted description, so the subgraph challenge lookup matches the exact stored value instead of failing on a trailing newline/space.

## 0.1.0

### Minor Changes

- Add Index DTF proposal decoding and proposal action support.

  The SDK now supports explorer-backed proposal calldata enrichment, optimistic governance spell decoding, voting snapshot/proposer state fixes, and proposal action call builders used by React SDK integrations.

## 0.0.1

### Patch Changes

- [`0ac1d50`](https://github.com/reserve-protocol/dtf-interface/commit/0ac1d50b162900a364f85f9ca11eb6bc375e324f) Thanks [@lcamargof](https://github.com/lcamargof)! - Initial SDK release for Index DTF integrations. Includes Reserve API and subgraph discovery, on-chain basket and supply reads, issuance and redemption planning, revenue and fee helpers, rebalance and auction reads/builders, vote-lock reads/actions, and governance proposal reads/builders/actions with optimistic governance support.

- [#1](https://github.com/reserve-protocol/dtf-interface/pull/1) [`1a67a57`](https://github.com/reserve-protocol/dtf-interface/commit/1a67a571363614c5e961b9c7c2e1c9f70d5ed1bc) Thanks [@akshatmittal](https://github.com/akshatmittal)! - Adopt tsdown builds, shared TypeScript config, Turborepo, and root lint, format, and release tooling.
