/**
 * Layout and UI component configuration constants
 */

/**
 * Responsive breakpoint thresholds (in pixels)
 *
 * Used for determining mobile/tablet/desktop layouts.
 * Matches Tailwind's default breakpoints (md: 768px, lg: 1024px).
 *
 * @example
 * ```typescript
 * const isMobile = window.innerWidth < BREAKPOINTS.MOBILE;
 * const isTablet = window.innerWidth >= BREAKPOINTS.MOBILE && window.innerWidth < BREAKPOINTS.TABLET;
 * const isDesktop = window.innerWidth >= BREAKPOINTS.TABLET;
 * ```
 */
export const BREAKPOINTS = {
  /** Mobile breakpoint: width < 768px (matches Tailwind 'md') */
  MOBILE: 768,
  /** Tablet breakpoint: 768px ≤ width < 1024px (matches Tailwind 'lg') */
  TABLET: 1024,
  /** Desktop breakpoint: width ≥ 1024px */
  DESKTOP: 1024,
} as const;

/**
 * Z-index layers for consistent stacking order
 *
 * Higher values appear above lower values.
 * Use these constants instead of arbitrary z-index values.
 *
 * @example
 * ```typescript
 * <div style={{ zIndex: Z_INDEX.MODAL }}>Modal content</div>
 * <div style={{ zIndex: Z_INDEX.DROPDOWN }}>Dropdown menu</div>
 * ```
 */
export const Z_INDEX = {
  /** Base layer (z-index: 0) */
  BASE: 0,
  /** Content layer (z-index: 1) */
  CONTENT: 1,
  /** Sticky elements like headers (z-index: 100) */
  STICKY: 100,
  /** Dropdown menus and popovers (z-index: 1000) */
  DROPDOWN: 1000,
  /** Tooltips (z-index: 1010) */
  TOOLTIP: 1010,
  /** Fixed elements like sidebars (z-index: 1020) */
  FIXED: 1020,
  /** Modal overlays and dialogs (z-index: 9999) */
  MODAL: 9999,
  /** Critical notifications (z-index: 10000) */
  NOTIFICATION: 10000,
  /** Dropdowns inside modals (z-index: 10002) - Must be above modal backdrop */
  MODAL_DROPDOWN: 10002,
} as const;

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
