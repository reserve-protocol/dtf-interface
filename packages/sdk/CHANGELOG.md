# @reserve-protocol/sdk

## 0.1.0

### Minor Changes

- Add Index DTF proposal decoding and proposal action support.

  The SDK now supports explorer-backed proposal calldata enrichment, optimistic governance spell decoding, voting snapshot/proposer state fixes, and proposal action call builders used by React SDK integrations.

## 0.0.1

### Patch Changes

- [`0ac1d50`](https://github.com/reserve-protocol/dtf-interface/commit/0ac1d50b162900a364f85f9ca11eb6bc375e324f) Thanks [@lcamargof](https://github.com/lcamargof)! - Initial SDK release for Index DTF integrations. Includes Reserve API and subgraph discovery, on-chain basket and supply reads, issuance and redemption planning, revenue and fee helpers, rebalance and auction reads/builders, vote-lock reads/actions, and governance proposal reads/builders/actions with optimistic governance support.

- [#1](https://github.com/reserve-protocol/dtf-interface/pull/1) [`1a67a57`](https://github.com/reserve-protocol/dtf-interface/commit/1a67a571363614c5e961b9c7c2e1c9f70d5ed1bc) Thanks [@akshatmittal](https://github.com/akshatmittal)! - Adopt tsdown builds, shared TypeScript config, Turborepo, and root lint, format, and release tooling.
