# HeritageTracker
Heritage Tracker: Documenting displaced and destroyed cultural heritage 
Currently tracking: Gaza 2023-2024 destruction

# Palestinian Heritage Tracker

**Documenting the displacement and destruction of Palestinian cultural heritage through interactive visualization.**

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![Phase](https://img.shields.io/badge/phase-MVP-blue)
![License](https://img.shields.io/badge/license-TBD-lightgrey)

---

## 🎯 Mission

This project documents and visualizes the systematic destruction and looting of Palestinian cultural heritage from 1948 to present. Our goal is to create a comprehensive, publicly accessible resource that supports transparency, legal advocacy, and cultural preservation efforts.

**Phase 1 MVP focuses on:** The 20-25 most significant heritage sites destroyed or damaged in Gaza during the 2023-2024 conflict.

## 📊 The Scale

- **64.7%** of Gaza's cultural heritage destroyed in 6 months (207 of 320 sites)
- **79%** of mosques destroyed or damaged
- **110 sites** officially verified by UNESCO
- **1,700+ years** of history reduced to rubble

## ✨ Features (MVP)

### Interactive Map
- Visual representation of 20-25 significant Gaza heritage sites
- Color-coded markers showing destruction status
- Before/after imagery for each site
- Detailed historical context

### Timeline Visualization  
- See destruction progression from October 2023 to present
- Animated playback showing how sites disappeared
- Key dates and escalation points marked

### Verified Data
- All sites verified by UNESCO, Forensic Architecture, or Heritage for Peace
- Full source citations for every claim
- Satellite imagery and ground documentation

## 🏛️ Featured Sites Include

- **Great Omari Mosque** (7th century) - Gaza's oldest mosque with 62 rare manuscripts
- **Church of St. Porphyrius** (5th century) - World's third-oldest church
- **Saint Hilarion Monastery** (1,700 years old)
- **Qasr Al-Basha** (13th century Mamluk palace/museum)
- **Blakhiyya Archaeological Site** (ancient seaport, 800 BCE-1100 CE)
- And 15-20 more significant sites

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Mapping:** Mapbox GL JS
- **Visualization:** D3.js
- **Deployment:** Vercel/Netlify
- **Data:** Static JSON (no database for MVP)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Mapbox API key (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/palestinian-heritage-tracker.git
cd palestinian-heritage-tracker

# Install dependencies
npm install

# Create .env file with your Mapbox token
echo "VITE_MAPBOX_TOKEN=your_token_here" > .env

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Map/            # Map component and markers
│   ├── Timeline/       # Timeline visualization
│   ├── DetailPanel/    # Site detail view
│   └── Layout/         # Header, footer, nav
├── data/               # Static JSON data files
│   └── sites.json      # Heritage sites data
├── types/              # TypeScript definitions
├── utils/              # Helper functions
└── App.tsx             # Main app component
```

## 📖 Documentation

- **[README](./README.md)** - Project overview and getting started
- **[CLAUDE.md](./CLAUDE.md)** - Complete project context for AI assistants
- **[Research & Feasibility Study](./docs/research/heritage-tracking-feasibility-study.md)** - Comprehensive research on data sources, legal frameworks, and implementation strategy
- **[Sources](./docs/SOURCES.md)** - Complete bibliography and data sources
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute (coming soon)

## 📚 Data Sources

All data is verified by multiple authoritative sources:

1. **UNESCO** - Official heritage damage verification
2. **Forensic Architecture** - Satellite imagery and digital investigation
3. **Heritage for Peace** - Ground documentation and reporting

Every site includes full source citations and links to original documentation.

## 🗺️ Roadmap

### Phase 1: MVP (Current) - 4 weeks
- [x] Project setup and planning
- [ ] Data collection (20-25 Gaza sites)
- [ ] Interactive map implementation
- [ ] Timeline visualization
- [ ] Detail panels with images
- [ ] Launch and gather feedback

### Phase 2: Expansion (Future)
- [ ] Expand to all 110 UNESCO-verified Gaza sites
- [ ] Add 70,000 looted books dataset (1948 Nakba)
- [ ] Add Steinhardt repatriation case study
- [ ] Database integration (Supabase)
- [ ] User contribution system

### Phase 3: Broader Scope (Future)
- [ ] West Bank heritage sites
- [ ] International museum holdings
- [ ] Art market tracking
- [ ] Educational resources
- [ ] Mobile app (PWA)

## 🤝 Contributing

We welcome contributions from researchers, developers, designers, and anyone passionate about cultural heritage preservation.

**How to help:**
- **Data:** Help verify site information or find additional sources
- **Code:** Check our [issues](https://github.com/yourusername/palestinian-heritage-tracker/issues) for tasks
- **Design:** Improve UI/UX or create graphics
- **Translation:** Help translate content to Arabic
- **Documentation:** Improve guides and documentation

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines (coming soon).

## ⚖️ Legal & Ethical

This is a documentation and educational project aimed at preserving cultural heritage records. All information is:

- Sourced from publicly available data
- Verified by authoritative organizations
- Cited with full attribution
- Presented factually without political advocacy

For corrections or concerns, please open an issue or contact us.

## 🌍 Related Projects

- [Forensic Architecture](https://forensic-architecture.org/) - Spatial analysis and investigations
- [Syria Heritage Initiative](https://uchicago.edu/shi/) - Syrian cultural heritage documentation
- [Nakba Archive](https://www.nakba-archive.org/) - Palestinian oral history

## 📬 Contact

- **Issues:** [GitHub Issues](https://github.com/yourusername/palestinian-heritage-tracker/issues)
- **Email:** [your-email@example.com]
- **Twitter/X:** [@yourhandle]

## 🙏 Acknowledgments

This project builds on research and documentation by:
- Palestinian Museum and Digital Archive
- Institute for Palestine Studies
- UNESCO
- Forensic Architecture
- Heritage for Peace
- ICOMOS Palestine
- Countless researchers and journalists documenting Palestinian heritage

## 📄 License

[To be determined - likely MIT for code, Creative Commons for data]

---

**"Cultural heritage belongs to all of humanity. Its destruction is everyone's loss."**

---

*Last updated: October 2025 | Version: 0.1.0-alpha*
