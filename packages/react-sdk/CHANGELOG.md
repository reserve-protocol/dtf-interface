# @reserve-protocol/react-sdk

## 0.1.4

### Patch Changes

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.3

## 0.1.2

### Patch Changes

- Remove the re-exported SDK wallet client helper from the React package surface.
- Add portfolio, revenue, and rebalance query options/hooks backed by existing SDK methods.
- Move extra Index DTF query options onto shared `dtfQueryKeys` helpers.
- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.2

## 0.1.1

### Patch Changes

- Fix `wasChallenged` detection for confirmation proposals whose original optimistic description has trailing whitespace. `getChallengeDescription` no longer trims the extracted description, so the subgraph challenge lookup matches the exact stored value instead of failing on a trailing newline/space.

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.1

## 0.1.0

### Minor Changes

- Add Index DTF proposal decoding and proposal action hooks.

  The React SDK now exposes proposal decode, voting snapshot, and proposal action call hooks, and the provider accepts an Etherscan API key for ABI enrichment.

### Patch Changes

- Updated dependencies []:
  - @reserve-protocol/sdk@0.1.0

## 0.0.1

### Patch Changes

- [`65463fd`](https://github.com/reserve-protocol/dtf-interface/commit/65463fd8cd36f6d6efe4157550173cc8b13bea98) Thanks [@lcamargof](https://github.com/lcamargof)! - Initial React SDK release for Index DTF apps. Provides a `DtfSdkProvider`, React Query options, hooks, and stable query keys for SDK-backed discovery, DTF reads, proposal reads, optimistic governance reads, selector registry reads, and proposal builder flows.

- [#1](https://github.com/reserve-protocol/dtf-interface/pull/1) [`1a67a57`](https://github.com/reserve-protocol/dtf-interface/commit/1a67a571363614c5e961b9c7c2e1c9f70d5ed1bc) Thanks [@akshatmittal](https://github.com/akshatmittal)! - Adopt tsdown builds, shared TypeScript config, Turborepo, and root lint, format, and release tooling.

- Updated dependencies [[`0ac1d50`](https://github.com/reserve-protocol/dtf-interface/commit/0ac1d50b162900a364f85f9ca11eb6bc375e324f), [`1a67a57`](https://github.com/reserve-protocol/dtf-interface/commit/1a67a571363614c5e961b9c7c2e1c9f70d5ed1bc)]:
  - @reserve-protocol/sdk@0.0.1
