# Repeatable game catalog

## Refresh locally

Use Node 24, then run:

```sh
npm ci
npm run data:pull
npm run research:build
npm run check
```

To reproduce a particular client snapshot:

```sh
npm run data:pull -- --version 6774
```

The importer reads the latest source `steam-info` version once and pins every
subsequent request to that client version. It fetches heroes, items, colors and
version metadata from the documented [Deadlock API](https://api.deadlock-api.com/docs).
This is a community extraction of client data, not an official Valve API or proof
that the newest live patch is fully represented. No API key or browser fetch is
required: the static site ships the committed normalized snapshot.

## Files and review

The October 16 Violet dry run is documented in [VIOLET_REFRESH_AUDIT.md](VIOLET_REFRESH_AUDIT.md).
Client 6793 is preserved as a candidate, not the published runtime. Until staging
is implemented, run experimental pulls in a disposable checkout: the pull writes
the runtime catalog and a new client pauses old reviewed recommendations.

- `data/snapshots/client-6774/`: original API bytes and a source manifest containing
  endpoint URLs, SHA-256 checksums, retrieval timestamp, counts and art provenance.
- `src/data/game-catalog.json`: generated display facts, separate from reviewed
  rule data and synthetic fixtures. Imported facts have `imported-unreviewed` status.
- `data/latest-diff.json`: added, removed and changed stable IDs for heroes/items,
  plus color changes. Consult the raw/normalized Git diff for exact changed fields.
- `npm run data:verify`: offline checksum and deterministic regeneration check,
  included in `npm run check` and therefore CI and the Pages release gate.

An unchanged pull leaves the current catalog timestamp and last diff unchanged.
Previously captured raw files are immutable. If the source changes bytes under the
same version, the pull fails and preserves the published catalog. Investigate the
upstream change and capture a new reviewed snapshot rather than quietly overwriting.
Network errors, schema changes, invalid availability/cost/category/activation,
duplicate IDs, missing selectable-hero abilities, unresolved components or component
cycles also fail before replacing the normalized catalog. Preserve prior snapshots
in Git; Git history is the rollback path for the normalized file.

The manual **Pull game data for review** GitHub Actions workflow accepts an optional
client version. It pulls, runs all checks and publishes a 30-day artifact containing
the proposed data. It does not commit, merge or deploy new source data. Download and
review the artifact, or rerun the local command, then commit accepted changes. Pushes
to main deploy only after checks. No recurring schedule has been created.

## First captured coverage

Client 6774 (`steam-info` build date October 9, 2026), retrieved October 12 UTC /
October 11 America/New_York: 65 hero records, 757 item/ability/weapon records,
41 source-selectable heroes and 173 enabled shop upgrades.

The full raw roster is preserved. Selectors require `player_selectable`, not
disabled, not prerelease-only, not limited-testing and not assigned-players-only.
Upstream development metadata is ignored; it is not normalized, displayed or
tracked for review invalidation. The selected roster is complete relative to this
source filter, not independently audited against the live client.
Unavailable heroes can lack ability definitions; those absences are
explicit in normalized records. Missing abilities for selectable heroes fail import.

Shop imports require `type=upgrade`, `shopable=true`, and not explicitly disabled.
All 173 records remain browseable, including 17 tier-5 records. The API's shopable
flag does not establish mode availability; special tier 5 is separated and labeled.
Numeric costs/categories/activation are read from the source, never from memory.
Non-active remains **non-active, trigger varies** until passive/conditional behavior
has specific review; `activation=passive` alone does not prove unconditional effects.
Component links are imported but component credit is not assumed. Raw properties
retain source units/tokens; unknown values remain null. Markup is rendered as plain
text, never injected as HTML.

## Artwork and colors

Portrait and item image URLs come directly from the same source responses. They
are lazy-loaded remotely from the API asset bucket, with a visible fallback if
missing or unavailable. No binary artwork is copied into this repository. Source
URLs and Valve ownership are attributed in the UI and snapshot manifest. API code
is MIT; that does not license Valve artwork or imply endorsement. Assets may change
independently of pinned data, so their pixels are not an immutable part of snapshots.
Fallbacks are supported, and external images are optional to using the catalog.

Weapon, vitality and spirit colors use the pinned source's `weapon_color`,
`armor_color`, and `spirit_bright_color` palette tokens; text labels carry category
meaning as well. Artwork provenance is recorded; unrestricted redistribution
permission has not been claimed.

## What importing does not do

No automatically generated matchup rules, win-rate inference, source-tag-to-counter
inference, certified cleanse/execute interactions or automatic rule promotion.
`demo.ts` still contains invented fixtures exclusively. The imported catalog is a
browseable research foundation. Review specific interaction evidence, conditions
and timing before adding production recommendations. A future verified release
must match the catalog version; changed mechanics must invalidate affected rules.
