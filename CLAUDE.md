# Heritage Tracker - AI Assistant Context

## Quick Navigation

- [Project Overview](#project-overview) - Mission and purpose
- [Quick Reference](#quick-reference) - Commands and current MVP scope
- [MCP Servers](#mcp-servers-for-development) - Recommended MCP servers to enhance AI assistance
- [Critical Development Rules](#critical-development-rules) - Git workflow and quality gates
- [Project Architecture](#project-architecture) - Structure and patterns
- [MVP Scope](#mvp-scope-gaza-heritage-destruction---greatest-hits) - Current focus (20-25 sites)
- [Development Preferences](#development-preferences) - Coding standards and approach
- [Data Schema](#data-schema) - TypeScript interfaces
- [Features & Components](#phase-1-mvp-features-simplified-for-gaza-focus) - What to build
- [Important Considerations](#important-considerations) - Legal, cultural, technical priorities

---

## Project Overview

**Heritage Tracker** is a web application that documents and visualizes the displacement, looting, and destruction of Palestinian cultural heritage. The goal is to create a comprehensive, publicly accessible database that supports transparency, legal advocacy, and cultural preservation efforts.

**Phase 1 MVP Focus:** Gaza heritage destruction (2023-2024) - 20-25 most significant sites

## Mission & Purpose

This project aims to:

- Document the systematic appropriation of Palestinian cultural heritage
- Visualize the scale and patterns of cultural displacement over time
- Support repatriation efforts with structured evidence
- Raise public awareness about ongoing cultural erasure
- Provide a tool for researchers, legal advocates, and educators

**Core principle:** Evidence-based documentation with clear source citations for every claim.

## Target Audience

- Researchers and academics studying cultural heritage
- Legal advocates working on repatriation cases
- Palestinian cultural organizations
- Journalists covering heritage issues
- General public interested in cultural justice
- Educators teaching about Palestine and cultural preservation

## MCP Servers for Development

**Model Context Protocol (MCP)** servers extend AI assistant capabilities by giving them direct access to tools and data sources. The following MCP servers are recommended for HeritageTracker development to enhance your workflow with Claude Code in VS Code.

### Recommended MCP Servers by Priority

#### Phase 1 (MVP Development) - Install Now

**1. Google Maps MCP Server** ⭐ CRITICAL

- **Purpose:** Geocoding, place search, elevation data for heritage site mapping
- **Use cases:**
  - Convert site addresses to coordinates automatically
  - Validate coordinate accuracy for Gaza locations
  - Get place details for heritage sites
  - Calculate distances between sites
- **Installation:**
  ```bash
  npx @modelcontextprotocol/server-google-maps
  ```
- **Configuration:** Requires `GOOGLE_MAPS_API_KEY` environment variable
- **Documentation:** https://github.com/modelcontextprotocol/servers

**2. File System MCP Server** ⭐ HIGH PRIORITY

- **Purpose:** Read/write local files, manage data files
- **Use cases:**
  - Create and update JSON data files for heritage sites
  - Manage image assets locally
  - Organize research documents
  - Generate data files from research
- **Installation:**
  ```bash
  npx @modelcontextprotocol/server-filesystem
  ```
- **Configuration:** Specify allowed directories in MCP config
- **Security:** Restricts access to specified paths only

**3. GitHub MCP Server** ⭐ HIGH PRIORITY

- **Purpose:** Repository management, issue tracking, code review
- **Use cases:**
  - Create and update GitHub issues from conversations
  - Review pull requests
  - Make commits and push changes
  - Track project progress
- **Installation:**
  ```bash
  npx @modelcontextprotocol/server-github
  ```
- **Configuration:** Requires `GITHUB_PERSONAL_ACCESS_TOKEN`
- **Documentation:** https://github.com/modelcontextprotocol/servers

#### Phase 2 (Data Collection & Research) - Install When Ready

**4. Firecrawl MCP Server** ⭐ MEDIUM-HIGH PRIORITY

- **Purpose:** Web scraping and data extraction for heritage documentation
- **Use cases:**
  - Scrape UNESCO heritage reports for site data
  - Extract information from news articles about destruction
  - Gather data from Forensic Architecture platform
  - Collect structured data from Heritage for Peace reports
  - Extract metadata from academic papers
- **Installation:**
  ```bash
  npx firecrawl-mcp
  ```
- **Configuration:** Requires `FIRECRAWL_API_KEY` from https://firecrawl.dev
- **Features:** Structured extraction, batch operations, markdown conversion
- **Documentation:** https://github.com/firecrawl/firecrawl-mcp-server
- **Alternative:** MCP WebScraper (https://github.com/MaitreyaM/WEB-SCRAPING-MCP)

**5. Brave Search MCP Server** ⭐ MEDIUM PRIORITY

- **Purpose:** Web search for research and verification
- **Use cases:**
  - Research heritage sites and find sources
  - Verify facts about destruction dates
  - Find academic papers and reports
  - Locate before/after images
- **Installation:**
  ```bash
  npx @modelcontextprotocol/server-brave-search
  ```
- **Configuration:** Requires Brave Search API key
- **Documentation:** https://brave.com/search/api/

#### Phase 3 (When Adding Backend) - Future

**6. PostgreSQL MCP Server**

- **Purpose:** Database access when migrating to Supabase
- **Use cases:**
  - Query heritage site database
  - Manage schema migrations
  - Analyze data patterns
  - Performance optimization
- **Options:**
  - **Postgres MCP Pro:** Performance tuning, health checks (https://github.com/crystaldba/postgres-mcp)
  - **Reference PostgreSQL MCP:** Simple read-only access
  - **Supabase MCP:** Direct Supabase integration
- **Install when:** You set up Supabase backend in Phase 2

### VS Code MCP Configuration

Add MCP servers to your VS Code settings. Press `Ctrl+Shift+P` and select "Preferences: Open User Settings (JSON)", then add:

```json
{
  "mcp": {
    "servers": {
      "google-maps": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-google-maps"],
        "env": {
          "GOOGLE_MAPS_API_KEY": "YOUR_API_KEY_HERE"
        }
      },
      "filesystem": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-filesystem",
          "/path/to/HeritageTracker"
        ]
      },
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
        }
      }
    }
  }
}
```

### Getting API Keys

**Google Maps API:**

1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Enable Maps JavaScript API, Geocoding API, Places API
4. Create credentials → API Key
5. Restrict key to your domain/IP for security

**GitHub Personal Access Token:**

1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Copy token immediately (shown only once)

**Firecrawl API Key:**

1. Sign up at https://firecrawl.dev
2. Get API key from dashboard
3. Free tier available for testing

### Using MCP Servers with Claude Code

Once configured, Claude Code can:

**Research & Data Collection:**

- "Search for UNESCO reports on Gaza heritage destruction and extract site data"
- "Scrape the Forensic Architecture Gaza page and create JSON entries for each site"
- "Find coordinates for Great Omari Mosque in Gaza using Google Maps"

**File Management:**

- "Create a new JSON file for this heritage site with all required fields"
- "Update manuscripts.json to add these 5 new entries"
- "Read the current sites.json and show me all destroyed mosques"

**Project Management:**

- "Create a GitHub issue for implementing the timeline component"
- "Update issue #12 with the latest progress on map markers"
- "Review the open issues related to data collection"

**Map Development:**

- "Geocode these 10 Gaza heritage site addresses and add coordinates to the JSON"
- "Verify that all site coordinates fall within Gaza Strip boundaries"
- "Calculate the center point for these heritage sites to set default map view"

### MCP Benefits for This Project

**Faster Data Collection:** Claude can directly scrape and structure data from your three primary sources (UNESCO, Forensic Architecture, Heritage for Peace) instead of you manually copying information.

**Automated Geocoding:** Convert site addresses to coordinates automatically rather than looking them up one by one.

**Seamless Project Management:** Create and update GitHub issues during conversations about features without switching contexts.

**Local File Operations:** Claude can create, read, and update your JSON data files directly, maintaining proper formatting and structure.

**Research Acceleration:** Search and extract information from web sources while maintaining citations and sources.

### Important Notes

- **Privacy:** MCP servers run locally and only access what you explicitly configure
- **Security:** Use API key restrictions and only grant necessary permissions
- **Cost:** Most MCP servers are free; some APIs (Google Maps, Firecrawl) have free tiers then paid usage
- **Optional:** MCP servers enhance but aren't required - you can develop without them
- **Documentation:** See https://modelcontextprotocol.io/ for full MCP documentation

## Critical Development Rules

[Rest of the document continues unchanged...]

## Tech Stack

### Phase 1 (Current - Frontend Only)

- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Mapping:** Mapbox GL JS (or Leaflet as alternative)
- **Visualization:** D3.js for timelines and data viz
- **Deployment:** Vercel or Netlify
- **Data Storage:** Static JSON files (no database yet)
- **AI Development Tools:** Claude Code with MCP servers (see MCP Servers section)

### Phase 2 (Future)

- **Database:** Supabase (PostgreSQL + PostGIS)
- **API:** Supabase auto-generated REST API
- **Authentication:** Supabase Auth (for contributions)

## Project Structure

```
HeritageTracker/
├── src/
│   ├── components/          # React components
│   │   ├── Map/            # Map-related components
│   │   ├── Timeline/       # Timeline visualization
│   │   ├── DetailPanel/    # Item detail view
│   │   ├── Filters/        # Search and filter UI
│   │   └── Layout/         # Header, footer, navigation
│   ├── data/               # Static JSON data files
│   │   ├── manuscripts.json
│   │   ├── sites.json
│   │   └── sources.json
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styles
│   └── App.tsx             # Main app component
├── public/                 # Static assets (images, etc.)
├── docs/                   # Documentation
└── research/               # Research documents and sources
```

## Data Schema

### Core Types

```typescript
interface HeritageItem {
  id: string;
  type: "manuscript" | "archaeological" | "building" | "artifact" | "site";
  title: string;
  titleArabic?: string;
  description: string;
  descriptionArabic?: string;

  // Provenance
  originalOwner?: string;
  originalLocation: string;
  coordinates: [number, number]; // [longitude, latitude]

  // Displacement details
  yearTaken?: number;
  dateTaken?: string;
  takenBy?: string;
  circumstances?: string;

  // Current status
  status: "destroyed" | "looted" | "repatriated" | "disputed" | "unknown";
  currentLocation?: string;
  lastKnownLocation?: string;
  currentInstitution?: string;

  // Documentation
  sources: Source[];
  images?: Image[];
  relatedItems?: string[]; // IDs of related items

  // Metadata
  culturalSignificance?: string;
  historicalPeriod?: string;
  estimatedValue?: string;
  legalStatus?: string;

  createdAt: string;
  updatedAt: string;
}

interface Source {
  type: "academic" | "journalism" | "official" | "documentation";
  title: string;
  author?: string;
  url?: string;
  date?: string;
  publisher?: string;
  description?: string;
}

interface Image {
  url: string;
  caption?: string;
  credit?: string;
  type: "before" | "after" | "current" | "historical" | "satellite";
  date?: string;
}
```

## Phase 1 MVP Features (Simplified for Gaza Focus)

### 1. Interactive Map of Gaza

- Display 20-25 heritage sites as markers on Gaza map
- Color-coded markers: Red=destroyed, Orange=heavily damaged, Yellow=damaged
- Click marker to open detail panel
- Simple filters: Site type (mosque/church/archaeological/museum/building)
- Zoom controls focused on Gaza Strip

### 2. Timeline Visualization

- Horizontal timeline: October 2023 → October 2025
- Slider to see destruction progression over time
- "Play" button to animate timeline
- Shows how sites disappeared month by month
- Key dates marked (start of conflict, major escalations)

### 3. Heritage Site Detail Panel

- Site name (English & Arabic)
- Type and historical period
- Description and significance
- What was lost (artifacts, manuscripts, etc.)
- Date destroyed/damaged
- Before/after image comparison
- Satellite imagery (if available)
- Full source citations with links
- Share button for specific site

### 4. Statistics Dashboard (Landing Page)

- **Large Impact Numbers:**
  - "64.7% of Gaza's heritage destroyed in 6 months"
  - "207 of 320 sites damaged or destroyed"
  - "79% of mosques destroyed or damaged"
- Timeline graph showing acceleration
- Breakdown by site type
- Call-to-action: "Explore the Map"

### 5. About/Methodology Page

- Explanation of the project
- Data sources and verification process
- How to read the map
- Disclaimer and legal information
- Contact information

## MVP Scope: Gaza Heritage Destruction - "Greatest Hits"

**Phase 1 focuses EXCLUSIVELY on 20-25 most significant heritage sites destroyed or damaged in Gaza (2023-2024).**

### Why This Scope?

- **Timely & urgent:** Destruction is ongoing and documented in real-time
- **Clean data:** UNESCO verified + Forensic Architecture + Heritage for Peace
- **Highly visual:** Before/after satellite imagery, dramatic timeline
- **Manageable:** Can ship in 3-4 weeks with high-quality curated data
- **Maximum impact:** 64.7% of Gaza's heritage destroyed in 6 months

### The 20-25 Sites to Document

**Priority Religious Sites:**

1. **Great Omari Mosque** - 7th century, Gaza's oldest mosque, 62 rare manuscripts destroyed
2. **Church of St. Porphyrius** - 5th century, world's third-oldest church
3. **Saint Hilarion Monastery** - Founded 1,700 years ago
4. **Al-Omari Mosque (Jabalia)** - 13th century Mamluk
5. **Katib al-Welaya Mosque** - Ottoman era

**Museums & Cultural Centers:** 6. **Qasr Al-Basha** - 13th century Mamluk palace, housed museum 7. **Al Qarara Museum** - 3,000 artifacts 8. **Rafah Museum** - 30 years of collecting 9. **Al-Israa University Museum** - ~3,000 objects

**Archaeological Sites:** 10. **Blakhiyya Archaeological Site** - Ancient seaport 800 BCE-1100 CE, 4,000+ objects 11. **Tell al-Ajjul** - Bronze Age site 12. **Anthedon (Teda) Harbor** - Ancient port 13. **Byzantine Church Complex (Jabalia)** 14. **Roman Cemetery (Tell al-Ajjul)**

**Historic Buildings:** 15. **Hammam al-Samra** - Historic Ottoman bathhouse 16. **Barquq Castle** - 14th century Mamluk 17. **Pasha's Palace** - Ottoman administrative center 18. **Al-Ghussein Cultural Center** 19. **Al-Saqqa House** - Traditional architecture 20. **Rashad al-Shawa Cultural Center**

### Data Points for Each Site

```json
{
  "id": "unique-slug",
  "name": "English name",
  "nameArabic": "Arabic name",
  "type": "mosque|church|archaeological|museum|historic-building",
  "yearBuilt": "7th century" or "1400+",
  "coordinates": [longitude, latitude],
  "status": "destroyed|heavily-damaged|damaged",
  "dateDestroyed": "2023-12-07",
  "description": "2-3 sentence description",
  "historicalSignificance": "Why this matters",
  "culturalValue": "What was lost",
  "verifiedBy": ["UNESCO", "Heritage for Peace", "Forensic Architecture"],
  "images": {
    "before": "url or local path",
    "after": "url or local path",
    "satellite": "url to satellite imagery"
  },
  "sources": [
    {
      "organization": "UNESCO",
      "title": "Gaza Heritage Damage Report",
      "url": "https://...",
      "date": "2024-05-27",
      "type": "official"
    }
  ]
}
```

### Primary Data Sources (Only 3!)

1. **UNESCO Official List**

   - 110 verified sites (we'll pick top 20-25)
   - Updated May 27, 2025
   - Most authoritative source
   - Link: UNESCO heritage damage reports

2. **Forensic Architecture**

   - Interactive Gaza platform
   - Satellite imagery analysis
   - Geospatial data with coordinates
   - Timeline of destruction events
   - Link: https://forensic-architecture.org/ (Gaza investigations)

3. **Heritage for Peace**
   - Initial report: 104 sites (Nov 2023)
   - Downloadable PDF reports
   - Ground documentation + satellite
   - Link: https://heritageforpeace.org/

### Data Collection Process

**Week 1: Research & Selection**

- [ ] Review UNESCO list and select 20-25 most significant sites
- [ ] Cross-reference with Forensic Architecture data
- [ ] Download Heritage for Peace reports
- [ ] Create master spreadsheet with all sites

**Week 2: Data Entry**

- [ ] Fill in all data points for each site
- [ ] Write 2-3 sentence descriptions
- [ ] Document historical significance
- [ ] Collect source URLs
- [ ] Verify coordinates on map

**Week 3: Images**

- [ ] Find before images for all 20-25 sites
- [ ] Find after/satellite images for key sites
- [ ] Ensure proper attribution/licensing
- [ ] Optimize images for web

**Week 4: Review & Launch**

- [ ] Validate all data
- [ ] Test on map
- [ ] Get feedback from Palestinian orgs (if possible)
- [ ] Final QA

### Future Phases (After MVP Launch)

**Phase 2:** Expand to full 110 UNESCO sites
**Phase 3:** Add 70,000 looted books dataset
**Phase 4:** Add Steinhardt repatriation case
**Phase 5:** Expand to broader heritage tracking

### Key Data Sources (MVP - Only 3 Sources!)

**1. UNESCO**

- Official verified list of heritage damage
- 110 sites documented as of May 2025
- Most authoritative source for international recognition
- Regular updates
- Access: UNESCO Gaza heritage reports (publicly available)

**2. Forensic Architecture**

- Interactive Gaza investigation platform
- Satellite imagery analysis with precise coordinates
- Timeline of destruction events
- Digital reconstruction and mapping
- Access: https://forensic-architecture.org/ Gaza investigations

**3. Heritage for Peace**

- Initial comprehensive report (104 sites, Nov 2023)
- Ground-based documentation + satellite imagery
- Detailed site descriptions
- Downloadable PDF reports
- Access: https://heritageforpeace.org/ reports section

**That's it!** Three sources only for MVP. No need to aggregate dozens of databases.

## Important Considerations

### Legal & Ethical

- **Disclaimer required:** This is documentation, not political advocacy
- **Source everything:** Every claim must have citation
- **Handle disputes carefully:** Mark contested items as "disputed"
- **Respect copyright:** Use fair use for educational/documentary purposes
- **Privacy:** No personal data collection from users

### Cultural Sensitivity

- **Bilingual:** Support both English and Arabic (including RTL layout)
- **Respectful tone:** Professional, evidence-based, not sensationalist
- **Palestinian voice:** Partner with Palestinian organizations for validation
- **Accessibility:** WCAG AA compliance for inclusive access

### Technical Priorities

- **Performance:** Fast loading, especially on slower connections
- **Mobile-first:** Responsive design that works great on phones
- **Offline-capable:** Consider PWA features for areas with limited connectivity
- **SEO:** Discoverable by researchers and journalists

## Development Workflow

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for consistent formatting
- Component naming: PascalCase for components, camelCase for utilities
- File structure: One component per file, index.ts for barrel exports
- Comments: JSDoc for public APIs, inline for complex logic

### Git Workflow

- Main branch is protected
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Commit messages: Conventional Commits format
  - `feat: add timeline component`
  - `fix: resolve map marker clustering issue`
  - `docs: update README with setup instructions`

### Testing

- Unit tests with Vitest
- Component tests with React Testing Library
- Test critical functionality: filtering, data display, map interactions
- Aim for >80% coverage of utility functions

### Deployment

- Automatic deployment from main branch via Vercel/Netlify
- Preview deployments for pull requests
- Environment variables for API keys (Mapbox)

## Current Status & Roadmap

### Completed

- [x] Research and data source identification
- [x] Project structure and planning
- [x] GitHub issues created
- [x] MCP server recommendations documented

### In Progress (Phase 1 MVP)

- [ ] MCP server setup in VS Code
- [ ] Project setup (React + TypeScript + Vite)
- [ ] Data schema definition
- [ ] Data collection for priority datasets
- [ ] Map component implementation
- [ ] Timeline visualization
- [ ] Detail panel component
- [ ] Filter system
- [ ] Content and design
- [ ] Documentation

### Future (Phase 2)

- Database migration to Supabase
- User contribution system
- API for external access
- Mobile app (PWA or React Native)
- Educational resources
- Expanded dataset (broader art market tracking)

## Getting Help from AI Assistants

When working with AI assistants on this project:

### What to provide

- This CLAUDE.md file for context
- Specific GitHub issue you're working on
- Relevant code files
- Error messages or specific problems

### Useful prompts

- "Help me implement [feature] according to the data schema"
- "Review this component for accessibility issues"
- "Suggest how to structure this data for [use case]"
- "Help me write tests for this utility function"
- "How should I handle [edge case] given our constraints?"
- **With MCP servers enabled:**
  - "Search for and extract data about [heritage site] from UNESCO reports"
  - "Geocode these heritage site addresses and add coordinates to the JSON"
  - "Create a new JSON file for this site with proper structure"
  - "Create a GitHub issue for implementing [feature]"

### What AI assistants should know

- **No backend initially:** All data in static JSON files for Phase 1
- **Source everything:** Every piece of data needs citation
- **Accessibility matters:** WCAG AA compliance is required
- **Arabic support:** Plan for RTL layout from the start
- **Performance critical:** Users may have slow connections
- **Legal sensitivity:** Be careful with ownership claims and contested items
- **MCP capabilities:** When MCP servers are configured, Claude can directly access files, search web, manage GitHub, and geocode locations

## Resources & References

### Documentation

- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/
- Mapbox GL JS: https://docs.mapbox.com/mapbox-gl-js/
- D3.js: https://d3js.org/
- Tailwind CSS: https://tailwindcss.com/docs
- Model Context Protocol: https://modelcontextprotocol.io/

### Similar Projects (for inspiration)

- Forensic Architecture: https://forensic-architecture.org/
- Mapping Police Violence: https://mappingpoliceviolence.org/
- Syria Heritage Initiative: https://www.uchicago.edu/shi/
- Nakba Archive: https://www.nakba-archive.org/

### Key Academic Papers

- Morag Kersel: "License to Sell: The Legal Trade of Antiquities in Israel"
- Salah Al-Houdalieh: Research on West Bank archaeological site looting
- Institute for Palestine Studies: Various publications on cultural heritage

### Legal Frameworks

- 1954 Hague Convention for Protection of Cultural Property
- 1970 UNESCO Convention on Illicit Trade
- 1995 UNIDROIT Convention
- UN Security Council Resolution 2347 (2017)

## Contact & Contribution

### For AI Assistants

- Refer to GitHub issues for specific tasks
- Check existing code patterns before suggesting new approaches
- When unsure about data or sources, flag for human review
- Prioritize maintainability and documentation in suggestions
- Leverage MCP servers when available for file operations, research, and project management

### For Contributors

- See CONTRIBUTING.md (to be created)
- Check GitHub issues for tasks
- Follow code style guidelines
- Write tests for new features
- Update documentation

## License

[To be determined - likely MIT or Creative Commons for data]

## Acknowledgments

This project builds on research and documentation by:

- Palestinian Museum and Digital Archive team
- Institute for Palestine Studies
- Forensic Architecture
- Heritage for Peace
- EAMENA Project
- Countless researchers and journalists documenting Palestinian heritage

---

**Last Updated:** October 2025
**Version:** 0.1.0 (Pre-launch)
**Status:** In Development - Phase 1 MVP
