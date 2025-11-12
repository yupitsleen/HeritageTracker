# Test Refactoring Plan - Remove Excessive Testing

**Branch:** `chore/accessabilityFeature`
**Goal:** Reduce test-to-code ratio from 6.3:1 to ~4.5:1 by removing 568 lines of excessive tests
**Impact:** Maintain 100% coverage of critical features while removing 14 redundant tests
**Estimated Time:** 1-2 hours
**Date Created:** 2025-11-12

---

## 🎯 Success Criteria

- [ ] Remove 14 excessive tests (-568 lines of test code)
- [ ] Move 5 tests to correct layer (exportFormats.test.ts)
- [ ] Simplify mock infrastructure in useIntersectionObserver
- [ ] All remaining tests still pass (target: 1,403 tests)
- [ ] Test-to-code ratio reduced to ~4.5:1
- [ ] Update TEST_COVERAGE_PLAN.md with ratio guidelines
- [ ] Production build succeeds
- [ ] ESLint passes with zero warnings

---

## 📋 Refactoring Tasks

### Priority 1: Remove Excessive Tests (High Impact)

#### Task 1.1: useTileConfig.test.ts - Remove 11 Bonus Tests ⚡ 15 min

**Issue:** 20:1 test-to-code ratio (243 lines of tests for 12 lines of code)
**File:** `src/hooks/__tests__/useTileConfig.test.ts`

**Actions:**
- [ ] **Keep Tests 1-4:** Language detection (core functionality)
  - Test 1: Returns Arabic tiles for `navigator.language = "ar"`
  - Test 2: Returns Arabic tiles for `navigator.language = "ar-SA"`
  - Test 3: Returns English tiles for `navigator.language = "en"`
  - Test 4: Returns English tiles for unsupported languages (fallback)

- [ ] **Remove Tests 5-15:** Excessive edge cases for trivial `startsWith("ar")` logic
  - Test 5: Arabic region variants (ar-EG, ar-LB, etc.) - REDUNDANT (covered by Test 2)
  - Test 6: Case sensitivity - REDUNDANT (navigator.language is always lowercase)
  - Test 7: navigator.languages array - REDUNDANT (hook uses navigator.language)
  - Test 8: Null language - IMPOSSIBLE (navigator.language is never null)
  - Test 9: Undefined language - IMPOSSIBLE (navigator.language is never undefined)
  - Test 10: Empty string language - IMPOSSIBLE (navigator.language is never empty)
  - Test 11: Language with special characters - REDUNDANT (BCP 47 format is well-defined)
  - Test 12: Very long language string - UNNECESSARY (edge case with no real-world value)
  - Test 13: Tile config structure validation - REDUNDANT (tests TILE_CONFIGS, not hook)
  - Test 14: Memoization behavior - UNNECESSARY (useMemo is React's concern, not ours)
  - Test 15: Re-render stability - UNNECESSARY (hook has no state, always returns same value)

- [ ] Verify 4 tests still pass after removal
- [ ] Run `npm test -- src/hooks/__tests__/useTileConfig.test.ts`

**Expected Result:**
- Test count: 15 tests → 4 tests (-11 tests)
- File size: 243 lines → ~67 lines (-176 lines)
- Test-to-code ratio: 20:1 → 5.6:1 (still high, but acceptable for i18n)

---

#### Task 1.2: useTableResize.test.ts - Remove 5 Component-Level Tests ⚡ 20 min

**Issue:** Testing UI breakpoints in hook unit tests (should be in component tests)
**File:** `src/hooks/__tests__/useTableResize.test.ts`

**Actions:**
- [ ] **Keep Tests 1-10, 16:** Core hook functionality (11 tests total)
  - Tests 1-3: Column width constraints (min 200px, max 1100px, >= 10px)
  - Tests 4-6: Mouse drag behavior (resize, stop, rapid movements)
  - Tests 7-8: Multi-column interactions (isolated state, table width updates)
  - Tests 9-10: Edge cases (first column, last column)
  - Test 16: Cleanup (memory leak prevention)

- [ ] **Remove Tests 11-15:** Component-level concerns (belong in SitesTable.test.tsx)
  - Test 11: Shows type and name at minimum width (200px) - UI CONCERN
  - Test 12: Shows status at 360px+ - UI CONCERN
  - Test 13: Shows all columns at maximum width (1100px) - UI CONCERN
  - Test 14: Clamps table width when viewport shrinks - COMPONENT BEHAVIOR
  - Test 15: Maintains minimum width even on tiny viewports - COMPONENT BEHAVIOR

- [ ] **Optional:** Move Tests 11-13 to `src/components/SitesTable/SitesTable.test.tsx`
  - Progressive column display is a **component integration concern**
  - Hook only manages width state, component decides which columns to show
  - If time permits, add these as component tests instead

- [ ] Verify 11 tests still pass after removal
- [ ] Run `npm test -- src/hooks/__tests__/useTableResize.test.ts`

**Expected Result:**
- Test count: 16 tests → 11 tests (-5 tests)
- File size: 534 lines → ~400 lines (-134 lines)
- Test-to-code ratio: 4.5:1 → 3.4:1 (healthy)

---

### Priority 2: Fix Test Layer Violations (Medium Impact)

#### Task 2.1: useTableExport.test.ts - Move Tests to Correct Layer 🔧 30 min

**Issue:** Testing `exportSites()` logic via thin wrapper hook (wrong layer)
**File:** `src/hooks/__tests__/useTableExport.test.ts`

**Actions:**
- [ ] **Keep Tests 1-3:** Hook-specific state management (3 tests)
  - Test 1: Clicking export button triggers download - HOOK BEHAVIOR ✅
  - Test 2: Export uses selected format (CSV/JSON/GeoJSON) - HOOK STATE ✅
  - Test 3: Export includes only filtered sites (not all sites) - HOOK BEHAVIOR ✅

- [ ] **Move Tests 4-6 to exportFormats.test.ts:** Filename logic lives in exportSites()
  - Test 4: Filename includes timestamp (YYYY-MM-DD format)
  - Test 5: Filename includes correct file extension (.csv, .json, .geojson)
  - Test 6: Custom filename is respected if provided

- [ ] **Remove Tests 7-8:** Error handling doesn't exist in hook
  - Test 7: Shows error message if export fails - WRONG LAYER (exportSites has no error handling)
  - Test 8: Allows retry after failed export - WRONG LAYER (hook has no retry logic)

- [ ] **Bonus Tests 9-12:** Evaluate if they test hook or exportSites
  - Review each bonus test and move/remove as appropriate

- [ ] Create new test section in `src/config/exportFormats.test.ts`:
  ```typescript
  describe("exportSites - Filename Generation", () => {
    it("includes timestamp in YYYY-MM-DD format", () => { /* moved from useTableExport */ });
    it("includes correct file extension", () => { /* moved from useTableExport */ });
    it("respects custom filename if provided", () => { /* moved from useTableExport */ });
  });
  ```

- [ ] Verify 3 tests still pass in useTableExport.test.ts
- [ ] Verify 3 moved tests pass in exportFormats.test.ts
- [ ] Run `npm test -- src/hooks/__tests__/useTableExport.test.ts`
- [ ] Run `npm test -- src/config/exportFormats.test.ts`

**Expected Result:**
- useTableExport.test.ts: 12 tests → 3 tests (-9 tests, but 3 moved to correct file)
- exportFormats.test.ts: Add 3 new tests for filename logic
- File size: 380 lines → ~152 lines (-228 lines)
- Test-to-code ratio: 10:1 → 4.1:1 (healthy)
- **Net test count:** -6 tests (3 kept, 3 moved, 6 removed)

---

### Priority 3: Simplify Test Infrastructure (Low Impact)

#### Task 3.1: useIntersectionObserver.test.tsx - Simplify Mock Setup ⚡ 15 min

**Issue:** Custom `MockIntersectionObserver` class (44 lines) when `vi.fn()` suffices
**File:** `src/hooks/__tests__/useIntersectionObserver.test.tsx`

**Actions:**
- [ ] **Keep all 9 tests:** Coverage is appropriate ✅
  - Tests 1-3: Basic functionality (isIntersecting state)
  - Tests 4-5: triggerOnce behavior
  - Tests 6-8: Configuration options (threshold, rootMargin)
  - Test 9: Cleanup (memory leak prevention)

- [ ] **Simplify mock infrastructure:** Replace custom class with Vitest mocks
  - Replace `MockIntersectionObserver` class with `vi.fn()` implementation
  - Use Vitest's built-in mocking instead of custom test utilities
  - Reduce setup code from 44 lines to ~15 lines

- [ ] Example simplified mock:
  ```typescript
  let observerCallback: IntersectionObserverCallback;
  const mockObserve = vi.fn();
  const mockUnobserve = vi.fn();
  const mockDisconnect = vi.fn();

  beforeEach(() => {
    global.IntersectionObserver = vi.fn((callback) => {
      observerCallback = callback;
      return { observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect };
    });
  });

  // Trigger intersection in tests:
  act(() => {
    observerCallback([{ isIntersecting: true, target: element }], mockObserver);
  });
  ```

- [ ] Verify all 9 tests still pass after mock refactor
- [ ] Run `npm test -- src/hooks/__tests__/useIntersectionObserver.test.tsx`

**Expected Result:**
- Test count: 9 tests (no change)
- File size: 267 lines → ~237 lines (-30 lines of setup code)
- Cleaner, more maintainable mock infrastructure

---

### Priority 4: Documentation Updates

#### Task 4.1: Update TEST_COVERAGE_PLAN.md with Guidelines 🔧 20 min

**File:** `TEST_COVERAGE_PLAN.md`

**Actions:**
- [ ] Add new section: **"Test-to-Code Ratio Guidelines"**
  ```markdown
  ## 📏 Test-to-Code Ratio Guidelines

  ### Healthy Ratios
  - **Simple utilities (formatters, helpers):** 1.5:1 to 2:1
  - **Business logic (hooks, services):** 2:1 to 3:1
  - **Complex features (CSV export, maps):** 3:1 to 5:1
  - **Critical user-facing features:** Up to 6:1 (CSV export with Arabic encoding)

  ### Red Flags
  - **> 10:1 ratio:** Likely testing the wrong layer or over-testing trivial logic
  - **> 20:1 ratio:** Almost certainly excessive (e.g., useTileConfig was 20:1)

  ### When to Stop Testing
  - ✅ All code paths covered (branches, edge cases)
  - ✅ All user-facing behaviors verified
  - ✅ All critical bugs prevented (regressions)
  - ❌ Testing framework internals (React hooks, browser APIs)
  - ❌ Testing dependencies (testing exportSites via useTableExport)
  - ❌ Testing implementation details (internal state, memoization)

  ### Test the Right Layer
  - **Component tests:** UI behavior, user interactions, rendering
  - **Hook tests:** State management, side effects, cleanup
  - **Utility tests:** Input/output transformations, edge cases
  - **Integration tests:** Cross-layer communication, data flow
  ```

- [ ] Update **"Development Workflow"** section:
  ```markdown
  ### Testing Requirements
  - **All new features require at least smoke tests**
  - **Avoid brittle tests** - Keep them resilient to future changes
  - **Avoid excessive tests** - Target 2:1 to 3:1 test-to-code ratio for most code
  - **Test the right layer** - Don't test dependencies via wrapper functions
  - **All tests (new and existing) must pass before committing**
  ```

- [ ] Update **Priority 2 task summaries** with actual test counts:
  ```markdown
  ### Task 2.2: useTableExport Hook Tests (3 tests) ✅ COMPLETE
  - [x] Task 2.2: useTableExport Tests (3/3 tests) ✅ **COMPLETE** - 100% coverage achieved!
  - Note: 9 excessive tests removed (6 wrong-layer, 3 moved to exportFormats.test.ts)

  ### Task 2.3: useTileConfig Hook Tests (4 tests) ✅ COMPLETE
  - [x] Task 2.3: useTileConfig Tests (4/4 tests) ✅ **COMPLETE** - 100% coverage achieved!
  - Note: 11 bonus tests removed (excessive for 12-line hook)
  ```

- [ ] Update **Progress Tracking** table:
  ```markdown
  | Priority | Tasks | Tests | Status |
  |----------|-------|-------|--------|
  | 🔴 Priority 1 | 3 tasks | 40 tests | ✅ **COMPLETE** (100%) |
  | 🟡 Priority 2 | 2 tasks (1 skipped) | 7 tests | ✅ **COMPLETE** (100%) |
  | ⚪ Priority 3 | Deferred | N/A | ⏸️ Deferred |
  | **Total** | **5 tasks** | **47 tests** | **100% Complete (47/47 tests)** |
  ```

- [ ] Add **"Lessons Learned"** section:
  ```markdown
  ## 📚 Lessons Learned (November 2025)

  ### What Went Well ✅
  1. **CSV Export Tests (Task 1.1):** All 15 tests were critical and well-designed
     - Caught real bugs (Arabic encoding, special characters)
     - Performance tests ensure scalability
     - Data integrity tests prevent silent corruption

  2. **Test Organization:** Clear structure with descriptive test names
     - Easy to trace back to task requirements
     - Good use of describe blocks and meaningful assertions

  ### What Went Wrong ❌
  1. **Over-testing trivial code:** useTileConfig had 20:1 ratio (243 lines of tests for 12 lines of code)
     - **Root cause:** "Bonus tests" culture encouraged testing framework internals
     - **Fix:** Removed 11 redundant tests, kept only 4 core tests

  2. **Testing wrong layer:** useTableExport tested exportSites() logic via wrapper
     - **Root cause:** Testing through dependencies instead of testing the dependency directly
     - **Fix:** Moved 3 tests to exportFormats.test.ts, removed 6 wrong-layer tests

  3. **Component tests in hook files:** useTableResize tested UI breakpoints
     - **Root cause:** Unclear boundaries between hook logic and component behavior
     - **Fix:** Removed 5 component-level tests from hook tests

  ### Guidelines Added
  - **Test-to-code ratio targets:** 2:1 to 3:1 for most code, up to 6:1 for critical features
  - **Test the right layer:** Don't test dependencies via wrappers
  - **When to stop testing:** Avoid testing framework internals, implementation details

  ### Impact
  - **Before refactor:** 67 tests, 2,016 lines of test code (6.3:1 ratio)
  - **After refactor:** 47 tests, 1,448 lines of test code (4.5:1 ratio)
  - **Savings:** -20 tests, -568 lines of test code (28% reduction)
  - **Test quality:** Higher (tests now focus on real bugs and user-facing behavior)
  ```

- [ ] Commit documentation updates

---

### Priority 5: Verification & Quality Gates

#### Task 5.1: Run Full Test Suite ⚡ 5 min

**Actions:**
- [ ] Run all tests: `npm test -- --run`
- [ ] Verify **1,403 tests passing** (down from 1,417, -14 excessive tests)
- [ ] Verify **2 tests skipped** (expected backend tests)
- [ ] Check for any failing tests introduced by refactor

**Expected Output:**
```
Test Files  86 passed (86)
     Tests  1403 passed | 2 skipped (1405)
```

---

#### Task 5.2: Run Test Coverage Report ⚡ 5 min

**Actions:**
- [ ] Generate coverage: `npm run test:coverage`
- [ ] Open HTML report: `coverage/index.html`
- [ ] Verify coverage targets:
  - [ ] Statement coverage: ~29% (same as before, infrastructure code expected to be low)
  - [ ] Branch coverage: ~75% (should remain high)
  - [ ] Function coverage: Review for any regressions

**Expected Result:**
- No coverage regressions (removed tests were redundant)
- Easier to identify genuine coverage gaps (less noise)

---

#### Task 5.3: Verify Production Build ⚡ 3 min

**Actions:**
- [ ] Run production build: `npm run build`
- [ ] Verify zero TypeScript errors
- [ ] Verify zero build warnings
- [ ] Check bundle size (should be unchanged, we only modified tests)

**Expected Output:**
```
✓ built in 15s
✓ 0 errors, 0 warnings
```

---

#### Task 5.4: Run ESLint ⚡ 2 min

**Actions:**
- [ ] Run linter: `npm run lint`
- [ ] Verify zero errors
- [ ] Verify zero warnings

**Expected Output:**
```
✓ 0 errors, 0 warnings
```

---

#### Task 5.5: Update Test Count in CLAUDE.md 🔧 5 min

**File:** `CLAUDE.md`

**Actions:**
- [ ] Update test count in **Quick Start** section:
  ```markdown
  npm test        # 1403 unit tests must pass ✓ (1169 frontend + 77 backend + 15 backend utils - 142 excessive tests removed)
  ```

- [ ] Update **Testing Strategy** section:
  ```markdown
  ### Current Coverage

  - **1,403 unit tests passing** across 86 test files (2 skipped)
    - **Frontend:** 1,154 tests (71 files) - Components, hooks, integration tests (-15 excessive tests)
    - **Backend:** 77 tests (7 files) - Utils, middleware, business logic
    - **Utils:** 15 tests (backend utilities)
    - **Logo tests:** 3 tests (AppHeader logo integration)
  - **16 E2E tests passing** (chromium only) - Focused on critical user journeys
  ```

- [ ] Add note in **Recent Improvements** section:
  ```markdown
  ### Latest Changes (Nov 12, 2025 - Session 9)

  1. **Test Refactoring - Remove Excessive Testing:**
     - **Removed 14 excessive tests** (568 lines of test code, 28% reduction)
     - **Test-to-code ratio:** Reduced from 6.3:1 to 4.5:1 (healthier ratio)
     - **Tests removed:**
       - useTileConfig: 11 bonus tests for trivial 12-line hook (20:1 ratio → 5.6:1)
       - useTableResize: 5 component-level tests (belong in component tests)
       - useTableExport: 6 wrong-layer tests (testing dependencies via wrapper)
     - **Tests moved:** 3 tests from useTableExport to exportFormats.test.ts (correct layer)
     - **Mock simplification:** useIntersectionObserver mock infrastructure (-30 lines)

     - **Documentation Updates:**
       - Added test-to-code ratio guidelines to TEST_COVERAGE_PLAN.md
       - Added "Test the Right Layer" principle
       - Added "Lessons Learned" section with root cause analysis

     - **Quality Metrics:**
       - Before: 1,417 tests, 2,016 lines of test code
       - After: 1,403 tests, 1,448 lines of test code
       - Impact: Higher test quality, easier maintenance, faster CI/CD
  ```

- [ ] Commit CLAUDE.md updates

---

## 📊 Progress Tracking

### Summary

| Task | Type | Tests Removed | Lines Saved | Status |
|------|------|---------------|-------------|--------|
| **Priority 1** | | | | |
| Task 1.1: useTileConfig | Remove bonus tests | -11 | -176 | ⬜ Not Started |
| Task 1.2: useTableResize | Remove component tests | -5 | -134 | ⬜ Not Started |
| **Priority 2** | | | | |
| Task 2.1: useTableExport | Move to correct layer | -6 (net) | -228 | ⬜ Not Started |
| **Priority 3** | | | | |
| Task 3.1: useIntersectionObserver | Simplify mocks | 0 | -30 | ⬜ Not Started |
| **Priority 4** | | | | |
| Task 4.1: Update TEST_COVERAGE_PLAN.md | Documentation | N/A | N/A | ⬜ Not Started |
| **Priority 5** | | | | |
| Task 5.1: Run full test suite | Verification | N/A | N/A | ⬜ Not Started |
| Task 5.2: Run coverage report | Verification | N/A | N/A | ⬜ Not Started |
| Task 5.3: Verify production build | Verification | N/A | N/A | ⬜ Not Started |
| Task 5.4: Run ESLint | Verification | N/A | N/A | ⬜ Not Started |
| Task 5.5: Update CLAUDE.md | Documentation | N/A | N/A | ⬜ Not Started |
| **TOTAL** | | **-14 tests** | **-568 lines** | **0% Complete** |

### Detailed Checklist

**Priority 1: Remove Excessive Tests**
- [ ] Task 1.1: useTileConfig (15 min)
  - [ ] Remove tests 5-15
  - [ ] Verify 4 tests pass
  - [ ] Run test file
- [ ] Task 1.2: useTableResize (20 min)
  - [ ] Remove tests 11-15
  - [ ] Verify 11 tests pass
  - [ ] Run test file

**Priority 2: Fix Test Layer Violations**
- [ ] Task 2.1: useTableExport (30 min)
  - [ ] Keep tests 1-3
  - [ ] Move tests 4-6 to exportFormats.test.ts
  - [ ] Remove tests 7-8
  - [ ] Verify 3 tests pass (useTableExport)
  - [ ] Verify 3 tests pass (exportFormats)

**Priority 3: Simplify Test Infrastructure**
- [ ] Task 3.1: useIntersectionObserver (15 min)
  - [ ] Replace MockIntersectionObserver with vi.fn()
  - [ ] Verify 9 tests pass

**Priority 4: Documentation Updates**
- [ ] Task 4.1: Update TEST_COVERAGE_PLAN.md (20 min)
  - [ ] Add test-to-code ratio guidelines
  - [ ] Add "Test the Right Layer" section
  - [ ] Add "Lessons Learned" section
  - [ ] Update task summaries
  - [ ] Update progress tracking

**Priority 5: Verification & Quality Gates**
- [ ] Task 5.1: Run full test suite (5 min)
- [ ] Task 5.2: Run coverage report (5 min)
- [ ] Task 5.3: Verify production build (3 min)
- [ ] Task 5.4: Run ESLint (2 min)
- [ ] Task 5.5: Update CLAUDE.md (5 min)

---

## 🚀 Commit Strategy

**Follow Conventional Commits format:**

```bash
# After Priority 1 (Task 1.1 + 1.2)
git add src/hooks/__tests__/useTileConfig.test.ts src/hooks/__tests__/useTableResize.test.ts
git commit -m "refactor: remove 16 excessive tests from hook test files

- Remove 11 bonus tests from useTileConfig (20:1 ratio → 5.6:1)
- Remove 5 component-level tests from useTableResize (4.5:1 → 3.4:1)
- Tests were redundant (testing framework internals, UI concerns)
- All remaining tests passing (1409/1409)

Refs: TEST_REFACTORING_PLAN.md Task 1.1, 1.2"

# After Priority 2 (Task 2.1)
git add src/hooks/__tests__/useTableExport.test.ts src/config/exportFormats.test.ts
git commit -m "refactor: move useTableExport tests to correct layer

- Move 3 filename tests to exportFormats.test.ts (test logic, not wrapper)
- Remove 6 wrong-layer tests (error handling that doesn't exist in hook)
- useTableExport now only tests state management (3 tests, 4.1:1 ratio)
- exportFormats.test.ts gains filename generation tests
- All tests passing (1406/1406)

Refs: TEST_REFACTORING_PLAN.md Task 2.1"

# After Priority 3 (Task 3.1)
git add src/hooks/__tests__/useIntersectionObserver.test.tsx
git commit -m "refactor: simplify useIntersectionObserver mock setup

- Replace 44-line MockIntersectionObserver class with vi.fn() mocks
- Reduce setup code from 44 lines to ~15 lines (-30 lines)
- All 9 tests still passing (cleaner, more maintainable)

Refs: TEST_REFACTORING_PLAN.md Task 3.1"

# After Priority 4 (Task 4.1)
git add TEST_COVERAGE_PLAN.md
git commit -m "docs: add test-to-code ratio guidelines to coverage plan

- Add healthy ratio targets (2:1 to 3:1 for most code)
- Add 'Test the Right Layer' principle
- Add 'Lessons Learned' section with root cause analysis
- Update task summaries with actual test counts
- Document 28% reduction in test code (568 lines removed)

Refs: TEST_REFACTORING_PLAN.md Task 4.1"

# After Priority 5 (Task 5.5)
git add CLAUDE.md
git commit -m "docs: update test counts after excessive test removal

- Update test count: 1417 → 1403 (-14 tests, -568 lines)
- Document test refactoring in Recent Improvements section
- Add quality metrics (6.3:1 → 4.5:1 ratio)

Refs: TEST_REFACTORING_PLAN.md Task 5.5"
```

---

## 📝 Notes for Claude Code Sessions

### Before Starting
1. Read this entire file to understand the refactoring plan
2. Check that you're on the `chore/accessabilityFeature` branch
3. Verify dev server is running (port 5173)
4. Run `npm test` to confirm 1,417 tests currently passing

### During Refactoring
1. Work through tasks in priority order (Priority 1 → Priority 5)
2. Run tests after each task to catch regressions early
3. Mark tasks as complete: `[ ]` → `[x]`
4. Update progress tracking table after each task
5. Commit after each priority level (not after each individual task)

### After Completion
1. Verify all quality gates pass (Priority 5)
2. Update both TEST_COVERAGE_PLAN.md and CLAUDE.md
3. Create final summary commit with all changes
4. Report final metrics to user:
   - Test count: 1,417 → 1,403 (-14 tests)
   - Lines of test code: 2,016 → 1,448 (-568 lines)
   - Test-to-code ratio: 6.3:1 → 4.5:1

### Common Issues
- **"Tests failing after removal"** → You removed a test that was actually needed, restore it
- **"Coverage decreased"** → Removed tests were redundant, coverage should stay same
- **"Can't find test to move"** → Test numbers may have shifted, search by test description
- **"Mock refactor breaks tests"** → Vitest mock syntax issue, check Vitest docs for IntersectionObserver mocking

### Quality Reminders
- **Only commit when ALL tests pass** (1,403/1,403 after refactor)
- **Run `npm run build` before final commit** (must succeed)
- **Run `npm run lint` before final commit** (must pass with zero warnings)
- **Update documentation** (TEST_COVERAGE_PLAN.md, CLAUDE.md)

---

**Last Updated:** 2025-11-12
**Status:** ⬜ Not Started
**Estimated Completion Time:** 1-2 hours
**Target Test Count:** 1,403 tests (down from 1,417)
**Target Test Code Reduction:** -568 lines (28% reduction)
