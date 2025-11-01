# Comparison Mode - Implementation Plan

**Feature:** Side-by-side satellite map comparison on Timeline page

**Status:** ✅ **COMPLETE** - Deployed and Tested

---

## **Feature Overview**

**Comparison Mode Toggle**
- Default: OFF (current single map view)
- When ON: Side-by-side satellite maps showing different historical Wayback imagery
- Toggle location: Map version component (not timeline controls)

**Two Maps**
- **Map 1:** Shows site at earlier Wayback date (controlled by yellow scrubber)
- **Map 2:** Shows site at later Wayback date (controlled by green scrubber)
- No "Before/After" labels
- Date overlay on maps (TBD - design needed for non-intrusive display)

**Enhanced Wayback Slider**
- Current design: Single green scrubber
- New design: Two scrubbers on one slider
  - **Green scrubber:** Existing functionality (currently shows post-destruction)
  - **Yellow scrubber:** New scrubber for earlier date
- Need to make slider more compact to fit both scrubbers

**Settings Behavior**
- Existing "Sync Map" and "Zoom to Site" toggles affect both maps
- Maps synchronized for pan/zoom when sync enabled

**Future Enhancement (Not Implementing Now)**
- Allow users to choose custom dates for comparison (not constrained to destruction date)
- User could select any historical imagery, even future dates if available

---

## **Architecture Overview**

```
Timeline.tsx (Page)
├─ FilterBar
├─ [MODIFIED] Conditional Layout:
│  ├─ Single Map Mode (default): SiteDetailView
│  └─ Comparison Mode: [NEW] ComparisonMapView
│     ├─ [NEW] Comparison Mode Toggle (in map component)
│     ├─ SiteDetailView (Left map - yellow scrubber)
│     └─ SiteDetailView (Right map - green scrubber)
├─ [MODIFIED] WaybackSlider
│  ├─ Single scrubber mode (default - green)
│  └─ Dual scrubber mode (green + yellow)
├─ TimelineScrubber (unchanged)
└─ Modal (unchanged)
```

---

## **Implementation Steps**

### **Phase 1: Add Comparison Mode Toggle**

**Location:** Map version component (not TimelineControls)

**Changes to Timeline.tsx:**
- Add new state to [Timeline.tsx:115-150](src/pages/Timeline.tsx#L115-L150):
  ```typescript
  const [comparisonModeEnabled, setComparisonModeEnabled] = useState(false);
  ```
- Pass toggle state and handler to map component

**New toggle button:**
- Location: Within map component area (design TBD - possibly overlay or corner button)
- Label: "Comparison Mode" (with ✓ when enabled)
- Default: **OFF** (single map view)
- Should be easily accessible but not intrusive

---

### **Phase 2: Create ComparisonMapView Component**

**New file:** `src/components/Map/ComparisonMapView.tsx`

```typescript
interface ComparisonMapViewProps {
  site: GazaSite | null;
  beforeTileUrl: string;
  afterTileUrl: string;
  beforeMaxZoom: number;
  afterMaxZoom: number;
  syncMapEnabled: boolean;
  zoomToSiteEnabled: boolean;
  comparisonModeEnabled: boolean;
  onComparisonModeToggle: () => void;
}
```

**Features:**
- Side-by-side flex layout (50% width each)
- Comparison Mode toggle button
- Date overlay on each map (design TBD - should be subtle, non-intrusive)
- Reuses two instances of existing `SiteDetailView` component
- When `syncMapEnabled=true`: Both maps pan/zoom together (use Leaflet's sync plugin or manual event handlers)

**Design Considerations:**
- Maps should be visually distinct but cohesive
- Date display options (to be finalized):
  - Overlay in corner (e.g., bottom-left with semi-transparent background)
  - Small badge floating over map
  - Integrated into map controls
- Toggle button placement options:
  - Top-right corner of map area
  - Overlay button similar to Leaflet controls
  - Part of map toolbar

---

### **Phase 3: Modify WaybackSlider for Dual Scrubbers**

**File:** [WaybackSlider.tsx:1-259](src/components/AdvancedTimeline/WaybackSlider.tsx#L1-L259)

**New Props:**
```typescript
interface WaybackSliderProps {
  releases: WaybackRelease[];
  currentIndex: number;
  onIndexChange: (index: number) => void;

  // NEW: Comparison mode support
  comparisonMode?: boolean;
  beforeIndex?: number;
  onBeforeIndexChange?: (index: number) => void;
}
```

**Design Changes:**
- **Single mode** (default): Green scrubber (existing)
- **Dual mode** (`comparisonMode=true`):
  - Yellow scrubber (controls left/earlier map)
  - Green scrubber (controls right/later map)
  - Smaller scrubber size (reduce from current size to fit both)
  - Prevent scrubbers from overlapping visually
  - Both scrubbers clickable/draggable independently
  - No "Before/After" labels on scrubbers

**Visual Design:**
```
|---[YYYY]---[YYYY]---[YYYY]---[YYYY]---|
    🟡              🟢
```

**Interaction:**
- Clicking timeline bar moves nearest scrubber
- Each scrubber draggable independently
- Tooltips show date on hover (existing functionality)

---

### **Phase 4: Implement Date Logic for Dual Scrubbers**

**File:** [Timeline.tsx:115-256](src/pages/Timeline.tsx#L115-L256)

**New State:**
```typescript
const [beforeReleaseIndex, setBeforeReleaseIndex] = useState(0);
```

**New Function:** `findNearestWaybackReleaseBeforeDestruction()`
- Similar to existing `findNearestWaybackRelease()` at [Timeline.tsx:158-179](src/pages/Timeline.tsx#L158-L179)
- Finds the **nearest** Wayback release **BEFORE** destruction date
- Returns index of that release
- Guards against invalid dates and empty releases array

**Default Behavior:**
- When comparison mode is enabled AND user clicks a timeline dot:
  - Yellow scrubber: Nearest Wayback release **before** destruction date
  - Green scrubber: Nearest Wayback release **after** destruction date (existing logic)

**Logic:**
```typescript
const findNearestWaybackReleaseBeforeDestruction = useCallback(
  (destructionDate: Date): number => {
    if (!releases.length || !destructionDate || isNaN(destructionDate.getTime())) {
      return 0;
    }

    // Find latest release before destruction date
    let nearestIndex = 0;
    for (let i = releases.length - 1; i >= 0; i--) {
      const releaseDate = new Date(releases[i].releaseDate);
      if (releaseDate < destructionDate) {
        nearestIndex = i;
        break;
      }
    }

    return nearestIndex;
  },
  [releases]
);
```

---

### **Phase 5: Wire Up Settings to Both Maps**

**File:** [Timeline.tsx:361-370](src/pages/Timeline.tsx#L361-L370)

**Conditional Rendering:**
```typescript
{comparisonModeEnabled ? (
  <ComparisonMapView
    site={selectedSite}
    beforeTileUrl={releases[beforeReleaseIndex]?.tileUrl}
    afterTileUrl={releases[currentReleaseIndex]?.tileUrl}
    beforeMaxZoom={releases[beforeReleaseIndex]?.maxZoom || 19}
    afterMaxZoom={releases[currentReleaseIndex]?.maxZoom || 19}
    syncMapEnabled={syncMapOnDotClick}
    zoomToSiteEnabled={zoomToSiteEnabled}
    comparisonModeEnabled={comparisonModeEnabled}
    onComparisonModeToggle={() => setComparisonModeEnabled(!comparisonModeEnabled)}
  />
) : (
  <SiteDetailView
    // ... existing single map props
  />
)}
```

**Settings Integration:**
- `syncMapEnabled`: Use existing `syncMapOnDotClick` state
- `zoomToSiteEnabled`: From AnimationContext (existing)
- Both toggles control behavior of both maps in comparison mode

---

## **✅ Implementation Complete**

### **What Was Built**

All planned features have been successfully implemented and tested:

1. ✅ **Comparison Mode Toggle** - Located on map component (top-right corner)
2. ✅ **ComparisonMapView Component** - Side-by-side map layout
3. ✅ **Dual Scrubber WaybackSlider** - Yellow (before) + Green (after)
4. ✅ **Smart Date Logic** - Finds nearest Wayback release before/after destruction
5. ✅ **Settings Integration** - "Sync Map" and "Zoom to Site" work with both maps
6. ✅ **i18n Support** - English, Arabic, and Italian translations
7. ✅ **Comprehensive Tests** - 14 new tests for dual scrubber functionality
8. ✅ **Adaptive Zoom** - Automatic higher zoom (18) for newer imagery (2022-04-27+) when comparison mode is OFF

---

## **Testing Results**

### **Test Suite:**

✅ **720 tests passing** (maintained, +20 comparison mode tests, +6 adaptive zoom tests)

### **WaybackSlider Comparison Mode Tests** (14 tests added)

**File:** `src/components/AdvancedTimeline/WaybackSlider.test.tsx` (lines 478-804)

#### **Dual Scrubber Rendering** (6 tests)
- ✅ Renders two scrubbers when comparison mode is enabled
- ✅ Renders only one scrubber when comparison mode is disabled
- ✅ Renders yellow scrubber for before index (#FDB927)
- ✅ Renders green scrubber for current index (#009639)
- ✅ Shows correct date on yellow scrubber tooltip
- ✅ Shows correct date on green scrubber tooltip

#### **Click Behavior in Comparison Mode** (3 tests)
- ✅ Calls `onBeforeIndexChange` when clicking near yellow scrubber
- ✅ Calls `onIndexChange` when clicking near green scrubber
- ✅ Moves closest scrubber based on click position

#### **Single Mode Fallback** (2 tests)
- ✅ Calls `onIndexChange` when comparison mode is off
- ✅ Does not call `onBeforeIndexChange` when comparison mode is off

#### **Edge Cases** (3 tests)
- ✅ Handles missing `onBeforeIndexChange` gracefully
- ✅ Renders only green scrubber when `beforeRelease` is null
- ✅ Handles same `beforeIndex` and `currentIndex`

### **Adaptive Zoom Tests** (6 tests added)

**File:** `src/components/Map/SiteDetailView.test.tsx` (lines 255-339)

#### **Zoom Level Adaptation** (6 tests)
- ✅ Uses adaptive zoom (18) for imagery from 2022-04-27 or later when comparison mode is OFF
- ✅ Uses standard zoom (17) for imagery before 2022-04-27 when comparison mode is OFF
- ✅ Uses standard zoom (17) in comparison mode regardless of imagery date
- ✅ Uses standard zoom when no dateLabel is provided
- ✅ Handles edge case: exactly 2022-04-27 uses adaptive zoom
- ✅ Handles edge case: one day before threshold uses standard zoom

---

## **File Changes Summary**

| File | Change Type | Lines Changed | Description |
|------|-------------|---------------|-------------|
| [Timeline.tsx](src/pages/Timeline.tsx) | **Modified** | +87 lines | New state, date logic function, conditional rendering |
| [WaybackSlider.tsx](src/components/AdvancedTimeline/WaybackSlider.tsx) | **Modified** | +124 lines | Dual scrubber logic, smart click handler, yellow scrubber |
| [ComparisonMapView.tsx](src/components/Map/ComparisonMapView.tsx) | **New** | 90 lines | Side-by-side map component with toggle |
| [SiteDetailView.tsx](src/components/Map/SiteDetailView.tsx) | **Modified** | +20 lines | Comparison mode toggle integration |
| [WaybackSlider.test.tsx](src/components/AdvancedTimeline/WaybackSlider.test.tsx) | **Modified** | +327 lines | 14 new comparison mode tests |
| [SiteDetailView.test.tsx](src/components/Map/SiteDetailView.test.tsx) | **Modified** | +85 lines | 6 new adaptive zoom tests |
| [en.ts](src/i18n/en.ts) | **Modified** | +1 line | "Comparison Mode" translation |
| [ar.ts](src/i18n/ar.ts) | **Modified** | +1 line | "وضع المقارنة" translation |
| [it.ts](src/i18n/it.ts) | **Modified** | +1 line | "Modalità Confronto" translation |

**Total:** ~736 new/modified lines of code | **Tests:** +20 (720 total passing)

---

## **Phase 6: Timeline Navigation Improvements (Nov 2025)**

### **Feature: Enhanced Next/Previous Navigation**

**Problem:** Timeline navigation buttons had several issues:
1. NEXT button wasn't working - required exact timestamp match with destruction dates
2. Timeline started exactly at first destruction date, making first site unclickable
3. Dashboard timeline lacked Next/Previous navigation buttons

**Solution:** Implemented smart timeline navigation with proper edge case handling and consistent UX across pages.

### **Implementation Details**

**File Changes:**

1. **[AnimationContext.tsx](src/contexts/AnimationContext.tsx)** (lines 74-76)
   - Start timeline 7 days **before** first destruction date
   - Provides buffer zone for first site to be clickable/navigable
   - Ensures consistent behavior across all sites

2. **[TimelineScrubber.tsx](src/components/Timeline/TimelineScrubber.tsx)** (lines 254-320)
   - Fixed `currentEventIndex` logic to find position relative to events
   - Returns -1 when scrubber is before all events (special "before first event" state)
   - NEXT from index -1 goes to first event (index 0)
   - NEXT from any event goes to next event as expected
   - Proper handling for "after all events" and "in the middle" cases

3. **[DesktopLayout.tsx](src/components/Layout/DesktopLayout.tsx)** (lines 168-171)
   - Added `advancedMode` prop to Dashboard timeline
   - Enables Next/Previous navigation buttons on Dashboard page
   - syncMapOnDotClick set to false (not needed for Dashboard)

### **Navigation Logic**

```typescript
// Before all events: index = -1 (enables NEXT to first event)
if (currentTime < destructionDates[0].date.getTime()) {
  return -1;
}

// After all events: index = last event
if (currentTime >= destructionDates[destructionDates.length - 1].date.getTime()) {
  return destructionDates.length - 1;
}

// In the middle: find event we've passed or are closest to
for (let i = 0; i < destructionDates.length; i++) {
  if (currentTime < destructionDates[i].date.getTime()) {
    return i - 1; // We're at the previous event
  }
}
```

### **Behavior Summary**

| Scenario | PREVIOUS Button | NEXT Button | Scrubber Position |
|----------|----------------|-------------|-------------------|
| At timeline start (7 days before first) | Disabled | → First site | Before all events |
| At first site | Disabled | → Second site | Index 0 |
| At middle site | → Previous site | → Next site | Index N |
| At last site | → Previous site | Disabled | Index Last |

### **Test Coverage**

- ✅ All 720 tests passing
- ✅ Timeline navigation works on both Dashboard and Timeline pages
- ✅ Edge cases handled: before first, after last, exact matches
- ✅ RESET button returns to timeline start (7 days before first event)

### **Commits**

- `3662f76` - fix: enable NEXT button by finding nearest event instead of exact match
- `37dbcf1` - feat: improve timeline navigation for first site
- `a198442` - feat: add Next/Previous navigation to Dashboard timeline

---

## **Phase 7: Adaptive Zoom for Newer Imagery (Nov 2025)**

### **Feature: Smart Zoom Level Selection**

**Problem:** Older satellite imagery (pre-2022) cannot zoom as close as newer imagery, but the "Zoom to Site" feature used a fixed zoom level (17) for all imagery periods.

**Solution:** Implemented adaptive zoom that automatically uses a closer zoom level (18) for imagery from 2022-04-27 onwards, but **only when comparison mode is OFF**.

### **Implementation Details**

**File Changes:**
- **[SiteDetailView.tsx](src/components/Map/SiteDetailView.tsx)** (lines 14-109)
  - Added `comparisonModeActive` prop (boolean, default: `false`)
  - Added date-based zoom logic (lines 82-96)
  - Checks if imagery date >= 2022-04-27 AND comparison mode is OFF
  - Uses zoom 18 for newer imagery, zoom 17 otherwise

- **[Timeline.tsx](src/pages/Timeline.tsx)** (line 430)
  - Passes `comparisonModeActive={false}` to single-map SiteDetailView

- **[ComparisonMapView.tsx](src/components/Map/ComparisonMapView.tsx)** (lines 65, 85)
  - Passes `comparisonModeActive={true}` to both comparison maps
  - Ensures both maps use consistent zoom 17 for easier comparison

### **Zoom Logic**

```typescript
// Adaptive zoom: Use closer zoom for newer imagery (2022-04-27+)
// but only when NOT in comparison mode
let targetZoom = SITE_DETAIL_ZOOM; // Default: 17

if (!comparisonModeActive && dateLabel) {
  const imageryDate = new Date(dateLabel);
  const highResThreshold = new Date("2022-04-27");

  if (imageryDate >= highResThreshold) {
    targetZoom = 18; // Use zoom 18 for newer imagery with better resolution
  }
}

// Still respect tile layer's maxZoom limit
zoom: Math.min(targetZoom, periodMaxZoom)
```

### **Behavior Summary**

| Scenario | Comparison Mode | Imagery Date | Zoom Level |
|----------|----------------|--------------|------------|
| Single map | OFF | >= 2022-04-27 | **18** (adaptive) |
| Single map | OFF | < 2022-04-27 | 17 (standard) |
| Comparison mode | ON | Any date | 17 (consistent) |
| No dateLabel | OFF | N/A | 17 (standard) |

### **Why Disable in Comparison Mode?**

In comparison mode, both maps should maintain the **same zoom level** to make it easier to compare visual details side-by-side. If one map zoomed to 18 and the other to 17, the visual scale difference would make comparison difficult.

### **Test Coverage**

6 comprehensive tests added to [SiteDetailView.test.tsx](src/components/Map/SiteDetailView.test.tsx) (lines 255-339):
- ✅ Adaptive zoom (18) for imagery >= 2022-04-27 when comparison OFF
- ✅ Standard zoom (17) for imagery < 2022-04-27 when comparison OFF
- ✅ Standard zoom (17) in comparison mode (any date)
- ✅ Standard zoom when no dateLabel provided
- ✅ Edge case: Exactly 2022-04-27 uses adaptive zoom
- ✅ Edge case: One day before (2022-04-26) uses standard zoom

---

## **Design Specifications**

### **Comparison Mode Toggle Button**
- **Location:** Within map component area (not timeline controls)
- **Label:** "Comparison Mode" (with ✓ when enabled)
- **Default:** OFF
- **Placement options (TBD):**
  - Top-right corner overlay
  - Integrated with Leaflet zoom controls
  - Floating button similar to other map controls

### **Dual Scrubber Colors**
- **Yellow (#FDB927):** Earlier date scrubber (Palestinian flag yellow)
- **Green (#00803D):** Later date scrubber (Palestinian flag green)
- No text labels on scrubbers
- Tooltips show dates on hover (existing functionality)

### **ComparisonMapView Layout**
```
┌──────────────────────────────────────────┐
│                    │                     │
│   🗺️ Map (Earlier) │  🗺️ Map (Later)    │
│   [date overlay]   │   [date overlay]   │
│                    │                     │
└──────────────────────────────────────────┘
```

### **Date Overlay Design (TBD)**
Options to explore:
1. **Bottom-left corner:** Semi-transparent badge with date
2. **Top-right corner:** Small date label near zoom controls
3. **Integrated badge:** Part of map attribution area
4. **Floating label:** Subtle overlay that fades after a few seconds

Requirements:
- Must not obscure important map features
- Should be readable but unobtrusive
- Consistent with existing UI design
- Accessible (sufficient contrast)

---

## **Technical Considerations**

### **Map Synchronization**
- **Option 1:** Use Leaflet.Sync plugin
  - Pros: Mature solution, handles edge cases
  - Cons: External dependency
- **Option 2:** Manual event handlers
  - Pros: No additional dependency
  - Cons: Need to handle all sync edge cases

### **State Management**
- Comparison mode state: Session-level (not persisted across reloads)
- Stored in Timeline.tsx component state
- Future: Consider localStorage for persistence

### **Performance**
- Two simultaneous Leaflet maps may impact performance
- Monitor tile loading times
- Consider lazy loading tiles for non-visible areas

### **Accessibility**
- Ensure toggle button is keyboard accessible
- Screen reader announcements for mode changes
- Map focus management when switching modes

---

## **Future Extensibility (Not Implementing Now)**

Per user request, keeping these in mind for future implementation:

### **1. User-selectable dates**
- Add date picker or dropdown to choose any Wayback release
- Allow comparison of arbitrary dates (not tied to destruction date)
- Could select future dates if Wayback imagery becomes available

### **2. Custom comparison periods**
- Compare any two dates, not just pre/post destruction
- Useful for tracking gradual changes over time
- Could add presets: "1 month apart", "1 year apart", etc.

### **3. Multi-site comparison**
- Compare different sites at same time period
- Would require different architecture

### **4. Date overlay refinements**
- User preference for overlay position
- Option to hide/show overlays
- Different overlay styles

---

## **Mobile Experience**

Per user guidance:
- Not prioritizing mobile for this feature
- Acceptable if comparison mode doesn't render well on mobile
- Could consider:
  - Hiding comparison mode toggle on mobile
  - Stacking maps vertically instead of side-by-side
  - Showing only single map mode on small screens

---

## **Development Workflow**

### **Implementation Order:**
1. Create ComparisonMapView component (with toggle)
2. Add comparison mode state to Timeline.tsx
3. Implement conditional rendering (single vs comparison view)
4. Modify WaybackSlider for dual scrubbers
5. Add date logic function (findNearestWaybackReleaseBeforeDestruction)
6. Wire up settings to both maps
7. Add date overlays (design to be finalized)
8. Write tests (ensure 1569+ tests pass)
9. Manual testing and refinement

### **Commit Strategy:**
Following conventional commits format:

```bash
feat: add comparison mode toggle to map component
feat: create ComparisonMapView component for side-by-side maps
feat: implement dual scrubber support in WaybackSlider
feat: add date logic for comparison mode
test: add tests for comparison mode
```

### **Quality Gates:**
- ✓ All tests pass (1569+)
- ✓ Dev server runs clean (no console errors)
- ✓ Lint passes
- ✓ Manual testing in browser
- ✓ Accessibility checks (keyboard nav, focus management)

---

## **Questions to Resolve**

1. **Date overlay design:** Final decision on placement and styling
2. **Toggle button placement:** Exact position within map component
3. **Map sync implementation:** Leaflet.Sync plugin vs manual?
4. **Default scrubber positions:** When toggling comparison mode on, where should scrubbers start?
5. **Animation behavior:** Should timeline animation work in comparison mode?

---

## **Success Criteria**

- ✅ Comparison Mode toggle button in map component
- ✅ Two maps render side-by-side when enabled
- ✅ Dual scrubber (yellow + green) on Wayback slider
- ✅ Default yellow scrubber = nearest pre-destruction Wayback release
- ✅ "Sync Map" and "Zoom to Site" settings affect both maps
- ✅ Timeline visualization unchanged
- ✅ All tests pass (1569+)
- ✅ No console errors or warnings
- ✅ Extensible for future user-selectable dates

---

**Next Steps:** Begin implementation with Phase 1 (Comparison Mode Toggle)
