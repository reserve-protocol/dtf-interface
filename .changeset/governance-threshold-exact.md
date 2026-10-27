---
"@reserve-protocol/sdk": minor
"@reserve-protocol/react-sdk": minor
---

Index DTF governance reads two new subgraph fields. Needs the Index subgraph 1.11.3 or later on `prod`.

- `Governance.proposalThresholdExact`: false while the indexer could not read the governor's ratio (under one token of vote supply). `proposalThreshold` is then a placeholder, not the governor's value.
- `Governance.voteExtension`: seconds that voting stays open after a late quorum. It is absent on governors without the extension.
