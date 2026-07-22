# Data fact-check audit — 2026-07-22

Six parallel research passes over `src/data/mockSites.ts` (146 sites at the time), followed by a
corrective codemod that regenerated the file (146 → 131 sites).

| File | Scope |
|---|---|
| `phase0-report.md` | Mechanical checks (bbox, Islamic-date recompute, URL liveness) — **post-fix state**; "coords-outside-gaza" rows are expected 1948/1967 sites, identical-coordinate pairs are intentional same-building entries |
| `findings-coords-a.md` | Coordinates, Gaza City core (98 sites) — Wikidata/OSM evidence |
| `findings-coords-b.md` | Coordinates, south Gaza + 1948/1967 historic Palestine (48 sites) |
| `findings-dates.md` | Destruction dates and construction eras vs the documented record |
| `findings-desc-a.md` / `findings-desc-b.md` | Checkable factual claims in description fields |
| `findings-sources.md` | Citation integrity, dead/fabricated URLs, verifiedBy vs UNESCO's list |

Still-open items from the audit (not yet applied):

- ~20 notable missing sites listed in the Bonus sections (Grand Mosque of Khan Yunis, Rafah
  Museum, UNESCO-verified sites absent from the dataset, …).

Applied since:

- 2026-07-22: month-precision `dateDestroyed` ("YYYY-MM") on the 12 remaining sites whose
  day-precision dates sources only support at month precision (their derived day-precision
  Islamic dates were dropped); the regen had already removed the rest.
- 2026-07-22: `coordinatesApproximate: true` on the 51 sites the coordinate passes could not
  verify at building level (could-not-verify lists plus aggregate entries and 1948/1967
  village-center placements).

Canonical sources for future additions: UNESCO assessment (unesco.org/en/gaza/assessment —
only claim `verifiedBy: UNESCO` for sites on this list), the IPS palestine-studies.org per-site
databases, gigaza.org/en/war-damage, librarianswithpalestine.org, Wikidata/OSM for coordinates.
