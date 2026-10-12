# Validation record

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
