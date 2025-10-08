# CLAUDE.md - Heritage Tracker

This file provides guidance to Claude Code when working on Heritage Tracker.

## Quick Navigation

- [Project Overview](#project-overview) - Mission and purpose
- [Quick Reference](#quick-reference) - Commands and MVP scope
- [Critical Development Rules](#critical-development-rules) - Git workflow and quality gates
- [Project Architecture](#project-architecture) - Structure and patterns
- [Data Schema](#data-schema) - TypeScript interfaces
- [MVP Features](#mvp-features) - What to build
- [Development Preferences](#development-preferences) - Coding standards
- [Important Considerations](#important-considerations) - Legal, cultural, technical

## Project Overview

**Heritage Tracker** documents and visualizes Palestinian cultural heritage destruction, focusing on 20-25 significant Gaza sites (2023-2024).

**Mission:**

- Document systematic destruction of Palestinian heritage
- Visualize scale and patterns over time
- Support repatriation with structured evidence
- Raise public awareness about cultural erasure

**Core Principle:** Evidence-based documentation with clear source citations for every claim.

**Target Audience:** Researchers, legal advocates, journalists, educators, general public

## Quick Reference

**Commands:**

```bash
npm run dev          # Start dev server (keep running)
npm test            # Run tests
npm run lint        # Code quality
npm run build       # Production build
```

**Tech Stack:**

- React 19+ + TypeScript (strict)
- Vite 7+ (build tool)
- Tailwind CSS v4
- Leaflet + React-Leaflet (maps)
- D3.js (timeline)
- Vitest + React Testing Library

**MVP Scope:** 20-25 Gaza heritage sites destroyed 2023-2024

**Data Sources:**

1. UNESCO Official List (110 verified sites)
2. Forensic Architecture (satellite imagery, coordinates)
3. Heritage for Peace (ground documentation)

**Development Mode:**

- Dev server: http://localhost:5173
- Keep server running for instant HMR feedback
- Build incrementally, verify in browser
- Commit when feature complete and working

## Critical Development Rules

### Git Workflow (#memorize)

```bash
# Work on feature branches
git commit -m "feat: add timeline component"
git commit -m "fix: resolve marker clustering"
# NOT: "Add timeline with Claude assistance"

# Commit standards:
# - Imperative mood: "Add", "Fix", "Refactor"
# - Conventional commits format
# - Commit when feature complete and working
# - Run lint + tests before every commit
```

### Quality Gates (#memorize)

- **Always run tests** after each working change
- **No commits without passing tests** - All tests must pass ✓
- **Dev server assumed running** - Hot module replacement active
- **Minimal, focused tests** - Quick verification (<1 second)
- **Code review before commit** - Check DRY/KISS/SOLID principles

### Session Management (#memorize)

- **Maintain CURRENT_SESSION.md** - Update throughout development
- **Track progress** - Phases completed, next priorities
- **Document decisions** - Technical choices, data collection status
- **Lessons learned** - What worked, what to improve

## Project Architecture

### File Structure

```
src/
├── components/          # React components
│   ├── Map/            # HeritageMap, markers
│   ├── Timeline/       # VerticalTimeline (D3.js)
│   ├── FilterBar/
│   │   ├── FilterBar.tsx           # Unified filtering with BC/BCE dropdowns
│   │   ├── FilterBar.test.tsx      # 6 smoke tests
│   │   └── MultiSelectDropdown.tsx # Checkbox-based multi-select (z-9999)
│   ├── SitesTable.tsx  # Sortable table with expand modal
│   ├── SitesTable.test.tsx         # 7 smoke tests
│   ├── SiteCard.tsx    # Legacy component
│   ├── Modal/          # Detail panel modal
│   └── SiteDetail/     # SiteDetailPanel
├── data/               # Static JSON data files
│   └── mockSites.ts    # Heritage site data (5 sites currently)
├── types/              # TypeScript definitions
│   └── index.ts        # GazaSite, Source, Image interfaces
├── utils/              # Helper functions
│   ├── format.ts       # Shared utilities
│   ├── siteFilters.ts  # Filter logic with BCE/century parsing
│   └── siteFilters.test.ts         # 14 filter tests
├── constants/          # Configuration
│   ├── filters.ts      # SITE_TYPES, STATUS_OPTIONS (no "all" option)
│   └── map.ts          # MAP_CONFIG, MARKER_CONFIG
├── styles/             # Global styles
│   └── theme.ts        # Centralized theme (colors, table, components)
└── App.tsx             # Main app with state management
```

### Key Patterns

- **Centralized Theme** - All colors, styles in `src/styles/theme.ts`
- **Component Extraction** - Extract when reused 3+ times
- **JIT Development** - Build incrementally, verify in browser
- **Static JSON** - No database yet, all data in `src/data/gazaSites.ts`

## Data Schema

### Core Interface

```typescript
interface GazaSite {
  id: string;
  type: "mosque" | "church" | "archaeological" | "museum" | "historic-building";
  name: string;               // Site name (English)
  nameArabic?: string;        // Site name (Arabic with RTL)
  yearBuilt: string;          // Flexible format: "7th century", "800 BCE", "1950", etc.
  description: string;

  originalLocation: string;
  coordinates: [number, number]; // [lat, lng] Leaflet format

  status: "destroyed" | "heavily-damaged" | "damaged";
  dateDestroyed: string;      // ISO format: "2023-12-07"

  sources: Source[];
  images?: Image[];

  historicalSignificance?: string;
  culturalValue?: string;
  verifiedBy: string[];       // Organizations that verified this data
}

interface Source {
  type: "academic" | "journalism" | "official" | "documentation";
  title: string;
  url?: string;
  organization?: string;
}

interface Image {
  url: string;
  caption?: string;
  type: "before" | "after" | "satellite";
}
```

## MVP Features

### Completed ✓

1. **Interactive Map** - Leaflet with color-coded markers (red/orange/yellow by status)
2. **Vertical Timeline** - D3.js full-height timeline with independent scrolling
3. **Enhanced FilterBar** - Type/Status/Date Range/Year Range filters
   - BC/BCE dropdown selectors (number input + era dropdown)
   - Destruction date range (start/end)
   - Creation year range with BCE support
   - Centered layout with stable "Clear filters" button
4. **Sortable Sites Table** - Compact tabular view with:
   - Click headers to sort (visual indicators: ↑↓↕)
   - Date Built column showing yearBuilt values
   - "See more" action column (not clickable rows)
   - Full-screen modal with expand button
5. **Detail Modal** - Full site info with accessibility (escape, backdrop, focus trap)
6. **Synchronized Highlighting** - Click row → black ring highlights across all components
7. **Custom Map Controls** - Ctrl+scroll zoom (preserves page scroll)
8. **Palestinian Theme** - Flag-inspired colors (subdued red/green/black/cream)
9. **Three-Column Layout** - Timeline (left) | Map (center) | Table (right)
10. **Comprehensive Testing** - 38 smoke tests covering all features

### Remaining

- [ ] Statistics dashboard (landing page)
- [ ] Timeline animation with play button
- [ ] About/Methodology page
- [ ] Search functionality
- [ ] Data collection (15-20 more sites)
- [ ] Mobile responsiveness (collapsible sidebars)

## Filtering System Patterns (#memorize)

### BC/BCE Date Handling

**Use dropdown selectors, NOT text input:**
- Number input for year + dropdown for era (BCE/CE)
- Prevents parsing issues with partial input like "500 b"
- Layout: `[Year input] [BCE/CE ▼] to [Year input] [BCE/CE ▼]`

**Internal representation:**
- Store BCE dates as negative numbers: 800 BCE → -800
- Store CE dates as positive numbers: 425 CE → 425
- Local state in component prevents filter clearing during typing

**Year parsing logic (`parseYearBuilt()` function):**
- BCE/BC dates: "800 BCE" → -800
- CE/AD dates: "425 CE" → 425
- Century format: "7th century" → 650 (midpoint calculation)
- Ranges: "800 BCE - 1100 CE" → -800 (extracts first year)
- Standalone years: "1950" → 1950

**Century midpoint:** `(century - 1) * 100 + 50`

### Date Range Filtering

- Always use start/end pairs (not single dates)
- Label positioning: above inputs, centered with `flex-col items-center`
- Clear button: use min-width container to prevent layout shift
- Example: Destruction date range, Creation year range

### Dropdown Best Practices

- **Z-index for map overlay:** Use `z-[9999]` on dropdowns that need to appear above map
- **Fixed positioning:** Use `getBoundingClientRect()` to position outside overflow containers
- **Click outside to close:** `useEffect` with mousedown listener
- **Visual feedback:** Checkbox UI with green checkmarks (#16a34a)

## Component Patterns (#memorize)

### FilterBar Component

**Layout:**
- Centered filters: `flex-1` with `justify-center`
- Stable Clear button: min-width container prevents shift when appearing
- All filters: controlled components with local state

**BC/BCE Implementation:**
```typescript
const [yearInput, setYearInput] = useState("");
const [yearEra, setYearEra] = useState<"CE" | "BCE">("CE");

// Convert to parent state
const year = yearEra === "BCE" ? -parseInt(yearInput) : parseInt(yearInput);
```

### SitesTable Component

**Sorting:**
- Use `useMemo` for performance with sorted arrays
- Visual indicators: ↑ (asc), ↓ (desc), ↕ (unsorted)
- Default sort: dateDestroyed descending
- Click header to toggle direction

**Interaction patterns:**
- Row clicks: highlight only (sync across components with `highlightedSiteId`)
- "See more" button: use `e.stopPropagation()` to prevent row click
- Expand icon: opens full-screen modal with same table component

**Highlighting:**
- Use `ring-2 ring-black ring-inset` for black outline
- Syncs across Timeline, Map, and Table components

### MultiSelectDropdown Component

**Fixed positioning to escape overflow:**
```typescript
<div
  className="fixed z-[9999]"
  style={{
    top: dropdownRef.current?.getBoundingClientRect().bottom + 8,
    left: dropdownRef.current?.getBoundingClientRect().left
  }}
>
```

**Close on outside click:**
```typescript
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };
  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }
}, [isOpen]);
```

## Development Preferences

### JIT Development Strategy (#memorize)

1. **Keep dev server running** - Instant HMR feedback
2. **Build incrementally** - One feature at a time, fully functional
3. **Mock data first** - Start with 2-3 sites, expand later
4. **Verify in browser** - Test each step before continuing
5. **Commit at milestones** - When feature complete and working

### Code Style (#memorize)

- **TypeScript strict mode** - No `any` types
- **PascalCase** for components
- **camelCase** for utilities
- **One component per file**
- **Centralized theme** - All styles in `theme.ts`
- **Minimal comments** - Code should be self-explanatory

### Testing Strategy (#memorize)

- **Vitest + React Testing Library** - Fast execution
- **Smoke tests** - Verify rendering and basic functionality (not implementation)
- **Test new features** - Add tests alongside implementation
- **Coverage goals:**
  - All new components: 5+ tests minimum
  - Filter logic: Test edge cases (BCE dates, ranges, null values)
  - UI interactions: Test click handlers, state updates
- **Current coverage:** 38 tests across 9 files
- **Run before commit** - Tests + lint always pass ✓

### Performance Considerations (#memorize)

- **React.memo** for components with heavy re-renders
- **useMemo** for expensive calculations (D3 scales)
- **useCallback** for event handlers passed as props
- **Lazy loading** for images
- **Optimize for slow connections** - Users may have limited bandwidth

## Important Considerations

### Legal & Ethical (#memorize)

- **Disclaimer required** - Documentation, not political advocacy
- **Source everything** - Every claim needs citation
- **Mark disputes** - Contested items labeled "disputed"
- **Respect copyright** - Fair use for educational purposes
- **No personal data** - No user tracking or data collection

### Cultural Sensitivity (#memorize)

- **Bilingual support** - English + Arabic with RTL layout
- **Respectful tone** - Professional, evidence-based, not sensationalist
- **Palestinian voice** - Partner with Palestinian organizations
- **Accessibility** - WCAG AA compliance required
- **Dignified color palette** - Subdued tones for serious subject matter

### Technical Priorities (#memorize)

- **Performance** - Fast loading on slow connections
- **Mobile-first** - Responsive design for all screens
- **Accessibility** - Keyboard navigation, screen readers, focus management
- **SEO** - Discoverable by researchers and journalists

## Known Issues & Gotchas (#memorize)

### Current Limitations

- **Mobile responsiveness:** Three-column layout needs work for small screens
- **Timeline/Table on mobile:** May need collapsible sidebars or stacked layout
- **Year parsing assumptions:** Assumes CE unless BCE/BC explicitly stated
- **Date range validation:** No enforcement that end date > start date

### Common Pitfalls to Avoid

**DO NOT:**
- ❌ Use text inputs for BC/BCE dates (parsing is fragile with partial input)
- ❌ Forget z-[9999] on dropdowns that need to appear above map
- ❌ Use clickable table rows for modals (use action column instead)
- ❌ Add hover triggers on table/timeline (causes accidental changes)

**DO:**
- ✅ Use number input + dropdown for BC/BCE year selection
- ✅ Test filters with empty state AND populated state
- ✅ Use `e.stopPropagation()` on nested clickable elements
- ✅ Remember Leaflet uses [lat, lng] not [lng, lat]
- ✅ Use `useMemo` for expensive sorting operations
- ✅ Center filter layout with `flex-1` and `justify-center`
- ✅ Prevent layout shift with min-width containers

### Coordinate Format Reminder

```typescript
// ✅ CORRECT - Leaflet format
coordinates: [31.5069, 34.4668] // [latitude, longitude]

// ❌ WRONG - GeoJSON format (don't use)
coordinates: [34.4668, 31.5069] // [longitude, latitude]
```

## Priority Sites to Document

**Current:** 5 sites documented  
**Target:** 20-25 sites

**Religious Sites (5):**

1. ✅ Great Omari Mosque (7th century)
2. ✅ Church of St. Porphyrius (5th century)
3. ✅ Saint Hilarion Monastery (1,700 years)
4. Al-Omari Mosque Jabalia (13th century)
5. Katib al-Welaya Mosque (Ottoman)

**Museums (4):** 6. ✅ Qasr Al-Basha (13th century) 7. Al Qarara Museum (3,000 artifacts) 8. Rafah Museum (30 years collection) 9. Al-Israa University Museum

**Archaeological (5):** 10. Blakhiyya Site (800 BCE-1100 CE) 11. Tell al-Ajjul (Bronze Age) 12. Anthedon Harbor (Ancient port) 13. Byzantine Church Complex 14. Roman Cemetery

**Historic Buildings (6):** 15. ✅ Hammam al-Samra (Ottoman bathhouse) 16. Barquq Castle (14th century) 17. Pasha's Palace (Ottoman) 18. Al-Ghussein Cultural Center 19. Al-Saqqa House (Traditional) 20. Rashad al-Shawa Cultural Center

## Lessons Learned (October 5-6, 2025)

### What Worked ✓

1. **JIT Development** - Keep server running, build incrementally
2. **Centralized Theme** - All colors/styles in `theme.ts`
3. **Component Extraction** - Extract when reused, not before
4. **Vitest Speed** - 15x faster than Jest
5. **Code Review Before Commit** - Check DRY/KISS/SOLID

### What to Fix 🔧

1. **Coordinate Format** - Leaflet uses [lat, lng] not [lng, lat]
2. **Tooltip Overflow** - Smart positioning at edges
3. **Test Performance** - Optimize Vitest config for speed
4. **Lint Before Commit** - Catch `any` types and unused imports

### Process Improvements

1. **Data Collection** - Need systematic approach for 20-25 sites
2. **Commit Strategy** - Maintain quality, commit at milestones
3. **State Management** - Careful with event handlers and selected state

## Commands & Workflow

### Development

```bash
npm run dev          # Start dev server (keep running)
npm test            # Run tests
npm run test:ui     # Test UI (optional)
npm run lint        # ESLint
npm run build       # Production build
```

### Git Workflow

```bash
git status
git add .
git commit -m "feat: description"  # Conventional commits
git push origin feature/branch-name
```

**Branch Strategy:**

- `main` - Protected
- `feature/*` - New features
- `fix/*` - Bug fixes

## Contact & Contribution

**For AI Assistants:**

- Refer to GitHub issues for tasks
- Check existing patterns before suggesting new ones
- Flag data/source questions for human review
- Prioritize maintainability and documentation

**For Contributors:**

- See GitHub issues for tasks
- Follow code style guidelines
- Write tests for new features
- Update documentation

---

**Last Updated:** October 6, 2025  
**Version:** 0.1.0 (Pre-launch)  
**Status:** MVP Phase 1 Development
