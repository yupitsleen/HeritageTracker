# Heritage Tracker

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS v4 |
| **Mapping** | Leaflet + leaflet.markercluster + ESRI Wayback |
| **Visualization** | D3.js |
| **Performance** | TanStack Virtual + TanStack Query |
| **Backend** | PostgreSQL 16 + PostGIS 3.4 + Express |
| **Testing** | Vitest (1,465 tests) + Playwright (16 E2E) + MSW 2.11.6 |

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
npm test             # Run 1,465 unit tests
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
├── pages/                  # 7 pages (Dashboard, Timeline, Data, Stats, About, Donate, HowItWorks)
├── hooks/                  # 24+ custom hooks
├── contexts/               # 4 contexts (theme, animation, calendar, locale - en/ar/it)
├── config/                 # 30+ configuration files
├── data/mockSites.ts       # 70 documented sites (2,356 lines)
├── database/               # PostgreSQL migrations (285 lines)
└── server/                 # Express REST API (3-layer architecture)
```


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


## 📚 Data Sources

All sites verified by authoritative sources:

1. **UNESCO** - Official heritage damage verification
2. **Forensic Architecture** - Satellite imagery and coordinates
3. **Heritage for Peace** - Ground documentation
4. **Palestinian Museum** - Cultural heritage records
5. **Institute for Palestine Studies** - Historical documentation

**Research Methodology:** Site descriptions are AI syntheses from multiple verified sources. Research assistance by Claude (Anthropic).

See [research documentation](docs/research/) for detailed source analysis.

--

## 🌍 Related Projects by others

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
