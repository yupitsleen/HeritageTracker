# Heritage Tracker

**Documenting the destruction of Palestinian cultural heritage through interactive visualization.**

![Project Status](https://img.shields.io/badge/status-production-brightgreen)
![Tests](https://img.shields.io/badge/tests-107%20passing-brightgreen)
![Deployment](https://img.shields.io/badge/deployment-live-success)
![License](https://img.shields.io/badge/license-TBD-lightgrey)

**🌐 Live Site:** https://yupitsleen.github.io/HeritageTracker/

**Currently tracking:** 18 of 20-25 significant Gaza heritage sites destroyed during 2023-2024 conflict

---

## 🎯 Mission

Document and visualize the destruction of Palestinian cultural heritage with evidence-based, publicly accessible data to support transparency, legal advocacy, and preservation efforts.

**MVP Phase 1:** Interactive documentation of 20-25 most significant Gaza heritage sites (2023-2024)

## 📊 The Context

- **64.7%** of Gaza's cultural heritage destroyed in 6 months (207 of 320 sites)
- **110 sites** officially verified by UNESCO
- **1,700+ years** of history documented

## ✨ Current Features

### ✅ Live in Production

- **Interactive map** with Leaflet (color-coded status markers, centered sticky positioning)
- **Advanced filtering** (type, status, date ranges, BC/BCE handling, compact text-[10px] design)
- **Timeline visualization** with D3.js (320px width, 10% red background, sticky)
- **Mobile-optimized table** (accordion view, Type column removed for space efficiency)
- **CSV Export** with RFC 4180 compliance (Arabic names, Islamic dates, coordinates)
- **Statistics Dashboard** with impact metrics and Looted Artifacts section
- **About/Methodology Page** with data sources and legal framework
- **Detail modals** with bilingual display (English/Arabic)
- **Cross-component highlighting** (map ↔ timeline ↔ table sync with black ring)
- **Accessible UI** with keyboard navigation and ARIA labels
- **Responsive design** with Palestinian flag-inspired theme
- **CI/CD Pipeline** with automated testing and deployment
- **Comprehensive test suite** (107 tests including mobile variants, CSV export, Stats/About)

### 🚧 In Progress

- SEO optimization (meta tags, structured data)
- Performance improvements (code splitting, bundle optimization)
- Expanding to 20-25 sites (currently 18 completed - 72% of MVP target)

## 🛠️ Tech Stack

- **React 19** + **TypeScript 5.7** + **Vite 7**
- **Tailwind CSS v4** - Styling with custom Palestinian theme
- **Leaflet** - Interactive mapping
- **D3.js** - Timeline visualization
- **Vitest** - Testing framework (107 tests passing)
- **GitHub Actions** - CI/CD automation
- **GitHub Pages** - Production hosting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone and install
git clone https://github.com/yupitsleen/HeritageTracker.git
cd HeritageTracker
npm install

# Start dev server
npm run dev
# Visit http://localhost:5173
```

### Development Commands

```bash
npm run dev          # Dev server with HMR (localhost:5173)
npm test            # Run test suite (107 tests)
npm run lint        # ESLint code quality check
npm run build       # Production build
npm run preview     # Preview production build
```

### Deployment

The project automatically deploys to GitHub Pages on every push to `main`:

```bash
git push origin main  # Triggers CI/CD: Tests → Build → Deploy
```

View deployment status: https://github.com/yupitsleen/HeritageTracker/actions

## 📁 Project Structure

```
src/
├── components/
│   ├── FilterBar/       # Compact filters (text-[10px]) with mobile search
│   ├── Map/            # Leaflet map (centered sticky positioning)
│   ├── Timeline/       # D3.js timeline (320px, 10% red background, sticky)
│   ├── SitesTable/     # Desktop + mobile accordion variants with CSV export
│   ├── Stats/          # Statistics dashboard with impact metrics
│   ├── About/          # About/Methodology page
│   ├── SiteDetailPanel/ # Modal with bilingual content
│   └── Modal/          # Reusable modal component
├── data/
│   └── mockSites.ts    # Heritage sites data (18/20-25 complete)
├── types/
│   └── index.ts        # TypeScript interfaces
├── utils/              # Shared utilities and constants
└── styles/
    └── theme.ts        # Centralized Palestinian flag colors
.github/
└── workflows/
    └── deploy.yml      # CI/CD pipeline for GitHub Pages
```

## 📖 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete development context for AI assistants
- **[CURRENT_SESSION.md](./CURRENT_SESSION.md)** - Active development session log
- **[Research Study](./docs/research/research-document.md)** - Data sources and legal framework
- **[SOURCES.md](./docs/SOURCES.md)** - Bibliography and citations

## 🗺️ Development Roadmap

### Phase 1: MVP ✅ COMPLETE - LIVE IN PRODUCTION

- [x] Project setup and architecture
- [x] Interactive map implementation (centered sticky positioning)
- [x] Timeline visualization (320px, 10% red background, sticky)
- [x] Advanced filtering system (compact text-[10px] design)
- [x] Detail modals with bilingual support
- [x] Cross-component state management
- [x] Mobile optimization (accordion table, compact filters)
- [x] CSV Export functionality (RFC 4180 compliant)
- [x] Statistics dashboard with impact metrics
- [x] About/Methodology page
- [x] Comprehensive test suite (107 tests including mobile variants, CSV, Stats, About)
- [x] CI/CD pipeline with GitHub Actions
- [x] **DEPLOYED TO PRODUCTION:** https://yupitsleen.github.io/HeritageTracker/
- [ ] Complete 20-25 Gaza sites data collection (18/20-25 ✅ 72%)
- [ ] SEO optimization

### Phase 2: Expansion (Future)

- [ ] All 110 UNESCO-verified Gaza sites
- [ ] 70,000 looted books dataset (1948 Nakba)
- [ ] Database integration (Supabase)
- [ ] User contribution system
- [ ] Arabic translation

### Phase 3: Broader Scope (Future)

- [ ] West Bank heritage sites
- [ ] International museum holdings
- [ ] Educational resources
- [ ] Mobile PWA

## 📚 Data Sources & Research Methodology

All sites verified by multiple authoritative sources with full citations:

1. **UNESCO** - Official heritage damage verification
2. **Forensic Architecture** - Satellite imagery and coordinates
3. **Heritage for Peace** - Ground documentation

**Research & Content Attribution:** Site descriptions and historical information are original syntheses created by combining factual data from multiple verified sources. Research assistance provided by Claude (Anthropic). All factual claims (dates, coordinates, artifact counts, destruction dates) are cross-referenced against multiple sources and cited accordingly. Narrative descriptions are original summaries of publicly available information, not direct quotations. See [research documentation](docs/research/research_document.md) for detailed methodology and sources.

## 🤝 Contributing

We welcome contributions! Ways to help:

- **Data Collection:** Verify site information, find additional sources
- **Code:** Check [issues](https://github.com/yupitsleen/HeritageTracker/issues) for tasks
- **Translation:** Help translate to Arabic
- **Testing:** Report bugs or improve test coverage

**Development Standards:**

- Follow existing patterns in CLAUDE.md
- Write tests for new features (including mobile variants)
- Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- Ensure all 107 tests pass before committing
- All changes automatically tested and deployed via CI/CD

## ⚖️ Legal & Ethical Framework

This is a **documentation and educational project** for cultural heritage preservation:

- All information from publicly available, verified sources
- Full attribution and citations for every claim
- Factual presentation without political advocacy
- Respects cultural sensitivity and Palestinian heritage

## 🌍 Related Projects

- [Forensic Architecture](https://forensic-architecture.org/) - Spatial investigations
- [Syria Heritage Initiative](https://uchicago.edu/shi/) - Syrian heritage documentation
- [Nakba Archive](https://www.nakba-archive.org/) - Palestinian oral history

## 🙏 Acknowledgments

This project builds on documentation by UNESCO, Forensic Architecture, Heritage for Peace, Palestinian Museum, Institute for Palestine Studies, ICOMOS Palestine, and countless researchers documenting Palestinian heritage.

---

**"Cultural heritage belongs to all of humanity. Its destruction is everyone's loss."**

---

_Last updated: October 11, 2025 | Version: 1.0.0 | 🚀 Live in Production | 18 of 20-25 sites documented (72% to target)_

**Live Site:** https://yupitsleen.github.io/HeritageTracker/
