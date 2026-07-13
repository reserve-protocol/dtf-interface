# Agent Router

Loader, not playbook. Reusable workflow rules live in `skills/` (kit-owned, updated via agent-workflow); project knowledge lives in `docs/wiki/` (project-owned).

## Load Order

- For staged or code work, read `skills/workflow.md` first.
- Before writing or reviewing app code, read `skills/code-standards.md`.
- Before closing a stage, read `skills/review-panel.md` and `skills/wiki.md`.
- Before user-facing UI work, read `skills/ui-ux.md`.
- When setting up or changing the visual token system, read `skills/design.md`.
- Before adding tooling or starting a project surface, read `skills/stack.md`.
- For project context (product, stack specifics, risks, SDK rules), read `docs/wiki/project.md`.
- When exploring project knowledge, start at `docs/wiki/index.md` and follow links.
- At the end of a major workload, read `skills/self-improve.md`.
- When editing skills or routing, read `skills/writing-great-skills.md`.

## Default Loop

- Calibrate first: `skills/workflow.md` § Calibrate: Radius × Size (touch-up / low / medium / high). Radius buys review; size buys ceremony. Touch-up and low ship on scoped verification plus self-review; medium is one heavily reviewed stage; high is a plan of stages.
- `node scripts/llm-workflow/workflow-start.mjs --stage "<stage>"` for medium/high; implement the smallest complete slice.
- Inner loop: `node scripts/llm-workflow/scope.mjs --base <base-ref>` (verification commands, required review lenses, red flags, and tier hint for touched files).
- Stage closeout (medium/high): `node scripts/llm-workflow/scope.mjs --gate` unless the final scoped run was gate-equivalent, one progress row, wiki ingest, and `node scripts/llm-workflow/wiki-lint.mjs` green.

## Review Budget

Risk-routed lenses only, claims verified before adoption—`skills/review-panel.md` owns the rules.

## Stop Conditions

- Ask before destructive actions, credentials, new auth assumptions, or architecture changes that widen scope.
- Stop after three failed attempts on the same symptom and question the architecture.
- Do not claim completion without fresh verification from this turn.
