# Deadlock Counter Advisor

A portable starter for a contextual item advisor. **This is a working scaffold with
synthetic data, not a finished counter guide.** Start with [docs/HANDOFF.md](docs/HANDOFF.md).

## Run

Use Node 24 (see .nvmrc), then:

```sh
npm ci
npm run dev
```

`npm run check` runs engine tests, TypeScript checking, and the production build.
`npm run preview` serves the built site after `npm run build`.

## Included

- React + TypeScript + Vite interface with hero, build, multiple enemies, stage,
  budget, problems, and active-item preference.
- Separate Survive / Disrupt / Punish cards with category colors, activation labels,
  affordability, covered threats, timing, and limitations.
- Pure recommendation engine, explicit demo opt-in, tests, lockfile, CI, and a
  manually triggered GitHub Pages workflow.
- Runtime catalog/scenario validation, versioned manifest, evidence completeness
  checks and component graph validation. See [data review](docs/DATA_REVIEW.md).
- Product specification, full handoff, context history, data design, and roadmap.

The hero selector currently validates identity only; real player-hero synergies
are planned. Three real hero names organize invented fixtures; the roster is not
complete. Owned-item exclusion exists in the engine but has no UI yet. Scoring is
an illustrative baseline, not calibrated gameplay advice.

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

