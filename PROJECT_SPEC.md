# Product specification

## Product outcome

Help a player make the next useful item purchase against the threats in their
match, with an explanation they can act on. Every result answers: what problem
does this solve, against whom, when does it work, what does it cost, what is the
tradeoff, and how confident/current is the advice?

## Main flow

1. Choose your hero and build direction (spirit/weapon/hybrid, later custom tags).
2. Select one or several opposing heroes. Optionally mark the highest-priority
   threat and the abilities/build patterns actually causing the problem.
3. Choose a problem: burst death, control/combo lock, damage over time, enemy
   sustain, mobility/escape, channel/ultimate, or another supported mechanic.
4. Set stage and available souls. Stage is not a proxy for budget.
5. Get three compact groups: **Survive**, **Disrupt**, **Punish**. Each contains
   **Buy now** and **Save for later**, with no more than 3 initial cards per bucket.
6. Expand a card for exact mechanisms, activation timing, constraints, alternative
   choices, confidence and sources. Show unsupported coverage honestly.

Default advanced inputs collapsed; selecting hero, enemies and problem should be
fast. Keep prior scenario locally and support a shareable URL query in the MVP.
Use versioned URL state with safe parsing/fallback, no account or server required.

## Inputs and why they matter

| Factor | Effect on a recommendation |
| --- | --- |
| Player hero/build | Application method, range, weapon uptime, spirit/weapon benefit, innate cleanse/escape/sustain |
| Enemy heroes and priority | Shared coverage versus a fed threat that needs special attention |
| Enemy ability ranks/build | Combo windows, dominant damage, immunity/defensive counterplay |
| Problem and intent | Survive burst, deny sustain, interrupt setup, chase or escape are different goals |
| Stage and budget | Lane viability and affordability; savings must not crowd out usable options |
| Existing items/upgrades | Avoid duplicates; count actual incremental upgrade cost once verified |
| Slots and replacement cost | Utility purchase may delay core damage or require selling a valuable item |
| Active-item comfort/capacity | Button load, available slots, reaction demand and cooldown |
| Mechanic timing | Preemptive protection versus reactive use; already stunned versus free to act |
| Delivery/range/line of sight | Item may require shots, melee, target lock, proximity or sustained application |
| Team context | Teammate already supplying anti-heal/control; solo execution versus coordination |
| Damage profile | Bullet/spirit/melee and burst/DoT must be modeled separately where appropriate |
| Positioning and frequency | Isolated dive versus teamfight; response cooldown versus threat frequency |
| Evidence/current patch | Unknown and stale interactions must not appear as guaranteed current counters |

MVP must support the first five directly plus active preference, freshness and
basic timing constraints. Remaining inputs can launch incrementally; mark them as
unsupported until wired into scoring. Do not present nonfunctional controls.

## Recommendation card contract

- Item name, verified cost and category; accessible category label and color.
- Explicit Active / Passive / Conditional proc badge; active use visually prominent.
- Buy now or Save for later; show additional souls needed where useful.
- Which selected threats and abilities it covers, and which it does not.
- One sentence: mechanism → effect on the selected problem.
- When/how to apply it, prerequisites, and cooldown/duration caveats if relevant.
- Tradeoffs: build fit, core-item delay, timing difficulty, remaining vulnerabilities.
- Rule evidence status, last reviewed patch/date, expandable sources.
- Avoid numeric “success probability”; ranking scores are internal heuristics.

## Acceptance scenarios

A. Infernus vs fed Abrams + Shiv, burst problem, small budget: show verified early
survival options before expensive future purchases; include multi-threat coverage.
Do not recommend anti-heal as though it necessarily prevents immediate death.

B. Same enemies, cannot finish them: punish/anti-sustain choices can rise while
burst-only tools need not. Output changes with the selected problem.

C. Spirit build: a useful weapon-category active can still appear with its utility
and opportunity cost explained; do not globally ban an item category.

D. Lane with limited souls: no late-only recommendation presented as an immediate
solution. Show “no verified affordable option” when that is the honest answer.

E. No actives: active recommendations disappear; conditional procs remain labeled.
If only active counters exist, explain the uncovered problem.

F. Owned item or upgrade: do not suggest rebuying; verify component credit before
claiming an upgrade is affordable. Distinguish a build path from a final purchase.

G. New patch alters an item: invalidated relations become needs-review; past
verification cannot silently survive a mechanics change.

H. Missing/unknown hero or malformed shared URL: graceful message and safe default;
never invent coverage. Player hero and enemy selection must obey game constraints.

## MVP exclusions

No live match integration, matchmaking analytics, account system, paid backend,
automatic LLM answer generation, complete build optimizer, or promised win-rate
improvement. Use no external art until usage permissions/source provenance are clear.
