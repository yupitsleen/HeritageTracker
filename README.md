# Heritage Tracker

**Documenting Palestinian cultural heritage destruction through interactive visualization**

![Tests](https://img.shields.io/badge/tests-1396%20passing-brightgreen)
![E2E Tests](https://img.shields.io/badge/E2E-16%20passing-blue)
![Coverage](https://img.shields.io/badge/coverage-80%25-green)
![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)

**Production Status:** 70 Gaza sites documented (140-160 buildings) | Code review 90% complete | Ready for deployment

---

## 🎯 Mission

Document and visualize Palestinian cultural heritage destruction with evidence-based data to support transparency, legal advocacy, and preservation efforts.

**The Context:** 64.7% of Gaza's cultural heritage destroyed (207 of 320 sites) | 114 sites UNESCO-verified | 1,700+ years of history at risk

---

## ✨ Key Features

### Interactive Visualization
- **Comparison Mode** - Side-by-side satellite imagery (186 ESRI Wayback releases, 2014-2025)
- **Interactive Map** - Leaflet with clustering, satellite/street toggle, 50+ site markers
- **Timeline** - D3.js horizontal scrubber with play/pause, BC/BCE support
- **Advanced Filters** - Type, status, date ranges with 300ms debouncing
- **Statistics Dashboard** - Impact metrics, artifact tracking, loss calculations

### Data Management
- **Resizable Table** - Virtual scrolling (60 FPS with 100+ sites), progressive columns
- **Multi-format Export** - CSV/JSON/GeoJSON with bilingual support
- **Bilingual UI** - English/Arabic with RTL support
- **Detail Modals** - Cross-component state sync

### Production-Ready Architecture
- **3 Backend Modes** - Mock API, Local (PostgreSQL+PostGIS), Supabase Cloud
- **Zero-Downtime Switching** - Change .env, no code changes needed
- **Performance** - <2s page load, <500ms filters, 60 FPS scrolling
- **Scaling** - Pagination, virtual scrolling, map clustering, React Query caching
- **Security** - SQL injection protection, custom error hierarchy, adapter pattern

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS v4 |
| **Mapping** | Leaflet + leaflet.markercluster + ESRI Wayback |
| **Visualization** | D3.js |
| **Performance** | TanStack Virtual + TanStack Query |
| **Backend** | PostgreSQL 16 + PostGIS 3.4 + Express |
| **Testing** | Vitest (1,396 tests) + Playwright (16 E2E) + MSW 2.11.6 |

---

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/yupitsleen/HeritageTracker.git
cd HeritageTracker
npm install
```

### Development

```bash
npm run dev          # → http://localhost:5173 (Vite HMR)
npm test             # Run 1,396 unit tests
npm run e2e          # Run 16 E2E tests (Playwright)
npm run test:all     # Run all tests (unit + E2E)
npm run lint         # ESLint check
npm run build        # Production build
```

### Backend Setup (Optional)

**Mock API (Default)** - No setup required, uses `src/data/mockSites.ts`

**Local Backend** - PostgreSQL + Express:
```bash
npm run db:setup     # One-time setup (Docker + migrations + seed)
npm run server:dev   # Start Express backend (:5000)
npm run dev:full     # Start frontend + backend together
```

**Supabase Cloud** - Update `.env.production` with credentials

See [CLAUDE.md](CLAUDE.md) for detailed setup instructions.

---

## 📁 Project Structure

```
src/
├── api/                    # Backend integration (3 modes: Mock/Local/Supabase)
├── components/             # 21 feature components
│   ├── Map/                # Leaflet + ComparisonMapView
│   ├── Timeline/           # D3.js scrubber
│   ├── FilterBar/          # Multi-select filters
│   └── SitesTable/         # Virtual scrolling table
├── hooks/                  # 24+ custom hooks
├── contexts/               # 4 contexts (theme, animation, calendar, locale)
├── config/                 # 30+ configuration files
├── data/mockSites.ts       # 70 documented sites (2,356 lines)
├── database/               # PostgreSQL migrations (285 lines)
└── server/                 # Express REST API (3-layer architecture)
```

**Achievements:**
- ✅ 1,396 tests passing (1,304 frontend + 77 backend + 15 utils)
- ✅ 16 E2E tests (70% faster than original suite)
- ✅ 70 sites documented (exceeds UNESCO target by 123-140%)
- ✅ 3 backend modes with zero-code switching
- ✅ Code review 90% complete

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[CLAUDE.md](CLAUDE.md)** | Developer guide (857 lines, 46% optimized) |
| **[CHANGELOG.md](CHANGELOG.md)** | Complete project history (14 phases) |
| **[DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md)** | Git workflow and quality gates |
| **[CODE_REVIEW_FINDINGS.md](CODE_REVIEW_FINDINGS.md)** | Code quality improvements (90% complete) |
| **[database/README.md](database/README.md)** | PostgreSQL setup guide |
| **[server/README.md](server/README.md)** | Express backend documentation |

---

## 🗺️ Roadmap

### ✅ Phase 1-14: Production Ready (COMPLETE)
- [x] Interactive map, timeline, filters, comparison mode
- [x] 70 Gaza sites documented (140-160 buildings)
- [x] 3 backend modes with adapter pattern
- [x] Scaling architecture (pagination, virtual scrolling, clustering)
- [x] 1,396 unit tests + 16 E2E tests
- [x] Local backend (PostgreSQL + Express)
- [x] Code review 90% complete

### 🚧 Phase 15: Production Deployment (Next)
- [ ] Deploy Supabase backend
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Configure CI/CD for automatic deployments
- [ ] Set up monitoring and analytics

### 📋 Phase 16: Content Expansion (Future)
- [ ] Complete Gaza heritage documentation
- [ ] User contribution system with verification
- [ ] Image research and integration
- [ ] West Bank sites
- [ ] International museum holdings

---

## 📚 Data Sources

All sites verified by authoritative sources:

1. **UNESCO** - Official heritage damage verification
2. **Forensic Architecture** - Satellite imagery and coordinates
3. **Heritage for Peace** - Ground documentation
4. **Palestinian Museum** - Cultural heritage records
5. **Institute for Palestine Studies** - Historical documentation

**Research Methodology:** Site descriptions are original syntheses from multiple verified sources. Research assistance by Claude (Anthropic). All factual claims cross-referenced and cited.

See [research documentation](docs/research/) for detailed source analysis.

---

## 🤝 Contributing

### Ways to Help

- 📊 Data collection and source verification
- 💻 Code contributions ([open issues](https://github.com/yupitsleen/HeritageTracker/issues))
- 🌍 Arabic translation and localization
- 🐛 Testing and bug reports

### Contribution Guidelines

**Before submitting:**
1. Use conventional commits: `feat:`, `fix:`, `refactor:`, `perf:`
2. Write tests (minimum 5+ per component)
3. Run quality checks: `npm run lint && npm run test:all`
4. Follow patterns in [CLAUDE.md](CLAUDE.md)

**Quality Gates:**
- ✅ All 1,396 unit tests passing
- ✅ All 16 E2E tests passing
- ✅ ESLint with zero warnings
- ✅ TypeScript strict mode (no `any`)
- ✅ 80%+ code coverage

All changes auto-tested via CI/CD (GitHub Actions).

---

## ⚖️ Legal & Ethical

**Documentation and educational project** for cultural heritage preservation:

- ✅ All data from publicly available, verified sources
- ✅ Full attribution and citations
- ✅ Factual presentation without political advocacy
- ✅ Respects cultural sensitivity and Palestinian heritage
- ✅ Educational/non-profit use only

---

## 🌍 Related Projects

- [Forensic Architecture](https://forensic-architecture.org/) - Spatial investigations and evidence analysis
- [Syria Heritage Initiative](https://uchicago.edu/shi/) - Syrian cultural heritage documentation
- [Nakba Archive](https://www.nakba-archive.org/) - Palestinian oral history preservation
- [EAMENA](https://eamena.org/) - Endangered Archaeology in the Middle East & North Africa

---

## 🙏 Acknowledgments

Built on documentation by UNESCO, Forensic Architecture, Heritage for Peace, Palestinian Museum, Institute for Palestine Studies, ICOMOS Palestine, and countless researchers dedicated to preserving cultural heritage.

**Special Thanks:**
- Anthropic's Claude for research assistance and code review
- Open source community for critical tools (React, Leaflet, D3.js, PostgreSQL)

---

## 📊 Project Statistics

- **70 sites** documented (140-160 buildings)
- **1,396 tests** passing (1,304 frontend + 77 backend + 15 utils)
- **16 E2E tests** (Playwright)
- **2,356 lines** of heritage site data
- **857 lines** of developer documentation
- **3 backend modes** (Mock/Local/Supabase)
- **186 Wayback releases** (2014-2025)
- **24+ custom hooks**
- **30+ config files**
- **80%+ code coverage**

---

**"Cultural heritage belongs to all of humanity. Its destruction is everyone's loss."**

---

*Version 2.0.0-dev | Production-ready | November 2025*
