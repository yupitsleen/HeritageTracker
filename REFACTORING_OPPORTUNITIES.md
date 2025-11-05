# Refactoring Opportunities

This document tracks code quality improvements identified during the code review of the `feat/respDesign` branch.

## Status: 7/7 Complete ✅ 🎉

---

## ✅ Completed Refactorings

### 1. Extract NavigationLinks Component
**Status:** ✅ Complete (Commit: 731d4d3)

**Problem:** ~140 lines of duplicate navigation code between desktop and mobile views in AppHeader.

**Solution:**
- Created `NavigationLinks.tsx` component (75 lines)
- Single source of truth for all navigation items
- Handles both desktop and mobile layouts
- Automatic Dashboard hiding on mobile (< 1024px)

**Impact:**
- Net reduction: ~65 lines
- Easier to maintain (changes in one place)
- Consistent behavior across layouts

**Files Changed:**
- ✅ `src/components/Layout/NavigationLinks.tsx` (new)
- ✅ `src/components/Layout/AppHeader.tsx` (simplified)

---

### 2. Extract TimelineToggleButton Component
**Status:** ✅ Complete (Commit: 4f4a25c)

**Problem:** ~75 lines of duplicate toggle button code between TimelineControls and TimelineSettingsMenu.

**Solution:**
- Created `TimelineToggleButton.tsx` component (65 lines)
- Handles both 'button' (desktop) and 'menu-item' (mobile) variants
- Consistent active state display (checkmarks)
- Automatic menu close on toggle click

**Impact:**
- Net reduction: ~10 lines
- Single source of truth for toggle buttons
- Easier to add new toggles in the future

**Files Changed:**
- ✅ `src/components/Timeline/TimelineToggleButton.tsx` (new)
- ✅ `src/components/Timeline/TimelineControls.tsx` (simplified)
- ✅ `src/components/Timeline/TimelineSettingsMenu.tsx` (simplified)

**Bonus Fix:** Added mobile menu scroll lock to prevent page scrolling behind the menu.

---

### 3. Create useMediaQuery Hook
**Status:** ✅ Complete

**Problem:** Duplicate window resize logic in AppHeader and useTableResize.

**Solution:**
- Created `useMediaQuery.ts` hook (51 lines)
- Leverages native `window.matchMedia` API for better performance
- SSR-safe with proper browser checks
- Comprehensive test coverage (8 tests)

**Impact:**
- Net reduction: ~40 lines
- Better performance (native browser API)
- Reusable across the app
- Easier to test

**Files Changed:**
- ✅ `src/hooks/useMediaQuery.ts` (new)
- ✅ `src/hooks/useMediaQuery.test.tsx` (new)
- ✅ `src/components/Layout/AppHeader.tsx` (simplified - removed resize listener)
- ✅ `vitest.setup.ts` (added matchMedia mock)

---

### 4. Group Related Props in TimelineSettingsMenu
**Status:** ✅ Complete

**Problem:** Component accepts 9 props, many optional, violating Single Responsibility Principle.

**Solution:**
- Grouped props into logical objects:
  - `toggles`: { zoomToSite, mapMarkers, syncMap }
  - `onToggle`: { zoomToSite, mapMarkers, syncMap }
  - `speedControl`: { speed, onChange } (optional)
- Better type safety and clearer relationships
- Updated all test cases (21 tests passing)

**Impact:**
- Net reduction: ~0 lines (better structure)
- Clearer API design
- Easier to add new toggles
- Better maintainability

**Files Changed:**
- ✅ `src/components/Timeline/TimelineSettingsMenu.tsx` (new interface)
- ✅ `src/components/Timeline/TimelineControls.tsx` (updated usage)
- ✅ `src/components/Timeline/TimelineSettingsMenu.test.tsx` (updated tests)

---

### 5. Simplify TimelineControls Rendering Logic
**Status:** ✅ Complete

**Problem:** Complex nested conditional rendering makes the component hard to follow.

**Solution:**
- Extracted `renderSpeedControl()` helper function
- Extracted `renderDesktopToggles()` helper function
- Flatter component hierarchy
- Easier to test individual rendering functions

**Impact:**
- Net reduction: ~0 lines (better structure)
- More readable logic flow
- Better separation of concerns
- Easier to test

**Files Changed:**
- ✅ `src/components/Timeline/TimelineControls.tsx` (refactored with helper functions)

---

### 6. Add Missing Constants to LAYOUT Config
**Status:** ✅ Complete

**Problem:** Magic numbers scattered throughout the codebase (48, 24, 0.6, 1024).

**Solution:**
- Added constants to `src/constants/layout.ts`:
  - `LAYOUT.CONTAINER_PADDING = 48` (px-4 on each side)
  - `LAYOUT.TABLE_LEFT_PADDING = 24` (pl-6)
  - `LAYOUT.TABLE_MAX_WIDTH_RATIO = 0.6` (60% of viewport)
- Updated all usage sites to use constants
- Used `BREAKPOINTS.TABLET` instead of hardcoded 1024

**Impact:**
- Net reduction: ~0 lines (better maintainability)
- Single source of truth for layout values
- Self-documenting code
- Easier to adjust responsive behavior

**Files Changed:**
- ✅ `src/constants/layout.ts` (added constants)
- ✅ `src/hooks/useTableResize.ts` (use constants)
- ✅ `src/components/Layout/AppHeader.tsx` (use constants)

---

### 7. Add Debouncing to useTableResize
**Status:** ✅ Complete

**Problem:** Hook re-renders on every viewport resize event, even when not necessary.

**Solution:**
- Used `requestAnimationFrame` for smooth, performant updates
- Added RAF cleanup on unmount
- Only update state if value actually changed (avoid unnecessary re-renders)
- Cancels pending RAF before scheduling new one

**Impact:**
- Net reduction: ~0 lines (better performance)
- Fewer re-renders during rapid resize events
- Smoother user experience
- Still responsive (60 FPS)

**Files Changed:**
- ✅ `src/hooks/useTableResize.ts` (added RAF debouncing)

---

## 🔄 Remaining Refactorings

All refactorings complete! 🎉

---

## Summary

**Completed:** 7/7 refactorings
**Time Invested:** ~8-9 hours
**Lines Added:** ~200 (new hooks and tests)
**Lines Removed:** ~150 (eliminated duplication)
**Net Code Change:** +50 lines (higher quality, more maintainable)

### Key Improvements

1. **Better Code Reuse:**
   - `NavigationLinks` component (eliminates 140 lines of duplication)
   - `TimelineToggleButton` component (eliminates 75 lines of duplication)
   - `useMediaQuery` hook (reusable media query logic)

2. **Improved Maintainability:**
   - Grouped props in `TimelineSettingsMenu` (clearer API)
   - Helper functions in `TimelineControls` (better structure)
   - Constants in `LAYOUT` config (single source of truth)

3. **Better Performance:**
   - `useMediaQuery` with native `matchMedia` API
   - `requestAnimationFrame` debouncing in `useTableResize`
   - Fewer re-renders during resize events

4. **Test Coverage:**
   - All 1034 tests passing ✅
   - 8 new tests for `useMediaQuery`
   - 21 tests updated for `TimelineSettingsMenu`

---

## Priority Ranking

1. **High Priority:**
   - ✅ Extract NavigationLinks Component (DONE)
   - ✅ Extract TimelineToggleButton Component (DONE)
   - ✅ Add Missing Constants to LAYOUT Config (DONE)

2. **Medium Priority:**
   - ✅ Create useMediaQuery Hook (DONE)
   - ✅ Group Related Props in TimelineSettingsMenu (DONE)

3. **Low Priority:**
   - ✅ Simplify TimelineControls Rendering Logic (DONE)
   - ✅ Add Debouncing to useTableResize (DONE)

---

## Effort Estimates (Actual)

| Refactoring | Difficulty | Time | Risk | Impact |
|-------------|-----------|------|------|--------|
| ✅ NavigationLinks | Easy | 1h | Low | High (DRY) |
| ✅ TimelineToggleButton | Easy | 1h | Low | High (DRY) |
| ✅ LAYOUT Constants | Easy | 0.5h | Very Low | Medium |
| ✅ useMediaQuery Hook | Easy | 1.5h | Low | High |
| ✅ Group Props | Medium | 2.5h | Medium | Medium |
| ✅ Simplify Rendering | Easy | 0.5h | Low | Low |
| ✅ Add Debouncing | Easy | 1h | Low | Low |

**Total Effort:** ~8-9 hours (as estimated)

---

## Notes

- All completed refactorings have baseline tests to prevent regressions
- All tests (1034/1034) passing ✅
- Linter passing ✅
- No breaking changes introduced
- Branch: `feat/respDesign` (ready to merge)

**Last Updated:** 2025-11-05
