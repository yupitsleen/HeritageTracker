# Advanced Animation Page - Full Design Specification

**Status:** Planning Phase
**Goal:** Create a dedicated full-screen page showcasing all 150+ ESRI Wayback satellite imagery versions
**Current:** Main dashboard uses 3 curated versions (2014, Aug 2023, Current)
**Proposed:** Separate advanced page with timeline slider for all historical imagery

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technical Implementation](#technical-implementation)
5. [Performance Optimizations](#performance-optimizations)
6. [Implementation Phases](#implementation-phases)
7. [Benefits](#benefits)

---

## Overview

### The Problem
ESRI Wayback has **150+ versions** of World Imagery dating back to February 2014. Currently, we only use 3 curated versions in the main dashboard to avoid UI clutter.

### The Solution
Create a dedicated **Advanced Animation Page** that:
- Provides access to ALL 150+ Wayback imagery versions
- Offers a timeline slider for smooth scrubbing through history
- Enables advanced features (split-screen comparison, export, playback modes)
- Keeps the main dashboard clean and simple

---

## Architecture

### Current App Structure
```
Heritage Tracker App
├── Main Dashboard (current view)
│   ├── Table + Map + Timeline
│   ├── 3 curated imagery versions (2014, Aug 2023, Current)
│   └── Simple Sync Map toggle
```

### Proposed App Structure
```
Heritage Tracker App
├── Main Dashboard (current view)
│   ├── Table + Map + Timeline
│   ├── 3 curated imagery versions (2014, Aug 2023, Current)
│   ├── Simple Sync Map toggle
│   └── Link to "Advanced Animation" page
│
└── NEW: Advanced Animation Page (/animation route)
    ├── Full-screen map view
    ├── Timeline scrubber with ALL 150+ versions
    ├── Advanced playback controls (speed, modes)
    ├── Comparison tools (split-screen before/after)
    └── Export features (GIF, MP4, screenshots)
```

---

## Features

### 1. Full Wayback Archive Integration

**Data Source:**
- ESRI Wayback Configuration API: `https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/wayback-imagery-global.json`
- Contains all 150+ versions with release numbers, dates, and tile URLs

**Version Structure:**
```json
{
  "itemID": "f5f90c7419f24ceda396088f4e39ae83",
  "itemTitle": "World Imagery (Wayback 2023-12-07)",
  "itemURL": "https://wayback.maptiles.arcgis.com/.../tile/{releaseNum}/{z}/{y}/{x}",
  "releaseNum": 56102,
  "releaseDateLabel": "2023-12-07",
  "releaseDatetime": 1701936000000,
  "maxZoom": 18
}
```

**Filtering:**
- Filter to versions between 2014-02-01 and current date
- Sort chronologically by `releaseDatetime`

### 2. Timeline Slider UI

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│                        HERITAGE TRACKER                         │
│                   Advanced Timeline Animation                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                     [FULL SCREEN MAP VIEW]                      │
│                                                                 │
│               Shows satellite imagery for selected date         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ ⏮ ⏪ ⏯️ ⏩ ⏭                                   Speed: [2x ▼]    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │●─────────────────────────────────────────────────────────○│ │ (Slider: 150+ positions)
│ └─────────────────────────────────────────────────────────────┘ │
│ 2014-02-20            Selected: 2023-10-15            2025-10-20│
│                                                                 │
│ [Show Destruction Events] [Split View] [Export Animation]      │
└─────────────────────────────────────────────────────────────────┘
```

**Timeline Features:**
- **Slider**: 150+ discrete positions (one per Wayback version)
- **Event Markers**: Visual indicators for destruction dates overlaid on timeline
- **Date Labels**: Start date, current selection, end date
- **Keyboard Navigation**: Arrow keys to step through versions

### 3. Playback Controls

**Playback Modes:**
- **Chronological**: Play through all 150+ versions in order
- **Key Events Only**: Jump between destruction dates
- **Year-by-year**: Show one representative version per year
- **Custom Range**: Play between two selected dates

**Speed Controls:**
- 0.25x (slow motion)
- 0.5x (half speed)
- 1x (normal)
- 2x (double speed)
- 4x (fast)
- 8x (very fast)

**Transport Controls:**
- ⏮️ First version (2014-02-20)
- ⏪ Previous version
- ⏯️ Play/Pause
- ⏩ Next version
- ⏭️ Last version (Current)

### 4. Split-Screen Comparison

**Before/After View:**
```
┌───────────────────────┬───────────────────────┐
│   Before: 2023-08-31  │   After: 2023-12-07   │
│                       │                       │
│   [Satellite View 1]  │   [Satellite View 2]  │
│                       │                       │
│   Select Date ▼       │   Select Date ▼       │
└───────────────────────┴───────────────────────┘
```

**Features:**
- Side-by-side comparison of any two versions
- Synchronized pan/zoom
- Draggable divider for different split ratios
- Export comparison as screenshot

### 5. Export Features

**Animation Export:**
- Generate GIF animation (1-10 second loops)
- Generate MP4 video (configurable frame rate)
- Select date range for export
- Watermark with "Heritage Tracker" branding

**Screenshot Export:**
- High-resolution PNG export
- Include date overlay
- Export current view or split-screen comparison

### 6. Destruction Event Overlay

**Event Markers on Timeline:**
- Red vertical lines at destruction dates
- Tooltip on hover showing site name and date
- Click to jump to that version
- Toggle visibility on/off

**Site Markers on Map:**
- Show/hide destroyed sites
- Color-coded by status (destroyed, heavily-damaged, damaged)
- Popup with site details

---

## Technical Implementation

### Phase 1: Data Layer

#### 1.1 Wayback Service
**File:** `src/services/waybackService.ts`

```typescript
export interface WaybackVersion {
  itemID: string;
  itemTitle: string;
  releaseNum: number;
  releaseDateLabel: string;
  releaseDatetime: number;
  itemURL: string;
  maxZoom: number;
}

/**
 * Fetch all Wayback imagery versions from ESRI API
 * Filters to versions from 2014-02-01 onwards
 * Sorts chronologically by release date
 */
export async function fetchAllWaybackVersions(): Promise<WaybackVersion[]> {
  const response = await fetch(
    'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/wayback-imagery-global.json'
  );
  const data = await response.json();

  // Filter and sort by date
  return data
    .filter((v: any) => new Date(v.releaseDatetime) >= new Date('2014-02-01'))
    .sort((a: any, b: any) => a.releaseDatetime - b.releaseDatetime)
    .map((v: any) => ({
      itemID: v.itemID,
      itemTitle: v.itemTitle,
      releaseNum: v.releaseNum,
      releaseDateLabel: v.releaseDateLabel,
      releaseDatetime: v.releaseDatetime,
      itemURL: v.itemURL,
      maxZoom: v.maxZoom || 18,
    }));
}

/**
 * Find the closest Wayback version to a given date
 */
export function findClosestVersion(
  versions: WaybackVersion[],
  targetDate: Date
): number {
  const targetTime = targetDate.getTime();
  let closestIndex = 0;
  let minDiff = Math.abs(versions[0].releaseDatetime - targetTime);

  for (let i = 1; i < versions.length; i++) {
    const diff = Math.abs(versions[i].releaseDatetime - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  return closestIndex;
}

/**
 * Get destruction events formatted for timeline markers
 */
export function getDestructionEvents(sites: GazaSite[]): Array<{
  date: Date;
  siteName: string;
  siteId: string;
}> {
  return sites
    .filter(site => site.dateDestroyed)
    .map(site => ({
      date: new Date(site.dateDestroyed!),
      siteName: site.name,
      siteId: site.id,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
```

#### 1.2 Wayback Context
**File:** `src/contexts/WaybackContext.tsx`

```typescript
interface WaybackContextValue {
  versions: WaybackVersion[];
  currentIndex: number;
  isPlaying: boolean;
  speed: number;
  loading: boolean;
  error: Error | null;

  // Actions
  setCurrentIndex: (index: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  nextVersion: () => void;
  previousVersion: () => void;
  jumpToDate: (date: Date) => void;
}

export function WaybackProvider({ children }: { children: ReactNode }) {
  const [versions, setVersions] = useState<WaybackVersion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load all versions on mount
  useEffect(() => {
    fetchAllWaybackVersions()
      .then(data => {
        setVersions(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Auto-advance during playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= versions.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, versions.length]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  const nextVersion = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, versions.length - 1));
  }, [versions.length]);

  const previousVersion = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const jumpToDate = useCallback((date: Date) => {
    const index = findClosestVersion(versions, date);
    setCurrentIndex(index);
  }, [versions]);

  return (
    <WaybackContext.Provider value={{
      versions,
      currentIndex,
      isPlaying,
      speed,
      loading,
      error,
      setCurrentIndex,
      play,
      pause,
      reset,
      setSpeed,
      nextVersion,
      previousVersion,
      jumpToDate,
    }}>
      {children}
    </WaybackContext.Provider>
  );
}
```

### Phase 2: UI Components

#### 2.1 Advanced Timeline Slider
**File:** `src/components/Timeline/AdvancedTimelineSlider.tsx`

```typescript
interface AdvancedTimelineSliderProps {
  versions: WaybackVersion[];
  currentIndex: number;
  onVersionChange: (index: number) => void;
  destructionEvents: Array<{ date: Date; siteName: string; siteId: string }>;
  showEventMarkers?: boolean;
}

export function AdvancedTimelineSlider({
  versions,
  currentIndex,
  onVersionChange,
  destructionEvents,
  showEventMarkers = true,
}: AdvancedTimelineSliderProps) {
  const sliderRef = useRef<HTMLInputElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onVersionChange(Math.max(0, currentIndex - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          onVersionChange(Math.min(versions.length - 1, currentIndex + 1));
          break;
        case 'Home':
          e.preventDefault();
          onVersionChange(0);
          break;
        case 'End':
          e.preventDefault();
          onVersionChange(versions.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, versions.length, onVersionChange]);

  // Calculate positions for destruction event markers
  const eventMarkers = useMemo(() => {
    if (!showEventMarkers) return [];

    return destructionEvents.map(event => {
      const eventIndex = findClosestVersion(versions, event.date);
      const position = (eventIndex / (versions.length - 1)) * 100;
      return { ...event, position, index: eventIndex };
    });
  }, [destructionEvents, versions, showEventMarkers]);

  const currentVersion = versions[currentIndex];
  const startVersion = versions[0];
  const endVersion = versions[versions.length - 1];

  return (
    <div className="relative px-4 py-6">
      {/* Destruction event markers */}
      {showEventMarkers && (
        <div className="absolute top-0 left-4 right-4 h-8 pointer-events-none">
          {eventMarkers.map((marker, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-full bg-red-600"
              style={{ left: `${marker.position}%` }}
              title={`${marker.siteName} - ${marker.date.toLocaleDateString()}`}
            />
          ))}
        </div>
      )}

      {/* Slider */}
      <input
        ref={sliderRef}
        type="range"
        min={0}
        max={versions.length - 1}
        value={currentIndex}
        onChange={(e) => onVersionChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:bg-[#009639]
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:cursor-pointer"
        aria-label="Wayback imagery version slider"
      />

      {/* Date labels */}
      <div className="flex justify-between items-center text-xs mt-2">
        <span className="text-gray-500">{startVersion?.releaseDateLabel}</span>
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {currentVersion?.releaseDateLabel}
          </div>
          <div className="text-gray-400">
            Version {currentIndex + 1} of {versions.length}
          </div>
        </div>
        <span className="text-gray-500">{endVersion?.releaseDateLabel}</span>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-gray-400 text-center mt-2">
        <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">←/→</kbd> Navigate
        {' • '}
        <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">Home/End</kbd> Jump
      </div>
    </div>
  );
}
```

#### 2.2 Playback Controls
**File:** `src/components/Timeline/PlaybackControls.tsx`

```typescript
interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function PlaybackControls({
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onPrevious,
  onNext,
}: PlaybackControlsProps) {
  const speeds = [0.25, 0.5, 1, 2, 4, 8];

  return (
    <div className="flex items-center gap-4">
      {/* Transport controls */}
      <div className="flex gap-2">
        <Button
          onClick={onReset}
          variant="secondary"
          size="sm"
          icon={<ArrowPathIcon className="w-4 h-4" />}
          aria-label="Reset to first version"
          title="Reset to beginning"
        />

        <Button
          onClick={onPrevious}
          variant="secondary"
          size="sm"
          aria-label="Previous version"
        >
          ⏪
        </Button>

        {isPlaying ? (
          <Button
            onClick={onPause}
            variant="danger"
            size="sm"
            icon={<PauseIcon className="w-4 h-4" />}
            aria-label="Pause playback"
          >
            Pause
          </Button>
        ) : (
          <Button
            onClick={onPlay}
            variant="primary"
            size="sm"
            icon={<PlayIcon className="w-4 h-4" />}
            aria-label="Play animation"
          >
            Play
          </Button>
        )}

        <Button
          onClick={onNext}
          variant="secondary"
          size="sm"
          aria-label="Next version"
        >
          ⏩
        </Button>
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-2">
        <label htmlFor="speed-control" className="text-sm font-medium text-white">
          Speed:
        </label>
        <select
          id="speed-control"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
          aria-label="Playback speed"
        >
          {speeds.map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
```

### Phase 3: Main Page Component

#### 3.1 Advanced Animation Page
**File:** `src/pages/AdvancedAnimationPage.tsx`

```typescript
export function AdvancedAnimationPage() {
  const {
    versions,
    currentIndex,
    isPlaying,
    speed,
    loading,
    error,
    setCurrentIndex,
    play,
    pause,
    reset,
    setSpeed,
    nextVersion,
    previousVersion,
  } = useWayback();

  const { sites } = useSites(); // Get site data from context
  const destructionEvents = useMemo(() => getDestructionEvents(sites), [sites]);

  const [showEventMarkers, setShowEventMarkers] = useState(true);
  const [splitView, setSplitView] = useState(false);
  const [compareIndex, setCompareIndex] = useState(0);

  const currentVersion = versions[currentIndex];
  const compareVersion = versions[compareIndex];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading Wayback imagery archive...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-red-500 text-xl">Error loading imagery: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <header className="bg-black/90 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Heritage Tracker</h1>
            <p className="text-sm text-gray-400">Advanced Timeline Animation</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="text-white hover:text-gray-300">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Map View */}
      <div className="flex-1 relative">
        {splitView ? (
          <div className="flex h-full">
            {/* Before */}
            <div className="flex-1 relative border-r-2 border-white">
              <div className="absolute top-2 left-2 z-[1000] bg-black/80 text-white px-3 py-1 rounded">
                Before: {versions[compareIndex]?.releaseDateLabel}
              </div>
              <MapContainer
                center={GAZA_CENTER}
                zoom={DEFAULT_ZOOM}
                className="h-full w-full"
              >
                <TileLayer
                  key={`compare-${compareVersion.releaseNum}`}
                  url={compareVersion.itemURL}
                  maxZoom={compareVersion.maxZoom}
                />
                {/* Site markers */}
                {sites.map(site => (
                  <Marker key={site.id} position={site.coordinates} />
                ))}
              </MapContainer>
            </div>

            {/* After */}
            <div className="flex-1 relative">
              <div className="absolute top-2 left-2 z-[1000] bg-black/80 text-white px-3 py-1 rounded">
                After: {currentVersion?.releaseDateLabel}
              </div>
              <MapContainer
                center={GAZA_CENTER}
                zoom={DEFAULT_ZOOM}
                className="h-full w-full"
              >
                <TileLayer
                  key={currentVersion.releaseNum}
                  url={currentVersion.itemURL}
                  maxZoom={currentVersion.maxZoom}
                />
                {/* Site markers */}
                {sites.map(site => (
                  <Marker key={site.id} position={site.coordinates} />
                ))}
              </MapContainer>
            </div>
          </div>
        ) : (
          <MapContainer
            center={GAZA_CENTER}
            zoom={DEFAULT_ZOOM}
            className="h-full w-full"
          >
            <TileLayer
              key={currentVersion.releaseNum}
              url={currentVersion.itemURL}
              maxZoom={currentVersion.maxZoom}
            />
            {/* Site markers */}
            {sites.map(site => (
              <Marker key={site.id} position={site.coordinates} />
            ))}
          </MapContainer>
        )}
      </div>

      {/* Timeline Controls */}
      <div className="bg-black/90 border-t border-gray-800 p-4">
        {/* Playback Controls */}
        <div className="mb-4">
          <PlaybackControls
            isPlaying={isPlaying}
            speed={speed}
            onPlay={play}
            onPause={pause}
            onReset={reset}
            onSpeedChange={setSpeed}
            onPrevious={previousVersion}
            onNext={nextVersion}
          />
        </div>

        {/* Timeline Slider */}
        <AdvancedTimelineSlider
          versions={versions}
          currentIndex={currentIndex}
          onVersionChange={setCurrentIndex}
          destructionEvents={destructionEvents}
          showEventMarkers={showEventMarkers}
        />

        {/* Additional Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-white text-sm">
              <input
                type="checkbox"
                checked={showEventMarkers}
                onChange={(e) => setShowEventMarkers(e.target.checked)}
              />
              Show Destruction Events
            </label>

            <Button
              onClick={() => setSplitView(!splitView)}
              variant={splitView ? "primary" : "secondary"}
              size="sm"
            >
              {splitView ? "✓" : ""} Split View
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              📸 Screenshot
            </Button>
            <Button variant="secondary" size="sm">
              🎬 Export Animation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Phase 4: Routing Integration

#### 4.1 Update App Router
**File:** `src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdvancedAnimationPage } from './pages/AdvancedAnimationPage';
import { WaybackProvider } from './contexts/WaybackContext';

function App() {
  return (
    <BrowserRouter basename="/HeritageTracker">
      <ThemeProvider>
        <AnimationProvider>
          <WaybackProvider>
            <Routes>
              <Route path="/" element={<MainDashboard />} />
              <Route path="/animation" element={<AdvancedAnimationPage />} />
            </Routes>
          </WaybackProvider>
        </AnimationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
```

#### 4.2 Add Navigation Link
**File:** `src/components/Header.tsx`

```typescript
export function Header() {
  return (
    <header className="...">
      <nav className="flex gap-4">
        <Link to="/" className="...">
          Dashboard
        </Link>
        <Link
          to="/animation"
          className="flex items-center gap-2 bg-[#009639] text-white px-4 py-2 rounded"
        >
          🎬 Advanced Animation
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">150+ versions</span>
        </Link>
      </nav>
    </header>
  );
}
```

---

## Performance Optimizations

### 1. Tile Prefetching

**Strategy:** Prefetch adjacent versions for smooth transitions

```typescript
const [prefetchedVersions, setPrefetchedVersions] = useState<Set<number>>(new Set());

useEffect(() => {
  // Prefetch current + adjacent versions
  const toPreload = [currentIndex - 1, currentIndex, currentIndex + 1]
    .filter(i => i >= 0 && i < versions.length);

  toPreload.forEach(index => {
    if (!prefetchedVersions.has(index)) {
      // Create hidden <link rel="prefetch"> elements
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = versions[index].itemURL.replace('{z}/{y}/{x}', '10/0/0'); // Sample tile
      document.head.appendChild(link);

      setPrefetchedVersions(prev => new Set(prev).add(index));
    }
  });
}, [currentIndex, versions, prefetchedVersions]);
```

**Impact:**
- Reduces tile load time for adjacent versions
- Smoother playback experience
- Minimal memory overhead (only 3 versions cached at a time)

### 2. Debounced Slider Updates

**Strategy:** Limit update frequency during rapid slider movement

```typescript
const debouncedVersionChange = useMemo(
  () => debounce((index: number) => {
    setCurrentIndex(index);
  }, 16), // ~60fps
  []
);

// In slider onChange handler:
onChange={(e) => debouncedVersionChange(Number(e.target.value))}
```

**Impact:**
- Prevents excessive re-renders during scrubbing
- Maintains 60fps performance
- Reduces tile layer churn

### 3. Virtual Scrolling for Timeline Thumbnails

**Strategy:** Only render visible timeline thumbnails (future feature)

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={100}
  itemCount={versions.length}
  itemSize={80}
  layout="horizontal"
>
  {({ index, style }) => (
    <div style={style}>
      <ThumbnailPreview version={versions[index]} />
    </div>
  )}
</FixedSizeList>
```

**Impact:**
- Render only ~10 thumbnails instead of 150+
- Reduces DOM nodes by 93%
- Fast scrolling through timeline

### 4. Lazy TileLayer Mounting

**Strategy:** Only mount TileLayer when visible

```typescript
const [isTileLayerVisible, setIsTileLayerVisible] = useState(true);

// Temporarily hide during rapid playback
useEffect(() => {
  if (isPlaying && speed > 2) {
    setIsTileLayerVisible(false);
    const timeout = setTimeout(() => setIsTileLayerVisible(true), 100);
    return () => clearTimeout(timeout);
  }
}, [currentIndex, isPlaying, speed]);

return (
  <MapContainer>
    {isTileLayerVisible && (
      <TileLayer key={currentVersion.releaseNum} url={currentVersion.itemURL} />
    )}
  </MapContainer>
);
```

**Impact:**
- Reduces tile requests during high-speed playback
- Prevents browser from queuing 150+ tile requests
- Smoother animation at 4x-8x speeds

### 5. Memoized Event Markers

**Strategy:** Pre-compute marker positions

```typescript
const eventMarkers = useMemo(() => {
  return destructionEvents.map(event => {
    const eventIndex = findClosestVersion(versions, event.date);
    const position = (eventIndex / (versions.length - 1)) * 100;
    return { ...event, position, index: eventIndex };
  });
}, [destructionEvents, versions]);
```

**Impact:**
- Compute once, render many times
- No recalculation on slider movement
- O(1) rendering instead of O(n) per frame

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal:** Set up routing and data layer

- [ ] Install `react-router-dom` dependency
- [ ] Create `waybackService.ts` with API integration
- [ ] Create `WaybackContext.tsx` for state management
- [ ] Add route for `/animation` page
- [ ] Create basic `AdvancedAnimationPage.tsx` skeleton
- [ ] Add navigation link in header
- [ ] Test: Fetch all Wayback versions successfully

**Deliverable:** Can navigate to `/animation` and see list of versions

### Phase 2: Core UI (Week 2)
**Goal:** Build timeline slider and playback controls

- [ ] Create `AdvancedTimelineSlider.tsx` component
- [ ] Create `PlaybackControls.tsx` component
- [ ] Implement slider with keyboard navigation
- [ ] Implement play/pause/reset functionality
- [ ] Add speed controls (0.25x - 8x)
- [ ] Test: Can scrub through all 150+ versions smoothly

**Deliverable:** Functional timeline slider with playback controls

### Phase 3: Map Integration (Week 3)
**Goal:** Connect timeline to map imagery

- [ ] Add full-screen map to animation page
- [ ] Connect slider to TileLayer updates
- [ ] Add destruction event markers to timeline
- [ ] Add site markers to map
- [ ] Implement tile prefetching optimization
- [ ] Test: Smooth imagery transitions during playback

**Deliverable:** Timeline controls satellite imagery on map

### Phase 4: Advanced Features (Week 4)
**Goal:** Add split view and export features

- [ ] Implement split-screen comparison mode
- [ ] Add screenshot export functionality
- [ ] Add GIF/MP4 export (optional - use external library)
- [ ] Add event marker toggle
- [ ] Polish UI/UX (animations, transitions)
- [ ] Test: Split view works, exports functional

**Deliverable:** Fully featured advanced animation page

### Phase 5: Polish & Testing (Week 5)
**Goal:** Optimize and test thoroughly

- [ ] Add loading states and error handling
- [ ] Implement all performance optimizations
- [ ] Add accessibility features (ARIA labels, keyboard nav)
- [ ] Write tests for new components
- [ ] Update documentation (CLAUDE.md)
- [ ] Test on mobile (may need simplified view)
- [ ] Performance audit (Lighthouse)

**Deliverable:** Production-ready feature

---

## Benefits

### For Users
✅ **Full Historical Access** - Explore all 150+ imagery versions, not just 3
✅ **Better Storytelling** - Create compelling timelapses showing destruction over time
✅ **Comparison Tools** - Split-screen before/after views for impact analysis
✅ **Export Capabilities** - Share animations and screenshots for documentation
✅ **Educational Value** - Visualize the progression of destruction clearly

### For Developers
✅ **Separation of Concerns** - Main dashboard stays clean and simple
✅ **Performance Isolation** - Heavy lifting happens on dedicated page
✅ **Extensibility** - Easy to add more features (filters, annotations, etc.)
✅ **Reusable Components** - Timeline slider can be used elsewhere
✅ **Future-Proof** - Architecture supports adding more imagery sources

### For the Project
✅ **Unique Feature** - No other heritage tracking tool has this level of temporal analysis
✅ **Media Appeal** - Compelling animations for journalism and documentation
✅ **Academic Value** - Researchers can analyze temporal patterns
✅ **SEO/Sharing** - Dedicated URL (`/animation`) for social media sharing
✅ **Scalability** - Already optimized for 150+ versions, can handle 300+ in future

---

## Technical Considerations

### Dependencies to Add
```json
{
  "react-router-dom": "^6.20.0",
  "debounce": "^2.0.0"
}
```

### Browser Compatibility
- **Modern browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Mobile**: May need simplified UI (fewer controls, no split view)
- **Prefetching**: May not work in all browsers, graceful degradation needed

### API Rate Limiting
- ESRI Wayback tile API has rate limits
- Consider caching tile requests
- Add retry logic with exponential backoff
- Monitor API usage in production

### Data Loading
- **Initial load**: ~50KB JSON (all version metadata)
- **Per version**: Variable (depends on zoom level and viewport)
- **Prefetching**: ~3x tile requests during playback
- **Recommendation**: Add loading states, show progress bar

---

## Future Enhancements

### Short Term (3-6 months)
- Add more playback modes (year-by-year, key events only)
- Implement thumbnail timeline preview
- Add download options for data (JSON, CSV)
- Support custom date range selection

### Medium Term (6-12 months)
- Add annotation tools (draw on map, add notes)
- Implement change detection (highlight areas with differences)
- Add multi-site comparison (overlay multiple sites)
- Support video timeline (YouTube integration?)

### Long Term (12+ months)
- Machine learning for automatic change detection
- 3D terrain view with temporal data
- Integration with other satellite providers (Sentinel, Landsat)
- Collaborative features (shared annotations, comments)

---

## Success Metrics

### Performance
- [ ] 60fps playback at 1x-2x speed
- [ ] <500ms version switch time
- [ ] <2s initial page load
- [ ] <100ms slider response time

### User Experience
- [ ] Intuitive controls (no tutorial needed)
- [ ] Smooth animations and transitions
- [ ] Clear visual feedback during playback
- [ ] Accessible to keyboard-only users

### Technical
- [ ] All 150+ versions load successfully
- [ ] No memory leaks during extended use
- [ ] Graceful error handling
- [ ] Works on desktop and tablet (mobile optional)

---

## Questions to Resolve

1. **Should we support mobile?** Timeline slider may be difficult on small screens
2. **Export format priorities?** GIF, MP4, or just screenshots?
3. **Thumbnail timeline?** Do we want small preview images in the timeline?
4. **Annotation tools?** Allow users to draw/mark changes on the map?
5. **Public sharing?** Generate shareable links for specific animations?

---

## Next Steps

**Immediate Actions:**
1. Review this specification with stakeholders
2. Decide on Phase 1 start date
3. Set up development branch (`feat/advancedAnimation`)
4. Install dependencies (`react-router-dom`)
5. Create initial file structure

**Before Starting:**
- [ ] Approve this specification
- [ ] Confirm API access to ESRI Wayback
- [ ] Decide on mobile support scope
- [ ] Set timeline for Phase 1 completion

---

**Document Version:** 1.0
**Last Updated:** October 20, 2025
**Status:** Planning - Awaiting Approval
**Estimated Effort:** 5 weeks (1 week per phase)
**Priority:** Medium (nice-to-have feature, not blocking main functionality)
