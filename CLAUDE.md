# CLAUDE.md - Heritage Tracker

AI assistant guidance for developing Heritage Tracker.

## Communication Preferences

**⚠️ IMPORTANT:** Do not provide unprompted summaries after completing work. Only summarize when explicitly asked by the user.

## Quick Navigation

- [Project Overview](#project-overview) - Mission and current state
- [Development Commands](#development-commands) - Essential commands
- [Critical Rules](#critical-rules) - Git workflow and quality gates
- [Architecture](#architecture) - File structure and patterns
- [Component Patterns](#component-patterns) - Key component implementations
- [Data & Filtering](#data--filtering) - Schema and filter patterns
- [Testing & Performance](#testing--performance) - Standards and optimization
- [Timeline Animation Feature](#timeline-animation-feature) - **NEW** - Interactive timeline system
- [Known Issues](#known-issues) - Common pitfalls and solutions

## Project Overview

**Heritage Tracker** documents Palestinian cultural heritage destruction in Gaza (2023-2024 MVP scope).

**Mission:** Evidence-based documentation with verified sources for every claim.

**Status:** 🚀 **LIVE IN PRODUCTION** - https://yupitsleen.github.io/HeritageTracker/

**Current:** 18 of 20-25 MVP sites documented | 99 tests passing | CI/CD deployed

**Tech Stack:** React 19 + TypeScript + Vite 7 + Tailwind v4 + Leaflet + D3.js

**Data Sources:** UNESCO, Forensic Architecture, Heritage for Peace

## Development Commands

```bash
npm run dev     # Dev server (localhost:5173) - keep running
npm test        # Run 99 tests - must pass before commit
npm run lint    # Code quality check
npm run build   # Production build
```

## Critical Rules

### Git Workflow

```bash
# ✅ Conventional commits
git commit -m "feat: add new filter option"
git commit -m "fix: resolve sorting bug"

# ❌ Avoid
git commit -m "updates"
git commit -m "changes with Claude"

# Before EVERY commit:
npm run lint && npm test
```

### Quality Gates

- ✅ All tests must pass (99 existing + new timeline tests)
- ✅ Linter must be clean
- ✅ Dev server running for visual verification
- ✅ Follow DRY/KISS/SOLID principles
- ✅ 60fps minimum for animations

### Content Attribution

- Site descriptions are **original syntheses** from multiple verified sources
- Factual data (dates, coordinates) cross-referenced against multiple sources
- Research assistance by Claude (Anthropic) is disclosed in About page
- All claims have source citations

## Architecture

### Layout

**Desktop (Current):** Timeline (left, 440px) | Map (center, sticky) | Table (right, 480px)

**Desktop (Future - Timeline Feature):** Map (center-left, expanded) + Timeline Scrubber (below map) | Table (right, expanded)

**Mobile:** FilterBar → Accordion Table (Type column removed)

### File Structure

```
src/
├── components/
│   ├── FilterBar/FilterBar.tsx        # Compact filters (text-[10px])
│   ├── SitesTable.tsx                 # 3 variants: compact/expanded/mobile
│   ├── Timeline/
│   │   ├── VerticalTimeline.tsx       # CURRENT - Left sidebar (will be deprecated)
│   │   ├── TimelineScrubber.tsx       # NEW - D3 horizontal timeline
│   │   └── AnimationController.tsx    # NEW - Play/pause/speed controls
│   ├── Map/
│   │   ├── HeritageMap.tsx            # Leaflet map
│   │   ├── MapGlowLayer.tsx           # NEW - Canvas ambient glow overlay
│   │   └── MarkerAnimations.tsx       # NEW - Destruction animations
│   ├── Metrics/
│   │   └── HeritageMetricsDashboard.tsx # NEW - Real-time stats
│   ├── Stats/StatsDashboard.tsx       # Statistics modal
│   ├── About/About.tsx                # About/Research modal
│   └── Modal/Modal.tsx                # Reusable modal
├── hooks/
│   ├── useTimelineAnimation.ts        # NEW - Animation state management
│   └── useMapGlow.ts                  # NEW - Glow effect calculations
├── utils/
│   ├── siteFilters.ts                 # Filter logic + BCE parsing
│   ├── format.ts                      # Formatting utilities
│   ├── heritageCalculations.ts        # NEW - Glow contribution formulas
│   └── animationHelpers.ts            # NEW - Animation timing/easing
├── constants/
│   ├── filters.ts                     # SITE_TYPES, STATUS_OPTIONS
│   └── map.ts                         # Map config (marker sizes)
├── styles/theme.ts                    # Centralized Palestinian flag theme
└── data/mockSites.ts                  # 18 sites (static JSON)
```

### Key Patterns

- **Centralized theme** - All colors/styles in `theme.ts`
- **Component extraction** - Reuse at 3+ instances
- **Static data** - JSON files (no database for MVP)
- **JIT development** - Incremental, verify in browser
- **Performance-first** - Canvas for heavy rendering, memoization for expensive calculations

## Component Patterns

### FilterBar

**Features:**

- Desktop: Inline search, BC/BCE dropdowns, date ranges (text-[10px])
- Mobile: Full-width search, hidden Type/Status filters
- Default end dates: Current date (Destroyed), Current year (Built)
- Layout stability: Reserved space for count badges, always-visible Clear button

**BC/BCE Handling:**

```tsx
// ✅ Use dropdown + number input
<input type="number" value={yearInput} />
<select value={yearEra}>
  <option value="CE">CE</option>
  <option value="BCE">BCE</option>
</select>

// Internal: BCE → negative, CE → positive
// 800 BCE → -800, 425 CE → 425
```

### SitesTable

**Variants:**

- `compact` - Desktop sidebar (Name, Status, Date, Actions)
- `expanded` - Modal (all fields, CSV export)
- `mobile` - Accordion (Type column removed)

**CSV Export:**

- RFC 4180 compliant escaping
- Arabic names, Islamic dates, coordinates
- Timestamped: `heritage-tracker-sites-YYYY-MM-DD.csv`

**Interaction:**

- Desktop: Row click → highlight only
- Mobile: Accordion expand/collapse
- "See more" → `e.stopPropagation()`

**Highlighting:**

- `ring-2 ring-black ring-inset`
- Syncs: Timeline ↔ Map ↔ Table via `highlightedSiteId`

### MultiSelectDropdown

**Fixed positioning above map:**

```tsx
<div className="fixed z-[9999]" style={{
  top: ref.current?.getBoundingClientRect().bottom + 8,
  left: ref.current?.getBoundingClientRect().left
}}>
```

**Close on outside click:**

```tsx
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };
  if (isOpen) document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [isOpen]);
```

## Data & Filtering

### Data Schema

```typescript
interface GazaSite {
  id: string;
  type: "mosque" | "church" | "archaeological" | "museum" | "historic-building";
  name: string;
  nameArabic?: string;
  yearBuilt: string; // "7th century", "800 BCE", "1950"
  yearBuiltIslamic?: string;
  coordinates: [number, number]; // [lat, lng] - Leaflet format
  status: "destroyed" | "heavily-damaged" | "damaged";
  dateDestroyed?: string; // ISO: "2023-12-07"
  dateDestroyedIslamic?: string;
  description: string;
  historicalSignificance: string;
  culturalValue: string;
  sources: Source[];
  verifiedBy: string[];
  images?: { before?: string; after?: string; satellite?: string };

  // NEW - Timeline animation enhancements
  destructionMode?: "destroyed" | "looted" | "heavily-damaged" | "damaged";
  artifactCount?: number;
  unescoListed?: boolean;
  isUnique?: boolean; // Only one of its kind in Gaza
  religiousSignificance?: boolean;
  communityGatheringPlace?: boolean;
  historicalEvents?: string[];
  touristVisitsPerYear?: number;
}
```

### Year Parsing (`parseYearBuilt`)

- "800 BCE" → -800
- "7th century" → 650 (midpoint: `(7-1)*100 + 50`)
- "800 BCE - 1100 CE" → -800 (first year)
- "1950" → 1950

### Filter Patterns

- **Date ranges** - Always start/end pairs
- **Stable UI** - min-width prevents layout shift
- **Local state** - Prevents clearing during typing
- **Z-index** - `z-[9999]` for dropdowns above Leaflet

## Testing & Performance

### Testing Standards

- **Framework:** Vitest + React Testing Library
- **Coverage:** 99+ tests across 11+ files
- **Types:** Smoke tests + edge cases (BCE, null values, mobile)
- **Minimum:** 5+ tests per new component
- **Run:** Before every commit
- **Timeline tests:** Animation state, glow calculations, performance benchmarks

### Performance Patterns

```tsx
// ✅ Memoization
const sortedSites = useMemo(() => [...sites].sort(), [sites, sortKey]);

// ✅ Callbacks
const handleClick = useCallback(() => {...}, [deps]);

// ✅ Memo for heavy components
export const HeavyComponent = React.memo(({data}) => {...});

// ✅ Animation frame cleanup
useEffect(() => {
  const frameId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(frameId);
}, [deps]);

// ✅ Canvas rendering (for glow effects)
// Better performance than SVG for continuous animations
```

### Performance Requirements

- **Desktop:** 60fps minimum during timeline animation
- **Mobile:** 30fps acceptable (reduced particle effects)
- **Initial load:** <3s on 3G connection
- **Animation latency:** <100ms response to scrubbing

## Timeline Animation Feature

**Status:** 🚧 Planning phase → Implementation starting

**Spec Document:** `docs/timeline-animation-spec.md`

**Goal:** Replace static timeline sidebar with interactive animated scrubber that visualizes heritage destruction over time.

### Core Concept: "Dimming Gaza"

As destruction occurs chronologically, the map visually "dims" - representing the extinguishing of cultural heritage and collective memory.

**Visual Metaphor:**

- Gaza starts with warm, golden ambient glow over heritage-rich areas
- Each destroyed site removes its "glow contribution"
- Map progressively darkens/cools: Gold (#FFD700) → Grey (#6B7280)
- End state: Gaza looks darker, emptier - visual metaphor for cultural death

### Architecture Changes

**Remove:**

- Left sidebar VerticalTimeline (440px) - will be deprecated

**Add:**

- Horizontal TimelineScrubber below map (D3.js-based)
- Canvas MapGlowLayer overlay on map (ambient heritage glow)
- HeritageMetricsDashboard above map (real-time stats)
- MarkerAnimations system (destruction mode animations)

**Expand:**

- Map column (center-left, larger viewport)
- Table column (right, expanded from 480px to ~600px)

### New Components Structure

```
src/
├── components/
│   ├── Timeline/
│   │   ├── TimelineScrubber.tsx       # NEW - D3 horizontal timeline with scrubber
│   │   ├── AnimationController.tsx    # NEW - Play/pause/speed/reset controls
│   │   └── VerticalTimeline.tsx       # DEPRECATED - will be removed Phase 5
│   ├── Map/
│   │   ├── HeritageMap.tsx            # EXISTING - Leaflet map
│   │   ├── MapGlowLayer.tsx           # NEW - Canvas ambient glow effect
│   │   └── MarkerAnimations.tsx       # NEW - Destruction animations
│   ├── Metrics/
│   │   └── HeritageMetricsDashboard.tsx # NEW - Heritage integrity meter + stats
├── hooks/
│   ├── useTimelineAnimation.ts        # NEW - Animation state (play/pause/speed)
│   └── useMapGlow.ts                  # NEW - Glow contribution calculations
├── utils/
│   ├── heritageCalculations.ts        # NEW - Site value/glow formulas
│   └── animationHelpers.ts            # NEW - Easing functions, timing
└── contexts/
    └── AnimationContext.tsx           # NEW - Global animation state
```

### Animation Design System

#### Glow Contribution Formula

Each site contributes to the map's ambient glow based on heritage value:

```typescript
const glowContribution = (site: GazaSite): number => {
  let weight = 100; // Base value

  // Age factor (older = more weight)
  const age = 2024 - (site.creationYear || 0);
  if (age > 2000) weight *= 3; // Ancient (Bronze Age, Roman, Byzantine)
  else if (age > 1000) weight *= 2; // Medieval (Islamic Golden Age)
  else if (age > 200) weight *= 1.5; // Ottoman/Historic

  // Significance multipliers
  if (site.unescoListed) weight *= 2;
  if (site.artifactCount && site.artifactCount > 100) weight *= 1.5;
  if (site.type === "archaeological-site") weight *= 1.8;
  if (site.type === "museum" || site.type === "library") weight *= 1.6;
  if (site.isUnique) weight *= 2;

  return weight;
};
```

#### Marker Visual States

**Before Destruction (Age-based colors):**

- Ancient (>2000 years): Gold `#FFD700`
- Medieval (500-2000 years): Bronze `#CD7F32`
- Ottoman/Historic (200-500 years): Silver `#C0C0C0`
- Modern (<200 years): Blue `#4A90E2`

**Size by Significance:**

```typescript
const markerRadius = Math.sqrt(significanceScore(site)) * 2;
```

#### Destruction Mode Animations

**1. Destroyed (Complete Loss)**

- Color: Red `#B91C1C` → Grey `#6B7280`
- Animation: "Explode" - burst outward effect, fade to grey
- Duration: 800ms
- Glow: Remove 100% contribution
- Easing: ease-out

**2. Looted (Cultural Theft)**

- Color: Purple `#9333EA` → Grey with hollow center
- Animation: "Drain" - particle trail flows from marker off map
- Particle count: 20-30 dots that fade as they move
- Duration: 1200ms
- Marker becomes "hollow" (donut shape vs solid circle)
- Glow: Remove 100% contribution
- Easing: ease-in

**3. Heavily Damaged**

- Color: Orange `#D97706` → Muted grey-orange `#9CA3AF`
- Animation: "Crack" - fracture lines appear, marker splits
- Duration: 600ms
- Glow: Remove 50% contribution
- Easing: ease-in-out

**4. Damaged**

- Color: Yellow `#CA8A04` → Muted grey-yellow `#D1D5DB`
- Animation: "Shake" - tremor/vibration effect
- Duration: 400ms
- Glow: Remove 25% contribution
- Easing: ease-out

### Heritage Integrity Metrics

**Dashboard displays (real-time updates):**

```
┌─────────────────────────────────────────────────┐
│ Heritage Integrity: ████████░░░░░░░░ 77%       │
│ Sites Destroyed: 23 of 104                      │
│ Artifacts Lost: ~4,500 (estimated)              │
│ Cultural Span Affected: 3,000+ years            │
│ Timeline: Oct 7, 2023 → Dec 15, 2023 (current) │
└─────────────────────────────────────────────────┘
```

**Calculation:**

```typescript
const heritageMetrics = (currentTimestamp: Date) => {
  const destroyedUpToNow = sites.filter(
    (s) => s.destructionDate && s.destructionDate <= currentTimestamp
  );

  const totalValue = sites.reduce((sum, s) => sum + glowContribution(s), 0);
  const destroyedValue = destroyedUpToNow.reduce((sum, s) => sum + glowContribution(s), 0);

  return {
    integrityPercent: Math.round(((totalValue - destroyedValue) / totalValue) * 100),
    sitesDestroyed: destroyedUpToNow.length,
    totalSites: sites.length,
    artifactsLost: destroyedUpToNow.reduce((sum, s) => sum + (s.artifactCount || 0), 0),
    oldestSiteDestroyed: Math.min(...destroyedUpToNow.map((s) => s.creationYear || 2024)),
  };
};
```

### Timeline Scrubber Controls

**UI Elements:**

- Date axis: Oct 7, 2023 → Present (using D3.js time scale)
- Draggable scrubber handle
- Event markers (dots) at each destruction date
- Play/Pause button (▶/❚❚)
- Reset button (↻)
- Speed control dropdown (0.5x, 1x, 2x, 4x)
- Current date display

**Keyboard Controls:**

- Space: Play/Pause
- Arrow Left/Right: Step backward/forward by day
- Home/End: Jump to start/end
- +/- : Increase/decrease speed

### Implementation Phases

**Phase 1 (Sessions 1-2): Timeline Foundation**

- [ ] Create TimelineScrubber component with D3.js
- [ ] Add play/pause/scrub functionality
- [ ] Connect timeline to map filtering
- [ ] Remove old VerticalTimeline from layout
- [ ] Tests: Scrubbing, play/pause, keyboard controls

**Phase 2 (Sessions 3-4): Visual States**

- [ ] Implement Canvas MapGlowLayer
- [ ] Calculate glow contributions for all sites
- [ ] Add marker color coding by age
- [ ] Implement grey-out transitions
- [ ] Tests: Glow calculations, color transitions

**Phase 3 (Sessions 5-6): Animations**

- [ ] Build destruction animations (explode, crack, shake)
- [ ] Implement looting particle system with trails
- [ ] Add transition timing and easing
- [ ] Performance optimization (60fps target)
- [ ] Tests: Animation completion, particle cleanup

**Phase 4 (Session 7): Metrics Dashboard**

- [ ] Create HeritageMetricsDashboard component
- [ ] Implement real-time metric calculations
- [ ] Add count-up animations for numbers
- [ ] Style to match Palestinian flag theme
- [ ] Tests: Metric accuracy, update timing

**Phase 5 (Session 8+): Polish & Testing**

- [ ] Performance optimization (Canvas rendering, memoization)
- [ ] Mobile responsiveness (reduced particles, touch controls)
- [ ] Accessibility (keyboard nav, ARIA labels, screen reader)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Remove deprecated VerticalTimeline
- [ ] Integration tests: Full animation cycle

### Technical Dependencies

**New packages to install:**

```bash
npm install d3 d3-scale
npm install --save-dev @types/d3 @types/d3-scale
```

**Libraries:**

- D3.js v7.8.5 - Timeline axis, scales, event handling
- D3-scale v4.0.2 - Time scales for date mapping
- Canvas API - Glow effects and particle systems (native)

### Performance Patterns for Timeline

```tsx
// ✅ Pre-calculate glow contributions (expensive)
const glowContributions = useMemo(
  () => sites.map((s) => ({ id: s.id, glow: glowContribution(s) })),
  [sites]
);

// ✅ Throttle timeline updates to 60fps
const throttledUpdate = useCallback(
  throttle((timestamp: Date) => {
    updateMapState(timestamp);
  }, 16), // ~60fps
  []
);

// ✅ Canvas rendering loop with RAF
useEffect(() => {
  let frameId: number;
  const renderGlow = () => {
    drawGlowLayer(ctx, currentSites, glowContributions);
    frameId = requestAnimationFrame(renderGlow);
  };
  renderGlow();
  return () => cancelAnimationFrame(frameId);
}, [currentSites, glowContributions]);

// ✅ Lazy load animations
const visibleMarkers = useMemo(
  () => markers.filter((m) => mapBounds.contains(m.coordinates)),
  [markers, mapBounds]
);

// ✅ Object pooling for particles
const particlePool = useMemo(() => createParticlePool(100), []);
```

### Critical Constraints

**MUST maintain:**

- ✅ Palestinian flag colors (#ed3039, #009639, #000000, #fefefe)
- ✅ All existing tests passing (99 + new timeline tests)
- ✅ 60fps animation performance on desktop
- ✅ Mobile responsiveness (30fps acceptable with reduced effects)
- ✅ Leaflet coordinate format `[lat, lng]`
- ✅ Tailwind-only styling (no custom CSS files)
- ✅ Site highlight syncing (Timeline ↔ Map ↔ Table)

**MUST NOT:**

- ❌ Break existing map interactions (zoom, pan, click)
- ❌ Impact table/filter functionality
- ❌ Degrade performance below 30fps on mobile
- ❌ Add external CSS files (Tailwind only)
- ❌ Use localStorage/sessionStorage (not supported in artifacts)

### Testing Requirements for Timeline

**Minimum 15 new tests:**

**TimelineScrubber.tsx (5 tests):**

- Renders with correct date range
- Scrubber updates map on drag
- Play button animates timeline
- Keyboard controls work (space, arrows, home/end)
- Speed control changes animation rate

**AnimationController.tsx (3 tests):**

- Play/pause toggles correctly
- Reset returns to start
- Speed multiplier applies correctly

**MapGlowLayer.tsx (4 tests):**

- Glow calculations are accurate
- Canvas renders without errors
- Glow updates when sites destroyed
- Performance stays above 30fps (benchmark test)

**MarkerAnimations.tsx (3 tests):**

- Destruction modes animate correctly
- Particle systems clean up on unmount
- Looting trails flow off map

**Integration (3+ tests):**

- Full timeline playback completes
- Metrics update in sync with timeline
- Map state matches timeline position

### Known Timeline Gotchas

#### ❌ DO NOT

- Use `Date.now()` for animation timing (use `performance.now()`)
- Forget to cleanup animation frames on unmount
- Animate all markers at once (lazy load visible only)
- Use CSS transforms for particles (use Canvas for performance)
- Create new particle objects each frame (use object pooling)

#### ✅ DO

- Use D3.js `scaleTime()` for date axis
- Handle timezone differences (UTC vs local)
- Throttle timeline updates to 60fps max
- Add touch gesture threshold for mobile scrubbing (prevent accidental drags)
- Pre-calculate expensive operations (glow contributions, significance scores)
- Test on low-end devices (throttle CPU in Chrome DevTools)
- Add reduced-motion media query support

#### Specific Technical Issues

**Canvas Overlay on Leaflet:**

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

**D3 Time Scale with React:**

```tsx
// ✅ Update scale on resize
useEffect(() => {
  const scale = scaleTime().domain([startDate, endDate]).range([0, width]);
  setTimeScale(() => scale); // Function to prevent stale closures
}, [startDate, endDate, width]);
```

**Particle System Performance:**

```tsx
// ✅ Object pooling pattern
const particlePool = useMemo(() => {
  return Array.from({ length: 100 }, () => ({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    active: false,
  }));
}, []);

const activateParticle = (x: number, y: number) => {
  const particle = particlePool.find((p) => !p.active);
  if (particle) {
    particle.x = x;
    particle.y = y;
    particle.active = true;
    // ... set velocity, etc.
  }
};
```

## Known Issues

### ❌ DO NOT

- Use text inputs for BC/BCE dates (parsing fragile)
- Forget `z-[9999]` on dropdowns above map
- Click table rows to open modals (use action column)
- Add hover triggers on table/timeline
- Animate non-visible map markers (performance hit)
- Create new animation frames without cleanup

### ✅ DO

- Number input + dropdown for BC/BCE
- Test filters with empty AND populated state
- Use `e.stopPropagation()` on nested clickables
- Remember Leaflet uses `[lat, lng]` NOT `[lng, lat]`
- Use `useMemo` for expensive sorting/calculations
- Reserve space with min-width to prevent layout shift
- Clean up animation frames in useEffect return
- Pre-calculate glow contributions (memoize)
- Use Canvas for continuous animations (better than SVG)

### Current Limitations

- No validation that end date > start date
- Year parsing assumes CE unless BCE/BC explicit
- Search bar duplicated (mobile/desktop) - intentional for different styling
- Timeline animation requires manual data enrichment (artifactCount, etc.)

## Cultural & Legal Considerations

### Content Standards

- **Documentation, not advocacy** - Factual presentation
- **Full attribution** - Citations for every claim
- **Cultural sensitivity** - Respectful approach to Palestinian heritage
- **Educational purpose** - Fair use for documentation
- **No personal data** - Privacy-focused

### Accessibility

- **WCAG AA compliance** - Keyboard navigation, ARIA labels
- **Bilingual** - English + Arabic (RTL support)
- **Mobile-first** - Responsive design
- **Color contrast** - Palestinian flag colors (dignified, accessible)
- **Reduced motion** - Respect prefers-reduced-motion for animations

### Legal Framework

- 1954 Hague Convention (Protection of Cultural Property in Armed Conflict)
- Rome Statute (ICC) - War crimes related to cultural destruction
- UN Security Council Resolution 2347 (2017) - Destruction of cultural heritage

## Deployment

**Live:** https://yupitsleen.github.io/HeritageTracker/

**CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`)

- Auto-test on push
- Auto-deploy to GitHub Pages on main branch
- Base URL: `/HeritageTracker/`

## Next Steps

**Immediate (MVP completion):**

- [ ] Add 2-7 more sites (reach 20-25 target)
- [ ] SEO optimization (meta tags, structured data)
- [ ] Social media preview cards

**Timeline Animation (In Progress):**

- [ ] Phase 1: Timeline scrubber with D3.js (Sessions 1-2)
- [ ] Phase 2: Canvas glow system (Sessions 3-4)
- [ ] Phase 3: Destruction animations (Sessions 5-6)
- [ ] Phase 4: Metrics dashboard (Session 7)
- [ ] Phase 5: Polish and testing (Session 8+)

**Future phases (Post-animation):**

- [ ] All 110 UNESCO-verified sites
- [ ] Database integration (Supabase)
- [ ] Full Arabic translation
- [ ] Code splitting for performance
- [ ] Export timeline animation as shareable video

---

**Last Updated:** October 14, 2025
**Version:** 1.1.0 (Production + Timeline Feature in Development)
**Status:** 🚀 Live with CI/CD | 18/20-25 sites | 99 tests passing | Timeline animation Phase 1 starting
