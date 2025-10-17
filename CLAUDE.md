# CLAUDE.md - Heritage Tracker

**⚠️ IMPORTANT:** Do not provide unprompted summaries after completing work. Only summarize when explicitly asked.

---

## 🚀 Quick Start

**Status:** LIVE - https://yupitsleen.github.io/HeritageTracker/
**Current:** 45 sites | 204 tests | React 19 + TypeScript + Vite 7 + Tailwind v4 + Leaflet + D3.js
**Branch:** feature/secondMapfixes-viewImprovements (working) | main (production)

### Essential Commands
```bash
npm run dev     # localhost:5173 (ASSUME RUNNING)
npm test        # 204 tests - MUST pass before commit
npm run lint    # MUST be clean before commit
npm run build   # Production build
```

### Git Workflow
```bash
# Before EVERY commit:
npm run lint && npm test

# Conventional commits only:
git commit -m "feat: add feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update docs"
```

---

## 📐 Architecture Overview

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ Header: FilterBar + Color Key + Site Count                      │
├──────────┬────────────────────────┬─────────────────────────────┤
│ Table    │ HeritageMap           │ SiteDetailView              │
│ (left,   │ (center, street/sat   │ (right, satellite only,     │
│ resiz-   │ toggle, dots, glow)   │ historical imagery toggle)  │
│ able)    │                        │                             │
├──────────┴────────────────────────┴─────────────────────────────┤
│ TimelineScrubber (below maps, D3.js, play/pause/scrub)         │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout
```
FilterBar → Accordion Table (no map/timeline)
```

### Key Files
```
src/
├── components/
│   ├── Map/
│   │   ├── HeritageMap.tsx          # Main map (Leaflet + glow)
│   │   ├── SiteDetailView.tsx       # Satellite detail view
│   │   ├── TimeToggle.tsx           # Historical imagery (2014/2023/Current)
│   │   └── MapGlowLayer.tsx         # Canvas ambient glow overlay
│   ├── Timeline/TimelineScrubber.tsx # D3 horizontal timeline
│   ├── SitesTable.tsx                # 3 variants: compact/expanded/mobile
│   └── FilterBar/FilterBar.tsx       # Deferred filter application
├── constants/map.ts                  # GAZA_CENTER, HISTORICAL_IMAGERY
├── contexts/AnimationContext.tsx     # Global timeline state
├── hooks/useMapGlow.ts               # Glow calculations
├── utils/
│   ├── heritageCalculations.ts       # Site value/glow formulas
│   └── siteFilters.ts                # Filter logic + BCE parsing
└── data/mockSites.ts                 # 45 sites (static JSON)
```

---

## 🎯 Critical Patterns

### Historical Satellite Imagery (NEW)
**SiteDetailView** - Right side satellite map with 3 time periods:

```typescript
// constants/map.ts - HISTORICAL_IMAGERY
BASELINE_2014: {
  date: "2014-02-20",           // Earliest ESRI Wayback
  maxZoom: 17,                  // Lower resolution
  url: "...wayback.../tile/10/{z}/{y}/{x}"
}
PRE_CONFLICT_2023: {
  date: "2023-08-31",           // Last before Oct 7, 2023
  maxZoom: 18,
  url: "...wayback.../tile/64776/{z}/{y}/{x}"
}
CURRENT: {
  date: "current",              // Latest ESRI World Imagery
  maxZoom: 19,
  url: "...arcgisonline.../tile/{z}/{y}/{x}"
}
```

**Implementation:**
- TimeToggle component (top-right, z-[1000])
- TileLayer with `key={selectedPeriod}` forces re-render
- Zoom clamped: `Math.min(SITE_DETAIL_ZOOM, periodMaxZoom)` = **17 for all periods**
- Default: PRE_CONFLICT_2023

### Map Configuration
```typescript
// constants/map.ts
GAZA_CENTER: [31.42, 34.38]   // Optimized centering
DEFAULT_ZOOM: 10.5             // Gaza overview
SITE_DETAIL_ZOOM: 17           // Consistent across historical imagery
```

### Data Schema
```typescript
interface GazaSite {
  id: string;
  type: "mosque" | "church" | "archaeological" | "museum" | "historic-building";
  name: string;
  nameArabic?: string;
  yearBuilt: string;            // "7th century", "800 BCE", "1950"
  coordinates: [number, number]; // [lat, lng] - Leaflet format!
  status: "destroyed" | "heavily-damaged" | "damaged";
  dateDestroyed?: string;        // ISO: "2023-12-07"
  // ... additional fields
}
```

### Year Parsing (`parseYearBuilt`)
- "800 BCE" → -800
- "7th century" → 650 (midpoint)
- "1950" → 1950

### State Management
- `highlightedSiteId` - Syncs Timeline ↔ Map ↔ Table
- `AnimationContext` - Global timeline playback state
- Deferred filters - Apply on button click (not on input change)

---

## ✅ Quality Gates

**BEFORE EVERY COMMIT:**
- [ ] `npm run lint` - clean
- [ ] `npm test` - all 204 tests pass
- [ ] Visual check in browser (dev server running)
- [ ] No console errors
- [ ] Mobile view renders (no AnimationProvider errors)

**Performance:**
- Desktop: 60fps minimum
- Mobile: 30fps acceptable
- Initial load: <3s on 3G

---

## 🧪 Testing

**Framework:** Vitest + React Testing Library
**Coverage:** 204 tests across 21 files
**Test Files:**
- `SiteDetailView.test.tsx` (13 tests) - includes historical imagery tests
- `TimeToggle.test.tsx` (7 tests) - ARIA labels, period switching
- `TimelineScrubber.test.tsx` (12 tests)
- `AnimationContext.test.tsx` (10 tests)
- `heritageCalculations.test.ts` (42 tests)
- `useMapGlow.test.ts` (24 tests)
- `MapGlowLayer.test.tsx` (7 tests)
- `App.mobile.test.tsx` (3 tests)
- Performance tests (25+ sites, 50 site stress test)

**Test Setup:**
- ResizeObserver mock (TimelineScrubber)
- Canvas mock (leaflet.heat)

**Minimum:** 5+ tests per new component

---

## 🚫 Known Issues & Gotchas

### ❌ DO NOT
- Use text inputs for BC/BCE dates (parsing fragile)
- Forget `z-[9999]` on dropdowns above Leaflet maps
- Use `Date.now()` for animation timing (use `performance.now()`)
- Animate non-visible markers (performance hit)
- Create animation frames without cleanup

### ✅ DO
- Number input + dropdown for BC/BCE
- Remember Leaflet uses `[lat, lng]` NOT `[lng, lat]`
- Use `useMemo` for expensive sorting/calculations
- Clean up animation frames: `return () => cancelAnimationFrame(frameId)`
- Pre-calculate glow contributions (memoize)
- Use Canvas for continuous animations (better than SVG)

### Current Limitations
- No validation that end date > start date
- Year parsing assumes CE unless BCE/BC explicit
- Timeline animation paused (hidden in production)
- Mobile view: no map or timeline (prevents errors)

---

## 🎨 Component Details

### SitesTable
**3 variants:**
- `compact` - Desktop sidebar (Name, Type, Status, Date)
- `expanded` - Modal (all fields, CSV export)
- `mobile` - Accordion (no Type column)

**Type Column:** Icon-based (🕌⛪🏛️🏰), 60px wide, tooltips
**Interaction:** Row click → highlight | Site name click → detail modal
**CSV Export:** RFC 4180 compliant, timestamped filename

### FilterBar
- Desktop: Inline search, BC/BCE dropdowns, date ranges (text-[10px])
- Mobile: Full-width search, hidden Type/Status filters
- **Deferred application** - Filters apply on button click, not on input change

### SiteDetailView & TimeToggle
- **Purpose:** Satellite-only aerial view (right side)
- **No site selected:** Gaza overview (zoom 10.5)
- **Site selected:** Zoom to site (zoom 17)
- **TimeToggle:** 3 buttons (top-right, z-[1000])
  - 2014 | Aug 2023 | Current
  - Green highlight for selected (#009639)
  - Default: Aug 2023 (PRE_CONFLICT_2023)

### Timeline Scrubber (Paused)
- **Status:** ✅ Implemented, ⏸️ Hidden in production
- D3.js horizontal timeline
- Play/Pause/Reset controls
- Speed: 0.5x, 1x, 2x, 4x
- Keyboard: Space (play/pause), Arrows (step), Home/End (jump)
- Filters map by currentTimestamp

---

## 🎭 Timeline Animation (Paused Feature)

**Status:** Phase 1-2 Complete | Phase 3+ Paused
**Spec:** `docs/timeline-animation-spec.md`

### Core Concept: "Dimming Gaza"
As sites are destroyed, map "glow" fades (gold → grey)

**Implemented:**
- ✅ TimelineScrubber (D3.js)
- ✅ AnimationContext (global state)
- ✅ MapGlowLayer (Leaflet.heat)
- ✅ useMapGlow hook (calculations)
- ✅ heritageCalculations utilities

**Paused (Future):**
- ⏸️ MarkerAnimations (explode/crack/shake)
- ⏸️ HeritageMetricsDashboard (integrity meter)
- ⏸️ Mobile timeline support

### Glow Contribution Formula
```typescript
const glowContribution = (site: GazaSite): number => {
  let weight = 100;
  const age = 2024 - (site.creationYear || 0);
  if (age > 2000) weight *= 3;      // Ancient
  else if (age > 1000) weight *= 2; // Medieval
  else if (age > 200) weight *= 1.5; // Historic

  if (site.unescoListed) weight *= 2;
  if (site.artifactCount > 100) weight *= 1.5;
  if (site.isUnique) weight *= 2;

  return weight;
};
```

---

## 🌍 Cultural & Legal

### Content Standards
- Documentation, not advocacy
- Full attribution for all claims
- Cultural sensitivity
- Educational fair use
- No personal data

### Accessibility
- WCAG AA compliance
- Bilingual (English + Arabic, RTL support)
- Mobile-first responsive
- Palestinian flag colors (#ed3039, #009639, #000000, #fefefe)
- Keyboard navigation (timeline controls)

### Legal Framework
- 1954 Hague Convention
- Rome Statute (ICC)
- UN Security Council Resolution 2347 (2017)

---

## 🚢 Deployment

**Live:** https://yupitsleen.github.io/HeritageTracker/
**CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`)
**Base URL:** `/HeritageTracker/`

Auto-test → Auto-deploy to GitHub Pages on main branch push

---

## 📈 Performance Optimizations

**Implemented:**
- Lazy loading (Map, Timeline, Modal components)
- Code splitting (react-vendor 12KB, map-vendor 161KB, d3-vendor 62KB)
- Service Worker (PWA, offline support, 30-day tile cache)
- Bundle: 287KB main (83KB gzipped), 621KB total precached

**Patterns:**
```tsx
// Lazy loading
const HeritageMap = lazy(() => import("./components/Map/HeritageMap"));

// Memoization
const sortedSites = useMemo(() => [...sites].sort(), [sites, sortKey]);

// Cleanup
useEffect(() => {
  const frameId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(frameId);
}, [deps]);
```

---

## 📝 Recent Updates (Oct 2025)

**Completed (feature/sidePics → feature/secondMapfixes-viewImprovements):**
- [x] Satellite detail view map (right side)
- [x] **Historical satellite imagery toggle** (2014/Aug 2023/Current)
- [x] Consistent zoom levels (zoom 17 for all periods)
- [x] Horizontal filter bar with Color Key
- [x] Icon-based Type column with tooltips
- [x] Clickable site names
- [x] Optimized Gaza map view
- [x] Ctrl+scroll zoom fix for SiteDetailView
- [x] All 204 tests passing

**In Progress (feature/UI-refinement):**
- [x] **Phase 1: UI Foundation Complete** ✅
  - Installed @heroicons/react and @headlessui/react
  - Created design system constants (src/styles/designSystem.ts)
  - Upgraded all buttons with shadows, transitions, active states
  - Added elevation to maps (rounded-xl shadow-lg)
  - Standardized spacing (py-6, mb-6) and border radius (rounded-lg/xl)
  - All 204 tests passing, lint clean
- [ ] **Phase 2: Component Polish** (next - see UI_REFINEMENT_PROGRESS.md)
  - Table redesign (remove red stripes, gradient header, clean hover)
  - Modal backdrop blur
  - Filter tag enhancements
  - Input focus states
- [ ] **Phase 3: Advanced Polish** (future)
  - Typography upgrade (Inter font)
  - Loading skeletons
  - Micro-interactions

**📋 For Session Continuity:**
See [docs/UI_REFINEMENT_PROGRESS.md](docs/UI_REFINEMENT_PROGRESS.md) for detailed status, next steps, and handoff instructions.

**Next:**
- [ ] Complete Phase 2 UI refinement (table, modals, filters)
- [ ] Complete Phase 3 UI refinement (typography, animations)
- [ ] SEO optimization (meta tags, structured data)
- [ ] Social media preview cards

**Future:**
- [ ] Resume timeline animations (Phase 3+)
- [ ] All 110+ UNESCO-verified sites
- [ ] Database integration (Supabase)
- [ ] Full Arabic translation

---

**Last Updated:** October 17, 2025
**Version:** 1.7.0-dev
**Branch:** feature/UI-refinement (active) | feature/secondMapfixes-viewImprovements (merged to main)
