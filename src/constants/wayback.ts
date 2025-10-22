/**
 * Wayback Timeline Constants
 * Configuration values for the Advanced Animation timeline feature
 */

export const WAYBACK_TIMELINE = {
  // Marker configuration
  MAJOR_MARKER_INTERVAL: 10, // Every 10th release gets a taller, more visible marker
  EVENT_MARKER_STACK_SPACING: 6, // Pixels between vertically stacked destruction event dots

  // Playback configuration
  YEAR_ADVANCE_INTERVAL_MS: 2000, // Pause duration at each year marker during playback
  INITIAL_PAUSE_MS: 1000, // Pause at start before beginning playback

  // Visual configuration - Marker dimensions
  MINOR_MARKER_HEIGHT: 4, // Height in pixels for minor Wayback release markers (h-4)
  MAJOR_MARKER_HEIGHT: 8, // Height in pixels for major Wayback release markers (h-8)
  YEAR_MARKER_HEIGHT: 2, // Height in pixels for year scale markers (h-2)
  MINOR_MARKER_WIDTH: 0.5, // Width in rem for minor markers (w-0.5)
  MAJOR_MARKER_WIDTH: 0.5, // Width in rem for major markers (w-0.5)
  YEAR_MARKER_WIDTH: 0.5, // Width in rem for year markers (w-0.5)

  // Visual configuration - Layout positioning (Tailwind class values)
  YEAR_LABEL_CONTAINER_TOP: 3, // Tailwind: top-3 (12px)
  YEAR_LABEL_CONTAINER_HEIGHT: 6, // Tailwind: h-6 (24px)
  YEAR_LABEL_TOP_OFFSET: -6, // Tailwind: -top-6 (-24px)

  MARKER_CONTAINER_TOP: -6, // Tailwind: -top-6 (-24px)
  MARKER_CONTAINER_HEIGHT: 8, // Tailwind: h-8 (32px)

  TOOLTIP_BOTTOM_OFFSET: 6, // Tailwind: bottom-6 (24px)
  SCRUBBER_TOOLTIP_TOP: 8, // Tailwind: top-8 (32px)
  SCRUBBER_TOOLTIP_HEIGHT: 6, // Tailwind: h-6 (24px)
} as const;
