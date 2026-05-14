# Yield DTF Issuance And Redemption

Yield DTF issuance and redemption are RToken protocol actions, not Folio mint/redeem actions.

## Issue

Users issue Yield DTF tokens by providing the required collateral backing through protocol contracts.

Important concepts:

- issue amount is denominated in the Yield DTF token.
- collateral requirements depend on current basket/backing state.
- throttles and protocol status can affect issuance.
- live reads should come from RPC/facade functions rather than stale indexed data.

## Redeem

Users redeem Yield DTF tokens for collateral according to protocol state.

Important concepts:

- redemption depends on current backing and basket status.
- outputs can include multiple collateral tokens.
- protocol status and throttles can affect redemption.

## SDK Implications

Yield issue/redeem builders should be separate from Index DTF mint/redeem builders.

Do not expose a generic `mint` abstraction that hides whether the target is a Folio or an RToken. The mechanics and data dependencies differ.

## Source References

- `protocol-docs-website/protocol_pages/protocol/yield_dtfs/mint_redeem.md`
- `protocol-docs-website/protocol_pages/protocol/yield_dtfs/protocol_operations.md`
- `reserve-sdk/docs/yield-dtf-reference.md`
- `reserve-sdk/packages/sdk/src/yield-dtf/*`

## Do Not Infer

- Do not use Index DTF `mint(shares, receiver, minSharesOut)` for Yield DTFs.
- Do not use Folio basket math for Yield DTF issue/redeem.
