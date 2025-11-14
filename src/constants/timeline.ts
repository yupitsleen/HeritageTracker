/**
 * Timeline component configuration constants
 */

/**
 * Timeline dimensions
 */
export const TIMELINE_CONFIG = {
  /** Left/right margin for timeline (space for handles) */
  MARGIN: 50,
  /** SVG height for timeline visualization */
  HEIGHT: 40,
  /** Minimum height for timeline container */
  MIN_HEIGHT: "40px",
} as const;

/**
 * Tooltip positioning
 */
export const TOOLTIP_CONFIG = {
  /** Vertical offset from timeline (in pixels) - 40px to balance clearance from timeline and footer */
  VERTICAL_OFFSET: 40,
  /** Horizontal transform percentage */
  HORIZONTAL_TRANSFORM: "-50%",
} as const;

/**
 * Custom marker icon configuration for SiteDetailView
 */
export const SITE_MARKER_CONFIG = {
  /** Icon size [width, height] */
  ICON_SIZE: [20, 20] as [number, number],
  /** Icon anchor point [x, y] */
  ICON_ANCHOR: [10, 10] as [number, number],
} as const;
