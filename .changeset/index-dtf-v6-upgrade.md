---
"@reserve-protocol/sdk": minor
---

Index DTF: 5.0.0 → 6.0.0 upgrade proposals. `buildIndexDtfUpgradeToV6Proposal` (`sdk.index.buildUpgradeToV6Proposal`, `ref.buildUpgradeToV6Proposal`) builds the spell migration against the DTF's admin governance: selector-registry swap of `startRebalance` for optimistic governors, `transferOwnership(spell)` on the proxy admin, then `cast`. `buildIndexDtfUpgradeToV6Calls` is the pure form (`selectorRegistry` present means optimistic); the description defaults to "Upgrade to Folio 6.0.0" and the DTF can be injected with `dtf`; `INDEX_DTF_START_REBALANCE_SELECTOR` and `upgradeSpell600Abi` are exported.
