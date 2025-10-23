/**
 * Filter Configuration Types
 *
 * Defines extensible filter system for site filtering.
 * Supports multiple filter types (text search, multi-select, date range).
 */

import type { GazaSite } from "./index";

/**
 * Unique identifier for filter
 */
export type FilterId = "search" | "type" | "status" | "dateRange" | "yearBuilt";

/**
 * Filter input type
 */
export type FilterType = "text" | "multi-select" | "date-range" | "year-range";

/**
 * Filter configuration
 */
export interface FilterConfig {
  /** Unique filter identifier */
  id: FilterId;

  /** Filter type (determines UI component) */
  type: FilterType;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Placeholder text for input */
  placeholder?: string;

  /** Placeholder text (Arabic) */
  placeholderArabic?: string;

  /** Filter function that determines if site matches */
  filterFn: (site: GazaSite, value: FilterValue) => boolean;

  /** Default value for filter */
  defaultValue: FilterValue;

  /** Display order in UI */
  order: number;

  /** Whether filter is enabled by default */
  enabled?: boolean;

  /** Options for multi-select filters */
  options?: FilterOption[];

  /** Description for documentation/tooltips */
  description?: string;
}

/**
 * Filter value types
 */
export type FilterValue =
  | string // text search
  | string[] // multi-select
  | { start: string; end: string } // date range
  | { min: number | null; max: number | null }; // year range

/**
 * Option for multi-select filters
 */
export interface FilterOption {
  /** Option value */
  value: string;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Icon or emoji for visual representation */
  icon?: string;
}

/**
 * Active filter state
 */
export interface ActiveFilter {
  /** Filter ID */
  id: FilterId;

  /** Current filter value */
  value: FilterValue;
}

/**
 * Filter state for all filters
 */
export type FilterState = Record<FilterId, FilterValue>;
