# CLAUDE.md - Heritage Tracker

AI assistant guidance for developing Heritage Tracker.

## Quick Navigation

- [Project Overview](#project-overview) - Mission and current state
- [Development Commands](#development-commands) - Essential commands
- [Critical Rules](#critical-rules) - Git workflow and quality gates
- [Architecture](#architecture) - File structure and patterns
- [Component Patterns](#component-patterns) - Key component implementations
- [Data & Filtering](#data--filtering) - Schema and filter patterns
- [Testing & Performance](#testing--performance) - Standards and optimization
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

- ✅ All 99 tests must pass
- ✅ Linter must be clean
- ✅ Dev server running for visual verification
- ✅ Follow DRY/KISS/SOLID principles

### Content Attribution

- Site descriptions are **original syntheses** from multiple verified sources
- Factual data (dates, coordinates) cross-referenced against multiple sources
- Research assistance by Claude (Anthropic) is disclosed in About page
- All claims have source citations

## Architecture

### Layout

**Desktop:** Timeline (left, 440px) | Map (center, sticky) | Table (right, 480px)
**Mobile:** FilterBar → Accordion Table (Type column removed)

### File Structure

```
src/
├── components/
│   ├── FilterBar/FilterBar.tsx        # Compact filters (text-[10px])
│   ├── SitesTable.tsx                 # 3 variants: compact/expanded/mobile
│   ├── Timeline/VerticalTimeline.tsx  # D3.js timeline, auto-scroll
│   ├── Map/HeritageMap.tsx            # Leaflet map
│   ├── Stats/StatsDashboard.tsx       # Statistics modal
│   ├── About/About.tsx                # About/Research modal
│   └── Modal/Modal.tsx                # Reusable modal
├── utils/
│   ├── siteFilters.ts                 # Filter logic + BCE parsing
│   └── format.ts                      # Formatting utilities
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
  images?: { before?: string; after?: string; satellite?: string; };
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
- **Coverage:** 99 tests across 11 files
- **Types:** Smoke tests + edge cases (BCE, null values, mobile)
- **Minimum:** 5+ tests per new component
- **Run:** Before every commit

### Performance Patterns

```tsx
// ✅ Memoization
const sortedSites = useMemo(() => [...sites].sort(), [sites, sortKey]);

// ✅ Callbacks
const handleClick = useCallback(() => {...}, [deps]);

// ✅ Memo for heavy components
export const HeavyComponent = React.memo(({data}) => {...});
```

## Known Issues

### ❌ DO NOT

- Use text inputs for BC/BCE dates (parsing fragile)
- Forget `z-[9999]` on dropdowns above map
- Click table rows to open modals (use action column)
- Add hover triggers on table/timeline

### ✅ DO

- Number input + dropdown for BC/BCE
- Test filters with empty AND populated state
- Use `e.stopPropagation()` on nested clickables
- Remember Leaflet uses `[lat, lng]` NOT `[lng, lat]`
- Use `useMemo` for expensive sorting
- Reserve space with min-width to prevent layout shift

### Current Limitations

- No validation that end date > start date
- Year parsing assumes CE unless BCE/BC explicit
- Search bar duplicated (mobile/desktop) - intentional for different styling

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

### Legal Framework

- 1954 Hague Convention
- Rome Statute (ICC)
- UN Security Council Resolution 2347 (2017)

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

**Future phases:**
- [ ] All 110 UNESCO-verified sites
- [ ] Database integration (Supabase)
- [ ] Arabic translation
- [ ] Timeline animation
- [ ] Code splitting for performance

---

**Last Updated:** October 12, 2025
**Version:** 1.0.0 (Production)
**Status:** 🚀 Live with CI/CD | 18/20-25 sites | 99 tests passing
