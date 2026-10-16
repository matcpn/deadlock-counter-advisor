# Validation record

## Item preferences removal — 2026-10-16

UI-only removal; recommendation mechanics/data unchanged. Removed dead preference
state and updated empty-stage wording. Strict TypeScript and production build
passed; existing catalog chunk-size notice remains. Published 6d35d80: Checks
38924652812 and Pages 38924652986 passed (including all 175 tests). Hosted page
has no Item preferences section; selecting Bebop still shows active and conditional
options. No console errors. Saved no-item-preferences-live.png and restored empty
selection.

## Defining threats and decision cards — 2026-10-16

- npm run check passed: immutable data/regenerated research checks, 175 tests across
  ten files, strict TypeScript and production build. Existing catalog chunk warning.
- Five new behavioral tests cover the five-hero batch, stage/active/owned/expiry
  filters, player-delivery restrictions, per-enemy grouping, repeat deduplication,
  required decision fields, and server-rendered guidance with fallback/details.
- Updated two existing expectations for the new Bebop and Geist self-purge options;
  shielding type and healing-versus-Soul-Exchange assertions remain intact.
- Browser checked combined Bebop + Lady Geist cards at 1280px and 375px widths.
  Shared Dispel card attributes each decision to the right enemy; mobile wraps
  without horizontal overflow. Full facts remain available through the item popup.
  No console errors. This is software/source verification, not in-game testing.
- Browser active-item filtering also checked with all five enemies selected.
  Published c9b27b6: Checks 38924026907 and Pages 38924026802 passed. Live shared
  Dispel choices for Bebop/Geist show the new text and correct attribution. Saved
  decision-cards-live.png; restored empty selection, closed local preview and
  stopped its server. No live console errors. Temporary viewport reset.

## Build-color coverage — 2026-10-16

- Initial category audit identified Dynamo, Mo & Krill and Seven as purple-only;
  39/42 already had green. Pinned item categories and current client 6785 checked.
  Three source-reviewed rules close the gaps; all 42 have green, 105 rules / 16 items.
- npm run check passed: immutable snapshot/offline data and research verification,
  170 tests, strict TypeScript and production build. Existing chunk-size notice remains.
- Added coverage truth-table checks (green OR purple+orange), same-color rejection,
  stale-evidence exclusion and whole-roster coverage. New defenses appear in both
  weapon/spirit builds and with active items excluded / already stunned. Explicit
  exclusions protect against treating mitigation as escape or interruption.
- Channel-disruption tests now scope their assertions to Disrupt results, preserving
  their original delay, targetability, ownership and stage checks alongside the newly
  available passive Survive options. No gameplay tests were performed.
- Published fbaa482. Checks 38920598268 and Pages 38920598145 passed. On the
  hosted page, selecting Dynamo, Mo & Krill and Seven shows both green items in
  Early / lane with the intended threat summaries. No console errors observed.
  Saved build-colors-live.png and restored the empty initial selection.

## Compact full-roster selector — 2026-10-16

- TypeScript and production build passed; existing catalog chunk-size notice remains.
  UI-only change: no engine/data edits or new tests required.
- Local browser: all 42 tiles visible without nested scroll. Grid bottom 454px in
  a 1280×720 viewport and 526px in a 375×667 viewport. scrollHeight equals clientHeight
  in both; no horizontal page overflow. Intro headline/subtitle/branding removed.
- Checked Yamato with keyboard Space and Baba by tile click. Filtering to Baba and
  clearing the search retained both selections and restored all 42 choices.
  No console errors observed; temporary viewport reset and preview tab closed.
- Published bd1cebc. Checks 38919579505 and Pages 38919579708 passed. Live page
  has all 42 heroes, no intro text and zero initial selections. At the normal
  322×527 panel size the grid ends at 526px with no internal scrolling. Restored
  the page to the roster and saved compact-roster-live.png.

## Item stats and source popovers — 2026-10-16

- Regenerated normalized item data offline from immutable client-6785 snapshots.
  Added source tooltip sections and formatted values; existing raw properties remain.
  All 173 shop items have sections. Matchup rules and their dates were not changed.
- npm run check passed with 168 tests, generated data/research verification,
  TypeScript and production build. New tests cover source grouping, units, signs,
  explicit zeros, missing icon-only references and exclusion of unused defaults.
- Local browser: Debuff Reducer +90 health / +25% resist, Spirit Shielding threshold,
  duration/resistance and components, plus Knockdown range/cooldown/stun values
  checked. Wiki and pinned API hrefs inspected. Keyboard Enter and Escape, close
  button, and outside-click dismissal checked. Added an explicit outside-click
  handler after the browser's native dismissal alone was inconsistent.
- Inspected 1280px desktop and 375px mobile placement. Popup scrolls within the
  viewport and retains source links. No console errors observed. Mouse-enter
  preview is implemented; automated checks exercised click and keyboard paths.
- Non-failing build notice: generated game-catalog chunk is 502.71 kB minified,
  64.35 kB gzip, just above Vite's 500 kB advisory threshold.
- Published 6c3c187. Checks 38916636829 and Pages 38916636983 succeeded.
  Live Spirit Shielding popup displayed the source values, components and links;
  saved item-tooltip-live.png. No console errors observed. Closed the popup,
  reset viewport and reloaded to retain an empty initial enemy selection.

## Second distinct item pass — 2026-10-16

- Rechecked upstream client/server 6785, revision 11132425; reviewed captured item
  and ability properties plus linked community/reference evidence. No in-game tests.
- The original 19 one-item heroes each gained a different bounded option. Generated
  ITEM_COVERAGE.md counts 42/42 selectable heroes with at least two distinct eligible
  items across scenarios; the catalog contains 102 rules / 16 items.
- npm run check passed: snapshot checksums/offline regeneration, generated research
  verification, 165 tests across nine files, strict TypeScript and production build.
  Four old expectations were updated for the new coverage; shield proc wording was
  made explicit before the successful run.
- Focused checks compare every hero's distinct-item count with actual browse output,
  deduplicate repeated cells/stages, withhold stale/changed evidence, preserve active,
  ownership and response-window filters, and exercise named exception boundaries.
  Power Slash raw marker drift correctly invalidates its classification.
- Published implementation 3f04a49. Checks 38912746774, Pages 38912747273 and
  pinned refresh 38912747514 all passed. The refresh workflow retains
  ITEM_COVERAGE.md; its game-data-for-review artifact was produced successfully.
- Live browser checks confirmed Pocket's two passive options, Vyper's actionable
  Dispel Magic option and its removal when active items are disabled, plus Baba's
  Spirit Shielding / Reactive Barrier pair. Inspected desktop stage columns and
  saved two-items-live.png. No console errors observed. Reset the viewport and
  reloaded: all 42 hero choices present, zero selected.

## Empty initial selection — 2026-10-16

Changed only the initial UI state to an empty typed enemy list. TypeScript and
production build passed; existing empty-selection behavior is retained.

## Development metadata removal — 2026-10-16

- Removed the field from normalized heroes, research inventory and review baselines,
  UI/report labels and Baba's non-mechanics caveat. Raw snapshots are unchanged.
- Regression test confirms true/false/missing upstream development values produce
  identical normalized data and no hero-change diff; selectable eligibility stays
  intact. Existing ability/client review invalidation and Baba scenario tests pass.
- npm run check passed: snapshot checksums/offline regeneration, research verification,
  159 tests across eight files, strict TypeScript and production build.
- Published 17d1150. Checks 38909851102 and Pages 38909850698 passed.
  Reloaded the live site: Baba's checkbox has the exact name Baba, all 42 enemy
  choices remain, and no development text exists even in collapsed content.
  Inspected the rendered label, saved baba-no-flag-live.png and restored the full
  hero list. No browser console errors observed.

## Enemy-first UI cleanup — 2026-10-16

- npm run check passed: immutable snapshot and generated research verification,
  159 tests across eight files, strict TypeScript and production build. An initial
  JSX delimiter error was fixed before this successful final run.
- Four browse-adapter tests cover merging goals/problems without duplicate items,
  retaining scoped rules, Infernus as an enemy, stage eligibility, price ordering,
  ownership/active/response filters, empty selection, and evidence expiry/patch/demo
  exclusions. Personalized engine tests still pass; no gameplay data changed.
- Local browser checks confirmed removed controls/headings, combined stage lists,
  expandable extra items and evidence, limited Infernus delivery labels, active
  filtering and selection of Infernus as an enemy. Desktop 1280px and mobile 375px
  layouts inspected; mobile document width 360px. No console errors observed.
- Implementation 10bd10d published. Checks 38908980010 and Pages 38908980039
  succeeded. Live verification confirmed 42 enemy choices, three stage lists and
  no removed controls/goal headings. Inspected deployed desktop columns; no console
  errors observed. Saved simplified-advisor-live.png, closed the temporary preview
  and reset the viewport override. Existing non-failing action migration notices remain.

## Whole-roster source review — 2026-10-16

- Rechecked public steam-info: client/server 6785, revision 11132425, unchanged.
  Reviewed captured ability/item definitions and linked community/guide evidence.
  Some sources were available through search excerpts; provenance and conflicting
  reports remain explicit. No in-game tests or verified promotion.
- Added 41 rules for the remaining 30 enemies: 83 source-reviewed rules, 16 items,
  and bounded advice for all 42 source-selectable heroes. Development flags remain
  visible; this does not certify current mode availability or complete kit coverage.
- Added a per-hero review ledger, source/rule integrity audit and ability baselines.
  Tests cover new heroes and changed descriptions/flags losing reviewed status.
  Fifteen ability entries retain known source gaps. Sinclair's damage marker and
  five exact MOVEMENT flags are traced to pinned raw data; recasts are not inferred.
- npm run check passed: snapshot verification, deterministic research regeneration,
  155 tests across seven files, strict TypeScript and production build. Every hero
  has a tested supported scenario. Focused checks cover player/goal/stage/budget,
  ownership and active-item filters, flight, recast limits, melee versus spirit,
  mark/root removal, healing versus health exchange, and unsupported scenarios.
- Build completed without a large-chunk warning after separating reviewed JSON:
  main 389.63 kB, reviewed catalog 206.98 kB, game catalog 393.77 kB.
- Local browser checks at 1280px and 375px covered Calico/Mina Slowing Hex,
  Vindicta Knockdown, budget separation, active-item filtering, passive fallbacks,
  expanded limits and the roster matrix. Mobile document width was 360px against
  a 375px viewport. No console errors observed. Not a full accessibility audit.
- Published implementation e99e02d. Checks 38850068186, Pages 38850068146 and
  manual pinned refresh 38850080901 succeeded. Refresh produced game-data-for-review
  (1,539,747 bytes, not expired), including the generated roster review report.
- Reloaded the live repository-subpath page and confirmed the 83-rule / 16-item
  release, Calico/Mina movement limits, Vindicta delayed disruption, budget groups
  and 42/42 enemies with partial advice in the coverage matrix. Inspected desktop
  layout and saved roster-coverage-live.png. No live console errors observed.
  Closed the temporary local preview and reset the viewport override. Existing
  non-failing action-runtime and Ubuntu migration notices remain.

## Healing and persistent-damage slice — 2026-10-15

- Rechecked public steam-info: client/server 6785, revision 11132425, unchanged.
  Reviewed pinned ability/item data, four community discussions and Valve's May 22
  shielding patch text. Community timing/attribution uncertainties remain explicit.
  No in-game testing or verified promotion.
- Added 11 source-reviewed rules: 42 rules, 15 items, 12 enemies with partial advice.
  New healing-denial delivery spans four reviewed player routes. Inhibitor is
  late-game only; its survival and healing-denial rules stay separate.
- Corrected four previous shielding rules to describe temporary resistance after
  the damage proc. Weapon Shielding's current cooldown is 35 seconds. New spirit
  protection is scoped to Victor's aura, Arctic Beam and Heavy Barrage; turret
  attribution remains unreviewed. Two damage-type gaps resolved; one new aura
  channel/toggle ambiguity recorded, leaving 16 ability entries with known gaps.
- npm run check passed: snapshot verification, deterministic research regeneration,
  103 tests across six files, strict TypeScript and production build.
  Focused tests cover player scope, goal/stage/budget/ownership separation,
  recipient targeting, dome purge, reanimation exclusions and conditional shielding.
- Browser checks covered all three new enemies, unsupported-player healing denial,
  generic player shielding, active-item filtering and affordable Inhibitor at 6,400.
  Expanded timing/limits were inspected on desktop 1280px and mobile 375px.
  Kelvin recipient/dome caveats wrap correctly; mobile document width 360px versus
  375px viewport. No browser console errors observed. Not a full accessibility audit.
- Published implementation eb3387c. Checks 38848024526, Pages 38848024497 and
  manual pinned refresh 38848036377 all succeeded. The refresh rebuilt research
  and produced game-data-for-review (1,505,447 bytes, not expired).
- Reloaded the live repository-subpath page and confirmed the 42-rule release,
  all three new enemies, conditional shielding, late Inhibitor and healing-denial
  cards. Inspected the deployed desktop breakpoint and saved sustain-counters-live.png.
  No live browser console errors observed. Temporary preview tab closed and viewport
  override reset. Existing non-failing action-runtime/Ubuntu migration notices remain.


## Channel disruption and raw-property evidence — 2026-10-15

- Public steam-info rechecked: client/server 6785, revision 11132425, unchanged.
  Read pinned item/ability properties and four community discussions (one historical
  Seven thread accessible through search text only). Exact community patch dates
  remain uncertain. No in-game tests or verified promotion.
- Added six source-reviewed channel rules / two items: 31 rules, 14 items, nine
  enemies with partial advice. Three damage-type gaps resolved from raw markers;
  17 ability entries retain explicit gaps. Dynamo channel flag is also traced.
- npm run check passed: immutable snapshot verification, research regeneration,
  98 tests across six files, strict TypeScript and production build. No chunk warning.
  An initial type check rejected node:fs in tests; using a static raw-JSON test
  import fixed it without introducing a dependency or shipping raw data to the UI.
- New regressions cover multi-enemy Disrupt grouping, generic player/build scope,
  no burst/sustain extrapolation, actionable-only rescue, short-channel delay,
  protected targets, caster damage penalty, stage/budget/ownership independence,
  raw-property classification and missing/changed/duplicate evidence invalidation.
- Browser checks: selected Seven/Dynamo/Mo, confirmed conditional cards and teammate
  prerequisites; 3,200 souls moves Knockdown into Buy now while Cursed Relic stays
  Save for later; already stunned/asleep hides all six. Expanded timing/source
  details and Seven's repaired raw-property evidence were inspected.
- Desktop 1280px and mobile 375px checked. Long evidence paths wrap; mobile
  document width 360px vs 375px viewport. Rescue conditions/details remain readable.
  No browser console errors observed. This is not a full accessibility audit.
- Published implementation 4356b94. Checks 38843235788, Pages 38843235809 and
  manual pinned refresh 38843247249 all succeeded. The refresh produced
  game-data-for-review (1,504,357 bytes, not expired), including rebuilt research.
- Reloaded the live repository-subpath page and confirmed the 31-rule release,
  Dynamo disruption cards, source labels and Buy now / Save for later separation.
  Inspected deployed desktop layout and saved channel-counters-live.png.
  No live browser console errors observed. Preview server stopped; temporary
  browser tab closed and viewport override reset.


## All-hero inventory and coverage — 2026-10-15

- Rechecked public steam-info: client 6785 / revision 11132425, unchanged. Read all
  168 captured main-slot ability descriptions across 42 source-selectable heroes.
- Added manually selected functional annotations with exact source spans; 25 threat
  themes and 12 response families. Twenty ability entries have explicit source
  gaps. No independent in-game verification or new counter rules.
- npm run check passed: immutable snapshot verification, deterministic research
  regeneration, 92 tests (11 new), strict TypeScript and production build. No chunk
  warning. The existing 25 reviewed rules remain unchanged.
- Tests cover exact source spans, negations/self-effects, missing damage types,
  deferral versus healing, patch/text invalidation, new and retired heroes,
  duplicate/bad annotations, all 210 hero/problem cells, stage/scope differences,
  expiry/patch/item drift, demo isolation and deterministic non-promoting backlog.
- Browser checks passed: all-hero matrix, Abrams anti-heal player scope, search
  filtering and empty state, Seven ability themes/source evidence, and unchanged
  default recommendation cards. Desktop 1280px and mobile 375px inspected.
  Mobile document width 360px; the 750px table scrolls within its 288px container,
  including keyboard ArrowRight. No browser console errors observed. This is not
  a full accessibility audit.
- Published implementation 488d9a1. Remote Checks 38841367676, Pages 38841367708
  and manual pinned refresh 38841380622 all succeeded. The refresh ran research:build
  and uploaded game-data-for-review (1,502,487 bytes, not expired). This confirms
  generation and validation on GitHub Linux as well as local Windows.
- Reloaded the live subpath URL, opened roster research, and confirmed all 42 enemy
  rows plus the header. Saved the live matrix screenshot. Preview server stopped.
- Existing non-failing GitHub action-runtime and Ubuntu migration notices persist.


## Burst-defense expansion — 2026-10-15

- npm run check passed after data/engine changes: immutable client 6785 snapshot
  verification, 81 tests, strict TypeScript and production build. Six new behavioral
  tests plus updates to previous coverage boundaries; no chunk warning.
- Added regressions for actionable-only defenses, per-damage-type coverage,
  qualifying Reactive Barrier triggers, no hook rule, limited Shiv burst buffer,
  Metal Skin's spirit/melee limits, generic player scope vs Infernus-only anti-heal,
  budget/ownership without component credit, and unsupported escape coverage.
- Browser smoke checks: expanded fourth early option; Seven vs Haze/Wraith;
  enemy-specific and shared conditions; stunned/asleep removes Grit/Metal Skin;
  3,200 souls moves Metal Skin from Save for later into Buy now. Desktop 1280px
  and mobile 375px inspected; mobile scroll width 360px, viewport 375px, no overflow.
  Expanded mobile timing/limits remained readable. No browser console errors seen.
- No game-client experiments or complete accessibility audit. 25 rules are
  source-reviewed hypotheses with explicit limits, not verified interactions.
- Published implementation 95b23e2 to main. Remote Checks 38835946819 and Pages
  38835946704 both succeeded. Reloaded the live repository-subpath page and
  confirmed Grit, Reactive Barrier and Rebuttal in the default burst view. Saved
  a screenshot of the deployed stage board. Local preview stopped after QA.
- Existing non-failing GitHub action-runtime / Ubuntu migration notices persist;
  no workflow changes were needed for this release.


## First sourced slice — 2026-10-15

- Refreshed through the repeatable importer to client 6785 (build Oct 14 UTC).
  42 selectable heroes / 173 shop items; only hero-78 changed in normalized diff.
  Source fetch timestamps are UTC (Oct 16 UTC during this Oct 15 local session).
- npm run check passed: immutable snapshot checksums/regeneration, 75 tests,
  strict TypeScript and production build. No chunk warning. Existing 62 tests plus
  13 source-reviewed scenario/boundary tests pass.
- Regressions cover evidence opt-in, no synthetic/needs-review promotion, expiry,
  patch mismatch, wrong player/enemy, separate burst/DoT/control/sustain results,
  multi-enemy conditional coverage, weapon utility for spirit builds, active bans,
  stunned/asleep timing, ownership, stage/budget independence and full-price upgrades.
- Browser interaction smoke checks: real default cards, sustain/DoT views, budget
  changing Toxic Bullets to Buy now, Healbane ownership exclusion, active ban,
  stunned/asleep removing Dispel Magic, unsupported Haze player, and expanded card
  evidence/timing/execute limitations. Browser showed item artwork and source links.
- Desktop 1280px and mobile 375px layouts inspected. Mobile document scroll width
  360px vs viewport 375px; no horizontal overflow. Empty objectives condensed to
  one line each. This is not a complete keyboard/accessibility audit.
- No in-game tests. Seven rules are source-reviewed beta, not verified. Mechanical
  uncertainty, stale community dates and limited coverage remain visible.
- Published implementation ef93ce2 to main. Remote Checks 38833394840 and Pages
  38833394817 succeeded. Manual refresh run 38833414086 (client 6785) succeeded;
  its game-data-for-review artifact is available. The failure-path upload condition
  was inspected but not exercised by deliberately failing a remote run.
- Reloaded the live repository-subpath page and confirmed client 6785, the real
  default Debuff Reducer card, and Dispel Magic in the DoT future-purchase bucket.
  Saved a local screenshot of the live recommendation card. No runtime source or
  LLM service is needed to show the deployed rules.
- GitHub emitted non-failing action-runtime deprecation/Ubuntu migration notices;
  workflows completed successfully. Action-version maintenance is a future chore.

## Community-source research — 2026-10-12

- Read a dated counterbuying guide, two detailed Reddit discussions, two wiki
  pages, and an official patch thread; compared claims with local pinned client
  data. Source registry has eight entries, including an unavailable linked video
  and the client-extraction source. No video transcript/content was retrieved.
- Latest public steam-info still returned client 6774 during this pass.
- Research ledger: eight claims, with candidate/disputed/blocked status. Checked
  every source, item and hero reference against ledger/catalog IDs successfully.
- Stale/inconsistent wiki numeric representations recorded rather than promoted.
  Generic guide groupings did not establish specific matchup or cleanse rules.
- npm run check passed: snapshot verification, 62 tests, strict TypeScript and
  production build. App output unchanged; research is not runtime recommendation
  data. No in-game interaction or gameplay timing tests performed.

## Repeatable catalog and browsing checks — 2026-10-11

- Published implementation commit d84c697 to main. Remote Checks run 38197488346
  and Pages run 38197488352 both succeeded. Reloaded live repository-subpath URL
  and confirmed new client/version counts, roster selector and item-tier lists.
- Dispatched manual data-refresh run 38197488474 with client_version=6774:
  success. GitHub artifact `game-data-for-review` exists, not expired, 746306 bytes.
  This verifies refresh/downloadable-review pipeline on Linux, not just locally.
- Final build splits static catalog into its own 391.45 kB JS chunk; application
  chunk 242.41 kB. No Vite chunk-size warning in the final check.

- First live pull: source client 6774, with 65 hero records / 757 source entities,
  41 source-selectable heroes and 173 enabled shop upgrades (17 tier 5). All four
  pinned responses and SHA-256 source manifest captured locally.
- Explicit repeat pull of client 6774: no changes; timestamps/diff did not churn.
- Offline data:verify passed: all snapshot hashes and regenerated display facts
  match. Added this verification to every npm run check.
- Behavioral suite: 62 tests passed, covering import identity/availability,
  unknown enums, numeric/empty properties, missing references, activation conflicts,
  component cycles, asset host restrictions, semantic diffs, safe plain-text
  tooltips and all-stage/problem separation, plus previous release/engine checks.
- TypeScript and production build passed. Initial type inference failure in an
  item transform was fixed with an explicit GameItem return type.
- Desktop browser: searched Victor, selected him as an additional threat, searched
  Dispel Magic, expanded source tooltip (including cannot-use-while-stunned/slept
  limit), and verified loaded remote images. Enabled synthetic board and browsed
  sustain: early empty, punish/save-for-later appears in mid/late separately.
- 375px browser screenshot inspected; document scroll width 360px vs 375px
  viewport, no horizontal overflow. Hero portraits loaded. This is a responsive
  smoke check, not complete accessibility/keyboard QA.
- Source API is community-provided; roster, special-mode availability and counter
  interactions have not been independently certified against the live client.
  No production recommendation rules added.

## GitHub Pages deployment — 2026-10-11

- Created public repository https://github.com/matcpn/deadlock-counter-advisor
  and pushed main. Initial implementation commit: a85d2c7.
- Enabled Pages with build_type=workflow and HTTPS.
- Remote Checks run 38195478774: success.
- Remote Publish GitHub Pages run 38195478771: success, including npm ci,
  all 42 tests, TypeScript/build, artifact upload and deployment.
- Opened https://matcpn.github.io/deadlock-counter-advisor/ in the in-app browser.
  The React interface, controls, styled recommendation groups and synthetic-data
  notice loaded. Turning off active items removed Demo Interrupt. Selecting Abrams
  as the player removed Abrams from enemy options and changed coverage to Shiv.
  Reload under the repository subpath succeeded. Left default page open for testing.
- This is a desktop smoke test, not complete mobile/accessibility QA. Real game
  recommendations remain absent. Earlier no-deployment statements are historical.

## Continuation checks — 2026-10-11

- Locked dependency installation succeeded through the bundled Node runtime and
  `pnpm dlx npm ci`; npm was not available on the default shell PATH.
- Initial install audit reported 3 advisories in Vitest/transitive tooling.
  Inspected npm audit and the official Vitest migration guide; updated Vitest to
  5.0.3 and package-lock.json. Installation then reported zero vulnerabilities.
- Final `npm run check` via bundled runner: passed. 42 tests across two files;
  TypeScript strict check and Vite 7.3.7 build passed (31 transformed modules).
- Added behavioral checks for malformed imports, duplicate IDs, costs/enums,
  unresolved references, component cycles, synthetic isolation, source provenance,
  interaction claim scope, invalid dates, stale verification, needs-review exclusion,
  patch mismatch, impossible scenarios, and scoring configuration.
- One new test initially incorrectly expected all recommendations to disappear
  when one item became needs-review. Corrected it to assert that the affected item
  disappears while independently eligible items remain.
- No browser QA performed this session. Hero selection fix is type/build checked;
  interactive keyboard/mobile behavior remains unverified.
- Opened the official changelog as a source candidate; no gameplay facts or live
  counter rules were certified. See DATA_REVIEW.md. Full cost is still used for
  affordability; component credit, automatic expiry and effect modeling are absent.
- No Git metadata exists in this directory, and no remote/deployment was changed.

The initial scaffold record below is historical; its statement that runtime
catalog validation is planned is superseded by this continuation record.

Initial scaffold checked 2026-10-11.

- Dependency installation: successful; package-lock.json included. Resolved package
  downloads use registry.npmjs.org, not an environment-specific private registry.
- Runtime used: Node 24.19.0, npm 11.9.0.
- `npm run check`: passed.
- Engine tests: 12 passed, covering demo isolation, affordability, spirit-build
  utility, stage, active preference, ownership, multi-enemy coverage, goal relevance,
  empty selection, invalid budget, unknown heroes and deterministic ranking.
- TypeScript strict type check: passed.
- Vite 7.3.7 production build: passed (30 transformed modules).
- ZIP includes source, lockfile, hidden workflow/config files and all documentation.
  It excludes node_modules, dist, credentials and helper scripts.

## Verification limits

No browser visual/interaction QA was performed. No supported browser-control skill
was available for the managed Sites preview path. The app has not been deployed,
so GitHub Actions execution and GitHub Pages URL behavior remain unverified.

No game data or interaction has been verified against the current Deadlock patch.
The three invented demo items are deliberately not playable-game recommendations.
The demo palette is an implementation placeholder pending current category checks.
Full catalog schema validation and advanced ranking constraints are planned.

The GitHub profile lookup returned matcpn. The scoped repository search returned
no matching accessible Deadlock repository. No remote was created or modified.
