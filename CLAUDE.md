````markdown
# Heritage Tracker - Dev Guide

**Palestinian cultural heritage destruction tracker with interactive visualization**

---

## Quick Start

```bash
npm run dev     # → http://localhost:5173 (keep running)
npm test        # 1569 tests must pass ✓
npm run lint    # ESLint + Prettier
npm run build   # Production build
```
````

**Stack:** React 19 + TypeScript 5.7 + Vite 7 + Tailwind CSS v4 + Leaflet + D3.js + Supabase

**Current:** 44 Gaza sites documented | Production-ready for 1000s of sites

---

## Critical Rules

### Commits (Conventional Format)

```bash
feat: add BC/BCE filtering
fix: resolve timeline hover bug
refactor: extract StatusBadge component
```

**Commit only when:**
✓ MVP working ✓ Tests pass ✓ Lint passes ✓ Dev server clean ✓ Docs updated

### Quality Gates

- 1569/1569 tests pass before commit
- Dev server stays running (HMR for feedback)
- Apply DRY/KISS/SOLID principles
- Check for existing code before creating new components

---

## Architecture

```
src/
├── api/                    # Supabase integration
│   ├── supabaseClient.ts   # Connection
│   ├── sites.ts            # CRUD endpoints
│   └── mockAdapter.ts      # Dev mock data
├── components/
│   ├── FilterBar/          # Multi-select filters (debounced 300ms)
│   ├── Map/                # Leaflet + clustering (50+ sites)
│   ├── Pagination/         # Smart page numbers (50/page)
│   ├── Timeline/           # D3.js visualization
│   ├── SitesTable/         # Virtual scrolling (100+ sites)
│   └── [StatusBadge, Loading, Error, etc.]
├── hooks/
│   ├── useSitesPaginated.ts  # Paginated data fetching
│   ├── useSitesQuery.ts      # React Query caching (5min)
│   └── useDebounce.ts        # Filter debouncing
├── data/sites.json         # 44 sites
├── types/index.ts          # TypeScript interfaces
└── utils/
    ├── constants.ts        # SITE_TYPES, STATUS_OPTIONS
    └── formatters.ts       # Date/label utilities
```

### State Management

```typescript
// Small datasets (<100): Fetch all
const { sites, isLoading, error } = useSites();

// Large datasets (100+): Use pagination
const { sites, pagination, goToPage } = useSitesPaginated(filters, page, 50);

// Production (recommended): React Query caching
const { data, isLoading } = useSitesQuery({ types, page, pageSize: 50 });

// Centralized in App.tsx (no Redux/Context for MVP)
const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
const [filters, setFilters] = useState<FilterState>({ types: [], statuses: [], dateRange });
```

### Backend Pattern

```typescript
// .env.development: VITE_USE_MOCK_API=true
// .env.production: VITE_USE_MOCK_API=false

export async function getAllSites() {
  if (shouldUseMockData()) return mockGetAllSites();
  return apiClient.get("/sites");
}
```

---

## Data Schema

```typescript
interface HeritageSite {
  id: string;
  name: string;
  name_ar?: string; // RTL Arabic
  type: SiteType; // mosque | church | archaeological_site | museum | library | monument
  coordinates: [number, number]; // [lat, lng]
  status: SiteStatus; // destroyed | severely_damaged | partially_damaged | looted | threatened
  dateDestroyed: string; // ISO or "BCE YYYY"
  dateFounded: string;
  description: string;
  description_ar?: string;
  significance: string;
  sources: Source[];
  images?: Image[];
}
```

**BC/BCE dates:** "BCE 800" (no month/day) | Filtering: 100 BCE < 50 BCE < 1 CE < 2024 CE

---

## Scaling (Production-Ready)

| Sites | Optimization                                    |
| ----- | ----------------------------------------------- |
| <50   | Standard rendering                              |
| 50+   | Map clustering (Palestinian flag colors)        |
| 100+  | Virtual scrolling (60 FPS) + Pagination         |
| 1000+ | React Query caching (5min) + Debouncing (300ms) |

**Performance:** 60 FPS scrolling | <2s page load | <500ms filter changes

---

## Development Standards

### Code Style

- TypeScript strict mode (no `any`)
- Functional components + hooks only
- Named exports preferred
- Explicit types + JSDoc for complex logic

### Component Rules

- Extract at 3+ uses
- Keep under 200 lines
- Accessibility first (ARIA, keyboard nav, focus management)
- Check for existing code before creating

### Cultural Sensitivity

- Bilingual: English primary, Arabic (RTL) secondary
- Use Palestinian names (original Arabic when available)
- Evidence-based only (UNESCO, Forensic Architecture, Heritage for Peace)
- Factual language: "destruction" not "damage"

---

## Recent Improvements (Oct 2025)

**Phase 1-4 Complete:** ✅ Code quality (DRY/KISS/SOLID) ✅ Supabase backend ✅ Scaling infrastructure

**Key Changes:**

- Extracted constants (`BREAKPOINTS`, `Z_INDEX`)
- Centralized color mapping
- Reusable icon library (`InfoIcon`, `CloseIcon`, `ChevronIcon`)
- Simplified FilterBar (14→3 props), DesktopLayout (20→15 props)
- Broke down SitesTableDesktop (385→148 lines, 61% reduction)
- Added 4 new statuses: `looted`, `abandoned`, `unknown`, `unharmed`
- Implemented pagination, virtual scrolling, map clustering, debouncing

**Test Coverage:** 1569 tests passing (+36 from scaling implementation)

---

## Important Constraints

- **Supabase:** PostgreSQL + PostGIS ($0-25/mo)
- **Free services:** Leaflet, D3.js (no API keys)
- **WCAG 2.1 AA:** 4.5:1 contrast, keyboard nav, screen readers
- **Legal:** Public domain data only, attribution required, educational purpose

---

**Status:** MVP Phase 1 Complete | 44 sites | Ready for thousands
**Next:** Set up Supabase project (see API_CONTRACT.md)

```

```
