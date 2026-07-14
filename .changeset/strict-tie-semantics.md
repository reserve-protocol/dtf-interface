---
"@reserve-protocol/sdk": patch
---

Match OZ Governor strict-majority semantics in Index DTF proposal state derivation (a for/against tie is now DEFEATED, not SUCCEEDED) and derive lagging Yield DTF proposal list states (ACTIVE past the vote deadline now resolves to DEFEATED/QUORUM_NOT_REACHED/SUCCEEDED) via the new getYieldDtfProposalState.
