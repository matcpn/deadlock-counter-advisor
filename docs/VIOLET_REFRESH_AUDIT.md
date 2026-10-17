# Violet refresh and new-hero onboarding audit

Audited October 16, 2026. Pull succeeded from client 6785 to 6793. Import/display
is easy; promoting new facts with reviewed advice still needs substantial manual
coordination. This audit records the friction rather than bypassing review gates.

## What the pull delivered

- 43 selectable heroes (previously 42), 173 shop items.
- Violet, stable ID `hero-86`, was already an unavailable source record. She is now
  selectable with a portrait and four main abilities: Living Ink, Flow State,
  Still Life and Abstract Landscape. Browser selection worked and portrait loaded
  without React, normalizer or selector changes.
- A second `data:pull -- --version 6793` returned `No catalog changes`.
- Normalized changes: Violet availability/art/abilities; Solomon ability text;
  Burst Fire description/tooltip. No normalized IDs were added or removed.
- The raw diff additionally contains new Violet weapon/ability/helper records,
  a Solomon helper/property change, shared ability hero associations and other
  source metadata. The normalized diff is not a complete mechanics-impact audit.

Sources: [pinned heroes](https://api.deadlock-api.com/v1/assets/heroes?client_version=6793),
[pinned items/abilities](https://api.deadlock-api.com/v1/assets/items?client_version=6793).
Original bytes and SHA-256 manifest are in `data/snapshots/client-6793/`.
Candidate normalized data, regenerated reports and `audit.json` are retained under
`data/refresh-reviews/client-6793/`. They are outside the production imports.

## What happened during validation

1. Pull and offline snapshot verification passed without code changes.
2. The documented local `pull` then `check` sequence stopped at stale research
   output. Running `npm run research:build` fixes that step. The GitHub refresh
   workflow already includes this command; local instructions have been corrected.
3. Regeneration produced 43 profiles / 172 main abilities. Violet's four are
   untriaged; existing annotations need review because their client differs.
   The reported 172 gaps include this stale triage, not 172 missing descriptions.
4. Full candidate tests: **161 passed, 19 failed, 180 total** across 11 files.
   Failures cluster in research (11), roster (3), item depth (3), reviewed release
   (2). The extra test is the dynamically generated Violet scenario test.
5. Browser correctly showed Violet but paused every recommendation because the
   reviewed release is still client 6785. There are no reviewed Violet rules.
6. Saved candidate files, then restored the six runtime/generated files changed
   by the experiment. Production remains on the last reviewed client; no patch
   IDs, review dates, evidence scopes or tests were loosened to force promotion.

## Follow-up fixes, in priority order

- [ ] **Stage imports by default.** `data:pull` currently replaces the runtime
  catalog before advice review. Add a candidate output mode and a separate explicit
  promotion step; include offline verification and research output in the bundle.
- [ ] **Separate import checks from release-coverage checks.** Preserve fixed
  release regression fixtures; use dynamic counts for generic import tests.
  Current tests pin 42 heroes / 168 abilities / 210 cells, assume every current
  hero has two items and green coverage, and import raw client-6785 abilities while
  consuming the mutable game catalog. A new unreviewed hero should be a visible
  coverage gap, not an unexplained import failure. Keep review/expiry tests strict.
- [ ] **Produce a useful review-impact report.** Explicitly list newly selectable
  and retired heroes, changed raw ability properties/helpers and affected rules.
  Violet is currently buried under `heroes.changed`, with `heroes.added=[]`.
- [ ] **Support selective reviewed promotion.** `reviewAvailability` and research
  triage invalidate the entire release on a client bump. Add dependency evidence
  and an explicit carry-forward review for unchanged claims; do not merely replace
  version strings or assume unchanged normalized text proves unchanged mechanics.
- [ ] **Add a new-hero research scaffold.** Identity is duplicated in
  `reviewed-catalog.json`; function seeds, roster ledger and rules require separate
  edits. Generate unreviewed entries and a checklist with source links. Explicit
  playerHeroIds also require an audit if the new hero is to be supported as a player;
  never append Violet to every delivery scope automatically.
- [ ] **Flag incomplete base ability descriptions.** Violet's Living Ink has only
  `t1_desc`, `t2_desc`, `t3_desc` and `passive` in the source description object.
  It passes import because these fields produce nonempty text; research should
  flag the missing base description specifically, without inventing it.

## Completing Violet after the pipeline work

Resolve Living Ink's missing base description with an additional current source;
triage all four abilities and relevant helper/weapon records; research scenario
responses and delivery limits; add evidence-backed rules and regression cases.
Maintain the two-distinct-item and green-or-purple-plus-orange research targets.
Group presentation only after the underlying scenarios exist. No counter items
were inferred from ability keywords during this import audit.

To repeat the audit in a clean disposable checkout: `npm ci`,
`npm run data:pull -- --version 6793`, `npm run research:build`, `npm run check`.
Expect the release-review failures above until promotion work is completed.
