# Yield DTF Protocol — SDK Reference

Internal reference for SDK work, distilled from the protocol repo (`~/projects/protocol`), the reserve-subgraph (`~/projects/reserve-subgraph`), and Register's yield-dtf implementation (`~/projects/register/src/views/yield-dtf`, `src/state/rtoken`). Written 2026-06-12 alongside SDK Phase 1.

## Naming history

"RToken" is the original name for what we now call a **Yield DTF**. When the Index protocol (internally "Folio") launched, naming standardized to Index DTF / Yield DTF. Every `RToken`, `rtoken`, `stRSR` reference in the protocol, subgraph, and Register means Yield DTF. The SDK uses Yield DTF naming in its public API but keeps contract-true names for ABIs (`rTokenAbi`, `stRsrAbi`).

## Architecture: hub and spoke

A completely different protocol from Index DTF. Each Yield DTF is a system of contracts deployed together, with **Main** as the hub. Components find each other through Main:

| Component                    | Role                                                                                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RToken`                     | The ERC20 itself; elastic supply backed by `basketsNeeded` basket units. `issue`/`redeem`/`redeemCustom` with hourly throttles.                                                       |
| `BasketHandler`              | Basket configuration + quotes; `nonce` increments on basket change; `fullyCollateralized`.                                                                                            |
| `BackingManager`             | Holds backing collateral; runs recollateralization auctions (`rebalance(kind)`).                                                                                                      |
| `AssetRegistry`              | Registered asset plugins (price feeds, collateral status).                                                                                                                            |
| `StRSR`                      | RSR staking vault (per-DTF). Overcollateralization: staked RSR is seized first on undercollateralization. ERC20 with eras + withdrawal queue.                                         |
| `Furnace`                    | Melts RToken revenue → appreciates the token for holders.                                                                                                                             |
| `Distributor`                | Splits revenue between furnace (holders) and stRSR (stakers) + optional external destinations, in basis points of 10000. Sentinel destinations: `0x..01` = furnace, `0x..02` = stRSR. |
| `Broker`                     | Trade factory; opens `DutchTrade` (falling-price) or `GnosisTrade` (batch) clones.                                                                                                    |
| `RSRTrader` / `RTokenTrader` | Revenue traders converting surplus to RSR / RToken.                                                                                                                                   |

UUPS proxies throughout; every contract reports `version()` (current protocol 4.2.0; live DTFs span 3.x–4.x). `Main.upgradeRTokenTo(versionHash)` upgrades via the `VersionRegistry`.

**Roles** (AccessControl on Main): `OWNER` (governance), `PAUSER`, `SHORT_FREEZER`, `LONG_FREEZER`. Frozen = only staking; trading-paused = no backing trades; issuance-paused = no minting.

## The Facade: how everything is read

**No Reserve API for Yield DTFs — all prices and quotes are on-chain.** The Facade is a diamond-style router (ReadFacet/ActFacet/MaxIssuableFacet/RevenueFacet behind one address) and is the read gateway:

| Method                                             | Returns                                                   | SDK Phase 1 use                                |
| -------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| `price(rToken)`                                    | `(low, high)` D18 USD                                     | `getYieldDtfPrice` (midpoint as display price) |
| `basketBreakdown(rToken)`                          | erc20s, uoaShares (D18 fractions), target names (bytes32) | `getYieldDtfBasket`                            |
| `primeBasket(rToken)`                              | erc20s, target names, target amounts                      | `getYieldDtfBasket` (targetAmount)             |
| `backingOverview(rToken)`                          | backing fraction, overcollateralization fraction          | `getYieldDtfBasket`                            |
| `backingBuffer(rToken)`                            | required, actual                                          | `getYieldDtfBasket`                            |
| `basketTokens(rToken)`                             | collateral addresses                                      | `getYieldDtf` collaterals                      |
| `stToken(rToken)`                                  | stRSR address                                             | available; SDK reads it from Main instead      |
| `issue(rToken, amount)`                            | tokens + deposits needed                                  | `getYieldDtfIssuanceQuote`                     |
| `redeem(rToken, amount)`                           | tokens + withdrawals + available                          | `getYieldDtfRedemptionQuote`                   |
| `maxIssuable(rToken, account)`                     | max issuable                                              | `getYieldDtfMaxIssuable`                       |
| `pendingUnstakings(rToken, draftEra, account)`     | `{index, availableAt, amount}[]`                          | `getYieldDtfStakingState`                      |
| `auctionsSettleable(trader)` / `revenues(rTokens)` | auction surfaces                                          | Phase 3                                        |

Most facade "reads" are `stateMutability: nonpayable` (callStatic pattern) — the SDK calls them via `simulateContract`/`eth_call`, never as transactions.

**Addresses** (also in `packages/sdk/src/yield-dtf/config.ts`): FacadeRead mainnet `0x2C7c...0613`, base `0xeb20...3991`; FacadeAct mainnet `0xCa60...2d98`, base `0x72Be...42f5`; RSR mainnet `0x3206...5d70`, base `0xaB36...f64a`.

**Gotcha — `draftEra`**: `StRSR` has no public getter for it; Register (and now the SDK) reads storage slot `0x...0109` directly before calling `pendingUnstakings`.

## Issuance and redemption

- Quote with the facade, approve each collateral **to the RToken contract**, then `RToken.issue(amount)`.
- `redeem(amount)` returns the current basket prorata. `redeemCustom(recipient, amount, basketNonces[], portions[], expectedERC20sOut[], minAmounts[])` redeems against historical basket nonces — used mid-rebalance.
- Throttles limit hourly issuance/redemption to `max(amtRate, supply × pctRate)`; read both params and the currently `available` amounts from RToken.
- Issuance premium (3.2+, when `enableIssuancePremium`) makes issuance slightly more expensive when collateral is depegged.

## Staking (RSR ↔ stRSR)

- `stake(rsrAmount)` (needs RSR approval to the vault) mints stRSR at `exchangeRate()` (RSR per stRSR, D18, monotonically grows as staker revenue accrues — except seizures).
- `unstake(stAmount)` burns stRSR into a **draft queue**; after `unstakingDelay`, `withdraw(account, endId)` releases drafts with id < endId. `cancelUnstake(endId)` re-stakes pending drafts.
- **Eras**: if all RSR is seized (full default), `era` increments and balances reset. Drafts have their own `draftEra`.
- Stake history lives in the subgraph (`accountStakeRecords` keyed `${account}-${rtoken}`, lowercase) with the exchange rate at each event — this is how Register computes staking rewards per account.

## Governance (Phase 2 target)

Standard **OZ Governor** over `StRSRVotes` + `TimelockController`, one Governor per DTF. Flavors: "Alexios" (block-based voting, legacy) and "Anastasius" (timepoint-based; read `quorum(timepoint)`/`quorumNumerator(timepoint)` on-chain because the subgraph values go stale). Proposal lifecycle, votes, delegates, and `governanceFrameworks` (params + timelock) are all indexed in the subgraph under `governance(id: rtokenAddress)`. The vote/queue/execute/cancel call builders are the same OZ shapes as Index DTF governance — extract shared builders from `index-dtf/governance/proposal-actions.ts` when Phase 2 lands.

Proposal building (Phase 4) maps parameter names to component setters (Register's `parameterContractMapAtom`): `tradingDelay`/`backingBuffer`/`maxTradeSlippage`/`minTrade` → BackingManager (+ traders), `rewardRatio` → Furnace+StRSR, `unstakingDelay`/`withdrawalLeak` → StRSR, `warmupPeriod`/`enableIssuancePremium` → BasketHandler, auction lengths → Broker, throttles → RToken, freezes → Main; plus role changes, basket/backup changes, asset registration, and upgrade spells.

## Auctions and revenue (Phase 3 target)

Two trade kinds opened by the Broker: `DutchTrade` (4-piece falling price: geometric 1000x→1.5x defense, then linear to best, linear to worst, flat tail; `bidAmount(timestamp)` quotes, `bid()` executes) and `GnosisTrade` (sealed-bid batch via EasyAuction). Sources: revenue auctions (RSRTrader/RTokenTrader surpluses, run via `FacadeAct.runRevenueAuctions(trader, toSettle, toStart, kinds)`) and recollateralization (`BackingManager.rebalance(kind)`, next auction previewed by `FacadeAct.nextRecollateralizationAuction`). `FacadeAct.claimRewards(rToken)` claims collateral rewards. Historical trades are indexed in the subgraph `Trade` entity (`kind`: 0 dutch / 1 batch, settled flags).

## APY (Phase 4 target)

Two distinct APYs:

1. **Estimated (forward-looking)** — Register's headline number. `basketYield = Σ(collateral 30d APY from DefiLlama × basket share)`; `holdersApy = basketYield × holdersShare`; `stakersApy = (basketYield × supplyUsd / stakedUsd) × stakersShare` (stakers are leveraged by the supply/stake ratio). Collateral APYs come from DefiLlama `https://yields.llama.fi/pools` via a pool-id → collateral-symbol map (Register `CollateralYieldUpdater.tsx`, ~50 entries/chain — to be absorbed by the SDK per product decision).
2. **Realized staking APY (historical)** — growth of `rsrExchangeRate` between subgraph `RTokenDailySnapshot`s: `((rateB / rateA) - 1) × (365 / days) × 100`.

## Subgraph (reserve-subgraph)

Deployed per chain (SDK config: Goldsky `dtf-yield-mainnet` / `dtf-yield-base`, tag 4.2.0-v2). Key entities:

- `RToken` — supply stats, roles, `rsrExchangeRate`/`rawRsrExchangeRate`, `rsrStaked` (BigInt raw), `basketsNeeded` (BigInt raw), `targetUnits`, reward shares, `revenueDistribution`, `collaterals` (id+symbol only — **no decimals**, hence the SDK's on-chain ERC20 metadata pass).
- `Token` — ERC20 supply/holder/transfer counts (BigInt raw), `lastPriceUSD` (BigDecimal).
- `AccountRToken` + `AccountStakeRecord` — staking positions and history (both raw + BigDecimal fields; SDK maps `*Raw` to `Amount`).
- `RTokenDailySnapshot` / `HourlySnapshot` — APY timeseries (`rsrExchangeRate`, revenue, staking flows).
- `Governance` / `GovernanceFramework` / `Proposal` / `Vote` / `Delegate` / `TokenHolder` — governance (Phase 2).
- `Trade` — auction history (Phase 3).
- `Entry` — typed activity feed (TRANSFER/STAKE/UNSTAKE/WITHDRAW/...), amounts in **BigDecimal human units** (display-class in the SDK).

Scalar rule of thumb in this subgraph: `*Raw` and counters are BigInt (map to `Amount`/counts); `*USD`, exchange rates, and entry/balance amounts are BigDecimal (display-class numbers).

## Differences vs Index DTF that shape the SDK

|             | Yield DTF                                                | Index DTF                                                   |
| ----------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| Prices      | On-chain facade                                          | Reserve API                                                 |
| Basket      | Target-unit basket + backing + RSR overcollateralization | Weighted token basket                                       |
| Staking     | Per-DTF stRSR vault over RSR                             | Vote-lock vault over arbitrary underlying                   |
| Revenue     | Distributor split holders/stakers (bps of 10000)         | Minting/TVL fees                                            |
| Governance  | One OZ Governor per DTF over StRSRVotes                  | Multiple governances (owner/trading/vote-lock) + optimistic |
| Rebalancing | Dutch/Batch auctions vs collateral, defensive            | Programmatic rebalances + auctions                          |
| Subgraph    | `rtoken` entities, BigDecimal-heavy                      | `dtf` entities, raw-heavy                                   |
| Chains      | 1, 8453 (SDK; Arbitrum exists but unconfigured)          | 1, 8453, 56                                                 |

## SDK phase map

- **Phase 1 (shipped)**: core reads, issuance, staking, react-sdk hooks, tests, live smoke. `sdk.yield.*` + `useYieldDtf*`.
- **Phase 2**: governance reads + actions (shared OZ governor builders), Anastasius quorum override, roles.
- **Phase 3**: auctions/revenue (FacadeAct), trades history, dutch bids, claim rewards.
- **Phase 4**: APY (DefiLlama absorption + snapshot-based realized APY), proposal building, Register yield migration.

Full phase specs live in `docs/IMPROVEMENT_PLAN.mdx`.
