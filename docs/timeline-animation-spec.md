# Timeline Animation Feature Specification

**Status:** Phase 1-2 Complete ✅ | Phase 3+ Paused ⏸️ | UI Refinement Complete ✅
**Branch:** feature/UI-refinement (PR #19 - Ready for merge)
**Previous Branch:** feature/timelineImprovements (MERGED to main)
**Related Docs:** `../CLAUDE.md`, `UI_REFINEMENT_PROGRESS.md`, `UI_DESIGN_IMPROVEMENTS.md`

---

## 🎯 Quick Reference

### Core Concept: "Dimming Gaza"
As destruction occurs chronologically, the map visually "dims" - representing the extinguishing of cultural heritage and collective memory.

### Implementation Status
```
Phase 1: Timeline Foundation         ✅ COMPLETE
Phase 2: Visual States (Glow Layer)  ✅ COMPLETE
Phase 3: Destruction Animations      ⏸️ PAUSED
Phase 4: Metrics Dashboard           ⏸️ PAUSED
Phase 5: Polish & Testing            ⏸️ PAUSED
```

### Recent Updates (Oct 2025)

1. **UI Refinement Complete** (PR #19 - feature/UI-refinement)
   - Palestinian flag theme integration (red triangle background)
   - Black border system across all components (2px borders)
   - Visual depth enhancement (shadow-xl for dramatic floating effect)
   - Timeline made compact (py-3, mb-3 spacing)
   - Semi-transparent timeline (bg-white/90 with backdrop-blur-sm)
   - Design system applied consistently
   - All 204 tests passing

2. **Historical satellite imagery** - SiteDetailView supports 3 time periods:
   - 2014 Baseline (Feb 20, 2014 - earliest ESRI Wayback)
   - Aug 2023 Pre-conflict (Aug 31, 2023 - last before Oct 7)
   - Current (latest ESRI World Imagery)
   - Zoom standardized to 17 for consistent comparison

3. **Major refactoring** - Modular architecture improvements (previous work)

---

## 📦 Implemented Components

### 1. TimelineScrubber.tsx ✅
**Location:** `src/components/Timeline/TimelineScrubber.tsx`
**Purpose:** Horizontal D3.js timeline with playback controls

**Features:**

- Play/Pause/Reset buttons with design system styling
- Draggable scrubber handle
- Speed control (0.5x, 1x, 2x, 4x)
- Event markers at destruction dates
- Keyboard controls (Space, Arrows, Home/End)
- **UI Refinement:** Compact spacing (p-3), black border (border-2), shadow-xl, semi-transparent (bg-white/90)
**Tests:** 12 passing (src/__tests__/TimelineScrubber.test.tsx)

### 2. AnimationContext.tsx ✅
**Location:** `src/contexts/AnimationContext.tsx` (153 lines)
**Purpose:** Global animation state management
**Provides:**
- `currentTimestamp` - Current playback position
- `isPlaying` - Play/pause state
- `speed` - Playback speed multiplier
- `play()`, `pause()`, `reset()`, `setTimestamp()`
**Tests:** 10 passing (src/__tests__/AnimationContext.test.tsx)

### 3. MapGlowLayer.tsx ✅
**Location:** `src/components/Map/MapGlowLayer.tsx` (176 lines)
**Purpose:** Canvas ambient glow overlay using Leaflet.heat
**Features:**
- Heat map visualization of heritage "glow"
- Fades as sites are destroyed (gold → grey)
- Configurable radius (40px), blur (50px), gradient
- Performance: ~19-26ms for 25 sites
**Tests:** 7 passing (src/components/Map/MapGlowLayer.test.tsx)

### 4. useMapGlow.ts ✅
**Location:** `src/hooks/useMapGlow.ts`
**Purpose:** Pre-calculate glow contributions with useMemo
**Returns:**
- `glowContributions` - Array of {id, coordinates, currentGlow}
- `currentMetrics` - integrityPercent, sitesDestroyed, etc.
**Tests:** 24 passing (src/__tests__/useMapGlow.test.ts)

### 5. heritageCalculations.ts ✅
**Location:** `src/utils/heritageCalculations.ts`
**Purpose:** Site value and glow formulas
**Functions:**
- `calculateGlowContribution(site)` - Weight based on age + significance
- `calculateIntegrityPercent(sites, currentDate)` - Heritage remaining
- `calculateDestroyedValue(sites, currentDate)` - Cumulative loss
**Tests:** 42 passing (src/__tests__/heritageCalculations.test.ts)

### 6. SiteDetailView.tsx ✅ (NEW - Oct 2025)
**Location:** `src/components/Map/SiteDetailView.tsx`
**Purpose:** Satellite aerial view with historical imagery
**Features:**
- Zooms to selected site (zoom 17) or Gaza overview (zoom 10.5)
- Historical imagery toggle (TimeToggle component)
- Synced with `highlightedSiteId` state
- Red dot marker for selected site
**Tests:** 13 passing (src/components/Map/SiteDetailView.test.tsx)

### 7. TimeToggle.tsx ✅ (NEW - Oct 2025)
**Location:** `src/components/Map/TimeToggle.tsx`
**Purpose:** 3-button toggle for historical satellite imagery
**Options:**
- 2014 Baseline | Aug 2023 (Pre-conflict) | Current
- Green highlight (#009639) for selected period
- ARIA labels for accessibility
**Tests:** 7 passing (src/components/Map/TimeToggle.test.tsx)

### 8. Map Configuration ✅ (UPDATED - Oct 2025)
**Location:** `src/constants/map.ts`
**Key Constants:**
```typescript
GAZA_CENTER: [31.42, 34.38]  // Optimized (was [31.5, 34.45])
DEFAULT_ZOOM: 10.5            // Balanced overview
SITE_DETAIL_ZOOM: 17          // Consistent across historical imagery

HISTORICAL_IMAGERY: {
  BASELINE_2014: {
    date: "2014-02-20",
    maxZoom: 17,
    url: "...wayback.../tile/10/{z}/{y}/{x}"
  },
  PRE_CONFLICT_2023: {
    date: "2023-08-31",
    maxZoom: 18,
    url: "...wayback.../tile/64776/{z}/{y}/{x}"
  },
  CURRENT: {
    date: "current",
    maxZoom: 19,
    url: "...arcgisonline.../tile/{z}/{y}/{x}"
  }
}
```

---

## 🚧 Planned Components (Paused)

### MarkerAnimations.tsx (Phase 3)
**Purpose:** Destruction animations for map markers
**Animations:**
- **Destroyed:** Red → Grey, "explode" burst (800ms, 100% glow removal)
- **Looted:** Purple → Hollow grey, particle drain (1200ms, 100% glow removal)
- **Heavily Damaged:** Orange → Muted, "crack" effect (600ms, 50% glow removal)
- **Damaged:** Yellow → Muted, "shake" tremor (400ms, 25% glow removal)

### HeritageMetricsDashboard.tsx (Phase 4)
**Purpose:** Real-time heritage integrity display
**Metrics:**
- Heritage Integrity: X% (progress bar)
- Sites Destroyed: X of Y
- Artifacts Lost: ~X (estimated)
- Cultural Span Affected: X+ years
- Timeline: Oct 7, 2023 → [Current Position]

---

## 🎨 Visual Design System

### Glow Contribution Formula
```typescript
const calculateGlowContribution = (site: GazaSite): number => {
  let weight = 100;

  // Age multipliers
  const age = 2024 - (site.creationYear || 0);
  if (age > 2000) weight *= 3;      // Ancient (Bronze Age, Byzantine)
  else if (age > 1000) weight *= 2; // Medieval (Islamic Golden Age)
  else if (age > 200) weight *= 1.5; // Ottoman/Historic

  // Significance multipliers
  if (site.unescoListed) weight *= 2;
  if (site.artifactCount > 100) weight *= 1.5;
  if (site.type === "archaeological") weight *= 1.8;
  if (site.type === "museum") weight *= 1.6;
  if (site.isUnique) weight *= 2;

  return weight;
};
```

### Leaflet.heat Configuration
```typescript
L.heatLayer(heatData, {
  minOpacity: 0.2,      // Baseline transparency
  maxZoom: 18,          // Zoom level for max intensity
  radius: 40,           // Heat point size (vs default 25)
  blur: 50,             // Blur for soft glow (vs default 15)
  gradient: {
    0.0: "#6B7280",     // Grey (destroyed)
    0.3: "#9CA3AF",
    0.5: "#D4A574",
    0.7: "#E5C07B",
    1.0: "#FFD700"      // Gold (intact)
  }
})
```

**Why larger radius/blur?**
Creates ambient "heritage glow" effect (metaphor for extinguishing light/memory) rather than discrete data clusters.

### Marker Color Coding (Before Destruction)
- Ancient (>2000 years): Gold `#FFD700`
- Medieval (500-2000 years): Bronze `#CD7F32`
- Ottoman/Historic (200-500 years): Silver `#C0C0C0`
- Modern (<200 years): Blue `#4A90E2`

**Size:** `Math.sqrt(significanceScore(site)) * 2`

---

## ⚡ Performance

### Current Metrics
- MapGlowLayer render: 19-26ms for 25 sites ✅
- Full app render: 105ms for 25 sites ✅
- Timeline scrubbing: 60fps ✅
- Test suite: 204 tests in ~6-7s ✅

### Optimization Patterns
```tsx
// Pre-calculate expensive operations
const glowContributions = useMemo(
  () => sites.map(s => ({ id: s.id, glow: glowContribution(s) })),
  [sites]
);

// Throttle updates to 60fps
const throttledUpdate = useCallback(
  throttle((timestamp: Date) => updateMapState(timestamp), 16),
  []
);

// Cleanup animation frames
useEffect(() => {
  const frameId = requestAnimationFrame(renderGlow);
  return () => cancelAnimationFrame(frameId);
}, [deps]);

// Object pooling for particles (Phase 3)
const particlePool = useMemo(() => createParticlePool(100), []);
```

### Requirements
- Desktop: 60fps minimum
- Mobile: 30fps acceptable (reduced effects)
- Initial load: <3s on 3G
- Animation latency: <100ms for scrubbing

---

## 🧪 Testing

**Total:** 204 tests across 21 files

**Key Test Files:**
- TimelineScrubber: 12 tests
- AnimationContext: 10 tests
- MapGlowLayer: 7 tests
- heritageCalculations: 42 tests
- useMapGlow: 24 tests
- SiteDetailView: 13 tests (includes historical imagery)
- TimeToggle: 7 tests
- Performance: 9 tests (25+ sites, 50 site stress test)

**Test Setup:**
- Canvas mock (leaflet.heat compatibility)
- ResizeObserver mock (TimelineScrubber compatibility)

---

## 📚 Technical Dependencies

### Installed Libraries
```json
{
  "d3": "^7.9.0",           // Timeline axis, scales
  "d3-scale": "^4.0.2",     // Time scales
  "leaflet.heat": "^0.2.0"  // Heat map plugin
}
```

### TypeScript Types
```json
{
  "@types/d3": "^7.4.3",
  "@types/d3-scale": "^4.0.8",
  "@types/leaflet.heat": "^0.2.4"
}
```

### Native APIs
- Canvas API (via Leaflet.heat)
- requestAnimationFrame (timeline playback)

---

## 🎯 Implementation Phases

### Phase 1: Timeline Foundation ✅
**Completed:** Sessions 1-2
- [x] TimelineScrubber with D3.js
- [x] AnimationContext for global state
- [x] Play/pause/reset/scrub functionality
- [x] Speed control (0.5x, 1x, 2x, 4x)
- [x] Keyboard controls
- [x] Connect timeline to map filtering
**Commit:** `bf5e504`

### Phase 2: Visual States ✅
**Completed:** Sessions 3-13 + UX improvements
- [x] Leaflet.heat glow system (MapGlowLayer)
- [x] Glow contribution calculations (useMapGlow)
- [x] heritageCalculations utilities
- [x] Performance: 19-26ms for 25 sites
- [x] Resizable table, satellite map toggle
- [x] Deferred filter application
- [x] Mobile fixes
- [x] 45 site dataset expansion
- [x] All 184 tests passing
**Merged:** PR #14 - feature/timelineImprovements

### Phase 3: Animations ⏸️
**Paused** - May be deprioritized (glow effect provides strong visual impact)
- [ ] Destruction animations (explode, crack, shake)
- [ ] Looting particle system with trails
- [ ] Transition timing and easing
- [ ] Performance optimization (60fps)

### Phase 4: Metrics Dashboard ⏸️
**Paused** - Calculations already available via useMapGlow
- [ ] HeritageMetricsDashboard component
- [ ] Count-up animations
- [ ] Style matching Palestinian flag theme

### Phase 5: Polish & Testing ⏸️
**Paused**
- [ ] Mobile timeline support (currently disabled)
- [ ] Screen reader accessibility
- [ ] Cross-browser testing
- [ ] Remove deprecated VerticalTimeline

---

## 🚫 Critical Constraints

### MUST Maintain
- ✅ Palestinian flag colors (#ed3039, #009639, #000000, #fefefe)
- ✅ All 204 tests passing
- ✅ 60fps desktop / 30fps mobile
- ✅ Leaflet `[lat, lng]` coordinate format
- ✅ Tailwind-only styling
- ✅ Site highlight syncing (Timeline ↔ Map ↔ Table)

### MUST NOT
- ❌ Break map interactions (zoom, pan, click)
- ❌ Impact table/filter functionality
- ❌ Degrade performance below 30fps on mobile
- ❌ Add external CSS files
- ❌ Use localStorage/sessionStorage

---

## 💡 Key Technical Decisions

### 1. Timeline Library: D3.js ✅
**Result:** Excellent. Powerful scales, axis rendering, event handling. No need for specialized React timeline library.

### 2. Glow Implementation: Leaflet.heat ✅
**Result:** Better than custom Canvas! Pre-built, fast, maintained. Uses Canvas internally with grid optimization.

### 3. State Management: React Context ✅
**Result:** Simple, no external library needed. Works perfectly for this use case.

### 4. Animation Interruption: Yes ✅
**Result:** Users can pause, scrub, reset at any time. Timeline updates immediately.

### 5. Mobile Touch: Native Leaflet ✅
**Result:** Leaflet handles touch events well. May need threshold tuning for accidental drags (future).

---

## 🐛 Known Gotchas

### ❌ DO NOT
- Use `Date.now()` for animation timing (use `performance.now()`)
- Forget to cleanup animation frames on unmount
- Animate all markers at once (lazy load visible only)
- Create new particle objects each frame (use object pooling)

### ✅ DO
- Use D3.js `scaleTime()` for date axis
- Handle timezone differences (UTC vs local)
- Throttle timeline updates to 60fps max
- Pre-calculate expensive operations (memoize)
- Test on low-end devices (throttle CPU in DevTools)
- Add reduced-motion media query support

### Canvas Overlay on Leaflet
```tsx
// ✅ Correct z-index and positioning
<div className="leaflet-pane" style={{ zIndex: 400 }}>
  <canvas
    ref={canvasRef}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      pointerEvents: "none", // Allow map interactions through canvas
    }}
  />
</div>
```

---

## 📝 Notes

- Maintain Palestinian flag color scheme throughout ✅
- Animations respect subject matter gravity ✅
- Performance is critical - smooth 60fps ✅
- Mobile-first approach ✅
- **Key insight:** Leaflet.heat dramatically simplified Phase 2
- **Lesson learned:** Check for existing libraries before building from scratch!

---

**Last Updated:** October 17, 2025
**Current Branch:** feature/UI-refinement (PR #19 - ready for merge)
**Previous Branch:** feature/secondMapfixes-viewImprovements (merged to main)
**Spec Version:** 2.1 (includes UI refinement updates)
