---
"@reserve-protocol/sdk": patch
---

Read standard Index DTF proposal voting power at the proposal snapshot itself, matching the governor and including delegation checkpoints created at that timepoint. Preserve clamping for snapshots at or after the current clock.
