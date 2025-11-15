# Timeline Enhancement Feature Plan

**Feature Request:** Comprehensive timeline UX improvements to address data clustering, temporal distribution, and data quality visualization

**Status:** 📋 Planning Phase
**Created:** 2025-11-14
**Last Updated:** 2025-11-14

---

## Problem Statement

### Current UX Issues

**Issue 1: Overlapping Timeline Dots**
Multiple sites sharing the same destruction date or survey date create overlapping dots on the timeline. When a user clicks on these overlapping dots:
- Only one site is selected/highlighted
- User has no indication that multiple sites exist at that date
- Other sites at that location are hidden and undiscoverable

**Issue 2: Temporal Data Clustering**
The timeline shows extreme temporal clustering that creates poor UX:
- **Data distribution analysis:**
  - Oct-Dec 2023: 39 sites (57% of all sites) - heavily clustered
  - Jan-Jul 2024: 7 sites (10%) - sparse, long gaps
  - Survey dates: 69 sites using sourceAssessmentDate fallback (24 in May 2024, 25 in Oct 2025)
- **Visual problems:**
  - 85% of destruction events cluster in first 3 months (Oct-Dec 2023)
  - Large empty periods (Feb-Jul 2024) waste timeline space
  - Timeline spans 24 months but most events in ~90 days
  - Dots are unclickable in dense clusters

**Issue 3: Data Quality Transparency**
No visual distinction between:
- Confirmed destruction dates (`dateDestroyed`)
- Survey/assessment dates (`sourceAssessmentDate`) - fallback when exact date unknown

### Impact
- **Discoverability:** Users miss important sites in dense clusters
- **Data Integrity:** Creates false impression of even temporal distribution
- **User Confusion:** No feedback about clustering or data quality
- **Usability:** Cannot click individual sites in dense areas
- **Misleading visualization:** Oct 2025 cluster misleads users (those are survey dates, not destruction events)

---

## Proposed Solution (4-Phase Plan)

### Phase 1: Data Quality Indicators (PRIORITY 1)
**Goal:** Distinguish between confirmed destruction dates vs survey date fallbacks

**Visual Changes:**
1. **Hollow dots for survey dates:**
   - Sites with `dateDestroyed`: **Solid filled dot** (current style)
   - Sites with only `sourceAssessmentDate`: **Hollow dot** (stroke only, transparent fill)
   - Opacity/stroke style to make distinction clear

2. **Enhanced tooltips:**
   - Solid dot hover: "Confirmed destruction date: [date]"
   - Hollow dot hover: "Survey date: [date] (exact destruction date unknown)"
   - Timeline info icon tooltip: Explain the difference between solid/hollow dots

3. **Legend/Key:**
   - Add small legend near timeline: `● Destruction Date  ○ Survey Date`
   - Position: Below keyboard shortcuts or near info icon

**Implementation Location:**
- File: `src/utils/d3Timeline.ts` (modify `renderEventMarkers()`)
- File: `src/hooks/useTimelineData.ts` (add `dateType` field to TimelineEvent)
- File: `src/components/Timeline/TimelineScrubber.tsx` (add legend)

**Estimated Effort:** 2-3 hours

---

### Phase 2: Density-Based Sizing (PRIORITY 2)
**Goal:** Make clustered dots visually larger to indicate multiple sites at same date

**Visual Changes:**
1. **Dynamic dot sizing based on cluster count:**
   - 1 site: `eventMarkerRadius` (3px) - current default
   - 2-3 sites: `eventMarkerRadius + 1` (4px)
   - 4-5 sites: `eventMarkerRadius + 2` (5px)
   - 6+ sites: `eventMarkerRadius + 3` (6px)

2. **Subtle count badge (optional):**
   - Show count number inside dot when 2+ sites share same date
   - White text, 7px font, centered in dot
   - Only visible when dot is large enough (4px+ radius)

**Implementation Location:**
- File: `src/utils/d3Timeline.ts` (modify `renderClusteredMarkers()`)
- File: `src/hooks/useTimelineData.ts` (return cluster counts)

**Estimated Effort:** 1-2 hours

---

### Phase 3: Interactive Cluster Expansion (PRIORITY 3)
**Goal:** Allow users to click clustered dots and select individual sites

**User Experience Flow:**

1. **Detection:** User clicks on a timeline dot
2. **Check:** System detects if multiple sites share that exact date
3. **Expansion:** If multiple sites exist (2+):
   - Horizontal row of dots "pops up" above the clicked position
   - Each dot represents one site at that date
   - Animation: smooth expand-out effect (300ms, matching existing timeline animations)
   - Dots maintain hollow/solid styling from Phase 1
4. **Interaction:** User can:
   - Hover over each expanded dot to see site name tooltip
   - Click any dot to select that specific site
   - Click outside to collapse back to single dot
5. **Selection:** Clicking an expanded dot:
   - Highlights that site
   - Syncs map if "Sync Map" is enabled
   - Collapses expansion back to single dot
   - Selected dot remains highlighted with green stroke

**Visual Design:**
- **Expansion Direction:** Horizontally above the clicked dot (like a popup menu)
- **Spacing:** 12-16px between expanded dots
- **Animation:**
  - Expand: Scale from 0 to 1, fade in opacity 0 → 1 (300ms ease-out)
  - Collapse: Reverse animation (200ms ease-in)
- **Styling:**
  - Same colors as existing dots (status-based)
  - Maintain hollow/solid distinction from Phase 1
  - Slightly larger radius while expanded (eventMarkerRadius + 1)
  - Background: Semi-transparent white/dark backdrop behind dots
  - Border: 1px stroke around container for definition
- **Z-Index:** Above timeline (Z_INDEX.TIMELINE_TOOLTIP or new Z_INDEX.TIMELINE_CLUSTER)

**Estimated Effort:** 16-19 hours (as detailed in original plan below)

---

### Phase 4: Adaptive Timeline Scale (PRIORITY 4 - TBD)
**Goal:** Compress empty time periods and expand dense clusters for better space utilization

**Status:** ⚠️ **DEFERRED** - High complexity, requires extensive testing and user validation

**Concept:**
- Implement piecewise linear scale (not fully logarithmic) that dynamically adjusts timeline width allocation based on event density
- Add toggle: "Linear Scale" ↔ "Adaptive Scale"
- Visual cues showing non-linear regions (shaded areas, axis annotations)

**Why Deferred:**
- **Complexity:** 2-3 days implementation + extensive testing
- **User confusion risk:** Timelines are expected to be linear
- **Maintenance burden:** Algorithm must handle varying data distributions
- **Dependency:** Best implemented after Phases 1-3 prove successful

**Decision Point:**
- Re-evaluate after Phases 1-3 are complete and battle-tested
- Consider user feedback on whether clustering is still an issue
- A/B test if implemented

**Estimated Effort (if approved):** 20-24 hours

**Implementation Notes (if approved):**
- Use piecewise linear scale, not full logarithmic
- Divide timeline into segments (monthly buckets)
- Allocate width proportional to event density (with min 20px per segment)
- Add toggle in TimelineControls
- Update axis rendering to show scale breaks
- See detailed algorithm in "Phase 4 Implementation Details" section at end of document

---

## Phase 1 & 2 Combined: Quick Wins (3-5 hours total)

These two phases can be implemented together quickly to provide immediate value:

**Combined Changes:**
1. Modify `TimelineEvent` interface to include `dateType: 'destruction' | 'survey'`
2. Update `useTimelineData` hook to:
   - Detect date type based on `dateDestroyed` vs `sourceAssessmentDate`
   - Group events by date to calculate cluster sizes
   - Return both individual events and cluster metadata
3. Modify `renderEventMarkers()` in D3TimelineRenderer to:
   - Render hollow dots for survey dates
   - Size dots based on cluster count
   - Update tooltip text to indicate date type
4. Add legend component to TimelineScrubber

**Files to Modify:**
- `src/utils/d3Timeline.ts` (~50 lines changed)
- `src/hooks/useTimelineData.ts` (~30 lines added)
- `src/components/Timeline/TimelineScrubber.tsx` (~20 lines for legend)

**Testing:**
- Unit tests for `useTimelineData` cluster counting
- Visual regression test for hollow/solid dots
- Tooltip content tests

---

## Phase 3 Detailed Implementation: Cluster Expansion

*(This section contains the original TIMELINE_DOT_CLUSTER_FEATURE.md content)*

---

## Technical Analysis

### Current Architecture

#### 1. Timeline Rendering
**File:** `src/utils/d3Timeline.ts` (D3TimelineRenderer class)

**Current Flow:**
```typescript
renderEventMarkers(events: TimelineEvent[]) {
  // Creates one circle per event
  // No grouping by date
  // Click handler: onTimestampChange + onSiteHighlight (single site)
}
```

**Key Variables:**
- `events: TimelineEvent[]` - Array of all destruction dates (sorted chronologically)
- `timeScale: ScaleTime` - D3 scale mapping Date → X position
- `eventMarkerRadius: 3` - Current dot size

#### 2. Event Data Structure
**File:** `src/hooks/useTimelineData.ts`

```typescript
interface TimelineEvent {
  date: Date;
  siteName: string;
  siteId: string;
  status?: "destroyed" | "heavily-damaged" | "damaged";
}
```

**Current Behavior:**
- Each site creates one TimelineEvent
- No deduplication by date
- Events sorted chronologically only

#### 3. Click Handling
**File:** `src/components/Timeline/TimelineScrubber.tsx` (lines 164-168)

```typescript
onSiteHighlight: onSiteHighlight ? (event) => {
  // Highlight the site when timeline dot is clicked
  onSiteHighlight(event.siteId);
} : undefined,
```

**Current Flow:**
1. Click dot → D3TimelineRenderer.renderEventMarkers() click handler
2. Calls `onTimestampChange(d.date)` (moves scrubber)
3. Calls `onSiteHighlight(d)` (highlights site)
4. Timeline.tsx `handleSiteHighlight()` updates map/wayback if sync enabled

### Existing Similar Patterns

#### Map Clustering (Reference Implementation)
**File:** `src/components/Map/MapMarkers.tsx`

- Already handles multiple sites at same location
- Uses Leaflet's clustering plugin for close proximity
- **Key Difference:** Map uses spatial clustering (proximity), timeline needs exact date matching

#### Animation Patterns
**File:** `src/config/animation.ts`

- 300ms transitions (standard)
- 60fps frame rate
- ease-in/ease-out curves

**File:** `src/utils/d3Timeline.ts` (lines 173, 189-213)

```typescript
.style("transition", "all 0.2s"); // Hover transitions
.transition().duration(150) // Marker hover expand
```

---

## Implementation Plan

### PHASE 1 & 2: Data Quality + Density Indicators (3-5 hours)

**Step 1.1: Update Type Definitions**

**File:** `src/utils/d3Timeline.ts`

```typescript
export interface TimelineEvent {
  date: Date;
  siteName: string;
  siteId: string;
  status?: "destroyed" | "heavily-damaged" | "damaged";
  dateType: "destruction" | "survey"; // NEW: Indicates data quality
}
```

**Step 1.2: Modify useTimelineData Hook**

**File:** `src/hooks/useTimelineData.ts`

```typescript
import { getEffectiveDestructionDate } from "../utils/format";

export function useTimelineData(sites: Site[]) {
  return useMemo(() => {
    // Create individual events with dateType
    const destructionDates: TimelineEvent[] = sites
      .filter((site) => getEffectiveDestructionDate(site))
      .map((site) => {
        const effectiveDate = getEffectiveDestructionDate(site);
        // NEW: Determine if this is a confirmed destruction date or survey fallback
        const dateType = site.dateDestroyed ? "destruction" : "survey";

        return {
          date: new Date(effectiveDate!),
          siteName: site.name,
          siteId: site.id,
          status: site.status as "destroyed" | "heavily-damaged" | "damaged" | undefined,
          dateType, // NEW
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // GROUP BY DATE: Create clusters for density-based sizing
    const dateMap = new Map<string, TimelineEvent[]>();
    destructionDates.forEach(event => {
      const dateKey = event.date.toISOString();
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(event);
    });

    // Create cluster metadata (count per date)
    const clusterSizes = new Map<string, number>();
    dateMap.forEach((events, dateKey) => {
      clusterSizes.set(dateKey, events.length);
    });

    // Calculate event density
    const eventDensity = destructionDates.length > 0
      ? destructionDates.length /
          ((destructionDates[destructionDates.length - 1].date.getTime() -
            destructionDates[0].date.getTime()) /
            (1000 * 60 * 60 * 24))
      : 0;

    return {
      events: destructionDates,
      clusterSizes, // NEW: Map of date → count
      totalEvents: destructionDates.length,
      eventDensity,
    };
  }, [sites]);
}
```

**Step 1.3: Update D3 Timeline Renderer**

**File:** `src/utils/d3Timeline.ts`

Add cluster size parameter to render method:

```typescript
/**
 * Render the complete timeline (axis, events, scrubber)
 */
render(
  events: TimelineEvent[],
  currentTimestamp: Date,
  highlightedSiteId: string | null = null,
  clusterSizes?: Map<string, number> // NEW: Optional cluster size map
) {
  this.highlightedSiteId = highlightedSiteId;
  this.clusterSizes = clusterSizes; // Store for use in renderEventMarkers
  this.svg.selectAll("*").remove();
  this.renderAxis();
  this.renderEventMarkers(events);
  this.renderScrubber(currentTimestamp);
}

// Add private property
private clusterSizes?: Map<string, number>;
```

Modify `renderEventMarkers()` for hollow dots + sizing:

```typescript
private renderEventMarkers(events: TimelineEvent[]) {
  const { height, eventMarkerRadius, colors } = this.config;

  const markerGroups = this.svg
    .selectAll("g.event-marker-group")
    .data(events)
    .enter()
    .append("g")
    .attr("class", "event-marker-group");

  const markers = markerGroups
    .append("circle")
    .attr("class", "event-marker")
    .attr("cx", (d) => this.timeScale(d.date))
    .attr("cy", height / 2)
    .attr("r", (d) => {
      // PHASE 2: Density-based sizing
      const clusterSize = this.clusterSizes?.get(d.date.toISOString()) || 1;
      let sizeBoost = 0;
      if (clusterSize >= 6) sizeBoost = 3;
      else if (clusterSize >= 4) sizeBoost = 2;
      else if (clusterSize >= 2) sizeBoost = 1;

      const baseRadius = eventMarkerRadius + sizeBoost;
      return d.siteId === this.highlightedSiteId ? baseRadius + 2 : baseRadius;
    })
    .attr("fill", (d) => {
      // PHASE 1: Hollow dots for survey dates
      if (d.dateType === "survey") {
        return "transparent"; // Hollow
      }
      return this.getMarkerColor(d.status); // Solid
    })
    .attr("stroke", (d) => {
      if (d.siteId === this.highlightedSiteId) {
        return "#009639"; // Green for highlighted
      }
      // Survey dates: lighter stroke
      if (d.dateType === "survey") {
        return "#6b7280"; // gray-500
      }
      return colors.eventMarkerStroke; // Black for destruction dates
    })
    .attr("stroke-width", (d) => {
      if (d.siteId === this.highlightedSiteId) return 3;
      // Slightly thicker stroke for hollow dots so they're visible
      return d.dateType === "survey" ? 2 : 1.5;
    })
    .style("cursor", "pointer")
    .style("transition", "all 0.2s");

  // Date labels (existing code, update tooltip text)
  markerGroups
    .append("text")
    .attr("class", "event-date-label")
    .attr("x", (d) => this.timeScale(d.date))
    .attr("y", height / 2 - eventMarkerRadius - 8)
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("font-weight", "500")
    .attr("fill", "#9ca3af")
    .attr("opacity", 0)
    .style("pointer-events", "none")
    .text((d) => {
      // PHASE 1: Indicate date type in label
      const dateStr = timeFormat("%b %d, %Y")(d.date);
      return d.dateType === "survey" ? `${dateStr} (survey)` : dateStr;
    });

  // Hover effects (existing code)
  markerGroups
    .on("mouseenter", function () {
      const group = select(this);
      group.select("circle")
        .transition()
        .duration(150)
        .attr("r", eventMarkerRadius + 2)
        .attr("stroke-width", 2);

      group.select("text")
        .transition()
        .duration(150)
        .attr("opacity", 1);
    })
    .on("mouseleave", function () {
      const group = select(this);
      group.select("circle")
        .transition()
        .duration(150)
        .attr("r", eventMarkerRadius)
        .attr("stroke-width", 1.5);

      group.select("text")
        .transition()
        .duration(150)
        .attr("opacity", 0);
    })
    .on("click", (_event, d) => {
      this.onTimestampChange(d.date);
      this.onPause();
      if (this.onSiteHighlight) {
        this.onSiteHighlight(d);
      }
    });

  // PHASE 1: Enhanced tooltip with date type
  markers
    .append("title")
    .text((d) => {
      const dateStr = timeFormat("%B %d, %Y")(d.date);
      const clusterSize = this.clusterSizes?.get(d.date.toISOString()) || 1;
      const clusterInfo = clusterSize > 1 ? `\n(${clusterSize} sites at this date)` : "";
      const dateTypeInfo = d.dateType === "survey"
        ? "\nSurvey date (exact destruction date unknown)"
        : "\nConfirmed destruction date";
      const statusInfo = d.status ? `\nStatus: ${d.status.replace("-", " ")}` : "";

      return `${d.siteName}\n${dateStr}${dateTypeInfo}${clusterInfo}${statusInfo}`;
    });
}
```

**Step 1.4: Update TimelineScrubber Component**

**File:** `src/components/Timeline/TimelineScrubber.tsx`

```typescript
// Extract timeline data (now includes clusterSizes)
const { events: allDestructionDates, clusterSizes } = useTimelineData(sites);

// Pass clusterSizes to D3 renderer
useEffect(() => {
  // ... existing setup ...

  rendererRef.current.render(
    destructionDates,
    currentTimestamp,
    highlightedSiteId,
    clusterSizes // NEW
  );

  // ... cleanup ...
}, [
  svgMounted,
  timeScale,
  destructionDates,
  currentTimestamp,
  highlightedSiteId,
  clusterSizes, // NEW dependency
  setTimestamp,
  pause,
  onSiteHighlight
]);
```

**Step 1.5: Add Legend**

**File:** `src/components/Timeline/TimelineScrubber.tsx`

Add legend after keyboard shortcuts:

```tsx
{/* Keyboard shortcuts hint - hidden below 1280px */}
<div className={`hidden xl:block mt-0.5 text-[10px] text-center leading-tight ${t.text.muted}`}>
  {translate("timeline.keyboard")}: <kbd>...</kbd>
  {/* ... existing keyboard shortcuts ... */}
</div>

{/* NEW: Timeline legend - always visible */}
<div className={`mt-1 text-[9px] text-center leading-tight ${t.text.muted} flex items-center justify-center gap-3`}>
  <span className="flex items-center gap-1">
    <svg width="10" height="10">
      <circle cx="5" cy="5" r="3" fill="#dc2626" stroke="#000" strokeWidth="1" />
    </svg>
    Destruction Date
  </span>
  <span className="flex items-center gap-1">
    <svg width="10" height="10">
      <circle cx="5" cy="5" r="3" fill="transparent" stroke="#6b7280" strokeWidth="1.5" />
    </svg>
    Survey Date
  </span>
</div>
```

**Step 1.6: Update Info Tooltip**

**File:** `src/locales/en.json` and `ar.json`

Update timeline tooltips:

```json
{
  "timeline": {
    "tooltipDefault": "Drag scrubber or click dots to navigate timeline. ● = Confirmed destruction date, ○ = Survey date (when exact date unknown).",
    "tooltipAdvanced": "Click Previous/Next to navigate between destruction events. Click dots to jump to specific sites. ● = Confirmed destruction date, ○ = Survey date."
  }
}
```

---

### PHASE 3: Cluster Expansion (16-19 hours)

*(Original Phase 1-8 content from TIMELINE_DOT_CLUSTER_FEATURE.md)*

### Phase 1: Data Grouping (Backend Logic)

**Files to Modify:**
- `src/hooks/useTimelineData.ts`
- `src/utils/d3Timeline.ts` (types)

**New Type Definition:**
```typescript
// src/utils/d3Timeline.ts
export interface TimelineEventCluster {
  date: Date;
  events: TimelineEvent[]; // All events at this date
  count: number; // events.length (for quick checks)
}

export type TimelineRenderData = TimelineEventCluster[];
```

**New Hook Function:**
```typescript
// src/hooks/useTimelineData.ts
export function useTimelineData(sites: Site[]) {
  return useMemo(() => {
    // ... existing event creation ...

    // GROUP BY DATE: Create clusters
    const dateMap = new Map<string, TimelineEvent[]>();
    destructionDates.forEach(event => {
      const dateKey = event.date.toISOString(); // Use ISO string as key
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(event);
    });

    // Convert to cluster array
    const clusters: TimelineEventCluster[] = Array.from(dateMap.entries())
      .map(([dateStr, events]) => ({
        date: new Date(dateStr),
        events,
        count: events.length,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      events: destructionDates, // Keep for backward compatibility
      clusters, // NEW: Grouped data
      totalEvents: destructionDates.length,
      eventDensity,
    };
  }, [sites]);
}
```

**Testing:**
```typescript
// src/hooks/__tests__/useTimelineData.test.tsx
describe('useTimelineData - clustering', () => {
  it('groups sites with same destruction date into clusters', () => {
    const sites = [
      createMockSite({ id: '1', dateDestroyed: '2024-01-15' }),
      createMockSite({ id: '2', dateDestroyed: '2024-01-15' }), // Same date
      createMockSite({ id: '3', dateDestroyed: '2024-02-20' }),
    ];

    const { clusters } = useTimelineData(sites);

    expect(clusters).toHaveLength(2);
    expect(clusters[0].count).toBe(2); // 2 sites on 2024-01-15
    expect(clusters[1].count).toBe(1);
  });
});
```

---

### Phase 2: Cluster Expansion UI Component

**New Component:**
`src/components/Timeline/TimelineClusterExpansion.tsx`

**Purpose:**
- Renders expanded dot cluster above timeline
- Positioned absolutely using React Portal or absolute positioning
- Handles hover states and click events
- Animates in/out with CSS transitions

**Props Interface:**
```typescript
interface TimelineClusterExpansionProps {
  cluster: TimelineEventCluster; // All events at this date
  xPosition: number; // Horizontal position from D3 scale
  yPosition: number; // Vertical position (above timeline)
  highlightedSiteId: string | null; // Currently selected site
  onSiteSelect: (siteId: string) => void; // Click handler
  onClose: () => void; // Click outside handler
}
```

**Component Structure:**
```tsx
export function TimelineClusterExpansion({
  cluster,
  xPosition,
  yPosition,
  highlightedSiteId,
  onSiteSelect,
  onClose,
}: TimelineClusterExpansionProps) {
  const t = useThemeClasses();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSiteId, setHoveredSiteId] = useState<string | null>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Calculate horizontal centering (expand left/right from center)
  const totalWidth = cluster.count * 16; // 12px dot + 4px spacing
  const leftOffset = xPosition - (totalWidth / 2);

  return (
    <div
      ref={containerRef}
      className="absolute pointer-events-auto"
      style={{
        left: `${leftOffset}px`,
        top: `${yPosition}px`,
        zIndex: Z_INDEX.TIMELINE_CLUSTER,
      }}
    >
      {/* Backdrop */}
      <div
        className={`px-2 py-1.5 rounded shadow-lg ${t.bg.secondary} ${t.border.default} border`}
      >
        {/* Dots Row */}
        <div className="flex items-center gap-1">
          {cluster.events.map((event, idx) => (
            <div
              key={event.siteId}
              className="relative group animate-expand-dot"
              style={{ animationDelay: `${idx * 30}ms` }} // Stagger animation
            >
              {/* Dot */}
              <div
                className="w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-125"
                style={{
                  backgroundColor: getMarkerColor(event.status),
                  border: event.siteId === highlightedSiteId
                    ? '2px solid #009639'
                    : '1px solid #000',
                }}
                onClick={() => {
                  onSiteSelect(event.siteId);
                  onClose();
                }}
                onMouseEnter={() => setHoveredSiteId(event.siteId)}
                onMouseLeave={() => setHoveredSiteId(null)}
              />

              {/* Tooltip on hover */}
              {hoveredSiteId === event.siteId && (
                <div
                  className="absolute bottom-full mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap"
                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                >
                  {event.siteName}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Count Badge */}
        <div className={`text-center text-[9px] mt-0.5 ${t.text.muted}`}>
          {cluster.count} sites
        </div>
      </div>

      {/* Pointer arrow (points down to clicked dot) */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${t.border.default}`}
        style={{ borderTopColor: 'inherit' }}
      />
    </div>
  );
}
```

**CSS Animation:**
```css
/* src/index.css or tailwind config */
@keyframes expand-dot {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-expand-dot {
  animation: expand-dot 300ms ease-out forwards;
}
```

**Testing:**
```typescript
// src/components/Timeline/__tests__/TimelineClusterExpansion.test.tsx
describe('TimelineClusterExpansion', () => {
  it('renders all events in cluster', () => {
    const cluster = {
      date: new Date('2024-01-15'),
      events: [
        { siteId: '1', siteName: 'Site A', date: new Date('2024-01-15') },
        { siteId: '2', siteName: 'Site B', date: new Date('2024-01-15') },
      ],
      count: 2,
    };

    render(<TimelineClusterExpansion cluster={cluster} ... />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByText('2 sites')).toBeInTheDocument();
  });

  it('calls onSiteSelect when dot clicked', () => {
    const onSiteSelect = vi.fn();
    render(<TimelineClusterExpansion ... onSiteSelect={onSiteSelect} />);

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(onSiteSelect).toHaveBeenCalledWith('1');
  });

  it('closes when clicking outside', () => {
    const onClose = vi.fn();
    render(<TimelineClusterExpansion ... onClose={onClose} />);

    fireEvent.mouseDown(document.body);

    expect(onClose).toHaveBeenCalled();
  });
});
```

---

### Phase 3: D3 Timeline Integration

**File to Modify:**
`src/utils/d3Timeline.ts`

**New State:**
```typescript
export class D3TimelineRenderer {
  // ... existing properties ...
  private onClusterClick?: (cluster: TimelineEventCluster, xPosition: number) => void;
  private clusters: TimelineEventCluster[] = []; // Store for click detection

  constructor(
    svgElement: SVGSVGElement,
    timeScale: ScaleTime<number, number>,
    config: Partial<TimelineConfig> = {},
    callbacks: {
      onTimestampChange: (date: Date) => void;
      onPause: () => void;
      onSiteHighlight?: (event: TimelineEvent) => void;
      onClusterClick?: (cluster: TimelineEventCluster, xPosition: number) => void; // NEW
      onScrubberPositionChange?: (position: number) => void;
    }
  ) {
    // ... existing code ...
    this.onClusterClick = callbacks.onClusterClick;
  }
}
```

**Modified Render Method:**
```typescript
/**
 * Render with cluster support
 * Backward compatible: if clusters not provided, falls back to old behavior
 */
render(
  eventsOrClusters: TimelineEvent[] | TimelineEventCluster[],
  currentTimestamp: Date,
  highlightedSiteId: string | null = null
) {
  this.highlightedSiteId = highlightedSiteId;

  // Detect if we received clusters or individual events
  const isClustered = eventsOrClusters.length > 0 && 'count' in eventsOrClusters[0];

  if (isClustered) {
    this.clusters = eventsOrClusters as TimelineEventCluster[];
    this.renderClusteredMarkers(this.clusters);
  } else {
    // Backward compatibility: convert events to single-event clusters
    const events = eventsOrClusters as TimelineEvent[];
    this.clusters = events.map(event => ({
      date: event.date,
      events: [event],
      count: 1,
    }));
    this.renderClusteredMarkers(this.clusters);
  }

  this.svg.selectAll("*").remove();
  this.renderAxis();
  this.renderScrubber(currentTimestamp);
}
```

**New Cluster Rendering:**
```typescript
/**
 * Render event markers with cluster detection
 * Single events: render as before
 * Clustered events: render with badge showing count, special click handler
 */
private renderClusteredMarkers(clusters: TimelineEventCluster[]) {
  const { height, eventMarkerRadius, colors } = this.config;

  const markerGroups = this.svg
    .selectAll("g.event-marker-group")
    .data(clusters)
    .enter()
    .append("g")
    .attr("class", "event-marker-group");

  // Render main dot (represents the cluster)
  const markers = markerGroups
    .append("circle")
    .attr("class", "event-marker")
    .attr("cx", (d) => this.timeScale(d.date))
    .attr("cy", height / 2)
    .attr("r", (d) => {
      // Larger radius for clusters
      const isCluster = d.count > 1;
      const isHighlighted = d.events.some(e => e.siteId === this.highlightedSiteId);
      return eventMarkerRadius + (isCluster ? 1 : 0) + (isHighlighted ? 2 : 0);
    })
    .attr("fill", (d) => {
      // Use first event's color (or could blend multiple statuses)
      return this.getMarkerColor(d.events[0].status);
    })
    .attr("stroke", (d) => {
      const isHighlighted = d.events.some(e => e.siteId === this.highlightedSiteId);
      return isHighlighted ? "#009639" : colors.eventMarkerStroke;
    })
    .attr("stroke-width", (d) => {
      const isHighlighted = d.events.some(e => e.siteId === this.highlightedSiteId);
      return isHighlighted ? 3 : 1.5;
    })
    .style("cursor", "pointer");

  // Add count badge for clusters (2+)
  markerGroups
    .filter(d => d.count > 1)
    .append("text")
    .attr("class", "cluster-count-badge")
    .attr("x", (d) => this.timeScale(d.date))
    .attr("y", height / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("font-size", "7px")
    .attr("font-weight", "bold")
    .attr("fill", "#ffffff")
    .attr("pointer-events", "none")
    .text((d) => d.count);

  // Hover effects (existing code with cluster awareness)
  markerGroups
    .on("mouseenter", function(event, d) {
      // ... existing hover code ...
      // Show date label (same as before)
    })
    .on("mouseleave", function() {
      // ... existing hover code ...
    })
    .on("click", (event, d) => {
      if (d.count === 1) {
        // Single event: existing behavior
        this.onTimestampChange(d.date);
        this.onPause();
        if (this.onSiteHighlight) {
          this.onSiteHighlight(d.events[0]);
        }
      } else {
        // Cluster: trigger expansion
        if (this.onClusterClick) {
          const xPosition = this.timeScale(d.date);
          this.onClusterClick(d, xPosition);
        }
      }
    });
}
```

**Testing:**
```typescript
// src/utils/__tests__/d3Timeline.test.ts
describe('D3TimelineRenderer - clusters', () => {
  it('renders cluster with count badge', () => {
    const cluster = {
      date: new Date('2024-01-15'),
      events: [mockEvent1, mockEvent2],
      count: 2,
    };

    renderer.render([cluster], new Date(), null);

    const badge = svg.select('.cluster-count-badge');
    expect(badge.text()).toBe('2');
  });

  it('calls onClusterClick for multi-event clusters', () => {
    const onClusterClick = vi.fn();
    const renderer = new D3TimelineRenderer(svg, scale, {}, {
      ...,
      onClusterClick,
    });

    renderer.render([clusterWith2Events], new Date(), null);

    svg.select('.event-marker').dispatch('click');

    expect(onClusterClick).toHaveBeenCalledWith(
      clusterWith2Events,
      expect.any(Number) // xPosition
    );
  });

  it('calls onSiteHighlight for single-event clusters (backward compat)', () => {
    const onSiteHighlight = vi.fn();
    // ... test existing behavior still works
  });
});
```

---

### Phase 4: React Component Integration

**File to Modify:**
`src/components/Timeline/TimelineScrubber.tsx`

**New State:**
```typescript
export function TimelineScrubber({ ... }: TimelineScrubberProps) {
  // ... existing state ...

  // NEW: Cluster expansion state
  const [expandedCluster, setExpandedCluster] = useState<{
    cluster: TimelineEventCluster;
    xPosition: number;
  } | null>(null);

  // Extract timeline data using custom hook (NOW RETURNS CLUSTERS)
  const { events: allDestructionDates, clusters } = useTimelineData(sites);

  // ... rest of existing code ...
}
```

**Modified D3 Initialization:**
```typescript
useEffect(() => {
  if (!svgRef.current || !svgMounted) {
    return;
  }

  if (!rendererRef.current) {
    rendererRef.current = new D3TimelineRenderer(
      svgRef.current,
      timeScale,
      {},
      {
        onTimestampChange: setTimestamp,
        onPause: pause,
        onSiteHighlight: onSiteHighlight ? (event) => {
          onSiteHighlight(event.siteId);
        } : undefined,
        onClusterClick: (cluster, xPosition) => { // NEW CALLBACK
          setExpandedCluster({ cluster, xPosition });
        },
        onScrubberPositionChange: setScrubberPosition,
      }
    );
  }

  rendererRef.current.updateScale(timeScale);

  // PASS CLUSTERS INSTEAD OF EVENTS
  rendererRef.current.render(clusters, currentTimestamp, highlightedSiteId);

  // ... cleanup ...
}, [
  svgMounted,
  timeScale,
  clusters, // CHANGED FROM destructionDates
  currentTimestamp,
  highlightedSiteId,
  setTimestamp,
  pause,
  onSiteHighlight
]);
```

**Cluster Expansion Rendering:**
```tsx
return (
  <div ref={containerRef} className={t.timeline.container} ...>
    {/* ... existing controls ... */}

    {/* D3 Timeline SVG */}
    <div className="relative overflow-visible" ...>
      <svg ref={svgRef} ... />

      {/* Scrubber tooltip (existing) */}
      {scrubberPosition !== null && (
        <div ... />
      )}

      {/* NEW: Cluster Expansion Overlay */}
      {expandedCluster && (
        <TimelineClusterExpansion
          cluster={expandedCluster.cluster}
          xPosition={expandedCluster.xPosition}
          yPosition={-45} // Above timeline (negative = upward)
          highlightedSiteId={highlightedSiteId}
          onSiteSelect={(siteId) => {
            // Select site and close expansion
            const event = expandedCluster.cluster.events.find(e => e.siteId === siteId);
            if (event && onSiteHighlight) {
              onSiteHighlight(siteId);
              setTimestamp(event.date);
            }
            setExpandedCluster(null);
          }}
          onClose={() => setExpandedCluster(null)}
        />
      )}
    </div>

    {/* ... keyboard shortcuts ... */}
  </div>
);
```

**Testing:**
```typescript
// src/components/Timeline/__tests__/TimelineScrubber.test.tsx
describe('TimelineScrubber - cluster expansion', () => {
  it('shows cluster expansion when cluster dot clicked', async () => {
    const sites = [
      createMockSite({ id: '1', dateDestroyed: '2024-01-15' }),
      createMockSite({ id: '2', dateDestroyed: '2024-01-15' }),
    ];

    render(<TimelineScrubber sites={sites} ... />);

    // Simulate D3 cluster click (may need test helper)
    const clusterDot = screen.getByTestId('timeline-cluster-2024-01-15');
    fireEvent.click(clusterDot);

    await waitFor(() => {
      expect(screen.getByText('2 sites')).toBeInTheDocument();
    });
  });

  it('highlights site when expanded dot clicked', async () => {
    const onSiteHighlight = vi.fn();
    // ... render with cluster ...

    fireEvent.click(clusterDot);
    const expandedDots = screen.getAllByRole('button');
    fireEvent.click(expandedDots[0]);

    expect(onSiteHighlight).toHaveBeenCalledWith('1');
  });
});
```

---

### Phase 5: Z-Index & Layout Constants

**File to Modify:**
`src/constants/layout.ts`

**New Constant:**
```typescript
export const Z_INDEX = {
  // ... existing values ...
  TIMELINE_TOOLTIP: 100, // Existing scrubber tooltip
  TIMELINE_CLUSTER: 101, // NEW: Cluster expansion (above tooltip)
  // ... rest ...
} as const;
```

---

### Phase 6: Edge Cases & Polish

#### Edge Case Handling

1. **Cluster Near Timeline Edge**
   - **Problem:** Expansion might overflow container
   - **Solution:** Detect if `xPosition - (totalWidth/2) < 0` or `> containerWidth`
   - **Fix:** Adjust leftOffset to clamp within bounds

   ```typescript
   const totalWidth = cluster.count * 16;
   let leftOffset = xPosition - (totalWidth / 2);

   // Clamp to container bounds
   const containerWidth = containerRef.current?.clientWidth || 800;
   leftOffset = Math.max(10, Math.min(leftOffset, containerWidth - totalWidth - 10));
   ```

2. **Very Large Clusters (10+ sites)**
   - **Problem:** Horizontal row too wide
   - **Solution:** Wrap into multiple rows or use scrollable container

   ```typescript
   const MAX_DOTS_PER_ROW = 8;
   const rows = Math.ceil(cluster.count / MAX_DOTS_PER_ROW);
   ```

3. **Rapid Clicking**
   - **Problem:** Multiple expansions open simultaneously
   - **Solution:** Close previous expansion before opening new one
   - **Implementation:** Already handled by `expandedCluster` state replacement

4. **Mobile/Touch Devices**
   - **Problem:** Hover tooltips don't work on touch
   - **Solution:** Use long-press or tap for site name, separate tap for selection
   - **Implementation:** Detect touch device and show tooltips on tap instead

5. **Cluster During Playback**
   - **Problem:** Timeline animation might trigger cluster expansion unexpectedly
   - **Solution:** Only expand on explicit user click, not programmatic timestamp changes
   - **Implementation:** Already handled by D3 `onClick` handler (not triggered by `render()`)

#### Accessibility

1. **Keyboard Navigation**
   - Add tab support to cycle through expanded dots
   - Enter/Space to select
   - Escape to close expansion

   ```typescript
   useEffect(() => {
     if (!expandedCluster) return;

     const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key === 'Escape') {
         setExpandedCluster(null);
       }
     };

     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
   }, [expandedCluster]);
   ```

2. **ARIA Labels**
   ```tsx
   <div
     role="menu"
     aria-label={`${cluster.count} sites on ${formatDate(cluster.date)}`}
   >
     {cluster.events.map((event, idx) => (
       <button
         key={event.siteId}
         role="menuitem"
         aria-label={event.siteName}
         tabIndex={0}
       >
         {/* Dot */}
       </button>
     ))}
   </div>
   ```

3. **Screen Reader Announcements**
   ```typescript
   // When cluster expands
   const announcement = `${cluster.count} sites found on this date. Use arrow keys to navigate.`;
   // Use aria-live region or announce programmatically
   ```

#### Performance

1. **Memoization**
   ```typescript
   const TimelineClusterExpansion = memo(function TimelineClusterExpansion({ ... }) {
     // ... implementation ...
   });
   ```

2. **Debounce Hover Events**
   ```typescript
   const debouncedSetHover = useMemo(
     () => debounce(setHoveredSiteId, 100),
     []
   );
   ```

---

## Testing Strategy

### Unit Tests

1. **useTimelineData Hook**
   - ✅ Groups sites with identical dates
   - ✅ Creates separate clusters for different dates
   - ✅ Handles single-site clusters
   - ✅ Sorts clusters chronologically

2. **TimelineClusterExpansion Component**
   - ✅ Renders all dots in cluster
   - ✅ Shows correct count badge
   - ✅ Highlights selected site
   - ✅ Calls onSiteSelect when dot clicked
   - ✅ Closes on outside click
   - ✅ Shows site name on hover
   - ✅ Animates in/out smoothly

3. **D3TimelineRenderer**
   - ✅ Renders clusters with count badges
   - ✅ Calls onClusterClick for multi-event clusters
   - ✅ Maintains backward compatibility with single events
   - ✅ Applies correct styling to clustered vs single dots

4. **TimelineScrubber Integration**
   - ✅ Opens expansion on cluster click
   - ✅ Closes expansion when site selected
   - ✅ Updates highlighted site correctly
   - ✅ Syncs map when enabled

### Integration Tests

1. **Timeline Page (Full Flow)**
   - ✅ Click cluster → expansion appears
   - ✅ Click expanded dot → site highlighted
   - ✅ Map syncs to correct wayback release
   - ✅ Expansion closes after selection
   - ✅ Timeline scrubber moves to selected date

2. **Dashboard Page**
   - ✅ Cluster expansion works in standard timeline mode
   - ✅ No interference with playback controls

### E2E Tests (Playwright)

**New File:** `e2e/timeline-clusters.spec.ts`

```typescript
test('cluster expansion shows multiple sites at same date', async ({ page }) => {
  await page.goto('/timeline');

  // Find a cluster dot (has count badge)
  const clusterDot = page.locator('.cluster-count-badge').first();
  await clusterDot.click();

  // Expansion should appear
  await expect(page.locator('[role="menu"]')).toBeVisible();

  // Should show multiple dots
  const expandedDots = page.locator('[role="menuitem"]');
  const count = await expandedDots.count();
  expect(count).toBeGreaterThan(1);

  // Click first expanded dot
  await expandedDots.first().click();

  // Expansion should close
  await expect(page.locator('[role="menu"]')).not.toBeVisible();

  // Site should be highlighted on map
  await expect(page.locator('.leaflet-marker-icon')).toBeVisible();
});

test('cluster expansion closes on outside click', async ({ page }) => {
  await page.goto('/timeline');

  const clusterDot = page.locator('.cluster-count-badge').first();
  await clusterDot.click();

  await expect(page.locator('[role="menu"]')).toBeVisible();

  // Click outside
  await page.locator('main').click({ position: { x: 10, y: 10 } });

  await expect(page.locator('[role="menu"]')).not.toBeVisible();
});
```

---

## File Changes Summary

### New Files (3)
1. `src/components/Timeline/TimelineClusterExpansion.tsx` - Expansion UI component
2. `src/components/Timeline/__tests__/TimelineClusterExpansion.test.tsx` - Component tests
3. `e2e/timeline-clusters.spec.ts` - E2E tests

### Modified Files (6)
1. `src/hooks/useTimelineData.ts` - Add cluster grouping logic
2. `src/utils/d3Timeline.ts` - Add cluster rendering support
3. `src/components/Timeline/TimelineScrubber.tsx` - Integrate expansion overlay
4. `src/constants/layout.ts` - Add Z_INDEX.TIMELINE_CLUSTER
5. `src/hooks/__tests__/useTimelineData.test.tsx` - Add cluster tests
6. `src/utils/__tests__/d3Timeline.test.ts` - Add cluster rendering tests

### CSS Changes
- `src/index.css` or Tailwind config - Add expand-dot animation keyframes

---

## Implementation Checklist

Use this checklist to track progress during implementation:

### ✅ PRIORITY 1: Phase 1 & 2 - Data Quality + Density (3-5 hours)
- [ ] Update `TimelineEvent` interface to include `dateType: 'destruction' | 'survey'`
- [ ] Modify `useTimelineData` to detect date type and calculate cluster sizes
- [ ] Update `d3Timeline.ts` render method to accept `clusterSizes` parameter
- [ ] Implement hollow dots for survey dates in `renderEventMarkers()`
- [ ] Implement density-based sizing (1-6px based on cluster count)
- [ ] Update tooltip text to indicate date type and cluster count
- [ ] Add legend component to `TimelineScrubber.tsx`
- [ ] Update timeline info tooltip text in locale files
- [ ] Write unit tests for `useTimelineData` cluster counting
- [ ] Write visual regression tests for hollow/solid dots
- [ ] Manual testing with real data (verify Oct 2025 survey dates show as hollow)
- [ ] Run all existing tests to ensure no regressions
- [ ] Update CHANGELOG.md

### 🔄 PRIORITY 3: Phase 3 - Cluster Expansion (16-19 hours)

**Phase 3.1: Data Grouping**
- [ ] Add `TimelineEventCluster` type to `d3Timeline.ts`
- [ ] Modify `useTimelineData` to return full cluster objects (not just sizes)
- [ ] Write tests for cluster grouping
- [ ] Verify backward compatibility (events still returned)
- [ ] Run all existing tests to ensure no regressions

**Phase 3.2: Cluster Expansion Component**
- [ ] Create `TimelineClusterExpansion.tsx`
- [ ] Implement dot rendering with status colors
- [ ] Add hover tooltips
- [ ] Implement click handlers
- [ ] Add outside-click-to-close
- [ ] Add CSS animations
- [ ] Write component unit tests
- [ ] Verify accessibility (ARIA, keyboard nav)

**Phase 3.3: D3 Integration**
- [ ] Add `onClusterClick` callback to D3TimelineRenderer
- [ ] Implement `renderClusteredMarkers()` method
- [ ] Add count badges to cluster dots
- [ ] Update click handlers (single vs cluster)
- [ ] Write D3 renderer tests
- [ ] Test with real site data

**Phase 3.4: React Integration**
- [ ] Add `expandedCluster` state to TimelineScrubber
- [ ] Wire up D3 `onClusterClick` callback
- [ ] Render TimelineClusterExpansion overlay
- [ ] Implement site selection handler
- [ ] Update dependencies in useEffect
- [ ] Write integration tests

### Phase 5: Z-Index & Layout
- [ ] Add `Z_INDEX.TIMELINE_CLUSTER` constant
- [ ] Verify no z-index conflicts with other UI
- [ ] Test on different screen sizes
- [ ] Fix any overflow issues

### Phase 6: Edge Cases & Polish
- [ ] Handle clusters near timeline edges (clamping)
- [ ] Handle large clusters (10+ sites)
- [ ] Add keyboard navigation (Tab, Enter, Escape)
- [ ] Add screen reader support
- [ ] Test on mobile/touch devices
- [ ] Optimize performance (memoization)
- [ ] Test rapid clicking behavior
- [ ] Verify no interference with playback

**Phase 3.7: Testing**
- [ ] Run all unit tests (`npm test`)
- [ ] Run E2E tests (`npm run e2e`)
- [ ] Manual testing on Timeline page
- [ ] Manual testing on Dashboard page
- [ ] Accessibility audit (keyboard, screen reader)
- [ ] Cross-browser testing
- [ ] Mobile device testing

**Phase 3.8: Documentation**
- [ ] Update CLAUDE.md with new feature
- [ ] Add JSDoc comments to new functions
- [ ] Update CHANGELOG.md with cluster expansion feature
- [ ] Take screenshots for documentation
- [ ] Update README if needed

### ⚠️ PRIORITY 4: Phase 4 - Adaptive Scale (20-24 hours) - DEFERRED
**Status:** Not started - awaiting approval after Phases 1-3 completion

- [ ] Review Phases 1-3 user feedback and metrics
- [ ] Decision: Proceed with adaptive scale implementation? (Y/N)
- [ ] If YES:
  - [ ] Implement piecewise linear scale algorithm
  - [ ] Add "Linear/Adaptive" toggle to TimelineControls
  - [ ] Update D3 scale generation logic
  - [ ] Add visual indicators for non-linear regions
  - [ ] Write extensive tests for scale calculations
  - [ ] A/B test with users
  - [ ] Update documentation
- [ ] If NO:
  - [ ] Document decision rationale
  - [ ] Close this phase permanently

---

## Success Criteria

**Phase 1 & 2 Complete When:**
1. ✅ Hollow dots visually distinguish survey dates from destruction dates
2. ✅ Larger dots indicate multiple sites at same date (2+ visible difference)
3. ✅ Tooltips clearly explain date type ("destruction" vs "survey")
4. ✅ Legend is visible and understandable
5. ✅ No regressions in existing tests
6. ✅ Manual testing confirms Oct 2025 cluster shows as hollow dots

**Phase 3 Complete When:**

1. ✅ **Discoverability:** Users can see when multiple sites exist at same date (count badge + size)
2. ✅ **Interaction:** Users can click to expand and select specific sites from cluster
3. ✅ **Visual Feedback:** Clear animations and hover states for expansion
4. ✅ **No Regressions:** All existing tests pass
5. ✅ **Accessibility:** WCAG 2.1 AA compliant (keyboard nav, ARIA labels)
6. ✅ **Performance:** No noticeable lag with 70+ sites
7. ✅ **Cross-Browser:** Works in Chrome, Firefox, Safari, Edge
8. ✅ **Mobile:** Touch interactions work smoothly
9. ✅ **Test Coverage:** >80% code coverage for new code
10. ✅ **Maintains Phase 1 & 2:** Hollow/solid dots preserved in expansion UI

**Phase 4 Complete When (if approved):**
1. ✅ **Toggle works:** User can switch between linear and adaptive scales seamlessly
2. ✅ **Visual clarity:** Non-linear regions are clearly marked/shaded
3. ✅ **No confusion:** User testing confirms scale is understandable
4. ✅ **Performance:** Scale calculations don't slow down timeline rendering
5. ✅ **Responsive:** Works across all screen sizes
6. ✅ **Test coverage:** Algorithm edge cases fully tested

---

## Alternative Approaches Considered

### 1. Stacked Dots (Vertical)
**Description:** Stack overlapping dots vertically instead of horizontal expansion
**Pros:** No click required, always visible
**Cons:** Clutters timeline, hard to click individual dots
**Decision:** ❌ Rejected - Poor UX for 5+ sites at same date

### 2. Pie Chart Indicator
**Description:** Replace dot with mini pie chart showing multiple sites
**Pros:** Compact, shows count visually
**Cons:** Hard to see at small size, doesn't solve selection problem
**Decision:** ❌ Rejected - Doesn't solve core UX issue

### 3. Dropdown Menu
**Description:** Traditional dropdown menu on dot click
**Pros:** Familiar pattern, good for many items
**Cons:** Doesn't match timeline aesthetic, loses spatial context
**Decision:** ❌ Rejected - Breaks visual continuity

### 4. Horizontal Expansion (CHOSEN)
**Description:** Dots expand horizontally in a row above clicked position
**Pros:** Maintains spatial context, clear visual connection, matches map clustering pattern
**Cons:** Can overflow on narrow screens (but solvable with clamping)
**Decision:** ✅ Selected - Best balance of UX and feasibility

---

## Future Enhancements (Post-MVP)

1. **Smart Positioning:** Auto-detect available space and expand left/right/up/down accordingly
2. **Cluster Preview:** Show site thumbnails or icons in expansion
3. **Bulk Selection:** Allow multi-select from expansion (e.g., Ctrl+Click)
4. **Cluster Filtering:** Filter expansion dots by status/type
5. **Animation Refinements:** Stagger in/out animations for each dot
6. **Touch Gestures:** Swipe through expanded dots on mobile
7. **Cluster History:** Remember which clusters user has explored (visual indicator)

---

## Questions for Code Review

1. Should we add a maximum cluster size limit (e.g., 15 sites max before showing "View all 23 →" button)?
2. Should cluster expansion sync with Wayback releases immediately, or wait for user to click a specific dot?
3. Do we want to show cluster count on the dot at all times, or only on hover?
4. Should we use a React Portal for the expansion overlay, or absolute positioning within timeline container?
5. How should we handle clusters during timeline playback? (Current plan: ignore playback, only expand on click)

---

## Progress Tracking

**Start Date:** [TBD]
**Target Completion:** [TBD]
**Actual Completion:** [TBD]

**Time Estimates:**

**Phase 1 & 2 (Data Quality + Density):**
- Type updates & hook modifications: 1 hour
- D3 renderer updates (hollow dots, sizing): 1.5 hours
- Legend & tooltip updates: 0.5 hours
- Testing & validation: 1 hour
- **Subtotal:** 3-5 hours

**Phase 3 (Cluster Expansion):**
- Phase 3.1 (Data Grouping): 2 hours
- Phase 3.2 (Component): 4 hours
- Phase 3.3 (D3 Integration): 3 hours
- Phase 3.4 (React Integration): 2 hours
- Phase 3.5 (Layout): 1 hour
- Phase 3.6 (Edge Cases): 3 hours
- Phase 3.7 (Testing): 3 hours
- Phase 3.8 (Documentation): 1 hour
- **Subtotal:** 16-19 hours

**Phase 4 (Adaptive Scale - DEFERRED):**
- Algorithm implementation: 8 hours
- Toggle UI & integration: 4 hours
- Visual indicators: 3 hours
- Testing & edge cases: 5 hours
- User testing & iteration: 4 hours
- Documentation: 1 hour
- **Subtotal:** 20-24 hours (if approved)

**Total Estimated (Phases 1-3 only):** ~25-30 hours
**Total Estimated (All phases):** ~45-50 hours

---

## Session Restart Checklist

When starting a fresh Claude Code session, review:

1. ✅ Read this document completely (focus on current priority phase)
2. ✅ Check which phases are completed (see Implementation Checklist above)
3. ✅ Run `npm test` to verify existing tests still pass
4. ✅ Review recent changes in git: `git diff main`
5. ✅ Check for any merge conflicts or dependencies
6. ✅ Resume at the next unchecked task in Implementation Checklist
7. ✅ **Priority order:** Phase 1 & 2 → Phase 3 → Phase 4 (if approved)

**Current Priority:** Phase 1 & 2 (Data Quality + Density Indicators)

---

## Phase 4 Implementation Details (DEFERRED - Reference Only)

**Piecewise Linear Scale Algorithm:**

```typescript
interface TimelineSegment {
  startDate: Date;
  endDate: Date;
  eventCount: number;
  density: number; // events per day
  allocatedWidth: number; // pixels
}

function createAdaptiveScale(
  events: TimelineEvent[],
  containerWidth: number
): ScaleTime<number, number> {
  // 1. Divide timeline into monthly segments
  const segments = groupEventsIntoSegments(events, 'month');

  // 2. Calculate density score (events per day in segment)
  segments.forEach(seg => {
    const durationDays = (seg.endDate.getTime() - seg.startDate.getTime()) / (1000 * 60 * 60 * 24);
    seg.density = seg.eventCount / durationDays;
  });

  // 3. Allocate width proportionally (with min/max constraints)
  const totalDensity = segments.reduce((sum, s) => sum + s.density, 0);
  const minWidthPerSegment = 20; // Minimum 20px even for empty segments
  const availableWidth = containerWidth - (segments.length * minWidthPerSegment);

  segments.forEach(seg => {
    const proportionalWidth = (seg.density / totalDensity) * availableWidth;
    seg.allocatedWidth = minWidthPerSegment + proportionalWidth;
  });

  // 4. Create piecewise scale
  const domain: Date[] = [];
  const range: number[] = [];
  let currentX = TIMELINE_CONFIG.MARGIN;

  segments.forEach(seg => {
    domain.push(seg.startDate, seg.endDate);
    range.push(currentX, currentX + seg.allocatedWidth);
    currentX += seg.allocatedWidth;
  });

  return scaleTime().domain(domain).range(range);
}
```

**Visual Indicators for Non-Linear Scale:**
- Shaded regions or gradient behind timeline to indicate compressed areas
- Axis tick marks with "~" symbol for scale breaks
- Tooltip warning when scale is adaptive: "Timeline uses adaptive scale - empty periods compressed"

**Toggle Implementation:**
```tsx
<button
  onClick={() => setScaleMode(mode === 'linear' ? 'adaptive' : 'linear')}
  className={t.button.base}
  aria-label={`Switch to ${mode === 'linear' ? 'adaptive' : 'linear'} scale`}
>
  <ScaleIcon className="w-4 h-4" />
  {mode === 'linear' ? 'Linear' : 'Adaptive'}
</button>
```

---

**Last Updated:** 2025-11-14
**Document Version:** 2.0
**Status:** 📋 Ready for Implementation (Phase 1 & 2 Priority)
