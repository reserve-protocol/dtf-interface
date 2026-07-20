---
"@reserve-protocol/sdk": patch
---

A proposal stuck in subgraph PENDING past its vote deadline now derives the vote outcome (DEFEATED / QUORUM_NOT_REACHED / SUCCEEDED) like a stale ACTIVE, matching Governor.state() semantics — it is never reported as EXPIRED. Applies to both Index DTF (`getProposalState`) and Yield DTF (`getYieldDtfProposalState`). Yield proposal reads also derive the current timepoint from the chain (block timestamp or number per governor version) instead of the consumer machine's clock.
