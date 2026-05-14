# Known Gotchas

This file collects facts that are easy to get wrong. Check it before changing SDK behavior or writing new docs.

## Terminology

- `RToken` is the legacy technical/product name for Yield DTF tokens. Do not use it as the umbrella term for every DTF in new SDK docs.
- `Folio` is the Index DTF contract/token implementation.
- `DTF` is the umbrella term.
- Register may label roles with product-friendly names. Verify the underlying contract role before encoding calls.

## Chain Scope

- Current Index DTF product scope is Ethereum, Base, and BSC.
- Current Yield DTF product scope is Ethereum and Base.
- Arbitrum appears in legacy surfaces and old docs. Do not infer active product support from old frontend constants.

## Data Sources

- The Index subgraph does not own live basket balances. Use RPC `totalAssets()` for live basket composition and balances.
- The Index subgraph does not own live final proposal state. Use governor RPC when freshness matters.
- Reserve API owns current Index prices, discovery, current basket valuation, historical analytics, and vote-lock position aggregates.
- Yield DTF reads are mostly subgraph/RPC driven. Do not assume Reserve API parity with Index DTFs.

## Proposal IDs

- Index DTF proposal IDs are long decimal strings.
- They are not scoped to a DTF in the ID string itself.
- The SDK keeps proposal detail DTF-bound where calldata decoding needs DTF context.
- Do not add DTF membership checks around proposal IDs unless the data model changes.

## Version Mismatches

- `reserve-index-dtf` source may be ahead of live deployed versions.
- Current source version is v6, but the SDK may need v5 and v6 ABI support.
- Older docs and comments can mention v3 or v4 signatures. Verify against the ABI/version being encoded.
- `startRebalance`, `openAuction`, and `bid` signatures have changed across versions.

## Subgraph Mismatches

- Subgraph schema comments are not always the same as mapping code.
- Entity IDs should be verified in mappings, not only `schema.graphql` comments.
- Generated `subgraph.yaml` may represent only one network. Check `subgraph.yaml.mustache` and `networks.json` for multi-network behavior.
- Proposal state is event-driven and not continuously recomputed every block.

## Register Behavior

- Register deep links use chain slugs and page slugs, but source route constants can have different names. Example: the factsheet route uses the `performance` slug.
- Deprecated Index DTFs are sell-only in zap flows and inactive for auctions.
- Register derives some proposal state client-side from timestamps and vote counts; it does not show raw subgraph state blindly.
- Register uses different governance domains for basket, owner/admin, and DAO/vote-lock settings.

## Revenue And Fees

- `totalSupply()` includes pending fee shares on Folio. Do not use cached ERC20 assumptions when price/share math depends on supply.
- `distributeFees()` materializes pending fee shares to recipients and DAO/platform recipient.
- Index DTF fee recipient portions are D18 shares of the non-DAO fee recipient side. Register adjusts display percentages for platform fee.
- Yield DTF revenue, Index DTF vote-lock rewards, and RSR burns are related product concepts but not one shared contract path.

## RSR

- RSR is used for Yield DTF staking and governance.
- Index DTF vote-lock vaults can use different underlying tokens; do not assume every Index vote-lock uses RSR.
- Some Index DTF economic flows can burn RSR at the ecosystem level, but a given DTF's fee recipient table and vote-lock rewards determine concrete behavior.
- Avoid hardcoding RSR supply or circulating supply in SDK docs.

## Documentation Hygiene

- Do not reference local absolute paths in shared docs.
- Do not promote old planning docs into canonical docs without source verification.
- If a fact is not source-verified, omit it or mark the exact source needed to verify it.
