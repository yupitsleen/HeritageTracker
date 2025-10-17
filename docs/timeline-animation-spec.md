# Heritage Tracker - Timeline Animation Feature Specification

## Overview

Replace the current static timeline sidebar with an interactive, animated timeline scrubber that visualizes the destruction of Gaza's cultural heritage over time (Oct 2023 - Present).

## Core Concept: "Dimming Gaza"

As destruction occurs chronologically, the map visually "dims" - representing the extinguishing of cultural heritage and collective memory.

**Implementation Status:** Phase 1-2 Complete ✅ | Branch feature/timelineImprovements **MERGED**

- ✅ TimelineScrubber with D3.js (Phase 1)
- ✅ MapGlowLayer with Leaflet.heat plugin (Phase 2)
- ✅ Mobile responsiveness fixes and production build ready
- 🚧 Phase 3: Destruction animations (Next - future work)

**Note:** Timeline animation work paused after Phase 2. Current production branch includes expanded dataset (45 sites), resizable table, satellite map toggle, and deferred filter application. See PR #14 for full details.

**Recent Update (Oct 2025):**

1. Codebase underwent major refactoring to improve maintainability (Phase 1 & 2 complete). Timeline animation code remains functional but was not the focus of this refactoring work. See [CODE_REVIEW.md](../CODE_REVIEW.md) and [ARCHITECTURE_REVIEW.md](../ARCHITECTURE_REVIEW.md) for details on the modular architecture improvements.

2. **Historical Satellite Imagery Feature Added** - SiteDetailView now includes TimeToggle component for comparing three time periods: 2014 Baseline (earliest available ESRI Wayback imagery from Feb 20, 2014), Aug 2023 Pre-conflict (last imagery before October 7, 2023), and Current (latest ESRI World Imagery). Zoom levels standardized to 17 across all periods for consistent comparison. This provides visual evidence of heritage site destruction over a decade-long timeline.

---

## Features to Implement

### 1. Timeline Scrubber Component

**Location:** Horizontal bar below the map (center column)

**UI Elements:**

- Date range axis: Oct 7, 2023 → Present (Dec 2024)
- Draggable scrubber handle
- Event markers (dots) at destruction dates
- Play/Pause button
- Reset button
- Speed control (0.5x, 1x, 2x, 4x)
- Current date display

**Behavior:**

- Dragging scrubber updates map state to show only sites destroyed up to that date
- Clicking on timeline jumps to that date
- Play button animates through timeline automatically
- Hovering over event markers shows tooltip with site name(s)

**Technologies:**

- D3.js for timeline axis and scale
- React hooks for animation state
- Canvas API or SVG for visual elements

---

### 2. Map Visual States

#### A. Ambient Glow System ("Dimming") ✅ IMPLEMENTED

**Initial State (Oct 7, 2023):**

- Gaza has warm, golden ambient glow over heritage-rich areas
- Glow intensity based on cumulative heritage value in region

**As Destruction Occurs:**

- Each destroyed site removes its "glow contribution"
- Map progressively darkens/cools in affected areas
- Color shift: Warm gold (#FFD700) → Cool grey (#6B7280)

**Implementation:** Using Leaflet.heat plugin

- **Library:** `leaflet.heat` - Fast, performant heat map plugin
- **Component:** `MapGlowLayer.tsx` - Renders as Leaflet layer
- **Hook:** `useMapGlow.ts` - Calculates glow contributions and current metrics
- **Performance:** ~19-26ms to render 25 sites (well under 60fps target)

Each site has a `glowContribution` value based on:

- Age (older = more weight)
- Significance (UNESCO status, artifact count)
- Type (archaeological sites, museums have higher weight)
- Uniqueness

**Glow Calculation:**

Implemented in `utils/heritageCalculations.ts`:

```javascript
const calculateGlowContribution = (site) => {
  let weight = 100; // Base value

  // Age factor
  const age = 2024 - (site.creationYear || 0);
  if (age > 2000) weight *= 3; // Ancient
  else if (age > 1000) weight *= 2; // Medieval
  else if (age > 200) weight *= 1.5; // Historic

  // Significance multipliers
  if (site.unescoListed) weight *= 2;
  if (site.artifactCount > 100) weight *= 1.5;
  if (site.type === "archaeological") weight *= 1.8;
  if (site.type === "museum") weight *= 1.6;
  if (site.isUnique) weight *= 2;

  return weight;
};
```

**Leaflet.heat Configuration Options:**

Current settings in `MapGlowLayer.tsx`:

```typescript
L.heatLayer(heatData, {
  minOpacity: 0.2,      // Minimum transparency (0-1)
  maxZoom: 18,          // Zoom level for max intensity
  max: 1.0,             // Maximum normalized intensity
  radius: 40,           // Heat point size in pixels (default: 25)
  blur: 50,             // Blur amount for soft glow (default: 15)
  gradient: {           // Custom color gradient
    0.0: "#6B7280",     // Cool grey (destroyed areas)
    0.3: "#9CA3AF",     // Medium grey
    0.5: "#D4A574",     // Warm beige
    0.7: "#E5C07B",     // Golden beige
    1.0: "#FFD700"      // Pure gold (intact heritage)
  }
})
```

**Configurable Visual Options:**

All these can be adjusted to change the glow appearance:

| Option | Current | Default | Effect | Tuning Guidance |
|--------|---------|---------|--------|-----------------|
| `radius` | 40px | 25px | Size of each glow point | Increase (50-60) for wider spread, decrease (25-35) for tighter focus |
| `blur` | 50px | 15px | Softness of glow edges | Increase (60-80) for more ambient, decrease (30-40) for sharper definition |
| `minOpacity` | 0.2 | 0 | Baseline transparency | Increase (0.3-0.4) for more visible effect, decrease (0.1) for subtlety |
| `gradient` | 5-stop | 3-stop | Color transition smoothness | Add more stops for smoother transitions, change colors for different mood |
| `maxZoom` | 18 | map's max | Zoom behavior | Controls when intensity stops scaling with zoom |
| `pane` | default | 'overlayPane' | Z-index layering | Change to render above/below other map elements |

**Why larger radius + blur?**

We use much larger values than defaults (40 vs 25 radius, 50 vs 15 blur) to create a soft, ambient "heritage glow" effect rather than discrete hot spots. This supports the "dimming Gaza" metaphor of extinguishing light/memory rather than showing data clusters.

#### B. Site Marker Visual States

**Color Coding by Age (before destruction):**

- Ancient (>2000 years): Gold (#FFD700)
- Medieval (500-2000 years): Bronze (#CD7F32)
- Ottoman/Historic (200-500 years): Silver (#C0C0C0)
- Modern (<200 years): Blue (#4A90E2)

**Size Coding by Significance:**

```javascript
const markerRadius = Math.sqrt(significanceScore(site)) * 2;
// Where significanceScore considers artifacts, historical events, documentation
```

**Destruction Mode Visuals:**
When a site is destroyed, animate based on destruction type:

1. **Destroyed (Complete Loss)**

   - Color: Red (#B91C1C) → Grey (#6B7280)
   - Animation: "Explode" - burst outward, then fade to grey
   - Remove glow contribution
   - Duration: 800ms

2. **Looted (Theft)**

   - Color: Purple (#9333EA) → Grey with hollow center
   - Animation: "Drain" - particles flow from marker off map edge
   - Particle trail: Small dots that fade as they move
   - Show "emptied" state (donut shape vs solid circle)
   - Duration: 1200ms

3. **Heavily Damaged**

   - Color: Orange (#D97706) → Muted grey-orange (#9CA3AF)
   - Animation: "Crack" - fracture lines appear, marker splits
   - Partial glow removal (50%)
   - Duration: 600ms

4. **Damaged**
   - Color: Yellow (#CA8A04) → Muted grey-yellow (#D1D5DB)
   - Animation: "Shake" - tremor effect
   - Partial glow removal (25%)
   - Duration: 400ms

---

### 3. Heritage Integrity Dashboard

**Status:** 🚧 Phase 4 - Not Yet Implemented

**Location:** Above the map or as overlay panel

**Metrics to Display:**

```text
┌─────────────────────────────────────────────────┐
│ Heritage Integrity: ████████░░░░░░░░ 77%       │
│ Sites Destroyed: 23 of 104                      │
│ Artifacts Lost: ~4,500 (estimated)              │
│ Cultural Span Affected: 3,000+ years            │
│ Timeline: Oct 7, 2023 → [Current Position]     │
└─────────────────────────────────────────────────┘
```

**Updates Dynamically:**

- As timeline scrubber moves, metrics update in real-time
- Progress bar fills with grey as heritage is destroyed
- Animate number changes (count-up effect)

**Calculation:**

```javascript
const heritageMetrics = (currentTimestamp) => {
  const destroyedUpToNow = sites.filter(
    (s) => s.destructionDate && s.destructionDate <= currentTimestamp
  );

  const totalValue = sites.reduce((sum, s) => sum + glowContribution(s), 0);
  const destroyedValue = destroyedUpToNow.reduce((sum, s) => sum + glowContribution(s), 0);

  return {
    integrityPercent: ((totalValue - destroyedValue) / totalValue) * 100,
    sitesDestroyed: destroyedUpToNow.length,
    totalSites: sites.length,
    artifactsLost: destroyedUpToNow.reduce((sum, s) => sum + (s.artifacts?.length || 0), 0),
    oldestSiteDestroyed: Math.min(...destroyedUpToNow.map((s) => s.creationYear || 2024)),
  };
};
```

---

### 4. Optional Enhancements

#### Destruction Density Heatmap

- Show "intensity" of destruction in geographic clusters
- Use Voronoi diagram or hexbins
- Darker areas = more concentrated destruction

#### Sound Design (Optional)

- Subtle ambient sound that "dulls" as heritage dims
- Audio cue when site is destroyed during playback

#### Export Timeline Animation

- "Record" button to create shareable GIF/video
- Shows 30-second condensed version of full timeline

---

## Data Structure Requirements

### Enhanced Site Type

```typescript
interface GazaSite {
  // Existing fields
  id: string;
  name: string;
  nameArabic: string;
  type: string;
  status: "destroyed" | "heavily-damaged" | "damaged";
  coordinates: [number, number];
  destructionDate: Date | null;
  creationYear: number | null;

  // New fields needed
  destructionMode: "destroyed" | "looted" | "heavily-damaged" | "damaged";
  artifacts?: Array<{
    name: string;
    description: string;
    estimatedValue?: number;
  }>;
  artifactCount?: number;
  unescoListed?: boolean;
  historicalEvents?: string[];
  documentation?: {
    pages?: number;
    photographs?: number;
    scholarlyPapers?: number;
  };
  isUnique?: boolean; // Only one of its kind in Gaza
  religiousSignificance?: boolean;
  communityGatheringPlace?: boolean;
  touristVisitsPerYear?: number;
}
```

---

## Component Architecture

### Implemented Components ✅

1. **`TimelineScrubber.tsx`** ✅ Phase 1

   - Main timeline control component
   - Handles play/pause, scrubbing, speed controls
   - Uses D3.js for axis rendering
   - Location: `src/components/Timeline/TimelineScrubber.tsx`
   - Tests: 12 passing tests in `src/__tests__/TimelineScrubber.test.tsx`

2. **`MapGlowLayer.tsx`** ✅ Phase 2

   - Leaflet.heat integration for ambient glow
   - Renders as non-visual component (Leaflet layer)
   - Updates based on timeline position via `glowContributions` prop
   - Location: `src/components/Map/MapGlowLayer.tsx`
   - Tests: 7 passing tests in `src/components/Map/MapGlowLayer.test.tsx`

3. **`useMapGlow.ts`** ✅ Phase 2

   - Custom hook for glow calculations
   - Pre-calculates expensive operations with `useMemo`
   - Returns glow contributions + current metrics
   - Location: `src/hooks/useMapGlow.ts`
   - Tests: 24 passing tests in `src/__tests__/useMapGlow.test.ts`

4. **`AnimationContext.tsx`** ✅ Phase 1

   - Manages timeline playback state globally
   - Provides `currentTimestamp`, `isPlaying`, `speed` to all components
   - Coordinates between scrubber, map, and future metrics dashboard
   - Location: `src/contexts/AnimationContext.tsx`
   - Tests: 10 passing tests in `src/__tests__/AnimationContext.test.tsx`

5. **`heritageCalculations.ts`** ✅ Phase 2

   - Utility functions for glow contribution formulas
   - Integrity percent calculation
   - Destruction value tracking
   - Location: `src/utils/heritageCalculations.ts`
   - Tests: 42 passing tests in `src/__tests__/heritageCalculations.test.ts`

6. **`SiteDetailView.tsx`** ✅ New Feature (Oct 2025)

   - Satellite-only aerial view map for selected sites
   - **Historical satellite imagery toggle** (3 time periods via TimeToggle component)
   - Automatically zooms to selected site at detail level (zoom 17)
   - Shows Gaza overview when no site selected (zoom 10.5)
   - Synced with existing `highlightedSiteId` state (table/timeline/map)
   - Optimized initial view: center [31.42, 34.38] for better framing
   - Consistent zoom levels across all historical periods (zoom 17 for fair comparison)
   - Location: `src/components/Map/SiteDetailView.tsx`
   - Tests: 13 passing tests in `src/components/Map/SiteDetailView.test.tsx`

7. **`TimeToggle.tsx`** ✅ New Feature (Oct 2025)

   - 3-button toggle for historical satellite imagery periods
   - Options: 2014 Baseline, Aug 2023 (Pre-conflict), Current
   - Positioned top-right corner of SiteDetailView
   - Green highlight for selected period (Palestinian flag color #009639)
   - ARIA labels for accessibility
   - Location: `src/components/Map/TimeToggle.tsx`
   - Tests: 7 passing tests in `src/components/Map/TimeToggle.test.tsx`

8. **Map View Configuration** ✅ Updated (Oct 2025)

   - Optimized Gaza center coordinates: `[31.42, 34.38]` (adjusted from `[31.5, 34.45]`)
   - Default zoom level: `10.5` (balanced between 10 and 11)
   - Site detail zoom: `17` (consistent across all historical imagery periods)
   - Better initial framing prevents Gaza from being cut off at bottom
   - Improved utilization of horizontal map space
   - Applied consistently across HeritageMap and SiteDetailView
   - Location: `src/constants/map.ts`

9. **Historical Imagery Constants** ✅ New Feature (Oct 2025)

   - ESRI Wayback WMTS integration for historical satellite imagery
   - 3 time periods: BASELINE_2014, PRE_CONFLICT_2023, CURRENT
   - Each period has unique URL, release number, label, and maxZoom
   - 2014: Earliest available (Feb 20, 2014), maxZoom 17
   - Aug 2023: Pre-conflict baseline (Aug 31, 2023), maxZoom 18
   - Current: Latest ESRI World Imagery, maxZoom 19
   - Location: `src/constants/map.ts` (HISTORICAL_IMAGERY constant)

### To Be Created 🚧

1. **`MarkerAnimations.tsx`** - Phase 3

   - Handles destruction animations (explode, drain, crack, shake)
   - Particle systems for looting effect
   - Transitions from colored to grey states

2. **`HeritageMetricsDashboard.tsx`** - Phase 4

   - Displays integrity meter and stats
   - Animates metric changes
   - Real-time updates based on timeline

### Updated Components

1. **`App.tsx`** ✅ Updated

   - ✅ Removed left sidebar timeline (reclaimed space)
   - ✅ Added TimelineScrubber below maps
   - ✅ Fixed viewport layout - no page scrolling
   - ⏸️ HeritageMetricsDashboard (future work)

2. **`HeritageMap.tsx`** ✅ Updated

   - ✅ Added MapGlowLayer as overlay
   - ✅ Uses `h-full` for flex layout instead of fixed height
   - ✅ Filter markers based on timeline position
   - ⏸️ Animated marker states (Phase 3)

3. **`DesktopLayout.tsx`** ✅ Updated (Oct 2025)

   - ✅ Three-column layout: Table (left, resizable) | HeritageMap (center) | SiteDetailView (right)
   - ✅ Fixed viewport height with flexbox (`calc(100vh-140px)`)
   - ✅ Timeline below both maps with fixed 200px height
   - ✅ Maps constrained to leave room for timeline
   - ✅ Only table scrolls - everything else fits on screen
   - ✅ Horizontal filter bar with Color Key integrated
   - ✅ Site Type column with icon-based display and tooltips
   - ✅ Clickable site names (removed Actions column)

---

## Implementation Phases

### Phase 1: Foundation ✅ COMPLETE (Sessions 1-2)

- ✅ Create TimelineScrubber component with D3.js
- ✅ Add basic play/pause/scrub functionality
- ✅ Connect timeline to map filtering
- ✅ Hide old sidebar timeline (code preserved for Phase 5 removal)
- ✅ Create AnimationContext for global state
- ✅ Add keyboard controls (Space, Arrows, Home/End)
- ✅ Speed control dropdown (0.5x, 1x, 2x, 4x)
- ✅ 12 tests passing for TimelineScrubber
- ✅ 10 tests passing for AnimationContext

**Commit:** `bf5e504` - feat(timeline): implement Phase 1 - interactive timeline scrubber

### Phase 2: Visual States ✅ COMPLETE (Sessions 3-4)

- ✅ Implement Leaflet.heat glow system (MapGlowLayer)
- ✅ Calculate glow contributions for all sites (useMapGlow hook)
- ✅ Create heritageCalculations utility functions
- ✅ Integrate glow layer with timeline animation
- ✅ Performance: ~19-26ms to render 25 sites
- ✅ 7 tests passing for MapGlowLayer
- ✅ 24 tests passing for useMapGlow
- ✅ 42 tests passing for heritageCalculations
- ✅ Canvas mock added to test setup for heat map

**Key Decision:** Used Leaflet.heat plugin instead of custom Canvas implementation for better performance and maintainability.

**Status:** Completed and merged in feature/timelineImprovements branch (PR #14)

### Phase 3: Animations 🚧 NEXT (Sessions 5-6)

- [ ] Build destruction animations (explode, crack, shake)
- [ ] Implement looting particle system with trail
- [ ] Add transition animations between states
- [ ] Fine-tune timing and easing
- [ ] Add marker color coding by age (optional)

**Note:** Marker animations may be deprioritized in favor of the existing heat map glow effect, which already provides strong visual impact.

### Phase 4: Metrics Dashboard (Session 7)

- [ ] Create HeritageMetricsDashboard component
- [ ] Implement real-time metric calculations (already available via useMapGlow)
- [ ] Add count-up animations
- [ ] Style dashboard to match theme

### Phase 5: Polish & Testing (Session 8+)

- [ ] Performance optimization (already meeting 60fps target)
- [ ] Mobile responsiveness (reduced particles, touch controls)
- [ ] Accessibility (keyboard controls ✅ done, screen readers pending)
- [ ] Cross-browser testing
- [ ] Remove deprecated VerticalTimeline component

---

## Technical Dependencies

### Libraries Installed ✅

```json
{
  "d3": "^7.9.0",           // ✅ Timeline axis, scales, time formatting
  "d3-scale": "^4.0.2",     // ✅ Time scales for date mapping
  "leaflet.heat": "^0.2.0"  // ✅ Heat map plugin for ambient glow
}
```

**Note:** `framer-motion` was NOT needed - using CSS transitions and requestAnimationFrame instead.

### Native APIs Used

- **Canvas API** - Via Leaflet.heat for glow rendering (excellent performance)
- **requestAnimationFrame** - For smooth timeline playback
- **D3.js** - For timeline axis, date scales, and event handling

### TypeScript Types

```json
{
  "@types/d3": "^7.4.3",
  "@types/d3-scale": "^4.0.8",
  "@types/leaflet.heat": "^0.2.4"  // ✅ Added for heat map types
}
```

### Test Setup

- **Canvas mock** in `src/test/setup.ts` for `leaflet.heat` compatibility
- **ResizeObserver mock** for TimelineScrubber compatibility
- All 204 tests passing (was 194 before historical imagery feature)

---

## Performance Considerations

### Implemented ✅

1. **Leaflet.heat Plugin** ✅

   - Handles Canvas rendering internally
   - Clusters points into grid for performance
   - Result: ~19-26ms to render 25 sites (excellent!)

2. **Memoized Glow Calculations** ✅

   - `useMapGlow` hook uses `useMemo` for expensive calculations
   - Pre-calculates all glow contributions on sites change
   - Only recalculates current metrics when `currentDate` changes

3. **Efficient Timeline Updates** ✅

   - Uses `requestAnimationFrame` for smooth 60fps playback
   - D3 handles date scale calculations efficiently
   - No unnecessary re-renders

4. **Component Optimization** ✅

   - MapGlowLayer returns `null` (non-visual React component)
   - Leaflet layer lifecycle managed in `useEffect` cleanup
   - No DOM overhead from React for heat map rendering

### Current Performance Metrics

- **MapGlowLayer render:** 19-26ms for 25 sites ✅ (target: <100ms)
- **Full app render:** 105ms for 25 sites ✅ (target: <1000ms)
- **Timeline scrubbing:** Smooth at 60fps ✅
- **Test suite:** 181 tests pass in ~6-7s ✅

### Future Optimizations (if needed)

- Only animate visible markers (when Phase 3 animations added)
- Pause heat map updates when timeline not playing
- Reduce particle effects on mobile devices

---

## Accessibility

- ✅ Keyboard controls for timeline (arrow keys, space for play/pause, Home/End)
- ✅ ARIA labels on timeline controls (play/pause, reset, speed)
- ✅ ARIA region for timeline scrubber
- [ ] Screen reader announcements for timeline position changes
- [ ] High contrast mode support
- [ ] Reduced motion support (disable animations if user prefers `prefers-reduced-motion`)

---

## Success Metrics

**User Engagement:**

- Average time spent on timeline feature
- % of visitors who interact with scrubber
- Play-through completion rate

**Emotional Impact:**

- Qualitative feedback on "dimming" effect
- Social shares with timeline animation

**Technical:**

- Smooth 60fps animation
- <100ms response time for scrubbing
- Works on mobile devices

---

## Decisions Made ✅

1. **Timeline Library:** D3.js ✅
   - Result: Excellent! Powerful scales, axis rendering, and event handling
   - No need for specialized React timeline library

2. **Glow Implementation:** Leaflet.heat plugin ✅
   - Result: Better than custom Canvas! Pre-built, fast, maintained
   - Uses Canvas internally with grid optimization
   - No need for WebGL complexity

3. **Mobile Touch:** Native Leaflet behavior ✅
   - Leaflet handles touch events well
   - D3 drag behavior works on touch devices
   - May need threshold tuning for accidental drags (future)

4. **Animation Interruption:** Yes, fully interruptible ✅
   - Users can pause, scrub, reset at any time
   - Timeline updates immediately on user interaction

5. **State Management:** React Context ✅
   - AnimationContext provides global state
   - Simple, no external library needed
   - Works perfectly for this use case

---

## Design Files Needed

- [ ] Glow gradient specifications
- [ ] Particle system sprites
- [ ] Animation timing curves
- [ ] Color palette for age-based coding
- [ ] Icon designs for destruction modes

---

## Leaflet.heat Plugin Deep Dive

### Why Leaflet.heat?

Originally planned to build custom Canvas glow system. Discovered Leaflet.heat already provides:

- Fast, optimized heat map rendering
- Built-in Canvas management
- Grid clustering for performance
- Customizable gradient system
- Simple API

### Configuration Power

See section "Leaflet.heat Configuration Options" above for full details. Key highlights:

- **radius** & **blur**: Create ambient "glow" effect (we use 40px & 50px vs defaults 25px & 15px)
- **gradient**: 5-stop custom gradient (gold → grey) for "dimming Gaza" metaphor
- **minOpacity**: Controls baseline transparency (0.2 = subtle but visible)
- **Dynamic updates**: Heat layer recreates on data change (handled by useEffect)

### Data Format

```typescript
// Each point: [lat, lng, intensity]
// Intensity normalized 0-1 based on maxGlow
const heatData = glowContributions
  .filter(contrib => contrib.currentGlow > 0)
  .map(contrib => [
    contrib.coordinates[0],  // lat
    contrib.coordinates[1],  // lng
    contrib.currentGlow / maxGlow  // normalized intensity
  ]);
```

### Performance Characteristics

- Uses simpleheat library under the hood
- Clusters points into grid for efficiency
- Canvas rendering (GPU-accelerated)
- No DOM nodes created (unlike SVG markers)
- Measured: 19-26ms for 25 sites (excellent!)

---

## Notes

- Maintain Palestinian flag color scheme throughout ✅
- Ensure animations respect the gravity of the subject matter ✅
- Performance is critical - this needs to feel smooth ✅ (60fps achieved)
- Mobile-first approach for timeline controls ✅
- **Key insight:** Using Leaflet.heat dramatically simplified Phase 2
- **Lesson learned:** Check for existing libraries before building from scratch!
