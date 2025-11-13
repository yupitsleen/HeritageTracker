# Tooltips Implementation Guide

**Goal:** Add tooltips to virtually every interactive element on the Heritage Tracker website to explain functionality on hover.

**Language:** English first (Arabic translation later, unless it causes blocking bugs)

**Requirements:**
- Use existing `Tooltip` component ([src/components/Tooltip.tsx](src/components/Tooltip.tsx))
- Use `InfoIconWithTooltip` for larger component explanations (adds visual "i" indicator)
- Regular `Tooltip` wrapper for individual interactive elements (no extra visual indicator)
- **Desktop-first:** Don't worry about mobile optimization
- **Follow [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md):**
  - ✅ All tests must pass before committing
  - ✅ Use i18n translations (no hardcoded text)
  - ✅ Check for existing code before creating new components
  - ✅ Commit only when MVP increment is complete and working
  - ✅ Run linter before committing

---

## Implementation Rules

### When to Use Each Tooltip Type

1. **InfoIconWithTooltip** (with visible "i" icon):
   - Large components/sections that need explanation (FilterBar, Timeline, Table, etc.)
   - Multi-feature areas where context is needed
   - Already used in: TimelineScrubber, WaybackSlider, SitesTableDesktop
   - **Keep existing ones and improve accuracy**

2. **Regular Tooltip** (no visual indicator):
   - Individual buttons, inputs, toggles, links
   - Icon-only buttons (highest priority!)
   - Sort controls, navigation arrows, etc.
   - Wraps the interactive element directly

### Before Adding Any Tooltip

**MUST READ AND UNDERSTAND:**
1. Read the component code to understand what it actually does
2. Check for existing logic, state changes, side effects
3. Verify tooltip text matches actual functionality
4. Test interaction to confirm behavior
5. Keep tooltips concise but accurate (action-focused)

**Example Process:**
```tsx
// 1. Find the button in code
<button onClick={handleReset} aria-label="Reset timeline">
  <ResetIcon />
</button>

// 2. Read handleReset function to understand what it does
const handleReset = () => {
  setCurrentDate(minDate);
  setIsPlaying(false);
  setSelectedSiteId(null);
};

// 3. Write accurate tooltip
<Tooltip content="Reset timeline to earliest date and stop animation">
  <button onClick={handleReset} aria-label="Reset timeline">
    <ResetIcon />
  </button>
</Tooltip>
```

---

## Current InfoIconWithTooltip Audit

### ✅ Existing Instances - Audit Complete (2025-11-12)

| Component | Location | Current Tooltip | Status |
|-----------|----------|-----------------|--------|
| **TimelineScrubber** | [src/components/Timeline/TimelineScrubber.tsx:399-404](src/components/Timeline/TimelineScrubber.tsx#L399-L404) | `timeline.tooltipDefault` or `timeline.tooltipAdvanced` | ✅ ACCURATE |
| **WaybackSlider** | [src/components/AdvancedTimeline/WaybackSlider.tsx:322-324](src/components/AdvancedTimeline/WaybackSlider.tsx#L322-L324) | `timelinePage.waybackTooltip` | ⚠️ NEEDS UPDATE |
| **SitesTableDesktop** | [src/components/SitesTable/SitesTableDesktop.tsx:118-120](src/components/SitesTable/SitesTableDesktop.tsx#L118-L120) | `table.tooltip` | ✅ ACCURATE |

### Current Tooltip Text (from en.ts) & Audit Findings

#### 1. TimelineScrubber - ✅ ACCURATE

**Default Mode** (`timeline.tooltipDefault`):
> "Click Play to animate through destruction events. Use the date filter to focus on specific time periods. Click dots to see site details."

**Advanced Mode** (`timeline.tooltipAdvanced`):
> "Click red dots to highlight sites. Use Previous/Next to navigate between events. Enable 'Sync Map' to automatically show satellite imagery from before each site's destruction."

**Verified Functionality:**
- ✅ Default mode: Play button animates through events, date filter works, clicking dots shows site details
- ✅ Advanced mode: Dots are clickable to highlight sites, Previous/Next buttons present (lines 388-394), Sync Map toggle available
- ✅ Both modes documented in code (lines 36-43: `AdvancedTimelineMode` interface)
- ✅ Advanced mode adds navigation controls and changes sync behavior from "during playback" to "on dot click"

**Recommendation:** Keep as-is. Both tooltips are accurate and well-written.

---

#### 2. WaybackSlider - ⚠️ NEEDS MINOR UPDATE

**Current** (`timelinePage.waybackTooltip`):
> "Navigate through 186 historical satellite imagery versions from 2014-2025. Each gray line represents one imagery capture date. Click anywhere on the timeline to jump to that date. Hover over gray lines to see exact dates."

**Verified Functionality:**
- ✅ 186 releases is correct (matches CLAUDE.md documentation)
- ✅ Gray lines represent imagery capture dates (tick marks at line 405-433)
- ✅ Timeline is clickable to jump to dates
- ✅ Hover shows exact dates via tooltips
- ⚠️ **MISSING:** Comparison mode feature not mentioned
- ⚠️ **MISSING:** Interval selector feature not mentioned
- ⚠️ **MISSING:** Previous/Next buttons for navigation

**Suggested Improvement:**
> "Navigate through 186 historical satellite imagery versions from 2014-2025. Click anywhere on the timeline to jump to that date. Use Previous/Next buttons or hover over gray lines to see exact dates. Enable Comparison Mode to view before/after satellite imagery side-by-side."

**Recommendation:** Update to mention key interactive features (Comparison Mode, Previous/Next). Current version is accurate but incomplete.

---

#### 3. SitesTableDesktop - ✅ ACCURATE

**Current** (`table.tooltip`):
> "Click any site row to view detailed information. Click column headers to sort. Hover over site rows to highlight them on the map and timeline."

**Verified Functionality:**
- ✅ Rows are clickable via `onSiteClick` prop (line 19)
- ✅ Column headers are sortable via `TableHeader` component (line 8)
- ✅ Hover highlighting works via `onSiteHighlight` prop (line 20)
- ✅ All three interactions clearly documented

**Recommendation:** Keep as-is. Tooltip accurately describes all major interactions.

---

### Action Items from Audit

1. ✅ **TimelineScrubber** - No changes needed
2. ✅ **WaybackSlider** - Updated `timelinePage.waybackTooltip` in both `en.ts` and `ar.ts` (completed 2025-11-12)
3. ✅ **SitesTableDesktop** - No changes needed

**Audit Result:** All existing InfoIconWithTooltip instances verified and updated. All tests passing (1396 unit tests).

---

## 📊 Overall Progress Summary

**Last Updated:** 2025-11-12

| Phase | Status | Completed | Total | Progress |
|-------|--------|-----------|-------|----------|
| **Phase 1** (High Priority) | ✅ Complete | 6/6 | ~15-20 elements | 100% |
| **Phase 2** (Medium Priority) | ⏳ In Progress | 1/7 | ~15-20 elements | 14% |
| **Phase 3** (Low Priority) | ⏸️ Not Started | 0/4 | ~20-30 elements | 0% |
| **TOTAL** | ⏳ In Progress | 7/17 sections | ~50-70 elements | 41% |

**Recent Commits:**
- `9a8da2b` - Phase 2.1: FilterBar Filter Buttons tooltips (5 elements: Type, Status, Date, Year, Clear All)
- `a7e6757` - Phase 1.6: FilterBar Controls tooltips (3 elements: Clear search, Mobile filters, Filter pills)
- `8c00f6c` - Phase 1.5: SitesTable expand button tooltip (1 element)
- `1675248` - Phase 1.4: WaybackSlider Navigation tooltips (2 elements: Previous, Next)
- `44f24a3` - Phase 1.3: Timeline Navigation tooltips (2 elements: Previous, Next)
- `84eb53a` - Phase 1.2: Timeline Controls tooltips (2 elements: Pause, Reset)
- `34883cb` - Phase 1.1: AppHeader tooltips (4 elements)
- `4e5cac7` - Centralized tooltip config system
- `77bbd7e` - Implementation guide and audit

---

## Priority Order & Progress Tracker

### PHASE 1: HIGH PRIORITY - Icon-Only Buttons ⏳ IN PROGRESS

These are critical because users have NO text label indicating functionality.

#### 1.1 AppHeader ✅ COMPLETE (Commit: 34883cb)
**File:** [src/components/Layout/AppHeader.tsx](src/components/Layout/AppHeader.tsx)

| Element | Line | Implementation | Tooltip Text | Status |
|---------|------|----------------|--------------|--------|
| Logo/Home button | 103-118 | Wrapped with Tooltip | `TOOLTIPS.HEADER.HOME` - "Return to Dashboard" | ✅ DONE |
| Help button (?) | 135-142 | Wrapped with Tooltip | `TOOLTIPS.HEADER.HELP` - "View page instructions and keyboard shortcuts" | ✅ DONE |
| Dark mode toggle | 152-158 | Wrapped with Tooltip | Dynamic: `TOOLTIPS.HEADER.DARK_MODE_ON/OFF` | ✅ DONE |
| Hamburger menu | 162-169 | Wrapped with Tooltip | Dynamic: `TOOLTIPS.HEADER.MENU_OPEN/CLOSE` | ✅ DONE |

**Implementation Details:**
- ✅ Imported `Tooltip` component and `TOOLTIPS` config
- ✅ Replaced all `title` attributes with `Tooltip` wrappers
- ✅ Improved aria-labels: "settings" → "Switch to light/dark mode"
- ✅ All tooltips use centralized config from `src/config/tooltips.ts`
- ✅ Tests updated to match new aria-label patterns
- ✅ 33 tests passing, linter clean

**Notes:**
- Language selector NOT given tooltip (dropdown already has visual indicator)
- Dark mode and hamburger menu tooltips are dynamic based on state

---

#### 1.2 Timeline Controls ✅ COMPLETE (Commit: 84eb53a)
**File:** [src/components/Timeline/TimelineControls.tsx](src/components/Timeline/TimelineControls.tsx)

| Element | Line | Implementation | Tooltip Text | Status |
|---------|------|----------------|--------------|--------|
| Play button | 135-147 | Wrapped with Tooltip | `timeline.playTooltip` - "Animate the map to show site destruction events over time" | ✅ EXISTS |
| Pause button | 149-161 | Wrapped with Tooltip | `TOOLTIPS.TIMELINE.PAUSE` - "Pause timeline animation" | ✅ DONE |
| Reset button | 167-179 | Wrapped with Tooltip | `TOOLTIPS.TIMELINE.RESET` - "Reset timeline to start and clear site selection" | ✅ DONE |

**Implementation Details:**
- ✅ Imported `TOOLTIPS` config from `src/config/tooltips.ts`
- ✅ Wrapped Pause button with `Tooltip` component
- ✅ Wrapped Reset button with `Tooltip` component
- ✅ Removed redundant `title` attributes (Tooltip component handles this)
- ✅ Updated `TOOLTIPS.TIMELINE.RESET` text to accurately reflect behavior (resets to start AND clears site selection)
- ✅ Updated test file `tooltips.test.ts` to match new tooltip text
- ✅ All 1414 tests passing

**Notes:**
- Play button already had tooltip (no changes needed)
- Reset button does more than just "reset to beginning" - it also clears highlighted site to reset map zoom (verified in code at [TimelineScrubber.tsx:185-194](src/components/Timeline/TimelineScrubber.tsx#L185-L194))

---

#### 1.3 Timeline Navigation ✅ COMPLETE (Commit: 44f24a3)
**File:** [src/components/Timeline/TimelineNavigation.tsx](src/components/Timeline/TimelineNavigation.tsx)

| Element | Line | Implementation | Tooltip Text | Status |
|---------|------|----------------|--------------|--------|
| Previous button | 34-46 | Wrapped with Tooltip | `timeline.previousTitle` - "Navigate to previous site destruction event" | ✅ DONE |
| Next button | 47-59 | Wrapped with Tooltip | `timeline.nextTitle` - "Navigate to next site destruction event" | ✅ DONE |

**Implementation Details:**
- ✅ Imported `Tooltip` component
- ✅ Wrapped Previous button with Tooltip component
- ✅ Wrapped Next button with Tooltip component
- ✅ Removed redundant `title` attributes (Tooltip component handles this)
- ✅ Uses existing translation keys from `timeline.previousTitle` and `timeline.nextTitle`
- ✅ Updated TimelineScrubber.test.tsx to check for aria-label instead of title attribute
- ✅ All 1414 tests passing, linter clean

**Notes:**
- These buttons show icon-only on smaller screens (⏮/⏭), making tooltips essential
- Existing translations were already accurate and descriptive

---

#### 1.4 WaybackSlider Navigation ✅ COMPLETE (Commit: 1675248)
**File:** [src/components/AdvancedTimeline/WaybackSlider.tsx](src/components/AdvancedTimeline/WaybackSlider.tsx)

| Element | Line | Implementation | Tooltip Text | Status |
|---------|------|----------------|--------------|--------|
| Previous button | 328-342 | Wrapped with Tooltip | `TOOLTIPS.WAYBACK.PREV_RELEASE` - "Go to previous satellite image release" | ✅ DONE |
| Next button | 344-357 | Wrapped with Tooltip | `TOOLTIPS.WAYBACK.NEXT_RELEASE` - "Go to next satellite image release" | ✅ DONE |

**Implementation Details:**
- ✅ Imported `Tooltip` component and `TOOLTIPS` config
- ✅ Wrapped Previous button with Tooltip component
- ✅ Wrapped Next button with Tooltip component
- ✅ Removed redundant `title` attributes (Tooltip component handles this)
- ✅ Updated aria-labels to be more descriptive and accurate
- ✅ Updated test file to match new aria-labels (2 assertions updated)
- ✅ All 1414 tests passing, linter clean

**Notes:**
- Distinct from Timeline navigation (different purpose)
- Navigates Wayback releases, not destruction events
- Uses centralized tooltip config (TOOLTIPS.WAYBACK)

---

#### 1.5 SitesTable Controls ✅ COMPLETE (Commit: 8c00f6c)
**File:** [src/components/SitesTable/SitesTableDesktop.tsx](src/components/SitesTable/SitesTableDesktop.tsx)

| Element | Line | Implementation | Tooltip Text | Status |
|---------|------|----------------|--------------|--------|
| Expand table button | 102-119 | Wrapped with Tooltip | `table.expandTable` - "Expand table to see all columns" | ✅ DONE |

**Implementation Details:**
- ✅ Imported `Tooltip` component
- ✅ Wrapped expand button with Tooltip component
- ✅ Removed redundant `title` attribute (Tooltip component handles this)
- ✅ Uses existing translation key from `table.expandTable`
- ✅ Verified functionality: navigates to `/data` page (full table view)
- ✅ All 1414 tests passing, linter clean

**Notes:**
- Icon is expand arrows (⇱ or similar)
- Translation: `table.expandTable` = "Expand table to see all columns" (en/ar/it)
- Button navigates to Data page (verified in DashboardPage.tsx:56-58)

---

#### 1.6 FilterBar Controls ✅ COMPLETE (Commit: a7e6757)
**File:** [src/components/FilterBar/FilterBar.tsx](src/components/FilterBar/FilterBar.tsx)

| Element | Line | Implementation | Tooltip Text | Status |
|---------|------|----------------|--------------|--------|
| Clear search (X) | 219-228 | Wrapped with Tooltip | `TOOLTIPS.FILTERS.CLEAR_SEARCH` - "Clear search" | ✅ DONE |
| Mobile filters button | 290-311 | Wrapped with Tooltip | `TOOLTIPS.FILTERS.OPEN_MOBILE` - "Open filters panel" | ✅ DONE |
| Filter pill remove buttons | 23-32 (FilterTag.tsx) | Wrapped with Tooltip | `TOOLTIPS.FILTERS.REMOVE_PILL` - "Remove this filter" | ✅ DONE |

**Implementation Details:**
- ✅ Imported `Tooltip` component and `TOOLTIPS` config
- ✅ Wrapped Clear search button with Tooltip component
- ✅ Wrapped Mobile filters button with Tooltip component
- ✅ Updated `FilterTag` component to wrap × button with Tooltip
- ✅ All tooltips use centralized config from `src/config/tooltips.ts`
- ✅ All 1414 tests passing, linter clean

**Notes:**
- Filter pills are rendered in multiple places using the `FilterTag` component
- Tooltip appears consistently on all filter pill remove buttons
- Existing aria-labels preserved for accessibility

---

### PHASE 2: MEDIUM PRIORITY - Abbreviated Text Buttons ⏳ IN PROGRESS

These have some text but benefit from explanatory tooltips.

#### 2.1 FilterBar Filter Buttons ✅ COMPLETE (Commit: 9a8da2b)
**File:** [src/components/FilterBar/FilterBar.tsx](src/components/FilterBar/FilterBar.tsx)

| Element | Line | Button Text | Tooltip Text | Status |
|---------|------|-------------|--------------|--------|
| Type Filter | 235-246 | "Type" | `TOOLTIPS.FILTERS.TYPE_FILTER` - "Filter by heritage site type (mosque, church, archaeological site, etc.)" | ✅ DONE |
| Status Filter | 248-260 | "Status" | `TOOLTIPS.FILTERS.STATUS_FILTER` - "Filter by damage status (destroyed, heavily damaged, etc.)" | ✅ DONE |
| Destruction Date | 262-278 | "Date" | `TOOLTIPS.FILTERS.DATE_FILTER` - "Filter by date of destruction" | ✅ DONE |
| Year Built | 280-296 | "Year" | `TOOLTIPS.FILTERS.YEAR_FILTER` - "Filter by year built (supports BCE dates)" | ✅ DONE |
| Clear All button | 325-334 | "Clear All" | `TOOLTIPS.FILTERS.CLEAR_ALL` - "Remove all active filters" | ✅ DONE |

**Implementation Details:**
- ✅ Updated `FilterButton` component to support optional `tooltip` prop
- ✅ Wrapped PopoverButton with Tooltip component (conditional rendering)
- ✅ Added `tooltip` prop to all 4 filter buttons (Type, Status, Date, Year)
- ✅ Wrapped Clear All button with Tooltip component
- ✅ All tooltips use centralized config from `src/config/tooltips.ts`
- ✅ All 1414 tests passing, linter clean

**Notes:**
- Desktop-only buttons (hidden on mobile)
- FilterButton component now supports tooltips for all future uses
- Tooltips help users understand filter capabilities before opening dropdown

---

#### 2.2 Timeline Toggles ⏸️ NOT STARTED
**File:** [src/components/Timeline/TimelineControls.tsx](src/components/Timeline/TimelineControls.tsx)

| Element | Line | Toggle Text | Tooltip Text | Status |
|---------|------|-------------|--------------|--------|
| Sync Map | ~95-102 | "Sync Map" | "Automatically update satellite imagery to match timeline date" | ⏸️ TODO |
| Zoom to Site | ~105-112 | "Zoom to Site" | "Automatically zoom map to selected heritage site" | ⏸️ TODO |
| Show Map Markers | ~114-122 | "Show Map Markers" | "Display markers for all heritage sites on map" | ⏸️ TODO |

**Notes:**
- Read the actual toggle handlers to understand exact behavior
- These are checkboxes with labels, not icon-only

---

#### 2.3 WaybackSlider Controls ⏸️ NOT STARTED
**File:** [src/components/AdvancedTimeline/WaybackSlider.tsx](src/components/AdvancedTimeline/WaybackSlider.tsx)

| Element | Line | Control Text | Tooltip Text | Status |
|---------|------|--------------|--------------|--------|
| Comparison Mode | 275-287 | "Comparison Mode" | "Show before/after satellite maps side-by-side" | ⏸️ TODO |
| Interval Selector | 289-296 | Dropdown | "Time gap between before/after satellite images" | ⏸️ TODO |
| Sync Map Version | 299-311 | "Sync Map Version" | "Auto-sync map imagery when clicking timeline events" | ⏸️ TODO |

**Notes:**
- Comparison Mode enables dual-map view
- Interval affects spacing between before/after dates
- Verify by reading component logic

---

#### 2.4 Export Controls ⏸️ NOT STARTED
**File:** [src/components/SitesTable/ExportControls.tsx](src/components/SitesTable/ExportControls.tsx)

| Element | Line | Current State | Tooltip Text | Status |
|---------|------|---------------|--------------|--------|
| Format dropdown | 28-40 | Has `title` + `aria-label` | "Choose export file format (CSV, JSON, or GeoJSON)" | ⏸️ TODO |
| Export button | 41-59 | Has `title` + `aria-label` | "Download filtered sites as [FORMAT]" | ⏸️ TODO |

**Notes:**
- Export button tooltip should show selected format dynamically
- Check translation: `table.selectExportFormat`

---

#### 2.5 Speed Dropdown ⏸️ NOT STARTED
**File:** [src/components/Timeline/TimelineControls.tsx](src/components/Timeline/TimelineControls.tsx)

| Element | Line | Current State | Tooltip Text | Status |
|---------|------|---------------|--------------|--------|
| Speed dropdown | 73-88 | Has `aria-label` | "Timeline animation playback speed" | ⏸️ TODO |

**Notes:**
- Controls play animation speed (0.5x, 1x, 2x, etc.)

---

### PHASE 3: LOW PRIORITY - Contextual Tooltips ⏸️ NOT STARTED

Less critical but improve UX.

#### 3.1 Table Column Headers ⏸️ NOT STARTED
**File:** [src/components/SitesTable/TableHeader.tsx](src/components/SitesTable/TableHeader.tsx)

| Column | Tooltip Text | Status |
|--------|--------------|--------|
| All sortable columns | "Click to sort by [column name]" | ⏸️ TODO |

**Notes:**
- Should indicate current sort state: "Sorted ascending" / "Sorted descending" / "Click to sort"
- May require reading SortIcon component logic

---

#### 3.2 Navigation Links ⏸️ NOT STARTED
**File:** [src/components/Layout/AppHeader.tsx](src/components/Layout/AppHeader.tsx)

| Link | Current Text | Tooltip Text | Status |
|------|--------------|--------------|--------|
| Dashboard | "Dashboard" | "Interactive map and timeline overview" | ⏸️ TODO |
| Timeline | "Timeline" | "Satellite comparison with historical imagery" | ⏸️ TODO |
| Data | "Data" | "Full table view with export options" | ⏸️ TODO |
| Stats | "Statistics" | "Statistical analysis and impact data" | ⏸️ TODO |
| About | "About" | "Project information and methodology" | ⏸️ TODO |
| Resources | "Resources" | "Donation links and external resources" | ⏸️ TODO |

**Notes:**
- These already have text labels, so lowest priority
- Could help first-time users understand page purposes

---

#### 3.3 Map Time Toggle ⏸️ NOT STARTED
**File:** [src/components/Map/TimeToggle.tsx](src/components/Map/TimeToggle.tsx)

| Button | Tooltip Text | Status |
|--------|--------------|--------|
| 2014/2023/Current buttons | Shows full date on hover (already implemented at line 88) | ✅ EXISTS |

**Notes:**
- Already has tooltips showing formatted dates
- Verify they still work correctly

---

#### 3.4 Zoom Controls ⏸️ NOT STARTED
**File:** Map component (Leaflet defaults)

| Control | Tooltip Text | Status |
|---------|--------------|--------|
| Zoom in (+) | Leaflet provides default | ✅ EXISTS |
| Zoom out (-) | Leaflet provides default | ✅ EXISTS |

**Notes:**
- Leaflet provides native tooltips
- Could customize for consistency, but low priority

---

## Implementation Checklist

### For Each Tooltip Addition:

- [ ] **Read component code** to understand functionality
- [ ] **Test interaction** to verify behavior
- [ ] **Write accurate tooltip text** (action-focused, concise)
- [ ] **Add to config file** (when created) or use translation key
- [ ] **Wrap element with Tooltip component**
- [ ] **Preserve existing aria-labels** (tooltips complement, don't replace)
- [ ] **Test keyboard accessibility** (tooltip shows on focus)
- [ ] **Verify no layout issues** (tooltip doesn't break positioning)
- [ ] **Run tests** to ensure no regressions

---

## Configuration File Structure (To Be Created)

**File:** `src/config/tooltips.ts`

```typescript
/**
 * Centralized tooltip content configuration
 *
 * All tooltip text in one place for:
 * - Easy maintenance
 * - Consistency
 * - Future translation to Arabic
 */

export const TOOLTIPS = {
  HEADER: {
    HOME: "Return to Dashboard",
    HELP: "View page instructions and keyboard shortcuts",
    LANGUAGE: "Switch language (Current: English)", // TODO: Make dynamic
    DARK_MODE_ON: "Switch to light mode",
    DARK_MODE_OFF: "Switch to dark mode",
    MENU_OPEN: "Open navigation menu",
    MENU_CLOSE: "Close navigation menu",
  },

  NAVIGATION: {
    DASHBOARD: "Interactive map and timeline overview",
    TIMELINE: "Satellite comparison with historical imagery",
    DATA: "Full table view with export options",
    STATS: "Statistical analysis and impact data",
    ABOUT: "Project information and methodology",
    RESOURCES: "Donation links and external resources",
  },

  TIMELINE: {
    PAUSE: "Pause timeline animation",
    RESET: "Reset timeline to beginning",
    PREV_EVENT: "Jump to previous destruction event",
    NEXT_EVENT: "Jump to next destruction event",
    SPEED: "Timeline animation playback speed",
    SYNC_MAP: "Automatically update satellite imagery to match timeline date",
    ZOOM_TO_SITE: "Automatically zoom map to selected heritage site",
    SHOW_MARKERS: "Display markers for all heritage sites on map",
  },

  WAYBACK: {
    PREV_RELEASE: "Go to previous satellite image release",
    NEXT_RELEASE: "Go to next satellite image release",
    COMPARISON_MODE: "Show before/after satellite maps side-by-side",
    INTERVAL: "Time gap between before/after satellite images",
    SYNC_VERSION: "Auto-sync map imagery when clicking timeline events",
  },

  FILTERS: {
    CLEAR_SEARCH: "Clear search",
    TYPE_FILTER: "Filter by heritage site type (mosque, church, archaeological site, etc.)",
    STATUS_FILTER: "Filter by damage status (destroyed, heavily damaged, etc.)",
    DATE_FILTER: "Filter by date of destruction",
    YEAR_FILTER: "Filter by year built (supports BCE dates)",
    CLEAR_ALL: "Remove all active filters",
    OPEN_MOBILE: "Open filters panel",
    REMOVE_PILL: "Remove this filter",
  },

  TABLE: {
    EXPAND: "Open full table view in new page",
    EXPORT_FORMAT: "Choose export file format (CSV, JSON, or GeoJSON)",
    EXPORT_BUTTON: "Download filtered sites", // TODO: Make format dynamic
    SORT_COLUMN: "Click to sort by {{column}}", // TODO: Make dynamic
    SORT_ASC: "Sorted ascending - click to reverse",
    SORT_DESC: "Sorted descending - click to reverse",
  },

  MAP: {
    // Most already exist or are Leaflet defaults
  },
} as const;
```

---

## Testing Strategy

### Manual Testing for Each Component:

1. **Hover test:** Does tooltip appear on mouse hover?
2. **Focus test:** Does tooltip appear when tabbing to element with keyboard?
3. **Position test:** Does tooltip stay within viewport bounds?
4. **Accuracy test:** Does tooltip text match actual behavior?
5. **No conflicts:** Does tooltip interfere with clicks or other tooltips?

### Automated Testing:

- Existing tests should continue passing (no regressions)
- Consider adding tooltip-specific tests for critical paths
- Use Vitest's `fireEvent.mouseEnter` to test tooltip visibility

---

## Notes for Future Sessions

### When Resuming Work:

1. **Check status columns** in tables above
2. **Mark in-progress items** with ⏳ emoji
3. **Mark completed items** with ✅ emoji
4. **Update "Status" column** with commit hash when done
5. **Run tests after each phase** (`npm test`)

### Common Pitfalls to Avoid:

- ❌ Don't write tooltips without reading component logic
- ❌ Don't remove existing aria-labels (keep them!)
- ❌ Don't use tooltips as a crutch for bad UX (fix the UX instead)
- ❌ Don't make tooltips too verbose (keep concise)
- ❌ Don't forget to test keyboard accessibility

### Arabic Translation Notes (For Later):

- Most tooltips use translation keys from `src/i18n/en.ts`
- New tooltips should either:
  1. Use existing translation keys, OR
  2. Be added to `tooltips.ts` config for later translation
- RTL (right-to-left) should work automatically with existing i18n setup
- Test Arabic tooltips for: text direction, positioning, overflow

---

## Progress Summary

**Total Interactive Elements Identified:** ~100+

**Phase 1 (High Priority):** ~15-20 icon-only buttons
**Phase 2 (Medium Priority):** ~15-20 abbreviated buttons
**Phase 3 (Low Priority):** ~20-30 contextual tooltips

**Current Status:**
- ⏸️ Phase 1: Not Started (0% complete)
- ⏸️ Phase 2: Not Started (0% complete)
- ⏸️ Phase 3: Not Started (0% complete)

**Next Action:**
1. Review existing InfoIconWithTooltip instances for accuracy
2. Create `src/config/tooltips.ts` configuration file
3. Start Phase 1.1 (AppHeader icon-only buttons)

---

**Last Updated:** 2025-11-12
**Session Note:** This is a living document. Update status as you progress!
