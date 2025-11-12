# Test Coverage Improvement Plan

**Project:** Heritage Tracker
**Current Coverage:** 29% statements, 74% branches
**Target Coverage:** 45% statements, 80% branches
**Total Tests to Add:** ~57 tests
**Estimated Impact:** Fix critical CSV export bugs, improve lazy loading performance, enhance table interactions

---

## 🔧 Development Workflow (MUST FOLLOW)

### Testing Requirements
- **All new features require at least smoke tests**
- **Avoid brittle tests** - Keep them resilient to future changes
- **All tests (new and existing) must pass before committing**

### Commit Standards
- Use conventional commit messages: `feat:`, `fix:`, `refactor:`, `test:`
- **Only commit when ALL of the following are true:**
  - ✅ **MVP is complete and working** (doesn't need to be the full feature - just a useful, working increment)
  - ✅ Test coverage exists
  - ✅ All tests passing (`npm test`)
  - ✅ Linter passes (`npm run lint`)
  - ✅ Documentation updated (this file + relevant docs)
  - ✅ User confirms dev server shows no UI issues

### Pre-PR Checklist
- **Must run a test production build before creating a PR** (`npm run build`)
- User reviews the PR and prepares local environment for next work session

### Development Environment
- **Dev server runs on port 5173 (user maintains this)**
- User actively monitors local site during development
- **Do not start/stop dev server**

### Code Review Focus
- Only flag areas for improvement
- No positive commentary needed
- Apply these principles for scalability:
  - **DRY** - Don't Repeat Yourself
  - **KISS** - Keep It Simple, Stupid
  - **SOLID** - Especially focus on abstraction

### Code Standards
- **No hardcoded text** - All UI labels/functionality text must use i18n translations
- **Check for existing code** - Before creating components or abstractions, verify we don't already have similar code
- **Data source awareness** - `mockData.ts` is temporary; we'll migrate to backend API calls via our mock API layer

### Remember
- User is always watching the running dev server - no need to prompt them to check unless something specific needs verification
- When implementing tests from this plan:
  1. Read the task description carefully
  2. Implement all tests in the checklist
  3. Run `npm test` to verify all tests pass
  4. Run `npm run test:coverage` to verify coverage increase
  5. Mark tests as complete in this file (`[ ]` → `[x]`)
  6. Update progress tracking section
  7. Only commit when ALL quality gates pass

---

## 📊 Current Status

- ✅ **1,390 existing tests** covering component interactions and critical hooks (+40 from Priority 1 complete)
- ✅ **74% branch coverage** - Excellent logic testing
- ❌ **29% statement coverage** - Low due to untested infrastructure code (acceptable)
- 🎯 **Focus:** User-facing features (CSV export, lazy loading, table interactions)
- 🎉 **Priority 1 Complete:** All critical user-facing tests implemented!

---

## 🔴 Priority 1: Critical User-Facing Issues

### Task 1.1: CSV Export Tests (15 tests)

**File:** `src/utils/exporters/__tests__/csv.test.ts` (expand existing)
**Current Coverage:** 100% (but missing edge cases)
**Why Critical:** CSV is primary export format; Arabic text exports as "nonsense symbols"

**Tests to Add:**

- [x] **Arabic Encoding**
  - [x] Test 1: Exports Arabic text with UTF-8 BOM header
  - [x] Test 2: Arabic site names render correctly (not symbols)
  - [x] Test 3: Mixed Arabic/English text exports correctly

- [x] **Special Characters**
  - [x] Test 4: Handles commas in site names ("Al-Omari Mosque, Gaza")
  - [x] Test 5: Handles double quotes in descriptions ("The \"Great\" Mosque")
  - [x] Test 6: Handles single quotes in descriptions
  - [x] Test 7: Handles newlines in multi-line fields (historicalSignificance)
  - [x] Test 8: Handles tabs in text fields
  - [x] Test 9: Handles semicolons (common CSV separator alternative)

- [x] **Performance & Scale**
  - [x] Test 10: Exports 1000+ sites without memory issues
  - [x] Test 11: Exports 1000+ sites in <5 seconds
  - [x] Test 12: Handles empty sites array gracefully

- [x] **Data Integrity**
  - [x] Test 13: All CSV columns are present in correct order
  - [x] Test 14: CSV headers match column data
  - [x] Test 15: No data loss when exporting and re-importing

**Acceptance Criteria:**
- ✅ Arabic text exports correctly (readable, not symbols)
- ✅ All special characters are properly escaped
- ✅ 1000+ sites export in <5 seconds
- ✅ CSV files can be opened in Excel/Google Sheets without errors

---

### Task 1.2: useIntersectionObserver Hook Tests (9 tests)

**File:** `src/hooks/__tests__/useIntersectionObserver.test.tsx` (new file)
**Current Coverage:** 100%
**Why Critical:** Controls lazy loading performance for LazySection component

**Tests Added:**

- [x] **Basic Functionality**
  - [x] Test 1: Returns ref, isIntersecting, and hasIntersected properties
  - [x] Test 2: Sets isIntersecting to true when element enters viewport
  - [x] Test 3: Sets isIntersecting to false when element leaves viewport

- [x] **triggerOnce Behavior**
  - [x] Test 4: With triggerOnce=true, only triggers once
  - [x] Test 5: With triggerOnce=false, triggers multiple times

- [x] **Configuration Options**
  - [x] Test 6: Respects threshold option (0.1)
  - [x] Test 7: Respects threshold option (0.5, 1.0)
  - [x] Test 8: Respects rootMargin option ("50px", "100px")

- [x] **Cleanup**
  - [x] Test 9: Disconnects observer on unmount (no memory leaks)

**Acceptance Criteria:**
- ✅ Lazy loading triggers at correct viewport intersection
- ✅ triggerOnce prevents duplicate loads
- ✅ No memory leaks on component unmount

---

### Task 1.3: useTableResize Hook Tests (16 tests)

**File:** `src/hooks/__tests__/useTableResize.test.ts` (new file)
**Current Coverage:** 100%
**Why Critical:** Users resize table columns; needs to handle edge cases

**Tests Added:**

- [x] **Column Width Constraints**
  - [x] Test 1: Enforces minimum column width (200px)
  - [x] Test 2: Enforces maximum column width (1100px)
  - [x] Test 3: Prevents columns from becoming invisible (width >= 10px)

- [x] **Mouse Drag Behavior**
  - [x] Test 4: Updates column width during mouse drag
  - [x] Test 5: Stops resizing on mouse up
  - [x] Test 6: Handles rapid mouse movements without lag

- [x] **Multi-Column Interactions**
  - [x] Test 7: Resizing one column doesn't affect others (isolated state)
  - [x] Test 8: Table width updates correctly after resize

- [x] **Edge Cases**
  - [x] Test 9: Handles resize on first column (leftmost)
  - [x] Test 10: Handles resize on last column (rightmost)

- [x] **Progressive Column Display** (bonus tests)
  - [x] Test 11: Shows type and name at minimum width (200px)
  - [x] Test 12: Shows status at 360px+
  - [x] Test 13: Shows all columns at maximum width (1100px)

- [x] **Viewport Resize Handling** (bonus tests)
  - [x] Test 14: Clamps table width when viewport shrinks
  - [x] Test 15: Maintains minimum width even on tiny viewports

- [x] **Cleanup** (bonus test)
  - [x] Test 16: Removes event listeners on unmount (no memory leaks)

**Acceptance Criteria:**
- ✅ Columns respect min/max width constraints
- ✅ Resize is smooth and responsive (uses requestAnimationFrame)
- ✅ No layout breaks when resizing edge columns
- ✅ Progressive column display works correctly at all breakpoints
- ✅ No memory leaks on unmount

---

## 🟡 Priority 2: Polish (Do After Priority 1)

### Task 2.1: timelineYearMarkers Utility Tests (12 tests)

**File:** `src/utils/__tests__/timelineYearMarkers.test.ts` (new file)
**Current Coverage:** 0%
**Why Important:** BC/BCE dates are tricky; incorrect markers confuse users

**Tests to Add:**

- [ ] **BCE Date Handling**
  - [ ] Test 1: Generates markers for BCE dates (-800, -600, -400)
  - [ ] Test 2: BCE dates are in correct chronological order (oldest first)
  - [ ] Test 3: Handles "BCE 1" correctly

- [ ] **CE Date Handling**
  - [ ] Test 4: Generates markers for CE dates (1000, 1200, 1400)
  - [ ] Test 5: CE dates are in correct chronological order

- [ ] **BCE → CE Transition**
  - [ ] Test 6: Handles transition from BCE to CE correctly (no "year 0")
  - [ ] Test 7: Timeline shows BCE 1 → CE 1 correctly

- [ ] **Marker Intervals**
  - [ ] Test 8: Generates markers at 100-year intervals for recent dates
  - [ ] Test 9: Generates markers at 500-year intervals for ancient dates
  - [ ] Test 10: Generates markers at 1000-year intervals for very ancient dates

- [ ] **Edge Cases**
  - [ ] Test 11: Handles empty date range
  - [ ] Test 12: Handles single date (no range)

**Acceptance Criteria:**
- ✅ BCE/CE dates display in correct chronological order
- ✅ Timeline shows appropriate intervals (100/500/1000 years)
- ✅ No confusion around BCE 1 → CE 1 transition

---

### Task 2.2: useTableExport Hook Tests (8 tests)

**File:** `src/hooks/__tests__/useTableExport.test.ts` (expand existing)
**Current Coverage:** 61.11%
**Why Important:** Export button behavior must be reliable

**Tests to Add:**

- [ ] **Export Triggering**
  - [ ] Test 1: Clicking export button triggers download
  - [ ] Test 2: Export uses selected format (CSV/JSON/GeoJSON)
  - [ ] Test 3: Export includes only filtered sites (not all sites)

- [ ] **Filename Generation**
  - [ ] Test 4: Filename includes timestamp (YYYY-MM-DD format)
  - [ ] Test 5: Filename includes correct file extension (.csv, .json, .geojson)
  - [ ] Test 6: Custom filename is respected if provided

- [ ] **Error Handling**
  - [ ] Test 7: Shows error message if export fails
  - [ ] Test 8: Allows retry after failed export

**Acceptance Criteria:**
- ✅ Export button reliably triggers download
- ✅ Filenames are descriptive and timestamped
- ✅ Error states are user-friendly

---

### Task 2.3: useTileConfig Hook Tests (4 tests)

**File:** `src/hooks/__tests__/useTileConfig.test.ts` (new file)
**Current Coverage:** 0%
**Why Important:** Map tiles must match user's language preference

**Tests to Add:**

- [ ] **Language Detection**
  - [ ] Test 1: Returns Arabic tiles for `navigator.language = "ar"`
  - [ ] Test 2: Returns Arabic tiles for `navigator.language = "ar-SA"`
  - [ ] Test 3: Returns English tiles for `navigator.language = "en"`
  - [ ] Test 4: Returns English tiles for unsupported languages (fallback)

**Acceptance Criteria:**
- ✅ Arabic speakers see Arabic map tiles
- ✅ All other users see English map tiles

---

## ⚪ Priority 3: Defer (Not Blocking)

These items are **not critical** for current workflow and can be deferred:

- ❌ **GeoJSON Export Tests** - Low usage, no critical dependencies
- ❌ **queryBuilder Tests** - Not used in mock API mode (current mode)
- ❌ **useSitesQuery Tests** - Not actively used (useSites is tested at 100%)
- ❌ **Local Backend Tests** - Not using local backend yet
- ❌ **Supabase Adapter Tests** - Cloud backend is future consideration

**Revisit when:** Backend integration is needed (Supabase or local PostgreSQL)

---

## 📈 Progress Tracking

### Summary

| Priority | Tasks | Tests | Status |
|----------|-------|-------|--------|
| 🔴 Priority 1 | 3 tasks | 40 tests | ✅ **COMPLETE** (100%) |
| 🟡 Priority 2 | 3 tasks | 24 tests | ⚪ Not Started |
| ⚪ Priority 3 | Deferred | N/A | ⏸️ Deferred |
| **Total** | **6 tasks** | **64 tests** | **63% Complete (40/64 tests)** |

### Detailed Progress

#### Priority 1 (Critical)
- [x] Task 1.1: CSV Export Tests (15/15 tests) ✅ **COMPLETE** - 100% coverage achieved!
- [x] Task 1.2: useIntersectionObserver Tests (9/9 tests) ✅ **COMPLETE** - 100% coverage achieved!
- [x] Task 1.3: useTableResize Tests (16/16 tests) ✅ **COMPLETE** - 100% coverage achieved!

#### Priority 2 (Polish)
- [ ] Task 2.1: timelineYearMarkers Tests (0/12 tests)
- [ ] Task 2.2: useTableExport Tests (0/8 tests)
- [ ] Task 2.3: useTileConfig Tests (0/4 tests)

---

## 🎯 Success Criteria

### Coverage Targets
- 🔄 Statement coverage: 29% → 45% (+16%) - In Progress
- ✅ Branch coverage: 74% → 80% (+6%)
- 🔄 Total tests: 1,365 → 1,422 (+57) - Currently at 1,390 (+40 tests from Priority 1 complete)

### Quality Gates
- ✅ All Priority 1 tests passing
- ✅ CSV exports Arabic text correctly (no symbols)
- ✅ Lazy loading works without memory leaks
- ✅ Table column resizing is smooth and constrained
- ✅ Production build succeeds with zero errors

### User-Facing Improvements
- ✅ Users can export CSV with Arabic text (readable)
- ✅ Users can export CSV with special characters (no corruption)
- ✅ Users experience fast page loads (lazy loading)
- ✅ Users can resize table columns without breaking layout

---

## 📝 Implementation Notes

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test csv.test.ts

# Run with coverage
npm run test:coverage

# View coverage report
# Open: coverage/index.html
```

### Test Patterns
```typescript
// Example: CSV Export Test
describe('CSV Export - Arabic Encoding', () => {
  it('exports Arabic text with UTF-8 BOM', () => {
    const sites = [mockSiteWithArabicName];
    const csv = exportCSV(sites);

    // Check for UTF-8 BOM (EF BB BF)
    expect(csv.charCodeAt(0)).toBe(0xFEFF);

    // Check Arabic text is readable
    expect(csv).toContain('مسجد العمري الكبير');
  });
});

// Example: Hook Test
describe('useIntersectionObserver', () => {
  it('triggers when element enters viewport', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate intersection
    act(() => {
      mockIntersectionObserver.trigger(true);
    });

    expect(result.current.isIntersecting).toBe(true);
  });
});
```

### Quality Checklist
Before marking a task complete:
- [ ] All tests passing (`npm test`)
- [ ] Coverage increased for target file
- [ ] No TypeScript errors (`npm run build`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Documentation updated if needed

---

## 🔄 Update Instructions

**For Claude Code Sessions:**

1. Mark tests as complete by changing `[ ]` to `[x]`
2. Update the "Progress Tracking" section with completed counts
3. Update the "Summary" table with current percentages
4. Add notes in the "Implementation Notes" section if needed
5. Run `npm run test:coverage` after each task to verify coverage increase

**Example Update:**
```markdown
#### Priority 1 (Critical)
- [x] Task 1.1: CSV Export Tests (15/15 tests) ✅ COMPLETE
- [ ] Task 1.2: useIntersectionObserver Tests (3/8 tests) 🟡 IN PROGRESS
- [ ] Task 1.3: useTableResize Tests (0/10 tests)
```

---

**Last Updated:** 2025-11-12 (Session 3)
**Completed:** Task 1.1 (CSV Export) ✅ | Task 1.2 (useIntersectionObserver) ✅ | Task 1.3 (useTableResize) ✅
**Status:** 🎉 **All Priority 1 (Critical) tasks complete!**
**Next Session:** Start Priority 2 (Polish) - Task 2.1 (timelineYearMarkers Tests)
