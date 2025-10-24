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
npm test        # Run test suite (38 tests must pass ✓)
npm run lint    # ESLint + Prettier check
npm run build   # Production build
```

### Tech Stack

- **React 19** + **TypeScript 5.7** + **Vite 7**
- **Tailwind CSS v4** (custom Palestinian flag theme)
- **Leaflet** (interactive maps)
- **D3.js** (timeline visualization)
- **Vitest** (testing - 38 tests passing)

### Current State

- **5 of 20-25 sites** documented
- **MVP Phase 1:** ~90% complete
- **Features:** Interactive map, timeline, advanced filtering, detail modals, bilingual support

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

1. **Test First** - 38/38 tests must pass before commit
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
├── components/
│   ├── FilterBar/          # Multi-select dropdown filters
│   ├── Map/                # Leaflet map with custom zoom
│   ├── Timeline/           # D3.js visualization
│   ├── SiteDetailPanel/    # Modal with bilingual content
│   ├── SiteCards/          # Grid display
│   └── StatusBadge/        # Reusable status indicator
├── data/
│   └── sites.json          # Heritage sites data (5/20-25)
├── types/
│   └── index.ts            # TypeScript interfaces
├── utils/
│   ├── constants.ts        # SITE_TYPES, STATUS_OPTIONS, etc.
│   └── formatters.ts       # Date formatting, label utilities
└── App.tsx                 # Main component with state management
```

### State Management Pattern

```typescript
// Centralized state in App.tsx
const [sites, setSites] = useState<HeritageSite[]>([]);
const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
const [filters, setFilters] = useState<FilterState>({
  types: [],
  statuses: [],
  dateRange: { start: null, end: null },
});

// Pass down as props (no Redux/Context for MVP)
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

## Lessons Learned

### What Works Well

- **StatusBadge component** - Reusable, consistent styling
- **Centralized constants** - `SITE_TYPES`, `STATUS_OPTIONS` in utils
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

**Last Updated:** October 2025  
**Project Status:** MVP Phase 1 - 90% complete (5/20-25 sites documented)  
**Next Priority:** Complete remaining 15-20 sites data collection
