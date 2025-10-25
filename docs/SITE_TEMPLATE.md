# Heritage Site Data Entry Template

This template helps you add new sites to `src/data/mockSites.ts` in the correct format.

## Quick Reference

**Required Fields:** id, name, type, yearBuilt, coordinates, status, description, historicalSignificance, culturalValue, verifiedBy, sources
**Optional Fields:** nameArabic, dateDestroyed, yearBuiltIslamic, dateDestroyedIslamic, images

**Valid Types:** mosque, church, archaeological, museum, historic-building
**Valid Statuses:** destroyed, heavily-damaged, looted, damaged, abandoned, unknown, unharmed

## Template

Copy this JSON object and fill in the values:

```json
{
  "id": "unique-kebab-case-id",
  "name": "Site Name in English",
  "nameArabic": "اسم الموقع بالعربية",
  "type": "mosque",
  "yearBuilt": "7th century",
  "yearBuiltIslamic": "1st century AH",
  "coordinates": [31.5000, 34.4000],
  "status": "destroyed",
  "dateDestroyed": "2023-10-15",
  "dateDestroyedIslamic": "29 Rabi' al-Awwal 1445 AH",
  "description": "Brief description of the site (minimum 50 characters). Include historical context and significance.",
  "historicalSignificance": "Detailed historical significance of the site.",
  "culturalValue": "Cultural importance and community value of the site.",
  "verifiedBy": ["UNESCO", "Heritage for Peace"],
  "sources": [
    {
      "organization": "UNESCO",
      "title": "Report Title",
      "url": "https://example.com/report",
      "date": "2024-01-01",
      "type": "official"
    }
  ],
  "images": {
    "before": "https://example.com/before.jpg",
    "after": "https://example.com/after.jpg",
    "satellite": "https://example.com/satellite.jpg"
  }
}
```

## Field Guidelines

### ID
- **Format:** lowercase-with-hyphens
- **Example:** `great-omari-mosque`, `church-st-porphyrius`
- **Must be unique** across all sites

### Name
- **English name:** Official or commonly used English name
- **Arabic name:** Native Arabic name (optional but strongly recommended)

### Type
Choose one of:
- `mosque` - Islamic worship sites
- `church` - Christian worship sites
- `archaeological` - Ancient ruins, archaeological sites
- `museum` - Museums, cultural centers
- `historic-building` - Historic secular buildings (hammams, castles, etc.)

### Year Built
Can be:
- Specific year: `"425 CE"`, `"800 BCE"`
- Century: `"7th century"`, `"16th century"`
- Range: `"800 BCE - 1100 CE"`
- With Islamic year: `"7th century (1st century AH)"`

### Coordinates
- **Format:** `[latitude, longitude]` (Leaflet format)
- **Gaza bounds:** Lat 31.2-31.6, Lng 34.2-34.6
- **Find coordinates:** Use Google Maps, right-click → coordinates
- **Example:** `[31.5203, 34.4668]` (Gaza City center)

### Status

Choose one of:

- `destroyed` - Completely destroyed, no structural integrity remaining
- `heavily-damaged` - Major structural damage, may not be repairable
- `looted` - Artifacts or valuables stolen or removed
- `damaged` - Partial damage, repairable with restoration work
- `abandoned` - No longer in use or maintained, but structurally intact
- `unknown` - Status cannot be verified or is uncertain
- `unharmed` - No damage, fully intact and preserved

### Date Destroyed
- **Format:** ISO date `YYYY-MM-DD`
- **Optional:** Only if date is known
- **Example:** `"2023-10-15"`

### Islamic Calendar Dates
- **Format:** Free text (e.g., `"29 Rabi' al-Awwal 1445 AH"`)
- **Optional but recommended** for cultural completeness
- **Verification required:** Use https://www.islamicfinder.org/islamic-calendar-converter/
- Add comment in code: `// Manually verified with Islamic calendar converter`

### Description
- **Minimum 50 characters**
- Brief overview of the site
- Include what it was, historical period, significance

### Historical Significance
- Detailed history of the site
- When it was built, by whom
- Major historical events associated with it
- Architectural or archaeological importance

### Cultural Value
- Importance to local community
- Religious, social, or cultural role
- Why preservation matters
- What has been lost

### Verified By
- **Array of organizations** that documented the damage
- Common values: `"UNESCO"`, `"Heritage for Peace"`, `"Forensic Architecture"`
- At least one required

### Sources
- **At least one source required**
- Multiple sources preferred for verification
- **Fields:**
  - `organization` - Source organization (required)
  - `title` - Report/article title (required)
  - `url` - Link to source (optional)
  - `date` - Publication date YYYY-MM-DD (optional)
  - `type` - One of: `official`, `academic`, `journalism`, `documentation` (required)

### Images (Optional)
- `before` - Photo before destruction
- `after` - Photo after destruction
- `satellite` - Satellite imagery
- All URLs, hosted externally

## Example: Complete Site Entry

```json
{
  "id": "great-omari-mosque",
  "name": "Great Omari Mosque",
  "nameArabic": "المسجد العمري الكبير",
  "type": "mosque",
  "yearBuilt": "7th century (1st century AH)",
  "yearBuiltIslamic": "1st century AH",
  "coordinates": [31.5203, 34.4668],
  "status": "destroyed",
  "dateDestroyed": "2023-12-07",
  "dateDestroyedIslamic": "23 Jumada al-Awwal 1445 AH",
  "description": "The Great Omari Mosque in Gaza City, one of the oldest mosques in Palestine, dating to the 7th century CE. The mosque was built on the site of an ancient Philistine temple.",
  "historicalSignificance": "Built during the Islamic conquest of Palestine in the 7th century CE (1st century AH), the Great Omari Mosque stands on a site with over 3,000 years of religious history. Originally a Philistine temple, it later became a Byzantine church before its conversion to a mosque. The site represents layers of Gaza's diverse cultural heritage.",
  "culturalValue": "The Great Omari Mosque served as Gaza City's main Friday prayer venue for centuries and was a center of Islamic learning. Its destruction represents an irreplaceable loss to Palestinian cultural identity and Islamic architectural heritage.",
  "verifiedBy": ["UNESCO", "Heritage for Peace", "Forensic Architecture"],
  "sources": [
    {
      "organization": "UNESCO",
      "title": "Damage Assessment of Cultural Heritage Sites in Gaza",
      "url": "https://unesco.org/reports/gaza-heritage-2023",
      "date": "2023-12-15",
      "type": "official"
    },
    {
      "organization": "Heritage for Peace",
      "title": "Gaza Cultural Heritage Monitoring Report December 2023",
      "url": "https://heritageforpeace.org/gaza-report-dec-2023",
      "date": "2023-12-20",
      "type": "documentation"
    }
  ],
  "images": {
    "before": "https://example.com/omari-mosque-before.jpg",
    "after": "https://example.com/omari-mosque-after.jpg",
    "satellite": "https://example.com/omari-mosque-satellite.jpg"
  }
}
```

## Validation Checklist

Before adding a new site, verify:

- [ ] ID is unique (check existing site IDs in mockSites.ts)
- [ ] Coordinates are within Gaza bounds (31.2-31.6 lat, 34.2-34.6 lng)
- [ ] Date destroyed is ISO format YYYY-MM-DD (if provided)
- [ ] Year built has a value (can be century or year)
- [ ] Description is at least 50 characters
- [ ] At least one source provided
- [ ] At least one organization in verifiedBy
- [ ] Source URLs start with http:// or https:// (if provided)
- [ ] Type is one of the 5 valid types
- [ ] Status is one of the 7 valid statuses
- [ ] Islamic dates verified using calendar converter (if provided)

## After Adding Sites

1. **Run validation tests:**
   ```bash
   npm test -- src/data/validateSites.test.ts --run
   ```

2. **Check data quality output:**
   - Total sites count
   - Type distribution
   - Status breakdown
   - Islamic calendar coverage

3. **Run full test suite:**
   ```bash
   npm test -- --run
   ```

4. **Verify in browser:**
   ```bash
   npm run dev
   ```
   - Check site appears on map
   - Check site appears in timeline
   - Check site appears in table
   - Test search functionality
   - Test all filters

## Data Collection Workflow

1. **Research the site:**
   - Find official documentation (UNESCO, Heritage for Peace, etc.)
   - Verify destruction with multiple sources
   - Collect coordinates from reliable sources

2. **Copy template above**

3. **Fill in all required fields**

4. **Find Islamic calendar dates:**
   - Use https://www.islamicfinder.org/islamic-calendar-converter/
   - Add verification comment in code

5. **Add to mockSites.ts array**

6. **Run validation tests** (step 1 above)

7. **Fix any errors** reported by tests

8. **Verify in browser** (step 4 above)

9. **Commit with descriptive message:**
   ```bash
   git add src/data/mockSites.ts
   git commit -m "data: add [Site Name] to heritage sites"
   ```

## Tips

- **Start with required fields only**, add optional fields later
- **Use existing sites as reference** (see src/data/mockSites.ts)
- **Copy Arabic names** from official sources (don't translate manually)
- **Verify coordinates** on multiple maps to ensure accuracy
- **Islamic dates are optional** but add cultural completeness
- **Multiple sources** strengthen verification and credibility
- **Good descriptions** help users understand what was lost

## Need Help?

- **Schema reference:** See `src/types/index.ts`
- **Existing examples:** See `src/data/mockSites.ts`
- **Validation tests:** See `src/data/validateSites.test.ts`
- **Filter utilities:** See `src/utils/siteFilters.ts`
