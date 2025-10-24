# CLAUDE.md - Heritage Tracker

## 🚀 Quick Start

**Status:** LIVE - https://yupitsleen.github.io/HeritageTracker/
**Current:** 45 sites | 1413 tests | React 19 + TypeScript + Vite 7 + Tailwind v4 + Leaflet + D3.js
**Branch:** feat/backendPrepContd (i18n complete - 22 registries) | main (production)

### Essential Commands

```bash
npm run dev     # localhost:5173 (ASSUME RUNNING)
npm test        # 1413 tests - MUST pass before commit
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

### Main Page (Home) - Desktop Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header (black bg, right: Lang | Help | Stats | About) Language selector!   │
│ 🔺 Red Triangle Background (Palestinian flag theme)                         │
├──────────┬─────────────────────────────────────────────────────────────────┤
│ Table    │ FilterBar (black border, search + color key)                    │
│ (left,   ├────────────────────────┬─────────────────────────────────────────┤
│ resiz-   │ HeritageMap           │ SiteDetailView                          │
│ able,    │ (center, street/sat   │ (right, satellite only,                 │
│ semi-    │ toggle, dots, glow)   │ historical imagery toggle)              │
│ trans-   │ (semi-transparent)    │ (fully opaque)                          │
│ parent)  ├────────────────────────┴─────────────────────────────────────────┤
│          │ TimelineScrubber (D3.js, play/pause/scrub)                      │
│          │ (semi-transparent, black border)                                 │
└──────────┴─────────────────────────────────────────────────────────────────┘
All components have shadow-xl for dramatic depth effect
```

### Advanced Animation Page - Desktop Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header (black bg, centered: "← Back | Advanced Satellite Timeline | Info") │
├─────────────────────────────────────────────────────────────────────────────┤
│ Info Panel: 150+ Releases | 2014-2025 | [✓] Show site markers             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                      WaybackMap (Satellite Only)                            │
│                      150+ ESRI Wayback imagery versions                     │
│                      Site markers (click to highlight timeline)             │
│                      (fully opaque, no glow)                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Timeline Slider (HTML range input, semi-transparent)                        │
│ ├─ Year markers (2014-2025) with labels                                    │
│ ├─ Gray lines (150+ Wayback releases: major/minor)                         │
│ ├─ Red dots (destruction events, stacked vertically)                       │
│ ├─ Green scrubber with always-visible tooltip (current date)               │
│ └─ Controls: [Reset] [⏮ Previous] [▶ Play/Pause] [Next ⏭]                 │
│    Color Key: Gray lines = Satellite dates | Red dots = Site destruction   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```text
Main Page: FilterBar → Accordion Table (no map/timeline)
Advanced Animation Page: Not yet optimized for mobile
```

### Key Files

```text
src/
├── pages/
│   ├── HomePage.tsx                  # Main heritage tracker view
│   └── AdvancedAnimation.tsx         # Wayback satellite timeline
├── components/
│   ├── AdvancedTimeline/
│   │   ├── WaybackMap.tsx            # Wayback satellite map (150+ versions)
│   │   ├── WaybackSlider.tsx         # Timeline slider with markers
│   │   └── NavigationControls.tsx    # Play/Pause/Previous/Next/Reset
│   ├── Map/
│   │   ├── HeritageMap.tsx           # Main map (Leaflet + glow)
│   │   ├── SiteDetailView.tsx        # Satellite detail view
│   │   ├── TimeToggle.tsx            # Historical imagery (2014/2023/Current)
│   │   ├── MapGlowLayer.tsx          # Canvas ambient glow overlay
│   │   └── MapMarkers.tsx            # Site markers with click handlers
│   ├── Timeline/TimelineScrubber.tsx # D3 horizontal timeline
│   ├── SitesTable/
│   │   ├── SitesTableDesktop.tsx     # Desktop table (compact/expanded)
│   │   ├── SitesTableMobile.tsx      # Mobile accordion
│   │   ├── SiteTableRow.tsx          # Reusable row component
│   │   └── VirtualizedTableBody.tsx  # Virtual scrolling (prepared, disabled)
│   ├── FilterBar/FilterBar.tsx       # Deferred filter application
│   ├── Button/Button.tsx             # Reusable button component
│   ├── Layout/AppHeader.tsx          # Header with navigation + language selector
│   ├── LanguageSelector/             # NEW: Language dropdown
│   │   └── LanguageSelector.tsx      # Shows all registered locales
│   └── LazySection.tsx               # Intersection Observer wrapper
├── contexts/
│   ├── AnimationContext.tsx          # Global timeline state (main page)
│   ├── WaybackContext.tsx            # Wayback playback state
│   ├── ThemeContext.tsx              # Dark mode + system preference detection
│   └── LocaleContext.tsx             # NEW: i18n state (locale, direction, translations)
├── config/
│   └── locales.ts                    # NEW: Locale registry (22nd registry!)
├── services/
│   └── waybackService.ts             # ESRI Wayback API integration
├── constants/map.ts                  # GAZA_CENTER, HISTORICAL_IMAGERY
├── hooks/
│   ├── useMapGlow.ts                 # Glow calculations
│   ├── useThemeClasses.ts            # Dark mode utility classes
│   ├── useIntersectionObserver.ts    # Progressive loading
│   ├── useFilterState.ts             # Filter state management
│   ├── useModalState.ts              # Modal state management
│   └── useSiteSelection.ts           # Site selection state
├── utils/
│   ├── heritageCalculations.ts       # Site value/glow formulas
│   ├── siteFilters.ts                # Filter logic + BCE parsing
│   └── imageryPeriods.ts             # Dynamic imagery period calculation
├── types/
│   └── filters.ts                    # Filter type definitions and utilities
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

### Internationalization (i18n) System

**LocaleContext** - React Context-based i18n with dynamic locale registry:

```typescript
// contexts/LocaleContext.tsx
export function LocaleProvider({ children }: LocaleProviderProps) {
  // Priority: localStorage → browser language → default (English)
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    const stored = localStorage.getItem("heritage-tracker-locale");
    if (stored === "en" || stored === "ar") return stored;

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("ar")) return "ar";

    return getDefaultLocale().code;
  });

  // Update document direction for RTL support
  useEffect(() => {
    document.documentElement.lang = localeConfig.bcp47;
    document.documentElement.dir = localeConfig.direction; // "ltr" or "rtl"
  }, [locale, localeConfig]);
}
```

**Locale Registry** - 22nd registry system with CRUD operations:

```typescript
// config/locales.ts
registerLocale({
  code: "ar",
  name: "Arabic",
  nativeName: "العربية",
  bcp47: "ar",
  direction: "rtl"
});

// Query helpers
getAllLocales();                    // Get all registered locales
getLocale("ar");                    // Get specific locale config
getLocaleName("ar", true);          // Get native name: "العربية"
getLocalesByDirection("rtl");       // Filter by direction
isRTLLocale("ar");                  // Check if RTL: true
```

**LanguageSelector Component** - Dynamic dropdown showing all locales:

```tsx
import { LanguageSelector } from "../components/LanguageSelector";

// In header
<LanguageSelector />  // Shows all registered locales automatically
```

**RTL Layout Strategy:**

- **Smart Selective RTL** - Only text content respects RTL, spatial/temporal controls stay LTR
- **Stays LTR** (with `dir="ltr"` overrides):
  - ✅ Headers (AppHeader, AdvancedAnimation)
  - ✅ Main layout (DesktopLayout - table left, maps right)
  - ✅ Timeline controls (Play/Pause/Reset - media convention)
  - ✅ Previous/Next buttons (temporal direction is universal)
  - ✅ Timeline axis (2014→2025 - left-to-right globally)
- **Respects RTL** (with `dir="rtl"`):
  - ✅ Map popup (SitePopup - full RTL with translated labels)
  - ✅ Arabic text in cells (right-aligned)
  - ✅ Future: Modal content, descriptions

**Translation Pattern:**

```tsx
import { useLocale } from "../../contexts/LocaleContext";

function MyComponent() {
  const { getLabel, localeConfig } = useLocale();
  const isRTL = localeConfig.direction === "rtl";

  return (
    <div dir={localeConfig.direction}>
      <span>{getLabel("Type:", "النوع:")}</span>
    </div>
  );
}
```

**Testing:**

- `locales.test.ts` - Locale registry CRUD (56 tests)
- `LocaleContext.test.tsx` - Provider and hooks (14 tests)
- All tests include LocaleProvider via `renderWithTheme` utility

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
- **Map Sync**: Imagery auto-switches based on timeline position when enabled
  - `getImageryPeriodForDate()` utility dynamically matches dates to periods
  - Dates <= 2023-08-31 → show period they fall in
  - Dates > 2023-08-31 → CURRENT (extensible for future periods)

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
- [ ] `npm test` - all 1379 tests pass
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
**Coverage:** 1379 tests across 52 files (432 UI + 947 registry tests)
**Test Files:**

- `Button.test.tsx` (24 tests) - Reusable button component
- `darkMode.test.tsx` (19 tests) - Component dark mode rendering
- `darkModeAutomated.test.tsx` (3 tests) - Automated validation, scans for `dark:` modifiers
- `ThemeContext.test.tsx` (6 tests) - System preference detection
- `SitesTable.test.tsx` (24 tests) - Table variants and CSV export
- `SiteDetailView.test.tsx` (13 tests) - Historical imagery tests
- `TimeToggle.test.tsx` (7 tests) - ARIA labels, period switching
- `TimelineScrubber.test.tsx` (12 tests)
- `AnimationContext.test.tsx` (16 tests) - **Updated**: Added 6 Map Sync tests
- `heritageCalculations.test.ts` (42 tests)
- `useMapGlow.test.ts` (24 tests)
- `MapGlowLayer.test.tsx` (7 tests)
- `performance.test.tsx` (18 tests) - Performance regression tests (25/50/100/1000 sites)
- `validateSites.test.ts` (20 tests) - Data integrity
- `filters.test.ts` (22 tests) - Filter state utilities
- `imageryPeriods.test.ts` (9 tests) - **New**: Dynamic period calculation tests
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
  - Manual click disables sync temporarily (until reset)
- **Map Sync Feature:** Syncs satellite imagery with timeline playback
  - Toggle button in TimelineScrubber (default: OFF)
  - When enabled: imagery switches based on timeline date
  - Dynamic period matching using `getImageryPeriodForDate()` utility
  - 1-second pause at start (shows 2014 baseline before playing)
  - User override: TimeToggle click disables sync for current session
  - Reset re-enables sync if toggle still ON

### Timeline Scrubber (Paused)

- **Status:** ✅ Implemented, ⏸️ Hidden in production
- D3.js horizontal timeline
- Play/Pause/Reset/Sync Map controls
- Speed: 0.5x, 1x, 2x, 4x
- Keyboard: Space (play/pause), Arrows (step), Home/End (jump)
- Filters map by currentTimestamp
- **Sync Map toggle:** Syncs SiteDetailView imagery with timeline position

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

- **Algorithmic Optimizations**:
  - **MapMarkers**: O(n²) → O(n) with memoized destroyed sites Set
  - **React.memo**: HeritageMap and MapMarkers prevent unnecessary re-renders
  - **D3 granular imports**: Reduced bundle by tree-shaking unused D3 modules
  - **useCallback**: Stable filter handler references in DesktopLayout

- **Code Splitting**:
  - React vendor: 11.79 KiB (4.21 KiB gzipped)
  - Map vendor (Leaflet): 161.05 KiB (47.31 KiB gzipped)
  - D3 vendor (Timeline): 61.46 KiB (20.59 KiB gzipped) - optimized with granular imports
  - Main bundle: 309.73 KiB (89.05 KiB gzipped)
  - Total precached: 668.64 KiB (28 files)

- **Lazy Loading**:
  - Map, Timeline, Modal components
  - About modal: 9 lazy-loaded sections (progressive loading)
  - StatsDashboard: Conditional rendering (60% fewer DOM nodes on mobile)

- **Progressive Loading**:
  - Intersection Observer for off-screen content (LazySection component)
  - ~200 fewer initial DOM nodes for large sections

- **Service Worker**: PWA with offline support, 30-day tile cache

- **Virtual Scrolling (Prepared)**:
  - Infrastructure ready with `VirtualizedTableBody` component
  - Threshold: 50 sites (current: 45)
  - **Status**: Disabled due to react-window TypeScript import issue
  - **Issue**: Library exports `List`, type definitions expect `FixedSizeList`
  - **Fallback**: Regular rendering (acceptable for <50 sites)
  - **TODO**: Resolve when site count exceeds 50 (switch to react-virtualized or fix imports)

**Production Build Performance:**
- Build time: 13.25s (27.6% improvement from 18.30s)
- Initial load: <3s on 3G
- Map rendering: 67-195ms for 100 sites (O(n) optimization)
- Table rendering: 1826-2117ms for 1000 sites
- Filter performance: 0.3-4.4ms for 1000 sites (linear time)
- Stress test: 1000+ sites validated for future scaling

**Patterns:**

```tsx
// Lazy loading
const HeritageMap = lazy(() => import("./components/Map/HeritageMap"));

// Memoization
const sortedSites = useMemo(() => [...sites].sort(), [sites, sortKey]);

// Progressive loading with Intersection Observer
<LazySection fallbackHeight="h-96">
  <ExpensiveComponent />
</LazySection>

// Conditional rendering (mobile optimization)
const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
{isDesktop && <DesktopOnlyContent />}

// Cleanup
useEffect(() => {
  const frameId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(frameId);
}, [deps]);
```

---

## 🔧 Extensibility Architecture

**Status:** 22 of 27 issues complete (81.5%) | Sprint 4 complete
**Documentation:** [docs/extensibility-status.md](docs/extensibility-status.md)

### Registry Pattern

All configuration uses a centralized **registry pattern** for extensibility:

```typescript
// Consistent API across all 22 registry systems
export const registry = {
  register(config: ConfigType): void,
  getAll(): ConfigType[],
  get(id: string): ConfigType | undefined,
  update(id: string, updates: Partial<ConfigType>): void,
  remove(id: string): boolean,
  getLabel(id: string, locale?: 'en' | 'ar'): string,
  // ... plus category-specific helpers
};
```

### 22 Complete Registry Systems

**Data & Backend (5/5 - 100% complete):**
- Site Type Registry (`src/config/siteTypes.ts`) - 54 tests
- Site Status Registry (`src/config/siteStatuses.ts`) - 53 tests
- Heritage Value Registry (`src/config/heritageValues.ts`) - 42 tests
- Destruction Cause Registry (`src/config/destructionCauses.ts`) - 42 tests
- Data Source Registry (`src/config/dataSources.ts`) - 44 tests

**Map & Visualization (8/8 - 100% complete):**
- Color Theme Registry (`src/config/colorThemes.ts`) - 50 tests
- Glow Formula Registry (`src/config/glowFormulas.ts`) - 41 tests
- Marker Icon CDN Registry (`src/config/markerIcons.ts`) - 38 tests
- Marker Size (Responsive) Registry (`src/config/markerSizes.ts`) - 44 tests
- Map Viewport Registry (`src/config/mapViewports.ts`) - 43 tests
- Map Tile Layer Registry (`src/config/mapTileLayers.ts`) - 42 tests
- Clustering Algo Registry (`src/config/clusteringAlgos.ts`) - 37 tests
- Filter Preset Registry (`src/config/filterPresets.ts`) - 38 tests

**Timeline & Animation (4/4 - 100% complete):**
- Imagery Period Registry (`src/config/imageryPeriods.ts`) - 46 tests
- Wayback Timeline Config Registry (`src/config/waybackTimeline.ts`) - 41 tests
- Timeline Date Range Registry (`src/config/timelineDates.ts`) - 41 tests
- Frame Rate Registry (`src/config/frameRates.ts`) - 45 tests

**UI & Polish (5/5 - 100% complete):**
- Sort Config Registry (`src/config/sortConfigs.ts`) - 54 tests
- Export Format Registry (`src/config/exportFormats.ts`) - 46 tests
- Table Variant Registry (`src/config/tableVariants.ts`) - 49 tests
- Component Class Registry (`src/config/componentClasses.ts`) - 47 tests
- Calendar Type Registry (`src/config/calendarTypes.ts`) - 40 tests

**Total Tests Added:** 947 registry tests (average 43 tests per registry)

### Backward Compatibility

All registries export constants for existing code:

```typescript
// Example: src/config/siteTypes.ts
export const SITE_TYPES = ["mosque", "church", "archaeological", ...];
export const SITE_TYPE_CONFIG = getAllSiteTypes(); // Full configs

// Existing code continues to work:
import { SITE_TYPES } from "../config/siteTypes";
```

### Key Benefits

- **Zero-downtime changes** - Register new configs without code deployment
- **Multi-tenant ready** - Different clients can use different configs
- **Type-safe** - Full TypeScript interfaces throughout
- **i18n support** - English + Arabic labels in all registries
- **Comprehensive testing** - 25-54 tests per registry (100% coverage)
- **Consistent API** - Same CRUD operations across all 22+ systems

### What's Left (5 issues)

**i18n Architecture (1 major issue):**
- Issue #3: Translation service (requires architectural decisions)

**Phase 3+ Work (4 issues):**
- Issue #4, #9, #22, #25: Animation/glow/metrics (deferred to future phases)

**See:** [docs/extensibility-status.md](docs/extensibility-status.md) for complete status

---

## 📝 Recent Updates (Oct 2025)

**Completed (feat/backendPrepContd - Current Branch):**

- [x] **i18n Architecture Complete (Issue #3)** ✅ (Oct 24)
  - **Purpose**: Full internationalization infrastructure with dynamic locale registry
  - **Components**:
    - Locale Registry (22nd registry!) with CRUD operations (56 tests)
    - LocaleContext with localStorage + browser detection
    - LanguageSelector dropdown component (dynamic, extensible)
    - RTL layout support with smart selective overrides
    - Arabic translations for map popup labels
  - **RTL Strategy**: Selective `dir="ltr"` on temporal/spatial controls, `dir="rtl"` on text content
  - **Testing**: +34 new tests (1379 → 1413 total, 70 i18n tests)
  - **Key commits**: 921f5ab, 2128ad3, b2ba124, 26e1546
  - **Key files**: LanguageSelector.tsx, LocaleContext.tsx, locales.ts, SitePopup.tsx
  - **Benefits**: Adding new languages requires zero code changes (just registry)

**Completed (feat/sprint2-extensibility - Merged):**

- [x] **Sprint 4: Remaining Small Issues** ✅ (Oct 24)
  - **Purpose**: Complete 6 remaining quick-win extensibility issues
  - **Issues Complete**: #15, #18, #23, #24, #26, #27
  - **Testing**: +264 new registry tests (1115 → 1379 total)
  - **Registries Added**:
    - Timeline Date Range Registry (41 tests)
    - Marker Icon CDN Registry (38 tests)
    - Marker Responsive Size Registry (44 tests)
    - Table Variant Registry (49 tests)
    - Frame Rate Registry (45 tests)
    - Component Class Registry (47 tests)
  - **Progress**: 16/27 → 22/27 issues (59.3% → 81.5%)
  - **Key commits**: c2401ce, 6fa7ab1, faf74b0, 8dc5e2c, f46b27a, 880e93a
  - **Key files**: 18 new files (6 types + 6 configs + 6 test files)

- [x] **Sprint 3: Map/Timeline/UI Registries** ✅ (Oct 24)
  - **Issues Complete**: #7, #11, #13, #17, #19, #20
  - **Registries**: Imagery Period, Wayback Timeline, Color Theme, Glow Formula, Map Viewport, Map Tile Layer
  - **Testing**: +267 tests
  - **Key commits**: Multiple (see extensibility-status.md)

- [x] **Sprint 2: Core Extensibility** ✅ (Oct 24)
  - **Issues Complete**: #8, #10, #12, #14, #16, #21
  - **Registries**: Destruction Cause, Data Source, Clustering, Filter Preset, Sort Config, Export Format
  - **Testing**: +252 tests
  - **Key commits**: Multiple (see extensibility-status.md)

- [x] **Sprint 1: Foundation Registries** ✅ (Oct 24)
  - **Issues Complete**: #1, #2, #5, #6, #9
  - **Registries**: Site Type, Site Status, Heritage Value, Calendar Type
  - **Testing**: +164 tests
  - **Key commits**: Multiple (see extensibility-status.md)

**Completed (feat/advancedMapFixes - Merged):**

- [x] **Advanced Timeline Page Enhancements** ✅ (Oct 22)
  - **Previous/Next Navigation**: Added buttons to navigate through timeline destruction events
    - Positioned in center, replacing "Current: <date>" display in advanced mode
    - Navigate through chronologically ordered destruction events
    - Highlight site when clicking Previous/Next
  - **Leaflet Popup on Map**: Click site markers to show popup with site details
    - Same popup functionality as home page
    - "View More" button opens detailed modal
    - Integrated with SiteDetailPanel for full site information
  - **Sync Map Removed from Home**: Simplified home page by removing "Sync map version" button
    - Feature only available on Advanced Timeline page (better implementation)
    - Reduces UI clutter on home page
  - **Testing**: Added 16 new tests (432 total, up from 416)
    - TimelineScrubber: 6 tests for Previous/Next navigation
    - SiteDetailView: 5 tests for popup functionality
    - AdvancedAnimation: 4 tests for modal integration
    - Sync Map: 1 test to verify button only shows in advanced mode
  - **Key commits**: Multiple commits for feature additions
  - **Key files**: TimelineScrubber.tsx, SiteDetailView.tsx, AdvancedAnimation.tsx

- [x] **Code Quality Improvements** ✅ (Oct 22)
  - **Purpose**: Comprehensive code review and quality enhancements
  - **High Priority Fixes**:
    - Removed unused `syncMapEnabled` variables from TimelineScrubber
    - Added error handling with guard clauses to `findNearestWaybackRelease`
    - Extracted magic numbers to [src/constants/timeline.ts](src/constants/timeline.ts)
      - TIMELINE_CONFIG (margin, height, min-height)
      - TOOLTIP_CONFIG (positioning values)
      - SITE_MARKER_CONFIG (icon dimensions)
    - Refactored complex `timelineData` useMemo into testable utility functions
      - Created [src/utils/timelineCalculations.ts](src/utils/timelineCalculations.ts)
      - 3 functions: `calculateDefaultDateRange`, `filterEventsByDateRange`, `calculateAdjustedDateRange`
  - **Medium Priority Fixes**:
    - Added explicit TypeScript callback types
      - `DateChangeHandler`, `SiteHighlightHandler`, `ToggleHandler`, `IndexChangeHandler`
      - `AdvancedTimelineMode` interface
    - Added JSDoc documentation to all public functions
  - **Low Priority Fixes**:
    - Removed debug console.log from production code
    - Wrapped inline event handlers in useCallback (`handleBackClick`, `handleRetryClick`)
  - **Testing**: All 432 tests passing, lint clean
  - **Key commits**: c90412c (constants/utils), 1bfdba6 (types/JSDoc), bc1577d (console.log), 5438067 (useCallback)
  - **Benefits**: Better maintainability, type safety, error handling, and performance

**Completed (feat/mapAnimationImprovements - Merged):**

- [x] **Modal Content Reduction** ✅ (Oct 22)
  - **Purpose**: Reduce information overload across Help Palestine, Statistics, and About modals
  - **DonateModal**: Reduced from 6 to 4 organizations, condensed descriptions (50% reduction)
  - **StatsDashboard**: Removed ~350 lines of verbose deep-dive sections
    - Removed: "Looted Artifacts", "Lost Forever: Unsolved Mysteries", "What Remains: Still at Risk", "Comparison Context"
    - Kept: Core metrics, Legal Framework, Notable Losses (2 examples)
  - **About Modal Sections**: Compressed all 7 sections (50-70% text reduction)
    - MissionSection, MethodologySection, LegalFrameworkSection, DataSourcesSection
    - ResearchSection, ContributingSection, AcknowledgmentsSection
  - **Design System**: Applied ultra-compact styling (text-[10px], p-2/p-3, mb-2/mb-3)
  - **Bundle Impact**: Modal chunks now 0.66-6.70 KiB (significantly reduced)
  - **Testing**: 329 tests passing (up from 328)
  - **Production Build**: 698.06 KiB total precached, 17.94s build time
  - **Key commits**: 26353ca (compact design), 4a3089c (content reduction), 703f48d (import fix)

- [x] **Advanced Animation Header Centering** ✅ (Oct 22)
  - **Centered header layout**: Title centered with back button (left) and version count (right)
  - **Implementation**: Absolute positioning with relative parent container
  - **Key file**: AdvancedAnimation.tsx

**Completed (feat/UI-improvements - Merged):**

- [x] **Advanced Animation Page** ✅ (Oct 21)
  - **Wayback satellite timeline**: 150+ ESRI Wayback imagery versions (2014-2025)
  - **WaybackMap component**: Full-screen satellite map with historical imagery
  - **WaybackSlider**: HTML range input timeline with year markers and release indicators
  - **NavigationControls**: Play/Pause/Previous/Next/Reset buttons
  - **Year-based playback**: Advances through year markers (12 jumps, 2-second intervals)
  - **Timeline markers**:
    - Year markers (2014-2025) with labels for scale reference
    - Gray lines for 150+ Wayback releases (major every 10th, minor for all)
    - Red dots for site destruction events (stacked vertically)
    - Always-visible green scrubber tooltip showing current date
  - **Interactive features**:
    - Click site markers on map → timeline dots turn black and scale 1.5x
    - Hover over any marker for tooltip details
    - Color key legend explaining marker types
  - **Testing**: Added 11 new tests (329 total, up from 317)
    - waybackService.test.ts (11 tests) - API integration
    - navigation.test.tsx (9 tests) - Route rendering
  - **Performance**: Year-based playback avoids 150+ map renders
  - **Key files**: AdvancedAnimation.tsx, WaybackMap.tsx, WaybackSlider.tsx, NavigationControls.tsx, WaybackContext.tsx, waybackService.ts
  - **PR**: #26 - Merged to main

**Completed (feat/mapSync - Merged):**

- [x] **Map Sync Feature** ✅ (Oct 20)
  - **Timeline-synced satellite imagery**: Satellite map auto-switches based on timeline playback
  - **Sync Map toggle**: Button in TimelineScrubber (default: OFF)
  - **Dynamic period matching**: `getImageryPeriodForDate()` utility extensible for future periods
  - **User override**: TimeToggle manual click disables sync temporarily
  - **Reset behavior**: Timeline reset re-enables sync if toggle still ON
  - **1-second pause**: Shows 2014 baseline for 1s before playing with sync enabled
  - **Testing**: Added 15 new tests (307 total, up from 292)
    - 6 Map Sync tests in AnimationContext.test.tsx
    - 9 dynamic period calculation tests in imageryPeriods.test.ts
  - **State management**: Two-tier sync state (syncMapEnabled + syncActive)
  - All tests passing, build verified (669.24 KiB total precached)
  - **Key files**: AnimationContext.tsx, imageryPeriods.ts, TimeToggle.tsx, SiteDetailView.tsx

- [x] **Performance Regression Tests** ✅ (Oct 19)
  - **Added 9 new tests** (292 total, up from 283)
  - **MapMarkers memoization**: 100 sites render in 67-195ms (O(n) optimization verified)
  - **React.memo effectiveness**: Re-renders prevented in 4-11ms
  - **Filter performance at 1000 sites**: Type (0.7ms), Status (0.3ms), Search (2.5ms), Complex (1.3ms)
  - **Table render 1000 sites**: 1826-2275ms (virtual scrolling threshold validated)
  - **Memory efficiency**: 10 mount/unmount cycles with 100 sites (no leaks)
  - **Key commit**: 782f4e7 (comprehensive performance regression tests)

- [x] **Algorithmic Performance Optimizations** ✅ (Oct 19)
  - **MapMarkers O(n²) → O(n)**: Pre-compute destroyed sites as Set with useMemo
  - **React.memo**: HeritageMap and MapMarkers wrapped to prevent re-renders
  - **D3 granular imports**: Tree-shaking optimization (62.29 → 61.46 KiB)
  - **useCallback handlers**: Stable filter handler references in DesktopLayout
  - **Build time improvement**: 18.30s → 13.25s (27.6% faster)
  - **Code cleanup**: Removed 21+ unnecessary comments
  - **Testing**: All 283 tests passing, ThemeContext isolation fixed
  - **Key commits**: 9d25a2a (perf optimizations), 4793008 (comment cleanup), 729c79a (test fixes)

- [x] **Component Performance Optimizations** ✅ (Oct 19)
  - **StatsDashboard**: Conditional rendering (60% fewer mobile DOM nodes)
  - **About Modal**: Lazy-loaded 9 sections with React.lazy() + Suspense
  - **Progressive Loading**: Intersection Observer for off-screen content (useIntersectionObserver hook, LazySection component)
  - **Virtual Scrolling**: Infrastructure prepared (VirtualizedTableBody, SiteTableRow components)
    - Threshold: 50 sites (current: 45)
    - Currently disabled due to react-window TypeScript import issue
  - **Production Build**: Fixed TypeScript errors, verified successful build
  - **Bundle Analysis**: 668.64 KiB total (main: 309.73 KiB / 89.05 KiB gzipped)
  - **Testing**: All 283 tests passing
  - **Key commits**: 647f810 (StatsDashboard), 63623b4 (About lazy), 15cd8d7 (Intersection Observer), 88b1d93 (Virtual scroll prep), d3bb990 (Build fixes)

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

- [ ] Merge feat/mapAnimationImprovements to main (content reduction complete)
- [ ] SEO optimization (meta tags, structured data)
- [ ] Social media preview cards
- [ ] User testing and feedback collection

**Future:**

- [ ] Translate modal content (Help, Stats, About, Donate)
- [ ] Translate table headers and UI buttons
- [ ] Add more languages (French, Spanish, Hebrew, etc.)
- [ ] Advanced Animation mobile optimization
- [ ] Resume timeline animations (Phase 3+) on main page
- [ ] All 110+ UNESCO-verified sites
- [ ] Database integration (Supabase)

---

**Last Updated:** October 24, 2025
**Version:** 1.17.0-dev
**Branch:** feat/backendPrepContd (i18n complete - 22 registries - 1413 tests) | main (production)
