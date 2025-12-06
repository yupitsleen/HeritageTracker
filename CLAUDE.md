# Heritage Tracker - Developer Guide

**Palestinian cultural heritage destruction tracker with interactive satellite comparison**

---

## Quick Start

```bash
npm run dev     # → http://localhost:5173 (Vite HMR)
npm test        # Run unit tests (1465 tests total)
npm run e2e     # Run E2E tests (16 Playwright tests)
npm run lint    # ESLint check
npm run build   # Production build
```

**Stack:** React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS v4 + Leaflet + D3.js + Supabase + Playwright

**Status:** ✅ Production-ready | 70 sites (140-160 buildings) | Code review 90% complete

---

## Critical Rules

### Commits (Conventional Format)

```bash
feat: add comparison mode
fix: resolve map sync bug
refactor: extract component
perf: optimize lazy loading
```

**Commit Checklist:**
- ✅ All tests passing (1465 unit + 16 E2E)
- ✅ Lint passes with zero warnings
- ✅ Dev server runs without errors
- ✅ Documentation updated

### Quality Gates

- **Zero failing tests** before every commit
- **Zero TypeScript errors** (strict mode, no `any`)
- **DRY/KISS/SOLID principles** applied
- **Check existing code** before creating new components/hooks

---

## Architecture

```
src/
├── api/                          # Backend integration (3 modes: Mock/Local/Supabase)
│   ├── supabaseClient.ts         # Supabase client configuration
│   ├── sites.ts                  # CRUD operations (mode-agnostic)
│   ├── adapters/                 # Backend adapter pattern
│   │   ├── MockAdapter.ts        # Development mock data (70 sites)
│   │   ├── LocalBackendAdapter.ts # Local PostgreSQL backend
│   │   └── SupabaseAdapter.ts    # Supabase cloud backend
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
│   ├── Icons/                    # Reusable icon library
│   └── [Button, Modal, Badge, Error, Loading, etc.]
├── pages/                        # 6 pages
│   ├── DashboardPage.tsx         # Main overview (lazy-loaded layouts)
│   ├── Timeline.tsx              # Satellite comparison with 186 Wayback releases
│   ├── DataPage.tsx              # Sites table with export (CSV/JSON/GeoJSON)
│   ├── AboutPage.tsx             # Project information (includes statistics & comparisons)
│   ├── DonatePage.tsx            # Donation information
│   └── resources/
│       └── HowItWorksPage.tsx    # Comprehensive user guide
├── hooks/                        # 24+ custom hooks
│   ├── useAppState.ts            # Centralized app state
│   ├── useFilteredSites.ts       # Filter logic with memoization
│   ├── useWaybackReleases.ts     # ESRI Wayback API integration
│   ├── useSitesPaginated.ts      # Paginated data fetching
│   ├── useSitesQuery.ts          # React Query caching (5min)
│   ├── useThemeClasses.ts        # Theme-aware styling
│   ├── useDebounce.ts            # 300ms filter debouncing
│   └── useMediaQuery.ts          # Native matchMedia hook
├── contexts/                     # 4 contexts
│   ├── AnimationContext.tsx      # Timeline animation state
│   ├── CalendarContext.tsx       # Gregorian/Islamic calendar
│   ├── LocaleContext.tsx         # i18n (en/ar/it)
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
│   ├── index.ts                  # Core types (Site, FilterState)
│   ├── filters.ts                # Filter types
│   ├── wayback.ts                # Wayback release types
│   └── [30+ type files]
├── data/
│   └── mockSites.ts              # 70 documented sites (2356 lines)
└── (root directories)
    ├── database/                 # Local PostgreSQL setup
    │   ├── migrations/           # SQL schema files (285 lines)
    │   ├── scripts/              # Migration & seed runners
    │   └── seeds/                # Auto-generated seed data
    └── server/                   # Local HTTP backend (Express)
        ├── index.js              # Server entry point
        ├── db.js                 # Database connection pool
        ├── package.json          # Server dependencies
        ├── controllers/          # HTTP request handlers
        │   └── sitesController.js
        ├── services/             # Business logic & validation
        │   └── sitesService.js
        ├── repositories/         # Data access layer
        │   └── sitesRepository.js
        ├── middleware/           # Error handling, validation
        │   ├── errorHandler.js
        │   └── validator.js
        └── utils/                # DB ↔ API converters
            └── converters.js
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

### Backend Pattern (3 Modes)

**Mode 1: Mock API** (Default - Fastest)
```typescript
// .env.development: VITE_USE_MOCK_API=true
export async function getAllSites(): Promise<Site[]> {
  if (shouldUseMockData()) return mockGetAllSites();
  // Returns data from src/data/mockSites.ts (70 sites)
  // No database required, 800ms simulated delay
}
```

**Mode 2: Local Backend** (Realistic Development)
```typescript
// .env.development: VITE_USE_LOCAL_BACKEND=true, VITE_API_URL=http://localhost:5000/api
export async function getAllSites(): Promise<Site[]> {
  if (shouldUseLocalBackend()) {
    const response = await fetch(`${VITE_API_URL}/sites`);
    return response.json();
  }
  // Connects to local Express server → PostgreSQL
  // Requires: docker-compose up -d
}
```

**Mode 3: Supabase Cloud** (Production)
```typescript
// .env.production: VITE_USE_MOCK_API=false, VITE_SUPABASE_URL=xxx
export async function getAllSites(): Promise<Site[]> {
  return supabase.from("heritage_sites").select("*");
  // Connects to Supabase cloud database
}
```

**Switching Modes:** Change environment variables, zero code changes needed!

---

## Data Schema

```typescript
interface Site {
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

- **Multilingual:** English primary, Arabic (RTL) and Italian support
- **Palestinian names:** Use original Arabic when available
- **Evidence-based only:** UNESCO, Forensic Architecture, Heritage for Peace
- **Factual language:** "destruction" not "damage," avoid bias
- **Attribution:** All sources linked and dated
- **Updated casualty figures:** 70k+ deaths (estimates exceed 100k), 248+ journalists killed (January 2025)

---

## Testing Strategy

### Test Coverage Summary

**Unit Tests (1,465 total):**

- Frontend: Components, hooks, integration
- Backend: Utils, middleware, business logic

**E2E Tests (16 total, chromium only):**
- Smoke: 9 tests - Page loads, navigation, accessibility
- Filters: 2 tests - Visual regression (z-index)
- Timeline: 2 tests - Navigation buttons
- Comparison: 4 tests - Dual maps, site selection

**Test Philosophy:**
- Unit tests cover logic, state, calculations
- E2E tests cover visual bugs, user journeys
- 70% faster E2E suite (~30-45s vs 2-3 min)
- MSW 2.11.6 for API mocking

### Test Organization

**Pattern:** Smoke tests → Interaction tests → Edge cases

**File Structure:**
```
Component/
├── Component.tsx          # Implementation
├── Component.test.tsx     # Tests (3 sections)
└── types.ts               # Component types
```

**Backend Tests:**
```
server/
├── __tests__/setup.js           # Mock utilities
├── utils/__tests__/             # 40 tests (errors, converters)
└── middleware/__tests__/        # 37 tests (validation)
```

### Running Tests

```bash
# Unit Tests
npm test              # All unit tests (watch mode)
npm test -- --run     # Single run (for CI)
npm run test:ui       # Vitest UI

# Code Coverage
npm run test:coverage    # Run tests with coverage report (terminal + HTML)
npm run test:coverage:ui # Run tests with coverage in UI mode
# HTML report: coverage/index.html (open in browser)
# Terminal report: Shows % coverage for all files
# Coverage thresholds: 80% (lines, functions, branches, statements)

# E2E Tests
npm run e2e           # All E2E tests (headless)
npm run e2e:ui        # E2E tests with UI (interactive debugging)
npm run e2e:headed    # E2E tests in headed mode (see browser)
npm run e2e:debug     # Debug mode (step through tests)
npm run e2e:report    # View test report

# Run All Tests
npm run test:all      # Both unit + E2E tests

# Run specific test suites
npm test src          # Frontend tests only
npm test server       # Backend tests only
npm test server/utils # Specific backend folder
```

### Code Coverage

**Tool:** Vitest + @vitest/coverage-v8

**Configuration:**
- Thresholds: 80% for all metrics (lines/functions/branches/statements)
- HTML report: `coverage/index.html`
- Terminal: Shows % table after test run

**Commands:**
```bash
npm run test:coverage       # Generate coverage report
npm run test:coverage:ui    # Live coverage updates
```

**Reading Reports:**
- 🟢 Green = fully covered
- 🟡 Yellow = partially covered (branches missing)
- 🔴 Red = not covered (needs tests)
- Target: 80%+ coverage

---

## End-to-End (E2E) Testing

### Overview

**Purpose:** Catch visual bugs, user journeys, browser-specific issues that unit tests miss

**16 tests across 4 suites:**
- smoke.spec.ts (9) - Page loads, navigation, accessibility
- filters.spec.ts (2) - Visual regression (z-index)
- timeline.spec.ts (2) - Navigation buttons
- comparison.spec.ts (4) - Site selection, dual maps

**Commands:**
```bash
npm run e2e           # Headless (CI/CD)
npm run e2e:ui        # Interactive debugging
npm run e2e:headed    # Watch browser
npm run e2e:debug     # Step through tests
npm run e2e:report    # View HTML report
npm run test:all      # Unit + E2E
```

### E2E Best Practices

**Test Strategy:**
- ✅ User journeys (filter → view site → comparison)
- ✅ Visual bugs (z-index, overlapping, hidden elements)
- ✅ Route navigation, map interactions
- ❌ Business logic (unit test territory)
- ❌ Data transformations (unit test territory)

**Writing Tests:**
1. Use Mock API (`VITE_USE_MOCK_API=true`)
2. Prefer `getByRole` > `getByText` > `locator`
3. Wait for loading: `waitForLoadState('networkidle')`
4. Test visible behavior, not implementation
5. Keep tests fast (parallel execution)

**Debugging:**
```bash
npm run e2e:debug           # Pause at breakpoints
npm run e2e:headed          # Watch browser
npm run e2e -- e2e/file.ts  # Run specific file
```

**CI/CD:** Auto-runs on GitHub Actions (push/PR), uploads artifacts on failure

**Performance:** 30-45s runtime (70% faster than original 57 tests)

---

## Recent Highlights

**Production Status:** ✅ Code review 90% complete (18/20 issues resolved)

### November 2024 - Content Restructuring & Mobile Accessibility

**Core Improvements (10 files modified, 1,465 tests passing):**

1. **About Page Mobile Accessibility:**
   - Removed all `hidden md:block` classes from sections
   - Methodology, Research, Legal Framework, and Acknowledgments now visible on mobile
   - 50% improvement in mobile content accessibility

2. **Updated Casualty Figures:**
   - Deaths: 45,000 → **70,000+** (with note: estimates exceed 100,000)
   - Journalists killed: 165+ → **248+**
   - Added ICC/ICJ legal context (Netanyahu/Gallant arrest warrants, November 2024)
   - Updated to January 2025 timeframe
   - Removed duplicate "The Data" section from About page

3. **New "How It Works" Page:**
   - Comprehensive user guide (350+ lines)
   - Sections: Dashboard, Data Table, Timeline Comparison, Filtering, Mobile & Accessibility
   - Technical information and best practices for researchers/advocates/educators
   - Added to Resources dropdown with full i18n support (en/ar/it)

4. **Statistics Constants Updated:**
   - Auto-update across Stats and About pages via centralized constants
   - Last updated: January 2025

### November 2025 - Code Review Phase

**Achievements (18/20 issues resolved):**
1. **Test Quality:** Reduced test-to-code ratio from 6.3:1 to 4.5:1
2. **Performance:** FilterBar re-render elimination (15 memoized handlers)
3. **Accessibility:** WCAG 2.1 AA compliance (ARIA labels, keyboard nav)
4. **DRY Improvements:** EmptyState component, Icon registry, shared hooks
5. **TypeScript:** Discriminated unions, zero `any` types
6. **E2E Optimization:** 57 → 16 tests (70% faster)

**Key Refactors:**
- Timeline.tsx: 578 → 361 lines (26% reduction)
- Extracted TimelineHelpModal component
- Created useDefaultFilterRanges hook
- Standardized optional chaining syntax

**Deferred (Low ROI, High Risk):**
- FilterBar refactor (415 lines, well-organized, zero bugs)
- Timeline OCP extension (408 lines, 35+ tests pass)

### Site Database Expansion (Oct-Nov 2025)

**45 → 70 sites (140-160 buildings):**
- 21 individual UNESCO-verified sites
- 4 grouped collections (70-90 buildings)
- New types: monument, cemetery, archive
- Exceeded UNESCO target by 123-140%

### Backend Infrastructure (Oct 2025)

**3-Mode Architecture:**
1. Mock API (default, fastest)
2. Local Backend (PostgreSQL + Express)
3. Supabase Cloud (production)

**Features:**
- Adapter pattern (377 → 89 lines)
- SQL injection protection (100% safe)
- Custom error hierarchy
- One-command setup: `npm run db:setup`

### Comparison Mode & Timeline (Sept 2025)

**Major Features:**
- Side-by-side satellite comparison
- Dual scrubbers (before/after)
- 186 ESRI Wayback releases (2014-2025)
- Timeline navigation (NEXT/PREV/RESET)
- Auto-sync with destruction dates

**Performance:**
- Lazy-loaded layouts
- Manual chunk splitting
- <2s initial page load
- 60 FPS scrolling

*For complete changelog, see [CHANGELOG.md](CHANGELOG.md)*

---

## Environment Configuration

### Mode 1: Mock API (Default Development)

**.env.development**
```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK_API=true
VITE_USE_LOCAL_BACKEND=false
```
- No database setup required
- Uses `src/data/mockSites.ts` (70 sites)
- 800ms simulated network delay
- Perfect for quick development and testing

### Mode 2: Local Backend (Realistic Development)

**.env.development**
```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK_API=false
VITE_USE_LOCAL_BACKEND=true
```

**Quick Setup:**
```bash
# One-time setup
npm run db:setup        # Start PostgreSQL, run migrations, load 70 sites

# Start servers (2 separate terminals)
npm run server:dev      # Express backend on :5000
npm run dev             # Vite frontend on :5173

# Or run both together
npm run dev:full        # Starts both servers concurrently
```

**Requirements:**
- Docker Desktop running
- Ports 5432 (PostgreSQL) and 5000 (Express) available

### Mode 3: Production (Supabase Cloud)

**.env.production**

```env
VITE_API_URL=https://api.heritagetracker.org
VITE_USE_MOCK_API=false
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Local Backend Setup

### Quick Start

```bash
npm run db:setup        # One-time setup (PostgreSQL + migrations + seed)
npm run server:dev      # Start Express backend (:5000)
npm run dev             # Start Vite frontend (:5173)
# OR: npm run dev:full  # Start both together
```

**Update `.env.development`:**
```env
VITE_USE_MOCK_API=false
VITE_USE_LOCAL_BACKEND=true
```

### Commands Reference

**Database:**
```bash
npm run db:start          # Start PostgreSQL (Docker)
npm run db:stop           # Stop PostgreSQL
npm run db:reset          # Reset database
npm run db:migrate        # Run migrations
npm run db:seed           # Load seed data (70 sites)
npm run db:setup          # Complete setup
```

**Server:**
```bash
npm run server:start      # Production mode
npm run server:dev        # Development mode (auto-reload)
```

### Architecture Overview

| Layer | Location | Details |
|-------|----------|---------|
| Database | `database/` | PostgreSQL 16 + PostGIS 3.4, Port 5432 |
| Backend | `server/` | Express, 3-layer architecture, Port 5000 |
| Frontend | `src/api/` | Auto-detects mode, same types across all modes |

**Schema Features:** PostGIS geography, GIST indexes, Row-Level Security, geospatial functions

**Requirements:** Docker Desktop running, ports 5432 & 5000 available

---

## Deployment

### Build & Deploy

```bash
npm run build         # Creates dist/ folder
npm run preview       # Preview production build locally
```

### Supabase Setup (Cloud Migration)

1. Create project at supabase.com
2. Run SQL migration from `database/migrations/001_initial_schema.sql` in Supabase SQL Editor
3. Extensions, indexes, RLS policies automatically created by migration
4. Update `.env.production`:
   ```env
   VITE_USE_MOCK_API=false
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. No code changes needed - same schema as local database!

### Vercel/Netlify

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18+
- Environment variables: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

---

## Common Tasks

### Adding a New Site
1. Add to `src/data/mockSites.ts` with all required fields
2. Include sources with proper attribution (UNESCO, etc.)
3. Add Arabic name if available
4. Run tests: `npm test` and verify in dev: `npm run dev`

### Creating a New Filter
1. Add options to `src/config/filters.ts`
2. Update `FilterState` type in `src/types/filters.ts`
3. Add filter logic to `src/hooks/useFilteredSites.ts`
4. Add UI to `src/components/FilterBar/FilterBar.tsx`

### Adding a New Page

1. Create component in `src/pages/NewPage.tsx` (or `src/pages/resources/` for Resources dropdown)
2. Add route to `src/App.tsx`
3. Add navigation link to `src/components/Layout/AppHeader.tsx` or `ResourcesDropdown.tsx`
4. Add i18n translations to `src/i18n/en.ts`, `ar.ts`, and `it.ts`
5. Export from `src/pages/resources/index.ts` if applicable
6. Create tests in `src/pages/NewPage.test.tsx`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests failing | Check error handling in `useQuery` hooks |
| Map not rendering | Verify Leaflet CSS imported in `main.tsx` |
| BC/BCE dates incorrect | Use `normalizeYear()` from `src/utils/formatters.ts` |
| Maps not syncing | Check `syncMaps` prop and coordinates |
| FilterBar not updating | Verify 300ms debounce, check console |
| Docker won't start | Ensure Docker Desktop running, check port 5432 |
| Backend connection fails | Verify `.env.development` settings |

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

**Status:** Production-ready | 70 sites (representing 140-160 buildings) | Comparison mode live
**Next Steps:** Coordinate validation, image research, add West Bank heritage, implement user submissions

---

*Last updated: November 2025*
