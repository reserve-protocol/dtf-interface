# Index DTF SDK Audit

Last updated: 2026-05-07

This is a status check for the current Index DTF SDK shape and the remaining Register-backed surfaces. It is not an implementation plan for this exact PR. The goal is to keep the SDK product-shaped before adding more features.

## Verdict

The SDK foundation now has the main Register-parity Index DTF surfaces, but a few product gaps remain deferred.

The good parts:

- The public shape is mostly right: functional namespace methods plus `sdk.index.ref({ address, chainId })`.
- Basic DTF reads are split by source: subgraph metadata, RPC basket/supply/assets, Reserve API price/brand/history.
- Governance reads and contract-call builders are useful and already close to product workflows.
- Basket math now has better v5 contract validation and uses `dtf-rebalance-lib` instead of reimplementing auction math.

The weak parts:

- The split basket builder files should stay boring as new inputs are added.
- Completed rebalance metrics are still deferred to a Reserve API wrapper.
- React SDK wrappers cover the main Register views, but not every new direct SDK read yet.
- Deploy defaults, zapper flows, trusted filler/CowBot, and global protocol stats remain separate tracks.

## Version Policy

The SDK should support Index DTF v5 only for now.

- Register supports older versions because it has to display and operate legacy deployed DTFs.
- The SDK should not copy Register's v1/v2/v4 compatibility paths unless product support is explicitly expanded.
- The current protocol repo has v6 work coming, but v6 is a future SDK track. Keep version seams obvious, but do not add v6 behavior yet.
- For current SDK builders and actions, prefer the v5 ABI and v5 calldata shape.
- Shared read ABIs can use a newer ABI file when the function signature is unchanged. The version boundary matters for changed calldata shapes and missing function signatures.

## Current SDK Surface

Implemented and useful today:

| Area | Current Surface | Status |
| --- | --- | --- |
| SDK creation | `createDtfSdk`, `createDtfClient` | Good |
| Index namespace | `sdk.index.*`, `sdk.index.ref()` | Good shape |
| DTF metadata | `getDtf`, `getIndexDtf`, `getFullIndexDtf` | Good base |
| Basket reads | `getBasket`, `getTotalAssets`, `getBasketWithPrice` | Good base |
| Price reads | `getPrice`, `getPriceHistory`, `getBasketSnapshot` | Good base |
| Brand reads | `getBrand` via `/folio-manager/read` | Good base |
| Version/supply/assets RPC | `getVersion`, `getTotalSupply`, `getTotalAssets` | Good |
| Governance reads | proposals, proposal detail, votes, voter/proposer state, delegates, guardians | Good base |
| Governance contract calls | propose, queue, execute, cancel, vote builders | Good base |
| Proposal builders | basket, admin settings, basket settings, DAO settings | Works, but messy |
| Basket helpers | deploy basket, start rebalance args, units/shares conversion | Good, but file is dense |
| Protocol list | `listIndexDtfs` from catalog | Too limited |
| Rebalances | `getRebalances`, `getRebalance`, `getCurrentRebalance`, `getRebalanceAuctions`, open-auction builders | Core v5 surfaces implemented; completed metrics deferred |
| Yield namespace | exported placeholders | Not part of this audit |

## Current Builder State

The builder code works, but it is the first area to clean before adding more feature builders.

Main issues:

- Settings proposal flows are split by domain, but `settings-dtf.ts`, `settings-dao.ts`, and `settings-basket.ts` still have dense optional-input branches.
- Some `needsDtf` booleans still hide why a network read is required.
- Basket builder logic is split under `dtf/basket/`; keep resolution, validation, and rebalance arg construction explicit as it evolves.
- `contract-call.ts` exports generic EVM call helpers; domain proposal payload builders keep Index DTF-specific calldata in `governance/propose/calls.ts`.
- `toSeconds` and `encodePercent` exist in multiple files with slightly different validation behavior.

Cleanup should be boring, not architectural:

- Continue simplifying the split settings builders without changing public API names unnecessarily.
- Replace `needsDtf` mega-booleans with explicit top-to-bottom branches.
- Keep `resolve rebalance inputs` separate from `build startRebalance args` in `dtf/basket/`.
- Keep `governance/propose/calls.ts` internal unless we intentionally want low-level Index DTF settings prepare helpers as public API.
- Do not introduce a generic proposal framework.

## Register Parity Gaps

### DTF Getters

Register-backed getters that drove this pass:

| Getter | Source | Status |
| --- | --- | --- |
| `getStatus` / `getStatuses` | Reserve API `/discover/dtfs` | Implemented under `sdk.index` |
| `getExposure` | Reserve API `/dtf/exposure` | Implemented |
| `getTransactions` | Index subgraph `transferEvents` | Implemented |
| `getRebalanceControl` | RPC `rebalanceControl()` | Implemented |
| `getBidsEnabled` | RPC `bidsEnabled()` for v5 | Implemented |
| `getPendingFeeShares` | RPC `getPendingFeeShares()` | Implemented |
| `getApprovedRevenueTokens` | staking vault `getAllRewardTokens()` plus ERC20 metadata | Implemented |
| `getPlatformFee` | Folio `daoFeeRegistry()` plus registry `getFeeDetails(dtf)` | Implemented |
| `getDeployPlatformFee` | deployer `daoFeeRegistry()` plus registry `getFeeDetails(zeroAddress)` | Deferred deploy surface |
| `getVoteLockDaos` | Reserve API `/dtf/daos` | Implemented |
| `getVoteLockDao` | Reserve API `/dtf/daos/{address}?chainId=` | Implemented |

Existing getters that are already aligned with Register:

- `getDtf` covers core subgraph metadata, governance, roles, fees, financials, and vote-lock metadata.
- `getDtf` already includes subgraph rebalance config: `weightControl`, `priceControl`, optional `bidsEnabled`, and trusted filler fields.
- `getDtf` already includes subgraph vote-lock reward tokens when the DTF has a staking vault.
- `getBasket` covers live basket tokens and balances from RPC `totalAssets()`.
- `getPrice` covers Reserve API `/current/dtf`.
- `getPriceHistory` covers Reserve API historical DTF time series.
- `getBrand` covers `/folio-manager/read`.
- `getVersion`, `getTotalSupply`, and `getTotalAssets` cover the basic RPC reads.

### Issuance And Redemption

Register currently has two issuance paths: zap and manual.

SDK scope for this track is manual v5 issuance/redemption only. Zapper support is a separate effort track.

Manual SDK requirements:

| Requirement | Source / Logic |
| --- | --- |
| Asset distribution preview | Register reads RPC `toAssets(1e18, Floor)` today |
| Wallet DTF balance | ERC20 `balanceOf(account)` |
| Wallet basket balances | ERC20 `balanceOf(account)` for every basket token |
| Basket allowances | ERC20 `allowance(account, dtf)` |
| Required mint amounts | v5 `mint` transfers `_toAssets(shares, Ceil)`; do not use a floor preview as the approval source |
| Max mint amount | minimum wallet balance after the same v5 mint rounding used for required amounts |
| Max redeem amount | wallet DTF balance |
| Mint tx v5 | `mint(shares, receiver, minSharesOut)` |
| Redeem tx | `redeem(shares, receiver, assets, minAmountsOut)` |
| Approval tx | ERC20 `approve(dtf, amount)` per basket token |

Product decisions that remain after the manual v5 builder pass:

- Whether product-level mint/redeem slippage defaults should exist. Until then, builder inputs should stay explicit.
- Whether manual issuance should return one composed state object or smaller reads plus pure helpers.
- Whether SDK should expose a direct `toAssets(shares, Ceil)` helper instead of returning the current preview/state plus explicit builder inputs.

Recommended SDK shape:

- `sdk.index.getIssuanceState({ address, chainId, account })` for manual issuance reads.
- `sdk.index.prepareMint({ address, chainId, shares, receiver, minSharesOut })` for the contract call.
- `sdk.index.prepareRedeem({ address, chainId, shares, receiver, assets, minAmountsOut })` for the contract call; `assets` must use the same stable basket order as the redeem preview/state.
- Consumers own wallet-client sending.

### Rebalances And Auctions

This was the largest missing Index DTF area. Core v5 read/build surfaces are implemented; completed metrics are still deferred.

Register currently uses:

| Surface | Source / Logic |
| --- | --- |
| Rebalance list | Index subgraph `rebalances(where: { dtf })` |
| Proposal mapping | Match rebalance `blockNumber` to proposal `executionBlock` |
| Active rebalance state | RPC `getRebalance()` |
| Current supply/assets | RPC `totalSupply()`, `totalAssets()` |
| Initial supply/assets | historical RPC reads at proposal creation block |
| Initial rebalance params | historical RPC `getRebalance()` at rebalance block |
| Auction list | Index subgraph `auctions(where: { rebalance })` |
| Bids | Subgraph auction `bids` |
| Completed metrics | Reserve API `/dtf/rebalance?chainId=&address=&nonce=` |
| Open auction args | `dtf-rebalance-lib/getOpenAuction` |
| Community open | contract `openAuctionUnrestricted(nonce)` |
| Launcher open | v5 ABI `openAuction(rebalanceNonce, tokens, newWeights, newPrices, newLimits)` |
| Trusted fill / CowBot | Register consumer detail through `@reserve-protocol/trusted-fillers-sdk`; do not wrap in core SDK for now |

SDK requirements:

- Add typed `IndexDtfRebalance`, `IndexDtfAuction`, and `IndexDtfBid` domain types.
- Implement `getRebalances({ address, chainId, limit?, offset? })` from subgraph.
- Implement `getRebalance({ id, chainId })` from subgraph or `{ address, chainId, nonce }` for product ergonomics.
- Add `getCurrentRebalance({ address, chainId, blockNumber? })` for the v5 RPC `getRebalance()` transform.
- Add `getRebalanceAuctions({ rebalanceId, chainId })` from subgraph.
- Add `getRebalanceMetrics({ address, chainId, nonce })` from Reserve API. Deferred for this pass.
- Add `prepareOpenAuctionArgs(...)` around `dtf-rebalance-lib/getOpenAuction` using explicit historical/current inputs.
- `openAuction` and `openAuctionUnrestricted` contract-call builders are implemented; completed metrics remain deferred.
- Leave trusted filler/CowBot integration to consumers. Register already uses `@reserve-protocol/trusted-fillers-sdk`; the core SDK should not own that workflow now.

The open-auction builder should not hide the historical/current split. It needs these inputs either directly or from a prior SDK context read. In this table, `rebalance` means the v5-transformed RPC `getRebalance()` struct, `initialPrices` and `initialWeights` mean values derived from the historical rebalance price/weight ranges, and `prices` means the current/snapshot token price map used by `dtf-rebalance-lib`.

| Open Auction Input | Meaning |
| --- | --- |
| `folioVersion` | v5 for current SDK support; keep this seam obvious for future v6 work |
| `rebalance` | current rebalance struct from RPC `getRebalance()` |
| `tokens` | rebalance token metadata in stable order |
| `supply` | current `totalSupply()` |
| `initialSupply` | `totalSupply()` at proposal creation block |
| `currentAssets` | current `totalAssets()` balances |
| `initialAssets` | `totalAssets()` at proposal creation block |
| `initialPrices` | token prices derived from the historical rebalance price ranges; native DTF target-basket snapshot input |
| `initialWeights` | token weights derived from the historical rebalance weight ranges, or saved hybrid weights after the first auction |
| `prices` | current and snapshot token prices |
| `tokenPriceVolatility` | per-token volatility used for auction price error |
| `rebalancePercent` | requested progression percentage |
| `isTrackingDtf` / `isHybridDtf` | target basket price-mode switch |

Important constraints:

- Do not model auctions as one sell/buy pair. V5 auctions are full-token-set auctions where all eligible surplus/deficit pairs are implied.
- Keep historical reads explicit. Do not mix historical RPC with current API prices without naming that clearly.
- Match Register's target-basket price mode: native DTFs use snapshot/initial prices, while tracking and hybrid DTFs use current prices for `getTargetBasket`.
- Preserve token order across rebalance tokens, weights, prices, balances, and calldata.
- Do not port Register v4 transforms into the SDK unless product support expands. SDK rebalances should be v5-only for now.

### Revenue And Distribution

Currently covered:

- `IndexDtf.financials` has subgraph totals: total, protocol, governance, external revenue.
- Settings proposal builder can build revenue distribution changes through fee recipients.

Implemented or deferred reads/actions:

| Surface | Source / Logic |
| --- | --- |
| Pending fee shares | RPC `getPendingFeeShares()` implemented |
| Pending fees USD | pending shares times current DTF price implemented in `getRevenue()` |
| Distribute fees contract call | `prepareDistributeFees({ address, chainId })` implemented; consumers own wallet-client sending |
| Approved reward tokens | staking vault `getAllRewardTokens()` plus token metadata implemented |
| Reward token settings | already partly in DAO settings proposal builder |
| Revenue stats over time | Reserve API/subgraph decision needed |
| Fee recipient effective split | subgraph fee recipients plus DAO fee registry details; adjusted/effective split still deferred |

Recommended SDK shape:

- `sdk.index.getRevenue({ address, chainId })` for current financial totals, pending fee shares, pending USD value, fee recipients, and platform fee.
- `sdk.index.getApprovedRevenueTokens({ address, chainId })` for vote-lock reward token display.
- Use `sdk.index.prepareDistributeFees({ address, chainId })` for the contract call. Consumers own wallet-client sending; do not add a nested fees namespace unless more fee flows justify it.

### Settings View Parity

Register's settings view is mostly covered by `getDtf`, but a few live/direct reads and actions are missing.

Already covered by `getDtf` or existing governance helpers:

| Settings Section | SDK Coverage |
| --- | --- |
| Basics: name, ticker, address, mandate, deployer | `IndexDtf.token`, `IndexDtf.id`, `IndexDtf.mandate`, `IndexDtf.roles.deployment.deployer` |
| Version | `getVersion()` |
| Weight control / price control | `IndexDtf.rebalance` from subgraph |
| Governance token and underlying | `IndexDtf.voteLockVault` |
| Owner, basket, and DAO governance settings | `IndexDtf.governance`, `IndexDtf.voteLockVault.governance` |
| Guardians | `getGuardians()` and governance timelock metadata |
| Auction launchers and brand managers | `IndexDtf.roles` |
| Annualized TVL fee and minting fee | `IndexDtf.fees` |
| Fee recipients | `IndexDtf.fees.recipients` |
| Settings proposal builders | basket/admin/DAO settings proposal builders exist, but need cleanup |

Implemented settings parity reads/actions:

| Surface | Source / Logic |
| --- | --- |
| Live permissionless bids flag | v5 RPC `bidsEnabled()`; subgraph value exists but Register reads live |
| Live approved revenue tokens | staking vault `getAllRewardTokens()` plus token metadata |
| Platform fee | DAO fee registry `getFeeDetails(dtf)` or deployer registry defaults |
| Pending fee shares | Folio `getPendingFeeShares()` |
| Pending fee shares USD | pending shares times current DTF price |
| Distribute fees contract call | Folio `distributeFees()` |

Remaining settings parity gap:

| Missing Surface | Source / Logic |
| --- | --- |
| Effective revenue distribution | fee recipients adjusted by platform fee |

Settings conclusion:

- We are close on static/settings metadata because `getDtf` is strong.
- We are not done for Register settings migration until effective revenue distribution is modeled.
- The settings proposal builders should be cleaned before adding more settings actions.

### Vote-Lock Staking

Register has a vote-lock flow separate from the aggregate `/dtf/daos` view.

Implemented read requirements:

| Surface | Source / Logic |
| --- | --- |
| Underlying token price | Reserve API token price helper |
| Underlying wallet balance | ERC20 `balanceOf(account)` |
| Underlying allowance | ERC20 `allowance(account, stToken)` |
| Current delegate | staking vault `delegates(account)` |
| Max unlock amount | staking vault `maxWithdraw(account)` |
| Unlock delay | staking vault `unstakingDelay()` |
| Unstaking manager | staking vault `unstakingManager()` |
| Vote-lock metadata | already partly on `IndexDtf.voteLockVault` from subgraph |
| Per-DTF vote-lock APR | Reserve API `/dtf/daos/{address}?chainId=` |
| Global vote-lock APR/positions | Reserve API `/dtf/daos` |

Write/build requirements:

| Action | Contract Call |
| --- | --- |
| Approve underlying | ERC20 `approve(stToken, amount)` |
| Vote-lock to self | staking vault `depositAndDelegate(amount)` |
| Vote-lock without self-delegate | staking vault `deposit(amount, account)` |
| Delegate voting power | staking vault `delegate(delegatee)` |
| Start unlock | staking vault `withdraw(amount, account, account)` |
| Claim unlocked vote-lock withdrawal | unstaking manager `claimLock(lockId)` |
| Claim vote-lock rewards | staking vault `claimRewards([rewardToken])` |

Recommended SDK shape:

- `sdk.index.getVoteLockState({ address, chainId, account })` for the Register drawer state.
- `sdk.index.getVoteLockDao({ address, chainId })` for per-DTF APR and rewards stats.
- `sdk.index.getVoteLockDaos()` for the aggregate earn/list view.
- `sdk.index.prepareVoteLockDeposit(...)`, `sdk.index.prepareVoteLockUnlock(...)`, and `sdk.index.prepareVoteLockDelegate(...)` as simple contract-call builders.
- `sdk.index.prepareVoteLockClaimRewards({ stToken, chainId, rewardTokens })` and `sdk.index.prepareVoteLockClaimWithdrawal({ unstakingManager, chainId, lockId })` for portfolio actions. `unstakingManager` should come from `getVoteLockState` or an explicit caller-provided read; do not hide that network read in a pure builder.
- Keep `/dtf/daos` as a separate aggregate getter; it is not a replacement for per-account vote-lock actions.
- Add `/dtf/daos/{address}?chainId=` as the per-DTF DAO/APR getter used by Register overview staking.

### Portfolio And Account-Specific Rewards

Register's portfolio page uses account-scoped API endpoints and exposes user actions that overlap with Index DTF vote-locking.

Portfolio read requirements:

| Surface | Source / Logic |
| --- | --- |
| Current portfolio | Reserve API `/v1/portfolio/{account}` |
| Historical portfolio chart | Reserve API `/v1/historical/portfolio/{account}?period=` |
| Portfolio transactions | Reserve API `/v1/portfolio/{account}/transactions` |
| Index DTF positions | `PortfolioResponse.indexDTFs` |
| Vote-lock positions | `PortfolioResponse.voteLocks` |
| Vote-lock rewards | `PortfolioVoteLock.rewards` from portfolio response |
| Pending vote-lock withdrawals | `PortfolioVoteLock.locks` from portfolio response |
| Active governance proposals | `PortfolioVoteLock.activeProposals` plus voting-state derivation |

Portfolio write/build requirements for Index DTF vote-lock positions:

| Action | Contract Call |
| --- | --- |
| Claim available reward | staking vault `claimRewards([rewardToken])` |
| Claim ready vote-lock withdrawal | staking vault `unstakingManager()` then unstaking manager `claimLock(lockId)` |
| Modify vote-lock position | same vote-lock drawer actions: approve, deposit/delegate, withdraw |

Recommended SDK shape:

- Add account-level portfolio getters outside `sdk.index.ref`, because they are wallet/account scoped and cross-product: `sdk.portfolio.get({ account })`, `sdk.portfolio.getHistory({ account, period })`, `sdk.portfolio.getTransactions({ account })`.
- Keep Index DTF vote-lock builders under `sdk.index` because the contracts are Index DTF staking vault contracts.
- Do not make portfolio APIs a blocker for basic Index DTF getters, but include them before claiming SDK/Register parity.

### Protocol And Global Fetchers

Current protocol support:

- `listIndexDtfs()` reads the static `@dtf-interface/dtf-catalog` package.
- `sdk.index.discover()` and root `getDiscoverDtfs()` call Reserve API `/discover/dtfs`.
- Register discovery/status uses Reserve API `/discover/dtfs`, with product options like performance/brand in list views.
- `sdk.index.getVoteLockDaos()` and `sdk.index.getVoteLockDao({ address, chainId })` cover `/dtf/daos` views.
- `client.api.getDtfPrices()` already wraps `/current/dtfs`, but there is no product-shaped `sdk.index` batch method.

Missing global surfaces:

| Missing Surface | Source |
| --- | --- |
| Product-shaped all-DTF discovery | Reserve API `/discover/dtfs`; root `getDiscoverDtfs` exists but is thin |
| Product-shaped single-chain index DTF discovery | Reserve API `/discover/dtf` with `chainId`, `sort`, `limit`, and `offset`; useful for scripts/SDK consumers, not current Register list/status parity |
| Product-shaped batch current DTFs | Reserve API `/current/dtfs`; client API helper exists |

Recommended SDK shape:

- Keep `listIndexDtfs` if we want catalog-only supported assets.
- Add explicit API-backed discovery methods instead of replacing catalog behavior silently.
- Use names that expose source intent: `listCatalogIndexDtfs`, `discoverIndexDtfs`, `discoverDtfs`.
- Do not duplicate lower-level client helpers blindly; expose product-shaped namespace methods only where consumers need them.

### Deploy

Deploy is not the main missing item in this audit, but Register still has deploy logic outside the SDK.

Already covered:

- Initial basket math through `buildIndexDtfInitialBasket`.
- Basket token price fetching through token price helpers.

Missing deploy requirements:

- Platform fee defaults from deployer DAO fee registry.
- Manual `deployFolio` and `deployGovernedFolio` arg builders.
- ERC20 balances/allowances for initial assets.
- Governance params and role validation helpers.

Recommendation:

- Add deploy only after proposal builder cleanup, because deploy builders will otherwise repeat the same optional-input complexity.

## API Shape Guidance

Keep these rules as missing surfaces are added:

- Namespace/direct APIs should use object params for multi-value calls: `sdk.index.getRebalance({ address, chainId, nonce })`.
- Ref APIs should stay flat: `dtf.getRebalances()`, `dtf.getRevenue()`, `dtf.getIssuanceState({ account })`.
- Prepare helpers should return `ContractCall` and any needed context. Consumers own `walletClient` sending.
- Do not hide network calls in model objects or class constructors.
- Do not add generic source/provider abstractions unless a concrete consumer needs them.
- Do not add broad compatibility modes. Current SDK support should stay v5-only; v6 belongs to a future effort track.
- Use bigint for onchain amounts and `Decimal` for USD/price math.
- Keep mappers deterministic. No fetching, time, decoding, or business state derivation inside mappers.

## Suggested Order

1. Continue simplifying proposal builders without changing public API names unnecessarily.
2. Add completed rebalance metrics from Reserve API when the product needs them.
3. Model effective revenue distribution if Register settings migration needs it.
4. Add deploy defaults only after proposal builder cleanup.
5. Add API-backed protocol/global discovery without removing catalog listing.
6. Keep zapper as a separate effort track, and leave trusted filler/CowBot integration to consumers.

## Test Targets

Use behavior tests that catch real migration bugs:

- Mapper fixtures for subgraph rebalances, auctions, bids, transactions, and DTF metadata.
- RPC transform tests for the v5 `getRebalance()` return shape.
- `prepareOpenAuctionArgs` tests using fixed Register-style fixtures and `dtf-rebalance-lib` outputs.
- Issuance tests for asset distribution, max mint, max redeem, allowances, v5 mint args, and redeem min amounts.
- Revenue tests for pending fee shares, platform fee math, and fee recipient splits.
- Vote-lock tests for APR getters, account state, rewards claiming, unlock claiming, delegation, and deposit/withdraw args.
- Portfolio tests for account positions, historical portfolio, transactions, rewards, and pending withdrawals.
- Settings parity tests for live `bidsEnabled`, approved revenue tokens, platform fee, pending fees, and `distributeFees` args.
- Proposal builder regression tests before any cleanup, especially no-call proposals, missing governance/timelock, role diffs, and versioned call names.

## Source References

SDK files:

- `packages/sdk/src/index-dtf/index.ts`
- `packages/sdk/src/index-dtf/dtf/index.ts`
- `packages/sdk/src/index-dtf/dtf/basket/index.ts`
- `packages/sdk/src/index-dtf/dtf/basket/rebalance-args.ts`
- `packages/sdk/src/index-dtf/governance/index.ts`
- `packages/sdk/src/index-dtf/governance/propose/settings-dtf.ts`
- `packages/sdk/src/index-dtf/governance/propose/settings-dao.ts`
- `packages/sdk/src/index-dtf/governance/propose/settings-basket.ts`
- `packages/sdk/src/index-dtf/governance/propose/basket.ts`
- `packages/sdk/src/index-dtf/rebalance/index.ts`
- `packages/sdk/src/index-dtf/protocol/index.ts`
- `packages/sdk/src/types/index-dtf.ts`
- `packages/sdk/src/types/governance.ts`

Register files:

- `/Users/luis/projects/register/docs/data-sources.md`
- `/Users/luis/projects/register/src/hooks/useIndexDTFList.ts`
- `/Users/luis/projects/register/src/views/index-dtf/index-dtf-container.tsx`
- `/Users/luis/projects/register/src/hooks/useIndexDTF.ts`
- `/Users/luis/projects/register/src/hooks/useIndexPrice.ts`
- `/Users/luis/projects/register/src/hooks/useIndexDTFTransactions.ts`
- `/Users/luis/projects/register/src/hooks/use-dtf-status.ts`
- `/Users/luis/projects/register/src/hooks/use-platform-fee.ts`
- `/Users/luis/projects/register/src/state/dtf/atoms.ts`
- `/Users/luis/projects/register/src/views/index-dtf/issuance/manual/updater.tsx`
- `/Users/luis/projects/register/src/views/index-dtf/issuance/manual/atoms.ts`
- `/Users/luis/projects/register/src/views/index-dtf/issuance/manual/components/index-manual-issuance.tsx`
- `/Users/luis/projects/register/src/views/index-dtf/auctions/updater.tsx`
- `/Users/luis/projects/register/src/views/index-dtf/auctions/atoms.ts`
- `/Users/luis/projects/register/src/views/index-dtf/auctions/views/rebalance/atoms.ts`
- `/Users/luis/projects/register/src/views/index-dtf/auctions/views/rebalance/hooks/use-rebalance-params.ts`
- `/Users/luis/projects/register/src/views/index-dtf/auctions/views/rebalance/hooks/use-rebalance-current-data.ts`
- `/Users/luis/projects/register/src/views/index-dtf/auctions/views/rebalance/hooks/use-rebalance-initial-data.ts`
- `/Users/luis/projects/register/src/views/index-dtf/auctions/views/rebalance/hooks/use-rebalance-auctions.ts`
- `/Users/luis/projects/register/src/views/index-dtf/auctions/views/rebalance/utils/get-rebalance-open-auction.ts`
- `/Users/luis/projects/register/src/views/index-dtf/auctions/views/rebalance/components/launch-auctions-button.tsx`
- `/Users/luis/projects/register/src/views/index-dtf/auctions/views/rebalance-list/hooks/use-rebalance-metrics.ts`
- `/Users/luis/projects/register/src/views/index-dtf/overview/components/staking/index.tsx`
- `/Users/luis/projects/register/src/views/index-dtf/overview/components/staking/atoms.ts`
- `/Users/luis/projects/register/src/views/index-dtf/overview/components/staking/lock/submit-lock-button.tsx`
- `/Users/luis/projects/register/src/views/index-dtf/overview/components/staking/unlock/submit-unlock-button.tsx`
- `/Users/luis/projects/register/src/views/index-dtf/settings/components/distribute-fees.tsx`
