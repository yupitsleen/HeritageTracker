# Heritage Tracker - Bug Tracking & Progress

**Status:** IN PROGRESS

---

## Phase 1 - Critical Bugs - IN PROGRESS

**Commit:** `2bb49e9` - fix: resolve Phase 1 critical bugs (dark mode, dates, N/A display)

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
**Files:** 1 modified (TimelineScrubber.tsx) - un-do? Not working as intended.
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

---

## Phase 3 - Medium Priority Improvements 📋 PLANNED

### 🔄 6. Filter Dropdown - Hide Site Status if none exist

**Status:** TODO
**Issue:** Status filter dropdowns show statuses that are unused (i.e. do not apply to any sites at this time)
**Enhancement:** If there are 0 sites that have a status, hide the status from appearing in the dropdown".
**Priority:** Medium
**Complexity:** Low

### 🔄 7. Data Table Column Widths

**Status:** IN PROGRESS
**Issue:** Column width of the Site Name column is too big (i.e. lots of empty space in the cell).
**Priority:** Medium
**Complexity:** Low

### 📋 8. Language Select Button Styling

**Status:** TODO
**Issue:** Language select dropdown should match styling of adjacent buttons (theme toggle, etc.)
**Priority:** Low
**Complexity:** Low

### 📋 9. Site Type Icons Color

**Status:** TODO
**Issue:** Site type icons should use Palestinian flag red for consistency
**Priority:** Low
**Complexity:** Low

### 📋 10. Data Page Row Click Behavior

**Status:** TODO
**Issue:** On Data page only, clicking anywhere on a table row (rather than just the site name that has a link) should open site detail modal.
**Priority:** Medium
**Complexity:** Low

### 📋 11. Dashboard Data Table "See More" Indicator

**Status:** TODO
**Issue:** Dashboard mini data table needs discrete "see more" indicator to open site detail modal. Can we make this appear in the same cell as the Site Name, or do we need a new column next to the Site name? Or should we have a "see more" link pop up as a tooltip on hover?
**Priority:** Low
**Complexity:** Low

### 🎨 12. Static Text Centering

**Status:** TODO
**Issue:** Lots of static text, like headers, on static-content pages not centered, like on other pages
**Priority:** Low
**Complexity:** Low

### ✨ 13. Last Updated & Copyright Footer

**Status:** TODO
**Feature:** Dynamically set "Last Updated" and copyright year
**Priority:** Low
**Complexity:** Low

### 💭 14. Component Visual Depth

**Status:** NEEDS REVIEW
**Issue:** Show more depth between main components and background, or make components more distinct
**Priority:** TBD
**Complexity:** Medium

### 💭 15. Rounded Button Incongruence

**Status:** NEEDS REVIEW
**Question:** Do rounded buttons look incongruent with non-rounded main components?
**Priority:** TBD
**Complexity:** Low

### 💭 16. Red Triangle Background Width

**Status:** NEEDS REVIEW
**Issue:** Red triangle background extends too far right across the page. Let's make it end about 1/3 of the way across the page.
**Priority:** TBD
**Complexity:** Low

---

## Phase 4 - NEED TO THINK MORE ABOUT

### 📋 17. Stats Page - Last Updated & Source Attribution

**Status:** TODO
**Issue:** Show when casualty stats were last updated, sources directly near numbers (not just footer)
**Enhancement:** Consider showing min/max ranges from multiple credible sources
**Priority:** High
**Complexity:** Medium

### 🎨 18. Stats/About Pages - Past Tense Language

**Status:** TODO
**Issue:** Use more past-tense language on Stats and About pages
**Priority:** Low
**Complexity:** Low

### 🎨 19. How It Works Page - Content Relevance

**Status:** TODO
**Issue:** Page has irrelevant technical info (Claude slop)
**Priority:** Low
**Complexity:** Low

### 🎨 20. Help Modal vs About/How It Works

**Status:** TODO
**Issue:** Clarify what Help modal contains that's not in About or How It Works
**Question:** Why is How It Works under Resources tab? Do we have redundant content or out of scope content?
**Priority:** Low
**Complexity:** Low

### 🎨 21. Stats/About Content Simplification

**Status:** TODO
**Issue:** Content on Stats and About pages could be further simplified (if we deem them not redundant)
**Priority:** Low
**Complexity:** Medium

### 💭 22. Animation Impact

**Status:** NEEDS REVIEW
**Question:** Is the timeline animation still impactful? Should we keep it? Enhance it to make it more dramatic?
**Priority:** TBD
**Complexity:** N/A

### 🎨 23. Source Endorsement Disclaimer

**Status:** TODO
**Issue:** Should indicate more clearly that sources (UNESCO, etc.) do not endorse this project
**Priority:** Medium
**Complexity:** Low

---

## Phase 5 - New Features ✨ FUTURE

### ✨ 24. Show/Hide Data Columns

**Status:** TODO
**Feature:** Allow users to choose which data columns to show/hide in table
**Priority:** Low
**Complexity:** Medium

---

_Last Updated: December 6th, 2025_
