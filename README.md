# Deadlock Counter Advisor

A contextual advisor prototype with an imported, version-pinned game catalog.
**Counter recommendations are still an opt-in synthetic preview.** Start with
[docs/HANDOFF.md](docs/HANDOFF.md).

## Run

Use Node 24 (see .nvmrc), then:

```sh
npm ci
npm run dev
```

`npm run check` runs engine tests, TypeScript checking, and the production build.
`npm run preview` serves the built site after `npm run build`.

Refresh catalog: `npm run data:pull` (or append `-- --version 6774`).
`npm run check` also verifies snapshot checksums and regeneration offline.
See [GAME_DATA.md](docs/GAME_DATA.md) for the source, coverage limits, repeatable
commands, art provenance and manual GitHub refresh workflow.

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

Imported heroes and items are browseable source facts, with unreviewed counter and
mode coverage. Demo rules cover only Infernus/Abrams/Shiv and invented items.
Player synergy and production recommendation rules remain planned. Owned-item
exclusion exists in the engine but has no UI yet. Scoring is an illustrative
baseline, not calibrated gameplay advice.

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

