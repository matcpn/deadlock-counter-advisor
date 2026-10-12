# Community counter research — 2026-10-12

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
