---
"@reserve-protocol/sdk": minor
---

Breaking: `IndexDtfBrand` is now the display-ready shape consumers can store directly — `{ hidden, dtf: { icon, cover, mobileCover, video, description, notesFromCreator, prospectus, files, tags, basketType }, creator, curator, socials }`. Every field is always present: absent API values coerce to `""`, `files` is always `{ url, name }[]`, `tags` always `string[]`, and `basketType` narrows to `"percentage-based" | "unit-based"` (defaulting `"percentage-based"`). App-side brand mapping layers are no longer needed.
