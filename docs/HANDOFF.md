# Start here — continuation handoff

Prepared 2026-10-11 from the conversation supplied by the user. This file and the
linked documents are the continuity contract; a new Codex session need not have
access to the old chat. They preserve all product-relevant decisions visible in
that conversation. Earlier infographic files and exact assistant advice were not
provided, so their contents have not been reconstructed.

## Goal

Build a static, responsive Deadlock Counter Advisor hosted on GitHub Pages. A
player describes their own hero/build and several enemies plus the problem they
are experiencing. The app returns understandable, situational item options for
survival, disruption, and punishment, divided by immediate affordability and
future purchases. Explain the specific mechanics and limitations, not just a rank.

## Read order

1. CONVERSATION_CONTEXT.md — user intent, corrections, and examples to verify.
2. ../PROJECT_SPEC.md — user experience and acceptance criteria.
3. ../DATA_MODEL.md — entities, evidence, patch model, and scoring contract.
4. ../ROADMAP.md — implementation sequence and future maintenance.
5. DECISIONS.md and VALIDATION.md — boundaries and actual verification.

## Current state

Latest continuation 2026-10-11: repeatable catalog import and simpler browsing
implemented. Read GAME_DATA.md for refresh/review commands and source limits.
Implementation d84c697 is deployed; remote Checks/Pages and manual refresh all
succeeded. Live page was reloaded and inspected. See VALIDATION.md for run IDs.
Pinned client 6774 snapshot contains 65 hero records / 757 entities, with 41
source-selectable heroes and 173 shop items displayed (17 special-tier records
kept separate). Portrait/item URLs and colors come from the source; failures have
fallbacks. Imported facts stay separate from verified rules: no live counter
recommendations have been certified. New manual data-refresh workflow uploads
review artifacts; Pages still deploys accepted main pushes after checks.
Problems are now browseable views with Early/Mid/Late columns in the opt-in demo
board; stage/problem checkboxes are removed. Budget/active preference are optional.
Full item browsing uses source tiers, not invented stage-fit or matchup claims.
Next: audit selected mechanics and implement a real reviewed vertical slice using
the captured data; independently check roster/mode availability against the game.
Historical scaffold-only/no-catalog statements below are superseded.

GitHub continuation 2026-10-11: user authorized creating a new repository and
hosting the demo for testing. Repository is now
https://github.com/matcpn/deadlock-counter-advisor, with origin configured locally
and main pushed. Pages uses Actions and deploys successful pushes to main (also
manual dispatch). Test URL: https://matcpn.github.io/deadlock-counter-advisor/ .
See VALIDATION.md for actual remote results. This supersedes all older statements
below about no Git checkout, remote, commit or deployment. No game data was added.

Continuation update 2026-10-11: completed the first runtime-validation portion of
Milestone 1. Catalogs now require a versioned manifest, source records, coverage
note, scoped evidence and an acyclic component graph. Recommendation entry checks
catalogs, scenarios and weights. Production requires matching patch and complete
verified evidence; needs-review data is excluded. The player hero can no longer be
selected as an enemy. See DATA_REVIEW.md for the import contract and research queue.
42 tests and the production build pass. Vitest upgraded to 5.0.3 to resolve the
installed dependency advisories; npm installation reported zero vulnerabilities.
This directory is not a Git checkout. No commit, remote or deployment was created.

Implemented: runnable React/TS/Vite scaffold, typed domain, synthetic fixtures,
scenario form, grouped cards, deterministic demonstration ranker, focused tests,
CI and manual Pages workflow. There is no production catalog, complete roster,
verified item interaction, deployed URL, or remote commit. GitHub connection is
confirmed for matcpn; repository search `user:matcpn deadlock` returned no results.
No repository destination was supplied. Do not infer one or claim a push succeeded.

## First work for the next session

1. Inspect repository state and these documents. Keep the design direction.
2. Run npm ci and npm run check. Read VALIDATION.md for prior results.
3. Verify current roster, items, prices, categories, activation types, ability
   descriptions, and patch date using current sources. Build a source manifest.
4. Resolve the specific user examples in CONVERSATION_CONTEXT.md; record verified,
   conditional, false, or unresolved outcomes. Do not simply implement those claims.
5. Extend the implemented validators for effects, availability, dependencies and
   conditional mechanics before adding live rules. Start with a
   carefully verified Infernus versus Abrams/Shiv vertical slice, using the same
   layout every hero will get; then extend across the full playable roster.
6. Implement advanced constraints, scoring explanations, and tests in ROADMAP.md.
7. Populate and audit remaining heroes. Mark unsupported coverage visibly.
8. Validate responsive UI, keyboard flow, behavior and Pages subpath deployment.
9. Choose/create the remote with the user if still absent; commit the project and
   use the prepared Pages workflow when deployment is requested/authorized.

## Prompt to use in Codex

> Continue this Deadlock Counter Advisor project. First read AGENTS.md and
> docs/HANDOFF.md, then the linked context/spec/model/roadmap files. Treat them as
> the project brief; do not restart discovery or replace it with a static hero-to-item
> list. Inspect the scaffold, run its checks, and implement the next incomplete
> milestone. Verify current Deadlock data and the user-supplied interaction examples
> before adding real recommendations. Preserve Survive/Disrupt/Punish groups,
> early/budget options, multi-enemy coverage, item colors, active-item distinctions,
> explicit limitations, and soft build-fit preferences. Keep data and ranking
> configurable and patch-aware. Update the handoff and validation notes as you work.
> Target GitHub Pages; inspect the selected repository before writing or deploying.

Attach the ZIP or open the repository containing it. This prompt alone is an index;
the files carry the detailed context. Do not assume chat history transfers automatically.
