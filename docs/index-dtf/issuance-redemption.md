# Issuance And Redemption

Index DTF users can mint shares by depositing basket assets and redeem shares for basket assets. Register also supports zap flows that swap from or to a single token around the direct protocol action.

## Direct Mint

Modern Folio mint call:

```text
mint(shares, receiver, minSharesOut)
```

Mint behavior:

- Caller deposits every basket asset pro-rata.
- Asset amounts are rounded up.
- Receiver receives DTF shares after mint fee.
- `minSharesOut` protects against fee/slippage changes.
- Asset allowances to the Folio constrain how much can be pulled.

Register manual mint computes required assets from `toAssets(1e18, 0)` and user input, checks wallet balances and allowances, then submits mint.

## Direct Redeem

Modern Folio redeem call:

```text
redeem(shares, receiver, assets, minAmountsOut)
```

Redeem behavior:

- Caller burns DTF shares.
- Receiver gets proportional basket assets.
- Asset amounts are rounded down.
- `assets` must match the basket expected by the contract.
- `minAmountsOut` protects the user.

Register manual redeem uses a fixed product slippage buffer for min amounts.

## Zap Flow

Zap is the primary Register UX for normal users:

- Mint zap: user provides one token, zapper swaps into basket assets, then mints.
- Redeem zap: user redeems DTF shares and swaps outputs toward a desired token.
- Deprecated DTFs are sell-only.

The zapper returns transaction payloads. Core SDK direct mint/redeem builders should not become a zapper client unless a product consumer needs that API.

## Manual Flow

Manual mint/redeem exists as a fallback for users who want direct basket actions or when zap is unavailable.

Manual mint requires:

- DTF address.
- chain ID.
- basket assets.
- per-share asset requirements.
- user balances.
- allowances from user to DTF.
- mint fee or min-shares guard.

Manual redeem requires:

- DTF share balance.
- basket assets.
- expected output amounts.
- `minAmountsOut`.

## Approvals

Mint requires approval for each basket asset that needs to be pulled. Register supports batch approval and individual approval.

Approval behavior to mirror carefully:

- unlimited approval can be a UI option.
- otherwise Register-style approval can approve a buffered amount.
- USDT-like tokens may require revoke-before-approve behavior.

The SDK should prepare approval calls, not send them.

## Data Needed

| Need                        | Source                                                 |
| --------------------------- | ------------------------------------------------------ |
| Basket assets/balances      | RPC `totalAssets()`                                    |
| Per-share assets            | RPC `toAssets(...)` or SDK calculation from live state |
| User balances               | RPC ERC20 `balanceOf`                                  |
| Allowances                  | RPC ERC20 `allowance`                                  |
| Current prices/display      | Reserve API                                            |
| Deprecated/sell-only status | Reserve API discovery/status                           |

## SDK Scope

Core SDK should provide:

- direct mint call builder.
- direct redeem call builder.
- basket asset approval builder.
- mint plan with approvals.
- min amount/share helpers when product rules are stable.

Core SDK should not own:

- wallet state.
- chain switching.
- zapper API request lifecycle.
- approval transaction retries.
- UI slippage modals.

## Source References

- `reserve-index-dtf/contracts/Folio.sol`
- `register/src/views/index-dtf/issuance/index.tsx`
- `register/src/views/index-dtf/issuance/manual/*`
- `register/src/views/index-dtf/components/zapper/*`
- `register/src/views/index-dtf/overview/components/zap-mint/*`
- `dtf-sdk/packages/sdk/src/index-dtf/dtf/issuance-calls.ts`
- `docs/plans/zapper-integration.md`

## Do Not Infer

- Do not treat zap quotes as direct protocol mint previews.
- Do not use subgraph basket data for manual mint/redeem amounts.
- Do not assume every deployed version uses the same mint signature.
