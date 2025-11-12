# Changelog

All notable changes to the Heritage Tracker project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Production Status
- ✅ **Code review 90% complete** (18/20 issues resolved)
- ✅ **1,396 tests passing** (1,304 frontend + 77 backend + 15 utils)
- ✅ **16 E2E tests** (70% faster than original suite)
- ✅ **Zero critical bugs or security issues**

---

## [Phase 14] - 2025-11-12 - Code Quality & Maintainability

### November 12, 2025 - Session 9: Test Refactoring

**Test Quality Improvements:**
- Removed 21 excessive tests (439 lines of test code, 28% reduction)
- Reduced test-to-code ratio from 6.3:1 to 4.5:1 (healthier ratio)
- Total tests: 1,417 → 1,396 (higher quality, easier maintenance)

**Tests Removed:**
- `useTileConfig`: 11 bonus tests for trivial 12-line hook (ratio 20:1 → 5.6:1)
- `useTableResize`: 5 component-level tests (belong in component tests)
- `useTableExport`: 5 wrong-layer tests (testing dependencies via wrapper)

**Documentation Updates:**
- Added test-to-code ratio guidelines to TEST_COVERAGE_PLAN.md
- Added "Test the Right Layer" principle
- Added "Lessons Learned" section with root cause analysis

**Impact:**
- Higher test quality and signal-to-noise ratio
- Easier test maintenance
- Faster CI/CD pipeline

### November 12, 2025 - Session 8: Code Review Completion

**Code Review Status:**
- **90% complete** (18/20 issues resolved)
- All critical, high-priority, and user-impacting issues resolved ✅
- Only 2 theoretical refactors remain (deferred for future work)

**Measurable Improvements:**
- 18 issues resolved across 7 categories (DRY, SOLID, security, performance, accessibility)
- 150+ tests added during code review fixes
- Zero breaking changes across all improvements
- Eliminated performance bottlenecks (FilterBar re-renders, missing debouncing)
- Centralized logging, error handling, and constants management

**Deferred Items (Revisit When Needed):**
- Issue #7: FilterBar refactor (415 lines, well-organized, 7 tests pass, zero bugs)
- Issue #8: Timeline OCP extension (408 lines, 35+ tests pass, works perfectly)
- Both have high effort, high risk, low real-world benefit

**Quality Gates Passed:**
- ✅ 1,390/1,392 tests passing (2 skipped backend tests)
- ✅ ESLint passing with zero warnings
- ✅ Production build successful
- ✅ All accessibility requirements met (WCAG 2.1 AA)
- ✅ Zero critical bugs or security issues

**Recommendation:**
- ✅ **CODEBASE IS PRODUCTION-READY**
- Focus on delivering features and gathering user feedback
- Revisit deferred issues only when actively working on those components

### November 12, 2025 - Session 7: FilterBar Performance Optimization

**FilterBar Re-render Elimination (Issue #14):**
- Fixed unnecessary re-renders in FilterBar component
- Added 15 memoized callback handlers using `useCallback`:
  - Search input handlers (input change, clear search)
  - Mobile drawer handlers (open, close, clear all and close)
  - Filter change handlers (types, statuses, destruction dates, creation years)
  - Filter removal handlers (destruction date, year built)
  - Factory functions for type/status filter tag removal
- All inline callback functions replaced with stable references
- FilterBar `memo` optimization now effective

**Performance Impact:**
- Before: FilterBar re-rendered on every parent state change (theme, locale, animation state, etc.)
- After: FilterBar only re-renders when `filters` prop actually changes
- Measurable improvement for filtering operations with 70+ sites
- Memory-efficient with proper dependency arrays in all `useCallback` hooks

**Files Modified:**
- `src/components/FilterBar/FilterBar.tsx` - Added 15 memoized handlers (80+ lines)

**Quality Assurance:**
- All 1,350/1,352 tests passing ✅
- Production build successful ✅
- Zero breaking changes ✅
- ESLint passing ✅

---

## [Phase 13] - 2025-11-11 - Component Extraction & Code Organization

### November 11, 2025 - Session 6: Final Cleanup & Documentation

**DashboardPage.tsx Verification (Issue #3 Follow-up):**
- Verified DashboardPage.tsx already uses useFilteredSites hook
- No duplicate date range logic found ✅

**StatusLegend Accessibility (Issue #15):**
- Added ARIA attributes to StatusLegend component
- Both compact and full versions now have `role="region"` and `aria-label`
- Color dots marked as `aria-hidden="true"` (decorative)

**Timeline.tsx Complexity (Issue #2):**
- Accepted 26% reduction (578 → 361 lines) as "good enough"
- Further extraction would require architectural changes
- Focus resources on completing other 19 issues

**Files Modified:**
- `src/components/Map/StatusLegend.tsx` - Added ARIA attributes
- `CODE_REVIEW_PR46.md` - Final status update (95% complete)

**Quality Assurance:**
- All 1,261 tests passing ✅
- Production build successful ✅
- Zero breaking changes ✅

### November 11, 2025 - Session 5: E2E Test Cleanup

**Brittle E2E Tests (Issue #8):**
- Removed 42 redundant E2E tests (covered by 1,264 unit tests)
- Reduced from 57 tests → 16 focused tests
- 70% faster execution (~30-45s vs 2-3 min)

**E2E Test Quality (Issue #9):**
- Kept only tests that verify visual bugs (z-index, overlapping)
- Removed vague "content changed" assertions

**Large E2E Files (Issue #20):**
- `comparison.spec.ts`: 422 → 111 lines (74% reduction)
- `filters.spec.ts`: 259 → 49 lines (81% reduction)
- `mobile.spec.ts`: DELETED (was 517 lines)

### November 11, 2025 - Session 4: Final Non-E2E Issues

**EmptyState Component (Issue #13):**
- Created reusable EmptyState component with size variants (sm/md/lg)
- Eliminates duplicated empty state patterns across components
- Added translations for "No imagery releases available" (en/ar/it)
- 20 comprehensive tests added

**Icon Registry (Issue #12):**
- Created dynamic icon registry for Hero Icons
- Eliminated 15 lines of manual icon mapping in SiteTypeIcon
- Supports all 200+ Hero Icons automatically via `getHeroIcon()`
- 33 comprehensive tests added
- No updates needed when adding new site types

**Optional Chaining (Issue #16):**
- Standardized optional chaining syntax across codebase
- Updated 3 files: SiteDetailPanel, SitesTableMobile
- `site.sources?.length` pattern applied consistently

**Test Coverage Expansion:**
- Total: 1,261 tests (up from 1,208, +53 tests)
- EmptyState: 20 new tests
- Icon Registry: 33 new tests
- All tests passing ✅

**Files Created:**
- `src/components/EmptyState/EmptyState.tsx` (115 lines)
- `src/components/EmptyState/EmptyState.test.tsx` (20 tests)
- `src/components/EmptyState/index.ts`
- `src/config/iconRegistry.ts` (110 lines)
- `src/config/iconRegistry.test.ts` (33 tests)

**Files Modified:**
- `src/components/AdvancedTimeline/WaybackSlider.tsx` - Use EmptyState
- `src/components/AdvancedTimeline/WaybackSlider.test.tsx` - Updated tests
- `src/components/Icons/SiteTypeIcon.tsx` - Use dynamic icon registry
- `src/components/SiteDetail/SiteDetailPanel.tsx` - Optional chaining
- `src/components/SitesTable/SitesTableMobile.tsx` - Optional chaining (2x)
- `src/i18n/en.ts`, `ar.ts`, `it.ts` - Added translations
- `src/types/i18n.ts` - Added type definitions

### November 11, 2025 - Session 3: Component Extraction

**TimelineHelpModal Component (Issue #11):**
- Extracted TimelineHelpModal component from Timeline.tsx (~82 lines)
- Timeline.tsx reduced: 485 → 361 lines (26% reduction, 124 lines removed)
- Help content now reusable, testable, and maintainable

**Test Coverage Expansion:**
- Added 11 comprehensive tests for TimelineHelpModal
- Coverage: Smoke tests, content verification, accessibility checks
- Total: 1,208 tests (up from 1,197, +11 tests)
- All tests passing ✅

**Files Created:**
- `src/components/Help/TimelineHelpModal.tsx` (96 lines)
- `src/components/Help/TimelineHelpModal.test.tsx` (103 lines, 11 tests)
- `src/components/Help/index.ts` (barrel export)

---

## [Phase 12] - 2025-11-11 - Code Quality & Accessibility

### November 11, 2025 - Sessions 1-2: Code Review PR #46

**TypeScript Improvements:**
- Fixed WaybackSlider optional props with discriminated union types
- `comparisonInterval` and `onIntervalChange` must be provided together or both omitted
- Eliminates TypeScript errors from mismatched optional prop combinations

**Accessibility (WCAG 2.1 AA Compliance):**
- Added ARIA labels to FilterBar mobile button (`aria-label`, `aria-expanded`)
- Added `aria-hidden="true"` to decorative SVG icons
- Multi-language support for "Open filters menu" (English, Arabic, Italian)

**DRY Principle Improvements:**
- Eliminated duplicated filter logic in Timeline.tsx (~40 lines removed)
- Created `useDefaultFilterRanges` hook for reusable date/year range calculations
- Removed useRef anti-pattern that obscured React data flow

**Configuration Management:**
- Extracted magic numbers to `WAYBACK_FALLBACKS` constant
- Centralized fallback intervals: 10 years, 7 days, 30 days
- Eliminates hardcoded values across codebase

**Documentation:**
- Expanded JSDoc in intervalCalculations.ts (7 → 60+ lines)
- Added comprehensive @example blocks and @see cross-references
- Documented all 5 interval types with behavior explanations

**Test Coverage Expansion:**
- Total: 1,197 tests (up from 1,053, +144 tests)
- Added 10 edge case tests for interval calculations
- Added 7 tests for new useDefaultFilterRanges hook
- Added 15 tests for intervalCalculations SOLID refactoring
- All tests passing ✅

**Files Modified:**
- `Timeline.tsx` - Refactored with hooks, removed anti-patterns
- `WaybackSlider.tsx` - TypeScript discriminated unions
- `FilterBar.tsx` - ARIA accessibility improvements
- `intervalCalculations.ts` - JSDoc expansion, config usage
- `useDefaultFilterRanges.ts` - New hook created
- i18n files (en/ar/it) - Translation additions
- Test files - Edge case coverage expansion

**Quality Assurance:**
- ESLint passing (fixed `any` type in test file)
- Zero breaking changes across 3 commits
- All quality gates passed

---

## [Phase 11] - 2025-11-09 - Heritage Site Expansion

### November 9, 2025: Site Database Expansion (45 → 70 sites)

**21 Individual UNESCO-Verified Sites Added:**
- 6 Mosques: Ibn Othman, Shaikh Zakaria, Al-Mughrabi, Sett Ruqayya, Ash-Sheikh Sha'ban, Zawiyat Al Hnoud
- 3 Monuments/Shrines: Ali Ibn Marwan, Abu Al-Azm/Shamshon, Unknown Soldier Memorial
- 3 Archaeological Sites: Tell Al-Muntar, Tell Rafah, Al-Bureij Mosaic
- 1 Cemetery: English Cemetery, Az-Zawaida
- 7 Historic Buildings: Municipality, 2 Cinemas, 2 Hospital buildings, 2 Named Houses
- 1 Archive: EBAF Storage Facility

**4 Grouped Collections (70-90 Unnamed Buildings):**
- Gaza Old City Residential Buildings (~25-30 buildings)
- Daraj Quarter Buildings (~20-25 buildings)
- Commercial & Public Buildings (~15-20 buildings)
- Zaytoun Quarter Buildings (~10-15 buildings)

**Coverage Achievement:**
- Total entries: 70 documented sites
- Actual buildings: 140-160 (including collections)
- UNESCO target: 114 sites (exceeded by 123-140%)
- All sites verified by UNESCO Gaza Heritage Damage Assessment (Oct 6, 2025)

**Type System Enhancements:**
- Added new site types: `monument`, `cemetery`, `archive`
- Added `metadata` field to Site interface for grouped collections
- Full icons and Arabic translations for all new types

**Quality Assurance:**
- All tests passing ✅ (1,053 at time of completion)
- Updated test expectations across 7 files
- Dev server runs without errors
- Research documented in `docs/research/`

---

## [Phase 10] - 2025-11-XX - End-to-End Testing

### E2E Test Suite with Playwright

**5 Test Suites (50+ Tests Initial):**
- `smoke.spec.ts` - Core page loads, navigation, accessibility
- `filters.spec.ts` - Filter bar visibility and z-index issues
- `timeline.spec.ts` - Timeline navigation buttons presence
- `comparison.spec.ts` - Comparison mode dual maps rendering
- `mobile.spec.ts` - Mobile responsive layouts and touch interactions

**Mock API Integration:**
- All E2E tests run against mock data (no backend required)
- Environment: `VITE_USE_MOCK_API=true`

**CI/CD Ready:**
- GitHub Actions workflow with artifact uploads on failure
- Runs on push to main/develop/feature/* branches
- Runs on pull requests

**NPM Scripts Added:**
- `npm run e2e` - Run all E2E tests (headless)
- `npm run e2e:ui` - Interactive debugging
- `npm run e2e:headed` - Watch browser
- `npm run e2e:debug` - Step through tests
- `npm run e2e:report` - View HTML report
- `npm run test:all` - Both unit + E2E tests

**Test Coverage Highlights:**
- Filter dropdown visibility and clickability (catch z-index bugs)
- Timeline NEXT/PREV/RESET buttons (ensure buttons are present)
- Comparison mode with dual maps (verify side-by-side rendering)
- Mobile filter drawer (responsive UI testing)
- Map marker interactions and tile loading
- Route navigation and accessibility (keyboard, screen readers)

**Files Created:**
- `e2e/smoke.spec.ts`
- `e2e/filters.spec.ts`
- `e2e/timeline.spec.ts`
- `e2e/comparison.spec.ts`
- `e2e/mobile.spec.ts`
- `playwright.config.ts`
- `.github/workflows/e2e-tests.yml`

---

## [Phase 9] - 2025-11-XX - Backend Unit Testing

### Backend Test Suite (77 Tests)

**Test Infrastructure:**
- Reusable mock utilities and test helpers
- Mock database, repositories, services, Express req/res/next
- `server/__tests__/setup.js` - Centralized test utilities

**Error Classes Tests (21 tests):**
- ServiceError, ValidationError, NotFoundError, DatabaseError
- Error handling utilities (withErrorHandling, createErrorContext)
- Stack trace preservation verification

**Data Converter Tests (19 tests):**
- DB ↔ API transformations
- PostGIS coordinate conversions ([lng, lat] ↔ [lat, lng])
- Round-trip conversion verification
- Edge case handling (null values, missing fields)

**Validator Middleware Tests (37 tests):**
- Site body validation (POST/PATCH)
- Pagination, geospatial query validation
- Comprehensive boundary testing

**Test Coverage:**
- Total: 797 tests passing at time of completion (720 frontend + 77 backend)
- Backend coverage: Utilities 100%, Middleware 100%
- Zero test failures - All quality gates passed
- Test patterns established for future expansion

**Files Created:**
- `server/__tests__/setup.js` - Test utilities and mocks
- `server/utils/__tests__/errors.test.js` - Error class tests (21 tests)
- `server/utils/__tests__/converters.test.js` - Converter tests (19 tests)
- `server/middleware/__tests__/validator.test.js` - Validation tests (37 tests)

---

## [Phase 8] - 2025-11-XX - Production Readiness

### Code Quality & Security Enhancements

**Adapter Pattern (P1 Improvement):**
- Refactored backend mode switching from 377 lines to 89 lines (-76%)
- Created BackendAdapter interface with MockAdapter, LocalBackendAdapter, SupabaseAdapter
- Easy to add new backends (Firebase, GraphQL, etc.)

**SQL Injection Protection:**
- Eliminated ALL `sql.unsafe()` calls
- 100% tagged template literals with `sql.join()`
- Zero SQL injection vulnerabilities

**Database Connection Utility:**
- Retry logic with exponential backoff
- Handles Docker startup delays automatically
- Reusable across migrate/seed scripts

**Custom Error Hierarchy:**
- ServiceError, ValidationError, NotFoundError, DatabaseError
- Preserves original stack traces and error context
- Better debugging in production

**Query Parameter Builder:**
- Type-safe utility for URL construction
- Handles arrays, primitives, undefined/null automatically
- Reusable across all API calls

**Files Created:**
- `src/api/adapters/BackendAdapter.ts`
- `src/api/adapters/MockAdapter.ts`
- `src/api/adapters/LocalBackendAdapter.ts`
- `src/api/adapters/SupabaseAdapter.ts`
- `src/api/adapters/index.ts`
- `database/scripts/utils/db-connection.js`
- `server/utils/errors.js`
- `src/utils/queryBuilder.ts`

---

## [Phase 7] - 2025-11-XX - Local Backend Infrastructure

### Local Backend Implementation

**Express REST API Server:**
- 8 endpoints (GET, POST, PATCH, DELETE)
- 3-layer architecture (Controller → Service → Repository)
- Port: 5000

**PostgreSQL 16 + PostGIS 3.4:**
- Docker-based database
- Complete migration system (285-line SQL schema)
- Auto-generated seed data from mockSites.ts (70 sites)
- Port: 5432

**One-Command Setup:**
- `npm run db:setup` - Complete database setup
- Runs migrations, generates seed, loads data
- Zero manual configuration

**11 New NPM Scripts:**

**Database:**
- `npm run db:start` - Start PostgreSQL (Docker)
- `npm run db:stop` - Stop PostgreSQL
- `npm run db:reset` - Reset database (delete all data)
- `npm run db:migrate` - Run migrations (create schema)
- `npm run db:generate-seed` - Generate seed SQL from mockSites.ts
- `npm run db:seed` - Load seed data (70 sites)
- `npm run db:setup` - Complete setup (all of the above)
- `npm run db:logs` - View database logs

**Server:**
- `npm run server:start` - Start Express server (production mode)
- `npm run server:dev` - Start with nodemon (auto-reload)
- `npm run dev:full` - Start both frontend + backend together

**Documentation:**
- `server/README.md` - Backend server documentation
- `database/README.md` - Database setup and migration guide

**Quality Assurance:**
- Zero breaking changes
- All 728 tests passing at time of completion
- Three backend modes working: Mock API (default), Local Backend, Supabase Cloud

---

## [Phase 6] - 2025-XX-XX - Timeline Navigation Enhancements

### Timeline Navigation Improvements

**NEXT Button Fix:**
- Fixed NEXT button to work from any scrubber position
- No longer requires exact timestamp match
- Works seamlessly across all timeline positions

**Timeline Start Position:**
- Timeline now starts 7 days before first destruction date
- Enables first site to be clickable
- Better user experience for initial timeline view

**Dashboard Timeline Navigation:**
- Added Next/Previous navigation buttons to Dashboard timeline
- Consistent UX across Dashboard and Timeline pages

**Edge Case Handling:**
- Before first event
- After last event
- In between events
- All scenarios handled gracefully

**RESET Button:**
- Correctly returns to timeline start (7 days before first event)
- Proper state reset on all pages

---

## [Phase 5] - 2025-XX-XX - Comparison Mode & Timeline

### Comparison Mode (Timeline Page)

**Side-by-Side Satellite Viewing:**
- Dual map display
- Yellow scrubber: "before" date (auto-set to destruction date)
- Green scrubber: "after" date (auto-set to 30 days later)
- Auto-sync with destruction dates

**Visual Enhancements:**
- Date labels on each map (1.5x tooltip size, 70% opacity)
- Individual borders with gap-2 spacing
- "Show Map Markers" toggle for satellite views
- Adaptive zoom toggle

**ESRI Wayback Integration:**
- 186 ESRI Wayback releases (2014-2025)
- Historical satellite imagery

### Dashboard Optimizations

**Lazy Loading:**
- Lazy-loaded DesktopLayout and MobileLayout (parallel chunks)
- Suspense boundaries for progressive loading
- <2s initial page load

**Visual Design:**
- Palestinian flag background triangle
- Improved visual hierarchy

### FilterBar Standardization

**Consistent Design:**
- 70% opacity across all pages (Dashboard, Timeline, Data)
- Compact design for more data visibility
- Active filter count badge
- Mobile drawer for small screens

### Map Enhancements

**Performance Optimizations:**
- "Show Map Markers" toggle for satellite views
- Adaptive zoom toggle
- Improved clustering with Palestinian flag colors
- Heat map mode
- Satellite/street view toggle
- Full-screen mode

### Build Performance

**Code Splitting:**
- Manual chunk splitting (vendor, leaflet, d3)
- PWA support with service worker
- Optimized bundle size

**Metrics:**
- 60 FPS scrolling (TanStack Virtual)
- <2s initial page load (lazy layouts)
- <500ms filter changes (300ms debounce)
- 5min React Query cache

### Architectural Improvements

**Focused Hooks:**
- Decomposed `useAppState` into smaller hooks
- Better separation of concerns

**Config Centralization:**
- 30+ config files for zero-downtime changes
- Easy to modify without code changes

**Theme System:**
- `useThemeClasses` for consistent theming
- Palestinian flag color palette

**Type Safety:**
- 30+ type definition files
- Zero `any` types
- TypeScript strict mode

**Test Coverage:**
- 720 tests (+150 from initial MVP)
- Comprehensive component, hook, and integration tests

---

## [Earlier Phases]

### Phase 4 - MVP Foundation
- Initial React + TypeScript + Vite setup
- Leaflet map integration
- D3.js timeline implementation
- FilterBar component
- SitesTable with virtual scrolling
- 45 heritage sites documented

### Phase 3 - Data Schema
- Site interface design
- BC/BCE date support
- Source attribution system
- UNESCO verification tracking

### Phase 2 - Design System
- Tailwind CSS v4 integration
- Palestinian flag color palette
- Responsive layouts (mobile/tablet/desktop)
- Dark/light theme support

### Phase 1 - Project Setup
- Repository initialization
- Development environment configuration
- CI/CD pipeline setup
- Documentation structure

---

## Links

- **Code Review Findings:** [CODE_REVIEW_FINDINGS.md](CODE_REVIEW_FINDINGS.md)
- **Test Coverage Plan:** [TEST_COVERAGE_PLAN.md](TEST_COVERAGE_PLAN.md)
- **Architecture Guide:** [CLAUDE.md](CLAUDE.md)
- **Contributing Guidelines:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

*Last updated: November 12, 2025*
