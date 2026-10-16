# Expanding roster coverage

For the next item-depth loop, run `npm run research:build` and read
[ITEM_COVERAGE.md](ITEM_COVERAGE.md). It counts distinct eligible items across all
scenarios/stages and lists every hero below two. Counts use the inventory's explicit
triage date for reproducibility and the same coverage gate for expired/changed
evidence; the application checks today's availability. Research candidates by
function, then verify their individual abilities and exclusions before adding rules.
The October 16 pass resolved 19 one-item heroes; its original targets are preserved
in `data/research/item-depth-pass.json`. This is a research target, never a reason
to invent a second interaction. New heroes or evidence changes can reopen the queue.

Start with [ROSTER_RESEARCH.md](ROSTER_RESEARCH.md): the generated inventory, all-hero
coverage matrix, unresolved source details, reusable function queue and research
batches. It is a research map, not a complete counter guide. As of October 16, 2026,
it inventories 42 selectable heroes / 168 main-slot abilities from client 6785.
The public steam-info endpoint was rechecked and still reports that client version.

## Three independent layers

1. **Threat inventory:** manually selected ability-text themes with exact supporting
   spans. Heroes can have many functions, and one ability can have several. The
   full description is retained so upgrades, conditions and negations stay visible.
2. **Response functions:** categories such as spirit resistance, duration reduction,
   applied-debuff removal or interruption. Thirteen response families include links
   to reviewed items where relevant. Empty families remain
   research tasks. Matching a threat to a family is only a lead.
3. **Reviewed interactions:** separately maintained rules in reviewed-catalog.json.
   Only this layer reaches the recommendation engine. Neither inventory generation
   nor a function match creates, renews or certifies a counter rule.

Twenty-five threat themes keep bullet/spirit/melee damage, disables, healing,
barriers, damage deferral/protection, mobility and special mechanics distinct.
These are a first-pass index, not an exhaustive effect ontology. Do not infer
damage type from Spirit scaling, names, or a self-damage clause. Do not infer
interruption from sleep, cleanse eligibility from a debuff, or healing from deferral.

## Editing and repeating the inventory

- `data/research/hero-threats.json`: human-readable seed annotations. Each ability
  is identified by source class name and stores its baseline normalized description,
  exact evidence spans, function IDs, notes and unresolved gaps. Optional propertySignals
  store exact paths and values in raw ability properties/behaviours; the builder
  reads the pinned items snapshot and checks those values before publishing tags. Initial triage is
  explicitly attributed to Codex source-text comparison, not in-game verification.
- `src/data/research-functions.json`: function vocabulary, response families and
  the question to investigate for each. Item references point at the reviewed
  catalog; they do not add hero-specific relationships.
- `data/research/research-plan.json`: editorial batches, questions and promotion
  gates. Priorities reflect reuse and current gaps, not measured popularity.
- `src/data/threat-inventory.json` and `docs/ROSTER_RESEARCH.md`: generated outputs;
  edit the source annotations or plan and rebuild them instead of hand-editing.
- `data/research/roster-review.json`: per-hero pass ledger, exact ability baselines,
  rule/source references and unresolved questions. `docs/ROSTER_REVIEW.md` is generated
  from it. New heroes or changed source descriptions lose completion;
  invalid rule identities, missing rule/source references and duplicate records fail
  validation. This does not generate or renew recommendations.

```sh
npm run data:pull
npm run research:build
npm run check
```

`research:build` requires no network and generates identical output for identical
inputs. `research:verify` compares regeneration with committed artifacts and runs
inside every `npm run check`. The manual refresh workflow rebuilds the inventory
and includes the resulting report in its review artifact, even if later checks
fail. It does not promote rules or update triage dates.

A new client version withholds all old functional annotations. On same-client
description or supporting-property drift, only the changed ability's annotations
are withheld. Missing or duplicate raw ability records also withhold property-backed tags. New heroes
and abilities appear as untriaged; removed/unselectable heroes are retained as
retired IDs in the report data. Re-triage requires reading the new source, updating
the stored baseline and evidence deliberately, and rebuilding. The old seed text
remains in Git for comparison. A new snapshot does not prove live-client completeness.

## Reading coverage correctly

The matrix covers enemy × problem, with early/mid/late rule counts, objectives and
the union of supported player scopes available on expansion. It spans all player
scopes and does not apply the current user's budget, inventory or response window.
Individual recommendation cards still determine whether a purchase fits a scenario.

- **Conditional:** at least one source-reviewed rule/item pair is available for
  part of the problem. It is not complete coverage of the enemy or all abilities.
- **Reviewed:** available rule/item pairs are verified. None currently qualify.
- **Needs review:** records exist but are unavailable, including patch/date drift.
- **Research gap:** no published rule for this problem. It does not mean the hero
  lacks that threat, or that no useful item exists.

The browser evaluates availability using today's UTC date. The generated Markdown
uses the triage date explicitly, so the committed artifact does not change each
day. Release-wide expiry, patch and item-fact drift suppress available coverage.
Player scope is visible: Abrams/Shiv healing denial remains Infernus-only; newer
recipient rules cover four reviewed delivery routes. Generic personal defenses
support other source-selectable players.

No `no-supported-option` negative verdict is populated without a documented review.
The initial inventory added no advice. Subsequent reviewed batches bring the catalog
to 83 rules / 16 items, with a bounded scenario for each of the 42 enemies; see
COMMUNITY_RESEARCH.md. Complete roster review does not mean complete counter coverage.

## Research a batch

1. Repair any missing descriptions/types for the selected heroes. The current
   report flags 15 abilities, including incomplete base text, missing damage types,
   transformed/copy kits and Wraith's card suits. This is a known-gap list, not a
   completeness audit. Base weapons and alternate kits still need inventory work.
2. Read pinned item facts and current official changes; find accessible creator,
   guide or community evidence for the exact interaction. Record source date,
   patch uncertainty and shared data lineage. Reposts are not independent evidence.
3. Propose narrow ability-specific rules: objective, relevant damage/effect,
   application method, timing, exceptions, player scope and stage rationale.
4. Use direct client tests when important event ordering or exceptions remain
   unresolved. Keep supported narrow alternatives and visible uncertainty; do not
   require the user to become the mechanics expert.
5. Add focused regression tests, update evidence/expiry intentionally, regenerate
   coverage, run checks and inspect the UI before publishing.

First slice delivered: **Seven, Dynamo, Mo & Krill**, six conditional channel-interrupt rules with personal-survival and timing questions still open.
The first healing/persistent-damage slice for **Victor, Kelvin, McGinnis** is also
delivered. The flight/movement slice and remaining-roster pass are now delivered too.
Use ROSTER_REVIEW.md for per-hero follow-ups and the function queue for shared
opportunities. Research remains incremental; a completed first pass does not close
the remaining mechanics questions or certify every match scenario.
