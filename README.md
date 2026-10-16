# Deadlock Counter Advisor

A contextual advisor prototype with an imported, version-pinned game catalog.
**Source-reviewed beta: 42 conditional rules across 15 items.** Personal defenses
cover selected problems against Abrams, Shiv, Haze, Wraith, Bebop and Infernus.
Channel disruption covers Seven, Dynamo and Mo & Krill, with teammate-rescue
conditions for the latter two.
New healing-denial advice covers Victor, Kelvin and McGinnis with four reviewed
player delivery routes; earlier Abrams/Shiv anti-heal remains Infernus-specific. Advice has sources and limits,
but has not been tested in-game. Synthetic items remain an opt-in layout preview.
Start with
[docs/HANDOFF.md](docs/HANDOFF.md).

## Run

Use Node 24 (see .nvmrc), then:

```sh
npm ci
npm run dev
```

`npm run check` runs engine tests, TypeScript checking, and the production build.
`npm run preview` serves the built site after `npm run build`.

Refresh catalog: `npm run data:pull` (or append `-- --version 6785`).
`npm run check` also verifies snapshot checksums and regeneration offline.
See [GAME_DATA.md](docs/GAME_DATA.md) for the source, coverage limits, repeatable
commands, art provenance and manual GitHub refresh workflow.

## Roster coverage and research

The collapsed roster-research section inventories all 42 source-selectable heroes
and 168 main-slot abilities, with functional themes, source text, unresolved gaps
and an enemy/problem coverage matrix. Twelve enemies currently have partial advice;
inventoried heroes are not automatically counter-covered.

Run `npm run research:build` after a catalog refresh or annotation edit.
`npm run research:verify` checks generated artifacts inside every full check.
See [the generated backlog](docs/ROSTER_RESEARCH.md) and
[research workflow](docs/RESEARCH_PROCESS.md). Next research batch: Vindicta, Grey Talon, Calico.
The first channel slice is delivered; timing and personal-survival questions remain open.

## Included

- React + TypeScript + Vite interface with searchable full source roster, portraits,
  multiple enemies, problem views and optional budget/active preference.
- Imported item browser with source categories, colors, images, tier lists,
  tooltips, properties and source links.
- Separate Survive / Disrupt / Punish cards with category colors, activation labels,
  affordability, covered threats, timing, and limitations.
- Pure recommendation engine, explicit demo opt-in, tests, lockfile, CI, and Pages
  deployments on accepted main pushes. Problem boards show all stages together.
- Runtime catalog/scenario validation, versioned manifest, evidence completeness
  checks and component graph validation. See [data review](docs/DATA_REVIEW.md).
- Product specification, full handoff, context history, data design, and roadmap.

Imported heroes and items are browseable source facts. The reviewed recommendation
catalog uses fifteen real items with explicit prerequisites, application timing, review
dates and source links. Optional preferences include owned items and ability to
respond while controlled. Unsupported heroes/problems/goals are visibly empty.
Scoring and stage placement are editorial, not calibrated effectiveness estimates.
See [research and release scope](docs/COMMUNITY_RESEARCH.md).

Advice is pinned to client 6785 and expires on November 14, 2026 UTC unless reviewed
again. Refreshing facts does not renew advice. A new client version pauses the old
rules; the manual refresh workflow retains review artifacts even if checks fail.
Upgrade discounts, slots, full roster advice and guaranteed execute/parry outcomes
are not implemented.

## GitHub and live preview

- Repository: https://github.com/matcpn/deadlock-counter-advisor
- Test site: https://matcpn.github.io/deadlock-counter-advisor/

Pushes to `main` run Checks and Publish GitHub Pages. The Pages workflow installs
locked dependencies and runs `npm run check` before uploading `dist` and deploying.
It also supports manual dispatch. Pages is configured to use GitHub Actions.
Only successful builds can deploy; the public UI clearly labels synthetic data.

Vite uses a relative base (`./`) for the repository subpath. There is no path router;
future share state should use query parameters or hashes for Pages compatibility.

## Reference documentation

- https://vite.dev/guide/
- https://vite.dev/guide/build
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

Dependencies are locked for reproducibility, not claimed to be the latest releases.

