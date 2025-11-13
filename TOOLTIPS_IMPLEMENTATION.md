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

## Priority Order & Progress Tracker

### PHASE 1: HIGH PRIORITY - Icon-Only Buttons ⏸️ NOT STARTED

These are critical because users have NO text label indicating functionality.

#### 1.1 AppHeader ⏸️ NOT STARTED
**File:** [src/components/Layout/AppHeader.tsx](src/components/Layout/AppHeader.tsx)

| Element | Line | Current State | Tooltip Text | Status |
|---------|------|---------------|--------------|--------|
| Logo/Home button | 103-116 | No tooltip | "Return to Dashboard" | ⏸️ TODO |
| Help button (?) | 132-140 | Has `title` | "View page instructions and keyboard shortcuts" | ⏸️ TODO |
| Language selector | 142-145 | Has `title` | "Switch language (Current: English)" | ⏸️ TODO |
| Dark mode toggle | 147-155 | Has `title` | "Toggle dark/light theme" | ⏸️ TODO |
| Hamburger menu | 158-164 | Has `title` | "Open navigation menu" / "Close menu" | ⏸️ TODO |

**Notes:**
- Replace `title` attributes with `Tooltip` component for consistency
- Language selector should show current language dynamically
- Dark mode should show current state ("Switch to dark mode" / "Switch to light mode")

---

#### 1.2 Timeline Controls ⏸️ NOT STARTED
**File:** [src/components/Timeline/TimelineControls.tsx](src/components/Timeline/TimelineControls.tsx)

| Element | Line | Current State | Tooltip Text | Status |
|---------|------|---------------|--------------|--------|
| Play button | ~134-147 | Uses `Tooltip` | Already has tooltip from `timeline.playTooltip` | ✅ EXISTS |
| Pause button | ~148-161 | Has `title` | "Pause timeline animation" | ⏸️ TODO |
| Reset button | ~165-176 | Has `title` | "Reset timeline to beginning" | ⏸️ TODO |

**Notes:**
- Read the actual button handlers to verify what "reset" does
- Check if play/pause tooltip is accurate

---

#### 1.3 Timeline Navigation ⏸️ NOT STARTED
**File:** [src/components/Timeline/TimelineNavigation.tsx](src/components/Timeline/TimelineNavigation.tsx)

| Element | Line | Current State | Tooltip Text | Status |
|---------|------|---------------|--------------|--------|
| Previous button | Has `title` | Check translation: `timeline.previousTitle` | "Jump to previous destruction event" | ⏸️ TODO |
| Next button | Has `title` | Check translation: `timeline.nextTitle` | "Jump to next destruction event" | ⏸️ TODO |

**Notes:**
- Verify existing translations are accurate
- Already has aria-labels, just needs Tooltip wrapper

---

#### 1.4 WaybackSlider Navigation ⏸️ NOT STARTED
**File:** [src/components/AdvancedTimeline/WaybackSlider.tsx](src/components/AdvancedTimeline/WaybackSlider.tsx)

| Element | Line | Current State | Tooltip Text | Status |
|---------|------|---------------|--------------|--------|
| Previous button | 328-339 | Has `title` | "Go to previous satellite image release" | ⏸️ TODO |
| Next button | 341-352 | Has `title` | "Go to next satellite image release" | ⏸️ TODO |

**Notes:**
- Distinct from Timeline navigation (different purpose)
- Navigates Wayback releases, not destruction events

---

#### 1.5 SitesTable Controls ⏸️ NOT STARTED
**File:** [src/components/SitesTable/SitesTableDesktop.tsx](src/components/SitesTable/SitesTableDesktop.tsx)

| Element | Line | Current State | Tooltip Text | Status |
|---------|------|---------------|--------------|--------|
| Expand table button | 102-117 | Has `title` + `aria-label` | "Open full table view in new page" | ⏸️ TODO |

**Notes:**
- Icon is expand arrows (⇱ or similar)
- Check translation: `table.expandTable`

---

#### 1.6 FilterBar Controls ⏸️ NOT STARTED
**File:** [src/components/FilterBar/FilterBar.tsx](src/components/FilterBar/FilterBar.tsx)

| Element | Line | Current State | Tooltip Text | Status |
|---------|------|---------------|--------------|--------|
| Clear search (X) | 208-226 | Has `aria-label` | "Clear search" | ⏸️ TODO |
| Mobile filters button | 286-305 | Has `aria-label` | "Open filters panel" | ⏸️ TODO |
| Filter pill remove buttons | 330-365 | Has `aria-label` | "Remove this filter" | ⏸️ TODO |

**Notes:**
- Multiple filter pills may appear, tooltip should be generic
- Check existing translations in `filters.*`

---

### PHASE 2: MEDIUM PRIORITY - Abbreviated Text Buttons ⏸️ NOT STARTED

These have some text but benefit from explanatory tooltips.

#### 2.1 FilterBar Filter Buttons ⏸️ NOT STARTED
**File:** [src/components/FilterBar/FilterBar.tsx](src/components/FilterBar/FilterBar.tsx)

| Element | Line | Button Text | Tooltip Text | Status |
|---------|------|-------------|--------------|--------|
| Type Filter | 231-283 | "Type" | "Filter by heritage site type (mosque, church, archaeological site, etc.)" | ⏸️ TODO |
| Status Filter | 231-283 | "Status" | "Filter by damage status (destroyed, heavily damaged, etc.)" | ⏸️ TODO |
| Destruction Date | 231-283 | "Date" | "Filter by date of destruction" | ⏸️ TODO |
| Year Built | 231-283 | "Year" | "Filter by year built (supports BCE dates)" | ⏸️ TODO |
| Clear All button | 308-317 | "Clear All" | "Remove all active filters" | ⏸️ TODO |

**Notes:**
- Desktop-only buttons (hidden on mobile)
- Could help users understand filter capabilities

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
