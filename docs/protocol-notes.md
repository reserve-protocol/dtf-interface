# Protocol Notes

Working notes for Reserve protocol context that affects SDK implementation. Keep this file practical: concepts, invariants, and product flows that are easy to forget while writing SDK code.

## Index DTF Data Sources

- Live basket state comes from RPC, not the subgraph.
- `totalAssets()` gives basket token addresses and total holdings.
- `totalSupply()` gives current DTF share supply.
- Reserve API prices are used to convert raw token balances/units into USD value and basket shares.
- Governance metadata and historical proposals come from the Index DTF subgraph.
- Proposal execution state should be treated as onchain truth when freshness matters.

## Basket Model

- The protocol tracks D27 token weights and D18 basket-unit limits, not human percentages.
- A Basket Unit `{BU}` is usually configured 1:1 with one DTF share, but the contracts allow `{BU/share}` limits in `(0, 1e27]`.
- A basket asset has two useful views:
  - Units: token amount per DTF share or basket unit, using token decimals.
  - Shares: percentage of basket USD value, derived from units and prices.
- Shares are a UI/product view. They require prices and should use high precision math.
- Use `@reserve-protocol/dtf-rebalance-lib` for basket/rebalance math where possible.
- The key helper for `units -> shares` is `getBasketDistribution`.
- The key helper for `startRebalance` args is `getStartRebalance`.

## Basket Types

- Native DTF:
  - `weightControl = true`.
  - User thinks in target weights, like 50% BTC and 50% USDC.
  - Rebalances can update target shares directly, like 40/60.
  - UI can expose both shares and units, defaulting to shares.
- Tracking DTF:
  - `weightControl = false`.
  - User thinks in units, like 0.1 BTC and 1 USDC per DTF.
  - Rebalances update target units.
  - Shares are derived only for display/validation.
- Hybrid DTF:
  - Protocol only exposes `weightControl`; it does not know a separate hybrid mode.
  - Product/UI identifies hybrid DTFs from metadata/hardcoded lists.
  - User inputs units during basket proposal.
  - Rebalance starts with `weightControl = true` and deferred weights so the basket can be updated before auctions.

## Basket Construction Use Cases

There are only three product cases that should drive SDK basket builders:

- Deploy a new Index DTF.
- Build a rebalance basket proposal.
- Build a hybrid DTF rebalance proposal with updated weights.

Avoid generic basket manager abstractions. Basket code should be small, explicit, and readable.

## Deploy Basket Flow

Deploy needs:

- Asset addresses.
- Asset decimals.
- Asset prices.
- User basket input as shares or units.
- Initial DTF share price in USD, usually `$1` but user configurable.
- Initial shares to mint.

Register behavior:

- Share input is human percent, like `50` for 50%.
- Unit input is human token units, like `1` USDC, not raw smallest units.
- Unit input is a ratio source, not final deploy amounts.
- Register converts unit ratios to derived shares, then scales amounts from shares.
- Deploy `amounts` are always calculated from shares, initial share price, initial shares, token prices, and decimals.

Deploy formula for each token:

```text
amount = (initialShares / 1e18) * initialSharePriceUsd * (shareD18 / 1e18) / tokenPrice
```

Then parse the human token amount with that token's decimals.

Important distinction:

- SDK proposal/user inputs should use human units as strings/numbers.
- Low-level pure helpers can use raw bigint units when clearly named and typed.
- Do not silently accept raw bigint units in user-facing proposal inputs.

## Rebalance Basket Flow

Rebalance needs:

- Current total supply.
- Current basket token balances from `totalAssets()`.
- Token decimals.
- Current token prices.
- Target basket as shares or units.
- Price error per token.
- Max auction size in USD per token.
- `weightControl`.
- `deferWeights`.

The SDK should convert target input into D18 shares, then call:

```text
getStartRebalance(FolioVersion.V5, supply, tokens, balances, decimals, targetBasket, prices, priceErrors, maxAuctionSizesUsd, weightControl, deferWeights)
```

Current supported Index DTF basket proposal flow is v5-only. Do not add v2/v4 compatibility paths unless product support comes back.

Contract constraints verified against `reserve-index-dtf` v5:

- `startRebalance()` is callable only by `REBALANCE_MANAGER`.
- `startRebalance()` ends the current auction path by replacing rebalance details for the provided token set.
- `tokens.length` must be greater than 1.
- Every token param must have `inRebalance = true`, a nonzero/non-self token address, and no duplicates.
- `ttl` must be nonzero, greater than or equal to `auctionLauncherWindow`, and no more than `MAX_TTL`.
- `MAX_TTL = 604800 * 4`, or 4 weeks.
- Rebalance limits must satisfy `0 < low <= spot <= high <= 1e27`.
- If `weightControl = false`, token weights must be fixed: `low == spot == high`.
- If `weightControl = true`, weights can be ranges, but `spot == 0` requires `high == 0` so permissionless basket removal cannot be griefed.
- Price ranges must satisfy `0 < low < high <= 1e45` and `high <= 100 * low`.
- `bidsEnabled` is read from the Folio setting when the rebalance starts; it is not a proposal calldata arg.
- If the Folio trade allowlist is enabled, non-allowlisted tokens can only be traded out with zero weights.

Contract constants that affect SDK validation/defaults:

- `AUCTION_WARMUP = 30` seconds.
- `MIN_AUCTION_LENGTH = 120` seconds.
- `MAX_AUCTION_LENGTH = 604800` seconds.
- `RESTRICTED_AUCTION_BUFFER = 120` seconds.
- `MAX_LIMIT = 1e27`.
- `MAX_WEIGHT = 1e54`.
- `MAX_TOKEN_BUY_AMOUNT = 1e36`.
- `MAX_TOKEN_PRICE = 1e45`.
- `MAX_TOKEN_PRICE_RANGE = 100`.

Mode mapping:

- Native proposal from shares: `weightControl = true`, `deferWeights = false`.
- Native proposal from units: convert units to target shares, `weightControl = true`.
- Tracking proposal from units: convert units to target shares, `weightControl = false`.
- Hybrid proposal from units: convert units to target shares, `weightControl = true`, `deferWeights = true`.

## Governance Model

Index DTFs can have multiple governance domains:

- Owner/admin governance for broad DTF settings and ownership-level changes.
- Basket/rebalance governance for basket changes and rebalance settings.
- Vote-lock/staking governance for vote-lock specific changes.
- Some deployments may share owner and basket governance.
- Historical/legacy governance contracts still matter for old proposals.

Proposal lifecycle:

```text
PROPOSE -> VOTE -> QUEUE -> EXECUTE
```

Rebalance proposal lifecycle after execution:

```text
EXECUTE -> LAUNCHER WINDOW -> COMMUNITY WINDOW -> AUCTION -> BID -> REPEAT -> EXPIRE
```

SDK proposal payloads use OpenZeppelin Governor-style arrays:

- `targets`.
- `values` are zero for SDK-built proposals.
- `calldatas`.
- `description`.
- Queue/execute use the description hash.

Cancellation goes through the timelock operation id when available. Legacy operation ids require reconstructing timelock params and salt.

Governance notes:

- Proposal IDs are unique and very long decimal strings.
- Do not add DTF membership checks around Index DTF proposal IDs unless the data model changes.
- V5 governed deployments can have separate owner and trading governors.
- The trading timelock receives `REBALANCE_MANAGER` unless existing basket managers are provided at deploy time.
- The owner timelock receives `DEFAULT_ADMIN_ROLE` and owns the Folio proxy admin.
- Register labels owner timelock guardians as guardians, but the contract role is Timelock `CANCELLER_ROLE`.
- Basket settings proposals normally target basket/rebalance governance.
- DAO/settings proposals may target owner governance, basket governance, timelock, DTF, staking token, or vote-lock governance depending on the change.

## Deploy Contract Flow

- `FolioDeployer.deployFolio()` requires `assets.length == amounts.length`.
- The deployer transfers each initial token amount from `msg.sender` into the new Folio proxy before calling `initialize()`.
- `Folio.initialize()` requires nonzero `initialShares`, at least one asset, nonzero asset addresses, and a nonzero Folio balance for each asset.
- Initial DTF shares are minted to the deploy caller.
- The deployer grants roles after initialization: owner admin, basket managers as `REBALANCE_MANAGER`, auction launchers as `AUCTION_LAUNCHER`, and brand managers as `BRAND_MANAGER`.

## Auction Contract Flow

- `openAuction()` is callable only by `AUCTION_LAUNCHER` during the restricted window.
- `openAuctionUnrestricted()` is callable by anyone after `restrictedUntil`, uses all in-rebalance tokens, collapses weights/limits to spot values, and uses initial prices.
- Only one auction is intended to be live at a time; opening a new restricted auction closes the previous auction if needed.
- Non-atomic auctions start after `AUCTION_WARMUP` and run for the selected auction length.
- Atomic swaps require `priceControl = ATOMIC_SWAP`, use equal low/high prices for all tokens, and start/end in the same timestamp.
- Permissionless `bid()` reverts when the rebalance's captured `bidsEnabled` is false.
- Trusted fills are the alternative async fill path when the trusted filler registry is configured and enabled.
- `totalAssets()` includes active trusted-fill balances, but contract docs still warn consumers to check `stateChangeActive()` before strongly relying on Folio state mid-swap.
- `totalSupply()` includes pending fee shares, so SDK price/share calculations should use RPC `totalSupply()` rather than cached ERC20 supply assumptions.

## SDK Implementation Rules

- Keep protocol helpers product-shaped, not framework-shaped.
- Prefer explicit functions over wrapper chains.
- Mappers should only convert raw shapes; do not hide fetching, time, or business decisions inside mappers.
- Basket math should be deterministic and easy to test.
- Fetching prices/decimals/balances belongs in builder functions, not low-level math helpers.
- Use `Decimal` for USD/value math and bigint for onchain amounts.
- Do not use `Number` for onchain token amounts.
- Keep token order stable across parallel arrays: assets, amounts, balances, prices, target shares, and calldata args.
