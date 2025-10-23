# Heritage Tracker - Extensibility Code Review

**Date:** October 23, 2025
**Branch:** feat/UItweaks3
**Review Type:** Comprehensive extensibility and scalability analysis
**Total Issues Found:** 27

---

## Executive Summary

This review focuses exclusively on extensibility issues and opportunities for improvement in the Heritage Tracker codebase. The analysis reveals **27 extensibility issues** across priority levels, with **4 CRITICAL** issues that would block major features like internationalization, new site types, and GIS integration.

### Issues by Priority

| Priority | Count | Description |
|----------|-------|-------------|
| CRITICAL | 4 | Block major features (110+ sites, i18n, GeoJSON export) |
| HIGH | 8 | Block scalability and accessibility |
| MEDIUM | 10 | Limit customization and configuration |
| LOW | 5 | Optional optimizations |

---

## Table of Contents

1. [CRITICAL Priority Issues](#critical-priority-issues)
2. [HIGH Priority Issues](#high-priority-issues)
3. [MEDIUM Priority Issues](#medium-priority-issues)
4. [LOW Priority Issues](#low-priority-issues)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Testing Recommendations](#testing-recommendations)

---

## CRITICAL Priority Issues

### Issue #1: Hard-coded Site Type Enum Blocks Extensibility

**Location:** `src/types/index.ts:42`

**Current Implementation:**
```typescript
export interface GazaSite {
  type: "mosque" | "church" | "archaeological" | "museum" | "historic-building";
  // ...
}
```

**Why it limits extensibility:**
- Adding new site types (e.g., "library", "school", "cemetery", "archive") requires changes in 6+ files
- Cannot dynamically add site types from a database or configuration file
- Hard-coded union type prevents runtime extensibility
- Blocks addition of the 110+ UNESCO sites with diverse categories

**Files requiring updates for each new type:**
- `src/types/index.ts` - Type definition
- `src/constants/filters.ts:11-17` - SITE_TYPES array
- `src/components/Icons/SiteTypeIcon.tsx:50-100` - Switch statement for icons
- `src/components/Icons/SiteTypeIcon.tsx:107-122` - getSiteTypeLabel function
- `src/utils/mapHelpers.ts` - Any type-specific logic

**Recommended solution:**
```typescript
// src/types/siteTypes.ts
export interface SiteTypeConfig {
  id: string;
  label: string;
  labelArabic?: string;
  icon: string; // Unicode symbol or icon identifier
  description?: string;
}

export interface GazaSite {
  type: string; // Now accepts any string
  typeConfig?: SiteTypeConfig; // Optional config for custom types
  // ...
}

// src/config/siteTypes.ts
export const SITE_TYPE_REGISTRY: Record<string, SiteTypeConfig> = {
  "mosque": {
    id: "mosque",
    label: "Mosque",
    labelArabic: "مسجد",
    icon: "☪",
    description: "Islamic place of worship"
  },
  "church": {
    id: "church",
    label: "Church",
    labelArabic: "كنيسة",
    icon: "✝",
    description: "Christian place of worship"
  },
  "archaeological": {
    id: "archaeological",
    label: "Archaeological Site",
    labelArabic: "موقع أثري",
    icon: "🏛",
    description: "Ancient ruins and historical excavation sites"
  },
  "museum": {
    id: "museum",
    label: "Museum",
    labelArabic: "متحف",
    icon: "🏛️",
    description: "Cultural institution housing artifacts"
  },
  "historic-building": {
    id: "historic-building",
    label: "Historic Building",
    labelArabic: "مبنى تاريخي",
    icon: "🏰",
    description: "Architecturally or historically significant structure"
  },
};

// Add new types without code changes:
export function registerSiteType(config: SiteTypeConfig): void {
  SITE_TYPE_REGISTRY[config.id] = config;
}

// Get all registered types (for dropdowns, filters, etc.)
export function getSiteTypes(): SiteTypeConfig[] {
  return Object.values(SITE_TYPE_REGISTRY);
}

// Get type config with fallback
export function getSiteTypeConfig(typeId: string): SiteTypeConfig {
  return SITE_TYPE_REGISTRY[typeId] || {
    id: typeId,
    label: typeId,
    icon: "📍",
  };
}
```

**Migration steps:**
1. Create `src/types/siteTypes.ts` and `src/config/siteTypes.ts`
2. Update `GazaSite` interface to use `type: string`
3. Refactor `SiteTypeIcon` to use registry instead of switch
4. Update filter constants to use `getSiteTypes()`
5. Add tests for registry functions

**Priority:** CRITICAL - Blocks 100+ site expansion

---

### Issue #2: Hard-coded Status Enum Prevents Custom Damage States

**Location:** `src/types/index.ts:46`

**Current Implementation:**
```typescript
export interface GazaSite {
  status: "destroyed" | "heavily-damaged" | "damaged";
  // ...
}
```

**Why it limits extensibility:**
- Cannot add nuanced damage states like "partially-restored", "looted", "at-risk", "intact-with-restrictions"
- Prevents tracking of recovery/restoration progress
- Blocks potential future features like restoration tracking or UNESCO risk assessment integration
- Hard-coded in map marker colors, requiring code changes for new states

**Files requiring updates:**
- `src/types/index.ts` - Type definition
- `src/constants/filters.ts:22-26` - STATUS_OPTIONS array
- `src/utils/mapHelpers.ts:12-21` - getMarkerColor switch statement
- All filter logic relying on exact string matching

**Recommended solution:**
```typescript
// src/types/siteStatus.ts
export interface StatusConfig {
  id: string;
  label: string;
  labelArabic?: string;
  severity: number; // 0-100 for ordering/filtering
  markerColor: string;
  description?: string;
}

export interface GazaSite {
  status: string; // Now accepts any string
  statusConfig?: StatusConfig;
  // ...
}

// src/config/siteStatus.ts
export const STATUS_REGISTRY: Record<string, StatusConfig> = {
  "destroyed": {
    id: "destroyed",
    label: "Destroyed",
    labelArabic: "مدمر",
    severity: 100,
    markerColor: "red",
    description: "Completely destroyed, no structural integrity remaining"
  },
  "heavily-damaged": {
    id: "heavily-damaged",
    label: "Heavily Damaged",
    labelArabic: "تضررت بشدة",
    severity: 75,
    markerColor: "orange",
    description: "Major structural damage, may not be repairable"
  },
  "damaged": {
    id: "damaged",
    label: "Damaged",
    labelArabic: "تضرر",
    severity: 50,
    markerColor: "yellow",
    description: "Partial damage, repairable"
  },
  // Easily add new statuses:
  "at-risk": {
    id: "at-risk",
    label: "At Risk",
    labelArabic: "في خطر",
    severity: 25,
    markerColor: "blue",
    description: "Currently intact but threatened"
  },
  "partially-restored": {
    id: "partially-restored",
    label: "Partially Restored",
    labelArabic: "تم ترميمه جزئيا",
    severity: 30,
    markerColor: "green",
    description: "Restoration in progress"
  },
};

export function registerStatus(config: StatusConfig): void {
  STATUS_REGISTRY[config.id] = config;
}

export function getStatuses(): StatusConfig[] {
  return Object.values(STATUS_REGISTRY)
    .sort((a, b) => b.severity - a.severity); // Sort by severity
}

export function getStatusConfig(statusId: string): StatusConfig {
  return STATUS_REGISTRY[statusId] || {
    id: statusId,
    label: statusId,
    severity: 0,
    markerColor: "grey",
  };
}
```

**Priority:** CRITICAL - Blocks restoration tracking and nuanced damage assessment

---

### Issue #3: No Internationalization Architecture

**Location:** Multiple files throughout codebase

**Current Implementation:**
- Hard-coded English strings in 100+ component files
- Only Arabic support is optional `nameArabic` field in data
- Date formatting hard-coded to `en-US` locale: `src/utils/format.ts:24,36,50`
- No translation infrastructure

**Examples of hard-coded strings:**
```typescript
// src/utils/format.ts:24
return new Date(dateString).toLocaleDateString("en-US", { /* ... */ });

// src/components/Icons/SiteTypeIcon.tsx:107-122
export const getSiteTypeLabel = (type: GazaSite["type"]): string => {
  switch (type) {
    case "mosque": return "Mosque";
    case "church": return "Church";
    // ... all hard-coded
  }
};

// src/components/FilterBar/FilterBar.tsx
<label>Site Type</label>
<label>Status</label>
<label>Year Built</label>

// src/components/Map/TimeToggle.tsx
<Button>2014</Button>
<Button>Aug 2023</Button>
<Button>Current</Button>
```

**Why it limits extensibility:**
- Cannot add full Arabic interface (only site names are translated)
- Blocks French, Spanish, or other language support
- Date formats remain American for all users
- Prevents proper RTL (right-to-left) layout for Arabic
- Hard-coded strings scattered across 100+ files

**Recommended solution:**

```typescript
// src/i18n/types.ts
export type Locale = 'en' | 'ar' | 'fr' | 'es';

export interface TranslationKeys {
  // Site types
  'site.type.mosque': string;
  'site.type.church': string;
  'site.type.archaeological': string;
  'site.type.museum': string;
  'site.type.historic-building': string;

  // Site status
  'site.status.destroyed': string;
  'site.status.heavily-damaged': string;
  'site.status.damaged': string;

  // Filters
  'filter.siteType': string;
  'filter.status': string;
  'filter.yearBuilt': string;
  'filter.dateRange': string;
  'filter.search': string;
  'filter.apply': string;
  'filter.reset': string;

  // Map
  'map.toggle.2014': string;
  'map.toggle.2023': string;
  'map.toggle.current': string;

  // Common
  'common.loading': string;
  'common.error': string;
  'common.noData': string;

  // ... 200+ keys
}

// src/i18n/translations/en.json
{
  "site.type.mosque": "Mosque",
  "site.type.church": "Church",
  "site.status.destroyed": "Destroyed",
  "filter.siteType": "Site Type",
  "filter.apply": "Apply Filters",
  "common.loading": "Loading..."
}

// src/i18n/translations/ar.json
{
  "site.type.mosque": "مسجد",
  "site.type.church": "كنيسة",
  "site.status.destroyed": "مدمر",
  "filter.siteType": "نوع الموقع",
  "filter.apply": "تطبيق المرشحات",
  "common.loading": "جار التحميل..."
}

// src/contexts/LocaleContext.tsx
export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem('heritage-tracker-locale');
    if (stored && ['en', 'ar', 'fr', 'es'].includes(stored)) {
      return stored as Locale;
    }
    // Auto-detect from browser
    const browserLang = navigator.language.split('-')[0];
    return ['ar', 'fr', 'es'].includes(browserLang) ? browserLang as Locale : 'en';
  });

  const isRTL = locale === 'ar';

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

// src/hooks/useTranslation.ts
export function useTranslation() {
  const { locale } = useLocale();

  const t = useCallback((key: keyof TranslationKeys, params?: Record<string, string>) => {
    let translation = translations[locale][key] || translations['en'][key] || key;

    // Simple parameter substitution
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, value);
      });
    }

    return translation;
  }, [locale]);

  const formatDate = useCallback((
    dateString: string,
    options?: Intl.DateTimeFormatOptions
  ) => {
    return new Date(dateString).toLocaleDateString(locale, options);
  }, [locale]);

  return { t, formatDate, locale };
}

// Usage in components
export function FilterBar() {
  const { t } = useTranslation();

  return (
    <div>
      <label>{t('filter.siteType')}</label>
      <label>{t('filter.status')}</label>
      <Button>{t('filter.apply')}</Button>
    </div>
  );
}
```

**Migration steps:**
1. Create i18n infrastructure (types, context, hooks)
2. Extract all hard-coded strings to translation files
3. Create English and Arabic translation files
4. Update all components to use `useTranslation()` hook
5. Add locale switcher to UI
6. Update date formatting utilities

**Priority:** CRITICAL - Blocks full Arabic implementation and future multilingual support

---

### Issue #4: Export Format Hard-coded to CSV Only

**Location:** `src/utils/csvExport.ts`

**Current Implementation:**
```typescript
// Only CSV export supported
export function sitesToCSV(sites: GazaSite[]): string { /* ... */ }
export function downloadCSV(sites: GazaSite[], filename?: string) { /* ... */ }
```

**Why it limits extensibility:**
- No JSON export for API integration or data transfer
- No GeoJSON export for GIS software integration (CRITICAL for heritage researchers using QGIS, ArcGIS)
- No KML/KMZ export for Google Earth integration
- Cannot add PDF reports, Excel spreadsheets, or other formats
- Hard-coded filename format: `heritage-tracker-sites-YYYY-MM-DD.csv`
- Researchers need GeoJSON as standard format for spatial analysis

**Recommended solution:**

```typescript
// src/types/export.ts
export type ExportFormat = 'csv' | 'json' | 'geojson' | 'kml' | 'xlsx';

export interface ExportConfig {
  format: ExportFormat;
  includeImages?: boolean;
  includeSources?: boolean;
  locale?: string;
  prettyPrint?: boolean;
}

export interface Exporter {
  format: ExportFormat;
  label: string;
  extension: string;
  mimeType: string;
  description: string;
  convert(sites: GazaSite[], config?: ExportConfig): string | Blob;
}

// src/utils/exporters/registry.ts
const EXPORTER_REGISTRY: Record<ExportFormat, Exporter> = {
  csv: new CSVExporter(),
  json: new JSONExporter(),
  geojson: new GeoJSONExporter(),
  kml: new KMLExporter(),
  // xlsx: new XLSXExporter(), // Requires library
};

export function getAvailableExportFormats(): ExportFormat[] {
  return Object.keys(EXPORTER_REGISTRY) as ExportFormat[];
}

export function exportSites(
  sites: GazaSite[],
  format: ExportFormat,
  config?: ExportConfig
): void {
  const exporter = EXPORTER_REGISTRY[format];
  if (!exporter) {
    throw new Error(`Unsupported export format: ${format}`);
  }

  const data = exporter.convert(sites, config);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `heritage-tracker-sites-${timestamp}.${exporter.extension}`;

  downloadFile(data, filename, exporter.mimeType);
}

// src/utils/exporters/geojson.ts - CRITICAL for heritage researchers
export class GeoJSONExporter implements Exporter {
  format = 'geojson' as const;
  label = 'GeoJSON';
  extension = 'geojson';
  mimeType = 'application/geo+json';
  description = 'Geographic data format for GIS software (QGIS, ArcGIS)';

  convert(sites: GazaSite[], config?: ExportConfig): string {
    const featureCollection = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: {
          name: "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
      },
      features: sites.map(site => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [site.coordinates[1], site.coordinates[0]] // [lng, lat] for GeoJSON
        },
        properties: {
          id: site.id,
          name: site.name,
          nameArabic: site.nameArabic,
          type: site.type,
          status: site.status,
          yearBuilt: site.yearBuilt,
          dateDestroyed: site.dateDestroyed,
          unescoListed: site.unescoListed,
          significance: site.significance,
          ...(config?.includeSources && {
            sources: site.sources,
            verifiedBy: site.verifiedBy
          }),
        }
      }))
    };

    return config?.prettyPrint
      ? JSON.stringify(featureCollection, null, 2)
      : JSON.stringify(featureCollection);
  }
}

// src/utils/exporters/json.ts
export class JSONExporter implements Exporter {
  format = 'json' as const;
  label = 'JSON';
  extension = 'json';
  mimeType = 'application/json';
  description = 'JavaScript Object Notation for API integration';

  convert(sites: GazaSite[], config?: ExportConfig): string {
    const data = {
      exportDate: new Date().toISOString(),
      totalSites: sites.length,
      sites: sites,
    };

    return config?.prettyPrint
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
  }
}

// src/utils/exporters/kml.ts
export class KMLExporter implements Exporter {
  format = 'kml' as const;
  label = 'KML';
  extension = 'kml';
  mimeType = 'application/vnd.google-earth.kml+xml';
  description = 'Keyhole Markup Language for Google Earth';

  convert(sites: GazaSite[]): string {
    const placemarks = sites.map(site => `
      <Placemark>
        <name>${escapeXML(site.name)}</name>
        <description>${escapeXML(this.buildDescription(site))}</description>
        <Point>
          <coordinates>${site.coordinates[1]},${site.coordinates[0]},0</coordinates>
        </Point>
        <Style>
          <IconStyle>
            <color>${this.getColorForStatus(site.status)}</color>
          </IconStyle>
        </Style>
      </Placemark>
    `).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Heritage Tracker - Gaza Heritage Sites</name>
    ${placemarks}
  </Document>
</kml>`;
  }

  private buildDescription(site: GazaSite): string {
    return `
Type: ${site.type}
Status: ${site.status}
Year Built: ${site.yearBuilt}
${site.dateDestroyed ? `Destroyed: ${site.dateDestroyed}` : ''}
    `.trim();
  }

  private getColorForStatus(status: string): string {
    // KML uses AABBGGRR format
    const colors: Record<string, string> = {
      destroyed: 'ff0000ff', // Red
      'heavily-damaged': 'ff00a5ff', // Orange
      damaged: 'ff00ffff', // Yellow
    };
    return colors[status] || 'ff808080'; // Grey default
  }
}

// UI Component for export selection
export function ExportModal({ sites, onClose }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [config, setConfig] = useState<ExportConfig>({
    format: 'csv',
    includeSources: true,
    prettyPrint: true,
  });

  const formats = getAvailableExportFormats();

  const handleExport = () => {
    exportSites(sites, selectedFormat, config);
    onClose();
  };

  return (
    <Modal>
      <h2>Export Sites</h2>
      <select value={selectedFormat} onChange={e => setSelectedFormat(e.target.value as ExportFormat)}>
        {formats.map(fmt => {
          const exporter = EXPORTER_REGISTRY[fmt];
          return (
            <option key={fmt} value={fmt}>
              {exporter.label} - {exporter.description}
            </option>
          );
        })}
      </select>

      <label>
        <input
          type="checkbox"
          checked={config.includeSources}
          onChange={e => setConfig({ ...config, includeSources: e.target.checked })}
        />
        Include sources and verification data
      </label>

      {(selectedFormat === 'json' || selectedFormat === 'geojson') && (
        <label>
          <input
            type="checkbox"
            checked={config.prettyPrint}
            onChange={e => setConfig({ ...config, prettyPrint: e.target.checked })}
          />
          Pretty print (human-readable)
        </label>
      )}

      <Button onClick={handleExport}>Export as {selectedFormat.toUpperCase()}</Button>
    </Modal>
  );
}
```

**Priority:** CRITICAL - GeoJSON is standard format for heritage research and GIS integration

---

## HIGH Priority Issues

### Issue #5: Hard-coded Locale in Date Formatting

**Location:** `src/utils/format.ts:24,36,50`

**Current Implementation:**
```typescript
export const formatDateCompact = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-bit",
  });
};
```

**Why it limits extensibility:**
- Displays American date formats (MM/DD/YYYY) to all users including Arabic speakers
- Cannot be customized per user preference
- Blocks internationalization efforts
- Different cultures expect different date formats (DD/MM/YYYY, YYYY-MM-DD, etc.)

**Recommended solution:**
```typescript
// src/utils/format.ts
export const formatDateCompact = (
  dateString: string | null | undefined,
  locale?: string
): string => {
  if (!dateString) return "N/A";
  const userLocale = locale || navigator.language || "en-US";
  return new Date(dateString).toLocaleDateString(userLocale, {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

// Or integrate with i18n context
export const formatDateCompact = (
  dateString: string | null | undefined
): string => {
  const { locale } = useLocale(); // From Issue #3
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};
```

**Priority:** HIGH - Directly impacts user experience for non-English users

---

### Issue #6: Map Tile Configuration Not Extensible

**Location:** `src/constants/map.ts:51-64`

**Current Implementation:**
```typescript
export const TILE_CONFIGS = {
  arabic: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "..."
  },
  english: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "..."
  },
} as const;
```

**Why it limits extensibility:**
- Only 2 languages supported (Arabic/English)
- Cannot add custom tile providers (e.g., local Gaza tiles, historic maps, satellite overlays)
- Hard-coded in `src/hooks/useTileConfig.ts:8-11` with only `isArabic` check
- Prevents user preference for tile style (terrain, satellite, street view)
- Cannot switch providers if one becomes unavailable

**Recommended solution:**
```typescript
// src/config/tileLayers.ts
export interface TileLayerConfig {
  id: string;
  name: string;
  nameArabic?: string;
  url: string;
  attribution: string;
  subdomains?: string;
  maxZoom?: number;
  minZoom?: number;
  languages?: string[]; // Supported locales
  type: 'street' | 'satellite' | 'terrain' | 'hybrid';
}

export const TILE_LAYER_REGISTRY: TileLayerConfig[] = [
  {
    id: "osm-standard",
    name: "OpenStreetMap",
    nameArabic: "خريطة الشارع المفتوحة",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
    languages: ["en", "ar", "fr", "es"],
    maxZoom: 19,
    type: 'street',
  },
  {
    id: "esri-world-imagery",
    name: "ESRI World Imagery",
    nameArabic: "صور العالم ESRI",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© ESRI",
    maxZoom: 19,
    type: 'satellite',
  },
  // Easily add custom providers without code changes
];

export function getTileLayersForLocale(locale: string): TileLayerConfig[] {
  return TILE_LAYER_REGISTRY.filter(
    layer => !layer.languages || layer.languages.includes(locale)
  );
}

export function getTileLayersByType(type: TileLayerConfig['type']): TileLayerConfig[] {
  return TILE_LAYER_REGISTRY.filter(layer => layer.type === type);
}

export function getTileLayerById(id: string): TileLayerConfig | undefined {
  return TILE_LAYER_REGISTRY.find(layer => layer.id === id);
}

// Allow dynamic registration
export function registerTileLayer(config: TileLayerConfig): void {
  TILE_LAYER_REGISTRY.push(config);
}
```

**Priority:** HIGH - Blocks custom tile providers and full internationalization

---

### Issue #7: Historical Imagery Periods Hard-coded

**Location:** `src/constants/map.ts:70-95`

**Current Implementation:**
```typescript
export const HISTORICAL_IMAGERY = {
  BASELINE_2014: {
    releaseNum: 10,
    date: "2014-02-20",
    maxZoom: 17,
    url: "..."
  },
  PRE_CONFLICT_2023: {
    releaseNum: 64776,
    date: "2023-08-31",
    maxZoom: 18,
    url: "..."
  },
  CURRENT: {
    releaseNum: null,
    date: "current",
    maxZoom: 19,
    url: "..."
  },
} as const;
```

**Why it limits extensibility:**
- Cannot add new time periods without code changes
- Period selection logic in `src/utils/imageryPeriods.ts` requires updates for each new period
- Dynamic Wayback releases (150+ available) can't be automatically added as periods
- Prevents user-defined custom date ranges
- Manual process to add "PRE_CONFLICT_2023" highlights inflexibility

**Recommended solution:**
```typescript
// src/config/imageryPeriods.ts
export interface ImageryPeriod {
  id: string;
  label: string;
  labelArabic?: string;
  date: string | 'current';
  releaseNum: number | null;
  url: string;
  maxZoom: number;
  description?: string;
  isDefault?: boolean;
}

// Dynamic registry instead of const object
const PERIOD_REGISTRY: ImageryPeriod[] = [
  {
    id: "baseline-2014",
    label: "2014 Baseline",
    labelArabic: "خط الأساس 2014",
    date: "2014-02-20",
    releaseNum: 10,
    url: "...",
    maxZoom: 17,
    description: "Earliest available imagery",
  },
  {
    id: "pre-conflict-2023",
    label: "Aug 2023 (Pre-Conflict)",
    labelArabic: "أغسطس 2023 (ما قبل النزاع)",
    date: "2023-08-31",
    releaseNum: 64776,
    url: "...",
    maxZoom: 18,
    description: "Last imagery before October 7, 2023",
    isDefault: true,
  },
  {
    id: "current",
    label: "Current",
    labelArabic: "الحالي",
    date: "current",
    releaseNum: null,
    url: "...",
    maxZoom: 19,
    description: "Most recent imagery available",
  },
];

export function registerImageryPeriod(period: ImageryPeriod): void {
  PERIOD_REGISTRY.push(period);
  // Sort by date
  PERIOD_REGISTRY.sort((a, b) => {
    if (a.date === 'current') return 1;
    if (b.date === 'current') return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

export function getImageryPeriods(): ImageryPeriod[] {
  return PERIOD_REGISTRY;
}

export function getImageryPeriodById(id: string): ImageryPeriod | undefined {
  return PERIOD_REGISTRY.find(p => p.id === id);
}

export function getDefaultImageryPeriod(): ImageryPeriod {
  return PERIOD_REGISTRY.find(p => p.isDefault) || PERIOD_REGISTRY[0];
}

// Automatically create periods from Wayback releases
export async function autoPopulatePeriodsFromWayback(): Promise<void> {
  const releases = await fetchWaybackReleases();

  // Filter to significant dates (quarterly, annually, or major events)
  const significantReleases = filterSignificantReleases(releases);

  significantReleases.forEach(release => {
    registerImageryPeriod({
      id: `wayback-${release.releaseNum}`,
      label: formatReleaseLabel(release.releaseDate),
      date: release.releaseDate,
      releaseNum: release.releaseNum,
      url: release.tileUrl,
      maxZoom: release.maxZoom,
    });
  });
}

function filterSignificantReleases(releases: WaybackRelease[]): WaybackRelease[] {
  // Keep quarterly releases and major events
  // This prevents 150+ releases from cluttering the UI
  return releases.filter((release, index) => {
    // Keep every 13th release (~quarterly for weekly releases)
    if (index % 13 === 0) return true;

    // Keep releases near major events (October 7, 2023, etc.)
    const releaseDate = new Date(release.releaseDate);
    const oct7 = new Date('2023-10-07');
    const daysDiff = Math.abs((releaseDate.getTime() - oct7.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) return true; // Within a week of major event

    return false;
  });
}
```

**Priority:** HIGH - Blocks automatic timeline expansion and user-defined periods

---

### Issue #8: Source Type Enum Not Extensible

**Location:** `src/types/index.ts:14`

**Current Implementation:**
```typescript
export interface Source {
  type: "official" | "academic" | "journalism" | "documentation";
  organization: string;
  title: string;
  url?: string;
  date?: string;
}
```

**Why it limits extensibility:**
- Cannot add new verification source types (e.g., "eyewitness", "satellite-analysis", "forensic", "archaeological-report", "legal-filing")
- Blocks integration with diverse verification methodologies
- Hard-coded in validation logic
- Prevents credibility scoring based on source type

**Recommended solution:**
```typescript
// src/types/sources.ts
export interface SourceTypeConfig {
  id: string;
  label: string;
  labelArabic?: string;
  credibilityWeight: number; // 0-100 for trust scoring
  requiresURL?: boolean;
  requiresDate?: boolean;
  description?: string;
}

export interface Source {
  type: string; // Now flexible
  typeConfig?: SourceTypeConfig;
  organization: string;
  title: string;
  url?: string;
  date?: string;
}

// src/config/sourceTypes.ts
export const SOURCE_TYPE_REGISTRY: Record<string, SourceTypeConfig> = {
  "official": {
    id: "official",
    label: "Official Report",
    labelArabic: "تقرير رسمي",
    credibilityWeight: 100,
    requiresURL: true,
    requiresDate: true,
    description: "Government or UN official documentation"
  },
  "academic": {
    id: "academic",
    label: "Academic Research",
    labelArabic: "بحث أكاديمي",
    credibilityWeight: 95,
    requiresURL: true,
    description: "Peer-reviewed academic publications"
  },
  "forensic": {
    id: "forensic",
    label: "Forensic Analysis",
    labelArabic: "تحليل جنائي",
    credibilityWeight: 95,
    requiresURL: true,
    description: "Forensic architecture and technical analysis"
  },
  "journalism": {
    id: "journalism",
    label: "Journalism",
    labelArabic: "صحافة",
    credibilityWeight: 80,
    requiresURL: false,
    description: "News reporting and investigative journalism"
  },
  "eyewitness": {
    id: "eyewitness",
    label: "Eyewitness Account",
    labelArabic: "شهادة عيان",
    credibilityWeight: 70,
    requiresURL: false,
    description: "Direct witness testimony"
  },
  "satellite-analysis": {
    id: "satellite-analysis",
    label: "Satellite Analysis",
    labelArabic: "تحليل الأقمار الصناعية",
    credibilityWeight: 90,
    requiresURL: false,
    description: "Satellite imagery analysis and remote sensing"
  },
  "documentation": {
    id: "documentation",
    label: "Documentation",
    labelArabic: "توثيق",
    credibilityWeight: 75,
    requiresURL: false,
    description: "Photo/video documentation and archival records"
  },
};

export function getSourceTypes(): SourceTypeConfig[] {
  return Object.values(SOURCE_TYPE_REGISTRY)
    .sort((a, b) => b.credibilityWeight - a.credibilityWeight);
}

export function getSourceTypeConfig(typeId: string): SourceTypeConfig {
  return SOURCE_TYPE_REGISTRY[typeId] || {
    id: typeId,
    label: typeId,
    credibilityWeight: 50,
  };
}

// Calculate overall credibility score for a site
export function calculateCredibilityScore(sources: Source[]): number {
  if (sources.length === 0) return 0;

  const totalWeight = sources.reduce((sum, source) => {
    const config = getSourceTypeConfig(source.type);
    return sum + config.credibilityWeight;
  }, 0);

  return Math.round(totalWeight / sources.length);
}
```

**Priority:** HIGH - Limits verification methodology diversity

---

### Issue #9: Icon Mapping Hard-coded in Switch Statements

**Location:** `src/components/Icons/SiteTypeIcon.tsx:50-100`

**Current Implementation:**
```typescript
export function SiteTypeIcon({ type, className }: SiteTypeIconProps) {
  switch (type) {
    case "mosque":
      return <UnicodeIcon symbol="☪" className={className} />;
    case "church":
      return <UnicodeIcon symbol="✝" className={className} />;
    case "archaeological":
      return <UnicodeIcon symbol="🏛" className={className} />;
    case "museum":
      return <UnicodeIcon symbol="🏛️" className={className} />;
    case "historic-building":
      return <UnicodeIcon symbol="🏰" className={className} />;
    default:
      return null;
  }
}

export const getSiteTypeLabel = (type: GazaSite["type"]): string => {
  switch (type) {
    case "mosque": return "Mosque";
    case "church": return "Church";
    case "archaeological": return "Archaeological Site";
    case "museum": return "Museum";
    case "historic-building": return "Historic Building";
    default: return type;
  }
};
```

**Why it limits extensibility:**
- Every new site type requires code changes in multiple switch statements
- Cannot configure icons from data or config files
- Duplicated logic in two functions (icon + label)
- Tightly coupled to Issue #1 (site type enum)

**Recommended solution:**
```typescript
// Use SITE_TYPE_REGISTRY from Issue #1
import { SITE_TYPE_REGISTRY, getSiteTypeConfig } from '../../config/siteTypes';

export function SiteTypeIcon({ type, className }: SiteTypeIconProps) {
  const typeConfig = getSiteTypeConfig(type);

  if (!typeConfig) {
    return <DefaultIcon className={className} />;
  }

  // Support both unicode symbols and heroicons
  if (typeConfig.icon.startsWith('heroicon:')) {
    // Heroicon component name
    const iconName = typeConfig.icon.replace('heroicon:', '');
    const IconComponent = ICON_COMPONENTS[iconName];
    return IconComponent ? <IconComponent className={className} /> : null;
  }

  // Unicode symbol (default)
  return <UnicodeIcon symbol={typeConfig.icon} className={className} />;
}

export const getSiteTypeLabel = (type: string, locale: string = 'en'): string => {
  const typeConfig = getSiteTypeConfig(type);

  if (locale === 'ar' && typeConfig.labelArabic) {
    return typeConfig.labelArabic;
  }

  return typeConfig.label;
};

// Now adding a new site type only requires updating the registry:
// registerSiteType({
//   id: 'library',
//   label: 'Library',
//   labelArabic: 'مكتبة',
//   icon: '📚',
// });
// No code changes needed!
```

**Priority:** HIGH - Directly tied to Issue #1 (site types)

---

### Issue #10: Marker Color Mapping Not Extensible

**Location:** `src/utils/mapHelpers.ts:12-21`

**Current Implementation:**
```typescript
export const getMarkerColor = (status: GazaSite["status"]): string => {
  switch (status) {
    case "destroyed":
      return "red";
    case "heavily-damaged":
      return "orange";
    case "damaged":
      return "yellow";
  }
};
```

**Why it limits extensibility:**
- Tightly coupled to `status` enum (Issue #2)
- Cannot customize colors per user preference or accessibility needs
- Hard-coded to specific color names from external CDN (`marker-icon-2x-${color}.png`)
- Prevents color-blind friendly palettes
- No support for high-contrast modes

**Recommended solution:**
```typescript
// Use STATUS_REGISTRY from Issue #2
import { getStatusConfig } from '../../config/siteStatus';

export const getMarkerColor = (status: string): string => {
  const statusConfig = getStatusConfig(status);
  return statusConfig.markerColor || "grey";
};

// Or for full customization with color schemes:
export interface MarkerColorScheme {
  destroyed: string;
  heavilyDamaged: string;
  damaged: string;
  atRisk: string;
  [key: string]: string; // Allow dynamic statuses
}

export const MARKER_COLOR_SCHEMES: Record<string, MarkerColorScheme> = {
  default: {
    destroyed: "red",
    heavilyDamaged: "orange",
    damaged: "yellow",
    atRisk: "blue",
  },
  colorblind: {
    destroyed: "#d55e00",  // Vermillion
    heavilyDamaged: "#cc79a7", // Reddish purple
    damaged: "#f0e442",    // Yellow
    atRisk: "#0072b2",     // Blue
  },
  highContrast: {
    destroyed: "#ff0000",  // Pure red
    heavilyDamaged: "#ff6600", // Orange
    damaged: "#ffff00",    // Pure yellow
    atRisk: "#0000ff",     // Pure blue
  },
  grayscale: {
    destroyed: "#000000",  // Black
    heavilyDamaged: "#555555", // Dark grey
    damaged: "#aaaaaa",    // Light grey
    atRisk: "#dddddd",     // Very light grey
  },
};

export function getMarkerColorForScheme(
  status: string,
  scheme: string = 'default'
): string {
  const colorScheme = MARKER_COLOR_SCHEMES[scheme] || MARKER_COLOR_SCHEMES.default;
  const statusNormalized = status.replace(/-/g, '');
  return colorScheme[statusNormalized] || "grey";
}

// Allow users to select color scheme
export function useMarkerColorScheme() {
  const [scheme, setScheme] = useState<string>(() => {
    return localStorage.getItem('marker-color-scheme') || 'default';
  });

  const setColorScheme = (newScheme: string) => {
    setScheme(newScheme);
    localStorage.setItem('marker-color-scheme', newScheme);
  };

  return { scheme, setColorScheme };
}
```

**Priority:** HIGH - Accessibility and customization critical for diverse users

---

### Issue #11: Palestinian Flag Colors Hard-coded

**Location:** `src/constants/colors.ts:6-18`, `src/components/Button/buttonColors.ts`

**Current Implementation:**
```typescript
export const COLORS = {
  FLAG_RED: '#ed3039',
  FLAG_GREEN: '#009639',
  FLAG_BLACK: '#000000',
  FLAG_WHITE: '#fefefe',
  // ...
} as const;

// In buttonColors.ts
export const PALESTINIAN_FLAG = {
  GREEN: '#009639',
  RED: '#ed3039',
  BLACK: '#000000',
  WHITE: '#fefefe',
} as const;
```

**Why it limits extensibility:**
- Cannot support different color themes or organizational branding
- Prevents accessibility color schemes (high contrast, colorblind modes)
- `as const` makes values immutable and non-configurable
- Used throughout codebase with direct imports
- No mechanism for theme switching

**Recommended solution:**
```typescript
// src/config/themes.ts
export interface ColorTheme {
  id: string;
  name: string;
  nameArabic?: string;
  description?: string;
  colors: {
    primary: string;
    primaryDark: string;
    primaryHover: string;
    secondary: string;
    secondaryDark: string;
    secondaryHover: string;
    accent: string;
    background: string;
    text: string;
  };
}

export const THEME_REGISTRY: Record<string, ColorTheme> = {
  "palestinian-flag": {
    id: "palestinian-flag",
    name: "Palestinian Flag",
    nameArabic: "العلم الفلسطيني",
    description: "Traditional Palestinian flag colors",
    colors: {
      primary: "#ed3039",      // Red
      primaryDark: "#8b2a30",
      primaryHover: "#ff4050",
      secondary: "#009639",    // Green
      secondaryDark: "#2d5a38",
      secondaryHover: "#00b345",
      accent: "#000000",       // Black
      background: "#fefefe",   // White
      text: "#000000",
    },
  },
  "high-contrast": {
    id: "high-contrast",
    name: "High Contrast",
    nameArabic: "تباين عالي",
    description: "High contrast colors for accessibility",
    colors: {
      primary: "#ff0000",
      primaryDark: "#cc0000",
      primaryHover: "#ff3333",
      secondary: "#00ff00",
      secondaryDark: "#00cc00",
      secondaryHover: "#33ff33",
      accent: "#000000",
      background: "#ffffff",
      text: "#000000",
    },
  },
  "colorblind-friendly": {
    id: "colorblind-friendly",
    name: "Colorblind Friendly",
    nameArabic: "صديق لعمى الألوان",
    description: "Colors distinguishable for colorblind users",
    colors: {
      primary: "#d55e00",      // Vermillion (red replacement)
      primaryDark: "#993300",
      primaryHover: "#ff7700",
      secondary: "#009e73",    // Bluish green
      secondaryDark: "#005544",
      secondaryHover: "#00cc99",
      accent: "#000000",
      background: "#ffffff",
      text: "#000000",
    },
  },
  "dark-mode": {
    id: "dark-mode",
    name: "Dark Mode",
    nameArabic: "الوضع الداكن",
    description: "Dark theme with Palestinian flag colors",
    colors: {
      primary: "#ff5060",
      primaryDark: "#8b2a30",
      primaryHover: "#ff7080",
      secondary: "#00b345",
      secondaryDark: "#2d5a38",
      secondaryHover: "#00cc55",
      accent: "#ffffff",
      background: "#1a1a1a",
      text: "#ffffff",
    },
  },
};

// Context for theme management
export function useColorTheme() {
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem('color-theme') || 'palestinian-flag';
  });

  const theme = THEME_REGISTRY[themeId] || THEME_REGISTRY['palestinian-flag'];

  const setColorTheme = (newThemeId: string) => {
    if (THEME_REGISTRY[newThemeId]) {
      setThemeId(newThemeId);
      localStorage.setItem('color-theme', newThemeId);

      // Apply CSS custom properties
      Object.entries(theme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value);
      });
    }
  };

  return { theme, setColorTheme, availableThemes: Object.values(THEME_REGISTRY) };
}

// Update components to use theme
export function Button({ variant, ...props }: ButtonProps) {
  const { theme } = useColorTheme();

  const variantStyles = {
    primary: `bg-[${theme.colors.primary}] hover:bg-[${theme.colors.primaryHover}]`,
    secondary: `bg-[${theme.colors.secondary}] hover:bg-[${theme.colors.secondaryHover}]`,
    // ...
  };

  // ...
}
```

**Priority:** HIGH - Accessibility and customization

---

### Issue #12: Animation Speed Values Hard-coded

**Location:** `src/contexts/AnimationContext.tsx:9`

**Current Implementation:**
```typescript
export type AnimationSpeed = 0.5 | 1 | 2 | 4;

// Used in context:
const [speed, setSpeed] = useState<AnimationSpeed>(1);
```

**Why it limits extensibility:**
- Cannot add custom speeds (e.g., 0.25x for accessibility, 8x/16x for testing)
- User preference for speed cannot be fine-tuned
- Prevents accessibility features (very slow speeds for users with cognitive disabilities)
- Hard-coded presets limit flexibility

**Recommended solution:**
```typescript
// src/types/animation.ts
export interface AnimationConfig {
  minSpeed: number;
  maxSpeed: number;
  defaultSpeed: number;
  presetSpeeds: number[];
  allowCustomSpeed: boolean;
}

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  minSpeed: 0.1,
  maxSpeed: 16,
  defaultSpeed: 1,
  presetSpeeds: [0.25, 0.5, 1, 2, 4, 8, 16],
  allowCustomSpeed: true,
};

// Accessibility presets
export const ACCESSIBILITY_ANIMATION_CONFIG: AnimationConfig = {
  minSpeed: 0.1,
  maxSpeed: 1,
  defaultSpeed: 0.25,
  presetSpeeds: [0.1, 0.25, 0.5, 1],
  allowCustomSpeed: false,
};

// Update AnimationProvider
export function AnimationProvider({
  children,
  sites,
  config = DEFAULT_ANIMATION_CONFIG
}: AnimationProviderProps) {
  const [speed, setSpeed] = useState<number>(config.defaultSpeed);

  const setAnimationSpeed = (newSpeed: number) => {
    // Validate against min/max
    const clampedSpeed = Math.max(
      config.minSpeed,
      Math.min(config.maxSpeed, newSpeed)
    );
    setSpeed(clampedSpeed);
  };

  return (
    <AnimationContext.Provider value={{
      speed,
      setSpeed: setAnimationSpeed,
      config,
      presetSpeeds: config.presetSpeeds,
    }}>
      {children}
    </AnimationContext.Provider>
  );
}

// Speed selector component
export function SpeedSelector() {
  const { speed, setSpeed, config } = useAnimation();

  return (
    <div>
      <label>Playback Speed</label>
      <select value={speed} onChange={e => setSpeed(Number(e.target.value))}>
        {config.presetSpeeds.map(presetSpeed => (
          <option key={presetSpeed} value={presetSpeed}>
            {presetSpeed}x
          </option>
        ))}
      </select>

      {config.allowCustomSpeed && (
        <input
          type="range"
          min={config.minSpeed}
          max={config.maxSpeed}
          step={0.1}
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
        />
      )}
    </div>
  );
}
```

**Priority:** HIGH - Accessibility and user experience

---

## MEDIUM Priority Issues

### Issue #13: Wayback Timeline Constants Not Configurable

**Location:** `src/constants/wayback.ts:6-34`

**Current Implementation:**
```typescript
export const TIMELINE_MARKERS = {
  MAJOR_INTERVAL: 10,  // Every 10th release
  MINOR_INTERVAL: 1,   // All releases
} as const;

export const PLAYBACK_CONFIG = {
  YEAR_INTERVAL_MS: 2000,
  INITIAL_PAUSE_MS: 1000,
} as const;

export const MARKER_HEIGHTS = {
  MINOR: 10,
  MAJOR: 20,
  YEAR: 25,
} as const;
```

**Why it limits extensibility:**
- Visual configuration values are hard-coded constants
- Cannot adjust intervals for different use cases (presentation mode, fast preview)
- User preference not supported
- Hard to customize without code changes

**Recommended solution:**
```typescript
// src/types/wayback.ts
export interface WaybackTimelineConfig {
  markerIntervals: {
    major: number;
    minor: number;
  };
  playback: {
    yearIntervalMs: number;
    initialPauseMs: number;
  };
  visual: {
    markerHeights: {
      minor: number;
      major: number;
      year: number;
    };
    spacing: {
      eventStack: number;
    };
  };
}

export const DEFAULT_WAYBACK_CONFIG: WaybackTimelineConfig = {
  markerIntervals: { major: 10, minor: 1 },
  playback: { yearIntervalMs: 2000, initialPauseMs: 1000 },
  visual: {
    markerHeights: { minor: 10, major: 20, year: 25 },
    spacing: { eventStack: 15 },
  },
};

// Compact mode for presentations
export const COMPACT_WAYBACK_CONFIG: WaybackTimelineConfig = {
  markerIntervals: { major: 20, minor: 5 },
  playback: { yearIntervalMs: 1000, initialPauseMs: 500 },
  visual: {
    markerHeights: { minor: 8, major: 16, year: 20 },
    spacing: { eventStack: 10 },
  },
};

// Allow per-component overrides
export function WaybackSlider({
  config = DEFAULT_WAYBACK_CONFIG
}: WaybackSliderProps) {
  // Use config values instead of importing constants
  const majorInterval = config.markerIntervals.major;
  // ...
}
```

**Priority:** MEDIUM - Improves customization but not blocking

---

### Issue #14: CSV Column Headers Hard-coded

**Location:** `src/utils/csvExport.ts:23-35`

**Current Implementation:**
```typescript
const headers = [
  "Name",
  "Arabic Name",
  "Type",
  "Status",
  "Year Built",
  "Date Destroyed",
  "Coordinates",
  "UNESCO Listed",
  "Significance",
];

const rows = sites.map(site => [
  escapeCSV(site.name),
  escapeCSV(site.nameArabic || ""),
  escapeCSV(site.type),
  // ...
]);
```

**Why it limits extensibility:**
- Headers in English only ("Name", "Type", "Status")
- Cannot reorder or customize columns
- Cannot exclude sensitive fields in exports
- Hard-coded column order

**Recommended solution:**
```typescript
// src/types/export.ts
export interface CSVColumnConfig {
  key: keyof GazaSite | string;
  header: string;
  headerArabic?: string;
  formatter?: (value: any, site: GazaSite) => string;
  include?: boolean;
}

export interface CSVExportConfig {
  columns: CSVColumnConfig[];
  locale?: string;
  includeHeaders?: boolean;
}

// Default column configuration
export const DEFAULT_CSV_COLUMNS: CSVColumnConfig[] = [
  { key: 'name', header: 'Name', headerArabic: 'الاسم' },
  { key: 'nameArabic', header: 'Arabic Name', headerArabic: 'الاسم العربي' },
  { key: 'type', header: 'Type', headerArabic: 'النوع' },
  { key: 'status', header: 'Status', headerArabic: 'الحالة' },
  { key: 'yearBuilt', header: 'Year Built', headerArabic: 'سنة البناء' },
  {
    key: 'dateDestroyed',
    header: 'Date Destroyed',
    headerArabic: 'تاريخ التدمير',
    formatter: (value) => value || 'N/A',
  },
  {
    key: 'coordinates',
    header: 'Coordinates',
    headerArabic: 'الإحداثيات',
    formatter: (value: [number, number]) => `${value[0]}, ${value[1]}`,
  },
  {
    key: 'unescoListed',
    header: 'UNESCO Listed',
    headerArabic: 'مدرج في اليونسكو',
    formatter: (value) => value ? 'Yes' : 'No',
  },
];

export function sitesToCSV(sites: GazaSite[], config?: CSVExportConfig): string {
  const finalConfig = {
    columns: DEFAULT_CSV_COLUMNS,
    locale: 'en',
    includeHeaders: true,
    ...config,
  };

  // Filter columns
  const activeColumns = finalConfig.columns.filter(col => col.include !== false);

  // Generate headers
  const headers = activeColumns.map(col =>
    finalConfig.locale === 'ar' && col.headerArabic
      ? col.headerArabic
      : col.header
  );

  // Generate rows
  const rows = sites.map(site =>
    activeColumns.map(col => {
      const value = (site as any)[col.key];
      const formatted = col.formatter ? col.formatter(value, site) : value;
      return escapeCSV(String(formatted || ''));
    })
  );

  return [
    finalConfig.includeHeaders ? headers.join(',') : null,
    ...rows.map(row => row.join(',')),
  ].filter(Boolean).join('\n');
}

// Allow users to customize export
export function CSVExportDialog({ sites, onClose }: Props) {
  const [columns, setColumns] = useState(DEFAULT_CSV_COLUMNS);
  const [locale, setLocale] = useState<'en' | 'ar'>('en');

  const toggleColumn = (key: string) => {
    setColumns(columns.map(col =>
      col.key === key ? { ...col, include: !col.include } : col
    ));
  };

  const handleExport = () => {
    const csv = sitesToCSV(sites, { columns, locale });
    downloadCSV(csv);
    onClose();
  };

  return (
    <Modal>
      <h2>Customize CSV Export</h2>
      <label>
        <select value={locale} onChange={e => setLocale(e.target.value as 'en' | 'ar')}>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>
      </label>

      <h3>Select Columns</h3>
      {columns.map(col => (
        <label key={col.key}>
          <input
            type="checkbox"
            checked={col.include !== false}
            onChange={() => toggleColumn(col.key)}
          />
          {col.header}
        </label>
      ))}

      <Button onClick={handleExport}>Export</Button>
    </Modal>
  );
}
```

**Priority:** MEDIUM - Important for internationalization

---

### Issue #15: Default Timeline Dates Hard-coded

**Location:** `src/contexts/AnimationContext.tsx:42-43`

**Current Implementation:**
```typescript
const DEFAULT_TIMELINE_START = new Date("2023-10-07"); // Oct 7, 2023
const DEFAULT_TIMELINE_END = new Date(); // Current date
```

**Why it limits extensibility:**
- Assumes conflict start date of October 7, 2023
- Cannot extend timeline to earlier conflicts or future events
- Prevents historical timeline views
- Hard-coded assumption about context

**Recommended solution:**
```typescript
// src/types/timeline.ts
export interface TimelineConfig {
  defaultStart: Date;
  defaultEnd: Date;
  minDate?: Date; // Earliest allowable date
  maxDate?: Date; // Latest allowable date
  autoCalculate?: boolean; // Calculate from site data
}

// Calculate timeline from data
export function calculateTimelineFromSites(sites: GazaSite[]): TimelineConfig {
  const destructionDates = sites
    .map(s => s.dateDestroyed)
    .filter(Boolean)
    .map(d => new Date(d!));

  if (destructionDates.length === 0) {
    return {
      defaultStart: new Date("2023-10-07"),
      defaultEnd: new Date(),
    };
  }

  const earliestDestruction = new Date(Math.min(...destructionDates.map(d => d.getTime())));
  const latestDestruction = new Date(Math.max(...destructionDates.map(d => d.getTime())));

  return {
    defaultStart: earliestDestruction,
    defaultEnd: latestDestruction,
    minDate: earliestDestruction,
    maxDate: new Date(), // Current date as max
    autoCalculate: true,
  };
}

export function AnimationProvider({
  children,
  sites,
  timelineConfig
}: AnimationProviderProps) {
  const config = timelineConfig || calculateTimelineFromSites(sites);

  const [currentTimestamp, setCurrentTimestamp] = useState(config.defaultStart);
  // ...
}
```

**Priority:** MEDIUM - Important for historical context and flexibility

---

### Issue #16: Filter State Structure Not Extensible

**Location:** `src/types/filters.ts:7-15`

**Current Implementation:**
```typescript
export interface FilterState {
  searchQuery: string;
  selectedTypes: Array<GazaSite["type"]>;
  selectedStatuses: Array<GazaSite["status"]>;
  destructionDateStart: Date | null;
  destructionDateEnd: Date | null;
}
```

**Why it limits extensibility:**
- Adding new filter types requires updating interface
- Cannot add custom filters without code changes (e.g., filter by UNESCO status, by verifier, by artifact count)
- Prevents plugin-style filter extensions
- Hard-coded filter fields

**Recommended solution:**
```typescript
// src/types/filters.ts
export type FilterType = 'select' | 'multiselect' | 'daterange' | 'numberrange' | 'text' | 'boolean';

export interface FilterDefinition {
  id: string;
  type: FilterType;
  field: keyof GazaSite | string; // Support nested paths
  label: string;
  labelArabic?: string;
  options?: any[]; // For select/multiselect
  min?: number; // For numberrange
  max?: number;
  placeholder?: string;
}

export interface FilterState {
  filters: Record<string, any>; // Dynamic filter values by filter ID
  definitions: FilterDefinition[]; // Registered filter configs
}

// Default filters
export const DEFAULT_FILTER_DEFINITIONS: FilterDefinition[] = [
  {
    id: 'search',
    type: 'text',
    field: 'name',
    label: 'Search',
    labelArabic: 'بحث',
    placeholder: 'Search by name...',
  },
  {
    id: 'type',
    type: 'multiselect',
    field: 'type',
    label: 'Site Type',
    labelArabic: 'نوع الموقع',
    options: [], // Populated from SITE_TYPE_REGISTRY
  },
  {
    id: 'status',
    type: 'multiselect',
    field: 'status',
    label: 'Status',
    labelArabic: 'الحالة',
    options: [], // Populated from STATUS_REGISTRY
  },
  {
    id: 'destructionDate',
    type: 'daterange',
    field: 'dateDestroyed',
    label: 'Destruction Date',
    labelArabic: 'تاريخ التدمير',
  },
  {
    id: 'unescoListed',
    type: 'boolean',
    field: 'unescoListed',
    label: 'UNESCO Listed Only',
    labelArabic: 'مدرجة في اليونسكو فقط',
  },
];

// Allow registration of custom filters
export function registerFilter(definition: FilterDefinition): void {
  const existingIndex = DEFAULT_FILTER_DEFINITIONS.findIndex(f => f.id === definition.id);
  if (existingIndex >= 0) {
    DEFAULT_FILTER_DEFINITIONS[existingIndex] = definition;
  } else {
    DEFAULT_FILTER_DEFINITIONS.push(definition);
  }
}

// Generic filter application
export function applyFilters(sites: GazaSite[], state: FilterState): GazaSite[] {
  return sites.filter(site => {
    return state.definitions.every(def => {
      const filterValue = state.filters[def.id];
      if (!filterValue || filterValue === '' || (Array.isArray(filterValue) && filterValue.length === 0)) {
        return true; // No filter applied
      }

      const siteValue = (site as any)[def.field];

      switch (def.type) {
        case 'text':
          return String(siteValue).toLowerCase().includes(String(filterValue).toLowerCase());

        case 'multiselect':
          return (filterValue as any[]).includes(siteValue);

        case 'daterange':
          const [start, end] = filterValue as [Date | null, Date | null];
          const siteDate = siteValue ? new Date(siteValue) : null;
          if (!siteDate) return false;
          if (start && siteDate < start) return false;
          if (end && siteDate > end) return false;
          return true;

        case 'boolean':
          return siteValue === filterValue;

        // ... other types
        default:
          return true;
      }
    });
  });
}

// Example: Add custom filter for artifact count
registerFilter({
  id: 'artifactCount',
  type: 'numberrange',
  field: 'artifactCount',
  label: 'Number of Artifacts',
  labelArabic: 'عدد القطع الأثرية',
  min: 0,
  max: 1000,
});
```

**Priority:** MEDIUM - Enables advanced filtering

---

### Issue #17: Gaza Geographic Center Hard-coded

**Location:** `src/constants/map.ts:9`

**Current Implementation:**
```typescript
export const GAZA_CENTER: [number, number] = [31.42, 34.38] as const;
```

**Why it limits extensibility:**
- Cannot adapt if tracking sites outside Gaza (West Bank, other regions)
- Prevents reuse for other regions or conflicts
- Hard-coded center doesn't auto-adjust to data bounds
- Limits tool to Gaza-specific use case

**Recommended solution:**
```typescript
// src/utils/mapBounds.ts
export function calculateMapCenter(sites: GazaSite[]): [number, number] {
  if (sites.length === 0) {
    return [31.42, 34.38]; // Fallback to Gaza
  }

  const latSum = sites.reduce((sum, s) => sum + s.coordinates[0], 0);
  const lngSum = sites.reduce((sum, s) => sum + s.coordinates[1], 0);

  return [latSum / sites.length, lngSum / sites.length];
}

export function calculateMapBounds(sites: GazaSite[]): [[number, number], [number, number]] | null {
  if (sites.length === 0) return null;

  const lats = sites.map(s => s.coordinates[0]);
  const lngs = sites.map(s => s.coordinates[1]);

  return [
    [Math.min(...lats), Math.min(...lngs)], // Southwest
    [Math.max(...lats), Math.max(...lngs)], // Northeast
  ];
}

// Or make configurable
export interface MapConfig {
  defaultCenter: [number, number];
  defaultZoom: number;
  bounds?: [[number, number], [number, number]]; // Optional bounds constraint
  autoFitBounds?: boolean; // Automatically fit to site data
}

export const DEFAULT_MAP_CONFIG: MapConfig = {
  defaultCenter: [31.42, 34.38],
  defaultZoom: 10.5,
  autoFitBounds: true,
};

// Usage in HeritageMap
export function HeritageMap({ sites, config = DEFAULT_MAP_CONFIG }: Props) {
  const center = config.autoFitBounds
    ? calculateMapCenter(sites)
    : config.defaultCenter;

  const bounds = config.autoFitBounds
    ? calculateMapBounds(sites)
    : config.bounds;

  // ...
}
```

**Priority:** MEDIUM - Important for reusability and future expansion

---

### Issue #18: Marker Icon CDN URL Hard-coded

**Location:** `src/constants/map.ts:27-31`

**Current Implementation:**
```typescript
export const MARKER_ICON_BASE_URL =
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img";
```

**Why it limits extensibility:**
- Dependent on external CDN availability (GitHub raw content)
- Cannot use custom marker sets or local assets
- No offline fallback
- Single point of failure

**Recommended solution:**
```typescript
// src/config/markerIcons.ts
export interface MarkerIconConfig {
  baseUrl: string;
  fallbackUrl?: string;
  customIcons?: Record<string, string>; // Color -> URL mapping
  useLocalAssets?: boolean;
}

export const DEFAULT_MARKER_ICON_CONFIG: MarkerIconConfig = {
  baseUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img",
  fallbackUrl: "/assets/markers", // Local fallback
  useLocalAssets: false,
};

export function getMarkerIconUrl(color: string, config: MarkerIconConfig = DEFAULT_MARKER_ICON_CONFIG): string {
  // Check for custom icon first
  if (config.customIcons && config.customIcons[color]) {
    return config.customIcons[color];
  }

  // Use local assets if configured
  if (config.useLocalAssets && config.fallbackUrl) {
    return `${config.fallbackUrl}/marker-icon-2x-${color}.png`;
  }

  // Use CDN
  return `${config.baseUrl}/marker-icon-2x-${color}.png`;
}

// Service worker can cache marker icons for offline use
// public/sw.js
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/marker-icon')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          return caches.open('marker-icons').then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

**Priority:** MEDIUM - Reliability and offline support

---

### Issue #19: Zoom Levels Hard-coded

**Location:** `src/constants/map.ts:15,22`

**Current Implementation:**
```typescript
export const DEFAULT_ZOOM = 10.5;
export const SITE_DETAIL_ZOOM = 17;
```

**Why it limits extensibility:**
- Cannot adjust zoom for different use cases (mobile devices need different zoom)
- User preference not supported
- Prevents responsive zoom based on screen size
- Hard-coded values don't account for device capabilities

**Recommended solution:**
```typescript
// src/config/mapZoom.ts
export interface ZoomConfig {
  overview: number;
  detail: number;
  min: number;
  max: number;
  mobile?: {
    overview: number;
    detail: number;
  };
  tablet?: {
    overview: number;
    detail: number;
  };
}

export const DEFAULT_ZOOM_CONFIG: ZoomConfig = {
  overview: 10.5,
  detail: 17,
  min: 8,
  max: 19,
  mobile: {
    overview: 9.5,
    detail: 16,
  },
  tablet: {
    overview: 10,
    detail: 16.5,
  },
};

export function getZoomForDevice(
  zoomType: 'overview' | 'detail',
  config: ZoomConfig = DEFAULT_ZOOM_CONFIG
): number {
  const width = window.innerWidth;

  if (width < 768 && config.mobile) {
    return config.mobile[zoomType];
  }

  if (width < 1024 && config.tablet) {
    return config.tablet[zoomType];
  }

  return config[zoomType];
}

// Usage in components
export function HeritageMap({ config }: Props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const zoom = getZoomForDevice('overview', config);

  return <MapContainer zoom={zoom} {...props} />;
}
```

**Priority:** MEDIUM - User experience improvement for mobile users

---

### Issue #20: Glow Contribution Formula Hard-coded

**Location:** `src/utils/heritageCalculations.ts:15-35`

**Current Implementation:**
```typescript
export const calculateGlowContribution = (site: GazaSite): number => {
  let weight = 100;
  const age = 2024 - parseYearBuilt(site.yearBuilt);

  if (age > 2000) weight *= 3;      // Ancient
  else if (age > 1000) weight *= 2; // Medieval
  else if (age > 200) weight *= 1.5; // Historic

  if (site.unescoListed) weight *= 2;
  if (site.artifactCount && site.artifactCount > 100) weight *= 1.5;
  if (site.isUnique) weight *= 2;

  return weight;
};
```

**Why it limits extensibility:**
- Age multipliers (3x, 2x, 1.5x) are magic numbers
- Cannot adjust significance weighting based on academic consensus
- Prevents alternative valuation methodologies
- Hard-coded thresholds (2000 years, 1000 years, 200 years)

**Recommended solution:**
```typescript
// src/config/glowWeights.ts
export interface SignificanceWeights {
  baseWeight: number;
  ageMultipliers: {
    ancient: { threshold: number; multiplier: number };      // > 2000 years
    medieval: { threshold: number; multiplier: number };     // > 1000 years
    historic: { threshold: number; multiplier: number };     // > 200 years
  };
  attributeMultipliers: {
    unesco: number;
    artifacts: { threshold: number; multiplier: number };
    uniqueness: number;
  };
}

export const DEFAULT_SIGNIFICANCE_WEIGHTS: SignificanceWeights = {
  baseWeight: 100,
  ageMultipliers: {
    ancient: { threshold: 2000, multiplier: 3 },
    medieval: { threshold: 1000, multiplier: 2 },
    historic: { threshold: 200, multiplier: 1.5 },
  },
  attributeMultipliers: {
    unesco: 2,
    artifacts: { threshold: 100, multiplier: 1.5 },
    uniqueness: 2,
  },
};

// Alternative weighting for academic use
export const ACADEMIC_SIGNIFICANCE_WEIGHTS: SignificanceWeights = {
  baseWeight: 100,
  ageMultipliers: {
    ancient: { threshold: 3000, multiplier: 4 },    // Stricter definition
    medieval: { threshold: 1000, multiplier: 2.5 },
    historic: { threshold: 500, multiplier: 1.5 },
  },
  attributeMultipliers: {
    unesco: 3,          // Higher weight for UNESCO
    artifacts: { threshold: 500, multiplier: 2 },
    uniqueness: 3,
  },
};

export function calculateGlowContribution(
  site: GazaSite,
  weights: SignificanceWeights = DEFAULT_SIGNIFICANCE_WEIGHTS
): number {
  let weight = weights.baseWeight;
  const age = 2024 - (parseYearBuilt(site.yearBuilt) || 0);

  // Apply age multipliers
  if (age > weights.ageMultipliers.ancient.threshold) {
    weight *= weights.ageMultipliers.ancient.multiplier;
  } else if (age > weights.ageMultipliers.medieval.threshold) {
    weight *= weights.ageMultipliers.medieval.multiplier;
  } else if (age > weights.ageMultipliers.historic.threshold) {
    weight *= weights.ageMultipliers.historic.multiplier;
  }

  // Apply attribute multipliers
  if (site.unescoListed) {
    weight *= weights.attributeMultipliers.unesco;
  }

  if (site.artifactCount && site.artifactCount > weights.attributeMultipliers.artifacts.threshold) {
    weight *= weights.attributeMultipliers.artifacts.multiplier;
  }

  if (site.isUnique) {
    weight *= weights.attributeMultipliers.uniqueness;
  }

  return weight;
}

// Allow users to configure weights
export function GlowConfigurationPanel() {
  const [weights, setWeights] = useState(DEFAULT_SIGNIFICANCE_WEIGHTS);

  return (
    <div>
      <h3>Significance Weighting Configuration</h3>

      <label>
        Ancient Threshold (years):
        <input
          type="number"
          value={weights.ageMultipliers.ancient.threshold}
          onChange={e => setWeights({
            ...weights,
            ageMultipliers: {
              ...weights.ageMultipliers,
              ancient: { ...weights.ageMultipliers.ancient, threshold: Number(e.target.value) }
            }
          })}
        />
      </label>

      {/* ... similar for other weights */}

      <Button onClick={() => setWeights(DEFAULT_SIGNIFICANCE_WEIGHTS)}>
        Reset to Default
      </Button>
      <Button onClick={() => setWeights(ACADEMIC_SIGNIFICANCE_WEIGHTS)}>
        Use Academic Weights
      </Button>
    </div>
  );
}
```

**Priority:** MEDIUM - Academic flexibility and customization

---

### Issue #21: Year Parsing Logic Inflexible

**Location:** `src/utils/siteFilters.ts:62-91`

**Current Implementation:**
```typescript
export const parseYearBuilt = (yearBuilt: string): number | null => {
  // Hard-coded regex patterns for specific formats
  const bceMatch = yearBuilt.match(/(\d+)\s*(BCE|BC)/i);
  if (bceMatch) {
    return -parseInt(bceMatch[1], 10);
  }

  const ceMatch = yearBuilt.match(/(\d+)\s*(CE|AD)/i);
  if (ceMatch) {
    return parseInt(ceMatch[1], 10);
  }

  const centuryMatch = yearBuilt.match(/(\d+)(?:st|nd|rd|th)\s+century/i);
  if (centuryMatch) {
    const century = parseInt(centuryMatch[1], 10);
    return (century - 1) * 100 + 50; // Midpoint
  }

  const yearMatch = yearBuilt.match(/\d{3,4}/);
  if (yearMatch) {
    return parseInt(yearMatch[0], 10);
  }

  return null;
};
```

**Why it limits extensibility:**
- Cannot handle Islamic calendar dates (present in `yearBuiltHijri` field)
- Doesn't support date ranges ("800-900 CE")
- Cannot parse approximate dates ("circa 1200", "~1500")
- No support for other calendar systems (Julian, Hebrew, etc.)
- No context for parsing ambiguity

**Recommended solution:**
```typescript
// src/types/dates.ts
export type Calendar = 'gregorian' | 'islamic' | 'julian' | 'hebrew';
export type Era = 'CE' | 'BCE' | 'AH'; // Add Islamic Hijri

export interface ParsedDate {
  year: number;
  era: Era;
  calendar: Calendar;
  isApproximate?: boolean;
  rangeStart?: number;
  rangeEnd?: number;
  confidence?: 'certain' | 'likely' | 'estimated';
  originalString: string;
}

// src/utils/dateParsers.ts
export interface DateParser {
  name: string;
  priority: number; // Lower = try first
  canParse(input: string): boolean;
  parse(input: string): ParsedDate | null;
  format(date: ParsedDate): string;
}

// Gregorian BCE/CE parser
export class GregorianParser implements DateParser {
  name = 'Gregorian';
  priority = 1;

  canParse(input: string): boolean {
    return /\d+\s*(BCE|BC|CE|AD)/i.test(input);
  }

  parse(input: string): ParsedDate | null {
    const bceMatch = input.match(/(\d+)\s*(BCE|BC)/i);
    if (bceMatch) {
      return {
        year: -parseInt(bceMatch[1], 10),
        era: 'BCE',
        calendar: 'gregorian',
        originalString: input,
      };
    }

    const ceMatch = input.match(/(\d+)\s*(CE|AD)/i);
    if (ceMatch) {
      return {
        year: parseInt(ceMatch[1], 10),
        era: 'CE',
        calendar: 'gregorian',
        originalString: input,
      };
    }

    return null;
  }

  format(date: ParsedDate): string {
    const absYear = Math.abs(date.year);
    return `${absYear} ${date.era}`;
  }
}

// Islamic calendar parser
export class IslamicCalendarParser implements DateParser {
  name = 'Islamic';
  priority = 2;

  canParse(input: string): boolean {
    return /\d+\s*AH/i.test(input);
  }

  parse(input: string): ParsedDate | null {
    const ahMatch = input.match(/(\d+)\s*AH/i);
    if (ahMatch) {
      const hijriYear = parseInt(ahMatch[1], 10);
      // Convert Hijri to Gregorian (approximate)
      const gregorianYear = Math.floor((hijriYear * 0.970225) + 622);

      return {
        year: gregorianYear,
        era: 'AH',
        calendar: 'islamic',
        originalString: input,
      };
    }

    return null;
  }

  format(date: ParsedDate): string {
    return `${date.year} AH`;
  }
}

// Range parser
export class RangeParser implements DateParser {
  name = 'Range';
  priority = 3;

  canParse(input: string): boolean {
    return /\d+\s*-\s*\d+/.test(input);
  }

  parse(input: string): ParsedDate | null {
    const rangeMatch = input.match(/(\d+)\s*-\s*(\d+)/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      const midpoint = Math.floor((start + end) / 2);

      return {
        year: midpoint,
        era: 'CE',
        calendar: 'gregorian',
        rangeStart: start,
        rangeEnd: end,
        confidence: 'estimated',
        originalString: input,
      };
    }

    return null;
  }

  format(date: ParsedDate): string {
    if (date.rangeStart && date.rangeEnd) {
      return `${date.rangeStart}-${date.rangeEnd}`;
    }
    return `${date.year}`;
  }
}

// Approximate date parser
export class ApproximateParser implements DateParser {
  name = 'Approximate';
  priority = 4;

  canParse(input: string): boolean {
    return /circa|~|approximately|about/i.test(input);
  }

  parse(input: string): ParsedDate | null {
    const yearMatch = input.match(/\d{3,4}/);
    if (yearMatch) {
      return {
        year: parseInt(yearMatch[0], 10),
        era: 'CE',
        calendar: 'gregorian',
        isApproximate: true,
        confidence: 'estimated',
        originalString: input,
      };
    }

    return null;
  }

  format(date: ParsedDate): string {
    return `circa ${date.year}`;
  }
}

// Century parser
export class CenturyParser implements DateParser {
  name = 'Century';
  priority = 5;

  canParse(input: string): boolean {
    return /\d+(?:st|nd|rd|th)\s+century/i.test(input);
  }

  parse(input: string): ParsedDate | null {
    const centuryMatch = input.match(/(\d+)(?:st|nd|rd|th)\s+century/i);
    if (centuryMatch) {
      const century = parseInt(centuryMatch[1], 10);
      const midpoint = (century - 1) * 100 + 50;

      return {
        year: midpoint,
        era: 'CE',
        calendar: 'gregorian',
        rangeStart: (century - 1) * 100,
        rangeEnd: century * 100,
        confidence: 'estimated',
        originalString: input,
      };
    }

    return null;
  }

  format(date: ParsedDate): string {
    const century = Math.floor(date.year / 100) + 1;
    return `${century}th century`;
  }
}

// Registry of parsers
const DATE_PARSER_REGISTRY: DateParser[] = [
  new GregorianParser(),
  new IslamicCalendarParser(),
  new RangeParser(),
  new ApproximateParser(),
  new CenturyParser(),
];

// Sort by priority
DATE_PARSER_REGISTRY.sort((a, b) => a.priority - b.priority);

export function parseYearBuilt(yearBuilt: string): ParsedDate | null {
  for (const parser of DATE_PARSER_REGISTRY) {
    if (parser.canParse(yearBuilt)) {
      const result = parser.parse(yearBuilt);
      if (result) return result;
    }
  }

  return null;
}

// Get numeric year for sorting/filtering
export function getYearNumeric(yearBuilt: string): number | null {
  const parsed = parseYearBuilt(yearBuilt);
  return parsed ? parsed.year : null;
}

// Format date for display
export function formatYearBuilt(yearBuilt: string, locale: string = 'en'): string {
  const parsed = parseYearBuilt(yearBuilt);
  if (!parsed) return yearBuilt;

  const parser = DATE_PARSER_REGISTRY.find(p => p.canParse(parsed.originalString));
  return parser ? parser.format(parsed) : yearBuilt;
}

// Allow registration of custom parsers
export function registerDateParser(parser: DateParser): void {
  DATE_PARSER_REGISTRY.push(parser);
  DATE_PARSER_REGISTRY.sort((a, b) => a.priority - b.priority);
}
```

**Priority:** MEDIUM - Important for data accuracy and international support

---

### Issue #22: Verifier Organizations Hard-coded in Data

**Location:** `src/data/mockSites.ts` (lines 25, 70, 118, etc.)

**Current Implementation:**
```typescript
const mockSites: GazaSite[] = [
  {
    id: "1",
    name: "Great Omari Mosque",
    verifiedBy: ["UNESCO", "Heritage for Peace", "Forensic Architecture"],
    // ...
  },
  // ... free-text verifier names throughout
];
```

**Why it limits extensibility:**
- No central registry of valid verifiers
- Cannot track verifier credentials or reputation
- Cannot link to verifier profiles or methodologies
- Free-text allows typos and inconsistencies ("UNESCO" vs "Unesco" vs "UNESCO World Heritage")
- No metadata about verification date or methodology

**Recommended solution:**
```typescript
// src/config/verifiers.ts
export interface VerifierOrganization {
  id: string;
  name: string;
  nameArabic?: string;
  type: 'government' | 'ngo' | 'academic' | 'international' | 'forensic';
  website?: string;
  credibilityScore?: number; // 0-100
  description?: string;
  methodology?: string;
  established?: number; // Year founded
}

export const VERIFIER_REGISTRY: Record<string, VerifierOrganization> = {
  "unesco": {
    id: "unesco",
    name: "UNESCO",
    nameArabic: "اليونسكو",
    type: "international",
    website: "https://www.unesco.org",
    credibilityScore: 100,
    description: "United Nations Educational, Scientific and Cultural Organization",
    methodology: "On-site inspection and documentation by heritage experts",
    established: 1945,
  },
  "heritage-for-peace": {
    id: "heritage-for-peace",
    name: "Heritage for Peace",
    nameArabic: "التراث من أجل السلام",
    type: "ngo",
    website: "https://www.heritageforpeace.org",
    credibilityScore: 95,
    description: "NGO documenting heritage destruction in conflict zones",
    methodology: "Satellite imagery analysis and on-ground documentation",
    established: 2013,
  },
  "forensic-architecture": {
    id: "forensic-architecture",
    name: "Forensic Architecture",
    nameArabic: "العمارة الجنائية",
    type: "forensic",
    website: "https://forensic-architecture.org",
    credibilityScore: 98,
    description: "Research agency investigating human rights violations through spatial analysis",
    methodology: "Advanced forensic analysis using satellite imagery, 3D modeling, and open-source intelligence",
    established: 2010,
  },
  "palestinian-ministry-culture": {
    id: "palestinian-ministry-culture",
    name: "Palestinian Ministry of Culture",
    nameArabic: "وزارة الثقافة الفلسطينية",
    type: "government",
    credibilityScore: 90,
    description: "Official government ministry responsible for cultural heritage",
    methodology: "Official government documentation and reporting",
  },
  "unosat": {
    id: "unosat",
    name: "UNOSAT",
    nameArabic: "يونوسات",
    type: "international",
    website: "https://www.unitar.org/unosat",
    credibilityScore: 100,
    description: "UN Satellite Analysis Programme",
    methodology: "Satellite imagery analysis for humanitarian operations",
    established: 2001,
  },
  // ... 20+ more verifiers
};

export function getVerifiers(): VerifierOrganization[] {
  return Object.values(VERIFIER_REGISTRY)
    .sort((a, b) => (b.credibilityScore || 0) - (a.credibilityScore || 0));
}

export function getVerifierById(id: string): VerifierOrganization | undefined {
  return VERIFIER_REGISTRY[id];
}

export function registerVerifier(verifier: VerifierOrganization): void {
  VERIFIER_REGISTRY[verifier.id] = verifier;
}

// Enhanced verification data structure
export interface Verification {
  verifierId: string;
  date: string;
  methodology?: string;
  confidence: 'confirmed' | 'likely' | 'reported';
  sourceUrl?: string;
  notes?: string;
}

// Update GazaSite interface
export interface GazaSite {
  // ... other fields
  verifiedBy: string[]; // IDs instead of free text
  verifications?: Verification[]; // Detailed verification records
}

// Calculate overall credibility score
export function calculateSiteCredibility(site: GazaSite): number {
  if (!site.verifiedBy || site.verifiedBy.length === 0) return 0;

  const scores = site.verifiedBy
    .map(id => getVerifierById(id)?.credibilityScore || 50)
    .filter(Boolean);

  if (scores.length === 0) return 0;

  // Weighted average (multiple verifiers = higher confidence)
  const baseScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const multiVerifierBonus = Math.min(scores.length * 5, 20); // Up to +20 for multiple verifiers

  return Math.min(100, baseScore + multiVerifierBonus);
}

// Display verifier badges
export function VerifierBadges({ siteId }: { siteId: string }) {
  const site = useSiteById(siteId);
  const verifiers = site.verifiedBy.map(id => getVerifierById(id)).filter(Boolean);

  return (
    <div className="verifier-badges">
      {verifiers.map(verifier => (
        <a
          key={verifier.id}
          href={verifier.website}
          target="_blank"
          rel="noopener noreferrer"
          className="verifier-badge"
          title={`Verified by ${verifier.name}`}
        >
          <img src={`/assets/verifiers/${verifier.id}.png`} alt={verifier.name} />
          <span>{verifier.name}</span>
        </a>
      ))}
    </div>
  );
}
```

**Priority:** MEDIUM - Data quality and credibility tracking

---

## LOW Priority Issues

### Issue #23: Marker Configuration Not Responsive

**Location:** `src/constants/map.ts:36-46`

**Current Implementation:**
```typescript
export const MARKER_CONFIG = {
  iconSize: [12, 20] as [number, number],
  highlightedIconSize: [25, 41] as [number, number],
  iconAnchor: [6, 20] as [number, number],
  popupAnchor: [0, -20] as [number, number],
} as const;
```

**Why it limits extensibility:**
- Same marker sizes for all screen sizes (desktop vs mobile)
- Cannot adjust for accessibility (larger markers for low vision users)
- No touch target size consideration for mobile

**Recommended solution:**
Make sizes responsive or configurable per device. Use larger touch targets on mobile (44x44px minimum for accessibility).

**Priority:** LOW - Nice-to-have for UX

---

### Issue #24: Modal Table Variants Not Extensible

**Location:** `src/components/SitesTable/index.tsx`

**Current Implementation:**
```typescript
export type TableVariant = "compact" | "expanded" | "mobile";
```

**Why it limits extensibility:**
- Cannot add custom table layouts (e.g., "print", "presentation", "minimal", "detailed")
- Prevents third-party plugins from adding views
- Hard-coded variant logic

**Recommended solution:**
```typescript
export interface TableVariantConfig {
  id: string;
  label: string;
  columns: Array<keyof GazaSite | string>;
  showImages?: boolean;
  allowExport?: boolean;
  density: 'compact' | 'comfortable' | 'spacious';
  customRenderer?: (site: GazaSite) => ReactNode;
}

const VARIANT_REGISTRY: Record<string, TableVariantConfig> = {
  compact: {
    id: 'compact',
    label: 'Compact View',
    columns: ['name', 'type', 'status', 'dateDestroyed'],
    density: 'compact',
  },
  // ... allow custom variants
};
```

**Priority:** LOW - Advanced customization

---

### Issue #25: Error Messages Hard-coded

**Location:** Throughout codebase

**Why it limits extensibility:**
- Cannot translate error messages
- Cannot customize for different user types (technical vs. general)
- Hard-coded strings in error handling

**Recommended solution:**
Use translation system (Issue #3) for all error messages. Create error code registry.

**Priority:** LOW - Part of larger i18n effort

---

### Issue #26: Animation Frame Rate Hard-coded

**Location:** `src/contexts/AnimationContext.tsx:152`

**Current Implementation:**
```typescript
if (timestamp - lastFrameTimeRef.current < 16.67) { // ~60fps
  requestAnimationFrame(animate);
  return;
}
```

**Why it limits extensibility:**
- Cannot adjust for low-power devices (reduce to 30fps)
- Prevents performance optimization based on device capabilities
- Hard-coded 60fps assumption

**Recommended solution:**
Make frame rate configurable via AnimationConfig. Detect device performance and adapt.

**Priority:** LOW - Optimization

---

### Issue #27: Component Class Names Not Extensible

**Location:** Multiple component files

**Why it limits extensibility:**
- Cannot inject custom CSS classes from parent components
- Prevents theming systems from overriding styles
- Hard-coded Tailwind classes throughout
- No support for CSS-in-JS or CSS modules

**Recommended solution:**
```typescript
interface BaseProps {
  className?: string;
  classNames?: Partial<Record<string, string>>; // Per-element classes
}

export function Button({ className, classNames, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "base-button-styles px-4 py-2 rounded",
        classNames?.root,
        className
      )}
    >
      <span className={cn("button-text", classNames?.text)}>
        {children}
      </span>
    </button>
  );
}

// Usage:
<Button
  className="my-custom-class"
  classNames={{
    root: "shadow-lg",
    text: "font-bold"
  }}
/>
```

**Priority:** LOW - Advanced theming

---

## Implementation Roadmap

### Phase 1 - Foundation (Weeks 1-2) - CRITICAL

**Goal:** Unblock 100+ site expansion and backend integration

1. **Issue #1: Site Type Registry** (2-3 days)
   - Create `src/types/siteTypes.ts` and `src/config/siteTypes.ts`
   - Update `GazaSite` interface to use `type: string`
   - Refactor `SiteTypeIcon` component
   - Update filter constants
   - Add tests

2. **Issue #2: Status Registry** (2-3 days)
   - Create `src/types/siteStatus.ts` and `src/config/siteStatus.ts`
   - Update `GazaSite` interface to use `status: string`
   - Refactor marker color logic
   - Update filter constants
   - Add tests

3. **Issue #4: Export Format System** (3-4 days)
   - Create exporter architecture (`src/utils/exporters/`)
   - Implement GeoJSON exporter (CRITICAL for researchers)
   - Implement JSON exporter (for API integration)
   - Add export format selector UI
   - Add tests

### Phase 2 - Data Flexibility (Weeks 3-4) - HIGH

4. **Issue #8: Source Type Registry** (1-2 days)
   - Similar pattern to Issues #1 and #2
   - Create source type registry
   - Update data structures

5. **Issue #22: Verifier Registry** (2-3 days)
   - Create verifier organization registry
   - Add credibility scoring
   - Update data structures
   - Add verifier badges UI

6. **Issue #3: i18n Architecture Skeleton** (4-5 days)
   - Set up i18n infrastructure (types, context, hooks)
   - Create English and Arabic translation files (top 50 strings)
   - Add locale switcher UI
   - Update 10-15 most visible components
   - Defer full translation to Phase 4

### Phase 3 - Configuration (Weeks 5-6) - HIGH

7. **Issue #6: Tile Layer Registry** (1-2 days)
   - Create tile layer configuration system
   - Allow custom tile providers

8. **Issue #7: Imagery Period System** (2-3 days)
   - Dynamic imagery period registration
   - Auto-populate from Wayback releases (optional)

9. **Issue #11: Theme System** (2-3 days)
   - Create color theme registry
   - Add theme switcher
   - Support high contrast and colorblind modes

### Phase 4 - Polish (Weeks 7-8) - MEDIUM/LOW

10. **Remaining HIGH priority issues** (3-4 days)
    - Issue #5: Locale in date formatting
    - Issue #9: Icon mapping (already tied to #1)
    - Issue #10: Marker colors (already tied to #2)
    - Issue #12: Animation speeds

11. **Selected MEDIUM priority issues** (3-4 days)
    - Issue #14: CSV column customization
    - Issue #16: Filter extensibility
    - Issue #21: Enhanced date parsing

12. **Testing and Documentation** (2-3 days)
    - Integration tests for all registries
    - Documentation updates
    - Example configurations

---

## Testing Recommendations

For each extensibility improvement:

1. **Unit Tests**
   - Test registry CRUD operations
   - Test configuration validation
   - Test fallback behaviors

2. **Integration Tests**
   - Verify registries work with components
   - Test data migration paths
   - Verify backward compatibility

3. **Extensibility Tests**
   - Create example plugins/extensions
   - Validate API design with real use cases
   - Test with 1000+ sites for performance

4. **Example Configurations**
   - Provide multiple theme presets
   - Show custom site type examples
   - Demonstrate export format additions

---

## Migration Strategy

### Backward Compatibility

Maintain backward compatibility during transition:

```typescript
// Old code still works:
const site: GazaSite = {
  type: "mosque", // String literal still valid
  status: "destroyed",
};

// New code is more flexible:
const site: GazaSite = {
  type: "library", // New type without code changes
  status: "partially-restored",
};

// Graceful degradation:
const typeConfig = getSiteTypeConfig(site.type);
// Returns default config if type not registered
```

### Data Migration

For existing data (mockSites.ts):
- No immediate changes required
- Gradually enhance with new fields (typeConfig, statusConfig, etc.)
- Provide migration utilities for external data sources

---

## Success Metrics

After implementing extensibility improvements:

1. **Measure: Lines of code to add new site type**
   - Before: ~50 lines across 6 files
   - Target: ~5 lines (registry entry only)

2. **Measure: Time to add new export format**
   - Before: Not possible without fork
   - Target: 30 minutes (new exporter class)

3. **Measure: Configuration flexibility**
   - Before: 15 hard-coded constants
   - Target: 0 (all configurable)

4. **Measure: Translation coverage**
   - Before: 0% (English only)
   - Target: 80% of UI strings translatable

5. **Measure: Community contributions**
   - Track custom site types, themes, exporters contributed by community

---

## Conclusion

This extensibility review identifies **27 issues** across 4 priority levels. The **4 CRITICAL issues** (#1, #2, #3, #4) would block major features and should be addressed before backend integration. The recommended **8-week phased approach** balances impact with implementation effort, starting with the foundation (registries) and building toward polish (theming, configuration).

**Key Principles Applied:**
- **Registry Pattern**: Replace enums with registries for runtime extensibility
- **Configuration over Code**: Make values configurable instead of hard-coded
- **Graceful Degradation**: Provide sensible defaults and fallbacks
- **Backward Compatibility**: Old code continues to work during migration
- **Plugin Architecture**: Allow third-party extensions without forking

**Next Steps:**
1. Implement Issue #1 (Site Type Registry) as proof-of-concept
2. Use learnings to establish patterns for Issues #2, #8, #22
3. Validate approach with team before proceeding to Phase 2

---

**Document Version:** 1.0
**Last Updated:** October 23, 2025
**Author:** Claude Code (Anthropic)
**Review Status:** Initial comprehensive review
