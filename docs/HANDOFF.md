# Start here — continuation handoff

## Whole-roster source review — 2026-10-16

The user asked to loop until all heroes were done. The source-review pass now
accounts for all 42 source-selectable heroes, with at least one bounded scenario
each: 83 rules / 16 items. This is partial scenario coverage, not every ability,
problem, stage or player delivery route, and no in-game verification.

Added 41 rules for the remaining 30 enemies. Slowing Hex is the only new item.
Mobility rules distinguish new casts, untargetability and Mina's unverified recasts.
Typed damage, explicit disable triggers, scoped mark/root removal and melee
resistance provide the other slices. Lady Geist healing denial excludes Soul
Exchange. Pure damage, executes, transformed/copy kits and summon attribution stay
explicitly limited. Existing reviews were not renewed; expiry remains November 14 UTC.

Read generated docs/ROSTER_REVIEW.md for every hero's rules, sources and remaining
questions. Its source is data/research/roster-review.json; research:build/verify now
audit identities, source membership and complete rule references. New heroes and
changed source descriptions/flags lose completed-review status. This audit does
not create, renew or certify recommendation rules. The existing release gate still
pauses advice on patch/item drift or expiry.

Sinclair's own Vexing Bolt damage type is traced to raw markers; five movement
abilities have exact raw MOVEMENT evidence. Fifteen known ability source gaps
remain. Research data is kept separate from UI/scoring. Reviewed JSON now has its
own build chunk so the expanded release does not enlarge the main chunk past 500kB.

Next work is depth and practical verification: prioritize the per-hero remaining
questions and saved/shareable scenarios. Do not restart an uncovered-hero loop or
call this complete counter coverage. See the latest VALIDATION.md for actual
checks and publication state.

## Healing and persistent-damage slice — 2026-10-15

Implementation eb3387c is live; remote checks, Pages and pinned refresh passed.
The deployed 42-rule release and all three new enemy scenarios were inspected.

Added 11 source-reviewed rules for Victor, Kelvin and McGinnis. Total: 42 rules /
15 items / 12 enemy heroes with partial advice. Healbane and Toxic Bullets target
actual healing recipients; Inhibitor has separate late-game Survive/Punish rules
for Victor. New anti-heal delivery is scoped to Infernus/Kelvin/Victor/McGinnis;
older Abrams/Shiv anti-heal remains Infernus-only. Generic shielding spans players.

Corrected the four prior Spirit/Weapon Shielding rules: their resistance is
conditional after the proc, not always on. New sustained-damage rules cover Aura
of Suffering, Arctic Beam and Heavy Barrage, not unreviewed turret triggers.
Damage over time now explicitly includes beams/areas. No new scenario inputs.

Two damage-type gaps repaired through checked raw evidence. Added Victor aura
channel/toggle ambiguity; 16 known ability entries retain gaps. No reanimation
prevention, attack-through-dome, global healer suppression or stacking math claims.
Current client remains 6785; review expiry remains November 14 UTC. No in-game tests.

Next batch: Vindicta, Grey Talon and Calico for flight/movement/escape. Keep personal
survival/timing tests from earlier batches, more player delivery routes, Kelvin
purge reapplication and turret attribution on the follow-up list. Read latest
COMMUNITY_RESEARCH.md and VALIDATION.md for evidence, checks and publication status.


## Channel disruption slice — 2026-10-15

Implementation 4356b94 is live; remote checks, Pages and pinned refresh passed.
Added six source-reviewed rules for Knockdown / Cursed Relic against Seven's
Storm Cloud, Dynamo's Singularity and Mo & Krill's Combo. Total: 31 rules / 14 items,
nine enemies with partial advice. Use Control & combos, mid/late Disrupt. Dynamo/Mo
require a free teammate; stunned/asleep filters these actives. No new inputs.
Knockdown has a two-second delay; short channels require immediate team response.
Protected targets are excluded. Silence Wave is not an ongoing-channel interrupt.
Read COMMUNITY_RESEARCH.md for sources, timing and unresolved questions.

Raw-property annotations resolve three Seven damage-type gaps and add Dynamo's
channel flag. Seventeen known ability entries still have source gaps. The offline
builder checks exact paths/values from pinned raw items; missing/changed/duplicate
records withhold tags. Data refresh still never renews interaction reviews.
Current public source remains client 6785. Advice expiry remains November 14 UTC.

Next research: Victor, Kelvin and McGinnis (healing/persistent damage), followed by
Vindicta/Grey Talon/Calico. Batch-one personal survival, removal, barrier triggers
and practical timing tests remain open; none of these new rules is in-game verified.
See latest VALIDATION.md for actual checks and publication status.


## All-hero research foundation — 2026-10-15

Implementation 488d9a1 is live; CI, Pages and the manual refresh passed. The live
42-hero matrix was inspected. Added source-traced inventory for 168 main ability slots,
25 threat-function themes, 12 response families and an enemy × problem coverage
matrix with stage/goal/player-scope detail. Current advice remains 25 rules / 12
items and partial coverage for six enemy heroes; no new counter rules were inferred.

Read ROSTER_RESEARCH.md for the generated coverage/backlog and RESEARCH_PROCESS.md
for how to maintain it. Source annotations: data/research/hero-threats.json. Shared
functions: src/data/research-functions.json. Batch plan: data/research/research-plan.json.
Twenty ability entries have explicit source gaps; alternate/copy kits and base
weapons are not completely inventoried. This is source-text triage, not certification.

npm run research:build regenerates the UI inventory and Markdown report offline;
research:verify runs in npm run check. Client changes withhold old tags, same-client
text changes withhold affected tags, and new abilities appear untriaged. Manual
refresh now regenerates/includes these artifacts. It never renews recommendation
reviews. The UI adds a collapsed roster-research section below advice with a search,
coverage cells, ability evidence and the queue; no new scenario questions.

The user approved function-based grouping and iterative research. Next priority is
batch 1: Seven, Dynamo and Mo & Krill, resolving damage-type/control/channel questions
before proposing rules. Subsequent batches: Victor/Kelvin/McGinnis, then
Vindicta/Grey Talon/Calico. Saved/shareable scenarios remain useful but are now behind
this coverage work. See latest VALIDATION.md for actual checks/publication status.


## Current expansion — 2026-10-15

Implementation 95b23e2 is live; remote Checks and Pages succeeded and the live
board was inspected. Burst-defense expansion: 25 conditional source-reviewed rules / 12
items, pinned to unchanged client 6785. Generic personal defenses now work for all
42 source-selectable player heroes against reviewed patterns from Abrams, Shiv,
Haze, Wraith, Bebop and Infernus. Four healing-denial rules remain Infernus-specific.

New purchases: Grit, Reactive Barrier, Rebuttal, Close Quarters, Weapon Shielding,
Spirit Shielding and Metal Skin; also reviewed Haze sleep reduction and applied
Infernus burn removal. Reactive Barrier is follow-up protection only: triggering-hit
absorption is unresolved. No execute, guaranteed parry or total-immunity claim.
See COMMUNITY_RESEARCH.md for source lineage, disputed/stale claims and exact scope.

Burst is the default problem view. More than three matches can be expanded within
each stage/objective/affordability bucket. Enemy-specific prerequisites are visible,
with identical sets grouped by enemy name. New while-actionable response metadata
filters Grit/Metal Skin when already stunned/asleep. No new questionnaire inputs.

All rules remain beta, not in-game tested. Review expires November 14, 2026 UTC;
refreshing facts never renews advice. Next: saved/shareable scenarios for reproducible
user tests, practical interaction timing checks, and researched chase/disruption
coverage. See the latest VALIDATION.md entry for checks and publication status.
The earlier first-slice-only scope and next-step text below is historical.


## Current release — 2026-10-15

Implementation ef93ce2 is live on GitHub Pages; remote Checks, Pages and the pinned
manual refresh succeeded (run IDs in VALIDATION.md). Live real cards were inspected.

First source-reviewed recommendation slice is implemented in src/data/reviewed-catalog.json:
seven rules / five items for Infernus facing Abrams and Shiv. Control: Debuff Reducer
and preemptive Unstoppable versus Abrams. DoT: community-reported Dispel Magic for
applied Shiv knives. Sustain: Healbane or Toxic Bullets versus actual healing.
All are explicitly source-reviewed beta, not verified or in-game tested. See
COMMUNITY_RESEARCH.md for evidence and limits; no execute or guaranteed parry rule.

Refreshed public source to client 6785: 42 selectable heroes and 173 shop items.
Deadman Danny's availability changed; selected item facts and normalized abilities
for this slice did not change versus 6774. Official latest follow-up was inspected;
community extraction may still lag unrepresented hotfixes.

Default board is real source-reviewed advice; demo remains opt-in. Added DoT view,
per-card conditions, sources, review dates, stage rationale, owned-item filtering,
soft build preference and optional response-window filtering. Prices are full cost;
component credit, slots, team redundancy and enemy rank inputs remain unsupported.
Unsupported heroes/problems/goals are shown as gaps. Source-reviewed advice requires
an explicit engine option; verified-only evaluation still excludes it. Catalog
version mismatch and review expiry suppress advice. This release expires 2026-11-14
UTC, a maintenance policy, not a promise of freshness until then.

Next: resolve Reactive Barrier trigger/damage ordering and immediate burst options;
expand sourced matchup coverage; test practical timing before any verified promotion.
No user mechanics certification is required. Read latest VALIDATION.md for checks
and deployment status. Historical no-live-rules statements below are superseded.

Prepared 2026-10-11 from the conversation supplied by the user. This file and the
linked documents are the continuity contract; a new Codex session need not have
access to the old chat. They preserve all product-relevant decisions visible in
that conversation. Earlier infographic files and exact assistant advice were not
provided, so their contents have not been reconstructed.

## Goal

Build a static, responsive Deadlock Counter Advisor hosted on GitHub Pages. A
player describes their own hero/build and several enemies plus the problem they
are experiencing. The app returns understandable, situational item options for
survival, disruption, and punishment, divided by immediate affordability and
future purchases. Explain the specific mechanics and limitations, not just a rank.

## Read order

1. CONVERSATION_CONTEXT.md — user intent, corrections, and examples to verify.
2. ../PROJECT_SPEC.md — user experience and acceptance criteria.
3. ../DATA_MODEL.md — entities, evidence, patch model, and scoring contract.
4. ../ROADMAP.md — implementation sequence and future maintenance.
5. DECISIONS.md and VALIDATION.md — boundaries and actual verification.

## Current state

Latest research 2026-10-12: user wants source-driven research and is not expected
to be the mechanics expert. Read COMMUNITY_RESEARCH.md and
data/research/counter-claims.json: eight sources / eight candidate claims, scoped
to the first matchup slice. Recent guide/community discussions were compared with
client 6774; stale wiki values and cleanse/reduction conflation recorded. Video
retrieval failed and supplies no evidence. No claim was promoted to a live rule.
Next: resolve the specific candidate interactions using accessible corroboration,
model conditional timing and DoT, then implement the first supported real lists.
Do not ask the user to certify mechanics merely because expertise would help.

Latest continuation 2026-10-11: repeatable catalog import and simpler browsing
implemented. Read GAME_DATA.md for refresh/review commands and source limits.
Implementation d84c697 is deployed; remote Checks/Pages and manual refresh all
succeeded. Live page was reloaded and inspected. See VALIDATION.md for run IDs.
Pinned client 6774 snapshot contains 65 hero records / 757 entities, with 41
source-selectable heroes and 173 shop items displayed (17 special-tier records
kept separate). Portrait/item URLs and colors come from the source; failures have
fallbacks. Imported facts stay separate from verified rules: no live counter
recommendations have been certified. New manual data-refresh workflow uploads
review artifacts; Pages still deploys accepted main pushes after checks.
Problems are now browseable views with Early/Mid/Late columns in the opt-in demo
board; stage/problem checkboxes are removed. Budget/active preference are optional.
Full item browsing uses source tiers, not invented stage-fit or matchup claims.
Next: audit selected mechanics and implement a real reviewed vertical slice using
the captured data; independently check roster/mode availability against the game.
Historical scaffold-only/no-catalog statements below are superseded.

GitHub continuation 2026-10-11: user authorized creating a new repository and
hosting the demo for testing. Repository is now
https://github.com/matcpn/deadlock-counter-advisor, with origin configured locally
and main pushed. Pages uses Actions and deploys successful pushes to main (also
manual dispatch). Test URL: https://matcpn.github.io/deadlock-counter-advisor/ .
See VALIDATION.md for actual remote results. This supersedes all older statements
below about no Git checkout, remote, commit or deployment. No game data was added.

Continuation update 2026-10-11: completed the first runtime-validation portion of
Milestone 1. Catalogs now require a versioned manifest, source records, coverage
note, scoped evidence and an acyclic component graph. Recommendation entry checks
catalogs, scenarios and weights. Production requires matching patch and complete
verified evidence; needs-review data is excluded. The player hero can no longer be
selected as an enemy. See DATA_REVIEW.md for the import contract and research queue.
42 tests and the production build pass. Vitest upgraded to 5.0.3 to resolve the
installed dependency advisories; npm installation reported zero vulnerabilities.
This directory is not a Git checkout. No commit, remote or deployment was created.

Implemented: runnable React/TS/Vite scaffold, typed domain, synthetic fixtures,
scenario form, grouped cards, deterministic demonstration ranker, focused tests,
CI and manual Pages workflow. There is no production catalog, complete roster,
verified item interaction, deployed URL, or remote commit. GitHub connection is
confirmed for matcpn; repository search `user:matcpn deadlock` returned no results.
No repository destination was supplied. Do not infer one or claim a push succeeded.

## First work for the next session

1. Inspect repository state and these documents. Keep the design direction.
2. Run npm ci and npm run check. Read VALIDATION.md for prior results.
3. Verify current roster, items, prices, categories, activation types, ability
   descriptions, and patch date using current sources. Build a source manifest.
4. Resolve the specific user examples in CONVERSATION_CONTEXT.md; record verified,
   conditional, false, or unresolved outcomes. Do not simply implement those claims.
5. Extend the implemented validators for effects, availability, dependencies and
   conditional mechanics before adding live rules. Start with a
   carefully verified Infernus versus Abrams/Shiv vertical slice, using the same
   layout every hero will get; then extend across the full playable roster.
6. Implement advanced constraints, scoring explanations, and tests in ROADMAP.md.
7. Populate and audit remaining heroes. Mark unsupported coverage visibly.
8. Validate responsive UI, keyboard flow, behavior and Pages subpath deployment.
9. Choose/create the remote with the user if still absent; commit the project and
   use the prepared Pages workflow when deployment is requested/authorized.

## Prompt to use in Codex

> Continue this Deadlock Counter Advisor project. First read AGENTS.md and
> docs/HANDOFF.md, then the linked context/spec/model/roadmap files. Treat them as
> the project brief; do not restart discovery or replace it with a static hero-to-item
> list. Inspect the scaffold, run its checks, and implement the next incomplete
> milestone. Verify current Deadlock data and the user-supplied interaction examples
> before adding real recommendations. Preserve Survive/Disrupt/Punish groups,
> early/budget options, multi-enemy coverage, item colors, active-item distinctions,
> explicit limitations, and soft build-fit preferences. Keep data and ranking
> configurable and patch-aware. Update the handoff and validation notes as you work.
> Target GitHub Pages; inspect the selected repository before writing or deploying.

Attach the ZIP or open the repository containing it. This prompt alone is an index;
the files carry the detailed context. Do not assume chat history transfers automatically.
