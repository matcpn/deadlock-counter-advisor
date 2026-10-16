# Community counter research — 2026-10-12

## Defining-threat batch: five heroes — 2026-10-16

Client/server 6785 and revision 11132425 rechecked at the public steam-info endpoint.
Compared pinned item and ability definitions with the sources below. Added six
source-reviewed rules and editorial decision summaries for all 16 rules in this
batch. No live-game tests; existing item reviews and November 14 expiry unchanged.

- **Bebop / Dispel Magic:** [Valve January 30 update](https://forums.playdeadlock.com/threads/01-30-2026-update.102822/)
  explicitly changes dispelled Sticky Bomb to drop and keep counting down. The
  [current ability notes](https://deadlock.wiki/Bebop) agree. Apply only to a bomb
  attached to the user, before detonation, with time to leave its blast area.
  Removing the attachment is not deleting the bomb, protecting nearby allies,
  reversing the hook or stopping Hyper Beam. Compare with Grit before the hit and
  Spirit Shielding only after surviving the damage trigger.
- **Infernus / Slowing Hex:** pinned Flame Dash has the MOVEMENT behaviour flag,
  now recorded as exact property evidence. The [movement-silence list](https://deadlock.wiki/Slowing_Hex)
  names Flame Dash, but its older item values are superseded by pinned 6785 values.
  Publish only prevention of a new cast on a targetable, unprotected enemy. Ongoing
  dash cancellation, recasts and Concussive Combustion interruption are excluded.
  Existing burn-purge and threshold-shielding choices remain separate.
- **Warden / Dispel Magic:** [May cage discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1t6x3ae/nerf_warden_lvl_3_cage/),
  the [September 20 player-authored build](https://deadlocklabs.gg/builds/warden-spoooomples-make-them-buy-dispel-816613/)
  and the wiki Dispel interaction index support removing Binding Word. The build
  explicitly plans repeat cages after the purge. Pinned Dispel is a non-ultimate
  self-purge unusable while stunned/asleep. Exact pending-to-root event timing is
  untested. No Last Stand counter or immunity claim; passive duration reduction
  and post-root barrier remain distinct alternatives.
- **Lady Geist / Dispel Magic:** the wiki interaction index names Life Drain/Malice.
  An [August firsthand report](https://forums.playdeadlock.com/threads/lady-geist-life-drain-uninterruptible-by-cursed-relic.157029/)
  distinguishes self-dispel from Cursed Relic failing to interrupt Life Drain.
  [Community discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1sea0au/how_tf_am_i_supposed_to_fight_lady_geist/)
  warns about repeat drain charges. Publish conditional removal of the user's
  applied drain/Malice; exclude Soul Exchange, ally cleansing and Cursed Relic
  interruption. Do not adopt a proposed Malice rework as live mechanics. Wiki
  full pages were blocked for Warden/Geist; available search-index interaction
  excerpts are corroboration, not a claim of full-page review.
- **Yamato / Healbane and Toxic Bullets:** pinned Crimson Slash explicitly heals
  on hero hits. [Ability notes](https://deadlock.wiki/Shadow_Transformation) and
  [community discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1qtsii8/how_to_deal_with_yamato/)
  support targeting that recovery. Restrict the advice to outside Shadow
  Transformation: immunity/cleanse persistence and kill healing remain unresolved.
  Healbane needs qualifying spirit damage; Toxic Bullets needs bullet buildup.
  Retain the existing four reviewed player-delivery examples, with no generalized
  application or stacking claim. Rebuttal covers Flying Slash melee; Spirit
  Shielding addresses post-trigger spirit follow-up, not healing denial.

The six defining-* rule IDs and per-hero remaining questions are recorded in the
roster-review ledger and regenerated reports. Decision text is an editorial summary
of each rule's own evidence, not an independent mechanics source or numeric ranking.

## Build-color gaps — 2026-10-16

Initial eligible coverage: 39 enemies with a green option; Dynamo, Mo & Krill and
Seven had Knockdown and Cursed Relic, both Spirit. Added three bounded rules, bringing
the release to 105 rules / 16 items and 42/42 enemies with green options.
Public steam-info remains client/server 6785, revision 11132425 (October 14).

- **Dynamo / Reactive Barrier:** the [first-hand Singularity report](https://forums.playdeadlock.com/threads/indomitable-does-not-proc-against-singularity-when-reactive-barrier-does.143976/)
  describes this proc, contrasted with a different item's failure. Current pinned
  Singularity explicitly applies stun, matching Reactive Barrier's listed trigger.
  The report mentions video; this pass read the report, not the video. No escape,
  cleanse, Indomitable equivalence or repeated-proc guarantee is implied.
  [Kinetic Pulse's reported failure](https://forums.playdeadlock.com/threads/dynamo-not-activating-reactive-barrier.120634/)
  and its current knockup description exclude Pulse from the advice.
- **Mo & Krill / Reactive Barrier:** [Combo counter discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1rhv32w/hi_what_do_i_do_against_mo_krill/)
  supports barrier protection while still grabbed. Pinned item values supply the
  325 base barrier, 10-second duration and 55-second cooldown. Historical scaling,
  continuous-stun reduction and guaranteed survival claims were not adopted.
  No Burrow-knockup or Sand Blast-disarm trigger is claimed.
- **Seven / Spirit Shielding:** [shielding discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1rt9pwq/when_is_spirit_shielding_the_best_move/)
  identifies repeated Seven spirit hits. Existing raw markers support Lightning
  Ball, Power Surge shock and Storm Cloud damage type. Current pinned threshold is
  225 spirit damage in 3.5 seconds, then 300 base barrier / 18% spirit resistance
  for 8 seconds, cooldown 45 seconds. The opening damage must be survived. This
  does not interrupt the storm, clear Static Charge or cover ordinary bullets via
  spirit resistance. Low/spread-out damage may not proc the item.

All three remain source-reviewed, with no in-game test. Existing reviews were not
renewed; expiry stays November 14. Green category does not remove matchup conditions.

## Second distinct item pass — 2026-10-16

Counted distinct eligible items, not rules or repeated stage cards. The 19 heroes below each had one; this pass adds one different item per hero. All 42 selectable heroes now have at least two across reviewed scenarios (102 rules / 16 items). No client interaction tests were performed. See [repeatable queue](ITEM_COVERAGE.md).

Rechecked public steam-info: client/server 6785, revision 11132425, unchanged. Current pinned item and ability definitions take precedence over older discussion values. Community reports are leads and corroboration; explicit typed-damage/disable inferences remain labeled source-reviewed.

| Hero | Added item | Scoped mechanism | Supporting sources |
| --- | --- | --- | --- |
| Apollo | Reactive Barrier | the Riposte stun can trigger a barrier for follow-up damage. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1sdr3se/apollo_interactionsbalance/) |
| Baba | Reactive Barrier | the silence mode of Baba's Brew can trigger a barrier for follow-up damage. | [Source 1](https://deadlock.wiki/Baba) |
| Billy | Spirit Shielding | Concentrated spirit damage can trigger a barrier and temporary spirit resistance for follow-up damage. The resistance is not always on. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1vkfk3x/any_advice_for_characters_i_play/); [Source 2](https://steamcommunity.com/games/1422450/announcements/detail/670617878982034053) |
| Ivy | Debuff Reducer | Passive debuff resistance can shorten Stone Form's stun. | [Source 1](https://deadlock.wiki/Debuff_Reducer) |
| Lash | Reactive Barrier | the stun applied by Death Slam can trigger a barrier for follow-up damage. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1gw0lav/); [Source 2](https://forums.playdeadlock.com/threads/reactive-barrier-not-activating-on-knockups.82868/) |
| Mirage | Spirit Shielding | Concentrated spirit damage can trigger a barrier and temporary spirit resistance for follow-up damage. The resistance is not always on. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1s6pjcv/counter_mirage/); [Source 2](https://steamcommunity.com/games/1422450/announcements/detail/670617878982034053) |
| Paradox | Debuff Reducer | Passive debuff resistance can shorten the upgraded Time Wall silence. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1wo5jlt/paradox_carbine_build/); [Source 2](https://deadlock.wiki/Debuff_Reducer) |
| Pocket | Debuff Reducer | Passive debuff resistance can shorten the remaining duration of Affliction. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1nrvocz/is_there_any_counter_to_pockets_affliction_or_is/) |
| Rat King | Metal Skin | Brief bullet immunity can protect against Rat King's ordinary gunfire while you reposition. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1x3be01/what_items_counter_the_rat_king_the_most/) |
| Rem | Debuff Reducer | Passive debuff resistance can shorten Naptime's applied sleep. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1tax2co/how_does_this_little_shits_ult_work_how_do_i/) |
| Silver | Dispel Magic | Purge the Entangling Bola debuff after it is applied, while you can still use items. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1u2jvjo/silver_is_so_broken/) |
| Sinclair | Debuff Reducer | Passive debuff resistance can shorten Rabbit Hex's transformation duration. | [Source 1](https://deadlock.wiki/Debuff_Reducer); [Source 2](https://deadlock.wiki/Rabbit) |
| The Doorman | Reactive Barrier | the upgraded Luggage Cart wall-impact stun can trigger a barrier for follow-up damage. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1rthccx/tell_me_a_better_way_to_counter_this_doorman_combo/) |
| Venator | Weapon Shielding | Concentrated bullet damage can trigger a barrier and temporary bullet resistance for follow-up damage. The resistance is not always on. | [Source 1](https://deadlock.wiki/Venator); [Source 2](https://steamcommunity.com/games/1422450/announcements/detail/670617878982034053) |
| Vindicta | Reactive Barrier | the chain applied by Stake can trigger a barrier for follow-up damage. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1gw0lav/) |
| Viscous | Reactive Barrier | a Goo Ball impact stun can trigger a barrier for follow-up damage. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1gw0lav/); [Source 2](https://forums.playdeadlock.com/threads/reactive-barrier-not-activating-on-knockups.82868/) |
| Vyper | Dispel Magic | Purge the pending Lethal Venom debuff after it is applied, while you can still use items. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1uqpp0n/what_am_i_supposed_to_do_against_vyper/) |
| Warden | Debuff Reducer | Passive debuff resistance can shorten Binding Word's applied immobilize. | [Source 1](https://deadlock.wiki/Debuff_Reducer); [Source 2](https://deadlock.wiki/Warden); [Source 3](https://forums.playdeadlock.com/threads/debuff-reducer-on-warden-3.9409/) |
| Yamato | Spirit Shielding | Concentrated spirit damage can trigger a barrier and temporary spirit resistance for follow-up damage. The resistance is not always on. | [Source 1](https://www.reddit.com/r/DeadlockTheGame/comments/1qtsii8/how_to_deal_with_yamato/); [Source 2](https://steamcommunity.com/games/1422450/announcements/detail/670617878982034053) |

### Accepted boundaries and rejected overclaims

- Reactive Barrier is protection for subsequent damage after a qualifying applied disable, not a cleanse. Apollo Riposte, Baba Brew silence, Lash Death Slam stun, upgraded Doorman cart wall-stun, Vindicta Stake and Viscous Goo Ball are separately bounded. Baba Feed The Birds is excluded because of a reported trigger failure. Knockup-only claims from historical lists are excluded.
- Debuff Reducer is passive duration reduction: Ivy Stone Form, upgraded Paradox Time Wall silence, Pocket Affliction, Rem applied sleep, Sinclair Rabbit Hex and Warden applied root. It does not shorten Paradox Carbine time-stop, cleanse Affliction, prevent Rem wake-up damage, certify copied ultimates, or extend Warden's escape window. Historical Warden timer reports remain unresolved.
- Debuff Reducer reference pages served conflicting historical stats; only their named interaction leads were used. Numeric item values come from the pinned current snapshot.
- Spirit Shielding additions for Billy, Mirage and Yamato and Weapon Shielding for Venator are typed-damage inferences. Resistance begins after the threshold proc; the opening hit is not protected. Billy melee slam, Yamato Flying Slash melee, and Venator pure damage/execute are excluded. Yamato Power Slash now has explicit raw FullChargeDamage type markers, not an inference from scaling.
- Rat King Metal Skin covers ordinary gunfire only. A community comment described deflection; that claim was rejected because the item gives bullet immunity, not reflection. Reflected projectiles and grenade interactions remain untested.
- Dispel Magic additions cover applied Silver Entangling Bola and pending Vyper Lethal Venom while actionable. The Silver lead comes from a specific comment, not the satirical post premise. No claim is made about activation while Petrified or transformed-kit suppression.
- Every new rule retains exact conditions, timing, exclusions and source notes. Existing reviews were not renewed; expiry remains November 14 UTC. Two items overall does not guarantee two per ability, stage, player or preference.

## Whole-roster pass — 2026-10-16

Public assets/steam-info still reports client/server 6785, revision 11132425,
October 14 20:01:37. Reviewed the remaining 30 heroes' captured main-slot text,
current item properties, and accessible community/guide evidence. Added 41 rules:
83 rules / 16 items, with a bounded scenario for all 42 selectable enemies.
Read [the per-hero review](ROSTER_REVIEW.md) for precise rule scopes and open questions.

### Evidence and limits

- Current pinned definitions establish damage type, named disable, item cost,
  category, activation, range and trigger. Raw MOVEMENT flags corroborate Apollo's
  Disengaging Sigil, Calico's Leaping Slash/Return to Shadows, Lash's Grapple and
  Mina's Sanguine Retreat. Exact facts are stored in the threat annotations.
- [Flying-opponent discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1ub8t3h/having_trouble_fighting_vindicta_grey_talon/)
  describes Knockdown and its removal/protection limits. Current item text supports
  delayed stun and increased gravity, not permanent flight cancellation or protection
  from the target's spells. [Calico discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1rulw4r/whats_the_play_against_calico_this_patch/)
  supports investigating movement denial but disagrees on its practical strength.
  No guaranteed catch, one-shot survival or automatic item purchase is claimed.
- [Mina recast report](https://forums.playdeadlock.com/threads/mina-can-use-sanguine-retreat-2-despite-being-slowing-hexed.91745/)
  conflicts with blanket movement suppression. The new rule is restricted to the
  first cast while targetable. [Holliday barrier report](https://forums.playdeadlock.com/threads/holliday-barrel-knockup-doesnt-activate-reactive-barrier.96124/)
  is why her lasso-stun rule does not include barrel knockup.
- [Rem sleep/barrier report](https://forums.playdeadlock.com/threads/rem-naptime-damage-threshold-does-not-proc-if-the-damage-is-vs-barriers.122311/)
  warns that barrier damage may not contribute to waking. The card claims only
  follow-up damage buffering and explicitly rejects an early-wake benefit.
- [Graves](https://www.reddit.com/r/DeadlockTheGame/comments/1wzao6h/how_do_i_counter_grave/),
  [Drifter](https://www.reddit.com/r/DeadlockGame/comments/1t15ew6/tips_to_counter_drifter/)
  and [Mirage](https://www.reddit.com/r/DeadlockTheGame/comments/1s6pjcv/counter_mirage/)
  discussions support narrow non-ultimate removal candidates. No all-debuff,
  ultimate, guaranteed timing or reapplication-immunity claims were promoted.
- [Geist discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1s6rtsi/any_tips_on_how_to_play_against_lady_geist/)
  supports healing denial during Life Drain. Soul Exchange remains distinct.
  Delivery remains limited to four reviewed players; other healing routes are open.
- Typed mitigation is explicitly a source-based inference. For example, current
  Deadman Danny definitions separate weapon spray from spirit backblast; Silver's
  human weapon is distinct from transformed attacks; Venator's pure/execute effects
  are not generic armor targets. Rat King statistics were inspected but not used to
  infer counter efficacy. Solomon square attribution remains an explicit condition.
- Sinclair's own Vexing Bolt is spirit damage by MaxDamage css/icon markers. Its
  assistant and copied ultimates are excluded. Fifteen known ability entries still
  have gaps, including missing base descriptions and alternate kits.

Sources in the per-hero ledger include full accessible discussions, search-result
excerpts, wiki/guide summaries and historical reports. Exact dates/patches are not
known for every community claim. Some guides share the same API lineage and some
are generic editorial advice; none counts as an independent in-game test. The
ledger records current source baselines and unresolved questions, not certification.
Do not repeat broad source claims such as silence interrupting all channels,
barriers absorbing the triggering hit, anti-heal preventing a health swap, or a
movement flag proving every recast is blocked.

No full-game/client experiment was performed. Review expiry was not extended.

## Healing and persistent-damage batch — 2026-10-15

Eleven new conditional rules cover Victor, Kelvin and McGinnis: Healbane/Toxic
Bullets against each healing recipient, Spirit Shielding against Aura of Suffering /
Arctic Beam / Heavy Barrage respectively, plus separate Survive and Punish Inhibitor
rules for Victor. Total: 42 rules / 15 items / 12 enemies with partial advice.
Public steam-info remains client 6785 / revision 11132425. No in-game tests.

### Evidence read and interpretation

- [Pinned ability/item definitions](https://api.deadlock-api.com/v1/assets/items?client_version=6785)
  establish healing/regen, incoming-healing reduction, bullet buildup, damage types,
  prices/categories and triggers. Inhibitor (2037039379, upgrade_inhibitor) is a
  6,400-soul vitality item with conditional bullet buildup and no components.
  Properties distinguish outgoing damage (-30) from received/regen healing (-40);
  the production cards deliberately avoid combined lifesteal arithmetic.
- [Victor counter discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1w050cx/how_would_i_counter_victor/)
  and [healing-heavy teams](https://www.reddit.com/r/DeadlockTheGame/comments/1wtuxav/how_to_play_against_heal_heavy_comps/)
  support the anti-heal and Inhibitor research direction. Search dates and relative
  rendered dates conflict; exact patch dates remain uncertain. Comments differ on
  usefulness and contain stale numbers. Reject the claim that 30% outgoing-damage
  reduction plus 40% incoming-healing reduction means 70% less lifesteal. Do not
  infer all Victor healing is lifesteal; Jumpstart and upgraded Pain Battery differ.
- [Kelvin counter discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1truf5v/countering_kelvin/)
  recommends anti-heal including Healbane. Current Frozen Shelter text explicitly
  describes regeneration and an upgrade purging non-ultimate debuffs. Anti-heal must
  reach the recipient after removal; no attack-through-dome or dome-removal claim.
- [McGinnis counter discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1lurbs3/people_forgot_how_to_counter_mcginnis/)
  is historical (search date July 8, 2025), recommending Healbane alongside zone
  pressure. It also contains conflicting Monster Rounds/turret claims, so no turret
  damage multiplier or shield-trigger rule is promoted. Medicinal Specter healing
  and resistance bonuses are separate. Debuffing McGinnis is not global suppression
  of healing she supplies to her teammates or turrets.
- Toxic Bullets delivery against Kelvin/McGinnis is a source-reviewed inference
  from current incoming-healing and recipient definitions; the community evidence
  primarily supports anti-heal generally, not an independently tested bullet proc.
- A newly dated third-party McGinnis guide claimed healing is passive while turrets
  are active. The captured definition describes a separately deployed healing
  spirit; the guide's claim was not adopted. Fresh publication is not proof of accuracy.

### Player delivery and exclusions

New anti-heal rules are scoped to Infernus, Kelvin, Victor and McGinnis (excluding
self-matchups), with reviewed spirit routes Afterburn, Frost Grenade, Pain Battery
and Heavy Barrage. Bullet buildup requires sustained hits. Earlier Abrams/Shiv
anti-heal scope remains Infernus-only. Generic defensive shield rules apply across
all selectable player heroes. Scope differences remain visible in coverage cells.

Anti-heal does not prevent Shocking Reanimation or certify its respawn-health
interaction. Inhibitor is late-only, requires successful buildup, and cannot
substitute for an emergency escape. It does not stop the aura or remove slows.
Shield rules cover sustained hero ability damage after a qualifying trigger, not
immunity or the first lethal hit. McGinnis turret attribution remains unreviewed.
No new burst, chase or channel-interrupt rules were inferred from this batch.

### Correction to existing shielding advice

The earlier four Spirit/Weapon Shielding rules incorrectly implied always-on
resistance. [Valve's May 22, 2026 update](https://steamcommunity.com/games/1422450/announcements/detail/670617878982034053)
explicitly makes both resistance bonuses temporary on proc. Current raw properties
also mark them ConditionallyApplied. Corrected the four rules before reusing that
mechanism: base barrier 300 and matching resistance 18% for eight seconds after
trigger. Spirit threshold 225/3.5s, cooldown 45s; weapon threshold 250/4s, cooldown
35s. No absorption of the triggering hit is claimed. Valve text was retrieved in
search results; the direct Steam page reader returned no article body.

### Source inventory and remaining work

Repaired Arctic Beam DPS and Heavy Barrage DamagePerRocket classifications using
exact tech_damage and spirit-icon fields, not scaling alone. Added an explicit gap
for Victor's Aura of Suffering: text says channeled, raw behaviour exposes a toggle
without CHANNELLED. Its interruption semantics need testing. Reanimation is not
ordinary healing; its raw NOT_SILENCABLE flag also forbids casually transferring
silence claims. Sixteen ability entries now retain explicit source gaps.
Next research batch: Vindicta, Grey Talon and Calico. Follow-ups: recipient delivery
for more player heroes, dome reapplication, turret attribution and client tests.


## Channel disruption batch — 2026-10-15

Added six narrow source-reviewed rules: Knockdown and Cursed Relic against Seven's
Storm Cloud, Dynamo's Singularity and Mo & Krill's Combo. They populate Disrupt /
Control & combos in mid and late game. Total: 31 rules / 14 items / nine enemies
with partial advice. None have been tested in-game. Review expires November 14 UTC.
Public steam-info was rechecked: client 6785 / revision 11132425, unchanged.

### Sources and decisions

- [Pinned definitions](https://api.deadlock-api.com/v1/assets/items?client_version=6785)
  establish current item names, prices, categories, activation, range, delay and
  tooltip mechanics. Knockdown (1254091416) is spirit/active/3,200 souls, base range
  45m, cast delay 0.1s, stun delay 2s. Cursed Relic (2617435668) is spirit/active/6,400,
  base range 20m, cast delay 0.1s. Neither has components in this snapshot.
- [Seven and Dynamo discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1vzuoa3/as_a_new_player_how_do_i_deal_with_seven_and/)
  corroborates Knockdown against both channels and identifies enemy Unstoppable as
  a limitation. [Dynamo rescue discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1u6so3y/how_to_counter_phantom_strike_dynamo/)
  identifies teammate interrupts when the victim cannot act. [Mo & Krill discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1u5wyeh/best_way_to_counter_mokrill/)
  proposes Knockdown/Curse against Combo. These are community reports, not official
  tests; 2026 search dates and rendered relative dates conflict, so exact dates and
  patch compatibility are not asserted.
- [Seven interrupt discussion, September 4, 2024](https://www.reddit.com/r/DeadlockTheGame/comments/1f8l9jg)
  explicitly separates Knockdown/Curse from silence. Retrieved search text was
  available; direct page retrieval failed. Old names, prices and claims about
  instant casts are not copied. Current Cursed Relic explicitly includes an
  interrupt; historical use of “Curse” supplies context, not rename proof.
- Current Silence Wave (619484391) explicitly excludes channel interruption. No
  Silence Wave rule was added. Broad community “silence stops ult” advice is not
  enough; preventing a cast and interrupting an active channel are different.

### Exact scope and unresolved issues

All source-selectable player heroes except the enemy can deliver these generic
item effects. Build fit is neutral; no hero-specific synergy is certified.
Dynamo/Mo rules require a free teammate, visibly stated before expanding details.
Already-stunned/asleep removes all six rules. These are not personal stun escapes.

Captured AbilityChannelTime values: Storm Cloud 7s, Singularity 2.75s, Combo 2.4s.
Knockdown's 2s delay leaves little reaction margin on short channels; its rating
is lower there, and sufficient remaining time is an explicit prerequisite.
Modifiers/upgrades, latency and actual event ordering still require testing.
Cursed Relic reduces the caster's own damage output; its curse is not silence-only.
Protected targets are excluded for both items. Buff removal does not establish
Unstoppable/immunity bypass, and no removed-damage or guaranteed rescue is claimed.
Stage placement and strength are editorial judgments, not measured win rates.

No rules were added for Seven's other abilities, Dynamo's other abilities, Burrow,
healing denial, continuous-stun duration reduction or barrier triggers. Scorn
healing, Static Charge removal and those interactions remain follow-up research.

### Repaired source gaps

Exact raw-property evidence now supports Seven's Lightning Ball DPS, Power Surge
DamagePerChain, and Storm Cloud DPS as spirit damage components: css_class is
tech_damage and the damage icon is damage_magic_color.svg. This is not inference
from Spirit scaling. Underlying bullets remain separate. Dynamo's Singularity
behaviours explicitly includes CHANNELLED despite missing that word in plain text.
These four annotations retain exact paths/values and are withheld on property
change, missing/duplicate source entity, description change or client change.
Seventeen known ability entries still have source gaps, down from twenty; this
is not a complete tooltip audit. Secondary sections, alternate kits and upgrades
still need work. Neither these annotations nor response-family membership creates
counter rules automatically.


## Burst-defense expansion — 2026-10-15

The published catalog now contains 25 source-reviewed rules / 12 items. This section
supersedes the first-slice hold on Reactive Barrier only for follow-up damage. No
opening-hit ordering or guaranteed survival claim has been resolved. Public
steam-info was rechecked and still reports client 6785; no redundant snapshot was
created. All facts below were compared with the existing immutable client 6785
items and hero abilities. No in-game tests were performed.

### Evidence actually read and how it was used

- [Abrams combo discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1sawbl7/is_there_anyway_to_counter_phantom_strike_abrams/):
  proposes Rebuttal, Close Quarters and Reactive Barrier. Pinned properties confirm
  18% and 20% melee resistance for the first two. Use that unconditional benefit,
  not disputed guaranteed parry timing or commenters' stacking arithmetic. Relative
  comment dates do not establish a patch baseline.
- [Reactive Barrier](https://www.deadlock.io/en/items/reactive-barrier),
  [Grit](https://www.deadlock.io/en/items/grit),
  [Weapon Shielding](https://www.deadlock.io/en/items/weapon-shielding),
  [Spirit Shielding](https://www.deadlock.io/en/items/spirit-shielding), and
  [barrier mechanics](https://www.deadlock.io/en/mechanics/shields-and-barriers):
  tooltips and usage explanations distinguish before-damage activation, control
  triggers and damage-threshold triggers. The mechanics guide displays September
  20, 2026; individual item pages have differing snapshot dates. Item data shares
  Deadlock API lineage, so these are not independent confirmations. Current
  numbers come from our pinned snapshot, not an assumed freshest webpage.
- [Community Haze / Infernus discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1sdzq53/im_learning_still_and_need_someone_to_just/):
  supports Metal Skin against Haze bullets and Dispel against applied Infernus
  burn. Reject blanket claims that Haze can deal no damage; current Fixation text
  includes a spirit-damage upgrade. Wraith Full Auto also includes spirit damage.
- [Metal Skin community report](https://forums.playdeadlock.com/threads/interaction-of-metal-skin-with-hero-passive-abilities-and-passive-items-dependent-on-bullets.37903/):
  October 12, 2024 user report describes passive buildup through immunity. This is
  historical caution, not Valve confirmation or certification of current behavior.
  Its old melee-immunity wording is not adopted; current text says bullet immunity.
- Reopened Rebuttal and Reactive Barrier wiki pages have outdated numeric values.
  Do not use them for current values. Two older Reactive Barrier Reddit threads and
  another Metal Skin discussion could not be retrieved; snippets are not evidence.
  The official May 8, 2025 forum post links onward to a shop-rework article but
  contains no direct ordering proof; it is not cited as proof of these interactions.

### Release boundaries

| Defense | Covered pattern | Excluded conclusion |
| --- | --- | --- |
| Rebuttal / Close Quarters | Abrams melee follow-up | Guaranteed parry, all-damage protection or additive stacking |
| Grit | Anticipated ordinary damage from Abrams, Shiv, Haze, Wraith or Bebop | Control immunity, undoing damage or Shiv execute prevention |
| Reactive Barrier | Follow-up after Abrams wall/ultimate stun, Haze sleep, Wraith Telekinesis silence | Absorbing the triggering hit or treating every displacement as a trigger; no Bebop hook rule |
| Weapon Shielding | Haze/Wraith bullet pressure; static resist plus conditional barrier | Barrier already present before incoming damage or spirit protection |
| Spirit Shielding | Bebop bomb spirit damage / Infernus Afterburn | Guaranteed survival of one bomb, burn removal or guaranteed proc |
| Metal Skin | Haze/Wraith bullet portion | Total immunity, melee immunity or confirmed passive-proc prevention |
| Dispel Magic | Applied Infernus Afterburn (community report) | Preventing reapplication or undoing damage |
| Debuff Reducer | Haze Sleep Dagger duration | Cleansing sleep or guaranteed response timing |

All generic personal-defense rules explicitly list the currently source-selectable
player roster, excluding the enemy itself. This broadens the original three
personal-defense rules too. It is an inference from hero-independent item use, not
certified synergy for all 42 heroes. The four healing-denial rules stay Infernus-only
because their delivery assumptions depend on his damage application.

Grit and Metal Skin require a while-actionable response window. This is a conservative
recommendation prerequisite, not a newly certified item-specific casting exception.
Stages and scores remain editorial. Rules require readiness, relevant damage and
surviving until a conditional proc can help. Source review still expires November
14 UTC and never becomes verified merely because the importer or tests pass.

Next mechanical checks: practical Reactive Barrier event ordering, controlled-item
activation exceptions, damage-threshold measurement/refresh interactions, and direct
current-client tests of the two community-reported removals. Next useful app feature:
saved/shareable scenarios for repeatable testing; chase/disruption coverage remains
an independent research gap.


## First published slice review — 2026-10-15

The October 12 ledger is preserved as historical research. Published outcomes are
now stored in src/data/reviewed-catalog.json with sources and per-rule review notes.
No record is labeled verified. This is a reviewed proposal shown as conditional beta
advice; no in-game experiment was performed and source agreement is not proof.

Rechecked current public steam-info, imported immutable client 6785, and compared
selected item definitions plus Infernus/Abrams/Shiv ability text with client 6774.
Reopened the counter-item Reddit discussion, Shiv discussion, kurii guide, Debuff
Reducer wiki, Healbane wiki, and official changelog/latest follow-up. The official
thread contains a new follow-up about Baba, Deadman Danny and Radiant Regeneration;
the extraction is not assumed to include every hotfix. Dispel wiki retrieval failed
this pass, so its search excerpt is not counted as evidence. Older wiki reducer
numbers remain inconsistent; only its explicit interaction list informs the narrow
stun-duration inference. The Healbane page corroborates basic application mechanics,
not all hero healing sources.

| Original candidate | Release outcome |
| --- | --- |
| abrams-stun-reduction | Source-reviewed, narrowed to shorter stun; no parry timing claim |
| abrams-preemptive-unstoppable | Source-reviewed, limited to preemptive stun protection; no displacement or damage immunity claim |
| shiv-knives-dispel | Source-reviewed community report, conditional on applied knife bleed and ability to act; no execute protection |
| anti-sustain-healbane | Two conditional Punish rules; actual healing and spirit application required |
| anti-sustain-toxic | Two conditional Punish rules; actual healing and bullet buildup required |
| abrams-barrier | Still held for trigger/damage ordering evidence |
| reducer-is-cleanse | Rejected as a removal rule |
| shiv-counterspell-execute | Still blocked for direct interaction/timing evidence |

Infernus spirit application follows captured abilities, including Afterburn.
Upgraded Napalm already has healing reduction in the source: cards explicitly warn
about overlap and do not assume stacking gains. Shiv Bloodletting defers damage;
anti-heal advice only applies if he is also receiving healing from items/allies.
We have not certified all healing sources, stacking, cleanse exceptions or practical
reaction windows. Stage placements and build preferences are editorial, not empirical.

To renew: refresh facts, reopen original sources and current official hotfixes,
review each rule's precise scope, rerun regressions, update dated evidence and expiry
only after comparison. Do not bulk-promote the historical candidate ledger. Next
research should address immediate burst survival and Reactive Barrier ordering.

The user does not need to certify mechanics. Research should gather expert/creator
and community observations, compare them with captured client data and official
changes, and report unsupported interactions honestly. Request an in-game test only
when an important interaction cannot be resolved from accessible evidence; do not
make user expertise a prerequisite for continuing the project.

## Deliverable from the first research pass

`data/research/counter-claims.json` contains eight source records and eight candidate
claims. Stable item/hero IDs resolve against client 6774. Every claim records its
source claim separately from our proposed scenario application, limitations and
next check. None is a verified rule or imported into the UI recommendation engine.
This first pass targets the Infernus/Abrams/Shiv slice; it is not a complete-roster
research claim. The generic guide should inform the shared design for all heroes.

## Sources actually inspected

- [kurii's Guide to Counterbuying](https://deadlocklabs.gg/builds/abrams-guide-to-counterbuying-809744/),
  displayed update September 15, 2026. Its groups distinguish healing denial,
  debuff handling and defensive purchases. It is a generic guide housed in an
  Abrams build, not a list of items that specifically counter Abrams. Its grouping
  of Debuff Reducer with removal tools cannot establish a cleanse interaction.
- [Detailed Reddit counter-item discussion](https://www.reddit.com/r/DeadlockTheGame/comments/1r24qlp/can_someone_give_me_a_rundown_on_what_counter/):
  useful application/timing reasoning and broad hero examples. Commenters disagree
  on universal advice; popularity is not independent mechanical evidence.
- [Reddit discussion about fighting Shiv](https://www.reddit.com/r/DeadlockTheGame/comments/1uk4jnj/how_do_you_deal_with_shiv/):
  commenters propose knife-debuff removal, movement restrictions and healing denial.
  Those address different problems. Exact patch/date is not confirmed; retrieved
  relative timestamps are inconsistent, so no freshness guarantee is attached.
- [Debuff Reducer wiki](https://deadlock.wiki/Debuff_Reducer) and
  [Reactive Barrier wiki](https://deadlock.wiki/Reactive_Barrier): useful leads for
  interaction research, but the opened representations conflict with the captured
  client values. Search snippets also differ from opened content; neither alone
  constitutes verification.
- [Official update thread](https://forums.playdeadlock.com/threads/09-29-2026.166726/):
  inspected primary patch source with follow-up posts. The thread title is not
  treated as a complete current patch baseline or interaction proof.
- Version-pinned Deadlock API item response, already captured under
  `data/snapshots/client-6774/items.json`. During this pass, the latest `steam-info`
  endpoint still returned client 6774. That is source freshness, not proof the
  community source covers every current live change.

The [Natan video](https://www.youtube.com/watch?v=nWBBSTxizdI) was discovered by
following the [cheatsheet discussion's original-source link](https://www.reddit.com/r/DeadlockTheGame/comments/1s6xmfx/counter_item_cheatsheet_made_by_natan_from_his/).
Video retrieval failed. No transcript was read, and no video claims were extracted.
Do not count the video and its repost as two independent confirmations.

## Concrete comparison findings

| Candidate | Current research outcome | Still needed |
| --- | --- | --- |
| Reactive Barrier vs Abrams control | Candidate survival tool; source tooltip supplies control-triggered barrier premise | Specific trigger, damage coverage and ordering; no survival guarantee |
| Debuff Reducer vs Abrams stuns | Candidate earlier recovery; wiki identifies relevant abilities | Current ranks/durations; parry-window test separate |
| Debuff Reducer as cleanse | Disputed grouping; captured tooltip supports duration reduction | Keep reduction and removal distinct |
| Dispel Magic vs Shiv knives | Community-supported candidate for applied knife effects | Specific current removal interaction; add DoT problem before publishing |
| Healbane vs Abrams/Shiv healing | Candidate punish/anti-sustain response | Affected healing, application, refresh, stacking; deferral is not healing |
| Toxic Bullets vs sustain | Candidate requiring bullet buildup | Application suitability and opportunity cost; no instant protection claim |
| Counterspell vs Shiv execute | Blocked from publication | Direct interaction and timing evidence |
| Unstoppable vs Abrams control | Candidate preemptive protection | Specific ability/displacement mechanics; unusable after stun/sleep |

The opened Debuff Reducer wiki representation has 20% debuff resist and 50 health;
the captured client has 25% and 90. The opened Reactive Barrier page has 22-second
cooldown and 12-second duration; the client has 55 and 10. Preserve these differences
as freshness warnings, not as averaged values. Prefer pinned source facts for the
captured version, while independently validating specific interactions.

Dispel Magic's captured tooltip excludes ultimate negative effects and activation
while stunned/slept. No blanket bleed-plus-ultimate prevention was inferred. The
user's earlier abbreviation E remains unresolved. Healbane's healing denial does
not imply protection against an immediate burst or execute.

## Repeat the research process

1. Check latest client version and official patch/hotfix posts; identify the exact
   source version each claim can support. Retain access date separately from
   publication date, and leave unknown dates null.
2. Search a hero + problem + item/mechanic, including original guides, firsthand
   discussions and creator explanations. Example starting searches used here:
   `Deadlock Abrams counter Debuff Reducer Reactive Barrier parry guide`,
   `Deadlock Shiv counter Ethereal Shift Dispel Magic bleed execute`, and
   `Deadlock Infernus Abrams Shiv counter items guide`.
3. Read the actual page/comment or transcript; search excerpts are leads only.
   Link to the original author/comment, timestamp a video claim when available,
   and note failed/private/deleted material instead of reconstructing it.
4. Add concise paraphrases to the source/claim ledger. Record disagreements,
   author, dates, target abilities, prerequisites and source lineage. Do not copy
   full guides or infer creator credentials, rank, or current-patch authority.
5. Compare item identities/mechanics with pinned facts. Repeated reposts, generic
   guides and a wiki using the same original source are not independent tests.
6. Separate supported item mechanics from practical matchup judgments. Record
   confidence as evidence status, not success probability. Broad advice such as
   anti-heal for a hero becomes a narrower hypothesis about a specific healing
   source and problem, not an automatic rule for every build/stage.
7. Produce conditional rules only after modeling their conditions. Promote to
   verified only with evidence for the actual interaction; tests can establish
   what the code does but cannot prove an untested game mechanic. Where unresolved,
   leave the gap visible and continue researching other supported rules.

No bulk social-media scraping, external posting, paid service, recurring monitor
or automatic promotion was added. Source review is repeatable via the saved ledger
and queries; its facts remain outside runtime recommendation data.
