# Validation record

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
