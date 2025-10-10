# CLAUDE.md - Heritage Tracker

This file provides guidance to Claude Code when working on Heritage Tracker.

## Quick Navigation

- [Project Overview](#project-overview) - Mission and purpose
- [Quick Reference](#quick-reference) - Commands and MVP scope
- [Critical Development Rules](#critical-development-rules) - Git workflow and quality gates
- [Project Architecture](#project-architecture) - Structure and patterns
- [Filtering System Patterns](#filtering-system-patterns) - BC/BCE handling, date ranges
- [Component Patterns](#component-patterns) - FilterBar, SitesTable, dropdowns
- [Data Schema](#data-schema) - TypeScript interfaces
- [Development Preferences](#development-preferences) - Coding standards
- [Important Considerations](#important-considerations) - Legal, cultural, technical

## Project Overview

**Heritage Tracker** documents Palestinian cultural heritage destruction, focusing on 20-25 significant Gaza sites (2023-2024).

**Mission:** Document systematic destruction, visualize patterns, support repatriation, raise awareness

**Core Principle:** Evidence-based documentation with source citations for every claim.

**Target Audience:** Researchers, legal advocates, journalists, educators, public

## Quick Reference

**Commands:**

```bash
npm run dev          # Dev server (localhost:5173) - keep running
npm test            # Run tests (38 tests)
npm run lint        # Code quality
npm run build       # Production build
```

**Tech Stack:** React 19+ + TypeScript + Vite 7+ + Tailwind CSS v4 + Leaflet + D3.js

**MVP Scope:** 20-25 Gaza heritage sites destroyed 2023-2024

**Data Sources:** UNESCO, Forensic Architecture, Heritage for Peace

**Current State:** 5 sites documented, MVP Phase 1 complete with enhanced filtering

## Critical Development Rules

### Git Workflow (#memorize)

```bash
# Conventional commits
git commit -m "feat: add BC/BCE dropdown selectors"
git commit -m "fix: resolve table sorting bug"
# NOT: "Add BC/BCE with Claude assistance"

# Commit when feature complete and working
# Run lint + tests before every commit
```

### Quality Gates (#memorize)

- **Always run tests** - 38/38 must pass ✓
- **Dev server running** - HMR for instant feedback
- **Smoke tests** - Quick verification, not implementation
- **Code review** - Check DRY/KISS/SOLID before commit

### Session Management (#memorize)

- **Maintain CURRENT_SESSION.md** - Update throughout development
- **Track progress** - Phases, decisions, lessons learned
- **Document changes** - Modified files, test coverage, next priorities

## Project Architecture

### Current Layout (Three-Column Dashboard)

```
Timeline (320px left) | Map (flexible center) | Table (384px right)
```

**File Structure:**

```
src/
├── components/
│   ├── FilterBar/
│   │   ├── FilterBar.tsx           # BC/BCE dropdowns, date ranges
│   │   └── MultiSelectDropdown.tsx # Checkbox multi-select (z-9999)
│   ├── SitesTable.tsx              # Sortable with expand modal
│   ├── Timeline/VerticalTimeline.tsx
│   ├── Map/HeritageMap.tsx
│   └── Modal/Modal.tsx
├── utils/
│   ├── siteFilters.ts              # Filter logic with BCE parsing
│   └── format.ts
├── constants/
│   ├── filters.ts                  # SITE_TYPES, STATUS_OPTIONS
│   └── map.ts
├── styles/theme.ts                 # Centralized colors/styles
└── data/mockSites.ts               # 5 sites currently
```

**Key Patterns:**

- Centralized theme in `theme.ts`
- Extract components when reused 3+ times
- JIT development (incremental, verify in browser)
- Static JSON (no database yet)

## Filtering System Patterns

### BC/BCE Date Handling (#memorize)

**Use dropdown selectors, NOT text input:**

```tsx
<input type="number" value={yearInput} onChange={...} />
<select value={yearEra} onChange={...}>
  <option value="CE">CE</option>
  <option value="BCE">BCE</option>
</select>
```

**Why:** Prevents parsing issues with partial input like "500 b"

**Internal representation:**

- BCE dates → negative numbers: 800 BCE → -800
- CE dates → positive numbers: 425 CE → 425
- Local state prevents filter clearing during typing

**Year parsing (`parseYearBuilt()`):**

- "800 BCE" → -800
- "7th century" → 650 (midpoint: `(7-1)*100 + 50`)
- "800 BCE - 1100 CE" → -800 (first year)
- "1950" → 1950

### Date Range Filtering

- Always use start/end pairs (not single dates)
- Label positioning: above inputs, centered with `flex-col items-center`
- Stable Clear button: min-width container prevents layout shift
- Examples: Destruction date range, Creation year range

### Dropdown Best Practices

- **Z-index for map:** Use `z-[9999]` on dropdowns above Leaflet map
- **Fixed positioning:** `getBoundingClientRect()` for overflow escape
- **Click outside:** `useEffect` with mousedown listener
- **Visual feedback:** Green checkmarks (#16a34a) for selected items

## Component Patterns

### FilterBar Component (#memorize)

**Layout:**

- Centered filters: `flex-1` with `justify-center`
- Stable Clear button: min-width prevents shift
- Controlled components with local state

**BC/BCE Implementation:**

```typescript
const [yearInput, setYearInput] = useState("");
const [yearEra, setYearEra] = useState<"CE" | "BCE">("CE");
const year = yearEra === "BCE" ? -parseInt(yearInput) : parseInt(yearInput);
```

### SitesTable Component (#memorize)

**Sorting:**

- `useMemo` for performance
- Visual indicators: ↑ (asc), ↓ (desc), ↕ (unsorted)
- Click header to toggle
- Default: dateDestroyed descending

**Interaction:**

- Row clicks → highlight only (no modal)
- "See more" button → use `e.stopPropagation()`
- Expand icon → full-screen modal

**Highlighting:**

- `ring-2 ring-black ring-inset` for black outline
- Syncs across Timeline, Map, Table via `highlightedSiteId`

### MultiSelectDropdown (#memorize)

**Fixed positioning:**

```typescript
<div className="fixed z-[9999]" style={{
  top: buttonRef.current?.getBoundingClientRect().bottom + 8,
  left: buttonRef.current?.getBoundingClientRect().left
}}>
```

**Close on outside click:**

```typescript
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

## Data Schema

```typescript
interface GazaSite {
  id: string;
  type: "mosque" | "church" | "archaeological" | "museum" | "historic-building";
  name: string;
  nameArabic?: string;
  yearBuilt: string; // "7th century", "800 BCE", "1950"
  description: string;
  originalLocation: string;
  coordinates: [number, number]; // [lat, lng] Leaflet format
  status: "destroyed" | "heavily-damaged" | "damaged";
  dateDestroyed: string; // ISO: "2023-12-07"
  sources: Source[];
  images?: Image[];
  verifiedBy: string[];
}
```

## Development Preferences

### JIT Development (#memorize)

1. Keep dev server running
2. Build incrementally, one feature at a time
3. Mock data first (2-3 sites)
4. Verify in browser before continuing
5. Commit at milestones (feature complete)

### Code Style (#memorize)

- TypeScript strict mode (no `any`)
- PascalCase (components), camelCase (utilities)
- Centralized theme, minimal comments
- One component per file

### Testing (#memorize)

- Vitest + React Testing Library
- Smoke tests (rendering, basic functionality)
- 5+ tests minimum for new components
- Test edge cases (BCE dates, null values)
- Current: 38 tests across 9 files
- Run before every commit

### Performance (#memorize)

- React.memo for heavy re-renders
- useMemo for expensive calculations (D3 scales, sorting)
- useCallback for event handlers
- Lazy loading for images

## Important Considerations

### Legal & Ethical (#memorize)

- Disclaimer required (documentation, not advocacy)
- Source everything with citations
- Mark disputed items
- Fair use for educational purposes
- No personal data collection

### Cultural Sensitivity (#memorize)

- Bilingual (English + Arabic RTL)
- Professional, evidence-based tone
- Partner with Palestinian organizations
- WCAG AA accessibility
- Dignified subdued colors

### Technical Priorities (#memorize)

- Performance (slow connections)
- Mobile-first responsive design
- Accessibility (keyboard, screen readers)
- SEO for discoverability

## Known Issues & Gotchas

### DO NOT ❌

- Use text inputs for BC/BCE dates (parsing fragile)
- Forget z-[9999] on dropdowns above map
- Use clickable table rows for modals (use action column)
- Add hover triggers on table/timeline

### DO ✅

- Number input + dropdown for BC/BCE
- Test filters with empty AND populated state
- `e.stopPropagation()` on nested clickables
- Leaflet uses [lat, lng] NOT [lng, lat]
- useMemo for sorting
- min-width containers prevent layout shift

### Current Limitations

- Mobile responsiveness needs work (three-column layout)
- No validation that end date > start date
- Year parsing assumes CE unless BCE/BC explicit

## Priority Sites

**Current:** 5 of 20-25 sites

- ✅ Great Omari Mosque, Church of St. Porphyrius, Saint Hilarion Monastery, Qasr Al-Basha, Hammam al-Samra

**Remaining:** 15-20 sites (Religious: 3, Museums: 3, Archaeological: 5, Historic: 5)

## MVP Status

### Completed ✓

- Interactive map (red/orange/yellow markers)
- Vertical timeline (full viewport height)
- Enhanced FilterBar (BC/BCE dropdowns, date ranges)
- Sortable table with expand modal
- Detail modal with accessibility
- Synchronized highlighting (black ring)
- Palestinian flag-inspired theme
- 38 comprehensive tests

### Remaining

- Statistics dashboard
- Timeline animation
- About/Methodology page
- Mobile responsiveness
- Data collection (15-20 sites)

---

**Last Updated:** October 8, 2025  
**Version:** 0.1.0 (Pre-launch)  
**Status:** MVP Phase 1 Complete
