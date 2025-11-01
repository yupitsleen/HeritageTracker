/**
 * Wayback Timeline Type Definitions
 *
 * Defines extensible wayback timeline configuration for Advanced Animation page.
 */

/**
 * Wayback imagery configuration for comparison views
 * Groups tile URL, max zoom, and optional date label together
 */
export interface WaybackImagery {
  /** Tile URL for the satellite imagery (e.g., ESRI Wayback URL) */
  tileUrl: string;
  /** Maximum zoom level supported by this imagery */
  maxZoom: number;
  /** Optional date label to display (e.g., "2023-08-15") */
  dateLabel?: string;
}

/**
 * Marker configuration
 */
export interface WaybackMarkerConfig {
  /** Every Nth release gets a major marker (taller, more visible) */
  majorMarkerInterval: number;

  /** Pixels between vertically stacked destruction event dots */
  eventMarkerStackSpacing: number;

  /** Minor marker dimensions */
  minorMarker: {
    /** Height in pixels */
    height: number;
    /** Width in rem */
    width: number;
  };

  /** Major marker dimensions */
  majorMarker: {
    /** Height in pixels */
    height: number;
    /** Width in rem */
    width: number;
  };

  /** Year scale marker dimensions */
  yearMarker: {
    /** Height in pixels */
    height: number;
    /** Width in rem */
    width: number;
  };
}

/**
 * Playback configuration
 */
export interface WaybackPlaybackConfig {
  /** Pause duration at each year marker during playback (milliseconds) */
  yearAdvanceIntervalMs: number;

  /** Pause at start before beginning playback (milliseconds) */
  initialPauseMs: number;

  /** Whether to loop playback automatically */
  loopPlayback?: boolean;

  /** Whether to show year markers */
  showYearMarkers?: boolean;
}

/**
 * Layout positioning configuration
 */
export interface WaybackLayoutConfig {
  /** Year label container positioning */
  yearLabel: {
    /** Top position (Tailwind units) */
    top: number;
    /** Height (Tailwind units) */
    height: number;
    /** Top offset (Tailwind units, negative) */
    topOffset: number;
  };

  /** Marker container positioning */
  markerContainer: {
    /** Top position (Tailwind units, negative) */
    top: number;
    /** Height (Tailwind units) */
    height: number;
  };

  /** Tooltip positioning */
  tooltip: {
    /** Bottom offset (Tailwind units) */
    bottom: number;
  };

  /** Scrubber tooltip positioning */
  scrubberTooltip: {
    /** Top position (Tailwind units) */
    top: number;
    /** Height (Tailwind units) */
    height: number;
  };
}

/**
 * Complete wayback timeline configuration
 */
export interface WaybackTimelineConfig {
  /** Unique configuration identifier */
  id: string;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Whether this is the default configuration */
  isDefault?: boolean;

  /** Marker configuration */
  markerConfig: WaybackMarkerConfig;

  /** Playback configuration */
  playbackConfig: WaybackPlaybackConfig;

  /** Layout configuration */
  layoutConfig: WaybackLayoutConfig;

  /** Description for documentation */
  description?: string;

  /** Configuration metadata */
  metadata?: {
    author?: string;
    version?: string;
    notes?: string;
  };
}
