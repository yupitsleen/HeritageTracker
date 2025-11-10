# Heritage Tracker - Developer Guide

**Palestinian cultural heritage destruction tracker with interactive satellite comparison**

---

## Quick Start

```bash
npm run dev     # → http://localhost:5173 (Vite HMR)
npm test        # 1053 unit tests must pass ✓ (976 frontend + 77 backend)
npm run e2e     # E2E tests (Playwright)
npm run lint    # ESLint check
npm run build   # Production build
```

**Stack:** React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS v4 + Leaflet + D3.js + Supabase + Playwright

**Current:** 70 Gaza sites documented (representing 140-160 buildings) | Production-ready with comparison mode

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
✓ Feature working ✓ 1053/1053 tests pass ✓ Lint passes ✓ Dev server clean ✓ Docs updated

### Quality Gates

- **1053/1053 tests passing** before every commit (976 frontend + 77 backend)
- Dev server stays running (HMR for instant feedback)
- Apply DRY/KISS/SOLID principles
- Check for existing components/hooks before creating new ones
- No `any` types (TypeScript strict mode)

---

## Architecture

```
src/
├── api/                          # Backend integration (3 modes: Mock/Local/Supabase)
│   ├── supabaseClient.ts         # Supabase client configuration
│   ├── sites.ts                  # CRUD operations (mode-agnostic)
│   ├── mockAdapter.ts            # Development mock data (70 sites)
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
export async function getAllSites(): Promise<GazaSite[]> {
  if (shouldUseMockData()) return mockGetAllSites();
  // Returns data from src/data/mockSites.ts (70 sites)
  // No database required, 800ms simulated delay
}
```

**Mode 2: Local Backend** (Realistic Development)
```typescript
// .env.development: VITE_USE_LOCAL_BACKEND=true, VITE_API_URL=http://localhost:5000/api
export async function getAllSites(): Promise<GazaSite[]> {
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
export async function getAllSites(): Promise<GazaSite[]> {
  return supabase.from("heritage_sites").select("*");
  // Connects to Supabase cloud database
}
```

**Switching Modes:** Change environment variables, zero code changes needed!

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

- **1053 tests passing** across 69 test files (2 skipped)
  - **Frontend:** 976 tests (62 files) - Components, hooks, integration tests
  - **Backend:** 77 tests (7 files) - Utils, middleware, business logic
- **Component tests:** Smoke tests, interaction tests, edge cases
- **Hook tests:** State management, side effects, cleanup
- **Integration tests:** Page rendering, routing, data flow
- **Backend tests:** Error handling, data conversion, request validation
- **Mock service worker:** API mocking with MSW 2.11.6

### Test Structure

**Frontend (React Component Tests):**
```typescript
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

**Backend (Middleware/Utils Tests):**
```javascript
describe("validateSiteBody", () => {
  it("accepts valid site data", () => {
    const req = createMockRequest({
      body: {
        id: 'site-1',
        name: 'Test Mosque',
        type: 'mosque',
        coordinates: [31.5, 34.5],
        status: 'destroyed',
        description: 'Test',
        historicalSignificance: 'Test',
        culturalValue: 'Test',
      }
    });
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = validateSiteBody(false);
    middleware(req, res, next);

    expect(next.called).toBe(true);
    expect(next.error).toBeUndefined();
  });

  it("rejects invalid coordinates", () => {
    const req = createMockRequest({
      body: { coordinates: [91, 34.5] } // lat > 90
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateSiteBody(false)(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('coordinates must be valid');
  });
});
```

### Running Tests

```bash
npm test              # All tests (watch mode)
npm test -- --run     # Single run (for CI)
npm run test:ui       # Vitest UI

# Run specific test suites
npm test src          # Frontend tests only
npm test server       # Backend tests only
npm test server/utils # Specific backend folder
```

### Backend Test Files

```
server/
├── __tests__/
│   └── setup.js                           # Mock utilities & test helpers
├── utils/__tests__/
│   ├── errors.test.js                     # 21 tests - Custom error classes
│   └── converters.test.js                 # 19 tests - DB ↔ API transformations
└── middleware/__tests__/
    └── validator.test.js                  # 37 tests - Request validation
```

---

## End-to-End (E2E) Testing

### Overview

E2E tests use **Playwright** to catch visual and interaction bugs that unit tests can't detect.

**Coverage:**
- Filter bar visibility and z-index issues
- Timeline navigation button presence
- Comparison mode dual map rendering
- Mobile responsive layouts
- Route navigation and accessibility

### Running E2E Tests

```bash
# Run all E2E tests (headless)
npm run e2e

# Run with UI mode (interactive debugging)
npm run e2e:ui

# Run in headed mode (see browser)
npm run e2e:headed

# Debug mode (step through tests)
npm run e2e:debug

# View test report
npm run e2e:report

# Run all tests (unit + E2E)
npm run test:all
```

### E2E Test Files

```
e2e/
├── smoke.spec.ts        # Core page loads, navigation, mock data
├── filters.spec.ts      # Filter bar visibility and functionality
├── timeline.spec.ts     # Timeline navigation buttons
├── comparison.spec.ts   # Comparison mode dual maps
└── mobile.spec.ts       # Mobile responsive layouts
```

### Writing E2E Tests

**Pattern:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: /click me/i });

    // Act
    await button.click();

    // Assert
    await expect(button).toBeVisible();
  });
});
```

**Mobile Tests:**
```typescript
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Feature', () => {
  test.use({ ...devices['Pixel 5'] });

  test('should work on mobile', async ({ page }) => {
    await page.goto('/');
    // Test mobile-specific behavior
  });
});
```

### E2E Test Strategy

**What to Test:**
- ✅ Critical user journeys (filter → view site → comparison mode)
- ✅ Visual bugs (z-index, overlapping elements, hidden buttons)
- ✅ Mobile responsive layouts
- ✅ Route navigation
- ✅ Map interactions (zoom, markers, tiles)
- ❌ Business logic (covered by unit tests)
- ❌ Data transformations (covered by unit tests)

**Best Practices:**
1. **Use Mock API** - E2E tests run with `VITE_USE_MOCK_API=true` (no backend needed)
2. **Flexible Selectors** - Use `getByRole` > `getByText` > `locator` (avoid brittle IDs)
3. **Wait for Loading** - Use `waitForLoadState('networkidle')` after navigation
4. **Test User Intent** - Focus on visible behavior, not implementation details
5. **Keep Tests Fast** - Run in parallel (default), avoid unnecessary waits

### CI/CD Integration

E2E tests run automatically on GitHub Actions:

```yaml
# .github/workflows/e2e-tests.yml
- Run on push to main/develop/feature/*
- Run on pull requests
- Upload screenshots on failure
- Upload HTML report artifacts
```

**View Results:**
- Check "Actions" tab in GitHub
- Download artifacts for failed test screenshots
- View Playwright HTML report

### Debugging Failed E2E Tests

**Locally:**
```bash
# Run in debug mode (pause at breakpoints)
npm run e2e:debug

# Run in headed mode (see browser)
npm run e2e:headed -- --grep "test name"

# Run specific file
npm run e2e -- e2e/filters.spec.ts
```

**In CI:**
1. Check GitHub Actions logs
2. Download "playwright-screenshots" artifact
3. Download "playwright-report" artifact
4. Unzip and open `index.html` to see full report

**Common Issues:**
- **Timeouts:** Increase timeout in test or use `page.waitForTimeout()`
- **Element not found:** Check selector, element may be hidden or not loaded
- **Flaky tests:** Add `waitForLoadState()` or retry logic
- **CI failures:** Check if dev server started correctly

### Performance Targets

- **Smoke tests:** ~30 seconds (all critical pages)
- **Full E2E suite:** ~2 minutes (parallel execution)
- **CI pipeline:** +3 minutes to total build time

---

## Recent Improvements (Nov 2025)

**Phase 11 Complete: Heritage Site Expansion**

### Latest Changes (Nov 9, 2025)

1. **Site Database Expansion (45 → 70 sites):**
   - **21 individual UNESCO-verified sites added:**
     - 6 Mosques (Ibn Othman, Shaikh Zakaria, Al-Mughrabi, Sett Ruqayya, Ash-Sheikh Sha'ban, Zawiyat Al Hnoud)
     - 3 Monuments/Shrines (Ali Ibn Marwan, Abu Al-Azm/Shamshon, Unknown Soldier Memorial)
     - 3 Archaeological Sites (Tell Al-Muntar, Tell Rafah, Al-Bureij Mosaic)
     - 1 Cemetery (English Cemetery, Az-Zawaida)
     - 7 Historic Buildings (Municipality, 2 Cinemas, 2 Hospital buildings, 2 Named Houses)
     - 1 Archive (EBAF Storage Facility)
   - **4 grouped collections:** Represent 70-90 unnamed historic buildings
     - Gaza Old City Residential Buildings (~25-30 buildings)
     - Daraj Quarter Buildings (~20-25 buildings)
     - Commercial & Public Buildings (~15-20 buildings)
     - Zaytoun Quarter Buildings (~10-15 buildings)

2. **Coverage Achievement:**
   - **Total entries:** 70 documented sites
   - **Actual buildings:** 140-160 (including collections)
   - **UNESCO target:** 114 sites (exceeded by 123-140%)
   - All sites verified by UNESCO Gaza Heritage Damage Assessment (Oct 6, 2025)

3. **Type System Enhancements:**
   - Added new site types: `monument`, `cemetery`, `archive`
   - Added `metadata` field to GazaSite interface for grouped collections
   - Full icons and Arabic translations for all new types

4. **Quality Assurance:**
   - All 1053/1053 tests passing ✅
   - Updated test expectations across 7 files
   - Dev server runs without errors
   - Research documented in [docs/research/](docs/research/)

**Phase 10 Complete: End-to-End Testing**

### Latest Changes (Nov 2025)

1. **E2E Test Suite with Playwright:**
   - **5 Test Suites (50+ Tests):** Comprehensive coverage of critical user journeys
     - `smoke.spec.ts` - Core page loads, navigation, accessibility
     - `filters.spec.ts` - Filter bar visibility and z-index issues
     - `timeline.spec.ts` - Timeline navigation buttons presence
     - `comparison.spec.ts` - Comparison mode dual maps rendering
     - `mobile.spec.ts` - Mobile responsive layouts and touch interactions
   - **Mock API Integration:** All E2E tests run against mock data (no backend required)
   - **CI/CD Ready:** GitHub Actions workflow with artifact uploads on failure
   - **6 NPM Scripts:** `e2e`, `e2e:ui`, `e2e:headed`, `e2e:debug`, `e2e:report`, `test:all`

2. **Test Coverage Highlights:**
   - Filter dropdown visibility and clickability (catch z-index bugs)
   - Timeline NEXT/PREV/RESET buttons (ensure buttons are present)
   - Comparison mode with dual maps (verify side-by-side rendering)
   - Mobile filter drawer (responsive UI testing)
   - Map marker interactions and tile loading
   - Route navigation and accessibility (keyboard, screen readers)

3. **New Files Created (7 files):**
   - `e2e/` - E2E test directory
     - `smoke.spec.ts`, `filters.spec.ts`, `timeline.spec.ts`, `comparison.spec.ts`, `mobile.spec.ts`
   - `playwright.config.ts` - Playwright configuration
   - `.github/workflows/e2e-tests.yml` - CI/CD workflow

**Phase 9 Complete: Backend Unit Testing**

### Previous Changes (Nov 2025)

1. **Backend Test Suite (77 Tests):**
   - **Test Infrastructure:** Reusable mock utilities and test helpers
     - Mock database, repositories, services, Express req/res/next
     - `server/__tests__/setup.js` - Centralized test utilities
   - **Error Classes Tests (21 tests):** ServiceError, ValidationError, NotFoundError, DatabaseError
     - Error handling utilities (withErrorHandling, createErrorContext)
     - Stack trace preservation verification
   - **Data Converter Tests (19 tests):** DB ↔ API transformations
     - PostGIS coordinate conversions ([lng, lat] ↔ [lat, lng])
     - Round-trip conversion verification
     - Edge case handling (null values, missing fields)
   - **Validator Middleware Tests (37 tests):** Request validation
     - Site body validation (POST/PATCH)
     - Pagination, geospatial query validation
     - Comprehensive boundary testing

2. **Test Coverage:**
   - **Total:** 797 tests passing (720 frontend + 77 backend)
   - **Backend coverage:** Utilities 100%, Middleware 100%
   - **Zero test failures** - All quality gates passed
   - Test patterns established for future expansion

3. **New Files Created (4 files):**
   - `server/__tests__/setup.js` - Test utilities and mocks
   - `server/utils/__tests__/errors.test.js` - Error class tests
   - `server/utils/__tests__/converters.test.js` - Converter tests
   - `server/middleware/__tests__/validator.test.js` - Validation tests

**Phase 8 Complete: Production Readiness Improvements**

### Previous Changes (Nov 2025)

1. **Code Quality & Security Enhancements (P1 Improvements):**
   - **Adapter Pattern:** Refactored backend mode switching from 377 lines to 89 lines (-76%)
     - Created BackendAdapter interface with MockAdapter, LocalBackendAdapter, SupabaseAdapter
     - Easy to add new backends (Firebase, GraphQL, etc.)
   - **SQL Injection Protection:** Eliminated ALL sql.unsafe() calls
     - 100% tagged template literals with sql.join()
     - Zero SQL injection vulnerabilities
   - **Database Connection Utility:** Retry logic with exponential backoff
     - Handles Docker startup delays automatically
     - Reusable across migrate/seed scripts
   - **Custom Error Hierarchy:** ServiceError, ValidationError, NotFoundError, DatabaseError
     - Preserves original stack traces and error context
     - Better debugging in production
   - **Query Parameter Builder:** Type-safe utility for URL construction
     - Handles arrays, primitives, undefined/null automatically
     - Reusable across all API calls

2. **New Files Created (8 files):**
   - `src/api/adapters/` - Complete adapter pattern implementation (5 files)
   - `database/scripts/utils/db-connection.js` - Connection utility with retry
   - `server/utils/errors.js` - Custom error classes
   - `src/utils/queryBuilder.ts` - Query parameter builder

**Phase 7 Complete: Local Backend Infrastructure**

### Previous Changes (Nov 2025)

1. **Local Backend Implementation:**
   - Express REST API server with 8 endpoints (GET, POST, PATCH, DELETE)
   - 3-layer architecture (Controller → Service → Repository)
   - PostgreSQL 16 + PostGIS 3.4 database with Docker
   - Complete migration system (285-line SQL schema)
   - Auto-generated seed data from mockSites.ts (70 sites)
   - One-command setup: `npm run db:setup`
   - 11 new NPM scripts for database and server management
   - Comprehensive documentation (server/README.md, database/README.md)
   - Zero breaking changes - all 728 tests passing
   - Three backend modes: Mock API (default), Local Backend, Supabase Cloud

**Phase 6 Complete: Timeline Navigation Enhancements**

### Previous Changes

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

### Overview

The local backend provides a realistic development environment with:
- PostgreSQL database with PostGIS (geospatial queries)
- Express REST API server
- Same schema as Supabase (easy cloud migration)
- 45 heritage sites from mockSites.ts

### Quick Start

```bash
# 1. Start database and load data (one command)
npm run db:setup

# 2. Start backend server
npm run server:dev

# 3. Start frontend (separate terminal)
npm run dev

# 4. Update .env.development
VITE_USE_MOCK_API=false
VITE_USE_LOCAL_BACKEND=true
```

### Database Commands

```bash
npm run db:start          # Start PostgreSQL (Docker)
npm run db:stop           # Stop PostgreSQL
npm run db:reset          # Reset database (delete all data)
npm run db:migrate        # Run migrations (create schema)
npm run db:generate-seed  # Generate seed SQL from mockSites.ts
npm run db:seed           # Load seed data (70 sites)
npm run db:setup          # Complete setup (all of the above)
npm run db:logs           # View database logs
```

### Backend Server Commands

```bash
npm run server:start      # Start Express server (production mode)
npm run server:dev        # Start with nodemon (auto-reload)
npm run dev:full          # Start both frontend + backend together
```

### Architecture

**Database Layer (PostgreSQL + PostGIS)**
- Location: `database/`
- Schema: `migrations/001_initial_schema.sql` (285 lines)
- Features: PostGIS, RLS, indexes, custom functions
- Port: 5432

**Backend Server (Express)**
- Location: `server/`
- Port: 5000
- Endpoints: GET/POST/PATCH/DELETE `/api/sites`
- Database: Uses `postgres` npm package

**Frontend Integration**
- `src/api/sites.ts` - Auto-detects backend mode
- No code changes needed to switch modes
- Same `GazaSite` types across all modes

### Database Schema Highlights

```sql
-- PostGIS geography for accurate distance calculations
coordinates GEOGRAPHY(POINT, 4326)

-- Performance indexes
CREATE INDEX idx_heritage_coordinates ON heritage_sites USING GIST(coordinates);
CREATE INDEX idx_heritage_type ON heritage_sites(type);
CREATE INDEX idx_heritage_status ON heritage_sites(status);

-- Custom geospatial function
SELECT * FROM sites_near_point(lat, lng, radius_km);

-- Row-Level Security (Supabase compatible)
ALTER TABLE heritage_sites ENABLE ROW LEVEL SECURITY;
```

### Troubleshooting

**Docker not starting:**
- Ensure Docker Desktop is running
- Check port 5432 is available: `lsof -i :5432`

**Migration fails:**
- Reset database: `npm run db:reset`
- Check logs: `npm run db:logs`

**Backend server errors:**
- Verify database is running: `docker ps`
- Check connection: `psql postgresql://heritage_user:heritage_dev_password@localhost:5432/heritage_tracker`

**Frontend not connecting:**
- Verify `.env.development` has `VITE_USE_LOCAL_BACKEND=true`
- Check backend is running: `curl http://localhost:5000/api/sites`
- Restart Vite dev server

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

**Status:** Production-ready | 70 sites (representing 140-160 buildings) | Comparison mode live
**Next Steps:** Coordinate validation, image research, add West Bank heritage, implement user submissions

---

*Last updated: November 2025*
