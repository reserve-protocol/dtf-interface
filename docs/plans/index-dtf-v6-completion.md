# Index DTF v6 — SDK completion

**Status: S1–S6 implemented (2026-09-18), whole-feature review in progress; human review required before publishing. Branch `feat/index-dtf-v6-support`, PR #45. Releases as 0.7.0 through the branch's minor changesets; 1.0.0 is a separate decision once Register re-pins.**

The rebalance write path (open auction, start rebalance, version guards, protocol-accurate auction state) shipped on this branch. A function-by-function diff of Folio 5.0.0 against 6.0.0 (`index-protocol` `origin/main` `18706fb`) shows what the SDK still lacks. This plan closes those gaps so "v6 support" means the whole 6.0.0 surface, not the rebalance slice.

## Goal

Every Folio 6.0.0 external change either has an SDK read, builder or hook with a test, or is named here as out of scope with a reason. No builder chooses an ABI silently: every write takes `version` and rejects what it cannot encode.

## Gaps (from the protocol diff)

| Protocol change (v6)                                                                                                                                                     | SDK today                                                                                | Stage                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------- |
| `bid`, `closeAuction`, `endRebalance`, `openAuctionUnrestricted`, `distributeFees` unchanged in v6                                                                       | builders hardcode the v5 ABI, no `version`, no test pinning v6 equality                  | S1                                          |
| `getRebalanceNonce()` added                                                                                                                                              | used privately by the basket proposal builder, not exported                              | S1                                          |
| `immutableFeeRecipients`, `folioFeeForSelf` added (subgraph indexes both since v6)                                                                                       | not on `IndexDtf`, no read                                                               | S2                                          |
| trade allowlist reads (`tradeAllowlistEnabled`, `getTokenAllowlist`, `isTokenAllowlisted`)                                                                               | ABI only                                                                                 | S2                                          |
| `FolioVersionRegistry` (`getLatestVersion`, `getImplementationForVersion`, `isDeprecated`)                                                                               | ABI only, no addresses                                                                   | S2                                          |
| `FolioAdditionalDetails` gained `maxAuctionLength` (renamed), `immutableFeeRecipients`, `folioFeeForSelf`; `deployGovernedFolio` collapsed to one optimistic `GovParams` | deploy builders encode v5 shapes; a v6 deploy mis-encodes                                | S3                                          |
| `setFolioSelfFee`, `setFeeRecipients(recipients, immutable)`, allowlist writes                                                                                           | call builders exist; settings/revenue proposals cannot express them (revenue rejects v6) | S4                                          |
| 5→6 migration via `UpgradeSpell_6_0_0.cast(folio, proxyAdmin, selectorRegistry)` plus selector registry swap                                                             | nothing                                                                                  | S5                                          |
| Untested v6 writes (self fee, allowlist) and reads (max auction length helper/hook)                                                                                      | shipped without tests                                                                    | S1, S2, S4                                  |
| Fork smoke (`test:smoke:index:fork`) never runs in CI                                                                                                                    | env-gated                                                                                | S6 (local evidence; CI is a decision below) |

Not gaps: `RebalanceStarted` / `AuctionOpened` are byte-identical in v6, so history reads and subgraph mappers need nothing; proposal calldata decoding already carries a 6.0.0 ABI entry.

## Non-goals

- Publishing. Changesets only; Luis publishes.
- A generic version binder. Each builder branches on `version` explicitly, as `calls.ts` already does.
- `emergencyCloseTrustedFill` (admin emergency path, no product consumer yet) — noted in the backlog.
- CI infrastructure for the fork lane (needs secrets and a runner with Docker) — decision for Luis, not silent work.

## Stages

Each stage is one commit on the branch, its own scoped verify, and a progress row. Base for S1: `40b67f3`.

- **S1 — Version contract on every write.** `prepareIndexDtfBid`, `prepareIndexDtfCloseAuction`, `prepareIndexDtfEndRebalance`, `prepareIndexDtfOpenAuctionUnrestricted`, `prepareIndexDtfDistributeFees` take `version` (asserted, ABI chosen by version). Export `getIndexDtfRebalanceNonce` with namespace, ref, query options, key and hook. Tests: v5 and v6 calldata byte-equal for each builder, `4.0.0` rejected, hook/query-option tests for the new read. Docs: `sdk/rebalances.mdx`, `react-sdk/index-dtf-hooks.mdx`. Register consumes this SDK through `link:`, so its community launch button (`community-launch-auctions-button.tsx`) and any ref call to `prepareEndRebalance`/`prepareDistributeFees` break on the next SDK build; the Register update ships with the closeout (S6), not with a re-pin.
- **S2 — v6 state reads.** `IndexDtf.fees` gains the v6 fields from the subgraph in S7 (below); the SDK does not build RPC fallbacks into the DTF model. RPC reads (exact tables at proposal time): `getIndexDtfImmutableFeeRecipients` (exact table at proposal time), `getIndexDtfSelfFee`, `getIndexDtfTradeAllowlist` (`enabled`, `tokens`), `getIndexDtfIsTokenAllowlisted`, and `getIndexDtfVersionRegistry` (`latest`, `implementationFor(version)`, `isDeprecated(version)`) with `INDEX_DTF_VERSION_REGISTRY_ADDRESS` per chain read from each chain's deployer `versionRegistry()`. Each read: namespace, ref, query options, key, hook, tests; `getIndexDtfMaxAuctionLength` gets the helper and hook tests it lacks.
- **S3 — Deployer v6.** `prepareIndexDtfDeploy` / `prepareIndexDtfDeployGoverned` (+ plans) take `version`. v6 additional details: `maxAuctionLength`, `feeRecipients`, `immutableFeeRecipients`, `tvlFee`, `mintFee`, `selfFee`, `mandate`. v6 governed: one `GovParams` (optimistic + standard params, selectors, proposers, additional guardians, timelock delay, throttle). No public v6 deployer existed at the time, so v6 required an explicit `deployer` address; v5 keeps the per-chain map. Resolved 2026-09-30: the real 6.0.0 deployers are pinned in `INDEX_DTF_V6_DEPLOYER_ADDRESS` and `deployer` is an optional override (see decisions). Tests decode against `folioDeployerV6Abi`. Foundation review (codex) on the API shape before the tests go green.
- **S4 — Settings and revenue proposals on v6.** Schema and params gain `selfFee`, `immutableFeeRecipients` (revenue distribution on v6 passes the current immutable table through unchanged; explicit param overrides the read), `tradeAllowlist: { enabled?, add?, remove? }`. v5 rejects each with an exact error. `hasIndexDtfSettingsCall` updated (`getIndexDtfSettingsVersion` already admits both versions); `immutableFeeRecipients` is params-only, not schema, since a raw table is not form input. Tests: settings builder, decoder round-trip for every new call, the previously untested self-fee and allowlist builders.
- **S5 — Upgrade to 6.0.0 proposal.** `buildIndexDtfUpgradeToV6Proposal({ spell, selectorRegistry?, governance })`: standard governance → `[proxyAdmin.transferOwnership(spell), spell.cast(folio, proxyAdmin, selectorRegistry)]`; optimistic governance → prefixed by `registerSelectors(v6 startRebalance)` and `unregisterSelectors(v5)`. Spell and registry addresses are inputs (none deployed publicly). Tests compare calldata byte-for-byte with the sandbox fixture's recorded proposal (`index-subgraph/.fork/fixture.json`).
- **S7 — Subgraph v6 fields (release dependency).** The full v6 release ships with the index subgraph exposing `immutableFeeRecipients`, `folioFeeForSelf`, `tradeAllowlistEnabled` and `tradeTokenAllowlist` on `DTF` (already in `index-subgraph/schema.graphql`, not yet on the prod endpoint the SDK's codegen tracks). When it is deployed: add the four fields to `dtf.graphql`, map `fees.immutableRecipients`, `fees.selfFee` and `rebalance.tradeAllowlist` in `dtf/mappers.ts`, extend `Fees`/`IndexDtfRebalanceConfig`, make `getEffectiveRevenueDistribution` fold the immutable table and the holders' share, and regenerate (`pnpm graphql:codegen`, `graphql:codegen:check` green). Blocked by: the subgraph deployment, nothing in the SDK. Drafted on `feat/index-dtf-v6-subgraph-fields` (types generated from the fork subgraph); merge when the prod endpoint serves 1.11.0.
- **S6 — Fork evidence, docs, review, closeout.** Extend `fork-smoke.test.ts` so the SDK-built v6 deploy, settings and upgrade calldata execute against the fork's v6 deployer and spell; run the sandbox and smoke locally; whole-feature review (Dark, Light, codex); changesets; wiki ingest; handoff with **Engineer review required** (calldata builders, deploy contract, upgrade path).

## Acceptance evidence

| Stage | Evidence                                                                                                                                                                                                                      |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1    | For each of the five builders, `data` for `version: "5.0.0"` equals `data` for `"6.0.0"`, and `"4.0.0"` throws `INVALID_INPUT`. `getIndexDtfRebalanceNonce` reads `getRebalanceNonce` at the given block; hook wires the key. |
| S2    | A v6 DTF document maps immutable recipients and self fee; a v5 document maps them empty/zero without fallback noise. Registry reads return the live latest version on all three chains (recorded, not mocked).                |
| S3    | v6 `deployFolio` and `deployGovernedFolio` calldata decode with `folioDeployerV6Abi` to the exact structs; a v6 deploy on the fork emits `FolioDeployed` for a folio whose `version()` is `6.0.0`.                            |
| S4    | A v6 settings proposal with self fee, immutable table and allowlist decodes to the exact calls; the same params on v5 throw naming the field.                                                                                 |
| S5    | Upgrade proposal calldata equals the sandbox's executed proposal for both governance kinds.                                                                                                                                   |
| S6    | Fork smoke passes with the new cases; gate green; reviews reconciled; changesets present.                                                                                                                                     |

## Release assumption

The full v6 release includes the subgraph update. The SDK therefore keeps `IndexDtf` subgraph-shaped and does not fold RPC reads into the DTF or revenue models; S7 lands the fields when the prod schema exposes them. RPC reads remain for what a write needs exactly (the immutable table a proposal passes back, the self fee, the allowlist).

## Decisions for Luis (not blocking)

- **v6 deployer addresses.** Resolved 2026-09-30: published for 1/8453/56 and pinned in `INDEX_DTF_V6_DEPLOYER_ADDRESS`; `deployer` is now optional.
- **Fork lane in CI.** The smoke needs an archive RPC secret and a Docker runner. Proposal: a scheduled workflow with `FORK_RPC_MAINNET` as a repository secret, non-blocking, reporting to the PR. Not done in this plan.
- **1.0.0.** After this plan lands and Register re-pins, the version contract is complete. Cut 1.0.0 then, or stay on 0.x until the API team weighs in.

## Risks

- Subgraph codegen: the deployed schema must expose `immutableFeeRecipients` and `folioFeeForSelf`; `pnpm graphql:codegen:check` decides. If not deployed yet, the fields stay RPC-only until it is.
- The optimistic `GovParams` shape belongs to `reserve-governor`; the SDK encodes what the v6 deployer ABI declares and nothing more.
- The upgrade spell on `origin/main` of the protocol was deleted; the reviewed source is pinned by commit in the sandbox. The builder targets the ABI, not the source.
