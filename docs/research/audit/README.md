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

Still-open items from the audit (not yet applied): none — the missing-sites item below was the
last one.

Applied since:

- 2026-07-22: month-precision `dateDestroyed` ("YYYY-MM") on the 12 remaining sites whose
  day-precision dates sources only support at month precision (their derived day-precision
  Islamic dates were dropped); the regen had already removed the rest.
- 2026-07-22: `coordinatesApproximate: true` on the 51 sites the coordinate passes could not
  verify at building level (could-not-verify lists plus aggregate entries and 1948/1967
  village-center placements).
- 2026-07-22: researched the ~27 candidates named across the Bonus sections. Several turned out
  to already be in the dataset under a different id/name (Rafah Museum, Grand Mosque of Khan
  Yunis, Tell el-'Ajjul, Tell es-Sakan, Byzantine Church of Jabaliya, the Commonwealth/Al-Tuffah
  war cemetery pair — the README's own parenthetical examples were stale) or were duplicates of
  an existing entry under a different name (Gaza Museum of Archaeology = Al Mat'haf; Gaza
  Municipality building on Omar Al-Mukhtar St = the existing municipality entry). One candidate
  (Abu Khadra Mosque) was dropped for an uncited/contradictory war-damage claim — the same
  pattern this audit exists to catch. Three more (Al-Shamah Mosque, Al-Madrasah al-Kamaliyah,
  Kfar Bar'am Synagogue) had real sourcing but no status that fit this tracker's four-value
  damage model (`destroyed` / `heavily-damaged` / `damaged` / `abandoned`) without
  misrepresenting what the sources actually say, so they were left out rather than forced.
  16 verified sites were added, each with a real dated source (mostly the UNESCO assessment
  page, gigaza.org war-damage records, or direct news coverage) — see `git log` for the id list.

Canonical sources for future additions: UNESCO assessment (unesco.org/en/gaza/assessment —
only claim `verifiedBy: UNESCO` for sites on this list), the IPS palestine-studies.org per-site
databases, gigaza.org/en/war-damage, librarianswithpalestine.org, Wikidata/OSM for coordinates.
