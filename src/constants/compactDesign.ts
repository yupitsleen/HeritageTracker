/**
 * Compact Design System Constants
 * Enterprise data-dense UI spacing and typography
 *
 * Philosophy: Maximize information density for desktop-first utility
 * Target: Internal inventory/dashboard application aesthetic
 */

export const COMPACT_SPACING = {
  /** Component padding - very tight (4px) */
  xs: "p-1",
  /** Component padding - tight (8px) */
  sm: "p-2",
  /** Component padding - compact (12px) */
  md: "p-3",
  /** Component padding - standard (16px) */
  lg: "p-4",

  /** Component gaps - minimal (4px) */
  gapXs: "gap-1",
  /** Component gaps - tight (8px) */
  gapSm: "gap-2",
  /** Component gaps - compact (12px) */
  gapMd: "gap-3",
  /** Component gaps - standard (16px) */
  gapLg: "gap-4",
} as const;

export const COMPACT_TYPOGRAPHY = {
  /** Extra small text - 10px (data tables, labels) */
  xs: "text-[10px]",
  /** Small text - 12px (body text, descriptions) */
  sm: "text-xs",
  /** Base text - 14px (headings, important text) */
  base: "text-sm",
  /** Large text - 16px (section headings) */
  lg: "text-base",
  /** Extra large text - 20px (page titles) */
  xl: "text-xl",
} as const;

export const COMPACT_BUTTON = {
  /** Extra small button - minimal padding */
  xs: "px-2 py-0.5 text-xs",
  /** Small button - compact padding */
  sm: "px-3 py-1 text-xs",
  /** Medium button - standard padding */
  md: "px-4 py-1.5 text-sm",
} as const;

export const COMPACT_TABLE = {
  /** Cell padding - horizontal */
  cellX: "px-2",
  /** Cell padding - vertical */
  cellY: "py-1.5",
  /** Header padding - horizontal */
  headerX: "px-2",
  /** Header padding - vertical */
  headerY: "py-2",
  /** Text size */
  text: "text-xs",
  /** Header text size */
  headerText: "text-xs font-semibold",
} as const;

export const COMPACT_HEADER = {
  /** Header padding - vertical */
  py: "py-2",
  /** Title text size */
  title: "text-lg md:text-xl",
  /** Subtitle text size */
  subtitle: "text-[10px] md:text-xs",
  /** Button gap */
  buttonGap: "gap-2",
} as const;

export const COMPACT_FILTER_BAR = {
  /** Container padding */
  padding: "p-2",
  /** Input height */
  inputHeight: "h-7",
  /** Input text size */
  inputText: "text-xs",
  /** Input padding */
  inputPadding: "px-2 py-1",
  /** Button padding */
  buttonPadding: "px-2 py-1",
  /** Gap between elements */
  gap: "gap-2",
} as const;

export const COMPACT_MODAL = {
  /** Modal padding */
  padding: "p-4",
  /** Modal header padding */
  headerPadding: "p-3",
  /** Modal content padding */
  contentPadding: "p-3",
  /** Modal gap */
  gap: "gap-3",
} as const;
