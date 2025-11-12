/**
 * Opacity constants for consistent visual design across the application
 *
 * These values are used for backgrounds, overlays, and interactive elements.
 * Centralized here for easy maintenance and global adjustments.
 *
 * @example
 * ```tsx
 * // Using with Tailwind utility classes
 * <div className={`bg-black/${OPACITY.OVERLAY}`}>...</div>
 *
 * // Using with inline styles
 * <div style={{ opacity: OPACITY.LINK_HOVER / 100 }}>...</div>
 * ```
 */

/**
 * Core opacity values (0-100)
 * Values represent percentages for Tailwind opacity utilities
 */
export const OPACITY = {
  /**
   * Semi-transparent overlays (e.g., FilterBar, Table headers, modals)
   * Used for: bg-[#000000]/95, bg-white/95
   */
  OVERLAY: 95,

  /**
   * Map background with slight transparency
   * Used for: bg-white/90
   */
  MAP_BACKGROUND: 90,

  /**
   * Link hover states and decorative elements
   * Used for: hover:text-[#fefefe]/80
   */
  LINK_HOVER: 80,

  /**
   * Site image labels and text overlays
   * Used for: bg-black/70, opacity-70
   */
  TEXT_OVERLAY: 70,

  /**
   * Hover states on table rows and cards
   * Used for: bg-gray-700/50, bg-gray-800/50, bg-gray-900/50, ring-white/50
   */
  HOVER_STATE: 50,

  /**
   * Disabled or muted elements
   * Used for: opacity-0 (invisible), or as fallback for disabled states
   */
  DISABLED: 0,
} as const;

/**
 * Type-safe opacity values
 * Ensures only valid opacity constants are used
 */
export type OpacityValue = typeof OPACITY[keyof typeof OPACITY];

/**
 * Helper function to convert opacity percentage to decimal (for inline styles)
 *
 * @param opacity - Opacity value from OPACITY constants (0-100)
 * @returns Decimal value (0.0-1.0)
 *
 * @example
 * ```tsx
 * const alpha = opacityToDecimal(OPACITY.OVERLAY); // 0.95
 * <div style={{ backgroundColor: `rgba(0, 0, 0, ${alpha})` }}>...</div>
 * ```
 */
export function opacityToDecimal(opacity: OpacityValue): number {
  return opacity / 100;
}

/**
 * Helper function to generate Tailwind opacity class names
 *
 * @param baseClass - Base Tailwind class (e.g., "bg-black", "text-white")
 * @param opacity - Opacity value from OPACITY constants
 * @returns Tailwind class string with opacity
 *
 * @example
 * ```tsx
 * withOpacity("bg-black", OPACITY.OVERLAY); // "bg-black/95"
 * withOpacity("text-white", OPACITY.TEXT_OVERLAY); // "text-white/70"
 * ```
 */
export function withOpacity(baseClass: string, opacity: OpacityValue): string {
  return `${baseClass}/${opacity}`;
}
