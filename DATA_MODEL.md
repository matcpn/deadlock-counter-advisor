# Data model and recommendation contract

## Item decision summaries — 2026-10-16

CounterRule optionally carries decision { chooseWhen, tradeoff }, both nonempty.
It shares the rule evidence, eligibility and player scope. browseExplanations only
groups current matched rules, retaining enemy IDs; the UI renders the pair instead
of the main mechanism paragraph. Full mechanics remain in details and older rules
fall back to their mechanism. No runtime generation or new ranking is introduced.

## Imported item tooltips — 2026-10-16

GameItem.tooltipSections stores sanitized source section text and formatted base
stats (stable property name, label, value with source sign/unit). It preserves
innate/active/passive boundaries, omits missing icon-only references, and puts
additional meaningful labeled properties in their own section. Raw properties are
still retained. Regeneration uses the same immutable snapshots and verification;
the UI never invents item numbers or promotes these facts into interaction rules.

## Unpersonalized browse adapter — 2026-10-16

The primary UI uses browseBoard: enemy IDs and optional active/owned/response filters
produce a deduplicated item list for each stage across all problems and goals.
It shares the personalized engine's evidence eligibility gate. The existing release
adapter still pauses on item/patch drift. Player scope remains attached to each
rule and appears on restricted cards; there is no assumed player, build or budget.
Sorting is by price, shared enemy count and stable item ID, without cross-goal score
aggregation. Personalized recommend() and its goal/budget model remain intact.

## Source-traced threat inventory — 2026-10-15

A separate research layer now stores per-ability function tags, exact source spans,
baseline text, notes and gaps for all source-selectable heroes. A hero may have many
functions. Response families contain research questions and references to existing
reviewed items, never automatically generated counter links. This data is not
imported by the recommendation evaluator.

buildThreatInventory invalidates tags on snapshot or description drift; new abilities
are untriaged. buildCoverage reports available reviewed rules by enemy/problem/stage,
objective and player scope, with expiry/patch/item-drift checks. These counts are
partial, across player scopes and before scenario preferences. researchBacklog groups
questions by function and counts unserved heroes without modifying the catalog.
See docs/RESEARCH_PROCESS.md for source files, regeneration and evidence boundaries.


## Implemented source-reviewed extension — 2026-10-15

Evidence now includes source-reviewed, separate from verified, needs-review and demo.
Both reviewed statuses require complete claim labels, source manifest membership,
reviewer/date and matching client patch. Source-reviewed additionally requires expiry.
The evaluator includes it only with allowSourceReviewed:true, and rejects expired
or future-dated evidence. Default evaluation remains verified-only.

Source-reviewed rules require playerHeroIds, nonempty visible conditions, response
(passive / before-control / after-debuff / while-actionable), and stageReason. Scenario.responseWindow
excludes the three actionable response types when already stunned/asleep.
While-actionable is a recommendation prerequisite, not proof of every casting exception.
Unobserved prerequisites remain conditional text, not automatically true facts.
Problem dot is separate from burst. The release adapter additionally checks imported
item identity, price, category, activation and components before showing advice.

The scoped release JSON is independent of generated game-catalog.json. Snapshot
refreshes never regenerate or promote rules. Review expiry is exclusive, by UTC date.
The engine remains deterministic when asOf is supplied; the browser uses today's UTC
date. Full item prices remain intentional; ownership never implies component credit.

## Architecture

As of 2026-10-11, the source-import layer is separate: version-pinned API responses
→ immutable raw snapshots/checksums → `normalizeGameData` → browseable
`GameSnapshot`. `npm run data:verify` reconstructs it offline during every check.
Imported facts have imported-unreviewed status, and cannot become `Catalog` counter
rules by being fetched. Stable numeric upstream IDs are prefixed hero-/item-.
See docs/GAME_DATA.md for schema, asset provenance, refresh and coverage limits.
The problem-board adapter evaluates each stage separately with the same selected
heroes and budget; problem views replace stage/problem inputs in the current UI.

Static React client → validated versioned catalog → pure rule evaluator → ranked,
explained results. Domain functions have no browser dependencies. UI does not
contain hero-specific if/else branches. Runtime validators reject malformed imports.

`src/domain/types.ts` is a deliberately small executable starting point. The richer
entities below are the target model, not a claim they are implemented already.

## Target entities

| Entity | Required data |
| --- | --- |
| Dataset manifest | schemaVersion, dataVersion, gamePatchId, release timestamp, supported modes, source manifest, coverage report |
| Hero | stable ID, display name, aliases, status, abilities, role/build tags |
| Ability | stable ID, hero ID, rank variants, damage types, effect IDs, timings, targeting and counter restrictions |
| Item | stable ID, aliases, category, cost, availability, upgrade/component graph, activation type, delivery method, effects, cooldown, duration |
| Effect | semantic mechanic (heal reduction, cleanse, dispel, CC resistance, interrupt, etc.), target, stacking group, dispellable/cleanseable flags, conditions |
| Counter relationship | item/effect IDs, enemy hero/ability/effect IDs, objective, issue tags, prerequisites/exclusions, timing, strength, explanation, limitations, evidence |
| Player synergy | hero/build ID, item/effect ID, application suitability, benefit/penalty, rationale, evidence |
| Scenario | own hero/build/items, enemies/priorities/known ranks, problems, stage, souls, active capacity/preference and optional team coverage |
| Scoring profile | named version, weights, tie-breaks, thresholds, unknown-condition policy |
| Evidence record | source URL/title/type, observed patch/date, field/claim scope, excerpt or test protocol, reviewer, status and invalidation dependencies |
| Recommendation | item, objective, purchase bucket, incremental cost, matched rule IDs, covered threats, score components, conditions, confidence, rationale |

IDs remain stable across display-name changes. Aliases and migrations handle renames;
deleted items remain in historical snapshots but cannot be recommended. Use nullable
unknown values rather than invented costs or categories. No implicit universal rule
from absent conditions. Enforce upgrade graphs are acyclic and references resolve.

## Separate facts from judgments

Facts: cost, category, cooldown, effect duration, active/passive state, patch values.
Mechanics: whether a cleanse removes a specific effect, whether an item is usable
while controlled, what an immunity blocks, whether an interrupt beats a cast delay.
Judgments: strength, practical reliability, stage suitability, build opportunity cost.
Do not expect changing weights to repair an obsolete mechanical relationship.

A “verified” rule must identify evidence for the actual interaction, not merely
link an item's generic wiki page. Automated ingestion can update numeric facts;
conditional gameplay judgments require a reviewed proposal or reproducible test.
Confidence is not probability of winning a fight.

## Evaluation pipeline (target)

1. Validate catalog and scenario; deduplicate enemy/item IDs and validate ranges.
2. Resolve selected threats and optional priorities; select matching objectives.
3. Filter disabled/stale/unverified items and rules; apply hard impossibilities:
   unavailable item, duplicate ownership, active ban, known immunity, out-of-scope
   game mode, impossible timing or delivery. Unknown prerequisites create a clearly
   conditional result, never an unconditional recommendation.
4. Compute incremental cost from verified upgrade graph. If unknown, do not label
   affordable. Classify Buy now / Save for later before rank ordering.
5. Per objective, aggregate matched rules per enemy with capped contribution. Avoid
   double-counting the same effect or stacking group. Prioritize the user's main
   threat and add a bounded bonus for useful secondary coverage.
6. Apply configurable bonuses for problem fit, timing/stage fit, practical
   reliability and build synergy; penalties for opportunity cost, active burden,
   redundant team effects and uncertain assumptions.
7. Sort deterministically within each objective and purchase bucket; use stable
   ID as final tie-break. Diversify by mechanic so the top cards offer real choices.
8. Produce explanations from matched rules and actual score components. Show
   uncovered threats; never invent prose that asserts stronger coverage than data.

Suggested initial score: weighted threat coverage + problem fit + practical
reliability + build fit + stage fit − opportunity cost − redundancy − execution
burden. Calibrate on reviewed scenarios, not a claim of statistical optimality.
Scores across different objectives are not directly comparable. Do not sum all
three objectives into a single “best item.”

## What the scaffold actually does

Filters by evidence status/patch, selected enemies, problem, stage, owned items and
active preference. Separates affordability, aggregates unique enemy coverage,
adds build-fit and coverage weights, and returns deterministic objective-tagged
results. `options.demo` allows synthetic fixtures only; default production mode
requires verified evidence matching an explicit patch. It now validates a versioned
manifest, source membership, required evidence scopes/reviewer/date, costs, enums,
references, duplicate IDs, component cycles, scenarios and weights. See
docs/DATA_REVIEW.md for the executable contract and limitations. It does not yet
model expiry, effects, availability, detailed claim-to-source mapping or advanced
conditions. Component credit is not computed. Its static hero selector has no
hero-specific synergy rules. Evidence content still needs human review before any
production dataset is released.

## Versioning

Schema version changes shape; data version changes reviewed content; patch ID tracks
the game; scoring version changes ranking. Keep all four distinct. Store immutable
released snapshots and a current manifest. A changed patch should invalidate only
provably affected rules using dependency links, but until impact detection is
reliable, mark potentially affected rules for review conservatively. Never silently
promote unknown data to verified. CI requires evidence fields for live rules.
