# Code Refactoring Plan - Heritage Tracker

**Version:** 1.5.0
**Date:** October 16, 2025
**Status:** 🚧 **Phase 1 Complete** - Phase 2 In Progress
**Purpose:** Break down large files into smaller, more maintainable modules following DRY/SOLID/React best practices

---

## Progress Summary

### ✅ Phase 1: Foundation Complete (Sessions 1-2)
**Status:** Complete - 3 commits merged to `feature/refactor-cleanUp`

**Completed:**
- ✅ Extracted CSV export utilities (`src/utils/csvExport.ts`)
- ✅ Extracted className utility (`src/utils/classNames.ts`)
- ✅ Extracted color helpers (`src/utils/colorHelpers.ts`)
- ✅ Created reusable `useTableSort` hook (`src/hooks/useTableSort.tsx`)
- ✅ Reorganized theme.ts (227 lines) into:
  - `src/styles/colors.ts` (Palestinian flag palette)
  - `src/styles/components.ts` (component configs)
  - `src/styles/theme.ts` (barrel exports, 16 lines)
- ✅ Created reusable Stats UI components:
  - `src/components/Stats/HeroStatistic.tsx`
  - `src/components/Stats/StatCard.tsx`
  - `src/components/Stats/SiteLossExample.tsx`
- ✅ Updated SitesTable.tsx to use csvExport utilities
- ✅ All 184 tests passing
- ✅ Linter clean (0 errors, 0 warnings)

**Commits:**
- `891b211` - refactor: extract utilities and reorganize theme (Phase 1)
- `028093d` - feat: add reusable Stats UI components
- `285e576` - fix: rename useTableSort to .tsx and fix TypeScript errors

### 🚧 Phase 2: Major Components (Current)
**Status:** In Progress

**Remaining:**
- [ ] Refactor App.tsx (593 → ~150 lines)
- [ ] Refactor SitesTable.tsx (606 → ~200 lines)
- [ ] Refactor StatsDashboard.tsx (601 → ~150 lines)

---

## Executive Summary

This document provides a comprehensive plan to refactor the Heritage Tracker codebase by separating large files into smaller, focused modules. The current codebase has several files exceeding 200-600 lines, which can make maintenance and collaboration difficult.

### Current Problem Files (by line count)

| File | Lines | Status | Issue |
|------|-------|--------|-------|
| `mockSites.ts` | 1,557 | ⏸️ | Pure data file - acceptable size for static JSON |
| `SitesTable.tsx` | 606 | 🚧 | Multiple table variants in one file |
| `StatsDashboard.tsx` | 601 | 🚧 | Monolithic statistics component with many sections |
| `App.tsx` | 593 | 🚧 | God component with too many responsibilities |
| `TimelineScrubber.tsx` | 313 | ⏸️ | Complex D3 timeline with mixed concerns |
| `About.tsx` | 291 | ⏸️ | Long content component with multiple sections |
| `HeritageMap.tsx` | 245 | ⏸️ | Map component with mixed concerns |
| `FilterBar.tsx` | 235 | ⏸️ | Complex filter UI with state management |
| `theme.ts` | 227 | ✅ | Split into colors.ts, components.ts, theme.ts (16 lines) |
| `heritageCalculations.ts` | 219 | ⏸️ | Complex calculations in one file |

**Legend:** ✅ Complete | 🚧 In Progress | ⏸️ Pending

### Goals

1. **Improve Maintainability:** Smaller files are easier to understand and modify
2. **Follow SOLID Principles:** Single Responsibility, Open/Closed, etc.
3. **Enhance Testability:** Smaller units are easier to test
4. **Reduce Cognitive Load:** Developers can focus on one concern at a time
5. **Enable Better Collaboration:** Multiple developers can work on different pieces
6. **Improve Code Reusability:** Extract common patterns into shared utilities

---

## Priority 1: Critical Refactorings (High Impact, High Value)

### 1.1 App.tsx Refactoring (593 lines → ~150 lines)

**Current Issues:**
- Single component handles application state, filter logic, modal management, layout, and event handling
- 50+ lines of state declarations
- Complex resize logic mixed with business logic
- Violates Single Responsibility Principle

**Refactoring Plan:**

#### Step 1: Extract State Management Hook
**Create:** `src/hooks/useAppState.ts` (~100 lines)
```typescript
export function useAppState() {
  // Extract all useState declarations
  // Extract filter logic
  // Export clean interface
  return {
    // Site selection
    selectedSite, setSelectedSite,
    highlightedSiteId, setHighlightedSiteId,

    // Filters
    filters, updateFilters, clearFilters,
    tempFilters, updateTempFilters,
    hasActiveFilters,

    // Modals
    modals, openModal, closeModal,

    // UI state
    tableWidth, setTableWidth,
    isResizing, setIsResizing,
  };
}
```

**Benefits:**
- Centralized state management
- Easier to test state transitions
- Can be reused in other components if needed

#### Step 2: Extract Filter Logic Hook
**Create:** `src/hooks/useFilteredSites.ts` (~80 lines)
```typescript
export function useFilteredSites(
  sites: GazaSite[],
  filters: FilterState
) {
  // Memoized filter pipeline
  const typeAndStatusFiltered = useMemo(...);
  const destructionDateFiltered = useMemo(...);
  const yearFiltered = useMemo(...);
  const searchFiltered = useMemo(...);

  return {
    filteredSites: searchFiltered,
    count: searchFiltered.length,
    total: sites.length,
  };
}
```

**Benefits:**
- Pure filter logic separated from UI
- Easy to unit test
- Memoization optimizations in one place

#### Step 3: Extract Table Resize Hook
**Create:** `src/hooks/useTableResize.ts` (~60 lines)
```typescript
export function useTableResize(
  initialWidth: number = 480,
  minWidth: number = 480,
  maxWidth: number = 1100
) {
  const [tableWidth, setTableWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  // Extract all resize logic
  const handleResizeStart = useCallback(...);
  const getVisibleColumns = useCallback(...);

  // Effect for mouse move/up listeners
  useEffect(...);

  return {
    tableWidth,
    isResizing,
    handleResizeStart,
    getVisibleColumns,
  };
}
```

**Benefits:**
- Reusable resize logic
- Cleaner component code
- Testable in isolation

#### Step 4: Extract Layout Components
**Create:** `src/components/Layout/AppHeader.tsx` (~60 lines)
```typescript
export function AppHeader({
  onOpenDonate,
  onOpenStats,
  onOpenAbout
}: AppHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-[#000000]">
      {/* Header content */}
      {/* Flag line */}
    </div>
  );
}
```

**Create:** `src/components/Layout/AppFooter.tsx` (~40 lines)
```typescript
export function AppFooter({
  onOpenDonate,
  onOpenStats,
  onOpenAbout,
  isMobile,
}: AppFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#009639]">
      {/* Footer content */}
    </footer>
  );
}
```

**Create:** `src/components/Layout/DesktopLayout.tsx` (~120 lines)
```typescript
export function DesktopLayout({
  filteredSites,
  tableProps,
  mapProps,
  timelineProps,
  filterBarProps,
}: DesktopLayoutProps) {
  return (
    <div className="hidden md:block">
      {/* Filter bar, search, tags */}
      {/* Two-column layout */}
    </div>
  );
}
```

**Create:** `src/components/Layout/MobileLayout.tsx` (~40 lines)
```typescript
export function MobileLayout({
  filteredSites,
  filterBarProps,
  tableProps,
}: MobileLayoutProps) {
  return (
    <div className="md:hidden">
      {/* Mobile filter bar */}
      {/* Mobile table */}
    </div>
  );
}
```

**Benefits:**
- Clear separation of layout concerns
- Easier to modify desktop vs mobile layouts
- Components can be tested independently

#### Step 5: New App.tsx Structure (~150 lines)
```typescript
function AppContent({ isMobile }: { isMobile: boolean }) {
  // Use extracted hooks
  const appState = useAppState();
  const { filteredSites } = useFilteredSites(mockSites, appState.filters);
  const tableResize = useTableResize();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader {...appState.modals} />

      <main className="pb-24 md:pb-32">
        {isMobile ? (
          <MobileLayout
            filteredSites={filteredSites}
            {...appState}
            {...tableResize}
          />
        ) : (
          <DesktopLayout
            filteredSites={filteredSites}
            {...appState}
            {...tableResize}
          />
        )}
      </main>

      {/* Modals with extracted components */}
      <AppModals {...appState} filteredSites={filteredSites} />

      <AppFooter isMobile={isMobile} {...appState.modals} />
    </div>
  );
}
```

**Result:** App.tsx reduced from 593 → ~150 lines

---

### 1.2 SitesTable.tsx Refactoring (606 lines → ~200 lines)

**Current Issues:**
- Three table variants (compact, expanded, mobile) in one file
- CSV export logic embedded
- Sorting logic embedded
- Mobile accordion and desktop table logic intermingled

**Refactoring Plan:**

#### Step 1: Extract CSV Export Utilities
**Create:** `src/utils/csvExport.ts` (~60 lines)
```typescript
export function sitesToCSV(sites: GazaSite[]): string {
  // CSV conversion logic
}

export function downloadCSV(sites: GazaSite[], filename?: string) {
  // Download trigger logic
}

export function escapeCSV(value: string | undefined | null): string {
  // RFC 4180 escaping
}
```

**Benefits:**
- Reusable across app (e.g., for other export features)
- Unit testable
- Follows Single Responsibility

#### Step 2: Extract Table Sorting Hook
**Create:** `src/hooks/useTableSort.ts` (~80 lines)
```typescript
export function useTableSort<T extends Record<string, any>>(
  data: T[],
  initialField: string,
  initialDirection: 'asc' | 'desc' = 'asc'
) {
  const [sortField, setSortField] = useState(initialField);
  const [sortDirection, setSortDirection] = useState(initialDirection);

  const sortedData = useMemo(() => {
    // Generic sorting logic
  }, [data, sortField, sortDirection]);

  const handleSort = useCallback((field: string) => {
    // Toggle logic
  }, [sortField, sortDirection]);

  const SortIcon = ({ field }: { field: string }) => {
    // Sort indicator component
  };

  return { sortedData, sortField, sortDirection, handleSort, SortIcon };
}
```

**Benefits:**
- Reusable sorting logic
- Type-safe
- Reduces table component complexity

#### Step 3: Split Table Variants into Separate Components
**Create:** `src/components/SitesTable/SitesTableCompact.tsx` (~150 lines)
```typescript
export function SitesTableCompact({
  sites,
  visibleColumns,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  onExpandTable,
}: SitesTableCompactProps) {
  const { sortedData, handleSort, SortIcon } = useTableSort(sites, 'dateDestroyed', 'desc');
  // Desktop compact table logic only
}
```

**Create:** `src/components/SitesTable/SitesTableExpanded.tsx` (~170 lines)
```typescript
export function SitesTableExpanded({
  sites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
}: SitesTableExpandedProps) {
  const { sortedData, handleSort, SortIcon } = useTableSort(sites, 'dateDestroyed', 'desc');
  // Expanded modal table with all columns + CSV export
}
```

**Create:** `src/components/SitesTable/SitesTableMobile.tsx` (~150 lines)
```typescript
export function SitesTableMobile({
  sites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
}: SitesTableMobileProps) {
  const { sortedData, handleSort, SortIcon } = useTableSort(sites, 'dateDestroyed', 'desc');
  // Mobile accordion logic only
}
```

**Create:** `src/components/SitesTable/index.tsx` (~40 lines)
```typescript
export function SitesTable(props: SitesTableProps) {
  switch (props.variant) {
    case 'mobile':
      return <SitesTableMobile {...props} />;
    case 'expanded':
      return <SitesTableExpanded {...props} />;
    case 'compact':
    default:
      return <SitesTableCompact {...props} />;
  }
}
```

**Benefits:**
- Each variant is independently maintainable
- No conditional logic mixing variants
- Easier to add new variants
- Follows Open/Closed Principle

**Result:** SitesTable split into 4 files, each ~150 lines

---

### 1.3 StatsDashboard.tsx Refactoring (601 lines → ~150 lines)

**Current Issues:**
- Monolithic component with 10+ distinct sections
- Mixed statistics calculation and presentation logic
- Lots of hardcoded content
- Difficult to test individual sections

**Refactoring Plan:**

#### Step 1: Extract Statistics Calculation Hook
**Create:** `src/hooks/useHeritageStats.ts` (~100 lines)
```typescript
export function useHeritageStats(sites: GazaSite[]) {
  return useMemo(() => {
    // All calculation logic
    return {
      total,
      destroyed,
      damaged,
      heavilyDamaged,
      surviving,
      religiousSites,
      religiousDestroyed,
      religiousSurviving,
      oldestSiteAge,
      ancientSites,
      museums,
      museumsDestroyed,
      archaeological,
      archaeologicalSurviving,
    };
  }, [sites]);
}
```

**Benefits:**
- Pure calculation logic
- Easy to unit test
- Reusable in other dashboards or exports

#### Step 2: Extract Individual Stat Sections
**Create:** `src/components/Stats/HeroStatistic.tsx` (~40 lines)
```typescript
export function HeroStatistic({
  value,
  title,
  description
}: HeroStatisticProps) {
  // Reusable hero stat card
}
```

**Create:** `src/components/Stats/StatCard.tsx` (~40 lines)
```typescript
export function StatCard({
  value,
  title,
  description,
  variant,
}: StatCardProps) {
  // Reusable stat card with different color variants
}
```

**Create:** `src/components/Stats/SiteLossExample.tsx` (~60 lines)
```typescript
export function SiteLossExample({
  name,
  age,
  facts,
}: SiteLossExampleProps) {
  // Reusable site loss card
}
```

**Create:** `src/components/Stats/sections/YearsOfHistorySection.tsx` (~50 lines)
```typescript
export function YearsOfHistorySection({ stats }: { stats: HeritageStats }) {
  return <HeroStatistic ... />;
}
```

**Create:** `src/components/Stats/sections/KeyMetricsSection.tsx` (~70 lines)
```typescript
export function KeyMetricsSection({ stats }: { stats: HeritageStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard ... />
      <StatCard ... />
      <StatCard ... />
    </div>
  );
}
```

**Create:** Similar section components for:**
- `WhatWasLostSection.tsx` (~100 lines)
- `LootedArtifactsSection.tsx` (~80 lines)
- `LostKnowledgeSection.tsx` (~120 lines)
- `WhatRemainsSection.tsx` (~100 lines)
- `PerspectiveSection.tsx` (~70 lines)
- `LegalContextSection.tsx` (~50 lines)

#### Step 3: New StatsDashboard.tsx (~150 lines)
```typescript
export function StatsDashboard({ sites }: StatsDashboardProps) {
  const stats = useHeritageStats(sites);

  return (
    <div className="max-h-[80vh] overflow-y-auto bg-white">
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <StatsHeader />
        <YearsOfHistorySection stats={stats} />
        <KeyMetricsSection stats={stats} />
        <WhatWasLostSection />
        <LootedArtifactsSection />
        <LostKnowledgeSection />
        <WhatRemainsSection stats={stats} />
        <PerspectiveSection />
        <LegalContextSection />
        <StatsFooter />
      </div>
    </div>
  );
}
```

**Benefits:**
- Each section independently testable
- Easy to reorder or remove sections
- Sections can be reused in other contexts
- Clear component hierarchy

**Result:** StatsDashboard split into 12+ files, main file ~150 lines

---

## Priority 2: Important Refactorings (Medium Impact, High Value)

### 2.1 TimelineScrubber.tsx Refactoring (313 lines → ~180 lines)

**Current Issues:**
- D3 rendering logic mixed with React component logic
- Complex timeline calculations embedded
- State management and rendering intertwined

**Refactoring Plan:**

#### Step 1: Extract D3 Timeline Logic
**Create:** `src/utils/d3Timeline.ts` (~100 lines)
```typescript
export class D3TimelineRenderer {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private scale: d3.ScaleTime<number, number>;

  constructor(svgElement: SVGSVGElement, config: TimelineConfig) {
    // D3 setup
  }

  render(data: TimelineData, currentDate: Date) {
    // Pure D3 rendering logic
  }

  updateScale(width: number) {
    // Scale updates
  }

  cleanup() {
    // D3 cleanup
  }
}
```

**Benefits:**
- D3 logic separated from React
- Easier to test D3 operations
- Can be used in other timeline components

#### Step 2: Extract Timeline Calculations Hook
**Create:** `src/hooks/useTimelineData.ts` (~60 lines)
```typescript
export function useTimelineData(
  sites: GazaSite[],
  startDate: Date,
  endDate: Date
) {
  return useMemo(() => {
    // Process sites into timeline events
    // Calculate event positions
    // Group events by date
    return {
      events: [...],
      dateRange: [startDate, endDate],
      eventDensity: ...,
    };
  }, [sites, startDate, endDate]);
}
```

**Benefits:**
- Pure data transformation
- Memoized for performance
- Easy to test

#### Step 3: Refactored TimelineScrubber.tsx (~180 lines)
```typescript
export function TimelineScrubber({ sites }: TimelineScrubberProps) {
  const { currentDate, isPlaying, speed, ... } = useAnimation();
  const timelineData = useTimelineData(sites, startDate, endDate);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize D3 renderer
  const rendererRef = useRef<D3TimelineRenderer>();

  useEffect(() => {
    if (!svgRef.current) return;
    rendererRef.current = new D3TimelineRenderer(svgRef.current, config);
    return () => rendererRef.current?.cleanup();
  }, []);

  // Render on data/date changes
  useEffect(() => {
    rendererRef.current?.render(timelineData, currentDate);
  }, [timelineData, currentDate]);

  return (
    <div>
      {/* Timeline controls */}
      <svg ref={svgRef} />
      {/* Current date display */}
    </div>
  );
}
```

**Result:** TimelineScrubber 313 → ~180 lines + separate utilities

---

### 2.2 About.tsx Refactoring (291 lines → ~80 lines)

**Current Issues:**
- Long content component with mixed sections
- All content inline in JSX
- Hard to update individual sections

**Refactoring Plan:**

#### Step 1: Extract Content Sections
**Create:** `src/components/About/sections/ProjectOverviewSection.tsx` (~50 lines)
**Create:** `src/components/About/sections/DataSourcesSection.tsx` (~60 lines)
**Create:** `src/components/About/sections/MethodologySection.tsx` (~80 lines)
**Create:** `src/components/About/sections/LegalFrameworkSection.tsx` (~60 lines)
**Create:** `src/components/About/sections/AttributionSection.tsx` (~40 lines)

#### Step 2: New About.tsx (~80 lines)
```typescript
export function About() {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-white p-6">
      <AboutHeader />
      <ProjectOverviewSection />
      <DataSourcesSection />
      <MethodologySection />
      <LegalFrameworkSection />
      <AttributionSection />
      <AboutFooter />
    </div>
  );
}
```

**Benefits:**
- Easy to update individual sections
- Sections can be reused or reordered
- Better organization of content

**Result:** About split into 6 section files

---

### 2.3 FilterBar.tsx Refactoring (235 lines → ~120 lines)

**Current Issues:**
- Complex filter UI with embedded date picker logic
- BC/BCE year handling mixed with UI
- Multiple filter types in one component

**Refactoring Plan:**

#### Step 1: Extract Date Filter Components
**Create:** `src/components/FilterBar/DateRangeFilter.tsx` (~60 lines)
```typescript
export function DateRangeFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  label,
}: DateRangeFilterProps) {
  // Date range picker with validation
}
```

**Create:** `src/components/FilterBar/YearRangeFilter.tsx` (~80 lines)
```typescript
export function YearRangeFilter({
  startYear,
  endYear,
  onStartChange,
  onEndChange,
  supportBCE = true,
}: YearRangeFilterProps) {
  // Year range with BC/BCE dropdown
}
```

#### Step 2: Refactored FilterBar.tsx (~120 lines)
```typescript
export function FilterBar({
  selectedTypes,
  selectedStatuses,
  destructionDateStart,
  destructionDateEnd,
  creationYearStart,
  creationYearEnd,
  searchTerm,
  onTypeChange,
  onStatusChange,
  onDestructionDateStartChange,
  onDestructionDateEndChange,
  onCreationYearStartChange,
  onCreationYearEndChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div>
      <MultiSelectDropdown
        label="Type"
        options={SITE_TYPES}
        selected={selectedTypes}
        onChange={onTypeChange}
      />
      <MultiSelectDropdown
        label="Status"
        options={STATUS_OPTIONS}
        selected={selectedStatuses}
        onChange={onStatusChange}
      />
      <DateRangeFilter
        label="Destruction Date"
        startDate={destructionDateStart}
        endDate={destructionDateEnd}
        onStartChange={onDestructionDateStartChange}
        onEndChange={onDestructionDateEndChange}
      />
      <YearRangeFilter
        startYear={creationYearStart}
        endYear={creationYearEnd}
        onStartChange={onCreationYearStartChange}
        onEndChange={onCreationYearEndChange}
        supportBCE
      />
    </div>
  );
}
```

**Result:** FilterBar 235 → ~120 lines + reusable filter components

---

### 2.4 theme.ts Refactoring (227 lines → ~80 lines + utilities)

**Current Issues:**
- Theme configuration mixed with utility functions
- Color constants and components in same file
- `cn()` utility buried in theme file

**Refactoring Plan:**

#### Step 1: Extract Utility Functions
**Create:** `src/utils/classNames.ts` (~20 lines)
```typescript
/**
 * Conditionally join class names
 * Similar to clsx/classnames but lightweight
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

**Create:** `src/utils/colorHelpers.ts` (~40 lines)
```typescript
export function getStatusColor(status: GazaSite["status"]): string {
  // Tailwind class logic
}

export function getStatusHexColor(status: GazaSite["status"]): string {
  // Hex color logic
}
```

#### Step 2: Organize Theme File
**Create:** `src/styles/colors.ts` (~30 lines)
```typescript
/**
 * Palestinian Flag Theme Colors
 */
export const colors = {
  red: '#ed3039',
  green: '#009639',
  black: '#000000',
  white: '#fefefe',
  // ... other colors
} as const;
```

**Create:** `src/styles/components.ts` (~80 lines)
```typescript
/**
 * Component-level style configurations
 */
export const components = {
  header: { base: '...' },
  table: { base: '...', td: '...' },
  container: { base: '...' },
  // ... other components
} as const;
```

**Create:** `src/styles/theme.ts` (~30 lines)
```typescript
/**
 * Main theme export
 */
export { colors } from './colors';
export { components } from './components';
export { cn } from '../utils/classNames';
export { getStatusColor, getStatusHexColor } from '../utils/colorHelpers';
```

**Benefits:**
- Clear separation of concerns
- Utilities can be imported independently
- Theme configuration is cleaner

**Result:** theme.ts split into multiple focused files

---

## Priority 3: Nice-to-Have Refactorings (Lower Impact, Medium Value)

### 3.1 HeritageMap.tsx Refactoring (245 lines → ~150 lines)

**Refactoring Plan:**
- Extract marker creation logic to `src/components/Map/MapMarkers.tsx`
- Extract tile configuration to `src/components/Map/MapTiles.tsx`
- Use composition instead of one large component

### 3.2 heritageCalculations.ts Organization (219 lines → multiple files)

**Refactoring Plan:**
- Split into themed files:
  - `src/utils/calculations/glowContributions.ts`
  - `src/utils/calculations/heritageMetrics.ts`
  - `src/utils/calculations/significance.ts`

### 3.3 mockSites.ts (1,557 lines)

**Note:** This is a data file, not code. Consider:
- Moving to JSON: `src/data/sites.json`
- Or splitting by type: `mosques.ts`, `churches.ts`, etc.
- Or keeping as-is (acceptable for static data)

---

## Implementation Strategy

### Phase 1: Foundation (Week 1-2)
1. Extract common hooks (`useTableSort`, `useAppState`)
2. Extract utility functions (`csvExport`, `classNames`, `colorHelpers`)
3. Create reusable UI components (`StatCard`, `SiteLossExample`)

### Phase 2: Major Components (Week 3-4)
1. Refactor `App.tsx` → Layout components + hooks
2. Refactor `SitesTable.tsx` → Variant components
3. Refactor `StatsDashboard.tsx` → Section components

### Phase 3: Timeline & Specialized (Week 5)
1. Refactor `TimelineScrubber.tsx` → D3 utilities
2. Refactor `About.tsx` → Section components
3. Refactor `FilterBar.tsx` → Filter components

### Phase 4: Theme & Utilities (Week 6)
1. Reorganize `theme.ts` → Separate config files
2. Refactor `heritageCalculations.ts` → Themed files
3. Clean up any remaining large files

### Phase 5: Testing & Documentation (Week 7)
1. Add unit tests for extracted hooks
2. Add unit tests for utility functions
3. Update component tests
4. Update documentation (README, CLAUDE.md)

---

## Testing Strategy

### For Each Refactoring:

1. **Before:** Ensure all existing tests pass
2. **During:** Write tests for new utilities/hooks
3. **After:** Verify all tests still pass
4. **Coverage:** Aim for 80%+ coverage on new utilities

### Priority Test Coverage:

- **High Priority:** Hooks, utilities, calculations
- **Medium Priority:** Layout components, section components
- **Lower Priority:** Presentational components

---

## Migration Checklist Template

For each file refactoring:

- [ ] Create new file structure
- [ ] Extract logic into new files
- [ ] Update imports in dependent files
- [ ] Add JSDoc comments
- [ ] Write unit tests
- [ ] Run full test suite
- [ ] Run linter
- [ ] Build production bundle
- [ ] Verify no increase in bundle size
- [ ] Update CLAUDE.md if needed
- [ ] Commit with conventional message

---

## Expected Benefits

### Code Quality
- **Before:** 10 files >200 lines
- **After:** ~40 focused files <200 lines each
- **Average file size:** Reduced from ~250 lines to ~100 lines

### Maintainability
- Easier to locate specific functionality
- Clearer component responsibilities
- Better code organization

### Testability
- More granular unit tests
- Easier to mock dependencies
- Better test coverage

### Performance
- No performance degradation expected
- Potential improvements from better memoization
- Tree-shaking benefits from modular structure

### Developer Experience
- Faster to understand codebase
- Easier to onboard new developers
- Better IDE performance (smaller files)

---

## Risks & Mitigations

### Risk 1: Breaking Changes
**Mitigation:** Comprehensive test suite, careful refactoring, incremental approach

### Risk 2: Import Complexity
**Mitigation:** Barrel exports (index.ts files), clear folder structure

### Risk 3: Over-Engineering
**Mitigation:** Follow "Rule of Three" - extract only when pattern repeats 3+ times

### Risk 4: Time Investment
**Mitigation:** Prioritize high-impact refactorings first, spread over multiple weeks

---

## Success Criteria

1. **All tests passing:** 184/184 tests green
2. **No linter errors:** Clean eslint run
3. **Bundle size:** No increase (or reduction)
4. **No functionality breaks:** All features work as before
5. **Documentation updated:** CLAUDE.md reflects new structure
6. **File count:** ~40-50 focused files instead of 10 large files
7. **Average file size:** <200 lines per file (excluding data)

---

## Notes for Implementation

1. **Start Small:** Begin with utilities and hooks (low risk)
2. **One Component at a Time:** Don't refactor multiple components simultaneously
3. **Keep Main Branch Stable:** Use feature branches for each refactoring
4. **Document as You Go:** Update CLAUDE.md with new structure
5. **Leverage Existing Tests:** Use test suite to catch regressions
6. **Ask for Review:** Have another developer review larger refactorings

---

**Last Updated:** October 16, 2025
**Status:** Ready for Implementation
**Estimated Effort:** 6-7 weeks (part-time) or 3-4 weeks (full-time)
