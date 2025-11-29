# Heritage Tracker - Bug Tracking & Progress

**Status:** Phase 1 IN PROGRESS | Phase 2 In Progress 🔄

---

## Phase 1 - Critical Bugs - IN PROGRESS

**Commit:** `2bb49e9` - fix: resolve Phase 1 critical bugs (dark mode, dates, timeline bounds, N/A display)

### ✅ 1. Dark Mode Text Visibility - How It Works Page

**Status:** FIXED
**Issue:** Text on How It Works page was black in dark mode (should be white)
**Fix:** Added theme-aware text classes throughout HowItWorksPage.tsx, ResourcePageLayout.tsx, ResourceSection.tsx
**Files:** 3 modified
**Tests:** All passing ✅

### ✅ 2. Dashboard Satellite Map Date Bug

**Status:** FIXED
**Issue:** Satellite map showing "Nov 28, 2025" (today's date) instead of actual imagery date
**Fix:** Changed CURRENT period from dynamic "current" to static "2025-01-15", updated label to "Jan 2025"
**Files:** 4 modified (map.ts, SiteDetailView.tsx, TimeToggle.tsx, imageryPeriods.ts)
**Tests:** All passing ✅

### 3. Timeline Scrubber Bounds - Dots Rendering Off-Page

**Status:** TODO - IN PROGRESS
**Issue:** Timeline dots rendering outside the timeline container
**Fix:** Changed TimelineScrubber container from overflow-visible to overflow-hidden (clips dots outside bounds)
**Files:** 1 modified (TimelineScrubber.tsx)
**Tests:**

### ✅ 4. 'N/A' Destruction Date Display Issue

**Status:** FIXED
**Issue:** Destruction date column showing "N/A" which doesn't make sense
**Fix:** Changed to show "Unknown" for missing destruction dates, "N/A" only when Islamic date missing
**Files:** 1 modified (SiteTableRow.tsx)
**Bonus:** Added Islamic destruction date for Ibn Othman Mosque (24 Dhu al-Hijjah 1445 AH)
**Tests:** All passing ✅

---

## Phase 2 - High Priority Bugs 🔄 IN PROGRESS

### 5. Interval Dropdown Behavior in Comparison Mode

**Status:** DONE
**Issue:** When comparison mode is on, interval dropdown is clickable but some options don't make sense if Sync Map version is off/on
**Priority:** High
**Complexity:** Medium

### 6. "As Large as Possible" Interval Behavior

**Status:** DONE
**Issue:** "As large as possible" interval option doesn't move green scrubber to the very end (remains on site's destruction date)
**Priority:** Medium
**Complexity:** Medium

### 🔄 7. Filter Dropdown - Show Site Counts

**Status:** TODO
**Issue:** Status/Type filter dropdowns don't show how many sites per option
**Enhancement:** Add counts in parentheses (e.g., "Destroyed (45)", "Mosque (14)"). If there are 0, also indicate that "(0)".
**Priority:** Medium
**Complexity:** Low

### 🔄 8. Data Table Column Widths

**Status:** IN PROGRESS
**Issue:** Column widths are unpolished - some too big, some squished. Mostly done except site name column too big
**Priority:** Medium
**Complexity:** Low

---

## Phase 3 - Medium Priority Improvements 📋 PLANNED

### 📋 10. Language Select Button Styling

**Status:** TODO
**Issue:** Language select dropdown should match styling of adjacent buttons (theme toggle, etc.)
**Priority:** Low
**Complexity:** Low

### 📋 11. Site Type Icons Color

**Status:** TODO
**Issue:** Site type icons should use Palestinian flag red for consistency
**Priority:** Low
**Complexity:** Low

### 📋 12. Data Page Row Click Behavior

**Status:** TODO
**Issue:** On Data page, clicking anywhere on row should open site detail modal (not just site name link)
**Priority:** Medium
**Complexity:** Low

### 📋 13. Dashboard Data Table "See More" Indicator

**Status:** TODO
**Issue:** Dashboard mini data table needs discrete "see more" indicator to open site detail modal
**Priority:** Low
**Complexity:** Low

### 📋 14. Stats Page - Last Updated & Source Attribution

**Status:** TODO
**Issue:** Show when casualty stats were last updated, sources directly near numbers (not just footer)
**Enhancement:** Consider showing min/max ranges from multiple credible sources
**Priority:** High
**Complexity:** Medium

---

## Phase 4 - Content & Polish 🎨 BACKLOG

### 🎨 15. Stats/About Pages - Past Tense Language

**Status:** TODO
**Issue:** Use more past-tense language on Stats and About pages
**Priority:** Low
**Complexity:** Low

### 🎨 16. How It Works Page - Content Relevance

**Status:** TODO
**Issue:** Page has irrelevant technical info (Claude slop)
**Priority:** Low
**Complexity:** Low

### 🎨 17. Static Text Centering

**Status:** TODO
**Issue:** Lots of static text on pages not centered
**Priority:** Low
**Complexity:** Low

### 🎨 18. Help Modal vs About/How It Works

**Status:** TODO
**Issue:** Clarify what Help modal contains that's not in About or How It Works
**Question:** Why is How It Works under Resources tab?
**Priority:** Low
**Complexity:** Low

### 🎨 19. Stats/About Content Simplification

**Status:** TODO
**Issue:** Content on Stats and About pages could be further simplified
**Priority:** Low
**Complexity:** Medium

### 🎨 20. Source Endorsement Disclaimer

**Status:** TODO
**Issue:** Should indicate more clearly that sources (UNESCO, etc.) do not endorse this project
**Priority:** Medium
**Complexity:** Low

---

## Phase 5 - New Features ✨ FUTURE

### ✨ 21. Show/Hide Data Columns

**Status:** TODO
**Feature:** Allow users to choose which data columns to show/hide in table
**Priority:** Low
**Complexity:** Medium

### ✨ 22. Last Updated & Copyright Footer

**Status:** TODO
**Feature:** Dynamically set "Last Updated" and copyright year
**Priority:** Low
**Complexity:** Low

---

## Deferred / Needs Discussion 💭

### 💭 23. Animation Impact

**Status:** NEEDS REVIEW
**Question:** Is the timeline animation still impactful? Should we keep it?
**Priority:** TBD
**Complexity:** N/A

### 💭 24. Component Visual Depth

**Status:** NEEDS REVIEW
**Issue:** Show more depth between main components and background, or make components more distinct
**Priority:** TBD
**Complexity:** Medium

### 💭 25. Rounded Button Incongruence

**Status:** NEEDS REVIEW
**Question:** Do rounded buttons look incongruent with non-rounded main components?
**Priority:** TBD
**Complexity:** Low

### 💭 26. Red Triangle Background Width

**Status:** NEEDS REVIEW
**Issue:** Red triangle background extends too far right across the page
**Priority:** TBD
**Complexity:** Low

---

## Progress Summary

**Phase 1 (Critical):** 4/4 almost complete
**Phase 2 (High Priority):** 0/4 complete 🔄
**Phase 3 (Medium Priority):** 0/6 complete 📋
**Phase 4 (Content & Polish):** 0/6 complete 🎨
**Phase 5 (New Features):** 0/2 complete ✨
**Deferred:** 4 items need discussion 💭

**Total:** 4/22 bugs/features complete (18%)

---

_Last Updated: November 28, 2025_
