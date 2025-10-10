# Heritage Tracker

**Documenting the destruction of Palestinian cultural heritage through interactive visualization.**

![Project Status](https://img.shields.io/badge/status-mvp%20phase%201-green)
![Tests](https://img.shields.io/badge/tests-38%20passing-brightgreen)
![License](https://img.shields.io/badge/license-TBD-lightgrey)

**Currently tracking:** 5 of 20-25 significant Gaza heritage sites destroyed during 2023-2024 conflict

---

## 🎯 Mission

Document and visualize the destruction of Palestinian cultural heritage with evidence-based, publicly accessible data to support transparency, legal advocacy, and preservation efforts.

**MVP Phase 1:** Interactive documentation of 20-25 most significant Gaza heritage sites (2023-2024)

## 📊 The Context

- **64.7%** of Gaza's cultural heritage destroyed in 6 months (207 of 320 sites)
- **110 sites** officially verified by UNESCO
- **1,700+ years** of history documented

## ✨ Current Features

### ✅ Implemented

- Interactive map with Leaflet (custom zoom controls)
- Advanced filtering (type, status, date ranges, BC/BCE handling)
- Timeline visualization with D3.js
- Detail modals with bilingual display (English/Arabic RTL)
- Cross-component highlighting (map ↔ timeline ↔ cards sync)
- Accessible UI with keyboard navigation
- Responsive design with Palestinian flag-inspired theme
- Comprehensive test suite (38 tests)

### 🚧 In Progress

- Expanding to 20-25 sites (currently 5 completed)
- Historical imagery integration
- Source citation tooltips

## 🛠️ Tech Stack

- **React 19** + **TypeScript 5.7** + **Vite 7**
- **Tailwind CSS v4** - Styling with custom Palestinian theme
- **Leaflet** - Interactive mapping
- **D3.js** - Timeline visualization
- **Vitest** - Testing framework (38 tests passing)

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
npm run dev          # Dev server with HMR
npm test            # Run test suite (38 tests)
npm run lint        # ESLint code quality check
npm run build       # Production build
npm run preview     # Preview production build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── FilterBar/       # Multi-select dropdown filters
│   ├── Map/            # Leaflet map with custom controls
│   ├── Timeline/       # D3.js timeline visualization
│   ├── SiteDetailPanel/ # Modal with bilingual content
│   └── SiteCards/      # Grid display with highlighting
├── data/
│   └── sites.json      # Heritage sites data (5/20-25 complete)
├── types/
│   └── index.ts        # TypeScript interfaces
└── utils/              # Shared utilities and constants
```

## 📖 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete development context for AI assistants
- **[CURRENT_SESSION.md](./CURRENT_SESSION.md)** - Active development session log
- **[Research Study](./docs/research/research-document.md)** - Data sources and legal framework
- **[SOURCES.md](./docs/SOURCES.md)** - Bibliography and citations

## 🗺️ Development Roadmap

### Phase 1: MVP (Current) ✅ 90% Complete

- [x] Project setup and architecture
- [x] Interactive map implementation
- [x] Timeline visualization
- [x] Advanced filtering system
- [x] Detail modals with bilingual support
- [x] Cross-component state management
- [x] Comprehensive test suite
- [ ] Complete 20-25 Gaza sites data collection (5/20-25)
- [ ] Historical imagery integration
- [ ] Launch MVP

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

## 📚 Data Sources

All sites verified by multiple authoritative sources with full citations:

1. **UNESCO** - Official heritage damage verification
2. **Forensic Architecture** - Satellite imagery and coordinates
3. **Heritage for Peace** - Ground documentation

## 🤝 Contributing

We welcome contributions! Ways to help:

- **Data Collection:** Verify site information, find additional sources
- **Code:** Check [issues](https://github.com/yupitsleen/HeritageTracker/issues) for tasks
- **Translation:** Help translate to Arabic
- **Testing:** Report bugs or improve test coverage

**Development Standards:**

- Follow existing patterns in CLAUDE.md
- Write tests for new features
- Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- Ensure all 38 tests pass before committing

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

_Last updated: October 2025 | Version: 0.2.0-alpha | 5 of 20-25 sites documented_
