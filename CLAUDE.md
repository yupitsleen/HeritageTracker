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

- Dev server: http://localhost:5175
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
│   ├── FilterBar/      # Unified filtering system
│   ├── SitesTable.tsx  # Compact table view
│   ├── SiteCard.tsx    # Legacy component
│   ├── Modal/          # Detail panel modal
│   └── SiteDetail/     # SiteDetailPanel
├── data/               # Static JSON data files
│   └── mockSites.ts    # Heritage site data
├── types/              # TypeScript definitions
│   └── index.ts        # GazaSite, Source, Image
├── utils/              # Helper functions
│   └── format.ts       # Shared utilities
├── constants/          # Configuration
│   ├── filters.ts      # SITE_TYPES, STATUS_OPTIONS
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
  title: string;
  titleArabic?: string;
  description: string;

  originalLocation: string;
  coordinates: [number, number]; // [lat, lng] Leaflet format

  status: "destroyed" | "heavily-damaged" | "damaged";
  dateDestroyed: string;

  sources: Source[];
  images?: Image[];

  historicalSignificance?: string;
  culturalValue?: string;
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
3. **Unified FilterBar** - Type/Status/Date filters with custom dropdowns
4. **Sites Table** - Compact tabular view replacing card grid
5. **Detail Modal** - Full site info with accessibility (escape, backdrop, focus trap)
6. **Synchronized Highlighting** - Click timeline/map/table → black ring highlights all
7. **Custom Map Controls** - Ctrl+scroll zoom (preserves page scroll)
8. **Palestinian Theme** - Flag-inspired colors (subdued red/green/black/cream)
9. **Three-Column Layout** - Timeline (left) | Map (center) | Table (right)

### Remaining

- [ ] Statistics dashboard (landing page)
- [ ] Timeline animation with play button
- [ ] About/Methodology page
- [ ] Search functionality
- [ ] Data collection (15-20 more sites)

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

- **Vitest + React Testing Library** - Fast execution (<1 second)
- **Smoke tests** - Verify rendering, not implementation
- **Write as you build** - Tests alongside features
- **Focus on critical paths** - Filtering, data display, map interactions
- **Run before commit** - Tests + lint always pass

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
