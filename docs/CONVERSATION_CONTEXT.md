# Product conversation and intent

Source: user-supplied conversation excerpt, followed by a request for scaffolding
and a complete plan to continue in Codex without losing context. This is a faithful
product-focused record of the visible messages, not a claim to recover unseen turns.

## How the idea evolved

1. Initial request: an organized cheat sheet of items to counter every Deadlock
   hero, possibly an infographic with groupings.
2. User asked to color-code items by their in-game category and questioned whether
   Inhibitor against Victor belonged among the counters.
3. User asked to highlight active versus non-active items.
4. User used Shiv as an example of a failure: healing reduction might help kill
   him but not help the player survive; expensive answers might arrive too late.
   They asked whether cheaper debuff removal/dispelling options could fit.
5. An expanded Shiv section was explicitly rejected. It was an example of a
   general reasoning problem, not a request to dedicate the product to Shiv.
6. Another scenario: Infernus gets immediately engaged on by Abrams and nearly
   killed by the combo. What item helps with THAT problem?
7. User concluded a static infographic was too dense and context-dependent.
   They proposed selecting their own hero, multiple problem enemies (e.g. fed
   Shiv/Abrams), and seeing punish/survivability options by stage and mechanism.
8. User asked about GitHub Pages and about future updates as heroes/items change.
   They wanted malleable data and configurable weights or a better mechanism;
   an automated maintenance process could be Phase 2.
9. A previous assistant proposed React, TypeScript, Vite, a dark responsive UI,
   deterministic versioned data, tests, GitHub Actions, and spec/model/roadmap docs.
   These are proposed implementation choices, not completed work.
10. Current request: GitHub should be connected; set up a scaffold and complete
    plan or continuation prompt, with special concern about context loss.

## User statements to preserve as research questions

These are NOT verified mechanics. Do not seed a live rule merely from this table.

| Example from the user | Question the implementation must resolve |
| --- | --- |
| Inhibitor against Victor | Does its current effect reduce the relevant threat, and how is it applied? Verify hero spelling/identity, item category, price, and mechanics. |
| HB/TB against Shiv healing | Clarify abbreviations; verify effects. Separate denying sustain from surviving burst or an execute. |
| ES/CR as big 6400 investments | Clarify item names and current costs. Do not assume these abbreviations or price tiers are current. Offer earlier interventions where supported. |
| Debuff Remover or Dispel Magic as cheaper choices | Verify whether each exists currently, current price, cleanse versus enemy dispel behavior, affected effects, timing and restrictions. |
| “E vs shiv shuts down bleeds + ult” | “E” is unresolved. Do not silently expand it to an item or accept blanket bleed/ultimate prevention. Check already-applied effects and execute thresholds separately. |
| Debuff Reducer creates a parry window versus Abrams | Verify stun reduction, ability ranks, combo timing, latency assumptions, and whether a practical parry window exists. Avoid “guaranteed parry” claims. |
| Reactive Barrier gives more survival room | Verify current trigger, damage coverage, cooldown and whether the incoming combo triggers it in time. |
| Spirit heroes may not want a gun item like Knockdown | Verify current category. Treat build fit and opportunity cost as soft preferences, not an absolute exclusion of utility items. |

## Non-negotiable UX preferences

- Organized, scannable results; progressive detail, not every possible mechanic at once.
- No disproportionately huge Shiv section. A shared card structure for all heroes.
- Item colors correspond to the verified current in-game categories.
- Active status is independent of category; color alone cannot carry either meaning.
- Explain exactly what is prevented/reduced/removed, when to use it, and what remains.
- Prioritize actionable, economical answers to the selected issue.
- Distinguish “I cannot kill them” from “they kill me instantly.”
- Compare one item covering multiple enemies with more specialized alternatives.
- Stay flexible as the game evolves; do not hardcode gameplay knowledge in React.

## Scope of preserved context

No need to import unrelated personal history. This project concerns Deadlock,
Infernus-relevant scenarios, item decision support, GitHub Pages, maintainable data,
and a reliable handoff. The actual prior infographic and any unseen counter table
are not available in this package.
