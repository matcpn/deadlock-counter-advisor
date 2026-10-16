# Implementation and maintenance plan

## Current agenda — 2026-10-16

UI cleanup delivered: enemy-first selection and combined stage item lists. Player,
build, budget, problem tabs, demo preview and goal headings removed from the main
flow at user request. Scoped rules and the personalized engine remain in the model.

Completed: all-hero source-text threat inventory (42 heroes / 168 main ability slots),
function vocabulary, response families, coverage matrix, deterministic research
regeneration, source-change invalidation and prioritized batches. Current published
advice now includes 105 conditional rules / 16 items across all 42 captured selectable
enemies, with partial scenario coverage. The full-roster source pass is complete;
no in-game certification is implied. See [per-hero remaining work](docs/ROSTER_REVIEW.md).
See [research backlog](docs/ROSTER_RESEARCH.md) and [process](docs/RESEARCH_PROCESS.md).

Next priorities:
Build-color audit complete: all 42 enemies have a green option. Future research
must maintain green or both purple and orange, alongside two distinct items.

The second-item pass is complete: all 42 heroes have two or more distinct eligible
items across scenarios. [Item coverage](docs/ITEM_COVERAGE.md) regenerates the queue
after changes. Continue with interaction confidence and scenario depth below.

1. Batch-one follow-up: test short-channel timing, protection/removal and personal
   survival for Seven, Dynamo and Mo & Krill. Six conditional interrupt rules exist.
2. Batch-two follow-up: more player delivery routes, recipient targeting, Kelvin
   purge reapplication, turret attribution and Victor aura/reanimation semantics.
3. Mobility follow-up: first-cast versus recast, untargetability, protection/removal
   and flight event ordering. The first movement slice is delivered.
4. Resolve the 14 known source gaps, transformed/copy kits and summon attribution;
   directly test uncertain timing/removal before verified promotion. Extend sparse
   problem coverage using the review ledger instead of counting heroes as fully solved.
5. Saved/shareable scenarios for reproducible user tests. Review existing advice
   by 2026-11-14 UTC; fetching new data alone does not renew it.

GitHub hosting and repeatable imports are delivered. Historical milestone text below
is retained for context; do not restart repository or deployment setup.

## Milestone 0 — portable foundation (this handoff)

Deliver interface scaffold, minimal types, sample ranker, synthetic fixtures,
behavioral tests, dependency lock, CI/Pages workflow and context documents.
Acceptance: install, tests and production build complete; actual validation recorded.
No real counter advice or deployment is represented as done.

## Milestone 1 — reliable data foundation

Latest progress 2026-10-11: repeatable version-pinned community source import,
immutable raw snapshots, hashes, normalized catalog, added/removed/changed ID report,
offline regeneration validation and manual refresh artifact workflow implemented.
41 source-selectable heroes and 173 shop upgrades imported; complete coverage is
relative to source flags, not an in-game audit. Portraits/icons and source colors
displayed with fallback/provenance. No counter rules certified. See GAME_DATA.md.

Progress 2026-10-11: runtime import boundary, manifest/source records, evidence
completeness, reference/enum/numeric/duplicate checks and component cycle detection
implemented with tests. Current roster/items/patch and user examples remain
unverified. Effects, granular evidence mapping, release audit and advanced
constraints remain open. See docs/DATA_REVIEW.md; this milestone is not complete.

- Verify current game patch, complete playable roster, item list and categories.
- Choose sources with clear provenance; prefer official patch notes and current
  in-game tooltips/tests. Document limitations of any community/API source.
- Implement runtime schemas (e.g. Zod or equivalent), dataset manifest, stable IDs,
  evidence records and an upgrade graph. Choose library after checking current docs.
- Add source completeness, referential integrity, sane numeric ranges, duplicate ID,
  enum, invalid upgrade cycle and stale-rule checks.
- Record all user example investigations with explicit outcomes and unresolved facts.

Done when a small audited catalog can be loaded and invalid data cannot reach the UI.

## Milestone 2 — complete one vertical slice

Research progress 2026-10-12: eight source records and eight candidate claims in
data/research/counter-claims.json, with source-supported leads, disagreements and
specific next checks. COMMUNITY_RESEARCH.md documents the review process. Resolve
the candidate interactions and conditional/DoT model next; no real rules yet.

- Verify Infernus versus Abrams and Shiv scenarios across lane/mid/late and
  burst/control/sustain problems. Keep the UI general-purpose and uniformly sized.
- Implement player synergy, per-enemy threat priority, conditional timing, current
  inventory, incremental cost and score explanations.
- Add affordable/future subgroups, top-three progressive disclosure and clear
  active/passive/conditional styling. Make empty/unsupported coverage helpful.
- Add regression fixtures for the acceptance scenarios in PROJECT_SPEC.md.

Done when each displayed real recommendation has evidence, practical limits, and
results change meaningfully with the scenario. No invented guarantee of surviving
an execute, parrying a combo, or activating an item while stunned.

## Milestone 3 — roster coverage and usable MVP

- Expand reviewed relationships to every currently playable hero; maintain a
  coverage matrix by hero × problem × stage rather than claiming universal coverage.
- Implement advanced constraints in priority order: slots/upgrades, active comfort,
  delivery/range, known enemy ability ranks/build, ally effect redundancy.
- Add searchable hero selectors, versioned query-share state, local scenario memory,
  reset, saved examples and visible patch/freshness metadata.
- Keyboard and mobile QA; test 375px and desktop layouts, empty/malformed inputs,
  unknown heroes, slow load, source links and category labels without color.
- Test Pages under a repository subpath and reload shared URLs.

Done when the whole supported roster is selectable and unsupported interactions
are explicit. All sources and regression checks pass. Avoid excessive form inputs.

## Milestone 4 — GitHub and launch

- Select or create the destination repo; inspect existing files before importing.
- Commit scaffold/docs/data, confirm CI passes remotely, configure Pages → Actions.
- Run the manual deployment workflow, inspect its result and open the returned URL.
- Publish a compact coverage/limitations statement and patch review date.
- Enable push-to-default-branch deployments only after deciding the release gate.

Done when the live site serves correctly under the target path and a documented
prior commit/dataset can be restored. Workflow files alone do not mean deployment.

## Phase 2 — patch maintenance (future; not scheduled now)

1. A scheduled/manual GitHub workflow fetches permitted structured game facts and
   official patch notes. Store source timestamp/checksum and respect source terms.
2. Produce a semantic diff: new/removed/renamed heroes/items, changed costs/categories,
   effect changes, ability timing, immunity/cleanse/stacking semantics.
3. Traverse dependency links to list affected rules and regression scenarios.
   Mark those rules needs-review; retain last reviewed snapshot for comparison.
4. Open a review PR containing data changes, source links, impact report and failed
   scenarios. AI may propose explanations or rules but cannot self-certify them.
5. Reviewer checks ambiguous interactions in sources/game tests, approves evidence,
   adjusts weights only when appropriate, and records rationale.
6. Schema checks, scenario regression tests and UI checks pass before release.
   Publish a new dataset version with a changelog and stable rollback reference.
7. A visible stale-data indicator handles delayed reviews; suppress invalidated
   advice instead of presenting it as current. Never silently fall back to old
   advice without labeling its patch and limitations.

Potential sources must be selected and verified during implementation; no invented
API URLs or assumption that patch notes expose machine-readable complete state.
If permitted upstream automation is unavailable, a manual review PR is sufficient.
No need for a paid backend: ingestion runs at build/review time and ships static JSON.

## Phase 3 — optional improvements

Community feedback with moderation, richer team synergy, build import, mechanic
comparison, patch history, multilingual labels, and empirically calibrated weights.
Do not infer causal item effectiveness from unadjusted win rates or sparse reports.

## Risks and mitigations

- Mechanics accuracy: field/rule evidence and human review, not name matching.
- False precision: display rationale and conditions, not a fabricated win probability.
- Scope creep: verified vertical slice first, then measured coverage expansion.
- Stale data: dependency invalidation, patch status and immutable rollback snapshots.
- Cognitive overload: compact default form and progressive disclosure.
- Context loss: update HANDOFF, DECISIONS and VALIDATION every meaningful session.
