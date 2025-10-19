# CLAUDE.md - Heritage Tracker

## 🚀 Quick Start

**Status:** LIVE - https://yupitsleen.github.io/HeritageTracker/
**Current:** 45 sites | 283 tests | React 19 + TypeScript + Vite 7 + Tailwind v4 + Leaflet + D3.js
**Branch:** feat/mapSync (map sync + refactoring) | main (production)

### Essential Commands

```bash
npm run dev     # localhost:5173 (ASSUME RUNNING)
npm test        # 283 tests - MUST pass before commit
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
│ Header (black bg, right-aligned buttons: Help | Stats | About) │
│ 🔺 Red Triangle Background (Palestinian flag theme)             │
├──────────┬─────────────────────────────────────────────────────┤
│ Table    │ FilterBar (black border, search + color key)        │
│ (left,   ├────────────────────────┬─────────────────────────────┤
│ resiz-   │ HeritageMap           │ SiteDetailView              │
│ able,    │ (center, street/sat   │ (right, satellite only,     │
│ semi-    │ toggle, dots, glow)   │ historical imagery toggle)  │
│ trans-   │ (semi-transparent)    │ (fully opaque)              │
│ parent)  ├────────────────────────┴─────────────────────────────┤
│          │ TimelineScrubber (D3.js, play/pause/scrub)          │
│          │ (semi-transparent, black border)                     │
└──────────┴──────────────────────────────────────────────────────┘
All components have shadow-xl for dramatic depth effect
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
├── contexts/
│   ├── AnimationContext.tsx          # Global timeline state
│   └── ThemeContext.tsx              # Dark mode + system preference detection
├── hooks/
│   ├── useMapGlow.ts                 # Glow calculations
│   └── useThemeClasses.ts            # Dark mode utility classes
├── utils/
│   ├── heritageCalculations.ts       # Site value/glow formulas
│   └── siteFilters.ts                # Filter logic + BCE parsing
└── data/mockSites.ts                 # 45 sites (static JSON)
```

---

## 🎯 Critical Patterns

### Dark Mode & Theme System

**ThemeContext** - React Context-based theming with system preference detection:

```typescript
// contexts/ThemeContext.tsx
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Priority: localStorage → system preference → default (light)
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("heritage-tracker-theme");
    if (stored === "dark" || stored === "light") return stored;

    // Check system preference
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });
}
```

**IMPORTANT - DO NOT use Tailwind `dark:` modifiers:**

- ❌ `className="bg-white dark:bg-black"` - Does NOT work with context-based theming
- ✅ `className={isDark ? "bg-black" : "bg-white"}` - Use conditional expressions

**Pattern:**

```tsx
import { useTheme } from "../../contexts/ThemeContext";

function MyComponent() {
  const { isDark } = useTheme();
  return <div className={`${isDark ? "bg-[#000000]/90" : "bg-white/90"}`}>{/* Content */}</div>;
}
```

**Testing:**

- `darkMode.test.tsx` - Component dark mode rendering (19 tests)
- `darkModeAutomated.test.tsx` - Automated validation (scans codebase for `dark:` modifiers)
- `ThemeContext.test.tsx` - System preference detection (6 tests)

### Historical Satellite Imagery

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
GAZA_CENTER: [31.42, 34.38]; // Optimized centering
DEFAULT_ZOOM: 10.5; // Gaza overview
SITE_DETAIL_ZOOM: 17; // Consistent across historical imagery
```

### Data Schema

```typescript
interface GazaSite {
  id: string;
  type: "mosque" | "church" | "archaeological" | "museum" | "historic-building";
  name: string;
  nameArabic?: string;
  yearBuilt: string; // "7th century", "800 BCE", "1950"
  coordinates: [number, number]; // [lat, lng] - Leaflet format!
  status: "destroyed" | "heavily-damaged" | "damaged";
  dateDestroyed?: string; // ISO: "2023-12-07"
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
- [ ] `npm test` - all 283 tests pass
- [ ] Visual check in browser (dev server running)
- [ ] No console errors
- [ ] Mobile view renders (no AnimationProvider errors)
- [ ] Both light and dark modes render correctly

**Performance:**

- Desktop: 60fps minimum
- Mobile: 30fps acceptable
- Initial load: <3s on 3G

---

## 🧪 Testing

**Framework:** Vitest + React Testing Library
**Coverage:** 283 tests across 25 files
**Test Files:**

- `Button.test.tsx` (24 tests) - Reusable button component
- `darkMode.test.tsx` (19 tests) - Component dark mode rendering
- `darkModeAutomated.test.tsx` (3 tests) - Automated validation, scans for `dark:` modifiers
- `ThemeContext.test.tsx` (6 tests) - System preference detection
- `SitesTable.test.tsx` (24 tests) - Table variants and CSV export
- `SiteDetailView.test.tsx` (13 tests) - Historical imagery tests
- `TimeToggle.test.tsx` (7 tests) - ARIA labels, period switching
- `TimelineScrubber.test.tsx` (12 tests)
- `AnimationContext.test.tsx` (10 tests)
- `heritageCalculations.test.ts` (42 tests)
- `useMapGlow.test.ts` (24 tests)
- `MapGlowLayer.test.tsx` (7 tests)
- `performance.test.tsx` (9 tests) - 25+ sites, 50 site stress test
- `validateSites.test.ts` (20 tests) - Data integrity
- `filters.test.ts` (22 tests) - Filter state utilities
- Plus 10 more test files

**Test Setup:**

- ResizeObserver mock (TimelineScrubber)
- Canvas mock (leaflet.heat)

**Minimum:** 5+ tests per new component

---

## 🚫 Known Issues & Gotchas

### ❌ DO NOT

- Use Tailwind `dark:` modifiers (use conditional expressions with `isDark` instead)
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
  if (age > 2000) weight *= 3; // Ancient
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

**Completed (feat/mapSync - Current Branch):**

- [x] **Code Quality Refactoring** ✅ (Oct 19)
  - **SOLID/DRY/KISS Improvements**: Completed all 13 code review items
  - **Split useAppState hook**: Extracted focused hooks (useFilterState, useModalState, useSiteSelection)
  - **Reusable Button component**: Eliminated 50+ lines of duplicated styling
  - **Style consolidation**: Centralized theme-aware styles in useThemeClasses
  - **Filter utilities**: Type-safe filter state management (src/types/filters.ts)
  - **Open/Closed Principle**: Removed `as const` from components.ts, made extensible
  - **Separation of Concerns**: Extracted 11+ inline style strings to useThemeClasses
  - **Testing**: 283 tests passing (51 new tests added)
  - **Key commits**: 6ea6f2f (SOLID), 6c8cf60 (DRY/KISS), b59d045 (Open/Closed)

**Completed (feat/darkmode - Merged):**

- [x] **Dark Mode Implementation** ✅ (Oct 18)
  - **Full dark mode support**: All components support light/dark themes
  - **System preference detection**: Auto-detects OS color scheme on first visit
  - **ThemeContext**: React Context-based theming (not Tailwind `darkMode` config)
  - **Priority order**: localStorage → system preference → default (light)
  - **Theme toggle**: Header button with smooth transitions
  - **Comprehensive testing**: 28 new tests (19 + 3 + 6)
    - `darkMode.test.tsx` - Component rendering in both modes
    - `darkModeAutomated.test.tsx` - Automated `dark:` modifier detection
    - `ThemeContext.test.tsx` - System preference detection
  - All tests passing, linting clean
  - **Key files**: ThemeContext.tsx, useThemeClasses.ts, darkMode tests

**Completed (feature/UI-refinement - Merged):**

- [x] **Complete UI Refinement** ✅
  - **Design System**: Unified button styling, shadows, transitions, active states
  - **Palestinian Flag Theme**: Red triangle background with semi-transparent components (50-90% opacity)
  - **Visual Depth**: Upgraded all shadows from shadow-md to shadow-xl for dramatic floating effect
  - **Black Border System**: Consistent 2px borders on main components, 1px on search/color key
  - **Layout Optimization**: Filter bar moved to maps column, header buttons right-aligned
  - **Component Polish**: Table gradient header, modal enhancements, improved inputs
  - **Typography**: Inter font, skeleton loading states
  - **Compact Spacing**: Reduced vertical space by ~34px in filter bar and timeline

**Completed (feature/secondMapfixes-viewImprovements - Merged):**

- [x] Satellite detail view map (right side)
- [x] Historical satellite imagery toggle (2014/Aug 2023/Current)
- [x] Consistent zoom levels (zoom 17 for all periods)
- [x] Horizontal filter bar with Color Key
- [x] Icon-based Type column with tooltips
- [x] Clickable site names
- [x] Optimized Gaza map view
- [x] Ctrl+scroll zoom fix for SiteDetailView

**Next:**

- [ ] Merge feat/mapSync to main
- [ ] SEO optimization (meta tags, structured data)
- [ ] Social media preview cards

**Future:**

- [ ] Resume timeline animations (Phase 3+)
- [ ] All 110+ UNESCO-verified sites
- [ ] Database integration (Supabase)
- [ ] Full Arabic translation

---

**Last Updated:** October 19, 2025
**Version:** 1.10.0-dev
**Branch:** feat/mapSync (refactoring complete, ready for merge) | main (production)
