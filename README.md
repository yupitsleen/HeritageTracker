````markdown
# Heritage Tracker

**Documenting Palestinian cultural heritage destruction through interactive visualization**

![Tests](https://img.shields.io/badge/tests-1569%20passing-brightgreen)
![Backend](https://img.shields.io/badge/backend-Supabase%20ready-blue)
![Scaling](https://img.shields.io/badge/scaling-production%20ready-brightgreen)

**Currently:** 44 Gaza heritage sites documented | Production-ready for 1000s of sites

---

## 🎯 Mission

Document and visualize Palestinian cultural heritage destruction with evidence-based data to support transparency, legal advocacy, and preservation efforts.

**The Context:** 64.7% of Gaza's cultural heritage destroyed in 6 months (207 of 320 sites) | 110 sites UNESCO-verified | 1,700+ years of history

---

## ✨ Features

### Core Functionality

- **Interactive map** - Leaflet with satellite/street toggle, clustering (50+ sites)
- **Timeline visualization** - D3.js horizontal scrubber with play/pause
- **Advanced filtering** - Type, status, date ranges (BC/BCE support), debounced 300ms
- **Resizable table** - Virtual scrolling (100+ sites), progressive columns
- **Detail modals** - Bilingual (English/Arabic), cross-component sync
- **CSV Export** - RFC 4180 compliant with Arabic names
- **Statistics Dashboard** - Impact metrics, looted artifacts tracking
- **About/Methodology** - Data sources and legal framework

### Scaling (Production-Ready)

- **Pagination** - Smart page numbers, 50 items/page
- **Virtual Scrolling** - TanStack Virtual, 60 FPS with 1000+ rows
- **Map Clustering** - Palestinian flag colors, 50+ marker threshold
- **React Query** - 5-minute caching, 5x faster repeat queries
- **Performance** - <2s page load, <500ms filters, 60 FPS scrolling

### Extensibility

- **22 registry systems** - Zero-downtime configuration (site types, statuses, colors, filters, etc.)
- **947 registry tests** - Type-safe, i18n-ready (English/Arabic)
- **Multi-tenant ready** - Different clients can use different configs

See [docs/extensibility-status.md](docs/extensibility-status.md) for details.

---

## 🛠️ Tech Stack

**Core:** React 19 + TypeScript 5.7 + Vite 7 + Tailwind CSS v4  
**Mapping:** Leaflet + leaflet.markercluster  
**Visualization:** D3.js  
**Performance:** TanStack Virtual + TanStack Query  
**Backend:** Supabase (PostgreSQL + PostGIS)  
**Testing:** Vitest (1569 tests passing)

---

## 🚀 Quick Start

```bash
# Install
git clone https://github.com/yupitsleen/HeritageTracker.git
cd HeritageTracker
npm install

# Develop
npm run dev          # → http://localhost:5173
npm test            # Run 1569 tests
npm run lint        # Code quality check
npm run build       # Production build
```
````

### Auto-Deployment

```bash
git push origin main  # Triggers CI/CD: Tests → Build → Deploy
```

View status: https://github.com/yupitsleen/HeritageTracker/actions

---

## 📁 Architecture

```
src/
├── api/                    # Supabase integration
│   ├── supabaseClient.ts   # Connection
│   ├── sites.ts            # CRUD endpoints
│   └── mockAdapter.ts      # Dev mock data
├── components/
│   ├── Layout/             # Header, Footer, Desktop/Mobile layouts
│   ├── FilterBar/          # Multi-select filters
│   ├── Map/                # Leaflet + clustering + glow layer
│   ├── Timeline/           # D3.js scrubber
│   ├── SitesTable/         # Virtual scrolling table
│   ├── AdvancedTimeline/   # 150+ ESRI Wayback imagery versions
│   └── [Stats, About, Modal, etc.]
├── hooks/                  # Reusable logic
│   ├── useSitesPaginated.ts  # Paginated fetching
│   ├── useSitesQuery.ts      # React Query caching
│   └── useDebounce.ts        # Filter optimization
├── contexts/               # Global state (theme, animation, calendar)
├── data/mockSites.ts       # 44 sites
└── utils/                  # Filters, formatters, calculations
```

**Refactoring Impact:**

- 870 lines reduced from main components
- 7 new hooks for reusable logic
- 11 new components for separation of concerns

See [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md) for details.

---

## 📖 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - AI assistant development guide
- **[DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md)** - Git workflow and quality gates
- **[API_CONTRACT.md](./API_CONTRACT.md)** - Supabase backend spec (v3.0)
- **[SCALING_IMPLEMENTATION_PLAN.md](./SCALING_IMPLEMENTATION_PLAN.md)** - Pagination + virtual scrolling
- **[docs/extensibility-status.md](docs/extensibility-status.md)** - Registry systems (22/27 complete)

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ COMPLETE

- [x] Interactive map, timeline, filters
- [x] 44 Gaza sites documented
- [x] Supabase backend integration
- [x] Scaling architecture (pagination, virtual scrolling, clustering)
- [x] 1569 tests passing
- [ ] Deploy Supabase backend (2-3 hours)
- [ ] Deploy to production (Vercel)

### Phase 2: Expansion (Next)

- [ ] Hundreds of Gaza sites
- [ ] User contribution system with verification

### Phase 3: Broader Scope (Future)

- [ ] West Bank sites
- [ ] International museum holdings
- [ ] Educational resources

---

## 📚 Data Sources

All sites verified by multiple authoritative sources:

1. **UNESCO** - Official heritage damage verification
2. **Forensic Architecture** - Satellite imagery and coordinates
3. **Heritage for Peace** - Ground documentation

**Research Methodology:** Site descriptions are original syntheses from multiple verified sources. Research assistance by Claude (Anthropic). All factual claims cross-referenced and cited. See [research documentation](docs/research/research_document.md).

---

## 🤝 Contributing

**Ways to Help:**

- Data collection and source verification
- Code contributions (check [issues](https://github.com/yupitsleen/HeritageTracker/issues))
- Arabic translation
- Testing and bug reports

**Standards:**

- Use conventional commits (`feat:`, `fix:`, `refactor:`)
- Write tests (minimum 5+ per component)
- Ensure 1569 tests pass before commit: `npm run lint && npm test`
- Follow patterns in CLAUDE.md and DEVELOPMENT_WORKFLOW.md

All changes auto-tested and deployed via CI/CD.

---

## ⚖️ Legal & Ethical

**Documentation and educational project** for cultural heritage preservation:

- All info from publicly available, verified sources
- Full attribution and citations
- Factual presentation without political advocacy
- Respects cultural sensitivity and Palestinian heritage

---

## 🌍 Related Projects

- [Forensic Architecture](https://forensic-architecture.org/) - Spatial investigations
- [Syria Heritage Initiative](https://uchicago.edu/shi/) - Syrian heritage documentation
- [Nakba Archive](https://www.nakba-archive.org/) - Palestinian oral history

---

## 🙏 Acknowledgments

Built on documentation by UNESCO, Forensic Architecture, Heritage for Peace, Palestinian Museum, Institute for Palestine Studies, ICOMOS Palestine, and countless researchers.

---

**"Cultural heritage belongs to all of humanity. Its destruction is everyone's loss."**

---

_Version 2.0.0-dev | 44 sites | 1569 tests | Supabase-ready | Production-ready scaling_

```

```
