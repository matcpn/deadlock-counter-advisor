# Decisions and open questions

## Conditional burst coverage — 2026-10-15

- Publish bounded source-reviewed defenses rather than hold every burst option for
  unresolved event ordering. Reactive Barrier explicitly covers follow-up damage;
  triggering-hit absorption remains unknown and visible. No verified promotion.
- Expand generic personal defenses to the current selectable player roster and six
  reviewed enemy heroes. Preserve Infernus-specific anti-heal application scope.
  Current tooltips govern damage types; community blanket immunity and parry claims
  are not adopted. Shared API-derived sites count as one data lineage.
- Add while-actionable response metadata for Grit and Metal Skin. Hide these when
  already stunned/asleep; do not equate barriers with cleanse or control immunity.
- Start on Burst damage and reveal alternatives beyond three in each objective /
  affordability group. Group identical prerequisites by enemy names so multiple
  threat rules are alternatives, not a requirement to face every trigger at once.
- Keep facts, evidence, scope and stage rationale in versioned data. No new inputs,
  live runtime data dependency, scoring change or automatic rule certification.


## Source-reviewed beta release — 2026-10-15

The user authorized implementing the first real sourced slice. Accessible evidence
supports conditional suggestions but does not certify live-client interactions.
Added source-reviewed as a separate evidence status; never relabel community reports
as verified. The UI explicitly opts into that status and labels it beta. Existing
verified-only callers, needs-review exclusion and synthetic isolation are preserved.

Every source-reviewed rule requires player scope, conditions, response timing and
stage rationale, plus dated review/source links and expiry. Unknown situational
conditions stay visible on the card; an explicit stunned/asleep response window
filters preemptive and post-debuff active responses. This is not a complete control
model: silence, disarm, active lockout, cooldown and ranks remain card prerequisites.

The first release is deliberately scoped to Infernus. Healing denial is Punish only,
knife removal is DoT only, and stun duration reduction is Control only. No invented
Disrupt or burst rules fill empty columns. Build fit and stage placement are labeled
editorial judgments. No numerical success rate, parry window or anti-heal stacking
calculation is shown. Healbane and Toxic Bullets are alternatives, not a combined build.

Source comparison is recorded as Codex review, not a human or gameplay test. A
30-day maximum review period (exclusive expiry 2026-11-14 UTC) and strict client
version match bound this beta. These supersede the earlier absence of an expiry
policy. Fetching a newer snapshot never renews the review. Refresh artifacts are
uploaded even when subsequent checks fail, so review material is not lost.

App selection and shop browsing retain the entire source-selectable roster. Artwork
component now recovers if its source changes after a previous image failed.

## Community-source research — 2026-10-12

User explicitly wants guides, social discussions and other internet sources to
inform rules, without relying on their own expertise. Preserve source claims,
scenario hypotheses, dates, disagreements and remaining checks separately in a
research ledger. Community evidence is useful and can support practical judgments;
upvotes/reposts are not mechanical verification. Current facts and specific
interactions still need corroboration. The agent performs that research; user
expertise is not a release prerequisite. See COMMUNITY_RESEARCH.md for findings.

## Repeatable catalog and simpler browsing — 2026-10-11

- User prioritized repeatable game-data pulls, full hero/item coverage and optional
  artwork. Use the documented community Deadlock API's versioned client extraction
  as imported research facts, with pinned endpoints, raw snapshots and SHA-256.
  This does not establish an official/current mechanics audit. See GAME_DATA.md.
- Keep all raw hero records; select source-available heroes and show development
  flags. Preserve all source-shopable upgrades; separate special tier 5 rather
  than asserting mode availability. Stable IDs use upstream numeric identifiers.
- Imported facts never enter the reviewed recommendation catalog automatically.
  Non-active items retain trigger uncertainty; no regex tooltip classifier creates
  a verified counter. Store source tags without interpreting them as matchup advice.
- Use source image URLs with fallback and Valve/provider attribution. Do not copy
  binaries or claim API MIT licensing covers Valve art. User-requested artwork
  is displayed with recorded provenance; unrestricted reuse is not asserted.
- Problems become result views with all three stages together; budget and active
  preferences are optional. Keep the three objectives and affordability buckets.
  Price tier alone cannot establish stage fit. Demonstration board is opt-in.
- Manual Actions refresh produces an artifact for review; it does not auto-promote
  data or require credentials beyond the workflow's read access. No schedule added.
- Require Node 24 for the importer’s native TypeScript support; the existing CI
  and .nvmrc already use Node 24. Game facts stay outside React components.

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
