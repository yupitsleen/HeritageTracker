# Heritage Tracker - Developer Guide

**Palestinian cultural heritage destruction tracker with interactive satellite comparison**

---

## Quick Start

```bash
npm run dev     # → http://localhost:5173 (Vite HMR)
npm test        # 720 tests must pass ✓
npm run lint    # ESLint check
npm run build   # Production build
```

**Stack:** React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS v4 + Leaflet + D3.js + Supabase

**Current:** 45 Gaza sites documented | Production-ready with comparison mode

---

## Critical Rules

### Commits (Conventional Format)

```bash
feat: add comparison mode to Timeline page
fix: resolve map sync toggle bug
refactor: extract ComparisonMapView component
perf: optimize Dashboard lazy loading
style: standardize FilterBar opacity
```

**Commit only when:**
✓ Feature working ✓ 720/720 tests pass ✓ Lint passes ✓ Dev server clean ✓ Docs updated

### Quality Gates

- **720/720 tests passing** before every commit
- Dev server stays running (HMR for instant feedback)
- Apply DRY/KISS/SOLID principles
- Check for existing components/hooks before creating new ones
- No `any` types (TypeScript strict mode)

---

## Architecture

```
src/
├── api/                          # Supabase integration
│   ├── supabaseClient.ts         # Client configuration
│   ├── sites.ts                  # CRUD operations
│   ├── mockAdapter.ts            # Development mock data (45 sites)
│   ├── queryHelpers.ts           # Filter/pagination helpers
│   ├── types.ts                  # API types
│   └── database.types.ts         # Auto-generated Supabase types
├── components/                   # 21 feature components
│   ├── AdvancedTimeline/         # WaybackSlider with dual-scrubber support
│   ├── Map/                      # HeritageMap, ComparisonMapView, SiteDetailView
│   │   ├── ComparisonMapView.tsx # Side-by-side satellite comparison (NEW)
│   │   ├── MapMarkers.tsx        # Site markers with clustering
│   │   ├── MapGlowLayer.tsx      # Animated glow effects
│   │   ├── TimeToggle.tsx        # "Show Map Markers" toggle
│   │   └── SiteDetailView.tsx    # Full-screen site details
│   ├── FilterBar/                # Redesigned filter UI with pills/badges
│   ├── Timeline/                 # TimelineScrubber, TimelineControls
│   ├── SitesTable/               # Virtual scrolling table (100+ sites)
│   ├── Layout/                   # AppHeader, DesktopLayout, MobileLayout
│   ├── Stats/                    # StatsDashboard, HeroStatistic
│   ├── Icons/                    # Reusable icon library
│   └── [Button, Modal, Badge, Error, Loading, etc.]
├── pages/                        # 6 pages
│   ├── DashboardPage.tsx         # Main overview (lazy-loaded layouts)
│   ├── Timeline.tsx              # Satellite comparison with 186 Wayback releases
│   ├── DataPage.tsx              # Sites table with export (CSV/JSON/GeoJSON)
│   ├── StatsPage.tsx             # Statistical analysis
│   ├── AboutPage.tsx             # Project information
│   └── DonatePage.tsx            # Donation information
├── hooks/                        # 23+ custom hooks
│   ├── useAppState.ts            # Centralized app state
│   ├── useFilteredSites.ts       # Filter logic with memoization
│   ├── useWaybackReleases.ts     # ESRI Wayback API integration
│   ├── useSitesPaginated.ts      # Paginated data fetching
│   ├── useSitesQuery.ts          # React Query caching (5min)
│   ├── useThemeClasses.ts        # Theme-aware styling
│   └── useDebounce.ts            # 300ms filter debouncing
├── contexts/                     # 4 contexts
│   ├── AnimationContext.tsx      # Timeline animation state
│   ├── CalendarContext.tsx       # Gregorian/Islamic calendar
│   ├── LocaleContext.tsx         # i18n (en/ar)
│   └── ThemeContext.tsx          # Theme management
├── config/                       # 30+ configuration files
│   ├── colorThemes.ts            # Palestinian flag colors
│   ├── tileLayers.ts             # Leaflet tile providers
│   ├── wayback.ts                # ESRI Wayback configuration
│   ├── filters.ts                # Filter options
│   └── animation.ts              # Timeline animation settings
├── constants/                    # Layout/UI constants
│   ├── layout.ts                 # BREAKPOINTS, Z_INDEX
│   ├── timeline.ts               # TIMELINE_CONFIG
│   ├── map.ts                    # MAP_CONFIG
│   └── statistics.ts             # STAT_CATEGORIES
├── utils/                        # Helpers & formatters
│   ├── formatters.ts             # Date/BC/BCE formatting
│   ├── exporters.ts              # CSV/JSON/GeoJSON export
│   ├── calculations.ts           # Statistics calculations
│   └── validators.ts             # Data validation
├── services/
│   └── waybackService.ts         # ESRI Wayback API client
├── types/                        # TypeScript definitions
│   ├── index.ts                  # Core types (GazaSite, FilterState)
│   ├── filters.ts                # Filter types
│   ├── wayback.ts                # Wayback release types
│   └── [30+ type files]
└── data/
    └── mockSites.ts              # 45 documented sites (1650 lines)
```

### State Management

```typescript
// Centralized state (no Redux/Context for core state)
const {
  filters,
  setFilters,
  selectedSiteId,
  setSelectedSiteId,
  modals,
  openModal,
  closeModal,
} = useAppState();

// Filtered sites with memoization
const filteredSites = useFilteredSites(sites, filters);

// Paginated data fetching (100+ sites)
const { sites, pagination, goToPage } = useSitesPaginated(filters, page, 50);

// React Query caching (production recommended)
const { data, isLoading } = useSitesQuery({
  types: filters.types,
  page,
  pageSize: 50,
});
```

### Backend Pattern

```typescript
// .env.development: VITE_USE_MOCK_API=true
// .env.production: VITE_USE_MOCK_API=false

export async function getAllSites(): Promise<GazaSite[]> {
  if (shouldUseMockData()) return mockGetAllSites();
  return supabase.from("sites").select("*");
}
```

---

## Data Schema

```typescript
interface GazaSite {
  id: string;
  name: string;
  nameArabic?: string; // RTL Arabic support
  type: string; // mosque | church | archaeological_site | museum | library | monument
  yearBuilt: string; // "1277" or "BCE 800"
  yearBuiltIslamic?: string; // "676 AH"
  coordinates: [number, number]; // [lat, lng]
  status: string; // destroyed | severely_damaged | partially_damaged | looted | threatened
  dateDestroyed?: string; // ISO or "BCE YYYY"
  dateDestroyedIslamic?: string;
  lastUpdated: string;
  description: string;
  historicalSignificance: string;
  culturalValue: string;
  verifiedBy: string[]; // UNESCO, Forensic Architecture, etc.
  sources: Source[];
  images?: {
    before?: string;
    after?: string;
    satellite?: string;
  };
  // Enhancement fields
  unescoListed?: boolean;
  artifactCount?: number;
  isUnique?: boolean;
  religiousSignificance?: boolean;
  communityGatheringPlace?: boolean;
  historicalEvents?: string[];
}

interface Source {
  title: string;
  url: string;
  date?: string;
  organization?: string;
}
```

**BC/BCE dates:** "BCE 800" (no month/day) | Filtering: 100 BCE < 50 BCE < 1 CE < 2024 CE

---

## Key Features

### 1. Comparison Mode (Timeline Page)

Side-by-side satellite map viewing with dual scrubbers:

```typescript
// Yellow scrubber: "before" date (auto-set to destruction date)
// Green scrubber: "after" date (auto-set to 30 days later)
<ComparisonMapView
  site={selectedSite}
  beforeDate={beforeDate}
  afterDate={afterDate}
  showMarkers={showMarkers}
  zoom={zoom}
/>
```

**Features:**
- 186 ESRI Wayback releases (2014-2025)
- Auto-sync with destruction dates
- Date labels on each map (1.5x tooltip size, 70% opacity)
- Individual borders and gap-2 spacing
- Adaptive zoom toggle
- "Show Map Markers" toggle for satellite views

### 2. Interactive Timeline

D3.js-powered timeline with animated scrubber:

```typescript
<TimelineScrubber
  sites={filteredSites}
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  showYearMarkers={true}
/>
```

**Features:**
- BC/BCE support with correct chronological ordering
- Year markers every 100/500/1000 years
- Glow effects on hover
- Smooth animations (300ms transitions)

### 3. Dynamic FilterBar

Compact, data-dense filter UI:

```typescript
<FilterBar
  filters={filters}
  onFilterChange={setFilters}
  activeCount={activeFilters.length}
  onClearAll={clearAllFilters}
/>
```

**Features:**
- Multi-select dropdowns for types/statuses
- Active filter pills with remove buttons
- Date range picker (BC/BCE support)
- 300ms debouncing for performance
- Mobile drawer for small screens
- Standardized 70% opacity across all pages

### 4. Virtual Scrolling Table

High-performance table for 100+ sites:

```typescript
<SitesTable
  sites={filteredSites}
  sortBy={sortBy}
  sortOrder={sortOrder}
  onSort={handleSort}
  onExport={handleExport}
/>
```

**Features:**
- TanStack Virtual for 60 FPS scrolling
- Resizable columns
- Export to CSV/JSON/GeoJSON
- Progressive column display (mobile → tablet → desktop)
- Row highlighting on hover

### 5. Map Clustering & Glow

Leaflet map with performance optimizations:

```typescript
<HeritageMap
  sites={filteredSites}
  selectedSiteId={selectedSiteId}
  onSiteSelect={setSelectedSiteId}
  cluster={filteredSites.length > 50}
/>
```

**Features:**
- Palestinian flag colored clusters
- Animated glow layer (canvas-based)
- Heat map mode
- Satellite/street view toggle
- Full-screen mode
- Popup with site details

---

## Performance & Scaling

| Sites | Optimization                                      |
| ----- | ------------------------------------------------- |
| <50   | Standard rendering                                |
| 50+   | Map clustering + debouncing                       |
| 100+  | Virtual scrolling + pagination + React Query      |
| 1000+ | Lazy loading + code splitting + service worker    |

**Metrics:**
- 60 FPS scrolling (TanStack Virtual)
- <2s initial page load (lazy layouts)
- <500ms filter changes (300ms debounce)
- 5min React Query cache

**Build Optimizations:**
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom', 'react-router-dom'],
        'leaflet': ['leaflet', 'react-leaflet'],
        'd3': ['d3', 'd3-scale'],
      }
    }
  }
}
```

---

## Development Standards

### Code Style

- TypeScript strict mode (no `any`, explicit return types)
- Functional components + hooks only (no class components)
- Named exports preferred (easier to grep)
- JSDoc for complex logic
- Prettier + ESLint for consistency

### Component Rules

1. **Extract at 3+ uses** (DRY principle)
2. **Keep under 200 lines** (split into subcomponents)
3. **Accessibility first:**
   - ARIA labels on interactive elements
   - Keyboard navigation (Tab, Enter, Escape)
   - Focus management (modals, dropdowns)
   - 4.5:1 contrast ratio (WCAG 2.1 AA)
4. **Check existing code:**
   - Search `src/components/` before creating new components
   - Search `src/hooks/` before creating new hooks
   - Reuse utilities from `src/utils/`

### File Organization

```typescript
// Component structure
ComponentName/
├── index.tsx              // Main component
├── ComponentName.test.tsx // Tests (53 test files total)
├── types.ts               // Component-specific types
└── utils.ts               // Component-specific helpers

// Hook structure
hooks/
├── useFeatureName.ts      // Hook implementation
└── useFeatureName.test.tsx // Hook tests
```

### Cultural Sensitivity

- **Bilingual:** English primary, Arabic (RTL) secondary
- **Palestinian names:** Use original Arabic when available
- **Evidence-based only:** UNESCO, Forensic Architecture, Heritage for Peace
- **Factual language:** "destruction" not "damage," avoid bias
- **Attribution:** All sources linked and dated

---

## Testing Strategy

### Current Coverage

- **720 tests passing** across 53 test files
- **Component tests:** Smoke tests, interaction tests, edge cases
- **Hook tests:** State management, side effects, cleanup
- **Integration tests:** Page rendering, routing, data flow
- **Mock service worker:** API mocking with MSW 2.11.6

### Test Structure

```typescript
// Component test example
describe("ComparisonMapView", () => {
  describe("Smoke Tests", () => {
    it("renders without crashing", () => {
      render(<ComparisonMapView {...defaultProps} />);
    });
  });

  describe("Interaction Tests", () => {
    it("syncs maps on zoom change", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: /zoom in/i }));
      expect(leftMap.getZoom()).toBe(rightMap.getZoom());
    });
  });

  describe("Edge Cases", () => {
    it("handles missing destruction date gracefully", () => {
      const siteWithoutDate = { ...mockSite, dateDestroyed: undefined };
      render(<ComparisonMapView site={siteWithoutDate} />);
      expect(screen.getByText(/no destruction date/i)).toBeInTheDocument();
    });
  });
});
```

### Running Tests

```bash
npm test              # Watch mode
npm test -- --run     # Single run (for CI)
npm run test:ui       # Vitest UI
```

---

## Recent Improvements (Nov 2025)

**Phase 6 Complete: Timeline Navigation Enhancements**

### Latest Changes (Nov 2025)

1. **Timeline Navigation Improvements:**
   - Fixed NEXT button to work from any scrubber position (no longer requires exact timestamp match)
   - Timeline now starts 7 days before first destruction date (enables first site to be clickable)
   - Added Next/Previous navigation buttons to Dashboard timeline (consistent UX across pages)
   - Proper edge case handling: before first event, after last event, in between events
   - RESET button correctly returns to timeline start (7 days before first event)

**Phase 5 Complete: Comparison Mode & Timeline Enhancements**

### Key Changes

1. **Comparison Mode (Timeline Page):**
   - Side-by-side satellite map viewing
   - Dual scrubbers (yellow "before", green "after")
   - Auto-sync with destruction dates
   - Date labels on both maps (1.5x size, 70% opacity)
   - Individual borders with gap-2 spacing

2. **Dashboard Optimizations:**
   - Lazy-loaded DesktopLayout and MobileLayout (parallel chunks)
   - Palestinian flag background triangle
   - Suspense boundaries for progressive loading

3. **FilterBar Standardization:**
   - 70% opacity across all pages (Dashboard, Timeline, Data)
   - Compact design for more data visibility
   - Active filter count badge

4. **Map Enhancements:**
   - "Show Map Markers" toggle for satellite views
   - Adaptive zoom toggle
   - Improved clustering with Palestinian flag colors

5. **Build Performance:**
   - Manual chunk splitting (vendor, leaflet, d3)
   - PWA support with service worker
   - Optimized bundle size

### Architectural Improvements

- **Focused Hooks:** Decomposed `useAppState` into smaller hooks
- **Config Centralization:** 30+ config files for zero-downtime changes
- **Theme System:** `useThemeClasses` for consistent theming
- **Type Safety:** 30+ type definition files, zero `any` types
- **Test Coverage:** 720 tests (+150 from initial MVP)

---

## Environment Configuration

### Development (.env.development)

```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK_API=true
```

### Production (.env.production)

```env
VITE_API_URL=https://api.heritagetracker.org
VITE_USE_MOCK_API=false
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Deployment

### Build & Deploy

```bash
npm run build         # Creates dist/ folder
npm run preview       # Preview production build locally
```

### Supabase Setup

1. Create project at supabase.com
2. Run SQL migration (see `supabase/migrations/`)
3. Enable PostGIS extension
4. Add RLS policies
5. Update environment variables

### Vercel/Netlify

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18+
- Environment variables: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

---

## Common Tasks

### Adding a New Site

```typescript
// 1. Add to src/data/mockSites.ts
const newSite: GazaSite = {
  id: "site-46",
  name: "Site Name",
  nameArabic: "اسم الموقع",
  type: "mosque",
  coordinates: [31.5, 34.5],
  status: "destroyed",
  yearBuilt: "1500",
  dateDestroyed: "2024-01-15",
  // ... other fields
};

// 2. Add sources with attribution
sources: [
  {
    title: "UNESCO Report",
    url: "https://...",
    date: "2024-01-20",
    organization: "UNESCO",
  },
];

// 3. Run tests: npm test
// 4. Verify in dev: npm run dev
```

### Creating a New Filter

```typescript
// 1. Add to src/config/filters.ts
export const NEW_FILTER_OPTIONS = [
  { value: "option1", label: "Option 1", labelAr: "خيار 1" },
  { value: "option2", label: "Option 2", labelAr: "خيار 2" },
];

// 2. Update FilterState type in src/types/filters.ts
export interface FilterState {
  // ... existing filters
  newFilter: string[];
}

// 3. Add filter logic to src/hooks/useFilteredSites.ts
const matchesNewFilter =
  filters.newFilter.length === 0 ||
  filters.newFilter.includes(site.newField);

// 4. Add UI to src/components/FilterBar/FilterBar.tsx
<MultiSelectDropdown
  label="New Filter"
  options={NEW_FILTER_OPTIONS}
  selectedValues={filters.newFilter}
  onChange={(values) => setFilters({ ...filters, newFilter: values })}
/>
```

### Adding a New Page

```typescript
// 1. Create src/pages/NewPage.tsx
export default function NewPage() {
  return <div>New Page Content</div>;
}

// 2. Add route to src/App.tsx
<Routes>
  <Route path="/new-page" element={<NewPage />} />
</Routes>

// 3. Add navigation link to src/components/Layout/AppHeader.tsx
<NavLink to="/new-page">New Page</NavLink>

// 4. Create tests in src/pages/NewPage.test.tsx
```

---

## Troubleshooting

### Common Issues

**Issue:** Tests failing with "Query failed" error
**Solution:** Check that `useQuery` hooks have proper error handling

**Issue:** Map not rendering
**Solution:** Verify Leaflet CSS is imported in `main.tsx`

**Issue:** BC/BCE dates sorting incorrectly
**Solution:** Use `normalizeYear()` helper in `src/utils/formatters.ts`

**Issue:** Comparison mode maps not syncing
**Solution:** Check that `syncMaps` prop is true and coordinates match

**Issue:** FilterBar not updating
**Solution:** Verify 300ms debounce delay, check console for errors

---

## Resources

- **Supabase Docs:** https://supabase.com/docs
- **Leaflet Docs:** https://leafletjs.com/reference.html
- **D3.js Examples:** https://observablehq.com/@d3/gallery
- **Tailwind CSS v4:** https://tailwindcss.com/docs
- **React Query:** https://tanstack.com/query/latest
- **ESRI Wayback:** https://www.arcgis.com/home/item.html?id=08b4d8a8c0c44c559e021deae91f3a85

---

## Project Constraints

- **Budget:** $0-25/month (Supabase free tier)
- **Data Sources:** Public domain only (UNESCO, Forensic Architecture, etc.)
- **Accessibility:** WCAG 2.1 AA compliance required
- **Legal:** Educational/non-profit use only, proper attribution required
- **API Keys:** Only free services (Leaflet, D3, ESRI Wayback public API)

---

**Status:** Production-ready | 45 sites | Comparison mode live
**Next Steps:** Expand to 100+ sites, add West Bank heritage, implement user submissions

---

*Last updated: November 2025*
