# Zapper Integration

Zapper is a separate integration boundary from core Index DTF protocol builders.

## Current Boundary

Core SDK should own:

- direct mint/redeem builders.
- direct deploy builders.
- approval builders.
- product-shaped helpers for direct protocol calls.

Zapper integration should own:

- quote requests.
- swap routing.
- single-token mint UX.
- redeem-to-single-token UX.
- Zapper deploy transaction payloads.
- provider-specific quote/send behavior.

## Register Behavior

Register uses Zapper for the primary Index DTF mint/redeem page and a simple deploy path. The returned transaction payload is sent by the app.

Important behavior:

- disconnected wallets show connect flow.
- BSC disables Odos provider.
- deprecated DTFs are sell-only.
- approval can precede the zap tx.
- high price impact requires explicit acknowledgement.

## SDK Rule

Do not add zapper mint/redeem/deploy wrappers to core SDK until there is a concrete consumer and a reviewed API shape. Pending implementation notes live in `docs/plans/zapper-integration.md`.

## Source References

- `register/src/views/index-dtf/issuance/*`
- `register/src/views/index-dtf/components/zapper/*`
- `register/src/views/index-dtf/overview/components/zap-mint/*`
- `register/src/views/index-dtf/deploy/steps/confirm-deploy/simple/*`
- `react-zapper/src/*`

## Do Not Infer

- Do not treat Zapper quotes as protocol previews.
- Do not merge Zapper deploy with direct Folio deploy builders.
