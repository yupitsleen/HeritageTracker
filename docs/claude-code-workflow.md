# Claude Code Workflow for Timeline Animation Feature

Quick reference guide for working with Claude Code on the Heritage Tracker timeline animation feature.

## Pre-Session Setup

### Required Files to Have Open

1. ✅ `CLAUDE.md` - Project standards and architecture
2. ✅ `docs/timeline-animation-spec.md` - Feature specification
3. ✅ `src/App.tsx` - Current layout structure
4. ✅ `src/styles/theme.ts` - Palestinian flag color palette
5. ✅ `src/types.ts` - Data structures

### Before Starting Each Session

```bash
# 1. Ensure dev server is running
npm run dev

# 2. Verify all tests pass
npm test

# 3. Check linter is clean
npm run lint

# 4. Create feature branch (if starting new phase)
git checkout -b feat/timeline-animation-phase-1
```

---

## Session-by-Session Prompts

### Phase 1: Timeline Scrubber Foundation (Sessions 1-2)

**Session 1 Starting Prompt:**

```
I'm implementing Phase 1 of the timeline animation feature for Heritage Tracker.

Please read these files for context:
- CLAUDE.md (project standards and architecture)
- docs/timeline-animation-spec.md (complete feature specification)
- src/App.tsx (current layout structure)
- src/styles/theme.ts (Palestinian flag color palette)

TASK: Create TimelineScrubber.tsx component

Requirements:
1. Use D3.js to create horizontal time scale (Oct 7, 2023 → Dec 31, 2024)
2. Show event markers (dots) at each site's destructionDate
3. Include draggable scrubber handle that updates timestamp
4. Add Play, Pause, Reset buttons
5. Add Speed control dropdown (0.5x, 1x, 2x, 4x)
6. Filter map to show only sites destroyed up to current timestamp

Follow CLAUDE.md standards:
- Use Palestinian flag colors from theme.ts
- Tailwind CSS only (no custom CSS files)
- Add 5+ tests (Vitest + React Testing Library)
- Performance: useMemo for expensive calculations
- Accessibility: ARIA labels, keyboard controls (space, arrows, home/end)

Let's start with the component structure.
```

**Session 2 Focus:**

```
Continue Phase 1: Connect TimelineScrubber to App.tsx

TASK:
1. Create AnimationContext to manage timeline state globally
2. Wrap App in AnimationProvider
3. Connect TimelineScrubber, HeritageMap, and SitesTable to animation state
4. Add keyboard controls (space for play/pause, arrows to step)
5. Update App.tsx layout to include TimelineScrubber below map

The animation state should include:
- currentTimestamp: Date
- isPlaying: boolean
- speed: 0.5 | 1 | 2 | 4
- play(), pause(), reset(), setTimestamp() methods

Maintain all existing functionality - this should be additive only.
```

---

### Phase 2: Visual States - Glow System (Sessions 3-4)

**Session 3 Starting Prompt:**

```
Starting Phase 2: Implement the "Dimming Gaza" glow system

TASK: Create heritage value calculation utilities

Files to create:
1. src/utils/heritageCalculations.ts
2. src/hooks/useMapGlow.ts

Requirements from spec:
- glowContribution(site) - Calculate heritage value based on age, significance, type
- Age multipliers: Ancient (>2000yr) = 3x, Medieval (>1000yr) = 2x, Historic (>200yr) = 1.5x
- Significance: UNESCO = 2x, artifacts>100 = 1.5x, isUnique = 2x
- Type weights: archaeological = 1.8x, museum/library = 1.6x

Also create:
- getAgeColorCode(site) - Returns Gold/Bronze/Silver/Blue based on age
- calculateTotalHeritageValue(sites) - Sum all glow contributions

Add comprehensive tests for edge cases (BCE dates, missing fields, etc.)

Follow CLAUDE.md performance patterns: useMemo for expensive calculations.
```

**Session 4 Focus:**

```
Continue Phase 2: Create Canvas glow layer overlay

TASK: Create MapGlowLayer.tsx component

This should:
1. Render Canvas overlay on top of Leaflet map
2. Draw radial gradients for each site based on glowContribution
3. Update in real-time as timeline progresses
4. Use warm golden glow (#FFD700) that fades to grey (#6B7280) when destroyed
5. Use requestAnimationFrame for smooth 60fps rendering
6. Clean up animation frames on unmount

Canvas positioning:
- Must overlay Leaflet map correctly (z-index: 400)
- pointerEvents: 'none' to allow map interactions
- Resize canvas when map viewport changes

Performance critical:
- Pre-calculate glow contributions (useMemo)
- Only render visible sites (check map bounds)
- Target 60fps (monitor with performance.now())

Add tests for canvas rendering and performance benchmarks.
```

---

### Phase 3: Destruction Animations (Sessions 5-6)

**Session 5 Starting Prompt:**

```
Starting Phase 3: Implement destruction mode animations

TASK: Create MarkerAnimations.tsx component system

Implement 4 animation types:

1. DESTROYED - "Explode" animation
   - Red (#B91C1C) → Grey (#6B7280)
   - Burst outward effect, fade to grey
   - Duration: 800ms, easing: ease-out

2. LOOTED - "Drain" animation
   - Purple (#9333EA) → Grey with hollow center
   - Particle trail flows from marker off map (20-30 particles)
   - Duration: 1200ms, easing: ease-in
   - Marker becomes donut shape (hollow)

3. HEAVILY-DAMAGED - "Crack" animation
   - Orange (#D97706) → Muted (#9CA3AF)
   - Fracture lines appear, marker splits
   - Duration: 600ms, easing: ease-in-out

4. DAMAGED - "Shake" animation
   - Yellow (#CA8A04) → Muted (#D1D5DB)
   - Tremor/vibration effect
   - Duration: 400ms, easing: ease-out

Use CSS animations or Framer Motion (if we add it).
Add comprehensive tests for each animation type.

Performance: Use object pooling for particles (create pool in useMemo).
```

**Session 6 Focus:**

```
Continue Phase 3: Integrate animations with timeline

TASK: Connect MarkerAnimations to TimelineScrubber state

When timeline reaches a site's destructionDate:
1. Trigger appropriate animation based on destructionMode
2. Update marker visual state (color, shape)
3. Remove/reduce glow contribution from MapGlowLayer
4. Sync across Timeline ↔ Map ↔ Table highlighting

Handle edge cases:
- Scrubbing backward (should "un-destroy" sites visually)
- Fast scrubbing (skip animations, just update state)
- Pause during animation (should complete current animation)

Add integration tests for full animation cycle.
Performance: Lazy load animations (only animate visible markers).
```

---

### Phase 4: Metrics Dashboard (Session 7)

**Session 7 Starting Prompt:**

```
Starting Phase 4: Create real-time Heritage Integrity Dashboard

TASK: Create HeritageMetricsDashboard.tsx component

Display metrics that update in real-time with timeline:

┌─────────────────────────────────────────────────┐
│ Heritage Integrity: ████████░░░░░░░░ 77%       │
│ Sites Destroyed: 23 of 104                      │
│ Artifacts Lost: ~4,500 (estimated)              │
│ Cultural Span Affected: 3,000+ years            │
│ Timeline: Oct 7, 2023 → [Current Position]     │
└─────────────────────────────────────────────────┘

Calculation logic:
- integrity % = (totalHeritageValue - destroyedValue) / totalHeritageValue
- Use glowContribution to weight site importance
- Count artifacts from all destroyed sites
- Show oldest destroyed site's age

Features:
- Progress bar that fills with grey as heritage destroyed
- Count-up animations when numbers change
- Style to match Palestinian flag theme
- Positioned above map (does not block controls)

Add tests for metric calculations and real-time updates.
Follow CLAUDE.md: Use Palestinian flag colors, Tailwind only.
```

---

### Phase 5: Polish & Testing (Session 8+)

**Session 8 Starting Prompt:**

```
Starting Phase 5: Performance optimization and mobile support

TASK: Optimize and polish timeline animation feature

Performance optimizations:
1. Profile with Chrome DevTools Performance tab
2. Ensure 60fps on desktop, 30fps acceptable on mobile
3. Reduce particle count on mobile (detect with window.innerWidth)
4. Throttle timeline updates (no more than 60fps)
5. Implement lazy loading for off-screen markers

Mobile adaptations:
- Touch-friendly scrubber (larger hit area)
- Simplified animations (fewer particles)
- Reduced glow complexity
- Stack timeline controls vertically if needed

Accessibility:
- Add prefers-reduced-motion support (disable animations)
- Ensure keyboard navigation works (space, arrows, home/end)
- Add ARIA live regions for screen readers
- Test with VoiceOver/NVDA

Cross-browser testing:
- Chrome, Firefox, Safari, Edge
- iOS Safari, Chrome Android

Run full test suite: npm test (all 99+ tests must pass)
```

---

## Common Prompts for Any Session

### When Claude Code Suggests Wrong Approach

```
⚠️ This violates CLAUDE.md standards:
[Specific rule violated, e.g. "Using custom CSS file instead of Tailwind"]

From CLAUDE.md section [X]:
[Quote the specific rule]

Please revise to follow this pattern instead:
[Show correct approach from CLAUDE.md]
```

### Request Code Review

```
Please review this code against CLAUDE.md standards:
- Palestinian flag colors used correctly? (#ed3039, #009639, #000000, #fefefe)
- Performance patterns followed? (useMemo, useCallback, cleanup)
- Accessibility included? (ARIA labels, keyboard nav)
- Tests added? (minimum 5 per component)
- Tailwind only? (no custom CSS)
```

### Add Tests

```
Add comprehensive tests for [ComponentName]:

Minimum 5 tests covering:
1. Smoke test - Renders without crashing
2. User interaction - [specific interaction]
3. Edge cases - [null values, BCE dates, empty arrays, etc.]
4. Accessibility - ARIA labels present, keyboard nav works
5. Integration - Works with AnimationContext

Use Vitest + React Testing Library.
Follow existing test patterns in src/__tests__/
```

### Performance Issue

```
This component is running slow (below 60fps).

Profile with performance.now() and optimize:
1. Are expensive calculations memoized? (useMemo)
2. Are callbacks stable? (useCallback)
3. Are we re-rendering too often? (React.memo)
4. Are animation frames cleaned up? (cancelAnimationFrame)
5. Are we rendering off-screen elements? (lazy load visible only)

Target: 60fps on desktop, 30fps on mobile.
```

### Debugging Help

```
Getting error: [paste error message]

Context:
- Component: [ComponentName]
- What I'm trying to do: [description]
- What happens instead: [actual behavior]

Relevant code: [paste minimal reproduction]

Please help debug following CLAUDE.md patterns.
```

---

## Quality Checklist (Before Each Commit)

### Code Quality

- [ ] Palestinian flag colors used (#ed3039, #009639, #000000, #fefefe)
- [ ] Tailwind classes only (no custom CSS files)
- [ ] Performance patterns applied (useMemo, useCallback, cleanup)
- [ ] Leaflet coordinate format correct ([lat, lng])
- [ ] Z-index correct for overlays (z-[9999] for dropdowns)

### Testing

- [ ] 5+ tests added for new components
- [ ] All tests pass: `npm test`
- [ ] No console errors/warnings
- [ ] Linter clean: `npm run lint`

### Functionality

- [ ] Visual verification in dev server: `npm run dev`
- [ ] Existing features still work (map, table, filters)
- [ ] Site highlighting syncs (Timeline ↔ Map ↔ Table)
- [ ] Mobile responsive (test at 375px width)
- [ ] Keyboard navigation works

### Accessibility

- [ ] ARIA labels on interactive elements
- [ ] Keyboard controls work (space, arrows, home/end)
- [ ] Screen reader friendly (test with dev tools)
- [ ] Color contrast meets WCAG AA

### Performance

- [ ] Desktop: 60fps during animation (check with DevTools)
- [ ] Mobile: 30fps acceptable with reduced effects
- [ ] No memory leaks (animation frames cleaned up)
- [ ] Lazy loading for off-screen elements

### Commit

```bash
# Run quality gates
npm run lint && npm test

# If all pass, commit with conventional format
git add .
git commit -m "feat(timeline): implement [specific feature]"

# Examples:
git commit -m "feat(timeline): add D3 scrubber with play/pause controls"
git commit -m "feat(timeline): implement canvas glow layer"
git commit -m "feat(timeline): add destruction mode animations"
git commit -m "feat(metrics): create heritage integrity dashboard"
```

---

## Troubleshooting Common Issues

### D3.js Not Rendering

```
Check:
1. Is D3 imported correctly? import * as d3 from 'd3';
2. Is ref attached to DOM element? <svg ref={svgRef}>
3. Is width/height set? (D3 won't render in 0x0 container)
4. Are scales defined correctly? scaleTime().domain(...).range(...)
```

### Canvas Not Visible on Map

```
Check:
1. Z-index correct? (z-index: 400 for Leaflet pane)
2. Canvas sized correctly? Match map container width/height
3. Positioned absolutely? position: absolute; top: 0; left: 0;
4. Drawing context valid? const ctx = canvas.getContext('2d');
```

### Animation Frames Not Cleaning Up

```
Always use this pattern:
useEffect(() => {
  let frameId: number;
  const animate = () => {
    // animation code
    frameId = requestAnimationFrame(animate);
  };
  animate();
  return () => cancelAnimationFrame(frameId); // CRITICAL
}, [dependencies]);
```

### Performance Below 60fps

```
Debug with:
const start = performance.now();
// ... code ...
const end = performance.now();
console.log(`Frame time: ${end - start}ms (target: <16.67ms)`);

Common fixes:
- Memoize expensive calculations
- Reduce particle count
- Lazy load off-screen elements
- Use Canvas instead of SVG for many elements
```

---

## Reference Links

**Project Documentation:**

- CLAUDE.md - Complete project standards
- docs/timeline-animation-spec.md - Feature specification
- src/styles/theme.ts - Color palette

**External Resources:**

- D3.js Time Scales: https://d3js.org/d3-scale/time
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- Leaflet Custom Layers: https://leafletjs.com/examples/extending/extending-1-layers.html
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/

**Palestinian Flag Colors:**

- Red: #ed3039
- Green: #009639
- Black: #000000
- White: #fefefe

---

## Session Tracking

Track progress as you complete each phase:

**Phase 1: Timeline Foundation**

- [ ] Session 1: TimelineScrubber component created
- [ ] Session 2: AnimationContext connected to App

**Phase 2: Visual States**

- [ ] Session 3: Heritage calculations implemented
- [ ] Session 4: Canvas glow layer working

**Phase 3: Animations**

- [ ] Session 5: Destruction animations created
- [ ] Session 6: Animations integrated with timeline

**Phase 4: Metrics**

- [ ] Session 7: Dashboard showing real-time metrics

**Phase 5: Polish**

- [ ] Session 8+: Performance optimized, mobile working, tests passing

---

**Last Updated:** October 14, 2025
**Status:** Ready for Phase 1 implementation
