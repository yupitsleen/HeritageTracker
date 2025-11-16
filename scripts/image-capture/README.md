# Heritage Site Image Capture Scripts

Automated screenshot generation for all 70 heritage sites using ESRI Wayback satellite imagery.

## Overview

These scripts use **Playwright** (headless Chromium) to programmatically capture before/after satellite imagery for every heritage site in the database.

**Image Strategy:**
- **Before:** 2014 (oldest Wayback release)
- **After:** 2025 (newest Wayback release)
- **Format:** JPEG (90% quality)
- **Resolution:** 240x160px (cropped from 1200x800px)
- **Zoom Level:** 17 (detailed street-level view)
- **Crop:** Center 20% of image for tight focus on site
- **Marker:** None (clean satellite view)

## Files

| File | Purpose |
|------|---------|
| `capture-sites.js` | Main script - captures screenshots using Playwright |
| `update-mock-sites.js` | Updates `mockSites.ts` with image URLs |
| `map-template.html` | HTML template for Leaflet map rendering |
| `README.md` | This file |

## Quick Start

### Option 1: Full Workflow (Recommended)

Capture all images AND update `mockSites.ts` in one command:

```bash
npm run images:generate
```

### Option 2: Step-by-Step

```bash
# Step 1: Capture screenshots
npm run images:capture

# Step 2: Update mockSites.ts with image URLs
npm run images:update
```

## Output

**Images:** `public/images/sites/`
- `{site-id}-before.jpg` - 2014 satellite imagery
- `{site-id}-after.jpg` - 2025 satellite imagery
- `ATTRIBUTION.json` - Metadata and ESRI attribution

**Example:**
```
public/images/sites/
├── great-omari-mosque-before.jpg
├── great-omari-mosque-after.jpg
├── saint-porphyrius-church-before.jpg
├── saint-porphyrius-church-after.jpg
├── ...
└── ATTRIBUTION.json
```

## How It Works

### 1. Capture Script (`capture-sites.js`)

```
┌─────────────────────────────────────┐
│ Fetch Wayback releases from ESRI   │
│ (186 releases from 2014-2025)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Load 70 sites from mockSites.ts    │
│ (Extract id, coordinates, name)    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Launch headless Chromium browser    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ For each site:                      │
│  1. Load map-template.html          │
│  2. Initialize Leaflet map          │
│  3. Load 2014 Wayback tiles         │
│  4. Wait for tiles to load          │
│  5. Screenshot → {id}-before.jpg    │
│  6. Load 2025 Wayback tiles         │
│  7. Wait for tiles to load          │
│  8. Screenshot → {id}-after.jpg     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Generate ATTRIBUTION.json           │
│ (ESRI credits, dates, stats)        │
└─────────────────────────────────────┘
```

**Key Technical Details:**
- Waits for Leaflet's `load` event before screenshot (ensures all tiles loaded)
- 15-second timeout fallback per screenshot
- 500ms delay between before/after captures
- Disables CORS for tile loading

### 2. Update Script (`update-mock-sites.js`)

```
┌─────────────────────────────────────┐
│ Scan public/images/sites/           │
│ (Find all {id}-before/after.jpg)    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Load ATTRIBUTION.json               │
│ (Get ESRI credits, dates)           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Read mockSites.ts                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ For each site with images:          │
│  1. Find site block by id           │
│  2. Replace commented // images: {} │
│  3. Insert actual image URLs        │
│  4. Add ESRI attribution            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Write updated mockSites.ts          │
└─────────────────────────────────────┘
```

## ESRI Attribution & Licensing

**License:** Fair Use - Educational
**Required Credit:** "Esri, Maxar, Earthstar Geographics, and the GIS User Community"
**Source:** https://www.arcgis.com/home/item.html?id=08b4d8a8c0c44c559e021deae91f3a85

**Usage Restrictions:**
- ✅ Educational/non-profit use (Heritage Tracker qualifies)
- ❌ Commercial use without license
- ✅ Must attribute in `ImageWithAttribution.credit`

## Troubleshooting

### "Failed to capture" errors

**Possible causes:**
- Wayback tiles unavailable for specific location
- Network timeout (increase timeout in `map-template.html`)
- CORS issues (check `--disable-web-security` flag)

**Solution:** Re-run script - it will skip already-captured images.

### "Could not find site" in update script

**Possible causes:**
- Site ID mismatch between images and `mockSites.ts`
- Regex pattern not matching site structure

**Solution:** Check that image filename matches site `id` field.

### Images not appearing in app

**Possible causes:**
- `mockSites.ts` not updated correctly
- Image paths incorrect (must start with `/images/sites/`)
- Vite dev server needs restart

**Solution:**
```bash
# Restart dev server
npm run dev
```

## Performance

**Expected Runtime:**
- Capture: ~10-15 minutes for 70 sites (2 screenshots × 70 sites)
- Update: <5 seconds

**Bottlenecks:**
- Tile loading from ESRI servers
- Browser rendering time
- File I/O

**Optimizations:**
- Reuses single browser instance (faster than launching 140 times)
- Skips already-captured images if re-run
- JPEG compression (90% quality, ~200-400KB per image)

## Future Enhancements

**Potential improvements:**
- [ ] Parallel browser instances (3-5x faster)
- [ ] Configurable zoom levels per site
- [ ] Retry logic for failed captures
- [ ] Progress bar during capture
- [ ] Wayback date selection (currently hardcoded to oldest/newest)
- [ ] Comparison view in Help Modal with example images

## Testing

Before running on all 70 sites, test on a few:

1. **Edit `capture-sites.js`:**
   ```javascript
   // Line ~185: Limit to first 3 sites
   for (let i = 0; i < Math.min(3, sites.length); i++) {
   ```

2. **Run test capture:**
   ```bash
   npm run images:capture
   ```

3. **Verify images:**
   ```bash
   ls public/images/sites/
   ```

4. **Run full capture:**
   ```bash
   # Remove the Math.min() limit
   npm run images:generate
   ```

## Maintenance

**When to re-run:**
- New sites added to `mockSites.ts`
- Newer Wayback releases available (updates happen quarterly)
- Image quality improvements needed

**How to update for new sites only:**
- Script automatically skips existing images
- Just run: `npm run images:generate`

---

**Questions?** Check [CLAUDE.md](../../CLAUDE.md) or create a GitHub issue.
