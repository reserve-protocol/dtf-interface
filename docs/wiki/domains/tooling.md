---
title: Tooling Domain
updated: 2026-08-03
type: domain
sources:
  - packages/tooling/**
---

# Tooling Domain

## Boundary

`@reserve-protocol/tooling` is the private workspace home for operational scripts and
agent skills that review protocol activity. It consumes `@reserve-protocol/sdk` and
`@reserve-protocol/dtf-catalog`; nothing depends on it, and it publishes nothing. Logic
that other surfaces would need belongs in the SDK, not here.

## Shape

- One folder per workflow under `src/` (`rebalance-validation/`), with its checks in
  `checks/` and its outside data providers in `sources/`.
- Each workflow has a CLI entry (`cli.ts`) run through `tsx`, and a skill in
  `skills/<name>/SKILL.md` that says how to act on the output.
- Protocol reads, decoding and math go through the SDK. The package holds only the
  review logic and the sources the SDK deliberately does not own.

## Invariants

- Rebalance review is two passes: `disasters` gates (nonzero exit), `outcomes` informs.
  Only disaster-pass failures can block a proposal.
- Disaster checks use data from outside Reserve (pool prices, third-party token
  listings). The proposal is built from the Reserve API, so an API-vs-calldata
  comparison cannot detect a wrong API price.
- Calldata correctness is established by re-deriving it through
  `buildIndexDtfStartRebalanceArgs`, not by re-implementing the weight math.
- Every run prints the questions that cannot be checked mechanically; a clean report
  is not a completed review.

## Encoding

`weight.spot` is `D27{tok/share}` (per share, so whole tokens per whole share is
`spot / 1e27 * 1e18 / 10**decimals`); `price` is `D27{nanoUSD/tok}` with
`low = p*(1-e)` / `high = p/(1-e)`, so price is `sqrt(low*high)`; `maxAuctionSize` is
`{tok}`, not USD.
