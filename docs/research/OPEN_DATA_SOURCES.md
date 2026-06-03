# Open Data Sources — Gaza Destruction & Cultural Heritage

Research into queryable/downloadable datasets for expanding HeritageTracker's destruction data.
Verified June 2026. Each source was checked for live access and accurate claims.

---

## Tier 1 — Directly Queryable, No Registration

### UNOSAT Comprehensive Damage Assessment

**What it is:** The most authoritative structural damage dataset for the Gaza Strip.
Per-structure satellite analysis classifying each building as destroyed / severely damaged / moderately damaged / possibly damaged.

**Coverage:** Oct 2023 – ongoing. Multiple assessment rounds; **latest is October 2025**.
- Oct 2025: 81% of all Gaza structures affected — 198,273 total, 123,464 destroyed
- Dec 2024: 170,812 affected, 60,368 destroyed
- Sep 2024: 163,778 affected, 52,564 destroyed

**Format:** Shapefiles (primary). Point/polygon data in WGS84.

**Access (no registration):**
- ArcGIS Data Hub: https://gaza-unosat.hub.arcgis.com/pages/data
- HDX (Sep 2024): https://data.humdata.org/dataset/unosat-gaza-strip-comprehensive-damage-assessment-september-2024
- HDX (Dec 2024): https://data.humdata.org/dataset/unosat-gaza-strip-comprehensive-damage-assessment-01-december-2024
- HDX (Jul 2025): https://data.humdata.org/dataset/unosat-gaza-strip-comprehensive-damage-assessment-08-july-2025
- ArcGIS Dashboard (visual): https://www.arcgis.com/apps/dashboards/11816edccdc24205990a33b1b3afd259
- UNISPAL summary (Oct 2025): https://www.un.org/unispal/document/unosat-gaza-strip-damage-assessment-31oct25/

**License:** UN open data. Free for humanitarian/educational use with attribution. Contact: unosat@unitar.org

**Cultural heritage fields:** None — structures classified by damage level only, not building type.
To isolate heritage sites, spatial-join the UNOSAT shapefile against HeritageTracker's site coordinates.

**Integration path:**
1. Download latest shapefile from the ArcGIS hub or HDX
2. Load in QGIS or use Turf.js to do a point-in-polygon join against your `coordinates` fields
3. Write the matched damage class back to `mockSites.ts` (or a new `damageVerified` field)

---

### TechForPalestine Infrastructure Damage API

**What it is:** Time-series of aggregate infrastructure destruction counts since Oct 7, 2023.
Sourced from the Gaza Government Media Office (note: Hamas-controlled authority — treat as one input among several, not sole ground truth).

**Coverage:** Oct 7, 2023 – present. Updated daily/weekly.

**Format:** Static JSON served as a public API. No auth, no key.

**API endpoints (live, confirmed):**
```
https://data.techforpalestine.org/api/v3/infrastructure-damaged.min.json
https://data.techforpalestine.org/api/v3/infrastructure-damaged.json
```

**JSON structure (per entry):**
```json
{
  "report_date": "2023-10-07",
  "civic_buildings": { "ext_destroyed": 5 },
  "educational_buildings": { "ext_destroyed": 1, "ext_damaged": 15 },
  "places_of_worship": {
    "ext_mosques_destroyed": 2,
    "ext_mosques_damaged": 4,
    "ext_churches_destroyed": 0
  },
  "residential": { "ext_destroyed": 80 }
}
```
Fields prefixed `ext_` are interpolated estimates for dates without official figures.

**License:** Open. Docs: https://data.techforpalestine.org/docs/infrastructure-damaged/
GitHub: https://github.com/TechForPalestine/palestine-datasets

**Cultural heritage fields:** `places_of_worship.mosques_destroyed`, `churches_destroyed`.
No coordinates — counts only, not individual site locations.

**Integration path:** Fetch the JSON to drive aggregate statistics on the About/Stats pages
(e.g. "X mosques destroyed as of [date]"). Cannot be used for map pins.

---

### bothness/gaza-geojson

**What it is:** Community-aggregated GeoJSON files compiled from Israeli military, HDX, and Financial Times sources.

**Folders confirmed in repo:**
- `destruction/` — extent of destruction polygons
- `blocks/` — Israeli-defined neighbourhood blocks used for evacuation orders
- `boundaries/` — Gaza boundaries and buffer zones
- `built-areas/` — urban footprints
- `population/` — population distribution
- `ways/` — road network

**Access:** https://github.com/bothness/gaza-geojson (raw file downloads, no auth)

**License:** Not stated in the repository. Confirm with the author before production use.

**Integration path:** Pull the `destruction/` polygons as a translucent map overlay layer to show
the extent of destruction in context of heritage site markers. No individual site data.

---

## Tier 2 — Free Registration Required

### ACLED (Armed Conflict Location & Event Data)

**What it is:** Geolocated conflict event database. Each event has lat/lng, date, event type, actor, narrative.
Event type "Property Destruction" is specifically coded and filterable.

**Coverage:** Oct 7, 2023 – present.

**Access:**
- Full event-level API + CSV export: free registration required at https://acleddata.com
- Aggregated country/month files on HDX (no registration): https://data.humdata.org/dataset/palestine-acled-conflict-data
- Conflict monitor (visual): https://acleddata.com/monitor/gaza-conflict-monitor

**License:** Free for non-commercial research with attribution.

**Cultural heritage fields:** None. Filter `event_type = "Property Destruction"` then cross-reference
against heritage site coordinates by radius.

**Integration path:** Register (free), use the data export tool to pull Property Destruction events
within the Gaza bounding box. Returns precise lat/lng per event — could be used to find destruction
events near known heritage sites.

---

## Tier 3 — Manual / Web Only

### UNESCO Cultural Heritage Impact Assessment

**What it is:** The authoritative list of verified cultural heritage sites damaged since Oct 7, 2023.
Uses UNOSAT satellite analysis plus post-ceasefire on-site assessment.

**As of March 25, 2026 (page verified):**
- **164 total sites damaged**
- 14 religious sites
- 128 buildings of historical/artistic interest
- 3 movable cultural property depositories
- 9 monuments
- 2 museums
- 8 archaeological sites

Named examples confirmed on the page: Great Omari Mosque, Saint Porphyrios Orthodox Church Complex,
Tell Rafah archaeological site.

**Access:** https://www.unesco.org/en/gaza/assessment
Web listing only. No download, no API, no GeoJSON. Organized by governorate.

**Cultural heritage fields:** Yes — this is the primary authority for site type classification.
Taxonomy overlaps directly with HeritageTracker's types (mosque, church, archaeological_site, museum, monument).

**Integration path:** Manual transcription of UNESCO's named sites. Cross-reference against UNOSAT
shapefiles to obtain coordinates (UNESCO provides governorate-level location, not lat/lng).
This is the highest-authority source for what counts as a verified heritage site.

---

### Forensic Architecture

**Investigations relevant to HeritageTracker:**

1. **Living Archaeology in Gaza** (`forensic-architecture.org/investigation/living-archaeology-in-gaza`)
   — Focuses specifically on the ancient Greco-Roman site of Anthedon (Blakhiyya). First open-source
   archaeology project. Includes 3D reconstruction and bomb impact mapping. Not a broad dataset.

2. **A Cartography of Genocide** (`gaza.forensic-architecture.org`) — Interactive platform mapping
   ~3,000 events since Oct 7, 2023 (attacks on health, education, water, agricultural infrastructure).
   Built from UNICEF, OSM, UNESCO, UNOSAT, and Airwars inputs.
   Note: GeoJSON endpoint availability could not be independently verified; contact FA directly.

**Access:** Web interface. Bulk data access may require a request to the organization.
GitHub: https://github.com/forensic-architecture (check for `gaza-public-data` repository)

---

## What's Not Available (Confirmed Gaps)

| Gap | Notes |
|-----|-------|
| Single dataset: coordinates + heritage type + damage status | Doesn't exist. Requires joining UNOSAT (coordinates + damage) with UNESCO list (heritage identity). |
| UNESCO download | Web listing only as of March 2026, confirmed. |
| Forensic Architecture bulk GeoJSON | Not confirmed as publicly accessible; may require direct contact. |
| UNOSAT building-type fields | UNOSAT classifies by damage level only, not mosque/church/school. |

---

## Architecture Fit Analysis

How each source maps to HeritageTracker's existing patterns (`src/services/`, `src/hooks/`, `src/constants/`, Leaflet map).

### Drop-in fits (no architectural change)

**TechForPalestine → `src/services/` pattern**

Mirrors `src/services/waybackService.ts` exactly: external fetch, typed response, React Query hook.

```
src/services/techForPalestineService.ts   ← fetch + type the JSON response
src/hooks/useTechForPalestineStats.ts     ← React Query wrapper (5 min cache)
```

The JSON fields fill direct gaps in `src/constants/statistics.ts`:
- `places_of_worship.ext_mosques_destroyed` → supplements `UNESCO_VERIFIED_SITES`
- `educational_buildings.ext_destroyed` → new school destruction stat
- `report_date` → replaces the hardcoded `LAST_UPDATED = "January 2025"` with a live timestamp

No changes to `Site` type, no auth, no offline processing.

**bothness/gaza-geojson destruction polygons → Leaflet GeoJSON layer**

The app already renders Leaflet layers (tile providers, glow canvas). The `destruction/` GeoJSON
files from this repo can be added as a translucent overlay behind existing site markers.

```
public/data/unosat-destruction-2025.geojson   ← one-time download, committed to repo
src/components/Map/DamageOverlayLayer.tsx     ← L.geoJSON() layer with opacity toggle
```

No runtime API calls, no auth, no schema changes. Toggle follows the existing "Show Map Markers" pattern.

**UNESCO constant update → `src/constants/statistics.ts`**

`UNESCO_VERIFIED_SITES` is hardcoded as `114`. The verified count is now **164** (March 2026).
This is a two-line fix that cascades correctly through `ESCALATION_STATISTICS.heritageSitesPerYear`
and any component consuming it.

### Requires more work (not drop-in)

**UNOSAT spatial join** — enriching each `Site` record with a satellite-verified damage class
requires adding a `damageClass?: string` field to the `Site` type and running a one-time offline
processing script (QGIS or Turf.js) to join UNOSAT polygons against site coordinates. The result
gets written back to `mockSites.ts`. Worth doing, but not a simple fetch integration.

**ACLED event data** — needs free registration and introduces a new data model (conflict events,
not sites). More of a future feature than a near-term integration.

**Forensic Architecture** — bulk data access unconfirmed. Requires direct contact before any
integration work starts.

---

## Recommended Integration Roadmap

| Step | Source | What it enables | Effort |
|------|--------|----------------|--------|
| 1 | UNESCO constant update | Accurate count (164) on About/Stats pages today | 5 min |
| 2 | TechForPalestine JSON API | Live mosque/school/civic destruction counts with live date | 1–2 hrs |
| 3 | bothness destruction polygons | Map overlay showing full extent of destruction | 2–4 hrs |
| 4 | UNOSAT shapefile spatial join | Add `damageClass` to each of our 102 sites (offline script) | Half day |
| 5 | UNESCO named site list (manual) | Identify which of the 164 UNESCO sites we're still missing | Half day |
| 6 | UNOSAT → UNESCO cross-reference | Get coordinates for UNESCO sites not yet in our DB | Day |
| 7 | ACLED (registered) | Flag heritage sites appearing in property destruction events | Half day |

---

*Sources verified June 2026. UNOSAT, UNESCO, and TechForPalestine endpoints confirmed live.
ACLED registration requirement confirmed. Forensic Architecture GeoJSON endpoints unconfirmed.*
