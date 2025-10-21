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

  // Visual configuration
  MINOR_MARKER_HEIGHT: 4, // Height in pixels for minor Wayback release markers
  MAJOR_MARKER_HEIGHT: 8, // Height in pixels for major Wayback release markers
  YEAR_MARKER_HEIGHT: 2, // Height in pixels for year scale markers
} as const;
