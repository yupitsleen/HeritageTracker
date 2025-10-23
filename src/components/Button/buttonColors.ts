/**
 * Color constants for Button components
 *
 * Palestinian flag theme colors and component-specific variants
 */

/** Palestinian flag primary colors */
export const PALESTINIAN_FLAG = {
  /** Vibrant green - hover states */
  GREEN: '#009639',
  /** Vibrant red - danger/alert states */
  RED: '#ed3039',
  /** Black - backgrounds and borders */
  BLACK: '#000000',
  /** White - text on dark backgrounds */
  WHITE: '#fefefe',
} as const;

/** Muted/subdued colors for active/toggle states (dark mode) */
export const SUBDUED_COLORS = {
  /** Muted green for active toggle background (dark mode) */
  GREEN_DARK: '#2d5a38',
  /** Slightly brighter green for hover on active state (dark mode) */
  GREEN_DARK_HOVER: '#3a6b48',
  /** Muted green for active toggle background (light mode) */
  GREEN_LIGHT: '#4a7c59',
  /** Slightly brighter green for hover on active state (light mode) */
  GREEN_LIGHT_HOVER: '#5a8c69',
} as const;
