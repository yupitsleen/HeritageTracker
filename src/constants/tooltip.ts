/**
 * Tooltip Configuration Constants
 *
 * Centralized configuration for tooltip positioning and styling.
 */

/**
 * Tooltip positioning thresholds
 */
export const TOOLTIP_POSITIONING = {
  /** Minimum distance from top edge before flipping tooltip below (px) */
  TOP_MARGIN_THRESHOLD: 16,
  /** Minimum padding from left/right viewport edges (px) */
  EDGE_PADDING: 8,
} as const;

/**
 * Tooltip styling constants
 */
export const TOOLTIP_STYLING = {
  /** Z-index for tooltip overlay */
  Z_INDEX: 10000,
  /** Maximum width of tooltip box (px) */
  MAX_WIDTH: 320,
  /** Minimum viewport margin (rem) */
  MIN_VIEWPORT_MARGIN: 2,
} as const;

/**
 * Info icon color configuration
 */
export const INFO_ICON_COLORS = {
  /** Default color (text-gray-400) */
  DEFAULT: 'text-gray-400',
  /** Hover color (text-gray-500) */
  HOVER: 'hover:text-gray-500',
} as const;
