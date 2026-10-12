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

## GitHub setup

The GitHub connector was confirmed as `matcpn` on 2026-10-11. A scoped search found
no accessible repository matching `deadlock`; no remote has been selected or written.
The exposed connector did not offer repository creation.

Create or choose `deadlock-counter-advisor`, import this directory including its
hidden `.github` folder, and commit all source plus package-lock.json. Do not commit
node_modules or dist. If using Git locally with an empty remote:

```sh
git init -b main
git add .
git commit -m "Scaffold contextual Deadlock counter advisor"
git remote add origin https://github.com/YOUR_USERNAME/deadlock-counter-advisor.git
git push -u origin main
```

If the destination already contains work, inspect and integrate it instead of
running these initialization steps or overwriting its files.

In repository Settings → Pages, choose GitHub Actions as the publishing source.
Run **Publish GitHub Pages** manually from the default branch when ready. CI runs
on pushes and PRs. Publication is deliberately manual during the synthetic-data
stage. This scaffold has not been deployed. Account/repository eligibility for
Pages may vary; see the official documentation linked below.

Vite uses a relative base (`./`), supporting repository subpaths without hardcoding
a username. The MVP has no client-side path router; future routing should use query
parameters or hashes so Pages deep links do not 404.

## Reference documentation

- https://vite.dev/guide/
- https://vite.dev/guide/build
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

Dependencies are locked for reproducibility, not claimed to be the latest releases.
