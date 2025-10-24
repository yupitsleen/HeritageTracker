"Continue from Phase 3 in docs/UI_REFINEMENT_PROGRESS.md"

# Heritage Tracker

**Documenting the destruction of Palestinian cultural heritage through interactive visualization.**

![Project Status](https://img.shields.io/badge/status-production-brightgreen)
![Tests](https://img.shields.io/badge/tests-1379%20passing-brightgreen)
![Deployment](https://img.shields.io/badge/deployment-live-success)
![PWA](https://img.shields.io/badge/PWA-enabled-blue)
![License](https://img.shields.io/badge/license-TBD-lightgrey)
![Extensibility](https://img.shields.io/badge/extensibility-81.5%25%20complete-blue)

**🌐 Live Site:** https://yupitsleen.github.io/HeritageTracker/

**Currently tracking:** 45 documented heritage sites in Gaza (2023-2024 conflict)

---

## 🎯 Mission

Document and visualize the destruction of Palestinian cultural heritage with evidence-based, publicly accessible data to support transparency, legal advocacy, and preservation efforts.

**Current Status:** 45 heritage sites documented with interactive map, timeline, and filtering capabilities

## 📊 The Context

- **64.7%** of Gaza's cultural heritage destroyed in 6 months (207 of 320 sites)
- **110 sites** officially verified by UNESCO
- **1,700+ years** of history documented

## ✨ Current Features

### ✅ Live in Production

- **Interactive map** with Leaflet (satellite/street toggle, dot markers, centered sticky positioning)
- **Advanced filtering** (type, status, date ranges, BC/BCE handling, deferred application)
- **Timeline visualization** with D3.js (horizontal scrubber, play/pause, speed control)
- **Resizable table** with progressive column display (480px-1100px range)
- **Mobile-optimized** (accordion table, conditional rendering prevents errors)
- **CSV Export** with RFC 4180 compliance (Arabic names, Islamic dates, coordinates)
- **Statistics Dashboard** with impact metrics and Looted Artifacts section
- **About/Methodology Page** with data sources and legal framework
- **Detail modals** with bilingual display (English/Arabic)
- **Cross-component highlighting** (map ↔ timeline ↔ table sync)
- **Accessible UI** with keyboard navigation and ARIA labels
- **Responsive design** with Palestinian flag-inspired theme (red/white striped table rows)
- **PWA support** with offline map tile caching (30-day expiration)
- **Lazy loading** for Map, Timeline, and Modal components
- **Code splitting** (310KB main bundle, 669KB total precached)
- **Performance optimizations** (O(n) algorithms, React.memo, granular D3 imports)
- **CI/CD Pipeline** with automated testing, mobile smoke tests, and bundle monitoring
- **Dark mode support** with system preference detection and manual toggle
- **Advanced Timeline page** with 150+ ESRI Wayback satellite imagery versions (2014-2025)
- **GitHub repository link** in footer for easy access to source code
- **Comprehensive test suite** (1379 tests: 432 UI + 947 registry tests)
- **Extensibility architecture** with 22 registry systems for zero-downtime configuration

### 🚧 In Progress

- SEO optimization (meta tags, structured data)
- Social media preview cards

## 🛠️ Tech Stack

- **React 19** + **TypeScript 5.9** + **Vite 7**
- **Tailwind CSS v4** - Styling with custom Palestinian theme
- **Leaflet** + **Leaflet.heat** - Interactive mapping with heatmap support
- **D3.js** - Timeline visualization with time scales
- **vite-plugin-pwa** + **Workbox** - Progressive Web App with offline support
- **Vitest** - Testing framework (432 tests passing)
- **React Testing Library** - Component testing
- **GitHub Actions** - CI/CD automation with mobile smoke tests and bundle monitoring
- **GitHub Pages** - Production hosting with auto-deployment

## 🔧 Extensibility Architecture

**Status:** 22 of 27 issues complete (81.5%)
**Documentation:** [docs/extensibility-status.md](docs/extensibility-status.md)

Heritage Tracker features a comprehensive **registry pattern** architecture enabling zero-downtime configuration changes:

### 22 Complete Registry Systems

- **Data & Backend (5/5):** Site Type, Site Status, Heritage Value, Destruction Cause, Data Source
- **Map & Visualization (8/8):** Color Theme, Glow Formula, Marker Icon CDN, Marker Size, Map Viewport, Map Tile Layer, Clustering Algo, Filter Preset
- **Timeline & Animation (4/4):** Imagery Period, Wayback Timeline, Timeline Date Range, Frame Rate
- **UI & Polish (5/5):** Sort Config, Export Format, Table Variant, Component Class, Calendar Type

### Key Benefits

- **Type-safe configuration:** Full TypeScript interfaces across all 22 systems
- **i18n support:** English + Arabic labels in all registries
- **Backward compatible:** All existing code continues to work
- **Multi-tenant ready:** Different clients can use different configs
- **Comprehensive tests:** 947 registry tests (average 43 tests per registry)
- **Consistent API:** Same CRUD operations (register, get, update, remove) across all systems

Example registry usage:

```typescript
import { registerSiteType, getAllSiteTypes } from "./config/siteTypes";

// Register new site type dynamically
registerSiteType({
  id: "library",
  label: "Library",
  labelArabic: "مكتبة",
  icon: "📚",
  color: "#9333ea",
});

// All components automatically use the new type
const types = getAllSiteTypes(); // Includes new library type
```

See [docs/extensibility-status.md](docs/extensibility-status.md) for complete details.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone and install
git clone https://github.com/yupitsleen/HeritageTracker.git
cd HeritageTracker
npm install

# Start dev server
npm run dev
# Visit http://localhost:5173
```

### Development Commands

```bash
npm run dev          # Dev server with HMR (localhost:5173)
npm test            # Run test suite (1379 tests: 432 UI + 947 registry)
npm run lint        # ESLint code quality check
npm run build       # Production build (with PWA manifest + service worker)
npm run preview     # Preview production build locally
```

### Deployment

The project automatically deploys to GitHub Pages on every push to `main`:

```bash
git push origin main  # Triggers CI/CD: Tests → Build → Deploy
```

View deployment status: https://github.com/yupitsleen/HeritageTracker/actions

## 📁 Project Structure

### Modular Architecture (Refactored Oct 2025)

```
src/
├── App.tsx                      # Main app (264 lines, was 593)
├── components/
│   ├── Button/                  # Reusable button components
│   │   ├── Button.tsx          # Main button with variants
│   │   └── IconButton.tsx      # Icon-only button (Help, Dark Mode)
│   ├── Layout/                  # App layout components
│   │   ├── AppHeader.tsx       # Header with navigation and dark mode toggle
│   │   ├── AppFooter.tsx       # Footer with GitHub link
│   │   ├── DesktopLayout.tsx   # Desktop: Table + Map + Timeline
│   │   └── MobileLayout.tsx    # Mobile: FilterBar + Accordion
│   ├── AdvancedTimeline/       # Wayback satellite timeline components
│   │   ├── WaybackMap.tsx      # Map with 150+ historical imagery versions
│   │   ├── WaybackSlider.tsx   # Timeline slider with year markers
│   │   └── NavigationControls.tsx  # Play/Pause/Step controls
│   ├── FilterBar/              # Deferred filter application with BC/BCE support
│   ├── Map/                    # Leaflet map with satellite toggle, lazy loaded
│   │   ├── HeritageMap.tsx
│   │   ├── MapGlowLayer.tsx    # Canvas ambient glow effect
│   │   └── StatusLegend.tsx
│   ├── Timeline/               # D3.js horizontal timeline scrubber, lazy loaded
│   │   └── TimelineScrubber.tsx
│   ├── SitesTable/             # ✨ REFACTORED - Modular table variants
│   │   ├── index.tsx           # Router (50 lines, was 540)
│   │   ├── SitesTableMobile.tsx    # Mobile accordion (261 lines)
│   │   └── SitesTableDesktop.tsx   # Desktop table (340 lines)
│   ├── Stats/                  # Statistics dashboard, lazy loaded
│   │   ├── StatsDashboard.tsx  # Main dashboard (550 lines, was 601)
│   │   ├── HeroStatistic.tsx   # Reusable hero stat
│   │   ├── StatCard.tsx        # Reusable stat card
│   │   └── SiteLossExample.tsx # Reusable loss example
│   ├── About/                  # About/Methodology page, lazy loaded
│   ├── SiteDetail/             # Site detail panel, lazy loaded
│   ├── Donate/                 # Donate modal, lazy loaded
│   └── Modal/                  # Reusable modal component
├── contexts/
│   ├── AnimationContext.tsx    # Global animation state (desktop only)
│   ├── ThemeContext.tsx        # Dark mode state with system preference detection
│   ├── WaybackContext.tsx      # Wayback timeline playback state
│   └── CalendarContext.tsx     # Calendar type management
├── hooks/                      # ✨ EXPANDED - Reusable logic hooks
│   ├── useAppState.ts          # Central app state management
│   ├── useFilteredSites.ts     # Site filtering logic
│   ├── useTableResize.ts       # Resizable table logic
│   ├── useHeritageStats.ts     # Statistics calculations
│   ├── useMapGlow.ts           # Glow effect calculations
│   └── useTableSort.tsx        # Table sorting logic
├── data/
│   └── mockSites.ts            # Heritage sites data (45 sites documented)
├── types/
│   └── index.ts                # TypeScript interfaces
├── utils/
│   ├── siteFilters.ts          # Filter logic + BCE parsing
│   ├── format.ts               # Formatting utilities
│   ├── heritageCalculations.ts # Glow contribution formulas
│   ├── csvExport.ts            # ✨ NEW - CSV export utilities
│   ├── classNames.ts           # ✨ NEW - cn() utility function
│   └── colorHelpers.ts         # ✨ NEW - Status color helpers
├── constants/
│   ├── filters.ts              # SITE_TYPES, STATUS_OPTIONS
│   └── map.ts                  # Map configuration
└── styles/
    ├── theme.ts                # Main theme barrel export (16 lines, was 227)
    ├── colors.ts               # ✨ NEW - Palestinian flag palette
    └── components.ts           # ✨ NEW - Component style configs
.github/
└── workflows/
    └── deploy.yml              # CI/CD with mobile tests + bundle monitoring
vite.config.ts                  # Vite config with PWA plugin + code splitting
```

**Architecture Notes:**

- **870 lines** reduced from main components (App, SitesTable, StatsDashboard)
- **7 new hooks** for reusable logic
- **11 new components** for better separation of concerns
- **Modular structure** following SOLID principles
- See [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md) for detailed refactoring documentation

## 📖 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete development context for AI assistants
- **[CODE_REVIEW.md](./CODE_REVIEW.md)** - Refactoring plan and progress tracking
- **[ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md)** - Detailed architecture analysis
- **[extensibility-status.md](./docs/extensibility-status.md)** - ✨ NEW - Registry architecture and Sprint progress
- **[timeline-animation-spec.md](./docs/timeline-animation-spec.md)** - Timeline animation feature spec
- **[Research Study](./docs/research/research-document.md)** - Data sources and legal framework
- **[SOURCES.md](./docs/SOURCES.md)** - Bibliography and citations

## 🗺️ Development Roadmap

### Phase 1: MVP ✅ COMPLETE - LIVE IN PRODUCTION

- [x] Project setup and architecture
- [x] Interactive map implementation with satellite/street toggle
- [x] Timeline visualization (D3.js horizontal scrubber)
- [x] Advanced filtering system with deferred application
- [x] Resizable table with progressive column display
- [x] Detail modals with bilingual support
- [x] Cross-component state management
- [x] Mobile optimization (conditional rendering, accordion table)
- [x] CSV Export functionality (RFC 4180 compliant)
- [x] Statistics dashboard with impact metrics
- [x] About/Methodology page
- [x] **45 Gaza heritage sites documented** ✅
- [x] **Dark mode support** with system preference detection ✅
- [x] **Advanced Timeline page** with 150+ ESRI Wayback imagery versions ✅
- [x] **Extensibility architecture** with 22 registry systems (81.5% complete) ✅
- [x] Comprehensive test suite (1379 tests: 432 UI + 947 registry)
- [x] CI/CD pipeline with mobile tests + bundle monitoring
- [x] **Performance optimizations:** Lazy loading, code splitting, PWA, O(n) algorithms
- [x] **1000+ site scaling validated** with performance regression tests
- [x] **DEPLOYED TO PRODUCTION:** https://yupitsleen.github.io/HeritageTracker/
- [ ] Complete remaining extensibility work (5 issues: i18n + Phase 3+ features)
- [ ] SEO optimization (meta tags, structured data)
- [ ] Social media preview cards

### Phase 2: Expansion (Future)

- [ ] Expand to all 110 UNESCO-verified Gaza sites
- [ ] 70,000 looted books dataset (1948 Nakba)
- [ ] Database integration (Supabase)
- [ ] User contribution system with verification workflow
- [ ] Full Arabic translation with RTL support
- [ ] Resume timeline animation work (destruction animations, metrics dashboard)

### Phase 3: Broader Scope (Future)

- [ ] West Bank heritage sites documentation
- [ ] International museum holdings of Palestinian artifacts
- [ ] Educational resources and curriculum materials
- [ ] Enhanced PWA features (push notifications, background sync)

## 📚 Data Sources & Research Methodology

All sites verified by multiple authoritative sources with full citations:

1. **UNESCO** - Official heritage damage verification
2. **Forensic Architecture** - Satellite imagery and coordinates
3. **Heritage for Peace** - Ground documentation

**Research & Content Attribution:** Site descriptions and historical information are original syntheses created by combining factual data from multiple verified sources. Research assistance provided by Claude (Anthropic). All factual claims (dates, coordinates, artifact counts, destruction dates) are cross-referenced against multiple sources and cited accordingly. Narrative descriptions are original summaries of publicly available information, not direct quotations. See [research documentation](docs/research/research_document.md) for detailed methodology and sources.

## 🤝 Contributing

We welcome contributions! Ways to help:

- **Data Collection:** Verify site information, find additional sources
- **Code:** Check [issues](https://github.com/yupitsleen/HeritageTracker/issues) for tasks
- **Translation:** Help translate to Arabic
- **Testing:** Report bugs or improve test coverage

**Development Standards:**

- Follow existing patterns documented in CLAUDE.md
- Write tests for new features (minimum 5+ tests per component)
- Include mobile-specific tests when applicable
- Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- Ensure all 1379 tests pass before committing
- Run `npm run lint && npm test` before every commit
- All changes automatically tested and deployed via CI/CD
- Mobile smoke tests and bundle size monitoring in CI pipeline

## ⚖️ Legal & Ethical Framework

This is a **documentation and educational project** for cultural heritage preservation:

- All information from publicly available, verified sources
- Full attribution and citations for every claim
- Factual presentation without political advocacy
- Respects cultural sensitivity and Palestinian heritage

## 🌍 Related Projects

- [Forensic Architecture](https://forensic-architecture.org/) - Spatial investigations
- [Syria Heritage Initiative](https://uchicago.edu/shi/) - Syrian heritage documentation
- [Nakba Archive](https://www.nakba-archive.org/) - Palestinian oral history

## 🙏 Acknowledgments

This project builds on documentation by UNESCO, Forensic Architecture, Heritage for Peace, Palestinian Museum, Institute for Palestine Studies, ICOMOS Palestine, and countless researchers documenting Palestinian heritage.

---

**"Cultural heritage belongs to all of humanity. Its destruction is everyone's loss."**

---

_Last updated: October 24, 2025 | Version: 1.16.0-dev | 🚀 Live in Production with PWA | 45 sites documented | 1379 tests passing (432 UI + 947 registry) | Bundle optimized (310KB main, 669KB total) | **Extensibility architecture: 22/27 registry systems (81.5%)** | Performance validated for 1000+ sites | **Production-ready with comprehensive optimizations**_

**Live Site:** https://yupitsleen.github.io/HeritageTracker/

## 📈 Recent Updates

### v1.16.0-dev - Extensibility Architecture (Sprint 4 Complete - Oct 24, 2025)

**Extensibility Progress: 81.5% Complete (22/27 issues)**

**Sprint 4: Remaining Small Issues (6 issues complete)**

- **Timeline Date Range Registry** - Dynamic fallback date configuration (41 tests)
- **Marker Icon CDN Registry** - Configurable icon/shadow URLs (38 tests)
- **Marker Responsive Size Registry** - Breakpoint-based sizing (44 tests)
- **Table Variant Registry** - Column visibility per variant (49 tests)
- **Frame Rate Registry** - FPS-based animation control (45 tests)
- **Component Class Registry** - Tailwind class organization (47 tests)

**Sprint 3: Map/Timeline/UI Registries (6 issues complete)**

- Imagery Period, Wayback Timeline, Color Theme, Glow Formula, Map Viewport, Map Tile Layer (+267 tests)

**Sprint 2: Core Extensibility (6 issues complete)**

- Destruction Cause, Data Source, Clustering, Filter Preset, Sort Config, Export Format (+252 tests)

**Sprint 1: Foundation Registries (4 issues complete)**

- Site Type, Site Status, Heritage Value, Calendar Type (+164 tests)

**Total Impact:**

- **+947 registry tests** across 22 systems
- **1379 total tests** (up from 432)
- **22 registry systems** with consistent CRUD API
- **100% backward compatible** - all existing code continues to work
- **i18n ready** - English + Arabic labels throughout

**What's Left (5 issues):**

- Issue #3: i18n Architecture (requires architectural decisions)
- Issues #4, #9, #22, #25: Animation/glow/metrics (deferred to Phase 3+)

See [docs/extensibility-status.md](docs/extensibility-status.md) for complete details.

---

### v1.15.0 - UI Refinement & Advanced Timeline (Oct 21-23, 2025)

**New Features:**

- **Dark Mode Support**: System preference detection with manual toggle, theme-aware styling throughout
- **Advanced Timeline Page**: 150+ ESRI Wayback satellite imagery versions (2014-2025) with interactive timeline
- **GitHub Link**: Added to footer for easy access to source code
- **Map Sync Feature**: Timeline-synced satellite imagery with dynamic period matching
- **Previous/Next Navigation**: Step through destruction events on Advanced Timeline

**UI Refinements:**

- **Button Redesign**: Professional subtle-to-bold hover aesthetic with sharp corners
- **Contrast Improvements**: Better separation between background and components (bg-gray-600 dark, bg-gray-500 light)
- **Icon Button Component**: Eliminated 28 lines of duplicated code with new reusable component
- **Input Refinement**: Thinner date pickers with reduced padding
- **Header Layout**: Improved visual hierarchy with centered buttons
- **Timeline Polish**: Refined controls, removed redundant text, improved responsive behavior

**Code Quality:**

- **IconButton Refactoring**: Extracted reusable component, eliminated duplication
- **Test Coverage**: Expanded to 432 tests (up from 292)
- **Accessibility**: Proper ARIA labels on all new components
- **Type Safety**: Consistent TypeScript interfaces

### v1.11.0 - Performance Optimizations (Oct 19, 2025)

### Performance Regression Tests (NEW)

- **Added 9 new performance tests** (292 total, up from 283)
- **1000+ site scaling validated**:
  - Filter performance: 0.3-4.4ms for 1000 sites
  - MapMarkers render: 67-195ms for 100 sites
  - Table render: 1826-2275ms for 1000 sites
- **React.memo effectiveness**: Re-renders prevented in 4-11ms
- **Memory leak testing**: 10 mount/unmount cycles validated

### Algorithmic Performance Optimizations

- **MapMarkers O(n²) → O(n)**: Memoized destroyed sites Set
- **React.memo**: HeritageMap and MapMarkers prevent re-renders
- **D3 granular imports**: Tree-shaking optimization (62.29 → 61.46 KiB)
- **useCallback handlers**: Stable filter handler references
- **Build time**: 18.30s → 13.25s (27.6% faster)
- **Code cleanup**: Removed 21+ unnecessary comments

### Code Architecture Refactoring

- **Modular structure:** 870 lines reduced from main components
- **7 new hooks:** Reusable logic (state, filtering, resizing, stats)
- **11 new components:** Better separation of concerns
- **SOLID principles:** Single responsibility per module
- **See:** [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md) for full details

### Component Performance Optimizations

- **Lazy Loading:** Map, Timeline, and Modal components load on-demand
- **Code Splitting:** Main bundle 310KB (89KB gzipped)
- **PWA Support:** Offline functionality with map tile caching
- **Service Worker:** 669KB total assets precached with 30-day tile expiration
- **Progressive Loading:** Intersection Observer for off-screen content
- **StatsDashboard**: 60% fewer mobile DOM nodes

### Bundle Analysis

- Main: 310KB (89KB gzipped)
- React vendor: 12KB (4KB gzipped)
- Map vendor: 161KB (47KB gzipped)
- D3 vendor: 61KB (21KB gzipped) - optimized
- Lazy chunks: ~60KB total
