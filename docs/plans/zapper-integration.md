# Zapper Integration Plan

Status: pending. Core SDK currently documents Zapper as an integration boundary, not an implemented SDK namespace.

## Why This Exists

Register uses Zapper for primary Index DTF mint/redeem UX and simple deploy flows. The direct SDK builders cover protocol calls, but they do not cover quote routing, swap payloads, or Zapper deploy transaction payloads.

This plan captures what would be needed if a product consumer wants Zapper in the SDK.

## Current Implemented Boundary

Implemented in SDK:

- direct Index DTF mint call builder.
- direct Index DTF redeem call builder.
- basket approval builders.
- direct ungoverned/governed deploy builders.
- deploy asset approval builders.
- deploy event extraction helpers.

Not implemented in SDK:

- Zapper quote client.
- zap mint/redeem builder.
- Zapper deploy client.
- Zapper token list/volatility wrapper.
- Zapper health checks.

## Source Behavior

Register behavior:

- primary issuance page uses `@reserve-protocol/react-zapper`.
- deprecated DTFs are sell-only.
- BSC disables Odos provider.
- high price impact requires user acknowledgement.
- approval can precede the zap tx.
- zap tx payload is submitted by the app.
- simple deploy uses Zapper API payload and returned transaction.

Zapper API shape observed from Register/react-zapper sources:

- base path shape includes `/api/zapper/{chainId}` in product config.
- quote/swap endpoint for token-in/token-out routing.
- deploy endpoint for governed/simple deploy.
- ungoverned deploy endpoint.
- token list endpoint.
- health endpoint.

Verify endpoint paths against current product source before coding.

## Proposed SDK Scope

Add only if a consumer needs it:

- `sdk.index.zapper.getQuote(params)` or a clearly named direct function.
- `sdk.index.zapper.prepareZap(params)` if the quote and transaction payload need SDK normalization.
- `sdk.index.zapper.prepareDeploy(params)` only for Zapper deploy payloads, separate from direct deploy builders.
- token list helper if product needs volatility/token support data in SDK.

Return prepared payloads. Do not send transactions.

## API Shape Rules

- Keep Zapper under an explicit namespace or explicit function names.
- Do not make direct mint/deploy builders call Zapper internally.
- Do not hide provider routing behind generic issuance names.
- Preserve chain ID and addresses as explicit params.
- Keep approval payload separate from zap payload.

## Out Of Scope

- wallet connection.
- RainbowKit/wagmi behavior.
- price-impact modal state.
- transaction notifications.
- automatic provider selection beyond what Zapper API returns.
- replacing direct protocol builders.

## Open Questions

- Which product consumer needs SDK-owned Zapper first?
- Should SDK wrap `react-zapper` behavior or call the HTTP API directly?
- Should deploy Zapper live under `sdk.index.deploy` or `sdk.index.zapper`?
- Which response fields are stable enough to type as public SDK API?
- How should BSC provider restrictions be represented outside Register?

## Validation Plan

Before implementation:

- inspect current Register Zapper source.
- inspect current `react-zapper` source.
- verify endpoint paths and request/response shapes.
- add tests with mocked API responses.
- ensure direct deploy/mint/redeem tests remain independent.

After implementation:

- typecheck SDK.
- test SDK.
- build SDK.
- run docs examples only after API names are final.

## Source References

- `register/src/views/index-dtf/issuance/*`
- `register/src/views/index-dtf/components/zapper/*`
- `register/src/views/index-dtf/overview/components/zap-mint/*`
- `register/src/views/index-dtf/deploy/steps/confirm-deploy/simple/*`
- `react-zapper/src/*`
- `docs/integrations/zapper.md`

## Do Not Infer

- Do not treat this plan as implemented API.
- Do not add Zapper to core direct deploy behavior.
- Do not publish endpoint shape without rechecking source.
