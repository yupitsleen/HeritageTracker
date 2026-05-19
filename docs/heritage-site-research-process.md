# Heritage Site Research Process

This document describes the methodology for researching and adding new Palestinian cultural heritage sites to `src/data/mockSites.ts`. Follow this process exactly to maintain data quality and avoid duplicates.

---

## Step 1: Audit the Existing Database

Before any research, extract the current site list to use as an exclusion list.

```bash
grep "name:" src/data/mockSites.ts | grep -v "nameArabic" | sort
```

Also check the current count and year distribution:

```bash
npx tsx -e "
import { mockSites } from './src/data/mockSites.ts';
console.log('Total:', mockSites.length);
const byYear = {};
mockSites.filter(s => s.dateDestroyed || s.sourceAssessmentDate).forEach(s => {
  const y = (s.dateDestroyed || s.sourceAssessmentDate).substring(0,4);
  byYear[y] = (byYear[y]||0)+1;
});
console.log('By year:', JSON.stringify(Object.fromEntries(Object.entries(byYear).sort())));
"
```

Note the most recent `dateDestroyed` value — that's the current coverage cutoff.

---

## Step 2: First-Pass Research (Broad Search)

Spawn a `general-purpose` agent with the following prompt structure. The agent has web search tools and can search in Arabic and English.

### Prompt template

```
I'm working on a Palestinian cultural heritage destruction tracker. It currently documents [N] verified heritage sites in Gaza. Today's date is [DATE].

I need to research verified heritage site destruction/damage in Gaza [from DATE_RANGE / not yet in our database].

Sources to prioritize:
- UNESCO Gaza damage assessments: https://www.unesco.org/en/gaza/assessment
- ASOR Cultural Heritage Initiatives: https://www.asor.org/chi/
- Forensic Architecture: https://forensic-architecture.org/
- Librarians and Archivists with Palestine: librarianswithpalestine.org/gaza-report-2024/
- Wikipedia: https://en.wikipedia.org/wiki/Destruction_of_cultural_heritage_during_the_Israeli_invasion_of_the_Gaza_Strip
- Arabic Wikipedia: search for "تدمير التراث الثقافي في غزة"
- Al Jazeera (Arabic and English)
- Gaza Cultural Sector documentation: gazacultrualsector.palestine-studies.org
- Palestinian Ministry of Culture / Ministry of Tourism records
- Wafa news agency: wafa.ps
- Anadolu Agency, Middle East Monitor, Middle East Eye
- Librarians with Palestine 2024 report PDF
- ArabLit, Literary Hub (for libraries/archives)
- Art News, Hyperallergic, The Art Newspaper (for galleries/arts institutions)
- Scholars at Risk: scholarsatrisk.org (for university/academic sites)

For each site NOT already in our database (exclusion list below), provide:
1. Site name (English + Arabic if available)
2. Type: mosque / church / archaeological / museum / historic-building / monument / cemetery / archive
3. Location in Gaza (neighborhood, street, or GPS coordinates)
4. Status: destroyed / heavily-damaged / damaged
5. Date of damage/destruction (year/month/day preferred; year/month minimum)
6. Verifying organization(s)
7. Brief description and historical significance
8. Source URL(s)

ALREADY IN DATABASE (do not suggest these):
[paste full name list from Step 1]
```

---

## Step 3: Triage Research Findings

For each candidate site, apply these criteria:

### Include if ALL of the following are true:
- **Not a duplicate** of an existing entry (check both English and Arabic names)
- **Minimum date**: year + month known (year alone is not enough)
- **Minimum location**: neighborhood or area in Gaza (not just "Gaza")
- **At least one credible verifying source**: UNESCO, Forensic Architecture, Heritage for Peace, Palestinian Ministry of Culture, Librarians and Archivists with Palestine, ASOR, a national news agency (AP, Reuters, Al Jazeera, Anadolu), or a recognized specialist organization

### Downgrade to "needs second pass" if:
- Only year is known (no month)
- Only "Gaza City" or "Gaza" for location (no neighborhood)
- Single source with no corroboration

### Skip if:
- No date information at all
- No location more specific than "Gaza Strip"
- Only mentioned in passing in a list with no detail

### Watch for duplicates:
- Arabic names may transliterate differently (Khoudary / Khudari / Khodari)
- "Al Mat'haf" = "The Museum" — could match an existing entry under a different name
- Hotels, hospitals, and cultural centers often contain museums/libraries as sub-institutions — check if the parent institution is already in the database

---

## Step 4: Second-Pass Research (Fill Missing Details)

For sites that passed the triage but lack location or date specifics, run a targeted follow-up search. Key techniques:

### Finding locations:
1. **Google Maps** — search the Arabic name directly (e.g., "مسجد الأمين محمد خان يونس")
2. **Arabic Wikipedia** — often has street addresses and neighborhood detail not in English sources
3. **arab.org directory** — lists Palestinian cultural organizations with addresses
4. **University/institution websites** — often list branch addresses
5. **Facebook pages** of the institution — check the "About" section for address
6. **Sunbula crafts directory** — good for NGOs and craft/cultural organizations

### Finding dates:
1. **Palestinian Ministry of Culture damage reports** (referenced in LAP report)
2. **Scholars at Risk database** — logs academic institution attacks with specific dates
3. **Anadolu Agency Arabic** — often has day-level dates for specific strikes
4. **ArabLit** — good for libraries and literary institutions

### Arabic search terms that yield better results:
- `"[site name in Arabic]" "غزة" "2023" OR "2024" OR "2025"`
- `"[site name] تدمير"` (destruction)
- `"[site name] قصف"` (bombing)

---

## Step 5: Deduplication Check

Before writing any entries, verify no existing entry covers the same site:

```bash
# Search by keyword
grep -i "keyword" src/data/mockSites.ts

# Search by Arabic name fragment
grep "arabic_word" src/data/mockSites.ts
```

Common deduplication traps:
- A library inside a cultural center (e.g., Diana Tamari Sabbagh Library inside Rashad Shawa Cultural Center — the center is already in the DB; the library is a distinct enough institution to add separately)
- Hotel museums (Al Mat'haf = Mathaf al-Funduq Hotel Museum)
- Churches with multiple common names

---

## Step 6: Write Entries

### Data format

All entries follow this TypeScript structure in `src/data/mockSites.ts`:

```typescript
{
  id: "kebab-case-unique-id",
  name: "English Name",
  nameArabic: "الاسم بالعربية",
  type: "mosque" | "church" | "archaeological" | "museum" | "historic-building" | "monument" | "cemetery" | "archive",
  yearBuilt: "year or description string",
  yearBuiltIslamic: "NNN AH",          // optional
  coordinates: [lat, lng],             // [number, number]
  status: "destroyed" | "heavily-damaged" | "damaged",
  dateDestroyed: "YYYY-MM-DD",         // omit if unknown
  dateDestroyedIslamic: "DD Month YYYY AH",  // optional
  sourceAssessmentDate: "YYYY-MM-DD",  // fallback date for unknown-date sites
  lastUpdated: "YYYY-MM-DD",
  description: "...",
  historicalSignificance: "...",
  culturalValue: "...",
  verifiedBy: ["Organization1", "Organization2"],
  sources: [
    {
      organization: "Org Name",
      title: "Article title",
      url: "https://...",         // optional
      date: "YYYY-MM-DD",
      type: "official" | "documentation" | "journalism" | "academic",
    },
  ],
}
```

### Coordinate precision
- Confirmed street address: use lat/lng derived from Maps, precise to 4 decimal places
- Confirmed neighborhood: use neighborhood centroid, note `// Neighborhood name, City` in comment
- Approximate (city only): use city centroid, note `// [City] (approximate — neighborhood unconfirmed)` in comment

### Date handling
- If exact date known: use `dateDestroyed: "YYYY-MM-DD"`
- If only month/year known: use first of month `"YYYY-MM-01"` with a note in the description
- If only year known or date is assessment date: omit `dateDestroyed`, use `sourceAssessmentDate`
- Sites with only `sourceAssessmentDate` are treated as "unknown date" and hidden by the `showUnknownDates` toggle in the UI

### Update the site count comment
At the end of the file, update:
```typescript
  // NEW SITES END - Total: N sites
```

---

## Step 7: Validate and Test

```bash
# Validate data quality (required fields, coordinate bounds, date format)
npx vitest run src/data/validateSites.test.ts

# Check final count and year distribution
npx tsx -e "import { mockSites } from './src/data/mockSites.ts'; console.log('Total:', mockSites.length);"

# Run full test suite before committing
npm test
```

All 20 validation tests must pass before committing.

---

## Step 8: Update Existing Entries

Research often surfaces better information about sites already in the database:
- More precise GPS coordinates
- Confirmed destruction dates (vs. sourceAssessmentDate fallback)
- Additional verified sources
- Updated status (damaged → destroyed)
- Expanded descriptions

Always check if second-pass research improves existing entries, not just adds new ones.

---

## Trusted Source Hierarchy

| Tier | Sources | Notes |
|------|---------|-------|
| 1 — Official | UNESCO, Forensic Architecture, ASOR CHI, Palestinian Ministry of Culture | Use `type: "official"` |
| 2 — Specialist | Heritage for Peace, Librarians and Archivists with Palestine, Scholars at Risk, IBBY, Museums Association | Use `type: "documentation"` |
| 3 — News | Al Jazeera, Anadolu Agency, AP, Reuters, Middle East Eye, Middle East Monitor, The Guardian | Use `type: "journalism"` |
| 4 — Academic | Institute for Palestine Studies, Gaza Maritime Archaeology Project, university departments | Use `type: "academic"` |

A site documented only by Tier 3-4 sources can still be added if multiple independent sources corroborate it. Avoid adding sites with only a single unverified social media post as the sole source.

---

## Commit Message Format

```
feat: add N verified heritage sites ([old total] → [new total] sites)

Brief description of the batch and key sources used.
```

Example:
```
feat: add 12 verified heritage sites (70 → 82 sites)

New sites from UNESCO assessments, Librarians and Archivists with
Palestine, Al Jazeera, Anadolu Agency, and Literary Hub.
```

---

*Last updated: 2026-05-18*
*Methodology developed across research sessions adding sites 71–102.*
