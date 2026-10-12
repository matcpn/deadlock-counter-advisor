# Decisions and open questions

## GitHub test deployment — 2026-10-11

The user explicitly requested a new repository and a working hosted test page.
Created public `matcpn/deadlock-counter-advisor`; enabled Pages with Actions.
Pushes to main now trigger the Pages workflow as well as Checks. Pages runs its
own test/build gate before publishing. This supersedes the earlier manual-only
deployment decision. Synthetic demo labeling remains mandatory; publication does
not certify game data. No domain, paid service or runtime backend was added.

## Accepted direction

### Continuation decisions — 2026-10-11

- Complete a bounded Milestone 1 validation step before introducing live data.
  Use a dependency-free runtime parser for the small current schema; introduce a
  schema library only if the model's growth justifies it. Invalid imports fail
  with field paths, and the engine rechecks callers at its public boundary.
- Separate demo and production catalogs explicitly in the manifest. Evidence
  completeness is a release prerequisite, not proof that a source is accurate.
- Reject verified records from another manifest patch; retain stale research only
  as needs-review. No date-based expiry policy has been invented.
- Validate component graphs now; defer upgrade discounts until component credit
  semantics have evidence. Continue using the full price for affordability.
- Update Vitest from 3 to 5.0.3 because the installed version had npm audit
  advisories. Official migration requirements fit the existing Node/Vite stack:
  https://vitest.dev/guide/migration/ . All tests pass after the change.

- Interactive contextual advisor replaces the infographic as the primary deliverable.
- A static React/TypeScript/Vite app fits the GitHub Pages goal and proposed stack.
- Deterministic rules first; no LLM or secrets required in the browser.
- Separate game facts, counter interactions, scoring weights, and interface code.
- Colors identify current item categories; separate badges identify activation.
- Keep Survive / Disrupt / Punish distinct and divide immediate versus later buys.
- Build synergy is a preference, not a hard weapon/spirit category exclusion.
- Synthetic starter data avoids laundering uncertain examples into factual advice.
- Manual Pages workflow during scaffold stage; no deployment performed this turn.
- Preserve a full project handoff rather than relying on a single summary prompt.

## Open, non-blocking questions

- Which exact GitHub repository should hold this? No target has been selected.
- Which authoritative data source covers the current patch completely?
- What do the user’s earlier abbreviations E, HB/TB and ES/CR mean? Resolve from
  source context or ask when needed; do not silently assume expansions.
- Is “Victor” the intended current hero name/spelling? Verify against the roster.
- Which rules are reliable across ability ranks and which require explicit inputs?
- Exact thresholds/weights and initial default budget need calibration after data review.
- Does the final roster cover only standard playable heroes or other game modes?

## Scope not yet committed

Automatic ingestion method, LLM-assisted maintenance provider, analytics, user
accounts, live game integration, monetization and custom art are not MVP requirements.
