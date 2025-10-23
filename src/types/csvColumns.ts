/**
 * CSV Column Configuration Types
 *
 * Defines extensible column system for CSV exports.
 */

import type { GazaSite } from "./index";

/**
 * CSV column identifier
 */
export type CSVColumnId =
  | "name"
  | "nameArabic"
  | "type"
  | "status"
  | "yearBuilt"
  | "yearBuiltIslamic"
  | "dateDestroyed"
  | "dateDestroyedIslamic"
  | "description"
  | "coordinates"
  | "verifiedBy"
  | "historicalSignificance"
  | "culturalValue";

/**
 * CSV column configuration
 */
export interface CSVColumnConfig {
  /** Unique column identifier */
  id: CSVColumnId;

  /** Column header label (English) */
  label: string;

  /** Column header label (Arabic) */
  labelArabic?: string;

  /** Extract value from site */
  getValue: (site: GazaSite) => string | undefined | null;

  /** Whether column is included by default */
  defaultIncluded: boolean;

  /** Column description */
  description?: string;

  /** Display order (lower numbers appear first) */
  order: number;

  /** Whether column is required (cannot be disabled) */
  required?: boolean;
}

/**
 * CSV export options with column selection
 */
export interface CSVExportOptions {
  /** Columns to include (defaults to all defaultIncluded columns) */
  columns?: CSVColumnId[];

  /** Include column headers */
  includeHeaders?: boolean;
}
