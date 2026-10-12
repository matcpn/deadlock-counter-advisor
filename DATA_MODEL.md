# Data model and recommendation contract

## Architecture

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
