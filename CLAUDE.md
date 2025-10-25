# CLAUDE.md - Heritage Tracker

**Quick Context Guide for Claude Code when working on Heritage Tracker**

---

## 📍 Quick Navigation

- [Project Overview](#project-overview) - What we're building
- [Quick Reference](#quick-reference) - Commands, stack, current state
- [Critical Rules](#critical-rules) - Git workflow, quality gates
- [Architecture](#architecture) - Structure and patterns
- [Data Schema](#data-schema) - TypeScript interfaces
- [Development Standards](#development-standards) - How we code
- [Important Considerations](#important-considerations) - Legal, cultural, technical

---

## Project Overview

**Heritage Tracker** documents Palestinian cultural heritage destruction through interactive visualization.

**Current Focus:** 20-25 significant Gaza heritage sites destroyed during 2023-2024 conflict

**Mission:**

- Document systematic destruction with evidence
- Visualize temporal and geographic patterns
- Support legal advocacy and repatriation efforts
- Raise public awareness

**Core Principle:** Every claim backed by authoritative sources (UNESCO, Forensic Architecture, Heritage for Peace)

**Target Users:** Researchers, legal advocates, journalists, educators, general public

---

## Quick Reference

### Commands

```bash
npm run dev     # Dev server → http://localhost:5173 (keep running for HMR)
npm test        # Run test suite (1546 tests must pass ✓)
npm run lint    # ESLint + Prettier check
npm run build   # Production build
```

### Tech Stack

- **React 19** + **TypeScript 5.7** + **Vite 7**
- **Tailwind CSS v4** (custom Palestinian flag theme)
- **Leaflet** (interactive maps)
- **D3.js** (timeline visualization)
- **Vitest** (testing - 1546 tests passing)
- **Mock-First Backend Ready** (API layer + mock adapter)

### Current State

- **44 sites** documented (Gaza heritage sites)
- **MVP Phase 1:** Complete ✅
- **Backend Integration:** Complete ✅ (Mock-first approach, ready for C#/.NET API)
- **Features:** Interactive map, timeline, advanced filtering, detail modals, bilingual support, async data loading

### Data Sources

1. **UNESCO** - Official heritage damage verification
2. **Forensic Architecture** - Satellite imagery, coordinates
3. **Heritage for Peace** - Ground documentation

---

## Critical Rules

### Git Workflow

```bash
# Use conventional commits
git commit -m "feat: add BC/BCE date filtering"
git commit -m "fix: resolve timeline hover bug"
git commit -m "refactor: extract StatusBadge component"

# NOT acceptable:
git commit -m "updated stuff"
git commit -m "Add feature with Claude"

# Commit checklist:
# ✓ Feature complete and working
# ✓ Tests pass (npm test)
# ✓ Lint passes (npm run lint)
# ✓ Dev server shows no errors
```

### Quality Gates

1. **Test First** - 1546/1546 tests must pass before commit
2. **Keep Dev Server Running** - Use HMR for instant feedback
3. **DRY/KISS/SOLID** - Review code quality before commit
4. **Smoke Tests** - Quick manual verification (not implementation)

### Session Management

- Keep **CURRENT_SESSION.md** updated throughout development
- Document: phases completed, decisions made, lessons learned
- Track progress toward 20-25 sites goal

---

## Architecture

### File Structure

```
src/
├── api/                    # Backend integration layer ✅ NEW
│   ├── client.ts           # Base HTTP client with error handling
│   ├── sites.ts            # Site API endpoints (CRUD)
│   ├── types.ts            # API response types
│   └── mockAdapter.ts      # Mock functions for development
├── components/
│   ├── FilterBar/          # Multi-select dropdown filters
│   ├── Map/                # Leaflet map with custom zoom
│   ├── Timeline/           # D3.js visualization
│   ├── SiteDetailPanel/    # Modal with bilingual content
│   ├── SiteCards/          # Grid display
│   ├── StatusBadge/        # Reusable status indicator
│   ├── Loading/            # LoadingSpinner component ✅ NEW
│   └── Error/              # ErrorMessage component ✅ NEW
├── hooks/                  # Custom React hooks ✅ NEW
│   ├── useSites.ts         # Fetch all sites with loading/error states
│   └── useSiteById.ts      # Fetch single site by ID
├── data/
│   └── sites.json          # Heritage sites data (44 sites)
├── types/
│   └── index.ts            # TypeScript interfaces
├── utils/
│   ├── constants.ts        # SITE_TYPES, STATUS_OPTIONS, etc.
│   └── formatters.ts       # Date formatting, label utilities
└── App.tsx                 # Main component with state management
```

### State Management Pattern

```typescript
// Data fetching with custom hooks
const { sites, isLoading, error, refetch } = useSites();

// Centralized state in App.tsx
const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
const [filters, setFilters] = useState<FilterState>({
  types: [],
  statuses: [],
  dateRange: { start: null, end: null },
});

// Pass down as props (no Redux/Context for MVP)
```

### Backend Integration Pattern

```typescript
// Environment-based API switching (mock vs real)
// .env.development: VITE_USE_MOCK_API=true
// .env.production: VITE_USE_MOCK_API=false

// In src/api/sites.ts
const shouldUseMockData = () => import.meta.env.VITE_USE_MOCK_API === 'true';

export async function getAllSites() {
  if (shouldUseMockData()) {
    return mockGetAllSites(); // Mock adapter
  }
  return apiClient.get('/sites'); // Real API
}
```

### Component Patterns

**FilterBar:**

- Multi-select dropdown with click-outside closing
- Displays "Showing X of Y sites" count
- Cascading filters: Type/Status → Timeline → Map/Cards

**Map:**

- Custom Ctrl+scroll zoom (preserves page scroll)
- Markers sync with selected site
- Click marker → opens detail modal

**Timeline:**

- D3.js horizontal timeline
- Black outline on selected marker
- Click marker → opens detail modal

**SiteDetailPanel:**

- Accessible modal (Escape, backdrop click, focus trap)
- Bilingual names with RTL Arabic support
- Progressive disclosure: popup → "See More" → modal

---

## Data Schema

```typescript
interface HeritageSite {
  id: string;
  name: string;
  name_ar?: string; // Arabic name (RTL)
  type: SiteType;
  coordinates: [number, number]; // [lat, lng]
  status: SiteStatus;
  dateDestroyed: string; // ISO format or "BCE YYYY"
  dateFounded: string; // ISO format or "BCE YYYY"
  description: string;
  description_ar?: string;
  significance: string;
  sources: Source[];
  images?: Image[];
}

type SiteType = "mosque" | "church" | "archaeological_site" | "museum" | "library" | "monument";

type SiteStatus = "destroyed" | "severely_damaged" | "partially_damaged" | "looted" | "threatened";

interface Source {
  organization: string;
  title: string;
  url: string;
  date: string;
  type: "report" | "article" | "database" | "imagery";
}
```

### BC/BCE Date Handling

```typescript
// Dates can be:
// - Standard ISO: "2023-10-27"
// - BCE dates: "BCE 800" (no month/day)

// Filtering respects era:
// 100 BCE < 50 BCE < 1 CE < 100 CE < 2024 CE
```

---

## Development Standards

### Code Style

- **TypeScript strict mode** - No `any` types
- **Functional components** - Hooks only, no classes
- **Named exports** preferred over default
- **Explicit types** - No implicit any
- **JSDoc comments** for complex logic

### Component Guidelines

- **Extract reusable components** at 3+ uses
- **Props interfaces** in same file as component
- **Keep components under 200 lines** - split if larger
- **Accessibility first** - ARIA labels, keyboard nav, focus management

### Testing Philosophy

- **38 tests must pass** before every commit
- **Smoke tests** for quick verification (not implementation)
- Test file naming: `Component.test.tsx`
- Focus on user behavior, not implementation details

### Performance

- **Lazy load images** in detail panels
- **Memoize expensive calculations** (useMemo)
- **Debounce filters** to avoid excessive re-renders
- **Virtual scrolling** if site list exceeds 50 items (future)

---

## Important Considerations

### Cultural Sensitivity

- **Bilingual support** - English primary, Arabic (RTL) secondary
- **Respectful language** - "destruction" not "damage", "looted" not "lost"
- **Palestinian names** - Use original Arabic names when available
- **Avoid politicization** - Let evidence speak, factual presentation

### Legal & Ethical

- **Evidence-based only** - Every claim sourced
- **Public domain data** - No copyrighted imagery without permission
- **Attribution required** - Credit UNESCO, Forensic Architecture, Heritage for Peace
- **Educational purpose** - Document history, support legal cases
- **No advocacy language** - Stick to facts and verified reports

### Technical Constraints

- **Static site (MVP)** - No backend, no auth, no database
- **Client-side only** - All data in `sites.json`
- **Free tier services** - Leaflet (no API key), D3.js (free)
- **Vercel/Netlify deployment** - Free hosting tiers
- **No ongoing costs** - Sustainable long-term

### Accessibility

- **WCAG 2.1 AA compliance** minimum
- **Keyboard navigation** - Tab, Enter, Escape work everywhere
- **Screen reader support** - ARIA labels, semantic HTML
- **Color contrast** - 4.5:1 minimum ratio
- **Focus indicators** - Clear visible focus states

---

## MVP Feature Checklist

**Phase 1: Complete ✅**

- [x] Interactive map with Leaflet
- [x] Timeline visualization with D3.js
- [x] Advanced filtering (type, status, date range, BC/BCE)
- [x] Detail modals with bilingual support
- [x] Cross-component highlighting/sync
- [x] Accessible keyboard navigation
- [x] Palestinian flag-inspired theme
- [x] 38 passing tests

**Phase 1: Remaining**

- [ ] Complete 20-25 sites data (currently 5/20-25)
- [ ] Historical imagery integration
- [ ] Source citation tooltips
- [ ] Performance optimization (if needed)
- [ ] Final accessibility audit
- [ ] Deploy to production

---

## Recent Code Quality Improvements (October 2025)

### Phase 1: Foundation - COMPLETED ✅

Successfully completed comprehensive code quality refactoring:

**1. Extract Magic Numbers to Constants**
- Created `src/constants/layout.ts` with BREAKPOINTS and Z_INDEX
- Eliminated hardcoded values (768px, 9999 z-index)
- Added 22 comprehensive tests

**2. Consolidate Color Mapping**
- Centralized status colors in `utils/colorHelpers.ts`
- Removed duplicate COLOR_MAP from MapMarkers
- Single source of truth for all status colors

**3. Extract Icon Components**
- Created reusable `InfoIcon`, `CloseIcon`, `ChevronIcon`
- Eliminated duplicate SVG code across components
- Added 22 tests for icon library

**4. Extract FilterLabel Component**
- Created reusable label+tooltip component
- Eliminated 16 lines of duplicate code
- Added 7 tests for FilterLabel

**Impact:**
- ✅ 1464 tests passing (+36 new tests)
- ✅ Production build: 7.34s
- ✅ Zero DRY violations in refactored areas
- ✅ Better maintainability and consistency

### Phase 2: Component Architecture - COMPLETED ✅

Successfully completed major component refactoring focusing on separation of concerns:

**1. Simplify FilterBar Props (14→3)**
- Grouped 14 individual props into 3: `filters`, `onFilterChange`, `sites`
- Updated MobileLayout and HomePage modal to use new interface
- Reduced coupling and prop drilling

**2. Simplify DesktopLayout Props (20→15)**
- Grouped filter display state (5 props → 1 `filters` object)
- Grouped table resize props (4 props → 1 `tableResize` object)
- Cleaner prop passing throughout

**3. Extract Complex Calculations to Hooks**
- Created `useDefaultDateRange` hook (32 lines + 4 tests)
- Created `useDefaultYearRange` hook (47 lines + 5 tests)
- Reduced FilterBar complexity by 55 lines

**4. Break Down SitesTableDesktop (385→148 lines, 61% reduction)**
- Extracted 3 custom hooks:
  - `useTableSort` - Sort logic (95 lines)
  - `useTableScroll` - Scroll behavior (30 lines)
  - `useTableExport` - Export functionality (34 lines)
- Created 4 sub-components:
  - `SortIcon` - Sort indicators (23 lines)
  - `TableHeader` - Column headers (115 lines)
  - `TableRow` - Row rendering (123 lines)
  - `ExportControls` - Export UI (70 lines)

**Impact:**
- ✅ 1473 tests passing (+9 new tests from Phase 2)
- ✅ Production build successful
- ✅ SitesTableDesktop: 385→148 lines (61% reduction)
- ✅ All hooks reusable and independently testable
- ✅ Ready for 1000+ sites with virtual scrolling infrastructure
- ✅ Better adherence to Single Responsibility Principle

### Phase 3: Backend Integration - COMPLETED ✅

Successfully completed mock-first backend integration preparation:

**1. API Layer Foundation**
- Created centralized HTTP client ([src/api/client.ts](src/api/client.ts))
- Built site-specific API endpoints ([src/api/sites.ts](src/api/sites.ts))
- Added comprehensive TypeScript types ([src/api/types.ts](src/api/types.ts))
- Environment-based configuration (dev/prod)

**2. Mock Adapter Implementation**
- Created mock adapter ([src/api/mockAdapter.ts](src/api/mockAdapter.ts)) - MSW alternative
- Simulates realistic network delays (500ms)
- Conditional mocking via `VITE_USE_MOCK_API` environment variable
- Easy swap to real backend (change 1 env variable)

**3. Data Fetching Hooks**
- Created `useSites` hook with loading/error/refetch states
- Created `useSiteById` hook for individual site fetching
- Added 24 comprehensive behavior-focused tests

**4. UI Components**
- Created accessible LoadingSpinner component
- Created ErrorMessage component with retry functionality
- Added 36 tests for loading/error components
- Styled to match Palestinian flag theme

**5. Component Updates**
- Updated HomePage to use async data fetching
- Added loading and error state handling
- Fixed React Hooks rules violations
- All components now use mock adapter

**Impact:**
- ✅ 1546 tests passing (+73 new tests from Phase 3)
- ✅ Production build successful (8.41s)
- ✅ Zero linting errors
- ✅ TypeScript strict mode compliant
- ✅ Complete API contract documented ([API_CONTRACT.md](API_CONTRACT.md))
- ✅ Ready for C#/.NET backend integration

See [BACKEND_INTEGRATION_PLAN.md](BACKEND_INTEGRATION_PLAN.md) for detailed implementation plan.

---

## Lessons Learned

### What Works Well

- **StatusBadge component** - Reusable, consistent styling
- **Centralized constants** - `BREAKPOINTS`, `Z_INDEX` in constants/layout.ts
- **Reusable icon library** - `InfoIcon`, `CloseIcon`, `ChevronIcon` components
- **FilterLabel component** - Consistent filter headers with optional tooltips
- **FilterBar patterns** - Multi-select dropdown is clean UX
- **Cross-component sync** - Shared `selectedSiteId` state works great
- **BC/BCE handling** - Explicit era handling prevents confusion

### Common Pitfalls

- **Date parsing** - Always validate BC/BCE format before filtering
- **Arabic RTL** - Test thoroughly, doesn't always work as expected
- **Filter cascade** - Order matters: Type/Status → Timeline → Map/Cards
- **Leaflet z-index** - Map can overlap modals if not careful
- **Test brittleness** - Focus on behavior, not implementation

### Performance Notes

- **5 sites runs smoothly** - No optimization needed yet
- **20-25 sites** - May need memoization for filters
- **50+ sites** - Consider virtual scrolling for cards
- **100+ sites** - Clustering for map markers

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm test                # Run all tests
npm run lint            # Check code quality

# Git workflow
git status              # Check what changed
git add .               # Stage all changes
git commit -m "feat: X" # Commit with conventional format
git push                # Push to remote

# Debugging
console.log()           # Browser console
debugger;               # Breakpoint in browser
npm test -- --watch     # Run tests in watch mode
```

---

**Last Updated:** October 24, 2025
**Project Status:** MVP Phase 1 - COMPLETE ✅ (44 sites documented)
**Code Quality:** Phase 1-3 refactoring complete (DRY/KISS/SOLID + Backend Integration)
**Test Coverage:** 1546 tests passing
**Backend Status:** Mock-first integration complete, ready for C#/.NET API
**Next Priority:** Backend team implements API per API_CONTRACT.md
