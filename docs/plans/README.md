# Plans

This folder contains pending implementation plans. These are not canonical descriptions of implemented SDK behavior.

Use `plans/` when:

- a product integration is understood but not implemented in the SDK.
- a feature needs source-backed design notes before coding.
- a track should be kept separate from protocol/source-of-truth docs.

Do not use `plans/` as proof that an API exists. Check `sdk/api-surface.md` and SDK exports for implemented behavior.

## Current Plans

- `zapper-integration.md`: pending Zapper SDK integration work for quote/deploy/zap transaction surfaces.
- `register-index-dtf-react-sdk-migration.md`: pending Register migration plan for replacing direct Index DTF data/action sources with SDK/react-sdk surfaces.
- `optimistic-selectors-sdk-integration.md`: blocked SDK subgraph integration for indexed optimistic selector data after the Index DTF subgraph is deployed and reindexed.


## Plan File Rules

Every plan should include:

- status.
- source references.
- current implemented boundary.
- proposed SDK scope.
- things explicitly out of scope.
- open questions.
- validation plan.

## Do Not Infer

- Do not promote a plan into canonical docs until the code exists and is verified.
- Do not add planned APIs to public examples.
