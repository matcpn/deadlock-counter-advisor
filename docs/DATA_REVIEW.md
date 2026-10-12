# Data review queue — 2026-10-11

## Source discovery

Opened the official [Deadlock changelog](https://forums.playdeadlock.com/forums/changelog.10/)
on 2026-10-11. This is a primary source candidate for patch changes, not a complete
current catalog or proof of a specific counter interaction. No current patch ID
has been certified and no source has been promoted into a production manifest.
Search results alone were not used to establish mechanics, roster, or prices.

Before the first live slice, record the exact patch post and any later hotfixes,
then collect current tooltip or reproducible in-game evidence for each item field
and each interaction. A generic item page alone does not verify a counter rule.

## Research outcomes carried forward

All examples remain unresolved; none were converted to production recommendations.

| Question | Status | Evidence needed next |
| --- | --- | --- |
| Inhibitor against Victor | Unresolved | Current hero identity, item facts, application and relevant damage effect |
| HB/TB against Shiv sustain | Unresolved | Abbreviation clarification and current healing-reduction interaction |
| ES/CR and claimed 6400 cost | Unresolved | Exact item identities and current price/category/activation |
| Debuff Remover / Dispel Magic | Unresolved | Current existence, costs, targets, removable effects and restrictions |
| E removes bleeds and stops Shiv ultimate | Unresolved | Identity of E; separate existing bleed removal from execute prevention |
| Debuff Reducer enables Abrams parry | Unresolved | Rank-specific timing and reproducible combo/parry test |
| Reactive Barrier survival | Unresolved | Trigger timing, covered damage, cooldown and remaining damage |
| Knockdown on spirit builds | Unresolved | Current item facts and utility/application requirements |

## Import contract implemented this session

`src/domain/validate.ts` accepts unknown input through `parseCatalog`. The engine
also validates on entry, so typed callers cannot bypass checks with an unsafe cast.
Schema version 1 requires separate data, patch, and scoring versions; catalog kind;
source records; and an explicit coverage note. Coverage completeness is declared,
not automatically proven. It must stay false until the roster is audited.

Verified item evidence needs claims `cost`, `category`, `activation`, `components`.
Verified rule evidence needs `interaction`, `timing`, `limitations`. Both need a
reviewer, valid review date, nonempty note, matching manifest patch and source URLs
present in the manifest. These are required evidence scope labels; a reviewer must
still verify what the sources actually support. The schema cannot certify truth.

Needs-review records may remain for research/history but never generate production
advice. Old records labeled verified are rejected until marked needs-review or
reviewed against the new patch. Demo catalogs accept demo evidence only; production
catalogs reject it. Production evaluation requires an explicit matching patch.

Component IDs now form a validated acyclic reference graph. **No component credit
is calculated yet**; the engine still compares full listed cost with budget.
Availability, modes, effects, dependency-based invalidation, expiry policy, detailed
claim-to-source mapping and conditional timing remain future work.
