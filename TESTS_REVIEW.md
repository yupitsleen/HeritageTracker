# Heritage Tracker - Test Suite Review

**Date:** November 10, 2025 (Updated)
**Reviewer:** Claude Code
**Test Count:** **1,165 passing tests** (1,088 frontend + 77 backend) ⬆️ +112 from review
**Test Files:** 76 files (+3 new)

---

## ✅ Progress Update (Latest Session)

**Completed:** P0 (Critical) + P1 (High Priority) improvements

### P0 - Critical Hook Testing (Previous Session):
1. ✅ [src/hooks/useFilteredSites.test.ts](src/hooks/useFilteredSites.test.ts) - **19 tests**
2. ✅ [src/hooks/useAppState.test.ts](src/hooks/useAppState.test.ts) - **30 tests**
3. ✅ [src/hooks/useHeritageStats.test.ts](src/hooks/useHeritageStats.test.ts) - **33 tests**

### P1 - High Priority Improvements (Current Session):

**1. Fixed Brittle Selectors (Unit Tests):**
- ✅ [src/components/Timeline/TimelineControls.test.tsx](src/components/Timeline/TimelineControls.test.tsx)
  - Replaced `.querySelector()` with semantic `screen.getByLabelText()` / `screen.getByRole()`
  - Changed from testing CSS classes to testing accessibility and behavior
  - 4 tests refactored (lines 85-172)
- ✅ [src/components/Map/ComparisonMapView.test.tsx](src/components/Map/ComparisonMapView.test.tsx)
  - Replaced `.hasAttribute("style")` check with computed background color verification
  - Tests now verify visual behavior, not implementation details (line 213-243)

**2. Expanded E2E Test Coverage:**
- ✅ [e2e/filters.spec.ts](e2e/filters.spec.ts) - **NEW FILE** - 8 test suites for filter workflows
  - Filter dropdown interactions
  - Multi-select filtering
  - Search functionality
  - Clear filters workflow
  - Filter badge visibility
  - Mobile responsive filter drawer
- ✅ [e2e/comparison.spec.ts](e2e/comparison.spec.ts) - **NEW FILE** - 9 test suites for comparison mode
  - Dual map rendering
  - Before/after date selection
  - Date label display and colors
  - Map synchronization
  - Site selection workflow
  - Map controls (zoom, markers)
  - Responsive behavior
- ✅ [e2e/mobile.spec.ts](e2e/mobile.spec.ts) - **NEW FILE** - 11 test suites for mobile behavior
  - Hamburger menu navigation
  - Filter drawer on mobile
  - Touch interactions
  - Table scrolling
  - Map tap gestures
  - Button sizing for touch targets
  - Viewport adaptation (portrait/landscape)

**3. Tightened E2E Assertions:**
- ✅ [e2e/smoke.spec.ts](e2e/smoke.spec.ts) - Strengthened assertions
  - Replaced `waitForTimeout(1000)` with semantic `waitForSelector('body', { state: 'visible' })`
  - Changed critical errors from `≤ 2` to `= 0` (zero tolerance)
  - Reduced page load threshold from 10s to 5s (catches performance regressions)
  - Strengthened accessibility test: focus must be on interactive element (BUTTON|A|INPUT|SELECT|TEXTAREA), not just "truthy"

**Impact:**
- Test count: 1,053 → **1,165** (+112 tests, +10.6%)
- E2E test files: 2 → **5** (+3 new E2E suites)
- Coverage: P0 hooks tested ✓, P1 brittle tests fixed ✓, E2E gaps filled ✓
- Pass rate: 100% (all 1,165 tests passing)
- Lint: Clean ✓

**Committed:**
```
feat/visualFixes 49fd647 (P0)
test: add comprehensive tests for critical hooks (P0 improvements)
```

**Ready to Commit (P1):**
```
Modified Files (5):
- src/components/Timeline/TimelineControls.test.tsx
- src/components/Map/ComparisonMapView.test.tsx
- e2e/smoke.spec.ts
- TESTS_REVIEW.md

New Files (3):
- e2e/filters.spec.ts
- e2e/comparison.spec.ts
- e2e/mobile.spec.ts

✅ All 1,165 tests passing
✅ Lint clean
```

---

## Quick Start (For Next Claude Session)

**Context:**
- Project: Palestinian heritage destruction tracker
- Stack: React 19 + TypeScript 5.9 + Vitest + Playwright
- Quality Gate: **All 1,165 tests MUST pass before commits** (per [CLAUDE.md](CLAUDE.md))

**Running Tests:**
```bash
npm test              # Unit tests (watch mode)
npm test -- --run     # Single run (for CI)
npm run e2e           # E2E tests (Playwright)
npm run test:all      # All tests (unit + E2E)
```

**Key Files:**
- Test config: [vitest.config.ts](vitest.config.ts), [playwright.config.ts](playwright.config.ts)
- Test setup: [vitest.setup.ts](vitest.setup.ts)
- Mock utilities: [src/test-utils/renderWithTheme.tsx](src/test-utils/renderWithTheme.tsx)
- Backend mocks: [server/__tests__/setup.js](server/__tests__/setup.js)

**Next Priority Order:**
1. ~~**P0 (Critical):** Missing hook tests~~ ✅ **COMPLETED**
2. ~~**P1 (High):** Brittle selectors in TimelineControls.test.tsx~~ ✅ **COMPLETED**
3. ~~**P1 (High):** Brittle selectors in ComparisonMapView.test.tsx~~ ✅ **COMPLETED**
4. ~~**P1 (High):** E2E coverage gaps (filters, comparison mode, mobile)~~ ✅ **COMPLETED**
5. ~~**P1 (High):** Overly lenient E2E assertions~~ ✅ **COMPLETED**
6. **P2 (Medium):** Refactoring for maintainability (see recommendations below)

**Before Starting:**
- Read [CLAUDE.md](CLAUDE.md) - Testing philosophy and commit rules
- Check `git status` - Ensure clean working directory
- Run `npm test -- --run` - Verify all 1,165 tests passing

---

## Executive Summary

The Heritage Tracker test suite demonstrates **excellent testing discipline** with comprehensive coverage of complex business logic, strong architectural patterns, and thoughtful organization. This review focuses exclusively on areas for improvement, with the understanding that the current test suite is already production-ready and well-maintained.

### Key Strengths
- ✅ **Comprehensive utility/calculation testing** - Complex logic well-covered (42 tests for heritage calculations)
- ✅ **Backend architecture** - 100% coverage of service/repository/middleware layers
- ✅ **Clear patterns** - Consistent testing approaches, good use of helpers
- ✅ **Fast execution** - 1,053 tests in ~42 seconds
- ✅ **Strategic coverage** - Focus on critical paths, not shallow 100% coverage

---

## Priority Issues

### ✅ P0 - Critical (COMPLETED)

#### 1. ~~Missing Critical Hook Tests (20 of 27 hooks untested)~~ ✅ **COMPLETED**

**Status:** ✅ All 3 critical hooks now have comprehensive test coverage

**Completed Coverage:**
- ✅ `useFilteredSites` - **19 tests** - Filter pipeline, memoization, edge cases
- ✅ `useAppState` - **30 tests** - Modal/filter/site state, integration tests
- ✅ `useHeritageStats` - **33 tests** - Statistics, age analysis, memoization

**Files Created:**
- [src/hooks/useFilteredSites.test.ts](src/hooks/useFilteredSites.test.ts)
- [src/hooks/useAppState.test.ts](src/hooks/useAppState.test.ts)
- [src/hooks/useHeritageStats.test.ts](src/hooks/useHeritageStats.test.ts)

**Remaining Lower Priority Hooks:**
- `useTimelineData` - Timeline data preparation (used in 1 page)
- `useWaybackReleases` - ESRI Wayback API integration (isolated feature)
- These can be tested as needed during future development

---

### 🟡 P1 - High Priority

#### 2. Brittle Selectors in Component Tests

**Issue:** Tests rely on implementation details (CSS classes, DOM structure)

**Examples Found:**
```typescript
// ❌ BRITTLE: Breaks if Tailwind class changes
const expandedControls = container.querySelector('.\\32xl\\:flex');

// ❌ BRITTLE: Breaks if wrapper div removed
const speedWrapper = speedLabel.closest('.\\32xl\\:flex');

// ❌ BRITTLE: Breaks if class name changes
const settingsMenuContainer = container.querySelector('.\\32xl\\:hidden');
```

**Better Approach:**
```typescript
// ✅ ROBUST: Tests user-visible behavior
const speedControl = screen.getByLabelText('Animation speed');

// ✅ ROBUST: Tests functionality, not implementation
expect(screen.getByRole('button', { name: /speed/i })).toBeVisible();

// ✅ ROBUST: Uses data-testid for non-semantic elements
const settingsMenu = screen.getByTestId('settings-menu');
```

**Affected Files:**
- [TimelineControls.test.tsx](src/components/Timeline/TimelineControls.test.tsx) - Lines 105-170
- [ComparisonMapView.test.tsx](src/components/Map/ComparisonMapView.test.tsx) - Lines 232-234

**Recommendation:**
- Replace `.querySelector()` with `screen.getByRole()` / `screen.getByLabelText()`
- Add `data-testid` attributes for elements without semantic roles
- Test **behavior** (is button clickable?) not **structure** (does wrapper have class?)

---

#### 3. Weak E2E Coverage (Only 2 Files)

**Current Coverage:**
- `smoke.spec.ts` - Basic page loads
- `timeline.spec.ts` - Timeline integration

**Missing E2E Tests:**
1. **Filter workflows** - User selects filters → sees filtered results
2. **Export functionality** - User exports CSV/JSON → file downloads
3. **Comparison mode** - User selects site → sees before/after maps
4. **Mobile responsive** - Touch interactions, drawer behavior
5. **Site detail flow** - Click marker → open detail panel → navigate back

**Recommendation:**
```typescript
// e2e/filters.spec.ts
test('user can filter sites by type', async ({ page }) => {
  await page.goto('/');

  // Open filter dropdown
  await page.getByRole('button', { name: /type/i }).click();

  // Select mosque filter
  await page.getByRole('checkbox', { name: /mosque/i }).check();

  // Verify results updated
  await expect(page.getByText(/\d+ sites/i)).toContainText('mosque count');
});

// e2e/comparison.spec.ts
test('user can view before/after comparison', async ({ page }) => {
  await page.goto('/timeline');

  // Select site from list
  await page.getByRole('button', { name: /Great Omari Mosque/i }).click();

  // Verify dual maps rendered
  const maps = page.locator('.leaflet-container');
  await expect(maps).toHaveCount(2);

  // Verify date labels match
  await expect(page.getByText('2023-10-01')).toBeVisible();
});
```

**Why High Priority:**
- E2E tests catch **integration bugs** that unit tests miss
- Visual regressions (z-index, overlapping elements) only caught by E2E
- Current E2E suite wouldn't catch filter dropdown hidden behind navbar

---

#### 4. Overly Lenient E2E Assertions

**Examples:**
```typescript
// ❌ TOO LENIENT: Allows up to 2 critical errors
expect(criticalErrors.length).toBeLessThanOrEqual(2);

// ❌ TOO LENIENT: Accepts 10-second page load
expect(loadTime).toBeLessThan(10000); // 10 seconds!

// ❌ NOT USEFUL: Always passes
expect(focusedElement).toBeTruthy(); // Could be <body>
```

**Better Assertions:**
```typescript
// ✅ STRICT: No critical errors allowed
expect(criticalErrors).toEqual([]);

// ✅ REASONABLE: 3-second target for CI
expect(loadTime).toBeLessThan(3000);

// ✅ MEANINGFUL: Verify interactive element focused
expect(focusedElement.tagName).toMatch(/^(BUTTON|A|INPUT)$/);
```

**Affected File:**
- [smoke.spec.ts](e2e/smoke.spec.ts:131-133) - Lines 112-147

**Recommendation:**
- Tighten performance budgets (3s page load, not 10s)
- Zero critical console errors (exclude known 404s for tiles)
- Verify **specific behavior** (button focused) not generic (element exists)

---

### 🟢 P2 - Medium Priority

#### 5. Test Duplication in Calculation Tests

**Issue:** Repetitive tests for similar multipliers

**Example:**
```typescript
// heritageCalculations.test.ts - Lines 52-114
it("applies UNESCO multiplier (2x)", () => { /* ... */ });
it("applies artifact count multiplier (1.5x for >100 artifacts)", () => { /* ... */ });
it("applies unique site multiplier (2x)", () => { /* ... */ });
it("applies archaeological type multiplier (1.8x)", () => { /* ... */ });
it("applies museum type multiplier (1.6x)", () => { /* ... */ });
// ... 8 more similar tests
```

**Better Pattern:**
```typescript
describe('glow multipliers', () => {
  const multiplierTests = [
    { name: 'UNESCO', props: { unescoListed: true }, expected: 200 },
    { name: 'unique site', props: { isUnique: true }, expected: 200 },
    { name: 'archaeological type', props: { type: 'archaeological' }, expected: 180 },
    { name: 'museum type', props: { type: 'museum' }, expected: 160 },
  ];

  it.each(multiplierTests)('applies $name multiplier', ({ props, expected }) => {
    const site = createBaseSite({ yearBuilt: '2000', ...props });
    expect(calculateGlowContribution(site)).toBe(expected);
  });
});
```

**Benefits:**
- **-50% LOC** (from ~60 lines to ~30 lines)
- Easier to add new multipliers
- Clear pattern for similar tests

**Files to Refactor:**
- [heritageCalculations.test.ts](src/__tests__/heritageCalculations.test.ts:52-114) - Lines 52-163

---

#### 6. Inconsistent Mock Patterns

**Issue:** Mixing inline mocks and vi.mock() across similar tests

**Examples:**

**Pattern A (Good):**
```typescript
// useSites.test.ts - Clean, explicit
vi.mock('../api/sites');

beforeEach(() => {
  vi.clearAllMocks();
});

it('returns sites when fetch succeeds', async () => {
  vi.mocked(sitesApi.getAllSites).mockResolvedValue(mockSites);
  // test...
});
```

**Pattern B (Inconsistent):**
```typescript
// ComparisonMapView.test.tsx - Verbose inline mocks
vi.mock("leaflet", () => ({
  default: {
    divIcon: vi.fn(() => ({})),
    Icon: { /* 8 more lines */ },
  },
}));

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children, className }) => (/* 15 lines of JSX */),
  TileLayer: () => <div data-testid="tile-layer" />,
  // ... 5 more components
}));
```

**Recommendation:**
```typescript
// src/test-utils/leafletMocks.ts (NEW FILE)
export const leafletMocks = {
  'leaflet': () => ({ /* centralized mock */ }),
  'react-leaflet': () => ({ /* centralized mock */ }),
};

// ComparisonMapView.test.tsx (SIMPLIFIED)
import { leafletMocks } from '../../test-utils/leafletMocks';
vi.mock('leaflet', leafletMocks['leaflet']);
vi.mock('react-leaflet', leafletMocks['react-leaflet']);
```

**Benefits:**
- **DRY** - Leaflet mocks reused across 5+ test files
- **Consistency** - Same mock behavior everywhere
- **Maintainability** - Update mock once, fix everywhere

---

#### 7. Missing Integration Tests for Critical Flows

**Coverage Gaps:**

1. **Filter → Map → Timeline Sync**
   - User filters sites → map updates → timeline scrubber moves
   - Currently tested in isolation, not as integrated flow

2. **Site Selection Across Pages**
   - Select site on Dashboard → navigate to Timeline → site remains selected
   - No test verifies state persistence across routes

3. **Export Flow**
   - Apply filters → export CSV → verify filtered data in export
   - No test verifies export respects active filters

**Recommendation:**
```typescript
// src/__tests__/integration/filterMapTimelineSync.test.tsx
describe('Filter → Map → Timeline Integration', () => {
  it('updates all views when filter changes', async () => {
    const { user } = setup(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Apply filter
    await user.click(screen.getByRole('button', { name: /type/i }));
    await user.click(screen.getByRole('checkbox', { name: /mosque/i }));

    // Verify map updates
    await waitFor(() => {
      expect(screen.getAllByTestId('marker')).toHaveLength(mosqueCount);
    });

    // Verify timeline updates
    const timelineDots = screen.getAllByTestId('timeline-dot');
    expect(timelineDots).toHaveLength(mosqueCount);
  });
});
```

---

#### 8. Slow Tests Due to Unnecessary Waits

**Issue:** E2E tests use arbitrary `waitForTimeout()` instead of semantic waits

**Example:**
```typescript
// ❌ SLOW: Arbitrary 1-second wait
await page.waitForTimeout(1000);

// ❌ UNPREDICTABLE: May fail in CI if React takes >1s to hydrate
```

**Better Approach:**
```typescript
// ✅ FAST: Wait for specific condition
await page.waitForSelector('.leaflet-container', { state: 'visible' });

// ✅ SEMANTIC: Wait for React hydration marker
await page.waitForFunction(() => window.__REACT_HYDRATED__ === true);

// ✅ RELIABLE: Wait for network idle
await page.waitForLoadState('networkidle');
```

**Affected File:**
- [smoke.spec.ts](e2e/smoke.spec.ts:99) - Line 99

**Impact:**
- **+1 second per test** = +10 seconds total suite time
- Flaky tests in slow CI environments

---

### 🔵 P3 - Low Priority (Nice to Have)

#### 9. Test Organization Could Be Clearer

**Current Structure:**
```
src/__tests__/           # Mixed integration + specialized tests
src/components/**/*.test.tsx  # Component tests
src/hooks/*.test.ts      # Hook tests
src/utils/*.test.ts      # Utility tests
```

**Suggested Improvement:**
```
src/__tests__/
├── integration/         # Cross-component flows
├── unit/                # Isolated utility tests
└── setup/               # Test utilities

src/components/**/__tests__/  # Co-located component tests
src/hooks/__tests__/           # Co-located hook tests
```

**Benefits:**
- **Clearer intent** - Integration vs unit tests separated
- **Easier navigation** - All tests for a component in one place
- **Better discoverability** - Test files next to source files

**Note:** This is cosmetic and not urgent. Current structure works fine.

---

#### 10. Opportunity for Visual Regression Testing

**Gap:** No tests for visual/styling changes

**Examples of bugs not caught:**
- FilterBar z-index overlapped by map
- Timeline buttons hidden on mobile
- Date labels incorrect size/opacity

**Recommendation (Future Enhancement):**
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'on', // Enable visual comparison
      },
    },
  ],
});

// e2e/visual/timeline.spec.ts
test('timeline layout is correct', async ({ page }) => {
  await page.goto('/timeline');
  await expect(page).toHaveScreenshot('timeline-desktop.png');
});
```

**Tools to Consider:**
- Playwright screenshot comparison (built-in)
- Percy.io (visual regression SaaS)
- Chromatic (Storybook + visual testing)

**Note:** This is enhancement for future. Current testing adequate for MVP.

---

## Areas of Excellence (Keep Doing This!)

### ✅ 1. Outstanding Backend Test Coverage

**Example: [sitesService.test.js](server/services/__tests__/sitesService.test.js)**

**What's Great:**
- **100% coverage** of all service methods
- **Boundary testing** - Invalid IDs, coordinates, null values
- **Error context testing** - Verifies error messages include context
- **Parallel execution testing** - Line 128-149 verifies Promise.all() optimization

**Exemplary Test:**
```typescript
it('fetches count and data in parallel', async () => {
  let countCalled = false;
  let paginatedCalled = false;

  sitesRepo.count.mockImplementation(async () => {
    countCalled = true;
    return 10;
  });

  sitesRepo.findPaginated.mockImplementation(async () => {
    paginatedCalled = true;
    // Both should be called before either resolves
    expect(countCalled || paginatedCalled).toBe(true);
    return [mockSite];
  });

  await sitesService.getPaginatedSites();

  expect(countCalled).toBe(true);
  expect(paginatedCalled).toBe(true);
});
```

**Why Excellent:**
- Tests **performance optimization** (parallel vs sequential)
- Verifies **actual behavior** not just mocks called
- Would catch regression if changed to sequential

---

### ✅ 2. Comprehensive Edge Case Testing

**Example: [siteFilters.test.ts](src/utils/siteFilters.test.ts)**

**What's Great:**
- **BC/BCE date handling** - Lines 128-168
- **Century parsing** - "7th century" → 650 CE
- **Islamic calendar** - AH to Gregorian conversion
- **Null/undefined handling** - Lines 279-300
- **Whitespace trimming** - Line 298

**Exemplary Test:**
```typescript
describe("edge cases and error handling", () => {
  it("returns null for empty string", () => {
    expect(parseYearBuilt("")).toBeNull();
  });

  it("handles whitespace correctly", () => {
    expect(parseYearBuilt("  1200 CE  ")).toBe(1200);
  });

  it("handles complex formats from existing data", () => {
    // From mockSites: "800 BCE - 1100 CE"
    expect(parseYearBuilt("800 BCE - 1100 CE")).toBe(-800);
  });
});
```

**Why Excellent:**
- Tests **real-world messy data** ("800 BCE - 1100 CE")
- Covers **all input types** (null, undefined, empty, whitespace)
- Would catch regressions in complex parsing logic

---

### ✅ 3. Smart Test Helper Functions

**Example: [filterStateAdapter.test.ts](src/utils/filterStateAdapter.test.ts)**

**What's Great:**
- **Round-trip conversion tests** - Lines 312-330
- **Mock data reuse** - Lines 22-76 define once, reuse 40 times
- **Helper constants** - `emptyLegacyState`, `populatedLegacyState`

**Exemplary Test:**
```typescript
describe("Round-trip conversion", () => {
  it("should maintain data through legacy→registry→legacy conversion", () => {
    const original = populatedLegacyState;
    const registry = legacyToRegistryState(original);
    const backToLegacy = registryToLegacyState(registry);

    expect(backToLegacy.searchTerm).toBe(original.searchTerm);
    expect(backToLegacy.selectedTypes).toEqual(original.selectedTypes);
    // ... all fields verified
  });
});
```

**Why Excellent:**
- **High-value test** - Verifies data integrity through transformations
- **Catches subtle bugs** - Date timezone issues, null vs undefined
- **Property-based testing flavor** - Tests relationship, not specific output

---

### ✅ 4. Accessibility Testing

**Example: [smoke.spec.ts](e2e/smoke.spec.ts)**

**What's Great:**
- **Keyboard navigation** - Lines 151-162
- **ARIA labels** - Multiple component tests verify aria-label presence
- **Focus management** - Verifies Tab key moves focus

**Exemplary Test:**
```typescript
test('interactive elements are keyboard accessible', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Tab through first few elements
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  // Should have moved focus
  const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
  expect(focusedElement).toBeTruthy();
});
```

**Why Excellent:**
- **Tests real accessibility** - Keyboard users can navigate
- **E2E level** - Catches tab index issues, focus traps
- **WCAG 2.1 compliance** - Supports project's accessibility requirement

---

### ✅ 5. Mock Setup Utilities

**Example: [server/__tests__/setup.js](server/__tests__/setup.js)**

**What's Great:**
- **Reusable mock factories** - `createMockDb()`, `createMockRequest()`
- **Realistic mock data** - Lines 6-70 define complete mock site objects
- **Spy utilities** - `createMockResponse()` with automatic spy setup

**Exemplary Code:**
```javascript
export function createMockResponse() {
  const res = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.body = data;
      return this;
    },
    // ... more methods
  };
  return res;
}
```

**Why Excellent:**
- **DRY** - Used across 77 backend tests
- **Realistic** - Mimics Express req/res API accurately
- **Easy to extend** - Add methods as needed

---

## Testing Anti-Patterns Found (Avoid These)

### ❌ 1. Testing Implementation Details

**Bad Example:**
```typescript
// ComparisonMapView.test.tsx:232-234
const overlayLabels = dateLabels.filter(el => el.hasAttribute("style"));
expect(overlayLabels.length).toBe(0);
```

**Why Bad:**
- Breaks if component refactored to use CSS classes instead of inline styles
- Tests **how it's built** not **what it does**

**Good Alternative:**
```typescript
expect(screen.queryByText(/^\d{4}-\d{2}-\d{2}$/)).not.toBeInTheDocument();
```

---

### ❌ 2. Weak Assertions

**Bad Example:**
```typescript
// smoke.spec.ts:161
const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
expect(focusedElement).toBeTruthy(); // Could be <body>!
```

**Why Bad:**
- Always passes (even if focus on <body>)
- Doesn't verify **interactive element** focused

**Good Alternative:**
```typescript
expect(focusedElement.tagName).toMatch(/^(BUTTON|A|INPUT)$/);
```

---

### ❌ 3. Test Descriptions That Lie

**Bad Example:**
```typescript
it("does not show Sync Map button in normal mode", () => {
  // ... test code ...
  expect(syncButtonInExpanded).not.toBeInTheDocument();
});
```

**Why Bad:**
- Sync Map button **might be in settings menu** (not tested)
- Description says "does not show" but test only checks expanded controls

**Good Alternative:**
```typescript
it("hides Sync Map button from expanded controls in normal mode", () => {
  // More specific description matches what's actually tested
});
```

---

## Recommendations Summary

### Immediate Actions (P0)

1. **Add tests for critical hooks** (useFilteredSites, useAppState, useHeritageStats)
   - **Effort:** 2-3 days
   - **Impact:** High - Protects core functionality

### Short-Term (P1 - Next Sprint)

2. **Fix brittle selectors** in TimelineControls and ComparisonMapView tests
   - **Effort:** 4 hours
   - **Impact:** Medium - Reduces maintenance burden

3. **Expand E2E coverage** - Add filter, comparison, export workflows
   - **Effort:** 1-2 days
   - **Impact:** High - Catches integration bugs

4. **Tighten E2E assertions** - Remove lenient thresholds
   - **Effort:** 2 hours
   - **Impact:** Medium - Catches performance regressions

### Medium-Term (P2 - Next Month)

5. **Refactor calculation tests** - Use `it.each()` for multiplier tests
   - **Effort:** 2 hours
   - **Impact:** Low - Code quality improvement

6. **Centralize mock patterns** - Create `src/test-utils/leafletMocks.ts`
   - **Effort:** 3 hours
   - **Impact:** Low - Easier maintenance

7. **Add integration tests** - Filter → Map → Timeline sync flows
   - **Effort:** 1 day
   - **Impact:** Medium - Better coverage of user journeys

8. **Remove arbitrary waits** in E2E tests
   - **Effort:** 1 hour
   - **Impact:** Medium - Faster, more reliable tests

### Future Enhancements (P3 - Backlog)

9. **Reorganize test structure** - Co-locate tests with source files
   - **Effort:** 1 day
   - **Impact:** Low - Better organization

10. **Add visual regression testing** - Playwright screenshot comparison
    - **Effort:** 2-3 days
    - **Impact:** Medium - Catches styling regressions

---

## Metrics & Benchmarks

### Current Performance
- **Total Tests:** 1,053
- **Execution Time:** ~42 seconds (unit tests)
- **E2E Time:** ~2-3 minutes
- **Pass Rate:** 100% (2 skipped)

### Target Metrics (After Improvements)
- **Total Tests:** 1,150+ (+100 from hook/integration tests)
- **Execution Time:** <45 seconds (unit tests remain fast)
- **E2E Time:** <3 minutes (remove arbitrary waits)
- **Coverage Gaps:** 0 critical hooks untested

---

## Conclusion

The Heritage Tracker test suite is **production-ready** with excellent coverage of complex logic and strong architectural patterns. The recommendations above are **incremental improvements**, not blockers.

**Key Takeaways:**
1. **Strengths:** Backend testing, edge case coverage, test utilities
2. **Top Priority:** Test critical hooks (useFilteredSites, useAppState)
3. **Quick Wins:** Fix brittle selectors, tighten E2E assertions
4. **Future Investment:** Expand E2E coverage, add visual regression testing

**Overall Grade:** **A- (90/100)**
- **Coverage:** A (excellent for critical paths)
- **Quality:** A- (some brittle tests, but mostly robust)
- **Maintainability:** B+ (some duplication, but well-organized)
- **Performance:** A (fast execution, good parallelization)

The test suite reflects **thoughtful engineering** and **pragmatic testing** - testing what matters, not chasing 100% coverage. Continue this approach while addressing the critical hook testing gap.

---

**Generated:** 2025-11-10
**Next Review:** After P0/P1 recommendations implemented
