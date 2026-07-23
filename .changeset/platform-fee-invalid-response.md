---
"@reserve-protocol/sdk": minor
---

Breaking: `getIndexDtfPlatformFee` now throws `SdkError` (`INVALID_RESPONSE`) when the DAO fee registry returns a zero denominator, instead of fabricating a confident 0% fee. A real 0% (zero numerator over a positive denominator) is unaffected; consumers should treat the error as "fee unavailable".
