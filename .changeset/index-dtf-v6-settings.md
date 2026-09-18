---
"@reserve-protocol/sdk": minor
---

Index DTF: Folio 6.0 settings and revenue proposals.

- `buildIndexDtfSettingsProposal` accepts `selfFee` (percent kept for holders), `tradeAllowlist: { enabled?, add?, remove? }` and, for revenue changes on 6.0.0, `immutableFeeRecipients`. When the table is omitted the client-bound builder reads it from RPC. The mutable shares are scaled into whatever the immutable table leaves; v5 DTFs reject the v6-only fields by name.
- `prepareIndexDtfSetFeeRecipients` on 6.0.0 sorts both tables by address and rejects tables that do not total 100%, mirroring FolioLib so a bad table fails at build time. Folio 6.0 deploys apply the same check.
- New `sortIndexDtfFeeRecipients`, `scaleIndexDtfFeeRecipients`, `assertIndexDtfFeeRecipientTables` helpers.
