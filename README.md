# Deadlock Counter Advisor

A contextual advisor prototype with an imported, version-pinned game catalog.
**Source-reviewed beta: 105 conditional rules across 16 items.** All 42 captured
source-selectable enemy heroes now have at least two distinct item options across reviewed scenarios. Advice is
organized into combined Early / Mid / Late item lists, with expandable sources and limits.
This is partial coverage, not every ability or player delivery route, and has not
been tested in-game. Synthetic items remain test fixtures only.
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
and an enemy/problem coverage matrix. All 42 enemies have partial advice; function
tags never automatically create counters. A separate audited review ledger records
each hero's remaining questions and invalidates completion on source changes.

Run `npm run research:build` after a catalog refresh or annotation edit.
`npm run research:verify` checks generated artifacts inside every full check.
See [the per-hero review](docs/ROSTER_REVIEW.md), [coverage matrix](docs/ROSTER_RESEARCH.md)
and [research workflow](docs/RESEARCH_PROCESS.md). Next: practical interaction tests,
deeper problem coverage and saved/shareable scenarios. Advice expires November 14 UTC;
refreshing data does not renew it.

## Included

- React + TypeScript + Vite interface with searchable full source roster, portraits,
  multiple enemies and optional active/owned-item/response preferences.
- Imported item browser with source categories, colors, images, tier lists,
  tooltips, properties and source links.
- Combined stage item cards with category colors, activation labels, prices,
  covered threats, player application scope, timing and limitations.
- Pure personalized engine plus an unpersonalized browse adapter, tests, lockfile,
  CI and Pages deployments on accepted main pushes. No synthetic UI preview.
- Runtime catalog/scenario validation, versioned manifest, evidence completeness
  checks and component graph validation. See [data review](docs/DATA_REVIEW.md).
- Product specification, full handoff, context history, data design, and roadmap.

Imported heroes and items are browseable source facts. The reviewed recommendation
catalog uses sixteen real items with explicit prerequisites, application timing, review
dates and source links. Optional preferences include owned items and ability to
respond while controlled. Unsupported selections remain empty.
Scoring and stage placement are editorial, not calibrated effectiveness estimates.
See [research and release scope](docs/COMMUNITY_RESEARCH.md).

Advice is pinned to client 6785 and expires on November 14, 2026 UTC unless reviewed
again. Refreshing facts does not renew advice. A new client version pauses the old
rules; the manual refresh workflow retains review artifacts even if checks fail.
Upgrade discounts, slots, complete kit coverage and guaranteed execute/parry outcomes
are not implemented.

## GitHub and live preview

- Repository: https://github.com/matcpn/deadlock-counter-advisor
- Test site: https://matcpn.github.io/deadlock-counter-advisor/

Pushes to `main` run Checks and Publish GitHub Pages. The Pages workflow installs
locked dependencies and runs `npm run check` before uploading `dist` and deploying.
It also supports manual dispatch. Pages is configured to use GitHub Actions.
Only successful builds can deploy; synthetic fixtures are excluded from the public UI.

Vite uses a relative base (`./`) for the repository subpath. There is no path router;
future share state should use query parameters or hashes for Pages compatibility.

## Reference documentation

- https://vite.dev/guide/
- https://vite.dev/guide/build
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

Dependencies are locked for reproducibility, not claimed to be the latest releases.

