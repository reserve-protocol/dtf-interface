# Register Index DTF React SDK Migration Plan

Status: in progress. This file retains the detailed migration matrix and parity checks. Use [`../SDK_AUDIT_2026-07-09.md`](../SDK_AUDIT_2026-07-09.md) for the current execution order and source for completed audit work. This plan is not proof that every referenced hook or SDK method exists.

Current completed slice:

- Index DTF proposal list/detail reads are SDK/react-sdk-backed.
- Proposal list reads expose `{ proposals, proposalCount }`; proposal array hooks reuse the same cache while preserving array-style `select` behavior.
- Account proposal voter state uses unified SDK/react-sdk voter-state reads for standard and optimistic proposals.
- Register proposal detail consumes SDK `proposal.votingState`; overview/list display-state adapters can remain Register-owned during migration.
- Vote weights flow through as SDK `Amount` values.
- Optimistic challenge confirmations are matched by `Confirmation For:` description against recent same-governance optimistic proposals.

## Goal

Register already has production Index DTF behavior. The migration goal is to replace direct Register API, RPC, subgraph, and calldata-building code with SDK/react-sdk surfaces where the SDK owns the source-backed read or transaction builder.

Keep the boundary boring:

- SDK core prepares reads and contract calls.
- React SDK wraps SDK reads with query options and hooks where that surface exists. Current discovery hooks are not all Index-namespace equivalents.
- Register keeps wallet connection, chain switching, transaction submission, toasts, Jotai state, route behavior, feature gates, forms, validation copy, and post-transaction refresh.

## Current Register Wiring

Register already uses the React SDK package:

- `register/package.json` declares `@reserve-protocol/react-sdk` at `^0.2.0`, and its lockfile resolves 0.2.0. It must be deliberately bumped after the next SDK release because that range does not accept 0.3.x.
- `register/src/state/chain/index.tsx` wraps the app in `DtfSdkProvider`.
- `register/src/utils/rpc-urls.ts` passes SDK RPC URLs for Ethereum, Base, and BSC.
- `register/src/views/index-dtf/index-dtf-container.tsx` wraps the route in `IndexDtfProvider` and consumes `useCurrentIndexDtf`, `useIndexDtfIdentity`, and `useIndexDtfVersion`.

Register still has Arbitrum in wagmi for older app behavior, but `dtfSdkChains` excludes Arbitrum. Treat Arbitrum as deprecated for Index DTF SDK surfaces unless product requirements change.

## Current SDK Boundary

Implemented in core SDK:

- `sdk.index.discover`, `discoverByChain`, `discoverFromSubgraph`, `list`.
- `sdk.index.get`, `getDtf`, `getBasket`, `getBasketSnapshot`, `getVersion`, `getTotalSupply`, `getTotalAssets`, `getBrand`, `getMandate`, `getPrice`, `getPrices`, `getPriceHistory`.
- `sdk.index.getStatus`, `getStatuses`, `getExposure`, `getHolders`, `getTransactions`.
- `sdk.index.getBidsEnabled`, `getRebalanceControl`, `getPendingFeeShares`, `getApprovedRevenueTokens`, `getPlatformFee`, `getRevenue`.
- `sdk.index.getIssuanceState`, `prepareMint`, `prepareMintPlan`, `prepareRedeem`, `prepareBasketApproval`, `getRedeemMinAmounts`.
- `sdk.index.prepareDistributeFees`.
- direct deploy builders: `prepareDeploy`, `prepareDeployGoverned`, `prepareDeployStakingToken`, deploy approval helpers, and deploy plans.
- deploy event extraction helpers: `extractIndexDtfDeployedAddress` and `extractIndexDtfDeployedStakingTokenAddress` are top-level named exports, not `sdk.index` methods.
- governance proposal reads/actions/builders through the Index namespace/ref.
- rebalance reads/builders: rebalances, auctions, bid quote, bid/open/close/end builders.
- vote-lock reads/builders through the Index namespace/ref.
- `sdk.portfolio.get`, `getHistory`, `getTransactions`.

Implemented in React SDK:

- Provider/context: `DtfSdkProvider`, `IndexDtfProvider`, `useDtfSdk`, `useIndexDtfIdentity`.
- Current DTF hooks: `useCurrentIndexDtf`, `useCurrentIndexDtfBasket`.
- Basic query hooks/options: discover, list, full DTF, basket, version, brand, price, price history.
- Current `useDiscoverDtfs` uses generic discovery params. It is not a drop-in for `sdk.index.discover({ performance: true, brand: true })`.
- Governance query hooks/options: proposal list/detail, voting state, delegates, guardians, optimistic governance helpers, selector registry helpers, proposal builders.
- Extra query hooks/options: status, exposure, transactions, revenue, issuance state, rebalances, current rebalance, vote-lock state, account portfolio.

Not implemented in SDK/react-sdk:

- Zapper quote client.
- Zap mint/redeem transaction builder.
- Zapper deploy client.
- Zapper token list/volatility wrapper.
- Zapper health check.
- React SDK mutation hooks for sending vote, queue, execute, cancel, mint, redeem, bid, deploy, lock, unlock, or delegate transactions.

## Completed React SDK Foundation

The query-key consolidation and immediate hook additions described by the original plan are complete:

- Extra Index and portfolio reads use canonical `dtfQueryKeys` and `createDtfQueryOptions`.
- `indexDtfQueryOptions` is the single full-DTF query surface; removed `getFull` aliases are no longer documented.
- Existing Index reads now expose hooks for mandate, supply/assets, holders, bids-enabled, rebalance control/detail, active/latest auction, and bid quotes.
- Query options carry native TanStack branding and can be passed directly to `useQueries`.

The remaining work is Register adoption and new consumption-driven reads, not another query abstraction pass.

## Register Replacement Matrix

| Register area                     | Current source                                                                                                     | SDK/react-sdk replacement                                                                                                                     | Notes                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App SDK provider                  | `DtfSdkProvider` already wired                                                                                     | Keep                                                                                                                                          | `dtfSdkChains` excludes Arbitrum.                                                                                                                                                                                                                                                                                                                                                                                                   |
| Index DTF route provider          | `IndexDtfProvider` already wired                                                                                   | Keep                                                                                                                                          | Register still owns URL validation and not-found redirect.                                                                                                                                                                                                                                                                                                                                                                          |
| Container DTF data                | `useCurrentIndexDtf` already populates atoms                                                                       | Keep                                                                                                                                          | Register maps SDK shape into existing atoms during migration.                                                                                                                                                                                                                                                                                                                                                                       |
| Version                           | `useIndexDtfVersion`                                                                                               | Keep                                                                                                                                          | Already migrated.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Platform fee                      | wagmi `daoFeeRegistry()` and `getFeeDetails()`                                                                     | add `platformFee` to `sdk.index.get` / `useCurrentIndexDtf` and read it from the route model                                                  | Keep `useIndexDtfPlatformFee` for focused screens that do not need the full DTF. Preserve Register fallback behavior only if product still requires it.                                                                                                                                                                                                                                                                             |
| Exposure                          | direct `fetch(${RESERVE_API}dtf/exposure...)`                                                                      | `useIndexDtfExposure`                                                                                                                         | Keep `refetchInterval: 60000` in Register if product needs it.                                                                                                                                                                                                                                                                                                                                                                      |
| Deprecation status                | `useDTFStatus`, direct `/discover/dtfs`, `KNOWN_DEPRECATED` snapshot                                               | `status` on `sdk.index.get` / `useCurrentIndexDtf`, backed by the synchronous catalog lookup                                                  | Use `useIndexDtfStatus` only when a focused synchronous status read is needed. Bulk discovery/list status remains Reserve API-backed through `getStatuses`; preserve `KNOWN_DEPRECATED` only if product still requires a pre-provider fail-safe.                                                                                                                                                                                    |
| Discovery/list page               | `useIndexDTFList`, direct `/discover/dtfs?performance=true&brand=true`                                             | No drop-in React SDK hook today                                                                                                               | Add a React hook around `sdk.index.discover({ performance: true, brand: true })` only after core SDK can preserve Register's strict `type === 'index'` behavior or expose enough raw type data to filter. `useIndexDtfList` is catalog/static, not the discovery-card data source. Preserve the exported `IndexDTFItem` shape or migrate every consumer together. Until strict filtering is possible, keep Register's direct fetch. |
| Transactions table                | `useIndexDTFTransactions`, direct subgraph/API mix                                                                 | `useIndexDtfTransactions`                                                                                                                     | Preserve `dtfPriceUsd` behavior if the table needs USD value at event time.                                                                                                                                                                                                                                                                                                                                                         |
| Price chart                       | Reserve API historical chart hooks                                                                                 | `useIndexDtfPriceHistory` where source matches, wrapped by Register adapters                                                                  | Keep BTC-specific Binance comparison hooks product-owned. Preserve Register's live appended datapoint, prefetching, loading behavior, and current response shape where needed.                                                                                                                                                                                                                                                      |
| Factsheet/performance             | chart/table hooks under factsheet                                                                                  | SDK price/history/exposure if source matches, with an adapter                                                                                 | SDK price history returns `IndexDtfPricePoint[]`; factsheet code currently expects `timeseries`. Factsheet route behavior and labels stay Register-owned.                                                                                                                                                                                                                                                                           |
| Yield Index APY history           | direct Reserve API APY hook                                                                                        | Product-owned unless SDK gets a Yield Index analytics API                                                                                     | Do not mix this with Index DTF price-history migration.                                                                                                                                                                                                                                                                                                                                                                             |
| Manual issuance read state        | wagmi balances, allowances, `toAssets`                                                                             | `useIndexDtfIssuanceState` for supported modern Folios                                                                                        | Decide v1 support before replacing reads. Reads and submit behavior should be gated/migrated together. Pass `shares` when user input is known. SDK exact `mintAmount` uses ceil rounding and can differ by dust from Register's current scaled per-1-DTF display; treat that as an intentional parity check.                                                                                                                        |
| Manual mint                       | Register encodes/sends `mint`                                                                                      | `sdk.index.prepareMint` or ref `prepareMint` for modern Folios only                                                                           | Register currently branches v1 two-arg mint vs modern three-arg mint. Keep the v1 path, add a v1 builder, or product-gate v1 manual mint before replacing.                                                                                                                                                                                                                                                                          |
| Manual mint approvals             | Register custom approval flow                                                                                      | `prepareBasketApproval` / `prepareMintPlan` for call objects                                                                                  | Register keeps unlimited/buffered choice, batch retry, individual fallback, and USDT revoke-before-approve.                                                                                                                                                                                                                                                                                                                         |
| Manual redeem                     | Register encodes/sends `redeem`                                                                                    | `prepareRedeem` plus `getRedeemMinAmounts`                                                                                                    | Register keeps slippage setting/copy.                                                                                                                                                                                                                                                                                                                                                                                               |
| Main zap issuance                 | `@reserve-protocol/react-zapper`                                                                                   | No SDK replacement yet                                                                                                                        | Do not replace until Zapper plan is implemented.                                                                                                                                                                                                                                                                                                                                                                                    |
| Overview zap mint/sell cards      | custom zap hooks and `react-zapper` behavior                                                                       | No SDK replacement yet                                                                                                                        | Preserve BSC Odos disable, high price-impact acknowledgement, and sell-only inactive behavior.                                                                                                                                                                                                                                                                                                                                      |
| Governance proposal list/detail   | React SDK                                                                                                          | Keep `useIndexDtfProposalList`, `useIndexDtfProposal`, and unified voter-state hooks                                                          | Detail consumes SDK `proposal.votingState`; overview/list adapters can remain Register-owned until fully migrated.                                                                                                                                                                                                                                                                                                                  |
| Governance proposal builders      | some React SDK query options, some local atoms/calldata                                                            | SDK proposal builders where already implemented                                                                                               | Keep proposal form state in Register.                                                                                                                                                                                                                                                                                                                                                                                               |
| Vote/queue/execute/cancel         | wagmi write calls                                                                                                  | SDK prepare action builders; no mutation hooks yet                                                                                            | Register keeps write lifecycle and refresh timing. Cancel must preserve the governor-cancel vs timelock-cancel branch and permissions. If the DTF ref API is used, add/ref expose governor cancel or call the flat namespace for that branch. Add hooks only for prepared calls if needed, not senders.                                                                                                                             |
| Selector registry/proposer checks | wagmi/subgraph mix                                                                                                 | existing React SDK selector/proposer hooks                                                                                                    | Migrate where params match.                                                                                                                                                                                                                                                                                                                                                                                                         |
| Rebalance current state           | Register RPC/read hooks                                                                                            | `useIndexDtfCurrentRebalance`, `useIndexDtfRebalances`, SDK rebalance reads for supported versions                                            | SDK current rebalance/open-auction helpers are modern/v5-shaped. `getActiveAuction` is latest-auction-only; use it only where that matches the UI invariant. Keep legacy v4 paths or product-gate them. Live execution truth must remain RPC-backed. Do not rely only on subgraph for active auctions.                                                                                                                              |
| Rebalance open/close/end/bid      | local wagmi write/calldata                                                                                         | SDK `prepareOpenAuction`, `prepareOpenAuctionUnrestricted`, `prepareCloseAuction`, `prepareEndRebalance`, `prepareBid` for supported versions | Preserve Register's historical-block initial data, live-block current data, and hybrid first-auction block boundaries. Register keeps permissions UI, disabled states, CoW/trusted filler UX.                                                                                                                                                                                                                                       |
| Rebalance health/liquidity        | duplicated Reserve API client, trade sizing, Ondo limits, and safe-percent helpers across proposal/rebalance flows | SDK Reserve API read + response types + pure matched-size/Ondo/safe-percent helpers; React query option/hook                                  | Register keeps debounce, retry interaction, warnings/copy, atoms, and Zapper token-support checks. Existing SDK current-rebalance/open-auction helpers replace duplicate RPC transforms and `getOpenAuction` plumbing for supported versions.                                                                                                                                                                                       |
| Settings basics                   | wagmi `bidsEnabled` etc.                                                                                           | existing `useIndexDtfRevenue`, `useIndexDtfBidsEnabled`, `useIndexDtfRebalanceControl`, and `useIndexDtfApprovedRevenueTokens`                | Use focused hooks instead of generic read-contract wrappers.                                                                                                                                                                                                                                                                                                                                                                        |
| Distribute fees                   | wagmi pending fees + write                                                                                         | `getPendingFeeShares` and `prepareDistributeFees`                                                                                             | Register keeps button state and tx lifecycle.                                                                                                                                                                                                                                                                                                                                                                                       |
| Reward tokens                     | wagmi reward token reads                                                                                           | vote-lock/revenue hooks if complete                                                                                                           | Verify exact token list source before replacing.                                                                                                                                                                                                                                                                                                                                                                                    |
| Overview staking/vote-lock        | wagmi vault reads/writes                                                                                           | `useIndexDtfVoteLockState` plus SDK vote-lock builders                                                                                        | Register keeps drawer flow, delay acknowledgement, claim/delegate UX.                                                                                                                                                                                                                                                                                                                                                               |
| Portfolio page                    | direct Reserve API hooks                                                                                           | No drop-in current/history replacement until SDK types match Register                                                                         | Core SDK has portfolio helpers, but current public portfolio typing does not include all Register fields such as Yield DTFs, staked RSR, and RSR balances. Register current/transactions refetch every 60s. Register history periods include `6m` and `All`, while SDK period typing is not yet parity. Preserve Register's chart adapter and all-period preload behavior.                                                          |
| Manual deploy                     | local atoms/builders/wagmi approvals/deploy                                                                        | SDK direct deploy builders and approval plans                                                                                                 | Product defaults and form validation stay Register-owned. Register must create and persist one `deploymentNonce` per deploy attempt before preparing calls. Preserve deploy approval fallback, buffered approvals, and USDT revoke-before-approve behavior.                                                                                                                                                                         |
| Simple/Zapper deploy              | `useZapDeployQuery` and returned transaction payload                                                               | No SDK replacement yet                                                                                                                        | Keep separate from direct deploy builders until Zapper deploy is implemented.                                                                                                                                                                                                                                                                                                                                                       |
| Deploy event parsing              | Register receipt/log parsing                                                                                       | top-level SDK deploy event extraction helper imports                                                                                          | Register still owns success route and post-deploy refetch. Do not invent `sdk.index.extract...` methods.                                                                                                                                                                                                                                                                                                                            |

## React SDK Hook Status

Shipped: platform fee, rebalance control, bids enabled, pending fee shares, approved revenue tokens, holders, account balance snapshots, total supply/assets, price-history prefetch/performance composition, portfolio history/transactions, rebalance detail, active/latest auction, bid quote, and rebalance-liquidity query options/hooks. The full/current DTF result includes platform fee and synchronous catalog-backed status.

Remaining additions must have a concrete Register replacement:

- `indexDtfStatusesQueryOptions` / `useIndexDtfStatuses` only if a non-route Register screen needs a batch outside discovery.
- `discoverIndexDtfsQueryOptions` / `useDiscoverIndexDtfs` or equivalent for `sdk.index.discover` with `performance` and `brand` params. Current `useDiscoverDtfs` is not enough for Register discovery cards.
- `indexDtfBasketSnapshotQueryOptions` / `useIndexDtfBasketSnapshot` if snapshot basket views still bypass SDK.

Hooks for optional-param SDK methods such as `sdk.index.discover` and `sdk.index.getStatuses` should stay enabled when params are omitted. Follow the existing optional-param pattern from generic discover/list hooks, not the required-param extra-hook pattern.

Do not add mutation hooks yet unless there is a concrete Register migration step that needs them. Prefer prepared-call hooks/options first if React code needs memoized call objects.

## Core SDK Gaps To Fill

Only add core SDK code for gaps with a Register replacement target:

- Zapper namespace or explicit Zapper functions for quote/swap/deploy/health/token-list, after rechecking current Register and `react-zapper` sources.
- Any missing vote-lock builders discovered while migrating lock, unlock, claim, or delegate buttons.
- Any missing governance action builders discovered while migrating queue, execute, cancel, or vote buttons.
- A ref-level governor-cancel prepared-call method if Register wants to use `sdk.index.ref(... )` for both cancel branches. Otherwise use the flat namespace for governor cancel.
- Any missing rebalance read/builders discovered while replacing auction actions.
- A v1 mint builder or an explicit product decision to stop supporting v1 manual mint before replacing Register's manual mint submit path.
- v1-compatible issuance reads or an explicit product decision to keep Register's current manual issuance updater for v1 DTFs.
- v4 rebalance read/action support or an explicit product gate before replacing Register's legacy rebalance paths.
- Typed portfolio history response and period parity if Register needs stronger chart typing than the current `unknown` return.
- Portfolio period support for Register's current `6m` and `All` behavior, or a product decision to change those periods.
- Portfolio current response/type parity for Register's `yieldDTFs`, `stakedRSR`, and `rsrBalances` fields before replacing the portfolio page current hook.
- Strict Index discovery filtering or raw `type` exposure before replacing `useIndexDTFList` with an SDK-backed hook.

Avoid broad abstractions:

- No generic React SDK transaction executor.
- No generic binder abstraction for namespace/ref composition.
- No fallback chains or compatibility paths unless Register has shipped behavior that requires them.
- No Zapper behavior hidden inside direct mint/redeem/deploy names.

## Register State Rules

Register can keep its existing Jotai atoms during migration. The initial target is replacing data sources, not rewriting component state.

Keep these behaviors in Register:

- route parsing and redirects.
- wallet chain synchronization to URL chain.
- atom reset on token/chain change and unmount.
- `indexDTFRefreshFnAtom` post-transaction refresh bridge.
- inactive DTF UI gates.
- sell-only behavior for deprecated DTFs.
- high price-impact warning acknowledgement.
- manual approval retry/fallback behavior.
- deploy defaults and permissionless-flow locks.
- proposal display-state derivation.
- proposal detail consumes SDK `proposal.votingState`; overview/list display-state adapters can remain Register-owned during migration.
- DTF-bound proposal detail routes/query params, while avoiding extra membership filters around globally unique proposal IDs.
- Tenderly simulation/debug tooling.
- CoW/trusted filler widgets and related product copy.
- Yield/Earn status behavior and Yield Index APY analytics unless SDK gets separate product-backed surfaces.

## Migration Stages

### 1. React SDK Query-Key Consolidation (complete)

Work in `dtf-sdk`:

- Extra Index and portfolio keys now live in `dtfQueryKeys`.
- Extra query options now use `createDtfQueryOptions`; `indexDtfQueryOptions` is the one full-DTF surface.
- Query-key/options/root-export tests are green, including native `useQueries` compatibility.

### 2. Low-Risk Read Hooks (SDK complete; Register migration pending)

Work in `dtf-sdk`, then Register:

- Focused hooks for platform fee, rebalance control, bids enabled, pending fee shares, approved revenue tokens, and portfolio transactions are shipped.
- Add platform fee and status to the current/full DTF route model before deleting their Register updaters.
- Replace Register direct reads that have no UX-specific request behavior.
- Keep existing atom updater components and only swap query sources.
- Do not treat the current portfolio hook as a drop-in until SDK response types include every field Register uses.
- Do not treat portfolio history as low-risk until SDK period typing and the response adapter match Register's current chart behavior.

Good first Register replacements:

- `IndexDTFExposureUpdater` -> `useIndexDtfExposure`.
- `PlatformFeeUpdater` -> delete after `useCurrentIndexDtf` exposes `platformFee`.
- portfolio transactions hook -> React SDK portfolio hook after response parity is checked.

### 3. Discovery And Status

Work in `dtf-sdk`, then Register after verifying response parity:

- Add a React SDK hook around `sdk.index.discover` only after core SDK can preserve strict Index-only filtering for Register discovery cards.
- Give that hook its own `dtfQueryKeys.index.discover` key and optional-param enabled behavior.
- Do not use `useIndexDtfList` as the discovery-card replacement. It is catalog/list data, not the current Reserve API discovery shape.
- Replace `useIndexDTFList` only after preserving the `IndexDTFItem` shape or migrating all consumers together.
- Preserve Register's strict `type === 'index'` filter unless product accepts SDK behavior that includes missing `type` rows. Current mapped SDK discovery items drop `type`, so this may require a core SDK change before migration.
- Put route status on `useCurrentIndexDtf`; use discovery/batch status for lists. `useIndexDtfStatus` is a synchronous catalog lookup, not a paginated query.
- Keep the generic `useDTFStatus` or split it for Yield DTF and Earn consumers.
- Keep `KNOWN_DEPRECATED` if instant pre-load status is still needed.

### 4. Manual Issuance

Work in Register:

- Decide v1 support before replacing local direct mint calldata. SDK `prepareMint` is modern three-arg mint only today.
- Decide v1 read support before replacing manual issuance updater reads. Do not migrate reads for v1 while submit still uses legacy behavior.
- Replace manual issuance updater reads with `useIndexDtfIssuanceState` only for supported versions.
- Compare current Register scaled per-1-DTF amounts with SDK exact `mintAmount` ceil rounding and accept or adapt any dust differences explicitly.
- Replace local direct mint/redeem calldata with SDK prepared calls only for supported versions.
- Replace approval calldata with SDK approval builders while preserving Register's approval UX.
- Validate with existing manual issuance tests and one wallet smoke test.

Do not touch the main Zapper issuance page in this stage.

### 5. Settings And Revenue

Work in Register:

- Replace settings read-contract calls with focused React SDK hooks.
- Replace distribute-fees write params with `prepareDistributeFees`.
- Preserve product formatting, button states, and post-tx refresh.

### 6. Governance Actions And Builders

Work carefully because proposal IDs and display states are easy to break:

- Keep Register's overview/list proposal display-state adapters from `register/src/lib/governance.ts` unless a React SDK display helper is intentionally added.
- Proposal list/detail reads are now React SDK-backed. Keep future changes on `useIndexDtfProposalList`, `useIndexDtfProposal`, and unified voter-state hooks.
- Preserve DTF-bound proposal detail query params/routes. Avoid extra DTF membership filters, but do not switch proposal detail to proposal-ID-only lookup.
- Replace local proposal builder calldata with SDK builders one proposal type at a time.
- Replace vote/queue/execute calldata with SDK prepared builders, not mutation hooks.
- Preserve cancel branching. Register currently distinguishes timelock cancel from governor cancel based on proposal/governance permissions. If using the ref API, add the missing governor-cancel ref method or call the flat namespace for that branch.
- Preserve post-transaction timing: vote refresh, queue optimistic ETA/state, execute delayed refetch, and cancel refetch.
- Keep optimistic context explicit: proposal reads include the subgraph-indexed `voteToken`, and `getProposalVoterState` uses `voteStart` plus `proposal.voteToken` unless explicit optimistic context is passed. Do not use subgraph `quorumVotes` as optimistic veto-threshold votes. Ended zero-veto optimistic proposals are `SUCCEEDED`; flows needing exact snapshot/supply/veto context should call `getOptimisticProposalContext` and pass that context to the voter-state read.
- Do not add DTF membership checks around proposal IDs. Index DTF proposal IDs are globally unique long decimal strings.

### 7. Rebalances And Auctions

Work in Register after read hooks are stable:

- Replace current rebalance/auction reads with React SDK hooks only where the DTF version is supported by the SDK method.
- Keep v4/legacy rebalance paths in Register until SDK support exists or product disables them.
- Replace open/close/end/bid calldata with SDK prepared builders only for supported versions.
- Preserve Register's source boundaries: proposal-block initial supply/assets, live current supply/assets/rebalance, and hybrid first-auction-block historical weights.
- Keep subgraph-backed auction/bid history separate from RPC-backed active auction and button state.
- Use SDK `getActiveAuction` only where the UI wants the latest active auction. It does not answer arbitrary per-auction active state.
- Keep liquidity checks, CoW/trusted filler, permission copy, and disabled-state logic in Register.
- Verify active auction behavior against live RPC assumptions, not subgraph-only state.

### 8. Vote-Lock/Staking

Work in Register:

- Replace vault state reads with `useIndexDtfVoteLockState` where it covers the drawer.
- Replace lock/unlock/delegate/claim calldata with SDK prepared builders if available; add missing builders only when a button needs them.
- Keep delay acknowledgement, drawer state, and post-tx invalidation in Register.

### 9. Deploy

Split direct deploy and Zapper deploy:

- Direct/manual deploy can use SDK direct deploy builders, approval plans, revenue-recipient math, and event extraction helpers.
- Generate and persist a `deploymentNonce` once per deploy attempt before preparing approval/deploy calls. Do not let rerenders regenerate deploy calldata.
- Import deploy event extraction helpers directly from the package root unless they are intentionally added to `sdk.index`.
- Migrate Create DAO / governed staking-token deploy separately with `prepareDeployStakingToken`, a stable staking-token deployment nonce, and `extractIndexDtfDeployedStakingTokenAddress`.
- Preserve deploy approval individual fallback, buffered amounts, and USDT revoke-before-approve behavior.
- Simple/Zapper deploy stays Register-owned until the Zapper SDK plan is implemented.
- Register keeps product defaults, form locks, chain defaults, wallet injection, token validation, success screen, and SEO/routes.

### 10. Zapper

Only start after `docs/plans/zapper-integration.md` is implemented or updated with source-verified endpoint shapes:

- Quote/swap payloads.
- Approval calls prepared from response fields when needed. Do not assume the API returns full approval transaction payloads without source verification.
- Per-flow approval sizing. Overview zap currently uses a buffer; simple deploy uses exact input amount.
- Health endpoint.
- Token list/volatility support.
- Zapper deploy payloads.
- BSC provider restrictions.

Until then, keep `@reserve-protocol/react-zapper`, `useZapSwapQuery`, `useZapDeployQuery`, and `use-zap-healthcheck` in Register.

## Validation Plan

For `dtf-sdk` changes:

- Run focused React SDK tests after query-key or hook changes.
- Run SDK tests after adding core builders/reads.
- Typecheck/build only after behavior-changing or broad public export changes.

For Register migration changes:

- Treat `register/docs/wiki/domains/e2e.md` as the acceptance-harness contract once its documented trust blockers are closed.
- Before replacing a Register source or builder, land or enable a characterization flow against the existing implementation. Keep that flow unchanged through the migration.
- Run existing targeted tests for the touched flow.
- Run the focused E2E flow plus Index smoke during the migration loop; run the complete non-Yield suite on the PR/nightly after Register E2E Phase 3 lands.
- Typecheck Register after replacing exported hook/type surfaces.
- For transaction builders, the E2E wallet fixture must record and assert prepared `to`, `data`, `value`, chain ID, decoded args, and approval spender. SDK builder tests remain required; a fixed-hash success screen alone is not evidence of correct calldata.
- Manually or live-smoke the migrated flow on the intended chain when the behavior depends on facts the offline harness cannot prove, especially active RPC state, deployed contract version, or third-party Zapper behavior.
- Do not accept shell/skeleton assertions as migration parity. Route-level migrations must assert source-derived values and fail on every unmocked boundary call.

Flow-specific checks:

- Discovery rows sort and hide inactive rows the same way.
- Discovery replacement preserves Register's strict Index-only filter if missing `type` rows exist in the API response.
- SDK-backed discovery exposes enough source data to enforce that strict filter, or Register keeps direct fetch.
- Inactive DTFs are sell-only and auctions disabled.
- Generic Yield/Earn status behavior is unchanged when Index DTF status hooks replace Index route/list status.
- Price charts and factsheet adapters preserve live appended points, `timeseries` shape, loading behavior, and prefetch behavior where the UI depends on them.
- Portfolio current/transaction hooks preserve 60s refetch behavior where Register depends on it.
- Portfolio current response/types include every field Register renders before replacing the current portfolio hook.
- Portfolio history preserves all-period preloading and cached period switching if the UI depends on it.
- Manual mint keeps v1 behavior or clearly gates it off.
- Manual issuance reads and submit behavior are gated together for v1.
- Manual mint computes required asset amounts and approval deficits with accepted rounding behavior.
- Manual redeem preserves min output slippage behavior.
- Proposal badges/countdowns match current Register behavior.
- Proposal detail remains DTF-bound even though proposal IDs are globally unique.
- Queue/execute/cancel/vote buttons preserve disable reasons.
- Cancel uses the right governor or timelock path.
- Governor cancel works even if the implementation uses DTF refs. Add the missing ref method or use the flat namespace.
- Queue/execute/cancel/vote preserve existing post-transaction refresh timing.
- Optimistic proposal voter-state reads use the unified hook path and refetch while detail is mounted.
- Challenge confirmations resolve `challengedProposalId` on detail pages and only mark list items as challenged when the matching optimistic proposal is in scope.
- Active auction reads match current RPC behavior during a live or forked rebalance.
- Latest-active-auction helpers are only used where latest auction is the intended invariant.
- v4 and v5 rebalance paths are explicitly covered or gated.
- Rebalance opening preserves historical-block and live-block source boundaries.
- Vote-lock lock/unlock/delegate refreshes balances and voting power.
- Deploy `deploymentNonce` is stable across approval, simulation, submit, and retry for one attempt.
- Create DAO / staking-token deploy uses a stable nonce and the staking-token event extraction helper.
- Deploy approvals target the Index DTF deployer, not the new Folio address.
- Deploy approvals preserve buffered amount, individual fallback, and USDT revoke-before-approve behavior.
- Zapper flows are unchanged until their SDK work is explicitly implemented.

## Open Questions

- Should React SDK expose prepared-call hooks for writes, or should Register call SDK builders directly inside submit handlers?
- Should Register keep `KNOWN_DEPRECATED` permanently as product fail-safe, or remove it after SDK status hooks are stable?
- Should core SDK change Index discovery to expose raw `type` or strict-filter rows before React SDK adds `useDiscoverIndexDtfs`, or should Register keep direct fetch for discovery cards?
- Does `sdk.index.discover({ performance: true, brand: true })` return exact fields needed by every current `useIndexDTFList` consumer?
- Should portfolio history be typed in core SDK before React SDK exposes a public hook, and should SDK support Register's current `6m` / `All` period behavior?
- Should core SDK portfolio current types expand to include every Register field, or should Register keep the direct portfolio current hook?
- Should Register keep v1 manual mint and v4 rebalance paths, or should product gate them before migrating those flows?
- Where should Register store the stable deploy nonce during a deploy attempt?
- Should Create DAO staking-token deploy be migrated in the same deploy stage as Folio deploy, or kept as a separate migration PR?
- Which Zapper consumer should drive the first SDK Zapper API shape: main issuance, overview zap cards, or simple deploy?

## Source References

- `docs/register/interface.md`
- `docs/register/issuance-deploy-flows.md`
- `docs/register/governance-flows.md`
- `docs/plans/zapper-integration.md`
- `docs/sdk/api-surface.md`
- `packages/sdk/src/index-dtf/namespace.ts`
- `packages/sdk/src/index-dtf/ref.ts`
- `packages/sdk/src/index-dtf/dtf/issuance.ts`
- `packages/sdk/src/index-dtf/dtf/issuance-calls.ts`
- `packages/sdk/src/index-dtf/deploy/index.ts`
- `packages/sdk/src/client/api/portfolio.ts`
- `packages/react-sdk/src/query-keys.ts`
- `packages/react-sdk/src/query-options.ts`
- `packages/react-sdk/src/index-dtf-query-options.ts`
- `packages/react-sdk/src/index-dtf-extra-hooks.ts`
- `register/package.json`
- `register/src/state/chain/index.tsx`
- `register/src/utils/rpc-urls.ts`
- `register/src/views/index-dtf/index-dtf-container.tsx`
- `register/src/hooks/useIndexDTFList.ts`
- `register/src/hooks/use-dtf-status.ts`
- `register/src/hooks/useIndexDTFTransactions.ts`
- `register/src/views/index-dtf/overview/hooks/use-dtf-price-history.ts`
- `register/src/views/index-dtf/overview/hooks/use-dtf-apy-history.ts`
- `register/src/views/index-dtf/factsheet/hooks/use-factsheet-data.ts`
- `register/src/views/index-dtf/issuance/*`
- `register/src/views/index-dtf/overview/components/zap-mint/*`
- `register/src/views/index-dtf/governance/*`
- `register/src/views/index-dtf/auctions/*`
- `register/src/views/index-dtf/settings/*`
- `register/src/views/index-dtf/deploy/*`
- `register/src/views/portfolio-page/hooks/*`
- `register/src/views/portfolio-page/types.ts`

## Do Not Infer

- Do not claim planned React SDK hooks exist before they are exported.
- Do not move transaction sending into core SDK.
- Do not replace Zapper flows with direct mint/redeem builders.
- Do not treat API analytics as onchain truth.
- Do not use subgraph-only state for active auctions or live execution checks.
- Do not add compatibility paths for Arbitrum Index DTFs unless product explicitly asks for them.
