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
npm test            # Run tests (84 tests)
npm run lint        # Code quality
npm run build       # Production build
```

**Tech Stack:** React 19+ + TypeScript + Vite 7+ + Tailwind CSS v4 + Leaflet + D3.js

**MVP Scope:** 20-25 Gaza heritage sites destroyed 2023-2024

**Data Sources:** UNESCO, Forensic Architecture, Heritage for Peace

**Current State:** 15 sites documented, MVP Phase 1 complete with enhanced filtering and mobile optimization

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

- **Always run tests** - 84/84 must pass ✓
- **Dev server running** - HMR for instant feedback
- **Smoke tests** - Quick verification, not implementation
- **Code review** - Check DRY/KISS/SOLID before commit

### Session Management (#memorize)

- **Maintain CURRENT_SESSION.md** - Update throughout development
- **Track progress** - Phases, decisions, lessons learned
- **Document changes** - Modified files, test coverage, next priorities

## Project Architecture

### Current Layout (Three-Column Dashboard)

**Desktop:**
```
Timeline (440px left, red border) | Map (centered, sticky) | Table (480px right, white/black borders)
```

**Mobile:**
```
FilterBar (compact, text-[10px])
↓
SitesTable (accordion view, Type column removed)
```

**File Structure:**

```
src/
├── components/
│   ├── FilterBar/
│   │   ├── FilterBar.tsx           # Compact filters (text-[10px]), mobile search
│   │   └── MultiSelectDropdown.tsx # Checkbox multi-select (z-9999)
│   ├── SitesTable.tsx              # Desktop + mobile accordion variants
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
└── data/mockSites.ts               # 15 sites currently
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

- Desktop: Centered filters with inline search, all text-[10px] for compactness
- Mobile: Full-width search bar above (hidden md:hidden), compact filters below
- Stable Clear button: min-width prevents shift
- Controlled components with local state
- No longer displays site count (removed unused props)

**BC/BCE Implementation:**

```typescript
const [yearInput, setYearInput] = useState("");
const [yearEra, setYearEra] = useState<"CE" | "BCE">("CE");
const year = yearEra === "BCE" ? -parseInt(yearInput) : parseInt(yearInput);
```

### SitesTable Component (#memorize)

**Variants:**

- `compact` - Desktop sidebar (Name, Status, Date, Actions)
- `expanded` - Modal with all fields (Type, Islamic dates, Built dates)
- `mobile` - Accordion list (Name/Date collapsed, Type column removed)

**Mobile Features:**

- Type column removed for space efficiency
- Arabic names left-aligned (not RTL) for consistency
- Collapsible accordion rows with chevron indicator
- Site count shown in header ("Showing X sites")
- Color-coded site names by status

**Sorting:**

- `useMemo` for performance
- Visual indicators: ↑ (asc), ↓ (desc), ↕ (unsorted)
- Click header to toggle
- Default: dateDestroyed descending

**Interaction:**

- Desktop row clicks → highlight only (no modal)
- Mobile accordion clicks → expand/collapse details
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
- Test edge cases (BCE dates, null values, mobile variants)
- Current: 84 tests across 9 files
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

- No validation that end date > start date
- Year parsing assumes CE unless BCE/BC explicit
- Search bar code duplicated (mobile/desktop) - acceptable for different styling needs

## Priority Sites

**Current:** 15 of 20-25 sites documented

**Remaining:** 5-10 sites to reach MVP target

## MVP Status

### Completed ✓

- Interactive map (red/orange/yellow markers, centered sticky positioning)
- Vertical timeline (440px width, red border, sticky)
- Enhanced FilterBar (BC/BCE dropdowns, date ranges, text-[10px] compact design)
- Sortable table (desktop + mobile accordion variants)
- Mobile optimization (Type column removed, left-aligned Arabic, compact header)
- Detail modal with accessibility
- Synchronized highlighting (black ring)
- Palestinian flag-inspired theme (thicker flag line: RED-BLACK-RED-GREEN)
- Desktop table styling (white border + black inner border)
- 84 comprehensive tests (including mobile variant tests)

### Remaining

- Statistics dashboard
- Timeline animation
- About/Methodology page
- Data collection (5-10 more sites to reach 20-25 target)

---

**Last Updated:** October 10, 2025
**Version:** 0.2.0 (Pre-launch)
**Status:** MVP Phase 1 Complete with Mobile Optimization
