# Current Session - Heritage Tracker Development

**Session Date:** October 4, 2025
**Branch:** feature/firstbranch
**Status:** Active Development - Phase 1 MVP

---

## Session Context

This session begins development on **Heritage Tracker**, a web application documenting the destruction of Palestinian cultural heritage in Gaza (2023-present).

### Project Quick Facts

- **Tech Stack:** React 18+ with TypeScript, Vite, Tailwind CSS, Mapbox GL JS, D3.js
- **MVP Scope:** 20-25 most significant heritage sites in Gaza
- **Data Sources:** UNESCO (110 sites), Forensic Architecture, Heritage for Peace
- **Timeline:** 3-4 weeks to MVP launch
- **Focus:** Evidence-based documentation with source citations for every claim

---

## Current Project Status

### ✅ Completed

- [x] Research and data source identification
- [x] Project structure and planning
- [x] GitHub issues created
- [x] CLAUDE.md project guide created

### 🚧 In Progress (Phase 1 MVP)

- [ ] Project setup (React + TypeScript + Vite)
- [ ] Data schema definition
- [ ] Data collection for priority datasets (20-25 sites)
- [ ] Map component implementation
- [ ] Timeline visualization
- [ ] Detail panel component
- [ ] Filter system
- [ ] Content and design
- [ ] Documentation

---

## Key Features to Build

### 1. Interactive Gaza Map

- 20-25 heritage sites with color-coded markers (red/orange/yellow by damage level)
- Click markers to open detail panel
- Filters by site type (mosque/church/archaeological/museum/building)
- Gaza Strip-focused zoom controls

### 2. Timeline Visualization

- October 2023 → October 2025 horizontal timeline
- Slider + play button for animated progression
- Key dates marked (conflict start, escalations)

### 3. Site Detail Panel

- Bilingual (English & Arabic)
- Before/after images + satellite imagery
- Historical significance & what was lost
- Full source citations with links
- Share functionality

### 4. Statistics Dashboard (Landing)

- Large impact numbers (64.7% destroyed, 207/320 sites, 79% of mosques)
- Timeline graph showing acceleration
- Breakdown by site type
- CTA: "Explore the Map"

### 5. About/Methodology Page

- Project explanation
- Data verification process
- Map usage guide
- Legal disclaimer
- Contact info

---

## Priority Tasks for This Session

1. **Environment Setup** (if not done)

   - Initialize React + TypeScript + Vite project
   - Configure Tailwind CSS
   - Set up ESLint + Prettier
   - Create basic project structure

2. **Data Schema**

   - Define TypeScript interfaces (HeritageItem, Source, Image)
   - Create sample data structure
   - Plan JSON file organization

3. **Initial Components**

   - Basic app layout (Header, Footer, Navigation)
   - Map container skeleton
   - Route structure

4. **Data Collection Strategy**
   - Access UNESCO reports
   - Review Forensic Architecture platform
   - Download Heritage for Peace reports
   - Create data entry template

---

## Critical Development Rules

### Git Workflow

- Main branch is protected
- Feature branches: `feature/description`
- Conventional commits: `feat:`, `fix:`, `docs:`
- Currently on: `feature/firstbranch`

### Code Standards

- TypeScript strict mode
- PascalCase for components, camelCase for utilities
- One component per file
- JSDoc for public APIs

### Quality Requirements

- Source everything - every claim needs citation
- WCAG AA accessibility compliance
- Mobile-first responsive design
- RTL layout support for Arabic
- Performance optimization for slow connections

---

## Data Structure Reference

### MVP Site Data Points

```json
{
  "id": "unique-slug",
  "name": "English name",
  "nameArabic": "Arabic name",
  "type": "mosque|church|archaeological|museum|historic-building",
  "yearBuilt": "7th century",
  "coordinates": [longitude, latitude],
  "status": "destroyed|heavily-damaged|damaged",
  "dateDestroyed": "2023-12-07",
  "description": "2-3 sentence description",
  "historicalSignificance": "Why this matters",
  "culturalValue": "What was lost",
  "verifiedBy": ["UNESCO", "Heritage for Peace", "Forensic Architecture"],
  "images": {
    "before": "url or path",
    "after": "url or path",
    "satellite": "url or path"
  },
  "sources": [...]
}
```

---

## The 20-25 Priority Sites

**Religious Sites (5):**

1. Great Omari Mosque (7th c., 62 manuscripts destroyed)
2. Church of St. Porphyrius (5th c., world's 3rd oldest)
3. Saint Hilarion Monastery (1,700 years old)
4. Al-Omari Mosque Jabalia (13th c. Mamluk)
5. Katib al-Welaya Mosque (Ottoman)

**Museums (4):** 6. Qasr Al-Basha (13th c. Mamluk palace/museum) 7. Al Qarara Museum (3,000 artifacts) 8. Rafah Museum (30 years collection) 9. Al-Israa University Museum (~3,000 objects)

**Archaeological (5):** 10. Blakhiyya Archaeological Site (800 BCE-1100 CE, 4,000+ objects) 11. Tell al-Ajjul (Bronze Age) 12. Anthedon Harbor (Ancient port) 13. Byzantine Church Complex Jabalia 14. Roman Cemetery Tell al-Ajjul

**Historic Buildings (6):** 15. Hammam al-Samra (Ottoman bathhouse) 16. Barquq Castle (14th c. Mamluk) 17. Pasha's Palace (Ottoman admin) 18. Al-Ghussein Cultural Center 19. Al-Saqqa House (Traditional architecture) 20. Rashad al-Shawa Cultural Center

---

## Next Steps

**Immediate priorities:**

1. Review existing project structure
2. Check if React/Vite project is initialized
3. Identify which GitHub issues to tackle first
4. Begin data collection or component development

**Data collection workflow:**

- Week 1: Review UNESCO list, select 20-25 sites
- Week 2: Fill data points, write descriptions, collect sources
- Week 3: Find before/after images, ensure attribution
- Week 4: Validate data, test on map, final QA

---

## Resources

- **Data Sources:** UNESCO reports, forensic-architecture.org, heritageforpeace.org
- **Tech Docs:** react.dev, typescriptlang.org/docs, docs.mapbox.com, tailwindcss.com/docs
- **Similar Projects:** Forensic Architecture, Mapping Police Violence, Syria Heritage Initiative
- **GitHub Issues:** Check issues for specific tasks

---

## Legal & Ethical Guidelines

- ⚠️ Disclaimer required (documentation, not advocacy)
- ⚠️ Source everything with citations
- ⚠️ Mark disputed items clearly
- ⚠️ Respect copyright (fair use educational)
- ⚠️ No personal data collection
- ⚠️ Bilingual support (EN/AR)
- ⚠️ Professional, evidence-based tone
- ⚠️ WCAG AA accessibility

---

**Session initialized.** Ready to continue development.
