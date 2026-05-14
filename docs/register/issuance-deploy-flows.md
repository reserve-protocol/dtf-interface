# Register Issuance And Deploy Flows

This doc captures Register product behavior around mint/redeem and deploy surfaces.

## Issuance Routes

Register has two Index DTF issuance modes:

- main mint/redeem page using zapper.
- manual mint/redeem fallback.

The main issuance page uses `@reserve-protocol/react-zapper`. Deprecated DTFs are sell-only.

## Zapper UX

Zapper flow behavior:

- wallet disconnected state opens RainbowKit connect.
- BSC disables Odos provider.
- quote source defaults to best.
- user can set slippage.
- high price impact requires explicit warning acknowledgement.
- approval can be needed before the zap transaction.
- approval amount uses a product buffer.
- zap transaction is submitted from returned `{ to, data, value, gas }` payload.

Core SDK docs should keep zapper behavior separate from direct protocol mint/redeem builders.

## Manual Mint/Redeem

Manual page reads:

- user DTF balance.
- user basket asset balances.
- basket asset allowances to DTF.
- per-1-DTF asset distribution through `toAssets(1e18, 0)`.

Manual mint validates every required asset balance and allowance.

Manual redeem validates DTF balance.

Manual redeem applies a product slippage buffer to min output amounts.

## Manual Approvals

Register supports:

- approve all.
- individual approvals.
- unlimited approval mode.
- buffered finite approvals.
- USDT-like revoke-before-approve handling.

SDK builders should prepare approval calls. Retry/fallback UX belongs to the app.

## Permissionless Deploy

Permissionless deploy behavior:

- public route exists separately from older coming-soon deploy route.
- defaults to Base.
- locks several steps readonly in the permissionless flow.
- forces governance option to an existing vote-lock.
- forces basket input to share mode.
- injects connected wallet as brand manager, guardian, and auction launcher.
- fetches basket token prices from Reserve API.
- validates ERC20 tokens and vote-lock addresses.

## Deploy Defaults

Register product defaults include:

- fixed platform fee per chain/config.
- Folio TVL fee default.
- mint fee default.
- governance share derived from platform fee.
- deployer share default can be zero.
- auction length default of 30 minutes.
- weight control enabled.
- bids enabled.
- default governance timing for basket and non-basket governance.

Treat these as product defaults. Verify before making SDK defaults.

## Source References

- `register/src/views/index-dtf/issuance/*`
- `register/src/views/index-dtf/components/zapper/*`
- `register/src/views/index-dtf/overview/components/zap-mint/*`
- `register/src/views/index-dtf/deploy/permissionless/index.tsx`
- `register/src/views/index-dtf/deploy/permissionless-defaults.ts`
- `register/src/views/index-dtf/deploy/atoms.ts`
- `register/src/views/index-dtf/deploy/updater.tsx`
- `register/src/views/index-dtf/deploy/utils/index.ts`

## Do Not Infer

- Do not treat Register simple deploy/Zapper deploy as direct Folio deploy.
- Do not move wallet UX into SDK core.
- Do not hardcode deploy defaults without source verification.
