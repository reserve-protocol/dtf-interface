---
"@reserve-protocol/sdk": minor
---

Match OZ Governor strict-majority semantics in Index DTF proposal state derivation (a for/against tie is now DEFEATED, not SUCCEEDED) and derive lagging Yield DTF proposal list states (ACTIVE past the vote deadline now resolves to DEFEATED/QUORUM_NOT_REACHED/SUCCEEDED) via the new getYieldDtfProposalState. Breaking: the `YieldDtfProposalState` union gained `"QUORUM_NOT_REACHED"` — exhaustive switches over it must handle the new member.
