# Heritage Tracker - Timeline Animation Feature Specification

## Overview

Replace the current static timeline sidebar with an interactive, animated timeline scrubber that visualizes the destruction of Gaza's cultural heritage over time (Oct 2023 - Present).

## Core Concept: "Dimming Gaza"

As destruction occurs chronologically, the map visually "dims" - representing the extinguishing of cultural heritage and collective memory.

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

#### A. Ambient Glow System ("Dimming")

**Initial State (Oct 7, 2023):**

- Gaza has warm, golden ambient glow over heritage-rich areas
- Glow intensity based on cumulative heritage value in region

**As Destruction Occurs:**

- Each destroyed site removes its "glow contribution"
- Map progressively darkens/cools in affected areas
- Color shift: Warm gold (#FFD700) → Cool grey (#6B7280)

**Implementation:**

- Canvas API with gradient overlays
- Each site has a `glowContribution` value based on:
  - Age (older = more weight)
  - Significance (UNESCO status, artifact count)
  - Type (archaeological sites, museums have higher weight)
  - Uniqueness

**Glow Calculation:**

```javascript
const glowContribution = (site) => {
  let weight = 100; // Base value

  // Age factor
  const age = 2024 - (site.creationYear || 0);
  if (age > 2000) weight *= 3; // Ancient
  else if (age > 1000) weight *= 2; // Medieval
  else if (age > 200) weight *= 1.5; // Historic

  // Significance multipliers
  if (site.unescoListed) weight *= 2;
  if (site.artifacts?.length > 100) weight *= 1.5;
  if (site.type === "archaeological-site") weight *= 1.8;
  if (site.type === "museum" || site.type === "library") weight *= 1.6;

  return weight;
};
```

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

**Location:** Above the map or as overlay panel

**Metrics to Display:**

```
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

### New Components to Create

1. **`TimelineScrubber.tsx`**

   - Main timeline control component
   - Handles play/pause, scrubbing, speed controls
   - Uses D3.js for axis rendering

2. **`MapGlowLayer.tsx`** or `useMapGlow.ts`

   - Canvas overlay for glow effects
   - Calculates and renders ambient heritage glow
   - Updates based on timeline position

3. **`MarkerAnimations.tsx`**

   - Handles destruction animations (explode, drain, crack, shake)
   - Particle systems for looting effect
   - Transitions from colored to grey states

4. **`HeritageMetricsDashboard.tsx`**

   - Displays integrity meter and stats
   - Animates metric changes
   - Real-time updates based on timeline

5. **`AnimationController.ts`** (Hook or Context)
   - Manages timeline playback state
   - Coordinates between scrubber, map, and metrics
   - Handles play/pause/speed/reset logic

### Updated Components

1. **`App.tsx`**

   - Remove left sidebar timeline (reclaim 440px)
   - Add TimelineScrubber below map
   - Add HeritageMetricsDashboard above map
   - Widen map and table columns

2. **`HeritageMap.tsx`**
   - Add MapGlowLayer as overlay
   - Update marker rendering to use animated states
   - Filter markers based on timeline position

---

## Implementation Phases

### Phase 1: Foundation (Session 1-2)

- [ ] Create TimelineScrubber component with D3.js
- [ ] Add basic play/pause/scrub functionality
- [ ] Connect timeline to map filtering
- [ ] Remove old sidebar timeline

### Phase 2: Visual States (Session 3-4)

- [ ] Implement Canvas glow system
- [ ] Calculate glow contributions for all sites
- [ ] Add marker color coding by age
- [ ] Implement grey-out on destruction

### Phase 3: Animations (Session 5-6)

- [ ] Build destruction animations (explode, crack, shake)
- [ ] Implement looting particle system with trail
- [ ] Add transition animations between states
- [ ] Fine-tune timing and easing

### Phase 4: Metrics Dashboard (Session 7)

- [ ] Create HeritageMetricsDashboard component
- [ ] Implement real-time metric calculations
- [ ] Add count-up animations
- [ ] Style dashboard to match theme

### Phase 5: Polish & Testing (Session 8+)

- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Accessibility (keyboard controls, screen readers)
- [ ] Cross-browser testing

---

## Technical Dependencies

### New Libraries Needed

```json
{
  "d3": "^7.8.5", // Timeline axis and scales
  "d3-scale": "^4.0.2", // Time scales
  "framer-motion": "^10.16.0" // Smooth animations (optional, can use CSS)
}
```

### Canvas API Usage

- For glow effects and particle systems
- Better performance than SVG for many animated elements

### Three.js (Future Enhancement)

- If we want 3D elevation representation
- Not needed for Phase 1

---

## Performance Considerations

1. **Throttle Timeline Updates**

   - Don't recalculate glow on every pixel of scrubbing
   - Update at 60fps max, use requestAnimationFrame

2. **Memoize Glow Calculations**

   - Pre-calculate glow contributions for all sites
   - Cache results in useMemo

3. **Use Canvas for Glow, SVG for Markers**

   - Canvas for continuous glow gradients (better performance)
   - SVG/DOM for interactive markers (better clickability)

4. **Lazy Load Animations**
   - Only animate visible markers
   - Pause animations when timeline isn't playing

---

## Accessibility

- [ ] Keyboard controls for timeline (arrow keys, space for play/pause)
- [ ] Screen reader announcements for timeline position
- [ ] High contrast mode support
- [ ] Reduced motion support (disable animations if user prefers)

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

## Open Questions for Claude Code

1. Should we use D3.js or a React timeline library?
2. Canvas or WebGL for glow effects?
3. How to handle mobile touch interactions?
4. Should animations be skippable/interruptible?
5. Best way to store animation state (Context, Zustand, local state)?

---

## Design Files Needed

- [ ] Glow gradient specifications
- [ ] Particle system sprites
- [ ] Animation timing curves
- [ ] Color palette for age-based coding
- [ ] Icon designs for destruction modes

---

## Notes

- Maintain Palestinian flag color scheme throughout
- Ensure animations respect the gravity of the subject matter
- Performance is critical - this needs to feel smooth
- Mobile-first approach for timeline controls
