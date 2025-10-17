/**
 * Layout and UI component configuration constants
 */

/**
 * Table configuration
 */
export const TABLE_CONFIG = {
  /** Width of the Type column (icon display) in pixels */
  TYPE_COLUMN_WIDTH: 60,

  /** Default initial width for resizable table */
  DEFAULT_TABLE_WIDTH: 480,

  /** Minimum width for resizable table */
  MIN_TABLE_WIDTH: 480,

  /** Maximum width for resizable table */
  MAX_TABLE_WIDTH: 1100,

  /** Width breakpoints for progressive column display */
  COLUMN_BREAKPOINTS: {
    dateDestroyedIslamic: 650,
    yearBuilt: 800,
    yearBuiltIslamic: 950,
  },
} as const;

/**
 * Timeline configuration
 */
export const TIMELINE_CONFIG = {
  /** Fixed height of timeline scrubber in pixels */
  HEIGHT: 200,
} as const;

/**
 * Layout dimensions
 */
export const LAYOUT = {
  /** Header height in pixels */
  HEADER_HEIGHT: 80,

  /** Footer height in pixels */
  FOOTER_HEIGHT: 60,

  /** Total fixed height (header + footer) for viewport calculations */
  FIXED_HEIGHT: 140,
} as const;
