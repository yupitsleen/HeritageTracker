# Current Development Session

**Date:** October 5, 2025
**Branch:** feature/firstbranch
**Status:** MVP Phase 1 Development

---

## Session Overview

This document tracks the current development session for Heritage Tracker. It serves as a quick reference for what's being worked on, what's completed, and what's next.

---

## Project Quick Reference

### What is Heritage Tracker?
A web application documenting the destruction of Palestinian cultural heritage, focusing initially on 20-25 significant Gaza heritage sites destroyed in 2023-2024.

### Tech Stack (Phase 1)
- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS
- Mapbox GL JS or Leaflet (mapping)
- D3.js (timeline visualization)
- Static JSON data files (no database yet)

### MVP Scope
**Focus:** 20-25 priority heritage sites in Gaza (2023-2024)

**Data Sources:**
1. UNESCO Official List (110 verified sites)
2. Forensic Architecture (satellite imagery, coordinates)
3. Heritage for Peace (ground documentation)

---

## Current Session Status

### Branch Information
- **Current Branch:** feature/firstbranch
- **Base Branch:** main
- **Uncommitted Changes:** github_issues.json (modified)

### Recent Activity
- Created comprehensive CLAUDE.md project guide
- Documented MCP server recommendations
- Created GitHub issues for Phase 1 MVP
- Set up initial project planning

---

## Priority Sites to Document (20-25)

### Religious Sites (5)
1. ✅ Great Omari Mosque - 7th century, 62 rare manuscripts destroyed
2. ✅ Church of St. Porphyrius - 5th century, world's third-oldest church
3. ✅ Saint Hilarion Monastery - 1,700 years old
4. ✅ Al-Omari Mosque (Jabalia) - 13th century Mamluk
5. ✅ Katib al-Welaya Mosque - Ottoman era

### Museums & Cultural Centers (4)
6. ✅ Qasr Al-Basha - 13th century Mamluk palace, museum
7. ✅ Al Qarara Museum - 3,000 artifacts
8. ✅ Rafah Museum - 30 years of collecting
9. ✅ Al-Israa University Museum - ~3,000 objects

### Archaeological Sites (5)
10. ✅ Blakhiyya Archaeological Site - Ancient seaport 800 BCE-1100 CE
11. ✅ Tell al-Ajjul - Bronze Age site
12. ✅ Anthedon (Teda) Harbor - Ancient port
13. ✅ Byzantine Church Complex (Jabalia)
14. ✅ Roman Cemetery (Tell al-Ajjul)

### Historic Buildings (6)
15. ✅ Hammam al-Samra - Ottoman bathhouse
16. ✅ Barquq Castle - 14th century Mamluk
17. ✅ Pasha's Palace - Ottoman administrative center
18. ✅ Al-Ghussein Cultural Center
19. ✅ Al-Saqqa House - Traditional architecture
20. ✅ Rashad al-Shawa Cultural Center

---

## Data Schema Quick Reference

```typescript
interface HeritageItem {
  id: string;
  type: "manuscript" | "archaeological" | "building" | "artifact" | "site";
  title: string;
  titleArabic?: string;
  description: string;

  originalLocation: string;
  coordinates: [number, number]; // [longitude, latitude]

  status: "destroyed" | "looted" | "repatriated" | "disputed" | "unknown";

  sources: Source[];
  images?: Image[];

  createdAt: string;
  updatedAt: string;
}
```

---

## MVP Features Checklist

### 1. Interactive Map
- [ ] Display 20-25 heritage sites on Gaza map
- [ ] Color-coded markers (Red=destroyed, Orange=heavily damaged, Yellow=damaged)
- [ ] Click marker to open detail panel
- [ ] Simple filters by site type
- [ ] Gaza-focused zoom controls

### 2. Timeline Visualization
- [ ] Horizontal timeline (Oct 2023 → Oct 2025)
- [ ] Slider for destruction progression
- [ ] Play button to animate
- [ ] Key dates marked

### 3. Detail Panel
- [ ] Site name (English & Arabic)
- [ ] Type and historical period
- [ ] Description and significance
- [ ] Date destroyed/damaged
- [ ] Before/after images
- [ ] Source citations
- [ ] Share button

### 4. Statistics Dashboard (Landing)
- [ ] Impact numbers display
- [ ] Timeline graph
- [ ] Breakdown by site type
- [ ] Call-to-action

### 5. About/Methodology Page
- [ ] Project explanation
- [ ] Data sources and verification
- [ ] Map reading guide
- [ ] Legal disclaimer
- [ ] Contact information

---

## Development Workflow

### Git Workflow
- Main branch is protected
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Conventional Commits:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- PascalCase for components
- camelCase for utilities
- JSDoc for public APIs

---

## MCP Servers for Development

### Phase 1 (Install Now)
1. **Google Maps MCP** ⭐ CRITICAL - Geocoding for heritage sites
2. **File System MCP** ⭐ HIGH - Manage JSON data files
3. **GitHub MCP** ⭐ HIGH - Issue tracking and commits

### Phase 2 (Install When Ready)
4. **Firecrawl MCP** - Web scraping for data collection
5. **Brave Search MCP** - Research and verification

### Configuration Location
VS Code Settings (JSON): `Ctrl+Shift+P` → "Preferences: Open User Settings (JSON)"

---

## Next Steps

### Immediate (This Session)
1. [ ] Review current project structure
2. [ ] Identify what's already built
3. [ ] Set up development environment if needed
4. [ ] Begin work on next priority task

### Short Term (This Week)
1. [ ] Complete project setup (React + TypeScript + Vite)
2. [ ] Define TypeScript types
3. [ ] Set up basic routing
4. [ ] Create layout components

### Medium Term (Next 2 Weeks)
1. [ ] Data collection for 20-25 priority sites
2. [ ] Map component implementation
3. [ ] Timeline visualization
4. [ ] Detail panel component

---

## Important Reminders

### Development Principles
- **Evidence-based:** Every claim must have source citation
- **Accessibility:** WCAG AA compliance required
- **Mobile-first:** Responsive design for all screens
- **Performance:** Fast loading on slow connections
- **Bilingual:** English + Arabic (RTL support)

### Data Sources
- UNESCO: 110 verified sites (select top 20-25)
- Forensic Architecture: Satellite imagery + coordinates
- Heritage for Peace: Ground documentation + reports

### Legal & Ethical
- Add disclaimer: Documentation, not political advocacy
- Source everything with citations
- Handle disputes carefully
- Respect copyright (fair use)
- No personal data collection

---

## Session Notes

### Current Working Directory
`C:\Users\eilee\Repos\HeritageTracker\HeritageTracker`

### Git Status
- On branch: feature/firstbranch
- Modified: github_issues.json
- Recent commits show documentation and planning work

### What's Been Done
- ✅ Comprehensive project planning in CLAUDE.md
- ✅ MCP server recommendations documented
- ✅ GitHub issues created for Phase 1
- ✅ Data schema defined
- ✅ 20-25 priority sites identified

### What's Next
- Project setup (if not done)
- TypeScript types implementation
- Begin component development
- Start data collection

---

## Quick Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm test            # Run tests
npm run lint        # Run linter
```

### Git
```bash
git status                          # Check current status
git add .                          # Stage changes
git commit -m "feat: description"  # Commit with message
git push                           # Push to remote
```

---

**Last Updated:** October 5, 2025
**Session Started:** October 5, 2025
**Purpose:** MVP Phase 1 Development Setup and Planning
